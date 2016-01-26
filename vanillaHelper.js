/**
 * Created by Simplex Studio, Ltd on 10/11/2015.
 */

//TODO: wrap this up so these are not root vars!
// currently used by debugger only

/**
 * Short cut to create and append a dom element with id, classes, and inner html.
 * This is really sweet because you can create a new button in one line!
 * example: createEle("div", someDomEle , "#btnid .btn .btn-lg button lable &#8615;")
 * @param tag {string} - The elements tag type.
 * @param appendTo {Element} - The DOM element to append the new element to.
 * @param attr {string} - Space separated list of #id .class text to add to innerHtml
 * @returns {Element}
 */
function createEle (tag, appendTo, attr){
    var e = document.createElement(tag)
        appendTo.appendChild(e)

    var attrs = attr.split(" ")

    for (var a in attrs){
        a = attrs[a]
        if (a[0]=="#") e.id = a.slice(1)
        else if (a[0]=="." && !e.className) e.className += a.slice(1)
        else if (a[0]=="." && e.className) e.className += " "+a.slice(1)
        else if  (!e.innerHTML) e.innerHTML = a
        else e.innerHTML += " "+a
    }
    return e

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
 * Tests an if an HTMLElement is in an event path.
 * @param event {Event}
 * @param selector {string}
 * @returns {*}
 */
function isClicked(event, selector){
    for (var i in event.path)
        if (testEleMatch(event.path[i], selector)) return event.path[i]
    return false
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
    if (iterate(ele, cls, hasClass)) return
    if (!(ele && ele.className)) return false
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Adds a class to an HTMLElement
 * @param ele {HTMLElement}
 * @param cls {string}
 */
function addClass(ele,cls) {
    if (iterate(ele, cls, addClass)) return
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
    if (iterate(ele, cls, removeClass)) return
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
 * @returns {boolean}
 */
function toggleClass(ele,cls) {
    if (iterate(ele, cls, toggleClass)) return
    if (!hasClass(ele,cls)) {
        addClass(ele,cls)
        return true
    } else {
        removeClass(ele,cls)
        return false
    }
}
/**
 * Test if an object is an HTMLCollection or NodeList
 * @param ele {HTMLElement}
 * @returns {boolean}
 */
function isHTMLCollection (ele){
    return ele instanceof HTMLCollection || ele instanceof NodeList
}

/**
 * Helper for functions to accept HTMLCollections by iterating over HTMLCollection untill specified
 * element is found. Then executes a callback with the specified element and property.
 *
 * @param ele
 * @param prop
 * @param func
 * @returns {boolean}
 */
function iterate(ele, prop, func) {
    if (isHTMLCollection (ele)) {
        for (var i in ele) {
            if (ele.hasOwnProperty(i))
                if (!ele[i] || !ele[i].tagName){
                    return true
                }else{
                    func(ele[i], prop)
                }
        }
        return true
    }
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
 * Trigger the specified event on the specified target.
 * @param element
 * @param eventName
 * @returns {*}
 */
function triggerEvent(element,eventName, evt) {

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
 * pollyfill: Date.now <- Date().getTime
 * @function Date.now
 */
Date.now = Date.now || function now() {
return new Date().getTime();
};

/**
 * Pollyfill addEventListener , removeEventListener, dispatchEvent
 * @author https://gist.github.com/jonathantneal/3748027
 * @function window.addEventListener
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

