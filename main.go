package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"embed"
	"encoding/base32"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"hash"
	"io/fs"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second    // Time allowed to write a message to the peer.
	pongWait       = 60 * time.Second    // Time allowed to read the next pong message from the peer.
	pingInterval   = (pongWait * 9) / 10 // Send pings to peer with this period. Must be less than pongWait.
	maxMessageSize = 512                 // Maximum message size allowed from peer.
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type TotpAlgo int

const (
	TotpNotSpecified TotpAlgo = 0
	TotpSha1         TotpAlgo = 1
	TotpSha256       TotpAlgo = 2
	TotpSha512       TotpAlgo = 3
)

// Time-based One-Time Password from RFC - https://datatracker.ietf.org/doc/html/rfc6238
type TOTP struct {
	Secret    string   // Secret key (required)
	Digits    int      // OTP digit count (default: 6)
	Algorithm TotpAlgo // OTP Algorithm ("SHA1" or "SHA256" or "SHA512") (default: SHA1)
	Period    int64    // Period for which OTP is valid (seconds) (default: 30)
	UnixTime  int64    // (Optional) Unix Timestamp (default: Current unix timestamp)
}

// Generate TOTP code and returns OTP as string and any error encountered.
func (t *TOTP) Generate() (string, error) {
	T0 := int64(0)
	currentUnixTime := int64(0)

	if len(t.Secret) == 0 {
		return "", fmt.Errorf("no secret key provided")
	}

	if t.Digits == 0 {
		t.Digits = 6
	}

	if t.Algorithm == TotpNotSpecified {
		t.Algorithm = TotpSha256
	}

	if t.Period == 0 {
		t.Period = 30
	}

	if t.UnixTime != 0 {
		currentUnixTime = t.UnixTime
	} else {
		currentUnixTime = time.Now().Unix() - T0
	}

	currentUnixTime /= t.Period

	return generateOTP(t.Secret, currentUnixTime, t.Digits, t.Algorithm)
}

// function for generating TOTP codes
func generateOTP(base32Key string, counter int64, digits int, algo TotpAlgo) (string, error) {
	var initialHMAC hash.Hash
	bytesCounter := make([]byte, 8)
	binary.BigEndian.PutUint64(bytesCounter, uint64(counter)) // convert counter to byte array

	secretKey, err := base32.StdEncoding.DecodeString(base32Key) // decode base32 secret to byte array
	if err != nil {
		return "", fmt.Errorf("bad secret key : %q", base32Key)
	}

	switch algo {
	case TotpSha1:
		initialHMAC = hmac.New(sha1.New, secretKey)
	case TotpSha256:
		initialHMAC = hmac.New(sha256.New, secretKey)
	case TotpSha512:
		initialHMAC = hmac.New(sha512.New, secretKey)
	default:
		return "", fmt.Errorf("invalid algorithm - provide one of SHA1/SHA256/SHA512")
	}

	_, err = initialHMAC.Write(bytesCounter)
	if err != nil {
		return "", fmt.Errorf("unable to compute HMAC")
	}

	hashHMAC := initialHMAC.Sum(nil)
	offset := hashHMAC[len(hashHMAC)-1] & 0xF
	hashHMAC = hashHMAC[offset : offset+4]

	hashHMAC[0] = hashHMAC[0] & 0x7F
	decimal := binary.BigEndian.Uint32(hashHMAC)
	otp := decimal % uint32(math.Pow10(digits))

	result := strconv.Itoa(int(otp))
	for len(result) != digits {
		result = "0" + result
	}

	return result, nil
}

// maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	clients      map[*Client]struct{} // Registered clients
	broadcast    chan *ValidWSMessage // Inbound messages from the clients
	register     chan *Client         // Register requests from the clients
	unregister   chan *Client         // Unregister requests from clients
	mrSpeaker    *Client
	nextClientID int
}

type Client struct {
	hub         *Hub
	conn        *websocket.Conn      // websocket connection
	send        chan *ValidWSMessage // buffered channel of outbound messages
	clientNo    int
	isMrSpeaker bool
}

type MessageType int

