/**
 * Gallery prototype definition
 *
 * @public
 * @param {Element} context Gallery context Element
 * @param {String[]} images Images URLs
 */
var Gallery = function (context, images) {
    "use strict";

    var gallery = this,
        classKey = "class",
        imgKey = "img",
        dotKey = ".",
        blankKey = " ",
        srcKey = "src",
        altKey = "alt",
        prevKey = "previous",
        activeKey = "active",
        nextKey = "next",
        cssActiveX = "--" + activeKey + "-x",
        cssPreviousX = "--" + prevKey + "-x",
        cssNextX = "--" + nextKey + "-x",
        transformKey = "transform",
        styleKey = "style",
        prevQuery = dotKey + prevKey,
        activeQuery = dotKey + activeKey,
        nextQuery = dotKey + nextKey,
        passive = {
            passive: true
        },
        doc = document,
        htmlElm = doc.documentElement,

        /*** Methods ***/

        /**
         * Gets the Style object of an Element
         * 
         * @private
         * @param {Element} elm Element
         * @return {CSSStyleDeclaration} Style object
         */
        getStyles = function(elm) {
            return elm.style;
        },

        /**
         * Queries a Element from the DOM using a CSS Query Selector
         * 
         * @private
         * @param {String} query CSS Query Selector
         * @return {Element} First Element found
         */
        query = function(query) {
            return context.querySelector(query);
        },

        /**
         * Queries many Elements from the DOM using a CSS Query Selector
         * 
         * @private
         * @param {String} query CSS Query Selector
         * @return {Element[]} Elements
         */
        queryAll = function(query) {
            return context.querySelectorAll(query);
        },

        /**
         * Sets a value to an Attribute of an Element
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} attr Attribute's name
         * @param {String} value Value to set
         */
        setAttr = function(elm, attr, value) {
            elm.setAttribute(attr, value);
        },

        /**
         * Gets an Attribute value from an Element
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} attr Attribute's name
         * @return {Any} Attribute's value
         */
        getAttr = function(elm, attr) {
            return elm.getAttribute(attr);
        },

        /**
         * Removes the value of an Element's Attribute
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} attr Attribute's name
         */
        removeAttr = function(elm, attr) {
            elm.removeAttribute(attr);
        },

        /**
         * Creates an Element
         * 
         * @private
         * @param {String} tag Element Tag
         * @return {Element} Element
         */
        createElm = function(tag) {
            return document.createElement(tag);
        },

        /**
         * Sets a Z Index value to an Element
         * 
         * @private
         * @param {Element} elm Element
         * @param {Number} z Z value
         */
        setZ = function(elm, z) {
            getStyles(elm).zIndex = z;
        },

        /**
         * Replaces the first matching criteria found
         * on a string with a given value
         * 
         * @private
         * @param {String} strTo String to replace
         * @param {String | RegExp} match Match criteria
         * @param {String} val Value to set
         * @return {String} String replaced
         */
        replace = function(strTo, match, val) {
            return strTo.replace(match, val);
        },

        /**
         * Checks if a given element contains a class
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} className Class name to find
         * @return {Boolean} Result
         */
        hasClass = function(elm, className) {
            return elm.classList.contains(className);
        },

        /**
         * Inserts an Element relative to another using a given position
         * 
         * @private
         * @param {Element} nElm Element to insert
         * @param {String} pos Position to use
         * @param {Element} ref Reference Element
         */
        insertAt = function(nElm, pos, ref) {
            ref.insertAdjacentElement(pos, nElm);
        },

        /**
         * Adds a class name to an Element
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} className Class name to find
         */
        addClass = function(elm, className) {
            elm.classList.add(className);
        },

        /**
         * Deletes a class name in an Element
         * 
         * @private
         * @param {Element} elm Element
         * @param {String} className Class name to find
         */
        delClass = function(elm, className) {
            elm.classList.remove(className);
        },

        /**
         * Adds a Event Listener to an Element
         * 
         * @private
         * @param {Element | Element[]} elm Element
         * @param {String} eventName Event's name
         * @param {Function} fn Function to execute each time the event is triggered
         * @param {any} options Add Event Listener method available options (See Mozilla Developers Documentation for more info.)
         */
        addEvent = function(elm, eventName, fn, options) {
            if (!Array.isArray(elm)) {
                elm.addEventListener(eventName, fn, options);
                return;
            }
            elm.forEach(function(e) {
                e.addEventListener(eventName, fn, options);
            });
        },

        /**
         * Requests the browser to wait for the execution of a Function to repaint the screen again
         * this avoids extra recalculation of styles for the browser when many visual properties are
         * affected simultaneously
         * 
         * @private
         * @param {Function} fn Function to wait         
         */
        reqFrame = function(fn) {
            requestAnimationFrame(fn);
        },

        /**
         * Gets the Touch object from a TouchEvent object
         * 
         * @private
         * @param {TouchEvent} event TouchEvent
         * @return {Touch} Touch
         */
        getTouch = function(event) {
            return event.touches[0] || event.changedTouches[0];
        },

        /**
         * Gets the Id of a Touch
         * 
         * @private
         * @param {Touch} touch Touch
         * @return {Number} Id
         */
        getTouchId = function(touch) {
            return touch.identifier;
        },

        /**
         * Gets the Touch's X value
         * 
         * @private
         * @param {Touch} touch Touch
         * @return {Number} X value
         */
        getTouchX = function(touch) {
            return touch.screenX;
        },

        /**
         * Gets the Width of an Image
         * 
         * @private
         * @param {Image} img Image
         * @return {Number} Width
         */
        getImgWidth = function(img) {
            return img.width || img.offsetWidth;
        },

        /**
         * Sets an X value to an Image
         * 
         * @private
         * @param {Image} img Image
         * @param {Number} x X value
         */
        setImgX = function(img, x) {
            getStyles(img).transform = "translateX(" + x + "px) translateY(-50%)";
        },

        /**
         * Gets the X value of an Image
         * 
         * @private
         * @param {Image} img Image
         * @return {Number} X value
         */
        getImgX = function(img) {
            if (getStyles(img).transform) {
                var match = getStyles(img).transform.match(/-?\d+/);
                return match[0] ? parseFloat(match[0]) : 0;
            }
            return 0;
        },

        /**
         * Sets the Overlapping priority of the Gallery images
         * 
         * @private         
         * @param {Image} prev Previous Image
         * @param {Image} next Next Image
         * @param {Boolean} positive If positive the Previous Image is going to be under the Next otherwise the opposite
         */
        setOverlap = function(prev, next, positive) {
            setZ(prev, positive ? 1 : 3);
            setZ(next, positive ? 3 : 1);
        },

        /**
         * Sets the Next Image above the Previous Image
         * 
         * @private
         * @param {Image} prevImg Previous Image
         * @param {Image} nextImg Next Image
         */
        setNextOverlap = function(prevImg, nextImg) {
            setOverlap(prevImg, nextImg, true);
        },

        /**
         * Gets the undefined literal value
         * 
         * @private
         * @return {undefined} undefined
         */
        getUndefined = function() {
            return void 0;
        },

        /**
         * Checks if a given variable is undefined
         * 
         * @private
         * @param {Any} variable Variable to check
         * @return {Boolean} Result
         */
        isUndefined = function(variable) {
            return variable === getUndefined();
        },

        /**
         * Sets the Previous Image above the Next Image
         * 
         * @private
         * @param {Image} prevImg Previous Image
         * @param {Image} nextImg Next Image
         */
        setPrevOverlap = function(prevImg, nextImg) {
            setOverlap(prevImg, nextImg, false);
        },

        /**
         * Sets the animation time of an Image
         * 
         * @private
         * @param {Image} img Image
         * @param {String} attr Attribute to animate
         * @param {Number} seconds Time in seconds
         */
        setAnimationTime = function(img, attr, seconds) {
            getStyles(img).transition = attr + blankKey + seconds + "s";
        },

        /**
         * Sets the X movement animation time of the Gallery images
         * 
         * @private
         * @param {Number} seconds Time in Seconds         
         */
        setXAnimationTime = function(seconds) {
            setAnimationTime(query(prevQuery), transformKey, seconds);
            setAnimationTime(query(activeQuery), transformKey, seconds);
            setAnimationTime(query(nextQuery), transformKey, seconds);
        },

        /**
         * Checks if the given image element is instance of the native Image prototype
         *
         * @param  {Image | HTMLDivElement} img Image Element
         * @return {Boolean} Result
         */
        isImage = function(img) {
            return (img instanceof Image);
        },

        /**
         * Gets the associated image of an image
         *
         * @param {Image | HTMLDivElement} imgElm Image Element
         * @return {Image | HTMLDivElement} Associated Image
         */
        getAssociatedImage = function(imgElm) {
            return imgElm[(isImage(imgElm) ? "spherical" : "regular") + "Image"];
        },

        /**
         * Check is the Gallery image in the index
         * is of the needed type in order to change it
         * 
         * @private
         * @param {Image | HTMLDivElement} imgElm Image Element
         * @param {Number} index Gallery Index to check
         * @return {Image | HTMLDivElement} Image Element
         */
        tryToggleImageType = function(imgElm, index) {
            var image = gallery.images[index];
            if (isImage(imgElm) && !image.isSpherical) return imgElm;
            if (hasClass(imgElm, "o-viewer") && image.isSpherical) return imgElm;
            var newImage = getAssociatedImage(imgElm);
            imgElm.parentNode.replaceChild(newImage, imgElm);
            return newImage;
        },

        /**
         * Sets the source to a regular Image or an Spherical Image
         * 
         * @private
         * @param {Image | HTMLDivElement} imgElm Image Element
         * @param {String} src Source
         */
        setSrc = function(imgElm, src) {
            setAttr(imgElm, (isImage(imgElm) ? "" : "data-") + srcKey, src);
        },

        /**
         * Sets the alternative text or title to a regular Image or an Spherical Image
         * 
         * @private
         * @param {Image | HTMLDivElement} imgElm Image Element
         * @param {String} alt Alt text
         */
        setAlt = function(imgElm, alt) {
            setAttr(imgElm, (isImage(imgElm) ? altKey : "title"), alt);
        },

        /**
         * Moves the Gallery to the Next image
         * 
         * @private
         * @param {Image | HTMLDivElement} prevImg Previous Image
         * @param {Image | HTMLDivElement} activeImg Active Image         
         * @param {Image | HTMLDivElement} nextImg Next Image
         */
        goNext = function(prevImg, activeImg, nextImg) {
            var images = gallery.images;
            index = ((index + 1) === images.length) ? 0 : (index + 1); // Update Index

            /**
             * Clean Previous image src since it will become the Next image
             * else when changing it to Next image it won't update
             * its look until the new image has been loaded
             */
            if (isImage(prevImg)) {
                setAttr(prevImg, srcKey, "");
            }

            /**
             * Change the Previous image to become the Next image
             */
            var newNextIndex = ((index + 1) === images.length) ? 0 : (index + 1);

            prevImg = tryToggleImageType(prevImg, newNextIndex);

            setSrc(prevImg, images[newNextIndex].url);
            setAlt(prevImg, images[newNextIndex].alt);

            /**
             * Update images relations
             * Current Next -> New Active
             * Current Active -> New Previous
             * Current Previous -> New Next
             */
            setAttr(nextImg, classKey, replace(getAttr(nextImg, classKey), nextKey, activeKey));
            setAttr(activeImg, classKey, replace(getAttr(activeImg, classKey), activeKey, prevKey));
            setAttr(prevImg, classKey, replace(getAttr(prevImg, classKey), prevKey, nextKey));
            setAttr(prevImg, classKey, replace(getAttr(prevImg, classKey), activeKey, nextKey));

            onChange(index, images[index]); // Run onChange event
        },

        /**
         * Moves the Gallery to the Previous image
         * 
         * @private
         * @param {Image | HTMLDivElement} prevImg Previous Image
         * @param {Image | HTMLDivElement} activeImg Active Image         
         * @param {Image | HTMLDivElement} nextImg Next Image
         */
        goPrev = function(prevImg, activeImg, nextImg) {
            var images = gallery.images;
            index = index - 1 < 0 ? images.length - 1 : index - 1; // Update Index

            /**
             * Clean Next image src since it will become the Previous image
             * else when changing it to Previous image it won't update
             * its look until the new image has been loaded
             */
            if (isImage(prevImg)) {
                setAttr(nextImg, srcKey, "");
            }

            /**
             * Change the Next image to become the Previous image
             */
            var newPrevIndex = index - 1 < 0 ? images.length - 1 : index - 1;

            nextImg = tryToggleImageType(nextImg, newPrevIndex);

            setSrc(nextImg, images[newPrevIndex].url);
            setAlt(nextImg, images[newPrevIndex].alt);

            /**
             * Update images relations
             * Current Previous -> New Active
             * Current Active ->New Next
             * Current Next -> New Previous
             */
            setAttr(prevImg, classKey, replace(getAttr(prevImg, classKey), prevKey, activeKey));
            setAttr(activeImg, classKey, replace(getAttr(activeImg, classKey), activeKey, nextKey));
            setAttr(nextImg, classKey, replace(getAttr(nextImg, classKey), nextKey, prevKey));
            setAttr(nextImg, classKey, replace(getAttr(nextImg, classKey), activeKey, prevKey));

            onChange(index, images[index]); // Run onChange event
        },

        /**
         * Sets the touchId property if this is undefined
         * using the Touch of a TouchEvent and reduces
         * the animation time of the Gallery to the minimum possible value
         * 
         * @private
         * @param {TouchEvent} event TouchEvent         
         */
        registerTouch = function(event) {
            if (!(isUndefined(touchId) && isUndefined(lastX) && touches === 0) || changeRunning) return;
            touches++;
            var touch = getTouch(event);
            touchId = getTouchId(touch);
            lastX = getTouchX(touch);
            setXAnimationTime(0.000001);
        },

        /**
         * Executes a go Function a certain amount of times
         * 
         * @private         
         * @param {Function} goFn Go Function
         * @param {Number} times Times to repeat
         */
        go = function(goFn, times) {
            if (isUndefined(times) || isNaN(times)) {
                times = 1;
            }
            goFn(query(prevQuery), query(activeQuery), query(nextQuery));
            times--;
            if (times) {
                setTimeout(function() {
                        go(goFn, times);
                    },
                    500);
            }
        },

        /**
         * Defines a property to an Object
         * 
         * @private         
         * @param {String} propName Property name
         * @param {Function} getter Getter function
         * @param {Function} setter Setter function
         */
        defineProp = function(propName, getter, setter) {
            Object.defineProperty(gallery,
                propName,
                {
                    get: getter,
                    set: setter
                });
        },

        /**
         * Checks if the gallery has any Spherical Image
         * 
         * @private
         * @return {Boolean} Result
         */
        hasSphericalImages = function() {
            return !!gallery.images.find(function(img) {
                return img.isSpherical === true;
            });
        },

        /**
         * Loads Spherical Images Resources
         *
         * @param {Function} callback Function to execute when the resources are loaded
         */
        loadSphericalResourcesForDesktop = function(callback) {
            // Append CSS
            var css = createElm("link");
            var script = createElm("script");
            setAttr(css, "rel", "stylesheet");
            setAttr(css, "href", window.resourceDomain + "/GlobalResources14/Require/css/pwa/default/0_oViewer.css");
            setAttr(script, srcKey, window.resourceDomain + "/GlobalResources14/Require/js/min/modules/oViewer.js");
            insertAt(css, "beforeend", htmlElm);
            insertAt(script, "beforeend", htmlElm);
            script.onload = callback;
        },

        cleanStyles = function() {
            for (var i = 0; i < arguments.length; i++) {
                removeAttr(arguments[i], styleKey);
            }
        },
        setCssVar = function(cssVarName, value) {
            getStyles(htmlElm).setProperty(cssVarName, value);
        };


    var index = 0,        
        touches = 0,
        touchId = getUndefined(),
        changeRunning = !1,
        lastX = getUndefined(),
        onChange = function(){};

    gallery.images = images;

    (function () {

        /*** Events Binding ***/
        var bindEvents = function () {

            /*** Controls Events Binding ***/
            queryAll(".control").forEach(function (control) {
                addEvent(control, "click", function () {
                    /**
                     * If There's any touch hold or a image change running do nothing
                     */
                    if (!isUndefined(touchId) || changeRunning) return;
                    var previousImg = query(prevQuery),
                        activeImg = query(activeQuery),
                        nextImg = query(nextQuery);

                    /**
                     * Change Visual properties in a Request Animation Frame callback
                     * to wait until all the visual properties has been changed to
                     * let the browser perform a paint
                     */
                    reqFrame(function () {
                        removeAttr(previousImg, styleKey);
                        removeAttr(activeImg, styleKey);
                        removeAttr(nextImg, styleKey);
                        (!hasClass(control, nextKey) ?
                            setPrevOverlap(activeImg, previousImg) :
                            setNextOverlap(nextImg, activeImg));
                        if (hasClass(control, nextKey)) {
                            goNext(previousImg, activeImg, nextImg);
                        } else if (hasClass(control, prevKey)) {
                            goPrev(previousImg, activeImg, nextImg);
                        }
                    });

                    /**
                     * Block change execution while the animation is being performed
                     * so that the images do not overlap each other
                     */
                    changeRunning = true;
                    setTimeout(function () {
                        changeRunning = false;
                    }, 500);

                });
            });

            /*** Touch Events Binding ***/
            queryAll("img.active,img.previous,img.next,.o-viewer.active,.o-viewer.previous,.o-viewer.next").forEach(function (img) {
                var imageElements = [img];
                if (hasSphericalImages()) {
                    var associated = getAssociatedImage(img);
                    associated = isImage(associated) ? associated : associated.querySelector(".o-viewer-cover");
                    imageElements.push(associated);
                }                

                /*** Touch Registration Handler ***/
                addEvent(imageElements, "touchstart", registerTouch, passive);

                /*** Touch Movement Handler ***/
                addEvent(imageElements, "touchmove", function (event) {
                    event.preventDefault();
                    if (changeRunning) return;
                    /**                  
                     * If the "touchmove" event is triggered before the "touchstart"
                     * register the event's touch
                     */
                    if (isUndefined(touchId) || isUndefined(lastX)) return registerTouch(event);

                    var touch = getTouch(event);

                    /**
                     * Check for the touch Id to avoid multitouch issues
                     */
                    if (touchId !== getTouchId(touch)) return;                    

                    /**
                     * Calculate touch move measure
                     */
                    var newX = getTouchX(touch),
                        diff = lastX - newX,
                        prevImg = query(prevQuery),
                        activeImg = query(activeQuery),
                        nextImg = query(nextQuery),
                        activeWidth = getImgWidth(activeImg),
                        prevX = getImgX(prevImg) || activeWidth * -1,
                        activeX = getImgX(activeImg),
                        nextX = getImgX(nextImg) || activeWidth,
                        tDiff = activeX - diff; // Total difference: Total movement of the left image edge

                    lastX = newX; // Overwrite Last X value with the Nex X value

                    /**
                     * If the Total difference is greater the the width of the
                     * active image, using 25px as margin, lock the gallery movement
                     */
                    if (Math.abs(tDiff) > (activeWidth - 25)) return;

                    /**
                     * Perform the follow touch movement, await until the X values of
                     * the images has been updated to let the browser paint the screen                 
                     */
                    reqFrame(function () {
                        setImgX(prevImg, prevX - diff);
                        setImgX(activeImg, tDiff);
                        setImgX(nextImg, nextX - diff);
                        //addClass(context, "swiping");
                    });

                },{passive:false});

                /*** Touch End Handler ***/
                addEvent(imageElements, "touchend", function (event) {
                    if (changeRunning) return;
                    touches--;

                    var touch = getTouch(event);

                    /**
                     * If the touch Id of the leaving touch is the
                     * same of the registered touch, continue.
                     * If the touches are greater than 0 do nothing.
                     */
                    if (touchId !== getTouchId(touch) || touches > 0) return;

                    /**
                     * Clean the variables
                     */
                    touchId = getUndefined();
                    lastX = getUndefined();

                    var prevImg = query(prevQuery),
                        activeImg = query(activeQuery),
                        nextImg = query(nextQuery),
                        activeX = getImgX(activeImg),
                        prevX = getImgX(prevImg),
                        nextX = getImgX(nextImg),
                        activeWidth = getImgWidth(activeImg);

                    /**
                     * Perform the animation after touch left, but await until the Functions
                     * has been executed to let the browser paint the screen again
                     */
                    reqFrame(function () {                        
                        /**
                         * If the X value of the active image is greater than
                         * the eighth part of the full active image width, perform the change
                         * according to the symbol(+/-) of the active image's X value
                         */
                        setCssVar(cssActiveX, activeX+"px");
                        setCssVar(cssPreviousX, prevX+"px");
                        setCssVar(cssNextX, nextX+"px");

                        if (Math.abs(activeX) > (activeWidth / 8)) {
                            setXAnimationTime(0.5);
                            if (activeX < 0) {
                                setNextOverlap(nextImg, activeImg);
                                setImgX(nextImg, 0);
                                setImgX(activeImg, activeWidth * -1);
                                setAnimationTime(prevImg, transformKey, 0);
                                setImgX(prevImg, activeWidth);
                                setTimeout(function() {
                                    goNext(prevImg, activeImg, nextImg);
                                    cleanStyles(prevImg, activeImg, nextImg);                                    
                                }, 500);
                            } else {
                                setPrevOverlap(activeImg, prevImg);
                                setImgX(prevImg, 0);
                                setImgX(activeImg, activeWidth);
                                setAnimationTime(nextImg, transformKey, 0);
                                setImgX(nextImg, activeWidth * -1);
                                setTimeout(function() {
                                    goPrev(prevImg, activeImg, nextImg);
                                    cleanStyles(prevImg, activeImg, nextImg);
                                }, 500);
                            }
                        } else {
                            setXAnimationTime(0.3);
                            setImgX(nextImg, activeWidth);
                            setImgX(activeImg, 0);                            
                            setImgX(prevImg, activeWidth * -1);
                            setTimeout(function () {                 
                                cleanStyles(prevImg, activeImg, nextImg);
                            }, 300);
                        }  

                        setCssVar(cssActiveX, "0%");
                        setCssVar(cssPreviousX, "-100%");
                        setCssVar(cssNextX, "100%");

                    });

                    changeRunning = true;
                    setTimeout(function () {
                        changeRunning = false;
                    }, 500);

                }, passive);
            });
        };

        /*** Gallery Initialization ***/
        (function () {
            var images = gallery.images,
                active = query(imgKey),
                /*** Creation of the Auxiliary images ***/
                previous = createElm(imgKey),
                next = createElm(imgKey),
                currentSrc = getAttr(active, srcKey),
                hasSpherical = hasSphericalImages();

            var nextIndex;
            var prevIndex;

            /*** Images Set Up ***/
            addClass(active, activeKey);
            addClass(previous, prevKey);
            addClass(next, nextKey);

            /*** Index initialization is based on the image already loaded ***/
            index = images.findIndex(function (img) {
                return img.url === currentSrc;
            });

            if (images.length > 2) {
                nextIndex = index + 1 === images.length ? 0 : index + 1;
                prevIndex = index - 1 < 0 ? images.length - 1 : index - 1;
            } else {
                nextIndex = images.length === 1 ? 0 : 1;
                prevIndex = images.length === 1 ? 0 : 1;
            }

            if (!hasSpherical) {
                /*** Images DOM Insertion ***/
                setSrc(next, images[nextIndex].url);
                setAlt(next, images[nextIndex].alt);

                setSrc(previous, images[prevIndex].url);
                setAlt(previous, images[prevIndex].alt);                

                insertAt(previous, "beforebegin", active);
                insertAt(next, "afterend", active);

                bindEvents();
            } else {
                loadSphericalResourcesForDesktop(function () {
                    var options = {
                            width: 0,
                            height: 0,
                            container: createElm("div")
                        },
                        activeSpherical = oViewer.render(createElm(imgKey), options).element,
                        previousSpherical = oViewer.render(createElm(imgKey), options).element,
                        nextSpherical = oViewer.render(createElm(imgKey), options).element,
                        previousToPaint = images[prevIndex].isSpherical ? previousSpherical : previous,
                        nextToPaint = images[nextIndex].isSpherical ? nextSpherical : next;

                    addClass(activeSpherical, activeKey);
                    addClass(previousSpherical, prevKey);
                    addClass(nextSpherical, nextKey);

                    /*** Set Up References ***/
                    active.sphericalImage = activeSpherical;
                    previous.sphericalImage = previousSpherical;
                    next.sphericalImage = nextSpherical;

                    activeSpherical.regularImage = active;
                    previousSpherical.regularImage = previous;
                    nextSpherical.regularImage = next;

                    /*** Set Up Src and Alt ***/
                    setSrc(nextToPaint, images[nextIndex].url);
                    setAlt(nextToPaint, images[nextIndex].alt);

                    setSrc(previousToPaint, images[prevIndex].url);
                    setAlt(previousToPaint, images[prevIndex].alt);                    

                    insertAt(nextToPaint, "beforebegin", active);
                    insertAt(previousToPaint, "afterend", active);
                    tryToggleImageType(active, index);

                    bindEvents();
                });
            }
        })();
    })();

    /**
     * Goes to the next image
     * 
     * @public
     * @readonly          
     * @param {Number} times Times to repeat
     */
    defineProp("goNext", function () {
        return function (times) {
            go(goNext, times);
        };
    });

    /**
     * Goes to the previous Image
     * 
     * @public
     * @readonly
     * @param {Number} times Times to repeat
     */
    defineProp("goPrev", function () {
        return function (times) {
            go(goPrev, times);
        };
    });

    /**
     * Gets the index of the Gallery
     * 
     * @public
     * @readonly
     */
    defineProp("index", function () {
        return index;
    });

    /**
     * Has Spherical Images result
     * 
     * @public
     * @readonly
     */
    defineProp("hasSphericalImages", function () {
        return hasSphericalImages();
    });

    /**
     * Function to trigger each time the Gallery changes
     * 
     * @public
     */
    defineProp("onChange",
        function () {
            return onChange;
        },
        function (value) {
            if (value instanceof Function) {
                onChange = value;
            }
        }
    );
};