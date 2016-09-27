/**
 * Created by Simplex Studio, Ltd on 10/11/2015.
 */

/**
 * @description Provides some basic helper methods and pollyfills for vanilla js.
 * @version 0.1.5
 * @author Simplex Studio, LTD
 * @copyright Copyright (c) 2016 Simplex Studio, LTD
 * @license The MIT License (MIT)
 * Copyright (c) 2016 Simplex Studio, LTD
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//TODO: wrap this up so these are not root vars!
// currently used by debugger only
/**
 * Short cut to create and append a dom element with id, classes, and inner html.
 * This is really sweet because you can create a new button in one line!
 * @example
 * createEle("div#id.class1.class2", someDomEle , "Some text for the innerHTML")
 * createEle("div.class1", someDomEle , {innerHTML:'Some text for the innerHTML',
 *                                       style:'display:None;'})
 * @param zen {string}
 * The elements tag type. Allows zen #id and .class declarations.
 * @param [appendTo] {HTMLElement}
 * The DOM element to append the new element to.
 * @param [attributes] {string|object} [properties]
 * An object of {attribute:value} pairs to set on the element created. Or
 * Or s string to set as the innerHTML property of the created element.
 * @returns {HTMLElement}
 */
function createEle(zen, appendTo, attributes) {
    attributes = attributes == undefined ? {} : attributes
    var e
    var z = parseZen(zen)
    e = document.createElement(z.tag)
    if (z.id) e.id = z.id
    if (z.class) e.className = z.class

    if (typeof attributes == 'string')
        e.innerHTML = attributes
    else
        for (var k in attributes)
            e.setAttribute(k, attributes[k])

    if (appendTo) appendTo.appendChild(e)
    return e
}

/**
 * Parses a string for zen syntax. Limited support to tag, id, and class.
 * @param zen {string} tag#id.class
 * @returns {{tag: (string), id: (string), class: (string)}}
 */
