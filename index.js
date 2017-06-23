'use strict';

var debug = false;
var stack = 'init';
var paths = [];

function prepareSelectors(paths, root) {
  if (debug) console.log('[INFO] paths : ' + JSON.stringify(paths));
  var sPaths = [];
  for (var i = 0; i < paths.length; i++) {
    var val = '';
    var objPath = paths[i];
    var objKeys = Object.keys(objPath);
    objKeys.forEach(function(key) {
      var node = objPath[key];
      if (node !== null) {
        if (isNaN(node)) {
          if (node === 'root' && objKeys.indexOf(key) === 0) { // check if the first node value is "root"
            val += node.toString();
          } else {
            val += '[\'' + node.toString().replace('\'', '\\\'') + '\']'; // val += node + '.';
          }
        } else {
          val += '[' + node.toString() + ']';
        }
      }
    });
    var sPath = val.replace(/^root/g, root).replace(/\.\[/g, '[');
    sPaths.push(sPath)
  }
  paths = [];
  if (debug) console.log('[INFO] sPaths : ' + JSON.stringify(sPaths));
  return sPaths;
}

function pushState(value) {
  var count = Object.keys(stack).length;
  stack[count] = value;
  if (debug) console.log('[INFO] PUSHed ' + value + ' : ' + JSON.stringify(stack));
}

function popState(marker) {
  var count = Object.keys(stack).length;
  if (count > 1) {
    var last_element = count - 1;
    var pop_elem = stack[last_element];
    delete stack[last_element];
    if (debug) console.log('[INFO] POPed ' + pop_elem + ' from ' + marker + ': ' + JSON.stringify(stack));
  }
}

function savePath(stack) {
  if ((paths.indexOf(stack) === -1) || paths.length === 0) {
    if (debug) console.log('[INFO] Pushing ' + JSON.stringify(stack) + ' in Paths');
    paths[paths.length] = JSON.parse(JSON.stringify(stack));
    if (debug) console.log('[INFO] Paths: ' + JSON.stringify(paths));
  }
}

function isObjEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

function findInArray(varArray, needle) {
  if (debug) console.log('================ENTERED {findInArray}================');

  var found = false;

  if (needle instanceof Array && varArray.join() === needle.join()) {
    if (debug) console.log('[INFO] Matched Array in {findInArray} IF ' + JSON.stringify(needle) + ' in ' + JSON.stringify(stack));

    found = true;
  }

  for (var item in varArray) {
    if (debug) console.log('[INFO] Working Array\'s element ' + item);
    pushState(item);
    if (needle === varArray[item]) {
      if (debug) console.log('[INFO] Found in {findInArray} IF ' + needle + ' in ' + JSON.stringify(stack));

      found = true;
    } else if (typeof(varArray[item]) === 'object') {
      if (debug) console.log('[INFO] in {findInArray} ELSE IF ');

      if (varArray[item] instanceof Array) {
        if (findInArray(varArray[item], needle)) {
          if (debug) console.log('[INFO] found in {findInArray}:{findInArray} ELSE IF');

          found = true;
        }
      } else {
        if (findInObject(varArray[item], needle)) {
          if (debug) console.log('[INFO] found in {findInArray}:{findInObject} ELSE IF');
          found = true;
        }
      }
    } else {
      if (debug) console.log('[INFO] in {findInArray} ELSE');
      if (debug) console.log('===========LEFT {findInArray}================');
      if (searchInObject(varArray[item], needle)) {
        if (debug) console.log('[INFO] found in {findInArray} ELSE');
        found = true;
      } else {
        if (debug) console.log('================ENTERED {findInArray}================');
      }
    }

    if (found) {
      savePath(stack);
      popState('{findInArray}-found');
      found = false;
    }
  }
  popState('{findInArray}');
  if (debug) console.log('===========LEFT {findInObject}================');
  return found;
}

function findInObject(varObject, needle) {
  if (debug) console.log('================ENTERED {findInObject}================');

  var found = false;

  if (typeof(needle) === 'object' && !(needle instanceof Array) && isObjEqual(needle, varObject)) {
    if (debug) console.log('[INFO] Matched Object in {findInObject} IF ' + JSON.stringify(needle) + ' in ' + JSON.stringify(stack));

    found = true;
  }

  for (var item in varObject) {

    if (debug) console.log('[INFO] Working Object\'s element ' + item);
    pushState(item);

    if ((item === needle) || (varObject[item] === needle)) {
      if (debug) console.log('[INFO] in {findInObject} IF ');
      if (debug) console.log('[INFO] Found in {findInObject} IF ' + needle + ' in ' + JSON.stringify(stack));
      if (debug) console.log('===========LEFT {findInObject}================');
      found = true;

    } else if (typeof(varObject[item]) === 'object') {
      if (debug) console.log('[INFO] in {findInObject} ELSE IF ');

      if (varObject[item] instanceof Array) {

        if (findInArray(varObject[item], needle)) {
          if (debug) console.log('[INFO] found in {findInObject}:{findInArray} ELSE IF');

          found = true;
        }

      } else {

        if (findInObject(varObject[item], needle)) {
          if (debug) console.log('[INFO] found in {findInObject}:{findInObject} ELSE IF');

          found = true;
        }

      }
    } else {

      if (debug) console.log('[INFO] in {findInObject} ELSE');
      if (debug) console.log('===========LEFT {findInObject}================');
      if (searchInObject(varObject[item], needle)) {
        if (debug) console.log('[INFO] found in {findInObject} ELSE');

        found = true;

      } else {
        if (debug) console.log('================ENTERED {findInObject}================');
      }
    }

    if (found) {

      savePath(stack);
      popState('{findInObject}-found');
      found = false;
    }
  }

  popState('{findInObject}');
  if (debug) console.log('===========LEFT {findInObject}================');
  return found;
}

function searchInObject(haystack, needle) {
  if (debug) console.log('================ENTERED {search}================');
  if (stack === 'init') {
    stack = {
      0: 'root'
    };
  }

  var type = typeof(haystack);

  switch (type) {
    case 'object':
      if (haystack instanceof Array) {
        if (debug) console.log('===========LEFT {search} to {findInArray}================');
        var result = findInArray(haystack, needle);
      } else {
        if (debug) console.log('===========LEFT {search} to {findInObject}================');
        var result = findInObject(haystack, needle);
      }
      break;

    default:
      if (needle === haystack) {
        var result = true;
        if (debug) console.log('[search] Found: ' + JSON.stringify(stack));
        result = false;
        savePath(stack);
      }
      break;
  }
  if (result) {
    if (debug) console.log('[INFO] (search) Found ' + JSON.stringify(needle) + ' in ' + JSON.stringify(result));
    if (debug) console.log('===========LEFT {search}================');
    return true;
  }
  popState(stack, '{search}');
  if (debug) console.log('===========LEFT {search}================');
  return false;
}

function getSibling(selector, json, direction) {
  //replace the original object's literal name with "json"
  var strOriginalContext = selector.substring(0, selector.indexOf('[')); // var strOriginalContext = selector.substring(0, selector.indexOf('.'));
  selector = selector.replace(strOriginalContext, "json");
  if (!selector || !json || !direction) return undefined;
  var found = false;
  var nextSiblingValue = null;
  if (selector === undefined) return undefined;
  var bookmark = parseInt(selector.split('[').pop(-1).split(']')[0]);
  if (isNaN(bookmark)) {
    bookmark = selector.split('[').pop(-1).split(']')[0].replace(/^'/gi, '').replace(/'$/gi, '');
  }
  if (debug) console.log('selector: ' + selector);
  if (debug) console.log('bookmark: ' + bookmark);
  var parentSelector = getParentNode(selector);

  if (debug) console.log('parent before eval: ' + parentSelector);
  var parentObject = eval(parentSelector);
  var that = this;
  if (debug) console.log('parent after eval: ' + JSON.stringify(parentObject));
  var keys = Object.keys(parentObject);
  if (debug) console.log('keys: ' + JSON.stringify(keys));
  if (debug) console.log('direction: ' + direction);
  switch (direction) {
    case 'previous':
      if (!isNaN(bookmark)) {
        var index = bookmark - 1;
        index = index < 0 ? undefined : index;
        if(index === undefined) return undefined;
        var strNewContext = parentSelector.substring(0, parentSelector.indexOf('[')); // var strNewContext = parentSelector.substring(0, parentSelector.indexOf('.'));
        parentSelector = parentSelector.replace("json", strOriginalContext);
        return parentSelector + '[' + index + ']';
      } else {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === bookmark) {
            if (!keys[i - 1]) return undefined;
            var strNewContext = parentSelector.substring(0, parentSelector.indexOf('[')); // var strNewContext = parentSelector.substring(0, parentSelector.indexOf('.'));
            parentSelector = parentSelector.replace("json", strOriginalContext);
            return parentSelector + '[\'' + keys[i - 1] + '\']';
          }
        }
      }
      break;
    case 'next':
      if (!isNaN(bookmark)) {
        var index = bookmark + 1;
        index = index >= parentObject.length ? undefined : index
        if(index === undefined) return undefined;
        var strNewContext = parentSelector.substring(0, parentSelector.indexOf('[')); // var strNewContext = parentSelector.substring(0, parentSelector.indexOf('.'));
        parentSelector = parentSelector.replace("json", strOriginalContext);
        return parentSelector + '[' + index + ']';
      } else {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === bookmark) {
            if (!keys[i + 1]) return undefined;
            var strNewContext = parentSelector.substring(0, parentSelector.indexOf('[')); // var strNewContext = parentSelector.substring(0, parentSelector.indexOf('.'));
            parentSelector = parentSelector.replace("json", strOriginalContext);
            return parentSelector + '[\'' + keys[i + 1] + '\']';
          }
        }
      }
      break;
  }
}

