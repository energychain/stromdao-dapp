(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.durruti = factory());
}(this, (function () { 'use strict';

  /* Durruti
   * Utils.
   */

  function hasWindow() {
    return typeof window !== 'undefined';
  }

  var isClient = hasWindow();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // one-level object extend


  var DURRUTI_DEBUG = true;

  function warn() {
    if (DURRUTI_DEBUG === true) {
      console.warn.apply(console, arguments);
    }
  }

  /* Durruti
   * Capture and remove event listeners.
   */

  var _removeListeners = function removeListeners() {};

  // capture all listeners
  var events = [];
  var domEventTypes = [];

  function getDomEventTypes() {
    var eventTypes = [];
    for (var attr in document) {
      // starts with on
      if (attr.substr(0, 2) === 'on') {
        eventTypes.push(attr);
      }
    }

    return eventTypes;
  }

  var originalAddEventListener;

  function captureAddEventListener(type, fn, capture) {
    originalAddEventListener.apply(this, arguments);

    events.push({
      target: this,
      type: type,
      fn: fn,
      capture: capture
    });
  }

  function removeNodeEvents($node) {
    var i = 0;

    while (i < events.length) {
      if (events[i].target === $node) {
        // remove listener
        $node.removeEventListener(events[i].type, events[i].fn, events[i].capture);

        // remove event
        events.splice(i, 1);
        i--;
      }

      i++;
    }

    // remove on* listeners
    domEventTypes.forEach(function (eventType) {
      $node[eventType] = null;
    });
  }

  if (isClient) {
    domEventTypes = getDomEventTypes();

    // capture addEventListener

    // IE
    if (window.Node.prototype.hasOwnProperty('addEventListener')) {
      originalAddEventListener = window.Node.prototype.addEventListener;
      window.Node.prototype.addEventListener = captureAddEventListener;
    } else if (window.EventTarget.prototype.hasOwnProperty('addEventListener')) {
      // standard
      originalAddEventListener = window.EventTarget.prototype.addEventListener;
      window.EventTarget.prototype.addEventListener = captureAddEventListener;
    }

    // traverse and remove all events listeners from nodes
    _removeListeners = function removeListeners($node, traverse) {
      removeNodeEvents($node);

      // traverse element children
      if (traverse && $node.children) {
        for (var i = 0; i < $node.children.length; i++) {
          _removeListeners($node.children[i], true);
        }
      }
    };
  }

  var removeListeners$1 = _removeListeners;

  /* Durruti
   * DOM patch - morphs a DOM node into another.
   */

  function traverse($node, $newNode, patches) {
    // traverse
    for (var i = 0; i < $node.childNodes.length; i++) {
      diff($node.childNodes[i], $newNode.childNodes[i], patches);
    }
  }

  function mapAttributes($node, $newNode) {
    var attrs = {};

    for (var i = 0; i < $node.attributes.length; i++) {
      attrs[$node.attributes[i].name] = null;
    }

    for (var _i = 0; _i < $newNode.attributes.length; _i++) {
      attrs[$newNode.attributes[_i].name] = $newNode.attributes[_i].value;
    }

    return attrs;
  }

  function patchAttrs($node, $newNode) {
    // map attributes
    var attrs = mapAttributes($node, $newNode);

    // add-change attributes
    for (var prop in attrs) {
      if (!attrs[prop]) {
        $node.removeAttribute(prop);

        // checked needs extra work
        if (prop === 'checked') {
          $node.checked = false;
        }
      } else {
        $node.setAttribute(prop, attrs[prop]);
      }
    }
  }

  function diff($node, $newNode) {
    var patches = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var patch = {
      node: $node,
      newNode: $newNode
    };

    // push traversed node to patch list
    patches.push(patch);

    // faster than outerhtml
    if ($node.isEqualNode($newNode)) {
      // remove listeners on node and children
      removeListeners$1($node, true);

      return patches;
    }

    // if one of them is not an element node,
    // or the tag changed,
    // or not the same number of children.
    if ($node.nodeType !== 1 || $newNode.nodeType !== 1 || $node.tagName !== $newNode.tagName || $node.childNodes.length !== $newNode.childNodes.length) {
      patch.replace = true;
    } else {
      patch.update = true;

      // remove listeners on node
      removeListeners$1($node);

      // traverse childNodes
      traverse($node, $newNode, patches);
    }

    return patches;
  }

  function applyPatch(patch) {
    if (patch.replace) {
      patch.node.parentNode.replaceChild(patch.newNode, patch.node);
    } else if (patch.update) {
      patchAttrs(patch.node, patch.newNode);
    }
  }

  function patch(patches) {
    patches.forEach(applyPatch);

    return patches;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

















  var set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  /* Durruti
   * Micro Isomorphic JavaScript library for building user interfaces.
   */

  var durrutiAttr = 'data-durruti-id';
  var durrutiElemSelector = '[' + durrutiAttr + ']';
  var componentCache = [];
  var componentIndex = 0;

  // decorate a basic class with durruti specific properties
  function decorate(Comp) {
    var component;

    // instantiate classes
    if (typeof Comp === 'function') {
      component = new Comp();
    } else {
      // make sure we don't change the id on a cached component
      component = Object.create(Comp);
    }

    // components get a new id on render,
    // so we can clear the previous component cache.
    component._durrutiId = String(componentIndex++);

    // cache component
    componentCache.push({
      id: component._durrutiId,
      component: component
    });

    return component;
  }

  function getCachedComponent($node) {
    // get the component from the dom node - rendered in browser.
    if ($node._durruti) {
      return $node._durruti;
    }

    // or get it from the component cache - rendered on the server.
    var id = $node.getAttribute(durrutiAttr);
    for (var i = 0; i < componentCache.length; i++) {
      if (componentCache[i].id === id) {
        return componentCache[i].component;
      }
    }
  }

  // remove custom data attributes,
  // and cache the component on the DOM node.
  function cleanAttrNodes($container, includeParent) {
    var nodes = [].slice.call($container.querySelectorAll(durrutiElemSelector));

    if (includeParent) {
      nodes.push($container);
    }

    nodes.forEach(function ($node) {
      // cache component in node
      $node._durruti = getCachedComponent($node);

      // clean-up data attributes
      $node.removeAttribute(durrutiAttr);
    });

    return nodes;
  }

  function unmountNode($node) {
    var cachedComponent = getCachedComponent($node);

    if (cachedComponent.unmount) {
      cachedComponent.unmount($node);
    }

    // clear the component from the cache
    clearComponentCache(cachedComponent);
  }

  function mountNode($node) {
    var cachedComponent = getCachedComponent($node);

    if (cachedComponent.mount) {
      cachedComponent.mount($node);
    }
  }

  function clearComponentCache(component) {
    if (component) {
      for (var i = 0; i < componentCache.length; i++) {
        if (componentCache[i].id === component._durrutiId) {
          componentCache.splice(i, 1);
          return;
        }
      }
    } else {
      // clear the entire component cache
      componentIndex = 0;
      componentCache.length = 0;
    }
  }

  function createFragment() {
    var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    template = template.trim();
    var parent = 'div';
    var $node;

    if (template.indexOf('<tr') === 0) {
      // table row
      parent = 'tbody';
    } else if (template.indexOf('<td') === 0) {
      // table column
      parent = 'tr';
    }

    $node = document.createElement(parent);
    $node.innerHTML = template;

    if ($node.children.length !== 1) {
      throw new Error('Component template must have a single parent node.', template);
    }

    return $node.firstElementChild;
  }

  function addComponentId(template, component) {
    // naive implementation of adding an attribute to the parent container.
    // so we don't depend on a dom parser.
    // downside is we can't warn that template MUST have a single parent (in Node.js).

    // check void elements first.
    var firstBracketIndex = template.indexOf('/>');

    // non-void elements
    if (firstBracketIndex === -1) {
      firstBracketIndex = template.indexOf('>');
    }

    var attr = ' ' + durrutiAttr + '="' + component._durrutiId + '"';

    return template.substr(0, firstBracketIndex) + attr + template.substr(firstBracketIndex);
  }

  // traverse and find durruti nodes
  function getComponentNodes($container) {
    var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if ($container._durruti) {
      arr.push($container);
    }

    if ($container.children) {
      for (var i = 0; i < $container.children.length; i++) {
        getComponentNodes($container.children[i], arr);
      }
    }

    return arr;
  }

  var Durruti = function () {
    function Durruti() {
      classCallCheck(this, Durruti);
    }

    createClass(Durruti, [{
      key: 'server',
      value: function server() {
        clearComponentCache();

        return this;
      }
    }, {
      key: 'render',
      value: function render(component, $container) {
        // decorate basic classes with durruti properties
        var durrutiComponent = decorate(component);

        if (typeof durrutiComponent.render === 'undefined') {
          throw new Error('Components must have a render() method.');
        }

        var template = durrutiComponent.render();
        var componentHtml = addComponentId(template, durrutiComponent);

        // mount and unmount in browser, when we specify a container.
        if (isClient && $container) {
          var $newComponent;
          var patches;

          var _ret = function () {
            // check if the container is still in the DOM.
            // when running multiple parallel render's, the container
            // is removed by the previous render, but the reference still in memory.
            if (!document.body.contains($container)) {
              // warn for performance.
              warn('Node', $container, 'is no longer in the DOM. \nIt was probably removed by a parent component.');
              return {
                v: void 0
              };
            }

            var componentNodes = [];
            // convert the template string to a dom node
            $newComponent = createFragment(componentHtml);

            // unmount component and sub-components

            getComponentNodes($container).forEach(unmountNode);

            // if the container is a durruti element,
            // unmount it and it's children and replace the node.
            if (getCachedComponent($container)) {
              // remove the data attributes on the new node,
              // before patch,
              // and get the list of new components.
              cleanAttrNodes($newComponent, true);

              // get required dom patches
              patches = diff($container, $newComponent);


              patches.forEach(function (patch$$1) {
                // always update component instances,
                // even if the dom doesn't change.
                patch$$1.node._durruti = patch$$1.newNode._durruti;

                // patches contain all the traversed nodes.
                // get the mount components here, for performance.
                if (patch$$1.node._durruti) {
                  if (patch$$1.replace) {
                    componentNodes.push(patch$$1.newNode);
                  } else if (patch$$1.update) {
                    componentNodes.push(patch$$1.node);
                  } else {
                    // node is the same,
                    // but we need to mount sub-components.
                    Array.prototype.push.apply(componentNodes, getComponentNodes(patch$$1.node));
                  }
                }
              });

              // morph old dom node into new one
              patch(patches);
            } else {
              // if the component is not a durruti element,
              // insert the template with innerHTML.

              // only if the same html is not already rendered
              if (!$container.firstElementChild || !$container.firstElementChild.isEqualNode($newComponent)) {
                $container.innerHTML = componentHtml;
              }

              componentNodes = cleanAttrNodes($container);
            }

            // mount newly added components
            componentNodes.forEach(mountNode);
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }

        return componentHtml;
      }
    }]);
    return Durruti;
  }();

  var durruti = new Durruti();

  return durruti;

})));


},{}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.durruti = global.durruti || {}, global.durruti.Store = factory());
}(this, (function () { 'use strict';

  /* Durruti
   * Utils.
   */

  function hasWindow() {
    return typeof window !== 'undefined';
  }

  var isClient = hasWindow();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // one-level object extend
  function extend() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments[1];

    // clone object
    var extended = clone(obj);

    // copy default keys where undefined
    Object.keys(defaults).forEach(function (key) {
      if (typeof extended[key] === 'undefined') {
        extended[key] = defaults[key];
      }
    });

    return extended;
  }

  var DURRUTI_DEBUG = true;

  /* Durruti
   * Data store with change events.
   */

  function Store(name, options) {
    options = options || {};

    var historySupport = false;
    // history is active only in the browser, by default
    if (isClient) {
      historySupport = true;
    }

    this.options = extend(options, {
      history: historySupport
    });

    this.events = {
      change: []
    };

    this.data = [];
  }

  Store.prototype.trigger = function (topic) {
    this.events[topic] = this.events[topic] || [];

    // immutable.
    // so on/off don't change the array durring trigger.
    var foundEvents = this.events[topic].slice();
    foundEvents.forEach(function (event) {
      event();
    });
  };

  Store.prototype.on = function (topic, func) {
    this.events[topic] = this.events[topic] || [];
    this.events[topic].push(func);
  };

  Store.prototype.off = function (topic, fn) {
    this.events[topic] = this.events[topic] || [];

    // find the fn in the arr
    var index = [].indexOf.call(this.events[topic], fn);

    // we didn't find it in the array
    if (index === -1) {
      return;
    }

    this.events[topic].splice(index, 1);
  };

  Store.prototype.get = function () {
    var value = this.data[this.data.length - 1];
    if (!value) {
      return null;
    }

    return clone(value);
  };

  Store.prototype.list = function () {
    return clone(this.data);
  };

  Store.prototype.set = function (value) {
    if (this.options.history) {
      this.data.push(value);
    } else {
      this.data = [value];
    }

    this.trigger('change');

    return this.get();
  };

  return Store;

})));


},{}],3:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Jotted = factory());
}(this, (function () { 'use strict';

  /* util
   */

  function extend() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var extended = {};
    // clone object
    Object.keys(obj).forEach(function (key) {
      extended[key] = obj[key];
    });

    // copy default keys where undefined
    Object.keys(defaults).forEach(function (key) {
      if (typeof extended[key] !== 'undefined') {
        extended[key] = obj[key];
      } else {
        extended[key] = defaults[key];
      }
    });

    return extended;
  }

  function fetch(url, callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'text';

    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        callback(url, xhr);
      }
    };

    xhr.onerror = function (err) {
      callback(err);
    };

    xhr.send();
  }

  function runCallback(index, params, arr, errors, callback) {
    return function (err, res) {
      if (err) {
        errors.push(err);
      }

      index++;
      if (index < arr.length) {
        seqRunner(index, res, arr, errors, callback);
      } else {
        callback(errors, res);
      }
    };
  }

  function seqRunner(index, params, arr, errors, callback) {
    // async
    arr[index](params, runCallback.apply(this, arguments));
  }

  function seq(arr, params) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    var errors = [];

    if (!arr.length) {
      return callback(errors, params);
    }

    seqRunner(0, params, arr, errors, callback);
  }

  function debounce(fn, delay) {
    var cooldown = null;
    var multiple = null;
    return function () {
      var _this = this,
          _arguments = arguments;

      if (cooldown) {
        multiple = true;
      } else {
        fn.apply(this, arguments);
      }

      clearTimeout(cooldown);

      cooldown = setTimeout(function () {
        if (multiple) {
          fn.apply(_this, _arguments);
        }

        cooldown = null;
        multiple = null;
      }, delay);
    };
  }

  function hasClass(node, className) {
    if (!node.className) {
      return false;
    }
    var tempClass = ' ' + node.className + ' ';
    className = ' ' + className + ' ';

    if (tempClass.indexOf(className) !== -1) {
      return true;
    }

    return false;
  }

  function addClass(node, className) {
    // class is already added
    if (hasClass(node, className)) {
      return node.className;
    }

    if (node.className) {
      className = ' ' + className;
    }

    node.className += className;

    return node.className;
  }

  function removeClass(node, className) {
    var spaceBefore = ' ' + className;
    var spaceAfter = className + ' ';

    if (node.className.indexOf(spaceBefore) !== -1) {
      node.className = node.className.replace(spaceBefore, '');
    } else if (node.className.indexOf(spaceAfter) !== -1) {
      node.className = node.className.replace(spaceAfter, '');
    } else {
      node.className = node.className.replace(className, '');
    }

    return node.className;
  }

  function data(node, attr) {
    return node.getAttribute('data-' + attr);
  }

  // mode detection based on content type and file extension
  var defaultModemap = {
    'html': 'html',
    'css': 'css',
    'js': 'javascript',
    'less': 'less',
    'styl': 'stylus',
    'coffee': 'coffeescript'
  };

  function getMode() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var customModemap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var modemap = extend(customModemap, defaultModemap);

    // try the file extension
    for (var key in modemap) {
      var keyLength = key.length;
      if (file.slice(-keyLength++) === '.' + key) {
        return modemap[key];
      }
    }

    // try the file type (html/css/js)
    for (var _key in modemap) {
      if (type === _key) {
        return modemap[_key];
      }
    }

    return type;
  }

  /* template
   */

  function container() {
    return '\n    <ul class="jotted-nav">\n      <li class="jotted-nav-item jotted-nav-item-result">\n        <a href="#" data-jotted-type="result">\n          Result\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-html">\n        <a href="#" data-jotted-type="html">\n          HTML\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-css">\n        <a href="#" data-jotted-type="css">\n          CSS\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-js">\n        <a href="#" data-jotted-type="js">\n          JavaScript\n        </a>\n      </li>\n    </ul>\n    <div class="jotted-pane jotted-pane-result"><iframe></iframe></div>\n    <div class="jotted-pane jotted-pane-html"></div>\n    <div class="jotted-pane jotted-pane-css"></div>\n    <div class="jotted-pane jotted-pane-js"></div>\n  ';
  }

  function paneActiveClass(type) {
    return 'jotted-pane-active-' + type;
  }

  function containerClass() {
    return 'jotted';
  }

  function hasFileClass(type) {
    return 'jotted-has-' + type;
  }

  function editorClass(type) {
    return 'jotted-editor jotted-editor-' + type;
  }

  function editorContent(type) {
    var fileUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return '\n    <textarea data-jotted-type="' + type + '" data-jotted-file="' + fileUrl + '"></textarea>\n    <div class="jotted-status"></div>\n  ';
  }

  function statusMessage(err) {
    return '\n    <p>' + err + '</p>\n  ';
  }

  function statusClass(type) {
    return 'jotted-status-' + type;
  }

  function statusActiveClass(type) {
    return 'jotted-status-active-' + type;
  }

  function pluginClass(name) {
    return 'jotted-plugin-' + name;
  }

  function statusLoading(url) {
    return 'Loading <strong>' + url + '</strong>..';
  }

  function statusFetchError(url) {
    return 'There was an error loading <strong>' + url + '</strong>.';
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };





  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

















  var set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  /* plugin
   */

  var plugins = [];

  function find$1(id) {
    for (var pluginIndex in plugins) {
      var plugin = plugins[pluginIndex];
      if (plugin._id === id) {
        return plugin;
      }
    }

    // can't find plugin
    throw new Error('Plugin ' + id + ' is not registered.');
  }

  function register(id, plugin) {
    // private properties
    plugin._id = id;
    plugins.push(plugin);
  }

  // create a new instance of each plugin, on the jotted instance
  function init() {
    var _this = this;

    this._get('options').plugins.forEach(function (plugin) {
      // check if plugin definition is string or object
      var Plugin = void 0;
      var pluginName = void 0;
      var pluginOptions = {};
      if (typeof plugin === 'string') {
        pluginName = plugin;
      } else if ((typeof plugin === 'undefined' ? 'undefined' : _typeof(plugin)) === 'object') {
        pluginName = plugin.name;
        pluginOptions = plugin.options || {};
      }

      Plugin = find$1(pluginName);
      _this._get('plugins')[plugin] = new Plugin(_this, pluginOptions);

      addClass(_this._get('$container'), pluginClass(pluginName));
    });
  }

  /* pubsoup
   */

  var PubSoup = function () {
    function PubSoup() {
      classCallCheck(this, PubSoup);

      this.topics = {};
      this.callbacks = {};
    }

    createClass(PubSoup, [{
      key: 'find',
      value: function find(query) {
        this.topics[query] = this.topics[query] || [];
        return this.topics[query];
      }
    }, {
      key: 'subscribe',
      value: function subscribe(topic, subscriber) {
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 90;

        var foundTopic = this.find(topic);
        subscriber._priority = priority;
        foundTopic.push(subscriber);

        // sort subscribers on priority
        foundTopic.sort(function (a, b) {
          return a._priority > b._priority ? 1 : b._priority > a._priority ? -1 : 0;
        });
      }

      // removes a function from an array

    }, {
      key: 'remover',
      value: function remover(arr, fn) {
        arr.forEach(function () {
          // if no fn is specified
          // clean-up the array
          if (!fn) {
            arr.length = 0;
            return;
          }

          // find the fn in the arr
          var index = [].indexOf.call(arr, fn);

          // we didn't find it in the array
          if (index === -1) {
            return;
          }

          arr.splice(index, 1);
        });
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(topic, subscriber) {
        // remove from subscribers
        var foundTopic = this.find(topic);
        this.remover(foundTopic, subscriber);

        // remove from callbacks
        this.callbacks[topic] = this.callbacks[topic] || [];
        this.remover(this.callbacks[topic], subscriber);
      }

      // sequentially runs a method on all plugins

    }, {
      key: 'publish',
      value: function publish(topic) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var foundTopic = this.find(topic);
        var runList = [];

        foundTopic.forEach(function (subscriber) {
          runList.push(subscriber);
        });

        seq(runList, params, this.runCallbacks(topic));
      }

      // parallel run all .done callbacks

    }, {
      key: 'runCallbacks',
      value: function runCallbacks(topic) {
        var _this = this;

        return function (err, params) {
          _this.callbacks[topic] = _this.callbacks[topic] || [];

          _this.callbacks[topic].forEach(function (c) {
            c(err, params);
          });
        };
      }

      // attach a callback when a publish[topic] is done

    }, {
      key: 'done',
      value: function done(topic) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        this.callbacks[topic] = this.callbacks[topic] || [];
        this.callbacks[topic].push(callback);
      }
    }]);
    return PubSoup;
  }();

  /* render plugin
   * renders the iframe
   */

  var PluginRender = function () {
    function PluginRender(jotted, options) {
      classCallCheck(this, PluginRender);

      options = extend(options, {});

      // iframe srcdoc support
      var supportSrcdoc = !!('srcdoc' in document.createElement('iframe'));
      var $resultFrame = jotted.$container.querySelector('.jotted-pane-result iframe');

      var frameContent = '';

      // cached content
      var content = {
        html: '',
        css: '',
        js: ''
      };

      // catch domready events from the iframe
      window.addEventListener('message', this.domready.bind(this));

      // render on each change
      jotted.on('change', this.change.bind(this), 100);

      // public
      this.supportSrcdoc = supportSrcdoc;
      this.content = content;
      this.frameContent = frameContent;
      this.$resultFrame = $resultFrame;

      this.callbacks = [];
      this.index = 0;

      this.lastCallback = function () {};
    }

    createClass(PluginRender, [{
      key: 'template',
      value: function template() {
        var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var script = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        return '\n      <!doctype html>\n      <html>\n        <head>\n          <script>\n            (function () {\n              window.addEventListener(\'DOMContentLoaded\', function () {\n                window.parent.postMessage(JSON.stringify({\n                  type: \'jotted-dom-ready\'\n                }), \'*\')\n              })\n            }())\n          </script>\n\n          <style>' + style + '</style>\n        </head>\n        <body>\n          ' + body + '\n\n          <!--\n            Jotted:\n            Empty script tag prevents malformed HTML from breaking the next script.\n          -->\n          <script></script>\n          <script>' + script + '</script>\n        </body>\n      </html>\n    ';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        var _this = this;

        // cache manipulated content
        this.content[params.type] = params.content;

        // check existing and to-be-rendered content
        var oldFrameContent = this.frameContent;
        this.frameContent = this.template(this.content['css'], this.content['html'], this.content['js']);

        // cache the current callback as global,
        // so we can call it from the message callback.
        this.lastCallback = function () {
          _this.lastCallback = function () {};

          callback(null, params);
        };

        // don't render if previous and new frame content are the same.
        // mostly for the `play` plugin,
        // so we don't re-render the same content on each change.
        // unless we set forceRender.
        if (params.forceRender !== true && this.frameContent === oldFrameContent) {
          callback(null, params);
          return;
        }

        if (this.supportSrcdoc) {
          // srcdoc in unreliable in Chrome.
          // https://github.com/ghinda/jotted/issues/23

          // re-create the iframe on each change,
          // to discard the previously loaded scripts.
          var $newResultFrame = document.createElement('iframe');
          this.$resultFrame.parentNode.replaceChild($newResultFrame, this.$resultFrame);
          this.$resultFrame = $newResultFrame;

          this.$resultFrame.contentWindow.document.open();
          this.$resultFrame.contentWindow.document.write(this.frameContent);
          this.$resultFrame.contentWindow.document.close();
        } else {
          // older browsers without iframe srcset support (IE9).
          this.$resultFrame.setAttribute('data-srcdoc', this.frameContent);

          // tips from https://github.com/jugglinmike/srcdoc-polyfill
          // Copyright (c) 2012 Mike Pennisi
          // Licensed under the MIT license.
          var jsUrl = 'javascript:window.frameElement.getAttribute("data-srcdoc");';

          this.$resultFrame.setAttribute('src', jsUrl);

          // Explicitly set the iFrame's window.location for
          // compatibility with IE9, which does not react to changes in
          // the `src` attribute when it is a `javascript:` URL.
          if (this.$resultFrame.contentWindow) {
            this.$resultFrame.contentWindow.location = jsUrl;
          }
        }
      }
    }, {
      key: 'domready',
      value: function domready(e) {
        // only catch messages from the iframe
        if (e.source !== this.$resultFrame.contentWindow) {
          return;
        }

        var data$$1 = {};
        try {
          data$$1 = JSON.parse(e.data);
        } catch (e) {}

        if (data$$1.type === 'jotted-dom-ready') {
          this.lastCallback();
        }
      }
    }]);
    return PluginRender;
  }();

  /* scriptless plugin
   * removes script tags from html content
   */

  var PluginScriptless = function () {
    function PluginScriptless(jotted, options) {
      classCallCheck(this, PluginScriptless);

      options = extend(options, {});

      // https://html.spec.whatwg.org/multipage/scripting.html
      var runScriptTypes = ['application/javascript', 'application/ecmascript', 'application/x-ecmascript', 'application/x-javascript', 'text/ecmascript', 'text/javascript', 'text/javascript1.0', 'text/javascript1.1', 'text/javascript1.2', 'text/javascript1.3', 'text/javascript1.4', 'text/javascript1.5', 'text/jscript', 'text/livescript', 'text/x-ecmascript', 'text/x-javascript'];

      // remove script tags on each change
      jotted.on('change', this.change.bind(this));

      // public
      this.runScriptTypes = runScriptTypes;
    }

    createClass(PluginScriptless, [{
      key: 'change',
      value: function change(params, callback) {
        if (params.type !== 'html') {
          return callback(null, params);
        }

        // for IE9 support, remove the script tags from HTML content.
        // when we stop supporting IE9, we can use the sandbox attribute.
        var fragment = document.createElement('div');
        fragment.innerHTML = params.content;

        var typeAttr = null;

        // remove all script tags
        var $scripts = fragment.querySelectorAll('script');
        for (var i = 0; i < $scripts.length; i++) {
          typeAttr = $scripts[i].getAttribute('type');

          // only remove script tags without the type attribute
          // or with a javascript mime attribute value.
          // the ones that are run by the browser.
          if (!typeAttr || this.runScriptTypes.indexOf(typeAttr) !== -1) {
            $scripts[i].parentNode.removeChild($scripts[i]);
          }
        }

        params.content = fragment.innerHTML;

        callback(null, params);
      }
    }]);
    return PluginScriptless;
  }();

  /* ace plugin
   */

  var PluginAce = function () {
    function PluginAce(jotted, options) {
      classCallCheck(this, PluginAce);

      var priority = 1;
      var i;

      this.editor = {};
      this.jotted = jotted;

      options = extend(options, {});

      // check if Ace is loaded
      if (typeof window.ace === 'undefined') {
        return;
      }

      var $editors = jotted.$container.querySelectorAll('.jotted-editor');

      for (i = 0; i < $editors.length; i++) {
        var $textarea = $editors[i].querySelector('textarea');
        var type = data($textarea, 'jotted-type');
        var file = data($textarea, 'jotted-file');

        var $aceContainer = document.createElement('div');
        $editors[i].appendChild($aceContainer);

        this.editor[type] = window.ace.edit($aceContainer);
        var editor = this.editor[type];

        var editorOptions = extend(options);

        editor.getSession().setMode('ace/mode/' + getMode(type, file));
        editor.getSession().setOptions(editorOptions);

        editor.$blockScrolling = Infinity;
      }

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginAce, [{
      key: 'editorChange',
      value: function editorChange(params) {
        var _this = this;

        return function () {
          _this.jotted.trigger('change', params);
        };
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        var editor = this.editor[params.type];

        // if the event is not started by the ace change.
        // triggered only once per editor,
        // when the textarea is populated/file is loaded.
        if (!params.aceEditor) {
          editor.getSession().setValue(params.content);

          // attach the event only after the file is loaded
          params.aceEditor = editor;
          editor.on('change', this.editorChange(params));
        }

        // manipulate the params and pass them on
        params.content = editor.getValue();
        callback(null, params);
      }
    }]);
    return PluginAce;
  }();

  /* coremirror plugin
   */

  var PluginCodeMirror = function () {
    function PluginCodeMirror(jotted, options) {
      classCallCheck(this, PluginCodeMirror);

      var priority = 1;
      var i;

      this.editor = {};
      this.jotted = jotted;

      // custom modemap for codemirror
      var modemap = {
        'html': 'htmlmixed'
      };

      options = extend(options, {
        lineNumbers: true
      });

      // check if CodeMirror is loaded
      if (typeof window.CodeMirror === 'undefined') {
        return;
      }

      var $editors = jotted.$container.querySelectorAll('.jotted-editor');

      for (i = 0; i < $editors.length; i++) {
        var $textarea = $editors[i].querySelector('textarea');
        var type = data($textarea, 'jotted-type');
        var file = data($textarea, 'jotted-file');

        this.editor[type] = window.CodeMirror.fromTextArea($textarea, options);
        this.editor[type].setOption('mode', getMode(type, file, modemap));
      }

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginCodeMirror, [{
      key: 'editorChange',
      value: function editorChange(params) {
        var _this = this;

        return function () {
          // trigger a change event
          _this.jotted.trigger('change', params);
        };
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        var editor = this.editor[params.type];

        // if the event is not started by the codemirror change.
        // triggered only once per editor,
        // when the textarea is populated/file is loaded.
        if (!params.cmEditor) {
          editor.setValue(params.content);

          // attach the event only after the file is loaded
          params.cmEditor = editor;
          editor.on('change', this.editorChange(params));
        }

        // manipulate the params and pass them on
        params.content = editor.getValue();
        callback(null, params);
      }
    }]);
    return PluginCodeMirror;
  }();

  /* less plugin
   */

  var PluginLess = function () {
    function PluginLess(jotted, options) {
      classCallCheck(this, PluginLess);

      var priority = 20;

      options = extend(options, {});

      // check if less is loaded
      if (typeof window.less === 'undefined') {
        return;
      }

      // change CSS link label to Less
      jotted.$container.querySelector('a[data-jotted-type="css"]').innerHTML = 'Less';

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginLess, [{
      key: 'isLess',
      value: function isLess(params) {
        if (params.type !== 'css') {
          return false;
        }

        return params.file.indexOf('.less') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .less and blank files
        if (this.isLess(params)) {
          window.less.render(params.content, this.options, function (err, res) {
            if (err) {
              return callback(err, params);
            } else {
              // replace the content with the parsed less
              params.content = res.css;
            }

            callback(null, params);
          });
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginLess;
  }();

  /* coffeescript plugin
   */

  var PluginCoffeeScript = function () {
    function PluginCoffeeScript(jotted, options) {
      classCallCheck(this, PluginCoffeeScript);

      var priority = 20;

      options = extend(options, {});

      // check if coffeescript is loaded
      if (typeof window.CoffeeScript === 'undefined') {
        return;
      }

      // change JS link label to Less
      jotted.$container.querySelector('a[data-jotted-type="js"]').innerHTML = 'CoffeeScript';

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginCoffeeScript, [{
      key: 'isCoffee',
      value: function isCoffee(params) {
        if (params.type !== 'js') {
          return false;
        }

        return params.file.indexOf('.coffee') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .less and blank files
        if (this.isCoffee(params)) {
          try {
            params.content = window.CoffeeScript.compile(params.content);
          } catch (err) {
            return callback(err, params);
          }
        }

        callback(null, params);
      }
    }]);
    return PluginCoffeeScript;
  }();

  /* stylus plugin
   */

  var PluginStylus = function () {
    function PluginStylus(jotted, options) {
      classCallCheck(this, PluginStylus);

      var priority = 20;

      options = extend(options, {});

      // check if stylus is loaded
      if (typeof window.stylus === 'undefined') {
        return;
      }

      // change CSS link label to Stylus
      jotted.$container.querySelector('a[data-jotted-type="css"]').innerHTML = 'Stylus';

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginStylus, [{
      key: 'isStylus',
      value: function isStylus(params) {
        if (params.type !== 'css') {
          return false;
        }

        return params.file.indexOf('.styl') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .styl and blank files
        if (this.isStylus(params)) {
          window.stylus(params.content, this.options).render(function (err, res) {
            if (err) {
              return callback(err, params);
            } else {
              // replace the content with the parsed less
              params.content = res;
            }

            callback(null, params);
          });
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginStylus;
  }();

  /* babel plugin
   */

  var PluginBabel = function () {
    function PluginBabel(jotted, options) {
      classCallCheck(this, PluginBabel);

      var priority = 20;

      this.options = extend(options, {});

      // check if babel is loaded
      if (typeof window.Babel !== 'undefined') {
        // using babel-standalone
        this.babel = window.Babel;
      } else if (typeof window.babel !== 'undefined') {
        // using browser.js from babel-core 5.x
        this.babel = {
          transform: window.babel
        };
      } else {
        return;
      }

      // change js link label
      jotted.$container.querySelector('a[data-jotted-type="js"]').innerHTML = 'ES2015';

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginBabel, [{
      key: 'change',
      value: function change(params, callback) {
        // only parse js content
        if (params.type === 'js') {
          try {
            params.content = this.babel.transform(params.content, this.options).code;
          } catch (err) {
            return callback(err, params);
          }

          callback(null, params);
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginBabel;
  }();

  /* markdown plugin
   */

  var PluginMarkdown = function () {
    function PluginMarkdown(jotted, options) {
      classCallCheck(this, PluginMarkdown);

      var priority = 20;

      this.options = extend(options, {});

      // check if marked is loaded
      if (typeof window.marked === 'undefined') {
        return;
      }

      window.marked.setOptions(options);

      // change html link label
      jotted.$container.querySelector('a[data-jotted-type="html"]').innerHTML = 'Markdown';

      jotted.on('change', this.change.bind(this), priority);
    }

    createClass(PluginMarkdown, [{
      key: 'change',
      value: function change(params, callback) {
        // only parse html content
        if (params.type === 'html') {
          try {
            params.content = window.marked(params.content);
          } catch (err) {
            return callback(err, params);
          }

          callback(null, params);
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginMarkdown;
  }();

  /* console plugin
   */

  var PluginConsole = function () {
    function PluginConsole(jotted, options) {
      classCallCheck(this, PluginConsole);

      options = extend(options, {
        autoClear: false
      });

      var priority = 30;
      var history = [];
      var historyIndex = 0;
      var logCaptureSnippet = '(' + this.capture.toString() + ')();';
      var contentCache = {
        html: '',
        css: '',
        js: ''
      };

      // new tab and pane markup
      var $nav = document.createElement('li');
      addClass($nav, 'jotted-nav-item jotted-nav-item-console');
      $nav.innerHTML = '<a href="#" data-jotted-type="console">JS Console</a>';

      var $pane = document.createElement('div');
      addClass($pane, 'jotted-pane jotted-pane-console');

      $pane.innerHTML = '\n      <div class="jotted-console-container">\n        <ul class="jotted-console-output"></ul>\n        <form class="jotted-console-input">\n          <input type="text">\n        </form>\n      </div>\n      <button class="jotted-button jotted-console-clear">Clear</button>\n    ';

      jotted.$container.appendChild($pane);
      jotted.$container.querySelector('.jotted-nav').appendChild($nav);

      var $container = jotted.$container.querySelector('.jotted-console-container');
      var $output = jotted.$container.querySelector('.jotted-console-output');
      var $input = jotted.$container.querySelector('.jotted-console-input input');
      var $inputForm = jotted.$container.querySelector('.jotted-console-input');
      var $clear = jotted.$container.querySelector('.jotted-console-clear');

      // submit the input form
      $inputForm.addEventListener('submit', this.submit.bind(this));

      // console history
      $input.addEventListener('keydown', this.history.bind(this));

      // clear button
      $clear.addEventListener('click', this.clear.bind(this));

      // clear the console on each change
      if (options.autoClear === true) {
        jotted.on('change', this.autoClear.bind(this), priority - 1);
      }

      // capture the console on each change
      jotted.on('change', this.change.bind(this), priority);

      // get log events from the iframe
      window.addEventListener('message', this.getMessage.bind(this));

      // plugin public properties
      this.$jottedContainer = jotted.$container;
      this.$container = $container;
      this.$input = $input;
      this.$output = $output;
      this.history = history;
      this.historyIndex = historyIndex;
      this.logCaptureSnippet = logCaptureSnippet;
      this.contentCache = contentCache;
      this.getIframe = this.getIframe.bind(this);
    }

    createClass(PluginConsole, [{
      key: 'getIframe',
      value: function getIframe() {
        return this.$jottedContainer.querySelector('.jotted-pane-result iframe');
      }
    }, {
      key: 'getMessage',
      value: function getMessage(e) {
        // only catch messages from the iframe
        if (e.source !== this.getIframe().contentWindow) {
          return;
        }

        var data$$1 = {};
        try {
          data$$1 = JSON.parse(e.data);
        } catch (err) {}

        if (data$$1.type === 'jotted-console-log') {
          this.log(data$$1.message);
        }
      }
    }, {
      key: 'autoClear',
      value: function autoClear(params, callback) {
        var snippetlessContent = params.content;

        // remove the snippet from cached js content
        if (params.type === 'js') {
          snippetlessContent = snippetlessContent.replace(this.logCaptureSnippet, '');
        }

        // for compatibility with the Play plugin,
        // clear the console only if something has changed or force rendering.
        if (params.forceRender === true || this.contentCache[params.type] !== snippetlessContent) {
          this.clear();
        }

        // always cache the latest content
        this.contentCache[params.type] = snippetlessContent;

        callback(null, params);
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse js content
        if (params.type !== 'js') {
          // make sure we callback either way,
          // to not break the pubsoup
          return callback(null, params);
        }

        // check if the snippet is already added.
        // the Play plugin caches the changed params and triggers change
        // with the cached response, causing the snippet to be inserted
        // multiple times, on each trigger.
        if (params.content.indexOf(this.logCaptureSnippet) === -1) {
          params.content = '' + this.logCaptureSnippet + params.content;
        }

        callback(null, params);
      }

      // capture the console.log output

    }, {
      key: 'capture',
      value: function capture() {
        // IE9 with devtools closed
        if (typeof window.console === 'undefined' || typeof window.console.log === 'undefined') {
          window.console = {
            log: function log() {}
          };
        }

        // for IE9 support
        var oldConsoleLog = Function.prototype.bind.call(window.console.log, window.console);

        window.console.log = function () {
          // send log messages to the parent window
          [].slice.call(arguments).forEach(function (message) {
            window.parent.postMessage(JSON.stringify({
              type: 'jotted-console-log',
              message: message
            }), '*');
          });

          // in IE9, console.log is object instead of function
          // https://connect.microsoft.com/IE/feedback/details/585896/console-log-typeof-is-object-instead-of-function
          oldConsoleLog.apply(oldConsoleLog, arguments);
        };
      }
    }, {
      key: 'log',
      value: function log() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var type = arguments[1];

        var $log = document.createElement('li');
        addClass($log, 'jotted-console-log');

        if (typeof type !== 'undefined') {
          addClass($log, 'jotted-console-log-' + type);
        }

        $log.innerHTML = message;

        this.$output.appendChild($log);
      }
    }, {
      key: 'submit',
      value: function submit(e) {
        var inputValue = this.$input.value.trim();

        // if input is blank, do nothing
        if (inputValue === '') {
          return e.preventDefault();
        }

        // add run to history
        this.history.push(inputValue);
        this.historyIndex = this.history.length;

        // log input value
        this.log(inputValue, 'history');

        // add return if it doesn't start with it
        if (inputValue.indexOf('return') !== 0) {
          inputValue = 'return ' + inputValue;
        }

        // show output or errors
        try {
          // run the console input in the iframe context
          var scriptOutput = this.getIframe().contentWindow.eval('(function() {' + inputValue + '})()');

          this.log(scriptOutput);
        } catch (err) {
          this.log(err, 'error');
        }

        // clear the console value
        this.$input.value = '';

        // scroll console pane to bottom
        // to keep the input into view
        this.$container.scrollTop = this.$container.scrollHeight;

        e.preventDefault();
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.$output.innerHTML = '';
      }
    }, {
      key: 'history',
      value: function history(e) {
        var UP = 38;
        var DOWN = 40;
        var gotHistory = false;
        var selectionStart = this.$input.selectionStart;

        // only if we have previous history
        // and the cursor is at the start
        if (e.keyCode === UP && this.historyIndex !== 0 && selectionStart === 0) {
          this.historyIndex--;
          gotHistory = true;
        }

        // only if we have future history
        // and the cursor is at the end
        if (e.keyCode === DOWN && this.historyIndex !== this.history.length - 1 && selectionStart === this.$input.value.length) {
          this.historyIndex++;
          gotHistory = true;
        }

        // only if history changed
        if (gotHistory) {
          this.$input.value = this.history[this.historyIndex];
        }
      }
    }]);
    return PluginConsole;
  }();

  /* play plugin
   * adds a Run button
   */

  var PluginPlay = function () {
    function PluginPlay(jotted, options) {
      classCallCheck(this, PluginPlay);

      options = extend(options, {
        firstRun: true
      });

      var priority = 10;
      // cached code
      var cache = {};
      // latest version of the code.
      // replaces the cache when the run button is pressed.
      var code = {};

      // set firstRun=false to start with a blank preview.
      // run the real content only after the first Run button press.
      if (options.firstRun === false) {
        cache = {
          html: {
            type: 'html',
            content: ''
          },
          css: {
            type: 'css',
            content: ''
          },
          js: {
            type: 'js',
            content: ''
          }
        };
      }

      // run button
      var $button = document.createElement('button');
      $button.className = 'jotted-button jotted-button-play';
      $button.innerHTML = 'Run';

      jotted.$container.appendChild($button);
      $button.addEventListener('click', this.run.bind(this));

      // capture the code on each change
      jotted.on('change', this.change.bind(this), priority);

      // public
      this.cache = cache;
      this.code = code;
      this.jotted = jotted;
    }

    createClass(PluginPlay, [{
      key: 'change',
      value: function change(params, callback) {
        // always cache the latest code
        this.code[params.type] = extend(params);

        // replace the params with the latest cache
        if (typeof this.cache[params.type] !== 'undefined') {
          callback(null, this.cache[params.type]);

          // make sure we don't cache forceRender,
          // and send it with each change.
          this.cache[params.type].forceRender = null;
        } else {
          // cache the first run
          this.cache[params.type] = extend(params);

          callback(null, params);
        }
      }
    }, {
      key: 'run',
      value: function run() {
        // trigger change on each type with the latest code
        for (var type in this.code) {
          this.cache[type] = extend(this.code[type], {
            // force rendering on each Run press
            forceRender: true
          });

          // trigger the change
          this.jotted.trigger('change', this.cache[type]);
        }
      }
    }]);
    return PluginPlay;
  }();

  /* pen plugin
   */
  var PluginPen = function () {
    function PluginPen(jotted, options) {
      classCallCheck(this, PluginPen);

      // available panes
      var panes = {
        html: { title: 'HTML', classChecker: 'jotted-has-html' },
        css: { title: 'CSS', classChecker: 'jotted-has-css' },
        js: { title: 'JavaScript', classChecker: 'jotted-has-js' },
        console: { title: 'Console', classChecker: 'jotted-plugin-console' }
      };

      var $availablePanes = [];
      for (var p in panes) {
        if (jotted.$container.classList.contains(panes[p].classChecker)) {
          $availablePanes.push(jotted.$container.querySelector('.jotted-pane-' + p));
        }
      }

      this.resizablePanes = [];
      for (var i = 0; i < $availablePanes.length; i++) {
        var type = void 0;

        for (var j = 0; j < $availablePanes[i].classList.length; j++) {
          if ($availablePanes[i].classList[j].indexOf('jotted-pane-') !== -1) {
            type = $availablePanes[i].classList[j].replace('jotted-pane-', '');
            break;
          }
        }

        if (!type) {
          continue;
        }

        var $pane = {
          container: $availablePanes[i],
          expander: undefined
        };

        this.resizablePanes.push($pane);

        var $paneTitle = document.createElement('div');
        $paneTitle.classList.add('jotted-pane-title');
        $paneTitle.innerHTML = panes[type].title || type;

        var $paneElement = $availablePanes[i].firstElementChild;
        $paneElement.insertBefore($paneTitle, $paneElement.firstChild);

        // insert expander element.
        // only panes which have an expander can be shrunk or expanded
        // first pane must not have a expander
        if (i > 0) {
          $pane.expander = document.createElement('div');
          $pane.expander.classList.add('jotted-plugin-pen-expander');
          $pane.expander.addEventListener('mousedown', this.startExpand.bind(this, jotted));

          $paneElement.insertBefore($pane.expander, $paneTitle);
        }
      }
    }

    createClass(PluginPen, [{
      key: 'startExpand',
      value: function startExpand(jotted, event) {
        var $pane = this.resizablePanes.filter(function (pane) {
          return pane.expander === event.target;
        }).shift();

        var $previousPane = this.resizablePanes[this.resizablePanes.indexOf($pane) - 1];

        var $relativePixel = 100 / parseInt(window.getComputedStyle($pane.container.parentNode)['width'], 10);

        // ugly but reliable & cross-browser way of getting height/width as percentage.
        $pane.container.parentNode.style.display = 'none';

        $pane.startX = event.clientX;
        $pane.startWidth = parseFloat(window.getComputedStyle($pane.container)['width'], 10);
        $previousPane.startWidth = parseFloat(window.getComputedStyle($previousPane.container)['width'], 10);

        $pane.container.parentNode.style.display = '';

        $pane.mousemove = this.doDrag.bind(this, $pane, $previousPane, $relativePixel);
        $pane.mouseup = this.stopDrag.bind(this, $pane);

        document.addEventListener('mousemove', $pane.mousemove, false);
        document.addEventListener('mouseup', $pane.mouseup, false);
      }
    }, {
      key: 'doDrag',
      value: function doDrag(pane, previousPane, relativePixel, event) {
        // previous pane new width
        var ppNewWidth = previousPane.startWidth + (event.clientX - pane.startX) * relativePixel;

        // current pane new width
        var cpNewWidth = pane.startWidth - (event.clientX - pane.startX) * relativePixel;

        // contracting a pane is restricted to a min-size of 10% the container's space.
        var PANE_MIN_SIZE = 10; // percentage %
        if (ppNewWidth >= PANE_MIN_SIZE && cpNewWidth >= PANE_MIN_SIZE) {
          pane.container.style.maxWidth = 'none';
          previousPane.container.style.maxWidth = 'none';

          previousPane.container.style.width = ppNewWidth + '%';
          pane.container.style.width = cpNewWidth + '%';
        }
      }
    }, {
      key: 'stopDrag',
      value: function stopDrag(pane, event) {
        document.removeEventListener('mousemove', pane.mousemove, false);
        document.removeEventListener('mouseup', pane.mouseup, false);
      }
    }]);
    return PluginPen;
  }();

  /* bundle plugins
   */

  // register bundled plugins
  function BundlePlugins(jotted) {
    jotted.plugin('render', PluginRender);
    jotted.plugin('scriptless', PluginScriptless);

    jotted.plugin('ace', PluginAce);
    jotted.plugin('codemirror', PluginCodeMirror);
    jotted.plugin('less', PluginLess);
    jotted.plugin('coffeescript', PluginCoffeeScript);
    jotted.plugin('stylus', PluginStylus);
    jotted.plugin('babel', PluginBabel);
    jotted.plugin('markdown', PluginMarkdown);
    jotted.plugin('console', PluginConsole);
    jotted.plugin('play', PluginPlay);
    jotted.plugin('pen', PluginPen);
  }

  /* jotted
   */

  var Jotted = function () {
    function Jotted($jottedContainer, opts) {
      classCallCheck(this, Jotted);

      if (!$jottedContainer) {
        throw new Error('Can\'t find Jotted container.');
      }

      // private data
      var _private = {};
      this._get = function (key) {
        return _private[key];
      };
      this._set = function (key, value) {
        _private[key] = value;
        return _private[key];
      };

      // options
      var options = this._set('options', extend(opts, {
        files: [],
        showBlank: false,
        runScripts: true,
        pane: 'result',
        debounce: 250,
        plugins: []
      }));

      // the render plugin is mandatory
      options.plugins.push('render');

      // use the scriptless plugin if runScripts is false
      if (options.runScripts === false) {
        options.plugins.push('scriptless');
      }

      // cached content for the change method.
      this._set('cachedContent', {
        html: null,
        css: null,
        js: null
      });

      // PubSoup
      var pubsoup = this._set('pubsoup', new PubSoup());

      this._set('trigger', this.trigger());
      this._set('on', function () {
        pubsoup.subscribe.apply(pubsoup, arguments);
      });
      this._set('off', function () {
        pubsoup.unsubscribe.apply(pubsoup, arguments);
      });
      var done = this._set('done', function () {
        pubsoup.done.apply(pubsoup, arguments);
      });

      // after all plugins run
      // show errors
      done('change', this.errors.bind(this));

      // DOM
      var $container = this._set('$container', $jottedContainer);
      $container.innerHTML = container();
      addClass($container, containerClass());

      // default pane
      var paneActive = this._set('paneActive', options.pane);
      addClass($container, paneActiveClass(paneActive));

      // status nodes
      this._set('$status', {});

      var _arr = ['html', 'css', 'js'];
      for (var _i = 0; _i < _arr.length; _i++) {
        var _type = _arr[_i];
        this.markup(_type);
      }

      // textarea change events.
      $container.addEventListener('keyup', debounce(this.change.bind(this), options.debounce));
      $container.addEventListener('change', debounce(this.change.bind(this), options.debounce));

      // pane change
      $container.addEventListener('click', this.pane.bind(this));

      // expose public properties
      this.$container = this._get('$container');
      this.on = this._get('on');
      this.off = this._get('off');
      this.done = this._get('done');
      this.trigger = this._get('trigger');
      this.paneActive = this._get('paneActive');

      // init plugins
      this._set('plugins', {});
      init.call(this);

      // load files
      var _arr2 = ['html', 'css', 'js'];
      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var _type2 = _arr2[_i2];
        this.load(_type2);
      }

      // show all tabs, even if empty
      if (options.showBlank) {
        var _arr3 = ['html', 'css', 'js'];

        for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
          var type = _arr3[_i3];
          addClass($container, hasFileClass(type));
        }
      }
    }

    createClass(Jotted, [{
      key: 'findFile',
      value: function findFile(type) {
        var file = {};
        var options = this._get('options');

        for (var fileIndex in options.files) {
          var _file = options.files[fileIndex];
          if (_file.type === type) {
            return _file;
          }
        }

        return file;
      }
    }, {
      key: 'markup',
      value: function markup(type) {
        var $container = this._get('$container');
        var $parent = $container.querySelector('.jotted-pane-' + type);
        // create the markup for an editor
        var file = this.findFile(type);

        var $editor = document.createElement('div');
        $editor.innerHTML = editorContent(type, file.url);
        $editor.className = editorClass(type);

        $parent.appendChild($editor);

        // get the status node
        this._get('$status')[type] = $parent.querySelector('.jotted-status');

        // if we have a file for the current type
        if (typeof file.url !== 'undefined' || typeof file.content !== 'undefined') {
          // add the has-type class to the container
          addClass($container, hasFileClass(type));
        }
      }
    }, {
      key: 'load',
      value: function load(type) {
        var _this = this;

        // create the markup for an editor
        var file = this.findFile(type);
        var $textarea = this._get('$container').querySelector('.jotted-pane-' + type + ' textarea');

        // file as string
        if (typeof file.content !== 'undefined') {
          this.setValue($textarea, file.content);
        } else if (typeof file.url !== 'undefined') {
          // show loading message
          this.status('loading', [statusLoading(file.url)], {
            type: type,
            file: file
          });

          // file as url
          fetch(file.url, function (err, res) {
            if (err) {
              // show load errors
              _this.status('error', [statusFetchError(err)], {
                type: type
              });

              return;
            }

            // clear the loading status
            _this.clearStatus('loading', {
              type: type
            });

            _this.setValue($textarea, res);
          });
        } else {
          // trigger a change event on blank editors,
          // for editor plugins to catch.
          // (eg. the codemirror and ace plugins attach the change event
          // only after the initial change/load event)
          this.setValue($textarea, '');
        }
      }
    }, {
      key: 'setValue',
      value: function setValue($textarea, val) {
        $textarea.value = val;

        // trigger change event, for initial render
        this.change({
          target: $textarea
        });
      }
    }, {
      key: 'change',
      value: function change(e) {
        var type = data(e.target, 'jotted-type');
        if (!type) {
          return;
        }

        // don't trigger change if the content hasn't changed.
        // eg. when blurring the textarea.
        var cachedContent = this._get('cachedContent');
        if (cachedContent[type] === e.target.value) {
          return;
        }

        // cache latest content
        cachedContent[type] = e.target.value;

        // trigger the change event
        this.trigger('change', {
          type: type,
          file: data(e.target, 'jotted-file'),
          content: cachedContent[type]
        });
      }
    }, {
      key: 'errors',
      value: function errors(errs, params) {
        this.status('error', errs, params);
      }
    }, {
      key: 'pane',
      value: function pane(e) {
        if (!data(e.target, 'jotted-type')) {
          return;
        }

        var $container = this._get('$container');
        var paneActive = this._get('paneActive');
        removeClass($container, paneActiveClass(paneActive));

        paneActive = this._set('paneActive', data(e.target, 'jotted-type'));
        addClass($container, paneActiveClass(paneActive));

        e.preventDefault();
      }
    }, {
      key: 'status',
      value: function status() {
        var statusType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'error';
        var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!messages.length) {
          return this.clearStatus(statusType, params);
        }

        var $status = this._get('$status');

        // add error/loading class to status
        addClass($status[params.type], statusClass(statusType));

        addClass(this._get('$container'), statusActiveClass(params.type));

        var markup = '';
        messages.forEach(function (err) {
          markup += statusMessage(err);
        });

        $status[params.type].innerHTML = markup;
      }
    }, {
      key: 'clearStatus',
      value: function clearStatus(statusType, params) {
        var $status = this._get('$status');

        removeClass($status[params.type], statusClass(statusType));
        removeClass(this._get('$container'), statusActiveClass(params.type));
        $status[params.type].innerHTML = '';
      }

      // debounced trigger method
      // custom debouncer to use a different timer per type

    }, {
      key: 'trigger',
      value: function trigger() {
        var options = this._get('options');
        var pubsoup = this._get('pubsoup');

        // allow disabling the trigger debouncer.
        // mostly for testing: when trigger events happen rapidly
        // multiple events of the same type would be caught once.
        if (options.debounce === false) {
          return function () {
            pubsoup.publish.apply(pubsoup, arguments);
          };
        }

        // cooldown timer
        var cooldown = {};
        // multiple calls
        var multiple = {};

        return function (topic) {
          var _arguments = arguments;

          var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var _ref$type = _ref.type;
          var type = _ref$type === undefined ? 'default' : _ref$type;

          if (cooldown[type]) {
            // if we had multiple calls before the cooldown
            multiple[type] = true;
          } else {
            // trigger immediately once cooldown is over
            pubsoup.publish.apply(pubsoup, arguments);
          }

          clearTimeout(cooldown[type]);

          // set cooldown timer
          cooldown[type] = setTimeout(function () {
            // if we had multiple calls before the cooldown,
            // trigger the function again at the end.
            if (multiple[type]) {
              pubsoup.publish.apply(pubsoup, _arguments);
            }

            multiple[type] = null;
            cooldown[type] = null;
          }, options.debounce);
        };
      }
    }]);
    return Jotted;
  }();

  // register plugins


  Jotted.plugin = function () {
    return register.apply(this, arguments);
  };

  // register bundled plugins
  BundlePlugins(Jotted);

  return Jotted;

})));


},{}],4:[function(require,module,exports){
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}

},{}],5:[function(require,module,exports){
'use strict';

/* siloz.io
 */

var durruti = require('durruti');
var Main = require('./components/main.js');

durruti.render(Main, document.querySelector('.app'));

},{"./components/main.js":13,"durruti":1}],6:[function(require,module,exports){
'use strict';

/* editor bar
 */

function EditorBar(actions) {
  var plugins = actions.getPlugins();
  var options = {
    html: [{
      title: 'HTML'
    }, {
      title: 'Markdown',
      plugin: 'markdown'
    }],
    css: [{
      title: 'CSS'
    }, {
      title: 'Less',
      plugin: 'less'
    }, {
      title: 'Stylus',
      plugin: 'stylus'
    }],
    js: [{
      title: 'JavaScript'
    }, {
      title: 'ES2015/Babel',
      plugin: 'babel'
    }, {
      title: 'CoffeeScript',
      plugin: 'coffeescript'
    }]
  };

  var selected = {
    html: '',
    css: '',
    js: ''
  };

  function getPlugin(list, name) {
    var foundPlugin = null;
    list.some(function (plugin) {
      if (plugin.plugin === name) {
        foundPlugin = plugin;
        return true;
      }
    });

    return foundPlugin;
  }

  function changeProcessor(type) {
    return function () {
      // remove last selected plugin
      actions.removePlugin(selected[type]);

      // update reference
      selected[type] = this.value;

      var plugin = getPlugin(options[type], selected[type]);
      if (plugin) {
        actions.addPlugin(plugin.plugin);
      }
    };
  }

  function createSelect(type, options, selected) {
    return '\n      <select class="select editor-bar-select-' + type + '">\n        ' + options.map(function (opt) {
      return '\n            <option value="' + (opt.plugin || '') + '" ' + (opt.plugin === selected ? 'selected' : '') + '>\n              ' + opt.title + '\n            </option>\n          ';
    }).join('') + '\n      </select>\n    ';
  }

  function setInitialValues() {
    // set selected values based on store
    Object.keys(options).forEach(function (type) {
      options[type].forEach(function (option) {
        if (plugins.indexOf(option.plugin) !== -1) {
          selected[type] = option.plugin;
        }
      });
    });
  }

  function closePane(type) {
    return function () {
      var panes = {};
      panes[type] = {
        hidden: true
      };

      actions.updatePanes(panes);
    };
  }

  this.mount = function ($container) {
    var _arr = ['html', 'css', 'js'];

    for (var _i = 0; _i < _arr.length; _i++) {
      var type = _arr[_i];
      $container.querySelector('.editor-bar-select-' + type).addEventListener('change', changeProcessor(type));

      $container.querySelector('.editor-bar-pane-close-' + type).addEventListener('click', closePane(type));
    }
  };

  this.render = function () {
    setInitialValues();

    return '\n      <div class="editor-bar">\n        <div class="editor-bar-pane editor-bar-pane-html">\n          ' + createSelect('html', options.html, selected.html) + '\n\n          <button type="button" class="editor-bar-pane-close editor-bar-pane-close-html btn" title="Hide HTML">\n            <i class="icon icon-close"></i>\n          </button>\n        </div>\n        <div class="editor-bar-pane editor-bar-pane-css">\n          ' + createSelect('css', options.css, selected.css) + '\n\n          <button type="button" class="editor-bar-pane-close editor-bar-pane-close-css btn" title="Hide CSS">\n            <i class="icon icon-close"></i>\n          </button>\n        </div>\n        <div class="editor-bar-pane editor-bar-pane-js">\n          ' + createSelect('js', options.js, selected.js) + '\n\n          <button type="button" class="editor-bar-pane-close editor-bar-pane-close-js btn" title="Hide JavaScript">\n            <i class="icon icon-close"></i>\n          </button>\n        </div>\n        <div class="editor-bar-pane"></div>\n      </div>\n    ';
  };
}

module.exports = EditorBar;

},{}],7:[function(require,module,exports){
'use strict';

/* editor widget
 */

var util = require('../../util');
var Jotted = require('jotted');
var globalActions;

// jotted plugin
Jotted.plugin('siloz', function (jotted, options) {
  jotted.on('change', function (params, callback) {
    globalActions.updateFile({
      type: params.type,
      content: params.content
    });

    callback(null, params);
  }, 2);
});

var pluginLibs = {
  markdown: ['https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.6/marked.min.js'],
  less: ['https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.1/less.min.js'],
  stylus: ['/libs/stylus.min.js'],
  coffeescript: ['https://cdn.rawgit.com/jashkenas/coffeescript/1.11.1/extras/coffee-script.js'],
  es2015: ['https://cdnjs.cloudflare.com/ajax/libs/babel-core/6.1.19/browser.min.js']
};

function EditorWidget(actions) {
  globalActions = actions;

  this.mount = function ($container) {
    var plugins = actions.getPlugins();
    var libs = [];

    // load libs
    Object.keys(pluginLibs).forEach(function (name) {
      if (plugins.indexOf(name) !== -1) {
        Array.prototype.push.apply(libs, pluginLibs[name].map(function (url) {
          return function (done) {
            util.loadScript(url, done);
          };
        }));
      }
    });

    Array.prototype.push.apply(plugins, ['siloz', {
      name: 'codemirror',
      options: {
        theme: actions.getTheme(),
        lineWrapping: true
      }
    }]);

    util.async(libs, function () {
      /* eslint-disable no-new */
      new Jotted($container, {
        files: actions.getFiles(),
        plugins: plugins
      });
    });
  };

  this.render = function () {
    return '<div class="editor-widget jotted-theme-siloz"></div>';
  };
}

module.exports = EditorWidget;

},{"../../util":20,"jotted":3}],8:[function(require,module,exports){
'use strict';

/* editor
 */

var durruti = require('durruti');
var EditorBar = require('./editor-bar');
var EditorWidget = require('./editor-widget');

function Editor(actions) {
  var panes = actions.getPanes();
  console.log('panes', panes);
  this.render = function () {
    return '\n      <div class="editor\n        ' + (panes.html.hidden ? 'editor-is-hidden-html' : '') + '\n        ' + 'editor-is-hidden-css' + '\n        ' + (panes.js.hidden ? 'editor-is-hidden-js' : '') + '\n      ">\n        ' + durruti.render(new EditorBar(actions)) + '\n        ' + durruti.render(new EditorWidget(actions)) + '\n      </div>\n    ';
  };
}

module.exports = Editor;

},{"./editor-bar":6,"./editor-widget":7,"durruti":1}],9:[function(require,module,exports){
'use strict';

/* about
 */

var util = require('../../util');
var Popup = require('../popup');

function Help(actions, actionsInternal) {
  var self = util.inherits(this, Popup);
  Popup.call(self, 'about', actionsInternal);

  self.mount = self.super.mount.bind(self);
  self.unmount = self.super.unmount.bind(self);

  self.render = function () {
    return self.super.render.call(self, 'About', '\n      <p>\n        <a href="/">siloz.io</a> is a private code playground in the browser.\n      </p>\n\n      <p>\n        Your source code is saved in the URL and never reaches our servers.\n      </p>\n\n      <p>\n        Use HTML, CSS and JavaScript, along with processors like CoffeeScript, Babel/ES2015, Less, Stylus or Markdown.\n      </p>\n\n      <h2>\n        Short URLs\n      </h2>\n\n      <p>\n        siloz.io can generate shorter urls, at a privacy cost.\n      </p>\n\n      <p>\n        When a short url is generated, the url  - that includes the source code - is saved on the server, along with a unique token.\n      </p>\n\n      <p>\n        <a href="https://github.com/ghinda/siloz.io" target="_blank">\n          Source code available on GitHub.\n        </a>\n      </p>\n    ');
  };

  return self;
}

module.exports = Help;

},{"../../util":20,"../popup":14}],10:[function(require,module,exports){
'use strict';

/* header
 */

var durruti = require('durruti');
var Settings = require('./settings');
var Share = require('./share');
var About = require('./about');

var InternalStore = require('../../state/store-internal');
var storeInternal = new InternalStore();

function Header(actions) {
  var $container;
  var data = storeInternal.get();
  var actionsInternal = storeInternal.actions;
  var loadingCollaborate = actionsInternal.getLoading('collaborate');

  var change = function change() {
    var newData = storeInternal.get();

    // if something changed.
    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      durruti.render(new Header(actions), $container);
    }
  };

  function doneLoadingCollaborate() {
    actionsInternal.updateLoading('collaborate', false);
  }

  this.mount = function ($node) {
    $container = $node;

    $container.querySelector('.collaborate').addEventListener('click', function () {
      // loading
      actionsInternal.updateLoading('collaborate', true);

      window.TogetherJS();

      window.TogetherJS.on('ready', doneLoadingCollaborate);
      window.TogetherJS.on('close', doneLoadingCollaborate);
    });

    storeInternal.on('change', change);
  };

  this.unmount = function () {
    if (window.TogetherJS) {
      window.TogetherJS.off('ready', doneLoadingCollaborate);
      window.TogetherJS.off('close', doneLoadingCollaborate);
    }

    storeInternal.off('change', change);
  };

  this.render = function () {
    // 
    return '\n       <div class="row">\n       <button type="button" class="btn btn-small collaborate btn-small btn-default ' + (loadingCollaborate ? 'is-loading' : '') + '">\n          Collaborate\n        </button>\n       </div>\n       <div class="row" style="display:none">\t       \n\t\t ' + durruti.render(new Settings(actions, storeInternal.actions)) + '\n         ' + durruti.render(new Share(actions, storeInternal.actions)) + '\n       </div>\n     \n     \n    ';
  };
}

module.exports = Header;

},{"../../state/store-internal":18,"./about":9,"./settings":11,"./share":12,"durruti":1}],11:[function(require,module,exports){
'use strict';

/* settings
 */

var util = require('../../util');
var Popup = require('../popup');

function Settings(actions, actionsInternal) {
  var self = util.inherits(this, Popup);
  Popup.call(self, 'settings', actionsInternal);

  var panes = actions.getPanes();
  var theme = actions.getTheme();

  function togglePane(type) {
    return function (e) {
      var panes = {};
      panes[type] = { hidden: !e.target.checked };
      return actions.updatePanes(panes);
    };
  }

  function setTheme() {
    actions.updateTheme(this.value);
  }

  self.mount = function ($container) {
    self.super.mount.call(self, $container);

    var $showHtml = $container.querySelector('.settings-show-html');
    var $showCss = $container.querySelector('.settings-show-css');
    var $showJs = $container.querySelector('.settings-show-js');

    $showHtml.addEventListener('change', togglePane('html'));
    $showCss.addEventListener('change', togglePane('css'));
    $showJs.addEventListener('change', togglePane('js'));

    $container.querySelector('.settings-theme').addEventListener('change', setTheme);
  };

  self.unmount = self.super.unmount.bind(self);

  self.render = function () {
    return self.super.render.call(self, 'Settings', '\n      <fieldset>\n        <legend>\n          Tabs\n        </legend>\n\n        <label>\n          <input type="checkbox" class="settings-show-html" ' + (!panes.html.hidden ? 'checked' : '') + '>\n          HTML\n        </label>\n\n        <label>\n          <input type="checkbox" class="settings-show-css" ' + (!panes.css.hidden ? 'checked' : '') + '>\n          CSS\n        </label>\n\n        <label>\n          <input type="checkbox" class="settings-show-js" ' + (!panes.js.hidden ? 'checked' : '') + '>\n          JavaScript\n        </label>\n      </fieldset>\n\n      <fieldset>\n        <legend>\n          Theme\n        </legend>\n\n        <select class="settings-theme select">\n          <option value="solarized light" ' + (theme === 'solarized light' ? 'selected' : '') + '>\n            Solarized Light\n          </option>\n          <option value="solarized dark" ' + (theme === 'solarized dark' ? 'selected' : '') + '>\n            Solarized Dark\n          </option>\n        </select>\n      </fieldset>\n    ');
  };

  return self;
}

module.exports = Settings;

},{"../../util":20,"../popup":14}],12:[function(require,module,exports){
'use strict';

/* share
 */

var util = require('../../util');
var Popup = require('../popup');

function Share(actions, actionsInternal) {
  var self = util.inherits(this, Popup);
  Popup.call(self, 'share', actionsInternal);

  var shortUrl = actions.getShortUrl();
  var longUrl = '';
  var watcher;

  var generating = actionsInternal.getLoading('generate-url');

  if (typeof window !== 'undefined') {
    longUrl = window.location.href;
  }

  function copy($input) {
    return function (e) {
      var $btn = util.closest(e.target, '.btn');

      $input.select();

      try {
        document.execCommand('copy');

        $btn.innerHTML = 'Copied';
        setTimeout(function () {
          $btn.innerHTML = 'Copy';
        }, 2000);
      } catch (err) {}
    };
  }

  function generate() {
    // loading
    actionsInternal.updateLoading('generate-url', true);

    actions.updateShortUrl(function () {
      actionsInternal.updateLoading('generate-url', false);
    });
  }

  self.mount = function ($container) {
    self.super.mount.call(self, $container);

    var $shortUrl = $container.querySelector('.share-url-input-short');
    var $shortUrlCopy = $container.querySelector('.share-url-copy-short');
    var $longUrl = $container.querySelector('.share-url-input-long');
    var $longUrlCopy = $container.querySelector('.share-url-copy-long');

    $shortUrlCopy.addEventListener('click', copy($shortUrl));
    $longUrlCopy.addEventListener('click', copy($longUrl));

    var $generateShort = $container.querySelector('.share-generate');
    $generateShort.addEventListener('click', generate);

    if (shortUrl) {
      // give it a sec,
      // to not trigger url update on load,
      // and force url generation even if nothing was changed,
      // on foreign clients.
      watcher = setTimeout(function () {
        actions.startShortUrlUpdater();
      }, 1000);
    }
  };

  self.unmount = function () {
    self.super.unmount.call(self);

    if (watcher) {
      clearTimeout(watcher);
    }

    if (shortUrl) {
      actions.stopShortUrlUpdater();
    }
  };

  self.render = function () {
    return self.super.render.call(self, 'Share', '\n      <fieldset class="' + (shortUrl ? 'share-is-generated' : '') + '">\n        <legend>\n          Short URL\n        </legend>\n\n        <button type="button" class="btn btn-primary share-generate ' + (generating ? 'is-loading' : '') + '">\n          Generate Short URL\n        </button>\n\n        <div class="share-url share-url-short">\n          <input type="text" class="share-url-input share-url-input-short" value="' + shortUrl + '" readonly>\n          <button type="button" class="btn share-url-copy share-url-copy-short">\n            Copy\n          </button>\n        </div>\n      </fieldset>\n      <fieldset>\n        <legend>\n          Persistent URL\n        </legend>\n\n        <div class="share-url">\n          <input type="text" class="share-url-input share-url-input-long" value="' + longUrl + '" readonly>\n          <button type="button" class="btn share-url-copy share-url-copy-long">\n            Copy\n          </button>\n        </div>\n      </fieldset>\n    ');
  };

  return self;
}

module.exports = Share;

},{"../../util":20,"../popup":14}],13:[function(require,module,exports){
'use strict';

/* main
 */

var durruti = require('durruti');
var Header = require('./header/header');
var Editor = require('./editor/editor');

var GlobalStore = require('../state/store');
var store = new GlobalStore();

function Main() {
  var $container;
  var data = store.get();
  var theme = store.actions.getTheme();
  var change = function change() {
    var newData = store.get();

    // don't compare files
    delete data.files;
    delete newData.files;

    // if something changed,
    // except the files.

    if (JSON.stringify(data) !== JSON.stringify(newData)) {
      durruti.render(Main, $container);
    }
  };

  this.mount = function ($node) {
    $container = $node;
    console.log('MOUNT', $node);
    store.on('change', change);
  };

  this.unmount = function () {
    console.log('uMOUNT');
    store.off('change', change);
  };

  this.render = function () {
    return '\n      <div class="main siloz-theme-' + theme.replace(/ /g, '-') + '">\n        ' + durruti.render(new Header(store.actions)) + '\n        ' + durruti.render(new Editor(store.actions)) + '\n      </div>\n    ';
  };
}

module.exports = Main;

},{"../state/store":19,"./editor/editor":8,"./header/header":10,"durruti":1}],14:[function(require,module,exports){
'use strict';

/* popup
 */

var util = require('../util');

function Popup(name, actions) {
  this.name = name;
  this.state = actions.getPopup(name);
  this.actions = actions;
  this.togglePopup = this.prototype.togglePopup.bind(this);
  this.hidePopup = this.prototype.hidePopup.bind(this);
}

Popup.prototype.togglePopup = function () {
  this.state = !this.state;
  this.actions.updatePopup(this.name, this.state);
};

Popup.prototype.hidePopup = function (e) {
  if (util.closest(e.target, '.popup') || e.target === this.$button || !this.state) {
    return;
  }

  this.actions.updatePopup(this.name, false);
};

Popup.prototype.mount = function ($container) {
  this.$container = $container;
  this.$button = $container.querySelector('.popup-button');

  this.$button.addEventListener('click', this.togglePopup);
  document.addEventListener('click', this.hidePopup);
};

Popup.prototype.unmount = function () {
  document.removeEventListener('click', this.hidePopup);
};

Popup.prototype.render = function (title, content) {
  return '\n    <div class="popup-container ' + this.name + ' ' + (this.state ? 'popup-container-is-open' : '') + '">\n      <button type="button" class="' + this.name + '-button popup-button btn">\n        ' + title + '\n      </button>\n\n      <form class="' + this.name + '-popup popup">\n        ' + content + '\n      </form>\n    </div>\n  ';
};

module.exports = Popup;

},{"../util":20}],15:[function(require,module,exports){
"use strict";

/* store actions
 */

function actions(store) {
  function getPopup(name) {
    return store.get().popup[name];
  }

  function updatePopup(name, state) {
    var data = store.get();
    data.popup[name] = state;

    store.set(data);
  }

  function getLoading(name) {
    return store.get().loading[name];
  }

  function updateLoading(name, state) {
    var data = store.get();
    data.loading[name] = state;

    store.set(data);
  }

  return {
    getPopup: getPopup,
    updatePopup: updatePopup,

    getLoading: getLoading,
    updateLoading: updateLoading
  };
}

module.exports = actions;

},{}],16:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* store actions
 */

var util = require('../util');
var shortUrlService = require('./short-url');

function actions(store) {
  function getFiles() {
    var files = store.get().files;
    console.log("GETFILES", files, store);
    if (files[0].content.length == 0) {

      files[0].content += '<div class="container">';
      files[0].content += "\n\r\n\r";
      files[0].content += "<!-- Your View Code -->";
      files[0].content += "\n\r\n\r";
      files[0].content += "\n\r\n\r";
      files[0].content += "<!-- /Your View Code -->";
      files[0].content += "\n\r\n\r";
      files[0].content += "</div>";
      files[0].content += "\n\r\n\r";
      files[0].content += "\n\r\n\r";
      files[0].content += "\n\r\n\r";
      files[0].content += '<script src="https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject/dist/loader.js"></script>';
      files[0].content += '<script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>';
      files[0].content += '<link href="https://demo.stromdao.de/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>';
      files[0].content += '<script src="https://demo.stromdao.de/js/bootstrap.min.js"></script>';
      files[0].content += "\n\r\n\r";

      files[2].content = "var node = new document.StromDAOBO.Node({external_id:$('#extid').val(),testMode:true,rpc:\"https://demo.stromdao.de/rpc\",abilocation:\"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@6dc9e073/smart_contracts/\"});";
    }
    return files;
  }

  function updateFile(newFile) {
    var data = store.get();

    data.files.some(function (file, index) {
      if (file.type === newFile.type) {
        data.files[index] = util.extend(newFile, data.files[index]);
        return true;
      }
    });

    return store.set(data);
  }

  function getPlugins() {
    return store.get().plugins;
  }

  function addPlugin(newPlugin) {
    var data = store.get();

    data.plugins.push(newPlugin);
    return store.set(data);
  }

  function removePlugin(oldPlugin) {
    var data = store.get();
    var pluginName = '';

    if ((typeof oldPlugin === 'undefined' ? 'undefined' : _typeof(oldPlugin)) === 'object') {
      pluginName = oldPlugin.name;
    } else {
      pluginName = oldPlugin;
    }

    data.plugins.some(function (plugin, index) {
      if ((typeof plugin === 'undefined' ? 'undefined' : _typeof(plugin)) === 'object' && plugin.name === pluginName || typeof plugin === 'string' && plugin === pluginName) {
        data.plugins.splice(index, 1);
        return true;
      }
    });

    return store.set(data);
  }

  function getPanes() {
    return store.get().panes;
  }

  function updatePanes(newPanes) {
    var data = store.get();
    data.panes = util.extend(newPanes, data.panes);

    return store.set(data);
  }

  function getTheme() {
    return store.get().theme;
  }

  function updateTheme(theme) {
    var data = store.get();
    data.theme = theme;

    return store.set(data);
  }

  function getShortUrl() {
    return store.get().short_url;
  }

  var longUrl = '';

  function updateShortUrl(force) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    // force not defined, but callback is
    if (typeof force === 'function') {
      callback = force;
      force = false;
    }

    // existing short_url's,
    // check if window.location.href is not already saved
    // and update link.
    var shortUrl = getShortUrl();
    if (!shortUrl || force) {
      longUrl = window.location.href;

      shortUrlService.create({
        long_url: longUrl
      }, function (err, res) {
        if (err) {
          return console.log(err);
        }

        var data = store.get();
        data.short_url = res.short_url;
        store.set(data);

        // after short_url is added to hash,
        // update long_url to point to url with hash.
        longUrl = window.location.href;

        // update existing short url
        shortUrlService.update({
          long_url: longUrl,
          short_url: res.short_url
        }, function (err, res) {
          if (err) {
            return console.log(err);
          }

          callback();
        });
      });
    } else if (longUrl !== window.location.href) {
      longUrl = window.location.href;

      // update existing short url
      shortUrlService.update({
        long_url: longUrl,
        short_url: shortUrl
      }, function (err, res) {
        if (err) {
          // stop url updater.
          stopShortUrlUpdater();

          // delete existing short_url
          var data = store.get();
          data.short_url = '';
          store.set(data);

          return console.log(err);
        }

        callback();
      });
    }
  }

  var debouncedUpdateShortUrl = util.debounce(updateShortUrl, 500);

  function startShortUrlUpdater() {
    // update short url when data changes
    store.on('change', debouncedUpdateShortUrl);
  }

  function stopShortUrlUpdater() {
    // stop monitoring data changes
    store.off('change', debouncedUpdateShortUrl);
  }

  return {
    getFiles: getFiles,
    updateFile: updateFile,

    getPlugins: getPlugins,
    addPlugin: addPlugin,
    removePlugin: removePlugin,

    getPanes: getPanes,
    updatePanes: updatePanes,

    getTheme: getTheme,
    updateTheme: updateTheme,

    getShortUrl: getShortUrl,
    updateShortUrl: updateShortUrl,
    startShortUrlUpdater: startShortUrlUpdater,
    stopShortUrlUpdater: stopShortUrlUpdater
  };
}

module.exports = actions;

},{"../util":20,"./short-url":17}],17:[function(require,module,exports){
'use strict';

/* short url api
 */

// env detection
var env = 'local';
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  env = 'live';
}

var apiUrl = 'http://localhost:3000';
var shortUrl = apiUrl;

if (env !== 'local') {
  apiUrl = 'https://prajina-ghinda.rhcloud.com';
  shortUrl = 'http://s.siloz.io';
}

var util = require('../util');

var sessionKey = 'siloz-io';

function getSession() {
  try {
    var cache = window.localStorage.getItem(sessionKey);
    if (cache) {
      return JSON.parse(cache);
    }
  } catch (e) {
    return {};
  }

  return {};
}

var session = getSession();

function saveSession(newSession) {
  session = util.extend(newSession, session);

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

function create(data) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  util.fetch(apiUrl + '/api/', {
    type: 'POST',
    data: data
  }, function (err, res) {
    if (err) {
      return callback(err);
    }

    // set full url for shorturl
    res.short_url = shortUrl + '/' + res.short_url;

    // save session
    saveSession({
      token: res.token
    });

    callback(null, res);
  });
}

function update(data) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  // remove api url from short_url
  data.short_url = data.short_url.replace(shortUrl + '/', '');

  // add token
  data.token = session.token;

  util.fetch(apiUrl + '/api/', {
    type: 'PUT',
    data: data
  }, function (err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res);
  });
}

module.exports = {
  create: create,
  update: update
};

},{"../util":20}],18:[function(require,module,exports){
'use strict';

/* internal store,
 * not stored in url
 */

var Store = require('durruti/store');
var actions = require('./actions-internal');

var defaults = {
  popup: {},
  loading: {}
};

var InternalStore = function InternalStore() {
  Store.call(this);
  this.actions = actions(this);

  this.set(defaults);
};

InternalStore.prototype = Object.create(Store.prototype);

module.exports = InternalStore;

},{"./actions-internal":15,"durruti/store":2}],19:[function(require,module,exports){
'use strict';

/* store
 */

var Store = require('durruti/store');
var LZString = require('lz-string');
var actions = require('./actions');
var util = require('../util');

var defaults = {
  version: 1,
  files: [{
    type: 'html',
    content: ''
  }, {
    type: 'css',
    content: ''
  }, {
    type: 'js',
    content: ''
  }],
  plugins: [],
  theme: 'solarized light',

  // pane properties (hidden, etc)
  panes: {
    html: {},
    css: {},
    js: {}
  },

  short_url: ''
};

function replaceLocationHash() {
  if (typeof window === 'undefined') {
    return function () {};
  }

  if (typeof window.history.replaceState !== 'undefined') {
    return function (hash) {
      window.history.replaceState(null, null, '#' + hash);
    };
  } else {
    return function (hash) {
      window.location.replace(window.location.href.split('#')[0] + '#' + hash);
    };
  }
}

function parseHash() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(util.hash('s')));
  } catch (err) {}

  return null;
}

var GlobalStore = function GlobalStore() {
  var _this = this;

  Store.call(this);
  this.actions = actions(this);

  var replaceHash = replaceLocationHash();
  var compressedData = '';

  var hashData = parseHash();
  if (hashData) {
    this.set(util.extend(hashData, defaults));
  } else {
    this.set(defaults);
  }

  this.on('change', function () {
    // save in hash
    var data = _this.get();
    if (data.files[0].content.length == 0) {
      data.files[0].content = "<h1>Danke!</h1>";
    }
    console.log('SAVE DATA', data);
    compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(data));
    replaceHash(util.hash('s', compressedData));
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', function () {
      // force page reload if only hash changed,
      // and compressed data is different.
      // eg. manually changing url hash.
      if (util.hash('s') !== compressedData) {
        window.location.reload();
      }
    });
  }
};