const (
	HideControls        MessageType = 1
	ShowControls        MessageType = 2
	Slided              MessageType = 3
	Paused              MessageType = 4
	Resumed             MessageType = 5
	StatusRequest       MessageType = 6
	StatusReply         MessageType = 7
	OverviewShown       MessageType = 8
	OverviewHidden      MessageType = 9
	Connected           MessageType = 10
	FragmentShown       MessageType = 11
	ClientStats         MessageType = 12
	DisplayNotification MessageType = 13
)

func (t MessageType) String() string {
	switch t {
	case HideControls:
		return "HideControls"
	case ShowControls:
		return "ShowControls"
	case Slided:
		return "Slided"
	case Paused:
		return "Paused"
	case Resumed:
		return "Resumed"
	case StatusRequest:
		return "StatusRequest"
	case StatusReply:
		return "StatusReply"
	case OverviewShown:
		return "OverviewShown"
	case OverviewHidden:
		return "OverviewHidden"
	case Connected:
		return "Connected"
	case FragmentShown:
		return "FragmentShown"
	case ClientStats:
		return "ClientStats"
	case DisplayNotification:
		return "DisplayNotification"
	default:
		return "UNKNOWN"
	}
}

type Status int

const (
	StatusUnknown       Status = -1
	StatusFocusedIn     Status = 1
	StatusFocusedOut    Status = 2
	StatusDisconnected  Status = 3
	StatusConnected     Status = 4
	StatusSelfConnected Status = 5
)

type ValidWSMessage struct {
	Raw           []byte      `json:"-"`
	Command       MessageType `json:"com"`
	ClientNumber  int         `json:"c"`
	ClientNumbers []int       `json:"cn,omitempty"`
	Status        Status      `json:"s,omitempty"`
	Message       string      `json:"m,omitempty"`
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan *ValidWSMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]struct{}),
	}
}