// Duplicate definition of getParent to deal with scoping issues
function getParentNode(strSelector) {
  if (strSelector.endsWith(']')) {
    if (debug) console.log('getParentNode: ' + strSelector.substring(0, strSelector.lastIndexOf('[')));
    return strSelector.substring(0, strSelector.lastIndexOf('['));
  } else {
    if (debug) console.log('getParentNode: ' + strSelector.substring(0, strSelector.lastIndexOf('.')));
    return strSelector.substring(0, strSelector.lastIndexOf('.'));
  }
}

function isSelectorArray(strSelector) {
  if(strSelector.endsWith(']')) {
    if (debug) console.log('isSelectorArray: ' + true);
    return true;
  } else {
    if (debug) console.log('isSelectorArray: ' + false);
    return false;
  }
}

function getCurrentIndex(strSelector) {
  var startPos = strSelector.lastIndexOf('[') + 1;
  var endPos = strSelector.length - 1;
  if(isSelectorArray(strSelector)) {
    if (debug) console.log('getCurrentIndex: ' + parseInt(strSelector.substring(startPos, endPos)));
    return parseInt(strSelector.substring(strSelector.lastIndexOf('[')+1, strSelector.length-1));
  } else return undefined;
}

function Element(path, haystack) {
  this.path = path;
  this.obj = haystack;
}