GlobalStore.prototype = Object.create(Store.prototype);

module.exports = GlobalStore;

},{"../util":20,"./actions":16,"durruti/store":2,"lz-string":4}],20:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* util
 */

function closest($elem, selector) {
  // find the closest parent that matches the selector
  var $matches;

  // loop through parents
  while ($elem && $elem !== document) {
    if ($elem.parentNode) {
      // find all siblings that match the selector
      $matches = $elem.parentNode.querySelectorAll(selector);
      // check if our element is matched (poor-man's Element.matches())
      if ([].indexOf.call($matches, $elem) !== -1) {
        return $elem;
      }

      // go up the tree
      $elem = $elem.parentNode;
    } else {
      return null;
    }
  }

  return null;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function extendLevel(obj) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // copy default keys where undefined
  Object.keys(defaults).forEach(function (key) {
    if (typeof obj[key] === 'undefined') {
      // default
      obj[key] = clone(defaults[key]);
    } else if (_typeof(obj[key]) === 'object') {
      extendLevel(obj[key], defaults[key]);
    }
  });

  return obj;
}

// multi-level object merge
function extend(obj, defaults) {
  if (obj === null) {
    obj = {};
  }

  return extendLevel(clone(obj), defaults);
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var callNow = immediate && !timeout;

    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function loadScript(url) {
  var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var $script = document.createElement('script');
  $script.src = url;
  document.body.appendChild($script);

  $script.onload = done;
}

function async(arr, done) {
  var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (arr.length === i) {
    return done();
  }

  arr[i](function () {
    i++;
    async(arr, done, i);
  });
}

function fetch(path, options, callback) {
  // options not specified
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend(options, {
    type: 'GET',
    data: {}
  });

  callback = callback || function () {};

  var request = new window.XMLHttpRequest();
  request.open(options.type, path);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // success
      var data = JSON.parse(request.responseText || '{}');

      callback(null, data);
    } else {
      // error
      callback(request);
    }
  };

  request.onerror = function () {
    // error
    callback(request);
  };

  request.send(JSON.stringify(options.data));
}