function parseZen(zen){
    var match = zen.match(/(\w+)(?:#([^\.#]+)){0,1}((?:\.[^\.#]+)*)/i)
    return {tag:match[1]|| '', id:match[2] || '', class:match[3].split('.').join(' ').trim() || ''}
}

/**
 * Gets the parent of an HTMLElement.
 * @param ele {HTMLElement}
 * @param selector {string}
 * @returns {*}
 */
function getParent(ele, selector){
    //log('getParrent', selector, ele)
    while (!testEleMatch(ele, selector) && ele){
        ele = ele.parentElement
        //log('new ele', ele)
    }
    return ele
}
/**
 * Tests an if an HTMLElement is in the event target path.
 * @param event {Event}
 * @param selector {string | HTMLElement}
 * @param delegate {HTMLElement} The element the event is attached to.
 * The top level element in parent iteration.
 * @returns {*}
 */
function isTarget (event, selector, delegate){

    delegate = delegate || event.delegate

    if (event.path) {
        for (var i in event.path)
            if (testEleMatch(event.path[i], selector)) return event.path[i]

    } else {
        var target = event.target
        while (target) {
            if (target == delegate) break
            else if (testEleMatch(target, selector)) return target
            else target = target.parentElement
        }
    }
    return false
}
/**
 * (depreciated) Tests an if an HTMLElement is in an event path.
 * @param event {Event}
 * @param selector {string}
 * @returns {*}
 */
function isClicked(event, selector, delegate){
    console.warn ('isClicked has been depreciated in favor of isTarget and will be removed in future releases')
    return isTarget (event, selector, delegate)
}
/**
 * Tests if an HTMLElement matches a selector.
 * @param ele {HTMLElement}
 * @param selector {string}
 * @returns {*}
 */
function testEleMatch(ele, selector){
    if (!ele) return false
    var tagName = ele.tagName ? ele.tagName.toLowerCase() : ''
    return tagName == selector || hasClass(ele, selector) || ele.id == selector
}
/**
 * Tests if an HTMLElement has a class.
 * @param ele {HTMLElement}
 * @param cls {string}
 * @returns {*}
 */
function hasClass(ele,cls) {
    if (iterateCollection(arguments, hasClass)) return
    if (!(ele && ele.className)) return false
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Adds a class to an HTMLElement
 * @param ele {HTMLElement}
 * @param cls {string}
 */
function addClass(ele,cls) {
    if (iterateCollection(arguments, addClass)) return
    if (!hasClass(ele,cls)) {
        if (ele.className) ele.className += " "+cls;
        else ele.className += cls;
    }
}
/**
 * Removes a class from an HTMLElement
 * @param ele {HTMLElement}
 * @param cls {string}
 */
function removeClass(ele,cls) {
    if (iterateCollection(arguments, removeClass)) return
    if (hasClass(ele,cls)) {
        //log('info', 'removeClass:', ele )
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ').replace('  ', ' ');
        //log('info', 'removeClass success:', !hasClass(ele,cls) )
    }
}

/**
 * Toggles the class of an HTMLElement
 * @param ele {HTMLElement}
 * @param cls
 * @returns {boolean|undefined}
 */
function toggleClass(ele,cls) {
    if(iterateCollection(arguments, toggleClass)) return
    if (!hasClass(ele,cls)) {
        addClass(ele,cls)
        return true
    } else {
        removeClass(ele,cls)
        return false
    }
}
/**
 * Test if an object is an HTMLCollection, NodeList, or Array
 * @param obj {object} The object to test.
 * @returns {boolean}
 */
function isCollection (obj){
    return obj instanceof HTMLCollection || obj instanceof NodeList || obj instanceof Array
}

/**
 * Testes a any object for typeof or isInstance of depending on the verifyType.
 * @param obj {object} the object to test
 * @param verifyType {constructor | string | null} [HTMLElement]
 * A string will test `typeof` and a constructor function will test instanceof.
 * `null` will always return true.
 * @returns {boolean}
 */
function isItemType(verifyType, obj){
    if (verifyType !== null)
        if (typeof verifyType === 'string' ? !(typeof obj == verifyType):!(obj instanceof verifyType))
            return false
    return true
}

/**
 * An iterator function with the ability to extract the iterable from an arguments object where
 * and pass the balance of arguments to the callback along with the current iteration value and key.
 * There is also inline input and output verification for easily preserving the arguments object.
 * {@link isCollection} for what is considered a collection.
 *
 * @param input {arguments|object}
 * The object to iterate or the calling function's arguments object.
 * The latter requires the first argument be the object to iterate.  Remaining arguments will be applied
 * to the callback.
 * @param callback {function(element, [arguments,] index)}
 * A callback to apply for each element found in the collection.  The first argument will be the current
 * element, then anny other arguments passed, then the index of the current element.
 * @param [verify] {object}
 * @param verify.input {function(input)} A function returning true if the iterable is valid. Return any
 * falsy value to abort iteration.
 * @param verify.output {function(value)} A function returning true if the iterator's value is valid. Return
 * any falsy value to skip the callback for this iteration.
 * @returns {bool} Returns false if no iteration is required and true when complete.
 *
 * @example <caption>Perform action on element or all elements in collection.</caption>
 * function addId (elements, id) {
 *      // Provide this function as the callback
 *      if (iterate(arguments, addId)){
 *          //This will be executed once, after all items are iterated.
 *          // You must return here!
 *          return
 *      }
 *      // Element index will be provided as the last argument when callback is .
 *      // Alternatively modify the callable signature (element, id, index)
 *      var index = arguments[2]
 *      element.id = index ? id + index:id
 * }
 *
 * @example <caption>Perform action on all elements in collection.</caption>
 * // This example will do nothing if an element is provided as elements!
 * function addId (elements, id){
 *      iterate(elements, function(ele, index){
 *          ele.id = id+index
 *      })
 *  }
 *
 *  See {@link iterateCollection} for an example of inline verification.
 */
function iterate(input, callback, verify) {
    var isArguments = Object.prototype.toString.call(input) == '[object Arguments]'
    var iterable = isArguments ? input[0] : input
    verify  = verify || {}
    //if (!isCollection (col)) return false
    if (verify.input && !verify.input (iterable)) return false
    var args = isArguments ? Array.prototype.slice.call(input, 0) : ['value']
    var argsI = args.length
    for (var i in iterable) {
        if (iterable.hasOwnProperty(i)) {
            var value = iterable[i]
            if(verify.output && !verify.output(value)) continue
            args[0] = value
            args[argsI] = i
            if(callback) callback.apply(this, args)
        }
    }
    return true
}

//To make iterate generic this wrapper function is necessary
function iterateCollection(input, callback){
    return iterate(input , callback, {input:isCollection, output:isItemType.bind(this, HTMLElement)})
}

//TODO: universal map similar to jQuery can be implemented like this, but is it really worth it?
/**
 * Universal map function.  Takes any iterable and fires a callback for each iteration and
 * returns a new iterator containing all keys with non `null` or `undefined` values.  The call
 * back receives the current value plus andy arguments passed as input and an finally the
 * current index.
 * @param input {object | arguments} the
 * @param [callback]
 * @returns {}
 */
function map(input, callback){
    var isArrayLike = input[0] ? true : false
    var items = isArrayLike ? [] : {}
    iterate(input, function(value, key){
        var ret = callback.apply(this, arguments)
        if (ret === null || ret === undefined) return
        if (isArrayLike)
            items.push(ret)
        else
            items[key] = ret
    })
    return items
}

var lastTouch = undefined
/**
 * Prevent zoom on double tap in ios.
 * @param ele
 */
function noDTZoom (ele) {
    var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
    if (IS_IOS)
        ele.addEventListener('touchstart', function preventZoom(e) {
            var t2 = e.timeStamp
                , t1 = lastTouch || t2
                , dt = t2 - t1
                , fingers = e.touches.length;
            lastTouch = t2;

            if (!dt || dt > 500 || fingers > 1) return; // not double-tap
            e.preventDefault(); // double tap - prevent the zoom
            // also synthesize click events we just swallowed up
            triggerEvent(e.target,'click')
            triggerEvent(e.target,'click')
        });
};

/**
 * A shortcut to create and dispatch (or fire depending on browser) the specified
 * event on the specified target.
 * @param element
 * @param eventName The name of the event to trigger.  A name containing
 * "mouse" or "touch" will create the appropriate Event type.
 * @param [evt=HTMLEvents] {string} Optionally specify the Event type to create.
 * HTMLEvents will be used wth the exceptoins noted in eventName.
 * @returns {*}
 */
function triggerEvent(element, eventName, evt) {
    // dispatch for firefox + others
    if (document.createEvent) {
        if (!evt && eventName.indexOf('mouse')+1) {
           evt = document.createEvent("MouseEvent");
           evt.initEvent(eventName, true, true ); // event type,bubbling,cancelable
        }else if (!evt && eventName.indexOf('touch')+1) {
           evt = document.createEvent("TouchEvent");
           evt.initEvent(eventName, true, true ); // event type,bubbling,cancelable
        } else if (!evt){
           evt = document.createEvent("HTMLEvents");
           evt.initEvent(eventName, true, true ); // event type,bubbling,cancelable
        }
       return !element.dispatchEvent(evt);

    // dispatch for IE
    } else {
       evt = document.createEventObject();
       return element.fireEvent('on'+eventName, evt)
    }
}

/**
 * Escape HTML special characters.
 * @param unsafe {string} The unsafe string to escape.
 * @returns {XML|string}
 */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/#/g, "&#35;");
 }

// Prevents ie from returning a text node if firstChild is accessed directly.
function get_firstChild(n) {
    var x = n.firstChild;
    while (x.nodeType != 1) {
        x = x.nextSibling;
    }
    return x || null;
}

/**
 * Ajax object
 * @type {{}}
 */
var ajax = {};

/**
 * Ajax cross browser xhr object
 * @returns {*}
 */
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

/**
 * Ajax options parser
 * @param callback
 * @param options
 * @returns {*}
 */
ajax.parseOptions = function (callback, options) {
    if (callback && typeof callback !== 'function') {
        options = callback || {}
        callback = function () {
        }
    } else {
        options = options || {}
        callback = callback || function () {
                }
    }
    options.complete = options.complete || callback
    return options
}

/**
 * Ajax send method
 * @param method
 * @param url
 * @param options
 */
ajax.send = function (method, url, options) {
    var o = options || {}
    var func = function () {
    }
    o.success = o.success || o.callback || func
    o.error = o.error || o.callback || func
    o.complete = o.complete || func
    o.async = o.async !== false
    o.headers = o.headers || {}
    o.dataType = o.dataType || ''
    var data = options.data || options.params || {}

    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }

    var xhr = ajax.x();
    if (method == 'GET') {
        url = url + (query.length ? '?' + query.join('&') : '')
        query = undefined
    }
    else
        query = query.join('&')

    //xhr.responseType = o.dataType
    xhr.open(method, url, o.async);
    xhr.onreadystatechange = function () {
        // Response received
        if (xhr.readyState == 4) {
            var response = xhr.responseText
            // Success
            if (xhr.status == 200) {
                var contentType = xhr.getResponseHeader('Content-Type')
                if (contentType == 'application/json')
                    xhr.responseJSON = JSON.parse(xhr.responseText)
                response = xhr.data || xhr.responseJSON || response
                o.success(response, xhr.status, xhr)
            }
            // Not Success
            else {
                o.error(response, xhr.status, xhr)
            }
            // Complete
            console.log('ajax complete', o.complete)
            o.complete(response, xhr.status, xhr)
        }
    };

    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    for (var k in o.headers)
        xhr.setRequestHeader(k, o.headers[k]);

    xhr.send(query)
};

/**
 * Ajax GET method
 * @param url
 * @param callback
 * @param options
 */
ajax.get = function (url, callback, options) {
    options = ajax.parseOptions(callback, options)
    ajax.send('GET', url, options)
};

/**
 * Ajax POST method
 * @param url
 * @param data
 * @param callabck
 * @param options
 */
ajax.post = function (url, data, callabck, options) {
    options = ajax.parseOptions(callback, options)
    options.data = data
    ajax.send('POST', url, options)
};


/**
 * Pollyfills
 * @namespace POLLYFILLS
 */


/**
 * Pollyfills for Date
 * @namespace POLLYFILLS.Date
 */


/**
 * Date.now <- Date().getTime
 * @function POLLYFILLS.Date.now
 */
Date.now = Date.now || function now() {
return new Date().getTime();
};


/**
 * Pollyfills for window
 * @namespace POLLYFILLS.window
 */


/**
 * Pollyfill attachEvent (IE < 8)
 * @author https://gist.github.com/jonathantneal/3748027
 * @function POLLYFILLS.window.addEventListener
 */
 /**
 * Pollyfill detachEvent (IE < 8)
 * @author https://gist.github.com/jonathantneal/3748027
 * @function POLLYFILLS.window.removeEventListener
 */
 /**
 * Pollyfill fireEvent (IE < 8)
 * @author https://gist.github.com/jonathantneal/3748027
 * @function POLLYFILLS.window.dispatchEvent
 */
!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
        var target = this;

        registry.unshift([target, type, listener, function (event) {
            event.currentTarget = target;
            event.preventDefault = function () { event.returnValue = false };
            event.stopPropagation = function () { event.cancelBubble = true };
            event.target = event.srcElement || target;

            listener.call(target, event);
        }]);

        this.attachEvent("on" + type, registry[0][3]);
    };

    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
        for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
                return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
        }
    };

    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
        return this.fireEvent("on" + eventObject.type, eventObject);
    };
})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