Element.prototype.parent = function() {
  if (!this.path) return undefined;
  var selector = this.path;
  if (selector.endsWith(']')) {
    selector = selector.substring(0, selector.lastIndexOf('['));
  } else {
    selector = selector.substring(0, selector.lastIndexOf('.'));
  }
  return new Element(selector, this.obj);
};

Element.prototype.val = function() {
  if (!this.path || !this.obj) return undefined;
  var rootObject = this.path.replace(this.path.substring(0, this.path.indexOf('[')), 'this.obj');
  return eval(rootObject);
};

Element.prototype.next = function() {
  if (!this.path || !this.obj) return undefined;
  return new Element(getSibling(this.path, this.obj, 'next'), this.obj);
};

Element.prototype.prev = function() {
  if (!this.path || !this.obj) return undefined;
  return new Element(getSibling(this.path, this.obj, 'previous'), this.obj);
};

Element.prototype.addAfter = function(toInsert) {
  if(!toInsert) return undefined;
  if (debug) console.log('this.path: ' + this.path)
  if (isSelectorArray(this.path)) {
    var currentIndex = getCurrentIndex(this.path) + 1;
    if (debug) console.log('currentIndex: ' + currentIndex);
    if (debug) console.log(getParentNode(this.path) + ".splice(" + currentIndex + ", 0, " + JSON.stringify(toInsert) + ")");
    var newSelector = getParentNode(this.path); //var newSelector = getParentNode(this.path).split('.');
    newSelector = newSelector.replace(this.path.substring(0, this.path.indexOf('[')), 'this.obj'); // newSelector.splice(0, 1, 'this.obj');
    //newSelector = newSelector.join('.');
    if (debug) console.log(newSelector);
    eval(newSelector + ".splice(" + currentIndex + ", 0, " + toInsert + ")");
  }
  return new Element(getSibling(this.path, this.obj, 'next'), this.obj);
};

