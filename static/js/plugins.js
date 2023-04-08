import {Deck} from './deck.js';

class Plugins {

    constructor(deck) {
        if (!(deck instanceof Deck)) {
            throw new Error("expecting instance of Deck");
        }
        this.deck = deck;
        // Flags our current state (idle -> loading -> loaded)
        this.state = 'idle';
        // An id:instance map of currently registered plugins
        this.registeredPlugins = {};
        this.asyncDependencies = [];

        this.registerPlugin = this.registerPlugin.bind(this);
        this.hasPlugin = this.hasPlugin.bind(this);
        this.getPlugin = this.getPlugin.bind(this);
        this.getRegisteredPlugins = this.getRegisteredPlugins.bind(this);
        this.initPlugins = this.initPlugins.bind(this);
        this.loadAsync = this.loadAsync.bind(this);
    }

    loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.defer = false;
        script.src = url;

        if (typeof callback === 'function') {
            // Success callback
            script.onload = script.onreadystatechange = event => {
                if (event.type === 'load' || /loaded|complete/.test(script.readyState)) {
                    // Kill event listeners
                    script.onload = script.onreadystatechange = script.onerror = null;
                    callback();
                }
            };

            // Error callback
            script.onerror = err => {
                // Kill event listeners
                script.onload = script.onreadystatechange = script.onerror = null;
                callback(new Error('Failed loading script: ' + script.src + '\n' + err));
            };
        }
        // Append the script at the end of <head>
        const head = document.querySelector('head');
        head.insertBefore(script, head.lastChild);
    }

    load(plugins, dependencies) {
        this.state = 'loading';
        plugins.forEach(this.registerPlugin);
        const initPlugins = this.initPlugins;
        const promise = new Promise(function (resolve) {
            let scripts = [],
                scriptsToLoad = 0;

            dependencies.forEach(function (dep) {
                // Load if there's no condition or the condition is truthy
                if (!dep.condition || dep.condition()) {
                    if (dep.async) {
                        this.asyncDependencies.push(dep);
                    } else {
                        scripts.push(dep);
                    }
                }
            }, this);

            if (scripts.length) {
                scriptsToLoad = scripts.length;
                const scriptLoadedCallback = (s) => {
                    if (s && typeof s.callback === 'function') s.callback();
                    if (--scriptsToLoad === 0) {
                        initPlugins().then(resolve);
                    }
                };

                // Load synchronous scripts
                scripts.forEach(function (script) {
                    if (typeof script.id === 'string') {
                        this.registerPlugin(script);
                        scriptLoadedCallback(script);
                    } else if (typeof script.src === 'string') {
                        this.loadScript(script.src, () => scriptLoadedCallback(script));
                    } else {
                        console.warn('Unrecognized plugin format', script);
                        scriptLoadedCallback();
                    }
                }, this);
            } else {
                initPlugins().then(resolve);
            }
        });
        return promise;
    }

    initPlugins() {
        let pluginValues = Object.values(this.registeredPlugins);
        const loadAsync = this.loadAsync;
        const deck = this.deck;
        const promise = new Promise(function (resolve) {
            let pluginsToInitialize = pluginValues.length;
            // If there are no plugins, skip this step
            if (pluginsToInitialize === 0) {
                loadAsync().then(resolve);
            }
            // ... otherwise initialize plugins
            else {
                let initNextPlugin;
                let afterPlugInitialized = function () {
                    if (--pluginsToInitialize === 0) {
                        loadAsync().then(resolve);
                    } else {
                        initNextPlugin();
                    }
                };

                let i = 0;
                // Initialize plugins serially
                initNextPlugin = function () {
                    let plugin = pluginValues[i++];
                    // If the plugin has an 'init' method, invoke it
                    if (typeof plugin.init === 'function') {
                        let promise = plugin.init(deck);
                        // If the plugin returned a Promise, wait for it
                        if (promise && typeof promise.then === 'function') {
                            promise.then(afterPlugInitialized);
                        } else {
                            afterPlugInitialized();
                        }
                    } else {
                        afterPlugInitialized();
                    }
                }
                initNextPlugin();
            }
        })
        return promise;
    }

    loadAsync() {
        this.state = 'loaded';
        if (this.asyncDependencies.length) {
            this.asyncDependencies.forEach(function (asyncDep) {
                this.loadScript(asyncDep.src, asyncDep.callback);
            }, this);
        }
        return Promise.resolve();
    }

    registerPlugin(plugin) {
        // Backwards compatibility to make  ~3.9.0
        // plugins work with  4.0.0
        if (arguments.length === 2 && typeof arguments[0] === 'string') {
            plugin = arguments[1];
            plugin.id = arguments[0];
        }
            // Plugin can optionally be a function which we call
        // to create an instance of the plugin
        else if (typeof plugin === 'function') {
            plugin = plugin();
        }

        let id = plugin.id;

        if (typeof id !== 'string') {
            console.warn('Unrecognized plugin format; can\'t find plugin.id', plugin);
        } else if (this.registeredPlugins[id] === undefined) {
            this.registeredPlugins[id] = plugin;

            // If a plugin is registered after  is loaded,
            // initialize it right away
            if (this.state === 'loaded' && typeof plugin.init === 'function') {
                plugin.init(this.deck);
            }
        } else {
            console.warn(': "' + id + '" plugin has already been registered');
        }
    }

    hasPlugin(id) {
        return !!this.registeredPlugins[id];
    }

    getPlugin(id) {
        return this.registeredPlugins[id];
    }

    getRegisteredPlugins() {
        return this.registeredPlugins;
    }
}

export {Plugins}