func (h *Hub) run() {
	missing := ValidWSMessage{
		Command: StatusReply,
		Status:  StatusUnknown,
	}
	missing.Raw, _ = json.Marshal(&missing)

	for {
		select {
		case client := <-h.register:
			if client.isMrSpeaker {
				log.Println("Hello Mr Speaker!", client.clientNo)
				h.mrSpeaker = client
			}
			h.clients[client] = struct{}{}

		case client := <-h.unregister:
			if client.isMrSpeaker {
				log.Println("Goodbye Mr Speaker!", client.clientNo)
				h.mrSpeaker = nil
			}
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}

		case message := <-h.broadcast:
			switch message.Command {
			case StatusRequest:
				if h.mrSpeaker != nil {
					log.Printf("Mr Speaker should receive message typed %s from client %d : %s", message.Command, message.ClientNumber, message.Raw)
					h.mrSpeaker.send <- message // Mr speaker honours status requests
				} else {
					log.Printf("Mr Speaker IS MISSING but message typed %s from client %d : %s", message.Command, message.ClientNumber, message.Raw)
					// Mr Speaker is missing
					for client := range h.clients {
						if message.ClientNumber != client.clientNo {
							continue
						}

						client.send <- &missing
						log.Printf("Mr Speaker is missing for %d\n", message.ClientNumber)
						break
					}
				}

			case ClientStats: // these messages go only to Mr Speaker
				if h.mrSpeaker != nil {
					log.Printf("Mr Speaker should receive message typed %s from client %d : %s", message.Command, message.ClientNumber, message.Raw)
					h.mrSpeaker.send <- message // only Mr Speaker receives these kind of messages
				}

			default: // all other message types
				for client := range h.clients {
					if client.isMrSpeaker { // we avoid sending back the same message to Mr Speaker
						continue
					}

					log.Printf("message type %s to client %d : %s", message.Command, client.clientNo, message.Raw)

					select {
					case client.send <- message:
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}
			}
		}
	}
}
func (c *Client) read() {
	defer func() {
		if !c.isMrSpeaker && c.hub.mrSpeaker != nil {
			d := ValidWSMessage{ClientNumber: c.clientNo, Command: ClientStats, Status: StatusDisconnected}
			d.Raw, _ = json.Marshal(&d)
			c.hub.mrSpeaker.send <- &d
			log.Printf("client #%d disconnected : Mr Speaker notified\n", c.clientNo)
		}

		c.hub.unregister <- c
		_ = c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
	if err != nil {
		return
	}

	c.conn.SetPongHandler(func(string) error {
		err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
		if err != nil {
			return err
		}
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		var decodedMessage ValidWSMessage

		err = json.Unmarshal(message, &decodedMessage)
		if err != nil {
			log.Printf("json error: %v", err)
			return
		}
		decodedMessage.Raw = message
		c.hub.broadcast <- &decodedMessage
	}
}

func (c *Client) write() {
	ticker := time.NewTicker(pingInterval)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				return
			}

			if !ok { // hub closed the channel
				err := c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				if err != nil {
					return
				}
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			_, err = w.Write(message.Raw)
			if err != nil {
				return
			}

			// queued messages to the current websocket message
			n := len(c.send)
			for i := 0; i < n; i++ {
				_, err = w.Write(newline)
				if err != nil {
					return
				}

				m := <-c.send

				_, err = w.Write(m.Raw)
				if err != nil {
					return
				}
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				return
			}
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWebsocket handles websocket requests from the peer.
func serveWebsocket(hub *Hub, totpSecret string, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	hub.nextClientID++

	client := Client{
		hub:      hub,
		conn:     conn,
		send:     make(chan *ValidWSMessage, 15),
		clientNo: hub.nextClientID,
	}

	if len(r.URL.RawQuery) > 0 {
		providedTOTP := strings.ReplaceAll(r.URL.RawQuery, "totp=", "")
		if providedTOTP == totpSecret {
			if hub.mrSpeaker != nil {
				log.Println("Mr Speaker ALREADY in the house!")
				_ = conn.WriteMessage(websocket.CloseMessage, []byte("Mr Speaker is already in..."))
				return
			}
			client.isMrSpeaker = true
		} else {
			log.Printf("raw query : %q does NOT match our TOTP secret %q", r.URL.RawQuery, totpSecret)
		}
	}

	client.hub.register <- &client

	go client.write()
	go client.read()

	c := ValidWSMessage{ClientNumber: client.clientNo, Command: Connected, Status: StatusSelfConnected}
	if client.isMrSpeaker {
		log.Println("telling Mr Speaker that we're glad of his presence")
		c.ClientNumbers = make([]int, 0)
		for cl := range hub.clients {
			c.ClientNumbers = append(c.ClientNumbers, cl.clientNo)
		}
	}
	err = conn.WriteJSON(&c)
	if err != nil {
		e, _ := json.MarshalIndent(err, "", "\t")
		log.Printf("error writing json on connect : %s", e)
	}

	if !client.isMrSpeaker {
		// notify new connections to Mr Speaker
		if hub.mrSpeaker != nil {
			c.Command = ClientStats
			c.Status = StatusConnected
			c.Raw, _ = json.Marshal(&c)
			hub.mrSpeaker.send <- &c
			log.Printf("client #%d connected : Mr Speaker notified\n", client.clientNo)
		}
	}
}

func main() {
	useOS := len(os.Args) > 1 && os.Args[1] == "live"

	defaultTotpSecret := "awesomesecret"
	if len(os.Args) >= 3 {
		defaultTotpSecret = os.Args[3]
	}

	log.Printf("TOTP secret : %q", defaultTotpSecret)

	totp := TOTP{
		Secret:    base32.StdEncoding.EncodeToString([]byte(defaultTotpSecret)),
		Digits:    8,
		Algorithm: TotpSha256,
	}

	key, err := totp.Generate()
	if err != nil {
		log.Fatalf("error occurred while generating presenter TOTP : %#v", err)
	}

	log.Printf("presenter TOTP : %s", key)

	http.Handle("/", http.FileServer(getFileSystem(useOS)))
	http.HandleFunc("/code", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(fmt.Sprintf("{%q:%q}", "code", key)))
	})
	hub := newHub()
	go hub.run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWebsocket(hub, key, w, r)
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("error occurred while listening on 8080 : %#v", err)
	}
}

//go:embed static
var embeddedFiles embed.FS

func getFileSystem(useOS bool) http.FileSystem {
	if useOS {
		return http.FS(os.DirFS("static"))
	}

	fsys, err := fs.Sub(embeddedFiles, "static")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}