/**
 * Allows for simple event delegation.  Omitting the delegate target will fire listener
 * for all delegate children.  In either case the event.delegate property is added to the
 * specified event.
 * @param type {string} Event type to listen for.
 * @param target {string} [optional] The element to target for the specified event type.
 * @param listener {function} The function to fire when the target event occurs.
 * @function window.delegateEventListener
 */
(function (WindowPrototype, DocumentPrototype, ElementPrototype, registry) {
    var protoFunc = "delegateEventListener"
    WindowPrototype[protoFunc] = DocumentPrototype[protoFunc] = ElementPrototype[protoFunc] = function (type, target, listener) {
        var delegate = this;

        // Accept listener in lew of target
        if (typeof target == 'function'){
            listener = target
            target = null
        }

        // Add the event.delegate property and check for target
        registry.unshift([delegate, type, listener, function (event) {
            event.delegate = delegate;
            if (! target || isTarget(event, target, event.delegate))
                listener.call(delegate, event);
        }]);

        this.addEventListener(type, registry[0][3])
    };

})(Window.prototype, HTMLDocument.prototype, Element.prototype, []);

/**
 * Pollyfills for String
 * @namespace POLLYFILLS.String
 */

/**
 * Removes leading and trailing white space.
 * >Pollyfill
 * @namespace POLLYFILLS.String.trim
 */
String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
/**
 * Provides string formatting functionality.  Use `%s` for positinal arguments
 * or `{0}` for indexed arguments. Boom!
 * @namespace POLLYFILLS.String.trim
 */
String.prototype.format = function (){
    var val,
        i = 0,
        args = Array.prototype.slice.call(arguments, 0)
    return this.replace(/%s|{(\d+)}/g, function(match, number) {
        number = number || i
        //console.log(args.length + " " + i)
        if(args.length - 1 < i)
            throw(new RangeError('String.format: Not enough arguments were provided.'))
        if( match === '%s') i++
        val = args[number]
        return  val
    })
}


/**
 * Pollyfills for Array
 * @namespace POLLYFILLS.String
 */

/**
 * Returns true if an object is an array, false if it is not.
 * >Pollyfill
 * @namespace POLLYFILLS.String.trim
 */
Array.isArray = Array.isArray || function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';

}