Element.prototype.addBefore = function(toInsert) {
  if(!toInsert) return undefined;
  if(isSelectorArray(this.path)) {
    var currentIndex = getCurrentIndex(this.path) - 1;
    if (debug) console.log(getParentNode(this.path) + ".splice(" + currentIndex + ", 0, " + JSON.stringify(toInsert) + ")");
    var newSelector = getParentNode(this.path); // var newSelector = getParentNode(this.path).split('.');
    newSelector = newSelector.replace(this.path.substring(0, this.path.indexOf('[')), 'this.obj'); // newSelector.splice(0, 1, 'this.obj');
    // newSelector = newSelector.join('.');
    if (debug) console.log('addBefore.newSelector: ' + newSelector);
    eval(newSelector + ".splice(" + currentIndex + ", 0, " + toInsert + ")");
  }
  return new Element(getSibling(this.path, this.obj, 'previous'), this.obj);
};

Element.prototype.replace = function(value) {
if(!value) return undefined;
  var newSelector = this.path; // var newSelector = this.path.split('.');
  newSelector = newSelector.replace(this.path.substring(0, this.path.indexOf('[')), 'this.obj'); // newSelector.splice(0, 1, 'this.obj');
  // newSelector = newSelector.join('.');
  if(typeof value === "string") {
    if (debug) console.log('assign str: ' + newSelector + ' = \"' + value + '\";');
    eval(newSelector + ' = \"' + value + '\";');
  } else if (typeof value === "object") {
    if (debug) console.log('assign obj: ' + newSelector + ' = ' + JSON.stringify(value) + ';');
    eval(newSelector + ' = ' + JSON.stringify(value) + ';');
  } else {
    eval(newSelector + ' = ' + value.toString() + ';');
  }
  return new Element(this.path, this.obj);
};

var tweezr = {
  findAll: function(keyword, objHaystack, strContext, callback) {
    paths = [];
    var Elements = [];
    searchInObject(objHaystack, keyword); // paths[] enumerated
    var allSelectors = prepareSelectors(paths, strContext);
    for (var i = 0; i < allSelectors.length; i++) {
        Elements.push(new Element(allSelectors[i], objHaystack));
    }
    if (callback) {
      callback(Elements);
    } else {
      return Elements;
    }
  },

  findAndReplaceAll: function(data, find, replace, callback) {
    paths = [];
    var json = typeof data === 'string' ? JSON.parse(data) : typeof data === 'object' ? data : {};
    searchInObject(json, find);
    var selectors = prepareSelectors(paths, 'json');
    selectors.forEach(function(selector) {
      eval(selector + '=\'' + replace + '\'');
    });
    if (callback) {
      callback(json);
    } else {
      return json;
    }
  }
};

module.exports = {
  init: function(options) {
    options = options || {};
    debug = options && options.debug || false;
    return tweezr;
  }
};