function inherits(baseClass, superClass) {
  baseClass.prototype = Object.create(superClass.prototype);
  baseClass.prototype.constructor = baseClass;

  baseClass.super = Object.getPrototypeOf(baseClass.prototype);

  return baseClass;
}

function hash(key, value) {
  var hashParts = [];
  if (window.location.hash) {
    hashParts = window.location.hash.substr(1).split('&');
  }

  var parsedHash = {};
  var stringHash = '';

  hashParts.forEach(function (part, i) {
    var subParts = part.split('=');
    parsedHash[subParts[0]] = subParts[1] || '';
  });

  if (key) {
    if (value) {
      parsedHash[key] = value;
    } else {
      return parsedHash[key];
    }
  }

  // rebuild to string
  Object.keys(parsedHash).forEach(function (key, i) {
    if (i > 0) {
      stringHash += '&';
    }

    stringHash += key;

    if (parsedHash[key]) {
      stringHash += '=' + parsedHash[key];
    }
  });

  return stringHash;
}

module.exports = {
  clone: clone,
  extend: extend,
  closest: closest,
  debounce: debounce,
  loadScript: loadScript,
  async: async,
  fetch: fetch,
  hash: hash,

  inherits: inherits
};

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZHVycnV0aS9kdXJydXRpLmpzIiwibm9kZV9tb2R1bGVzL2R1cnJ1dGkvc3RvcmUuanMiLCJub2RlX21vZHVsZXMvam90dGVkL2pvdHRlZC5qcyIsIm5vZGVfbW9kdWxlcy9sei1zdHJpbmcvbGlicy9sei1zdHJpbmcuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NvbXBvbmVudHMvZWRpdG9yL2VkaXRvci1iYXIuanMiLCJzcmMvY29tcG9uZW50cy9lZGl0b3IvZWRpdG9yLXdpZGdldC5qcyIsInNyYy9jb21wb25lbnRzL2VkaXRvci9lZGl0b3IuanMiLCJzcmMvY29tcG9uZW50cy9oZWFkZXIvYWJvdXQuanMiLCJzcmMvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmpzIiwic3JjL2NvbXBvbmVudHMvaGVhZGVyL3NldHRpbmdzLmpzIiwic3JjL2NvbXBvbmVudHMvaGVhZGVyL3NoYXJlLmpzIiwic3JjL2NvbXBvbmVudHMvbWFpbi5qcyIsInNyYy9jb21wb25lbnRzL3BvcHVwLmpzIiwic3JjL3N0YXRlL2FjdGlvbnMtaW50ZXJuYWwuanMiLCJzcmMvc3RhdGUvYWN0aW9ucy5qcyIsInNyYy9zdGF0ZS9zaG9ydC11cmwuanMiLCJzcmMvc3RhdGUvc3RvcmUtaW50ZXJuYWwuanMiLCJzcmMvc3RhdGUvc3RvcmUuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9oRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RCxFQUFPLENBQVAsRUFBYTtBQUM3QixRQUFJLFdBQVcsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFmO0FBQ0EsZUFBVyxTQUFTLENBQVQsQ0FBWCxJQUEwQixTQUFTLENBQVQsS0FBZSxFQUF6QztBQUNELEdBSEQ7O0FBS0EsTUFBSSxHQUFKLEVBQVM7QUFDUCxRQUFJLEtBQUosRUFBVztBQUNULGlCQUFXLEdBQVgsSUFBa0IsS0FBbEI7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLFdBQVcsR0FBWCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFNBQU8sSUFBUCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBQyxHQUFELEVBQU0sQ0FBTixFQUFZO0FBQzFDLFFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxvQkFBYyxHQUFkO0FBQ0Q7O0FBRUQsa0JBQWMsR0FBZDs7QUFFQSxRQUFJLFdBQVcsR0FBWCxDQUFKLEVBQXFCO0FBQ25CLDBCQUFrQixXQUFXLEdBQVgsQ0FBbEI7QUFDRDtBQUNGLEdBVkQ7O0FBWUEsU0FBTyxVQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsU0FBTyxLQURRO0FBRWYsVUFBUSxNQUZPO0FBR2YsV0FBUyxPQUhNO0FBSWYsWUFBVSxRQUpLO0FBS2YsY0FBWSxVQUxHO0FBTWYsU0FBTyxLQU5RO0FBT2YsU0FBTyxLQVBRO0FBUWYsUUFBTSxJQVJTOztBQVVmLFlBQVU7QUFWSyxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuZHVycnV0aSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAvKiBEdXJydXRpXG4gICAqIFV0aWxzLlxuICAgKi9cblxuICBmdW5jdGlvbiBoYXNXaW5kb3coKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgdmFyIGlzQ2xpZW50ID0gaGFzV2luZG93KCk7XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH1cblxuICAvLyBvbmUtbGV2ZWwgb2JqZWN0IGV4dGVuZFxuXG5cbiAgdmFyIERVUlJVVElfREVCVUcgPSB0cnVlO1xuXG4gIGZ1bmN0aW9uIHdhcm4oKSB7XG4gICAgaWYgKERVUlJVVElfREVCVUcgPT09IHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qIER1cnJ1dGlcbiAgICogQ2FwdHVyZSBhbmQgcmVtb3ZlIGV2ZW50IGxpc3RlbmVycy5cbiAgICovXG5cbiAgdmFyIF9yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoKSB7fTtcblxuICAvLyBjYXB0dXJlIGFsbCBsaXN0ZW5lcnNcbiAgdmFyIGV2ZW50cyA9IFtdO1xuICB2YXIgZG9tRXZlbnRUeXBlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGdldERvbUV2ZW50VHlwZXMoKSB7XG4gICAgdmFyIGV2ZW50VHlwZXMgPSBbXTtcbiAgICBmb3IgKHZhciBhdHRyIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyBzdGFydHMgd2l0aCBvblxuICAgICAgaWYgKGF0dHIuc3Vic3RyKDAsIDIpID09PSAnb24nKSB7XG4gICAgICAgIGV2ZW50VHlwZXMucHVzaChhdHRyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZXZlbnRUeXBlcztcbiAgfVxuXG4gIHZhciBvcmlnaW5hbEFkZEV2ZW50TGlzdGVuZXI7XG5cbiAgZnVuY3Rpb24gY2FwdHVyZUFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGNhcHR1cmUpIHtcbiAgICBvcmlnaW5hbEFkZEV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGV2ZW50cy5wdXNoKHtcbiAgICAgIHRhcmdldDogdGhpcyxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBmbjogZm4sXG4gICAgICBjYXB0dXJlOiBjYXB0dXJlXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVOb2RlRXZlbnRzKCRub2RlKSB7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBldmVudHMubGVuZ3RoKSB7XG4gICAgICBpZiAoZXZlbnRzW2ldLnRhcmdldCA9PT0gJG5vZGUpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyXG4gICAgICAgICRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2ldLnR5cGUsIGV2ZW50c1tpXS5mbiwgZXZlbnRzW2ldLmNhcHR1cmUpO1xuXG4gICAgICAgIC8vIHJlbW92ZSBldmVudFxuICAgICAgICBldmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICBpLS07XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgb24qIGxpc3RlbmVyc1xuICAgIGRvbUV2ZW50VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRUeXBlKSB7XG4gICAgICAkbm9kZVtldmVudFR5cGVdID0gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpc0NsaWVudCkge1xuICAgIGRvbUV2ZW50VHlwZXMgPSBnZXREb21FdmVudFR5cGVzKCk7XG5cbiAgICAvLyBjYXB0dXJlIGFkZEV2ZW50TGlzdGVuZXJcblxuICAgIC8vIElFXG4gICAgaWYgKHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnYWRkRXZlbnRMaXN0ZW5lcicpKSB7XG4gICAgICBvcmlnaW5hbEFkZEV2ZW50TGlzdGVuZXIgPSB3aW5kb3cuTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgICAgIHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gY2FwdHVyZUFkZEV2ZW50TGlzdGVuZXI7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuRXZlbnRUYXJnZXQucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdhZGRFdmVudExpc3RlbmVyJykpIHtcbiAgICAgIC8vIHN0YW5kYXJkXG4gICAgICBvcmlnaW5hbEFkZEV2ZW50TGlzdGVuZXIgPSB3aW5kb3cuRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI7XG4gICAgICB3aW5kb3cuRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBjYXB0dXJlQWRkRXZlbnRMaXN0ZW5lcjtcbiAgICB9XG5cbiAgICAvLyB0cmF2ZXJzZSBhbmQgcmVtb3ZlIGFsbCBldmVudHMgbGlzdGVuZXJzIGZyb20gbm9kZXNcbiAgICBfcmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCRub2RlLCB0cmF2ZXJzZSkge1xuICAgICAgcmVtb3ZlTm9kZUV2ZW50cygkbm9kZSk7XG5cbiAgICAgIC8vIHRyYXZlcnNlIGVsZW1lbnQgY2hpbGRyZW5cbiAgICAgIGlmICh0cmF2ZXJzZSAmJiAkbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgX3JlbW92ZUxpc3RlbmVycygkbm9kZS5jaGlsZHJlbltpXSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIHJlbW92ZUxpc3RlbmVycyQxID0gX3JlbW92ZUxpc3RlbmVycztcblxuICAvKiBEdXJydXRpXG4gICAqIERPTSBwYXRjaCAtIG1vcnBocyBhIERPTSBub2RlIGludG8gYW5vdGhlci5cbiAgICovXG5cbiAgZnVuY3Rpb24gdHJhdmVyc2UoJG5vZGUsICRuZXdOb2RlLCBwYXRjaGVzKSB7XG4gICAgLy8gdHJhdmVyc2VcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRpZmYoJG5vZGUuY2hpbGROb2Rlc1tpXSwgJG5ld05vZGUuY2hpbGROb2Rlc1tpXSwgcGF0Y2hlcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFwQXR0cmlidXRlcygkbm9kZSwgJG5ld05vZGUpIHtcbiAgICB2YXIgYXR0cnMgPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnNbJG5vZGUuYXR0cmlidXRlc1tpXS5uYW1lXSA9IG51bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8ICRuZXdOb2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICBhdHRyc1skbmV3Tm9kZS5hdHRyaWJ1dGVzW19pXS5uYW1lXSA9ICRuZXdOb2RlLmF0dHJpYnV0ZXNbX2ldLnZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoQXR0cnMoJG5vZGUsICRuZXdOb2RlKSB7XG4gICAgLy8gbWFwIGF0dHJpYnV0ZXNcbiAgICB2YXIgYXR0cnMgPSBtYXBBdHRyaWJ1dGVzKCRub2RlLCAkbmV3Tm9kZSk7XG5cbiAgICAvLyBhZGQtY2hhbmdlIGF0dHJpYnV0ZXNcbiAgICBmb3IgKHZhciBwcm9wIGluIGF0dHJzKSB7XG4gICAgICBpZiAoIWF0dHJzW3Byb3BdKSB7XG4gICAgICAgICRub2RlLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblxuICAgICAgICAvLyBjaGVja2VkIG5lZWRzIGV4dHJhIHdvcmtcbiAgICAgICAgaWYgKHByb3AgPT09ICdjaGVja2VkJykge1xuICAgICAgICAgICRub2RlLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJzW3Byb3BdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkaWZmKCRub2RlLCAkbmV3Tm9kZSkge1xuICAgIHZhciBwYXRjaGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICAgIHZhciBwYXRjaCA9IHtcbiAgICAgIG5vZGU6ICRub2RlLFxuICAgICAgbmV3Tm9kZTogJG5ld05vZGVcbiAgICB9O1xuXG4gICAgLy8gcHVzaCB0cmF2ZXJzZWQgbm9kZSB0byBwYXRjaCBsaXN0XG4gICAgcGF0Y2hlcy5wdXNoKHBhdGNoKTtcblxuICAgIC8vIGZhc3RlciB0aGFuIG91dGVyaHRtbFxuICAgIGlmICgkbm9kZS5pc0VxdWFsTm9kZSgkbmV3Tm9kZSkpIHtcbiAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lcnMgb24gbm9kZSBhbmQgY2hpbGRyZW5cbiAgICAgIHJlbW92ZUxpc3RlbmVycyQxKCRub2RlLCB0cnVlKTtcblxuICAgICAgcmV0dXJuIHBhdGNoZXM7XG4gICAgfVxuXG4gICAgLy8gaWYgb25lIG9mIHRoZW0gaXMgbm90IGFuIGVsZW1lbnQgbm9kZSxcbiAgICAvLyBvciB0aGUgdGFnIGNoYW5nZWQsXG4gICAgLy8gb3Igbm90IHRoZSBzYW1lIG51bWJlciBvZiBjaGlsZHJlbi5cbiAgICBpZiAoJG5vZGUubm9kZVR5cGUgIT09IDEgfHwgJG5ld05vZGUubm9kZVR5cGUgIT09IDEgfHwgJG5vZGUudGFnTmFtZSAhPT0gJG5ld05vZGUudGFnTmFtZSB8fCAkbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gJG5ld05vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHBhdGNoLnJlcGxhY2UgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRjaC51cGRhdGUgPSB0cnVlO1xuXG4gICAgICAvLyByZW1vdmUgbGlzdGVuZXJzIG9uIG5vZGVcbiAgICAgIHJlbW92ZUxpc3RlbmVycyQxKCRub2RlKTtcblxuICAgICAgLy8gdHJhdmVyc2UgY2hpbGROb2Rlc1xuICAgICAgdHJhdmVyc2UoJG5vZGUsICRuZXdOb2RlLCBwYXRjaGVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0Y2hlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5UGF0Y2gocGF0Y2gpIHtcbiAgICBpZiAocGF0Y2gucmVwbGFjZSkge1xuICAgICAgcGF0Y2gubm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChwYXRjaC5uZXdOb2RlLCBwYXRjaC5ub2RlKTtcbiAgICB9IGVsc2UgaWYgKHBhdGNoLnVwZGF0ZSkge1xuICAgICAgcGF0Y2hBdHRycyhwYXRjaC5ub2RlLCBwYXRjaC5uZXdOb2RlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXRjaChwYXRjaGVzKSB7XG4gICAgcGF0Y2hlcy5mb3JFYWNoKGFwcGx5UGF0Y2gpO1xuXG4gICAgcmV0dXJuIHBhdGNoZXM7XG4gIH1cblxuICB2YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gIH07XG5cblxuXG5cblxuICB2YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH07XG4gIH0oKTtcblxuXG5cblxuXG5cblxuICB2YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICB9O1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgdmFyIHNldCA9IGZ1bmN0aW9uIHNldChvYmplY3QsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG5cbiAgICAgIGlmIChwYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgc2V0KHBhcmVudCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7XG4gICAgICBkZXNjLnZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzZXR0ZXIgPSBkZXNjLnNldDtcblxuICAgICAgaWYgKHNldHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNldHRlci5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qIER1cnJ1dGlcbiAgICogTWljcm8gSXNvbW9ycGhpYyBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGJ1aWxkaW5nIHVzZXIgaW50ZXJmYWNlcy5cbiAgICovXG5cbiAgdmFyIGR1cnJ1dGlBdHRyID0gJ2RhdGEtZHVycnV0aS1pZCc7XG4gIHZhciBkdXJydXRpRWxlbVNlbGVjdG9yID0gJ1snICsgZHVycnV0aUF0dHIgKyAnXSc7XG4gIHZhciBjb21wb25lbnRDYWNoZSA9IFtdO1xuICB2YXIgY29tcG9uZW50SW5kZXggPSAwO1xuXG4gIC8vIGRlY29yYXRlIGEgYmFzaWMgY2xhc3Mgd2l0aCBkdXJydXRpIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgZnVuY3Rpb24gZGVjb3JhdGUoQ29tcCkge1xuICAgIHZhciBjb21wb25lbnQ7XG5cbiAgICAvLyBpbnN0YW50aWF0ZSBjbGFzc2VzXG4gICAgaWYgKHR5cGVvZiBDb21wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wb25lbnQgPSBuZXcgQ29tcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgY2hhbmdlIHRoZSBpZCBvbiBhIGNhY2hlZCBjb21wb25lbnRcbiAgICAgIGNvbXBvbmVudCA9IE9iamVjdC5jcmVhdGUoQ29tcCk7XG4gICAgfVxuXG4gICAgLy8gY29tcG9uZW50cyBnZXQgYSBuZXcgaWQgb24gcmVuZGVyLFxuICAgIC8vIHNvIHdlIGNhbiBjbGVhciB0aGUgcHJldmlvdXMgY29tcG9uZW50IGNhY2hlLlxuICAgIGNvbXBvbmVudC5fZHVycnV0aUlkID0gU3RyaW5nKGNvbXBvbmVudEluZGV4KyspO1xuXG4gICAgLy8gY2FjaGUgY29tcG9uZW50XG4gICAgY29tcG9uZW50Q2FjaGUucHVzaCh7XG4gICAgICBpZDogY29tcG9uZW50Ll9kdXJydXRpSWQsXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENhY2hlZENvbXBvbmVudCgkbm9kZSkge1xuICAgIC8vIGdldCB0aGUgY29tcG9uZW50IGZyb20gdGhlIGRvbSBub2RlIC0gcmVuZGVyZWQgaW4gYnJvd3Nlci5cbiAgICBpZiAoJG5vZGUuX2R1cnJ1dGkpIHtcbiAgICAgIHJldHVybiAkbm9kZS5fZHVycnV0aTtcbiAgICB9XG5cbiAgICAvLyBvciBnZXQgaXQgZnJvbSB0aGUgY29tcG9uZW50IGNhY2hlIC0gcmVuZGVyZWQgb24gdGhlIHNlcnZlci5cbiAgICB2YXIgaWQgPSAkbm9kZS5nZXRBdHRyaWJ1dGUoZHVycnV0aUF0dHIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcG9uZW50Q2FjaGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb21wb25lbnRDYWNoZVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudENhY2hlW2ldLmNvbXBvbmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByZW1vdmUgY3VzdG9tIGRhdGEgYXR0cmlidXRlcyxcbiAgLy8gYW5kIGNhY2hlIHRoZSBjb21wb25lbnQgb24gdGhlIERPTSBub2RlLlxuICBmdW5jdGlvbiBjbGVhbkF0dHJOb2RlcygkY29udGFpbmVyLCBpbmNsdWRlUGFyZW50KSB7XG4gICAgdmFyIG5vZGVzID0gW10uc2xpY2UuY2FsbCgkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZHVycnV0aUVsZW1TZWxlY3RvcikpO1xuXG4gICAgaWYgKGluY2x1ZGVQYXJlbnQpIHtcbiAgICAgIG5vZGVzLnB1c2goJGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoJG5vZGUpIHtcbiAgICAgIC8vIGNhY2hlIGNvbXBvbmVudCBpbiBub2RlXG4gICAgICAkbm9kZS5fZHVycnV0aSA9IGdldENhY2hlZENvbXBvbmVudCgkbm9kZSk7XG5cbiAgICAgIC8vIGNsZWFuLXVwIGRhdGEgYXR0cmlidXRlc1xuICAgICAgJG5vZGUucmVtb3ZlQXR0cmlidXRlKGR1cnJ1dGlBdHRyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHVubW91bnROb2RlKCRub2RlKSB7XG4gICAgdmFyIGNhY2hlZENvbXBvbmVudCA9IGdldENhY2hlZENvbXBvbmVudCgkbm9kZSk7XG5cbiAgICBpZiAoY2FjaGVkQ29tcG9uZW50LnVubW91bnQpIHtcbiAgICAgIGNhY2hlZENvbXBvbmVudC51bm1vdW50KCRub2RlKTtcbiAgICB9XG5cbiAgICAvLyBjbGVhciB0aGUgY29tcG9uZW50IGZyb20gdGhlIGNhY2hlXG4gICAgY2xlYXJDb21wb25lbnRDYWNoZShjYWNoZWRDb21wb25lbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91bnROb2RlKCRub2RlKSB7XG4gICAgdmFyIGNhY2hlZENvbXBvbmVudCA9IGdldENhY2hlZENvbXBvbmVudCgkbm9kZSk7XG5cbiAgICBpZiAoY2FjaGVkQ29tcG9uZW50Lm1vdW50KSB7XG4gICAgICBjYWNoZWRDb21wb25lbnQubW91bnQoJG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyQ29tcG9uZW50Q2FjaGUoY29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wb25lbnRDYWNoZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29tcG9uZW50Q2FjaGVbaV0uaWQgPT09IGNvbXBvbmVudC5fZHVycnV0aUlkKSB7XG4gICAgICAgICAgY29tcG9uZW50Q2FjaGUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjbGVhciB0aGUgZW50aXJlIGNvbXBvbmVudCBjYWNoZVxuICAgICAgY29tcG9uZW50SW5kZXggPSAwO1xuICAgICAgY29tcG9uZW50Q2FjaGUubGVuZ3RoID0gMDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGcmFnbWVudCgpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuXG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS50cmltKCk7XG4gICAgdmFyIHBhcmVudCA9ICdkaXYnO1xuICAgIHZhciAkbm9kZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5pbmRleE9mKCc8dHInKSA9PT0gMCkge1xuICAgICAgLy8gdGFibGUgcm93XG4gICAgICBwYXJlbnQgPSAndGJvZHknO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUuaW5kZXhPZignPHRkJykgPT09IDApIHtcbiAgICAgIC8vIHRhYmxlIGNvbHVtblxuICAgICAgcGFyZW50ID0gJ3RyJztcbiAgICB9XG5cbiAgICAkbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocGFyZW50KTtcbiAgICAkbm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblxuICAgIGlmICgkbm9kZS5jaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IHRlbXBsYXRlIG11c3QgaGF2ZSBhIHNpbmdsZSBwYXJlbnQgbm9kZS4nLCB0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRub2RlLmZpcnN0RWxlbWVudENoaWxkO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQ29tcG9uZW50SWQodGVtcGxhdGUsIGNvbXBvbmVudCkge1xuICAgIC8vIG5haXZlIGltcGxlbWVudGF0aW9uIG9mIGFkZGluZyBhbiBhdHRyaWJ1dGUgdG8gdGhlIHBhcmVudCBjb250YWluZXIuXG4gICAgLy8gc28gd2UgZG9uJ3QgZGVwZW5kIG9uIGEgZG9tIHBhcnNlci5cbiAgICAvLyBkb3duc2lkZSBpcyB3ZSBjYW4ndCB3YXJuIHRoYXQgdGVtcGxhdGUgTVVTVCBoYXZlIGEgc2luZ2xlIHBhcmVudCAoaW4gTm9kZS5qcykuXG5cbiAgICAvLyBjaGVjayB2b2lkIGVsZW1lbnRzIGZpcnN0LlxuICAgIHZhciBmaXJzdEJyYWNrZXRJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoJy8+Jyk7XG5cbiAgICAvLyBub24tdm9pZCBlbGVtZW50c1xuICAgIGlmIChmaXJzdEJyYWNrZXRJbmRleCA9PT0gLTEpIHtcbiAgICAgIGZpcnN0QnJhY2tldEluZGV4ID0gdGVtcGxhdGUuaW5kZXhPZignPicpO1xuICAgIH1cblxuICAgIHZhciBhdHRyID0gJyAnICsgZHVycnV0aUF0dHIgKyAnPVwiJyArIGNvbXBvbmVudC5fZHVycnV0aUlkICsgJ1wiJztcblxuICAgIHJldHVybiB0ZW1wbGF0ZS5zdWJzdHIoMCwgZmlyc3RCcmFja2V0SW5kZXgpICsgYXR0ciArIHRlbXBsYXRlLnN1YnN0cihmaXJzdEJyYWNrZXRJbmRleCk7XG4gIH1cblxuICAvLyB0cmF2ZXJzZSBhbmQgZmluZCBkdXJydXRpIG5vZGVzXG4gIGZ1bmN0aW9uIGdldENvbXBvbmVudE5vZGVzKCRjb250YWluZXIpIHtcbiAgICB2YXIgYXJyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcblxuICAgIGlmICgkY29udGFpbmVyLl9kdXJydXRpKSB7XG4gICAgICBhcnIucHVzaCgkY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBpZiAoJGNvbnRhaW5lci5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkY29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGdldENvbXBvbmVudE5vZGVzKCRjb250YWluZXIuY2hpbGRyZW5baV0sIGFycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHZhciBEdXJydXRpID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIER1cnJ1dGkoKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBEdXJydXRpKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDbGFzcyhEdXJydXRpLCBbe1xuICAgICAga2V5OiAnc2VydmVyJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXJ2ZXIoKSB7XG4gICAgICAgIGNsZWFyQ29tcG9uZW50Q2FjaGUoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcihjb21wb25lbnQsICRjb250YWluZXIpIHtcbiAgICAgICAgLy8gZGVjb3JhdGUgYmFzaWMgY2xhc3NlcyB3aXRoIGR1cnJ1dGkgcHJvcGVydGllc1xuICAgICAgICB2YXIgZHVycnV0aUNvbXBvbmVudCA9IGRlY29yYXRlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkdXJydXRpQ29tcG9uZW50LnJlbmRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudHMgbXVzdCBoYXZlIGEgcmVuZGVyKCkgbWV0aG9kLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZHVycnV0aUNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgICAgdmFyIGNvbXBvbmVudEh0bWwgPSBhZGRDb21wb25lbnRJZCh0ZW1wbGF0ZSwgZHVycnV0aUNvbXBvbmVudCk7XG5cbiAgICAgICAgLy8gbW91bnQgYW5kIHVubW91bnQgaW4gYnJvd3Nlciwgd2hlbiB3ZSBzcGVjaWZ5IGEgY29udGFpbmVyLlxuICAgICAgICBpZiAoaXNDbGllbnQgJiYgJGNvbnRhaW5lcikge1xuICAgICAgICAgIHZhciAkbmV3Q29tcG9uZW50O1xuICAgICAgICAgIHZhciBwYXRjaGVzO1xuXG4gICAgICAgICAgdmFyIF9yZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgY29udGFpbmVyIGlzIHN0aWxsIGluIHRoZSBET00uXG4gICAgICAgICAgICAvLyB3aGVuIHJ1bm5pbmcgbXVsdGlwbGUgcGFyYWxsZWwgcmVuZGVyJ3MsIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIC8vIGlzIHJlbW92ZWQgYnkgdGhlIHByZXZpb3VzIHJlbmRlciwgYnV0IHRoZSByZWZlcmVuY2Ugc3RpbGwgaW4gbWVtb3J5LlxuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKCRjb250YWluZXIpKSB7XG4gICAgICAgICAgICAgIC8vIHdhcm4gZm9yIHBlcmZvcm1hbmNlLlxuICAgICAgICAgICAgICB3YXJuKCdOb2RlJywgJGNvbnRhaW5lciwgJ2lzIG5vIGxvbmdlciBpbiB0aGUgRE9NLiBcXG5JdCB3YXMgcHJvYmFibHkgcmVtb3ZlZCBieSBhIHBhcmVudCBjb21wb25lbnQuJyk7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdjogdm9pZCAwXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb21wb25lbnROb2RlcyA9IFtdO1xuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgdGVtcGxhdGUgc3RyaW5nIHRvIGEgZG9tIG5vZGVcbiAgICAgICAgICAgICRuZXdDb21wb25lbnQgPSBjcmVhdGVGcmFnbWVudChjb21wb25lbnRIdG1sKTtcblxuICAgICAgICAgICAgLy8gdW5tb3VudCBjb21wb25lbnQgYW5kIHN1Yi1jb21wb25lbnRzXG5cbiAgICAgICAgICAgIGdldENvbXBvbmVudE5vZGVzKCRjb250YWluZXIpLmZvckVhY2godW5tb3VudE5vZGUpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY29udGFpbmVyIGlzIGEgZHVycnV0aSBlbGVtZW50LFxuICAgICAgICAgICAgLy8gdW5tb3VudCBpdCBhbmQgaXQncyBjaGlsZHJlbiBhbmQgcmVwbGFjZSB0aGUgbm9kZS5cbiAgICAgICAgICAgIGlmIChnZXRDYWNoZWRDb21wb25lbnQoJGNvbnRhaW5lcikpIHtcbiAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBkYXRhIGF0dHJpYnV0ZXMgb24gdGhlIG5ldyBub2RlLFxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcGF0Y2gsXG4gICAgICAgICAgICAgIC8vIGFuZCBnZXQgdGhlIGxpc3Qgb2YgbmV3IGNvbXBvbmVudHMuXG4gICAgICAgICAgICAgIGNsZWFuQXR0ck5vZGVzKCRuZXdDb21wb25lbnQsIHRydWUpO1xuXG4gICAgICAgICAgICAgIC8vIGdldCByZXF1aXJlZCBkb20gcGF0Y2hlc1xuICAgICAgICAgICAgICBwYXRjaGVzID0gZGlmZigkY29udGFpbmVyLCAkbmV3Q29tcG9uZW50KTtcblxuXG4gICAgICAgICAgICAgIHBhdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAocGF0Y2gkJDEpIHtcbiAgICAgICAgICAgICAgICAvLyBhbHdheXMgdXBkYXRlIGNvbXBvbmVudCBpbnN0YW5jZXMsXG4gICAgICAgICAgICAgICAgLy8gZXZlbiBpZiB0aGUgZG9tIGRvZXNuJ3QgY2hhbmdlLlxuICAgICAgICAgICAgICAgIHBhdGNoJCQxLm5vZGUuX2R1cnJ1dGkgPSBwYXRjaCQkMS5uZXdOb2RlLl9kdXJydXRpO1xuXG4gICAgICAgICAgICAgICAgLy8gcGF0Y2hlcyBjb250YWluIGFsbCB0aGUgdHJhdmVyc2VkIG5vZGVzLlxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgbW91bnQgY29tcG9uZW50cyBoZXJlLCBmb3IgcGVyZm9ybWFuY2UuXG4gICAgICAgICAgICAgICAgaWYgKHBhdGNoJCQxLm5vZGUuX2R1cnJ1dGkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwYXRjaCQkMS5yZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5vZGVzLnB1c2gocGF0Y2gkJDEubmV3Tm9kZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhdGNoJCQxLnVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROb2Rlcy5wdXNoKHBhdGNoJCQxLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9kZSBpcyB0aGUgc2FtZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IHdlIG5lZWQgdG8gbW91bnQgc3ViLWNvbXBvbmVudHMuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNvbXBvbmVudE5vZGVzLCBnZXRDb21wb25lbnROb2RlcyhwYXRjaCQkMS5ub2RlKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBtb3JwaCBvbGQgZG9tIG5vZGUgaW50byBuZXcgb25lXG4gICAgICAgICAgICAgIHBhdGNoKHBhdGNoZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gaWYgdGhlIGNvbXBvbmVudCBpcyBub3QgYSBkdXJydXRpIGVsZW1lbnQsXG4gICAgICAgICAgICAgIC8vIGluc2VydCB0aGUgdGVtcGxhdGUgd2l0aCBpbm5lckhUTUwuXG5cbiAgICAgICAgICAgICAgLy8gb25seSBpZiB0aGUgc2FtZSBodG1sIGlzIG5vdCBhbHJlYWR5IHJlbmRlcmVkXG4gICAgICAgICAgICAgIGlmICghJGNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCB8fCAhJGNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZC5pc0VxdWFsTm9kZSgkbmV3Q29tcG9uZW50KSkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIuaW5uZXJIVE1MID0gY29tcG9uZW50SHRtbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbXBvbmVudE5vZGVzID0gY2xlYW5BdHRyTm9kZXMoJGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1vdW50IG5ld2x5IGFkZGVkIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudE5vZGVzLmZvckVhY2gobW91bnROb2RlKTtcbiAgICAgICAgICB9KCk7XG5cbiAgICAgICAgICBpZiAoKHR5cGVvZiBfcmV0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihfcmV0KSkgPT09IFwib2JqZWN0XCIpIHJldHVybiBfcmV0LnY7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcG9uZW50SHRtbDtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIER1cnJ1dGk7XG4gIH0oKTtcblxuICB2YXIgZHVycnV0aSA9IG5ldyBEdXJydXRpKCk7XG5cbiAgcmV0dXJuIGR1cnJ1dGk7XG5cbn0pKSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWR1cnJ1dGkuanMubWFwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLmR1cnJ1dGkgPSBnbG9iYWwuZHVycnV0aSB8fCB7fSwgZ2xvYmFsLmR1cnJ1dGkuU3RvcmUgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgLyogRHVycnV0aVxuICAgKiBVdGlscy5cbiAgICovXG5cbiAgZnVuY3Rpb24gaGFzV2luZG93KCkge1xuICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIHZhciBpc0NsaWVudCA9IGhhc1dpbmRvdygpO1xuXG4gIGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9XG5cbiAgLy8gb25lLWxldmVsIG9iamVjdCBleHRlbmRcbiAgZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciBvYmogPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBkZWZhdWx0cyA9IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIGNsb25lIG9iamVjdFxuICAgIHZhciBleHRlbmRlZCA9IGNsb25lKG9iaik7XG5cbiAgICAvLyBjb3B5IGRlZmF1bHQga2V5cyB3aGVyZSB1bmRlZmluZWRcbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAodHlwZW9mIGV4dGVuZGVkW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4dGVuZGVkW2tleV0gPSBkZWZhdWx0c1trZXldO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGV4dGVuZGVkO1xuICB9XG5cbiAgdmFyIERVUlJVVElfREVCVUcgPSB0cnVlO1xuXG4gIC8qIER1cnJ1dGlcbiAgICogRGF0YSBzdG9yZSB3aXRoIGNoYW5nZSBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFN0b3JlKG5hbWUsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBoaXN0b3J5U3VwcG9ydCA9IGZhbHNlO1xuICAgIC8vIGhpc3RvcnkgaXMgYWN0aXZlIG9ubHkgaW4gdGhlIGJyb3dzZXIsIGJ5IGRlZmF1bHRcbiAgICBpZiAoaXNDbGllbnQpIHtcbiAgICAgIGhpc3RvcnlTdXBwb3J0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuICAgICAgaGlzdG9yeTogaGlzdG9yeVN1cHBvcnRcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRzID0ge1xuICAgICAgY2hhbmdlOiBbXVxuICAgIH07XG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgfVxuXG4gIFN0b3JlLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgdGhpcy5ldmVudHNbdG9waWNdID0gdGhpcy5ldmVudHNbdG9waWNdIHx8IFtdO1xuXG4gICAgLy8gaW1tdXRhYmxlLlxuICAgIC8vIHNvIG9uL29mZiBkb24ndCBjaGFuZ2UgdGhlIGFycmF5IGR1cnJpbmcgdHJpZ2dlci5cbiAgICB2YXIgZm91bmRFdmVudHMgPSB0aGlzLmV2ZW50c1t0b3BpY10uc2xpY2UoKTtcbiAgICBmb3VuZEV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBTdG9yZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAodG9waWMsIGZ1bmMpIHtcbiAgICB0aGlzLmV2ZW50c1t0b3BpY10gPSB0aGlzLmV2ZW50c1t0b3BpY10gfHwgW107XG4gICAgdGhpcy5ldmVudHNbdG9waWNdLnB1c2goZnVuYyk7XG4gIH07XG5cbiAgU3RvcmUucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uICh0b3BpYywgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1t0b3BpY10gPSB0aGlzLmV2ZW50c1t0b3BpY10gfHwgW107XG5cbiAgICAvLyBmaW5kIHRoZSBmbiBpbiB0aGUgYXJyXG4gICAgdmFyIGluZGV4ID0gW10uaW5kZXhPZi5jYWxsKHRoaXMuZXZlbnRzW3RvcGljXSwgZm4pO1xuXG4gICAgLy8gd2UgZGlkbid0IGZpbmQgaXQgaW4gdGhlIGFycmF5XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRzW3RvcGljXS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9O1xuXG4gIFN0b3JlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvbmUodmFsdWUpO1xuICB9O1xuXG4gIFN0b3JlLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbG9uZSh0aGlzLmRhdGEpO1xuICB9O1xuXG4gIFN0b3JlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhpc3RvcnkpIHtcbiAgICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhID0gW3ZhbHVlXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gIH07XG5cbiAgcmV0dXJuIFN0b3JlO1xuXG59KSkpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdG9yZS5qcy5tYXAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuSm90dGVkID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qIHV0aWxcbiAgICovXG5cbiAgZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciBvYmogPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBkZWZhdWx0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgZXh0ZW5kZWQgPSB7fTtcbiAgICAvLyBjbG9uZSBvYmplY3RcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgZXh0ZW5kZWRba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuXG4gICAgLy8gY29weSBkZWZhdWx0IGtleXMgd2hlcmUgdW5kZWZpbmVkXG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKHR5cGVvZiBleHRlbmRlZFtrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHRlbmRlZFtrZXldID0gb2JqW2tleV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHRlbmRlZFtrZXldID0gZGVmYXVsdHNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBleHRlbmRlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZldGNoKHVybCwgY2FsbGJhY2spIHtcbiAgICB2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dCc7XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHVybCwgeGhyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH07XG5cbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuQ2FsbGJhY2soaW5kZXgsIHBhcmFtcywgYXJyLCBlcnJvcnMsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuXG4gICAgICBpbmRleCsrO1xuICAgICAgaWYgKGluZGV4IDwgYXJyLmxlbmd0aCkge1xuICAgICAgICBzZXFSdW5uZXIoaW5kZXgsIHJlcywgYXJyLCBlcnJvcnMsIGNhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9ycywgcmVzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxUnVubmVyKGluZGV4LCBwYXJhbXMsIGFyciwgZXJyb3JzLCBjYWxsYmFjaykge1xuICAgIC8vIGFzeW5jXG4gICAgYXJyW2luZGV4XShwYXJhbXMsIHJ1bkNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxKGFyciwgcGFyYW1zKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmdW5jdGlvbiAoKSB7fTtcblxuICAgIHZhciBlcnJvcnMgPSBbXTtcblxuICAgIGlmICghYXJyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9ycywgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBzZXFSdW5uZXIoMCwgcGFyYW1zLCBhcnIsIGVycm9ycywgY2FsbGJhY2spO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG4gICAgdmFyIGNvb2xkb3duID0gbnVsbDtcbiAgICB2YXIgbXVsdGlwbGUgPSBudWxsO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgICAgIGlmIChjb29sZG93bikge1xuICAgICAgICBtdWx0aXBsZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuXG4gICAgICBjbGVhclRpbWVvdXQoY29vbGRvd24pO1xuXG4gICAgICBjb29sZG93biA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgICAgICBmbi5hcHBseShfdGhpcywgX2FyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb29sZG93biA9IG51bGw7XG4gICAgICAgIG11bHRpcGxlID0gbnVsbDtcbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKCFub2RlLmNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdGVtcENsYXNzID0gJyAnICsgbm9kZS5jbGFzc05hbWUgKyAnICc7XG4gICAgY2xhc3NOYW1lID0gJyAnICsgY2xhc3NOYW1lICsgJyAnO1xuXG4gICAgaWYgKHRlbXBDbGFzcy5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDbGFzcyhub2RlLCBjbGFzc05hbWUpIHtcbiAgICAvLyBjbGFzcyBpcyBhbHJlYWR5IGFkZGVkXG4gICAgaWYgKGhhc0NsYXNzKG5vZGUsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHJldHVybiBub2RlLmNsYXNzTmFtZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzTmFtZSA9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG5cbiAgICBub2RlLmNsYXNzTmFtZSArPSBjbGFzc05hbWU7XG5cbiAgICByZXR1cm4gbm9kZS5jbGFzc05hbWU7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVDbGFzcyhub2RlLCBjbGFzc05hbWUpIHtcbiAgICB2YXIgc3BhY2VCZWZvcmUgPSAnICcgKyBjbGFzc05hbWU7XG4gICAgdmFyIHNwYWNlQWZ0ZXIgPSBjbGFzc05hbWUgKyAnICc7XG5cbiAgICBpZiAobm9kZS5jbGFzc05hbWUuaW5kZXhPZihzcGFjZUJlZm9yZSkgIT09IC0xKSB7XG4gICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2Uoc3BhY2VCZWZvcmUsICcnKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUuY2xhc3NOYW1lLmluZGV4T2Yoc3BhY2VBZnRlcikgIT09IC0xKSB7XG4gICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2Uoc3BhY2VBZnRlciwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmNsYXNzTmFtZSA9IG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NOYW1lLCAnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGUuY2xhc3NOYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gZGF0YShub2RlLCBhdHRyKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBhdHRyKTtcbiAgfVxuXG4gIC8vIG1vZGUgZGV0ZWN0aW9uIGJhc2VkIG9uIGNvbnRlbnQgdHlwZSBhbmQgZmlsZSBleHRlbnNpb25cbiAgdmFyIGRlZmF1bHRNb2RlbWFwID0ge1xuICAgICdodG1sJzogJ2h0bWwnLFxuICAgICdjc3MnOiAnY3NzJyxcbiAgICAnanMnOiAnamF2YXNjcmlwdCcsXG4gICAgJ2xlc3MnOiAnbGVzcycsXG4gICAgJ3N0eWwnOiAnc3R5bHVzJyxcbiAgICAnY29mZmVlJzogJ2NvZmZlZXNjcmlwdCdcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRNb2RlKCkge1xuICAgIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICB2YXIgZmlsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJyc7XG4gICAgdmFyIGN1c3RvbU1vZGVtYXAgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgdmFyIG1vZGVtYXAgPSBleHRlbmQoY3VzdG9tTW9kZW1hcCwgZGVmYXVsdE1vZGVtYXApO1xuXG4gICAgLy8gdHJ5IHRoZSBmaWxlIGV4dGVuc2lvblxuICAgIGZvciAodmFyIGtleSBpbiBtb2RlbWFwKSB7XG4gICAgICB2YXIga2V5TGVuZ3RoID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChmaWxlLnNsaWNlKC1rZXlMZW5ndGgrKykgPT09ICcuJyArIGtleSkge1xuICAgICAgICByZXR1cm4gbW9kZW1hcFtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRyeSB0aGUgZmlsZSB0eXBlIChodG1sL2Nzcy9qcylcbiAgICBmb3IgKHZhciBfa2V5IGluIG1vZGVtYXApIHtcbiAgICAgIGlmICh0eXBlID09PSBfa2V5KSB7XG4gICAgICAgIHJldHVybiBtb2RlbWFwW19rZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgLyogdGVtcGxhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gY29udGFpbmVyKCkge1xuICAgIHJldHVybiAnXFxuICAgIDx1bCBjbGFzcz1cImpvdHRlZC1uYXZcIj5cXG4gICAgICA8bGkgY2xhc3M9XCJqb3R0ZWQtbmF2LWl0ZW0gam90dGVkLW5hdi1pdGVtLXJlc3VsdFwiPlxcbiAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWpvdHRlZC10eXBlPVwicmVzdWx0XCI+XFxuICAgICAgICAgIFJlc3VsdFxcbiAgICAgICAgPC9hPlxcbiAgICAgIDwvbGk+XFxuICAgICAgPGxpIGNsYXNzPVwiam90dGVkLW5hdi1pdGVtIGpvdHRlZC1uYXYtaXRlbS1odG1sXCI+XFxuICAgICAgICA8YSBocmVmPVwiI1wiIGRhdGEtam90dGVkLXR5cGU9XCJodG1sXCI+XFxuICAgICAgICAgIEhUTUxcXG4gICAgICAgIDwvYT5cXG4gICAgICA8L2xpPlxcbiAgICAgIDxsaSBjbGFzcz1cImpvdHRlZC1uYXYtaXRlbSBqb3R0ZWQtbmF2LWl0ZW0tY3NzXCI+XFxuICAgICAgICA8YSBocmVmPVwiI1wiIGRhdGEtam90dGVkLXR5cGU9XCJjc3NcIj5cXG4gICAgICAgICAgQ1NTXFxuICAgICAgICA8L2E+XFxuICAgICAgPC9saT5cXG4gICAgICA8bGkgY2xhc3M9XCJqb3R0ZWQtbmF2LWl0ZW0gam90dGVkLW5hdi1pdGVtLWpzXCI+XFxuICAgICAgICA8YSBocmVmPVwiI1wiIGRhdGEtam90dGVkLXR5cGU9XCJqc1wiPlxcbiAgICAgICAgICBKYXZhU2NyaXB0XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9saT5cXG4gICAgPC91bD5cXG4gICAgPGRpdiBjbGFzcz1cImpvdHRlZC1wYW5lIGpvdHRlZC1wYW5lLXJlc3VsdFwiPjxpZnJhbWU+PC9pZnJhbWU+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XCJqb3R0ZWQtcGFuZSBqb3R0ZWQtcGFuZS1odG1sXCI+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XCJqb3R0ZWQtcGFuZSBqb3R0ZWQtcGFuZS1jc3NcIj48L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cImpvdHRlZC1wYW5lIGpvdHRlZC1wYW5lLWpzXCI+PC9kaXY+XFxuICAnO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFuZUFjdGl2ZUNsYXNzKHR5cGUpIHtcbiAgICByZXR1cm4gJ2pvdHRlZC1wYW5lLWFjdGl2ZS0nICsgdHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnRhaW5lckNsYXNzKCkge1xuICAgIHJldHVybiAnam90dGVkJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0ZpbGVDbGFzcyh0eXBlKSB7XG4gICAgcmV0dXJuICdqb3R0ZWQtaGFzLScgKyB0eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZWRpdG9yQ2xhc3ModHlwZSkge1xuICAgIHJldHVybiAnam90dGVkLWVkaXRvciBqb3R0ZWQtZWRpdG9yLScgKyB0eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZWRpdG9yQ29udGVudCh0eXBlKSB7XG4gICAgdmFyIGZpbGVVcmwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXG4gICAgcmV0dXJuICdcXG4gICAgPHRleHRhcmVhIGRhdGEtam90dGVkLXR5cGU9XCInICsgdHlwZSArICdcIiBkYXRhLWpvdHRlZC1maWxlPVwiJyArIGZpbGVVcmwgKyAnXCI+PC90ZXh0YXJlYT5cXG4gICAgPGRpdiBjbGFzcz1cImpvdHRlZC1zdGF0dXNcIj48L2Rpdj5cXG4gICc7XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0dXNNZXNzYWdlKGVycikge1xuICAgIHJldHVybiAnXFxuICAgIDxwPicgKyBlcnIgKyAnPC9wPlxcbiAgJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXR1c0NsYXNzKHR5cGUpIHtcbiAgICByZXR1cm4gJ2pvdHRlZC1zdGF0dXMtJyArIHR5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0dXNBY3RpdmVDbGFzcyh0eXBlKSB7XG4gICAgcmV0dXJuICdqb3R0ZWQtc3RhdHVzLWFjdGl2ZS0nICsgdHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsdWdpbkNsYXNzKG5hbWUpIHtcbiAgICByZXR1cm4gJ2pvdHRlZC1wbHVnaW4tJyArIG5hbWU7XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0dXNMb2FkaW5nKHVybCkge1xuICAgIHJldHVybiAnTG9hZGluZyA8c3Ryb25nPicgKyB1cmwgKyAnPC9zdHJvbmc+Li4nO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhdHVzRmV0Y2hFcnJvcih1cmwpIHtcbiAgICByZXR1cm4gJ1RoZXJlIHdhcyBhbiBlcnJvciBsb2FkaW5nIDxzdHJvbmc+JyArIHVybCArICc8L3N0cm9uZz4uJztcbiAgfVxuXG4gIHZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gIH0gOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gIH07XG5cblxuXG5cblxuICB2YXIgYXN5bmNHZW5lcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXdhaXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEFzeW5jR2VuZXJhdG9yKGdlbikge1xuICAgICAgdmFyIGZyb250LCBiYWNrO1xuXG4gICAgICBmdW5jdGlvbiBzZW5kKGtleSwgYXJnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIGFyZzogYXJnLFxuICAgICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICAgIHJlamVjdDogcmVqZWN0LFxuICAgICAgICAgICAgbmV4dDogbnVsbFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoYmFjaykge1xuICAgICAgICAgICAgYmFjayA9IGJhY2submV4dCA9IHJlcXVlc3Q7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb250ID0gYmFjayA9IHJlcXVlc3Q7XG4gICAgICAgICAgICByZXN1bWUoa2V5LCBhcmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlc3VtZShrZXksIGFyZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcblxuICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0VmFsdWUpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZS52YWx1ZSkudGhlbihmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgIHJlc3VtZShcIm5leHRcIiwgYXJnKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgcmVzdW1lKFwidGhyb3dcIiwgYXJnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXR0bGUocmVzdWx0LmRvbmUgPyBcInJldHVyblwiIDogXCJub3JtYWxcIiwgcmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHNldHRsZShcInRocm93XCIsIGVycik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0dGxlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJyZXR1cm5cIjpcbiAgICAgICAgICAgIGZyb250LnJlc29sdmUoe1xuICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwidGhyb3dcIjpcbiAgICAgICAgICAgIGZyb250LnJlamVjdCh2YWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBmcm9udC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGZyb250ID0gZnJvbnQubmV4dDtcblxuICAgICAgICBpZiAoZnJvbnQpIHtcbiAgICAgICAgICByZXN1bWUoZnJvbnQua2V5LCBmcm9udC5hcmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ludm9rZSA9IHNlbmQ7XG5cbiAgICAgIGlmICh0eXBlb2YgZ2VuLnJldHVybiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMucmV0dXJuID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHtcbiAgICAgIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJuZXh0XCIsIGFyZyk7XG4gICAgfTtcblxuICAgIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS50aHJvdyA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJ0aHJvd1wiLCBhcmcpO1xuICAgIH07XG5cbiAgICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGUucmV0dXJuID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShcInJldHVyblwiLCBhcmcpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgd3JhcDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBc3luY0dlbmVyYXRvcihmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBhd2FpdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXdhaXRWYWx1ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSgpO1xuXG5cblxuXG5cbiAgdmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9O1xuICB9KCk7XG5cblxuXG5cblxuXG5cbiAgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gIHZhciBzZXQgPSBmdW5jdGlvbiBzZXQob2JqZWN0LCBwcm9wZXJ0eSwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHNldChwYXJlbnQsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkge1xuICAgICAgZGVzYy52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc2V0dGVyID0gZGVzYy5zZXQ7XG5cbiAgICAgIGlmIChzZXR0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZXR0ZXIuY2FsbChyZWNlaXZlciwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKiBwbHVnaW5cbiAgICovXG5cbiAgdmFyIHBsdWdpbnMgPSBbXTtcblxuICBmdW5jdGlvbiBmaW5kJDEoaWQpIHtcbiAgICBmb3IgKHZhciBwbHVnaW5JbmRleCBpbiBwbHVnaW5zKSB7XG4gICAgICB2YXIgcGx1Z2luID0gcGx1Z2luc1twbHVnaW5JbmRleF07XG4gICAgICBpZiAocGx1Z2luLl9pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYW4ndCBmaW5kIHBsdWdpblxuICAgIHRocm93IG5ldyBFcnJvcignUGx1Z2luICcgKyBpZCArICcgaXMgbm90IHJlZ2lzdGVyZWQuJyk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlcihpZCwgcGx1Z2luKSB7XG4gICAgLy8gcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgcGx1Z2luLl9pZCA9IGlkO1xuICAgIHBsdWdpbnMucHVzaChwbHVnaW4pO1xuICB9XG5cbiAgLy8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGVhY2ggcGx1Z2luLCBvbiB0aGUgam90dGVkIGluc3RhbmNlXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX2dldCgnb3B0aW9ucycpLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICAvLyBjaGVjayBpZiBwbHVnaW4gZGVmaW5pdGlvbiBpcyBzdHJpbmcgb3Igb2JqZWN0XG4gICAgICB2YXIgUGx1Z2luID0gdm9pZCAwO1xuICAgICAgdmFyIHBsdWdpbk5hbWUgPSB2b2lkIDA7XG4gICAgICB2YXIgcGx1Z2luT3B0aW9ucyA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHBsdWdpbk5hbWUgPSBwbHVnaW47XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgcGx1Z2luID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwbHVnaW4pKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcGx1Z2luTmFtZSA9IHBsdWdpbi5uYW1lO1xuICAgICAgICBwbHVnaW5PcHRpb25zID0gcGx1Z2luLm9wdGlvbnMgfHwge307XG4gICAgICB9XG5cbiAgICAgIFBsdWdpbiA9IGZpbmQkMShwbHVnaW5OYW1lKTtcbiAgICAgIF90aGlzLl9nZXQoJ3BsdWdpbnMnKVtwbHVnaW5dID0gbmV3IFBsdWdpbihfdGhpcywgcGx1Z2luT3B0aW9ucyk7XG5cbiAgICAgIGFkZENsYXNzKF90aGlzLl9nZXQoJyRjb250YWluZXInKSwgcGx1Z2luQ2xhc3MocGx1Z2luTmFtZSkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogcHVic291cFxuICAgKi9cblxuICB2YXIgUHViU291cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQdWJTb3VwKCkge1xuICAgICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUHViU291cCk7XG5cbiAgICAgIHRoaXMudG9waWNzID0ge307XG4gICAgICB0aGlzLmNhbGxiYWNrcyA9IHt9O1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFB1YlNvdXAsIFt7XG4gICAgICBrZXk6ICdmaW5kJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kKHF1ZXJ5KSB7XG4gICAgICAgIHRoaXMudG9waWNzW3F1ZXJ5XSA9IHRoaXMudG9waWNzW3F1ZXJ5XSB8fCBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9waWNzW3F1ZXJ5XTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdzdWJzY3JpYmUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZSh0b3BpYywgc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgcHJpb3JpdHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDkwO1xuXG4gICAgICAgIHZhciBmb3VuZFRvcGljID0gdGhpcy5maW5kKHRvcGljKTtcbiAgICAgICAgc3Vic2NyaWJlci5fcHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICAgICAgZm91bmRUb3BpYy5wdXNoKHN1YnNjcmliZXIpO1xuXG4gICAgICAgIC8vIHNvcnQgc3Vic2NyaWJlcnMgb24gcHJpb3JpdHlcbiAgICAgICAgZm91bmRUb3BpYy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEuX3ByaW9yaXR5ID4gYi5fcHJpb3JpdHkgPyAxIDogYi5fcHJpb3JpdHkgPiBhLl9wcmlvcml0eSA/IC0xIDogMDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZXMgYSBmdW5jdGlvbiBmcm9tIGFuIGFycmF5XG5cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW1vdmVyJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVyKGFyciwgZm4pIHtcbiAgICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGlmIG5vIGZuIGlzIHNwZWNpZmllZFxuICAgICAgICAgIC8vIGNsZWFuLXVwIHRoZSBhcnJheVxuICAgICAgICAgIGlmICghZm4pIHtcbiAgICAgICAgICAgIGFyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZpbmQgdGhlIGZuIGluIHRoZSBhcnJcbiAgICAgICAgICB2YXIgaW5kZXggPSBbXS5pbmRleE9mLmNhbGwoYXJyLCBmbik7XG5cbiAgICAgICAgICAvLyB3ZSBkaWRuJ3QgZmluZCBpdCBpbiB0aGUgYXJyYXlcbiAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3Vuc3Vic2NyaWJlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB1bnN1YnNjcmliZSh0b3BpYywgc3Vic2NyaWJlcikge1xuICAgICAgICAvLyByZW1vdmUgZnJvbSBzdWJzY3JpYmVyc1xuICAgICAgICB2YXIgZm91bmRUb3BpYyA9IHRoaXMuZmluZCh0b3BpYyk7XG4gICAgICAgIHRoaXMucmVtb3Zlcihmb3VuZFRvcGljLCBzdWJzY3JpYmVyKTtcblxuICAgICAgICAvLyByZW1vdmUgZnJvbSBjYWxsYmFja3NcbiAgICAgICAgdGhpcy5jYWxsYmFja3NbdG9waWNdID0gdGhpcy5jYWxsYmFja3NbdG9waWNdIHx8IFtdO1xuICAgICAgICB0aGlzLnJlbW92ZXIodGhpcy5jYWxsYmFja3NbdG9waWNdLCBzdWJzY3JpYmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2VxdWVudGlhbGx5IHJ1bnMgYSBtZXRob2Qgb24gYWxsIHBsdWdpbnNcblxuICAgIH0sIHtcbiAgICAgIGtleTogJ3B1Ymxpc2gnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHB1Ymxpc2godG9waWMpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgICAgdmFyIGZvdW5kVG9waWMgPSB0aGlzLmZpbmQodG9waWMpO1xuICAgICAgICB2YXIgcnVuTGlzdCA9IFtdO1xuXG4gICAgICAgIGZvdW5kVG9waWMuZm9yRWFjaChmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICAgIHJ1bkxpc3QucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VxKHJ1bkxpc3QsIHBhcmFtcywgdGhpcy5ydW5DYWxsYmFja3ModG9waWMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gcGFyYWxsZWwgcnVuIGFsbCAuZG9uZSBjYWxsYmFja3NcblxuICAgIH0sIHtcbiAgICAgIGtleTogJ3J1bkNhbGxiYWNrcycsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcnVuQ2FsbGJhY2tzKHRvcGljKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHBhcmFtcykge1xuICAgICAgICAgIF90aGlzLmNhbGxiYWNrc1t0b3BpY10gPSBfdGhpcy5jYWxsYmFja3NbdG9waWNdIHx8IFtdO1xuXG4gICAgICAgICAgX3RoaXMuY2FsbGJhY2tzW3RvcGljXS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBjKGVyciwgcGFyYW1zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gYXR0YWNoIGEgY2FsbGJhY2sgd2hlbiBhIHB1Ymxpc2hbdG9waWNdIGlzIGRvbmVcblxuICAgIH0sIHtcbiAgICAgIGtleTogJ2RvbmUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRvbmUodG9waWMpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrc1t0b3BpY10gPSB0aGlzLmNhbGxiYWNrc1t0b3BpY10gfHwgW107XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzW3RvcGljXS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIFB1YlNvdXA7XG4gIH0oKTtcblxuICAvKiByZW5kZXIgcGx1Z2luXG4gICAqIHJlbmRlcnMgdGhlIGlmcmFtZVxuICAgKi9cblxuICB2YXIgUGx1Z2luUmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsdWdpblJlbmRlcihqb3R0ZWQsIG9wdGlvbnMpIHtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBsdWdpblJlbmRlcik7XG5cbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge30pO1xuXG4gICAgICAvLyBpZnJhbWUgc3JjZG9jIHN1cHBvcnRcbiAgICAgIHZhciBzdXBwb3J0U3JjZG9jID0gISEoJ3NyY2RvYycgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJykpO1xuICAgICAgdmFyICRyZXN1bHRGcmFtZSA9IGpvdHRlZC4kY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5qb3R0ZWQtcGFuZS1yZXN1bHQgaWZyYW1lJyk7XG5cbiAgICAgIHZhciBmcmFtZUNvbnRlbnQgPSAnJztcblxuICAgICAgLy8gY2FjaGVkIGNvbnRlbnRcbiAgICAgIHZhciBjb250ZW50ID0ge1xuICAgICAgICBodG1sOiAnJyxcbiAgICAgICAgY3NzOiAnJyxcbiAgICAgICAganM6ICcnXG4gICAgICB9O1xuXG4gICAgICAvLyBjYXRjaCBkb21yZWFkeSBldmVudHMgZnJvbSB0aGUgaWZyYW1lXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuZG9tcmVhZHkuYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIHJlbmRlciBvbiBlYWNoIGNoYW5nZVxuICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCAxMDApO1xuXG4gICAgICAvLyBwdWJsaWNcbiAgICAgIHRoaXMuc3VwcG9ydFNyY2RvYyA9IHN1cHBvcnRTcmNkb2M7XG4gICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgICAgdGhpcy5mcmFtZUNvbnRlbnQgPSBmcmFtZUNvbnRlbnQ7XG4gICAgICB0aGlzLiRyZXN1bHRGcmFtZSA9ICRyZXN1bHRGcmFtZTtcblxuICAgICAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbiAgICAgIHRoaXMuaW5kZXggPSAwO1xuXG4gICAgICB0aGlzLmxhc3RDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFBsdWdpblJlbmRlciwgW3tcbiAgICAgIGtleTogJ3RlbXBsYXRlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAnJztcbiAgICAgICAgdmFyIGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuICAgICAgICB2YXIgc2NyaXB0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiAnJztcblxuICAgICAgICByZXR1cm4gJ1xcbiAgICAgIDwhZG9jdHlwZSBodG1sPlxcbiAgICAgIDxodG1sPlxcbiAgICAgICAgPGhlYWQ+XFxuICAgICAgICAgIDxzY3JpcHQ+XFxuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcXG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcJ0RPTUNvbnRlbnRMb2FkZWRcXCcsIGZ1bmN0aW9uICgpIHtcXG4gICAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7XFxuICAgICAgICAgICAgICAgICAgdHlwZTogXFwnam90dGVkLWRvbS1yZWFkeVxcJ1xcbiAgICAgICAgICAgICAgICB9KSwgXFwnKlxcJylcXG4gICAgICAgICAgICAgIH0pXFxuICAgICAgICAgICAgfSgpKVxcbiAgICAgICAgICA8L3NjcmlwdD5cXG5cXG4gICAgICAgICAgPHN0eWxlPicgKyBzdHlsZSArICc8L3N0eWxlPlxcbiAgICAgICAgPC9oZWFkPlxcbiAgICAgICAgPGJvZHk+XFxuICAgICAgICAgICcgKyBib2R5ICsgJ1xcblxcbiAgICAgICAgICA8IS0tXFxuICAgICAgICAgICAgSm90dGVkOlxcbiAgICAgICAgICAgIEVtcHR5IHNjcmlwdCB0YWcgcHJldmVudHMgbWFsZm9ybWVkIEhUTUwgZnJvbSBicmVha2luZyB0aGUgbmV4dCBzY3JpcHQuXFxuICAgICAgICAgIC0tPlxcbiAgICAgICAgICA8c2NyaXB0Pjwvc2NyaXB0PlxcbiAgICAgICAgICA8c2NyaXB0PicgKyBzY3JpcHQgKyAnPC9zY3JpcHQ+XFxuICAgICAgICA8L2JvZHk+XFxuICAgICAgPC9odG1sPlxcbiAgICAnO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoYW5nZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvLyBjYWNoZSBtYW5pcHVsYXRlZCBjb250ZW50XG4gICAgICAgIHRoaXMuY29udGVudFtwYXJhbXMudHlwZV0gPSBwYXJhbXMuY29udGVudDtcblxuICAgICAgICAvLyBjaGVjayBleGlzdGluZyBhbmQgdG8tYmUtcmVuZGVyZWQgY29udGVudFxuICAgICAgICB2YXIgb2xkRnJhbWVDb250ZW50ID0gdGhpcy5mcmFtZUNvbnRlbnQ7XG4gICAgICAgIHRoaXMuZnJhbWVDb250ZW50ID0gdGhpcy50ZW1wbGF0ZSh0aGlzLmNvbnRlbnRbJ2NzcyddLCB0aGlzLmNvbnRlbnRbJ2h0bWwnXSwgdGhpcy5jb250ZW50WydqcyddKTtcblxuICAgICAgICAvLyBjYWNoZSB0aGUgY3VycmVudCBjYWxsYmFjayBhcyBnbG9iYWwsXG4gICAgICAgIC8vIHNvIHdlIGNhbiBjYWxsIGl0IGZyb20gdGhlIG1lc3NhZ2UgY2FsbGJhY2suXG4gICAgICAgIHRoaXMubGFzdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLmxhc3RDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBkb24ndCByZW5kZXIgaWYgcHJldmlvdXMgYW5kIG5ldyBmcmFtZSBjb250ZW50IGFyZSB0aGUgc2FtZS5cbiAgICAgICAgLy8gbW9zdGx5IGZvciB0aGUgYHBsYXlgIHBsdWdpbixcbiAgICAgICAgLy8gc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBzYW1lIGNvbnRlbnQgb24gZWFjaCBjaGFuZ2UuXG4gICAgICAgIC8vIHVubGVzcyB3ZSBzZXQgZm9yY2VSZW5kZXIuXG4gICAgICAgIGlmIChwYXJhbXMuZm9yY2VSZW5kZXIgIT09IHRydWUgJiYgdGhpcy5mcmFtZUNvbnRlbnQgPT09IG9sZEZyYW1lQ29udGVudCkge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydFNyY2RvYykge1xuICAgICAgICAgIC8vIHNyY2RvYyBpbiB1bnJlbGlhYmxlIGluIENocm9tZS5cbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2hpbmRhL2pvdHRlZC9pc3N1ZXMvMjNcblxuICAgICAgICAgIC8vIHJlLWNyZWF0ZSB0aGUgaWZyYW1lIG9uIGVhY2ggY2hhbmdlLFxuICAgICAgICAgIC8vIHRvIGRpc2NhcmQgdGhlIHByZXZpb3VzbHkgbG9hZGVkIHNjcmlwdHMuXG4gICAgICAgICAgdmFyICRuZXdSZXN1bHRGcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgIHRoaXMuJHJlc3VsdEZyYW1lLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKCRuZXdSZXN1bHRGcmFtZSwgdGhpcy4kcmVzdWx0RnJhbWUpO1xuICAgICAgICAgIHRoaXMuJHJlc3VsdEZyYW1lID0gJG5ld1Jlc3VsdEZyYW1lO1xuXG4gICAgICAgICAgdGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG4gICAgICAgICAgdGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC53cml0ZSh0aGlzLmZyYW1lQ29udGVudCk7XG4gICAgICAgICAgdGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG9sZGVyIGJyb3dzZXJzIHdpdGhvdXQgaWZyYW1lIHNyY3NldCBzdXBwb3J0IChJRTkpLlxuICAgICAgICAgIHRoaXMuJHJlc3VsdEZyYW1lLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmNkb2MnLCB0aGlzLmZyYW1lQ29udGVudCk7XG5cbiAgICAgICAgICAvLyB0aXBzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2p1Z2dsaW5taWtlL3NyY2RvYy1wb2x5ZmlsbFxuICAgICAgICAgIC8vIENvcHlyaWdodCAoYykgMjAxMiBNaWtlIFBlbm5pc2lcbiAgICAgICAgICAvLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gICAgICAgICAgdmFyIGpzVXJsID0gJ2phdmFzY3JpcHQ6d2luZG93LmZyYW1lRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNyY2RvY1wiKTsnO1xuXG4gICAgICAgICAgdGhpcy4kcmVzdWx0RnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCBqc1VybCk7XG5cbiAgICAgICAgICAvLyBFeHBsaWNpdGx5IHNldCB0aGUgaUZyYW1lJ3Mgd2luZG93LmxvY2F0aW9uIGZvclxuICAgICAgICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCBJRTksIHdoaWNoIGRvZXMgbm90IHJlYWN0IHRvIGNoYW5nZXMgaW5cbiAgICAgICAgICAvLyB0aGUgYHNyY2AgYXR0cmlidXRlIHdoZW4gaXQgaXMgYSBgamF2YXNjcmlwdDpgIFVSTC5cbiAgICAgICAgICBpZiAodGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdy5sb2NhdGlvbiA9IGpzVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2RvbXJlYWR5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkb21yZWFkeShlKSB7XG4gICAgICAgIC8vIG9ubHkgY2F0Y2ggbWVzc2FnZXMgZnJvbSB0aGUgaWZyYW1lXG4gICAgICAgIGlmIChlLnNvdXJjZSAhPT0gdGhpcy4kcmVzdWx0RnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYXRhJCQxID0ge307XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGF0YSQkMSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgICBpZiAoZGF0YSQkMS50eXBlID09PSAnam90dGVkLWRvbS1yZWFkeScpIHtcbiAgICAgICAgICB0aGlzLmxhc3RDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5SZW5kZXI7XG4gIH0oKTtcblxuICAvKiBzY3JpcHRsZXNzIHBsdWdpblxuICAgKiByZW1vdmVzIHNjcmlwdCB0YWdzIGZyb20gaHRtbCBjb250ZW50XG4gICAqL1xuXG4gIHZhciBQbHVnaW5TY3JpcHRsZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsdWdpblNjcmlwdGxlc3Moam90dGVkLCBvcHRpb25zKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5TY3JpcHRsZXNzKTtcblxuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7fSk7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sXG4gICAgICB2YXIgcnVuU2NyaXB0VHlwZXMgPSBbJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnLCAnYXBwbGljYXRpb24vZWNtYXNjcmlwdCcsICdhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHQnLCAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JywgJ3RleHQvZWNtYXNjcmlwdCcsICd0ZXh0L2phdmFzY3JpcHQnLCAndGV4dC9qYXZhc2NyaXB0MS4wJywgJ3RleHQvamF2YXNjcmlwdDEuMScsICd0ZXh0L2phdmFzY3JpcHQxLjInLCAndGV4dC9qYXZhc2NyaXB0MS4zJywgJ3RleHQvamF2YXNjcmlwdDEuNCcsICd0ZXh0L2phdmFzY3JpcHQxLjUnLCAndGV4dC9qc2NyaXB0JywgJ3RleHQvbGl2ZXNjcmlwdCcsICd0ZXh0L3gtZWNtYXNjcmlwdCcsICd0ZXh0L3gtamF2YXNjcmlwdCddO1xuXG4gICAgICAvLyByZW1vdmUgc2NyaXB0IHRhZ3Mgb24gZWFjaCBjaGFuZ2VcbiAgICAgIGpvdHRlZC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIHB1YmxpY1xuICAgICAgdGhpcy5ydW5TY3JpcHRUeXBlcyA9IHJ1blNjcmlwdFR5cGVzO1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFBsdWdpblNjcmlwdGxlc3MsIFt7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSAhPT0gJ2h0bWwnKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgSUU5IHN1cHBvcnQsIHJlbW92ZSB0aGUgc2NyaXB0IHRhZ3MgZnJvbSBIVE1MIGNvbnRlbnQuXG4gICAgICAgIC8vIHdoZW4gd2Ugc3RvcCBzdXBwb3J0aW5nIElFOSwgd2UgY2FuIHVzZSB0aGUgc2FuZGJveCBhdHRyaWJ1dGUuXG4gICAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBmcmFnbWVudC5pbm5lckhUTUwgPSBwYXJhbXMuY29udGVudDtcblxuICAgICAgICB2YXIgdHlwZUF0dHIgPSBudWxsO1xuXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgc2NyaXB0IHRhZ3NcbiAgICAgICAgdmFyICRzY3JpcHRzID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjcmlwdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0eXBlQXR0ciA9ICRzY3JpcHRzW2ldLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuXG4gICAgICAgICAgLy8gb25seSByZW1vdmUgc2NyaXB0IHRhZ3Mgd2l0aG91dCB0aGUgdHlwZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyBvciB3aXRoIGEgamF2YXNjcmlwdCBtaW1lIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgICAgICAvLyB0aGUgb25lcyB0aGF0IGFyZSBydW4gYnkgdGhlIGJyb3dzZXIuXG4gICAgICAgICAgaWYgKCF0eXBlQXR0ciB8fCB0aGlzLnJ1blNjcmlwdFR5cGVzLmluZGV4T2YodHlwZUF0dHIpICE9PSAtMSkge1xuICAgICAgICAgICAgJHNjcmlwdHNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkc2NyaXB0c1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW1zLmNvbnRlbnQgPSBmcmFnbWVudC5pbm5lckhUTUw7XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIFBsdWdpblNjcmlwdGxlc3M7XG4gIH0oKTtcblxuICAvKiBhY2UgcGx1Z2luXG4gICAqL1xuXG4gIHZhciBQbHVnaW5BY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luQWNlKGpvdHRlZCwgb3B0aW9ucykge1xuICAgICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUGx1Z2luQWNlKTtcblxuICAgICAgdmFyIHByaW9yaXR5ID0gMTtcbiAgICAgIHZhciBpO1xuXG4gICAgICB0aGlzLmVkaXRvciA9IHt9O1xuICAgICAgdGhpcy5qb3R0ZWQgPSBqb3R0ZWQ7XG5cbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge30pO1xuXG4gICAgICAvLyBjaGVjayBpZiBBY2UgaXMgbG9hZGVkXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5hY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICRlZGl0b3JzID0gam90dGVkLiRjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmpvdHRlZC1lZGl0b3InKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8ICRlZGl0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciAkdGV4dGFyZWEgPSAkZWRpdG9yc1tpXS5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICB2YXIgdHlwZSA9IGRhdGEoJHRleHRhcmVhLCAnam90dGVkLXR5cGUnKTtcbiAgICAgICAgdmFyIGZpbGUgPSBkYXRhKCR0ZXh0YXJlYSwgJ2pvdHRlZC1maWxlJyk7XG5cbiAgICAgICAgdmFyICRhY2VDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgJGVkaXRvcnNbaV0uYXBwZW5kQ2hpbGQoJGFjZUNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy5lZGl0b3JbdHlwZV0gPSB3aW5kb3cuYWNlLmVkaXQoJGFjZUNvbnRhaW5lcik7XG4gICAgICAgIHZhciBlZGl0b3IgPSB0aGlzLmVkaXRvclt0eXBlXTtcblxuICAgICAgICB2YXIgZWRpdG9yT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zKTtcblxuICAgICAgICBlZGl0b3IuZ2V0U2Vzc2lvbigpLnNldE1vZGUoJ2FjZS9tb2RlLycgKyBnZXRNb2RlKHR5cGUsIGZpbGUpKTtcbiAgICAgICAgZWRpdG9yLmdldFNlc3Npb24oKS5zZXRPcHRpb25zKGVkaXRvck9wdGlvbnMpO1xuXG4gICAgICAgIGVkaXRvci4kYmxvY2tTY3JvbGxpbmcgPSBJbmZpbml0eTtcbiAgICAgIH1cblxuICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCBwcmlvcml0eSk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoUGx1Z2luQWNlLCBbe1xuICAgICAga2V5OiAnZWRpdG9yQ2hhbmdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBlZGl0b3JDaGFuZ2UocGFyYW1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpcy5qb3R0ZWQudHJpZ2dlcignY2hhbmdlJywgcGFyYW1zKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSB0aGlzLmVkaXRvcltwYXJhbXMudHlwZV07XG5cbiAgICAgICAgLy8gaWYgdGhlIGV2ZW50IGlzIG5vdCBzdGFydGVkIGJ5IHRoZSBhY2UgY2hhbmdlLlxuICAgICAgICAvLyB0cmlnZ2VyZWQgb25seSBvbmNlIHBlciBlZGl0b3IsXG4gICAgICAgIC8vIHdoZW4gdGhlIHRleHRhcmVhIGlzIHBvcHVsYXRlZC9maWxlIGlzIGxvYWRlZC5cbiAgICAgICAgaWYgKCFwYXJhbXMuYWNlRWRpdG9yKSB7XG4gICAgICAgICAgZWRpdG9yLmdldFNlc3Npb24oKS5zZXRWYWx1ZShwYXJhbXMuY29udGVudCk7XG5cbiAgICAgICAgICAvLyBhdHRhY2ggdGhlIGV2ZW50IG9ubHkgYWZ0ZXIgdGhlIGZpbGUgaXMgbG9hZGVkXG4gICAgICAgICAgcGFyYW1zLmFjZUVkaXRvciA9IGVkaXRvcjtcbiAgICAgICAgICBlZGl0b3Iub24oJ2NoYW5nZScsIHRoaXMuZWRpdG9yQ2hhbmdlKHBhcmFtcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFuaXB1bGF0ZSB0aGUgcGFyYW1zIGFuZCBwYXNzIHRoZW0gb25cbiAgICAgICAgcGFyYW1zLmNvbnRlbnQgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIFBsdWdpbkFjZTtcbiAgfSgpO1xuXG4gIC8qIGNvcmVtaXJyb3IgcGx1Z2luXG4gICAqL1xuXG4gIHZhciBQbHVnaW5Db2RlTWlycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsdWdpbkNvZGVNaXJyb3Ioam90dGVkLCBvcHRpb25zKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5Db2RlTWlycm9yKTtcblxuICAgICAgdmFyIHByaW9yaXR5ID0gMTtcbiAgICAgIHZhciBpO1xuXG4gICAgICB0aGlzLmVkaXRvciA9IHt9O1xuICAgICAgdGhpcy5qb3R0ZWQgPSBqb3R0ZWQ7XG5cbiAgICAgIC8vIGN1c3RvbSBtb2RlbWFwIGZvciBjb2RlbWlycm9yXG4gICAgICB2YXIgbW9kZW1hcCA9IHtcbiAgICAgICAgJ2h0bWwnOiAnaHRtbG1peGVkJ1xuICAgICAgfTtcblxuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLy8gY2hlY2sgaWYgQ29kZU1pcnJvciBpcyBsb2FkZWRcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LkNvZGVNaXJyb3IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICRlZGl0b3JzID0gam90dGVkLiRjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmpvdHRlZC1lZGl0b3InKTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8ICRlZGl0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciAkdGV4dGFyZWEgPSAkZWRpdG9yc1tpXS5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICB2YXIgdHlwZSA9IGRhdGEoJHRleHRhcmVhLCAnam90dGVkLXR5cGUnKTtcbiAgICAgICAgdmFyIGZpbGUgPSBkYXRhKCR0ZXh0YXJlYSwgJ2pvdHRlZC1maWxlJyk7XG5cbiAgICAgICAgdGhpcy5lZGl0b3JbdHlwZV0gPSB3aW5kb3cuQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoJHRleHRhcmVhLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5lZGl0b3JbdHlwZV0uc2V0T3B0aW9uKCdtb2RlJywgZ2V0TW9kZSh0eXBlLCBmaWxlLCBtb2RlbWFwKSk7XG4gICAgICB9XG5cbiAgICAgIGpvdHRlZC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UuYmluZCh0aGlzKSwgcHJpb3JpdHkpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFBsdWdpbkNvZGVNaXJyb3IsIFt7XG4gICAgICBrZXk6ICdlZGl0b3JDaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVkaXRvckNoYW5nZShwYXJhbXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICBfdGhpcy5qb3R0ZWQudHJpZ2dlcignY2hhbmdlJywgcGFyYW1zKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSB0aGlzLmVkaXRvcltwYXJhbXMudHlwZV07XG5cbiAgICAgICAgLy8gaWYgdGhlIGV2ZW50IGlzIG5vdCBzdGFydGVkIGJ5IHRoZSBjb2RlbWlycm9yIGNoYW5nZS5cbiAgICAgICAgLy8gdHJpZ2dlcmVkIG9ubHkgb25jZSBwZXIgZWRpdG9yLFxuICAgICAgICAvLyB3aGVuIHRoZSB0ZXh0YXJlYSBpcyBwb3B1bGF0ZWQvZmlsZSBpcyBsb2FkZWQuXG4gICAgICAgIGlmICghcGFyYW1zLmNtRWRpdG9yKSB7XG4gICAgICAgICAgZWRpdG9yLnNldFZhbHVlKHBhcmFtcy5jb250ZW50KTtcblxuICAgICAgICAgIC8vIGF0dGFjaCB0aGUgZXZlbnQgb25seSBhZnRlciB0aGUgZmlsZSBpcyBsb2FkZWRcbiAgICAgICAgICBwYXJhbXMuY21FZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgICAgZWRpdG9yLm9uKCdjaGFuZ2UnLCB0aGlzLmVkaXRvckNoYW5nZShwYXJhbXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1hbmlwdWxhdGUgdGhlIHBhcmFtcyBhbmQgcGFzcyB0aGVtIG9uXG4gICAgICAgIHBhcmFtcy5jb250ZW50ID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5Db2RlTWlycm9yO1xuICB9KCk7XG5cbiAgLyogbGVzcyBwbHVnaW5cbiAgICovXG5cbiAgdmFyIFBsdWdpbkxlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luTGVzcyhqb3R0ZWQsIG9wdGlvbnMpIHtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBsdWdpbkxlc3MpO1xuXG4gICAgICB2YXIgcHJpb3JpdHkgPSAyMDtcblxuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7fSk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIGxlc3MgaXMgbG9hZGVkXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5sZXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGNoYW5nZSBDU1MgbGluayBsYWJlbCB0byBMZXNzXG4gICAgICBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhW2RhdGEtam90dGVkLXR5cGU9XCJjc3NcIl0nKS5pbm5lckhUTUwgPSAnTGVzcyc7XG5cbiAgICAgIGpvdHRlZC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UuYmluZCh0aGlzKSwgcHJpb3JpdHkpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFBsdWdpbkxlc3MsIFt7XG4gICAgICBrZXk6ICdpc0xlc3MnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzTGVzcyhwYXJhbXMpIHtcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlICE9PSAnY3NzJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhbXMuZmlsZS5pbmRleE9mKCcubGVzcycpICE9PSAtMSB8fCBwYXJhbXMuZmlsZSA9PT0gJyc7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2hhbmdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFuZ2UocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBvbmx5IHBhcnNlIC5sZXNzIGFuZCBibGFuayBmaWxlc1xuICAgICAgICBpZiAodGhpcy5pc0xlc3MocGFyYW1zKSkge1xuICAgICAgICAgIHdpbmRvdy5sZXNzLnJlbmRlcihwYXJhbXMuY29udGVudCwgdGhpcy5vcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGNvbnRlbnQgd2l0aCB0aGUgcGFyc2VkIGxlc3NcbiAgICAgICAgICAgICAgcGFyYW1zLmNvbnRlbnQgPSByZXMuY3NzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBwYXJhbXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBjYWxsYmFjayBlaXRoZXIgd2F5LFxuICAgICAgICAgIC8vIHRvIG5vdCBicmVhayB0aGUgcHVic291cFxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIFBsdWdpbkxlc3M7XG4gIH0oKTtcblxuICAvKiBjb2ZmZWVzY3JpcHQgcGx1Z2luXG4gICAqL1xuXG4gIHZhciBQbHVnaW5Db2ZmZWVTY3JpcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luQ29mZmVlU2NyaXB0KGpvdHRlZCwgb3B0aW9ucykge1xuICAgICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUGx1Z2luQ29mZmVlU2NyaXB0KTtcblxuICAgICAgdmFyIHByaW9yaXR5ID0gMjA7XG5cbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge30pO1xuXG4gICAgICAvLyBjaGVjayBpZiBjb2ZmZWVzY3JpcHQgaXMgbG9hZGVkXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5Db2ZmZWVTY3JpcHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gY2hhbmdlIEpTIGxpbmsgbGFiZWwgdG8gTGVzc1xuICAgICAgam90dGVkLiRjb250YWluZXIucXVlcnlTZWxlY3RvcignYVtkYXRhLWpvdHRlZC10eXBlPVwianNcIl0nKS5pbm5lckhUTUwgPSAnQ29mZmVlU2NyaXB0JztcblxuICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCBwcmlvcml0eSk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoUGx1Z2luQ29mZmVlU2NyaXB0LCBbe1xuICAgICAga2V5OiAnaXNDb2ZmZWUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQ29mZmVlKHBhcmFtcykge1xuICAgICAgICBpZiAocGFyYW1zLnR5cGUgIT09ICdqcycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyYW1zLmZpbGUuaW5kZXhPZignLmNvZmZlZScpICE9PSAtMSB8fCBwYXJhbXMuZmlsZSA9PT0gJyc7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2hhbmdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFuZ2UocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBvbmx5IHBhcnNlIC5sZXNzIGFuZCBibGFuayBmaWxlc1xuICAgICAgICBpZiAodGhpcy5pc0NvZmZlZShwYXJhbXMpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhcmFtcy5jb250ZW50ID0gd2luZG93LkNvZmZlZVNjcmlwdC5jb21waWxlKHBhcmFtcy5jb250ZW50KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIFBsdWdpbkNvZmZlZVNjcmlwdDtcbiAgfSgpO1xuXG4gIC8qIHN0eWx1cyBwbHVnaW5cbiAgICovXG5cbiAgdmFyIFBsdWdpblN0eWx1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbHVnaW5TdHlsdXMoam90dGVkLCBvcHRpb25zKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5TdHlsdXMpO1xuXG4gICAgICB2YXIgcHJpb3JpdHkgPSAyMDtcblxuICAgICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7fSk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHN0eWx1cyBpcyBsb2FkZWRcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LnN0eWx1cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGFuZ2UgQ1NTIGxpbmsgbGFiZWwgdG8gU3R5bHVzXG4gICAgICBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhW2RhdGEtam90dGVkLXR5cGU9XCJjc3NcIl0nKS5pbm5lckhUTUwgPSAnU3R5bHVzJztcblxuICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCBwcmlvcml0eSk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoUGx1Z2luU3R5bHVzLCBbe1xuICAgICAga2V5OiAnaXNTdHlsdXMnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzU3R5bHVzKHBhcmFtcykge1xuICAgICAgICBpZiAocGFyYW1zLnR5cGUgIT09ICdjc3MnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmFtcy5maWxlLmluZGV4T2YoJy5zdHlsJykgIT09IC0xIHx8IHBhcmFtcy5maWxlID09PSAnJztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIG9ubHkgcGFyc2UgLnN0eWwgYW5kIGJsYW5rIGZpbGVzXG4gICAgICAgIGlmICh0aGlzLmlzU3R5bHVzKHBhcmFtcykpIHtcbiAgICAgICAgICB3aW5kb3cuc3R5bHVzKHBhcmFtcy5jb250ZW50LCB0aGlzLm9wdGlvbnMpLnJlbmRlcihmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGNvbnRlbnQgd2l0aCB0aGUgcGFyc2VkIGxlc3NcbiAgICAgICAgICAgICAgcGFyYW1zLmNvbnRlbnQgPSByZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGNhbGxiYWNrIGVpdGhlciB3YXksXG4gICAgICAgICAgLy8gdG8gbm90IGJyZWFrIHRoZSBwdWJzb3VwXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gUGx1Z2luU3R5bHVzO1xuICB9KCk7XG5cbiAgLyogYmFiZWwgcGx1Z2luXG4gICAqL1xuXG4gIHZhciBQbHVnaW5CYWJlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbHVnaW5CYWJlbChqb3R0ZWQsIG9wdGlvbnMpIHtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBsdWdpbkJhYmVsKTtcblxuICAgICAgdmFyIHByaW9yaXR5ID0gMjA7XG5cbiAgICAgIHRoaXMub3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7fSk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIGJhYmVsIGlzIGxvYWRlZFxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuQmFiZWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHVzaW5nIGJhYmVsLXN0YW5kYWxvbmVcbiAgICAgICAgdGhpcy5iYWJlbCA9IHdpbmRvdy5CYWJlbDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5iYWJlbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdXNpbmcgYnJvd3Nlci5qcyBmcm9tIGJhYmVsLWNvcmUgNS54XG4gICAgICAgIHRoaXMuYmFiZWwgPSB7XG4gICAgICAgICAgdHJhbnNmb3JtOiB3aW5kb3cuYmFiZWxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gY2hhbmdlIGpzIGxpbmsgbGFiZWxcbiAgICAgIGpvdHRlZC4kY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2FbZGF0YS1qb3R0ZWQtdHlwZT1cImpzXCJdJykuaW5uZXJIVE1MID0gJ0VTMjAxNSc7XG5cbiAgICAgIGpvdHRlZC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UuYmluZCh0aGlzKSwgcHJpb3JpdHkpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNsYXNzKFBsdWdpbkJhYmVsLCBbe1xuICAgICAga2V5OiAnY2hhbmdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFuZ2UocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBvbmx5IHBhcnNlIGpzIGNvbnRlbnRcbiAgICAgICAgaWYgKHBhcmFtcy50eXBlID09PSAnanMnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhcmFtcy5jb250ZW50ID0gdGhpcy5iYWJlbC50cmFuc2Zvcm0ocGFyYW1zLmNvbnRlbnQsIHRoaXMub3B0aW9ucykuY29kZTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHBhcmFtcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgY2FsbGJhY2sgZWl0aGVyIHdheSxcbiAgICAgICAgICAvLyB0byBub3QgYnJlYWsgdGhlIHB1YnNvdXBcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5CYWJlbDtcbiAgfSgpO1xuXG4gIC8qIG1hcmtkb3duIHBsdWdpblxuICAgKi9cblxuICB2YXIgUGx1Z2luTWFya2Rvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luTWFya2Rvd24oam90dGVkLCBvcHRpb25zKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5NYXJrZG93bik7XG5cbiAgICAgIHZhciBwcmlvcml0eSA9IDIwO1xuXG4gICAgICB0aGlzLm9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge30pO1xuXG4gICAgICAvLyBjaGVjayBpZiBtYXJrZWQgaXMgbG9hZGVkXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5tYXJrZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgd2luZG93Lm1hcmtlZC5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgICAvLyBjaGFuZ2UgaHRtbCBsaW5rIGxhYmVsXG4gICAgICBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhW2RhdGEtam90dGVkLXR5cGU9XCJodG1sXCJdJykuaW5uZXJIVE1MID0gJ01hcmtkb3duJztcblxuICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCBwcmlvcml0eSk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoUGx1Z2luTWFya2Rvd24sIFt7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIG9ubHkgcGFyc2UgaHRtbCBjb250ZW50XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhcmFtcy5jb250ZW50ID0gd2luZG93Lm1hcmtlZChwYXJhbXMuY29udGVudCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBwYXJhbXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGNhbGxiYWNrIGVpdGhlciB3YXksXG4gICAgICAgICAgLy8gdG8gbm90IGJyZWFrIHRoZSBwdWJzb3VwXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gUGx1Z2luTWFya2Rvd247XG4gIH0oKTtcblxuICAvKiBjb25zb2xlIHBsdWdpblxuICAgKi9cblxuICB2YXIgUGx1Z2luQ29uc29sZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbHVnaW5Db25zb2xlKGpvdHRlZCwgb3B0aW9ucykge1xuICAgICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUGx1Z2luQ29uc29sZSk7XG5cbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuICAgICAgICBhdXRvQ2xlYXI6IGZhbHNlXG4gICAgICB9KTtcblxuICAgICAgdmFyIHByaW9yaXR5ID0gMzA7XG4gICAgICB2YXIgaGlzdG9yeSA9IFtdO1xuICAgICAgdmFyIGhpc3RvcnlJbmRleCA9IDA7XG4gICAgICB2YXIgbG9nQ2FwdHVyZVNuaXBwZXQgPSAnKCcgKyB0aGlzLmNhcHR1cmUudG9TdHJpbmcoKSArICcpKCk7JztcbiAgICAgIHZhciBjb250ZW50Q2FjaGUgPSB7XG4gICAgICAgIGh0bWw6ICcnLFxuICAgICAgICBjc3M6ICcnLFxuICAgICAgICBqczogJydcbiAgICAgIH07XG5cbiAgICAgIC8vIG5ldyB0YWIgYW5kIHBhbmUgbWFya3VwXG4gICAgICB2YXIgJG5hdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBhZGRDbGFzcygkbmF2LCAnam90dGVkLW5hdi1pdGVtIGpvdHRlZC1uYXYtaXRlbS1jb25zb2xlJyk7XG4gICAgICAkbmF2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGRhdGEtam90dGVkLXR5cGU9XCJjb25zb2xlXCI+SlMgQ29uc29sZTwvYT4nO1xuXG4gICAgICB2YXIgJHBhbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGFkZENsYXNzKCRwYW5lLCAnam90dGVkLXBhbmUgam90dGVkLXBhbmUtY29uc29sZScpO1xuXG4gICAgICAkcGFuZS5pbm5lckhUTUwgPSAnXFxuICAgICAgPGRpdiBjbGFzcz1cImpvdHRlZC1jb25zb2xlLWNvbnRhaW5lclwiPlxcbiAgICAgICAgPHVsIGNsYXNzPVwiam90dGVkLWNvbnNvbGUtb3V0cHV0XCI+PC91bD5cXG4gICAgICAgIDxmb3JtIGNsYXNzPVwiam90dGVkLWNvbnNvbGUtaW5wdXRcIj5cXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XFxuICAgICAgICA8L2Zvcm0+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImpvdHRlZC1idXR0b24gam90dGVkLWNvbnNvbGUtY2xlYXJcIj5DbGVhcjwvYnV0dG9uPlxcbiAgICAnO1xuXG4gICAgICBqb3R0ZWQuJGNvbnRhaW5lci5hcHBlbmRDaGlsZCgkcGFuZSk7XG4gICAgICBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuam90dGVkLW5hdicpLmFwcGVuZENoaWxkKCRuYXYpO1xuXG4gICAgICB2YXIgJGNvbnRhaW5lciA9IGpvdHRlZC4kY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5qb3R0ZWQtY29uc29sZS1jb250YWluZXInKTtcbiAgICAgIHZhciAkb3V0cHV0ID0gam90dGVkLiRjb250YWluZXIucXVlcnlTZWxlY3RvcignLmpvdHRlZC1jb25zb2xlLW91dHB1dCcpO1xuICAgICAgdmFyICRpbnB1dCA9IGpvdHRlZC4kY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5qb3R0ZWQtY29uc29sZS1pbnB1dCBpbnB1dCcpO1xuICAgICAgdmFyICRpbnB1dEZvcm0gPSBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuam90dGVkLWNvbnNvbGUtaW5wdXQnKTtcbiAgICAgIHZhciAkY2xlYXIgPSBqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuam90dGVkLWNvbnNvbGUtY2xlYXInKTtcblxuICAgICAgLy8gc3VibWl0IHRoZSBpbnB1dCBmb3JtXG4gICAgICAkaW5wdXRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuc3VibWl0LmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBjb25zb2xlIGhpc3RvcnlcbiAgICAgICRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oaXN0b3J5LmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBjbGVhciBidXR0b25cbiAgICAgICRjbGVhci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xlYXIuYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIGNsZWFyIHRoZSBjb25zb2xlIG9uIGVhY2ggY2hhbmdlXG4gICAgICBpZiAob3B0aW9ucy5hdXRvQ2xlYXIgPT09IHRydWUpIHtcbiAgICAgICAgam90dGVkLm9uKCdjaGFuZ2UnLCB0aGlzLmF1dG9DbGVhci5iaW5kKHRoaXMpLCBwcmlvcml0eSAtIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyBjYXB0dXJlIHRoZSBjb25zb2xlIG9uIGVhY2ggY2hhbmdlXG4gICAgICBqb3R0ZWQub24oJ2NoYW5nZScsIHRoaXMuY2hhbmdlLmJpbmQodGhpcyksIHByaW9yaXR5KTtcblxuICAgICAgLy8gZ2V0IGxvZyBldmVudHMgZnJvbSB0aGUgaWZyYW1lXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuZ2V0TWVzc2FnZS5iaW5kKHRoaXMpKTtcblxuICAgICAgLy8gcGx1Z2luIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgICB0aGlzLiRqb3R0ZWRDb250YWluZXIgPSBqb3R0ZWQuJGNvbnRhaW5lcjtcbiAgICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG4gICAgICB0aGlzLiRpbnB1dCA9ICRpbnB1dDtcbiAgICAgIHRoaXMuJG91dHB1dCA9ICRvdXRwdXQ7XG4gICAgICB0aGlzLmhpc3RvcnkgPSBoaXN0b3J5O1xuICAgICAgdGhpcy5oaXN0b3J5SW5kZXggPSBoaXN0b3J5SW5kZXg7XG4gICAgICB0aGlzLmxvZ0NhcHR1cmVTbmlwcGV0ID0gbG9nQ2FwdHVyZVNuaXBwZXQ7XG4gICAgICB0aGlzLmNvbnRlbnRDYWNoZSA9IGNvbnRlbnRDYWNoZTtcbiAgICAgIHRoaXMuZ2V0SWZyYW1lID0gdGhpcy5nZXRJZnJhbWUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDbGFzcyhQbHVnaW5Db25zb2xlLCBbe1xuICAgICAga2V5OiAnZ2V0SWZyYW1lJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJZnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRqb3R0ZWRDb250YWluZXIucXVlcnlTZWxlY3RvcignLmpvdHRlZC1wYW5lLXJlc3VsdCBpZnJhbWUnKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdnZXRNZXNzYWdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRNZXNzYWdlKGUpIHtcbiAgICAgICAgLy8gb25seSBjYXRjaCBtZXNzYWdlcyBmcm9tIHRoZSBpZnJhbWVcbiAgICAgICAgaWYgKGUuc291cmNlICE9PSB0aGlzLmdldElmcmFtZSgpLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGF0YSQkMSA9IHt9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGRhdGEkJDEgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge31cblxuICAgICAgICBpZiAoZGF0YSQkMS50eXBlID09PSAnam90dGVkLWNvbnNvbGUtbG9nJykge1xuICAgICAgICAgIHRoaXMubG9nKGRhdGEkJDEubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdhdXRvQ2xlYXInLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGF1dG9DbGVhcihwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzbmlwcGV0bGVzc0NvbnRlbnQgPSBwYXJhbXMuY29udGVudDtcblxuICAgICAgICAvLyByZW1vdmUgdGhlIHNuaXBwZXQgZnJvbSBjYWNoZWQganMgY29udGVudFxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09ICdqcycpIHtcbiAgICAgICAgICBzbmlwcGV0bGVzc0NvbnRlbnQgPSBzbmlwcGV0bGVzc0NvbnRlbnQucmVwbGFjZSh0aGlzLmxvZ0NhcHR1cmVTbmlwcGV0LCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBQbGF5IHBsdWdpbixcbiAgICAgICAgLy8gY2xlYXIgdGhlIGNvbnNvbGUgb25seSBpZiBzb21ldGhpbmcgaGFzIGNoYW5nZWQgb3IgZm9yY2UgcmVuZGVyaW5nLlxuICAgICAgICBpZiAocGFyYW1zLmZvcmNlUmVuZGVyID09PSB0cnVlIHx8IHRoaXMuY29udGVudENhY2hlW3BhcmFtcy50eXBlXSAhPT0gc25pcHBldGxlc3NDb250ZW50KSB7XG4gICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWx3YXlzIGNhY2hlIHRoZSBsYXRlc3QgY29udGVudFxuICAgICAgICB0aGlzLmNvbnRlbnRDYWNoZVtwYXJhbXMudHlwZV0gPSBzbmlwcGV0bGVzc0NvbnRlbnQ7XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGFuZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZShwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIG9ubHkgcGFyc2UganMgY29udGVudFxuICAgICAgICBpZiAocGFyYW1zLnR5cGUgIT09ICdqcycpIHtcbiAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgY2FsbGJhY2sgZWl0aGVyIHdheSxcbiAgICAgICAgICAvLyB0byBub3QgYnJlYWsgdGhlIHB1YnNvdXBcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBzbmlwcGV0IGlzIGFscmVhZHkgYWRkZWQuXG4gICAgICAgIC8vIHRoZSBQbGF5IHBsdWdpbiBjYWNoZXMgdGhlIGNoYW5nZWQgcGFyYW1zIGFuZCB0cmlnZ2VycyBjaGFuZ2VcbiAgICAgICAgLy8gd2l0aCB0aGUgY2FjaGVkIHJlc3BvbnNlLCBjYXVzaW5nIHRoZSBzbmlwcGV0IHRvIGJlIGluc2VydGVkXG4gICAgICAgIC8vIG11bHRpcGxlIHRpbWVzLCBvbiBlYWNoIHRyaWdnZXIuXG4gICAgICAgIGlmIChwYXJhbXMuY29udGVudC5pbmRleE9mKHRoaXMubG9nQ2FwdHVyZVNuaXBwZXQpID09PSAtMSkge1xuICAgICAgICAgIHBhcmFtcy5jb250ZW50ID0gJycgKyB0aGlzLmxvZ0NhcHR1cmVTbmlwcGV0ICsgcGFyYW1zLmNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhudWxsLCBwYXJhbXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBjYXB0dXJlIHRoZSBjb25zb2xlLmxvZyBvdXRwdXRcblxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NhcHR1cmUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhcHR1cmUoKSB7XG4gICAgICAgIC8vIElFOSB3aXRoIGRldnRvb2xzIGNsb3NlZFxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5jb25zb2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmNvbnNvbGUubG9nID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHdpbmRvdy5jb25zb2xlID0ge1xuICAgICAgICAgICAgbG9nOiBmdW5jdGlvbiBsb2coKSB7fVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgSUU5IHN1cHBvcnRcbiAgICAgICAgdmFyIG9sZENvbnNvbGVMb2cgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKHdpbmRvdy5jb25zb2xlLmxvZywgd2luZG93LmNvbnNvbGUpO1xuXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBzZW5kIGxvZyBtZXNzYWdlcyB0byB0aGUgcGFyZW50IHdpbmRvd1xuICAgICAgICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2pvdHRlZC1jb25zb2xlLWxvZycsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pLCAnKicpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaW4gSUU5LCBjb25zb2xlLmxvZyBpcyBvYmplY3QgaW5zdGVhZCBvZiBmdW5jdGlvblxuICAgICAgICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvNTg1ODk2L2NvbnNvbGUtbG9nLXR5cGVvZi1pcy1vYmplY3QtaW5zdGVhZC1vZi1mdW5jdGlvblxuICAgICAgICAgIG9sZENvbnNvbGVMb2cuYXBwbHkob2xkQ29uc29sZUxvZywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdsb2cnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvZygpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICcnO1xuICAgICAgICB2YXIgdHlwZSA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB2YXIgJGxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGFkZENsYXNzKCRsb2csICdqb3R0ZWQtY29uc29sZS1sb2cnKTtcblxuICAgICAgICBpZiAodHlwZW9mIHR5cGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgYWRkQ2xhc3MoJGxvZywgJ2pvdHRlZC1jb25zb2xlLWxvZy0nICsgdHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkbG9nLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgdGhpcy4kb3V0cHV0LmFwcGVuZENoaWxkKCRsb2cpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3N1Ym1pdCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3VibWl0KGUpIHtcbiAgICAgICAgdmFyIGlucHV0VmFsdWUgPSB0aGlzLiRpbnB1dC52YWx1ZS50cmltKCk7XG5cbiAgICAgICAgLy8gaWYgaW5wdXQgaXMgYmxhbmssIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBydW4gdG8gaGlzdG9yeVxuICAgICAgICB0aGlzLmhpc3RvcnkucHVzaChpbnB1dFZhbHVlKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5SW5kZXggPSB0aGlzLmhpc3RvcnkubGVuZ3RoO1xuXG4gICAgICAgIC8vIGxvZyBpbnB1dCB2YWx1ZVxuICAgICAgICB0aGlzLmxvZyhpbnB1dFZhbHVlLCAnaGlzdG9yeScpO1xuXG4gICAgICAgIC8vIGFkZCByZXR1cm4gaWYgaXQgZG9lc24ndCBzdGFydCB3aXRoIGl0XG4gICAgICAgIGlmIChpbnB1dFZhbHVlLmluZGV4T2YoJ3JldHVybicpICE9PSAwKSB7XG4gICAgICAgICAgaW5wdXRWYWx1ZSA9ICdyZXR1cm4gJyArIGlucHV0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG93IG91dHB1dCBvciBlcnJvcnNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBydW4gdGhlIGNvbnNvbGUgaW5wdXQgaW4gdGhlIGlmcmFtZSBjb250ZXh0XG4gICAgICAgICAgdmFyIHNjcmlwdE91dHB1dCA9IHRoaXMuZ2V0SWZyYW1lKCkuY29udGVudFdpbmRvdy5ldmFsKCcoZnVuY3Rpb24oKSB7JyArIGlucHV0VmFsdWUgKyAnfSkoKScpO1xuXG4gICAgICAgICAgdGhpcy5sb2coc2NyaXB0T3V0cHV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5sb2coZXJyLCAnZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBjb25zb2xlIHZhbHVlXG4gICAgICAgIHRoaXMuJGlucHV0LnZhbHVlID0gJyc7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGNvbnNvbGUgcGFuZSB0byBib3R0b21cbiAgICAgICAgLy8gdG8ga2VlcCB0aGUgaW5wdXQgaW50byB2aWV3XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5zY3JvbGxUb3AgPSB0aGlzLiRjb250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbGVhcicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuJG91dHB1dC5pbm5lckhUTUwgPSAnJztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdoaXN0b3J5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBoaXN0b3J5KGUpIHtcbiAgICAgICAgdmFyIFVQID0gMzg7XG4gICAgICAgIHZhciBET1dOID0gNDA7XG4gICAgICAgIHZhciBnb3RIaXN0b3J5ID0gZmFsc2U7XG4gICAgICAgIHZhciBzZWxlY3Rpb25TdGFydCA9IHRoaXMuJGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuXG4gICAgICAgIC8vIG9ubHkgaWYgd2UgaGF2ZSBwcmV2aW91cyBoaXN0b3J5XG4gICAgICAgIC8vIGFuZCB0aGUgY3Vyc29yIGlzIGF0IHRoZSBzdGFydFxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBVUCAmJiB0aGlzLmhpc3RvcnlJbmRleCAhPT0gMCAmJiBzZWxlY3Rpb25TdGFydCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuaGlzdG9yeUluZGV4LS07XG4gICAgICAgICAgZ290SGlzdG9yeSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvbmx5IGlmIHdlIGhhdmUgZnV0dXJlIGhpc3RvcnlcbiAgICAgICAgLy8gYW5kIHRoZSBjdXJzb3IgaXMgYXQgdGhlIGVuZFxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBET1dOICYmIHRoaXMuaGlzdG9yeUluZGV4ICE9PSB0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMSAmJiBzZWxlY3Rpb25TdGFydCA9PT0gdGhpcy4kaW5wdXQudmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5SW5kZXgrKztcbiAgICAgICAgICBnb3RIaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgaWYgaGlzdG9yeSBjaGFuZ2VkXG4gICAgICAgIGlmIChnb3RIaXN0b3J5KSB7XG4gICAgICAgICAgdGhpcy4kaW5wdXQudmFsdWUgPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5SW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5Db25zb2xlO1xuICB9KCk7XG5cbiAgLyogcGxheSBwbHVnaW5cbiAgICogYWRkcyBhIFJ1biBidXR0b25cbiAgICovXG5cbiAgdmFyIFBsdWdpblBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGx1Z2luUGxheShqb3R0ZWQsIG9wdGlvbnMpIHtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBsdWdpblBsYXkpO1xuXG4gICAgICBvcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHtcbiAgICAgICAgZmlyc3RSdW46IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgcHJpb3JpdHkgPSAxMDtcbiAgICAgIC8vIGNhY2hlZCBjb2RlXG4gICAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICAgIC8vIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBjb2RlLlxuICAgICAgLy8gcmVwbGFjZXMgdGhlIGNhY2hlIHdoZW4gdGhlIHJ1biBidXR0b24gaXMgcHJlc3NlZC5cbiAgICAgIHZhciBjb2RlID0ge307XG5cbiAgICAgIC8vIHNldCBmaXJzdFJ1bj1mYWxzZSB0byBzdGFydCB3aXRoIGEgYmxhbmsgcHJldmlldy5cbiAgICAgIC8vIHJ1biB0aGUgcmVhbCBjb250ZW50IG9ubHkgYWZ0ZXIgdGhlIGZpcnN0IFJ1biBidXR0b24gcHJlc3MuXG4gICAgICBpZiAob3B0aW9ucy5maXJzdFJ1biA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FjaGUgPSB7XG4gICAgICAgICAgaHRtbDoge1xuICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgY29udGVudDogJydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgdHlwZTogJ2NzcycsXG4gICAgICAgICAgICBjb250ZW50OiAnJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAganM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdqcycsXG4gICAgICAgICAgICBjb250ZW50OiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gcnVuIGJ1dHRvblxuICAgICAgdmFyICRidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICRidXR0b24uY2xhc3NOYW1lID0gJ2pvdHRlZC1idXR0b24gam90dGVkLWJ1dHRvbi1wbGF5JztcbiAgICAgICRidXR0b24uaW5uZXJIVE1MID0gJ1J1bic7XG5cbiAgICAgIGpvdHRlZC4kY29udGFpbmVyLmFwcGVuZENoaWxkKCRidXR0b24pO1xuICAgICAgJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucnVuLmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBjYXB0dXJlIHRoZSBjb2RlIG9uIGVhY2ggY2hhbmdlXG4gICAgICBqb3R0ZWQub24oJ2NoYW5nZScsIHRoaXMuY2hhbmdlLmJpbmQodGhpcyksIHByaW9yaXR5KTtcblxuICAgICAgLy8gcHVibGljXG4gICAgICB0aGlzLmNhY2hlID0gY2FjaGU7XG4gICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgICAgdGhpcy5qb3R0ZWQgPSBqb3R0ZWQ7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoUGx1Z2luUGxheSwgW3tcbiAgICAgIGtleTogJ2NoYW5nZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gYWx3YXlzIGNhY2hlIHRoZSBsYXRlc3QgY29kZVxuICAgICAgICB0aGlzLmNvZGVbcGFyYW1zLnR5cGVdID0gZXh0ZW5kKHBhcmFtcyk7XG5cbiAgICAgICAgLy8gcmVwbGFjZSB0aGUgcGFyYW1zIHdpdGggdGhlIGxhdGVzdCBjYWNoZVxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY2FjaGVbcGFyYW1zLnR5cGVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuY2FjaGVbcGFyYW1zLnR5cGVdKTtcblxuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBjYWNoZSBmb3JjZVJlbmRlcixcbiAgICAgICAgICAvLyBhbmQgc2VuZCBpdCB3aXRoIGVhY2ggY2hhbmdlLlxuICAgICAgICAgIHRoaXMuY2FjaGVbcGFyYW1zLnR5cGVdLmZvcmNlUmVuZGVyID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYWNoZSB0aGUgZmlyc3QgcnVuXG4gICAgICAgICAgdGhpcy5jYWNoZVtwYXJhbXMudHlwZV0gPSBleHRlbmQocGFyYW1zKTtcblxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdydW4nLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgICAgLy8gdHJpZ2dlciBjaGFuZ2Ugb24gZWFjaCB0eXBlIHdpdGggdGhlIGxhdGVzdCBjb2RlXG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5jb2RlKSB7XG4gICAgICAgICAgdGhpcy5jYWNoZVt0eXBlXSA9IGV4dGVuZCh0aGlzLmNvZGVbdHlwZV0sIHtcbiAgICAgICAgICAgIC8vIGZvcmNlIHJlbmRlcmluZyBvbiBlYWNoIFJ1biBwcmVzc1xuICAgICAgICAgICAgZm9yY2VSZW5kZXI6IHRydWVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIHRyaWdnZXIgdGhlIGNoYW5nZVxuICAgICAgICAgIHRoaXMuam90dGVkLnRyaWdnZXIoJ2NoYW5nZScsIHRoaXMuY2FjaGVbdHlwZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5QbGF5O1xuICB9KCk7XG5cbiAgLyogcGVuIHBsdWdpblxuICAgKi9cbiAgdmFyIFBsdWdpblBlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbHVnaW5QZW4oam90dGVkLCBvcHRpb25zKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5QZW4pO1xuXG4gICAgICAvLyBhdmFpbGFibGUgcGFuZXNcbiAgICAgIHZhciBwYW5lcyA9IHtcbiAgICAgICAgaHRtbDogeyB0aXRsZTogJ0hUTUwnLCBjbGFzc0NoZWNrZXI6ICdqb3R0ZWQtaGFzLWh0bWwnIH0sXG4gICAgICAgIGNzczogeyB0aXRsZTogJ0NTUycsIGNsYXNzQ2hlY2tlcjogJ2pvdHRlZC1oYXMtY3NzJyB9LFxuICAgICAgICBqczogeyB0aXRsZTogJ0phdmFTY3JpcHQnLCBjbGFzc0NoZWNrZXI6ICdqb3R0ZWQtaGFzLWpzJyB9LFxuICAgICAgICBjb25zb2xlOiB7IHRpdGxlOiAnQ29uc29sZScsIGNsYXNzQ2hlY2tlcjogJ2pvdHRlZC1wbHVnaW4tY29uc29sZScgfVxuICAgICAgfTtcblxuICAgICAgdmFyICRhdmFpbGFibGVQYW5lcyA9IFtdO1xuICAgICAgZm9yICh2YXIgcCBpbiBwYW5lcykge1xuICAgICAgICBpZiAoam90dGVkLiRjb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKHBhbmVzW3BdLmNsYXNzQ2hlY2tlcikpIHtcbiAgICAgICAgICAkYXZhaWxhYmxlUGFuZXMucHVzaChqb3R0ZWQuJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuam90dGVkLXBhbmUtJyArIHApKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc2l6YWJsZVBhbmVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRhdmFpbGFibGVQYW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdHlwZSA9IHZvaWQgMDtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8ICRhdmFpbGFibGVQYW5lc1tpXS5jbGFzc0xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoJGF2YWlsYWJsZVBhbmVzW2ldLmNsYXNzTGlzdFtqXS5pbmRleE9mKCdqb3R0ZWQtcGFuZS0nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHR5cGUgPSAkYXZhaWxhYmxlUGFuZXNbaV0uY2xhc3NMaXN0W2pdLnJlcGxhY2UoJ2pvdHRlZC1wYW5lLScsICcnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRwYW5lID0ge1xuICAgICAgICAgIGNvbnRhaW5lcjogJGF2YWlsYWJsZVBhbmVzW2ldLFxuICAgICAgICAgIGV4cGFuZGVyOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2l6YWJsZVBhbmVzLnB1c2goJHBhbmUpO1xuXG4gICAgICAgIHZhciAkcGFuZVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICRwYW5lVGl0bGUuY2xhc3NMaXN0LmFkZCgnam90dGVkLXBhbmUtdGl0bGUnKTtcbiAgICAgICAgJHBhbmVUaXRsZS5pbm5lckhUTUwgPSBwYW5lc1t0eXBlXS50aXRsZSB8fCB0eXBlO1xuXG4gICAgICAgIHZhciAkcGFuZUVsZW1lbnQgPSAkYXZhaWxhYmxlUGFuZXNbaV0uZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICRwYW5lRWxlbWVudC5pbnNlcnRCZWZvcmUoJHBhbmVUaXRsZSwgJHBhbmVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIC8vIGluc2VydCBleHBhbmRlciBlbGVtZW50LlxuICAgICAgICAvLyBvbmx5IHBhbmVzIHdoaWNoIGhhdmUgYW4gZXhwYW5kZXIgY2FuIGJlIHNocnVuayBvciBleHBhbmRlZFxuICAgICAgICAvLyBmaXJzdCBwYW5lIG11c3Qgbm90IGhhdmUgYSBleHBhbmRlclxuICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAkcGFuZS5leHBhbmRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICRwYW5lLmV4cGFuZGVyLmNsYXNzTGlzdC5hZGQoJ2pvdHRlZC1wbHVnaW4tcGVuLWV4cGFuZGVyJyk7XG4gICAgICAgICAgJHBhbmUuZXhwYW5kZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5zdGFydEV4cGFuZC5iaW5kKHRoaXMsIGpvdHRlZCkpO1xuXG4gICAgICAgICAgJHBhbmVFbGVtZW50Lmluc2VydEJlZm9yZSgkcGFuZS5leHBhbmRlciwgJHBhbmVUaXRsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDbGFzcyhQbHVnaW5QZW4sIFt7XG4gICAgICBrZXk6ICdzdGFydEV4cGFuZCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnRFeHBhbmQoam90dGVkLCBldmVudCkge1xuICAgICAgICB2YXIgJHBhbmUgPSB0aGlzLnJlc2l6YWJsZVBhbmVzLmZpbHRlcihmdW5jdGlvbiAocGFuZSkge1xuICAgICAgICAgIHJldHVybiBwYW5lLmV4cGFuZGVyID09PSBldmVudC50YXJnZXQ7XG4gICAgICAgIH0pLnNoaWZ0KCk7XG5cbiAgICAgICAgdmFyICRwcmV2aW91c1BhbmUgPSB0aGlzLnJlc2l6YWJsZVBhbmVzW3RoaXMucmVzaXphYmxlUGFuZXMuaW5kZXhPZigkcGFuZSkgLSAxXTtcblxuICAgICAgICB2YXIgJHJlbGF0aXZlUGl4ZWwgPSAxMDAgLyBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkcGFuZS5jb250YWluZXIucGFyZW50Tm9kZSlbJ3dpZHRoJ10sIDEwKTtcblxuICAgICAgICAvLyB1Z2x5IGJ1dCByZWxpYWJsZSAmIGNyb3NzLWJyb3dzZXIgd2F5IG9mIGdldHRpbmcgaGVpZ2h0L3dpZHRoIGFzIHBlcmNlbnRhZ2UuXG4gICAgICAgICRwYW5lLmNvbnRhaW5lci5wYXJlbnROb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgJHBhbmUuc3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgJHBhbmUuc3RhcnRXaWR0aCA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoJHBhbmUuY29udGFpbmVyKVsnd2lkdGgnXSwgMTApO1xuICAgICAgICAkcHJldmlvdXNQYW5lLnN0YXJ0V2lkdGggPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCRwcmV2aW91c1BhbmUuY29udGFpbmVyKVsnd2lkdGgnXSwgMTApO1xuXG4gICAgICAgICRwYW5lLmNvbnRhaW5lci5wYXJlbnROb2RlLnN0eWxlLmRpc3BsYXkgPSAnJztcblxuICAgICAgICAkcGFuZS5tb3VzZW1vdmUgPSB0aGlzLmRvRHJhZy5iaW5kKHRoaXMsICRwYW5lLCAkcHJldmlvdXNQYW5lLCAkcmVsYXRpdmVQaXhlbCk7XG4gICAgICAgICRwYW5lLm1vdXNldXAgPSB0aGlzLnN0b3BEcmFnLmJpbmQodGhpcywgJHBhbmUpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICRwYW5lLm1vdXNlbW92ZSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgJHBhbmUubW91c2V1cCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2RvRHJhZycsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZG9EcmFnKHBhbmUsIHByZXZpb3VzUGFuZSwgcmVsYXRpdmVQaXhlbCwgZXZlbnQpIHtcbiAgICAgICAgLy8gcHJldmlvdXMgcGFuZSBuZXcgd2lkdGhcbiAgICAgICAgdmFyIHBwTmV3V2lkdGggPSBwcmV2aW91c1BhbmUuc3RhcnRXaWR0aCArIChldmVudC5jbGllbnRYIC0gcGFuZS5zdGFydFgpICogcmVsYXRpdmVQaXhlbDtcblxuICAgICAgICAvLyBjdXJyZW50IHBhbmUgbmV3IHdpZHRoXG4gICAgICAgIHZhciBjcE5ld1dpZHRoID0gcGFuZS5zdGFydFdpZHRoIC0gKGV2ZW50LmNsaWVudFggLSBwYW5lLnN0YXJ0WCkgKiByZWxhdGl2ZVBpeGVsO1xuXG4gICAgICAgIC8vIGNvbnRyYWN0aW5nIGEgcGFuZSBpcyByZXN0cmljdGVkIHRvIGEgbWluLXNpemUgb2YgMTAlIHRoZSBjb250YWluZXIncyBzcGFjZS5cbiAgICAgICAgdmFyIFBBTkVfTUlOX1NJWkUgPSAxMDsgLy8gcGVyY2VudGFnZSAlXG4gICAgICAgIGlmIChwcE5ld1dpZHRoID49IFBBTkVfTUlOX1NJWkUgJiYgY3BOZXdXaWR0aCA+PSBQQU5FX01JTl9TSVpFKSB7XG4gICAgICAgICAgcGFuZS5jb250YWluZXIuc3R5bGUubWF4V2lkdGggPSAnbm9uZSc7XG4gICAgICAgICAgcHJldmlvdXNQYW5lLmNvbnRhaW5lci5zdHlsZS5tYXhXaWR0aCA9ICdub25lJztcblxuICAgICAgICAgIHByZXZpb3VzUGFuZS5jb250YWluZXIuc3R5bGUud2lkdGggPSBwcE5ld1dpZHRoICsgJyUnO1xuICAgICAgICAgIHBhbmUuY29udGFpbmVyLnN0eWxlLndpZHRoID0gY3BOZXdXaWR0aCArICclJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3N0b3BEcmFnJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wRHJhZyhwYW5lLCBldmVudCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwYW5lLm1vdXNlbW92ZSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcGFuZS5tb3VzZXVwLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBQbHVnaW5QZW47XG4gIH0oKTtcblxuICAvKiBidW5kbGUgcGx1Z2luc1xuICAgKi9cblxuICAvLyByZWdpc3RlciBidW5kbGVkIHBsdWdpbnNcbiAgZnVuY3Rpb24gQnVuZGxlUGx1Z2lucyhqb3R0ZWQpIHtcbiAgICBqb3R0ZWQucGx1Z2luKCdyZW5kZXInLCBQbHVnaW5SZW5kZXIpO1xuICAgIGpvdHRlZC5wbHVnaW4oJ3NjcmlwdGxlc3MnLCBQbHVnaW5TY3JpcHRsZXNzKTtcblxuICAgIGpvdHRlZC5wbHVnaW4oJ2FjZScsIFBsdWdpbkFjZSk7XG4gICAgam90dGVkLnBsdWdpbignY29kZW1pcnJvcicsIFBsdWdpbkNvZGVNaXJyb3IpO1xuICAgIGpvdHRlZC5wbHVnaW4oJ2xlc3MnLCBQbHVnaW5MZXNzKTtcbiAgICBqb3R0ZWQucGx1Z2luKCdjb2ZmZWVzY3JpcHQnLCBQbHVnaW5Db2ZmZWVTY3JpcHQpO1xuICAgIGpvdHRlZC5wbHVnaW4oJ3N0eWx1cycsIFBsdWdpblN0eWx1cyk7XG4gICAgam90dGVkLnBsdWdpbignYmFiZWwnLCBQbHVnaW5CYWJlbCk7XG4gICAgam90dGVkLnBsdWdpbignbWFya2Rvd24nLCBQbHVnaW5NYXJrZG93bik7XG4gICAgam90dGVkLnBsdWdpbignY29uc29sZScsIFBsdWdpbkNvbnNvbGUpO1xuICAgIGpvdHRlZC5wbHVnaW4oJ3BsYXknLCBQbHVnaW5QbGF5KTtcbiAgICBqb3R0ZWQucGx1Z2luKCdwZW4nLCBQbHVnaW5QZW4pO1xuICB9XG5cbiAgLyogam90dGVkXG4gICAqL1xuXG4gIHZhciBKb3R0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSm90dGVkKCRqb3R0ZWRDb250YWluZXIsIG9wdHMpIHtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEpvdHRlZCk7XG5cbiAgICAgIGlmICghJGpvdHRlZENvbnRhaW5lcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgZmluZCBKb3R0ZWQgY29udGFpbmVyLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBwcml2YXRlIGRhdGFcbiAgICAgIHZhciBfcHJpdmF0ZSA9IHt9O1xuICAgICAgdGhpcy5fZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gX3ByaXZhdGVba2V5XTtcbiAgICAgIH07XG4gICAgICB0aGlzLl9zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBfcHJpdmF0ZVtrZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBfcHJpdmF0ZVtrZXldO1xuICAgICAgfTtcblxuICAgICAgLy8gb3B0aW9uc1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLl9zZXQoJ29wdGlvbnMnLCBleHRlbmQob3B0cywge1xuICAgICAgICBmaWxlczogW10sXG4gICAgICAgIHNob3dCbGFuazogZmFsc2UsXG4gICAgICAgIHJ1blNjcmlwdHM6IHRydWUsXG4gICAgICAgIHBhbmU6ICdyZXN1bHQnLFxuICAgICAgICBkZWJvdW5jZTogMjUwLFxuICAgICAgICBwbHVnaW5zOiBbXVxuICAgICAgfSkpO1xuXG4gICAgICAvLyB0aGUgcmVuZGVyIHBsdWdpbiBpcyBtYW5kYXRvcnlcbiAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdyZW5kZXInKTtcblxuICAgICAgLy8gdXNlIHRoZSBzY3JpcHRsZXNzIHBsdWdpbiBpZiBydW5TY3JpcHRzIGlzIGZhbHNlXG4gICAgICBpZiAob3B0aW9ucy5ydW5TY3JpcHRzID09PSBmYWxzZSkge1xuICAgICAgICBvcHRpb25zLnBsdWdpbnMucHVzaCgnc2NyaXB0bGVzcycpO1xuICAgICAgfVxuXG4gICAgICAvLyBjYWNoZWQgY29udGVudCBmb3IgdGhlIGNoYW5nZSBtZXRob2QuXG4gICAgICB0aGlzLl9zZXQoJ2NhY2hlZENvbnRlbnQnLCB7XG4gICAgICAgIGh0bWw6IG51bGwsXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAganM6IG51bGxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBQdWJTb3VwXG4gICAgICB2YXIgcHVic291cCA9IHRoaXMuX3NldCgncHVic291cCcsIG5ldyBQdWJTb3VwKCkpO1xuXG4gICAgICB0aGlzLl9zZXQoJ3RyaWdnZXInLCB0aGlzLnRyaWdnZXIoKSk7XG4gICAgICB0aGlzLl9zZXQoJ29uJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwdWJzb3VwLnN1YnNjcmliZS5hcHBseShwdWJzb3VwLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zZXQoJ29mZicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHVic291cC51bnN1YnNjcmliZS5hcHBseShwdWJzb3VwLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgICB2YXIgZG9uZSA9IHRoaXMuX3NldCgnZG9uZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHVic291cC5kb25lLmFwcGx5KHB1YnNvdXAsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcblxuICAgICAgLy8gYWZ0ZXIgYWxsIHBsdWdpbnMgcnVuXG4gICAgICAvLyBzaG93IGVycm9yc1xuICAgICAgZG9uZSgnY2hhbmdlJywgdGhpcy5lcnJvcnMuYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIERPTVxuICAgICAgdmFyICRjb250YWluZXIgPSB0aGlzLl9zZXQoJyRjb250YWluZXInLCAkam90dGVkQ29udGFpbmVyKTtcbiAgICAgICRjb250YWluZXIuaW5uZXJIVE1MID0gY29udGFpbmVyKCk7XG4gICAgICBhZGRDbGFzcygkY29udGFpbmVyLCBjb250YWluZXJDbGFzcygpKTtcblxuICAgICAgLy8gZGVmYXVsdCBwYW5lXG4gICAgICB2YXIgcGFuZUFjdGl2ZSA9IHRoaXMuX3NldCgncGFuZUFjdGl2ZScsIG9wdGlvbnMucGFuZSk7XG4gICAgICBhZGRDbGFzcygkY29udGFpbmVyLCBwYW5lQWN0aXZlQ2xhc3MocGFuZUFjdGl2ZSkpO1xuXG4gICAgICAvLyBzdGF0dXMgbm9kZXNcbiAgICAgIHRoaXMuX3NldCgnJHN0YXR1cycsIHt9KTtcblxuICAgICAgdmFyIF9hcnIgPSBbJ2h0bWwnLCAnY3NzJywgJ2pzJ107XG4gICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgX2Fyci5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIF90eXBlID0gX2FycltfaV07XG4gICAgICAgIHRoaXMubWFya3VwKF90eXBlKTtcbiAgICAgIH1cblxuICAgICAgLy8gdGV4dGFyZWEgY2hhbmdlIGV2ZW50cy5cbiAgICAgICRjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBkZWJvdW5jZSh0aGlzLmNoYW5nZS5iaW5kKHRoaXMpLCBvcHRpb25zLmRlYm91bmNlKSk7XG4gICAgICAkY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGRlYm91bmNlKHRoaXMuY2hhbmdlLmJpbmQodGhpcyksIG9wdGlvbnMuZGVib3VuY2UpKTtcblxuICAgICAgLy8gcGFuZSBjaGFuZ2VcbiAgICAgICRjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnBhbmUuYmluZCh0aGlzKSk7XG5cbiAgICAgIC8vIGV4cG9zZSBwdWJsaWMgcHJvcGVydGllc1xuICAgICAgdGhpcy4kY29udGFpbmVyID0gdGhpcy5fZ2V0KCckY29udGFpbmVyJyk7XG4gICAgICB0aGlzLm9uID0gdGhpcy5fZ2V0KCdvbicpO1xuICAgICAgdGhpcy5vZmYgPSB0aGlzLl9nZXQoJ29mZicpO1xuICAgICAgdGhpcy5kb25lID0gdGhpcy5fZ2V0KCdkb25lJyk7XG4gICAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLl9nZXQoJ3RyaWdnZXInKTtcbiAgICAgIHRoaXMucGFuZUFjdGl2ZSA9IHRoaXMuX2dldCgncGFuZUFjdGl2ZScpO1xuXG4gICAgICAvLyBpbml0IHBsdWdpbnNcbiAgICAgIHRoaXMuX3NldCgncGx1Z2lucycsIHt9KTtcbiAgICAgIGluaXQuY2FsbCh0aGlzKTtcblxuICAgICAgLy8gbG9hZCBmaWxlc1xuICAgICAgdmFyIF9hcnIyID0gWydodG1sJywgJ2NzcycsICdqcyddO1xuICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgX2FycjIubGVuZ3RoOyBfaTIrKykge1xuICAgICAgICB2YXIgX3R5cGUyID0gX2FycjJbX2kyXTtcbiAgICAgICAgdGhpcy5sb2FkKF90eXBlMik7XG4gICAgICB9XG5cbiAgICAgIC8vIHNob3cgYWxsIHRhYnMsIGV2ZW4gaWYgZW1wdHlcbiAgICAgIGlmIChvcHRpb25zLnNob3dCbGFuaykge1xuICAgICAgICB2YXIgX2FycjMgPSBbJ2h0bWwnLCAnY3NzJywgJ2pzJ107XG5cbiAgICAgICAgZm9yICh2YXIgX2kzID0gMDsgX2kzIDwgX2FycjMubGVuZ3RoOyBfaTMrKykge1xuICAgICAgICAgIHZhciB0eXBlID0gX2FycjNbX2kzXTtcbiAgICAgICAgICBhZGRDbGFzcygkY29udGFpbmVyLCBoYXNGaWxlQ2xhc3ModHlwZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ2xhc3MoSm90dGVkLCBbe1xuICAgICAga2V5OiAnZmluZEZpbGUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmRGaWxlKHR5cGUpIHtcbiAgICAgICAgdmFyIGZpbGUgPSB7fTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLl9nZXQoJ29wdGlvbnMnKTtcblxuICAgICAgICBmb3IgKHZhciBmaWxlSW5kZXggaW4gb3B0aW9ucy5maWxlcykge1xuICAgICAgICAgIHZhciBfZmlsZSA9IG9wdGlvbnMuZmlsZXNbZmlsZUluZGV4XTtcbiAgICAgICAgICBpZiAoX2ZpbGUudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9maWxlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21hcmt1cCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbWFya3VwKHR5cGUpIHtcbiAgICAgICAgdmFyICRjb250YWluZXIgPSB0aGlzLl9nZXQoJyRjb250YWluZXInKTtcbiAgICAgICAgdmFyICRwYXJlbnQgPSAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5qb3R0ZWQtcGFuZS0nICsgdHlwZSk7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbWFya3VwIGZvciBhbiBlZGl0b3JcbiAgICAgICAgdmFyIGZpbGUgPSB0aGlzLmZpbmRGaWxlKHR5cGUpO1xuXG4gICAgICAgIHZhciAkZWRpdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICRlZGl0b3IuaW5uZXJIVE1MID0gZWRpdG9yQ29udGVudCh0eXBlLCBmaWxlLnVybCk7XG4gICAgICAgICRlZGl0b3IuY2xhc3NOYW1lID0gZWRpdG9yQ2xhc3ModHlwZSk7XG5cbiAgICAgICAgJHBhcmVudC5hcHBlbmRDaGlsZCgkZWRpdG9yKTtcblxuICAgICAgICAvLyBnZXQgdGhlIHN0YXR1cyBub2RlXG4gICAgICAgIHRoaXMuX2dldCgnJHN0YXR1cycpW3R5cGVdID0gJHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuam90dGVkLXN0YXR1cycpO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBmaWxlIGZvciB0aGUgY3VycmVudCB0eXBlXG4gICAgICAgIGlmICh0eXBlb2YgZmlsZS51cmwgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBmaWxlLmNvbnRlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gYWRkIHRoZSBoYXMtdHlwZSBjbGFzcyB0byB0aGUgY29udGFpbmVyXG4gICAgICAgICAgYWRkQ2xhc3MoJGNvbnRhaW5lciwgaGFzRmlsZUNsYXNzKHR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2xvYWQnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQodHlwZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbWFya3VwIGZvciBhbiBlZGl0b3JcbiAgICAgICAgdmFyIGZpbGUgPSB0aGlzLmZpbmRGaWxlKHR5cGUpO1xuICAgICAgICB2YXIgJHRleHRhcmVhID0gdGhpcy5fZ2V0KCckY29udGFpbmVyJykucXVlcnlTZWxlY3RvcignLmpvdHRlZC1wYW5lLScgKyB0eXBlICsgJyB0ZXh0YXJlYScpO1xuXG4gICAgICAgIC8vIGZpbGUgYXMgc3RyaW5nXG4gICAgICAgIGlmICh0eXBlb2YgZmlsZS5jb250ZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoJHRleHRhcmVhLCBmaWxlLmNvbnRlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWxlLnVybCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBzaG93IGxvYWRpbmcgbWVzc2FnZVxuICAgICAgICAgIHRoaXMuc3RhdHVzKCdsb2FkaW5nJywgW3N0YXR1c0xvYWRpbmcoZmlsZS51cmwpXSwge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIGZpbGUgYXMgdXJsXG4gICAgICAgICAgZmV0Y2goZmlsZS51cmwsIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAvLyBzaG93IGxvYWQgZXJyb3JzXG4gICAgICAgICAgICAgIF90aGlzLnN0YXR1cygnZXJyb3InLCBbc3RhdHVzRmV0Y2hFcnJvcihlcnIpXSwge1xuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGVhciB0aGUgbG9hZGluZyBzdGF0dXNcbiAgICAgICAgICAgIF90aGlzLmNsZWFyU3RhdHVzKCdsb2FkaW5nJywge1xuICAgICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuc2V0VmFsdWUoJHRleHRhcmVhLCByZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnQgb24gYmxhbmsgZWRpdG9ycyxcbiAgICAgICAgICAvLyBmb3IgZWRpdG9yIHBsdWdpbnMgdG8gY2F0Y2guXG4gICAgICAgICAgLy8gKGVnLiB0aGUgY29kZW1pcnJvciBhbmQgYWNlIHBsdWdpbnMgYXR0YWNoIHRoZSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICAvLyBvbmx5IGFmdGVyIHRoZSBpbml0aWFsIGNoYW5nZS9sb2FkIGV2ZW50KVxuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoJHRleHRhcmVhLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdzZXRWYWx1ZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUoJHRleHRhcmVhLCB2YWwpIHtcbiAgICAgICAgJHRleHRhcmVhLnZhbHVlID0gdmFsO1xuXG4gICAgICAgIC8vIHRyaWdnZXIgY2hhbmdlIGV2ZW50LCBmb3IgaW5pdGlhbCByZW5kZXJcbiAgICAgICAgdGhpcy5jaGFuZ2Uoe1xuICAgICAgICAgIHRhcmdldDogJHRleHRhcmVhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoYW5nZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlKGUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBkYXRhKGUudGFyZ2V0LCAnam90dGVkLXR5cGUnKTtcbiAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgaWYgdGhlIGNvbnRlbnQgaGFzbid0IGNoYW5nZWQuXG4gICAgICAgIC8vIGVnLiB3aGVuIGJsdXJyaW5nIHRoZSB0ZXh0YXJlYS5cbiAgICAgICAgdmFyIGNhY2hlZENvbnRlbnQgPSB0aGlzLl9nZXQoJ2NhY2hlZENvbnRlbnQnKTtcbiAgICAgICAgaWYgKGNhY2hlZENvbnRlbnRbdHlwZV0gPT09IGUudGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2FjaGUgbGF0ZXN0IGNvbnRlbnRcbiAgICAgICAgY2FjaGVkQ29udGVudFt0eXBlXSA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIC8vIHRyaWdnZXIgdGhlIGNoYW5nZSBldmVudFxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScsIHtcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIGZpbGU6IGRhdGEoZS50YXJnZXQsICdqb3R0ZWQtZmlsZScpLFxuICAgICAgICAgIGNvbnRlbnQ6IGNhY2hlZENvbnRlbnRbdHlwZV1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnZXJyb3JzJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBlcnJvcnMoZXJycywgcGFyYW1zKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzKCdlcnJvcicsIGVycnMsIHBhcmFtcyk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncGFuZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcGFuZShlKSB7XG4gICAgICAgIGlmICghZGF0YShlLnRhcmdldCwgJ2pvdHRlZC10eXBlJykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGNvbnRhaW5lciA9IHRoaXMuX2dldCgnJGNvbnRhaW5lcicpO1xuICAgICAgICB2YXIgcGFuZUFjdGl2ZSA9IHRoaXMuX2dldCgncGFuZUFjdGl2ZScpO1xuICAgICAgICByZW1vdmVDbGFzcygkY29udGFpbmVyLCBwYW5lQWN0aXZlQ2xhc3MocGFuZUFjdGl2ZSkpO1xuXG4gICAgICAgIHBhbmVBY3RpdmUgPSB0aGlzLl9zZXQoJ3BhbmVBY3RpdmUnLCBkYXRhKGUudGFyZ2V0LCAnam90dGVkLXR5cGUnKSk7XG4gICAgICAgIGFkZENsYXNzKCRjb250YWluZXIsIHBhbmVBY3RpdmVDbGFzcyhwYW5lQWN0aXZlKSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3N0YXR1cycsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3RhdHVzKCkge1xuICAgICAgICB2YXIgc3RhdHVzVHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ2Vycm9yJztcbiAgICAgICAgdmFyIG1lc3NhZ2VzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICAgICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jbGVhclN0YXR1cyhzdGF0dXNUeXBlLCBwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRzdGF0dXMgPSB0aGlzLl9nZXQoJyRzdGF0dXMnKTtcblxuICAgICAgICAvLyBhZGQgZXJyb3IvbG9hZGluZyBjbGFzcyB0byBzdGF0dXNcbiAgICAgICAgYWRkQ2xhc3MoJHN0YXR1c1twYXJhbXMudHlwZV0sIHN0YXR1c0NsYXNzKHN0YXR1c1R5cGUpKTtcblxuICAgICAgICBhZGRDbGFzcyh0aGlzLl9nZXQoJyRjb250YWluZXInKSwgc3RhdHVzQWN0aXZlQ2xhc3MocGFyYW1zLnR5cGUpKTtcblxuICAgICAgICB2YXIgbWFya3VwID0gJyc7XG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIG1hcmt1cCArPSBzdGF0dXNNZXNzYWdlKGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzdGF0dXNbcGFyYW1zLnR5cGVdLmlubmVySFRNTCA9IG1hcmt1cDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbGVhclN0YXR1cycsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJTdGF0dXMoc3RhdHVzVHlwZSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciAkc3RhdHVzID0gdGhpcy5fZ2V0KCckc3RhdHVzJyk7XG5cbiAgICAgICAgcmVtb3ZlQ2xhc3MoJHN0YXR1c1twYXJhbXMudHlwZV0sIHN0YXR1c0NsYXNzKHN0YXR1c1R5cGUpKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5fZ2V0KCckY29udGFpbmVyJyksIHN0YXR1c0FjdGl2ZUNsYXNzKHBhcmFtcy50eXBlKSk7XG4gICAgICAgICRzdGF0dXNbcGFyYW1zLnR5cGVdLmlubmVySFRNTCA9ICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWJvdW5jZWQgdHJpZ2dlciBtZXRob2RcbiAgICAgIC8vIGN1c3RvbSBkZWJvdW5jZXIgdG8gdXNlIGEgZGlmZmVyZW50IHRpbWVyIHBlciB0eXBlXG5cbiAgICB9LCB7XG4gICAgICBrZXk6ICd0cmlnZ2VyJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0cmlnZ2VyKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuX2dldCgnb3B0aW9ucycpO1xuICAgICAgICB2YXIgcHVic291cCA9IHRoaXMuX2dldCgncHVic291cCcpO1xuXG4gICAgICAgIC8vIGFsbG93IGRpc2FibGluZyB0aGUgdHJpZ2dlciBkZWJvdW5jZXIuXG4gICAgICAgIC8vIG1vc3RseSBmb3IgdGVzdGluZzogd2hlbiB0cmlnZ2VyIGV2ZW50cyBoYXBwZW4gcmFwaWRseVxuICAgICAgICAvLyBtdWx0aXBsZSBldmVudHMgb2YgdGhlIHNhbWUgdHlwZSB3b3VsZCBiZSBjYXVnaHQgb25jZS5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGVib3VuY2UgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHB1YnNvdXAucHVibGlzaC5hcHBseShwdWJzb3VwLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb29sZG93biB0aW1lclxuICAgICAgICB2YXIgY29vbGRvd24gPSB7fTtcbiAgICAgICAgLy8gbXVsdGlwbGUgY2FsbHNcbiAgICAgICAgdmFyIG11bHRpcGxlID0ge307XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0b3BpYykge1xuICAgICAgICAgIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gICAgICAgICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICAgICAgdmFyIF9yZWYkdHlwZSA9IF9yZWYudHlwZTtcbiAgICAgICAgICB2YXIgdHlwZSA9IF9yZWYkdHlwZSA9PT0gdW5kZWZpbmVkID8gJ2RlZmF1bHQnIDogX3JlZiR0eXBlO1xuXG4gICAgICAgICAgaWYgKGNvb2xkb3duW3R5cGVdKSB7XG4gICAgICAgICAgICAvLyBpZiB3ZSBoYWQgbXVsdGlwbGUgY2FsbHMgYmVmb3JlIHRoZSBjb29sZG93blxuICAgICAgICAgICAgbXVsdGlwbGVbdHlwZV0gPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0cmlnZ2VyIGltbWVkaWF0ZWx5IG9uY2UgY29vbGRvd24gaXMgb3ZlclxuICAgICAgICAgICAgcHVic291cC5wdWJsaXNoLmFwcGx5KHB1YnNvdXAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KGNvb2xkb3duW3R5cGVdKTtcblxuICAgICAgICAgIC8vIHNldCBjb29sZG93biB0aW1lclxuICAgICAgICAgIGNvb2xkb3duW3R5cGVdID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBpZiB3ZSBoYWQgbXVsdGlwbGUgY2FsbHMgYmVmb3JlIHRoZSBjb29sZG93bixcbiAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIGFnYWluIGF0IHRoZSBlbmQuXG4gICAgICAgICAgICBpZiAobXVsdGlwbGVbdHlwZV0pIHtcbiAgICAgICAgICAgICAgcHVic291cC5wdWJsaXNoLmFwcGx5KHB1YnNvdXAsIF9hcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtdWx0aXBsZVt0eXBlXSA9IG51bGw7XG4gICAgICAgICAgICBjb29sZG93blt0eXBlXSA9IG51bGw7XG4gICAgICAgICAgfSwgb3B0aW9ucy5kZWJvdW5jZSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBKb3R0ZWQ7XG4gIH0oKTtcblxuICAvLyByZWdpc3RlciBwbHVnaW5zXG5cblxuICBKb3R0ZWQucGx1Z2luID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZWdpc3Rlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuXG4gIC8vIHJlZ2lzdGVyIGJ1bmRsZWQgcGx1Z2luc1xuICBCdW5kbGVQbHVnaW5zKEpvdHRlZCk7XG5cbiAgcmV0dXJuIEpvdHRlZDtcblxufSkpKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am90dGVkLmpzLm1hcCIsIi8vIENvcHlyaWdodCAoYykgMjAxMyBQaWVyb3h5IDxwaWVyb3h5QHBpZXJveHkubmV0PlxuLy8gVGhpcyB3b3JrIGlzIGZyZWUuIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbi8vIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgV1RGUEwsIFZlcnNpb24gMlxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIExJQ0VOU0UudHh0IG9yIGh0dHA6Ly93d3cud3RmcGwubmV0L1xuLy9cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCB0aGUgaG9tZSBwYWdlOlxuLy8gaHR0cDovL3BpZXJveHkubmV0L2Jsb2cvcGFnZXMvbHotc3RyaW5nL3Rlc3RpbmcuaHRtbFxuLy9cbi8vIExaLWJhc2VkIGNvbXByZXNzaW9uIGFsZ29yaXRobSwgdmVyc2lvbiAxLjQuNFxudmFyIExaU3RyaW5nID0gKGZ1bmN0aW9uKCkge1xuXG4vLyBwcml2YXRlIHByb3BlcnR5XG52YXIgZiA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG52YXIga2V5U3RyQmFzZTY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xudmFyIGtleVN0clVyaVNhZmUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky0kXCI7XG52YXIgYmFzZVJldmVyc2VEaWMgPSB7fTtcblxuZnVuY3Rpb24gZ2V0QmFzZVZhbHVlKGFscGhhYmV0LCBjaGFyYWN0ZXIpIHtcbiAgaWYgKCFiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0pIHtcbiAgICBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0gPSB7fTtcbiAgICBmb3IgKHZhciBpPTAgOyBpPGFscGhhYmV0Lmxlbmd0aCA7IGkrKykge1xuICAgICAgYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2FscGhhYmV0LmNoYXJBdChpKV0gPSBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2NoYXJhY3Rlcl07XG59XG5cbnZhciBMWlN0cmluZyA9IHtcbiAgY29tcHJlc3NUb0Jhc2U2NCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICB2YXIgcmVzID0gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCA2LCBmdW5jdGlvbihhKXtyZXR1cm4ga2V5U3RyQmFzZTY0LmNoYXJBdChhKTt9KTtcbiAgICBzd2l0Y2ggKHJlcy5sZW5ndGggJSA0KSB7IC8vIFRvIHByb2R1Y2UgdmFsaWQgQmFzZTY0XG4gICAgZGVmYXVsdDogLy8gV2hlbiBjb3VsZCB0aGlzIGhhcHBlbiA/XG4gICAgY2FzZSAwIDogcmV0dXJuIHJlcztcbiAgICBjYXNlIDEgOiByZXR1cm4gcmVzK1wiPT09XCI7XG4gICAgY2FzZSAyIDogcmV0dXJuIHJlcytcIj09XCI7XG4gICAgY2FzZSAzIDogcmV0dXJuIHJlcytcIj1cIjtcbiAgICB9XG4gIH0sXG5cbiAgZGVjb21wcmVzc0Zyb21CYXNlNjQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGlucHV0ID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhpbnB1dC5sZW5ndGgsIDMyLCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gZ2V0QmFzZVZhbHVlKGtleVN0ckJhc2U2NCwgaW5wdXQuY2hhckF0KGluZGV4KSk7IH0pO1xuICB9LFxuXG4gIGNvbXByZXNzVG9VVEYxNiA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCAxNSwgZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSszMik7fSkgKyBcIiBcIjtcbiAgfSxcblxuICBkZWNvbXByZXNzRnJvbVVURjE2OiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMTYzODQsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpIC0gMzI7IH0pO1xuICB9LFxuXG4gIC8vY29tcHJlc3MgaW50byB1aW50OGFycmF5IChVQ1MtMiBiaWcgZW5kaWFuIGZvcm1hdClcbiAgY29tcHJlc3NUb1VpbnQ4QXJyYXk6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICB2YXIgY29tcHJlc3NlZCA9IExaU3RyaW5nLmNvbXByZXNzKHVuY29tcHJlc3NlZCk7XG4gICAgdmFyIGJ1Zj1uZXcgVWludDhBcnJheShjb21wcmVzc2VkLmxlbmd0aCoyKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyXG5cbiAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWNvbXByZXNzZWQubGVuZ3RoOyBpPFRvdGFsTGVuOyBpKyspIHtcbiAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGkpO1xuICAgICAgYnVmW2kqMl0gPSBjdXJyZW50X3ZhbHVlID4+PiA4O1xuICAgICAgYnVmW2kqMisxXSA9IGN1cnJlbnRfdmFsdWUgJSAyNTY7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG4gIH0sXG5cbiAgLy9kZWNvbXByZXNzIGZyb20gdWludDhhcnJheSAoVUNTLTIgYmlnIGVuZGlhbiBmb3JtYXQpXG4gIGRlY29tcHJlc3NGcm9tVWludDhBcnJheTpmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkPT09bnVsbCB8fCBjb21wcmVzc2VkPT09dW5kZWZpbmVkKXtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MoY29tcHJlc3NlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGJ1Zj1uZXcgQXJyYXkoY29tcHJlc3NlZC5sZW5ndGgvMik7IC8vIDIgYnl0ZXMgcGVyIGNoYXJhY3RlclxuICAgICAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWJ1Zi5sZW5ndGg7IGk8VG90YWxMZW47IGkrKykge1xuICAgICAgICAgIGJ1ZltpXT1jb21wcmVzc2VkW2kqMl0qMjU2K2NvbXByZXNzZWRbaSoyKzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBidWYuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGYoYykpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MocmVzdWx0LmpvaW4oJycpKTtcblxuICAgIH1cblxuICB9LFxuXG5cbiAgLy9jb21wcmVzcyBpbnRvIGEgc3RyaW5nIHRoYXQgaXMgYWxyZWFkeSBVUkkgZW5jb2RlZFxuICBjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDYsIGZ1bmN0aW9uKGEpe3JldHVybiBrZXlTdHJVcmlTYWZlLmNoYXJBdChhKTt9KTtcbiAgfSxcblxuICAvL2RlY29tcHJlc3MgZnJvbSBhbiBvdXRwdXQgb2YgY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnRcbiAgZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50OmZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoaW5wdXQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC8gL2csIFwiK1wiKTtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoaW5wdXQubGVuZ3RoLCAzMiwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGdldEJhc2VWYWx1ZShrZXlTdHJVcmlTYWZlLCBpbnB1dC5jaGFyQXQoaW5kZXgpKTsgfSk7XG4gIH0sXG5cbiAgY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKHVuY29tcHJlc3NlZCwgMTYsIGZ1bmN0aW9uKGEpe3JldHVybiBmKGEpO30pO1xuICB9LFxuICBfY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQsIGJpdHNQZXJDaGFyLCBnZXRDaGFyRnJvbUludCkge1xuICAgIGlmICh1bmNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIGksIHZhbHVlLFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnk9IHt9LFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZT0ge30sXG4gICAgICAgIGNvbnRleHRfYz1cIlwiLFxuICAgICAgICBjb250ZXh0X3djPVwiXCIsXG4gICAgICAgIGNvbnRleHRfdz1cIlwiLFxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbj0gMiwgLy8gQ29tcGVuc2F0ZSBmb3IgdGhlIGZpcnN0IGVudHJ5IHdoaWNoIHNob3VsZCBub3QgY291bnRcbiAgICAgICAgY29udGV4dF9kaWN0U2l6ZT0gMyxcbiAgICAgICAgY29udGV4dF9udW1CaXRzPSAyLFxuICAgICAgICBjb250ZXh0X2RhdGE9W10sXG4gICAgICAgIGNvbnRleHRfZGF0YV92YWw9MCxcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uPTAsXG4gICAgICAgIGlpO1xuXG4gICAgZm9yIChpaSA9IDA7IGlpIDwgdW5jb21wcmVzc2VkLmxlbmd0aDsgaWkgKz0gMSkge1xuICAgICAgY29udGV4dF9jID0gdW5jb21wcmVzc2VkLmNoYXJBdChpaSk7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnksY29udGV4dF9jKSkge1xuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF9jXSA9IGNvbnRleHRfZGljdFNpemUrKztcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF9jXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHRfd2MgPSBjb250ZXh0X3cgKyBjb250ZXh0X2M7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeSxjb250ZXh0X3djKSkge1xuICAgICAgICBjb250ZXh0X3cgPSBjb250ZXh0X3djO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgICAgaWYgKGNvbnRleHRfdy5jaGFyQ29kZUF0KDApPDI1Nikge1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPDggOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT1iaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X3ddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd107XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCB3YyB0byB0aGUgZGljdGlvbmFyeS5cbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd2NdID0gY29udGV4dF9kaWN0U2l6ZSsrO1xuICAgICAgICBjb250ZXh0X3cgPSBTdHJpbmcoY29udGV4dF9jKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdXRwdXQgdGhlIGNvZGUgZm9yIHcuXG4gICAgaWYgKGNvbnRleHRfdyAhPT0gXCJcIikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgIGlmIChjb250ZXh0X3cuY2hhckNvZGVBdCgwKTwyNTYpIHtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTw4IDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfd107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3ddO1xuICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGUgZW5kIG9mIHRoZSBzdHJlYW1cbiAgICB2YWx1ZSA9IDI7XG4gICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICB9XG5cbiAgICAvLyBGbHVzaCB0aGUgbGFzdCBjaGFyXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZWxzZSBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHRfZGF0YS5qb2luKCcnKTtcbiAgfSxcblxuICBkZWNvbXByZXNzOiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMzI3NjgsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpOyB9KTtcbiAgfSxcblxuICBfZGVjb21wcmVzczogZnVuY3Rpb24gKGxlbmd0aCwgcmVzZXRWYWx1ZSwgZ2V0TmV4dFZhbHVlKSB7XG4gICAgdmFyIGRpY3Rpb25hcnkgPSBbXSxcbiAgICAgICAgbmV4dCxcbiAgICAgICAgZW5sYXJnZUluID0gNCxcbiAgICAgICAgZGljdFNpemUgPSA0LFxuICAgICAgICBudW1CaXRzID0gMyxcbiAgICAgICAgZW50cnkgPSBcIlwiLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgaSxcbiAgICAgICAgdyxcbiAgICAgICAgYml0cywgcmVzYiwgbWF4cG93ZXIsIHBvd2VyLFxuICAgICAgICBjLFxuICAgICAgICBkYXRhID0ge3ZhbDpnZXROZXh0VmFsdWUoMCksIHBvc2l0aW9uOnJlc2V0VmFsdWUsIGluZGV4OjF9O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDM7IGkgKz0gMSkge1xuICAgICAgZGljdGlvbmFyeVtpXSA9IGk7XG4gICAgfVxuXG4gICAgYml0cyA9IDA7XG4gICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDIpO1xuICAgIHBvd2VyPTE7XG4gICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgfVxuICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICBwb3dlciA8PD0gMTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5leHQgPSBiaXRzKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDgpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGRpY3Rpb25hcnlbM10gPSBjO1xuICAgIHcgPSBjO1xuICAgIHJlc3VsdC5wdXNoKGMpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoZGF0YS5pbmRleCA+IGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cblxuICAgICAgYml0cyA9IDA7XG4gICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsbnVtQml0cyk7XG4gICAgICBwb3dlcj0xO1xuICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgfVxuICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoYyA9IGJpdHMpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiw4KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgZW5sYXJnZUluID0gTWF0aC5wb3coMiwgbnVtQml0cyk7XG4gICAgICAgIG51bUJpdHMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGRpY3Rpb25hcnlbY10pIHtcbiAgICAgICAgZW50cnkgPSBkaWN0aW9uYXJ5W2NdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGMgPT09IGRpY3RTaXplKSB7XG4gICAgICAgICAgZW50cnkgPSB3ICsgdy5jaGFyQXQoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKGVudHJ5KTtcblxuICAgICAgLy8gQWRkIHcrZW50cnlbMF0gdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gdyArIGVudHJ5LmNoYXJBdCgwKTtcbiAgICAgIGVubGFyZ2VJbi0tO1xuXG4gICAgICB3ID0gZW50cnk7XG5cbiAgICAgIGlmIChlbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBlbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBudW1CaXRzKTtcbiAgICAgICAgbnVtQml0cysrO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG59O1xuICByZXR1cm4gTFpTdHJpbmc7XG59KSgpO1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBMWlN0cmluZzsgfSk7XG59IGVsc2UgaWYoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAhPSBudWxsICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IExaU3RyaW5nXG59XG4iLCIvKiBzaWxvei5pb1xuICovXG5cbnZhciBkdXJydXRpID0gcmVxdWlyZSgnZHVycnV0aScpXG52YXIgTWFpbiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluLmpzJylcblxuZHVycnV0aS5yZW5kZXIoTWFpbiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcCcpKVxuIiwiLyogZWRpdG9yIGJhclxuICovXG5cbmZ1bmN0aW9uIEVkaXRvckJhciAoYWN0aW9ucykge1xuICB2YXIgcGx1Z2lucyA9IGFjdGlvbnMuZ2V0UGx1Z2lucygpXG4gIHZhciBvcHRpb25zID0ge1xuICAgIGh0bWw6IFt7XG4gICAgICB0aXRsZTogJ0hUTUwnXG4gICAgfSwge1xuICAgICAgdGl0bGU6ICdNYXJrZG93bicsXG4gICAgICBwbHVnaW46ICdtYXJrZG93bidcbiAgICB9XSxcbiAgICBjc3M6IFt7XG4gICAgICB0aXRsZTogJ0NTUydcbiAgICB9LCB7XG4gICAgICB0aXRsZTogJ0xlc3MnLFxuICAgICAgcGx1Z2luOiAnbGVzcydcbiAgICB9LCB7XG4gICAgICB0aXRsZTogJ1N0eWx1cycsXG4gICAgICBwbHVnaW46ICdzdHlsdXMnXG4gICAgfV0sXG4gICAganM6IFt7XG4gICAgICB0aXRsZTogJ0phdmFTY3JpcHQnXG4gICAgfSwge1xuICAgICAgdGl0bGU6ICdFUzIwMTUvQmFiZWwnLFxuICAgICAgcGx1Z2luOiAnYmFiZWwnXG4gICAgfSwge1xuICAgICAgdGl0bGU6ICdDb2ZmZWVTY3JpcHQnLFxuICAgICAgcGx1Z2luOiAnY29mZmVlc2NyaXB0J1xuICAgIH1dXG4gIH1cblxuICB2YXIgc2VsZWN0ZWQgPSB7XG4gICAgaHRtbDogJycsXG4gICAgY3NzOiAnJyxcbiAgICBqczogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsdWdpbiAobGlzdCwgbmFtZSkge1xuICAgIHZhciBmb3VuZFBsdWdpbiA9IG51bGxcbiAgICBsaXN0LnNvbWUoKHBsdWdpbikgPT4ge1xuICAgICAgaWYgKHBsdWdpbi5wbHVnaW4gPT09IG5hbWUpIHtcbiAgICAgICAgZm91bmRQbHVnaW4gPSBwbHVnaW5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGZvdW5kUGx1Z2luXG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2VQcm9jZXNzb3IgKHR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcmVtb3ZlIGxhc3Qgc2VsZWN0ZWQgcGx1Z2luXG4gICAgICBhY3Rpb25zLnJlbW92ZVBsdWdpbihzZWxlY3RlZFt0eXBlXSlcblxuICAgICAgLy8gdXBkYXRlIHJlZmVyZW5jZVxuICAgICAgc2VsZWN0ZWRbdHlwZV0gPSB0aGlzLnZhbHVlXG5cbiAgICAgIHZhciBwbHVnaW4gPSBnZXRQbHVnaW4ob3B0aW9uc1t0eXBlXSwgc2VsZWN0ZWRbdHlwZV0pXG4gICAgICBpZiAocGx1Z2luKSB7XG4gICAgICAgIGFjdGlvbnMuYWRkUGx1Z2luKHBsdWdpbi5wbHVnaW4pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2VsZWN0ICh0eXBlLCBvcHRpb25zLCBzZWxlY3RlZCkge1xuICAgIHJldHVybiBgXG4gICAgICA8c2VsZWN0IGNsYXNzPVwic2VsZWN0IGVkaXRvci1iYXItc2VsZWN0LSR7dHlwZX1cIj5cbiAgICAgICAgJHtvcHRpb25zLm1hcCgob3B0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIke29wdC5wbHVnaW4gfHwgJyd9XCIgJHtvcHQucGx1Z2luID09PSBzZWxlY3RlZCA/ICdzZWxlY3RlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICR7b3B0LnRpdGxlfVxuICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgYFxuICAgICAgICB9KS5qb2luKCcnKX1cbiAgICAgIDwvc2VsZWN0PlxuICAgIGBcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEluaXRpYWxWYWx1ZXMgKCkge1xuICAgIC8vIHNldCBzZWxlY3RlZCB2YWx1ZXMgYmFzZWQgb24gc3RvcmVcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICBvcHRpb25zW3R5cGVdLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICBpZiAocGx1Z2lucy5pbmRleE9mKG9wdGlvbi5wbHVnaW4pICE9PSAtMSkge1xuICAgICAgICAgIHNlbGVjdGVkW3R5cGVdID0gb3B0aW9uLnBsdWdpblxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZVBhbmUgKHR5cGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHBhbmVzID0ge31cbiAgICAgIHBhbmVzW3R5cGVdID0ge1xuICAgICAgICBoaWRkZW46IHRydWVcbiAgICAgIH1cblxuICAgICAgYWN0aW9ucy51cGRhdGVQYW5lcyhwYW5lcylcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdW50ID0gZnVuY3Rpb24gKCRjb250YWluZXIpIHtcbiAgICBmb3IgKGxldCB0eXBlIG9mIFsgJ2h0bWwnLCAnY3NzJywgJ2pzJyBdKSB7XG4gICAgICAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYC5lZGl0b3ItYmFyLXNlbGVjdC0ke3R5cGV9YCkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlUHJvY2Vzc29yKHR5cGUpKVxuXG4gICAgICAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYC5lZGl0b3ItYmFyLXBhbmUtY2xvc2UtJHt0eXBlfWApLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VQYW5lKHR5cGUpKVxuICAgIH1cbiAgfVxuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHNldEluaXRpYWxWYWx1ZXMoKVxuXG4gICAgcmV0dXJuIGBcbiAgICAgIDxkaXYgY2xhc3M9XCJlZGl0b3ItYmFyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0b3ItYmFyLXBhbmUgZWRpdG9yLWJhci1wYW5lLWh0bWxcIj5cbiAgICAgICAgICAke2NyZWF0ZVNlbGVjdCgnaHRtbCcsIG9wdGlvbnMuaHRtbCwgc2VsZWN0ZWQuaHRtbCl9XG5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImVkaXRvci1iYXItcGFuZS1jbG9zZSBlZGl0b3ItYmFyLXBhbmUtY2xvc2UtaHRtbCBidG5cIiB0aXRsZT1cIkhpZGUgSFRNTFwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIGljb24tY2xvc2VcIj48L2k+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yLWJhci1wYW5lIGVkaXRvci1iYXItcGFuZS1jc3NcIj5cbiAgICAgICAgICAke2NyZWF0ZVNlbGVjdCgnY3NzJywgb3B0aW9ucy5jc3MsIHNlbGVjdGVkLmNzcyl9XG5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImVkaXRvci1iYXItcGFuZS1jbG9zZSBlZGl0b3ItYmFyLXBhbmUtY2xvc2UtY3NzIGJ0blwiIHRpdGxlPVwiSGlkZSBDU1NcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLWNsb3NlXCI+PC9pPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvci1iYXItcGFuZSBlZGl0b3ItYmFyLXBhbmUtanNcIj5cbiAgICAgICAgICAke2NyZWF0ZVNlbGVjdCgnanMnLCBvcHRpb25zLmpzLCBzZWxlY3RlZC5qcyl9XG5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImVkaXRvci1iYXItcGFuZS1jbG9zZSBlZGl0b3ItYmFyLXBhbmUtY2xvc2UtanMgYnRuXCIgdGl0bGU9XCJIaWRlIEphdmFTY3JpcHRcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLWNsb3NlXCI+PC9pPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImVkaXRvci1iYXItcGFuZVwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yQmFyXG4iLCIvKiBlZGl0b3Igd2lkZ2V0XG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlsJylcbnZhciBKb3R0ZWQgPSByZXF1aXJlKCdqb3R0ZWQnKVxudmFyIGdsb2JhbEFjdGlvbnNcblxuLy8gam90dGVkIHBsdWdpblxuSm90dGVkLnBsdWdpbignc2lsb3onLCBmdW5jdGlvbiAoam90dGVkLCBvcHRpb25zKSB7XG4gIGpvdHRlZC5vbignY2hhbmdlJywgZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICBnbG9iYWxBY3Rpb25zLnVwZGF0ZUZpbGUoe1xuICAgICAgdHlwZTogcGFyYW1zLnR5cGUsXG4gICAgICBjb250ZW50OiBwYXJhbXMuY29udGVudFxuICAgIH0pXG5cbiAgICBjYWxsYmFjayhudWxsLCBwYXJhbXMpXG4gIH0sIDIpXG59KVxuXG52YXIgcGx1Z2luTGlicyA9IHtcbiAgbWFya2Rvd246IFsnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvbWFya2VkLzAuMy42L21hcmtlZC5taW4uanMnXSxcbiAgbGVzczogWydodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9sZXNzLmpzLzIuNy4xL2xlc3MubWluLmpzJ10sXG4gIHN0eWx1czogWycvbGlicy9zdHlsdXMubWluLmpzJ10sXG4gIGNvZmZlZXNjcmlwdDogWydodHRwczovL2Nkbi5yYXdnaXQuY29tL2phc2hrZW5hcy9jb2ZmZWVzY3JpcHQvMS4xMS4xL2V4dHJhcy9jb2ZmZWUtc2NyaXB0LmpzJ10sXG4gIGVzMjAxNTogWydodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9iYWJlbC1jb3JlLzYuMS4xOS9icm93c2VyLm1pbi5qcyddXG59XG5cbmZ1bmN0aW9uIEVkaXRvcldpZGdldCAoYWN0aW9ucykge1xuICBnbG9iYWxBY3Rpb25zID0gYWN0aW9uc1xuXG4gIHRoaXMubW91bnQgPSBmdW5jdGlvbiAoJGNvbnRhaW5lcikge1xuICAgIHZhciBwbHVnaW5zID0gYWN0aW9ucy5nZXRQbHVnaW5zKClcbiAgICB2YXIgbGlicyA9IFtdXG5cbiAgICAvLyBsb2FkIGxpYnNcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5MaWJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocGx1Z2lucy5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShsaWJzLCBwbHVnaW5MaWJzW25hbWVdLm1hcCgodXJsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChkb25lKSA9PiB7XG4gICAgICAgICAgICB1dGlsLmxvYWRTY3JpcHQodXJsLCBkb25lKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHBsdWdpbnMsIFtcbiAgICAgICdzaWxveicsXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdjb2RlbWlycm9yJyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHRoZW1lOiBhY3Rpb25zLmdldFRoZW1lKCksXG4gICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdKVxuXG4gICAgdXRpbC5hc3luYyhsaWJzLCAoKSA9PiB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXcgKi9cbiAgICAgIG5ldyBKb3R0ZWQoJGNvbnRhaW5lciwge1xuICAgICAgICBmaWxlczogYWN0aW9ucy5nZXRGaWxlcygpLFxuICAgICAgICBwbHVnaW5zOiBwbHVnaW5zXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJlZGl0b3Itd2lkZ2V0IGpvdHRlZC10aGVtZS1zaWxvelwiPjwvZGl2PidcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvcldpZGdldFxuIiwiLyogZWRpdG9yXG4gKi9cblxudmFyIGR1cnJ1dGkgPSByZXF1aXJlKCdkdXJydXRpJylcbnZhciBFZGl0b3JCYXIgPSByZXF1aXJlKCcuL2VkaXRvci1iYXInKVxudmFyIEVkaXRvcldpZGdldCA9IHJlcXVpcmUoJy4vZWRpdG9yLXdpZGdldCcpXG5cbmZ1bmN0aW9uIEVkaXRvciAoYWN0aW9ucykge1xuICB2YXIgcGFuZXMgPSBhY3Rpb25zLmdldFBhbmVzKClcbiAgY29uc29sZS5sb2coJ3BhbmVzJyxwYW5lcyk7XG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiZWRpdG9yXG4gICAgICAgICR7cGFuZXMuaHRtbC5oaWRkZW4gPyAnZWRpdG9yLWlzLWhpZGRlbi1odG1sJyA6ICcnfVxuICAgICAgICAkeydlZGl0b3ItaXMtaGlkZGVuLWNzcyd9XG4gICAgICAgICR7cGFuZXMuanMuaGlkZGVuID8gJ2VkaXRvci1pcy1oaWRkZW4tanMnIDogJyd9XG4gICAgICBcIj5cbiAgICAgICAgJHtkdXJydXRpLnJlbmRlcihuZXcgRWRpdG9yQmFyKGFjdGlvbnMpKX1cbiAgICAgICAgJHtkdXJydXRpLnJlbmRlcihuZXcgRWRpdG9yV2lkZ2V0KGFjdGlvbnMpKX1cbiAgICAgIDwvZGl2PlxuICAgIGBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvclxuIiwiLyogYWJvdXRcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxudmFyIFBvcHVwID0gcmVxdWlyZSgnLi4vcG9wdXAnKVxuXG5mdW5jdGlvbiBIZWxwIChhY3Rpb25zLCBhY3Rpb25zSW50ZXJuYWwpIHtcbiAgdmFyIHNlbGYgPSB1dGlsLmluaGVyaXRzKHRoaXMsIFBvcHVwKVxuICBQb3B1cC5jYWxsKHNlbGYsICdhYm91dCcsIGFjdGlvbnNJbnRlcm5hbClcblxuICBzZWxmLm1vdW50ID0gc2VsZi5zdXBlci5tb3VudC5iaW5kKHNlbGYpXG4gIHNlbGYudW5tb3VudCA9IHNlbGYuc3VwZXIudW5tb3VudC5iaW5kKHNlbGYpXG5cbiAgc2VsZi5yZW5kZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHNlbGYuc3VwZXIucmVuZGVyLmNhbGwoc2VsZiwgJ0Fib3V0JywgYFxuICAgICAgPHA+XG4gICAgICAgIDxhIGhyZWY9XCIvXCI+c2lsb3ouaW88L2E+IGlzIGEgcHJpdmF0ZSBjb2RlIHBsYXlncm91bmQgaW4gdGhlIGJyb3dzZXIuXG4gICAgICA8L3A+XG5cbiAgICAgIDxwPlxuICAgICAgICBZb3VyIHNvdXJjZSBjb2RlIGlzIHNhdmVkIGluIHRoZSBVUkwgYW5kIG5ldmVyIHJlYWNoZXMgb3VyIHNlcnZlcnMuXG4gICAgICA8L3A+XG5cbiAgICAgIDxwPlxuICAgICAgICBVc2UgSFRNTCwgQ1NTIGFuZCBKYXZhU2NyaXB0LCBhbG9uZyB3aXRoIHByb2Nlc3NvcnMgbGlrZSBDb2ZmZWVTY3JpcHQsIEJhYmVsL0VTMjAxNSwgTGVzcywgU3R5bHVzIG9yIE1hcmtkb3duLlxuICAgICAgPC9wPlxuXG4gICAgICA8aDI+XG4gICAgICAgIFNob3J0IFVSTHNcbiAgICAgIDwvaDI+XG5cbiAgICAgIDxwPlxuICAgICAgICBzaWxvei5pbyBjYW4gZ2VuZXJhdGUgc2hvcnRlciB1cmxzLCBhdCBhIHByaXZhY3kgY29zdC5cbiAgICAgIDwvcD5cblxuICAgICAgPHA+XG4gICAgICAgIFdoZW4gYSBzaG9ydCB1cmwgaXMgZ2VuZXJhdGVkLCB0aGUgdXJsICAtIHRoYXQgaW5jbHVkZXMgdGhlIHNvdXJjZSBjb2RlIC0gaXMgc2F2ZWQgb24gdGhlIHNlcnZlciwgYWxvbmcgd2l0aCBhIHVuaXF1ZSB0b2tlbi5cbiAgICAgIDwvcD5cblxuICAgICAgPHA+XG4gICAgICAgIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZ2hpbmRhL3NpbG96LmlvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICAgICAgU291cmNlIGNvZGUgYXZhaWxhYmxlIG9uIEdpdEh1Yi5cbiAgICAgICAgPC9hPlxuICAgICAgPC9wPlxuICAgIGApXG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBcbiIsIi8qIGhlYWRlclxuICovXG5cbnZhciBkdXJydXRpID0gcmVxdWlyZSgnZHVycnV0aScpXG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzJylcbnZhciBTaGFyZSA9IHJlcXVpcmUoJy4vc2hhcmUnKVxudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9hYm91dCcpXG5cbnZhciBJbnRlcm5hbFN0b3JlID0gcmVxdWlyZSgnLi4vLi4vc3RhdGUvc3RvcmUtaW50ZXJuYWwnKVxudmFyIHN0b3JlSW50ZXJuYWwgPSBuZXcgSW50ZXJuYWxTdG9yZSgpXG5cbmZ1bmN0aW9uIEhlYWRlciAoYWN0aW9ucykge1xuICB2YXIgJGNvbnRhaW5lclxuICB2YXIgZGF0YSA9IHN0b3JlSW50ZXJuYWwuZ2V0KClcbiAgdmFyIGFjdGlvbnNJbnRlcm5hbCA9IHN0b3JlSW50ZXJuYWwuYWN0aW9uc1xuICB2YXIgbG9hZGluZ0NvbGxhYm9yYXRlID0gYWN0aW9uc0ludGVybmFsLmdldExvYWRpbmcoJ2NvbGxhYm9yYXRlJylcblxuICB2YXIgY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXdEYXRhID0gc3RvcmVJbnRlcm5hbC5nZXQoKVxuXG4gICAgLy8gaWYgc29tZXRoaW5nIGNoYW5nZWQuXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KGRhdGEpICE9PSBKU09OLnN0cmluZ2lmeShuZXdEYXRhKSkge1xuICAgICAgZHVycnV0aS5yZW5kZXIobmV3IEhlYWRlcihhY3Rpb25zKSwgJGNvbnRhaW5lcilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkb25lTG9hZGluZ0NvbGxhYm9yYXRlICgpIHtcbiAgICBhY3Rpb25zSW50ZXJuYWwudXBkYXRlTG9hZGluZygnY29sbGFib3JhdGUnLCBmYWxzZSlcbiAgfVxuXG4gIHRoaXMubW91bnQgPSBmdW5jdGlvbiAoJG5vZGUpIHtcbiAgICAkY29udGFpbmVyID0gJG5vZGVcblxuICAgICRjb250YWluZXIucXVlcnlTZWxlY3RvcignLmNvbGxhYm9yYXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBsb2FkaW5nXG4gICAgICBhY3Rpb25zSW50ZXJuYWwudXBkYXRlTG9hZGluZygnY29sbGFib3JhdGUnLCB0cnVlKVxuXG4gICAgICB3aW5kb3cuVG9nZXRoZXJKUygpXG5cbiAgICAgIHdpbmRvdy5Ub2dldGhlckpTLm9uKCdyZWFkeScsIGRvbmVMb2FkaW5nQ29sbGFib3JhdGUpXG4gICAgICB3aW5kb3cuVG9nZXRoZXJKUy5vbignY2xvc2UnLCBkb25lTG9hZGluZ0NvbGxhYm9yYXRlKVxuICAgIH0pXG5cbiAgICBzdG9yZUludGVybmFsLm9uKCdjaGFuZ2UnLCBjaGFuZ2UpXG4gIH1cblxuICB0aGlzLnVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5Ub2dldGhlckpTKSB7XG4gICAgICB3aW5kb3cuVG9nZXRoZXJKUy5vZmYoJ3JlYWR5JywgZG9uZUxvYWRpbmdDb2xsYWJvcmF0ZSlcbiAgICAgIHdpbmRvdy5Ub2dldGhlckpTLm9mZignY2xvc2UnLCBkb25lTG9hZGluZ0NvbGxhYm9yYXRlKVxuICAgIH1cblxuICAgIHN0b3JlSW50ZXJuYWwub2ZmKCdjaGFuZ2UnLCBjaGFuZ2UpXG4gIH1cblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0ICAvLyBcbiAgICByZXR1cm4gYFxuICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc21hbGwgY29sbGFib3JhdGUgYnRuLXNtYWxsIGJ0bi1kZWZhdWx0ICR7bG9hZGluZ0NvbGxhYm9yYXRlID8gJ2lzLWxvYWRpbmcnIDogJyd9XCI+XG4gICAgICAgICAgQ29sbGFib3JhdGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgPC9kaXY+XG4gICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XHQgICAgICAgXG5cdFx0ICR7ZHVycnV0aS5yZW5kZXIobmV3IFNldHRpbmdzKGFjdGlvbnMsIHN0b3JlSW50ZXJuYWwuYWN0aW9ucykpfVxuICAgICAgICAgJHtkdXJydXRpLnJlbmRlcihuZXcgU2hhcmUoYWN0aW9ucywgc3RvcmVJbnRlcm5hbC5hY3Rpb25zKSl9XG4gICAgICAgPC9kaXY+XG4gICAgIFxuICAgICBcbiAgICBgXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcbiIsIi8qIHNldHRpbmdzXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlsJylcbnZhciBQb3B1cCA9IHJlcXVpcmUoJy4uL3BvcHVwJylcblxuZnVuY3Rpb24gU2V0dGluZ3MgKGFjdGlvbnMsIGFjdGlvbnNJbnRlcm5hbCkge1xuICB2YXIgc2VsZiA9IHV0aWwuaW5oZXJpdHModGhpcywgUG9wdXApXG4gIFBvcHVwLmNhbGwoc2VsZiwgJ3NldHRpbmdzJywgYWN0aW9uc0ludGVybmFsKVxuXG4gIHZhciBwYW5lcyA9IGFjdGlvbnMuZ2V0UGFuZXMoKVxuICB2YXIgdGhlbWUgPSBhY3Rpb25zLmdldFRoZW1lKClcblxuICBmdW5jdGlvbiB0b2dnbGVQYW5lICh0eXBlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgcGFuZXMgPSB7fVxuICAgICAgcGFuZXNbdHlwZV0gPSB7IGhpZGRlbjogIShlLnRhcmdldC5jaGVja2VkKSB9XG4gICAgICByZXR1cm4gYWN0aW9ucy51cGRhdGVQYW5lcyhwYW5lcylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUaGVtZSAoKSB7XG4gICAgYWN0aW9ucy51cGRhdGVUaGVtZSh0aGlzLnZhbHVlKVxuICB9XG5cbiAgc2VsZi5tb3VudCA9IGZ1bmN0aW9uICgkY29udGFpbmVyKSB7XG4gICAgc2VsZi5zdXBlci5tb3VudC5jYWxsKHNlbGYsICRjb250YWluZXIpXG5cbiAgICB2YXIgJHNob3dIdG1sID0gJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZ3Mtc2hvdy1odG1sJylcbiAgICB2YXIgJHNob3dDc3MgPSAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5ncy1zaG93LWNzcycpXG4gICAgdmFyICRzaG93SnMgPSAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5ncy1zaG93LWpzJylcblxuICAgICRzaG93SHRtbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0b2dnbGVQYW5lKCdodG1sJykpXG4gICAgJHNob3dDc3MuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdG9nZ2xlUGFuZSgnY3NzJykpXG4gICAgJHNob3dKcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0b2dnbGVQYW5lKCdqcycpKVxuXG4gICAgJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZ3MtdGhlbWUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZXRUaGVtZSlcbiAgfVxuXG4gIHNlbGYudW5tb3VudCA9IHNlbGYuc3VwZXIudW5tb3VudC5iaW5kKHNlbGYpXG5cbiAgc2VsZi5yZW5kZXIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHNlbGYuc3VwZXIucmVuZGVyLmNhbGwoc2VsZiwgJ1NldHRpbmdzJywgYFxuICAgICAgPGZpZWxkc2V0PlxuICAgICAgICA8bGVnZW5kPlxuICAgICAgICAgIFRhYnNcbiAgICAgICAgPC9sZWdlbmQ+XG5cbiAgICAgICAgPGxhYmVsPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cInNldHRpbmdzLXNob3ctaHRtbFwiICR7IXBhbmVzLmh0bWwuaGlkZGVuID8gJ2NoZWNrZWQnIDogJyd9PlxuICAgICAgICAgIEhUTUxcbiAgICAgICAgPC9sYWJlbD5cblxuICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwic2V0dGluZ3Mtc2hvdy1jc3NcIiAkeyFwYW5lcy5jc3MuaGlkZGVuID8gJ2NoZWNrZWQnIDogJyd9PlxuICAgICAgICAgIENTU1xuICAgICAgICA8L2xhYmVsPlxuXG4gICAgICAgIDxsYWJlbD5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJzZXR0aW5ncy1zaG93LWpzXCIgJHshcGFuZXMuanMuaGlkZGVuID8gJ2NoZWNrZWQnIDogJyd9PlxuICAgICAgICAgIEphdmFTY3JpcHRcbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZmllbGRzZXQ+XG5cbiAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgPGxlZ2VuZD5cbiAgICAgICAgICBUaGVtZVxuICAgICAgICA8L2xlZ2VuZD5cblxuICAgICAgICA8c2VsZWN0IGNsYXNzPVwic2V0dGluZ3MtdGhlbWUgc2VsZWN0XCI+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNvbGFyaXplZCBsaWdodFwiICR7dGhlbWUgPT09ICdzb2xhcml6ZWQgbGlnaHQnID8gJ3NlbGVjdGVkJyA6ICcnfT5cbiAgICAgICAgICAgIFNvbGFyaXplZCBMaWdodFxuICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzb2xhcml6ZWQgZGFya1wiICR7dGhlbWUgPT09ICdzb2xhcml6ZWQgZGFyaycgPyAnc2VsZWN0ZWQnIDogJyd9PlxuICAgICAgICAgICAgU29sYXJpemVkIERhcmtcbiAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2ZpZWxkc2V0PlxuICAgIGApXG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzXG4iLCIvKiBzaGFyZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG52YXIgUG9wdXAgPSByZXF1aXJlKCcuLi9wb3B1cCcpXG5cbmZ1bmN0aW9uIFNoYXJlIChhY3Rpb25zLCBhY3Rpb25zSW50ZXJuYWwpIHtcbiAgdmFyIHNlbGYgPSB1dGlsLmluaGVyaXRzKHRoaXMsIFBvcHVwKVxuICBQb3B1cC5jYWxsKHNlbGYsICdzaGFyZScsIGFjdGlvbnNJbnRlcm5hbClcblxuICB2YXIgc2hvcnRVcmwgPSBhY3Rpb25zLmdldFNob3J0VXJsKClcbiAgdmFyIGxvbmdVcmwgPSAnJ1xuICB2YXIgd2F0Y2hlclxuXG4gIHZhciBnZW5lcmF0aW5nID0gYWN0aW9uc0ludGVybmFsLmdldExvYWRpbmcoJ2dlbmVyYXRlLXVybCcpXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbG9uZ1VybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gIH1cblxuICBmdW5jdGlvbiBjb3B5ICgkaW5wdXQpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciAkYnRuID0gdXRpbC5jbG9zZXN0KGUudGFyZ2V0LCAnLmJ0bicpXG5cbiAgICAgICRpbnB1dC5zZWxlY3QoKVxuXG4gICAgICB0cnkge1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG5cbiAgICAgICAgJGJ0bi5pbm5lckhUTUwgPSAnQ29waWVkJ1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAkYnRuLmlubmVySFRNTCA9ICdDb3B5J1xuICAgICAgICB9LCAyMDAwKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlICgpIHtcbiAgICAvLyBsb2FkaW5nXG4gICAgYWN0aW9uc0ludGVybmFsLnVwZGF0ZUxvYWRpbmcoJ2dlbmVyYXRlLXVybCcsIHRydWUpXG5cbiAgICBhY3Rpb25zLnVwZGF0ZVNob3J0VXJsKCgpID0+IHtcbiAgICAgIGFjdGlvbnNJbnRlcm5hbC51cGRhdGVMb2FkaW5nKCdnZW5lcmF0ZS11cmwnLCBmYWxzZSlcbiAgICB9KVxuICB9XG5cbiAgc2VsZi5tb3VudCA9IGZ1bmN0aW9uICgkY29udGFpbmVyKSB7XG4gICAgc2VsZi5zdXBlci5tb3VudC5jYWxsKHNlbGYsICRjb250YWluZXIpXG5cbiAgICB2YXIgJHNob3J0VXJsID0gJGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2hhcmUtdXJsLWlucHV0LXNob3J0JylcbiAgICB2YXIgJHNob3J0VXJsQ29weSA9ICRjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNoYXJlLXVybC1jb3B5LXNob3J0JylcbiAgICB2YXIgJGxvbmdVcmwgPSAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zaGFyZS11cmwtaW5wdXQtbG9uZycpXG4gICAgdmFyICRsb25nVXJsQ29weSA9ICRjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNoYXJlLXVybC1jb3B5LWxvbmcnKVxuXG4gICAgJHNob3J0VXJsQ29weS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNvcHkoJHNob3J0VXJsKSlcbiAgICAkbG9uZ1VybENvcHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb3B5KCRsb25nVXJsKSlcblxuICAgIHZhciAkZ2VuZXJhdGVTaG9ydCA9ICRjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNoYXJlLWdlbmVyYXRlJylcbiAgICAkZ2VuZXJhdGVTaG9ydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdlbmVyYXRlKVxuXG4gICAgaWYgKHNob3J0VXJsKSB7XG4gICAgICAvLyBnaXZlIGl0IGEgc2VjLFxuICAgICAgLy8gdG8gbm90IHRyaWdnZXIgdXJsIHVwZGF0ZSBvbiBsb2FkLFxuICAgICAgLy8gYW5kIGZvcmNlIHVybCBnZW5lcmF0aW9uIGV2ZW4gaWYgbm90aGluZyB3YXMgY2hhbmdlZCxcbiAgICAgIC8vIG9uIGZvcmVpZ24gY2xpZW50cy5cbiAgICAgIHdhdGNoZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWN0aW9ucy5zdGFydFNob3J0VXJsVXBkYXRlcigpXG4gICAgICB9LCAxMDAwKVxuICAgIH1cbiAgfVxuXG4gIHNlbGYudW5tb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLnN1cGVyLnVubW91bnQuY2FsbChzZWxmKVxuXG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh3YXRjaGVyKVxuICAgIH1cblxuICAgIGlmIChzaG9ydFVybCkge1xuICAgICAgYWN0aW9ucy5zdG9wU2hvcnRVcmxVcGRhdGVyKClcbiAgICB9XG4gIH1cblxuICBzZWxmLnJlbmRlciA9ICgpID0+IHtcbiAgICByZXR1cm4gc2VsZi5zdXBlci5yZW5kZXIuY2FsbChzZWxmLCAnU2hhcmUnLCBgXG4gICAgICA8ZmllbGRzZXQgY2xhc3M9XCIke3Nob3J0VXJsID8gJ3NoYXJlLWlzLWdlbmVyYXRlZCcgOiAnJ31cIj5cbiAgICAgICAgPGxlZ2VuZD5cbiAgICAgICAgICBTaG9ydCBVUkxcbiAgICAgICAgPC9sZWdlbmQ+XG5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgc2hhcmUtZ2VuZXJhdGUgJHtnZW5lcmF0aW5nID8gJ2lzLWxvYWRpbmcnIDogJyd9XCI+XG4gICAgICAgICAgR2VuZXJhdGUgU2hvcnQgVVJMXG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzaGFyZS11cmwgc2hhcmUtdXJsLXNob3J0XCI+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzaGFyZS11cmwtaW5wdXQgc2hhcmUtdXJsLWlucHV0LXNob3J0XCIgdmFsdWU9XCIke3Nob3J0VXJsfVwiIHJlYWRvbmx5PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIHNoYXJlLXVybC1jb3B5IHNoYXJlLXVybC1jb3B5LXNob3J0XCI+XG4gICAgICAgICAgICBDb3B5XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWVsZHNldD5cbiAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgPGxlZ2VuZD5cbiAgICAgICAgICBQZXJzaXN0ZW50IFVSTFxuICAgICAgICA8L2xlZ2VuZD5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwic2hhcmUtdXJsXCI+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzaGFyZS11cmwtaW5wdXQgc2hhcmUtdXJsLWlucHV0LWxvbmdcIiB2YWx1ZT1cIiR7bG9uZ1VybH1cIiByZWFkb25seT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBzaGFyZS11cmwtY29weSBzaGFyZS11cmwtY29weS1sb25nXCI+XG4gICAgICAgICAgICBDb3B5XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWVsZHNldD5cbiAgICBgKVxuICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZVxuIiwiLyogbWFpblxuICovXG5cbnZhciBkdXJydXRpID0gcmVxdWlyZSgnZHVycnV0aScpXG52YXIgSGVhZGVyID0gcmVxdWlyZSgnLi9oZWFkZXIvaGVhZGVyJylcbnZhciBFZGl0b3IgPSByZXF1aXJlKCcuL2VkaXRvci9lZGl0b3InKVxuXG52YXIgR2xvYmFsU3RvcmUgPSByZXF1aXJlKCcuLi9zdGF0ZS9zdG9yZScpXG52YXIgc3RvcmUgPSBuZXcgR2xvYmFsU3RvcmUoKVxuXG5mdW5jdGlvbiBNYWluICgpIHtcbiAgdmFyICRjb250YWluZXJcbiAgdmFyIGRhdGEgPSBzdG9yZS5nZXQoKVxuICB2YXIgdGhlbWUgPSBzdG9yZS5hY3Rpb25zLmdldFRoZW1lKClcbiAgdmFyIGNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV3RGF0YSA9IHN0b3JlLmdldCgpXG5cbiAgICAvLyBkb24ndCBjb21wYXJlIGZpbGVzXG4gICAgZGVsZXRlIGRhdGEuZmlsZXNcbiAgICBkZWxldGUgbmV3RGF0YS5maWxlc1xuXG4gICAgLy8gaWYgc29tZXRoaW5nIGNoYW5nZWQsXG4gICAgLy8gZXhjZXB0IHRoZSBmaWxlcy5cblx0XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KGRhdGEpICE9PSBKU09OLnN0cmluZ2lmeShuZXdEYXRhKSkge1xuICAgICAgZHVycnV0aS5yZW5kZXIoTWFpbiwgJGNvbnRhaW5lcilcbiAgICB9XG4gIH1cblxuICB0aGlzLm1vdW50ID0gZnVuY3Rpb24gKCRub2RlKSB7XG4gICAgJGNvbnRhaW5lciA9ICRub2RlXG4gICAgY29uc29sZS5sb2coJ01PVU5UJywgJG5vZGUpXG4gICAgc3RvcmUub24oJ2NoYW5nZScsIGNoYW5nZSlcbiAgfVxuXG4gIHRoaXMudW5tb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygndU1PVU5UJylcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScsIGNoYW5nZSlcbiAgfVxuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBgXG4gICAgICA8ZGl2IGNsYXNzPVwibWFpbiBzaWxvei10aGVtZS0ke3RoZW1lLnJlcGxhY2UoLyAvZywgJy0nKX1cIj5cbiAgICAgICAgJHtkdXJydXRpLnJlbmRlcihuZXcgSGVhZGVyKHN0b3JlLmFjdGlvbnMpKX1cbiAgICAgICAgJHtkdXJydXRpLnJlbmRlcihuZXcgRWRpdG9yKHN0b3JlLmFjdGlvbnMpKX1cbiAgICAgIDwvZGl2PlxuICAgIGBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5cbiIsIi8qIHBvcHVwXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJylcblxuZnVuY3Rpb24gUG9wdXAgKG5hbWUsIGFjdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLnN0YXRlID0gYWN0aW9ucy5nZXRQb3B1cChuYW1lKVxuICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zXG4gIHRoaXMudG9nZ2xlUG9wdXAgPSB0aGlzLnByb3RvdHlwZS50b2dnbGVQb3B1cC5iaW5kKHRoaXMpXG4gIHRoaXMuaGlkZVBvcHVwID0gdGhpcy5wcm90b3R5cGUuaGlkZVBvcHVwLmJpbmQodGhpcylcbn1cblxuUG9wdXAucHJvdG90eXBlLnRvZ2dsZVBvcHVwID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnN0YXRlID0gIXRoaXMuc3RhdGVcbiAgdGhpcy5hY3Rpb25zLnVwZGF0ZVBvcHVwKHRoaXMubmFtZSwgdGhpcy5zdGF0ZSlcbn1cblxuUG9wdXAucHJvdG90eXBlLmhpZGVQb3B1cCA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmICh1dGlsLmNsb3Nlc3QoZS50YXJnZXQsICcucG9wdXAnKSB8fCBlLnRhcmdldCA9PT0gdGhpcy4kYnV0dG9uIHx8ICF0aGlzLnN0YXRlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLmFjdGlvbnMudXBkYXRlUG9wdXAodGhpcy5uYW1lLCBmYWxzZSlcbn1cblxuUG9wdXAucHJvdG90eXBlLm1vdW50ID0gZnVuY3Rpb24gKCRjb250YWluZXIpIHtcbiAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lclxuICB0aGlzLiRidXR0b24gPSAkY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1idXR0b24nKVxuXG4gIHRoaXMuJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudG9nZ2xlUG9wdXApXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlUG9wdXApXG59XG5cblBvcHVwLnByb3RvdHlwZS51bm1vdW50ID0gZnVuY3Rpb24gKCkge1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZVBvcHVwKVxufVxuXG5Qb3B1cC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHRpdGxlLCBjb250ZW50KSB7XG4gIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cInBvcHVwLWNvbnRhaW5lciAke3RoaXMubmFtZX0gJHt0aGlzLnN0YXRlID8gJ3BvcHVwLWNvbnRhaW5lci1pcy1vcGVuJyA6ICcnfVwiPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke3RoaXMubmFtZX0tYnV0dG9uIHBvcHVwLWJ1dHRvbiBidG5cIj5cbiAgICAgICAgJHt0aXRsZX1cbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICA8Zm9ybSBjbGFzcz1cIiR7dGhpcy5uYW1lfS1wb3B1cCBwb3B1cFwiPlxuICAgICAgICAke2NvbnRlbnR9XG4gICAgICA8L2Zvcm0+XG4gICAgPC9kaXY+XG4gIGBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3B1cFxuIiwiLyogc3RvcmUgYWN0aW9uc1xuICovXG5cbmZ1bmN0aW9uIGFjdGlvbnMgKHN0b3JlKSB7XG4gIGZ1bmN0aW9uIGdldFBvcHVwIChuYW1lKSB7XG4gICAgcmV0dXJuIHN0b3JlLmdldCgpLnBvcHVwW25hbWVdXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVQb3B1cCAobmFtZSwgc3RhdGUpIHtcbiAgICB2YXIgZGF0YSA9IHN0b3JlLmdldCgpXG4gICAgZGF0YS5wb3B1cFtuYW1lXSA9IHN0YXRlXG5cbiAgICBzdG9yZS5zZXQoZGF0YSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExvYWRpbmcgKG5hbWUpIHtcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCkubG9hZGluZ1tuYW1lXVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTG9hZGluZyAobmFtZSwgc3RhdGUpIHtcbiAgICB2YXIgZGF0YSA9IHN0b3JlLmdldCgpXG4gICAgZGF0YS5sb2FkaW5nW25hbWVdID0gc3RhdGVcblxuICAgIHN0b3JlLnNldChkYXRhKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRQb3B1cDogZ2V0UG9wdXAsXG4gICAgdXBkYXRlUG9wdXA6IHVwZGF0ZVBvcHVwLFxuXG4gICAgZ2V0TG9hZGluZzogZ2V0TG9hZGluZyxcbiAgICB1cGRhdGVMb2FkaW5nOiB1cGRhdGVMb2FkaW5nXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhY3Rpb25zXG4iLCIvKiBzdG9yZSBhY3Rpb25zXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBzaG9ydFVybFNlcnZpY2UgPSByZXF1aXJlKCcuL3Nob3J0LXVybCcpXG5cbmZ1bmN0aW9uIGFjdGlvbnMgKHN0b3JlKSB7XG4gIGZ1bmN0aW9uIGdldEZpbGVzICgpIHtcblx0dmFyIGZpbGVzPXN0b3JlLmdldCgpLmZpbGVzXG5cdGNvbnNvbGUubG9nKFwiR0VURklMRVNcIixmaWxlcyxzdG9yZSk7XG5cdGlmKGZpbGVzWzBdLmNvbnRlbnQubGVuZ3RoPT0wKSB7XG5cblx0XHRmaWxlc1swXS5jb250ZW50Kz0nPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPidcblx0XHRmaWxlc1swXS5jb250ZW50Kz1cIlxcblxcclxcblxcclwiO1xuXHRcdGZpbGVzWzBdLmNvbnRlbnQrPVwiPCEtLSBZb3VyIFZpZXcgQ29kZSAtLT5cIjtcblx0XHRmaWxlc1swXS5jb250ZW50Kz1cIlxcblxcclxcblxcclwiO1xuXHRcdGZpbGVzWzBdLmNvbnRlbnQrPVwiXFxuXFxyXFxuXFxyXCI7XG5cdFx0ZmlsZXNbMF0uY29udGVudCs9XCI8IS0tIC9Zb3VyIFZpZXcgQ29kZSAtLT5cIjtcblx0XHRmaWxlc1swXS5jb250ZW50Kz1cIlxcblxcclxcblxcclwiO1xuXHRcdGZpbGVzWzBdLmNvbnRlbnQrPVwiPC9kaXY+XCI7XG5cdFx0ZmlsZXNbMF0uY29udGVudCs9XCJcXG5cXHJcXG5cXHJcIjtcblx0XHRmaWxlc1swXS5jb250ZW50Kz1cIlxcblxcclxcblxcclwiO1xuXHRcdGZpbGVzWzBdLmNvbnRlbnQrPVwiXFxuXFxyXFxuXFxyXCI7XHRcblx0XHRmaWxlc1swXS5jb250ZW50Kz0nPHNjcmlwdCBzcmM9XCJodHRwczovL2Nkbi5yYXdnaXQuY29tL2VuZXJneWNoYWluL1N0cm9tREFPLUJ1c2luZXNzT2JqZWN0L21hc3Rlci9kaXN0L2xvYWRlci5qc1wiPjwvc2NyaXB0Pic7XG5cdFx0ZmlsZXNbMF0uY29udGVudCs9JzxzY3JpcHQgc3JjPVwiaHR0cDovL2NvZGUuanF1ZXJ5LmNvbS9qcXVlcnktMy4yLjEubWluLmpzXCI+PC9zY3JpcHQ+Jztcblx0XHRmaWxlc1swXS5jb250ZW50Kz0nPGxpbmsgaHJlZj1cImh0dHBzOi8vZGVtby5zdHJvbWRhby5kZS9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIvPic7XG5cdFx0ZmlsZXNbMF0uY29udGVudCs9JzxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9kZW1vLnN0cm9tZGFvLmRlL2pzL2Jvb3RzdHJhcC5taW4uanNcIj48L3NjcmlwdD4nO1xuXHRcdGZpbGVzWzBdLmNvbnRlbnQrPVwiXFxuXFxyXFxuXFxyXCI7XG5cdFx0XHRcblx0XHRmaWxlc1syXS5jb250ZW50PVwidmFyIG5vZGUgPSBuZXcgZG9jdW1lbnQuU3Ryb21EQU9CTy5Ob2RlKHtleHRlcm5hbF9pZDokKCcjZXh0aWQnKS52YWwoKSx0ZXN0TW9kZTp0cnVlLHJwYzpcXFwiaHR0cHM6Ly9kZW1vLnN0cm9tZGFvLmRlL3JwY1xcXCIsYWJpbG9jYXRpb246XFxcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vZW5lcmd5Y2hhaW4vU3Ryb21EQU8tQnVzaW5lc3NPYmplY3QvNmRjOWUwNzMvc21hcnRfY29udHJhY3RzL1xcXCJ9KTtcIjtcblx0fVxuICAgIHJldHVybiBmaWxlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUZpbGUgKG5ld0ZpbGUpIHtcbiAgICB2YXIgZGF0YSA9IHN0b3JlLmdldCgpXG5cbiAgICBkYXRhLmZpbGVzLnNvbWUoKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoZmlsZS50eXBlID09PSBuZXdGaWxlLnR5cGUpIHtcbiAgICAgICAgZGF0YS5maWxlc1tpbmRleF0gPSB1dGlsLmV4dGVuZChuZXdGaWxlLCBkYXRhLmZpbGVzW2luZGV4XSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHN0b3JlLnNldChkYXRhKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGx1Z2lucyAoKSB7XG4gICAgcmV0dXJuIHN0b3JlLmdldCgpLnBsdWdpbnNcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFBsdWdpbiAobmV3UGx1Z2luKSB7XG4gICAgdmFyIGRhdGEgPSBzdG9yZS5nZXQoKVxuXG4gICAgZGF0YS5wbHVnaW5zLnB1c2gobmV3UGx1Z2luKVxuICAgIHJldHVybiBzdG9yZS5zZXQoZGF0YSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVBsdWdpbiAob2xkUGx1Z2luKSB7XG4gICAgdmFyIGRhdGEgPSBzdG9yZS5nZXQoKVxuICAgIHZhciBwbHVnaW5OYW1lID0gJydcblxuICAgIGlmICh0eXBlb2Ygb2xkUGx1Z2luID09PSAnb2JqZWN0Jykge1xuICAgICAgcGx1Z2luTmFtZSA9IG9sZFBsdWdpbi5uYW1lXG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbk5hbWUgPSBvbGRQbHVnaW5cbiAgICB9XG5cbiAgICBkYXRhLnBsdWdpbnMuc29tZSgocGx1Z2luLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCh0eXBlb2YgcGx1Z2luID09PSAnb2JqZWN0JyAmJiBwbHVnaW4ubmFtZSA9PT0gcGx1Z2luTmFtZSkgfHxcbiAgICAgICAgICAodHlwZW9mIHBsdWdpbiA9PT0gJ3N0cmluZycgJiYgcGx1Z2luID09PSBwbHVnaW5OYW1lKSkge1xuICAgICAgICBkYXRhLnBsdWdpbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc3RvcmUuc2V0KGRhdGEpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYW5lcyAoKSB7XG4gICAgcmV0dXJuIHN0b3JlLmdldCgpLnBhbmVzXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVQYW5lcyAobmV3UGFuZXMpIHtcbiAgICB2YXIgZGF0YSA9IHN0b3JlLmdldCgpXG4gICAgZGF0YS5wYW5lcyA9IHV0aWwuZXh0ZW5kKG5ld1BhbmVzLCBkYXRhLnBhbmVzKVxuXG4gICAgcmV0dXJuIHN0b3JlLnNldChkYXRhKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGhlbWUgKCkge1xuICAgIHJldHVybiBzdG9yZS5nZXQoKS50aGVtZVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVGhlbWUgKHRoZW1lKSB7XG4gICAgdmFyIGRhdGEgPSBzdG9yZS5nZXQoKVxuICAgIGRhdGEudGhlbWUgPSB0aGVtZVxuXG4gICAgcmV0dXJuIHN0b3JlLnNldChkYXRhKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2hvcnRVcmwgKCkge1xuICAgIHJldHVybiBzdG9yZS5nZXQoKS5zaG9ydF91cmxcbiAgfVxuXG4gIHZhciBsb25nVXJsID0gJydcblxuICBmdW5jdGlvbiB1cGRhdGVTaG9ydFVybCAoZm9yY2UsIGNhbGxiYWNrID0gKCkgPT4ge30pIHtcbiAgICAvLyBmb3JjZSBub3QgZGVmaW5lZCwgYnV0IGNhbGxiYWNrIGlzXG4gICAgaWYgKHR5cGVvZiBmb3JjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBmb3JjZVxuICAgICAgZm9yY2UgPSBmYWxzZVxuICAgIH1cblxuICAgIC8vIGV4aXN0aW5nIHNob3J0X3VybCdzLFxuICAgIC8vIGNoZWNrIGlmIHdpbmRvdy5sb2NhdGlvbi5ocmVmIGlzIG5vdCBhbHJlYWR5IHNhdmVkXG4gICAgLy8gYW5kIHVwZGF0ZSBsaW5rLlxuICAgIHZhciBzaG9ydFVybCA9IGdldFNob3J0VXJsKClcbiAgICBpZiAoIXNob3J0VXJsIHx8IGZvcmNlKSB7XG4gICAgICBsb25nVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgc2hvcnRVcmxTZXJ2aWNlLmNyZWF0ZSh7XG4gICAgICAgIGxvbmdfdXJsOiBsb25nVXJsXG4gICAgICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGF0YSA9IHN0b3JlLmdldCgpXG4gICAgICAgIGRhdGEuc2hvcnRfdXJsID0gcmVzLnNob3J0X3VybFxuICAgICAgICBzdG9yZS5zZXQoZGF0YSlcblxuICAgICAgICAvLyBhZnRlciBzaG9ydF91cmwgaXMgYWRkZWQgdG8gaGFzaCxcbiAgICAgICAgLy8gdXBkYXRlIGxvbmdfdXJsIHRvIHBvaW50IHRvIHVybCB3aXRoIGhhc2guXG4gICAgICAgIGxvbmdVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuXG4gICAgICAgIC8vIHVwZGF0ZSBleGlzdGluZyBzaG9ydCB1cmxcbiAgICAgICAgc2hvcnRVcmxTZXJ2aWNlLnVwZGF0ZSh7XG4gICAgICAgICAgbG9uZ191cmw6IGxvbmdVcmwsXG4gICAgICAgICAgc2hvcnRfdXJsOiByZXMuc2hvcnRfdXJsXG4gICAgICAgIH0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGxvbmdVcmwgIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB7XG4gICAgICBsb25nVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgLy8gdXBkYXRlIGV4aXN0aW5nIHNob3J0IHVybFxuICAgICAgc2hvcnRVcmxTZXJ2aWNlLnVwZGF0ZSh7XG4gICAgICAgIGxvbmdfdXJsOiBsb25nVXJsLFxuICAgICAgICBzaG9ydF91cmw6IHNob3J0VXJsXG4gICAgICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIHN0b3AgdXJsIHVwZGF0ZXIuXG4gICAgICAgICAgc3RvcFNob3J0VXJsVXBkYXRlcigpXG5cbiAgICAgICAgICAvLyBkZWxldGUgZXhpc3Rpbmcgc2hvcnRfdXJsXG4gICAgICAgICAgdmFyIGRhdGEgPSBzdG9yZS5nZXQoKVxuICAgICAgICAgIGRhdGEuc2hvcnRfdXJsID0gJydcbiAgICAgICAgICBzdG9yZS5zZXQoZGF0YSlcblxuICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBkZWJvdW5jZWRVcGRhdGVTaG9ydFVybCA9IHV0aWwuZGVib3VuY2UodXBkYXRlU2hvcnRVcmwsIDUwMClcblxuICBmdW5jdGlvbiBzdGFydFNob3J0VXJsVXBkYXRlciAoKSB7XG4gICAgLy8gdXBkYXRlIHNob3J0IHVybCB3aGVuIGRhdGEgY2hhbmdlc1xuICAgIHN0b3JlLm9uKCdjaGFuZ2UnLCBkZWJvdW5jZWRVcGRhdGVTaG9ydFVybClcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BTaG9ydFVybFVwZGF0ZXIgKCkge1xuICAgIC8vIHN0b3AgbW9uaXRvcmluZyBkYXRhIGNoYW5nZXNcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScsIGRlYm91bmNlZFVwZGF0ZVNob3J0VXJsKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRGaWxlczogZ2V0RmlsZXMsXG4gICAgdXBkYXRlRmlsZTogdXBkYXRlRmlsZSxcblxuICAgIGdldFBsdWdpbnM6IGdldFBsdWdpbnMsXG4gICAgYWRkUGx1Z2luOiBhZGRQbHVnaW4sXG4gICAgcmVtb3ZlUGx1Z2luOiByZW1vdmVQbHVnaW4sXG5cbiAgICBnZXRQYW5lczogZ2V0UGFuZXMsXG4gICAgdXBkYXRlUGFuZXM6IHVwZGF0ZVBhbmVzLFxuXG4gICAgZ2V0VGhlbWU6IGdldFRoZW1lLFxuICAgIHVwZGF0ZVRoZW1lOiB1cGRhdGVUaGVtZSxcblxuICAgIGdldFNob3J0VXJsOiBnZXRTaG9ydFVybCxcbiAgICB1cGRhdGVTaG9ydFVybDogdXBkYXRlU2hvcnRVcmwsXG4gICAgc3RhcnRTaG9ydFVybFVwZGF0ZXI6IHN0YXJ0U2hvcnRVcmxVcGRhdGVyLFxuICAgIHN0b3BTaG9ydFVybFVwZGF0ZXI6IHN0b3BTaG9ydFVybFVwZGF0ZXJcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjdGlvbnNcbiIsIi8qIHNob3J0IHVybCBhcGlcbiAqL1xuXG4vLyBlbnYgZGV0ZWN0aW9uXG52YXIgZW52ID0gJ2xvY2FsJ1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAhPT0gJ2xvY2FsaG9zdCcpIHtcbiAgZW52ID0gJ2xpdmUnXG59XG5cbnZhciBhcGlVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ1xudmFyIHNob3J0VXJsID0gYXBpVXJsXG5cbmlmIChlbnYgIT09ICdsb2NhbCcpIHtcbiAgYXBpVXJsID0gJ2h0dHBzOi8vcHJhamluYS1naGluZGEucmhjbG91ZC5jb20nXG4gIHNob3J0VXJsID0gJ2h0dHA6Ly9zLnNpbG96LmlvJ1xufVxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG52YXIgc2Vzc2lvbktleSA9ICdzaWxvei1pbydcblxuZnVuY3Rpb24gZ2V0U2Vzc2lvbiAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGNhY2hlID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHNlc3Npb25LZXkpXG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjYWNoZSlcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4ge31cbiAgfVxuXG4gIHJldHVybiB7fVxufVxuXG52YXIgc2Vzc2lvbiA9IGdldFNlc3Npb24oKVxuXG5mdW5jdGlvbiBzYXZlU2Vzc2lvbiAobmV3U2Vzc2lvbikge1xuICBzZXNzaW9uID0gdXRpbC5leHRlbmQobmV3U2Vzc2lvbiwgc2Vzc2lvbilcblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oc2Vzc2lvbktleSwgSlNPTi5zdHJpbmdpZnkoc2Vzc2lvbikpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSAoZGF0YSwgY2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuICB1dGlsLmZldGNoKGAke2FwaVVybH0vYXBpL2AsIHtcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgZGF0YTogZGF0YVxuICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgIH1cblxuICAgIC8vIHNldCBmdWxsIHVybCBmb3Igc2hvcnR1cmxcbiAgICByZXMuc2hvcnRfdXJsID0gYCR7c2hvcnRVcmx9LyR7cmVzLnNob3J0X3VybH1gXG5cbiAgICAvLyBzYXZlIHNlc3Npb25cbiAgICBzYXZlU2Vzc2lvbih7XG4gICAgICB0b2tlbjogcmVzLnRva2VuXG4gICAgfSlcblxuICAgIGNhbGxiYWNrKG51bGwsIHJlcylcbiAgfSlcbn1cblxuZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBjYWxsYmFjayA9ICgpID0+IHt9KSB7XG4gIC8vIHJlbW92ZSBhcGkgdXJsIGZyb20gc2hvcnRfdXJsXG4gIGRhdGEuc2hvcnRfdXJsID0gZGF0YS5zaG9ydF91cmwucmVwbGFjZShgJHtzaG9ydFVybH0vYCwgJycpXG5cbiAgLy8gYWRkIHRva2VuXG4gIGRhdGEudG9rZW4gPSBzZXNzaW9uLnRva2VuXG5cbiAgdXRpbC5mZXRjaChgJHthcGlVcmx9L2FwaS9gLCB7XG4gICAgdHlwZTogJ1BVVCcsXG4gICAgZGF0YTogZGF0YVxuICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgIH1cblxuICAgIGNhbGxiYWNrKG51bGwsIHJlcylcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogY3JlYXRlLFxuICB1cGRhdGU6IHVwZGF0ZVxufVxuIiwiLyogaW50ZXJuYWwgc3RvcmUsXG4gKiBub3Qgc3RvcmVkIGluIHVybFxuICovXG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJ2R1cnJ1dGkvc3RvcmUnKVxudmFyIGFjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMtaW50ZXJuYWwnKVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIHBvcHVwOiB7fSxcbiAgbG9hZGluZzoge31cbn1cblxudmFyIEludGVybmFsU3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIFN0b3JlLmNhbGwodGhpcylcbiAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucyh0aGlzKVxuXG4gIHRoaXMuc2V0KGRlZmF1bHRzKVxufVxuXG5JbnRlcm5hbFN0b3JlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3RvcmUucHJvdG90eXBlKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVybmFsU3RvcmVcblxuIiwiLyogc3RvcmVcbiAqL1xuXG52YXIgU3RvcmUgPSByZXF1aXJlKCdkdXJydXRpL3N0b3JlJylcbnZhciBMWlN0cmluZyA9IHJlcXVpcmUoJ2x6LXN0cmluZycpXG52YXIgYWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucycpXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIHZlcnNpb246IDEsXG4gIGZpbGVzOiBbe1xuICAgIHR5cGU6ICdodG1sJyxcbiAgICBjb250ZW50OiAnJ1xuICB9LCB7XG4gICAgdHlwZTogJ2NzcycsXG4gICAgY29udGVudDogJydcbiAgfSwge1xuICAgIHR5cGU6ICdqcycsXG4gICAgY29udGVudDogJydcbiAgfV0sXG4gIHBsdWdpbnM6IFtdLFxuICB0aGVtZTogJ3NvbGFyaXplZCBsaWdodCcsXG5cbiAgLy8gcGFuZSBwcm9wZXJ0aWVzIChoaWRkZW4sIGV0YylcbiAgcGFuZXM6IHtcbiAgICBodG1sOiB7fSxcbiAgICBjc3M6IHt9LFxuICAgIGpzOiB7fVxuICB9LFxuXG4gIHNob3J0X3VybDogJydcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUxvY2F0aW9uSGFzaCAoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiAoKSA9PiB7fVxuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIChoYXNoKSA9PiB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgYCMke2hhc2h9YClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChoYXNoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShgJHt3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdfSMke2hhc2h9YClcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIYXNoICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoTFpTdHJpbmcuZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50KHV0aWwuaGFzaCgncycpKSlcbiAgfSBjYXRjaCAoZXJyKSB7fVxuXG4gIHJldHVybiBudWxsXG59XG5cbnZhciBHbG9iYWxTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgU3RvcmUuY2FsbCh0aGlzKVxuICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zKHRoaXMpXG5cbiAgdmFyIHJlcGxhY2VIYXNoID0gcmVwbGFjZUxvY2F0aW9uSGFzaCgpXG4gIHZhciBjb21wcmVzc2VkRGF0YSA9ICcnXG5cbiAgdmFyIGhhc2hEYXRhID0gcGFyc2VIYXNoKClcbiAgaWYgKGhhc2hEYXRhKSB7XG4gICAgdGhpcy5zZXQodXRpbC5leHRlbmQoaGFzaERhdGEsIGRlZmF1bHRzKSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNldChkZWZhdWx0cylcbiAgfVxuXG4gIHRoaXMub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAvLyBzYXZlIGluIGhhc2hcbiAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0KClcbiAgICBpZiAoZGF0YS5maWxlc1swXS5jb250ZW50Lmxlbmd0aD09MCkge1xuICAgICAgIGRhdGEuZmlsZXNbMF0uY29udGVudD1cIjxoMT5EYW5rZSE8L2gxPlwiXG5cdH1cbiAgICBjb25zb2xlLmxvZygnU0FWRSBEQVRBJywgZGF0YSlcbiAgICBjb21wcmVzc2VkRGF0YSA9IExaU3RyaW5nLmNvbXByZXNzVG9FbmNvZGVkVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgIHJlcGxhY2VIYXNoKHV0aWwuaGFzaCgncycsIGNvbXByZXNzZWREYXRhKSlcbiAgfSlcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIGZvcmNlIHBhZ2UgcmVsb2FkIGlmIG9ubHkgaGFzaCBjaGFuZ2VkLFxuICAgICAgLy8gYW5kIGNvbXByZXNzZWQgZGF0YSBpcyBkaWZmZXJlbnQuXG4gICAgICAvLyBlZy4gbWFudWFsbHkgY2hhbmdpbmcgdXJsIGhhc2guXG4gICAgICBpZiAodXRpbC5oYXNoKCdzJykgIT09IGNvbXByZXNzZWREYXRhKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuR2xvYmFsU3RvcmUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdG9yZS5wcm90b3R5cGUpXG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsU3RvcmVcblxuIiwiLyogdXRpbFxuICovXG5cbmZ1bmN0aW9uIGNsb3Nlc3QgKCRlbGVtLCBzZWxlY3Rvcikge1xuICAvLyBmaW5kIHRoZSBjbG9zZXN0IHBhcmVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9yXG4gIHZhciAkbWF0Y2hlc1xuXG4gIC8vIGxvb3AgdGhyb3VnaCBwYXJlbnRzXG4gIHdoaWxlICgkZWxlbSAmJiAkZWxlbSAhPT0gZG9jdW1lbnQpIHtcbiAgICBpZiAoJGVsZW0ucGFyZW50Tm9kZSkge1xuICAgICAgLy8gZmluZCBhbGwgc2libGluZ3MgdGhhdCBtYXRjaCB0aGUgc2VsZWN0b3JcbiAgICAgICRtYXRjaGVzID0gJGVsZW0ucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICAgICAgLy8gY2hlY2sgaWYgb3VyIGVsZW1lbnQgaXMgbWF0Y2hlZCAocG9vci1tYW4ncyBFbGVtZW50Lm1hdGNoZXMoKSlcbiAgICAgIGlmIChbXS5pbmRleE9mLmNhbGwoJG1hdGNoZXMsICRlbGVtKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICRlbGVtXG4gICAgICB9XG5cbiAgICAgIC8vIGdvIHVwIHRoZSB0cmVlXG4gICAgICAkZWxlbSA9ICRlbGVtLnBhcmVudE5vZGVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBjbG9uZSAob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXG59XG5cbmZ1bmN0aW9uIGV4dGVuZExldmVsIChvYmosIGRlZmF1bHRzID0ge30pIHtcbiAgLy8gY29weSBkZWZhdWx0IGtleXMgd2hlcmUgdW5kZWZpbmVkXG4gIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gZGVmYXVsdFxuICAgICAgb2JqW2tleV0gPSBjbG9uZShkZWZhdWx0c1trZXldKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgZXh0ZW5kTGV2ZWwob2JqW2tleV0sIGRlZmF1bHRzW2tleV0pXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBvYmpcbn1cblxuLy8gbXVsdGktbGV2ZWwgb2JqZWN0IG1lcmdlXG5mdW5jdGlvbiBleHRlbmQgKG9iaiwgZGVmYXVsdHMpIHtcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHt9XG4gIH1cblxuICByZXR1cm4gZXh0ZW5kTGV2ZWwoY2xvbmUob2JqKSwgZGVmYXVsdHMpXG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlIChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgdmFyIHRpbWVvdXRcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXNcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50c1xuICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgIGlmIChjYWxsTm93KSB7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRTY3JpcHQgKHVybCwgZG9uZSA9ICgpID0+IHt9KSB7XG4gIHZhciAkc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgJHNjcmlwdC5zcmMgPSB1cmxcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCgkc2NyaXB0KVxuXG4gICRzY3JpcHQub25sb2FkID0gZG9uZVxufVxuXG5mdW5jdGlvbiBhc3luYyAoYXJyLCBkb25lLCBpID0gMCkge1xuICBpZiAoYXJyLmxlbmd0aCA9PT0gaSkge1xuICAgIHJldHVybiBkb25lKClcbiAgfVxuXG4gIGFycltpXSgoKSA9PiB7XG4gICAgaSsrXG4gICAgYXN5bmMoYXJyLCBkb25lLCBpKVxuICB9KVxufVxuXG5mdW5jdGlvbiBmZXRjaCAocGF0aCwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgLy8gb3B0aW9ucyBub3Qgc3BlY2lmaWVkXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG4gICAgdHlwZTogJ0dFVCcsXG4gICAgZGF0YToge31cbiAgfSlcblxuICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgdmFyIHJlcXVlc3QgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KClcbiAgcmVxdWVzdC5vcGVuKG9wdGlvbnMudHlwZSwgcGF0aClcbiAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04JylcbiAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0JylcblxuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgNDAwKSB7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQgfHwgJ3t9JylcblxuICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXJyb3JcbiAgICAgIGNhbGxiYWNrKHJlcXVlc3QpXG4gICAgfVxuICB9XG5cbiAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGVycm9yXG4gICAgY2FsbGJhY2socmVxdWVzdClcbiAgfVxuXG4gIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpKVxufVxuXG5mdW5jdGlvbiBpbmhlcml0cyAoYmFzZUNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGJhc2VDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKVxuICBiYXNlQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gYmFzZUNsYXNzXG5cbiAgYmFzZUNsYXNzLnN1cGVyID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGJhc2VDbGFzcy5wcm90b3R5cGUpXG5cbiAgcmV0dXJuIGJhc2VDbGFzc1xufVxuXG5mdW5jdGlvbiBoYXNoIChrZXksIHZhbHVlKSB7XG4gIHZhciBoYXNoUGFydHMgPSBbXVxuICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICBoYXNoUGFydHMgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkuc3BsaXQoJyYnKVxuICB9XG5cbiAgdmFyIHBhcnNlZEhhc2ggPSB7fVxuICB2YXIgc3RyaW5nSGFzaCA9ICcnXG5cbiAgaGFzaFBhcnRzLmZvckVhY2goKHBhcnQsIGkpID0+IHtcbiAgICB2YXIgc3ViUGFydHMgPSBwYXJ0LnNwbGl0KCc9JylcbiAgICBwYXJzZWRIYXNoW3N1YlBhcnRzWzBdXSA9IHN1YlBhcnRzWzFdIHx8ICcnXG4gIH0pXG5cbiAgaWYgKGtleSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcGFyc2VkSGFzaFtrZXldID0gdmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlZEhhc2hba2V5XVxuICAgIH1cbiAgfVxuXG4gIC8vIHJlYnVpbGQgdG8gc3RyaW5nXG4gIE9iamVjdC5rZXlzKHBhcnNlZEhhc2gpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgIGlmIChpID4gMCkge1xuICAgICAgc3RyaW5nSGFzaCArPSAnJidcbiAgICB9XG5cbiAgICBzdHJpbmdIYXNoICs9IGtleVxuXG4gICAgaWYgKHBhcnNlZEhhc2hba2V5XSkge1xuICAgICAgc3RyaW5nSGFzaCArPSBgPSR7cGFyc2VkSGFzaFtrZXldfWBcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHN0cmluZ0hhc2hcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNsb25lOiBjbG9uZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIGNsb3Nlc3Q6IGNsb3Nlc3QsXG4gIGRlYm91bmNlOiBkZWJvdW5jZSxcbiAgbG9hZFNjcmlwdDogbG9hZFNjcmlwdCxcbiAgYXN5bmM6IGFzeW5jLFxuICBmZXRjaDogZmV0Y2gsXG4gIGhhc2g6IGhhc2gsXG5cbiAgaW5oZXJpdHM6IGluaGVyaXRzXG59XG4iXX0=
