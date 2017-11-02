/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	__webpack_require__(5);

	__webpack_require__(10);

	__webpack_require__(11);

	__webpack_require__(12);

	__webpack_require__(13);

	__webpack_require__(14);

	__webpack_require__(28);

	__webpack_require__(20);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/_css-loader@0.25.0@css-loader/index.js!./reset.css", function() {
				var newContent = require("!!../node_modules/_css-loader@0.25.0@css-loader/index.js!./reset.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/* v2.0 | 20110126\n  http://meyerweb.com/eric/tools/css/reset/ \n  License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\na,img,button,input,textarea,p,span{-webkit-tap-highlight-color: rgba(0,0,0,0);}\nhtml{-webkit-tap-highlight-color: rgba(0,0,0,0);}\ninput,textarea,a,p{-webkit-appearance:none;}", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = function () {
		var list = [];

		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];

				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/_css-loader@0.25.0@css-loader/index.js!./style.css", function() {
				var newContent = require("!!../node_modules/_css-loader@0.25.0@css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	exports.i(__webpack_require__(7), "");
	exports.i(__webpack_require__(8), "");
	exports.i(__webpack_require__(9), "");

	// module
	exports.push([module.id, "\r\n\r\n\r\n\r\n\r\n", ""]);

	// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "html, body{\r\n    height: 100%;\r\n    width: 100%;\r\n}\r\n\r\n#zmap{\r\n    position: absolute!important;\r\n    /*left: 0;*/\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.typhoon_icon{\r\n    border: none;\r\n    background: none;\r\n    top: -9px;\r\n    left: -9px;\r\n}\r\n\r\n.rotate_ani {\r\n    -webkit-animation: rotate_ani 1s infinite linear;\r\n    -moz-animation: rotate_ani 1s infinite linear;\r\n    -o-animation: rotate_ani 1s infinite linear;\r\n    -ms-animation: rotate_ani 1s infinite linear;\r\n}\r\n.positive_rotate_ani {\r\n     -webkit-animation: positive_rotate_ani 1s infinite linear;\r\n     -moz-animation: positive_rotate_ani 1s infinite linear;\r\n     -o-animation: positive_rotate_ani 1s infinite linear;\r\n     -ms-animation: positive_rotate_ani 1s infinite linear;\r\n}\r\n\r\n@-webkit-keyframes rotate_ani{\r\n    0%{\r\n        -webkit-transform: rotate(0deg);\r\n        -moz-transform: rotate(0deg);\r\n        -o-transform: rotate(0deg);\r\n        -ms-transform: rotate(0deg);\r\n    }\r\n    50%{\r\n        -webkit-transform: rotate(-180deg);\r\n        -moz-transform: rotate(-180deg);\r\n        -o-transform: rotate(-180deg);\r\n        -ms-transform: rotate(-180deg);\r\n    }\r\n    100%{\r\n        -webkit-transform: rotate(-360deg);\r\n        -moz-transform: rotate(-360deg);\r\n        -o-transform: rotate(-360deg);\r\n        -ms-transform: rotate(-360deg);\r\n    }\r\n}\r\n@-webkit-keyframes positive_rotate_ani{\r\n    0%{\r\n        -webkit-transform: rotate(0deg);\r\n        -moz-transform: rotate(0deg);\r\n        -o-transform: rotate(0deg);\r\n        -ms-transform: rotate(0deg);\r\n    }\r\n    50%{\r\n        -webkit-transform: rotate(180deg);\r\n        -moz-transform: rotate(180deg);\r\n        -o-transform: rotate(180deg);\r\n        -ms-transform: rotate(180deg);\r\n    }\r\n    100%{\r\n        -webkit-transform: rotate(360deg);\r\n        -moz-transform: rotate(360deg);\r\n        -o-transform: rotate(360deg);\r\n        -ms-transform: rotate(360deg);\r\n    }\r\n}", ""]);

	// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/*初始化*/\r\nhtml, body, div{\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\nhtml{\r\n    font-size: 16px;\r\n}\r\n\r\nbody{\r\n    overflow: hidden;\r\n    position: absolute;\r\n}\r\n\r\nul{\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n", ""]);

	// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ty-name {\r\n    width: auto !important;\r\n    height: auto !important;\r\n    z-index: 1000 !important;\r\n}\r\n\r\n.ty-name div {\r\n    background: rgba(255, 255, 255, .6);\r\n    border: solid black 1px;\r\n    text-align: center;\r\n    font-size: 14px;\r\n    white-space: nowrap;\r\n    position: relative;\r\n    border-radius: 3px;\r\n    left: 20px;\r\n    padding: 0 .5rem;\r\n    margin-top: -7px;\r\n}\r\n\r\n.ty-name p {\r\n    padding: 0;\r\n    margin: 0 !important;\r\n}\r\n\r\n.ty-name span:first-of-type {\r\n    position: absolute;\r\n    left: -6px;\r\n    top: 7px;\r\n    background: rgba(255, 255, 255, .6);\r\n    width: 10px;\r\n    height: 10px;\r\n    border: solid 1px black;\r\n    border-top: transparent;\r\n    border-right: transparent;\r\n    transform: rotate(45deg);\r\n    -webkit-transform: rotate(45deg);\r\n    -moz-transform: rotate(45deg);\r\n    -o-transform: rotate(45deg);\r\n    -ms-transform: rotate(45deg);\r\n}\r\n\r\n.ty-name span:last-of-type {\r\n    width: 100%;\r\n    display: block;\r\n    padding: .1rem 0;\r\n    white-space: nowrap;\r\n}\r\n\r\n.ty-popup {\r\n    padding: .5rem;\r\n    z-index: 0 !important;\r\n}\r\n\r\n.ty-popup section {\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n    /*font-size: 14px;*/\r\n    position: relative;\r\n    text-align: center;\r\n    right: 0.6rem;\r\n}\r\n\r\n.bgLeft {\r\n    width: 5.0789rem;\r\n    height: 4.48;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fff;\r\n    border-radius: 6px;\r\n}\r\n\r\n.bgLeftInt {\r\n    width: 2.6842rem;\r\n    height: 4.48rem;\r\n    background: linear-gradient(left, #4bcfab, #5bc1da);\r\n    background: -webkit-linear-gradient(left, #4bcfab, #5bc1da);\r\n    background: -o-linear-gradient(left, #4bcfab, #5bc1da);\r\n    background: -moz-linear-gradient(left, #4bcfab, #5bc1da);\r\n    background: -ms-linear-gradient(left, #4bcfab, #5bc1da);\r\n    \r\n    /* 标准的语法 */\r\n}\r\n\r\n.ty-popup ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n    position: relative;\r\n    z-index: 2;\r\n}\r\n\r\n.ty-popup header {\r\n    text-align: center;\r\n    background: #17b4a0;\r\n    padding: .5rem 0;\r\n    color: white;\r\n    font-weight: bolder;\r\n    letter-spacing: 1px;\r\n}\r\n\r\n.ty-popup ul li {\r\n    text-align: center;\r\n    white-space: nowrap;\r\n}\r\n\r\n.ty-popup ul li span {\r\n    width: 60%;\r\n    padding-left: 0.266667rem;\r\n    display: inline-block;\r\n    white-space: nowrap;\r\n}\r\n\r\n.ty-popup ul li span:first-of-type {\r\n    height: 0.56rem;\r\n    line-height: 0.56rem;\r\n    width: 2.47rem;\r\n    display: inline-block;\r\n    color: #f2f3f8;\r\n    font-size: 0.373333rem;\r\n    text-align: left;\r\n    /*background:-webkit-linear-gradient(left,#4bcfab, #5bc1da); \r\n    background: -o-linear-gradient(left,#4bcfab, #5bc1da); \r\n    background: -moz-linear-gradient(left,#4bcfab, #5bc1da); \r\n    background: linear-gradient(left,#4bcfab, #5bc1da); */\r\n}\r\n\r\n.ty-popup ul li:first-of-type span:first-of-type {\r\n    padding-top: 0.266667rem;\r\n}\r\n\r\n.ty-popup ul li:first-of-type span:nth-child(2) {\r\n    padding-top: 0.266667rem;\r\n}\r\n\r\n.ty-popup ul li:last-of-type span:first-of-type {\r\n    padding-bottom: 0.266667rem;\r\n}\r\n\r\n.ty-popup ul li:last-of-type span:nth-child(2) {\r\n    padding-bottom: 0.266667rem;\r\n}\r\n\r\n.ty-popup ul li span:nth-child(2) {\r\n    height: 0.56rem;\r\n    line-height: 0.56rem;\r\n    width: 2.47rem;\r\n    display: inline-block;\r\n    color: #1c1c1c;\r\n    /*background-color:#fff;*/\r\n    font-size: 0.373333rem;\r\n    text-align: left;\r\n}\r\n\r\n.ty-popup .leaflet-popup-content-wrapper {\r\n    margin: 0 !important;\r\n    background: transparent;\r\n    box-shadow: none;\r\n}\r\n\r\n.ty-popup .leaflet-popup-content-wrapper .leaflet-popup-content {\r\n    margin: 0 !important;\r\n    background: transparent;\r\n    position: relative;\r\n}\r\n\r\n.ty-popup .leaflet-popup-tip-container {\r\n    position: relative;\r\n    top: -2px;\r\n}\r\n\r\n.rain-popup p {\r\n    margin: .25rem 0;\r\n    text-align: center;\r\n}\r\n\r\n.rain-popup .leaflet-popup-content {\r\n    margin: 0 .25rem;\r\n}", ""]);

	// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	Date.prototype.Format = function (f, s, _f) {
	  if (s) this.Parse(s, _f);
	  var o = {
	    "M+": this.getMonth() + 1,
	    "d+": this.getDate(),
	    "H+": this.getHours(),
	    "m+": this.getMinutes(),
	    "s+": this.getSeconds(),
	    "q+": Math.floor((this.getMonth() + 3) / 3),
	    "S": this.getMilliseconds() };
	  var fmt = f ? f : 'yyyy-MM-dd HH:mm:ss';
	  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	  for (var k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	  }return fmt;
	};

	Date.prototype.Parse = function (s, f) {
	  if (!s) return null;
	  var df = "yMdHmsS",
	      dt = [this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()];
	  var vals = s.replace(/(^[^0-9]+|[^0-9]+$)/g, "").split(/[^0-9]+/g);
	  f = f ? f : df;
	  var fs = f.match(/(y+|M+|d+|H+|m+|s+|S)/g);
	  for (var i = 0; i < fs.length; i++) {
	    var c = fs[i].charAt(0);
	    var index = df.indexOf(c);
	    if (index >= 0 && vals[i] != undefined) dt[index] = index == 1 ? vals[i] - 1 : vals[i];
	  }
	  this.setTime(Date.UTC.apply(null, dt) + this.getTimezoneOffset() * 60000);
	  return this;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";

	window.map = L.map('zmap', {
	    crs: L.CRS.EPSG900913,
	    attributionControl: false,
	    renderer: L.svg(),
	    zoomControl: false }).setView([23, 113], 5);

	var layerOpts = {
	    subdomains: [1, 2, 3],
	    maxZoom: 17,
	    minZoom: 3
	};

	var layers = {
	    terLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=p&x={x}&y={y}&z={z}", layerOpts),
	    satLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=y&x={x}&y={y}&z={z}", layerOpts),
	    busLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=m&x={x}&y={y}&z={z}", layerOpts)
	};

	layers.satLayer.addTo(map);
	window.areaRenderer = L.svg();
	areaRenderer.addTo(map);
	window.waveRenderer = L.svg();
	waveRenderer.addTo(map);

	$('.mapImg span').on('click', function (e) {
	    e.stopPropagation();
	    if ($(this).hasClass('layer-selected')) return;
	    var beforeId = $('.mapImg .layer-selected').attr('id');
	    var currentLayer = $(this).attr('id');
	    layers[currentLayer].addTo(map);
	    map.removeLayer(layers[beforeId]);
	    changeWindColor(currentLayer);
	    $(this).addClass('layer-selected').siblings().removeClass('layer-selected');
	});

	var changeWindColor = function changeWindColor(type) {
	    if (!$('.actualWind').hasClass('on')) return;
	    var color = type === 'satLayer' ? '#eee' : '#444';
	    $('.wind_veltop, .wind_velbot').css('color', color);
	};

	map.on('zoomend', function () {
	    var zoom = map._zoom;
	    var $target = $('.distance-iconOne,.distance-iconTwo,.distance-iconThree,.areaBoundary,.wind_veltop,.wind_velbot,.buoyLabel');
	    if (zoom < 5) $target.hide();else $target.show();
	});

	var hidePopup = function hidePopup() {
	    $('#tyswNav>ul>li.a').click();
	    var $mapLayerBtn = $('.cloudMap ul li').eq(1).find('img');
	    if ($mapLayerBtn.hasClass('on')) $mapLayerBtn.click();
	    if ($('.imgEx').hasClass('on')) $('.imgEx').click();
	};
	map.addEventListener('movestart', hidePopup);
	map.addEventListener('click', hidePopup);

	var initOceanTIme = function initOceanTIme() {
	    var today = Date.now();
	    var html = '';
	    for (var i = 1; i < 8; i++) {
	        var date = today + i * 24 * 60 * 60 * 1000;
	        html += "<li class=\"typhoonSeawave_ocean\" leadtime=" + i * 24 + "><div class=\"oceanSeawave_div\"><p>" + new Date(date).Format('dd') + "\u65E5</p></div></li>";
	    }
	    $(".oceanPreUl").append(html);
	    $('.oceanPreUl li').eq(0).children('div').addClass('ocean_active');
	};
	initOceanTIme();

	L.polyline([[35, 120], [35, 150], [0, 150], [0, 140]], {
	    color: 'red',
	    dashArray: [5, 10],
	    weight: 2
	}).addTo(map);

	var alarmPolyline = [[[25, 119], [25, 125], [15, 125], [15, 110], [22, 110]], [[25, 125], [25, 135], [0, 135]], [[25, 135], [25, 140], [0, 140], [0, 105], [10.5, 105]]];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	    for (var _iterator = alarmPolyline[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var el = _step.value;

	        L.polyline(el, { color: 'red', weight: 2 }).addTo(map);
	    }
	} catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	        }
	    } finally {
	        if (_didIteratorError) {
	            throw _iteratorError;
	        }
	    }
	}

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';

	var layers = L.featureGroup();
	var setLatlon = function setLatlon() {
	    var mapBounds = map.getBounds();
	    var left = mapBounds._southWest.lng,
	        bottom = mapBounds._southWest.lat,
	        top = mapBounds._northEast.lat,
	        right = mapBounds._northEast.lng;

	    var mapHeight = top - bottom,
	        mapWidth = right - left;
	    var num = void 0;
	    var screen = $('#zmap').width();
	    if (screen >= 768 && screen <= 1024) {
	        num = 4;
	    } else if (screen > 1024) {
	        num = 8;
	    } else {
	        num = 3;
	    }

	    var lonGrid = mapWidth / num,
	        latGrid = lonGrid;

	    var opts = {
	        color: '#aaa',
	        weight: 1
	    };

	    for (var i = 1; i <= num - 1; i++) {
	        var pointLat = left + lonGrid * i;
	        var bottomPoint = [bottom, pointLat],
	            topPoint = [top, pointLat];
	        var latlngs = [bottomPoint, topPoint];
	        var polyline = L.polyline(latlngs, opts);
	        polyline.id = 'latlngLine';
	        layers.addLayer(polyline);

	        if (pointLat > 180) {
	            var remainder = Math.ceil((pointLat - 180) / 360);
	            pointLat -= remainder * 360;
	        } else if (pointLat < -180) {
	            var _remainder = Math.floor((pointLat + 180) / 360);
	            pointLat -= _remainder * 360;
	        }

	        var obj = { html: '<span class="ponitLatlon">' + Math.abs(pointLat.toFixed(2)) + (pointLat > 0 ? 'E' : 'W') + '</span>' };
	        var topDivIcon = L.marker(topPoint, { icon: L.divIcon(Object.assign({}, obj, { iconAnchor: [-5, -5] })) });
	        var bottomDivIcon = L.marker(bottomPoint, { icon: L.divIcon(Object.assign({}, obj, { iconAnchor: [-5, 20] })) });
	        topDivIcon.id = 'latlngDivIcon';
	        bottomDivIcon.id = 'latlngDivIcon';
	        layers.addLayer(topDivIcon);
	        layers.addLayer(bottomDivIcon);
	    }

	    var lonGridNum = mapHeight / latGrid;
	    for (var _i = 1; _i <= lonGridNum; _i++) {
	        var pointLon = top - lonGrid * _i;
	        var leftPoint = [pointLon, left],
	            rightPoint = [pointLon, right];
	        var _latlngs = [leftPoint, rightPoint];
	        var _polyline = L.polyline(_latlngs, opts);
	        _polyline.id = 'latlngLine';
	        layers.addLayer(_polyline);

	        var _obj = { html: '<span class="ponitLatlon">' + pointLon.toFixed(2) + (pointLon > 0 ? 'N' : 'S') + '</span>' };
	        var leftDivIcon = L.marker(leftPoint, { icon: L.divIcon(Object.assign({}, _obj, { iconAnchor: [-5, 20] })) });
	        var rightDivIcon = L.marker(rightPoint, { icon: L.divIcon(Object.assign({}, _obj, { iconAnchor: [40, 20] })) });
	        leftDivIcon.id = 'latlngDivIcon';
	        rightDivIcon.id = 'latlngDivIcon';
	        layers.addLayer(leftDivIcon);
	        layers.addLayer(rightDivIcon);
	    }

	    layers.addTo(map).bringToBack();
	};
	setLatlon();
	var resetLonlat = function resetLonlat() {
	    map.removeLayer(layers);
	    layers = L.featureGroup();
	    setLatlon();
	};
	map.on('moveend', resetLonlat);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	'use strict';

	window.positionCenter = [];

	var posIcon = L.icon({
	    iconUrl: 'assets/typhoon_current@3x.png',
	    iconSize: [30, 30],
	    iconAnchor: [9, 25]
	});


	var interval = setInterval(function () {
	    if (window.locationInfo && window.locationInfo.lat && window.locationInfo.lon) {
	        positionCenter = [window.locationInfo.lat, window.locationInfo.lon];

	        var posMarker = L.marker(positionCenter, { icon: posIcon }).addTo(map);
	        clearInterval(interval);
	    }
	}, 1000);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tyCenter = undefined;

	var _ZmapHelper = __webpack_require__(15);

	var _alarmArea = __webpack_require__(16);

	var _wind = __webpack_require__(23);

	var _typhoonDom = __webpack_require__(20);

	var _newsTip = __webpack_require__(29);

	var helper = null;
	var tyUrl = '/MeteoSyncServer/typhoon/getmsg' + ('?cacheCtrl=' + Date.now()),
	    latestTyUrl = '/MeteoSyncServer/typhoon/getlatest?num=3' + ('&cacheCtrl=' + Date.now());
	var tyLayerGroup = [],
	    layersGoesBack = [],
	    isTyDisplay = [];

	var tyCenter = exports.tyCenter = {
	  0: null,
	  1: null,
	  2: null
	};
	var moveView = true;

	var getTyphoon = function getTyphoon(data, currentTyIds) {
	  var len = data.length;

	  var _loop = function _loop(i) {
	    tyLayerGroup.push('');
	    layersGoesBack.push('');
	    isTyDisplay.push(false);

	    var tyLength = tyLayerGroup.length;
	    var target = $('#tyChange li:nth-child(' + tyLength + ')'),
	        targetChild = $('#tyChange li:nth-child(' + tyLength + ') a');
	    targetChild.text(data[i].tscname).attr('tsid', data[i].tsid);

	    target.on('click', function (e) {
	      e.stopPropagation();
	      target.toggleClass('layer-selected');
	      if (!target.hasClass('layer-selected')) {
	        (0, _newsTip.removeNewsTip)(data[i].intlid);
	        map.removeLayer(tyLayerGroup[i]);
	        if (!$('#tyChangeWraper .layer-selected').length) {
	          (0, _alarmArea.removeAllArea)();

	          $('#simTyphoon ul li.simSelected').map(function () {
	            $(this).click();
	          });
	          $('.simityList,.imgEx').hide();
	          $('.tyCl_list,.imgEx').stop().animate({ 'bottom': '0.666667rem' });
	          $('.simiMatch').css({ transform: 'translateY(100%)', bottom: '0' });
	        } else {
	          (0, _alarmArea.removeAreaInfo)(i);
	        }
	      } else {
	        if (!isTyDisplay[i]) {
	          isTyDisplay[i] = true;
	          var lyGp = helper.drawTy(data[i]);
	          tyLayerGroup[i] = lyGp.tyLayerGroup;
	          layersGoesBack[i] = lyGp.layersGoesBack;
	        } else {
	          map.addLayer(tyLayerGroup[i]);
	          layersGoesBack[i].map(function (el) {
	            el.layer.bringToBack();
	          });
	        }

	        var tyReal = data[i].real,
	            realLen = tyReal.length;
	        var lastReal = tyReal[realLen - 1];
	        var lat = lastReal.lat;
	        var lon = lastReal.lon;
	        if (moveView) map.setView([lat, lon], 4);
	        var lastrealTime = new Date(lastReal.datetime.replace(/-/g, '/')).getTime() + 8 * 60 * 60 * 1000;
	        (0, _newsTip.addNewsTip)(data[i].intlid, '北京时: ' + new Date(lastrealTime).Format('yyyy年MM月dd日 HH:00') + '台风' + data[i].tscname);

	        if (!tyCenter[i]) tyCenter[i] = [lat, lon];
	        (0, _alarmArea.addAreaInfo)(i);
	        $('.simityList,.imgEx').show();
	      }
	    });
	  };

	  for (var i = 0; i < len; i++) {
	    _loop(i);
	  }

	  $('#tyswNav li').eq(0).addClass('on');
	  if (!currentTyIds.length) {
	    $('#tyChange li:nth-child(1)').click();
	  } else {
	    currentTyIds.map(function (id, index) {
	      moveView = index === 0 ? true : false;
	      $('#tyChange li').map(function () {
	        if ($(this).find('a').attr('tsid') == id) {
	          $(this).click();
	        }
	      });
	    });
	  }
	};

	var currentTyphoon = [];
	var renderTyDOM = function renderTyDOM() {
	  var html = '';
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = currentTyphoon[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var info = _step.value;

	      html += '<li tsid="' + info.tsid + '"><a>' + info.tscname + '</a></li>';
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  $('#tylistName ul').html(html);
	  $('#tylistName ul li').eq(0).click();
	};

	$('#tylistName').on('click', 'li', function () {
	  $(this).addClass('on').siblings('li').removeClass('on');
	  var tsid = Number($(this).attr('tsid'));
	  getTyForecast(tsid);
	});
	var getTyForecast = function getTyForecast(tsid) {
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = currentTyphoon[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var info = _step2.value;

	      if (info.tsid === tsid) {
	        var html = '';
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	          for (var _iterator3 = info.fst[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var item = _step3.value;

	            var time = new Date(item.time);
	            html += '<li time="' + item.time + '">\n                  <div class="tylistDate_div">\n                    <p>' + time.Format('dd') + '\u65E5</p>\n                    <p>' + time.Format('HH') + '\u65F6</p>\n                  </div>\n                </li>';
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }

	        $('.tylist_date ul').html(html);
	        $('.tylist_date ul li').eq(0).click();
	        break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	};
	$('.tylist_date ul').scroll(function () {
	  var visibleWidth = $(this).width();
	  var totalWidth = document.querySelector('.tylist_date ul').scrollWidth;
	  var maxLeft = totalWidth - visibleWidth;
	  var left = $(this).scrollLeft();
	  var lengthOfLi = $(this).find('li').length;
	  var oneOfLi = maxLeft / lengthOfLi;
	  var n = Math.ceil(left / oneOfLi);
	  $('.tylist_date ul li').eq(n).click();
	});
	$('.tylist_date').on('click', 'li', function () {
	  $(this).addClass('on').siblings('li').removeClass('on');
	  var tsid = Number($('#tylistName li.on').attr('tsid'));
	  var time = $(this).attr('time');
	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;

	  try {
	    for (var _iterator4 = currentTyphoon[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      var info = _step4.value;

	      if (info.tsid === tsid) {
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	          for (var _iterator5 = info.fst[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	            var item = _step5.value;

	            if (item.time === time) {
	              $('#tyTsid').text(tsid);
	              $('#tyLongitude').text(item.lon);
	              $('#tyLatitude').text(item.lat);
	              $('#tyWindpower').text((0, _wind.getVelLevel)(item.ws) + '级');
	              $('#tyWindspeed').text(item.ws + '(m/s)');
	              $('#tyCenterpressure').text(item.ps + '(hpa)');
	              $('#tySevencircle').text(item.rr07 === null ? '无' : item.rr07 + 'km');
	              $('#tyTencircle').text(item.rr10 === null ? '无' : item.rr10 + 'km');
	              break;
	            }
	          }
	        } catch (err) {
	          _didIteratorError5 = true;
	          _iteratorError5 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion5 && _iterator5.return) {
	              _iterator5.return();
	            }
	          } finally {
	            if (_didIteratorError5) {
	              throw _iteratorError5;
	            }
	          }
	        }

	        break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }
	});

	$('.typhoonList, #tylistReturn').on('click', function () {
	  $('.tylist_content').toggle();
	});
	$('.typhoonList').click(function () {
	  $('.tylist_date ul li').eq(0).click();
	  if ($('.simiMatch').hasClass('on')) $('.closeSimi').click();
	  if ($('.early_warn').hasClass('on')) (0, _typhoonDom.hidePreWarnPopup)();
	  if ($('.cloudMap ul li:nth-child(1).on').length) $('.cloudMap ul li.on').eq(0).click();
	  if ($('.imgEx').hasClass('on')) $('.imgEx.on').click();
	  if ($('.cloudMap ul li:nth-child(2) img').hasClass('on')) $('.cloudMap ul li:nth-child(2) img.on').click();
	  var $target = $('.cloudMap ul li').eq(0);
	  if ($target.hasClass('on')) {
	    $target.removeClass('on');
	    $target.find('img').removeClass('on');
	    var url = $target.find('img').data('url').replace('_pre', '');
	    $target.find('img').attr('src', url);
	  }
	  $('.scrollbar').scrollLeft(0);
	});

	var initHelper = function initHelper() {
	  return new Promise(function (resolve, reject) {
	    if (!window.positionCenter.length) {
	      (function () {
	        var int = setInterval(function () {
	          if (window.positionCenter.length) {
	            helper = new _ZmapHelper.ZmapHelper(map, window.positionCenter);
	            clearInterval(int);
	            resolve();
	          }
	        }, 100);
	      })();
	    } else {
	      helper = new _ZmapHelper.ZmapHelper(map, window.positionCenter);
	      resolve();
	    }
	  });
	};

	var getlatTy = function getlatTy(currentTyIds) {
	  $.ajax({ url: latestTyUrl }).then(function (data) {
	    var _iteratorNormalCompletion6 = true;
	    var _didIteratorError6 = false;
	    var _iteratorError6 = undefined;

	    try {
	      for (var _iterator6 = data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	        var opt = _step6.value;

	        if (!opt.tscname) opt.tscname = '未命名';
	      }
	    } catch (err) {
	      _didIteratorError6 = true;
	      _iteratorError6 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion6 && _iterator6.return) {
	          _iterator6.return();
	        }
	      } finally {
	        if (_didIteratorError6) {
	          throw _iteratorError6;
	        }
	      }
	    }

	    if (!data.length) return;

	    initHelper().then(function () {
	      getTyphoon(data, currentTyIds);
	    });
	  });
	};

	$.get(tyUrl, function (data) {
	  var _iteratorNormalCompletion7 = true;
	  var _didIteratorError7 = false;
	  var _iteratorError7 = undefined;

	  try {
	    for (var _iterator7 = data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	      var opt = _step7.value;

	      if (!opt.tscname) opt.tscname = '未命名';
	    }
	  } catch (err) {
	    _didIteratorError7 = true;
	    _iteratorError7 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion7 && _iterator7.return) {
	        _iterator7.return();
	      }
	    } finally {
	      if (_didIteratorError7) {
	        throw _iteratorError7;
	      }
	    }
	  }

	  var num = data.length;

	  var currentTyIds = [];var _iteratorNormalCompletion8 = true;
	  var _didIteratorError8 = false;
	  var _iteratorError8 = undefined;

	  try {
	    for (var _iterator8 = data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	      var info = _step8.value;

	      currentTyIds.push(info.tsid);
	    }
	  } catch (err) {
	    _didIteratorError8 = true;
	    _iteratorError8 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion8 && _iterator8.return) {
	        _iterator8.return();
	      }
	    } finally {
	      if (_didIteratorError8) {
	        throw _iteratorError8;
	      }
	    }
	  }

	  if (!data.length) window.fstAreas = false;
	  window.currentTyNum = data.length;
	  var text = num ? '当前有台风' : '当前无台风';

	  currentTyphoon = data;
	  var _iteratorNormalCompletion9 = true;
	  var _didIteratorError9 = false;
	  var _iteratorError9 = undefined;

	  try {
	    for (var _iterator9 = data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	      var _info = _step9.value;

	      if (_info.fst.length) {
	        _info.fst.map(function (item) {
	          var time = new Date(item.datetime.replace(/\-/g, "/")).getTime();
	          time += (8 + item.leadtime) * 60 * 60 * 1000;
	          item.time = new Date(time).Format('yyyy/MM/dd HH:mm:ss');
	        });
	        $('.typhoonList').show();
	      }
	    }
	  } catch (err) {
	    _didIteratorError9 = true;
	    _iteratorError9 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion9 && _iterator9.return) {
	        _iterator9.return();
	      }
	    } finally {
	      if (_didIteratorError9) {
	        throw _iteratorError9;
	      }
	    }
	  }

	  renderTyDOM();

	  $('.hint-content').text(text).fadeIn(500, function () {
	    $('.hint-content').fadeOut(2000);
	  });
	  getlatTy(currentTyIds);
	});

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ZmapHelper = exports.ZmapHelper = function ZmapHelper(map, gps) {
	    _classCallCheck(this, ZmapHelper);

	    _initialiseProps.call(this);

	    this.map = map;
	    this.gps = gps;
	};

	var _initialiseProps = function _initialiseProps() {
	    var _this = this;

	    this.drawTy = function (tyData, clickCB) {
	        if (!tyData) {
	            console.error("台风数据为空");
	            return;
	        }
	        console.log(tyData);
	        var map = _this.map;
	        var tyName = tyData.tscname,
	            tyId = tyData.tsid,
	            realPoints = tyData.real.reverse(),
	            time = new Date(tyData.real[tyData.real.length - 1].datetime.replace(/\-/g, "/")),
	            fstPoints = tyData.fst.sort(function (a, b) {
	            return Number(a.leadtime) - Number(b.leadtime);
	        }),
	            realFirstPointDegrees = [realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon],
	            windCircle = getWindCircle(realPoints[realPoints.length - 1]);
	        var isRealLastPoint = false,
	            isfstLastPoint = false,
	            realPointCounter = 0,
	            fstPointCounter = 0,
	            realLastPoint = [realPoints[realPoints.length - 1].lon, realPoints[realPoints.length - 1].lat],
	            tyLayerGroup = L.layerGroup(),
	            layerHolder = void 0,
	            popupHolder = void 0,
	            realSpeedHolder = [],
	            fstSpeedHolder = [],
	            fstAreaPointsHolder = [],
	            layersGoesBack = [];
	        var fstSidePints = [],
	            fstSemicilePoints = [],
	            fstAreaPoints = [[realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon]];
	        tyLayerGroup.addTo(map);

	        time.setHours(time.getHours() + 8);

	        if (realPoints.length == 1) {
	            var prePointDgrees = [realPoints[realPoints.length - 1].lon, realPoints[realPoints.length - 1].lat];
	            pointDgrees = [fstPoints[0].lon, fstPoints[0].lat];
	            timeDiff = Number(fstPoints[0].leadtime);
	            realSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	            if (fstPoints.length == 1) {
	                fstSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	            } else {
	                fstSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	                fstPoints.forEach(function (el, i, arr) {
	                    if (i == 0) return;
	                    timeDiff = arr[i].leadtime - arr[i - 1].leadtime;
	                    fstSpeedHolder.push(Number(computeDistance(arr[i - 1].lon, arr[i - 1].lat, arr[i].lon, arr[i].lat) / timeDiff).toFixed(1));
	                });
	            }
	        } else {
	            (function () {
	                var prePointDgrees = [realPoints[0].lon, realPoints[0].lat],
	                    pointDgrees = [realPoints[1].lon, realPoints[1].lat],
	                    timeDiff = getDateDiff(realPoints[0].datetime, realPoints[1].datetime, 'h');
	                realSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	                realPoints.forEach(function (el, i, arr) {
	                    if (i == 0) return;
	                    timeDiff = getDateDiff(arr[i - 1].datetime, arr[i].datetime, 'h');
	                    realSpeedHolder.push(Number(computeDistance(arr[i - 1].lon, arr[i - 1].lat, arr[i].lon, arr[i].lat) / timeDiff).toFixed(1));
	                });
	                if (fstPoints.length == 1) {
	                    prePointDgrees = [realPoints[realPoints.length - 1].lon, realPoints[realPoints.length - 1].lat];
	                    pointDgrees = [fstPoints[0].lon, fstPoints[0].lat];
	                    timeDiff = Number(fstPoints[0].leadtime);
	                    fstSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	                } else {
	                    prePointDgrees = [realPoints[realPoints.length - 1].lon, realPoints[realPoints.length - 1].lat];
	                    pointDgrees = [fstPoints[0].lon, fstPoints[0].lat];
	                    timeDiff = Number(fstPoints[0].leadtime);
	                    fstSpeedHolder.push(Number(computeDistance(prePointDgrees[0], prePointDgrees[1], pointDgrees[0], pointDgrees[1]) / timeDiff).toFixed(1));
	                    fstPoints.forEach(function (el, i, arr) {
	                        if (i == 0) return;
	                        timeDiff = arr[i].leadtime - arr[i - 1].leadtime;
	                        fstSpeedHolder.push(Number(computeDistance(arr[i - 1].lon, arr[i - 1].lat, arr[i].lon, arr[i].lat) / timeDiff).toFixed(1));
	                    });
	                }
	            })();
	        }

	        fstPoints.forEach(function (el, i, arr) {
	            if (i == 0) {
	                fstSidePints.push(getSidePoints(realPoints[realPoints.length - 1].lon, realPoints[realPoints.length - 1].lat, el.lon, el.lat, getFstR(el.leadtime)));
	            } else {
	                fstSidePints.push(getSidePoints(arr[i - 1].lon, arr[i - 1].lat, el.lon, el.lat, getFstR(el.leadtime)));
	            }
	        });

	        var isLeftBigger = false;
	        if (fstSidePints[fstSidePints.length - 1].left.lat > fstSidePints[fstSidePints.length - 1].right.lat) {
	            isLeftBigger = true;
	        }

	        fstSemicilePoints = getHalfPoints(fstSidePints[fstSidePints.length - 1].right, fstSidePints[fstSidePints.length - 1].left, 45, isLeftBigger);

	        fstSidePints.forEach(function (el) {
	            fstAreaPointsHolder.push(el.left.lat, el.left.lon);
	        });
	        fstAreaPointsHolder = getCurvePoints(fstAreaPointsHolder, .5, 10, false);
	        for (var i = 0; i < fstAreaPointsHolder.length; i += 2) {
	            fstAreaPoints.push([fstAreaPointsHolder[i], fstAreaPointsHolder[i + 1]]);
	        }
	        fstAreaPointsHolder = [];
	        if (isLeftBigger == true) {
	            for (var _i = 0; _i < fstSemicilePoints.length; _i += 2) {
	                fstAreaPoints.push([fstSemicilePoints[_i + 1], fstSemicilePoints[_i]]);
	            }
	        } else {
	            for (var _i2 = fstSemicilePoints.length - 1; _i2 > 0; _i2 -= 2) {
	                fstAreaPoints.push([fstSemicilePoints[_i2], fstSemicilePoints[_i2 - 1]]);
	            }
	        }

	        fstSidePints.reverse().forEach(function (el) {
	            fstAreaPointsHolder.push(el.right.lat, el.right.lon);
	        });
	        fstAreaPointsHolder = getCurvePoints(fstAreaPointsHolder, .5, 10, false);
	        for (var _i3 = 0; _i3 < fstAreaPointsHolder.length; _i3 += 2) {
	            fstAreaPoints.push([fstAreaPointsHolder[_i3], fstAreaPointsHolder[_i3 + 1]]);
	        }
	        fstAreaPointsHolder = [];

	        fstSidePints.reverse();

	        if (realPoints.length) {
	            var tyNameLabel = L.divIcon({
	                className: 'ty-name-label',
	                html: "<span style=\"color:#fff\">" + tyName + (tyData.tsename ? tyData.tsename : '') + "</span>",
	                iconAnchor: [-15, 9]
	            });
	            tyLayerGroup.addLayer(L.marker([realPoints[0].lat, realPoints[0].lon], { icon: tyNameLabel }));
	        }

	        var divIcon = L.divIcon({
	            className: 'ty-name',
	            bgPos: [105, 0],
	            html: "<div><span></span><span>" + (tyName ? tyName : '未命名') + " " + (time.getMonth() + 1) + "\u6708" + time.getDate() + "\u65E5" + (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + "\u65F6\n\t\t\t\t<p>\u7EA6\u79BB\u60A8" + computeDistance(_this.gps[0], _this.gps[1], realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon) + "\u516C\u91CC</p>\n\t\t\t\t</span></div>"
	        });
	        var tipHolder = L.marker(realPoints[realPoints.length - 1], { icon: divIcon });

	        var iconClass = realFirstPointDegrees[0] > 0 ? 'rotate_ani' : 'positive_rotate_ani';
	        var curMarker = L.divIcon({
	            className: 'typhoon_icon',
	            html: "<div ><img class=\"" + iconClass + "\" style=\"width:30px;height:30px\" src=\"" + getCurMKByLevel(realPoints[realPoints.length - 1]) + "\"></div>"
	        });
	        var curPosMk = L.marker(realFirstPointDegrees, {
	            icon: curMarker,
	            zIndexOffset: 2000
	        }).on('click', function (e) {
	            var popup = createTyPointPopup(realPoints[realPoints.length - 1], true);

	            e.target.unbindPopup().bindPopup(popup).openPopup();
	            tipHolder.setOpacity(1);
	        });
	        tyLayerGroup.addLayer(curPosMk);

	        if (realPoints.length == 1) {
	            (function () {
	                curPosMk.setLatLng([realPoints[realPointCounter].lat, realPoints[realPointCounter].lon]);

	                popupHolder = createTyPointPopup(realPoints[realPointCounter], true);
	                tyLayerGroup.addLayer(L.circleMarker([realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon], {
	                    zIndexOffset: 2000,
	                    radius: 6,
	                    weight: 1.5,
	                    color: getColorByLevel(realPoints[realPointCounter].level, true),
	                    opacity: 1,
	                    fillOpacity: 1,
	                    fillColor: getColorByLevel(realPoints[realPointCounter].level)
	                }).bindPopup(popupHolder));
	                curPosMk.setLatLng([realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon]);

	                tyLayerGroup.addLayer(tipHolder);

	                var realPointsInterval = setInterval(function () {
	                    layerHolder = L.polyline([[realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon], [fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon]], {
	                        dashArray: '15, 10',
	                        dashOffset: '8',
	                        color: getColorByLevel(fstPoints[fstPointCounter].level),
	                        weight: 1
	                    });
	                    tyLayerGroup.addLayer(layerHolder);
	                    layerHolder.bringToBack();
	                    layersGoesBack.push({
	                        layer: layerHolder
	                    });
	                    clearInterval(realPointsInterval);
	                    var fstPointsInterval = setInterval(function () {
	                        if (fstPointCounter != fstPoints.length - 1) {
	                            popupHolder = createTyPointPopup(fstPoints[fstPointCounter]);
	                            tyLayerGroup.addLayer(L.circleMarker([fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon], {
	                                zIndexOffset: 2000,
	                                radius: 6,
	                                color: getColorByLevel(fstPoints[fstPointCounter].level, true),
	                                weight: 1,
	                                opacity: 1,
	                                fillOpacity: 1,
	                                fillColor: getColorByLevel(fstPoints[fstPointCounter].level)
	                            }).bindPopup(popupHolder));

	                            if (fstPointCounter > 0) {
	                                layerHolder = L.polyline([[fstPoints[fstPointCounter - 1].lat, fstPoints[fstPointCounter - 1].lon], [fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon]], {
	                                    dashArray: '8, 8',
	                                    dashOffset: '10',
	                                    color: getColorByLevel(fstPoints[fstPointCounter].level),
	                                    weight: 1
	                                });
	                                tyLayerGroup.addLayer(layerHolder);
	                                layerHolder.bringToBack();
	                                layersGoesBack.push({
	                                    layer: layerHolder
	                                });
	                            }
	                            fstPointCounter++;
	                        } else {
	                            clearInterval(fstPointsInterval);
	                            popupHolder = createTyPointPopup(fstPoints[fstPoints.length - 1]);
	                            tyLayerGroup.addLayer(L.circleMarker([fstPoints[fstPoints.length - 1].lat, fstPoints[fstPoints.length - 1].lon], {
	                                zIndexOffset: 2000,
	                                radius: 6,
	                                color: getColorByLevel(fstPoints[fstPoints.length - 1].level, true),
	                                weight: 1,
	                                opacity: 1,
	                                fillOpacity: 1,
	                                fillColor: getColorByLevel(fstPoints[fstPoints.length - 1].level)
	                            }).bindPopup(popupHolder));

	                            if (fstPoints.length > 1) {
	                                layerHolder = L.polyline([[fstPoints[fstPoints.length - 2].lat, fstPoints[fstPoints.length - 2].lon], [fstPoints[fstPoints.length - 1].lat, fstPoints[fstPoints.length - 1].lon]], {
	                                    dashArray: '8, 8',
	                                    dashOffset: '10',
	                                    color: getColorByLevel(fstPoints[fstPoints.length - 1].level),
	                                    weight: 1
	                                });
	                                tyLayerGroup.addLayer(layerHolder);
	                                layerHolder.bringToBack();
	                                layersGoesBack.push({
	                                    layer: layerHolder
	                                });
	                            }

	                            layerHolder = L.polygon(fstAreaPoints, {
	                                color: 'red',
	                                weight: 1.5,
	                                opacity: 1,
	                                dashArray: '4, 5',
	                                dashOffset: '2',
	                                fillColor: 'red',
	                                fillOpacity: .3
	                            });
	                            tyLayerGroup.addLayer(layerHolder);
	                            layersGoesBack.push({
	                                layer: layerHolder
	                            });
	                            layerHolder.bringToBack();

	                            var lastPoint = realLastPoint,
	                                lastPointData = realPoints[realPoints.length - 1];

	                            if (lastPoint[0] > lastPoint[1]) lastPoint.reverse();
	                            for (var _i4 in windCircle) {
	                                tyLayerGroup.addLayer(L.circle(lastPoint, lastPointData[_i4] * 1000, {
	                                    zIndexOffset: 2000,
	                                    color: getWindColor(_i4),
	                                    weight: 1,
	                                    fill: false
	                                }));
	                            }

	                            _this.map.on('click', function () {
	                                tipHolder.setOpacity(0);
	                            });
	                        }
	                    }, 1);
	                }, 1);
	            })();
	        }

	        if (realPoints.length > 1) {
	            (function () {
	                var realPointsInterval = setInterval(function () {
	                    if (realPointCounter != realPoints.length - 1) {
	                        if (!map.hasLayer(tyLayerGroup)) {
	                            return;
	                        }

	                        if (realPointCounter > 0) {
	                            layerHolder = L.polyline([[realPoints[realPointCounter - 1].lat, realPoints[realPointCounter - 1].lon], [realPoints[realPointCounter].lat, realPoints[realPointCounter].lon]], {
	                                color: getColorByLevel(realPoints[realPointCounter].level),
	                                weight: 3
	                            });
	                            tyLayerGroup.addLayer(layerHolder);
	                            layerHolder.bringToBack();
	                            layersGoesBack.push({
	                                layer: layerHolder
	                            });
	                        }
	                        popupHolder = createTyPointPopup(realPoints[realPointCounter], true, realPointCounter);
	                        tyLayerGroup.addLayer(L.circleMarker([realPoints[realPointCounter].lat, realPoints[realPointCounter].lon], {
	                            zIndexOffset: 2000,
	                            radius: 6,
	                            weight: 1,
	                            color: getColorByLevel(realPoints[realPointCounter].level, true),
	                            opacity: 1,
	                            fillOpacity: 1,
	                            fillColor: getColorByLevel(realPoints[realPointCounter].level)
	                        }).bindPopup(popupHolder));
	                        realPointCounter++;
	                        curPosMk.setLatLng([realPoints[realPointCounter].lat, realPoints[realPointCounter].lon]);
	                    } else {
	                        (function () {
	                            clearInterval(realPointsInterval);

	                            popupHolder = createTyPointPopup(realPoints[realPointCounter], true, realPoints.length - 1);
	                            tyLayerGroup.addLayer(L.circleMarker([realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon], {
	                                radius: 6,
	                                weight: 1.5,
	                                color: getColorByLevel(realPoints[realPointCounter].level, true),
	                                opacity: 1,
	                                fillOpacity: 1,
	                                fillColor: getColorByLevel(realPoints[realPointCounter].level)
	                            }).bindPopup(popupHolder));
	                            curPosMk.setLatLng([realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon]);

	                            tyLayerGroup.addLayer(tipHolder);

	                            layerHolder = L.polyline([[realPoints[realPoints.length - 2].lat, realPoints[realPoints.length - 2].lon], [realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon]], {
	                                color: getColorByLevel(fstPoints[fstPointCounter].level),
	                                weight: 3
	                            });
	                            tyLayerGroup.addLayer(layerHolder);
	                            layerHolder.bringToBack();
	                            layersGoesBack.push({
	                                layer: layerHolder
	                            });

	                            layerHolder = L.polyline([[realPoints[realPoints.length - 1].lat, realPoints[realPoints.length - 1].lon], [fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon]], {
	                                dashArray: '15, 10',
	                                dashOffset: '8',
	                                color: getColorByLevel(fstPoints[fstPointCounter].level),
	                                weight: 1
	                            });
	                            tyLayerGroup.addLayer(layerHolder);
	                            layerHolder.bringToBack();
	                            layersGoesBack.push({
	                                layer: layerHolder
	                            });
	                            var fstPointsInterval = setInterval(function () {
	                                if (fstPointCounter != fstPoints.length - 1) {
	                                    popupHolder = createTyPointPopup(fstPoints[fstPointCounter], false, fstPointCounter);
	                                    tyLayerGroup.addLayer(L.circleMarker([fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon], {
	                                        zIndexOffset: 2000,
	                                        radius: 6,
	                                        color: getColorByLevel(fstPoints[fstPointCounter].level, true),
	                                        weight: 1,
	                                        opacity: 1,
	                                        fillOpacity: 1,
	                                        fillColor: getColorByLevel(fstPoints[fstPointCounter].level)
	                                    }).bindPopup(popupHolder));

	                                    if (fstPointCounter > 0) {
	                                        layerHolder = L.polyline([[fstPoints[fstPointCounter - 1].lat, fstPoints[fstPointCounter - 1].lon], [fstPoints[fstPointCounter].lat, fstPoints[fstPointCounter].lon]], {
	                                            dashArray: '8, 8',
	                                            dashOffset: '10',
	                                            color: getColorByLevel(fstPoints[fstPointCounter].level),
	                                            weight: 1
	                                        });
	                                        tyLayerGroup.addLayer(layerHolder);
	                                        layerHolder.bringToBack();
	                                        layersGoesBack.push({
	                                            layer: layerHolder
	                                        });
	                                    }
	                                    fstPointCounter++;
	                                } else {
	                                    clearInterval(fstPointsInterval);
	                                    popupHolder = createTyPointPopup(fstPoints[fstPoints.length - 1], false, fstPoints.length - 1);
	                                    tyLayerGroup.addLayer(L.circleMarker([fstPoints[fstPoints.length - 1].lat, fstPoints[fstPoints.length - 1].lon], {
	                                        zIndexOffset: 2000,
	                                        radius: 6,
	                                        color: getColorByLevel(fstPoints[fstPoints.length - 1].level, true),
	                                        weight: 1,
	                                        opacity: 1,
	                                        fillOpacity: 1,
	                                        fillColor: getColorByLevel(fstPoints[fstPoints.length - 1].level)
	                                    }).bindPopup(popupHolder));

	                                    if (fstPoints.length > 1) {
	                                        layerHolder = L.polyline([[fstPoints[fstPoints.length - 2].lat, fstPoints[fstPoints.length - 2].lon], [fstPoints[fstPoints.length - 1].lat, fstPoints[fstPoints.length - 1].lon]], {
	                                            dashArray: '8, 8',
	                                            dashOffset: '10',
	                                            color: getColorByLevel(fstPoints[fstPoints.length - 1].level),
	                                            weight: 1
	                                        });
	                                        tyLayerGroup.addLayer(layerHolder);
	                                        layerHolder.bringToBack();
	                                        layersGoesBack.push({
	                                            layer: layerHolder
	                                        });
	                                    }


	                                    if (!window.fstAreas) window.fstAreas = [];
	                                    if (window.fstAreas.length < window.currentTyNum) window.fstAreas.push(fstAreaPoints);

	                                    layerHolder = L.polygon(fstAreaPoints, {
	                                        color: 'red',
	                                        weight: 1.5,
	                                        opacity: 1,
	                                        dashArray: '4, 5',
	                                        dashOffset: '2',
	                                        fillColor: 'red',
	                                        fillOpacity: .3
	                                    });
	                                    tyLayerGroup.addLayer(layerHolder);
	                                    layersGoesBack.push({
	                                        layer: layerHolder
	                                    });
	                                    layerHolder.bringToBack();

	                                    var lastPoint = realLastPoint,
	                                        lastPointData = realPoints[realPoints.length - 1];

	                                    if (lastPoint[0] > lastPoint[1]) lastPoint.reverse();
	                                    for (var _i5 in windCircle) {
	                                        tyLayerGroup.addLayer(L.circle(lastPoint, lastPointData[_i5] * 1000, {
	                                            zIndexOffset: 2000,
	                                            color: getWindColor(_i5),
	                                            weight: 1,
	                                            fill: false
	                                        }));
	                                    }

	                                    _this.map.on('click', function () {
	                                        tipHolder.setOpacity(0);
	                                    });
	                                }
	                            }, 1);
	                        })();
	                    }
	                }, 1);
	            })();
	        }

	        function createTyPointPopup(data) {
	            var isRealPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	            var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	            var n = void 0;
	            if (isRealPoint) {
	                n = new Date(data.datetime.replace(/\-/g, "/"));

	                n.setHours(n.getHours() + 8);
	                return L.popup({
	                    className: 'ty-popup',
	                    closeButton: false
	                }).setContent("<section>\n\n                \n               \n                <ul>\n                   <li><span>\u65F6\u95F4</span><span>" + n.getDate() + "\u65E5" + (n.getHours() < 10 ? "0" + n.getHours() : n.getHours()) + "\u65F6</span></li>\n                    <li><span>\u5F53\u524D\u4F4D\u7F6E</span><span>" + data.lon + "/" + data.lat + "</span></li>             \n                    \n                    <li><span>\u98CE\u529B</span><span>" + getVelLevel(data.ws) + "\u7EA7</span></li>\n                    <li><span>\u98CE\u901F</span><span>" + data.ws + "m/s</span></li>\n                    <li><span>\u4E2D\u5FC3\u6C14\u538B</span><span>" + data.ps + "hpa</span></li>\n                    <li><span>\u4E03\u7EA7\u98CE\u5708</span><span>" + (data.rr07 ? data.rr07 + 'km' : "无") + "</span></li>\n                    <li><span>\u5341\u7EA7\u98CE\u5708</span><span>" + (data.rr10 ? data.rr10 + 'km' : "无") + "</span></li>\n                </ul>\n                <div class=\"bgLeft\">\n                    <div class=\"bgLeftInt\"></div>\n                </div>\n                </section>");
	            } else {
	                n = new Date(data.datetime.replace(/\-/g, "/"));

	                n.setHours(n.getHours() + 8 + data.leadtime);
	                return L.popup({
	                    className: 'ty-popup',
	                    closeButton: false
	                }).setContent("<section>\n                <ul>\n                   <li><span>\u65F6\u95F4</span><span>" + n.getDate() + "\u65E5" + (n.getHours() < 10 ? "0" + n.getHours() : n.getHours()) + "\u65F6</span></li>\n                    <li><span>\u9884\u8BA1\u4F4D\u7F6E</span><span>" + data.lon + "/" + data.lat + "</span></li>             \n                    \n                    <li><span>\u98CE\u529B</span><span>" + getVelLevel(data.ws) + "\u7EA7</span></li>\n                    <li><span>\u98CE\u901F</span><span>" + data.ws + "m/s</span></li>\n                    <li><span>\u4E2D\u5FC3\u6C14\u538B</span><span>" + data.ps + "hpa</span></li>\n                    <li><span>\u4E03\u7EA7\u98CE\u5708</span><span>" + (data.rr07 ? data.rr07 + 'km' : "无") + "</span></li>\n                    <li><span>\u5341\u7EA7\u98CE\u5708</span><span>" + (data.rr10 ? data.rr10 + 'km' : "无") + "</span></li>\n                </ul>\n                 <div class=\"bgLeft\">\n                    <div class=\"bgLeftInt\"></div>\n                </div>\n                </section>");
	            }
	        }

	        function getRankByLevel(level) {
	            var v = level.trim();
	            switch (v) {
	                case 'TD':
	                    return '热带低压';
	                case 'TS':
	                    return '热带风暴';
	                case 'STS':
	                    return '强热带风暴';
	                case 'TY':
	                    return '台风';
	                case 'STY':
	                    return '强台风';
	                case 'SUPER':
	                    return '超强台风';
	            }
	        }

	        function getColorByLevel(level, outline) {
	            if (!level) return '#aaea90';
	            var v = level.trim();
	            if (!outline) {
	                switch (v) {
	                    case 'TD':
	                        return '#aaea90';
	                    case 'TS':
	                        return '#85b5e3';
	                    case 'STS':
	                        return '#e9eb4c';
	                    case 'TY':
	                        return '#fbc31a';
	                    case 'STY':
	                        return '#ed3f3f';
	                    case 'SUPER':
	                        return '#814d0f';
	                    default:
	                        return '#aaea90';
	                }
	            }
	            if (outline == true) {
	                switch (v) {
	                    case 'TD':
	                        return '#5c7e4e';
	                    case 'TS':
	                        return '#4b6680';
	                    case 'STS':
	                        return '#7e8029';
	                    case 'TY':
	                        return '#80630d';
	                    case 'STY':
	                        return '#802222';
	                    case 'SUPER':
	                        return '#503009';
	                    default:
	                        return '#5c7e4e';
	                }
	            }
	        }

	        function getSidePoints(lon1, lat1, lon2, lat2, r) {
	            var dltLon = lon2 - lon1;
	            var dltLat = lat2 - lat1;
	            var dltLon2 = dltLon * dltLon;
	            var dltLat2 = dltLat * dltLat;
	            var dis1 = Math.sqrt(dltLon2 + dltLat2);
	            var dis2 = r / 100.0;
	            return {
	                left: {
	                    lat: (dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
	                    lon: (dltLon2 * lon2 + dltLat2 * lon2 - dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
	                },
	                right: {
	                    lat: (-dltLon * dis1 * dis2 + lat2 * dltLon2 + dltLat2 * lat2) / (dltLon2 + dltLat2),
	                    lon: (dltLon2 * lon2 + dltLat2 * lon2 + dis1 * dis2 * dltLat) / (dltLon2 + dltLat2)
	                }
	            };
	        }

	        function getFstR(value) {
	            var tanDis = {
	                6: 3 * 8,
	                12: 6 * 8,
	                18: 10 * 8,
	                24: 14 * 8,
	                36: 19 * 8,
	                48: 24 * 8,
	                60: 30 * 8,
	                72: 32 * 8,
	                84: 40 * 8,
	                96: 42 * 8,
	                108: 48 * 8,
	                120: 50 * 8
	            };
	            return tanDis[value];
	        }

	        function getHalfPoints(left, right, num, latJuge) {
	            var pois = [];
	            var c = {
	                lon: (left.lon + right.lon) / 2,
	                lat: (left.lat + right.lat) / 2
	            };
	            var r = Math.sqrt((left.lon - right.lon) * (left.lon - right.lon) + (left.lat - right.lat) * (left.lat - right.lat)) / 2;
	            var start = Math.atan((left.lon - c.lon) / (left.lat - c.lat));
	            var dis = Math.PI;
	            var step = dis / num;
	            if (!latJuge) {
	                for (var i = 1; i < num; i++) {
	                    var angle = start - i * step;
	                    pois.push(c.lon + r * Math.sin(angle), c.lat + r * Math.cos(angle));
	                }
	            }
	            if (latJuge) {
	                for (var i = 1; i < num; i++) {
	                    var angle = start + i * step;
	                    pois.push(c.lon + r * Math.sin(angle), c.lat + r * Math.cos(angle));
	                }
	            }
	            return pois;
	        }

	        function getWindCircle(point) {
	            var temp = {};
	            if (point.rr06) {
	                temp.rr06 = point.rr06;
	            }
	            if (point.rr07) {
	                temp.rr07 = point.rr07;
	            }
	            if (point.rr08) {
	                temp.rr08 = point.rr08;
	            }
	            if (point.rr10) {
	                temp.rr10 = point.rr10;
	            }
	            return temp;
	        }

	        function getWindColor(level) {
	            switch (level) {
	                case 'rr06':
	                    return '#15fe16';
	                case 'rr07':
	                    return '#181dfd';
	                case 'rr08':
	                    return '#f5fa17';
	                case 'rr10':
	                    return '#fe0406';
	            }
	        }

	        function getWindCirclePoint(lon, lat, r) {
	            var points = [],
	                angle = 360;
	            var dis = Math.PI;
	            var R = r / 100;
	            for (var _i6 = 0; _i6 < 360; _i6++) {
	                points.push([lat + R * Math.sin(_i6 * dis / 180), lon + R * Math.cos(_i6 * dis / 180)]);
	            }
	            return points;
	        }

	        function getCurMKByLevel(lastPoint) {
	            var v = lastPoint.level.trim();
	            switch (v) {
	                case 'TD':
	                    return './assets/typhoonstatic_11.png';
	                case 'TS':
	                    return './assets/typhoonstatic_22.png';
	                case 'STS':
	                    return './assets/typhoonstatic_33.png';
	                case 'TY':
	                    return './assets/typhoonstatic_44.png';
	                case 'STY':
	                    return './assets/typhoonstatic_55.png';
	                case 'SUPER':
	                    return './assets/typhoonstatic_66.png';
	                default:
	                    return './assets/typhoonstatic_11.png';

	            }
	        }

	        function computeDistance(lng1, lat1, lng2, lat2) {
	            var EARTH_RADIUS = 6378.137;
	            var radLat1 = lat1 * Math.PI / 180.0;
	            var radLat2 = lat2 * Math.PI / 180.0;
	            var a = radLat1 - radLat2;
	            var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	            s = EARTH_RADIUS * s;
	            s = Math.round(s * 10000) / 10000;
	            return s.toFixed(1);
	        };

	        function getDateDiff(startTime, endTime, diffType) {
	            startTime = startTime.replace(/\-/g, "/");
	            endTime = endTime.replace(/\-/g, "/");

	            diffType = diffType.toLowerCase();
	            var sTime = new Date(startTime);
	            var eTime = new Date(endTime);
	            var divNum = 1;
	            switch (diffType) {
	                case "s":
	                    divNum = 1000;
	                    break;
	                case "m":
	                    divNum = 1000 * 60;
	                    break;
	                case "h":
	                    divNum = 1000 * 3600;
	                    break;
	                case "d":
	                    divNum = 1000 * 3600 * 24;
	                    break;
	                default:
	                    divNum = 1000 * 3600;
	                    break;
	            }
	            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
	        }

	        function getCurvePoints(points, tension, numOfSeg, close) {
	            if (typeof points === "undefined" || points.length < 2) return new Float32Array(0);

	            tension = typeof tension === "number" ? tension : 0.5;
	            numOfSeg = typeof numOfSeg === "number" ? numOfSeg : 25;
	            var pts,
	                i = 1,
	                l = points.length,
	                rPos = 0,
	                rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
	                res = new Float32Array(rLen),
	                cache = new Float32Array(numOfSeg + 2 << 2),
	                cachePtr = 4;
	            pts = points.slice(0);
	            if (close) {
	                pts.unshift(points[l - 1]);
	                pts.unshift(points[l - 2]);
	                pts.push(points[0], points[1]);
	            } else {
	                pts.unshift(points[1]);
	                pts.unshift(points[0]);
	                pts.push(points[l - 2], points[l - 1]);
	            }

	            cache[0] = 1;
	            for (; i < numOfSeg; i++) {
	                var st = i / numOfSeg,
	                    st2 = st * st,
	                    st3 = st2 * st,
	                    st23 = st3 * 2,
	                    st32 = st2 * 3;
	                cache[cachePtr++] = st23 - st32 + 1;
	                cache[cachePtr++] = st32 - st23;
	                cache[cachePtr++] = st3 - 2 * st2 + st;
	                cache[cachePtr++] = st3 - st2;
	            }
	            cache[++cachePtr] = 1;
	            parse(pts, cache, l, tension);
	            if (close) {
	                pts = [];
	                pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1], points[0], points[1], points[2], points[3]);
	                parse(pts, cache, 4, tension);
	            }

	            function parse(pts, cache, l, tension) {
	                for (var i = 2, t; i < l; i += 2) {
	                    var pt1 = pts[i],
	                        pt2 = pts[i + 1],
	                        pt3 = pts[i + 2],
	                        pt4 = pts[i + 3],
	                        t1x = (pt3 - pts[i - 2]) * tension,
	                        t1y = (pt4 - pts[i - 1]) * tension,
	                        t2x = (pts[i + 4] - pt1) * tension,
	                        t2y = (pts[i + 5] - pt2) * tension,
	                        c = 0,
	                        c1,
	                        c2,
	                        c3,
	                        c4;
	                    for (t = 0; t < numOfSeg; t++) {
	                        c1 = cache[c++];
	                        c2 = cache[c++];
	                        c3 = cache[c++];
	                        c4 = cache[c++];
	                        res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
	                        res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
	                    }
	                }
	            }

	            l = close ? 0 : points.length - 2;
	            res[rPos++] = points[l++];
	            res[rPos] = points[l];
	            return res;
	        }

	        function getVelLevel(vel) {
	            var levels = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.0, 41.5, 46.2, 51.0, 56.1, 61.3, 66.8, 72.4];

	            for (var _i7 = 0; _i7 < levels.length; _i7++) {
	                if (vel < levels[_i7]) return _i7;
	            }
	            return 20;
	        }

	        return {
	            realLastPoint: realLastPoint,
	            tyLayerGroup: tyLayerGroup,
	            layersGoesBack: layersGoesBack
	        };
	    };
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeAllArea = exports.removeSingleArea = exports.removeAreaInfo = exports.addAreaInfo = exports.addArea = exports.removeTyphoonpot = exports.modifyTyphoonspot = exports.addTyphoonspot = exports.getTyphoonspot = undefined;

	var _typhoon = __webpack_require__(14);

	var _url = __webpack_require__(17);

	var _overlay = __webpack_require__(19);

	var overlay = _interopRequireWildcard(_overlay);

	var _typhoonDom = __webpack_require__(20);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var _areas = {};

	var _lines = ['firstTyLine', 'secondTyLine', 'thirdTyLine'];
	var _divIcons = ['firstTipDiv', 'secondTipDiv', 'thirdTipDiv'];
	var _classNames = ['distance-iconOne', 'distance-iconTwo', 'distance-iconThree'];
	var _allLayerId = ['firstTyLine', 'secondTyLine', 'thirdTyLine', 'firstTipDiv', 'secondTipDiv', 'thirdTipDiv'];

	var addCircle = function addCircle(lat, lon, radius, pointId) {
	  var opts = {
	    fillOpacity: 0.3,
	    weight: 1,
	    renderer: areaRenderer
	  };
	  var colors = [{ color: '#adb7c3', fillColor: '#adb7c3' }, { color: '#C18BA5', fillColor: '#C18BA5' }, { color: '#C6987E', fillColor: '#C6987E' }, { color: '#BCAF83', fillColor: '#BCAF83' }, { color: '#83CECB', fillColor: '#83CECB' }, { color: '#fcc', fillColor: '#fcc' }, { color: '#aaa', fillColor: '#aaa' }, { color: '#428CD5', fillColor: '#428CD5' }, { color: '#fff', fillColor: '#fff' }];
	  var colorsLen = radius.length - 1;
	  radius.map(function (r, index) {
	    var circle = L.circle([lat, lon], r * 1.852 * 1000, Object.assign({}, opts, colors[colorsLen - index]));
	    circle.id = 'circle';
	    circle.addTo(map);
	    _areas[pointId].layers.circle.push(circle);
	  });
	};
	var addCenterPoint = function addCenterPoint(point, pointId, bool, pData) {
	  var icon = L.divIcon({
	    className: 'warnPonit',
	    html: '<div class="' + (bool ? 'warn_point_on' : 'warn_point') + '"><div></div><div></div><div></div></div>'
	  });
	  var events = {
	    click: function click(e) {
	      $('#waveHeight').text(pData.waveHeight ? pData.waveHeight + 'm' : '');
	      $('#waveDir').text(pData.waveDir ? pData.waveDir : '');
	      $('#wavePeriod').text(pData.waveProid ? pData.waveProid + 's' : '');
	      $('#windPowers').text(pData.windPower ? pData.windPower + '级' : '');
	      $('#stormSurge').text(pData.windWater);
	      $('#windDirs').text(pData.windDirection ? pData.windDirection : '');


	      if ($('.simiMatch.on').length) $('.closeSimi').click();
	      $('.early_head').attr('pointid', pointId);
	      map.addEventListener('movestart', _typhoonDom.hidePreWarnPopup);
	      map.addEventListener('click', _typhoonDom.hidePreWarnPopup);
	      $('.tycontener_bottSeawave').stop().animate({ 'bottom': '-4.93rem' });
	      $('.early_warn').addClass('on').stop().animate({ bottom: '0rem' });
	      $('.imgEx,.tyCl_list,.cloudPopup').stop().animate({ 'bottom': 4.4 + 'rem' });
	    }
	  };
	  var marker = L.marker(point, { icon: icon });
	  for (var ev in events) {
	    marker.on(ev, events[ev]);
	  }marker.id = 'centerPoint';
	  marker.addTo(map);
	  _areas[pointId].layers.centerPoint = marker;
	};
	var getSelectTyIndex = function getSelectTyIndex() {
	  var arr = [];
	  $('#tyChangeWraper .layer-selected').map(function () {
	    var index = $(this).index();
	    arr.push(index);
	  });
	  return arr;
	};
	var addPolyline = function addPolyline(point, arr, pointId) {
	  var opts = {
	    color: 'red',
	    weight: 2,
	    dashArray: '4, 5',
	    dashOffset: '2',
	    renderer: areaRenderer
	  };
	  arr.map(function (i) {
	    var latlngs = [point, _typhoon.tyCenter[i]];
	    var polyline = L.polyline(latlngs, opts);
	    polyline.id = _lines[i];
	    polyline.addTo(map);
	    _areas[pointId].layers.polyline.push(polyline);
	  });
	};
	var addDistance = function addDistance(point, arr, pointId) {
	  arr.map(function (i) {
	    var distance = L.latLng(_typhoon.tyCenter[i]).distanceTo(point);
	    distance = (distance / 1000 / 1.852).toFixed(2) + '海里';
	    _areas[pointId].distances[i] = distance;
	  });
	};
	var addDivIcon = function addDivIcon(point, arr, pointId) {
	  arr.map(function (i) {
	    var tyName = $('#tyChange li').eq(i).find('a').text();
	    var distance = _areas[pointId].distances[i];
	    var opts = L.divIcon({
	      className: '' + _classNames[i],
	      html: '<div class="distanceIcon"><span></span><span>\u8DDD\u79BB' + tyName + '\u53F0\u98CE\u4E2D\u5FC3' + distance + '</span></div>'
	    });
	    var divIcon = L.marker(point, { icon: opts });
	    divIcon.id = _divIcons[i];
	    divIcon.addTo(map);
	    _areas[pointId].layers.divIcon.push(divIcon);
	  });
	};

	var getTyphoonspot = exports.getTyphoonspot = function getTyphoonspot() {
	  var userId = window.locationInfo.userId;

	  var url = _url._tyUrl.obtain();
	  return $.post({ url: url, dataType: 'json', data: { userId: userId } });
	};
	var addTyphoonspot = exports.addTyphoonspot = function addTyphoonspot(lat, lon, radius) {
	  var userId = '8dd76bbcad114776beb80c8514eb898d';
	  var url = _url._tyUrl.add();
	  var params = {
	    userId: userId,
	    lon: lon,
	    lat: lat,
	    radius: radius
	  };
	  return $.post({ url: url, dataType: 'json', data: params });
	};
	var modifyTyphoonspot = exports.modifyTyphoonspot = function modifyTyphoonspot(lat, lon, radius, typhoonid) {
	  var userId = window.locationInfo.userId;

	  var url = _url._tyUrl.modify();
	  var params = {
	    userId: userId,
	    lon: lon,
	    lat: lat,
	    radius: radius,
	    typhoonid: typhoonid
	  };
	  return $.post({ url: url, dataType: 'json', data: params });
	};
	var removeTyphoonpot = exports.removeTyphoonpot = function removeTyphoonpot(typhoonid) {
	  var userId = window.locationInfo.userId;

	  var url = _url._tyUrl.remove();
	  var params = {
	    userId: userId,
	    typhoonid: typhoonid
	  };
	  return $.post({ url: url, dataType: 'json', data: params });
	};

	var addArea = exports.addArea = function addArea(lat, lon, radius, pointId, bool, pData) {
	  lat = Number(lat);
	  lon = Number(lon);
	  var point = [lat, lon];
	  _areas[pointId] = {
	    point: point,
	    distances: {},
	    layers: {
	      circle: [],
	      centerPoint: null,
	      divIcon: [],
	      polyline: []
	    }
	  };
	  addCircle(lat, lon, radius, pointId);
	  addCenterPoint(point, pointId, bool, pData);
	  var selectedTyArr = getSelectTyIndex();
	  addPolyline(point, selectedTyArr, pointId);
	  addDistance(point, selectedTyArr, pointId);
	  addDivIcon(point, selectedTyArr, pointId);
	};

	var addAreaInfo = exports.addAreaInfo = function addAreaInfo(i) {
	  for (var key in _areas) {
	    var area = _areas[key];
	    addPolyline(area.point, [i], key);
	    if (!area.distances[i]) {
	      var distance = L.latLng(_typhoon.tyCenter[i]).distanceTo(area.point);
	      distance = (distance / 1000 / 1.852).toFixed(2) + '海里';
	      area.distances[i] = distance;
	    }

	    var tyName = $('#tyChange li').eq(i).find('a').text();
	    var opts = L.divIcon({
	      className: '' + _classNames[i],
	      html: '<div class="distanceIcon"><span></span><span>\u8DDD\u79BB' + tyName + '\u53F0\u98CE\u4E2D\u5FC3' + area.distances[i] + '</span></div>'
	    });
	    var divIcon = L.marker(area.point, { icon: opts });
	    divIcon.id = _divIcons[i];
	    divIcon.addTo(map);
	    _areas[key].layers.divIcon.push(divIcon);
	  }
	};

	var removeAreaInfo = exports.removeAreaInfo = function removeAreaInfo(i) {
	  map.eachLayer(function (layer) {
	    if (layer.id === _lines[i] || layer.id === _divIcons[i]) map.removeLayer(layer);
	  });
	};

	var removeSingleArea = exports.removeSingleArea = function removeSingleArea(pointId) {
	  for (var layer in _areas[pointId].layers) {
	    var l = _areas[pointId].layers[layer];
	    if (Array.isArray(l)) {
	      l.map(function (item) {
	        map.removeLayer(item);
	      });
	    } else map.removeLayer(l);
	  }
	  delete _areas[pointId];
	};

	var removeAllArea = exports.removeAllArea = function removeAllArea() {
	  map.eachLayer(function (layer) {
	    if (_allLayerId.indexOf(layer.id) !== -1) map.removeLayer(layer);
	  });
	  for (var key in _areas) {
	    _areas[key].layers.polyline = [];
	    _areas[key].layers.divIcon = [];
	  }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._tyUrl = undefined;

	var _Coder = __webpack_require__(18);

	var tyBaseUrl = 'http://119.29.102.103:18888/',
	    tyComUrl = '/user/post/,/';

	var _tyUrl = exports._tyUrl = {
	  obtain: function obtain() {
	    return tyBaseUrl + _Coder.Coder.encode('typhoonspot/obtain' + tyComUrl);
	  },
	  add: function add() {
	    return tyBaseUrl + _Coder.Coder.encode('typhoonspot/add' + tyComUrl);
	  },
	  remove: function remove() {
	    return tyBaseUrl + _Coder.Coder.encode('typhoonspot/remove' + tyComUrl);
	  },
	  modify: function modify() {
	    return tyBaseUrl + _Coder.Coder.encode('typhoonspot/modify' + tyComUrl);
	  }
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Coder = exports.Coder = {
	    str2Bytes: function str2Bytes(str) {
	        var bytes = new Array();
	        var len, c;
	        len = str.length;
	        for (var i = 0; i < len; i++) {
	            c = str.charCodeAt(i);
	            if (c >= 0x010000 && c <= 0x10FFFF) {
	                bytes.push(c >> 18 & 0x07 | 0xF0);
	                bytes.push(c >> 12 & 0x3F | 0x80);
	                bytes.push(c >> 6 & 0x3F | 0x80);
	                bytes.push(c & 0x3F | 0x80);
	            } else if (c >= 0x000800 && c <= 0x00FFFF) {
	                bytes.push(c >> 12 & 0x0F | 0xE0);
	                bytes.push(c >> 6 & 0x3F | 0x80);
	                bytes.push(c & 0x3F | 0x80);
	            } else if (c >= 0x000080 && c <= 0x0007FF) {
	                bytes.push(c >> 6 & 0x1F | 0xC0);
	                bytes.push(c & 0x3F | 0x80);
	            } else {
	                bytes.push(c & 0xFF);
	            }
	        }
	        return bytes;
	    },
	    legalChars: 'h7Y5-dAtlKjS8NQCyDIL0o1FUPxZinepcTwWbJ2qrkzB63s_gXmvfEuM4GHORaV9',
	    encode: function encode(s) {
	        var data = this.str2Bytes(s);
	        var data = this.randomData(data);
	        var srcLen = data.length;

	        var groupSize = Math.floor(srcLen / 3);
	        var pairLen = groupSize * 3;
	        var dstLen = groupSize * 4 + (pairLen == srcLen ? 0 : 4);
	        var buf = '';

	        for (var grpPos = 0; grpPos < groupSize; grpPos++) {
	            var p = grpPos * 3;
	            var d = (data[p] & 0xff) << 16 | (data[p + 1] & 0xff) << 8 | data[p + 2] & 0xff;
	            buf += this.legalChars.charAt(d >> 18 & 63);
	            buf += this.legalChars.charAt(d >> 12 & 63);
	            buf += this.legalChars.charAt(d >> 6 & 63);
	            buf += this.legalChars.charAt(d & 63);
	        }
	        if (srcLen - pairLen == 2) {
	            var p = pairLen;
	            var d = (data[p] & 0xff) << 16 | (data[p + 1] & 0xff) << 8;
	            buf += this.legalChars.charAt(d >> 18 & 63);
	            buf += this.legalChars.charAt(d >> 12 & 63);
	            buf += this.legalChars.charAt(d >> 6 & 63);
	        } else if (srcLen - pairLen == 1) {
	            var p = pairLen;
	            var d = (data[p] & 0xff) << 16;
	            buf += this.legalChars.charAt(d >> 18 & 63);
	            buf += this.legalChars.charAt(d >> 12 & 63);
	        }
	        return buf;
	    },
	    randomData: function randomData(data) {
	        var len = data.length;
	        if (len < 8) return data;
	        var datNew = new Array(len + 1);
	        var rb = Math.floor(Math.random() * 200) + 55;
	        for (var i = 0; i < 7; i++) {
	            datNew[i] = data[i] ^ rb;
	        }
	        datNew[7] = rb;
	        for (var i = 7; i < len; i++) {
	            datNew[i + 1] = data[i] ^ rb;
	        }
	        return datNew;
	    }
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var _overlays = new Object();

	var getMapInfo = exports.getMapInfo = function getMapInfo() {
		var container = $("#" + map.getContainer().id);
		var bounds = map.getBounds();
		var sw = bounds.getSouthWest(),
		    ne = bounds.getNorthEast();
		sw = L.Util.GPS.gcjToWgs(sw.lat, sw.lng);
		ne = L.Util.GPS.gcjToWgs(ne.lat, ne.lng);
		return {
			bounds: bounds,
			sw: sw,
			ne: ne,
			pos: {
				width: container.width(),
				height: container.height(),
				top: ne.lat,
				bottom: sw.lat,
				left: sw.lon,
				right: ne.lon
			}
		};
	};

	var addImageOverlay = exports.addImageOverlay = function addImageOverlay(id, url, bounds) {
		var imgLayer = L.imageOverlay(url, bounds, { zIndex: 300 });
		imgLayer.id = id;
		_overlays[id] = imgLayer;
		imgLayer.addTo(map);
		var _id = ' ' + id;
		imgLayer._image.className += _id;
	};

	var addBusinessOverlay = exports.addBusinessOverlay = function addBusinessOverlay(id, url, bounds, options) {
		if (_overlays[id] && map.hasLayer(_overlays[id])) _overlays[id].setUrlAutoFit(url);else {
			var opts = options || {};
			var overlay = L.businessOverlay(url, bounds, opts);
			overlay.id = id;
			_overlays[id] = overlay;
			overlay.addTo(map);
		}
	};

	var addMarker = exports.addMarker = function addMarker(id, latlng, options, events, extraOpts) {
		var opts = options || {};
		var marker = L.marker(latlng, opts);
		marker.id = id;
		options.label && marker.bindLabel(options.label);
		if (!$.isEmptyObject(events)) {
			for (var ev in events) {
				marker.on(ev, events[ev]);
			}
		}
		if (!$.isEmptyObject(extraOpts)) {
			for (var i in extraOpts) {
				marker[i] = extraOpts[i];
			}
		}
		marker.addTo(map);
	};

	var removeOverlay = exports.removeOverlay = function removeOverlay(arr) {
		if (typeof arr != "string" && !(arr instanceof Array)) return;
		var layers = arr instanceof Array ? arr : [arr];
		for (var i = 0; i < layers.length; i++) {
			var id = layers[i];
			if (id in _overlays && map.hasLayer(_overlays[id])) {
				map.removeLayer(_overlays[id]);
				delete _overlays[id];
			} else {
				map.eachLayer(function (layer) {
					if (layer.id == id) map.removeLayer(layer);
				});
			}
		}
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.hidePreWarnPopup = undefined;

	var _getSimilarTy = __webpack_require__(21);

	var _seawaveDom = __webpack_require__(22);

	var _tips = __webpack_require__(24);

	var _alarmArea = __webpack_require__(16);

	var _area = _interopRequireWildcard(_alarmArea);

	var _judgeArea = __webpack_require__(27);

	var _wind = __webpack_require__(23);

	var _viewer = __webpack_require__(26);

	var _overlay = __webpack_require__(19);

	var overlay = _interopRequireWildcard(_overlay);

	var _boundary2 = __webpack_require__(25);

	var _boundary3 = _interopRequireDefault(_boundary2);

	var _newsTip = __webpack_require__(29);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var tyInterval = setInterval(function () {
	    var fstAreas = window.fstAreas;
	    if (window.locationInfo && (fstAreas === false || Array.isArray(fstAreas) && fstAreas.length === currentTyNum)) {
	        initTySpot();
	        clearInterval(tyInterval);
	    }
	}, 500);
	var spots_global = {};

	var initTySpot = function initTySpot() {
	    _area.getTyphoonspot().then(function (res) {
	        console.log(res);
	        if (res.result !== 'S_OK') return;
	        var spots = res.tagObject.spots;

	        var hasSZPoint = false;var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = spots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var spot = _step.value;

	                if (spot.lon === 113.92 && spot.lat === 22.48) {
	                    hasSZPoint = true;
	                    break;
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }

	        if (!hasSZPoint) {
	            _area.addTyphoonspot('22.48', '113.92', [200, 400, 600, 800]).then(function (res) {
	                initTySpot();
	            });
	        } else {
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                var _loop = function _loop() {
	                    var spot = _step2.value;

	                    spots_global[spot.typhoonspotid] = spot;
	                    var lat = spot.lat,
	                        lon = spot.lon,
	                        radius = spot.radius,
	                        typhoonspotid = spot.typhoonspotid;
	                    if (!Array.isArray(radius)) return 'continue';
	                    var radiusArr = radius.sort(function (a, b) {
	                        return a < b;
	                    });
	                    var maxRadiu = radiusArr[0];
	                    var bool = (0, _judgeArea.judge)(lat, lon, maxRadiu);
	                    getInterpPoints(lon, lat).then(function (res) {
	                        if (res.windPower >= 7) bool = true;
	                        _area.addArea(lat, lon, radius, typhoonspotid, bool, res);
	                    });
	                };

	                for (var _iterator2 = spots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var _ret = _loop();

	                    if (_ret === 'continue') continue;
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                        _iterator2.return();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }

	            console.log(spots_global);
	        }
	    });
	};
	var getInterpPoints = function getInterpPoints(lon, lat) {
	    var date = new Date().Format('yyyy/MM/dd 20:00:00');
	    date = new Date(date).getTime();
	    var nowTime = Date.now();
	    if (date < nowTime) {
	        date = new Date().Format('yyyy-MM-dd 08:00:00');
	    } else {
	        date = date - 24 * 60 * 60 * 1000;
	        date = new Date(date).Format('yyyy-MM-dd 08:00:00');
	    }

	    var url = 'http://119.29.102.103:8111/Alarm/getInterpPoints?datetime=' + date + '&leadtime=0&points[0][]=' + lon + '&points[0][]=' + lat + '&cacheCtrl=' + Date.now();
	    var stormUrl = 'http://119.29.102.103:8111/Alarm/getTideInterpPoints?datetime=' + date + '&leadtime=0&points[0][]=' + lon + '&points[0][]=' + lat + '&cacheCtrl=' + Date.now();
	    var data = void 0;
	    return new Promise(function (resolve, reject) {
	        $.ajax({ url: url }).then(function (res) {
	            if (/DB_ERROR/.test(res) || /null/.test(res) || !res.length) {
	                reject();
	                return;
	            }
	            data = res[0];
	            for (var i in data) {
	                if (/null/.test(data[i]) || data[i] === -999.9) data[i] = '';
	            }
	            if (data.windPower) data.windPower = (0, _wind.getVelLevel)(data.windPower);
	            if (data.windDirection) data.windDirection = (0, _wind.getDirLevel)(data.windDirection);
	            if (data.waveHeight) data.waveHeight = data.waveHeight.toFixed(2);
	            if (data.waveProid) data.waveProid = data.waveProid.toFixed(2);
	            if (data.waveDir) data.waveDir = (0, _wind.getDirLevel)(data.waveDir).replace('风', '');
	            return $.ajax({ url: stormUrl });
	        }).then(function (msg) {
	            if (!msg || /DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) data.windWater = 0;
	            data.windWater = msg[0];
	            if (data.windWater) data.windWater = data.windWater.toFixed(2);else data.windWater = 0;
	            resolve(data);
	        });
	    });
	};

	var simObj = {
	    similar: '.typhoon_cusWin'
	};
	var susNavObj = {
	    typhoon: '#tyChangeWraper',
	    seaWave: '.tycontener_bottSeawave',
	    cloud: '#cloudOverlay',
	    thunder: '.rainstormImg',
	    buoy: '.buoy_bott'
	};
	$('#tyswNav>ul>li').on('click', function () {
	    hidePreWarnPopup();
	    if (val !== 'typhoon' && $('.simiMatch').hasClass('on')) $('.closeSimi').click();
	    if ($('.cloudMap ul li img.on').length) $('.cloudMap ul li img.on').click();
	    if ($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click();
	    if ($('.imgEx').hasClass('on')) $('.imgEx').click();

	    var val = $(this).attr('name');
	    var url = void 0;
	    if ($(this).hasClass('a')) {
	        if (val === 'typhoon' && !$('#tyChangeWraper li.layer-selected').length || val === 'cloud' && !$('#cloudOverlay li.on').length || val === 'thunder' && !$('.rainstormImg li.on').length) {
	            $(this).removeClass('on');
	        }
	        $(susNavObj[val]).hide();
	    } else {
	        if (val === 'seawave') {
	            if ($(this).hasClass('on')) {
	                deleteOcean();
	                (0, _newsTip.removeNewsTip)('seawave');
	            } else {
	                (0, _seawaveDom.getSeawaveData)();
	                $('.buoy_bott').removeClass('on').stop().animate({ bottom: '-5.8rem' });
	                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	            }
	            $(this).toggleClass('on');
	        } else if (val === 'buoy') {
	            if ($(this).hasClass('on')) deleBuoyData();else {
	                getBuoyData();
	                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	            }
	            $(this).toggleClass('on');
	        } else if (val === 'thunder') {
	            if ($('.rainForecast').hasClass('on')) {
	                $('.rainProgressbar').stop().animate({ 'bottom': '0rem' }).addClass('on');
	                $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '3.33rem' });
	            } else {
	                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	            }
	            $(this).addClass('on');
	        } else {
	            $(this).addClass('on');
	        }

	        if (val !== 'thunder') {
	            if ($('.rainForecast').hasClass('on')) {
	                $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }).removeClass('on');
	                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	            }
	        }

	        if (val !== 'typhoon') toggleNavSel('#tyChangeWraper', '.layer-selected', '.tyList');
	        if (val !== 'cloud') toggleNavSel('#cloudOverlay', '.on', '.rdList');
	        if (val !== 'thunder') toggleNavSel('.rainstormImg', '.on', '.tsList');

	        for (var i in susNavObj) {
	            if (i === 'typhoon' || i === 'cloud' || i === 'thunder') $(susNavObj[i]).hide();
	        }

	        if (val !== 'seawave' && val !== 'buoy') $(susNavObj[val]).show();
	    }
	    $(this).siblings().removeClass('a');
	    if (val !== 'seawave' && val !== 'buoy') $(this).toggleClass('a');
	});

	var toggleNavSel = function toggleNavSel(child, classN, parent) {
	    if (!$(child + ' li' + classN).length) {
	        $(child).parents(parent).removeClass('on');
	    }
	};
	var deleteOcean = function deleteOcean() {
	    (0, _seawaveDom.delBoundary)();
	    if ($('.tycontener_bottSeawave').hasClass('on')) {
	        $('.tycontener_bottSeawave').removeClass('on').stop().animate({ 'bottom': '-5.4rem' });
	        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    }
	};

	$('.tySimilar>ul>li').on('click', function () {
	    var _this = this;

	    if ($('.simiMatch').hasClass('on')) $('.closeSimi').click();
	    $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }).removeClass('on');
	    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    hidePreWarnPopup();
	    $('.imgEx.on').click();
	    $('.cloudMap ul li img.on').click();
	    var val = $(this).attr('name'),
	        $img = $(this).children('img'),
	        imgUrl = $img.data('url');
	    $img.attr('src', imgUrl);

	    $('#tyswNav>ul>li.a').click();

	    if ($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click();

	    if (val === 'similar') {
	        (function () {
	            $(_this).addClass('on');
	            $(simObj[val]).show();

	            var tsObj = {};
	            $('#tyChange .layer-selected').map(function () {
	                var $child = $(this).find('a'),
	                    tsid = $child.attr('tsid'),
	                    name = $child.text();
	                tsObj[tsid] = name;
	            });
	            $('.cusDetales_centerTy select option').remove();
	            var html = '';
	            for (var i in tsObj) {
	                html = '<option value="' + i + '">' + tsObj[i] + '</option>' + html;
	            }
	            $('.cusDetales_centerTy select').html(html);
	        })();
	    }
	});

	function hideSim(popup, num) {
	    $(popup).hide();
	    var $target = $('.tySimilar ul li').eq(num);
	    $target.removeClass('on');
	    var url = $target.find('img').data('url').replace('_pre', '');
	    $target.find('img').attr('src', url).removeClass('on');
	}

	$('.typhoon_close,.cusDetales_cancleTy').on('click', function () {
	    hideSim('.typhoon_cusWin', 0);
	});

	$('.cusDetales_confirmTy').on('click', function () {
	    hideSim('.typhoon_cusWin', 0);
	    var tsid = $('.cusDetales_centerTy select').val(),
	        lon = $('input[name="lon"]').val(),
	        lat = $('input[name="lat"]').val(),
	        angle = $('input[name="angle"]').val(),
	        anglediff = $('input[name="anglediff"]').val(),
	        speed = $('input[name="speed"]').val(),
	        speeddiff = $('input[name="speeddiff"]').val(),
	        strength = $('input[name="strength"]').val();
	    (0, _getSimilarTy.getSimilarTy)(tsid, lon, lat, angle, anglediff, speed, speeddiff, strength);
	});

	$('.simiTyHide').on('click', function () {
	    if ($(this).hasClass('on')) {
	        var simiMatchHeight = $('.simiMatch').height();
	        $('.simiMatch').css({ transform: 'translateY(0%)', bottom: '0' });
	        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': simiMatchHeight + 30 + 'px' });
	    } else {
	        $('.simiMatch').css({ transform: 'translateY(100%)', bottom: '1.2rem' });
	        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '1.766667rem' });
	    }
	    $(this).toggleClass('on');
	});

	$('.closeSimi').on('click', function () {
	    if ($('.simiTyHide').hasClass('on')) $('.simiTyHide').removeClass('on');
	    $('.simiMatch').css({ transform: 'translateY(100%)', bottom: 0 }).removeClass('on');
	    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    $('#simTyphoon ul li.simSelected').map(function () {
	        $(this).click();
	    });
	});

	function togglePop($this, $pop) {
	    var url = $this.data('url');
	    if ($this.hasClass('on')) url = url.replace('_pre', '');
	    $this.attr('src', url).toggleClass('on');
	    $pop.toggle();
	}
	$('.cloudMap ul li img').on('click', function () {
	    $('.imgEx.on').click();

	    var className = $(this).data('class'),
	        $pop = $('.' + className);
	    togglePop($(this), $pop);

	    var $bro = $(this).parent('li').siblings('.tyListUl_com').find('img');
	    if ($bro.hasClass('on')) {
	        var broUrl = $bro.data('url').replace('_pre', '');
	        $bro.attr('src', broUrl).removeClass('on');
	        $('.' + $bro.data('class')).hide();
	    }

	    if ($('.cloudMap ul li img.on').length) $('#tyswNav>ul>li.a').click();
	});
	$('.typhoonList,.cloudMap ul li:nth-child(2)').on('click', function () {
	    if ($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click();
	});

	$('#makePolicy').on('click', function () {
	    $('.early_warn').removeClass('on').show().stop().animate({ bottom: '-4.4rem' });
	    $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }).removeClass('on');
	    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    if ($('.simiMatch').hasClass('on')) $('.closeSimi').click();
	    if ($(this).hasClass('on')) {
	        if (map.hasEventListeners('click', getLatLngEvent)) {
	            map.removeEventListener('click', getLatLngEvent);
	            $('.getLonLat').hide();
	        }
	        var url = $(this).find('img').data('url').replace('_pre', '');
	        $(this).find('img').attr('src', url);
	    } else {
	        var dataUrl = $('#makePolicy').find('img').data('url');
	        $(this).find('img').attr('src', dataUrl);
	        $('.cusLonLat_cusWin').show();
	    }
	    $("input[name='longitude'],input[name='latitude'],input[name='radius']").val('');
	    $(this).toggleClass('on');
	});

	var closeAreaPopup = function closeAreaPopup() {
	    $('.cusLonLat_cusWin').hide();
	    var $target = $('#makePolicy');
	    $target.removeClass('on');
	    $target.find('img').removeClass('on');
	    var url = $target.find('img').data('url').replace('_pre', '');
	    $target.find('img').attr('src', url);
	};

	$('.cusLonLat_close').on('click', function () {
	    closeAreaPopup();
	});

	$('#customGet').on('click', function () {
	    $('.cusLonLat_cusWin').hide();
	    var tooltip = '<div class=\'getLonLat\'>\u70B9\u51FB\u5730\u56FE\u83B7\u53D6\u7ECF\u7EAC\u5EA6 </div>';
	    $("body").append(tooltip);
	    $(".getLonLat").show();

	    map.on('click', getLatLngEvent);
	    var lonData = $("input[name='longitude']").val(),
	        latData = $("input[name='latitude']").val(),
	        radiusData = $("input[name='radius']").val();
	});

	$('#customConfirm').on('click', function () {
	    var lonData = $("input[name='longitude']").val(),
	        latData = $("input[name='latitude']").val();
	    var rArr = [];
	    $("input[name='radius']").map(function () {
	        var val = Number($(this).val());

	        if (val) rArr.push(val);
	    });
	    rArr.sort(function (a, b) {
	        return a > b;
	    });
	    if (!lonData || !latData || !rArr.length) (0, _tips.getNoDataTips)('.hint_noNull');else addTyphoonspot(latData, lonData, rArr);
	});

	var getLatLngEvent = function getLatLngEvent(pos) {
	    $(".getLonLat").remove();
	    $('.cusLonLat_cusWin').fadeIn(function () {
	        var latlng = pos.latlng;
	        var longitude = latlng.lng.toFixed(5),
	            latitude = latlng.lat.toFixed(5);
	        $('input[name="longitude"]').val(longitude);
	        $('input[name="latitude"]').val(latitude);
	    });
	    map.off('click', getLatLngEvent);
	};

	var addTyphoonspot = function addTyphoonspot(lat, lon, radius) {
	    _area.addTyphoonspot(lat, lon, radius).then(function (res) {
	        if (res.result !== 'S_OK') return;
	        var pointId = res.tagObject.typhoonspotid;
	        var radiusArr = radius.sort(function (a, b) {
	            return a < b;
	        });
	        var maxRadiu = radiusArr[0];
	        var bool = (0, _judgeArea.judge)(lat, lon, maxRadiu);
	        getInterpPoints(lon, lat).then(function (res) {
	            if (res.windPower >= 7) bool = true;
	            _area.addArea(lat, lon, radius, pointId, bool, res);
	        });
	        spots_global[pointId] = res.tagObject;
	    });
	    closeAreaPopup();
	};

	$('.imgEx').on('click', function () {
	    $('.imgEx_details').toggle();
	    $(this).toggleClass('on');
	    $('.cloudMap ul li:nth-child(2) img').removeClass('on');
	    var url = $('.cloudMap ul li:nth-child(2) img').data('url').replace('_pre', '');
	    $('.cloudMap ul li:nth-child(2) img').attr('src', url);
	    $('.mapImg').hide();

	    if ($('.cloudMap ul li:nth-child(1).on').length) $('.cloudMap ul li.on').eq(0).click();
	    closeAreaPopup();
	});

	var mapEvent = function mapEvent() {
	    $('.buoy_bott').removeClass('on').stop().animate({ bottom: '-5.8rem' });
	    if ($('#tyswNav>ul>li').eq(1).hasClass('on') && _seawaveDom.hasData) return;
	    if ($('.early_warn').hasClass('on')) return;
	    if ($('.simiMatch').hasClass('on')) return;
	    if ($('.rainProgressbar').hasClass('on')) return;
	    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	};
	var contEvent = function contEvent(e) {
	    if ($(e.target).attr('src') == 'assets/typhoon_forecast@3x.png') return;
	    if ($(e.target).is('.imgEx') || $(e.target).is('.imgEx *')) return;
	    if ($(e.target).is('.cloudMap .tyListUl_com:nth-child(2)') || $(e.target).is('.cloudMap .tyListUl_com:nth-child(2) *')) return;
	    if ($(e.target).is('.buoy_bott') || $(e.target).is('.buoy_bott *')) return;
	    mapEvent();
	};

	var getBuoyData = function getBuoyData() {
	    var nowTime = new Date().Format('yyyy-MM-dd HH:mm');
	    $('.now_time').text(nowTime);
	    var time = new Date().Format('yyyy/MM/dd HH:mm:00');
	    time = new Date(time).getTime();
	    time = time - time % (10 * 60 * 1000) - 10 * 60 * 1000;
	    time = new Date(time).Format('yyyy-MM-dd HH:mm:00');

	    var buoyUrl = 'http://119.29.102.103:8111/roa1080/discrete/buoy/d3/V22041%3bV22042%3bV22043%3bV22044%3bV22062%3bV22062_001%3bV23001%3bV23001_001%3bV23002%3bV23002_001%3bV23003%3bV23003_001%3bV23004%3bV23004_001%3bV23005%3bV23006%3bV23007%3bV23007_001,' + time + '/JSON?cacheCtrl=' + Date.now();
	    $.ajax({ url: buoyUrl }).then(function (data) {
	        if (/DB_ERROR/.test(data)) {
	            (0, _tips.getNoDataTips)('.buoy_noData');return;
	        }
	        data = JSON.parse(data);

	        $('.conteners').click(contEvent);
	        map.addEventListener('movestart', mapEvent);

	        var buoyIcon = L.icon({
	            iconUrl: 'assets/typhoon_forecast@3x.png',
	            iconSize: [25, 25],
	            iconAnchor: [0, 0]
	        });
	        var buoyLabel = L.divIcon({
	            className: 'ty-name-label',
	            html: '<span class="buoyLabel">\u6D6E\u6807\u9884\u8B66\u70B9</span>'
	        });

	        data.map(function (info) {
	            var center = [info.lat, info.lon];
	            var events = {
	                click: function click(e) {
	                    $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }).removeClass('on');
	                    if ($('.tycontener_bottSeawave').hasClass('on')) {
	                        $('.tycontener_bottSeawave').removeClass('on').stop().animate({ bottom: '-5.4rem' });
	                        if ($('.buoy_bott').hasClass('on')) $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '6.466667rem' });else $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	                    }
	                    if ($('.early_warn').hasClass('on')) $('.early_warn').removeClass('on').stop().animate({ bottom: '-4.4rem' });
	                    if ($('.simiMatch.on').length) $('.closeSimi').click();
	                    $('#buoyPos').text(Math.round(Number(info.V22041) * 100) / 100 === 9999 ? '--' : (0, _wind.getDirLevel)(Math.round(Number(info.V22041) * 100) / 100).replace('风', ''));
	                    $('#aboveTem').text(Math.round(Number(info.V22042) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V22042) * 100) / 100 + '℃');
	                    $('#highTem').text(Math.round(Number(info.V22043) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V22043) * 100) / 100 + '℃');
	                    $('#lowTem').text(Math.round(Number(info.V22044) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V22044) * 100) / 100 + '℃');
	                    $('#effWaveHigh').text(Math.round(Number(info.V23002) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23002) * 100) / 100 + 'm');
	                    $('#effWaveHighPriod').text(Math.round(Number(info.V23002_001) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23002_001) * 100) / 100 + 'm/s');
	                    $('#aveWaveHigh').text(Math.round(Number(info.V23003) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23003) * 100) / 100 + 'm');
	                    $('#aveWaveHighPriod').text(Math.round(Number(info.V23003_001) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23003_001) * 100) / 100 + 'm/s');
	                    $('#bigestWaveHigh').text(Math.round(Number(info.V23004) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23004) * 100) / 100 + 'm');
	                    $('#bigestWaveHighPriod').text(Math.round(Number(info.V23004_001) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23004_001) * 100) / 100 + 'm/s');
	                    $('#oceanFlowSpeed').text(Math.round(Number(info.V23005) * 100) / 100 === 9999 ? '--' : Math.round(Number(info.V23005) * 100) / 100 + 'm/s');
	                    $('#oceanWaveDir').text(Math.round(Number(info.V23006) * 100) / 100 === 9999 ? '--' : (0, _wind.getDirLevel)(Math.round(Number(info.V23006) * 100) / 100).replace('风', ''));
	                    $('.buoy_bott').addClass('on').show().stop().animate({ bottom: 0 });
	                    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '6.466667rem' });
	                    $('.buoy_bott').click(function (e) {
	                        e.stopPropagation();
	                    });
	                }
	            };
	            var options = {
	                icon: buoyIcon,
	                zIndexOffset: 1000
	            };
	            overlay.addMarker('buoyPoint', center, options, events);
	            overlay.addMarker('buoyPoint', center, { icon: buoyLabel }, events);
	        });
	        (0, _viewer.viewerCor)();
	    });
	};

	var deleBuoyData = function deleBuoyData() {
	    overlay.removeOverlay('buoyPoint');
	    $('.conteners').unbind('click', contEvent);
	    map.removeEventListener('movestart', mapEvent);
	    if ($('.buoy_bott').hasClass('on')) {
	        $('.buoy_bott').removeClass('on').stop().animate({ bottom: '-5.8rem' });
	        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    }
	};

	$('.warnModify').on('click', function () {
	    hidePreWarnPopup();
	    var pointId = $('.early_head').attr('pointid');
	    $('#modifyPointLon').val(spots_global[pointId].lon);
	    $('#modifyPointLat').val(spots_global[pointId].lat);
	    var html = '';
	    spots_global[pointId].radius.map(function (r) {
	        html = '<div class="wrapperMod clearfix"><dt>\u534A\u5F84</dt><dd class="radiusIn"><input type="number" name="modifyRadius" value="' + r + '">\u6D77\u91CC<span class="modifyDel"></span></dd></div>' + html;
	    });
	    $('.preWarnDetales_center .wrapper').html(html);
	    $('.preWarnDetales_center .wrapper .radiusIn').eq(-1).find('span').removeClass('modifyDel').addClass('modifyAdd');
	    $('.preWarn_cusWin').show();
	});

	$('.preWarnDetales_center').on('click', '.modifyDel', function () {
	    var $parent = $(this).parent('.radiusIn');
	    $parent.prev().remove();
	    $parent.remove();
	});

	$('.preWarnDetales_center').on('click', '.modifyAdd', function () {
	    $(this).removeClass('modifyAdd').addClass('modifyDel');
	    $('.preWarnDetales_center .wrapper').append('<dt>\u534A\u5F84</dt><dd class="radiusIn"><input type="number" name="modifyRadius">\u6D77\u91CC<span class="modifyAdd"></span></dd>');
	    var height = $('.preWarnDetales_center .wrapper dt').size() * 1.25 * 75;
	    $('.preWarnDetales_center .wrapper').scrollTop(height);
	});

	$('#preWarnConfirm').on('click', function () {
	    var radius = [];
	    $('input[name="modifyRadius"]').each(function () {
	        if ($(this).val()) radius.push(Number($(this).val()));
	    });
	    radius.sort(function (a, b) {
	        return a < b;
	    });
	    if (!$('#modifyPointLon').val() || !$('#modifyPointLat').val() || !radius.length) {
	        (0, _tips.getNoDataTips)('.hint_noNull');
	        return;
	    }
	    var lat = $('#modifyPointLat').val(),
	        lon = $('#modifyPointLon').val(),
	        pointId = $('.early_head').attr('pointid');
	    _area.modifyTyphoonspot(lat, lon, radius, pointId).then(function (data) {
	        if (data.result === 'S_OK') {
	            (function () {
	                _area.removeSingleArea(pointId);
	                var radiusArr = radius.sort(function (a, b) {
	                    return a < b;
	                });
	                var radiusArrLen = radiusArr.length - 1;
	                var maxRadiu = radiusArr[0];
	                var bool = (0, _judgeArea.judge)(lat, lon, maxRadiu);
	                getInterpPoints(lon, lat).then(function (res) {
	                    if (res.windPower >= 7) bool = true;
	                    _area.addArea(lat, lon, radius, pointId, bool, res);
	                });
	                spots_global[pointId] = { lat: lat, lon: lon, radius: radius, typhoonspotid: pointId };
	                $('.preWarn_cusWin').hide();
	            })();
	        } else alert(data.description);
	    });
	});

	$('.preWarnDetales_close,#preWarnCancel').on('click', function () {
	    $('.preWarn_cusWin').hide();
	});

	$('.warnDel').on('click', function () {
	    var pointId = $('.early_head').attr('pointid');
	    _area.removeTyphoonpot(pointId).then(function (data) {
	        if (data.result === 'S_OK') {
	            _area.removeSingleArea(pointId);
	            delete spots_global[pointId];
	            hidePreWarnPopup();
	        } else {
	            alert(data.description);
	        }
	    });
	});
	var hidePreWarnPopup = exports.hidePreWarnPopup = function hidePreWarnPopup() {
	    if ($('.early_warn').hasClass('on') === false) return;
	    $('.early_warn').removeClass('on').show().stop().animate({ bottom: '-4.4rem' });
	    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': 0.6667 + 'rem' });
	};

	$('.cusDetales_center').on('click', '#addRadius', function () {
	    $(this).removeAttr('id').removeClass('add').addClass('del');
	    var radiusDiv = '<div class="wrapperDiv clearfix"><dt>\u534A\u5F84</dt><dd class="radiusIn"><input type="number" name="radius">\u6D77\u91CC<span class="add" id="addRadius"></span></dd></div>';
	    var $wrapper = $('#cusDetalesCenterDl .wrapper');
	    $wrapper.append(radiusDiv);
	    var height = $('#cusDetalesCenterDl .wrapper dt').size() * 1.25 * 75;
	    $wrapper.scrollTop(height);
	});

	$('.cusDetales_center').on('click', '.del', function () {
	    $(this).parents('.wrapperDiv').remove();
	});

	var calcScrollPos = function calcScrollPos() {
	    var height = $('#cusDetalesCenterDl .wrapper dt').size() * 1.25;
	    $('#cusDetalesCenterDl .wrapper').scrollTop(height);
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getSimilarTy = undefined;

	var _ZmapHelper = __webpack_require__(15);

	var getSimilarTy = exports.getSimilarTy = function getSimilarTy(tsid) {
	  var lon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
	  var lat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
	  var angle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
	  var anglediff = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 30;
	  var speed = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 30;
	  var speeddiff = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 30;
	  var strength = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 30;

	  if (!tsid) return;
	  $('#simTyphoon ul .similarTyInner').remove();
	  var url = 'http://119.29.102.103:8111/roa1080/discrete/typhoon/d10/' + tsid + ',' + new Date().Format('yyyy-MM-dd HH:00:00') + ',' + lon + ',' + lat + ',' + angle + ',' + anglediff + ',' + speed + ',' + speeddiff + ',' + strength + '/JSON?cacheCtrl=' + Date.now();

	  $.ajax({ url: url }).then(function (data) {
	    if (typeof data === 'string' & /DB_ERROR/.test(data)) {
	      getNoSimi();
	      if ($('.simiMatch').hasClass('on')) $('.closeSimi').click();
	      removeAllSimTy();
	      return;
	    }
	    data = JSON.parse(data);
	    var typhoon = data[0].string;

	    var prArr = [];
	    typhoon.map(function (info) {
	      info.replace(/(\d*),(\d*),(.*?),/, function ($0, $1, $2, $3) {
	        var tyid = $1;
	        prArr.push(new Promise(function (resolve, reject) {
	          $.ajax({ url: 'http://119.29.102.103:8111/roa1080/discrete/typhoon/d2/' + tyid + ',BCGZ/JSON?cacheCtrl=' + Date.now() }).then(function (res) {
	            if (typeof res === 'string' & /DB_ERROR/.test(res)) reject();else {
	              res = JSON.parse(res);
	              var tscname = res[0].tscname;
	              if (tscname) $('#simTyphoon ul').prepend('<li class="similarTyInner" tyid="' + tyid + '"><a>' + tscname + '</a></li>');
	              resolve();
	            }
	          });
	        }));
	      });
	    });

	    Promise.all(prArr).then(function () {
	      var simiMatchHeight = $('.simiMatch').height();
	      $('.simiMatch').css({ 'transform': 'translateY(0%)', bottom: 0 }).addClass('on');
	      $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({ 'bottom': simiMatchHeight + 30 + 'px' });
	    });
	  });
	};

	var getNoSimi = function getNoSimi() {
	  $('.hint_noSimiTy').fadeIn(1000, function () {
	    setTimeout(function () {
	      $('.hint_noSimiTy').fadeOut();
	    }, 1000);
	  });
	};

	var similarTyLayer = {};
	var drawSimilayTy = function drawSimilayTy(tyid, data) {
	  if (similarTyLayer[tyid]) {
	    map.removeLayer(similarTyLayer[tyid]);
	    delete similarTyLayer[tyid];
	    return;
	  }

	  data = data[0];
	  if (tyid) tyid = data.tsid;
	  data.real.reverse();
	  data.real.map(function (info) {
	    info.datetime = info.time;
	    info.lon = Number(info.lon);
	    info.lat = Number(info.lat);
	  });
	  if (data.fst && data.fst.length) {
	    data.fst.map(function (info) {
	      info.datetime = info.time;
	      info.lon = Number(info.lon);
	      info.lat = Number(info.lat);
	      info.leadtime = Number(info.leadtime);
	    });
	  }
	  var helper = new _ZmapHelper.ZmapHelper(map, window.positionCenter);
	  var lyGp = helper.drawTy(data);
	  similarTyLayer[tyid] = lyGp.tyLayerGroup;
	  map.addLayer(similarTyLayer[tyid]);
	  lyGp.layersGoesBack.map(function (el) {
	    el.layer.bringToBack();
	  });

	  var tyReal = data.real,
	      realLen = tyReal.length;
	  var point = [tyReal[realLen - 1].lat, tyReal[realLen - 1].lon];
	  map.setView(point, 4);
	};

	var removeAllSimTy = function removeAllSimTy() {
	  for (var i in similarTyLayer) {
	    map.removeLayer(similarTyLayer[i]);
	  }similarTyLayer = {};
	};

	$('#simTyphoon').on('click', '.similarTyInner', function () {
	  $(this).toggleClass('simSelected');
	  var tyid = $(this).attr('tyid');
	  if ($(this).hasClass('simSelected')) {
	    var url = 'http://119.29.102.103:8111/roa1080/discrete/typhoon/d2/' + tyid + ',BCGZ/JSONP/?cacheCtrl=' + Date.now();

	    $.ajax({ url: url }).then(function (data) {
	      if (typeof data === 'string' & /DB_ERROR/.test(data)) return;
	      drawSimilayTy(tyid, JSON.parse(data));
	    });
	  } else {
	    drawSimilayTy(tyid);
	  }
	});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.delBoundary = exports.delMarker = exports.getSeawaveData = exports.hasData = undefined;

	var _overlay = __webpack_require__(19);

	var overlay = _interopRequireWildcard(_overlay);

	var _wind = __webpack_require__(23);

	var _tips = __webpack_require__(24);

	var _boundary2 = __webpack_require__(25);

	var _boundary3 = _interopRequireDefault(_boundary2);

	var _viewer = __webpack_require__(26);

	var _newsTip = __webpack_require__(29);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var currentArea = void 0;
	var seaData = {
	  24: {},
	  48: {}
	};
	var oceanData = [];
	var currentAreaMsg = {};
	var areaCorrObj = {
	  汕头附近海面: '广东东部海面',
	  汕尾附近海面: '广东东部海面',
	  湛江附近海面: '广东西部海面'
	};

	var hasData = exports.hasData = false;
	var getSeawaveData = exports.getSeawaveData = function getSeawaveData() {
	  var listUrl = 'http://119.29.102.103:8111/SeaWaveForecast/listByDate?date={date}&cacheCtrl=' + Date.now();

	  var date = new Date();
	  var url = listUrl.replace('{date}', new Date(date).Format('yyyy-MM-dd HH:00:00'));
	  $.ajax({ url: url }).then(function (msg) {
	    if (!$('.swList').hasClass('on') || !msg) return;
	    if (/DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) {
	      date = new Date(date).getTime() - 24 * 60 * 60 * 1000;
	      var _url = listUrl.replace('{date}', new Date(date).Format('yyyy-MM-dd HH:00:00'));
	      return $.ajax({ url: _url });
	    }
	    exports.hasData = hasData = true;
	    getPoint(msg);
	    (0, _newsTip.addNewsTip)('seawave', '北京时: ' + new Date(date).Format('yyyy年MM月dd日 HH:00') + '&nbsp;海浪预报');
	    return false;
	  }).then(function (msg) {
	    if (!$('.swList').hasClass('on') || !msg) return;
	    if (/DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) {
	      (0, _tips.getNoDataTips)('.seaWave_noData');
	      exports.hasData = hasData = false;
	      (0, _newsTip.removeNewsTip)('seawave');
	      return;
	    }
	    exports.hasData = hasData = true;
	    getPoint(msg);
	    (0, _newsTip.addNewsTip)('seawave', '北京时: ' + new Date(date).Format('yyyy年MM月dd日 HH:00') + '&nbsp;海浪预报');
	  });
	};

	var mapEvent = function mapEvent() {
	  $('.tycontener_bottSeawave').removeClass('on').stop().animate({ 'bottom': '-5.4rem' });
	  if ($('.early_warn').hasClass('on')) return;
	  if ($('.simiMatch').hasClass('on')) return;
	  if ($('.rainProgressbar').hasClass('on')) return;
	  $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	};
	var contEvent = function contEvent(e) {
	  if ($(e.target).is('.imgEx') || $(e.target).is('.imgEx *')) return;
	  if ($(e.target).is('.cloudMap .tyListUl_com:nth-child(2)') || $(e.target).is('.cloudMap .tyListUl_com:nth-child(2) *')) return;
	  mapEvent();
	};

	var getPoint = function getPoint(msg) {
	  map.addEventListener('click', mapEvent);
	  $('#tyswNav,#makePolicy,.simityList').click(mapEvent);
	  map.addEventListener('movestart', mapEvent);

	  var polygonOpt = { color: '#fff', weight: 1, fillColor: 'blue', fillOpacity: 0.1, opacity: 0.1, renderer: waveRenderer };

	  var _loop = function _loop(i) {
	    var info = _boundary3.default[i];

	    var event = function event(e) {
	      L.DomEvent.stopPropagation(e);
	      $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }).removeClass('on');
	      if (!hasData) return;
	      if ($('.buoy_bott').hasClass('on')) {
	        $('.buoy_bott').removeClass('on').stop().animate({ bottom: '-5.8rem' });

	        if ($('.tycontener_bottSeawave').hasClass('on')) {
	          $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({ 'bottom': '5.9rem' });
	        } else if ($('.rainProgressbar').hasClass('on')) {
	          $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({ 'bottom': '3.3rem' });
	        } else {
	          $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	        }
	      }

	      if ($('.simiMatch.on').length) $('.closeSimi').click();
	      $('#tyswNav>ul>li.a').click();
	      $('.cloudMap ul li img.on').click();
	      $('.typhoon_seaWave p').click();
	      if ($('.early_warn').hasClass('on')) $('.early_warn').removeClass('on').stop().animate({ bottom: '-4.4rem' });
	      $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({ 'bottom': 5.9 + 'rem' });
	      $('.tycontener_bottSeawave').addClass('on').show().stop().animate({ bottom: '0rem' });
	      $('.tycontener_bottSeawave').click(function (e) {
	        e.stopPropagation();
	      });

	      currentArea = i;

	      msg.map(function (item) {
	        if (currentArea === item.vf01015Cn) {
	          seaData[item.v04320] = item;
	        }
	      });
	      console.log(seaData);
	      dealTable();
	    };

	    var polygon = L.polygon(info.bd, polygonOpt);
	    polygon.id = 'boundaryP';
	    L.DomEvent.on(polygon, 'click', event);
	    polygon.addTo(map);
	    var icon = L.divIcon({ html: '<div class="areaBoundary">' + i + '</div>' });
	    var marker = L.marker(_boundary3.default[i].center, { icon: icon });
	    marker.id = 'boundaryM';
	    L.DomEvent.on(marker, 'click', event);
	    marker.addTo(map);
	  };

	  for (var i in _boundary3.default) {
	    _loop(i);
	  }

	  (0, _viewer.viewerCor)();
	};

	var dealTable = function dealTable() {
	  if ($('#seaWaveTwentyF').hasClass('tydate_active')) fillTable(24);else if ($('#seaWaveFortyE').hasClass('tydate_active')) fillTable(48);
	};

	var fillTable = function fillTable(time) {
	  $('.tySeawave_pre tr:eq(0) td:eq(1)').text(seaData[time].vf01015Cn);
	  $('.tySeawave_pre tr:eq(1) td:eq(1)').text(seaData[time].v2202105 + 'm');
	  $('.tySeawave_pre tr:eq(2) td:eq(1)').text(seaData[time].v2202106 + 'm');
	  $('.tySeawave_pre tr:eq(3) td:eq(1)').text(seaData[time].v20059 + '-' + seaData[time].v20058 + 'm');
	  $('.tySeawave_pre tr:eq(1) td:eq(3)').text(seaData[time].v11041 + '级');
	  $('.tySeawave_pre tr:eq(0) td:eq(3)').text(seaData[time].v11301 + '级');

	  var windDer = void 0;
	  if (seaData[time].v11001) {
	    var winDerect = (0, _wind.getDirLevel)(seaData[time].v11001);
	    windDer = winDerect ? winDerect : '无风';
	  } else windDer = '无风';
	  $('.tySeawave_pre tr:eq(2) td:eq(3)').text(windDer);
	};

	var getOceanMsg = function getOceanMsg() {
	  currentAreaMsg = {};
	  for (var i in oceanData) {
	    if (areaCorrObj[currentArea]) currentArea = areaCorrObj[currentArea];
	    var info = oceanData[i];
	    if (info.name === currentArea) {
	      currentAreaMsg[info.leadtime] = info;
	    }
	  }
	  console.log(currentAreaMsg);
	};

	var fillOceanTable = function fillOceanTable(leadtime) {
	  var data = currentAreaMsg[leadtime];
	  if (data) {
	    $('.oceanPre tr:eq(0) td:eq(1)').text(data.weather);
	    $('.oceanPre tr:eq(0) td:eq(3)').text(data.windDir + '风');
	    $('.oceanPre tr:eq(1) td:eq(1)').text(data.windVel + '级');
	    $('.oceanPre tr:eq(1) td:eq(3)').text(data.flurry + '级');
	    $('.oceanPre tr:eq(2) td:eq(1)').text(data.visibility + 'km');
	  } else {
	    $('.oceanPre tr:eq(0) td:eq(1)').text('');
	    $('.oceanPre tr:eq(0) td:eq(3)').text('');
	    $('.oceanPre tr:eq(1) td:eq(1)').text('');
	    $('.oceanPre tr:eq(1) td:eq(3)').text('');
	    $('.oceanPre tr:eq(2) td:eq(1)').text('');
	  }
	};

	var delMarker = exports.delMarker = function delMarker() {
	  overlay.removeOverlay('point');
	  $('#tyswNav,#makePolicy,.simityList').unbind('click', contEvent);
	  map.removeEventListener('click', mapEvent);
	  map.removeEventListener('movestart', mapEvent);
	};

	var delBoundary = exports.delBoundary = function delBoundary() {
	  overlay.removeOverlay('boundaryP');
	  overlay.removeOverlay('boundaryM');
	  $('#tyswNav,#makePolicy,.simityList').unbind('click', contEvent);
	  map.removeEventListener('click', mapEvent);
	  map.removeEventListener('movestart', mapEvent);
	};

	$('.seaWave_head ul li p').on('click', function () {
	  $('.seaWave_head ul li p').removeClass('tycontent_head_active');
	  $(this).addClass('tycontent_head_active');
	});

	$('.typhoon_seaWave p').on('click', function () {
	  $('.swiperLine').stop().animate({ left: '0.55rem' }, 300);
	  $('#seaOceans').hide();
	  $('#seaWaves').show();
	});

	$('.typhoonSeawave_div').on('click', function () {
	  $('.typhoonSeawave_div').removeClass('tydate_active');
	  $(this).addClass('tydate_active');
	});
	$('#seaWaveTwentyF').click(function () {
	  fillTable(24);
	});
	$('#seaWaveFortyE').click(function () {
	  fillTable(48);
	});

	$('.typhoon_seaWavepre p').on('click', function () {
	  $('#seaWaves').hide();
	  $('#seaOceans').show();
	  $('.swiperLine').animate({ left: '2.48rem' }, 300);
	  if (!oceanData.length) {
	    var deadline = new Date().Format('yyyy-MM-dd 17:00:00');
	    deadline = new Date(deadline).getTime();
	    var date = void 0;
	    if (Date.now() > deadline) {
	      date = new Date().Format('yyyy-MM-dd HH:00:00');
	    } else {
	      date = Date.now() - 24 * 60 * 60 * 1000;
	      date = new Date(date).Format('yyyy-MM-dd HH:00:00');
	    }
	    console.log(date);
	    var oceanUrl = 'http://119.29.102.103:8111/SeaForecast/listByDate?date=' + date + '&cacheCtrl=' + Date.now();
	    $.ajax({ type: 'get', url: oceanUrl }).then(function (data) {
	      console.log(data);
	      if (/DB_ERROR/.test(data) || /null/.test(data) || !data.length) return;
	      oceanData = data;

	      getOceanMsg();
	      fillOceanTable(24);
	      $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
	      $('.typhoonSeawave_ocean').eq(0).find('.oceanSeawave_div').addClass('ocean_active');
	    });
	  } else {
	    getOceanMsg();
	    fillOceanTable(24);
	    $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
	    $('.typhoonSeawave_ocean').eq(0).find('.oceanSeawave_div').addClass('ocean_active');
	  }
	});

	$('.typhoonSeawave_ocean').on('click', function () {
	  $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
	  $(this).find('.oceanSeawave_div').addClass('ocean_active');

	  var leadtime = $(this).attr('leadtime');
	  fillOceanTable(leadtime);
	});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.wind = wind;
	var getVelLevel = exports.getVelLevel = function getVelLevel(vel) {
		var levels = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.0, 41.5, 46.2, 51.0, 56.1, 61.3, 66.8, 72.4];

		for (var i = 0; i < levels.length; i++) {
			if (vel < levels[i]) return i;
		}
		return 20;
	};
	var getDirLevel = exports.getDirLevel = function getDirLevel(dir) {
		var windDir = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];

		var dirBound = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
		for (var i = 0; i < dirBound.length - 1; i++) {
			if (dir > dirBound[i] && dir <= dirBound[i + 1]) return windDir[i + 1];
		}
		return windDir[1];
	};

	var _rootUrl = 'http://119.29.102.103:8111/roa1080/';
	function windLevel(speed) {
		var levels = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.0, 41.5, 46.2, 51.0, 56.1, 61.3, 66.8, 72.4];

		for (var i = 0, len = levels.length; i < len; i++) {
			if (speed < levels[i]) return i + '';
		}
		return '20';
	}

	function windDir(dir) {
		var dirBound = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
		for (var i = 0, len = dirBound.length; i < len - 1; i++) {
			if (dir > dirBound[i] && dir <= dirBound[i + 1]) return i + 2 + '';
		}
		return '1';
	}

	function wind(speed, dir) {
		return _rootUrl + 'filelist/wind/' + windLevel(speed) + windDir(dir) + '.png';
	}

	function windBig(speed, dir) {
		return _rootUrl + 'filelist/bigwind/' + windLevel(speed) + windDir(dir) + '.png';
	}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var getNoDataTips = exports.getNoDataTips = function getNoDataTips(className) {
	    $(className).fadeIn(1000, function () {
	        setTimeout(function () {
	            $(className).fadeOut();
	        }, 1000);
	    });
	};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    曾母暗沙: {
	        center: [7.67, 113.24],
	        bd: [[6, 115.7], [6, 109.09], [8.86, 109.09], [8.86, 117.3], [7.07, 117.3], [7.12, 117.08], [6.61, 116.14]]
	    },
	    头顿: {
	        center: [10.32, 108.87],
	        bd: [[8.86, 110.38], [8.86, 105.46], [9.26, 105.84], [9.26, 106.39], [10.15, 106.77], [11.48, 108.92], [10.1, 111.7]]
	    },
	    华列拉: {
	        center: [12.876, 110.3],
	        bd: [[10.1, 111.7], [11.48, 108.97], [11.94, 109.22], [13, 109.32], [14.61, 108.97], [14.64, 111.7]]
	    },
	    南沙: {
	        center: [11.86, 115.51],
	        bd: [[8.86, 117.3], [8.86, 110.38], [10.1, 111.7], [13.98, 111.7], [14.01, 120.46], [13.78, 120.54], [13.48, 120.18], [12.49, 120.74], [12.34, 119.85], [11.21, 119.2], [10.85, 119.15]]
	    },
	    中沙: {
	        center: [16.17, 117.42],
	        bd: [[14.01, 120.46], [13.99, 113.87], [17.92, 113.9], [17.97, 120.33], [17.94, 120.33], [17.66, 120.28], [16.96, 120.28], [16.55, 120.16], [16.3, 120.41], [16.15, 120.18], [16.28, 119.9], [16.2, 119.75], [14.89, 120.01], [14.31, 120.61]]
	    },
	    西沙: {
	        center: [17.84, 111.92],
	        bd: [[13.99, 113.87], [13.98, 111.7], [14.64, 111.7], [14.63, 110.18], [18.58, 110.1], [18.75, 110.43], [19.38, 110.58], [19.58, 110.96], [20.06, 110.86], [20.62, 113.92]]
	    },
	    海南岛西南部: {
	        center: [16.93, 108.84],
	        bd: [[14.63, 110.18], [14.61, 108.97], [15.27, 108.84], [17.29, 106.85], [18.3, 108.84], [18.12, 109.4], [18.5, 110.1]]
	    },
	    北部湾: {
	        center: [19.86, 107.65],
	        bd: [[18.3, 108.84], [17.29, 106.85], [17.76, 106.42], [17.94, 106.44], [18.22, 106.19], [18.62, 105.84], [19.03, 105.63], [19.56, 105.81], [19.83, 106.09], [20.14, 106.34], [20.16, 106.57], [20.14, 106.67], [20.79, 107.15], [21.15, 107.35], [21.68, 108.51], [21.37, 109.19], [21.43, 109.61], [20.22, 109.92], [20, 109.84], [19.41, 108.72], [18.47, 108.51]]
	    },
	    东沙: {
	        center: [19.76, 116.7],
	        bd: [[17.97, 119.55], [17.92, 113.9], [20.62, 113.92], [21.32, 119.53]]
	    },
	    巴士海峡: {
	        center: [19.84, 121.54],
	        bd: [[17.99, 123.69], [17.99, 122.23], [18.27, 122.3], [18.55, 122.1], [18.37, 121.87], [18.65, 120.81], [18.55, 120.54], [17.97, 120.33], [17.97, 119.55], [21.32, 119.53], [21.35, 123.67]]
	    },
	    台湾海峡: {
	        center: [23.36, 118.87],
	        bd: [[21.33, 120.79], [21.32, 119.53], [23.52, 117.25], [24, 117.83], [24.32, 117.88], [24.35, 118.24], [25.41, 119.55], [25.38, 121.37], [23.47, 120.01], [22.58, 120.13], [22.36, 120.54], [22.13, 120.66], [21.95, 120.59], [21.9, 120.81]]
	    },
	    汕头附近海面: {
	        center: [22.15, 117.73],
	        bd: [[21.32, 119.53], [21.11, 117.78], [22.91, 116.29], [23.52, 117.25]]
	    },
	    汕尾附近海面: {
	        center: [21.82, 116.18],
	        bd: [[21.11, 117.78], [20.86, 115.78], [22.53, 114.8], [22.74, 115.21], [22.91, 116.29]]
	    },
	    珠江口外海面: {
	        center: [21.41, 114.38],
	        bd: [[20.86, 115.78], [20.62, 113.92], [21.9, 113.16], [22, 114.2], [22.19, 115]]
	    },
	    珠江口内河面: {
	        center: [22.26, 113.75],
	        bd: [[22.19, 115], [22, 114.2], [21.9, 113.16], [22.08, 113.36], [22.53, 113.65], [22.58, 113.8], [22.21, 114.05], [22.53, 114.8]]
	    },
	    川山群岛附近海面: {
	        center: [21.45, 112.76],
	        bd: [[20.62, 113.92], [20.38, 112.58], [21.68, 111.77], [21.75, 112.15], [21.68, 112.55], [21.9, 113.16]]
	    },
	    湛江附近海面: {
	        center: [20.79, 111.39],
	        bd: [[20.38, 112.58], [20.06, 110.86], [20.31, 110.51], [21.22, 110.61], [21.45, 111.34], [21.68, 111.77]]
	    },
	    琼州海峡: {
	        center: [20.18, 110.23],
	        bd: [[20.06, 110.86], [20, 109.84], [20.22, 109.92], [20.31, 110.51]]
	    }
	};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var viewerCor = exports.viewerCor = function viewerCor() {
	  var viewCenter = map.getCenter();
	  var lat = viewCenter.lat,
	      lng = viewCenter.lng;
	  if (17.84 > lat || lat > 26.65 || lng < 109.01 || lng > 117.81) map.setView([23, 113], 5, { animate: true });
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var judge = exports.judge = function judge(lat, lon, radius) {
	  var polygons = window.fstAreas;
	  if (polygons === false) return false;
	  var circle = {
	    center: [lat, lon],
	    radius: radius * 1.852 };
	  if (Array.isArray(polygons) && polygons.length) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = polygons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var polygon = _step.value;

	        var inPolygon = isPointInPolygon({ x: lon, y: lat }, polygon);
	        if (inPolygon) return true;
	        var bool = containPolygonByCircle(polygon, circle);
	        if (bool) return true;
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }
	  return false;
	};

	var isPointInPolygon = function isPointInPolygon(point, polygon) {
	  var px = point.x,
	      py = point.y,
	      flag = false;
	  for (var i = 0, l = polygon.length, j = l - 1; i < l; j = i, i++) {
	    var p1 = polygon[i],
	        p2 = polygon[j];
	    var sx = p1[1],
	        sy = p1[0],
	        tx = p2[1],
	        ty = p2[0];

	    if (sx === px && sy === py || tx === px && ty === py) return true;

	    if (sy < py && ty >= py || sy >= py && ty < py) {
	      var x = sx + (py - sy) * (tx - sx) / (ty - sy);

	      if (x === px) return true;
	      if (x > px) flag = !flag;
	    }
	  }
	  return flag;
	};

	var containPolygonByCircle = function containPolygonByCircle(polygon, circle) {
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = polygon[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var p = _step2.value;

	      if (L.latLng(p).distanceTo(circle.center) <= circle.radius * 1000) {
	        return true;
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  return false;
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _overlay = __webpack_require__(19);

	var overlay = _interopRequireWildcard(_overlay);

	var _tips = __webpack_require__(24);

	var _wind = __webpack_require__(23);

	var w = _interopRequireWildcard(_wind);

	var _typhoonDom = __webpack_require__(20);

	var _Coder = __webpack_require__(18);

	var _newsTip = __webpack_require__(29);

	var _viewer = __webpack_require__(26);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var bounds = [[27, 108.5], [18.2, 119]];

	var baseCloud = 'http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=';
	var endOfCloud = '&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600';
	var getTime = 'http://119.29.102.103:8111/Satelite/latestDatetime?dataType=ir2';
	var showTime = 'http://119.29.102.103:8111/Satelite/latestDatetime?dataType=ir1&timeStamp=$';
	var urlCloud = {
	  'visibleLight': baseCloud + 'VIS' + endOfCloud,
	  'InfraRed': baseCloud + 'IR1' + endOfCloud,
	  'steam': baseCloud + 'IR3' + endOfCloud };
	var cloudBounds = [[53.55, 73.66], [3.86, 150]];

	var cloudLoad = false;
	$('#cloudOverlay li').click(function (e) {
	  var _this = this;

	  e.stopPropagation();
	  var id = $(this).attr('id');

	  if ($(this).hasClass('on')) {
	    if (cloudLoad) {
	      cloudLoad = false;
	      $(this).removeClass('on');
	      overlay.removeOverlay(id);
	      (0, _newsTip.removeNewsTip)(id);
	    }
	  } else {
	    if ($(this).siblings('li').hasClass('on') && !cloudLoad) return;

	    var getTimeUrl = getTime + ('&cacheCtrl=' + Date.now());
	    $.ajax({ url: getTimeUrl }).then(function (data) {
	      var time = data;
	      var url = urlCloud[id].replace('{datetime}', new Date(time).Format('yyyy-MM-dd HH:00:00')) + ('&cacheCtrl=' + Date.now());

	      cloudLoad = false;
	      var $bro = $(_this).siblings('li.on');
	      $(_this).addClass('on');
	      $bro.removeClass('on');
	      (0, _newsTip.removeNewsTip)($bro.attr('id'));
	      var showTimeUrl = showTime + ('&cacheCtrl=' + Date.now());
	      $.ajax({ url: showTimeUrl }).then(function (msg) {
	        var datetime = new Date(msg).Format('yyyy-MM-dd HH:00');

	        var _loop = function _loop(item) {
	          if (id === item) {
	            var img = new Image();
	            img.onload = function () {
	              cloudLoad = true;
	              overlay.addImageOverlay(id, url, cloudBounds);
	              var cname = '';
	              switch (item) {
	                case 'InfraRed':
	                  cname = '红外云图';break;
	                case 'steam':
	                  cname = '水汽云图';break;
	                case 'visibleLight':
	                  cname = '可见光云图';break;
	              }
	              (0, _newsTip.addNewsTip)(item, '北京时: ' + new Date(msg).Format('yyyy年MM月dd日 HH:00') + '&nbsp;' + cname);
	              (0, _viewer.viewerCor)();
	            };
	            img.onerror = function () {
	              cloudLoad = true;
	              (0, _tips.getNoDataTips)('.cloudNoData');
	            };
	            img.src = url;
	          } else {
	            overlay.removeOverlay(item);
	          }
	        };

	        for (var item in urlCloud) {
	          _loop(item);
	        }
	      });
	    });
	  }
	});

	var mcrUrl = 'http://119.29.102.103:8111/roa1080/grid/swan/mcr/{datetime}/HTML/png/,,,,,/color/cache';
	var dataMcrUrl = 'http://119.29.102.103:9022/dataunit/model/renderModelData?datetime={datetime}&model=swan&element=mcr&time=0&level=3&top=27&bottom=19.2&left=108.5&right=117&width=600&height=600 ';
	$('.tgReflex').click(function (e) {
	  e.stopPropagation();
	  if ($(this).hasClass('on')) {
	    overlay.removeOverlay('mcr');
	    (0, _newsTip.removeNewsTip)('tgReflex');
	  } else {
	    getImgFn(0, 'dataMcr', $(this));
	  }
	  $(this).toggleClass('on');
	});
	var getImgFn = function getImgFn(i, type, $btn) {
	  var time = Date.now() - Date.now() % (6 * 60 * 1000) - i * 6 * 60 * 1000;
	  time = new Date(time).Format('yyyy-MM-dd HH:mm:00');
	  var url = type === 'mcr' ? mcrUrl : dataMcrUrl;
	  url = url.replace('{datetime}', time) + ('&cacheCtrl=' + Date.now());
	  console.log(url);
	  var img = new Image();
	  img.onload = function () {
	    if ($btn.hasClass('on')) (0, _newsTip.addNewsTip)('tgReflex', '北京时: ' + new Date(time.replace(/-/g, '/')).Format('yyyy年MM月dd日 HH:00') + '&nbsp;雷达回波');
	    $btn.hasClass('on') ? overlay.addImageOverlay('mcr', url, bounds) : overlay.removeOverlay('mcr');
	    (0, _viewer.viewerCor)();
	  };
	  img.onerror = function () {
	    i++;
	    if (type === 'dataMcr') {
	      if (i < 3) getImgFn(i, 'dataMcr', $btn);else {
	        i = 0;
	        getImgFn(i, 'mcr', $btn);
	      }
	    } else if (type === 'mcr') {
	      if (i < 3) getImgFn(i, 'mcr', $btn);else (0, _tips.getNoDataTips)('.cloudNoData');
	    }
	  };
	  img.src = url;
	};

	$('.rsFollow').click(function (e) {
	  e.stopPropagation();
	  if ($(this).hasClass('on')) {
	    overlay.removeOverlay('rainStorm');
	    map.off('moveend', updateMap);
	    (0, _newsTip.removeNewsTip)('rainStorm');
	  } else {
	    getRsImg(0, $(this), function (flag) {
	      if (!flag) {
	        overlay.removeOverlay('rainStorm');
	        map.off('moveend', updateMap);
	      }
	    });
	  }
	  $(this).toggleClass('on');
	});

	var rsIndex = 0;
	var getRsUrl = function getRsUrl(i) {
	  var ms = Date.now();
	  ms -= ms % 360000 + i * 360000;
	  var date = new Date(ms).Format('yyyy-MM-dd HH:mm:00');
	  var mapBound = map.getBounds();
	  var left = mapBound.getWest(),
	      right = mapBound.getEast(),
	      bottom = mapBound.getSouth(),
	      top = mapBound.getNorth();
	  var rsbounds = [[top, left], [bottom, right]];
	  var contSize = map.getSize();
	  var url = 'http://119.29.102.103:8111/roa1080/grid/thunder/titan/' + date + '/json/png/' + left + ',' + right + ',' + top + ',' + bottom + ',' + contSize.x + ',' + contSize.y + '/color/cache?cacheCtrl=' + Date.now();
	  console.log(url);
	  return {
	    url: url,
	    bounds: rsbounds
	  };
	};

	var getRsImg = function getRsImg(i, $btn, fn) {
	  var ms = Date.now();
	  ms -= ms % 360000 + i * 360000;
	  var date = new Date(ms).Format('yyyy-MM-dd HH:mm:00');
	  var id = 'rainStorm';
	  var url = getRsUrl(i).url;
	  var img = new Image();
	  fn = fn || $.noop();
	  img.onload = function () {
	    (0, _newsTip.addNewsTip)('rainStorm', '北京时: ' + new Date(ms).Format('yyyy年MM月dd日 HH:00') + '&nbsp;雷暴追踪');
	    rsIndex = i;
	    var rsbounds = getRsUrl(i).bounds;
	    overlay.removeOverlay(id);
	    overlay.addBusinessOverlay(id, url, rsbounds, { zIndex: 300 });
	    (0, _viewer.viewerCor)();
	    $btn.hasClass('on') ? fn(true) : fn(false);
	    if ($btn.hasClass('on')) map.on('moveend', updateMap);
	  };
	  img.onerror = function () {
	    ++i;
	    if (i >= 3) {
	      fn(false);
	      (0, _tips.getNoDataTips)('.cloudNoData');
	      return;
	    }
	    getRsImg(i, $btn, fn);
	  };
	  img.src = url;
	};

	var updateFlag = void 0;
	var updateMap = function updateMap() {
	  var flag = updateFlag = Math.random();
	  var rsUrlInfo = getRsUrl(rsIndex);
	  var url = rsUrlInfo.url;
	  var rsbounds = rsUrlInfo.bounds;
	  var id = 'rainStorm';
	  var img = new Image();
	  img.onload = function () {
	    if (flag !== updateFlag) return;
	    overlay.addBusinessOverlay(id, url, rsbounds, { zIndex: 300 });
	  };
	  img.onerror = function () {
	    if (flag !== updateFlag) return;
	    overlay.removeOverlay(id);
	  };
	  img.src = url;
	};

	var isWindCompAlive = false;
	var windMarker = [];
	var getWindData = function getWindData() {
	  var siteUrl = 'http://119.29.102.103:8111/roa1080/discrete/stationreal/s2/1,\u5E7F\u4E1C,,/JSON?cacheCtrl=' + Date.now();
	  var time = Date.now() - Date.now() % (5 * 60 * 1000) - 15 * 60 * 1000;
	  var datetime = new Date(time).Format('yyyy-MM-dd HH:mm:00');
	  var windUrl = 'http://119.29.102.103:8111/roa1080/discrete/stationreal/d3/1,wind,' + datetime + '/JSON?cacheCtrl=' + Date.now();
	  $.ajax({ url: siteUrl }).then(function (data) {
	    if (!isWindCompAlive) return;
	    data = JSON.parse(data);
	    if (/DB_ERROR/.test(data)) {
	      (0, _tips.getNoDataTips)('.seaWave_noData');return;
	    }
	    var siteIcon = L.icon({
	      iconUrl: 'assets/station.png',
	      iconSize: [5, 5],
	      iconAnchor: [2.5, 2.5]
	    });
	    var options = {
	      icon: siteIcon,
	      zIndexOffset: 1000
	    };
	    var windObj = {};
	    data.map(function (info) {
	      var center = [info.latitude, info.longitude];
	      overlay.addMarker('sitePoint', center, options);
	      windObj[info.stationid] = info;
	    });
	    (0, _viewer.viewerCor)();

	    $.ajax({ url: windUrl }).then(function (msg) {
	      if (!isWindCompAlive) return;
	      (0, _newsTip.addNewsTip)('wind', '北京时: ' + new Date(time).Format('yyyy年MM月dd日 HH:00') + '&nbsp;实时风况');
	      msg = JSON.parse(msg);
	      if (/DB_ERROR/.test(msg)) {
	        (0, _tips.getNoDataTips)('.seaWave_noData');return;
	      }
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = msg[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var info = _step.value;

	          if (windObj[info.stationid]) {
	            windObj[info.stationid] = Object.assign(windObj[info.stationid], info);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var icon = {
	        iconUrl: 'assets/arrowhead@3x.png',
	        iconSize: [10, 14],
	        iconAnchor: [5, 14]
	      };
	      for (var i in windObj) {
	        var item = windObj[i];
	        if (item.wind_dir) {
	          var marker = L.angleMarker([item.latitude, item.longitude], { icon: new L.Icon(icon), iconAngle: item.wind_dir, iconOrigin: '50% 100%' });
	          windMarker.push(marker);
	          marker.addTo(map);
	        }
	        if (item.wind_vel) {
	          var className = void 0;
	          if (item.wind_dir < 90 || item.wind_dir > 270) className = 'wind_veltop';else className = 'wind_velbot';
	          var opts = L.divIcon({
	            html: '<div class="' + className + '">' + (Number(item.wind_vel) + 'm/s') + '</div>'
	          });
	          overlay.addMarker('windVel', [item.latitude, item.longitude], { icon: opts });
	        }
	      }
	    });
	  });
	};

	$('.actualWind').click(function (e) {
	  e.stopPropagation();

	  if ($(this).hasClass('on')) {
	    isWindCompAlive = false;
	    overlay.removeOverlay('sitePoint');
	    overlay.removeOverlay('windVel');
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	      for (var _iterator2 = windMarker[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var opt = _step2.value;

	        map.removeLayer(opt);
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }

	    windMarker = [];
	    (0, _newsTip.removeNewsTip)('wind');
	  } else {
	    isWindCompAlive = true;
	    getWindData();
	  }
	  $(this).toggleClass('on');
	});

	var getImageStringUrl = 'http://119.29.102.103:9002/nc/jsonp/bin/contour?binInfoArea.modelName=qpfacc&binInfoArea.datetime={date}&binInfoArea.varname=rain&binInfoArea.level=60&bounds.left=108.5&bounds.right=118.99&bounds.top=27&bounds.bottom=18.21&bounds.width=1050&bounds.height=880&shaderOn=true&contourOn=false&contourLabelOn=false&projName=equ';
	var rainTimes = [];
	var rainLayer = void 0;
	var getRainTime = function getRainTime() {
	  return new Promise(function (resolve, reject) {
	    var url = 'http://119.29.102.103:18888/' + _Coder.Coder.encode('zxhcqpfimage/getpictime/user/post/,/');
	    $.ajax({ url: url }).then(function (res) {
	      if (res.result === 'S_OK') resolve(res.tagObject);else reject();
	    });
	  });
	};

	var getRainUrl = function getRainUrl(datetime) {
	  return new Promise(function (resolve, reject) {
	    console.log(datetime);
	    var url = getImageStringUrl.replace('{date}', datetime) + ('&cacheCtrl=' + Date.now());
	    $.ajax({ url: url, dataType: 'jsonp' }).then(function (res) {
	      if (res == null) reject();else {
	        console.log('http://119.29.102.103:9002/' + res);
	        resolve('http://119.29.102.103:9002/' + res);
	      }
	    });
	  });
	};

	$('.rainForecast').click(function (e) {
	  if ($(this).hasClass('on')) {
	    (0, _newsTip.removeNewsTip)('rainForecast');
	    $(this).removeClass('on');
	    $('.rainProgressbar').stop().animate({ 'bottom': '-2.67rem' }, function () {
	      if ($('.buttonPlay').hasClass('on')) $('.buttonPlay').click();
	      initProgress();
	    });
	    $('.rainProgressbar').removeClass('on');
	    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
	    removeRainLayer();
	  } else {
	    $(this).addClass('on');
	    $('.early_warn').stop().animate({ bottom: '-4.4rem' });
	    if (map.hasEventListeners('click', _typhoonDom.hidePreWarnPopup)) {
	      map.removeEventListener('click', _typhoonDom.hidePreWarnPopup);
	      map.removeEventListener('movestart', _typhoonDom.hidePreWarnPopup);
	    }
	    getRainTime().then(function (res) {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = res[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var opt = _step3.value;

	          rainTimes.push(new Date(opt).Format('yyyy-MM-dd HH:mm:00'));
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      var datetime = new Date(rainTimes[0].replace(/-/g, '/')).getTime() + 3600000;
	      var date = new Date(datetime).Format('yyyy-MM-dd HH:mm:00');
	      $('.rain_nowtime').text(date);

	      getRainUrl(rainTimes[0]).then(function (url) {
	        var img = new Image();
	        img.onload = function () {
	          (0, _newsTip.addNewsTip)('rainForecast', '北京时: ' + new Date(datetime).Format('yyyy年MM月dd日 HH:mm') + '&nbsp;降水预测');

	          $('.rainProgressbar').stop().animate({ 'bottom': '0rem' }).addClass('on');
	          $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '3.33rem' });
	          addRainLayer(url);
	          (0, _viewer.viewerCor)();
	        };
	        img.onerror = function () {
	          $('.rainProgressbar').stop().animate({ 'bottom': '0rem' }).addClass('on');
	          $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({ 'bottom': '3.33rem' });
	          (0, _tips.getNoDataTips)('.cloudNoData');
	        };
	        img.src = url;
	      }).catch(function (e) {
	        (0, _tips.getNoDataTips)('.cloudNoData');
	      });
	    }).catch(function (e) {
	      (0, _tips.getNoDataTips)('.cloudNoData');
	    });
	  }
	});

	var initProgress = function initProgress() {
	  num = 0;
	  $('.progressBar').stop().css('width', '10%');
	  $('.progressFrame .grayPoint.in').removeClass('in');
	  $('.buttonPlay.on').removeClass('on');
	};

	$('.buttonPlay').click(function (e) {
	  e.stopPropagation();
	  if ($(this).hasClass('on')) {
	    clearTimeout(timeout);
	    timeout = null;
	    $(this).removeClass('on');
	  } else {
	    intvEvent();
	    $(this).addClass('on');
	  }
	});

	var num = 0,
	    timeout = void 0;
	var intvEvent = function intvEvent() {
	  ++num;
	  if (num > 9) {
	    num = 0;
	    $('.progressBar').stop().css('width', '10%');
	    $('.progressFrame .grayPoint.in').removeClass('in');
	  }

	  if (num > 0) $('.point').eq(num - 1).children('.grayPoint').addClass('in');
	  $('.progressBar').stop().animate({ 'width': 10 + num * 10 + '%' }, 2000);
	  $('progressRing').stop().animate({ 'left': 10 + num * 10 + '%' }, 2000);

	  var date = new Date(rainTimes[num].replace(/-/g, '/')).getTime() + 3600000;
	  date = new Date(date).Format('yyyy-MM-dd HH:mm:00');
	  $('.rain_nowtime').text(date);

	  getRainUrl(rainTimes[num]).then(function (url) {
	    var img = new Image();
	    img.onload = function () {

	      if ($('.rainForecast').hasClass('on') && $('.buttonPlay').hasClass('on')) {
	        addRainLayer(url);
	        timeout = setTimeout(intvEvent, 2000);
	      } else {
	        removeRainLayer();
	      }
	    };
	    img.onerror = function () {
	      removeRainLayer();
	      if ($('.rainForecast').hasClass('on') && $('.buttonPlay').hasClass('on')) {
	        timeout = setTimeout(intvEvent, 2000);
	      }
	    };
	    img.src = url;
	  }).catch(function (e) {
	    removeRainLayer();
	  });
	};

	$('.grayPoint').click(function () {
	  if ($('.buttonPlay').hasClass('on')) return;
	  var $this = $(this);

	  $this.addClass('in');
	  $this.next().addClass('in');
	  var $parent = $this.parent();
	  $parent.prevAll().children('.grayPoint').addClass('in');
	  $parent.nextAll().children('.grayPoint').removeClass('in');

	  var index = $this.parent().index();
	  num = index - 1;
	  $('.progressBar').css('width', 10 + num * 10 + '%');
	  $('.progressRing').css('left', 10 + num * 10 + '%');

	  var date = new Date(rainTimes[num].replace(/-/g, '/')).getTime() + 3600000;
	  date = new Date(date).Format('yyyy-MM-dd HH:mm:00');
	  $('.rain_nowtime').text(date);

	  getRainUrl(rainTimes[num]).then(function (url) {
	    var img = new Image();
	    img.onload = function () {
	      addRainLayer(url);
	    };
	    img.onerror = function () {
	      removeRainLayer();
	    };
	    img.src = url;
	  }).catch(function (e) {
	    removeRainLayer();
	  });
	});

	var addRainLayer = function addRainLayer(url) {
	  if (rainLayer) {
	    rainLayer.setUrl(url);
	  } else {
	    rainLayer = L.imageOverlay(url, bounds, { zIndex: 300 });
	    rainLayer.addTo(map);
	  }
	};

	var removeRainLayer = function removeRainLayer() {
	  if (rainLayer) {
	    map.removeLayer(rainLayer);
	    rainLayer = null;
	  }
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var intervalHolder = null;
	var playFn = function playFn() {
	  var html = '<div class="same">' + $('.cloudPopup .wrapper').html() + '</div>';
	  $('.cloudPopup .wrapper').append(html);
	  var len = $('.cloudPopup .wrapper>p').length;
	  var num = 1;
	  intervalHolder = setInterval(function () {
	    var top = -1 * 26 * num;
	    $('.cloudPopup .wrapper').stop().animate({ marginTop: top + 'px' }, 1500, function () {
	      if (num === len) {
	        num = 1;
	        $('.cloudPopup .wrapper').css({ marginTop: 0 });
	      } else num++;
	    });
	  }, 3000);
	};

	var clearInt = function clearInt() {
	  if (!intervalHolder) return;
	  clearInterval(intervalHolder);
	  intervalHolder = null;
	  $('.cloudPopup .wrapper .same').remove();
	  $('.cloudPopup .wrapper').stop().css({ marginTop: 0 });
	};

	var clickFn = function clickFn() {
	  if ($('.cloudPopup .wrapper>p').length < 2) return;
	  $('.cloudPopup .wrapper').toggleClass('on');
	  if ($('.cloudPopup .wrapper').hasClass('on')) {
	    clearInt();
	    $('.cloudPopup').css({ height: $('.cloudPopup .wrapper>p').length * 26 + 'px' });
	  } else {
	    $('.cloudPopup').css({ height: '26px' });
	    playFn();
	  }
	};

	var addNewsTip = exports.addNewsTip = function addNewsTip(key, text) {
	  clearInt();
	  $('.cloudPopup').css({ height: '26px' });
	  $('.cloudPopup .wrapper').removeClass('on');

	  $('.cloudPopup .wrapper>p').off('click');
	  $('.cloudPopup .wrapper').append('<p class="tip-' + key + '">' + text + '</p>');
	  setTimeout(function () {
	    $('.cloudPopup .wrapper>p').click(clickFn);
	  }, 0);
	  $('.cloudPopup').show();
	  if ($('.cloudPopup .wrapper>p').length >= 2) playFn();
	};

	var removeNewsTip = exports.removeNewsTip = function removeNewsTip(key) {
	  clearInt();
	  $('.cloudPopup').css({ height: '26px' });
	  $('.cloudPopup .wrapper').removeClass('on');

	  $('.cloudPopup .wrapper .tip-' + key).remove();
	  if ($('.cloudPopup .wrapper>p').length >= 2) playFn();
	  if (!$('.cloudPopup .wrapper>p').length) $('.cloudPopup').hide();
	};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map