/**
 * State-based routing for AngularJS 1.x
 * NOTICE: This monolithic bundle also bundles the @uirouter/core code.
 *         This causes it to be incompatible with plugins that depend on @uirouter/core.
 *         We recommend switching to the ui-router-core.js and ui-router-angularjs.js bundles instead.
 *         For more information, see https://ui-router.github.io/blog/uirouter-for-angularjs-umd-bundles
 * @version v1.0.19
 * @link https://ui-router.github.io
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('angular')) :
    typeof define === 'function' && define.amd ? define(['exports', 'angular'], factory) :
    (factory((global['@uirouter/angularjs'] = {}),global.angular));
}(this, (function (exports,ng_from_import) { 'use strict';

    var ng_from_global = angular;
    var ng = ng_from_import && ng_from_import.module ? ng_from_import : ng_from_global;

    /**
     * Higher order functions
     *
     * These utility functions are exported, but are subject to change without notice.
     *
     * @module common_hof
     */ /** */
    /**
     * Returns a new function for [Partial Application](https://en.wikipedia.org/wiki/Partial_application) of the original function.
     *
     * Given a function with N parameters, returns a new function that supports partial application.
     * The new function accepts anywhere from 1 to N parameters.  When that function is called with M parameters,
     * where M is less than N, it returns a new function that accepts the remaining parameters.  It continues to
     * accept more parameters until all N parameters have been supplied.
     *
     *
     * This contrived example uses a partially applied function as an predicate, which returns true
     * if an object is found in both arrays.
     * @example
     * ```
     * // returns true if an object is in both of the two arrays
     * function inBoth(array1, array2, object) {
     *   return array1.indexOf(object) !== -1 &&
     *          array2.indexOf(object) !== 1;
     * }
     * let obj1, obj2, obj3, obj4, obj5, obj6, obj7
     * let foos = [obj1, obj3]
     * let bars = [obj3, obj4, obj5]
     *
     * // A curried "copy" of inBoth
     * let curriedInBoth = curry(inBoth);
     * // Partially apply both the array1 and array2
     * let inFoosAndBars = curriedInBoth(foos, bars);
     *
     * // Supply the final argument; since all arguments are
     * // supplied, the original inBoth function is then called.
     * let obj1InBoth = inFoosAndBars(obj1); // false
     *
     * // Use the inFoosAndBars as a predicate.
     * // Filter, on each iteration, supplies the final argument
     * let allObjs = [ obj1, obj2, obj3, obj4, obj5, obj6, obj7 ];
     * let foundInBoth = allObjs.filter(inFoosAndBars); // [ obj3 ]
     *
     * ```
     *
     * Stolen from: http://stackoverflow.com/questions/4394747/javascript-curry-function
     *
     * @param fn
     * @returns {*|function(): (*|any)}
     */
    function curry(fn) {
        var initial_args = [].slice.apply(arguments, [1]);
        var func_args_length = fn.length;
        function curried(args) {
            if (args.length >= func_args_length)
                return fn.apply(null, args);
            return function () {
                return curried(args.concat([].slice.apply(arguments)));
            };
        }
        return curried(initial_args);
    }
    /**
     * Given a varargs list of functions, returns a function that composes the argument functions, right-to-left
     * given: f(x), g(x), h(x)
     * let composed = compose(f,g,h)
     * then, composed is: f(g(h(x)))
     */
    function compose() {
        var args = arguments;
        var start = args.length - 1;
        return function () {
            var i = start, result = args[start].apply(this, arguments);
            while (i--)
                result = args[i].call(this, result);
            return result;
        };
    }
    /**
     * Given a varargs list of functions, returns a function that is composes the argument functions, left-to-right
     * given: f(x), g(x), h(x)
     * let piped = pipe(f,g,h);
     * then, piped is: h(g(f(x)))
     */
    function pipe() {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        return compose.apply(null, [].slice.call(arguments).reverse());
    }
    /**
     * Given a property name, returns a function that returns that property from an object
     * let obj = { foo: 1, name: "blarg" };
     * let getName = prop("name");
     * getName(obj) === "blarg"
     */
    var prop = function (name) { return function (obj) { return obj && obj[name]; }; };
    /**
     * Given a property name and a value, returns a function that returns a boolean based on whether
     * the passed object has a property that matches the value
     * let obj = { foo: 1, name: "blarg" };
     * let getName = propEq("name", "blarg");
     * getName(obj) === true
     */
    var propEq = curry(function (name, _val, obj) { return obj && obj[name] === _val; });
    /**
     * Given a dotted property name, returns a function that returns a nested property from an object, or undefined
     * let obj = { id: 1, nestedObj: { foo: 1, name: "blarg" }, };
     * let getName = prop("nestedObj.name");
     * getName(obj) === "blarg"
     * let propNotFound = prop("this.property.doesnt.exist");
     * propNotFound(obj) === undefined
     */
    var parse = function (name) { return pipe.apply(null, name.split('.').map(prop)); };
    /**
     * Given a function that returns a truthy or falsey value, returns a
     * function that returns the opposite (falsey or truthy) value given the same inputs
     */
    var not = function (fn) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return !fn.apply(null, args);
    }; };
    /**
     * Given two functions that return truthy or falsey values, returns a function that returns truthy
     * if both functions return truthy for the given arguments
     */
    function and(fn1, fn2) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fn1.apply(null, args) && fn2.apply(null, args);
        };
    }
    /**
     * Given two functions that return truthy or falsey values, returns a function that returns truthy
     * if at least one of the functions returns truthy for the given arguments
     */
    function or(fn1, fn2) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fn1.apply(null, args) || fn2.apply(null, args);
        };
    }
    /**
     * Check if all the elements of an array match a predicate function
     *
     * @param fn1 a predicate function `fn1`
     * @returns a function which takes an array and returns true if `fn1` is true for all elements of the array
     */
    var all = function (fn1) { return function (arr) { return arr.reduce(function (b, x) { return b && !!fn1(x); }, true); }; };
    // tslint:disable-next-line:variable-name
    var any = function (fn1) { return function (arr) { return arr.reduce(function (b, x) { return b || !!fn1(x); }, false); }; };
    /** Given a class, returns a Predicate function that returns true if the object is of that class */
    var is = function (ctor) { return function (obj) {
        return (obj != null && obj.constructor === ctor) || obj instanceof ctor;
    }; };
    /** Given a value, returns a Predicate function that returns true if another value is === equal to the original value */
    var eq = function (value) { return function (other) { return value === other; }; };
    /** Given a value, returns a function which returns the value */
    var val = function (v) { return function () { return v; }; };
    function invoke(fnName, args) {
        return function (obj) { return obj[fnName].apply(obj, args); };
    }
    /**
     * Sorta like Pattern Matching (a functional programming conditional construct)
     *
     * See http://c2.com/cgi/wiki?PatternMatching
     *
     * This is a conditional construct which allows a series of predicates and output functions
     * to be checked and then applied.  Each predicate receives the input.  If the predicate
     * returns truthy, then its matching output function (mapping function) is provided with
     * the input and, then the result is returned.
     *
     * Each combination (2-tuple) of predicate + output function should be placed in an array
     * of size 2: [ predicate, mapFn ]
     *
     * These 2-tuples should be put in an outer array.
     *
     * @example
     * ```
     *
     * // Here's a 2-tuple where the first element is the isString predicate
     * // and the second element is a function that returns a description of the input
     * let firstTuple = [ angular.isString, (input) => `Heres your string ${input}` ];
     *
     * // Second tuple: predicate "isNumber", mapfn returns a description
     * let secondTuple = [ angular.isNumber, (input) => `(${input}) That's a number!` ];
     *
     * let third = [ (input) => input === null,  (input) => `Oh, null...` ];
     *
     * let fourth = [ (input) => input === undefined,  (input) => `notdefined` ];
     *
     * let descriptionOf = pattern([ firstTuple, secondTuple, third, fourth ]);
     *
     * console.log(descriptionOf(undefined)); // 'notdefined'
     * console.log(descriptionOf(55)); // '(55) That's a number!'
     * console.log(descriptionOf("foo")); // 'Here's your string foo'
     * ```
     *
     * @param struct A 2D array.  Each element of the array should be an array, a 2-tuple,
     * with a Predicate and a mapping/output function
     * @returns {function(any): *}
     */
    function pattern(struct) {
        return function (x) {
            for (var i = 0; i < struct.length; i++) {
                if (struct[i][0](x))
                    return struct[i][1](x);
            }
        };
    }

    /** Predicates
     *
     * These predicates return true/false based on the input.
     * Although these functions are exported, they are subject to change without notice.
     *
     * @module common_predicates
     */
    var toStr = Object.prototype.toString;
    var tis = function (t) { return function (x) { return typeof x === t; }; };
    var isUndefined = tis('undefined');
    var isDefined = not(isUndefined);
    var isNull = function (o) { return o === null; };
    var isNullOrUndefined = or(isNull, isUndefined);
    var isFunction = tis('function');
    var isNumber = tis('number');
    var isString = tis('string');
    var isObject = function (x) { return x !== null && typeof x === 'object'; };
    var isArray = Array.isArray;
    var isDate = (function (x) { return toStr.call(x) === '[object Date]'; });
    var isRegExp = (function (x) { return toStr.call(x) === '[object RegExp]'; });
    /**
     * Predicate which checks if a value is injectable
     *
     * A value is "injectable" if it is a function, or if it is an ng1 array-notation-style array
     * where all the elements in the array are Strings, except the last one, which is a Function
     */
    function isInjectable(val$$1) {
        if (isArray(val$$1) && val$$1.length) {
            var head = val$$1.slice(0, -1), tail = val$$1.slice(-1);
            return !(head.filter(not(isString)).length || tail.filter(not(isFunction)).length);
        }
        return isFunction(val$$1);
    }
    /**
     * Predicate which checks if a value looks like a Promise
     *
     * It is probably a Promise if it's an object, and it has a `then` property which is a Function
     */
    var isPromise = and(isObject, pipe(prop('then'), isFunction));

    var notImplemented = function (fnname) { return function () {
        throw new Error(fnname + "(): No coreservices implementation for UI-Router is loaded.");
    }; };
    var services = {
        $q: undefined,
        $injector: undefined,
    };

    /**
     * Random utility functions used in the UI-Router code
     *
     * These functions are exported, but are subject to change without notice.
     *
     * @preferred
     * @module common
     */
    var root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global) ||
        undefined;
    var angular$1 = root.angular || {};
    var fromJson = angular$1.fromJson || JSON.parse.bind(JSON);
    var toJson = angular$1.toJson || JSON.stringify.bind(JSON);
    var forEach = angular$1.forEach || _forEach;
    var extend = Object.assign || _extend;
    var equals = angular$1.equals || _equals;
    function identity(x) {
        return x;
    }
    function noop() { }
    /**
     * Builds proxy functions on the `to` object which pass through to the `from` object.
     *
     * For each key in `fnNames`, creates a proxy function on the `to` object.
     * The proxy function calls the real function on the `from` object.
     *
     *
     * #### Example:
     * This example creates an new class instance whose functions are prebound to the new'd object.
     * ```js
     * class Foo {
     *   constructor(data) {
     *     // Binds all functions from Foo.prototype to 'this',
     *     // then copies them to 'this'
     *     bindFunctions(Foo.prototype, this, this);
     *     this.data = data;
     *   }
     *
     *   log() {
     *     console.log(this.data);
     *   }
     * }
     *
     * let myFoo = new Foo([1,2,3]);
     * var logit = myFoo.log;
     * logit(); // logs [1, 2, 3] from the myFoo 'this' instance
     * ```
     *
     * #### Example:
     * This example creates a bound version of a service function, and copies it to another object
     * ```
     *
     * var SomeService = {
     *   this.data = [3, 4, 5];
     *   this.log = function() {
     *     console.log(this.data);
     *   }
     * }
     *
     * // Constructor fn
     * function OtherThing() {
     *   // Binds all functions from SomeService to SomeService,
     *   // then copies them to 'this'
     *   bindFunctions(SomeService, this, SomeService);
     * }
     *
     * let myOtherThing = new OtherThing();
     * myOtherThing.log(); // logs [3, 4, 5] from SomeService's 'this'
     * ```
     *
     * @param source A function that returns the source object which contains the original functions to be bound
     * @param target A function that returns the target object which will receive the bound functions
     * @param bind A function that returns the object which the functions will be bound to
     * @param fnNames The function names which will be bound (Defaults to all the functions found on the 'from' object)
     * @param latebind If true, the binding of the function is delayed until the first time it's invoked
     */
    function createProxyFunctions(source, target, bind, fnNames, latebind) {
        if (latebind === void 0) { latebind = false; }
        var bindFunction = function (fnName) { return source()[fnName].bind(bind()); };
        var makeLateRebindFn = function (fnName) {
            return function lateRebindFunction() {
                target[fnName] = bindFunction(fnName);
                return target[fnName].apply(null, arguments);
            };
        };
        fnNames = fnNames || Object.keys(source());
        return fnNames.reduce(function (acc, name) {
            acc[name] = latebind ? makeLateRebindFn(name) : bindFunction(name);
            return acc;
        }, target);
    }
    /**
     * prototypal inheritance helper.
     * Creates a new object which has `parent` object as its prototype, and then copies the properties from `extra` onto it
     */
    var inherit = function (parent, extra) { return extend(Object.create(parent), extra); };
    /** Given an array, returns true if the object is found in the array, (using indexOf) */
    var inArray = curry(_inArray);
    function _inArray(array, obj) {
        return array.indexOf(obj) !== -1;
    }
    /**
     * Given an array, and an item, if the item is found in the array, it removes it (in-place).
     * The same array is returned
     */
    var removeFrom = curry(_removeFrom);
    function _removeFrom(array, obj) {
        var idx = array.indexOf(obj);
        if (idx >= 0)
            array.splice(idx, 1);
        return array;
    }
    /** pushes a values to an array and returns the value */
    var pushTo = curry(_pushTo);
    function _pushTo(arr, val$$1) {
        return arr.push(val$$1), val$$1;
    }
    /** Given an array of (deregistration) functions, calls all functions and removes each one from the source array */
    var deregAll = function (functions) {
        return functions.slice().forEach(function (fn) {
            typeof fn === 'function' && fn();
            removeFrom(functions, fn);
        });
    };
    /**
     * Applies a set of defaults to an options object.  The options object is filtered
     * to only those properties of the objects in the defaultsList.
     * Earlier objects in the defaultsList take precedence when applying defaults.
     */
    function defaults(opts) {
        var defaultsList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            defaultsList[_i - 1] = arguments[_i];
        }
        var defaultVals = extend.apply(void 0, [{}].concat(defaultsList.reverse()));
        return extend(defaultVals, pick(opts || {}, Object.keys(defaultVals)));
    }
    /** Reduce function that merges each element of the list into a single object, using extend */
    var mergeR = function (memo, item) { return extend(memo, item); };
    /**
     * Finds the common ancestor path between two states.
     *
     * @param {Object} first The first state.
     * @param {Object} second The second state.
     * @return {Array} Returns an array of state names in descending order, not including the root.
     */
    function ancestors(first, second) {
        var path = [];
        // tslint:disable-next-line:forin
        for (var n in first.path) {
            if (first.path[n] !== second.path[n])
                break;
            path.push(first.path[n]);
        }
        return path;
    }
    /**
     * Return a copy of the object only containing the whitelisted properties.
     *
     * #### Example:
     * ```
     * var foo = { a: 1, b: 2, c: 3 };
     * var ab = pick(foo, ['a', 'b']); // { a: 1, b: 2 }
     * ```
     * @param obj the source object
     * @param propNames an Array of strings, which are the whitelisted property names
     */
    function pick(obj, propNames) {
        var objCopy = {};
        for (var _prop in obj) {
            if (propNames.indexOf(_prop) !== -1) {
                objCopy[_prop] = obj[_prop];
            }
        }
        return objCopy;
    }
    /**
     * Return a copy of the object omitting the blacklisted properties.
     *
     * @example
     * ```
     *
     * var foo = { a: 1, b: 2, c: 3 };
     * var ab = omit(foo, ['a', 'b']); // { c: 3 }
     * ```
     * @param obj the source object
     * @param propNames an Array of strings, which are the blacklisted property names
     */
    function omit(obj, propNames) {
        return Object.keys(obj)
            .filter(not(inArray(propNames)))
            .reduce(function (acc, key) { return ((acc[key] = obj[key]), acc); }, {});
    }
    /**
     * Maps an array, or object to a property (by name)
     */
    function pluck(collection, propName) {
        return map(collection, prop(propName));
    }
    /** Filters an Array or an Object's properties based on a predicate */
    function filter(collection, callback) {
        var arr = isArray(collection), result = arr ? [] : {};
        var accept = arr ? function (x) { return result.push(x); } : function (x, key) { return (result[key] = x); };
        forEach(collection, function (item, i) {
            if (callback(item, i))
                accept(item, i);
        });
        return result;
    }
    /** Finds an object from an array, or a property of an object, that matches a predicate */
    function find(collection, callback) {
        var result;
        forEach(collection, function (item, i) {
            if (result)
                return;
            if (callback(item, i))
                result = item;
        });
        return result;
    }
    /** Given an object, returns a new object, where each property is transformed by the callback function */
    var mapObj = map;
    /** Maps an array or object properties using a callback function */
    function map(collection, callback, target) {
        target = target || (isArray(collection) ? [] : {});
        forEach(collection, function (item, i) { return (target[i] = callback(item, i)); });
        return target;
    }
    /**
     * Given an object, return its enumerable property values
     *
     * @example
     * ```
     *
     * let foo = { a: 1, b: 2, c: 3 }
     * let vals = values(foo); // [ 1, 2, 3 ]
     * ```
     */
    var values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
    /**
     * Reduce function that returns true if all of the values are truthy.
     *
     * @example
     * ```
     *
     * let vals = [ 1, true, {}, "hello world"];
     * vals.reduce(allTrueR, true); // true
     *
     * vals.push(0);
     * vals.reduce(allTrueR, true); // false
     * ```
     */
    var allTrueR = function (memo, elem) { return memo && elem; };
    /**
     * Reduce function that returns true if any of the values are truthy.
     *
     *  * @example
     * ```
     *
     * let vals = [ 0, null, undefined ];
     * vals.reduce(anyTrueR, true); // false
     *
     * vals.push("hello world");
     * vals.reduce(anyTrueR, true); // true
     * ```
     */
    var anyTrueR = function (memo, elem) { return memo || elem; };
    /**
     * Reduce function which un-nests a single level of arrays
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * input.reduce(unnestR, []) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
     * ```
     */
    var unnestR = function (memo, elem) { return memo.concat(elem); };
    /**
     * Reduce function which recursively un-nests all arrays
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * input.reduce(unnestR, []) // [ "a", "b", "c", "d", "double, "nested" ]
     * ```
     */
    var flattenR = function (memo, elem) {
        return isArray(elem) ? memo.concat(elem.reduce(flattenR, [])) : pushR(memo, elem);
    };
    /**
     * Reduce function that pushes an object to an array, then returns the array.
     * Mostly just for [[flattenR]] and [[uniqR]]
     */
    function pushR(arr, obj) {
        arr.push(obj);
        return arr;
    }
    /** Reduce function that filters out duplicates */
    var uniqR = function (acc, token) { return (inArray(acc, token) ? acc : pushR(acc, token)); };
    /**
     * Return a new array with a single level of arrays unnested.
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * unnest(input) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
     * ```
     */
    var unnest = function (arr) { return arr.reduce(unnestR, []); };
    /**
     * Return a completely flattened version of an array.
     *
     * @example
     * ```
     *
     * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
     * flatten(input) // [ "a", "b", "c", "d", "double, "nested" ]
     * ```
     */
    var flatten = function (arr) { return arr.reduce(flattenR, []); };
    /**
     * Given a .filter Predicate, builds a .filter Predicate which throws an error if any elements do not pass.
     * @example
     * ```
     *
     * let isNumber = (obj) => typeof(obj) === 'number';
     * let allNumbers = [ 1, 2, 3, 4, 5 ];
     * allNumbers.filter(assertPredicate(isNumber)); //OK
     *
     * let oneString = [ 1, 2, 3, 4, "5" ];
     * oneString.filter(assertPredicate(isNumber, "Not all numbers")); // throws Error(""Not all numbers"");
     * ```
     */
    var assertPredicate = assertFn;
    /**
     * Given a .map function, builds a .map function which throws an error if any mapped elements do not pass a truthyness test.
     * @example
     * ```
     *
     * var data = { foo: 1, bar: 2 };
     *
     * let keys = [ 'foo', 'bar' ]
     * let values = keys.map(assertMap(key => data[key], "Key not found"));
     * // values is [1, 2]
     *
     * let keys = [ 'foo', 'bar', 'baz' ]
     * let values = keys.map(assertMap(key => data[key], "Key not found"));
     * // throws Error("Key not found")
     * ```
     */
    var assertMap = assertFn;
    function assertFn(predicateOrMap, errMsg) {
        if (errMsg === void 0) { errMsg = 'assert failure'; }
        return function (obj) {
            var result = predicateOrMap(obj);
            if (!result) {
                throw new Error(isFunction(errMsg) ? errMsg(obj) : errMsg);
            }
            return result;
        };
    }
    /**
     * Like _.pairs: Given an object, returns an array of key/value pairs
     *
     * @example
     * ```
     *
     * pairs({ foo: "FOO", bar: "BAR }) // [ [ "foo", "FOO" ], [ "bar": "BAR" ] ]
     * ```
     */
    var pairs = function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); };
    /**
     * Given two or more parallel arrays, returns an array of tuples where
     * each tuple is composed of [ a[i], b[i], ... z[i] ]
     *
     * @example
     * ```
     *
     * let foo = [ 0, 2, 4, 6 ];
     * let bar = [ 1, 3, 5, 7 ];
     * let baz = [ 10, 30, 50, 70 ];
     * arrayTuples(foo, bar);       // [ [0, 1], [2, 3], [4, 5], [6, 7] ]
     * arrayTuples(foo, bar, baz);  // [ [0, 1, 10], [2, 3, 30], [4, 5, 50], [6, 7, 70] ]
     * ```
     */
    function arrayTuples() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0)
            return [];
        var maxArrayLen = args.reduce(function (min, arr) { return Math.min(arr.length, min); }, 9007199254740991); // aka 2^53 − 1 aka Number.MAX_SAFE_INTEGER
        var result = [];
        var _loop_1 = function (i) {
            // This is a hot function
            // Unroll when there are 1-4 arguments
            switch (args.length) {
                case 1:
                    result.push([args[0][i]]);
                    break;
                case 2:
                    result.push([args[0][i], args[1][i]]);
                    break;
                case 3:
                    result.push([args[0][i], args[1][i], args[2][i]]);
                    break;
                case 4:
                    result.push([args[0][i], args[1][i], args[2][i], args[3][i]]);
                    break;
                default:
                    result.push(args.map(function (array) { return array[i]; }));
                    break;
            }
        };
        for (var i = 0; i < maxArrayLen; i++) {
            _loop_1(i);
        }
        return result;
    }
    /**
     * Reduce function which builds an object from an array of [key, value] pairs.
     *
     * Each iteration sets the key/val pair on the memo object, then returns the memo for the next iteration.
     *
     * Each keyValueTuple should be an array with values [ key: string, value: any ]
     *
     * @example
     * ```
     *
     * var pairs = [ ["fookey", "fooval"], ["barkey", "barval"] ]
     *
     * var pairsToObj = pairs.reduce((memo, pair) => applyPairs(memo, pair), {})
     * // pairsToObj == { fookey: "fooval", barkey: "barval" }
     *
     * // Or, more simply:
     * var pairsToObj = pairs.reduce(applyPairs, {})
     * // pairsToObj == { fookey: "fooval", barkey: "barval" }
     * ```
     */
    function applyPairs(memo, keyValTuple) {
        var key, value;
        if (isArray(keyValTuple))
            key = keyValTuple[0], value = keyValTuple[1];
        if (!isString(key))
            throw new Error('invalid parameters to applyPairs');
        memo[key] = value;
        return memo;
    }
    /** Get the last element of an array */
    function tail(arr) {
        return (arr.length && arr[arr.length - 1]) || undefined;
    }
    /**
     * shallow copy from src to dest
     */
    function copy(src, dest) {
        if (dest)
            Object.keys(dest).forEach(function (key) { return delete dest[key]; });
        if (!dest)
            dest = {};
        return extend(dest, src);
    }
    /** Naive forEach implementation works with Objects or Arrays */
    function _forEach(obj, cb, _this) {
        if (isArray(obj))
            return obj.forEach(cb, _this);
        Object.keys(obj).forEach(function (key) { return cb(obj[key], key); });
    }
    function _extend(toObj) {
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            var keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j++) {
                toObj[keys[j]] = obj[keys[j]];
            }
        }
        return toObj;
    }
    function _equals(o1, o2) {
        if (o1 === o2)
            return true;
        if (o1 === null || o2 === null)
            return false;
        if (o1 !== o1 && o2 !== o2)
            return true; // NaN === NaN
        var t1 = typeof o1, t2 = typeof o2;
        if (t1 !== t2 || t1 !== 'object')
            return false;
        var tup = [o1, o2];
        if (all(isArray)(tup))
            return _arraysEq(o1, o2);
        if (all(isDate)(tup))
            return o1.getTime() === o2.getTime();
        if (all(isRegExp)(tup))
            return o1.toString() === o2.toString();
        if (all(isFunction)(tup))
            return true; // meh
        var predicates = [isFunction, isArray, isDate, isRegExp];
        if (predicates.map(any).reduce(function (b, fn) { return b || !!fn(tup); }, false))
            return false;
        var keys = {};
        // tslint:disable-next-line:forin
        for (var key in o1) {
            if (!_equals(o1[key], o2[key]))
                return false;
            keys[key] = true;
        }
        for (var key in o2) {
            if (!keys[key])
                return false;
        }
        return true;
    }
    function _arraysEq(a1, a2) {
        if (a1.length !== a2.length)
            return false;
        return arrayTuples(a1, a2).reduce(function (b, t) { return b && _equals(t[0], t[1]); }, true);
    }
    // issue #2676
    var silenceUncaughtInPromise = function (promise) { return promise.catch(function (e) { return 0; }) && promise; };
    var silentRejection = function (error) { return silenceUncaughtInPromise(services.$q.reject(error)); };

    /**
     * @coreapi
     * @module core
     */
    /**
     * Matches state names using glob-like pattern strings.
     *
     * Globs can be used in specific APIs including:
     *
     * - [[StateService.is]]
     * - [[StateService.includes]]
     * - The first argument to Hook Registration functions like [[TransitionService.onStart]]
     *    - [[HookMatchCriteria]] and [[HookMatchCriterion]]
     *
     * A `Glob` string is a pattern which matches state names.
     * Nested state names are split into segments (separated by a dot) when processing.
     * The state named `foo.bar.baz` is split into three segments ['foo', 'bar', 'baz']
     *
     * Globs work according to the following rules:
     *
     * ### Exact match:
     *
     * The glob `'A.B'` matches the state named exactly `'A.B'`.
     *
     * | Glob        |Matches states named|Does not match state named|
     * |:------------|:--------------------|:---------------------|
     * | `'A'`       | `'A'`               | `'B'` , `'A.C'`      |
     * | `'A.B'`     | `'A.B'`             | `'A'` , `'A.B.C'`    |
     * | `'foo'`     | `'foo'`             | `'FOO'` , `'foo.bar'`|
     *
     * ### Single star (`*`)
     *
     * A single star (`*`) is a wildcard that matches exactly one segment.
     *
     * | Glob        |Matches states named  |Does not match state named |
     * |:------------|:---------------------|:--------------------------|
     * | `'*'`       | `'A'` , `'Z'`        | `'A.B'` , `'Z.Y.X'`       |
     * | `'A.*'`     | `'A.B'` , `'A.C'`    | `'A'` , `'A.B.C'`         |
     * | `'A.*.*'`   | `'A.B.C'` , `'A.X.Y'`| `'A'`, `'A.B'` , `'Z.Y.X'`|
     *
     * ### Double star (`**`)
     *
     * A double star (`'**'`) is a wildcard that matches *zero or more segments*
     *
     * | Glob        |Matches states named                           |Does not match state named         |
     * |:------------|:----------------------------------------------|:----------------------------------|
     * | `'**'`      | `'A'` , `'A.B'`, `'Z.Y.X'`                    | (matches all states)              |
     * | `'A.**'`    | `'A'` , `'A.B'` , `'A.C.X'`                   | `'Z.Y.X'`                         |
     * | `'**.X'`    | `'X'` , `'A.X'` , `'Z.Y.X'`                   | `'A'` , `'A.login.Z'`             |
     * | `'A.**.X'`  | `'A.X'` , `'A.B.X'` , `'A.B.C.X'`             | `'A'` , `'A.B.C'`                 |
     *
     */
    var Glob = /** @class */ (function () {
        function Glob(text) {
            this.text = text;
            this.glob = text.split('.');
            var regexpString = this.text
                .split('.')
                .map(function (seg) {
                if (seg === '**')
                    return '(?:|(?:\\.[^.]*)*)';
                if (seg === '*')
                    return '\\.[^.]*';
                return '\\.' + seg;
            })
                .join('');
            this.regexp = new RegExp('^' + regexpString + '$');
        }
        /** Returns true if the string has glob-like characters in it */
        Glob.is = function (text) {
            return !!/[!,*]+/.exec(text);
        };
        /** Returns a glob from the string, or null if the string isn't Glob-like */
        Glob.fromString = function (text) {
            return Glob.is(text) ? new Glob(text) : null;
        };
        Glob.prototype.matches = function (name) {
            return this.regexp.test('.' + name);
        };
        return Glob;
    }());

    /** @module common */
    var Queue = /** @class */ (function () {
        function Queue(_items, _limit) {
            if (_items === void 0) { _items = []; }
            if (_limit === void 0) { _limit = null; }
            this._items = _items;
            this._limit = _limit;
            this._evictListeners = [];
            this.onEvict = pushTo(this._evictListeners);
        }
        Queue.prototype.enqueue = function (item) {
            var items = this._items;
            items.push(item);
            if (this._limit && items.length > this._limit)
                this.evict();
            return item;
        };
        Queue.prototype.evict = function () {
            var item = this._items.shift();
            this._evictListeners.forEach(function (fn) { return fn(item); });
            return item;
        };
        Queue.prototype.dequeue = function () {
            if (this.size())
                return this._items.splice(0, 1)[0];
        };
        Queue.prototype.clear = function () {
            var current = this._items;
            this._items = [];
            return current;
        };
        Queue.prototype.size = function () {
            return this._items.length;
        };
        Queue.prototype.remove = function (item) {
            var idx = this._items.indexOf(item);
            return idx > -1 && this._items.splice(idx, 1)[0];
        };
        Queue.prototype.peekTail = function () {
            return this._items[this._items.length - 1];
        };
        Queue.prototype.peekHead = function () {
            if (this.size())
                return this._items[0];
        };
        return Queue;
    }());

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */

    (function (RejectType) {
        /**
         * A new transition superseded this one.
         *
         * While this transition was running, a new transition started.
         * This transition is cancelled because it was superseded by new transition.
         */
        RejectType[RejectType["SUPERSEDED"] = 2] = "SUPERSEDED";
        /**
         * The transition was aborted
         *
         * The transition was aborted by a hook which returned `false`
         */
        RejectType[RejectType["ABORTED"] = 3] = "ABORTED";
        /**
         * The transition was invalid
         *
         * The transition was never started because it was invalid
         */
        RejectType[RejectType["INVALID"] = 4] = "INVALID";
        /**
         * The transition was ignored
         *
         * The transition was ignored because it would have no effect.
         *
         * Either:
         *
         * - The transition is targeting the current state and parameter values
         * - The transition is targeting the same state and parameter values as the currently running transition.
         */
        RejectType[RejectType["IGNORED"] = 5] = "IGNORED";
        /**
         * The transition errored.
         *
         * This generally means a hook threw an error or returned a rejected promise
         */
        RejectType[RejectType["ERROR"] = 6] = "ERROR";
    })(exports.RejectType || (exports.RejectType = {}));
    /** @hidden */
    var id = 0;
    var Rejection = /** @class */ (function () {
        function Rejection(type, message, detail) {
            /** @hidden */
            this.$id = id++;
            this.type = type;
            this.message = message;
            this.detail = detail;
        }
        /** Returns true if the obj is a rejected promise created from the `asPromise` factory */
        Rejection.isRejectionPromise = function (obj) {
            return obj && typeof obj.then === 'function' && is(Rejection)(obj._transitionRejection);
        };
        /** Returns a Rejection due to transition superseded */
        Rejection.superseded = function (detail, options) {
            var message = 'The transition has been superseded by a different transition';
            var rejection = new Rejection(exports.RejectType.SUPERSEDED, message, detail);
            if (options && options.redirected) {
                rejection.redirected = true;
            }
            return rejection;
        };
        /** Returns a Rejection due to redirected transition */
        Rejection.redirected = function (detail) {
            return Rejection.superseded(detail, { redirected: true });
        };
        /** Returns a Rejection due to invalid transition */
        Rejection.invalid = function (detail) {
            var message = 'This transition is invalid';
            return new Rejection(exports.RejectType.INVALID, message, detail);
        };
        /** Returns a Rejection due to ignored transition */
        Rejection.ignored = function (detail) {
            var message = 'The transition was ignored';
            return new Rejection(exports.RejectType.IGNORED, message, detail);
        };
        /** Returns a Rejection due to aborted transition */
        Rejection.aborted = function (detail) {
            var message = 'The transition has been aborted';
            return new Rejection(exports.RejectType.ABORTED, message, detail);
        };
        /** Returns a Rejection due to aborted transition */
        Rejection.errored = function (detail) {
            var message = 'The transition errored';
            return new Rejection(exports.RejectType.ERROR, message, detail);
        };
        /**
         * Returns a Rejection
         *
         * Normalizes a value as a Rejection.
         * If the value is already a Rejection, returns it.
         * Otherwise, wraps and returns the value as a Rejection (Rejection type: ERROR).
         *
         * @returns `detail` if it is already a `Rejection`, else returns an ERROR Rejection.
         */
        Rejection.normalize = function (detail) {
            return is(Rejection)(detail) ? detail : Rejection.errored(detail);
        };
        Rejection.prototype.toString = function () {
            var detailString = function (d) { return (d && d.toString !== Object.prototype.toString ? d.toString() : stringify(d)); };
            var detail = detailString(this.detail);
            var _a = this, $id = _a.$id, type = _a.type, message = _a.message;
            return "Transition Rejection($id: " + $id + " type: " + type + ", message: " + message + ", detail: " + detail + ")";
        };
        Rejection.prototype.toPromise = function () {
            return extend(silentRejection(this), { _transitionRejection: this });
        };
        return Rejection;
    }());

    /**
     * Functions that manipulate strings
     *
     * Although these functions are exported, they are subject to change without notice.
     *
     * @module common_strings
     */ /** */
    /**
     * Returns a string shortened to a maximum length
     *
     * If the string is already less than the `max` length, return the string.
     * Else return the string, shortened to `max - 3` and append three dots ("...").
     *
     * @param max the maximum length of the string to return
     * @param str the input string
     */
    function maxLength(max, str) {
        if (str.length <= max)
            return str;
        return str.substr(0, max - 3) + '...';
    }
    /**
     * Returns a string, with spaces added to the end, up to a desired str length
     *
     * If the string is already longer than the desired length, return the string.
     * Else returns the string, with extra spaces on the end, such that it reaches `length` characters.
     *
     * @param length the desired length of the string to return
     * @param str the input string
     */
    function padString(length, str) {
        while (str.length < length)
            str += ' ';
        return str;
    }
    function kebobString(camelCase) {
        return camelCase
            .replace(/^([A-Z])/, function ($1) { return $1.toLowerCase(); }) // replace first char
            .replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); }); // replace rest
    }
    function functionToString(fn) {
        var fnStr = fnToString(fn);
        var namedFunctionMatch = fnStr.match(/^(function [^ ]+\([^)]*\))/);
        var toStr = namedFunctionMatch ? namedFunctionMatch[1] : fnStr;
        var fnName = fn['name'] || '';
        if (fnName && toStr.match(/function \(/)) {
            return 'function ' + fnName + toStr.substr(9);
        }
        return toStr;
    }
    function fnToString(fn) {
        var _fn = isArray(fn) ? fn.slice(-1)[0] : fn;
        return (_fn && _fn.toString()) || 'undefined';
    }
    var isRejection = Rejection.isRejectionPromise;
    var hasToString = function (obj) {
        return isObject(obj) && !isArray(obj) && obj.constructor !== Object && isFunction(obj.toString);
    };
    var stringifyPattern = pattern([
        [isUndefined, val('undefined')],
        [isNull, val('null')],
        [isPromise, val('[Promise]')],
        [isRejection, function (x) { return x._transitionRejection.toString(); }],
        [hasToString, function (x) { return x.toString(); }],
        [isInjectable, functionToString],
        [val(true), identity],
    ]);
    function stringify(o) {
        var seen = [];
        function format(value) {
            if (isObject(value)) {
                if (seen.indexOf(value) !== -1)
                    return '[circular ref]';
                seen.push(value);
            }
            return stringifyPattern(value);
        }
        if (isUndefined(o)) {
            // Workaround for IE & Edge Spec incompatibility where replacer function would not be called when JSON.stringify
            // is given `undefined` as value. To work around that, we simply detect `undefined` and bail out early by
            // manually stringifying it.
            return format(o);
        }
        return JSON.stringify(o, function (key, value) { return format(value); }).replace(/\\"/g, '"');
    }
    /** Returns a function that splits a string on a character or substring */
    var beforeAfterSubstr = function (char) { return function (str) {
        if (!str)
            return ['', ''];
        var idx = str.indexOf(char);
        if (idx === -1)
            return [str, ''];
        return [str.substr(0, idx), str.substr(idx + 1)];
    }; };
    var hostRegex = new RegExp('^(?:[a-z]+:)?//[^/]+/');
    var stripLastPathElement = function (str) { return str.replace(/\/[^/]*$/, ''); };
    var splitHash = beforeAfterSubstr('#');
    var splitQuery = beforeAfterSubstr('?');
    var splitEqual = beforeAfterSubstr('=');
    var trimHashVal = function (str) { return (str ? str.replace(/^#/, '') : ''); };
    /**
     * Splits on a delimiter, but returns the delimiters in the array
     *
     * #### Example:
     * ```js
     * var splitOnSlashes = splitOnDelim('/');
     * splitOnSlashes("/foo"); // ["/", "foo"]
     * splitOnSlashes("/foo/"); // ["/", "foo", "/"]
     * ```
     */
    function splitOnDelim(delim) {
        var re = new RegExp('(' + delim + ')', 'g');
        return function (str) { return str.split(re).filter(identity); };
    }
    /**
     * Reduce fn that joins neighboring strings
     *
     * Given an array of strings, returns a new array
     * where all neighboring strings have been joined.
     *
     * #### Example:
     * ```js
     * let arr = ["foo", "bar", 1, "baz", "", "qux" ];
     * arr.reduce(joinNeighborsR, []) // ["foobar", 1, "bazqux" ]
     * ```
     */
    function joinNeighborsR(acc, x) {
        if (isString(tail(acc)) && isString(x))
            return acc.slice(0, -1).concat(tail(acc) + x);
        return pushR(acc, x);
    }

    /**
     * # Transition tracing (debug)
     *
     * Enable transition tracing to print transition information to the console,
     * in order to help debug your application.
     * Tracing logs detailed information about each Transition to your console.
     *
     * To enable tracing, import the [[Trace]] singleton and enable one or more categories.
     *
     * ### ES6
     * ```js
     * import {trace} from "@uirouter/core";
     * trace.enable(1, 5); // TRANSITION and VIEWCONFIG
     * ```
     *
     * ### CJS
     * ```js
     * let trace = require("@uirouter/core").trace;
     * trace.enable("TRANSITION", "VIEWCONFIG");
     * ```
     *
     * ### Globals
     * ```js
     * let trace = window["@uirouter/core"].trace;
     * trace.enable(); // Trace everything (very verbose)
     * ```
     *
     * ### Angular 1:
     * ```js
     * app.run($trace => $trace.enable());
     * ```
     *
     * @coreapi
     * @module trace
     */
    /** @hidden */
    function uiViewString(uiview) {
        if (!uiview)
            return 'ui-view (defunct)';
        var state = uiview.creationContext ? uiview.creationContext.name || '(root)' : '(none)';
        return "[ui-view#" + uiview.id + " " + uiview.$type + ":" + uiview.fqn + " (" + uiview.name + "@" + state + ")]";
    }
    /** @hidden */
    var viewConfigString = function (viewConfig) {
        var view = viewConfig.viewDecl;
        var state = view.$context.name || '(root)';
        return "[View#" + viewConfig.$id + " from '" + state + "' state]: target ui-view: '" + view.$uiViewName + "@" + view.$uiViewContextAnchor + "'";
    };
    /** @hidden */
    function normalizedCat(input) {
        return isNumber(input) ? exports.Category[input] : exports.Category[exports.Category[input]];
    }
    /** @hidden */
    var consoleLog = Function.prototype.bind.call(console.log, console);
    /** @hidden */
    var consoletable = isFunction(console.table) ? console.table.bind(console) : consoleLog.bind(console);
    /**
     * Trace categories Enum
     *
     * Enable or disable a category using [[Trace.enable]] or [[Trace.disable]]
     *
     * `trace.enable(Category.TRANSITION)`
     *
     * These can also be provided using a matching string, or position ordinal
     *
     * `trace.enable("TRANSITION")`
     *
     * `trace.enable(1)`
     */

    (function (Category) {
        Category[Category["RESOLVE"] = 0] = "RESOLVE";
        Category[Category["TRANSITION"] = 1] = "TRANSITION";
        Category[Category["HOOK"] = 2] = "HOOK";
        Category[Category["UIVIEW"] = 3] = "UIVIEW";
        Category[Category["VIEWCONFIG"] = 4] = "VIEWCONFIG";
    })(exports.Category || (exports.Category = {}));
    /** @hidden */
    var _tid = parse('$id');
    /** @hidden */
    var _rid = parse('router.$id');
    /** @hidden */
    var transLbl = function (trans) { return "Transition #" + _tid(trans) + "-" + _rid(trans); };
    /**
     * Prints UI-Router Transition trace information to the console.
     */
    var Trace = /** @class */ (function () {
        /** @hidden */
        function Trace() {
            /** @hidden */
            this._enabled = {};
            this.approximateDigests = 0;
        }
        /** @hidden */
        Trace.prototype._set = function (enabled, categories) {
            var _this = this;
            if (!categories.length) {
                categories = Object.keys(exports.Category)
                    .map(function (k) { return parseInt(k, 10); })
                    .filter(function (k) { return !isNaN(k); })
                    .map(function (key) { return exports.Category[key]; });
            }
            categories.map(normalizedCat).forEach(function (category) { return (_this._enabled[category] = enabled); });
        };
        Trace.prototype.enable = function () {
            var categories = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                categories[_i] = arguments[_i];
            }
            this._set(true, categories);
        };
        Trace.prototype.disable = function () {
            var categories = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                categories[_i] = arguments[_i];
            }
            this._set(false, categories);
        };
        /**
         * Retrieves the enabled stateus of a [[Category]]
         *
         * ```js
         * trace.enabled("VIEWCONFIG"); // true or false
         * ```
         *
         * @returns boolean true if the category is enabled
         */
        Trace.prototype.enabled = function (category) {
            return !!this._enabled[normalizedCat(category)];
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceTransitionStart = function (trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": Started  -> " + stringify(trans));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceTransitionIgnored = function (trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": Ignored  <> " + stringify(trans));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceHookInvocation = function (step, trans, options) {
            if (!this.enabled(exports.Category.HOOK))
                return;
            var event = parse('traceData.hookType')(options) || 'internal', context = parse('traceData.context.state.name')(options) || parse('traceData.context')(options) || 'unknown', name = functionToString(step.registeredHook.callback);
            console.log(transLbl(trans) + ":   Hook -> " + event + " context: " + context + ", " + maxLength(200, name));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceHookResult = function (hookResult, trans, transitionOptions) {
            if (!this.enabled(exports.Category.HOOK))
                return;
            console.log(transLbl(trans) + ":   <- Hook returned: " + maxLength(200, stringify(hookResult)));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceResolvePath = function (path, when, trans) {
            if (!this.enabled(exports.Category.RESOLVE))
                return;
            console.log(transLbl(trans) + ":         Resolving " + path + " (" + when + ")");
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceResolvableResolved = function (resolvable, trans) {
            if (!this.enabled(exports.Category.RESOLVE))
                return;
            console.log(transLbl(trans) + ":               <- Resolved  " + resolvable + " to: " + maxLength(200, stringify(resolvable.data)));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceError = function (reason, trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": <- Rejected " + stringify(trans) + ", reason: " + reason);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceSuccess = function (finalState, trans) {
            if (!this.enabled(exports.Category.TRANSITION))
                return;
            console.log(transLbl(trans) + ": <- Success  " + stringify(trans) + ", final state: " + finalState.name);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewEvent = function (event, viewData, extra) {
            if (extra === void 0) { extra = ''; }
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            console.log("ui-view: " + padString(30, event) + " " + uiViewString(viewData) + extra);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewConfigUpdated = function (viewData, context) {
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            this.traceUIViewEvent('Updating', viewData, " with ViewConfig from context='" + context + "'");
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceUIViewFill = function (viewData, html) {
            if (!this.enabled(exports.Category.UIVIEW))
                return;
            this.traceUIViewEvent('Fill', viewData, " with: " + maxLength(200, html));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewSync = function (pairs) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            var uivheader = 'uiview component fqn';
            var cfgheader = 'view config state (view name)';
            var mapping = pairs
                .map(function (_a) {
                var uiView = _a.uiView, viewConfig = _a.viewConfig;
                var _b;
                var uiv = uiView && uiView.fqn;
                var cfg = viewConfig && viewConfig.viewDecl.$context.name + ": (" + viewConfig.viewDecl.$name + ")";
                return _b = {}, _b[uivheader] = uiv, _b[cfgheader] = cfg, _b;
            })
                .sort(function (a, b) { return (a[uivheader] || '').localeCompare(b[uivheader] || ''); });
            consoletable(mapping);
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewServiceEvent = function (event, viewConfig) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            console.log("VIEWCONFIG: " + event + " " + viewConfigString(viewConfig));
        };
        /** @internalapi called by ui-router code */
        Trace.prototype.traceViewServiceUIViewEvent = function (event, viewData) {
            if (!this.enabled(exports.Category.VIEWCONFIG))
                return;
            console.log("VIEWCONFIG: " + event + " " + uiViewString(viewData));
        };
        return Trace;
    }());
    /**
     * The [[Trace]] singleton
     *
     * #### Example:
     * ```js
     * import {trace} from "@uirouter/core";
     * trace.enable(1, 5);
     * ```
     */
    var trace = new Trace();

    /** @module common */ /** for typedoc */

    /**
     * @coreapi
     * @module params
     */
    /**
     * An internal class which implements [[ParamTypeDefinition]].
     *
     * A [[ParamTypeDefinition]] is a plain javascript object used to register custom parameter types.
     * When a param type definition is registered, an instance of this class is created internally.
     *
     * This class has naive implementations for all the [[ParamTypeDefinition]] methods.
     *
     * Used by [[UrlMatcher]] when matching or formatting URLs, or comparing and validating parameter values.
     *
     * #### Example:
     * ```js
     * var paramTypeDef = {
     *   decode: function(val) { return parseInt(val, 10); },
     *   encode: function(val) { return val && val.toString(); },
     *   equals: function(a, b) { return this.is(a) && a === b; },
     *   is: function(val) { return angular.isNumber(val) && isFinite(val) && val % 1 === 0; },
     *   pattern: /\d+/
     * }
     *
     * var paramType = new ParamType(paramTypeDef);
     * ```
     * @internalapi
     */
    var ParamType = /** @class */ (function () {
        /**
         * @param def  A configuration object which contains the custom type definition.  The object's
         *        properties will override the default methods and/or pattern in `ParamType`'s public interface.
         * @returns a new ParamType object
         */
        function ParamType(def) {
            /** @inheritdoc */
            this.pattern = /.*/;
            /** @inheritdoc */
            this.inherit = true;
            extend(this, def);
        }
        // consider these four methods to be "abstract methods" that should be overridden
        /** @inheritdoc */
        ParamType.prototype.is = function (val, key) {
            return true;
        };
        /** @inheritdoc */
        ParamType.prototype.encode = function (val, key) {
            return val;
        };
        /** @inheritdoc */
        ParamType.prototype.decode = function (val, key) {
            return val;
        };
        /** @inheritdoc */
        ParamType.prototype.equals = function (a, b) {
            // tslint:disable-next-line:triple-equals
            return a == b;
        };
        ParamType.prototype.$subPattern = function () {
            var sub = this.pattern.toString();
            return sub.substr(1, sub.length - 2);
        };
        ParamType.prototype.toString = function () {
            return "{ParamType:" + this.name + "}";
        };
        /** Given an encoded string, or a decoded object, returns a decoded object */
        ParamType.prototype.$normalize = function (val) {
            return this.is(val) ? val : this.decode(val);
        };
        /**
         * Wraps an existing custom ParamType as an array of ParamType, depending on 'mode'.
         * e.g.:
         * - urlmatcher pattern "/path?{queryParam[]:int}"
         * - url: "/path?queryParam=1&queryParam=2
         * - $stateParams.queryParam will be [1, 2]
         * if `mode` is "auto", then
         * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
         * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
         */
        ParamType.prototype.$asArray = function (mode, isSearch) {
            if (!mode)
                return this;
            if (mode === 'auto' && !isSearch)
                throw new Error("'auto' array mode is for query parameters only");
            return new ArrayType(this, mode);
        };
        return ParamType;
    }());
    /**
     * Wraps up a `ParamType` object to handle array values.
     * @internalapi
     */
    function ArrayType(type, mode) {
        var _this = this;
        // Wrap non-array value as array
        function arrayWrap(val) {
            return isArray(val) ? val : isDefined(val) ? [val] : [];
        }
        // Unwrap array value for "auto" mode. Return undefined for empty array.
        function arrayUnwrap(val) {
            switch (val.length) {
                case 0:
                    return undefined;
                case 1:
                    return mode === 'auto' ? val[0] : val;
                default:
                    return val;
            }
        }
        // Wraps type (.is/.encode/.decode) functions to operate on each value of an array
        function arrayHandler(callback, allTruthyMode) {
            return function handleArray(val) {
                if (isArray(val) && val.length === 0)
                    return val;
                var arr = arrayWrap(val);
                var result = map(arr, callback);
                return allTruthyMode === true ? filter(result, function (x) { return !x; }).length === 0 : arrayUnwrap(result);
            };
        }
        // Wraps type (.equals) functions to operate on each value of an array
        function arrayEqualsHandler(callback) {
            return function handleArray(val1, val2) {
                var left = arrayWrap(val1), right = arrayWrap(val2);
                if (left.length !== right.length)
                    return false;
                for (var i = 0; i < left.length; i++) {
                    if (!callback(left[i], right[i]))
                        return false;
                }
                return true;
            };
        }
        ['encode', 'decode', 'equals', '$normalize'].forEach(function (name) {
            var paramTypeFn = type[name].bind(type);
            var wrapperFn = name === 'equals' ? arrayEqualsHandler : arrayHandler;
            _this[name] = wrapperFn(paramTypeFn);
        });
        extend(this, {
            dynamic: type.dynamic,
            name: type.name,
            pattern: type.pattern,
            inherit: type.inherit,
            raw: type.raw,
            is: arrayHandler(type.is.bind(type), true),
            $arrayMode: mode,
        });
    }

    /**
     * @coreapi
     * @module params
     */ /** for typedoc */
    /** @hidden */
    var hasOwn = Object.prototype.hasOwnProperty;
    /** @hidden */
    var isShorthand = function (cfg) {
        return ['value', 'type', 'squash', 'array', 'dynamic'].filter(hasOwn.bind(cfg || {})).length === 0;
    };
    /** @internalapi */

    (function (DefType) {
        DefType[DefType["PATH"] = 0] = "PATH";
        DefType[DefType["SEARCH"] = 1] = "SEARCH";
        DefType[DefType["CONFIG"] = 2] = "CONFIG";
    })(exports.DefType || (exports.DefType = {}));
    function getParamDeclaration(paramName, location, state) {
        var noReloadOnSearch = (state.reloadOnSearch === false && location === exports.DefType.SEARCH) || undefined;
        var dynamic = [state.dynamic, noReloadOnSearch].find(isDefined);
        var defaultConfig = isDefined(dynamic) ? { dynamic: dynamic } : {};
        var paramConfig = unwrapShorthand(state && state.params && state.params[paramName]);
        return extend(defaultConfig, paramConfig);
    }
    /** @hidden */
    function unwrapShorthand(cfg) {
        cfg = isShorthand(cfg) ? { value: cfg } : cfg;
        getStaticDefaultValue['__cacheable'] = true;
        function getStaticDefaultValue() {
            return cfg.value;
        }
        var $$fn = isInjectable(cfg.value) ? cfg.value : getStaticDefaultValue;
        return extend(cfg, { $$fn: $$fn });
    }
    /** @hidden */
    function getType(cfg, urlType, location, id, paramTypes) {
        if (cfg.type && urlType && urlType.name !== 'string')
            throw new Error("Param '" + id + "' has two type configurations.");
        if (cfg.type && urlType && urlType.name === 'string' && paramTypes.type(cfg.type))
            return paramTypes.type(cfg.type);
        if (urlType)
            return urlType;
        if (!cfg.type) {
            var type = location === exports.DefType.CONFIG
                ? 'any'
                : location === exports.DefType.PATH
                    ? 'path'
                    : location === exports.DefType.SEARCH
                        ? 'query'
                        : 'string';
            return paramTypes.type(type);
        }
        return cfg.type instanceof ParamType ? cfg.type : paramTypes.type(cfg.type);
    }
    /**
     * @internalapi
     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
     */
    function getSquashPolicy(config, isOptional, defaultPolicy) {
        var squash = config.squash;
        if (!isOptional || squash === false)
            return false;
        if (!isDefined(squash) || squash == null)
            return defaultPolicy;
        if (squash === true || isString(squash))
            return squash;
        throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
    }
    /** @internalapi */
    function getReplace(config, arrayMode, isOptional, squash) {
        var defaultPolicy = [
            { from: '', to: isOptional || arrayMode ? undefined : '' },
            { from: null, to: isOptional || arrayMode ? undefined : '' },
        ];
        var replace = isArray(config.replace) ? config.replace : [];
        if (isString(squash))
            replace.push({ from: squash, to: undefined });
        var configuredKeys = map(replace, prop('from'));
        return filter(defaultPolicy, function (item) { return configuredKeys.indexOf(item.from) === -1; }).concat(replace);
    }
    /** @internalapi */
    var Param = /** @class */ (function () {
        function Param(id, type, location, urlMatcherFactory, state) {
            var config = getParamDeclaration(id, location, state);
            type = getType(config, type, location, id, urlMatcherFactory.paramTypes);
            var arrayMode = getArrayMode();
            type = arrayMode ? type.$asArray(arrayMode, location === exports.DefType.SEARCH) : type;
            var isOptional = config.value !== undefined || location === exports.DefType.SEARCH;
            var dynamic = isDefined(config.dynamic) ? !!config.dynamic : !!type.dynamic;
            var raw = isDefined(config.raw) ? !!config.raw : !!type.raw;
            var squash = getSquashPolicy(config, isOptional, urlMatcherFactory.defaultSquashPolicy());
            var replace = getReplace(config, arrayMode, isOptional, squash);
            var inherit$$1 = isDefined(config.inherit) ? !!config.inherit : !!type.inherit;
            // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
            function getArrayMode() {
                var arrayDefaults = { array: location === exports.DefType.SEARCH ? 'auto' : false };
                var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
                return extend(arrayDefaults, arrayParamNomenclature, config).array;
            }
            extend(this, { id: id, type: type, location: location, isOptional: isOptional, dynamic: dynamic, raw: raw, squash: squash, replace: replace, inherit: inherit$$1, array: arrayMode, config: config });
        }
        Param.values = function (params, values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            var paramValues = {};
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                paramValues[param.id] = param.value(values$$1[param.id]);
            }
            return paramValues;
        };
        /**
         * Finds [[Param]] objects which have different param values
         *
         * Filters a list of [[Param]] objects to only those whose parameter values differ in two param value objects
         *
         * @param params: The list of Param objects to filter
         * @param values1: The first set of parameter values
         * @param values2: the second set of parameter values
         *
         * @returns any Param objects whose values were different between values1 and values2
         */
        Param.changed = function (params, values1, values2) {
            if (values1 === void 0) { values1 = {}; }
            if (values2 === void 0) { values2 = {}; }
            return params.filter(function (param) { return !param.type.equals(values1[param.id], values2[param.id]); });
        };
        /**
         * Checks if two param value objects are equal (for a set of [[Param]] objects)
         *
         * @param params The list of [[Param]] objects to check
         * @param values1 The first set of param values
         * @param values2 The second set of param values
         *
         * @returns true if the param values in values1 and values2 are equal
         */
        Param.equals = function (params, values1, values2) {
            if (values1 === void 0) { values1 = {}; }
            if (values2 === void 0) { values2 = {}; }
            return Param.changed(params, values1, values2).length === 0;
        };
        /** Returns true if a the parameter values are valid, according to the Param definitions */
        Param.validates = function (params, values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            return params.map(function (param) { return param.validates(values$$1[param.id]); }).reduce(allTrueR, true);
        };
        Param.prototype.isDefaultValue = function (value) {
            return this.isOptional && this.type.equals(this.value(), value);
        };
        /**
         * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
         * default value, which may be the result of an injectable function.
         */
        Param.prototype.value = function (value) {
            var _this = this;
            /**
             * [Internal] Get the default value of a parameter, which may be an injectable function.
             */
            var getDefaultValue = function () {
                if (_this._defaultValueCache)
                    return _this._defaultValueCache.defaultValue;
                if (!services.$injector)
                    throw new Error('Injectable functions cannot be called at configuration time');
                var defaultValue = services.$injector.invoke(_this.config.$$fn);
                if (defaultValue !== null && defaultValue !== undefined && !_this.type.is(defaultValue))
                    throw new Error("Default value (" + defaultValue + ") for parameter '" + _this.id + "' is not an instance of ParamType (" + _this.type.name + ")");
                if (_this.config.$$fn['__cacheable']) {
                    _this._defaultValueCache = { defaultValue: defaultValue };
                }
                return defaultValue;
            };
            var replaceSpecialValues = function (val$$1) {
                for (var _i = 0, _a = _this.replace; _i < _a.length; _i++) {
                    var tuple = _a[_i];
                    if (tuple.from === val$$1)
                        return tuple.to;
                }
                return val$$1;
            };
            value = replaceSpecialValues(value);
            return isUndefined(value) ? getDefaultValue() : this.type.$normalize(value);
        };
        Param.prototype.isSearch = function () {
            return this.location === exports.DefType.SEARCH;
        };
        Param.prototype.validates = function (value) {
            // There was no parameter value, but the param is optional
            if ((isUndefined(value) || value === null) && this.isOptional)
                return true;
            // The value was not of the correct ParamType, and could not be decoded to the correct ParamType
            var normalized = this.type.$normalize(value);
            if (!this.type.is(normalized))
                return false;
            // The value was of the correct type, but when encoded, did not match the ParamType's regexp
            var encoded = this.type.encode(normalized);
            return !(isString(encoded) && !this.type.pattern.exec(encoded));
        };
        Param.prototype.toString = function () {
            return "{Param:" + this.id + " " + this.type + " squash: '" + this.squash + "' optional: " + this.isOptional + "}";
        };
        return Param;
    }());

    /**
     * @coreapi
     * @module params
     */
    /**
     * A registry for parameter types.
     *
     * This registry manages the built-in (and custom) parameter types.
     *
     * The built-in parameter types are:
     *
     * - [[string]]
     * - [[path]]
     * - [[query]]
     * - [[hash]]
     * - [[int]]
     * - [[bool]]
     * - [[date]]
     * - [[json]]
     * - [[any]]
     */
    var ParamTypes = /** @class */ (function () {
        /** @internalapi */
        function ParamTypes() {
            /** @hidden */
            this.enqueue = true;
            /** @hidden */
            this.typeQueue = [];
            /** @internalapi */
            this.defaultTypes = pick(ParamTypes.prototype, [
                'hash',
                'string',
                'query',
                'path',
                'int',
                'bool',
                'date',
                'json',
                'any',
            ]);
            // Register default types. Store them in the prototype of this.types.
            var makeType = function (definition, name) { return new ParamType(extend({ name: name }, definition)); };
            this.types = inherit(map(this.defaultTypes, makeType), {});
        }
        /** @internalapi */
        ParamTypes.prototype.dispose = function () {
            this.types = {};
        };
        /**
         * Registers a parameter type
         *
         * End users should call [[UrlMatcherFactory.type]], which delegates to this method.
         */
        ParamTypes.prototype.type = function (name, definition, definitionFn) {
            if (!isDefined(definition))
                return this.types[name];
            if (this.types.hasOwnProperty(name))
                throw new Error("A type named '" + name + "' has already been defined.");
            this.types[name] = new ParamType(extend({ name: name }, definition));
            if (definitionFn) {
                this.typeQueue.push({ name: name, def: definitionFn });
                if (!this.enqueue)
                    this._flushTypeQueue();
            }
            return this;
        };
        /** @internalapi */
        ParamTypes.prototype._flushTypeQueue = function () {
            while (this.typeQueue.length) {
                var type = this.typeQueue.shift();
                if (type.pattern)
                    throw new Error("You cannot override a type's .pattern at runtime.");
                extend(this.types[type.name], services.$injector.invoke(type.def));
            }
        };
        return ParamTypes;
    }());
    /** @hidden */
    function initDefaultTypes() {
        var makeDefaultType = function (def) {
            var valToString = function (val$$1) { return (val$$1 != null ? val$$1.toString() : val$$1); };
            var defaultTypeBase = {
                encode: valToString,
                decode: valToString,
                is: is(String),
                pattern: /.*/,
                // tslint:disable-next-line:triple-equals
                equals: function (a, b) { return a == b; },
            };
            return extend({}, defaultTypeBase, def);
        };
        // Default Parameter Type Definitions
        extend(ParamTypes.prototype, {
            string: makeDefaultType({}),
            path: makeDefaultType({
                pattern: /[^/]*/,
            }),
            query: makeDefaultType({}),
            hash: makeDefaultType({
                inherit: false,
            }),
            int: makeDefaultType({
                decode: function (val$$1) { return parseInt(val$$1, 10); },
                is: function (val$$1) {
                    return !isNullOrUndefined(val$$1) && this.decode(val$$1.toString()) === val$$1;
                },
                pattern: /-?\d+/,
            }),
            bool: makeDefaultType({
                encode: function (val$$1) { return (val$$1 && 1) || 0; },
                decode: function (val$$1) { return parseInt(val$$1, 10) !== 0; },
                is: is(Boolean),
                pattern: /0|1/,
            }),
            date: makeDefaultType({
                encode: function (val$$1) {
                    return !this.is(val$$1)
                        ? undefined
                        : [val$$1.getFullYear(), ('0' + (val$$1.getMonth() + 1)).slice(-2), ('0' + val$$1.getDate()).slice(-2)].join('-');
                },
                decode: function (val$$1) {
                    if (this.is(val$$1))
                        return val$$1;
                    var match = this.capture.exec(val$$1);
                    return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
                },
                is: function (val$$1) { return val$$1 instanceof Date && !isNaN(val$$1.valueOf()); },
                equals: function (l, r) {
                    return ['getFullYear', 'getMonth', 'getDate'].reduce(function (acc, fn) { return acc && l[fn]() === r[fn](); }, true);
                },
                pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
                capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/,
            }),
            json: makeDefaultType({
                encode: toJson,
                decode: fromJson,
                is: is(Object),
                equals: equals,
                pattern: /[^/]*/,
            }),
            // does not encode/decode
            any: makeDefaultType({
                encode: identity,
                decode: identity,
                is: function () { return true; },
                equals: equals,
            }),
        });
    }
    initDefaultTypes();

    /**
     * @coreapi
     * @module params
     */
    /** @internalapi */
    var StateParams = /** @class */ (function () {
        function StateParams(params) {
            if (params === void 0) { params = {}; }
            extend(this, params);
        }
        /**
         * Merges a set of parameters with all parameters inherited between the common parents of the
         * current state and a given destination state.
         *
         * @param {Object} newParams The set of parameters which will be composited with inherited params.
         * @param {Object} $current Internal definition of object representing the current state.
         * @param {Object} $to Internal definition of object representing state to transition to.
         */
        StateParams.prototype.$inherit = function (newParams, $current, $to) {
            var parentParams;
            var parents = ancestors($current, $to), inherited = {}, inheritList = [];
            for (var i in parents) {
                if (!parents[i] || !parents[i].params)
                    continue;
                parentParams = Object.keys(parents[i].params);
                if (!parentParams.length)
                    continue;
                for (var j in parentParams) {
                    if (inheritList.indexOf(parentParams[j]) >= 0)
                        continue;
                    inheritList.push(parentParams[j]);
                    inherited[parentParams[j]] = this[parentParams[j]];
                }
            }
            return extend({}, inherited, newParams);
        };
        return StateParams;
    }());

    /** @module path */ /** for typedoc */
    /**
     * @internalapi
     *
     * A node in a [[TreeChanges]] path
     *
     * For a [[TreeChanges]] path, this class holds the stateful information for a single node in the path.
     * Each PathNode corresponds to a state being entered, exited, or retained.
     * The stateful information includes parameter values and resolve data.
     */
    var PathNode = /** @class */ (function () {
        function PathNode(stateOrNode) {
            if (stateOrNode instanceof PathNode) {
                var node = stateOrNode;
                this.state = node.state;
                this.paramSchema = node.paramSchema.slice();
                this.paramValues = extend({}, node.paramValues);
                this.resolvables = node.resolvables.slice();
                this.views = node.views && node.views.slice();
            }
            else {
                var state = stateOrNode;
                this.state = state;
                this.paramSchema = state.parameters({ inherit: false });
                this.paramValues = {};
                this.resolvables = state.resolvables.map(function (res) { return res.clone(); });
            }
        }
        PathNode.prototype.clone = function () {
            return new PathNode(this);
        };
        /** Sets [[paramValues]] for the node, from the values of an object hash */
        PathNode.prototype.applyRawParams = function (params) {
            var getParamVal = function (paramDef) { return [paramDef.id, paramDef.value(params[paramDef.id])]; };
            this.paramValues = this.paramSchema.reduce(function (memo, pDef) { return applyPairs(memo, getParamVal(pDef)); }, {});
            return this;
        };
        /** Gets a specific [[Param]] metadata that belongs to the node */
        PathNode.prototype.parameter = function (name) {
            return find(this.paramSchema, propEq('id', name));
        };
        /**
         * @returns true if the state and parameter values for another PathNode are
         * equal to the state and param values for this PathNode
         */
        PathNode.prototype.equals = function (node, paramsFn) {
            var diff = this.diff(node, paramsFn);
            return diff && diff.length === 0;
        };
        /**
         * Finds Params with different parameter values on another PathNode.
         *
         * Given another node (of the same state), finds the parameter values which differ.
         * Returns the [[Param]] (schema objects) whose parameter values differ.
         *
         * Given another node for a different state, returns `false`
         *
         * @param node The node to compare to
         * @param paramsFn A function that returns which parameters should be compared.
         * @returns The [[Param]]s which differ, or null if the two nodes are for different states
         */
        PathNode.prototype.diff = function (node, paramsFn) {
            if (this.state !== node.state)
                return false;
            var params = paramsFn ? paramsFn(this) : this.paramSchema;
            return Param.changed(params, this.paramValues, node.paramValues);
        };
        /**
         * Returns a clone of the PathNode
         * @deprecated use instance method `node.clone()`
         */
        PathNode.clone = function (node) { return node.clone(); };
        return PathNode;
    }());

    /**
     * @coreapi
     * @module state
     */ /** for typedoc */
    /**
     * Encapsulate the target (destination) state/params/options of a [[Transition]].
     *
     * This class is frequently used to redirect a transition to a new destination.
     *
     * See:
     *
     * - [[HookResult]]
     * - [[TransitionHookFn]]
     * - [[TransitionService.onStart]]
     *
     * To create a `TargetState`, use [[StateService.target]].
     *
     * ---
     *
     * This class wraps:
     *
     * 1) an identifier for a state
     * 2) a set of parameters
     * 3) and transition options
     * 4) the registered state object (the [[StateDeclaration]])
     *
     * Many UI-Router APIs such as [[StateService.go]] take a [[StateOrName]] argument which can
     * either be a *state object* (a [[StateDeclaration]] or [[StateObject]]) or a *state name* (a string).
     * The `TargetState` class normalizes those options.
     *
     * A `TargetState` may be valid (the state being targeted exists in the registry)
     * or invalid (the state being targeted is not registered).
     */
    var TargetState = /** @class */ (function () {
        /**
         * The TargetState constructor
         *
         * Note: Do not construct a `TargetState` manually.
         * To create a `TargetState`, use the [[StateService.target]] factory method.
         *
         * @param _stateRegistry The StateRegistry to use to look up the _definition
         * @param _identifier An identifier for a state.
         *    Either a fully-qualified state name, or the object used to define the state.
         * @param _params Parameters for the target state
         * @param _options Transition options.
         *
         * @internalapi
         */
        function TargetState(_stateRegistry, _identifier, _params, _options) {
            this._stateRegistry = _stateRegistry;
            this._identifier = _identifier;
            this._identifier = _identifier;
            this._params = extend({}, _params || {});
            this._options = extend({}, _options || {});
            this._definition = _stateRegistry.matcher.find(_identifier, this._options.relative);
        }
        /** The name of the state this object targets */
        TargetState.prototype.name = function () {
            return (this._definition && this._definition.name) || this._identifier;
        };
        /** The identifier used when creating this TargetState */
        TargetState.prototype.identifier = function () {
            return this._identifier;
        };
        /** The target parameter values */
        TargetState.prototype.params = function () {
            return this._params;
        };
        /** The internal state object (if it was found) */
        TargetState.prototype.$state = function () {
            return this._definition;
        };
        /** The internal state declaration (if it was found) */
        TargetState.prototype.state = function () {
            return this._definition && this._definition.self;
        };
        /** The target options */
        TargetState.prototype.options = function () {
            return this._options;
        };
        /** True if the target state was found */
        TargetState.prototype.exists = function () {
            return !!(this._definition && this._definition.self);
        };
        /** True if the object is valid */
        TargetState.prototype.valid = function () {
            return !this.error();
        };
        /** If the object is invalid, returns the reason why */
        TargetState.prototype.error = function () {
            var base = this.options().relative;
            if (!this._definition && !!base) {
                var stateName = base.name ? base.name : base;
                return "Could not resolve '" + this.name() + "' from state '" + stateName + "'";
            }
            if (!this._definition)
                return "No such state '" + this.name() + "'";
            if (!this._definition.self)
                return "State '" + this.name() + "' has an invalid definition";
        };
        TargetState.prototype.toString = function () {
            return "'" + this.name() + "'" + stringify(this.params());
        };
        /**
         * Returns a copy of this TargetState which targets a different state.
         * The new TargetState has the same parameter values and transition options.
         *
         * @param state The new state that should be targeted
         */
        TargetState.prototype.withState = function (state) {
            return new TargetState(this._stateRegistry, state, this._params, this._options);
        };
        /**
         * Returns a copy of this TargetState, using the specified parameter values.
         *
         * @param params the new parameter values to use
         * @param replace When false (default) the new parameter values will be merged with the current values.
         *                When true the parameter values will be used instead of the current values.
         */
        TargetState.prototype.withParams = function (params, replace) {
            if (replace === void 0) { replace = false; }
            var newParams = replace ? params : extend({}, this._params, params);
            return new TargetState(this._stateRegistry, this._identifier, newParams, this._options);
        };
        /**
         * Returns a copy of this TargetState, using the specified Transition Options.
         *
         * @param options the new options to use
         * @param replace When false (default) the new options will be merged with the current options.
         *                When true the options will be used instead of the current options.
         */
        TargetState.prototype.withOptions = function (options, replace) {
            if (replace === void 0) { replace = false; }
            var newOpts = replace ? options : extend({}, this._options, options);
            return new TargetState(this._stateRegistry, this._identifier, this._params, newOpts);
        };
        /** Returns true if the object has a state property that might be a state or state name */
        TargetState.isDef = function (obj) { return obj && obj.state && (isString(obj.state) || isString(obj.state.name)); };
        return TargetState;
    }());

    /** @module path */ /** for typedoc */
    /**
     * This class contains functions which convert TargetStates, Nodes and paths from one type to another.
     */
    var PathUtils = /** @class */ (function () {
        function PathUtils() {
        }
        /** Given a PathNode[], create an TargetState */
        PathUtils.makeTargetState = function (registry, path) {
            var state = tail(path).state;
            return new TargetState(registry, state, path.map(prop('paramValues')).reduce(mergeR, {}), {});
        };
        PathUtils.buildPath = function (targetState) {
            var toParams = targetState.params();
            return targetState.$state().path.map(function (state) { return new PathNode(state).applyRawParams(toParams); });
        };
        /** Given a fromPath: PathNode[] and a TargetState, builds a toPath: PathNode[] */
        PathUtils.buildToPath = function (fromPath, targetState) {
            var toPath = PathUtils.buildPath(targetState);
            if (targetState.options().inherit) {
                return PathUtils.inheritParams(fromPath, toPath, Object.keys(targetState.params()));
            }
            return toPath;
        };
        /**
         * Creates ViewConfig objects and adds to nodes.
         *
         * On each [[PathNode]], creates ViewConfig objects from the views: property of the node's state
         */
        PathUtils.applyViewConfigs = function ($view, path, states) {
            // Only apply the viewConfigs to the nodes for the given states
            path.filter(function (node) { return inArray(states, node.state); }).forEach(function (node) {
                var viewDecls = values(node.state.views || {});
                var subPath = PathUtils.subPath(path, function (n) { return n === node; });
                var viewConfigs = viewDecls.map(function (view) { return $view.createViewConfig(subPath, view); });
                node.views = viewConfigs.reduce(unnestR, []);
            });
        };
        /**
         * Given a fromPath and a toPath, returns a new to path which inherits parameters from the fromPath
         *
         * For a parameter in a node to be inherited from the from path:
         * - The toPath's node must have a matching node in the fromPath (by state).
         * - The parameter name must not be found in the toKeys parameter array.
         *
         * Note: the keys provided in toKeys are intended to be those param keys explicitly specified by some
         * caller, for instance, $state.transitionTo(..., toParams).  If a key was found in toParams,
         * it is not inherited from the fromPath.
         */
        PathUtils.inheritParams = function (fromPath, toPath, toKeys) {
            if (toKeys === void 0) { toKeys = []; }
            function nodeParamVals(path, state) {
                var node = find(path, propEq('state', state));
                return extend({}, node && node.paramValues);
            }
            var noInherit = fromPath
                .map(function (node) { return node.paramSchema; })
                .reduce(unnestR, [])
                .filter(function (param) { return !param.inherit; })
                .map(prop('id'));
            /**
             * Given an [[PathNode]] "toNode", return a new [[PathNode]] with param values inherited from the
             * matching node in fromPath.  Only inherit keys that aren't found in "toKeys" from the node in "fromPath""
             */
            function makeInheritedParamsNode(toNode) {
                // All param values for the node (may include default key/vals, when key was not found in toParams)
                var toParamVals = extend({}, toNode && toNode.paramValues);
                // limited to only those keys found in toParams
                var incomingParamVals = pick(toParamVals, toKeys);
                toParamVals = omit(toParamVals, toKeys);
                var fromParamVals = omit(nodeParamVals(fromPath, toNode.state) || {}, noInherit);
                // extend toParamVals with any fromParamVals, then override any of those those with incomingParamVals
                var ownParamVals = extend(toParamVals, fromParamVals, incomingParamVals);
                return new PathNode(toNode.state).applyRawParams(ownParamVals);
            }
            // The param keys specified by the incoming toParams
            return toPath.map(makeInheritedParamsNode);
        };
        /**
         * Computes the tree changes (entering, exiting) between a fromPath and toPath.
         */
        PathUtils.treeChanges = function (fromPath, toPath, reloadState) {
            var max = Math.min(fromPath.length, toPath.length);
            var keep = 0;
            var nodesMatch = function (node1, node2) { return node1.equals(node2, PathUtils.nonDynamicParams); };
            while (keep < max && fromPath[keep].state !== reloadState && nodesMatch(fromPath[keep], toPath[keep])) {
                keep++;
            }
            /** Given a retained node, return a new node which uses the to node's param values */
            function applyToParams(retainedNode, idx) {
                var cloned = retainedNode.clone();
                cloned.paramValues = toPath[idx].paramValues;
                return cloned;
            }
            var from, retained, exiting, entering, to;
            from = fromPath;
            retained = from.slice(0, keep);
            exiting = from.slice(keep);
            // Create a new retained path (with shallow copies of nodes) which have the params of the toPath mapped
            var retainedWithToParams = retained.map(applyToParams);
            entering = toPath.slice(keep);
            to = retainedWithToParams.concat(entering);
            return { from: from, to: to, retained: retained, retainedWithToParams: retainedWithToParams, exiting: exiting, entering: entering };
        };
        /**
         * Returns a new path which is: the subpath of the first path which matches the second path.
         *
         * The new path starts from root and contains any nodes that match the nodes in the second path.
         * It stops before the first non-matching node.
         *
         * Nodes are compared using their state property and their parameter values.
         * If a `paramsFn` is provided, only the [[Param]] returned by the function will be considered when comparing nodes.
         *
         * @param pathA the first path
         * @param pathB the second path
         * @param paramsFn a function which returns the parameters to consider when comparing
         *
         * @returns an array of PathNodes from the first path which match the nodes in the second path
         */
        PathUtils.matching = function (pathA, pathB, paramsFn) {
            var done = false;
            var tuples = arrayTuples(pathA, pathB);
            return tuples.reduce(function (matching, _a) {
                var nodeA = _a[0], nodeB = _a[1];
                done = done || !nodeA.equals(nodeB, paramsFn);
                return done ? matching : matching.concat(nodeA);
            }, []);
        };
        /**
         * Returns true if two paths are identical.
         *
         * @param pathA
         * @param pathB
         * @param paramsFn a function which returns the parameters to consider when comparing
         * @returns true if the the states and parameter values for both paths are identical
         */
        PathUtils.equals = function (pathA, pathB, paramsFn) {
            return pathA.length === pathB.length && PathUtils.matching(pathA, pathB, paramsFn).length === pathA.length;
        };
        /**
         * Return a subpath of a path, which stops at the first matching node
         *
         * Given an array of nodes, returns a subset of the array starting from the first node,
         * stopping when the first node matches the predicate.
         *
         * @param path a path of [[PathNode]]s
         * @param predicate a [[Predicate]] fn that matches [[PathNode]]s
         * @returns a subpath up to the matching node, or undefined if no match is found
         */
        PathUtils.subPath = function (path, predicate) {
            var node = find(path, predicate);
            var elementIdx = path.indexOf(node);
            return elementIdx === -1 ? undefined : path.slice(0, elementIdx + 1);
        };
        PathUtils.nonDynamicParams = function (node) {
            return node.state.parameters({ inherit: false }).filter(function (param) { return !param.dynamic; });
        };
        /** Gets the raw parameter values from a path */
        PathUtils.paramValues = function (path) { return path.reduce(function (acc, node) { return extend(acc, node.paramValues); }, {}); };
        return PathUtils;
    }());

    /** @module path */ /** for typedoc */

    /** @internalapi */
    var resolvePolicies = {
        when: {
            LAZY: 'LAZY',
            EAGER: 'EAGER',
        },
        async: {
            WAIT: 'WAIT',
            NOWAIT: 'NOWAIT',
            RXWAIT: 'RXWAIT',
        },
    };

    /**
     * @coreapi
     * @module resolve
     */ /** for typedoc */
    // TODO: explicitly make this user configurable
    var defaultResolvePolicy = {
        when: 'LAZY',
        async: 'WAIT',
    };
    /**
     * The basic building block for the resolve system.
     *
     * Resolvables encapsulate a state's resolve's resolveFn, the resolveFn's declared dependencies, the wrapped (.promise),
     * and the unwrapped-when-complete (.data) result of the resolveFn.
     *
     * Resolvable.get() either retrieves the Resolvable's existing promise, or else invokes resolve() (which invokes the
     * resolveFn) and returns the resulting promise.
     *
     * Resolvable.get() and Resolvable.resolve() both execute within a context path, which is passed as the first
     * parameter to those fns.
     */
    var Resolvable = /** @class */ (function () {
        function Resolvable(arg1, resolveFn, deps, policy, data) {
            this.resolved = false;
            this.promise = undefined;
            if (arg1 instanceof Resolvable) {
                extend(this, arg1);
            }
            else if (isFunction(resolveFn)) {
                if (isNullOrUndefined(arg1))
                    throw new Error('new Resolvable(): token argument is required');
                if (!isFunction(resolveFn))
                    throw new Error('new Resolvable(): resolveFn argument must be a function');
                this.token = arg1;
                this.policy = policy;
                this.resolveFn = resolveFn;
                this.deps = deps || [];
                this.data = data;
                this.resolved = data !== undefined;
                this.promise = this.resolved ? services.$q.when(this.data) : undefined;
            }
            else if (isObject(arg1) && arg1.token && (arg1.hasOwnProperty('resolveFn') || arg1.hasOwnProperty('data'))) {
                var literal = arg1;
                return new Resolvable(literal.token, literal.resolveFn, literal.deps, literal.policy, literal.data);
            }
        }
        Resolvable.prototype.getPolicy = function (state) {
            var thisPolicy = this.policy || {};
            var statePolicy = (state && state.resolvePolicy) || {};
            return {
                when: thisPolicy.when || statePolicy.when || defaultResolvePolicy.when,
                async: thisPolicy.async || statePolicy.async || defaultResolvePolicy.async,
            };
        };
        /**
         * Asynchronously resolve this Resolvable's data
         *
         * Given a ResolveContext that this Resolvable is found in:
         * Wait for this Resolvable's dependencies, then invoke this Resolvable's function
         * and update the Resolvable's state
         */
        Resolvable.prototype.resolve = function (resolveContext, trans) {
            var _this = this;
            var $q = services.$q;
            // Gets all dependencies from ResolveContext and wait for them to be resolved
            var getResolvableDependencies = function () {
                return $q.all(resolveContext.getDependencies(_this).map(function (resolvable) { return resolvable.get(resolveContext, trans); }));
            };
            // Invokes the resolve function passing the resolved dependencies as arguments
            var invokeResolveFn = function (resolvedDeps) { return _this.resolveFn.apply(null, resolvedDeps); };
            /**
             * For RXWAIT policy:
             *
             * Given an observable returned from a resolve function:
             * - enables .cache() mode (this allows multicast subscribers)
             * - then calls toPromise() (this triggers subscribe() and thus fetches)
             * - Waits for the promise, then return the cached observable (not the first emitted value).
             */
            var waitForRx = function (observable$) {
                var cached = observable$.cache(1);
                return cached
                    .take(1)
                    .toPromise()
                    .then(function () { return cached; });
            };
            // If the resolve policy is RXWAIT, wait for the observable to emit something. otherwise pass through.
            var node = resolveContext.findNode(this);
            var state = node && node.state;
            var maybeWaitForRx = this.getPolicy(state).async === 'RXWAIT' ? waitForRx : identity;
            // After the final value has been resolved, update the state of the Resolvable
            var applyResolvedValue = function (resolvedValue) {
                _this.data = resolvedValue;
                _this.resolved = true;
                _this.resolveFn = null;
                trace.traceResolvableResolved(_this, trans);
                return _this.data;
            };
            // Sets the promise property first, then getsResolvableDependencies in the context of the promise chain. Always waits one tick.
            return (this.promise = $q
                .when()
                .then(getResolvableDependencies)
                .then(invokeResolveFn)
                .then(maybeWaitForRx)
                .then(applyResolvedValue));
        };
        /**
         * Gets a promise for this Resolvable's data.
         *
         * Fetches the data and returns a promise.
         * Returns the existing promise if it has already been fetched once.
         */
        Resolvable.prototype.get = function (resolveContext, trans) {
            return this.promise || this.resolve(resolveContext, trans);
        };
        Resolvable.prototype.toString = function () {
            return "Resolvable(token: " + stringify(this.token) + ", requires: [" + this.deps.map(stringify) + "])";
        };
        Resolvable.prototype.clone = function () {
            return new Resolvable(this);
        };
        Resolvable.fromData = function (token, data) { return new Resolvable(token, function () { return data; }, null, null, data); };
        return Resolvable;
    }());

    /** @module resolve */
    var whens = resolvePolicies.when;
    var ALL_WHENS = [whens.EAGER, whens.LAZY];
    var EAGER_WHENS = [whens.EAGER];
    // tslint:disable-next-line:no-inferrable-types
    var NATIVE_INJECTOR_TOKEN = 'Native Injector';
    /**
     * Encapsulates Dependency Injection for a path of nodes
     *
     * UI-Router states are organized as a tree.
     * A nested state has a path of ancestors to the root of the tree.
     * When a state is being activated, each element in the path is wrapped as a [[PathNode]].
     * A `PathNode` is a stateful object that holds things like parameters and resolvables for the state being activated.
     *
     * The ResolveContext closes over the [[PathNode]]s, and provides DI for the last node in the path.
     */
    var ResolveContext = /** @class */ (function () {
        function ResolveContext(_path) {
            this._path = _path;
        }
        /** Gets all the tokens found in the resolve context, de-duplicated */
        ResolveContext.prototype.getTokens = function () {
            return this._path.reduce(function (acc, node) { return acc.concat(node.resolvables.map(function (r) { return r.token; })); }, []).reduce(uniqR, []);
        };
        /**
         * Gets the Resolvable that matches the token
         *
         * Gets the last Resolvable that matches the token in this context, or undefined.
         * Throws an error if it doesn't exist in the ResolveContext
         */
        ResolveContext.prototype.getResolvable = function (token) {
            var matching = this._path
                .map(function (node) { return node.resolvables; })
                .reduce(unnestR, [])
                .filter(function (r) { return r.token === token; });
            return tail(matching);
        };
        /** Returns the [[ResolvePolicy]] for the given [[Resolvable]] */
        ResolveContext.prototype.getPolicy = function (resolvable) {
            var node = this.findNode(resolvable);
            return resolvable.getPolicy(node.state);
        };
        /**
         * Returns a ResolveContext that includes a portion of this one
         *
         * Given a state, this method creates a new ResolveContext from this one.
         * The new context starts at the first node (root) and stops at the node for the `state` parameter.
         *
         * #### Why
         *
         * When a transition is created, the nodes in the "To Path" are injected from a ResolveContext.
         * A ResolveContext closes over a path of [[PathNode]]s and processes the resolvables.
         * The "To State" can inject values from its own resolvables, as well as those from all its ancestor state's (node's).
         * This method is used to create a narrower context when injecting ancestor nodes.
         *
         * @example
         * `let ABCD = new ResolveContext([A, B, C, D]);`
         *
         * Given a path `[A, B, C, D]`, where `A`, `B`, `C` and `D` are nodes for states `a`, `b`, `c`, `d`:
         * When injecting `D`, `D` should have access to all resolvables from `A`, `B`, `C`, `D`.
         * However, `B` should only be able to access resolvables from `A`, `B`.
         *
         * When resolving for the `B` node, first take the full "To Path" Context `[A,B,C,D]` and limit to the subpath `[A,B]`.
         * `let AB = ABCD.subcontext(a)`
         */
        ResolveContext.prototype.subContext = function (state) {
            return new ResolveContext(PathUtils.subPath(this._path, function (node) { return node.state === state; }));
        };
        /**
         * Adds Resolvables to the node that matches the state
         *
         * This adds a [[Resolvable]] (generally one created on the fly; not declared on a [[StateDeclaration.resolve]] block).
         * The resolvable is added to the node matching the `state` parameter.
         *
         * These new resolvables are not automatically fetched.
         * The calling code should either fetch them, fetch something that depends on them,
         * or rely on [[resolvePath]] being called when some state is being entered.
         *
         * Note: each resolvable's [[ResolvePolicy]] is merged with the state's policy, and the global default.
         *
         * @param newResolvables the new Resolvables
         * @param state Used to find the node to put the resolvable on
         */
        ResolveContext.prototype.addResolvables = function (newResolvables, state) {
            var node = find(this._path, propEq('state', state));
            var keys = newResolvables.map(function (r) { return r.token; });
            node.resolvables = node.resolvables.filter(function (r) { return keys.indexOf(r.token) === -1; }).concat(newResolvables);
        };
        /**
         * Returns a promise for an array of resolved path Element promises
         *
         * @param when
         * @param trans
         * @returns {Promise<any>|any}
         */
        ResolveContext.prototype.resolvePath = function (when, trans) {
            var _this = this;
            if (when === void 0) { when = 'LAZY'; }
            // This option determines which 'when' policy Resolvables we are about to fetch.
            var whenOption = inArray(ALL_WHENS, when) ? when : 'LAZY';
            // If the caller specified EAGER, only the EAGER Resolvables are fetched.
            // if the caller specified LAZY, both EAGER and LAZY Resolvables are fetched.`
            var matchedWhens = whenOption === resolvePolicies.when.EAGER ? EAGER_WHENS : ALL_WHENS;
            // get the subpath to the state argument, if provided
            trace.traceResolvePath(this._path, when, trans);
            var matchesPolicy = function (acceptedVals, whenOrAsync) { return function (resolvable) {
                return inArray(acceptedVals, _this.getPolicy(resolvable)[whenOrAsync]);
            }; };
            // Trigger all the (matching) Resolvables in the path
            // Reduce all the "WAIT" Resolvables into an array
            var promises = this._path.reduce(function (acc, node) {
                var nodeResolvables = node.resolvables.filter(matchesPolicy(matchedWhens, 'when'));
                var nowait = nodeResolvables.filter(matchesPolicy(['NOWAIT'], 'async'));
                var wait = nodeResolvables.filter(not(matchesPolicy(['NOWAIT'], 'async')));
                // For the matching Resolvables, start their async fetch process.
                var subContext = _this.subContext(node.state);
                var getResult = function (r) {
                    return r
                        .get(subContext, trans)
                        // Return a tuple that includes the Resolvable's token
                        .then(function (value) { return ({ token: r.token, value: value }); });
                };
                nowait.forEach(getResult);
                return acc.concat(wait.map(getResult));
            }, []);
            // Wait for all the "WAIT" resolvables
            return services.$q.all(promises);
        };
        ResolveContext.prototype.injector = function () {
            return this._injector || (this._injector = new UIInjectorImpl(this));
        };
        ResolveContext.prototype.findNode = function (resolvable) {
            return find(this._path, function (node) { return inArray(node.resolvables, resolvable); });
        };
        /**
         * Gets the async dependencies of a Resolvable
         *
         * Given a Resolvable, returns its dependencies as a Resolvable[]
         */
        ResolveContext.prototype.getDependencies = function (resolvable) {
            var _this = this;
            var node = this.findNode(resolvable);
            // Find which other resolvables are "visible" to the `resolvable` argument
            // subpath stopping at resolvable's node, or the whole path (if the resolvable isn't in the path)
            var subPath = PathUtils.subPath(this._path, function (x) { return x === node; }) || this._path;
            var availableResolvables = subPath
                .reduce(function (acc, _node) { return acc.concat(_node.resolvables); }, []) // all of subpath's resolvables
                .filter(function (res) { return res !== resolvable; }); // filter out the `resolvable` argument
            var getDependency = function (token) {
                var matching = availableResolvables.filter(function (r) { return r.token === token; });
                if (matching.length)
                    return tail(matching);
                var fromInjector = _this.injector().getNative(token);
                if (isUndefined(fromInjector)) {
                    throw new Error('Could not find Dependency Injection token: ' + stringify(token));
                }
                return new Resolvable(token, function () { return fromInjector; }, [], fromInjector);
            };
            return resolvable.deps.map(getDependency);
        };
        return ResolveContext;
    }());
    var UIInjectorImpl = /** @class */ (function () {
        function UIInjectorImpl(context) {
            this.context = context;
            this.native = this.get(NATIVE_INJECTOR_TOKEN) || services.$injector;
        }
        UIInjectorImpl.prototype.get = function (token) {
            var resolvable = this.context.getResolvable(token);
            if (resolvable) {
                if (this.context.getPolicy(resolvable).async === 'NOWAIT') {
                    return resolvable.get(this.context);
                }
                if (!resolvable.resolved) {
                    throw new Error('Resolvable async .get() not complete:' + stringify(resolvable.token));
                }
                return resolvable.data;
            }
            return this.getNative(token);
        };
        UIInjectorImpl.prototype.getAsync = function (token) {
            var resolvable = this.context.getResolvable(token);
            if (resolvable)
                return resolvable.get(this.context);
            return services.$q.when(this.native.get(token));
        };
        UIInjectorImpl.prototype.getNative = function (token) {
            return this.native && this.native.get(token);
        };
        return UIInjectorImpl;
    }());

    /** @module resolve */ /** for typedoc */

    /** @module state */
    var parseUrl = function (url) {
        if (!isString(url))
            return false;
        var root$$1 = url.charAt(0) === '^';
        return { val: root$$1 ? url.substring(1) : url, root: root$$1 };
    };
    function nameBuilder(state) {
        return state.name;
    }
    function selfBuilder(state) {
        state.self.$$state = function () { return state; };
        return state.self;
    }
    function dataBuilder(state) {
        if (state.parent && state.parent.data) {
            state.data = state.self.data = inherit(state.parent.data, state.data);
        }
        return state.data;
    }
    var getUrlBuilder = function ($urlMatcherFactoryProvider, root$$1) {
        return function urlBuilder(stateObject) {
            var state = stateObject.self;
            // For future states, i.e., states whose name ends with `.**`,
            // match anything that starts with the url prefix
            if (state && state.url && state.name && state.name.match(/\.\*\*$/)) {
                state.url += '{remainder:any}'; // match any path (.*)
            }
            var parent = stateObject.parent;
            var parsed = parseUrl(state.url);
            var url = !parsed ? state.url : $urlMatcherFactoryProvider.compile(parsed.val, { state: state });
            if (!url)
                return null;
            if (!$urlMatcherFactoryProvider.isMatcher(url))
                throw new Error("Invalid url '" + url + "' in state '" + stateObject + "'");
            return parsed && parsed.root ? url : ((parent && parent.navigable) || root$$1()).url.append(url);
        };
    };
    var getNavigableBuilder = function (isRoot) {
        return function navigableBuilder(state) {
            return !isRoot(state) && state.url ? state : state.parent ? state.parent.navigable : null;
        };
    };
    var getParamsBuilder = function (paramFactory) {
        return function paramsBuilder(state) {
            var makeConfigParam = function (config, id) { return paramFactory.fromConfig(id, null, state.self); };
            var urlParams = (state.url && state.url.parameters({ inherit: false })) || [];
            var nonUrlParams = values(mapObj(omit(state.params || {}, urlParams.map(prop('id'))), makeConfigParam));
            return urlParams
                .concat(nonUrlParams)
                .map(function (p) { return [p.id, p]; })
                .reduce(applyPairs, {});
        };
    };
    function pathBuilder(state) {
        return state.parent ? state.parent.path.concat(state) : /*root*/ [state];
    }
    function includesBuilder(state) {
        var includes = state.parent ? extend({}, state.parent.includes) : {};
        includes[state.name] = true;
        return includes;
    }
    /**
     * This is a [[StateBuilder.builder]] function for the `resolve:` block on a [[StateDeclaration]].
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * validates the `resolve` property and converts it to a [[Resolvable]] array.
     *
     * resolve: input value can be:
     *
     * {
     *   // analyzed but not injected
     *   myFooResolve: function() { return "myFooData"; },
     *
     *   // function.toString() parsed, "DependencyName" dep as string (not min-safe)
     *   myBarResolve: function(DependencyName) { return DependencyName.fetchSomethingAsPromise() },
     *
     *   // Array split; "DependencyName" dep as string
     *   myBazResolve: [ "DependencyName", function(dep) { return dep.fetchSomethingAsPromise() },
     *
     *   // Array split; DependencyType dep as token (compared using ===)
     *   myQuxResolve: [ DependencyType, function(dep) { return dep.fetchSometingAsPromise() },
     *
     *   // val.$inject used as deps
     *   // where:
     *   //     corgeResolve.$inject = ["DependencyName"];
     *   //     function corgeResolve(dep) { dep.fetchSometingAsPromise() }
     *   // then "DependencyName" dep as string
     *   myCorgeResolve: corgeResolve,
     *
     *  // inject service by name
     *  // When a string is found, desugar creating a resolve that injects the named service
     *   myGraultResolve: "SomeService"
     * }
     *
     * or:
     *
     * [
     *   new Resolvable("myFooResolve", function() { return "myFooData" }),
     *   new Resolvable("myBarResolve", function(dep) { return dep.fetchSomethingAsPromise() }, [ "DependencyName" ]),
     *   { provide: "myBazResolve", useFactory: function(dep) { dep.fetchSomethingAsPromise() }, deps: [ "DependencyName" ] }
     * ]
     */
    function resolvablesBuilder(state) {
        /** convert resolve: {} and resolvePolicy: {} objects to an array of tuples */
        var objects2Tuples = function (resolveObj, resolvePolicies) {
            return Object.keys(resolveObj || {}).map(function (token) { return ({
                token: token,
                val: resolveObj[token],
                deps: undefined,
                policy: resolvePolicies[token],
            }); });
        };
        /** fetch DI annotations from a function or ng1-style array */
        var annotate = function (fn) {
            var $injector = services.$injector;
            // ng1 doesn't have an $injector until runtime.
            // If the $injector doesn't exist, use "deferred" literal as a
            // marker indicating they should be annotated when runtime starts
            return fn['$inject'] || ($injector && $injector.annotate(fn, $injector.strictDi)) || 'deferred';
        };
        /** true if the object has both `token` and `resolveFn`, and is probably a [[ResolveLiteral]] */
        var isResolveLiteral = function (obj) { return !!(obj.token && obj.resolveFn); };
        /** true if the object looks like a provide literal, or a ng2 Provider */
        var isLikeNg2Provider = function (obj) {
            return !!((obj.provide || obj.token) && (obj.useValue || obj.useFactory || obj.useExisting || obj.useClass));
        };
        /** true if the object looks like a tuple from obj2Tuples */
        var isTupleFromObj = function (obj) {
            return !!(obj && obj.val && (isString(obj.val) || isArray(obj.val) || isFunction(obj.val)));
        };
        /** extracts the token from a Provider or provide literal */
        var getToken = function (p) { return p.provide || p.token; };
        // prettier-ignore: Given a literal resolve or provider object, returns a Resolvable
        var literal2Resolvable = pattern([
            [prop('resolveFn'), function (p) { return new Resolvable(getToken(p), p.resolveFn, p.deps, p.policy); }],
            [prop('useFactory'), function (p) { return new Resolvable(getToken(p), p.useFactory, p.deps || p.dependencies, p.policy); }],
            [prop('useClass'), function (p) { return new Resolvable(getToken(p), function () { return new p.useClass(); }, [], p.policy); }],
            [prop('useValue'), function (p) { return new Resolvable(getToken(p), function () { return p.useValue; }, [], p.policy, p.useValue); }],
            [prop('useExisting'), function (p) { return new Resolvable(getToken(p), identity, [p.useExisting], p.policy); }],
        ]);
        // prettier-ignore
        var tuple2Resolvable = pattern([
            [pipe(prop('val'), isString), function (tuple) { return new Resolvable(tuple.token, identity, [tuple.val], tuple.policy); }],
            [pipe(prop('val'), isArray), function (tuple) { return new Resolvable(tuple.token, tail(tuple.val), tuple.val.slice(0, -1), tuple.policy); }],
            [pipe(prop('val'), isFunction), function (tuple) { return new Resolvable(tuple.token, tuple.val, annotate(tuple.val), tuple.policy); }],
        ]);
        // prettier-ignore
        var item2Resolvable = pattern([
            [is(Resolvable), function (r) { return r; }],
            [isResolveLiteral, literal2Resolvable],
            [isLikeNg2Provider, literal2Resolvable],
            [isTupleFromObj, tuple2Resolvable],
            [val(true), function (obj) { throw new Error('Invalid resolve value: ' + stringify(obj)); },],
        ]);
        // If resolveBlock is already an array, use it as-is.
        // Otherwise, assume it's an object and convert to an Array of tuples
        var decl = state.resolve;
        var items = isArray(decl) ? decl : objects2Tuples(decl, state.resolvePolicy || {});
        return items.map(item2Resolvable);
    }
    /**
     * @internalapi A internal global service
     *
     * StateBuilder is a factory for the internal [[StateObject]] objects.
     *
     * When you register a state with the [[StateRegistry]], you register a plain old javascript object which
     * conforms to the [[StateDeclaration]] interface.  This factory takes that object and builds the corresponding
     * [[StateObject]] object, which has an API and is used internally.
     *
     * Custom properties or API may be added to the internal [[StateObject]] object by registering a decorator function
     * using the [[builder]] method.
     */
    var StateBuilder = /** @class */ (function () {
        function StateBuilder(matcher, urlMatcherFactory) {
            this.matcher = matcher;
            var self = this;
            var root$$1 = function () { return matcher.find(''); };
            var isRoot = function (state) { return state.name === ''; };
            function parentBuilder(state) {
                if (isRoot(state))
                    return null;
                return matcher.find(self.parentName(state)) || root$$1();
            }
            this.builders = {
                name: [nameBuilder],
                self: [selfBuilder],
                parent: [parentBuilder],
                data: [dataBuilder],
                // Build a URLMatcher if necessary, either via a relative or absolute URL
                url: [getUrlBuilder(urlMatcherFactory, root$$1)],
                // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
                navigable: [getNavigableBuilder(isRoot)],
                params: [getParamsBuilder(urlMatcherFactory.paramFactory)],
                // Each framework-specific ui-router implementation should define its own `views` builder
                // e.g., src/ng1/statebuilders/views.ts
                views: [],
                // Keep a full path from the root down to this state as this is needed for state activation.
                path: [pathBuilder],
                // Speed up $state.includes() as it's used a lot
                includes: [includesBuilder],
                resolvables: [resolvablesBuilder],
            };
        }
        /**
         * Registers a [[BuilderFunction]] for a specific [[StateObject]] property (e.g., `parent`, `url`, or `path`).
         * More than one BuilderFunction can be registered for a given property.
         *
         * The BuilderFunction(s) will be used to define the property on any subsequently built [[StateObject]] objects.
         *
         * @param name The name of the State property being registered for.
         * @param fn The BuilderFunction which will be used to build the State property
         * @returns a function which deregisters the BuilderFunction
         */
        StateBuilder.prototype.builder = function (name, fn) {
            var builders = this.builders;
            var array = builders[name] || [];
            // Backwards compat: if only one builder exists, return it, else return whole arary.
            if (isString(name) && !isDefined(fn))
                return array.length > 1 ? array : array[0];
            if (!isString(name) || !isFunction(fn))
                return;
            builders[name] = array;
            builders[name].push(fn);
            return function () { return builders[name].splice(builders[name].indexOf(fn, 1)) && null; };
        };
        /**
         * Builds all of the properties on an essentially blank State object, returning a State object which has all its
         * properties and API built.
         *
         * @param state an uninitialized State object
         * @returns the built State object
         */
        StateBuilder.prototype.build = function (state) {
            var _a = this, matcher = _a.matcher, builders = _a.builders;
            var parent = this.parentName(state);
            if (parent && !matcher.find(parent, undefined, false)) {
                return null;
            }
            for (var key in builders) {
                if (!builders.hasOwnProperty(key))
                    continue;
                var chain = builders[key].reduce(function (parentFn, step) { return function (_state) { return step(_state, parentFn); }; }, noop);
                state[key] = chain(state);
            }
            return state;
        };
        StateBuilder.prototype.parentName = function (state) {
            // name = 'foo.bar.baz.**'
            var name = state.name || '';
            // segments = ['foo', 'bar', 'baz', '.**']
            var segments = name.split('.');
            // segments = ['foo', 'bar', 'baz']
            var lastSegment = segments.pop();
            // segments = ['foo', 'bar'] (ignore .** segment for future states)
            if (lastSegment === '**')
                segments.pop();
            if (segments.length) {
                if (state.parent) {
                    throw new Error("States that specify the 'parent:' property should not have a '.' in their name (" + name + ")");
                }
                // 'foo.bar'
                return segments.join('.');
            }
            if (!state.parent)
                return '';
            return isString(state.parent) ? state.parent : state.parent.name;
        };
        StateBuilder.prototype.name = function (state) {
            var name = state.name;
            if (name.indexOf('.') !== -1 || !state.parent)
                return name;
            var parentName = isString(state.parent) ? state.parent : state.parent.name;
            return parentName ? parentName + '.' + name : name;
        };
        return StateBuilder;
    }());

    /**
     * Internal representation of a UI-Router state.
     *
     * Instances of this class are created when a [[StateDeclaration]] is registered with the [[StateRegistry]].
     *
     * A registered [[StateDeclaration]] is augmented with a getter ([[StateDeclaration.$$state]]) which returns the corresponding [[StateObject]] object.
     *
     * This class prototypally inherits from the corresponding [[StateDeclaration]].
     * Each of its own properties (i.e., `hasOwnProperty`) are built using builders from the [[StateBuilder]].
     */
    var StateObject = /** @class */ (function () {
        /** @deprecated use State.create() */
        function StateObject(config) {
            return StateObject.create(config || {});
        }
        /**
         * Create a state object to put the private/internal implementation details onto.
         * The object's prototype chain looks like:
         * (Internal State Object) -> (Copy of State.prototype) -> (State Declaration object) -> (State Declaration's prototype...)
         *
         * @param stateDecl the user-supplied State Declaration
         * @returns {StateObject} an internal State object
         */
        StateObject.create = function (stateDecl) {
            stateDecl = StateObject.isStateClass(stateDecl) ? new stateDecl() : stateDecl;
            var state = inherit(inherit(stateDecl, StateObject.prototype));
            stateDecl.$$state = function () { return state; };
            state.self = stateDecl;
            state.__stateObjectCache = {
                nameGlob: Glob.fromString(state.name),
            };
            return state;
        };
        /**
         * Returns true if the provided parameter is the same state.
         *
         * Compares the identity of the state against the passed value, which is either an object
         * reference to the actual `State` instance, the original definition object passed to
         * `$stateProvider.state()`, or the fully-qualified name.
         *
         * @param ref Can be one of (a) a `State` instance, (b) an object that was passed
         *        into `$stateProvider.state()`, (c) the fully-qualified name of a state as a string.
         * @returns Returns `true` if `ref` matches the current `State` instance.
         */
        StateObject.prototype.is = function (ref) {
            return this === ref || this.self === ref || this.fqn() === ref;
        };
        /**
         * @deprecated this does not properly handle dot notation
         * @returns Returns a dot-separated name of the state.
         */
        StateObject.prototype.fqn = function () {
            if (!this.parent || !(this.parent instanceof this.constructor))
                return this.name;
            var name = this.parent.fqn();
            return name ? name + '.' + this.name : this.name;
        };
        /**
         * Returns the root node of this state's tree.
         *
         * @returns The root of this state's tree.
         */
        StateObject.prototype.root = function () {
            return (this.parent && this.parent.root()) || this;
        };
        /**
         * Gets the state's `Param` objects
         *
         * Gets the list of [[Param]] objects owned by the state.
         * If `opts.inherit` is true, it also includes the ancestor states' [[Param]] objects.
         * If `opts.matchingKeys` exists, returns only `Param`s whose `id` is a key on the `matchingKeys` object
         *
         * @param opts options
         */
        StateObject.prototype.parameters = function (opts) {
            opts = defaults(opts, { inherit: true, matchingKeys: null });
            var inherited = (opts.inherit && this.parent && this.parent.parameters()) || [];
            return inherited
                .concat(values(this.params))
                .filter(function (param) { return !opts.matchingKeys || opts.matchingKeys.hasOwnProperty(param.id); });
        };
        /**
         * Returns a single [[Param]] that is owned by the state
         *
         * If `opts.inherit` is true, it also searches the ancestor states` [[Param]]s.
         * @param id the name of the [[Param]] to return
         * @param opts options
         */
        StateObject.prototype.parameter = function (id, opts) {
            if (opts === void 0) { opts = {}; }
            return ((this.url && this.url.parameter(id, opts)) ||
                find(values(this.params), propEq('id', id)) ||
                (opts.inherit && this.parent && this.parent.parameter(id)));
        };
        StateObject.prototype.toString = function () {
            return this.fqn();
        };
        /** Predicate which returns true if the object is an class with @State() decorator */
        StateObject.isStateClass = function (stateDecl) {
            return isFunction(stateDecl) && stateDecl['__uiRouterState'] === true;
        };
        /** Predicate which returns true if the object is an internal [[StateObject]] object */
        StateObject.isState = function (obj) { return isObject(obj['__stateObjectCache']); };
        return StateObject;
    }());

    /** @module state */ /** for typedoc */
    var StateMatcher = /** @class */ (function () {
        function StateMatcher(_states) {
            this._states = _states;
        }
        StateMatcher.prototype.isRelative = function (stateName) {
            stateName = stateName || '';
            return stateName.indexOf('.') === 0 || stateName.indexOf('^') === 0;
        };
        StateMatcher.prototype.find = function (stateOrName, base, matchGlob) {
            if (matchGlob === void 0) { matchGlob = true; }
            if (!stateOrName && stateOrName !== '')
                return undefined;
            var isStr = isString(stateOrName);
            var name = isStr ? stateOrName : stateOrName.name;
            if (this.isRelative(name))
                name = this.resolvePath(name, base);
            var state = this._states[name];
            if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
                return state;
            }
            else if (isStr && matchGlob) {
                var _states = values(this._states);
                var matches = _states.filter(function (_state) { return _state.__stateObjectCache.nameGlob && _state.__stateObjectCache.nameGlob.matches(name); });
                if (matches.length > 1) {
                    // tslint:disable-next-line:no-console
                    console.log("stateMatcher.find: Found multiple matches for " + name + " using glob: ", matches.map(function (match) { return match.name; }));
                }
                return matches[0];
            }
            return undefined;
        };
        StateMatcher.prototype.resolvePath = function (name, base) {
            if (!base)
                throw new Error("No reference point given for path '" + name + "'");
            var baseState = this.find(base);
            var splitName = name.split('.');
            var pathLength = splitName.length;
            var i = 0, current = baseState;
            for (; i < pathLength; i++) {
                if (splitName[i] === '' && i === 0) {
                    current = baseState;
                    continue;
                }
                if (splitName[i] === '^') {
                    if (!current.parent)
                        throw new Error("Path '" + name + "' not valid for state '" + baseState.name + "'");
                    current = current.parent;
                    continue;
                }
                break;
            }
            var relName = splitName.slice(i).join('.');
            return current.name + (current.name && relName ? '.' : '') + relName;
        };
        return StateMatcher;
    }());

    /** @module state */ /** for typedoc */
    /** @internalapi */
    var StateQueueManager = /** @class */ (function () {
        function StateQueueManager($registry, $urlRouter, states, builder, listeners) {
            this.$registry = $registry;
            this.$urlRouter = $urlRouter;
            this.states = states;
            this.builder = builder;
            this.listeners = listeners;
            this.queue = [];
            this.matcher = $registry.matcher;
        }
        /** @internalapi */
        StateQueueManager.prototype.dispose = function () {
            this.queue = [];
        };
        StateQueueManager.prototype.register = function (stateDecl) {
            var queue = this.queue;
            var state = StateObject.create(stateDecl);
            var name = state.name;
            if (!isString(name))
                throw new Error('State must have a valid name');
            if (this.states.hasOwnProperty(name) || inArray(queue.map(prop('name')), name))
                throw new Error("State '" + name + "' is already defined");
            queue.push(state);
            this.flush();
            return state;
        };
        StateQueueManager.prototype.flush = function () {
            var _this = this;
            var _a = this, queue = _a.queue, states = _a.states, builder = _a.builder;
            var registered = [], // states that got registered
            orphans = [], // states that don't yet have a parent registered
            previousQueueLength = {}; // keep track of how long the queue when an orphan was first encountered
            var getState = function (name) { return _this.states.hasOwnProperty(name) && _this.states[name]; };
            var notifyListeners = function () {
                if (registered.length) {
                    _this.listeners.forEach(function (listener) { return listener('registered', registered.map(function (s) { return s.self; })); });
                }
            };
            while (queue.length > 0) {
                var state = queue.shift();
                var name_1 = state.name;
                var result = builder.build(state);
                var orphanIdx = orphans.indexOf(state);
                if (result) {
                    var existingState = getState(name_1);
                    if (existingState && existingState.name === name_1) {
                        throw new Error("State '" + name_1 + "' is already defined");
                    }
                    var existingFutureState = getState(name_1 + '.**');
                    if (existingFutureState) {
                        // Remove future state of the same name
                        this.$registry.deregister(existingFutureState);
                    }
                    states[name_1] = state;
                    this.attachRoute(state);
                    if (orphanIdx >= 0)
                        orphans.splice(orphanIdx, 1);
                    registered.push(state);
                    continue;
                }
                var prev = previousQueueLength[name_1];
                previousQueueLength[name_1] = queue.length;
                if (orphanIdx >= 0 && prev === queue.length) {
                    // Wait until two consecutive iterations where no additional states were dequeued successfully.
                    // throw new Error(`Cannot register orphaned state '${name}'`);
                    queue.push(state);
                    notifyListeners();
                    return states;
                }
                else if (orphanIdx < 0) {
                    orphans.push(state);
                }
                queue.push(state);
            }
            notifyListeners();
            return states;
        };
        StateQueueManager.prototype.attachRoute = function (state) {
            if (state.abstract || !state.url)
                return;
            this.$urlRouter.rule(this.$urlRouter.urlRuleFactory.create(state));
        };
        return StateQueueManager;
    }());

    /**
     * @coreapi
     * @module state
     */ /** for typedoc */
    var StateRegistry = /** @class */ (function () {
        /** @internalapi */
        function StateRegistry(_router) {
            this._router = _router;
            this.states = {};
            this.listeners = [];
            this.matcher = new StateMatcher(this.states);
            this.builder = new StateBuilder(this.matcher, _router.urlMatcherFactory);
            this.stateQueue = new StateQueueManager(this, _router.urlRouter, this.states, this.builder, this.listeners);
            this._registerRoot();
        }
        /** @internalapi */
        StateRegistry.prototype._registerRoot = function () {
            var rootStateDef = {
                name: '',
                url: '^',
                views: null,
                params: {
                    '#': { value: null, type: 'hash', dynamic: true },
                },
                abstract: true,
            };
            var _root = (this._root = this.stateQueue.register(rootStateDef));
            _root.navigable = null;
        };
        /** @internalapi */
        StateRegistry.prototype.dispose = function () {
            var _this = this;
            this.stateQueue.dispose();
            this.listeners = [];
            this.get().forEach(function (state) { return _this.get(state) && _this.deregister(state); });
        };
        /**
         * Listen for a State Registry events
         *
         * Adds a callback that is invoked when states are registered or deregistered with the StateRegistry.
         *
         * #### Example:
         * ```js
         * let allStates = registry.get();
         *
         * // Later, invoke deregisterFn() to remove the listener
         * let deregisterFn = registry.onStatesChanged((event, states) => {
         *   switch(event) {
         *     case: 'registered':
         *       states.forEach(state => allStates.push(state));
         *       break;
         *     case: 'deregistered':
         *       states.forEach(state => {
         *         let idx = allStates.indexOf(state);
         *         if (idx !== -1) allStates.splice(idx, 1);
         *       });
         *       break;
         *   }
         * });
         * ```
         *
         * @param listener a callback function invoked when the registered states changes.
         *        The function receives two parameters, `event` and `state`.
         *        See [[StateRegistryListener]]
         * @return a function that deregisters the listener
         */
        StateRegistry.prototype.onStatesChanged = function (listener) {
            this.listeners.push(listener);
            return function deregisterListener() {
                removeFrom(this.listeners)(listener);
            }.bind(this);
        };
        /**
         * Gets the implicit root state
         *
         * Gets the root of the state tree.
         * The root state is implicitly created by UI-Router.
         * Note: this returns the internal [[StateObject]] representation, not a [[StateDeclaration]]
         *
         * @return the root [[StateObject]]
         */
        StateRegistry.prototype.root = function () {
            return this._root;
        };
        /**
         * Adds a state to the registry
         *
         * Registers a [[StateDeclaration]] or queues it for registration.
         *
         * Note: a state will be queued if the state's parent isn't yet registered.
         *
         * @param stateDefinition the definition of the state to register.
         * @returns the internal [[StateObject]] object.
         *          If the state was successfully registered, then the object is fully built (See: [[StateBuilder]]).
         *          If the state was only queued, then the object is not fully built.
         */
        StateRegistry.prototype.register = function (stateDefinition) {
            return this.stateQueue.register(stateDefinition);
        };
        /** @hidden */
        StateRegistry.prototype._deregisterTree = function (state) {
            var _this = this;
            var all$$1 = this.get().map(function (s) { return s.$$state(); });
            var getChildren = function (states) {
                var _children = all$$1.filter(function (s) { return states.indexOf(s.parent) !== -1; });
                return _children.length === 0 ? _children : _children.concat(getChildren(_children));
            };
            var children = getChildren([state]);
            var deregistered = [state].concat(children).reverse();
            deregistered.forEach(function (_state) {
                var $ur = _this._router.urlRouter;
                // Remove URL rule
                $ur
                    .rules()
                    .filter(propEq('state', _state))
                    .forEach($ur.removeRule.bind($ur));
                // Remove state from registry
                delete _this.states[_state.name];
            });
            return deregistered;
        };
        /**
         * Removes a state from the registry
         *
         * This removes a state from the registry.
         * If the state has children, they are are also removed from the registry.
         *
         * @param stateOrName the state's name or object representation
         * @returns {StateObject[]} a list of removed states
         */
        StateRegistry.prototype.deregister = function (stateOrName) {
            var _state = this.get(stateOrName);
            if (!_state)
                throw new Error("Can't deregister state; not found: " + stateOrName);
            var deregisteredStates = this._deregisterTree(_state.$$state());
            this.listeners.forEach(function (listener) { return listener('deregistered', deregisteredStates.map(function (s) { return s.self; })); });
            return deregisteredStates;
        };
        StateRegistry.prototype.get = function (stateOrName, base) {
            var _this = this;
            if (arguments.length === 0)
                return Object.keys(this.states).map(function (name) { return _this.states[name].self; });
            var found = this.matcher.find(stateOrName, base);
            return (found && found.self) || null;
        };
        StateRegistry.prototype.decorator = function (name, func) {
            return this.builder.builder(name, func);
        };
        return StateRegistry;
    }());

    (function (TransitionHookPhase) {
        TransitionHookPhase[TransitionHookPhase["CREATE"] = 0] = "CREATE";
        TransitionHookPhase[TransitionHookPhase["BEFORE"] = 1] = "BEFORE";
        TransitionHookPhase[TransitionHookPhase["RUN"] = 2] = "RUN";
        TransitionHookPhase[TransitionHookPhase["SUCCESS"] = 3] = "SUCCESS";
        TransitionHookPhase[TransitionHookPhase["ERROR"] = 4] = "ERROR";
    })(exports.TransitionHookPhase || (exports.TransitionHookPhase = {}));

    (function (TransitionHookScope) {
        TransitionHookScope[TransitionHookScope["TRANSITION"] = 0] = "TRANSITION";
        TransitionHookScope[TransitionHookScope["STATE"] = 1] = "STATE";
    })(exports.TransitionHookScope || (exports.TransitionHookScope = {}));

    /**
     * @coreapi
     * @module transition
     */
    var defaultOptions = {
        current: noop,
        transition: null,
        traceData: {},
        bind: null,
    };
    /** @hidden */
    var TransitionHook = /** @class */ (function () {
        function TransitionHook(transition, stateContext, registeredHook, options) {
            var _this = this;
            this.transition = transition;
            this.stateContext = stateContext;
            this.registeredHook = registeredHook;
            this.options = options;
            this.isSuperseded = function () { return _this.type.hookPhase === exports.TransitionHookPhase.RUN && !_this.options.transition.isActive(); };
            this.options = defaults(options, defaultOptions);
            this.type = registeredHook.eventType;
        }
        /**
         * Chains together an array of TransitionHooks.
         *
         * Given a list of [[TransitionHook]] objects, chains them together.
         * Each hook is invoked after the previous one completes.
         *
         * #### Example:
         * ```js
         * var hooks: TransitionHook[] = getHooks();
         * let promise: Promise<any> = TransitionHook.chain(hooks);
         *
         * promise.then(handleSuccess, handleError);
         * ```
         *
         * @param hooks the list of hooks to chain together
         * @param waitFor if provided, the chain is `.then()`'ed off this promise
         * @returns a `Promise` for sequentially invoking the hooks (in order)
         */
        TransitionHook.chain = function (hooks, waitFor) {
            // Chain the next hook off the previous
            var createHookChainR = function (prev, nextHook) { return prev.then(function () { return nextHook.invokeHook(); }); };
            return hooks.reduce(createHookChainR, waitFor || services.$q.when());
        };
        /**
         * Invokes all the provided TransitionHooks, in order.
         * Each hook's return value is checked.
         * If any hook returns a promise, then the rest of the hooks are chained off that promise, and the promise is returned.
         * If no hook returns a promise, then all hooks are processed synchronously.
         *
         * @param hooks the list of TransitionHooks to invoke
         * @param doneCallback a callback that is invoked after all the hooks have successfully completed
         *
         * @returns a promise for the async result, or the result of the callback
         */
        TransitionHook.invokeHooks = function (hooks, doneCallback) {
            for (var idx = 0; idx < hooks.length; idx++) {
                var hookResult = hooks[idx].invokeHook();
                if (isPromise(hookResult)) {
                    var remainingHooks = hooks.slice(idx + 1);
                    return TransitionHook.chain(remainingHooks, hookResult).then(doneCallback);
                }
            }
            return doneCallback();
        };
        /**
         * Run all TransitionHooks, ignoring their return value.
         */
        TransitionHook.runAllHooks = function (hooks) {
            hooks.forEach(function (hook) { return hook.invokeHook(); });
        };
        TransitionHook.prototype.logError = function (err) {
            this.transition.router.stateService.defaultErrorHandler()(err);
        };
        TransitionHook.prototype.invokeHook = function () {
            var _this = this;
            var hook = this.registeredHook;
            if (hook._deregistered)
                return;
            var notCurrent = this.getNotCurrentRejection();
            if (notCurrent)
                return notCurrent;
            var options = this.options;
            trace.traceHookInvocation(this, this.transition, options);
            var invokeCallback = function () { return hook.callback.call(options.bind, _this.transition, _this.stateContext); };
            var normalizeErr = function (err) { return Rejection.normalize(err).toPromise(); };
            var handleError = function (err) { return hook.eventType.getErrorHandler(_this)(err); };
            var handleResult = function (result) { return hook.eventType.getResultHandler(_this)(result); };
            try {
                var result = invokeCallback();
                if (!this.type.synchronous && isPromise(result)) {
                    return result.catch(normalizeErr).then(handleResult, handleError);
                }
                else {
                    return handleResult(result);
                }
            }
            catch (err) {
                // If callback throws (synchronously)
                return handleError(Rejection.normalize(err));
            }
            finally {
                if (hook.invokeLimit && ++hook.invokeCount >= hook.invokeLimit) {
                    hook.deregister();
                }
            }
        };
        /**
         * This method handles the return value of a Transition Hook.
         *
         * A hook can return false (cancel), a TargetState (redirect),
         * or a promise (which may later resolve to false or a redirect)
         *
         * This also handles "transition superseded" -- when a new transition
         * was started while the hook was still running
         */
        TransitionHook.prototype.handleHookResult = function (result) {
            var _this = this;
            var notCurrent = this.getNotCurrentRejection();
            if (notCurrent)
                return notCurrent;
            // Hook returned a promise
            if (isPromise(result)) {
                // Wait for the promise, then reprocess with the resulting value
                return result.then(function (val$$1) { return _this.handleHookResult(val$$1); });
            }
            trace.traceHookResult(result, this.transition, this.options);
            // Hook returned false
            if (result === false) {
                // Abort this Transition
                return Rejection.aborted('Hook aborted transition').toPromise();
            }
            var isTargetState = is(TargetState);
            // hook returned a TargetState
            if (isTargetState(result)) {
                // Halt the current Transition and redirect (a new Transition) to the TargetState.
                return Rejection.redirected(result).toPromise();
            }
        };
        /**
         * Return a Rejection promise if the transition is no longer current due
         * to a stopped router (disposed), or a new transition has started and superseded this one.
         */
        TransitionHook.prototype.getNotCurrentRejection = function () {
            var router = this.transition.router;
            // The router is stopped
            if (router._disposed) {
                return Rejection.aborted("UIRouter instance #" + router.$id + " has been stopped (disposed)").toPromise();
            }
            if (this.transition._aborted) {
                return Rejection.aborted().toPromise();
            }
            // This transition is no longer current.
            // Another transition started while this hook was still running.
            if (this.isSuperseded()) {
                // Abort this transition
                return Rejection.superseded(this.options.current()).toPromise();
            }
        };
        TransitionHook.prototype.toString = function () {
            var _a = this, options = _a.options, registeredHook = _a.registeredHook;
            var event = parse('traceData.hookType')(options) || 'internal', context = parse('traceData.context.state.name')(options) || parse('traceData.context')(options) || 'unknown', name = fnToString(registeredHook.callback);
            return event + " context: " + context + ", " + maxLength(200, name);
        };
        /**
         * These GetResultHandler(s) are used by [[invokeHook]] below
         * Each HookType chooses a GetResultHandler (See: [[TransitionService._defineCoreEvents]])
         */
        TransitionHook.HANDLE_RESULT = function (hook) { return function (result) {
            return hook.handleHookResult(result);
        }; };
        /**
         * If the result is a promise rejection, log it.
         * Otherwise, ignore the result.
         */
        TransitionHook.LOG_REJECTED_RESULT = function (hook) { return function (result) {
            isPromise(result) && result.catch(function (err) { return hook.logError(Rejection.normalize(err)); });
            return undefined;
        }; };
        /**
         * These GetErrorHandler(s) are used by [[invokeHook]] below
         * Each HookType chooses a GetErrorHandler (See: [[TransitionService._defineCoreEvents]])
         */
        TransitionHook.LOG_ERROR = function (hook) { return function (error) { return hook.logError(error); }; };
        TransitionHook.REJECT_ERROR = function (hook) { return function (error) { return silentRejection(error); }; };
        TransitionHook.THROW_ERROR = function (hook) { return function (error) {
            throw error;
        }; };
        return TransitionHook;
    }());

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */
    /**
     * Determines if the given state matches the matchCriteria
     *
     * @hidden
     *
     * @param state a State Object to test against
     * @param criterion
     * - If a string, matchState uses the string as a glob-matcher against the state name
     * - If an array (of strings), matchState uses each string in the array as a glob-matchers against the state name
     *   and returns a positive match if any of the globs match.
     * - If a function, matchState calls the function with the state and returns true if the function's result is truthy.
     * @returns {boolean}
     */
    function matchState(state, criterion) {
        var toMatch = isString(criterion) ? [criterion] : criterion;
        function matchGlobs(_state) {
            var globStrings = toMatch;
            for (var i = 0; i < globStrings.length; i++) {
                var glob = new Glob(globStrings[i]);
                if ((glob && glob.matches(_state.name)) || (!glob && globStrings[i] === _state.name)) {
                    return true;
                }
            }
            return false;
        }
        var matchFn = (isFunction(toMatch) ? toMatch : matchGlobs);
        return !!matchFn(state);
    }
    /**
     * @internalapi
     * The registration data for a registered transition hook
     */
    var RegisteredHook = /** @class */ (function () {
        function RegisteredHook(tranSvc, eventType, callback, matchCriteria, removeHookFromRegistry, options) {
            if (options === void 0) { options = {}; }
            this.tranSvc = tranSvc;
            this.eventType = eventType;
            this.callback = callback;
            this.matchCriteria = matchCriteria;
            this.removeHookFromRegistry = removeHookFromRegistry;
            this.invokeCount = 0;
            this._deregistered = false;
            this.priority = options.priority || 0;
            this.bind = options.bind || null;
            this.invokeLimit = options.invokeLimit;
        }
        /**
         * Gets the matching [[PathNode]]s
         *
         * Given an array of [[PathNode]]s, and a [[HookMatchCriterion]], returns an array containing
         * the [[PathNode]]s that the criteria matches, or `null` if there were no matching nodes.
         *
         * Returning `null` is significant to distinguish between the default
         * "match-all criterion value" of `true` compared to a `() => true` function,
         * when the nodes is an empty array.
         *
         * This is useful to allow a transition match criteria of `entering: true`
         * to still match a transition, even when `entering === []`.  Contrast that
         * with `entering: (state) => true` which only matches when a state is actually
         * being entered.
         */
        RegisteredHook.prototype._matchingNodes = function (nodes, criterion) {
            if (criterion === true)
                return nodes;
            var matching = nodes.filter(function (node) { return matchState(node.state, criterion); });
            return matching.length ? matching : null;
        };
        /**
         * Gets the default match criteria (all `true`)
         *
         * Returns an object which has all the criteria match paths as keys and `true` as values, i.e.:
         *
         * ```js
         * {
         *   to: true,
         *   from: true,
         *   entering: true,
         *   exiting: true,
         *   retained: true,
         * }
         */
        RegisteredHook.prototype._getDefaultMatchCriteria = function () {
            return mapObj(this.tranSvc._pluginapi._getPathTypes(), function () { return true; });
        };
        /**
         * Gets matching nodes as [[IMatchingNodes]]
         *
         * Create a IMatchingNodes object from the TransitionHookTypes that is roughly equivalent to:
         *
         * ```js
         * let matches: IMatchingNodes = {
         *   to:       _matchingNodes([tail(treeChanges.to)],   mc.to),
         *   from:     _matchingNodes([tail(treeChanges.from)], mc.from),
         *   exiting:  _matchingNodes(treeChanges.exiting,      mc.exiting),
         *   retained: _matchingNodes(treeChanges.retained,     mc.retained),
         *   entering: _matchingNodes(treeChanges.entering,     mc.entering),
         * };
         * ```
         */
        RegisteredHook.prototype._getMatchingNodes = function (treeChanges) {
            var _this = this;
            var criteria = extend(this._getDefaultMatchCriteria(), this.matchCriteria);
            var paths = values(this.tranSvc._pluginapi._getPathTypes());
            return paths.reduce(function (mn, pathtype) {
                // STATE scope criteria matches against every node in the path.
                // TRANSITION scope criteria matches against only the last node in the path
                var isStateHook = pathtype.scope === exports.TransitionHookScope.STATE;
                var path = treeChanges[pathtype.name] || [];
                var nodes = isStateHook ? path : [tail(path)];
                mn[pathtype.name] = _this._matchingNodes(nodes, criteria[pathtype.name]);
                return mn;
            }, {});
        };
        /**
         * Determines if this hook's [[matchCriteria]] match the given [[TreeChanges]]
         *
         * @returns an IMatchingNodes object, or null. If an IMatchingNodes object is returned, its values
         * are the matching [[PathNode]]s for each [[HookMatchCriterion]] (to, from, exiting, retained, entering)
         */
        RegisteredHook.prototype.matches = function (treeChanges) {
            var matches = this._getMatchingNodes(treeChanges);
            // Check if all the criteria matched the TreeChanges object
            var allMatched = values(matches).every(identity);
            return allMatched ? matches : null;
        };
        RegisteredHook.prototype.deregister = function () {
            this.removeHookFromRegistry(this);
            this._deregistered = true;
        };
        return RegisteredHook;
    }());
    /** @hidden Return a registration function of the requested type. */
    function makeEvent(registry, transitionService, eventType) {
        // Create the object which holds the registered transition hooks.
        var _registeredHooks = (registry._registeredHooks = registry._registeredHooks || {});
        var hooks = (_registeredHooks[eventType.name] = []);
        var removeHookFn = removeFrom(hooks);
        // Create hook registration function on the IHookRegistry for the event
        registry[eventType.name] = hookRegistrationFn;
        function hookRegistrationFn(matchObject, callback, options) {
            if (options === void 0) { options = {}; }
            var registeredHook = new RegisteredHook(transitionService, eventType, callback, matchObject, removeHookFn, options);
            hooks.push(registeredHook);
            return registeredHook.deregister.bind(registeredHook);
        }
        return hookRegistrationFn;
    }

    /**
     * @coreapi
     * @module transition
     */ /** for typedoc */
    /**
     * This class returns applicable TransitionHooks for a specific Transition instance.
     *
     * Hooks ([[RegisteredHook]]) may be registered globally, e.g., $transitions.onEnter(...), or locally, e.g.
     * myTransition.onEnter(...).  The HookBuilder finds matching RegisteredHooks (where the match criteria is
     * determined by the type of hook)
     *
     * The HookBuilder also converts RegisteredHooks objects to TransitionHook objects, which are used to run a Transition.
     *
     * The HookBuilder constructor is given the $transitions service and a Transition instance.  Thus, a HookBuilder
     * instance may only be used for one specific Transition object. (side note: the _treeChanges accessor is private
     * in the Transition class, so we must also provide the Transition's _treeChanges)
     *
     */
    var HookBuilder = /** @class */ (function () {
        function HookBuilder(transition) {
            this.transition = transition;
        }
        HookBuilder.prototype.buildHooksForPhase = function (phase) {
            var _this = this;
            var $transitions = this.transition.router.transitionService;
            return $transitions._pluginapi
                ._getEvents(phase)
                .map(function (type) { return _this.buildHooks(type); })
                .reduce(unnestR, [])
                .filter(identity);
        };
        /**
         * Returns an array of newly built TransitionHook objects.
         *
         * - Finds all RegisteredHooks registered for the given `hookType` which matched the transition's [[TreeChanges]].
         * - Finds [[PathNode]] (or `PathNode[]`) to use as the TransitionHook context(s)
         * - For each of the [[PathNode]]s, creates a TransitionHook
         *
         * @param hookType the type of the hook registration function, e.g., 'onEnter', 'onFinish'.
         */
        HookBuilder.prototype.buildHooks = function (hookType) {
            var transition = this.transition;
            var treeChanges = transition.treeChanges();
            // Find all the matching registered hooks for a given hook type
            var matchingHooks = this.getMatchingHooks(hookType, treeChanges);
            if (!matchingHooks)
                return [];
            var baseHookOptions = {
                transition: transition,
                current: transition.options().current,
            };
            var makeTransitionHooks = function (hook) {
                // Fetch the Nodes that caused this hook to match.
                var matches = hook.matches(treeChanges);
                // Select the PathNode[] that will be used as TransitionHook context objects
                var matchingNodes = matches[hookType.criteriaMatchPath.name];
                // Return an array of HookTuples
                return matchingNodes.map(function (node) {
                    var _options = extend({
                        bind: hook.bind,
                        traceData: { hookType: hookType.name, context: node },
                    }, baseHookOptions);
                    var state = hookType.criteriaMatchPath.scope === exports.TransitionHookScope.STATE ? node.state.self : null;
                    var transitionHook = new TransitionHook(transition, state, hook, _options);
                    return { hook: hook, node: node, transitionHook: transitionHook };
                });
            };
            return matchingHooks
                .map(makeTransitionHooks)
                .reduce(unnestR, [])
                .sort(tupleSort(hookType.reverseSort))
                .map(function (tuple) { return tuple.transitionHook; });
        };
        /**
         * Finds all RegisteredHooks from:
         * - The Transition object instance hook registry
         * - The TransitionService ($transitions) global hook registry
         *
         * which matched:
         * - the eventType
         * - the matchCriteria (to, from, exiting, retained, entering)
         *
         * @returns an array of matched [[RegisteredHook]]s
         */
        HookBuilder.prototype.getMatchingHooks = function (hookType, treeChanges) {
            var isCreate = hookType.hookPhase === exports.TransitionHookPhase.CREATE;
            // Instance and Global hook registries
            var $transitions = this.transition.router.transitionService;
            var registries = isCreate ? [$transitions] : [this.transition, $transitions];
            return registries
                .map(function (reg) { return reg.getHooks(hookType.name); }) // Get named hooks from registries
                .filter(assertPredicate(isArray, "broken event named: " + hookType.name)) // Sanity check
                .reduce(unnestR, []) // Un-nest RegisteredHook[][] to RegisteredHook[] array
                .filter(function (hook) { return hook.matches(treeChanges); }); // Only those satisfying matchCriteria
        };
        return HookBuilder;
    }());
    /**
     * A factory for a sort function for HookTuples.
     *
     * The sort function first compares the PathNode depth (how deep in the state tree a node is), then compares
     * the EventHook priority.
     *
     * @param reverseDepthSort a boolean, when true, reverses the sort order for the node depth
     * @returns a tuple sort function
     */
    function tupleSort(reverseDepthSort) {
        if (reverseDepthSort === void 0) { reverseDepthSort = false; }
        return function nodeDepthThenPriority(l, r) {
            var factor = reverseDepthSort ? -1 : 1;
            var depthDelta = (l.node.state.path.length - r.node.state.path.length) * factor;
            return depthDelta !== 0 ? depthDelta : r.hook.priority - l.hook.priority;
        };
    }

    /**
     * @coreapi
     * @module transition
     */
    /** @hidden */
    var stateSelf = prop('self');
    /**
     * Represents a transition between two states.
     *
     * When navigating to a state, we are transitioning **from** the current state **to** the new state.
     *
     * This object contains all contextual information about the to/from states, parameters, resolves.
     * It has information about all states being entered and exited as a result of the transition.
     */
    var Transition = /** @class */ (function () {
        /**
         * Creates a new Transition object.
         *
         * If the target state is not valid, an error is thrown.
         *
         * @internalapi
         *
         * @param fromPath The path of [[PathNode]]s from which the transition is leaving.  The last node in the `fromPath`
         *        encapsulates the "from state".
         * @param targetState The target state and parameters being transitioned to (also, the transition options)
         * @param router The [[UIRouter]] instance
         */
        function Transition(fromPath, targetState, router) {
            var _this = this;
            /** @hidden */
            this._deferred = services.$q.defer();
            /**
             * This promise is resolved or rejected based on the outcome of the Transition.
             *
             * When the transition is successful, the promise is resolved
             * When the transition is unsuccessful, the promise is rejected with the [[Rejection]] or javascript error
             */
            this.promise = this._deferred.promise;
            /** @hidden Holds the hook registration functions such as those passed to Transition.onStart() */
            this._registeredHooks = {};
            /** @hidden */
            this._hookBuilder = new HookBuilder(this);
            /** Checks if this transition is currently active/running. */
            this.isActive = function () { return _this.router.globals.transition === _this; };
            this.router = router;
            this._targetState = targetState;
            if (!targetState.valid()) {
                throw new Error(targetState.error());
            }
            // current() is assumed to come from targetState.options, but provide a naive implementation otherwise.
            this._options = extend({ current: val(this) }, targetState.options());
            this.$id = router.transitionService._transitionCount++;
            var toPath = PathUtils.buildToPath(fromPath, targetState);
            this._treeChanges = PathUtils.treeChanges(fromPath, toPath, this._options.reloadState);
            this.createTransitionHookRegFns();
            var onCreateHooks = this._hookBuilder.buildHooksForPhase(exports.TransitionHookPhase.CREATE);
            TransitionHook.invokeHooks(onCreateHooks, function () { return null; });
            this.applyViewConfigs(router);
        }
        /** @hidden */
        Transition.prototype.onBefore = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onStart = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onExit = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onRetain = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onEnter = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onFinish = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onSuccess = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        Transition.prototype.onError = function (criteria, callback, options) {
            return;
        };
        /** @hidden
         * Creates the transition-level hook registration functions
         * (which can then be used to register hooks)
         */
        Transition.prototype.createTransitionHookRegFns = function () {
            var _this = this;
            this.router.transitionService._pluginapi
                ._getEvents()
                .filter(function (type) { return type.hookPhase !== exports.TransitionHookPhase.CREATE; })
                .forEach(function (type) { return makeEvent(_this, _this.router.transitionService, type); });
        };
        /** @internalapi */
        Transition.prototype.getHooks = function (hookName) {
            return this._registeredHooks[hookName];
        };
        Transition.prototype.applyViewConfigs = function (router) {
            var enteringStates = this._treeChanges.entering.map(function (node) { return node.state; });
            PathUtils.applyViewConfigs(router.transitionService.$view, this._treeChanges.to, enteringStates);
        };
        /**
         * @internalapi
         *
         * @returns the internal from [State] object
         */
        Transition.prototype.$from = function () {
            return tail(this._treeChanges.from).state;
        };
        /**
         * @internalapi
         *
         * @returns the internal to [State] object
         */
        Transition.prototype.$to = function () {
            return tail(this._treeChanges.to).state;
        };
        /**
         * Returns the "from state"
         *
         * Returns the state that the transition is coming *from*.
         *
         * @returns The state declaration object for the Transition's ("from state").
         */
        Transition.prototype.from = function () {
            return this.$from().self;
        };
        /**
         * Returns the "to state"
         *
         * Returns the state that the transition is going *to*.
         *
         * @returns The state declaration object for the Transition's target state ("to state").
         */
        Transition.prototype.to = function () {
            return this.$to().self;
        };
        /**
         * Gets the Target State
         *
         * A transition's [[TargetState]] encapsulates the [[to]] state, the [[params]], and the [[options]] as a single object.
         *
         * @returns the [[TargetState]] of this Transition
         */
        Transition.prototype.targetState = function () {
            return this._targetState;
        };
        /**
         * Determines whether two transitions are equivalent.
         * @deprecated
         */
        Transition.prototype.is = function (compare) {
            if (compare instanceof Transition) {
                // TODO: Also compare parameters
                return this.is({ to: compare.$to().name, from: compare.$from().name });
            }
            return !((compare.to && !matchState(this.$to(), compare.to)) ||
                (compare.from && !matchState(this.$from(), compare.from)));
        };
        Transition.prototype.params = function (pathname) {
            if (pathname === void 0) { pathname = 'to'; }
            return Object.freeze(this._treeChanges[pathname].map(prop('paramValues')).reduce(mergeR, {}));
        };
        Transition.prototype.paramsChanged = function () {
            var fromParams = this.params('from');
            var toParams = this.params('to');
            // All the parameters declared on both the "to" and "from" paths
            var allParamDescriptors = []
                .concat(this._treeChanges.to)
                .concat(this._treeChanges.from)
                .map(function (pathNode) { return pathNode.paramSchema; })
                .reduce(flattenR, [])
                .reduce(uniqR, []);
            var changedParamDescriptors = Param.changed(allParamDescriptors, fromParams, toParams);
            return changedParamDescriptors.reduce(function (changedValues, descriptor) {
                changedValues[descriptor.id] = toParams[descriptor.id];
                return changedValues;
            }, {});
        };
        /**
         * Creates a [[UIInjector]] Dependency Injector
         *
         * Returns a Dependency Injector for the Transition's target state (to state).
         * The injector provides resolve values which the target state has access to.
         *
         * The `UIInjector` can also provide values from the native root/global injector (ng1/ng2).
         *
         * #### Example:
         * ```js
         * .onEnter({ entering: 'myState' }, trans => {
         *   var myResolveValue = trans.injector().get('myResolve');
         *   // Inject a global service from the global/native injector (if it exists)
         *   var MyService = trans.injector().get('MyService');
         * })
         * ```
         *
         * In some cases (such as `onBefore`), you may need access to some resolve data but it has not yet been fetched.
         * You can use [[UIInjector.getAsync]] to get a promise for the data.
         * #### Example:
         * ```js
         * .onBefore({}, trans => {
         *   return trans.injector().getAsync('myResolve').then(myResolveValue =>
         *     return myResolveValue !== 'ABORT';
         *   });
         * });
         * ```
         *
         * If a `state` is provided, the injector that is returned will be limited to resolve values that the provided state has access to.
         * This can be useful if both a parent state `foo` and a child state `foo.bar` have both defined a resolve such as `data`.
         * #### Example:
         * ```js
         * .onEnter({ to: 'foo.bar' }, trans => {
         *   // returns result of `foo` state's `myResolve` resolve
         *   // even though `foo.bar` also has a `myResolve` resolve
         *   var fooData = trans.injector('foo').get('myResolve');
         * });
         * ```
         *
         * If you need resolve data from the exiting states, pass `'from'` as `pathName`.
         * The resolve data from the `from` path will be returned.
         * #### Example:
         * ```js
         * .onExit({ exiting: 'foo.bar' }, trans => {
         *   // Gets the resolve value of `myResolve` from the state being exited
         *   var fooData = trans.injector(null, 'from').get('myResolve');
         * });
         * ```
         *
         *
         * @param state Limits the resolves provided to only the resolves the provided state has access to.
         * @param pathName Default: `'to'`: Chooses the path for which to create the injector. Use this to access resolves for `exiting` states.
         *
         * @returns a [[UIInjector]]
         */
        Transition.prototype.injector = function (state, pathName) {
            if (pathName === void 0) { pathName = 'to'; }
            var path = this._treeChanges[pathName];
            if (state)
                path = PathUtils.subPath(path, function (node) { return node.state === state || node.state.name === state; });
            return new ResolveContext(path).injector();
        };
        /**
         * Gets all available resolve tokens (keys)
         *
         * This method can be used in conjunction with [[injector]] to inspect the resolve values
         * available to the Transition.
         *
         * This returns all the tokens defined on [[StateDeclaration.resolve]] blocks, for the states
         * in the Transition's [[TreeChanges.to]] path.
         *
         * #### Example:
         * This example logs all resolve values
         * ```js
         * let tokens = trans.getResolveTokens();
         * tokens.forEach(token => console.log(token + " = " + trans.injector().get(token)));
         * ```
         *
         * #### Example:
         * This example creates promises for each resolve value.
         * This triggers fetches of resolves (if any have not yet been fetched).
         * When all promises have all settled, it logs the resolve values.
         * ```js
         * let tokens = trans.getResolveTokens();
         * let promise = tokens.map(token => trans.injector().getAsync(token));
         * Promise.all(promises).then(values => console.log("Resolved values: " + values));
         * ```
         *
         * Note: Angular 1 users whould use `$q.all()`
         *
         * @param pathname resolve context's path name (e.g., `to` or `from`)
         *
         * @returns an array of resolve tokens (keys)
         */
        Transition.prototype.getResolveTokens = function (pathname) {
            if (pathname === void 0) { pathname = 'to'; }
            return new ResolveContext(this._treeChanges[pathname]).getTokens();
        };
        /**
         * Dynamically adds a new [[Resolvable]] (i.e., [[StateDeclaration.resolve]]) to this transition.
         *
         * Allows a transition hook to dynamically add a Resolvable to this Transition.
         *
         * Use the [[Transition.injector]] to retrieve the resolved data in subsequent hooks ([[UIInjector.get]]).
         *
         * If a `state` argument is provided, the Resolvable is processed when that state is being entered.
         * If no `state` is provided then the root state is used.
         * If the given `state` has already been entered, the Resolvable is processed when any child state is entered.
         * If no child states will be entered, the Resolvable is processed during the `onFinish` phase of the Transition.
         *
         * The `state` argument also scopes the resolved data.
         * The resolved data is available from the injector for that `state` and any children states.
         *
         * #### Example:
         * ```js
         * transitionService.onBefore({}, transition => {
         *   transition.addResolvable({
         *     token: 'myResolve',
         *     deps: ['MyService'],
         *     resolveFn: myService => myService.getData()
         *   });
         * });
         * ```
         *
         * @param resolvable a [[ResolvableLiteral]] object (or a [[Resolvable]])
         * @param state the state in the "to path" which should receive the new resolve (otherwise, the root state)
         */
        Transition.prototype.addResolvable = function (resolvable, state) {
            if (state === void 0) { state = ''; }
            resolvable = is(Resolvable)(resolvable) ? resolvable : new Resolvable(resolvable);
            var stateName = typeof state === 'string' ? state : state.name;
            var topath = this._treeChanges.to;
            var targetNode = find(topath, function (node) { return node.state.name === stateName; });
            var resolveContext = new ResolveContext(topath);
            resolveContext.addResolvables([resolvable], targetNode.state);
        };
        /**
         * Gets the transition from which this transition was redirected.
         *
         * If the current transition is a redirect, this method returns the transition that was redirected.
         *
         * #### Example:
         * ```js
         * let transitionA = $state.go('A').transition
         * transitionA.onStart({}, () => $state.target('B'));
         * $transitions.onSuccess({ to: 'B' }, (trans) => {
         *   trans.to().name === 'B'; // true
         *   trans.redirectedFrom() === transitionA; // true
         * });
         * ```
         *
         * @returns The previous Transition, or null if this Transition is not the result of a redirection
         */
        Transition.prototype.redirectedFrom = function () {
            return this._options.redirectedFrom || null;
        };
        /**
         * Gets the original transition in a redirect chain
         *
         * A transition might belong to a long chain of multiple redirects.
         * This method walks the [[redirectedFrom]] chain back to the original (first) transition in the chain.
         *
         * #### Example:
         * ```js
         * // states
         * registry.register({ name: 'A', redirectTo: 'B' });
         * registry.register({ name: 'B', redirectTo: 'C' });
         * registry.register({ name: 'C', redirectTo: 'D' });
         * registry.register({ name: 'D' });
         *
         * let transitionA = $state.go('A').transition
         *
         * $transitions.onSuccess({ to: 'D' }, (trans) => {
         *   trans.to().name === 'D'; // true
         *   trans.redirectedFrom().to().name === 'C'; // true
         *   trans.originalTransition() === transitionA; // true
         *   trans.originalTransition().to().name === 'A'; // true
         * });
         * ```
         *
         * @returns The original Transition that started a redirect chain
         */
        Transition.prototype.originalTransition = function () {
            var rf = this.redirectedFrom();
            return (rf && rf.originalTransition()) || this;
        };
        /**
         * Get the transition options
         *
         * @returns the options for this Transition.
         */
        Transition.prototype.options = function () {
            return this._options;
        };
        /**
         * Gets the states being entered.
         *
         * @returns an array of states that will be entered during this transition.
         */
        Transition.prototype.entering = function () {
            return map(this._treeChanges.entering, prop('state')).map(stateSelf);
        };
        /**
         * Gets the states being exited.
         *
         * @returns an array of states that will be exited during this transition.
         */
        Transition.prototype.exiting = function () {
            return map(this._treeChanges.exiting, prop('state'))
                .map(stateSelf)
                .reverse();
        };
        /**
         * Gets the states being retained.
         *
         * @returns an array of states that are already entered from a previous Transition, that will not be
         *    exited during this Transition
         */
        Transition.prototype.retained = function () {
            return map(this._treeChanges.retained, prop('state')).map(stateSelf);
        };
        /**
         * Get the [[ViewConfig]]s associated with this Transition
         *
         * Each state can define one or more views (template/controller), which are encapsulated as `ViewConfig` objects.
         * This method fetches the `ViewConfigs` for a given path in the Transition (e.g., "to" or "entering").
         *
         * @param pathname the name of the path to fetch views for:
         *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
         * @param state If provided, only returns the `ViewConfig`s for a single state in the path
         *
         * @returns a list of ViewConfig objects for the given path.
         */
        Transition.prototype.views = function (pathname, state) {
            if (pathname === void 0) { pathname = 'entering'; }
            var path = this._treeChanges[pathname];
            path = !state ? path : path.filter(propEq('state', state));
            return path
                .map(prop('views'))
                .filter(identity)
                .reduce(unnestR, []);
        };
        Transition.prototype.treeChanges = function (pathname) {
            return pathname ? this._treeChanges[pathname] : this._treeChanges;
        };
        /**
         * Creates a new transition that is a redirection of the current one.
         *
         * This transition can be returned from a [[TransitionService]] hook to
         * redirect a transition to a new state and/or set of parameters.
         *
         * @internalapi
         *
         * @returns Returns a new [[Transition]] instance.
         */
        Transition.prototype.redirect = function (targetState) {
            var redirects = 1, trans = this;
            // tslint:disable-next-line:no-conditional-assignment
            while ((trans = trans.redirectedFrom()) != null) {
                if (++redirects > 20)
                    throw new Error("Too many consecutive Transition redirects (20+)");
            }
            var redirectOpts = { redirectedFrom: this, source: 'redirect' };
            // If the original transition was caused by URL sync, then use { location: 'replace' }
            // on the new transition (unless the target state explicitly specifies location: false).
            // This causes the original url to be replaced with the url for the redirect target
            // so the original url disappears from the browser history.
            if (this.options().source === 'url' && targetState.options().location !== false) {
                redirectOpts.location = 'replace';
            }
            var newOptions = extend({}, this.options(), targetState.options(), redirectOpts);
            targetState = targetState.withOptions(newOptions, true);
            var newTransition = this.router.transitionService.create(this._treeChanges.from, targetState);
            var originalEnteringNodes = this._treeChanges.entering;
            var redirectEnteringNodes = newTransition._treeChanges.entering;
            // --- Re-use resolve data from original transition ---
            // When redirecting from a parent state to a child state where the parent parameter values haven't changed
            // (because of the redirect), the resolves fetched by the original transition are still valid in the
            // redirected transition.
            //
            // This allows you to define a redirect on a parent state which depends on an async resolve value.
            // You can wait for the resolve, then redirect to a child state based on the result.
            // The redirected transition does not have to re-fetch the resolve.
            // ---------------------------------------------------------
            var nodeIsReloading = function (reloadState) { return function (node) {
                return reloadState && node.state.includes[reloadState.name];
            }; };
            // Find any "entering" nodes in the redirect path that match the original path and aren't being reloaded
            var matchingEnteringNodes = PathUtils.matching(redirectEnteringNodes, originalEnteringNodes, PathUtils.nonDynamicParams).filter(not(nodeIsReloading(targetState.options().reloadState)));
            // Use the existing (possibly pre-resolved) resolvables for the matching entering nodes.
            matchingEnteringNodes.forEach(function (node, idx) {
                node.resolvables = originalEnteringNodes[idx].resolvables;
            });
            return newTransition;
        };
        /** @hidden If a transition doesn't exit/enter any states, returns any [[Param]] whose value changed */
        Transition.prototype._changedParams = function () {
            var tc = this._treeChanges;
            /** Return undefined if it's not a "dynamic" transition, for the following reasons */
            // If user explicitly wants a reload
            if (this._options.reload)
                return undefined;
            // If any states are exiting or entering
            if (tc.exiting.length || tc.entering.length)
                return undefined;
            // If to/from path lengths differ
            if (tc.to.length !== tc.from.length)
                return undefined;
            // If the to/from paths are different
            var pathsDiffer = arrayTuples(tc.to, tc.from)
                .map(function (tuple) { return tuple[0].state !== tuple[1].state; })
                .reduce(anyTrueR, false);
            if (pathsDiffer)
                return undefined;
            // Find any parameter values that differ
            var nodeSchemas = tc.to.map(function (node) { return node.paramSchema; });
            var _a = [tc.to, tc.from].map(function (path) { return path.map(function (x) { return x.paramValues; }); }), toValues = _a[0], fromValues = _a[1];
            var tuples = arrayTuples(nodeSchemas, toValues, fromValues);
            return tuples.map(function (_a) {
                var schema = _a[0], toVals = _a[1], fromVals = _a[2];
                return Param.changed(schema, toVals, fromVals);
            }).reduce(unnestR, []);
        };
        /**
         * Returns true if the transition is dynamic.
         *
         * A transition is dynamic if no states are entered nor exited, but at least one dynamic parameter has changed.
         *
         * @returns true if the Transition is dynamic
         */
        Transition.prototype.dynamic = function () {
            var changes = this._changedParams();
            return !changes ? false : changes.map(function (x) { return x.dynamic; }).reduce(anyTrueR, false);
        };
        /**
         * Returns true if the transition is ignored.
         *
         * A transition is ignored if no states are entered nor exited, and no parameter values have changed.
         *
         * @returns true if the Transition is ignored.
         */
        Transition.prototype.ignored = function () {
            return !!this._ignoredReason();
        };
        /** @hidden */
        Transition.prototype._ignoredReason = function () {
            var pending = this.router.globals.transition;
            var reloadState = this._options.reloadState;
            var same = function (pathA, pathB) {
                if (pathA.length !== pathB.length)
                    return false;
                var matching = PathUtils.matching(pathA, pathB);
                return pathA.length === matching.filter(function (node) { return !reloadState || !node.state.includes[reloadState.name]; }).length;
            };
            var newTC = this.treeChanges();
            var pendTC = pending && pending.treeChanges();
            if (pendTC && same(pendTC.to, newTC.to) && same(pendTC.exiting, newTC.exiting))
                return 'SameAsPending';
            if (newTC.exiting.length === 0 && newTC.entering.length === 0 && same(newTC.from, newTC.to))
                return 'SameAsCurrent';
        };
        /**
         * Runs the transition
         *
         * This method is generally called from the [[StateService.transitionTo]]
         *
         * @internalapi
         *
         * @returns a promise for a successful transition.
         */
        Transition.prototype.run = function () {
            var _this = this;
            var runAllHooks = TransitionHook.runAllHooks;
            // Gets transition hooks array for the given phase
            var getHooksFor = function (phase) { return _this._hookBuilder.buildHooksForPhase(phase); };
            // When the chain is complete, then resolve or reject the deferred
            var transitionSuccess = function () {
                trace.traceSuccess(_this.$to(), _this);
                _this.success = true;
                _this._deferred.resolve(_this.to());
                runAllHooks(getHooksFor(exports.TransitionHookPhase.SUCCESS));
            };
            var transitionError = function (reason) {
                trace.traceError(reason, _this);
                _this.success = false;
                _this._deferred.reject(reason);
                _this._error = reason;
                runAllHooks(getHooksFor(exports.TransitionHookPhase.ERROR));
            };
            var runTransition = function () {
                // Wait to build the RUN hook chain until the BEFORE hooks are done
                // This allows a BEFORE hook to dynamically add additional RUN hooks via the Transition object.
                var allRunHooks = getHooksFor(exports.TransitionHookPhase.RUN);
                var done = function () { return services.$q.when(undefined); };
                return TransitionHook.invokeHooks(allRunHooks, done);
            };
            var startTransition = function () {
                var globals = _this.router.globals;
                globals.lastStartedTransitionId = _this.$id;
                globals.transition = _this;
                globals.transitionHistory.enqueue(_this);
                trace.traceTransitionStart(_this);
                return services.$q.when(undefined);
            };
            var allBeforeHooks = getHooksFor(exports.TransitionHookPhase.BEFORE);
            TransitionHook.invokeHooks(allBeforeHooks, startTransition)
                .then(runTransition)
                .then(transitionSuccess, transitionError);
            return this.promise;
        };
        /**
         * Checks if the Transition is valid
         *
         * @returns true if the Transition is valid
         */
        Transition.prototype.valid = function () {
            return !this.error() || this.success !== undefined;
        };
        /**
         * Aborts this transition
         *
         * Imperative API to abort a Transition.
         * This only applies to Transitions that are not yet complete.
         */
        Transition.prototype.abort = function () {
            // Do not set flag if the transition is already complete
            if (isUndefined(this.success)) {
                this._aborted = true;
            }
        };
        /**
         * The Transition error reason.
         *
         * If the transition is invalid (and could not be run), returns the reason the transition is invalid.
         * If the transition was valid and ran, but was not successful, returns the reason the transition failed.
         *
         * @returns a transition rejection explaining why the transition is invalid, or the reason the transition failed.
         */
        Transition.prototype.error = function () {
            var state = this.$to();
            if (state.self.abstract) {
                return Rejection.invalid("Cannot transition to abstract state '" + state.name + "'");
            }
            var paramDefs = state.parameters();
            var values$$1 = this.params();
            var invalidParams = paramDefs.filter(function (param) { return !param.validates(values$$1[param.id]); });
            if (invalidParams.length) {
                var invalidValues = invalidParams.map(function (param) { return "[" + param.id + ":" + stringify(values$$1[param.id]) + "]"; }).join(', ');
                var detail = "The following parameter values are not valid for state '" + state.name + "': " + invalidValues;
                return Rejection.invalid(detail);
            }
            if (this.success === false)
                return this._error;
        };
        /**
         * A string representation of the Transition
         *
         * @returns A string representation of the Transition
         */
        Transition.prototype.toString = function () {
            var fromStateOrName = this.from();
            var toStateOrName = this.to();
            var avoidEmptyHash = function (params) {
                return params['#'] !== null && params['#'] !== undefined ? params : omit(params, ['#']);
            };
            // (X) means the to state is invalid.
            var id = this.$id, from = isObject(fromStateOrName) ? fromStateOrName.name : fromStateOrName, fromParams = stringify(avoidEmptyHash(this._treeChanges.from.map(prop('paramValues')).reduce(mergeR, {}))), toValid = this.valid() ? '' : '(X) ', to = isObject(toStateOrName) ? toStateOrName.name : toStateOrName, toParams = stringify(avoidEmptyHash(this.params()));
            return "Transition#" + id + "( '" + from + "'" + fromParams + " -> " + toValid + "'" + to + "'" + toParams + " )";
        };
        /** @hidden */
        Transition.diToken = Transition;
        return Transition;
    }());

    /**
     * @coreapi
     * @module url
     */
    /** @hidden */
    function quoteRegExp(str, param) {
        var surroundPattern = ['', ''], result = str.replace(/[\\\[\]\^$*+?.()|{}]/g, '\\$&');
        if (!param)
            return result;
        switch (param.squash) {
            case false:
                surroundPattern = ['(', ')' + (param.isOptional ? '?' : '')];
                break;
            case true:
                result = result.replace(/\/$/, '');
                surroundPattern = ['(?:/(', ')|/)?'];
                break;
            default:
                surroundPattern = ["(" + param.squash + "|", ')?'];
                break;
        }
        return result + surroundPattern[0] + param.type.pattern.source + surroundPattern[1];
    }
    /** @hidden */
    var memoizeTo = function (obj, _prop, fn) { return (obj[_prop] = obj[_prop] || fn()); };
    /** @hidden */
    var splitOnSlash = splitOnDelim('/');
    var defaultConfig = {
        state: { params: {} },
        strict: true,
        caseInsensitive: true,
    };
    /**
     * Matches URLs against patterns.
     *
     * Matches URLs against patterns and extracts named parameters from the path or the search
     * part of the URL.
     *
     * A URL pattern consists of a path pattern, optionally followed by '?' and a list of search (query)
     * parameters. Multiple search parameter names are separated by '&'. Search parameters
     * do not influence whether or not a URL is matched, but their values are passed through into
     * the matched parameters returned by [[UrlMatcher.exec]].
     *
     * - *Path parameters* are defined using curly brace placeholders (`/somepath/{param}`)
     * or colon placeholders (`/somePath/:param`).
     *
     * - *A parameter RegExp* may be defined for a param after a colon
     * (`/somePath/{param:[a-zA-Z0-9]+}`) in a curly brace placeholder.
     * The regexp must match for the url to be matched.
     * Should the regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
     *
     * Note: a RegExp parameter will encode its value using either [[ParamTypes.path]] or [[ParamTypes.query]].
     *
     * - *Custom parameter types* may also be specified after a colon (`/somePath/{param:int}`) in curly brace parameters.
     *   See [[UrlMatcherFactory.type]] for more information.
     *
     * - *Catch-all parameters* are defined using an asterisk placeholder (`/somepath/*catchallparam`).
     *   A catch-all * parameter value will contain the remainder of the URL.
     *
     * ---
     *
     * Parameter names may contain only word characters (latin letters, digits, and underscore) and
     * must be unique within the pattern (across both path and search parameters).
     * A path parameter matches any number of characters other than '/'. For catch-all
     * placeholders the path parameter matches any number of characters.
     *
     * Examples:
     *
     * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
     *   trailing slashes, and patterns have to match the entire path, not just a prefix.
     * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
     *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
     * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
     * * `'/user/{id:[^/]*}'` - Same as the previous example.
     * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
     *   parameter consists of 1 to 8 hex digits.
     * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
     *   path into the parameter 'path'.
     * * `'/files/*path'` - ditto.
     * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
     *   in the built-in  `date` ParamType matches `2014-11-12`) and provides a Date object in $stateParams.start
     *
     */
    var UrlMatcher = /** @class */ (function () {
        /**
         * @param pattern The pattern to compile into a matcher.
         * @param paramTypes The [[ParamTypes]] registry
         * @param paramFactory A [[ParamFactory]] object
         * @param config  A [[UrlMatcherCompileConfig]] configuration object
         */
        function UrlMatcher(pattern$$1, paramTypes, paramFactory, config) {
            var _this = this;
            /** @hidden */
            this._cache = { path: [this] };
            /** @hidden */
            this._children = [];
            /** @hidden */
            this._params = [];
            /** @hidden */
            this._segments = [];
            /** @hidden */
            this._compiled = [];
            this.config = config = defaults(config, defaultConfig);
            this.pattern = pattern$$1;
            // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
            //   '*' name
            //   ':' name
            //   '{' name '}'
            //   '{' name ':' regexp '}'
            // The regular expression is somewhat complicated due to the need to allow curly braces
            // inside the regular expression. The placeholder regexp breaks down as follows:
            //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
            //    \{([\w\[\]]+)(?:\:\s*( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
            //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
            //    [^{}\\]+                       - anything other than curly braces or backslash
            //    \\.                            - a backslash escape
            //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
            var placeholder = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g;
            var searchPlaceholder = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g;
            var patterns = [];
            var last = 0;
            var matchArray;
            var checkParamErrors = function (id) {
                if (!UrlMatcher.nameValidator.test(id))
                    throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern$$1 + "'");
                if (find(_this._params, propEq('id', id)))
                    throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern$$1 + "'");
            };
            // Split into static segments separated by path parameter placeholders.
            // The number of segments is always 1 more than the number of parameters.
            var matchDetails = function (m, isSearch) {
                // IE[78] returns '' for unmatched groups instead of null
                var id = m[2] || m[3];
                var regexp = isSearch ? m[4] : m[4] || (m[1] === '*' ? '[\\s\\S]*' : null);
                var makeRegexpType = function (str) {
                    return inherit(paramTypes.type(isSearch ? 'query' : 'path'), {
                        pattern: new RegExp(str, _this.config.caseInsensitive ? 'i' : undefined),
                    });
                };
                return {
                    id: id,
                    regexp: regexp,
                    segment: pattern$$1.substring(last, m.index),
                    type: !regexp ? null : paramTypes.type(regexp) || makeRegexpType(regexp),
                };
            };
            var details;
            var segment;
            // tslint:disable-next-line:no-conditional-assignment
            while ((matchArray = placeholder.exec(pattern$$1))) {
                details = matchDetails(matchArray, false);
                if (details.segment.indexOf('?') >= 0)
                    break; // we're into the search part
                checkParamErrors(details.id);
                this._params.push(paramFactory.fromPath(details.id, details.type, config.state));
                this._segments.push(details.segment);
                patterns.push([details.segment, tail(this._params)]);
                last = placeholder.lastIndex;
            }
            segment = pattern$$1.substring(last);
            // Find any search parameter names and remove them from the last segment
            var i = segment.indexOf('?');
            if (i >= 0) {
                var search = segment.substring(i);
                segment = segment.substring(0, i);
                if (search.length > 0) {
                    last = 0;
                    // tslint:disable-next-line:no-conditional-assignment
                    while ((matchArray = searchPlaceholder.exec(search))) {
                        details = matchDetails(matchArray, true);
                        checkParamErrors(details.id);
                        this._params.push(paramFactory.fromSearch(details.id, details.type, config.state));
                        last = placeholder.lastIndex;
                        // check if ?&
                    }
                }
            }
            this._segments.push(segment);
            this._compiled = patterns.map(function (_pattern) { return quoteRegExp.apply(null, _pattern); }).concat(quoteRegExp(segment));
        }
        /** @hidden */
        UrlMatcher.encodeDashes = function (str) {
            // Replace dashes with encoded "\-"
            return encodeURIComponent(str).replace(/-/g, function (c) {
                return "%5C%" + c
                    .charCodeAt(0)
                    .toString(16)
                    .toUpperCase();
            });
        };
        /** @hidden Given a matcher, return an array with the matcher's path segments and path params, in order */
        UrlMatcher.pathSegmentsAndParams = function (matcher) {
            var staticSegments = matcher._segments;
            var pathParams = matcher._params.filter(function (p) { return p.location === exports.DefType.PATH; });
            return arrayTuples(staticSegments, pathParams.concat(undefined))
                .reduce(unnestR, [])
                .filter(function (x) { return x !== '' && isDefined(x); });
        };
        /** @hidden Given a matcher, return an array with the matcher's query params */
        UrlMatcher.queryParams = function (matcher) {
            return matcher._params.filter(function (p) { return p.location === exports.DefType.SEARCH; });
        };
        /**
         * Compare two UrlMatchers
         *
         * This comparison function converts a UrlMatcher into static and dynamic path segments.
         * Each static path segment is a static string between a path separator (slash character).
         * Each dynamic segment is a path parameter.
         *
         * The comparison function sorts static segments before dynamic ones.
         */
        UrlMatcher.compare = function (a, b) {
            /**
             * Turn a UrlMatcher and all its parent matchers into an array
             * of slash literals '/', string literals, and Param objects
             *
             * This example matcher matches strings like "/foo/:param/tail":
             * var matcher = $umf.compile("/foo").append($umf.compile("/:param")).append($umf.compile("/")).append($umf.compile("tail"));
             * var result = segments(matcher); // [ '/', 'foo', '/', Param, '/', 'tail' ]
             *
             * Caches the result as `matcher._cache.segments`
             */
            var segments = function (matcher) {
                return (matcher._cache.segments =
                    matcher._cache.segments ||
                        matcher._cache.path
                            .map(UrlMatcher.pathSegmentsAndParams)
                            .reduce(unnestR, [])
                            .reduce(joinNeighborsR, [])
                            .map(function (x) { return (isString(x) ? splitOnSlash(x) : x); })
                            .reduce(unnestR, []));
            };
            /**
             * Gets the sort weight for each segment of a UrlMatcher
             *
             * Caches the result as `matcher._cache.weights`
             */
            var weights = function (matcher) {
                return (matcher._cache.weights =
                    matcher._cache.weights ||
                        segments(matcher).map(function (segment) {
                            // Sort slashes first, then static strings, the Params
                            if (segment === '/')
                                return 1;
                            if (isString(segment))
                                return 2;
                            if (segment instanceof Param)
                                return 3;
                        }));
            };
            /**
             * Pads shorter array in-place (mutates)
             */
            var padArrays = function (l, r, padVal) {
                var len = Math.max(l.length, r.length);
                while (l.length < len)
                    l.push(padVal);
                while (r.length < len)
                    r.push(padVal);
            };
            var weightsA = weights(a), weightsB = weights(b);
            padArrays(weightsA, weightsB, 0);
            var _pairs = arrayTuples(weightsA, weightsB);
            var cmp, i;
            for (i = 0; i < _pairs.length; i++) {
                cmp = _pairs[i][0] - _pairs[i][1];
                if (cmp !== 0)
                    return cmp;
            }
            return 0;
        };
        /**
         * Creates a new concatenated UrlMatcher
         *
         * Builds a new UrlMatcher by appending another UrlMatcher to this one.
         *
         * @param url A `UrlMatcher` instance to append as a child of the current `UrlMatcher`.
         */
        UrlMatcher.prototype.append = function (url) {
            this._children.push(url);
            url._cache = {
                path: this._cache.path.concat(url),
                parent: this,
                pattern: null,
            };
            return url;
        };
        /** @hidden */
        UrlMatcher.prototype.isRoot = function () {
            return this._cache.path[0] === this;
        };
        /** Returns the input pattern string */
        UrlMatcher.prototype.toString = function () {
            return this.pattern;
        };
        /**
         * Tests the specified url/path against this matcher.
         *
         * Tests if the given url matches this matcher's pattern, and returns an object containing the captured
         * parameter values.  Returns null if the path does not match.
         *
         * The returned object contains the values
         * of any search parameters that are mentioned in the pattern, but their value may be null if
         * they are not present in `search`. This means that search parameters are always treated
         * as optional.
         *
         * #### Example:
         * ```js
         * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
         *   x: '1', q: 'hello'
         * });
         * // returns { id: 'bob', q: 'hello', r: null }
         * ```
         *
         * @param path    The URL path to match, e.g. `$location.path()`.
         * @param search  URL search parameters, e.g. `$location.search()`.
         * @param hash    URL hash e.g. `$location.hash()`.
         * @param options
         *
         * @returns The captured parameter values.
         */
        UrlMatcher.prototype.exec = function (path, search, hash, options) {
            var _this = this;
            if (search === void 0) { search = {}; }
            if (options === void 0) { options = {}; }
            var match = memoizeTo(this._cache, 'pattern', function () {
                return new RegExp([
                    '^',
                    unnest(_this._cache.path.map(prop('_compiled'))).join(''),
                    _this.config.strict === false ? '/?' : '',
                    '$',
                ].join(''), _this.config.caseInsensitive ? 'i' : undefined);
            }).exec(path);
            if (!match)
                return null;
            // options = defaults(options, { isolate: false });
            var allParams = this.parameters(), pathParams = allParams.filter(function (param) { return !param.isSearch(); }), searchParams = allParams.filter(function (param) { return param.isSearch(); }), nPathSegments = this._cache.path.map(function (urlm) { return urlm._segments.length - 1; }).reduce(function (a, x) { return a + x; }), values$$1 = {};
            if (nPathSegments !== match.length - 1)
                throw new Error("Unbalanced capture group in route '" + this.pattern + "'");
            function decodePathArray(paramVal) {
                var reverseString = function (str) {
                    return str
                        .split('')
                        .reverse()
                        .join('');
                };
                var unquoteDashes = function (str) { return str.replace(/\\-/g, '-'); };
                var split = reverseString(paramVal).split(/-(?!\\)/);
                var allReversed = map(split, reverseString);
                return map(allReversed, unquoteDashes).reverse();
            }
            for (var i = 0; i < nPathSegments; i++) {
                var param = pathParams[i];
                var value = match[i + 1];
                // if the param value matches a pre-replace pair, replace the value before decoding.
                for (var j = 0; j < param.replace.length; j++) {
                    if (param.replace[j].from === value)
                        value = param.replace[j].to;
                }
                if (value && param.array === true)
                    value = decodePathArray(value);
                if (isDefined(value))
                    value = param.type.decode(value);
                values$$1[param.id] = param.value(value);
            }
            searchParams.forEach(function (param) {
                var value = search[param.id];
                for (var j = 0; j < param.replace.length; j++) {
                    if (param.replace[j].from === value)
                        value = param.replace[j].to;
                }
                if (isDefined(value))
                    value = param.type.decode(value);
                values$$1[param.id] = param.value(value);
            });
            if (hash)
                values$$1['#'] = hash;
            return values$$1;
        };
        /**
         * @hidden
         * Returns all the [[Param]] objects of all path and search parameters of this pattern in order of appearance.
         *
         * @returns {Array.<Param>}  An array of [[Param]] objects. Must be treated as read-only. If the
         *    pattern has no parameters, an empty array is returned.
         */
        UrlMatcher.prototype.parameters = function (opts) {
            if (opts === void 0) { opts = {}; }
            if (opts.inherit === false)
                return this._params;
            return unnest(this._cache.path.map(function (matcher) { return matcher._params; }));
        };
        /**
         * @hidden
         * Returns a single parameter from this UrlMatcher by id
         *
         * @param id
         * @param opts
         * @returns {T|Param|any|boolean|UrlMatcher|null}
         */
        UrlMatcher.prototype.parameter = function (id, opts) {
            var _this = this;
            if (opts === void 0) { opts = {}; }
            var findParam = function () {
                for (var _i = 0, _a = _this._params; _i < _a.length; _i++) {
                    var param = _a[_i];
                    if (param.id === id)
                        return param;
                }
            };
            var parent = this._cache.parent;
            return findParam() || (opts.inherit !== false && parent && parent.parameter(id, opts)) || null;
        };
        /**
         * Validates the input parameter values against this UrlMatcher
         *
         * Checks an object hash of parameters to validate their correctness according to the parameter
         * types of this `UrlMatcher`.
         *
         * @param params The object hash of parameters to validate.
         * @returns Returns `true` if `params` validates, otherwise `false`.
         */
        UrlMatcher.prototype.validates = function (params) {
            var validParamVal = function (param, val$$1) { return !param || param.validates(val$$1); };
            params = params || {};
            // I'm not sure why this checks only the param keys passed in, and not all the params known to the matcher
            var paramSchema = this.parameters().filter(function (paramDef) { return params.hasOwnProperty(paramDef.id); });
            return paramSchema.map(function (paramDef) { return validParamVal(paramDef, params[paramDef.id]); }).reduce(allTrueR, true);
        };
        /**
         * Given a set of parameter values, creates a URL from this UrlMatcher.
         *
         * Creates a URL that matches this pattern by substituting the specified values
         * for the path and search parameters.
         *
         * #### Example:
         * ```js
         * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
         * // returns '/user/bob?q=yes'
         * ```
         *
         * @param values  the values to substitute for the parameters in this pattern.
         * @returns the formatted URL (path and optionally search part).
         */
        UrlMatcher.prototype.format = function (values$$1) {
            if (values$$1 === void 0) { values$$1 = {}; }
            // Build the full path of UrlMatchers (including all parent UrlMatchers)
            var urlMatchers = this._cache.path;
            // Extract all the static segments and Params (processed as ParamDetails)
            // into an ordered array
            var pathSegmentsAndParams = urlMatchers
                .map(UrlMatcher.pathSegmentsAndParams)
                .reduce(unnestR, [])
                .map(function (x) { return (isString(x) ? x : getDetails(x)); });
            // Extract the query params into a separate array
            var queryParams = urlMatchers
                .map(UrlMatcher.queryParams)
                .reduce(unnestR, [])
                .map(getDetails);
            var isInvalid = function (param) { return param.isValid === false; };
            if (pathSegmentsAndParams.concat(queryParams).filter(isInvalid).length) {
                return null;
            }
            /**
             * Given a Param, applies the parameter value, then returns detailed information about it
             */
            function getDetails(param) {
                // Normalize to typed value
                var value = param.value(values$$1[param.id]);
                var isValid = param.validates(value);
                var isDefaultValue = param.isDefaultValue(value);
                // Check if we're in squash mode for the parameter
                var squash = isDefaultValue ? param.squash : false;
                // Allow the Parameter's Type to encode the value
                var encoded = param.type.encode(value);
                return { param: param, value: value, isValid: isValid, isDefaultValue: isDefaultValue, squash: squash, encoded: encoded };
            }
            // Build up the path-portion from the list of static segments and parameters
            var pathString = pathSegmentsAndParams.reduce(function (acc, x) {
                // The element is a static segment (a raw string); just append it
                if (isString(x))
                    return acc + x;
                // Otherwise, it's a ParamDetails.
                var squash = x.squash, encoded = x.encoded, param = x.param;
                // If squash is === true, try to remove a slash from the path
                if (squash === true)
                    return acc.match(/\/$/) ? acc.slice(0, -1) : acc;
                // If squash is a string, use the string for the param value
                if (isString(squash))
                    return acc + squash;
                if (squash !== false)
                    return acc; // ?
                if (encoded == null)
                    return acc;
                // If this parameter value is an array, encode the value using encodeDashes
                if (isArray(encoded))
                    return acc + map(encoded, UrlMatcher.encodeDashes).join('-');
                // If the parameter type is "raw", then do not encodeURIComponent
                if (param.raw)
                    return acc + encoded;
                // Encode the value
                return acc + encodeURIComponent(encoded);
            }, '');
            // Build the query string by applying parameter values (array or regular)
            // then mapping to key=value, then flattening and joining using "&"
            var queryString = queryParams
                .map(function (paramDetails) {
                var param = paramDetails.param, squash = paramDetails.squash, encoded = paramDetails.encoded, isDefaultValue = paramDetails.isDefaultValue;
                if (encoded == null || (isDefaultValue && squash !== false))
                    return;
                if (!isArray(encoded))
                    encoded = [encoded];
                if (encoded.length === 0)
                    return;
                if (!param.raw)
                    encoded = map(encoded, encodeURIComponent);
                return encoded.map(function (val$$1) { return param.id + "=" + val$$1; });
            })
                .filter(identity)
                .reduce(unnestR, [])
                .join('&');
            // Concat the pathstring with the queryString (if exists) and the hashString (if exists)
            return pathString + (queryString ? "?" + queryString : '') + (values$$1['#'] ? '#' + values$$1['#'] : '');
        };
        /** @hidden */
        UrlMatcher.nameValidator = /^\w+([-.]+\w+)*(?:\[\])?$/;
        return UrlMatcher;
    }());

    var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    /** @internalapi */
    var ParamFactory = /** @class */ (function () {
        function ParamFactory(umf) {
            this.umf = umf;
        }
        ParamFactory.prototype.fromConfig = function (id, type, state) {
            return new Param(id, type, exports.DefType.CONFIG, this.umf, state);
        };
        ParamFactory.prototype.fromPath = function (id, type, state) {
            return new Param(id, type, exports.DefType.PATH, this.umf, state);
        };
        ParamFactory.prototype.fromSearch = function (id, type, state) {
            return new Param(id, type, exports.DefType.SEARCH, this.umf, state);
        };
        return ParamFactory;
    }());
    /**
     * Factory for [[UrlMatcher]] instances.
     *
     * The factory is available to ng1 services as
     * `$urlMatcherFactory` or ng1 providers as `$urlMatcherFactoryProvider`.
     */
    var UrlMatcherFactory = /** @class */ (function () {
        function UrlMatcherFactory() {
            /** @hidden */ this.paramTypes = new ParamTypes();
            /** @hidden */ this._isCaseInsensitive = false;
            /** @hidden */ this._isStrictMode = true;
            /** @hidden */ this._defaultSquashPolicy = false;
            /** @internalapi Creates a new [[Param]] for a given location (DefType) */
            this.paramFactory = new ParamFactory(this);
            extend(this, { UrlMatcher: UrlMatcher, Param: Param });
        }
        /** @inheritdoc */
        UrlMatcherFactory.prototype.caseInsensitive = function (value) {
            return (this._isCaseInsensitive = isDefined(value) ? value : this._isCaseInsensitive);
        };
        /** @inheritdoc */
        UrlMatcherFactory.prototype.strictMode = function (value) {
            return (this._isStrictMode = isDefined(value) ? value : this._isStrictMode);
        };
        /** @inheritdoc */
        UrlMatcherFactory.prototype.defaultSquashPolicy = function (value) {
            if (isDefined(value) && value !== true && value !== false && !isString(value))
                throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
            return (this._defaultSquashPolicy = isDefined(value) ? value : this._defaultSquashPolicy);
        };
        /**
         * Creates a [[UrlMatcher]] for the specified pattern.
         *
         * @param pattern  The URL pattern.
         * @param config  The config object hash.
         * @returns The UrlMatcher.
         */
        UrlMatcherFactory.prototype.compile = function (pattern, config) {
            // backward-compatible support for config.params -> config.state.params
            var params = config && !config.state && config.params;
            config = params ? __assign({ state: { params: params } }, config) : config;
            var globalConfig = { strict: this._isStrictMode, caseInsensitive: this._isCaseInsensitive };
            return new UrlMatcher(pattern, this.paramTypes, this.paramFactory, extend(globalConfig, config));
        };
        /**
         * Returns true if the specified object is a [[UrlMatcher]], or false otherwise.
         *
         * @param object  The object to perform the type check against.
         * @returns `true` if the object matches the `UrlMatcher` interface, by
         *          implementing all the same methods.
         */
        UrlMatcherFactory.prototype.isMatcher = function (object) {
            // TODO: typeof?
            if (!isObject(object))
                return false;
            var result = true;
            forEach(UrlMatcher.prototype, function (val, name) {
                if (isFunction(val))
                    result = result && (isDefined(object[name]) && isFunction(object[name]));
            });
            return result;
        };
        /**
         * Creates and registers a custom [[ParamType]] object
         *
         * A [[ParamType]] can be used to generate URLs with typed parameters.
         *
         * @param name  The type name.
         * @param definition The type definition. See [[ParamTypeDefinition]] for information on the values accepted.
         * @param definitionFn A function that is injected before the app runtime starts.
         *        The result of this function should be a [[ParamTypeDefinition]].
         *        The result is merged into the existing `definition`.
         *        See [[ParamType]] for information on the values accepted.
         *
         * @returns - if a type was registered: the [[UrlMatcherFactory]]
         *   - if only the `name` parameter was specified: the currently registered [[ParamType]] object, or undefined
         *
         * Note: Register custom types *before using them* in a state definition.
         *
         * See [[ParamTypeDefinition]] for examples
         */
        UrlMatcherFactory.prototype.type = function (name, definition, definitionFn) {
            var type = this.paramTypes.type(name, definition, definitionFn);
            return !isDefined(definition) ? type : this;
        };
        /** @hidden */
        UrlMatcherFactory.prototype.$get = function () {
            this.paramTypes.enqueue = false;
            this.paramTypes._flushTypeQueue();
            return this;
        };
        /** @internalapi */
        UrlMatcherFactory.prototype.dispose = function () {
            this.paramTypes.dispose();
        };
        return UrlMatcherFactory;
    }());

    /**
     * @coreapi
     * @module url
     */ /** */
    /**
     * Creates a [[UrlRule]]
     *
     * Creates a [[UrlRule]] from a:
     *
     * - `string`
     * - [[UrlMatcher]]
     * - `RegExp`
     * - [[StateObject]]
     * @internalapi
     */
    var UrlRuleFactory = /** @class */ (function () {
        function UrlRuleFactory(router) {
            this.router = router;
        }
        UrlRuleFactory.prototype.compile = function (str) {
            return this.router.urlMatcherFactory.compile(str);
        };
        UrlRuleFactory.prototype.create = function (what, handler) {
            var _this = this;
            var isState = StateObject.isState;
            var makeRule = pattern([
                [isString, function (_what) { return makeRule(_this.compile(_what)); }],
                [is(UrlMatcher), function (_what) { return _this.fromUrlMatcher(_what, handler); }],
                [isState, function (_what) { return _this.fromState(_what, _this.router); }],
                [is(RegExp), function (_what) { return _this.fromRegExp(_what, handler); }],
                [isFunction, function (_what) { return new BaseUrlRule(_what, handler); }],
            ]);
            var rule = makeRule(what);
            if (!rule)
                throw new Error("invalid 'what' in when()");
            return rule;
        };
        /**
         * A UrlRule which matches based on a UrlMatcher
         *
         * The `handler` may be either a `string`, a [[UrlRuleHandlerFn]] or another [[UrlMatcher]]
         *
         * ## Handler as a function
         *
         * If `handler` is a function, the function is invoked with:
         *
         * - matched parameter values ([[RawParams]] from [[UrlMatcher.exec]])
         * - url: the current Url ([[UrlParts]])
         * - router: the router object ([[UIRouter]])
         *
         * #### Example:
         * ```js
         * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
         * var rule = factory.fromUrlMatcher(urlMatcher, match => "/home/" + match.fooId + "/" + match.barId);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match); // '/home/123/456'
         * ```
         *
         * ## Handler as UrlMatcher
         *
         * If `handler` is a UrlMatcher, the handler matcher is used to create the new url.
         * The `handler` UrlMatcher is formatted using the matched param from the first matcher.
         * The url is replaced with the result.
         *
         * #### Example:
         * ```js
         * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
         * var handler = $umf.compile("/home/:fooId/:barId");
         * var rule = factory.fromUrlMatcher(urlMatcher, handler);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match); // '/home/123/456'
         * ```
         */
        UrlRuleFactory.prototype.fromUrlMatcher = function (urlMatcher, handler) {
            var _handler = handler;
            if (isString(handler))
                handler = this.router.urlMatcherFactory.compile(handler);
            if (is(UrlMatcher)(handler))
                _handler = function (match) { return handler.format(match); };
            function matchUrlParamters(url) {
                var params = urlMatcher.exec(url.path, url.search, url.hash);
                return urlMatcher.validates(params) && params;
            }
            // Prioritize URLs, lowest to highest:
            // - Some optional URL parameters, but none matched
            // - No optional parameters in URL
            // - Some optional parameters, some matched
            // - Some optional parameters, all matched
            function matchPriority(params) {
                var optional = urlMatcher.parameters().filter(function (param) { return param.isOptional; });
                if (!optional.length)
                    return 0.000001;
                var matched = optional.filter(function (param) { return params[param.id]; });
                return matched.length / optional.length;
            }
            var details = { urlMatcher: urlMatcher, matchPriority: matchPriority, type: 'URLMATCHER' };
            return extend(new BaseUrlRule(matchUrlParamters, _handler), details);
        };
        /**
         * A UrlRule which matches a state by its url
         *
         * #### Example:
         * ```js
         * var rule = factory.fromState($state.get('foo'), router);
         * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
         * var result = rule.handler(match);
         * // Starts a transition to 'foo' with params: { fooId: '123', barId: '456' }
         * ```
         */
        UrlRuleFactory.prototype.fromState = function (state, router) {
            /**
             * Handles match by transitioning to matched state
             *
             * First checks if the router should start a new transition.
             * A new transition is not required if the current state's URL
             * and the new URL are already identical
             */
            var handler = function (match) {
                var $state = router.stateService;
                var globals = router.globals;
                if ($state.href(state, match) !== $state.href(globals.current, globals.params)) {
                    $state.transitionTo(state, match, { inherit: true, source: 'url' });
                }
            };
            var details = { state: state, type: 'STATE' };
            return extend(this.fromUrlMatcher(state.url, handler), details);
        };
        /**
         * A UrlRule which matches based on a regular expression
         *
         * The `handler` may be either a [[UrlRuleHandlerFn]] or a string.
         *
         * ## Handler as a function
         *
         * If `handler` is a function, the function is invoked with:
         *
         * - regexp match array (from `regexp`)
         * - url: the current Url ([[UrlParts]])
         * - router: the router object ([[UIRouter]])
         *
         * #### Example:
         * ```js
         * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, match => "/home/" + match[1])
         * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
         * var result = rule.handler(match); // '/home/bar'
         * ```
         *
         * ## Handler as string
         *
         * If `handler` is a string, the url is *replaced by the string* when the Rule is invoked.
         * The string is first interpolated using `string.replace()` style pattern.
         *
         * #### Example:
         * ```js
         * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, "/home/$1")
         * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
         * var result = rule.handler(match); // '/home/bar'
         * ```
         */
        UrlRuleFactory.prototype.fromRegExp = function (regexp, handler) {
            if (regexp.global || regexp.sticky)
                throw new Error('Rule RegExp must not be global or sticky');
            /**
             * If handler is a string, the url will be replaced by the string.
             * If the string has any String.replace() style variables in it (like `$2`),
             * they will be replaced by the captures from [[match]]
             */
            var redirectUrlTo = function (match) {
                // Interpolates matched values into $1 $2, etc using a String.replace()-style pattern
                return handler.replace(/\$(\$|\d{1,2})/, function (m, what) { return match[what === '$' ? 0 : Number(what)]; });
            };
            var _handler = isString(handler) ? redirectUrlTo : handler;
            var matchParamsFromRegexp = function (url) { return regexp.exec(url.path); };
            var details = { regexp: regexp, type: 'REGEXP' };
            return extend(new BaseUrlRule(matchParamsFromRegexp, _handler), details);
        };
        UrlRuleFactory.isUrlRule = function (obj) { return obj && ['type', 'match', 'handler'].every(function (key) { return isDefined(obj[key]); }); };
        return UrlRuleFactory;
    }());
    /**
     * A base rule which calls `match`
     *
     * The value from the `match` function is passed through to the `handler`.
     * @internalapi
     */
    var BaseUrlRule = /** @class */ (function () {
        function BaseUrlRule(match, handler) {
            var _this = this;
            this.match = match;
            this.type = 'RAW';
            this.matchPriority = function (match) { return 0 - _this.$id; };
            this.handler = handler || identity;
        }
        return BaseUrlRule;
    }());

    /**
     * @internalapi
     * @module url
     */
    /** @hidden */
    function appendBasePath(url, isHtml5, absolute, baseHref) {
        if (baseHref === '/')
            return url;
        if (isHtml5)
            return stripLastPathElement(baseHref) + url;
        if (absolute)
            return baseHref.slice(1) + url;
        return url;
    }
    /** @hidden */
    var prioritySort = function (a, b) { return (b.priority || 0) - (a.priority || 0); };
    /** @hidden */
    var typeSort = function (a, b) {
        var weights = { STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1 };
        return (weights[a.type] || 0) - (weights[b.type] || 0);
    };
    /** @hidden */
    var urlMatcherSort = function (a, b) {
        return !a.urlMatcher || !b.urlMatcher ? 0 : UrlMatcher.compare(a.urlMatcher, b.urlMatcher);
    };
    /** @hidden */
    var idSort = function (a, b) {
        // Identically sorted STATE and URLMATCHER best rule will be chosen by `matchPriority` after each rule matches the URL
        var useMatchPriority = { STATE: true, URLMATCHER: true };
        var equal = useMatchPriority[a.type] && useMatchPriority[b.type];
        return equal ? 0 : (a.$id || 0) - (b.$id || 0);
    };
    /**
     * Default rule priority sorting function.
     *
     * Sorts rules by:
     *
     * - Explicit priority (set rule priority using [[UrlRulesApi.when]])
     * - Rule type (STATE: 4, URLMATCHER: 4, REGEXP: 3, RAW: 2, OTHER: 1)
     * - `UrlMatcher` specificity ([[UrlMatcher.compare]]): works for STATE and URLMATCHER types to pick the most specific rule.
     * - Rule registration order (for rule types other than STATE and URLMATCHER)
     *   - Equally sorted State and UrlMatcher rules will each match the URL.
     *     Then, the *best* match is chosen based on how many parameter values were matched.
     *
     * @coreapi
     */
    var defaultRuleSortFn;
    defaultRuleSortFn = function (a, b) {
        var cmp = prioritySort(a, b);
        if (cmp !== 0)
            return cmp;
        cmp = typeSort(a, b);
        if (cmp !== 0)
            return cmp;
        cmp = urlMatcherSort(a, b);
        if (cmp !== 0)
            return cmp;
        return idSort(a, b);
    };
    /**
     * Updates URL and responds to URL changes
     *
     * ### Deprecation warning:
     * This class is now considered to be an internal API
     * Use the [[UrlService]] instead.
     * For configuring URL rules, use the [[UrlRulesApi]] which can be found as [[UrlService.rules]].
     *
     * This class updates the URL when the state changes.
     * It also responds to changes in the URL.
     */
    var UrlRouter = /** @class */ (function () {
        /** @hidden */
        function UrlRouter(router) {
            /** @hidden */ this._sortFn = defaultRuleSortFn;
            /** @hidden */ this._rules = [];
            /** @hidden */ this.interceptDeferred = false;
            /** @hidden */ this._id = 0;
            /** @hidden */ this._sorted = false;
            this._router = router;
            this.urlRuleFactory = new UrlRuleFactory(router);
            createProxyFunctions(val(UrlRouter.prototype), this, val(this));
        }
        /** @internalapi */
        UrlRouter.prototype.dispose = function () {
            this.listen(false);
            this._rules = [];
            delete this._otherwiseFn;
        };
        /** @inheritdoc */
        UrlRouter.prototype.sort = function (compareFn) {
            this._rules = this.stableSort(this._rules, (this._sortFn = compareFn || this._sortFn));
            this._sorted = true;
        };
        UrlRouter.prototype.ensureSorted = function () {
            this._sorted || this.sort();
        };
        UrlRouter.prototype.stableSort = function (arr, compareFn) {
            var arrOfWrapper = arr.map(function (elem, idx) { return ({ elem: elem, idx: idx }); });
            arrOfWrapper.sort(function (wrapperA, wrapperB) {
                var cmpDiff = compareFn(wrapperA.elem, wrapperB.elem);
                return cmpDiff === 0 ? wrapperA.idx - wrapperB.idx : cmpDiff;
            });
            return arrOfWrapper.map(function (wrapper) { return wrapper.elem; });
        };
        /**
         * Given a URL, check all rules and return the best [[MatchResult]]
         * @param url
         * @returns {MatchResult}
         */
        UrlRouter.prototype.match = function (url) {
            var _this = this;
            this.ensureSorted();
            url = extend({ path: '', search: {}, hash: '' }, url);
            var rules = this.rules();
            if (this._otherwiseFn)
                rules.push(this._otherwiseFn);
            // Checks a single rule. Returns { rule: rule, match: match, weight: weight } if it matched, or undefined
            var checkRule = function (rule) {
                var match = rule.match(url, _this._router);
                return match && { match: match, rule: rule, weight: rule.matchPriority(match) };
            };
            // The rules are pre-sorted.
            // - Find the first matching rule.
            // - Find any other matching rule that sorted *exactly the same*, according to `.sort()`.
            // - Choose the rule with the highest match weight.
            var best;
            for (var i = 0; i < rules.length; i++) {
                // Stop when there is a 'best' rule and the next rule sorts differently than it.
                if (best && this._sortFn(rules[i], best.rule) !== 0)
                    break;
                var current = checkRule(rules[i]);
                // Pick the best MatchResult
                best = !best || (current && current.weight > best.weight) ? current : best;
            }
            return best;
        };
        /** @inheritdoc */
        UrlRouter.prototype.sync = function (evt) {
            if (evt && evt.defaultPrevented)
                return;
            var router = this._router, $url = router.urlService, $state = router.stateService;
            var url = {
                path: $url.path(),
                search: $url.search(),
                hash: $url.hash(),
            };
            var best = this.match(url);
            var applyResult = pattern([
                [isString, function (newurl) { return $url.url(newurl, true); }],
                [TargetState.isDef, function (def) { return $state.go(def.state, def.params, def.options); }],
                [is(TargetState), function (target) { return $state.go(target.state(), target.params(), target.options()); }],
            ]);
            applyResult(best && best.rule.handler(best.match, url, router));
        };
        /** @inheritdoc */
        UrlRouter.prototype.listen = function (enabled) {
            var _this = this;
            if (enabled === false) {
                this._stopFn && this._stopFn();
                delete this._stopFn;
            }
            else {
                return (this._stopFn = this._stopFn || this._router.urlService.onChange(function (evt) { return _this.sync(evt); }));
            }
        };
        /**
         * Internal API.
         * @internalapi
         */
        UrlRouter.prototype.update = function (read) {
            var $url = this._router.locationService;
            if (read) {
                this.location = $url.url();
                return;
            }
            if ($url.url() === this.location)
                return;
            $url.url(this.location, true);
        };
        /**
         * Internal API.
         *
         * Pushes a new location to the browser history.
         *
         * @internalapi
         * @param urlMatcher
         * @param params
         * @param options
         */
        UrlRouter.prototype.push = function (urlMatcher, params, options) {
            var replace = options && !!options.replace;
            this._router.urlService.url(urlMatcher.format(params || {}), replace);
        };
        /**
         * Builds and returns a URL with interpolated parameters
         *
         * #### Example:
         * ```js
         * matcher = $umf.compile("/about/:person");
         * params = { person: "bob" };
         * $bob = $urlRouter.href(matcher, params);
         * // $bob == "/about/bob";
         * ```
         *
         * @param urlMatcher The [[UrlMatcher]] object which is used as the template of the URL to generate.
         * @param params An object of parameter values to fill the matcher's required parameters.
         * @param options Options object. The options are:
         *
         * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
         *
         * @returns Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
         */
        UrlRouter.prototype.href = function (urlMatcher, params, options) {
            var url = urlMatcher.format(params);
            if (url == null)
                return null;
            options = options || { absolute: false };
            var cfg = this._router.urlService.config;
            var isHtml5 = cfg.html5Mode();
            if (!isHtml5 && url !== null) {
                url = '#' + cfg.hashPrefix() + url;
            }
            url = appendBasePath(url, isHtml5, options.absolute, cfg.baseHref());
            if (!options.absolute || !url) {
                return url;
            }
            var slash = !isHtml5 && url ? '/' : '';
            var cfgPort = cfg.port();
            var port = (cfgPort === 80 || cfgPort === 443 ? '' : ':' + cfgPort);
            return [cfg.protocol(), '://', cfg.host(), port, slash, url].join('');
        };
        /**
         * Manually adds a URL Rule.
         *
         * Usually, a url rule is added using [[StateDeclaration.url]] or [[when]].
         * This api can be used directly for more control (to register a [[BaseUrlRule]], for example).
         * Rules can be created using [[UrlRouter.urlRuleFactory]], or create manually as simple objects.
         *
         * A rule should have a `match` function which returns truthy if the rule matched.
         * It should also have a `handler` function which is invoked if the rule is the best match.
         *
         * @return a function that deregisters the rule
         */
        UrlRouter.prototype.rule = function (rule) {
            var _this = this;
            if (!UrlRuleFactory.isUrlRule(rule))
                throw new Error('invalid rule');
            rule.$id = this._id++;
            rule.priority = rule.priority || 0;
            this._rules.push(rule);
            this._sorted = false;
            return function () { return _this.removeRule(rule); };
        };
        /** @inheritdoc */
        UrlRouter.prototype.removeRule = function (rule) {
            removeFrom(this._rules, rule);
        };
        /** @inheritdoc */
        UrlRouter.prototype.rules = function () {
            this.ensureSorted();
            return this._rules.slice();
        };
        /** @inheritdoc */
        UrlRouter.prototype.otherwise = function (handler) {
            var handlerFn = getHandlerFn(handler);
            this._otherwiseFn = this.urlRuleFactory.create(val(true), handlerFn);
            this._sorted = false;
        };
        /** @inheritdoc */
        UrlRouter.prototype.initial = function (handler) {
            var handlerFn = getHandlerFn(handler);
            var matchFn = function (urlParts, router) {
                return router.globals.transitionHistory.size() === 0 && !!/^\/?$/.exec(urlParts.path);
            };
            this.rule(this.urlRuleFactory.create(matchFn, handlerFn));
        };
        /** @inheritdoc */
        UrlRouter.prototype.when = function (matcher, handler, options) {
            var rule = this.urlRuleFactory.create(matcher, handler);
            if (isDefined(options && options.priority))
                rule.priority = options.priority;
            this.rule(rule);
            return rule;
        };
        /** @inheritdoc */
        UrlRouter.prototype.deferIntercept = function (defer) {
            if (defer === undefined)
                defer = true;
            this.interceptDeferred = defer;
        };
        return UrlRouter;
    }());
    function getHandlerFn(handler) {
        if (!isFunction(handler) && !isString(handler) && !is(TargetState)(handler) && !TargetState.isDef(handler)) {
            throw new Error("'handler' must be a string, function, TargetState, or have a state: 'newtarget' property");
        }
        return isFunction(handler) ? handler : val(handler);
    }

    /**
     * @coreapi
     * @module view
     */ /** for typedoc */
    /**
     * The View service
     *
     * This service pairs existing `ui-view` components (which live in the DOM)
     * with view configs (from the state declaration objects: [[StateDeclaration.views]]).
     *
     * - After a successful Transition, the views from the newly entered states are activated via [[activateViewConfig]].
     *   The views from exited states are deactivated via [[deactivateViewConfig]].
     *   (See: the [[registerActivateViews]] Transition Hook)
     *
     * - As `ui-view` components pop in and out of existence, they register themselves using [[registerUIView]].
     *
     * - When the [[sync]] function is called, the registered `ui-view`(s) ([[ActiveUIView]])
     * are configured with the matching [[ViewConfig]](s)
     *
     */
    var ViewService = /** @class */ (function () {
        function ViewService(router) {
            var _this = this;
            this.router = router;
            this._uiViews = [];
            this._viewConfigs = [];
            this._viewConfigFactories = {};
            this._listeners = [];
            this._pluginapi = {
                _rootViewContext: this._rootViewContext.bind(this),
                _viewConfigFactory: this._viewConfigFactory.bind(this),
                _registeredUIView: function (id) { return find(_this._uiViews, function (view) { return _this.router.$id + "." + view.id === id; }); },
                _registeredUIViews: function () { return _this._uiViews; },
                _activeViewConfigs: function () { return _this._viewConfigs; },
                _onSync: function (listener) {
                    _this._listeners.push(listener);
                    return function () { return removeFrom(_this._listeners, listener); };
                },
            };
        }
        /**
         * Normalizes a view's name from a state.views configuration block.
         *
         * This should be used by a framework implementation to calculate the values for
         * [[_ViewDeclaration.$uiViewName]] and [[_ViewDeclaration.$uiViewContextAnchor]].
         *
         * @param context the context object (state declaration) that the view belongs to
         * @param rawViewName the name of the view, as declared in the [[StateDeclaration.views]]
         *
         * @returns the normalized uiViewName and uiViewContextAnchor that the view targets
         */
        ViewService.normalizeUIViewTarget = function (context, rawViewName) {
            if (rawViewName === void 0) { rawViewName = ''; }
            // TODO: Validate incoming view name with a regexp to allow:
            // ex: "view.name@foo.bar" , "^.^.view.name" , "view.name@^.^" , "" ,
            // "@" , "$default@^" , "!$default.$default" , "!foo.bar"
            var viewAtContext = rawViewName.split('@');
            var uiViewName = viewAtContext[0] || '$default'; // default to unnamed view
            var uiViewContextAnchor = isString(viewAtContext[1]) ? viewAtContext[1] : '^'; // default to parent context
            // Handle relative view-name sugar syntax.
            // Matches rawViewName "^.^.^.foo.bar" into array: ["^.^.^.foo.bar", "^.^.^", "foo.bar"],
            var relativeViewNameSugar = /^(\^(?:\.\^)*)\.(.*$)/.exec(uiViewName);
            if (relativeViewNameSugar) {
                // Clobbers existing contextAnchor (rawViewName validation will fix this)
                uiViewContextAnchor = relativeViewNameSugar[1]; // set anchor to "^.^.^"
                uiViewName = relativeViewNameSugar[2]; // set view-name to "foo.bar"
            }
            if (uiViewName.charAt(0) === '!') {
                uiViewName = uiViewName.substr(1);
                uiViewContextAnchor = ''; // target absolutely from root
            }
            // handle parent relative targeting "^.^.^"
            var relativeMatch = /^(\^(?:\.\^)*)$/;
            if (relativeMatch.exec(uiViewContextAnchor)) {
                var anchorState = uiViewContextAnchor.split('.').reduce(function (anchor, x) { return anchor.parent; }, context);
                uiViewContextAnchor = anchorState.name;
            }
            else if (uiViewContextAnchor === '.') {
                uiViewContextAnchor = context.name;
            }
            return { uiViewName: uiViewName, uiViewContextAnchor: uiViewContextAnchor };
        };
        ViewService.prototype._rootViewContext = function (context) {
            return (this._rootContext = context || this._rootContext);
        };
        ViewService.prototype._viewConfigFactory = function (viewType, factory) {
            this._viewConfigFactories[viewType] = factory;
        };
        ViewService.prototype.createViewConfig = function (path, decl) {
            var cfgFactory = this._viewConfigFactories[decl.$type];
            if (!cfgFactory)
                throw new Error('ViewService: No view config factory registered for type ' + decl.$type);
            var cfgs = cfgFactory(path, decl);
            return isArray(cfgs) ? cfgs : [cfgs];
        };
        /**
         * Deactivates a ViewConfig.
         *
         * This function deactivates a `ViewConfig`.
         * After calling [[sync]], it will un-pair from any `ui-view` with which it is currently paired.
         *
         * @param viewConfig The ViewConfig view to deregister.
         */
        ViewService.prototype.deactivateViewConfig = function (viewConfig) {
            trace.traceViewServiceEvent('<- Removing', viewConfig);
            removeFrom(this._viewConfigs, viewConfig);
        };
        ViewService.prototype.activateViewConfig = function (viewConfig) {
            trace.traceViewServiceEvent('-> Registering', viewConfig);
            this._viewConfigs.push(viewConfig);
        };
        ViewService.prototype.sync = function () {
            var _this = this;
            var uiViewsByFqn = this._uiViews.map(function (uiv) { return [uiv.fqn, uiv]; }).reduce(applyPairs, {});
            // Return a weighted depth value for a uiView.
            // The depth is the nesting depth of ui-views (based on FQN; times 10,000)
            // plus the depth of the state that is populating the uiView
            function uiViewDepth(uiView) {
                var stateDepth = function (context) { return (context && context.parent ? stateDepth(context.parent) + 1 : 1); };
                return uiView.fqn.split('.').length * 10000 + stateDepth(uiView.creationContext);
            }
            // Return the ViewConfig's context's depth in the context tree.
            function viewConfigDepth(config) {
                var context = config.viewDecl.$context, count = 0;
                while (++count && context.parent)
                    context = context.parent;
                return count;
            }
            // Given a depth function, returns a compare function which can return either ascending or descending order
            var depthCompare = curry(function (depthFn, posNeg, left, right) { return posNeg * (depthFn(left) - depthFn(right)); });
            var matchingConfigPair = function (uiView) {
                var matchingConfigs = _this._viewConfigs.filter(ViewService.matches(uiViewsByFqn, uiView));
                if (matchingConfigs.length > 1) {
                    // This is OK.  Child states can target a ui-view that the parent state also targets (the child wins)
                    // Sort by depth and return the match from the deepest child
                    // console.log(`Multiple matching view configs for ${uiView.fqn}`, matchingConfigs);
                    matchingConfigs.sort(depthCompare(viewConfigDepth, -1)); // descending
                }
                return { uiView: uiView, viewConfig: matchingConfigs[0] };
            };
            var configureUIView = function (tuple) {
                // If a parent ui-view is reconfigured, it could destroy child ui-views.
                // Before configuring a child ui-view, make sure it's still in the active uiViews array.
                if (_this._uiViews.indexOf(tuple.uiView) !== -1)
                    tuple.uiView.configUpdated(tuple.viewConfig);
            };
            // Sort views by FQN and state depth. Process uiviews nearest the root first.
            var uiViewTuples = this._uiViews.sort(depthCompare(uiViewDepth, 1)).map(matchingConfigPair);
            var matchedViewConfigs = uiViewTuples.map(function (tuple) { return tuple.viewConfig; });
            var unmatchedConfigTuples = this._viewConfigs
                .filter(function (config) { return !inArray(matchedViewConfigs, config); })
                .map(function (viewConfig) { return ({ uiView: undefined, viewConfig: viewConfig }); });
            uiViewTuples.forEach(configureUIView);
            var allTuples = uiViewTuples.concat(unmatchedConfigTuples);
            this._listeners.forEach(function (cb) { return cb(allTuples); });
            trace.traceViewSync(allTuples);
        };
        /**
         * Registers a `ui-view` component
         *
         * When a `ui-view` component is created, it uses this method to register itself.
         * After registration the [[sync]] method is used to ensure all `ui-view` are configured with the proper [[ViewConfig]].
         *
         * Note: the `ui-view` component uses the `ViewConfig` to determine what view should be loaded inside the `ui-view`,
         * and what the view's state context is.
         *
         * Note: There is no corresponding `deregisterUIView`.
         *       A `ui-view` should hang on to the return value of `registerUIView` and invoke it to deregister itself.
         *
         * @param uiView The metadata for a UIView
         * @return a de-registration function used when the view is destroyed.
         */
        ViewService.prototype.registerUIView = function (uiView) {
            trace.traceViewServiceUIViewEvent('-> Registering', uiView);
            var uiViews = this._uiViews;
            var fqnAndTypeMatches = function (uiv) { return uiv.fqn === uiView.fqn && uiv.$type === uiView.$type; };
            if (uiViews.filter(fqnAndTypeMatches).length)
                trace.traceViewServiceUIViewEvent('!!!! duplicate uiView named:', uiView);
            uiViews.push(uiView);
            this.sync();
            return function () {
                var idx = uiViews.indexOf(uiView);
                if (idx === -1) {
                    trace.traceViewServiceUIViewEvent('Tried removing non-registered uiView', uiView);
                    return;
                }
                trace.traceViewServiceUIViewEvent('<- Deregistering', uiView);
                removeFrom(uiViews)(uiView);
            };
        };
        /**
         * Returns the list of views currently available on the page, by fully-qualified name.
         *
         * @return {Array} Returns an array of fully-qualified view names.
         */
        ViewService.prototype.available = function () {
            return this._uiViews.map(prop('fqn'));
        };
        /**
         * Returns the list of views on the page containing loaded content.
         *
         * @return {Array} Returns an array of fully-qualified view names.
         */
        ViewService.prototype.active = function () {
            return this._uiViews.filter(prop('$config')).map(prop('name'));
        };
        /**
         * Given a ui-view and a ViewConfig, determines if they "match".
         *
         * A ui-view has a fully qualified name (fqn) and a context object.  The fqn is built from its overall location in
         * the DOM, describing its nesting relationship to any parent ui-view tags it is nested inside of.
         *
         * A ViewConfig has a target ui-view name and a context anchor.  The ui-view name can be a simple name, or
         * can be a segmented ui-view path, describing a portion of a ui-view fqn.
         *
         * In order for a ui-view to match ViewConfig, ui-view's $type must match the ViewConfig's $type
         *
         * If the ViewConfig's target ui-view name is a simple name (no dots), then a ui-view matches if:
         * - the ui-view's name matches the ViewConfig's target name
         * - the ui-view's context matches the ViewConfig's anchor
         *
         * If the ViewConfig's target ui-view name is a segmented name (with dots), then a ui-view matches if:
         * - There exists a parent ui-view where:
         *    - the parent ui-view's name matches the first segment (index 0) of the ViewConfig's target name
         *    - the parent ui-view's context matches the ViewConfig's anchor
         * - And the remaining segments (index 1..n) of the ViewConfig's target name match the tail of the ui-view's fqn
         *
         * Example:
         *
         * DOM:
         * <ui-view>                        <!-- created in the root context (name: "") -->
         *   <ui-view name="foo">                <!-- created in the context named: "A"      -->
         *     <ui-view>                    <!-- created in the context named: "A.B"    -->
         *       <ui-view name="bar">            <!-- created in the context named: "A.B.C"  -->
         *       </ui-view>
         *     </ui-view>
         *   </ui-view>
         * </ui-view>
         *
         * uiViews: [
         *  { fqn: "$default",                  creationContext: { name: "" } },
         *  { fqn: "$default.foo",              creationContext: { name: "A" } },
         *  { fqn: "$default.foo.$default",     creationContext: { name: "A.B" } }
         *  { fqn: "$default.foo.$default.bar", creationContext: { name: "A.B.C" } }
         * ]
         *
         * These four view configs all match the ui-view with the fqn: "$default.foo.$default.bar":
         *
         * - ViewConfig1: { uiViewName: "bar",                       uiViewContextAnchor: "A.B.C" }
         * - ViewConfig2: { uiViewName: "$default.bar",              uiViewContextAnchor: "A.B" }
         * - ViewConfig3: { uiViewName: "foo.$default.bar",          uiViewContextAnchor: "A" }
         * - ViewConfig4: { uiViewName: "$default.foo.$default.bar", uiViewContextAnchor: "" }
         *
         * Using ViewConfig3 as an example, it matches the ui-view with fqn "$default.foo.$default.bar" because:
         * - The ViewConfig's segmented target name is: [ "foo", "$default", "bar" ]
         * - There exists a parent ui-view (which has fqn: "$default.foo") where:
         *    - the parent ui-view's name "foo" matches the first segment "foo" of the ViewConfig's target name
         *    - the parent ui-view's context "A" matches the ViewConfig's anchor context "A"
         * - And the remaining segments [ "$default", "bar" ].join("."_ of the ViewConfig's target name match
         *   the tail of the ui-view's fqn "default.bar"
         *
         * @internalapi
         */
        ViewService.matches = function (uiViewsByFqn, uiView) { return function (viewConfig) {
            // Don't supply an ng1 ui-view with an ng2 ViewConfig, etc
            if (uiView.$type !== viewConfig.viewDecl.$type)
                return false;
            // Split names apart from both viewConfig and uiView into segments
            var vc = viewConfig.viewDecl;
            var vcSegments = vc.$uiViewName.split('.');
            var uivSegments = uiView.fqn.split('.');
            // Check if the tails of the segment arrays match. ex, these arrays' tails match:
            // vc: ["foo", "bar"], uiv fqn: ["$default", "foo", "bar"]
            if (!equals(vcSegments, uivSegments.slice(0 - vcSegments.length)))
                return false;
            // Now check if the fqn ending at the first segment of the viewConfig matches the context:
            // ["$default", "foo"].join(".") == "$default.foo", does the ui-view $default.foo context match?
            var negOffset = 1 - vcSegments.length || undefined;
            var fqnToFirstSegment = uivSegments.slice(0, negOffset).join('.');
            var uiViewContext = uiViewsByFqn[fqnToFirstSegment].creationContext;
            return vc.$uiViewContextAnchor === (uiViewContext && uiViewContext.name);
        }; };
        return ViewService;
    }());

    /**
     * @coreapi
     * @module core
     */ /** */
    /**
     * Global router state
     *
     * This is where we hold the global mutable state such as current state, current
     * params, current transition, etc.
     */
    var UIRouterGlobals = /** @class */ (function () {
        function UIRouterGlobals() {
            /**
             * Current parameter values
             *
             * The parameter values from the latest successful transition
             */
            this.params = new StateParams();
            /** @internalapi */
            this.lastStartedTransitionId = -1;
            /** @internalapi */
            this.transitionHistory = new Queue([], 1);
            /** @internalapi */
            this.successfulTransitions = new Queue([], 1);
        }
        UIRouterGlobals.prototype.dispose = function () {
            this.transitionHistory.clear();
            this.successfulTransitions.clear();
            this.transition = null;
        };
        return UIRouterGlobals;
    }());

    /**
     * @coreapi
     * @module url
     */ /** */
    /** @hidden */
    var makeStub = function (keys) {
        return keys.reduce(function (acc, key) { return ((acc[key] = notImplemented(key)), acc); }, { dispose: noop });
    };
    /** @hidden */
    var locationServicesFns = ['url', 'path', 'search', 'hash', 'onChange'];
    /** @hidden */
    var locationConfigFns = ['port', 'protocol', 'host', 'baseHref', 'html5Mode', 'hashPrefix'];
    /** @hidden */
    var umfFns = ['type', 'caseInsensitive', 'strictMode', 'defaultSquashPolicy'];
    /** @hidden */
    var rulesFns = ['sort', 'when', 'initial', 'otherwise', 'rules', 'rule', 'removeRule'];
    /** @hidden */
    var syncFns = ['deferIntercept', 'listen', 'sync', 'match'];
    /**
     * API for URL management
     */
    var UrlService = /** @class */ (function () {
        /** @hidden */
        function UrlService(router, lateBind) {
            if (lateBind === void 0) { lateBind = true; }
            this.router = router;
            this.rules = {};
            this.config = {};
            // proxy function calls from UrlService to the LocationService/LocationConfig
            var locationServices = function () { return router.locationService; };
            createProxyFunctions(locationServices, this, locationServices, locationServicesFns, lateBind);
            var locationConfig = function () { return router.locationConfig; };
            createProxyFunctions(locationConfig, this.config, locationConfig, locationConfigFns, lateBind);
            var umf = function () { return router.urlMatcherFactory; };
            createProxyFunctions(umf, this.config, umf, umfFns);
            var urlRouter = function () { return router.urlRouter; };
            createProxyFunctions(urlRouter, this.rules, urlRouter, rulesFns);
            createProxyFunctions(urlRouter, this, urlRouter, syncFns);
        }
        UrlService.prototype.url = function (newurl, replace, state) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.path = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.search = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.hash = function () {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.onChange = function (callback) {
            return;
        };
        /**
         * Returns the current URL parts
         *
         * This method returns the current URL components as a [[UrlParts]] object.
         *
         * @returns the current url parts
         */
        UrlService.prototype.parts = function () {
            return { path: this.path(), search: this.search(), hash: this.hash() };
        };
        UrlService.prototype.dispose = function () { };
        /** @inheritdoc */
        UrlService.prototype.sync = function (evt) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.listen = function (enabled) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.deferIntercept = function (defer) {
            return;
        };
        /** @inheritdoc */
        UrlService.prototype.match = function (urlParts) {
            return;
        };
        /** @hidden */
        UrlService.locationServiceStub = makeStub(locationServicesFns);
        /** @hidden */
        UrlService.locationConfigStub = makeStub(locationConfigFns);
        return UrlService;
    }());

    /**
     * @coreapi
     * @module core
     */ /** */
    /** @hidden */
    var _routerInstance = 0;
    /**
     * The master class used to instantiate an instance of UI-Router.
     *
     * UI-Router (for each specific framework) will create an instance of this class during bootstrap.
     * This class instantiates and wires the UI-Router services together.
     *
     * After a new instance of the UIRouter class is created, it should be configured for your app.
     * For instance, app states should be registered with the [[UIRouter.stateRegistry]].
     *
     * ---
     *
     * Normally the framework code will bootstrap UI-Router.
     * If you are bootstrapping UIRouter manually, tell it to monitor the URL by calling
     * [[UrlService.listen]] then [[UrlService.sync]].
     */
    var UIRouter = /** @class */ (function () {
        /**
         * Creates a new `UIRouter` object
         *
         * @param locationService a [[LocationServices]] implementation
         * @param locationConfig a [[LocationConfig]] implementation
         * @internalapi
         */
        function UIRouter(locationService, locationConfig) {
            if (locationService === void 0) { locationService = UrlService.locationServiceStub; }
            if (locationConfig === void 0) { locationConfig = UrlService.locationConfigStub; }
            this.locationService = locationService;
            this.locationConfig = locationConfig;
            /** @hidden */ this.$id = _routerInstance++;
            /** @hidden */ this._disposed = false;
            /** @hidden */ this._disposables = [];
            /** Provides trace information to the console */
            this.trace = trace;
            /** Provides services related to ui-view synchronization */
            this.viewService = new ViewService(this);
            /** Global router state */
            this.globals = new UIRouterGlobals();
            /** Provides services related to Transitions */
            this.transitionService = new TransitionService(this);
            /**
             * Deprecated for public use. Use [[urlService]] instead.
             * @deprecated Use [[urlService]] instead
             */
            this.urlMatcherFactory = new UrlMatcherFactory();
            /**
             * Deprecated for public use. Use [[urlService]] instead.
             * @deprecated Use [[urlService]] instead
             */
            this.urlRouter = new UrlRouter(this);
            /** Provides a registry for states, and related registration services */
            this.stateRegistry = new StateRegistry(this);
            /** Provides services related to states */
            this.stateService = new StateService(this);
            /** Provides services related to the URL */
            this.urlService = new UrlService(this);
            /** @hidden plugin instances are registered here */
            this._plugins = {};
            this.viewService._pluginapi._rootViewContext(this.stateRegistry.root());
            this.globals.$current = this.stateRegistry.root();
            this.globals.current = this.globals.$current.self;
            this.disposable(this.globals);
            this.disposable(this.stateService);
            this.disposable(this.stateRegistry);
            this.disposable(this.transitionService);
            this.disposable(this.urlRouter);
            this.disposable(locationService);
            this.disposable(locationConfig);
        }
        /** Registers an object to be notified when the router is disposed */
        UIRouter.prototype.disposable = function (disposable) {
            this._disposables.push(disposable);
        };
        /**
         * Disposes this router instance
         *
         * When called, clears resources retained by the router by calling `dispose(this)` on all
         * registered [[disposable]] objects.
         *
         * Or, if a `disposable` object is provided, calls `dispose(this)` on that object only.
         *
         * @param disposable (optional) the disposable to dispose
         */
        UIRouter.prototype.dispose = function (disposable) {
            var _this = this;
            if (disposable && isFunction(disposable.dispose)) {
                disposable.dispose(this);
                return undefined;
            }
            this._disposed = true;
            this._disposables.slice().forEach(function (d) {
                try {
                    typeof d.dispose === 'function' && d.dispose(_this);
                    removeFrom(_this._disposables, d);
                }
                catch (ignored) { }
            });
        };
        /**
         * Adds a plugin to UI-Router
         *
         * This method adds a UI-Router Plugin.
         * A plugin can enhance or change UI-Router behavior using any public API.
         *
         * #### Example:
         * ```js
         * import { MyCoolPlugin } from "ui-router-cool-plugin";
         *
         * var plugin = router.addPlugin(MyCoolPlugin);
         * ```
         *
         * ### Plugin authoring
         *
         * A plugin is simply a class (or constructor function) which accepts a [[UIRouter]] instance and (optionally) an options object.
         *
         * The plugin can implement its functionality using any of the public APIs of [[UIRouter]].
         * For example, it may configure router options or add a Transition Hook.
         *
         * The plugin can then be published as a separate module.
         *
         * #### Example:
         * ```js
         * export class MyAuthPlugin implements UIRouterPlugin {
         *   constructor(router: UIRouter, options: any) {
         *     this.name = "MyAuthPlugin";
         *     let $transitions = router.transitionService;
         *     let $state = router.stateService;
         *
         *     let authCriteria = {
         *       to: (state) => state.data && state.data.requiresAuth
         *     };
         *
         *     function authHook(transition: Transition) {
         *       let authService = transition.injector().get('AuthService');
         *       if (!authService.isAuthenticated()) {
         *         return $state.target('login');
         *       }
         *     }
         *
         *     $transitions.onStart(authCriteria, authHook);
         *   }
         * }
         * ```
         *
         * @param plugin one of:
         *        - a plugin class which implements [[UIRouterPlugin]]
         *        - a constructor function for a [[UIRouterPlugin]] which accepts a [[UIRouter]] instance
         *        - a factory function which accepts a [[UIRouter]] instance and returns a [[UIRouterPlugin]] instance
         * @param options options to pass to the plugin class/factory
         * @returns the registered plugin instance
         */
        UIRouter.prototype.plugin = function (plugin, options) {
            if (options === void 0) { options = {}; }
            var pluginInstance = new plugin(this, options);
            if (!pluginInstance.name)
                throw new Error('Required property `name` missing on plugin: ' + pluginInstance);
            this._disposables.push(pluginInstance);
            return (this._plugins[pluginInstance.name] = pluginInstance);
        };
        UIRouter.prototype.getPlugin = function (pluginName) {
            return pluginName ? this._plugins[pluginName] : values(this._plugins);
        };
        return UIRouter;
    }());

    /** @module hooks */ /** */
    function addCoreResolvables(trans) {
        trans.addResolvable(Resolvable.fromData(UIRouter, trans.router), '');
        trans.addResolvable(Resolvable.fromData(Transition, trans), '');
        trans.addResolvable(Resolvable.fromData('$transition$', trans), '');
        trans.addResolvable(Resolvable.fromData('$stateParams', trans.params()), '');
        trans.entering().forEach(function (state) {
            trans.addResolvable(Resolvable.fromData('$state$', state), state);
        });
    }
    var registerAddCoreResolvables = function (transitionService) {
        return transitionService.onCreate({}, addCoreResolvables);
    };
    var TRANSITION_TOKENS = ['$transition$', Transition];
    var isTransition = inArray(TRANSITION_TOKENS);
    // References to Transition in the treeChanges pathnodes makes all
    // previous Transitions reachable in memory, causing a memory leak
    // This function removes resolves for '$transition$' and `Transition` from the treeChanges.
    // Do not use this on current transitions, only on old ones.
    var treeChangesCleanup = function (trans) {
        var nodes = values(trans.treeChanges())
            .reduce(unnestR, [])
            .reduce(uniqR, []);
        // If the resolvable is a Transition, return a new resolvable with null data
        var replaceTransitionWithNull = function (r) {
            return isTransition(r.token) ? Resolvable.fromData(r.token, null) : r;
        };
        nodes.forEach(function (node) {
            node.resolvables = node.resolvables.map(replaceTransitionWithNull);
        });
    };

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that redirects to a different state or params
     *
     * Registered using `transitionService.onStart({ to: (state) => !!state.redirectTo }, redirectHook);`
     *
     * See [[StateDeclaration.redirectTo]]
     */
    var redirectToHook = function (trans) {
        var redirect = trans.to().redirectTo;
        if (!redirect)
            return;
        var $state = trans.router.stateService;
        function handleResult(result) {
            if (!result)
                return;
            if (result instanceof TargetState)
                return result;
            if (isString(result))
                return $state.target(result, trans.params(), trans.options());
            if (result['state'] || result['params'])
                return $state.target(result['state'] || trans.to(), result['params'] || trans.params(), trans.options());
        }
        if (isFunction(redirect)) {
            return services.$q.when(redirect(trans)).then(handleResult);
        }
        return handleResult(redirect);
    };
    var registerRedirectToHook = function (transitionService) {
        return transitionService.onStart({ to: function (state) { return !!state.redirectTo; } }, redirectToHook);
    };

    /**
     * A factory which creates an onEnter, onExit or onRetain transition hook function
     *
     * The returned function invokes the (for instance) state.onEnter hook when the
     * state is being entered.
     *
     * @hidden
     */
    function makeEnterExitRetainHook(hookName) {
        return function (transition, state) {
            var _state = state.$$state();
            var hookFn = _state[hookName];
            return hookFn(transition, state);
        };
    }
    /**
     * The [[TransitionStateHookFn]] for onExit
     *
     * When the state is being exited, the state's .onExit function is invoked.
     *
     * Registered using `transitionService.onExit({ exiting: (state) => !!state.onExit }, onExitHook);`
     *
     * See: [[IHookRegistry.onExit]]
     */
    var onExitHook = makeEnterExitRetainHook('onExit');
    var registerOnExitHook = function (transitionService) {
        return transitionService.onExit({ exiting: function (state) { return !!state.onExit; } }, onExitHook);
    };
    /**
     * The [[TransitionStateHookFn]] for onRetain
     *
     * When the state was already entered, and is not being exited or re-entered, the state's .onRetain function is invoked.
     *
     * Registered using `transitionService.onRetain({ retained: (state) => !!state.onRetain }, onRetainHook);`
     *
     * See: [[IHookRegistry.onRetain]]
     */
    var onRetainHook = makeEnterExitRetainHook('onRetain');
    var registerOnRetainHook = function (transitionService) {
        return transitionService.onRetain({ retained: function (state) { return !!state.onRetain; } }, onRetainHook);
    };
    /**
     * The [[TransitionStateHookFn]] for onEnter
     *
     * When the state is being entered, the state's .onEnter function is invoked.
     *
     * Registered using `transitionService.onEnter({ entering: (state) => !!state.onEnter }, onEnterHook);`
     *
     * See: [[IHookRegistry.onEnter]]
     */
    var onEnterHook = makeEnterExitRetainHook('onEnter');
    var registerOnEnterHook = function (transitionService) {
        return transitionService.onEnter({ entering: function (state) { return !!state.onEnter; } }, onEnterHook);
    };

    /** @module hooks */
    var RESOLVE_HOOK_PRIORITY = 1000;
    /**
     * A [[TransitionHookFn]] which resolves all EAGER Resolvables in the To Path
     *
     * Registered using `transitionService.onStart({}, eagerResolvePath, { priority: 1000 });`
     *
     * When a Transition starts, this hook resolves all the EAGER Resolvables, which the transition then waits for.
     *
     * See [[StateDeclaration.resolve]]
     */
    var eagerResolvePath = function (trans) {
        return new ResolveContext(trans.treeChanges().to).resolvePath('EAGER', trans).then(noop);
    };
    var registerEagerResolvePath = function (transitionService) {
        return transitionService.onStart({}, eagerResolvePath, { priority: RESOLVE_HOOK_PRIORITY });
    };
    /**
     * A [[TransitionHookFn]] which resolves all LAZY Resolvables for the state (and all its ancestors) in the To Path
     *
     * Registered using `transitionService.onEnter({ entering: () => true }, lazyResolveState, { priority: 1000 });`
     *
     * When a State is being entered, this hook resolves all the Resolvables for this state, which the transition then waits for.
     *
     * See [[StateDeclaration.resolve]]
     */
    var lazyResolveState = function (trans, state) {
        return new ResolveContext(trans.treeChanges().to)
            .subContext(state.$$state())
            .resolvePath('LAZY', trans)
            .then(noop);
    };
    var registerLazyResolveState = function (transitionService) {
        return transitionService.onEnter({ entering: val(true) }, lazyResolveState, { priority: RESOLVE_HOOK_PRIORITY });
    };
    /**
     * A [[TransitionHookFn]] which resolves any dynamically added (LAZY or EAGER) Resolvables.
     *
     * Registered using `transitionService.onFinish({}, eagerResolvePath, { priority: 1000 });`
     *
     * After all entering states have been entered, this hook resolves any remaining Resolvables.
     * These are typically dynamic resolves which were added by some Transition Hook using [[Transition.addResolvable]].
     *
     * See [[StateDeclaration.resolve]]
     */
    var resolveRemaining = function (trans) {
        return new ResolveContext(trans.treeChanges().to).resolvePath('LAZY', trans).then(noop);
    };
    var registerResolveRemaining = function (transitionService) {
        return transitionService.onFinish({}, resolveRemaining, { priority: RESOLVE_HOOK_PRIORITY });
    };

    /** @module hooks */ /** for typedoc */
    /**
     * A [[TransitionHookFn]] which waits for the views to load
     *
     * Registered using `transitionService.onStart({}, loadEnteringViews);`
     *
     * Allows the views to do async work in [[ViewConfig.load]] before the transition continues.
     * In angular 1, this includes loading the templates.
     */
    var loadEnteringViews = function (transition) {
        var $q = services.$q;
        var enteringViews = transition.views('entering');
        if (!enteringViews.length)
            return;
        return $q.all(enteringViews.map(function (view) { return $q.when(view.load()); })).then(noop);
    };
    var registerLoadEnteringViews = function (transitionService) {
        return transitionService.onFinish({}, loadEnteringViews);
    };
    /**
     * A [[TransitionHookFn]] which activates the new views when a transition is successful.
     *
     * Registered using `transitionService.onSuccess({}, activateViews);`
     *
     * After a transition is complete, this hook deactivates the old views from the previous state,
     * and activates the new views from the destination state.
     *
     * See [[ViewService]]
     */
    var activateViews = function (transition) {
        var enteringViews = transition.views('entering');
        var exitingViews = transition.views('exiting');
        if (!enteringViews.length && !exitingViews.length)
            return;
        var $view = transition.router.viewService;
        exitingViews.forEach(function (vc) { return $view.deactivateViewConfig(vc); });
        enteringViews.forEach(function (vc) { return $view.activateViewConfig(vc); });
        $view.sync();
    };
    var registerActivateViews = function (transitionService) {
        return transitionService.onSuccess({}, activateViews);
    };

    /**
     * A [[TransitionHookFn]] which updates global UI-Router state
     *
     * Registered using `transitionService.onBefore({}, updateGlobalState);`
     *
     * Before a [[Transition]] starts, updates the global value of "the current transition" ([[Globals.transition]]).
     * After a successful [[Transition]], updates the global values of "the current state"
     * ([[Globals.current]] and [[Globals.$current]]) and "the current param values" ([[Globals.params]]).
     *
     * See also the deprecated properties:
     * [[StateService.transition]], [[StateService.current]], [[StateService.params]]
     */
    var updateGlobalState = function (trans) {
        var globals = trans.router.globals;
        var transitionSuccessful = function () {
            globals.successfulTransitions.enqueue(trans);
            globals.$current = trans.$to();
            globals.current = globals.$current.self;
            copy(trans.params(), globals.params);
        };
        var clearCurrentTransition = function () {
            // Do not clear globals.transition if a different transition has started in the meantime
            if (globals.transition === trans)
                globals.transition = null;
        };
        trans.onSuccess({}, transitionSuccessful, { priority: 10000 });
        trans.promise.then(clearCurrentTransition, clearCurrentTransition);
    };
    var registerUpdateGlobalState = function (transitionService) {
        return transitionService.onCreate({}, updateGlobalState);
    };

    /**
     * A [[TransitionHookFn]] which updates the URL after a successful transition
     *
     * Registered using `transitionService.onSuccess({}, updateUrl);`
     */
    var updateUrl = function (transition) {
        var options = transition.options();
        var $state = transition.router.stateService;
        var $urlRouter = transition.router.urlRouter;
        // Dont update the url in these situations:
        // The transition was triggered by a URL sync (options.source === 'url')
        // The user doesn't want the url to update (options.location === false)
        // The destination state, and all parents have no navigable url
        if (options.source !== 'url' && options.location && $state.$current.navigable) {
            var urlOptions = { replace: options.location === 'replace' };
            $urlRouter.push($state.$current.navigable.url, $state.params, urlOptions);
        }
        $urlRouter.update(true);
    };
    var registerUpdateUrl = function (transitionService) {
        return transitionService.onSuccess({}, updateUrl, { priority: 9999 });
    };

    /**
     * A [[TransitionHookFn]] that performs lazy loading
     *
     * When entering a state "abc" which has a `lazyLoad` function defined:
     * - Invoke the `lazyLoad` function (unless it is already in process)
     *   - Flag the hook function as "in process"
     *   - The function should return a promise (that resolves when lazy loading is complete)
     * - Wait for the promise to settle
     *   - If the promise resolves to a [[LazyLoadResult]], then register those states
     *   - Flag the hook function as "not in process"
     * - If the hook was successful
     *   - Remove the `lazyLoad` function from the state declaration
     * - If all the hooks were successful
     *   - Retry the transition (by returning a TargetState)
     *
     * ```
     * .state('abc', {
     *   component: 'fooComponent',
     *   lazyLoad: () => System.import('./fooComponent')
     *   });
     * ```
     *
     * See [[StateDeclaration.lazyLoad]]
     */
    var lazyLoadHook = function (transition) {
        var router = transition.router;
        function retryTransition() {
            if (transition.originalTransition().options().source !== 'url') {
                // The original transition was not triggered via url sync
                // The lazy state should be loaded now, so re-try the original transition
                var orig = transition.targetState();
                return router.stateService.target(orig.identifier(), orig.params(), orig.options());
            }
            // The original transition was triggered via url sync
            // Run the URL rules and find the best match
            var $url = router.urlService;
            var result = $url.match($url.parts());
            var rule = result && result.rule;
            // If the best match is a state, redirect the transition (instead
            // of calling sync() which supersedes the current transition)
            if (rule && rule.type === 'STATE') {
                var state = rule.state;
                var params = result.match;
                return router.stateService.target(state, params, transition.options());
            }
            // No matching state found, so let .sync() choose the best non-state match/otherwise
            router.urlService.sync();
        }
        var promises = transition
            .entering()
            .filter(function (state) { return !!state.$$state().lazyLoad; })
            .map(function (state) { return lazyLoadState(transition, state); });
        return services.$q.all(promises).then(retryTransition);
    };
    var registerLazyLoadHook = function (transitionService) {
        return transitionService.onBefore({ entering: function (state) { return !!state.lazyLoad; } }, lazyLoadHook);
    };
    /**
     * Invokes a state's lazy load function
     *
     * @param transition a Transition context
     * @param state the state to lazy load
     * @returns A promise for the lazy load result
     */
    function lazyLoadState(transition, state) {
        var lazyLoadFn = state.$$state().lazyLoad;
        // Store/get the lazy load promise on/from the hookfn so it doesn't get re-invoked
        var promise = lazyLoadFn['_promise'];
        if (!promise) {
            var success = function (result) {
                delete state.lazyLoad;
                delete state.$$state().lazyLoad;
                delete lazyLoadFn['_promise'];
                return result;
            };
            var error = function (err) {
                delete lazyLoadFn['_promise'];
                return services.$q.reject(err);
            };
            promise = lazyLoadFn['_promise'] = services.$q
                .when(lazyLoadFn(transition, state))
                .then(updateStateRegistry)
                .then(success, error);
        }
        /** Register any lazy loaded state definitions */
        function updateStateRegistry(result) {
            if (result && Array.isArray(result.states)) {
                result.states.forEach(function (_state) { return transition.router.stateRegistry.register(_state); });
            }
            return result;
        }
        return promise;
    }

    /**
     * This class defines a type of hook, such as `onBefore` or `onEnter`.
     * Plugins can define custom hook types, such as sticky states does for `onInactive`.
     *
     * @interalapi
     */
    var TransitionEventType = /** @class */ (function () {
        /* tslint:disable:no-inferrable-types */
        function TransitionEventType(name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous) {
            if (reverseSort === void 0) { reverseSort = false; }
            if (getResultHandler === void 0) { getResultHandler = TransitionHook.HANDLE_RESULT; }
            if (getErrorHandler === void 0) { getErrorHandler = TransitionHook.REJECT_ERROR; }
            if (synchronous === void 0) { synchronous = false; }
            this.name = name;
            this.hookPhase = hookPhase;
            this.hookOrder = hookOrder;
            this.criteriaMatchPath = criteriaMatchPath;
            this.reverseSort = reverseSort;
            this.getResultHandler = getResultHandler;
            this.getErrorHandler = getErrorHandler;
            this.synchronous = synchronous;
        }
        return TransitionEventType;
    }());

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that skips a transition if it should be ignored
     *
     * This hook is invoked at the end of the onBefore phase.
     *
     * If the transition should be ignored (because no parameter or states changed)
     * then the transition is ignored and not processed.
     */
    function ignoredHook(trans) {
        var ignoredReason = trans._ignoredReason();
        if (!ignoredReason)
            return;
        trace.traceTransitionIgnored(trans);
        var pending = trans.router.globals.transition;
        // The user clicked a link going back to the *current state* ('A')
        // However, there is also a pending transition in flight (to 'B')
        // Abort the transition to 'B' because the user now wants to be back at 'A'.
        if (ignoredReason === 'SameAsCurrent' && pending) {
            pending.abort();
        }
        return Rejection.ignored().toPromise();
    }
    var registerIgnoredTransitionHook = function (transitionService) {
        return transitionService.onBefore({}, ignoredHook, { priority: -9999 });
    };

    /** @module hooks */ /** */
    /**
     * A [[TransitionHookFn]] that rejects the Transition if it is invalid
     *
     * This hook is invoked at the end of the onBefore phase.
     * If the transition is invalid (for example, param values do not validate)
     * then the transition is rejected.
     */
    function invalidTransitionHook(trans) {
        if (!trans.valid()) {
            throw new Error(trans.error().toString());
        }
    }
    var registerInvalidTransitionHook = function (transitionService) {
        return transitionService.onBefore({}, invalidTransitionHook, { priority: -10000 });
    };

    /**
     * @coreapi
     * @module transition
     */
    /**
     * The default [[Transition]] options.
     *
     * Include this object when applying custom defaults:
     * let reloadOpts = { reload: true, notify: true }
     * let options = defaults(theirOpts, customDefaults, defaultOptions);
     */
    var defaultTransOpts = {
        location: true,
        relative: null,
        inherit: false,
        notify: true,
        reload: false,
        custom: {},
        current: function () { return null; },
        source: 'unknown',
    };
    /**
     * This class provides services related to Transitions.
     *
     * - Most importantly, it allows global Transition Hooks to be registered.
     * - It allows the default transition error handler to be set.
     * - It also has a factory function for creating new [[Transition]] objects, (used internally by the [[StateService]]).
     *
     * At bootstrap, [[UIRouter]] creates a single instance (singleton) of this class.
     */
    var TransitionService = /** @class */ (function () {
        /** @hidden */
        function TransitionService(_router) {
            /** @hidden */
            this._transitionCount = 0;
            /** @hidden The transition hook types, such as `onEnter`, `onStart`, etc */
            this._eventTypes = [];
            /** @hidden The registered transition hooks */
            this._registeredHooks = {};
            /** @hidden The  paths on a criteria object */
            this._criteriaPaths = {};
            this._router = _router;
            this.$view = _router.viewService;
            this._deregisterHookFns = {};
            this._pluginapi = createProxyFunctions(val(this), {}, val(this), [
                '_definePathType',
                '_defineEvent',
                '_getPathTypes',
                '_getEvents',
                'getHooks',
            ]);
            this._defineCorePaths();
            this._defineCoreEvents();
            this._registerCoreTransitionHooks();
            _router.globals.successfulTransitions.onEvict(treeChangesCleanup);
        }
        /**
         * Registers a [[TransitionHookFn]], called *while a transition is being constructed*.
         *
         * Registers a transition lifecycle hook, which is invoked during transition construction.
         *
         * This low level hook should only be used by plugins.
         * This can be a useful time for plugins to add resolves or mutate the transition as needed.
         * The Sticky States plugin uses this hook to modify the treechanges.
         *
         * ### Lifecycle
         *
         * `onCreate` hooks are invoked *while a transition is being constructed*.
         *
         * ### Return value
         *
         * The hook's return value is ignored
         *
         * @internalapi
         * @param criteria defines which Transitions the Hook should be invoked for.
         * @param callback the hook function which will be invoked.
         * @param options the registration options
         * @returns a function which deregisters the hook.
         */
        TransitionService.prototype.onCreate = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onBefore = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onStart = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onExit = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onRetain = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onEnter = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onFinish = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onSuccess = function (criteria, callback, options) {
            return;
        };
        /** @inheritdoc */
        TransitionService.prototype.onError = function (criteria, callback, options) {
            return;
        };
        /**
         * dispose
         * @internalapi
         */
        TransitionService.prototype.dispose = function (router) {
            values(this._registeredHooks).forEach(function (hooksArray) {
                return hooksArray.forEach(function (hook) {
                    hook._deregistered = true;
                    removeFrom(hooksArray, hook);
                });
            });
        };
        /**
         * Creates a new [[Transition]] object
         *
         * This is a factory function for creating new Transition objects.
         * It is used internally by the [[StateService]] and should generally not be called by application code.
         *
         * @param fromPath the path to the current state (the from state)
         * @param targetState the target state (destination)
         * @returns a Transition
         */
        TransitionService.prototype.create = function (fromPath, targetState) {
            return new Transition(fromPath, targetState, this._router);
        };
        /** @hidden */
        TransitionService.prototype._defineCoreEvents = function () {
            var Phase = exports.TransitionHookPhase;
            var TH = TransitionHook;
            var paths = this._criteriaPaths;
            var NORMAL_SORT = false, REVERSE_SORT = true;
            var SYNCHRONOUS = true;
            this._defineEvent('onCreate', Phase.CREATE, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.THROW_ERROR, SYNCHRONOUS);
            this._defineEvent('onBefore', Phase.BEFORE, 0, paths.to);
            this._defineEvent('onStart', Phase.RUN, 0, paths.to);
            this._defineEvent('onExit', Phase.RUN, 100, paths.exiting, REVERSE_SORT);
            this._defineEvent('onRetain', Phase.RUN, 200, paths.retained);
            this._defineEvent('onEnter', Phase.RUN, 300, paths.entering);
            this._defineEvent('onFinish', Phase.RUN, 400, paths.to);
            this._defineEvent('onSuccess', Phase.SUCCESS, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.LOG_ERROR, SYNCHRONOUS);
            this._defineEvent('onError', Phase.ERROR, 0, paths.to, NORMAL_SORT, TH.LOG_REJECTED_RESULT, TH.LOG_ERROR, SYNCHRONOUS);
        };
        /** @hidden */
        TransitionService.prototype._defineCorePaths = function () {
            var STATE = exports.TransitionHookScope.STATE, TRANSITION = exports.TransitionHookScope.TRANSITION;
            this._definePathType('to', TRANSITION);
            this._definePathType('from', TRANSITION);
            this._definePathType('exiting', STATE);
            this._definePathType('retained', STATE);
            this._definePathType('entering', STATE);
        };
        /** @hidden */
        TransitionService.prototype._defineEvent = function (name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous) {
            if (reverseSort === void 0) { reverseSort = false; }
            if (getResultHandler === void 0) { getResultHandler = TransitionHook.HANDLE_RESULT; }
            if (getErrorHandler === void 0) { getErrorHandler = TransitionHook.REJECT_ERROR; }
            if (synchronous === void 0) { synchronous = false; }
            var eventType = new TransitionEventType(name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous);
            this._eventTypes.push(eventType);
            makeEvent(this, this, eventType);
        };
        /** @hidden */
        // tslint:disable-next-line
        TransitionService.prototype._getEvents = function (phase) {
            var transitionHookTypes = isDefined(phase)
                ? this._eventTypes.filter(function (type) { return type.hookPhase === phase; })
                : this._eventTypes.slice();
            return transitionHookTypes.sort(function (l, r) {
                var cmpByPhase = l.hookPhase - r.hookPhase;
                return cmpByPhase === 0 ? l.hookOrder - r.hookOrder : cmpByPhase;
            });
        };
        /**
         * Adds a Path to be used as a criterion against a TreeChanges path
         *
         * For example: the `exiting` path in [[HookMatchCriteria]] is a STATE scoped path.
         * It was defined by calling `defineTreeChangesCriterion('exiting', TransitionHookScope.STATE)`
         * Each state in the exiting path is checked against the criteria and returned as part of the match.
         *
         * Another example: the `to` path in [[HookMatchCriteria]] is a TRANSITION scoped path.
         * It was defined by calling `defineTreeChangesCriterion('to', TransitionHookScope.TRANSITION)`
         * Only the tail of the `to` path is checked against the criteria and returned as part of the match.
         *
         * @hidden
         */
        TransitionService.prototype._definePathType = function (name, hookScope) {
            this._criteriaPaths[name] = { name: name, scope: hookScope };
        };
        /** * @hidden */
        // tslint:disable-next-line
        TransitionService.prototype._getPathTypes = function () {
            return this._criteriaPaths;
        };
        /** @hidden */
        TransitionService.prototype.getHooks = function (hookName) {
            return this._registeredHooks[hookName];
        };
        /** @hidden */
        TransitionService.prototype._registerCoreTransitionHooks = function () {
            var fns = this._deregisterHookFns;
            fns.addCoreResolves = registerAddCoreResolvables(this);
            fns.ignored = registerIgnoredTransitionHook(this);
            fns.invalid = registerInvalidTransitionHook(this);
            // Wire up redirectTo hook
            fns.redirectTo = registerRedirectToHook(this);
            // Wire up onExit/Retain/Enter state hooks
            fns.onExit = registerOnExitHook(this);
            fns.onRetain = registerOnRetainHook(this);
            fns.onEnter = registerOnEnterHook(this);
            // Wire up Resolve hooks
            fns.eagerResolve = registerEagerResolvePath(this);
            fns.lazyResolve = registerLazyResolveState(this);
            fns.resolveAll = registerResolveRemaining(this);
            // Wire up the View management hooks
            fns.loadViews = registerLoadEnteringViews(this);
            fns.activateViews = registerActivateViews(this);
            // Updates global state after a transition
            fns.updateGlobals = registerUpdateGlobalState(this);
            // After globals.current is updated at priority: 10000
            fns.updateUrl = registerUpdateUrl(this);
            // Lazy load state trees
            fns.lazyLoad = registerLazyLoadHook(this);
        };
        return TransitionService;
    }());

    /**
     * @coreapi
     * @module state
     */
    /**
     * Provides state related service functions
     *
     * This class provides services related to ui-router states.
     * An instance of this class is located on the global [[UIRouter]] object.
     */
    var StateService = /** @class */ (function () {
        /** @internalapi */
        function StateService(router) {
            this.router = router;
            /** @internalapi */
            this.invalidCallbacks = [];
            /** @hidden */
            this._defaultErrorHandler = function $defaultErrorHandler($error$) {
                if ($error$ instanceof Error && $error$.stack) {
                    console.error($error$);
                    console.error($error$.stack);
                }
                else if ($error$ instanceof Rejection) {
                    console.error($error$.toString());
                    if ($error$.detail && $error$.detail.stack)
                        console.error($error$.detail.stack);
                }
                else {
                    console.error($error$);
                }
            };
            var getters = ['current', '$current', 'params', 'transition'];
            var boundFns = Object.keys(StateService.prototype).filter(not(inArray(getters)));
            createProxyFunctions(val(StateService.prototype), this, val(this), boundFns);
        }
        Object.defineProperty(StateService.prototype, "transition", {
            /**
             * The [[Transition]] currently in progress (or null)
             *
             * This is a passthrough through to [[UIRouterGlobals.transition]]
             */
            get: function () {
                return this.router.globals.transition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "params", {
            /**
             * The latest successful state parameters
             *
             * This is a passthrough through to [[UIRouterGlobals.params]]
             */
            get: function () {
                return this.router.globals.params;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "current", {
            /**
             * The current [[StateDeclaration]]
             *
             * This is a passthrough through to [[UIRouterGlobals.current]]
             */
            get: function () {
                return this.router.globals.current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateService.prototype, "$current", {
            /**
             * The current [[StateObject]]
             *
             * This is a passthrough through to [[UIRouterGlobals.$current]]
             */
            get: function () {
                return this.router.globals.$current;
            },
            enumerable: true,
            configurable: true
        });
        /** @internalapi */
        StateService.prototype.dispose = function () {
            this.defaultErrorHandler(noop);
            this.invalidCallbacks = [];
        };
        /**
         * Handler for when [[transitionTo]] is called with an invalid state.
         *
         * Invokes the [[onInvalid]] callbacks, in natural order.
         * Each callback's return value is checked in sequence until one of them returns an instance of TargetState.
         * The results of the callbacks are wrapped in $q.when(), so the callbacks may return promises.
         *
         * If a callback returns an TargetState, then it is used as arguments to $state.transitionTo() and the result returned.
         *
         * @internalapi
         */
        StateService.prototype._handleInvalidTargetState = function (fromPath, toState) {
            var _this = this;
            var fromState = PathUtils.makeTargetState(this.router.stateRegistry, fromPath);
            var globals = this.router.globals;
            var latestThing = function () { return globals.transitionHistory.peekTail(); };
            var latest = latestThing();
            var callbackQueue = new Queue(this.invalidCallbacks.slice());
            var injector = new ResolveContext(fromPath).injector();
            var checkForRedirect = function (result) {
                if (!(result instanceof TargetState)) {
                    return;
                }
                var target = result;
                // Recreate the TargetState, in case the state is now defined.
                target = _this.target(target.identifier(), target.params(), target.options());
                if (!target.valid()) {
                    return Rejection.invalid(target.error()).toPromise();
                }
                if (latestThing() !== latest) {
                    return Rejection.superseded().toPromise();
                }
                return _this.transitionTo(target.identifier(), target.params(), target.options());
            };
            function invokeNextCallback() {
                var nextCallback = callbackQueue.dequeue();
                if (nextCallback === undefined)
                    return Rejection.invalid(toState.error()).toPromise();
                var callbackResult = services.$q.when(nextCallback(toState, fromState, injector));
                return callbackResult.then(checkForRedirect).then(function (result) { return result || invokeNextCallback(); });
            }
            return invokeNextCallback();
        };
        /**
         * Registers an Invalid State handler
         *
         * Registers a [[OnInvalidCallback]] function to be invoked when [[StateService.transitionTo]]
         * has been called with an invalid state reference parameter
         *
         * Example:
         * ```js
         * stateService.onInvalid(function(to, from, injector) {
         *   if (to.name() === 'foo') {
         *     let lazyLoader = injector.get('LazyLoadService');
         *     return lazyLoader.load('foo')
         *         .then(() => stateService.target('foo'));
         *   }
         * });
         * ```
         *
         * @param {function} callback invoked when the toState is invalid
         *   This function receives the (invalid) toState, the fromState, and an injector.
         *   The function may optionally return a [[TargetState]] or a Promise for a TargetState.
         *   If one is returned, it is treated as a redirect.
         *
         * @returns a function which deregisters the callback
         */
        StateService.prototype.onInvalid = function (callback) {
            this.invalidCallbacks.push(callback);
            return function deregisterListener() {
                removeFrom(this.invalidCallbacks)(callback);
            }.bind(this);
        };
        /**
         * Reloads the current state
         *
         * A method that force reloads the current state, or a partial state hierarchy.
         * All resolves are re-resolved, and components reinstantiated.
         *
         * #### Example:
         * ```js
         * let app angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.reload = function(){
         *     $state.reload();
         *   }
         * });
         * ```
         *
         * Note: `reload()` is just an alias for:
         *
         * ```js
         * $state.transitionTo($state.current, $state.params, {
         *   reload: true, inherit: false
         * });
         * ```
         *
         * @param reloadState A state name or a state object.
         *    If present, this state and all its children will be reloaded, but ancestors will not reload.
         *
         * #### Example:
         * ```js
         * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item'
         * //and current state is 'contacts.detail.item'
         * let app angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.reload = function(){
         *     //will reload 'contact.detail' and nested 'contact.detail.item' states
         *     $state.reload('contact.detail');
         *   }
         * });
         * ```
         *
         * @returns A promise representing the state of the new transition. See [[StateService.go]]
         */
        StateService.prototype.reload = function (reloadState) {
            return this.transitionTo(this.current, this.params, {
                reload: isDefined(reloadState) ? reloadState : true,
                inherit: false,
                notify: false,
            });
        };
        /**
         * Transition to a different state and/or parameters
         *
         * Convenience method for transitioning to a new state.
         *
         * `$state.go` calls `$state.transitionTo` internally but automatically sets options to
         * `{ location: true, inherit: true, relative: router.globals.$current, notify: true }`.
         * This allows you to use either an absolute or relative `to` argument (because of `relative: router.globals.$current`).
         * It also allows you to specify * only the parameters you'd like to update, while letting unspecified parameters
         * inherit from the current parameter values (because of `inherit: true`).
         *
         * #### Example:
         * ```js
         * let app = angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.changeState = function () {
         *     $state.go('contact.detail');
         *   };
         * });
         * ```
         *
         * @param to Absolute state name, state object, or relative state path (relative to current state).
         *
         * Some examples:
         *
         * - `$state.go('contact.detail')` - will go to the `contact.detail` state
         * - `$state.go('^')` - will go to the parent state
         * - `$state.go('^.sibling')` - if current state is `home.child`, will go to the `home.sibling` state
         * - `$state.go('.child.grandchild')` - if current state is home, will go to the `home.child.grandchild` state
         *
         * @param params A map of the parameters that will be sent to the state, will populate $stateParams.
         *
         *    Any parameters that are not specified will be inherited from current parameter values (because of `inherit: true`).
         *    This allows, for example, going to a sibling state that shares parameters defined by a parent state.
         *
         * @param options Transition options
         *
         * @returns {promise} A promise representing the state of the new transition.
         */
        StateService.prototype.go = function (to, params, options) {
            var defautGoOpts = { relative: this.$current, inherit: true };
            var transOpts = defaults(options, defautGoOpts, defaultTransOpts);
            return this.transitionTo(to, params, transOpts);
        };
        /**
         * Creates a [[TargetState]]
         *
         * This is a factory method for creating a TargetState
         *
         * This may be returned from a Transition Hook to redirect a transition, for example.
         */
        StateService.prototype.target = function (identifier, params, options) {
            if (options === void 0) { options = {}; }
            // If we're reloading, find the state object to reload from
            if (isObject(options.reload) && !options.reload.name)
                throw new Error('Invalid reload state object');
            var reg = this.router.stateRegistry;
            options.reloadState =
                options.reload === true ? reg.root() : reg.matcher.find(options.reload, options.relative);
            if (options.reload && !options.reloadState)
                throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
            return new TargetState(this.router.stateRegistry, identifier, params, options);
        };
        StateService.prototype.getCurrentPath = function () {
            var _this = this;
            var globals = this.router.globals;
            var latestSuccess = globals.successfulTransitions.peekTail();
            var rootPath = function () { return [new PathNode(_this.router.stateRegistry.root())]; };
            return latestSuccess ? latestSuccess.treeChanges().to : rootPath();
        };
        /**
         * Low-level method for transitioning to a new state.
         *
         * The [[go]] method (which uses `transitionTo` internally) is recommended in most situations.
         *
         * #### Example:
         * ```js
         * let app = angular.module('app', ['ui.router']);
         *
         * app.controller('ctrl', function ($scope, $state) {
         *   $scope.changeState = function () {
         *     $state.transitionTo('contact.detail');
         *   };
         * });
         * ```
         *
         * @param to State name or state object.
         * @param toParams A map of the parameters that will be sent to the state,
         *      will populate $stateParams.
         * @param options Transition options
         *
         * @returns A promise representing the state of the new transition. See [[go]]
         */
        StateService.prototype.transitionTo = function (to, toParams, options) {
            var _this = this;
            if (toParams === void 0) { toParams = {}; }
            if (options === void 0) { options = {}; }
            var router = this.router;
            var globals = router.globals;
            options = defaults(options, defaultTransOpts);
            var getCurrent = function () { return globals.transition; };
            options = extend(options, { current: getCurrent });
            var ref = this.target(to, toParams, options);
            var currentPath = this.getCurrentPath();
            if (!ref.exists())
                return this._handleInvalidTargetState(currentPath, ref);
            if (!ref.valid())
                return silentRejection(ref.error());
            /**
             * Special handling for Ignored, Aborted, and Redirected transitions
             *
             * The semantics for the transition.run() promise and the StateService.transitionTo()
             * promise differ. For instance, the run() promise may be rejected because it was
             * IGNORED, but the transitionTo() promise is resolved because from the user perspective
             * no error occurred.  Likewise, the transition.run() promise may be rejected because of
             * a Redirect, but the transitionTo() promise is chained to the new Transition's promise.
             */
            var rejectedTransitionHandler = function (trans) { return function (error) {
                if (error instanceof Rejection) {
                    var isLatest = router.globals.lastStartedTransitionId === trans.$id;
                    if (error.type === exports.RejectType.IGNORED) {
                        isLatest && router.urlRouter.update();
                        // Consider ignored `Transition.run()` as a successful `transitionTo`
                        return services.$q.when(globals.current);
                    }
                    var detail = error.detail;
                    if (error.type === exports.RejectType.SUPERSEDED && error.redirected && detail instanceof TargetState) {
                        // If `Transition.run()` was redirected, allow the `transitionTo()` promise to resolve successfully
                        // by returning the promise for the new (redirect) `Transition.run()`.
                        var redirect = trans.redirect(detail);
                        return redirect.run().catch(rejectedTransitionHandler(redirect));
                    }
                    if (error.type === exports.RejectType.ABORTED) {
                        isLatest && router.urlRouter.update();
                        return services.$q.reject(error);
                    }
                }
                var errorHandler = _this.defaultErrorHandler();
                errorHandler(error);
                return services.$q.reject(error);
            }; };
            var transition = this.router.transitionService.create(currentPath, ref);
            var transitionToPromise = transition.run().catch(rejectedTransitionHandler(transition));
            silenceUncaughtInPromise(transitionToPromise); // issue #2676
            // Return a promise for the transition, which also has the transition object on it.
            return extend(transitionToPromise, { transition: transition });
        };
        /**
         * Checks if the current state *is* the provided state
         *
         * Similar to [[includes]] but only checks for the full state name.
         * If params is supplied then it will be tested for strict equality against the current
         * active params object, so all params must match with none missing and no extras.
         *
         * #### Example:
         * ```js
         * $state.$current.name = 'contacts.details.item';
         *
         * // absolute name
         * $state.is('contact.details.item'); // returns true
         * $state.is(contactDetailItemStateObject); // returns true
         * ```
         *
         * // relative name (. and ^), typically from a template
         * // E.g. from the 'contacts.details' template
         * ```html
         * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
         * ```
         *
         * @param stateOrName The state name (absolute or relative) or state object you'd like to check.
         * @param params A param object, e.g. `{sectionId: section.id}`, that you'd like
         * to test against the current active state.
         * @param options An options object. The options are:
         *   - `relative`: If `stateOrName` is a relative state name and `options.relative` is set, .is will
         *     test relative to `options.relative` state (or name).
         *
         * @returns Returns true if it is the state.
         */
        StateService.prototype.is = function (stateOrName, params, options) {
            options = defaults(options, { relative: this.$current });
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative);
            if (!isDefined(state))
                return undefined;
            if (this.$current !== state)
                return false;
            if (!params)
                return true;
            var schema = state.parameters({ inherit: true, matchingKeys: params });
            return Param.equals(schema, Param.values(schema, params), this.params);
        };
        /**
         * Checks if the current state *includes* the provided state
         *
         * A method to determine if the current active state is equal to or is the child of the
         * state stateName. If any params are passed then they will be tested for a match as well.
         * Not all the parameters need to be passed, just the ones you'd like to test for equality.
         *
         * #### Example when `$state.$current.name === 'contacts.details.item'`
         * ```js
         * // Using partial names
         * $state.includes("contacts"); // returns true
         * $state.includes("contacts.details"); // returns true
         * $state.includes("contacts.details.item"); // returns true
         * $state.includes("contacts.list"); // returns false
         * $state.includes("about"); // returns false
         * ```
         *
         * #### Glob Examples when `* $state.$current.name === 'contacts.details.item.url'`:
         * ```js
         * $state.includes("*.details.*.*"); // returns true
         * $state.includes("*.details.**"); // returns true
         * $state.includes("**.item.**"); // returns true
         * $state.includes("*.details.item.url"); // returns true
         * $state.includes("*.details.*.url"); // returns true
         * $state.includes("*.details.*"); // returns false
         * $state.includes("item.**"); // returns false
         * ```
         *
         * @param stateOrName A partial name, relative name, glob pattern,
         *   or state object to be searched for within the current state name.
         * @param params A param object, e.g. `{sectionId: section.id}`,
         *   that you'd like to test against the current active state.
         * @param options An options object. The options are:
         *   - `relative`: If `stateOrName` is a relative state name and `options.relative` is set, .is will
         *     test relative to `options.relative` state (or name).
         *
         * @returns {boolean} Returns true if it does include the state
         */
        StateService.prototype.includes = function (stateOrName, params, options) {
            options = defaults(options, { relative: this.$current });
            var glob = isString(stateOrName) && Glob.fromString(stateOrName);
            if (glob) {
                if (!glob.matches(this.$current.name))
                    return false;
                stateOrName = this.$current.name;
            }
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative), include = this.$current.includes;
            if (!isDefined(state))
                return undefined;
            if (!isDefined(include[state.name]))
                return false;
            if (!params)
                return true;
            var schema = state.parameters({ inherit: true, matchingKeys: params });
            return Param.equals(schema, Param.values(schema, params), this.params);
        };
        /**
         * Generates a URL for a state and parameters
         *
         * Returns the url for the given state populated with the given params.
         *
         * #### Example:
         * ```js
         * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
         * ```
         *
         * @param stateOrName The state name or state object you'd like to generate a url from.
         * @param params An object of parameter values to fill the state's required parameters.
         * @param options Options object. The options are:
         *
         * @returns {string} compiled state url
         */
        StateService.prototype.href = function (stateOrName, params, options) {
            var defaultHrefOpts = {
                lossy: true,
                inherit: true,
                absolute: false,
                relative: this.$current,
            };
            options = defaults(options, defaultHrefOpts);
            params = params || {};
            var state = this.router.stateRegistry.matcher.find(stateOrName, options.relative);
            if (!isDefined(state))
                return null;
            if (options.inherit)
                params = this.params.$inherit(params, this.$current, state);
            var nav = state && options.lossy ? state.navigable : state;
            if (!nav || nav.url === undefined || nav.url === null) {
                return null;
            }
            return this.router.urlRouter.href(nav.url, params, {
                absolute: options.absolute,
            });
        };
        /**
         * Sets or gets the default [[transitionTo]] error handler.
         *
         * The error handler is called when a [[Transition]] is rejected or when any error occurred during the Transition.
         * This includes errors caused by resolves and transition hooks.
         *
         * Note:
         * This handler does not receive certain Transition rejections.
         * Redirected and Ignored Transitions are not considered to be errors by [[StateService.transitionTo]].
         *
         * The built-in default error handler logs the error to the console.
         *
         * You can provide your own custom handler.
         *
         * #### Example:
         * ```js
         * stateService.defaultErrorHandler(function() {
         *   // Do not log transitionTo errors
         * });
         * ```
         *
         * @param handler a global error handler function
         * @returns the current global error handler
         */
        StateService.prototype.defaultErrorHandler = function (handler) {
            return (this._defaultErrorHandler = handler || this._defaultErrorHandler);
        };
        StateService.prototype.get = function (stateOrName, base) {
            var reg = this.router.stateRegistry;
            if (arguments.length === 0)
                return reg.get();
            return reg.get(stateOrName, base || this.$current);
        };
        /**
         * Lazy loads a state
         *
         * Explicitly runs a state's [[StateDeclaration.lazyLoad]] function.
         *
         * @param stateOrName the state that should be lazy loaded
         * @param transition the optional Transition context to use (if the lazyLoad function requires an injector, etc)
         * Note: If no transition is provided, a noop transition is created using the from the current state to the current state.
         * This noop transition is not actually run.
         *
         * @returns a promise to lazy load
         */
        StateService.prototype.lazyLoad = function (stateOrName, transition) {
            var state = this.get(stateOrName);
            if (!state || !state.lazyLoad)
                throw new Error('Can not lazy load ' + stateOrName);
            var currentPath = this.getCurrentPath();
            var target = PathUtils.makeTargetState(this.router.stateRegistry, currentPath);
            transition = transition || this.router.transitionService.create(currentPath, target);
            return lazyLoadState(transition, state);
        };
        return StateService;
    }());

    /**
     * # Transition subsystem
     *
     * This module contains APIs related to a Transition.
     *
     * See:
     * - [[TransitionService]]
     * - [[Transition]]
     * - [[HookFn]], [[TransitionHookFn]], [[TransitionStateHookFn]], [[HookMatchCriteria]], [[HookResult]]
     *
     * @coreapi
     * @preferred
     * @module transition
     */ /** for typedoc */

    /**
     * @internalapi
     * @module vanilla
     */
    /**
     * An angular1-like promise api
     *
     * This object implements four methods similar to the
     * [angular 1 promise api](https://docs.angularjs.org/api/ng/service/$q)
     *
     * UI-Router evolved from an angular 1 library to a framework agnostic library.
     * However, some of the `@uirouter/core` code uses these ng1 style APIs to support ng1 style dependency injection.
     *
     * This API provides native ES6 promise support wrapped as a $q-like API.
     * Internally, UI-Router uses this $q object to perform promise operations.
     * The `angular-ui-router` (ui-router for angular 1) uses the $q API provided by angular.
     *
     * $q-like promise api
     */
    var $q = {
        /** Normalizes a value as a promise */
        when: function (val$$1) { return new Promise(function (resolve, reject) { return resolve(val$$1); }); },
        /** Normalizes a value as a promise rejection */
        reject: function (val$$1) {
            return new Promise(function (resolve, reject) {
                reject(val$$1);
            });
        },
        /** @returns a deferred object, which has `resolve` and `reject` functions */
        defer: function () {
            var deferred = {};
            deferred.promise = new Promise(function (resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            return deferred;
        },
        /** Like Promise.all(), but also supports object key/promise notation like $q */
        all: function (promises) {
            if (isArray(promises)) {
                return Promise.all(promises);
            }
            if (isObject(promises)) {
                // Convert promises map to promises array.
                // When each promise resolves, map it to a tuple { key: key, val: val }
                var chain = Object.keys(promises).map(function (key) { return promises[key].then(function (val$$1) { return ({ key: key, val: val$$1 }); }); });
                // Then wait for all promises to resolve, and convert them back to an object
                return $q.all(chain).then(function (values$$1) {
                    return values$$1.reduce(function (acc, tuple) {
                        acc[tuple.key] = tuple.val;
                        return acc;
                    }, {});
                });
            }
        },
    };

    /**
     * @internalapi
     * @module vanilla
     */
    // globally available injectables
    var globals = {};
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    /**
     * A basic angular1-like injector api
     *
     * This object implements four methods similar to the
     * [angular 1 dependency injector](https://docs.angularjs.org/api/auto/service/$injector)
     *
     * UI-Router evolved from an angular 1 library to a framework agnostic library.
     * However, some of the `@uirouter/core` code uses these ng1 style APIs to support ng1 style dependency injection.
     *
     * This object provides a naive implementation of a globally scoped dependency injection system.
     * It supports the following DI approaches:
     *
     * ### Function parameter names
     *
     * A function's `.toString()` is called, and the parameter names are parsed.
     * This only works when the parameter names aren't "mangled" by a minifier such as UglifyJS.
     *
     * ```js
     * function injectedFunction(FooService, BarService) {
     *   // FooService and BarService are injected
     * }
     * ```
     *
     * ### Function annotation
     *
     * A function may be annotated with an array of dependency names as the `$inject` property.
     *
     * ```js
     * injectedFunction.$inject = [ 'FooService', 'BarService' ];
     * function injectedFunction(fs, bs) {
     *   // FooService and BarService are injected as fs and bs parameters
     * }
     * ```
     *
     * ### Array notation
     *
     * An array provides the names of the dependencies to inject (as strings).
     * The function is the last element of the array.
     *
     * ```js
     * [ 'FooService', 'BarService', function (fs, bs) {
     *   // FooService and BarService are injected as fs and bs parameters
     * }]
     * ```
     *
     * @type {$InjectorLike}
     */
    var $injector = {
        /** Gets an object from DI based on a string token */
        get: function (name) { return globals[name]; },
        /** Returns true if an object named `name` exists in global DI */
        has: function (name) { return $injector.get(name) != null; },
        /**
         * Injects a function
         *
         * @param fn the function to inject
         * @param context the function's `this` binding
         * @param locals An object with additional DI tokens and values, such as `{ someToken: { foo: 1 } }`
         */
        invoke: function (fn, context, locals) {
            var all$$1 = extend({}, globals, locals || {});
            var params = $injector.annotate(fn);
            var ensureExist = assertPredicate(function (key) { return all$$1.hasOwnProperty(key); }, function (key) { return "DI can't find injectable: '" + key + "'"; });
            var args = params.filter(ensureExist).map(function (x) { return all$$1[x]; });
            if (isFunction(fn))
                return fn.apply(context, args);
            else
                return fn.slice(-1)[0].apply(context, args);
        },
        /**
         * Returns a function's dependencies
         *
         * Analyzes a function (or array) and returns an array of DI tokens that the function requires.
         * @return an array of `string`s
         */
        annotate: function (fn) {
            if (!isInjectable(fn))
                throw new Error("Not an injectable function: " + fn);
            if (fn && fn.$inject)
                return fn.$inject;
            if (isArray(fn))
                return fn.slice(0, -1);
            var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
            var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            return result || [];
        },
    };

    /**
     * @internalapi
     * @module vanilla
     */
    var keyValsToObjectR = function (accum, _a) {
        var key = _a[0], val$$1 = _a[1];
        if (!accum.hasOwnProperty(key)) {
            accum[key] = val$$1;
        }
        else if (isArray(accum[key])) {
            accum[key].push(val$$1);
        }
        else {
            accum[key] = [accum[key], val$$1];
        }
        return accum;
    };
    var getParams = function (queryString) {
        return queryString
            .split('&')
            .filter(identity)
            .map(splitEqual)
            .reduce(keyValsToObjectR, {});
    };
    function parseUrl$1(url) {
        var orEmptyString = function (x) { return x || ''; };
        var _a = splitHash(url).map(orEmptyString), beforehash = _a[0], hash = _a[1];
        var _b = splitQuery(beforehash).map(orEmptyString), path = _b[0], search = _b[1];
        return { path: path, search: search, hash: hash, url: url };
    }
    var buildUrl = function (loc) {
        var path = loc.path();
        var searchObject = loc.search();
        var hash = loc.hash();
        var search = Object.keys(searchObject)
            .map(function (key) {
            var param = searchObject[key];
            var vals = isArray(param) ? param : [param];
            return vals.map(function (val$$1) { return key + '=' + val$$1; });
        })
            .reduce(unnestR, [])
            .join('&');
        return path + (search ? '?' + search : '') + (hash ? '#' + hash : '');
    };
    function locationPluginFactory(name, isHtml5, serviceClass, configurationClass) {
        return function (uiRouter) {
            var service = (uiRouter.locationService = new serviceClass(uiRouter));
            var configuration = (uiRouter.locationConfig = new configurationClass(uiRouter, isHtml5));
            function dispose(router) {
                router.dispose(service);
                router.dispose(configuration);
            }
            return { name: name, service: service, configuration: configuration, dispose: dispose };
        };
    }

    /**
     * @internalapi
     * @module vanilla
     */ /** */
    /** A base `LocationServices` */
    var BaseLocationServices = /** @class */ (function () {
        function BaseLocationServices(router, fireAfterUpdate) {
            var _this = this;
            this.fireAfterUpdate = fireAfterUpdate;
            this._listeners = [];
            this._listener = function (evt) { return _this._listeners.forEach(function (cb) { return cb(evt); }); };
            this.hash = function () { return parseUrl$1(_this._get()).hash; };
            this.path = function () { return parseUrl$1(_this._get()).path; };
            this.search = function () { return getParams(parseUrl$1(_this._get()).search); };
            this._location = root.location;
            this._history = root.history;
        }
        BaseLocationServices.prototype.url = function (url, replace) {
            if (replace === void 0) { replace = true; }
            if (isDefined(url) && url !== this._get()) {
                this._set(null, null, url, replace);
                if (this.fireAfterUpdate) {
                    this._listeners.forEach(function (cb) { return cb({ url: url }); });
                }
            }
            return buildUrl(this);
        };
        BaseLocationServices.prototype.onChange = function (cb) {
            var _this = this;
            this._listeners.push(cb);
            return function () { return removeFrom(_this._listeners, cb); };
        };
        BaseLocationServices.prototype.dispose = function (router) {
            deregAll(this._listeners);
        };
        return BaseLocationServices;
    }());

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** A `LocationServices` that uses the browser hash "#" to get/set the current location */
    var HashLocationService = /** @class */ (function (_super) {
        __extends(HashLocationService, _super);
        function HashLocationService(router) {
            var _this = _super.call(this, router, false) || this;
            root.addEventListener('hashchange', _this._listener, false);
            return _this;
        }
        HashLocationService.prototype._get = function () {
            return trimHashVal(this._location.hash);
        };
        HashLocationService.prototype._set = function (state, title, url, replace) {
            this._location.hash = url;
        };
        HashLocationService.prototype.dispose = function (router) {
            _super.prototype.dispose.call(this, router);
            root.removeEventListener('hashchange', this._listener);
        };
        return HashLocationService;
    }(BaseLocationServices));

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** A `LocationServices` that gets/sets the current location from an in-memory object */
    var MemoryLocationService = /** @class */ (function (_super) {
        __extends$1(MemoryLocationService, _super);
        function MemoryLocationService(router) {
            return _super.call(this, router, true) || this;
        }
        MemoryLocationService.prototype._get = function () {
            return this._url;
        };
        MemoryLocationService.prototype._set = function (state, title, url, replace) {
            this._url = url;
        };
        return MemoryLocationService;
    }(BaseLocationServices));

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A `LocationServices` that gets/sets the current location using the browser's `location` and `history` apis
     *
     * Uses `history.pushState` and `history.replaceState`
     */
    var PushStateLocationService = /** @class */ (function (_super) {
        __extends$2(PushStateLocationService, _super);
        function PushStateLocationService(router) {
            var _this = _super.call(this, router, true) || this;
            _this._config = router.urlService.config;
            root.addEventListener('popstate', _this._listener, false);
            return _this;
        }
        /**
         * Gets the base prefix without:
         * - trailing slash
         * - trailing filename
         * - protocol and hostname
         *
         * If <base href='/base/'>, this returns '/base'.
         * If <base href='/foo/base/'>, this returns '/foo/base'.
         * If <base href='/base/index.html'>, this returns '/base'.
         * If <base href='http://localhost:8080/base/index.html'>, this returns '/base'.
         * If <base href='/base'>, this returns ''.
         * If <base href='http://localhost:8080'>, this returns ''.
         * If <base href='http://localhost:8080/'>, this returns ''.
         *
         * See: https://html.spec.whatwg.org/dev/semantics.html#the-base-element
         */
        PushStateLocationService.prototype._getBasePrefix = function () {
            return stripLastPathElement(this._config.baseHref());
        };
        PushStateLocationService.prototype._get = function () {
            var _a = this._location, pathname = _a.pathname, hash = _a.hash, search = _a.search;
            search = splitQuery(search)[1]; // strip ? if found
            hash = splitHash(hash)[1]; // strip # if found
            var basePrefix = this._getBasePrefix();
            var exactBaseHrefMatch = pathname === this._config.baseHref();
            var startsWithBase = pathname.substr(0, basePrefix.length) === basePrefix;
            pathname = exactBaseHrefMatch ? '/' : startsWithBase ? pathname.substring(basePrefix.length) : pathname;
            return pathname + (search ? '?' + search : '') + (hash ? '#' + hash : '');
        };
        PushStateLocationService.prototype._set = function (state, title, url, replace) {
            var basePrefix = this._getBasePrefix();
            var slash = url && url[0] !== '/' ? '/' : '';
            var fullUrl = url === '' || url === '/' ? this._config.baseHref() : basePrefix + slash + url;
            if (replace) {
                this._history.replaceState(state, title, fullUrl);
            }
            else {
                this._history.pushState(state, title, fullUrl);
            }
        };
        PushStateLocationService.prototype.dispose = function (router) {
            _super.prototype.dispose.call(this, router);
            root.removeEventListener('popstate', this._listener);
        };
        return PushStateLocationService;
    }(BaseLocationServices));

    /** A `LocationConfig` mock that gets/sets all config from an in-memory object */
    var MemoryLocationConfig = /** @class */ (function () {
        function MemoryLocationConfig() {
            var _this = this;
            this.dispose = noop;
            this._baseHref = '';
            this._port = 80;
            this._protocol = 'http';
            this._host = 'localhost';
            this._hashPrefix = '';
            this.port = function () { return _this._port; };
            this.protocol = function () { return _this._protocol; };
            this.host = function () { return _this._host; };
            this.baseHref = function () { return _this._baseHref; };
            this.html5Mode = function () { return false; };
            this.hashPrefix = function (newval) { return (isDefined(newval) ? (_this._hashPrefix = newval) : _this._hashPrefix); };
        }
        return MemoryLocationConfig;
    }());

    /**
     * @internalapi
     * @module vanilla
     */
    /** A `LocationConfig` that delegates to the browser's `location` object */
    var BrowserLocationConfig = /** @class */ (function () {
        function BrowserLocationConfig(router, _isHtml5) {
            if (_isHtml5 === void 0) { _isHtml5 = false; }
            this._isHtml5 = _isHtml5;
            this._baseHref = undefined;
            this._hashPrefix = '';
        }
        BrowserLocationConfig.prototype.port = function () {
            if (location.port) {
                return Number(location.port);
            }
            return this.protocol() === 'https' ? 443 : 80;
        };
        BrowserLocationConfig.prototype.protocol = function () {
            return location.protocol.replace(/:/g, '');
        };
        BrowserLocationConfig.prototype.host = function () {
            return location.hostname;
        };
        BrowserLocationConfig.prototype.html5Mode = function () {
            return this._isHtml5;
        };
        BrowserLocationConfig.prototype.hashPrefix = function (newprefix) {
            return isDefined(newprefix) ? (this._hashPrefix = newprefix) : this._hashPrefix;
        };
        BrowserLocationConfig.prototype.baseHref = function (href) {
            if (isDefined(href))
                this._baseHref = href;
            if (isUndefined(this._baseHref))
                this._baseHref = this.getBaseHref();
            return this._baseHref;
        };
        BrowserLocationConfig.prototype.getBaseHref = function () {
            var baseTag = document.getElementsByTagName('base')[0];
            if (!baseTag || !baseTag.href)
                return location.pathname || '/';
            return baseTag.href.replace(/^(https?:)?\/\/[^/]*/, '');
        };
        BrowserLocationConfig.prototype.dispose = function () { };
        return BrowserLocationConfig;
    }());

    /**
     * @internalapi
     * @module vanilla
     */
    function servicesPlugin(router) {
        services.$injector = $injector;
        services.$q = $q;
        return { name: 'vanilla.services', $q: $q, $injector: $injector, dispose: function () { return null; } };
    }
    /** A `UIRouterPlugin` uses the browser hash to get/set the current location */
    var hashLocationPlugin = locationPluginFactory('vanilla.hashBangLocation', false, HashLocationService, BrowserLocationConfig);
    /** A `UIRouterPlugin` that gets/sets the current location using the browser's `location` and `history` apis */
    var pushStateLocationPlugin = locationPluginFactory('vanilla.pushStateLocation', true, PushStateLocationService, BrowserLocationConfig);
    /** A `UIRouterPlugin` that gets/sets the current location from an in-memory object */
    var memoryLocationPlugin = locationPluginFactory('vanilla.memoryLocation', false, MemoryLocationService, MemoryLocationConfig);

    /**
     * @internalapi
     * @module vanilla
     */

    /**
     * # Core classes and interfaces
     *
     * The classes and interfaces that are core to ui-router and do not belong
     * to a more specific subsystem (such as resolve).
     *
     * @coreapi
     * @preferred
     * @module core
     */ /** for typedoc */
    /** @internalapi */
    var UIRouterPluginBase = /** @class */ (function () {
        function UIRouterPluginBase() {
        }
        UIRouterPluginBase.prototype.dispose = function (router) { };
        return UIRouterPluginBase;
    }());

    /**
     * @coreapi
     * @module common
     */ /** */

    var index = /*#__PURE__*/Object.freeze({
        root: root,
        fromJson: fromJson,
        toJson: toJson,
        forEach: forEach,
        extend: extend,
        equals: equals,
        identity: identity,
        noop: noop,
        createProxyFunctions: createProxyFunctions,
        inherit: inherit,
        inArray: inArray,
        _inArray: _inArray,
        removeFrom: removeFrom,
        _removeFrom: _removeFrom,
        pushTo: pushTo,
        _pushTo: _pushTo,
        deregAll: deregAll,
        defaults: defaults,
        mergeR: mergeR,
        ancestors: ancestors,
        pick: pick,
        omit: omit,
        pluck: pluck,
        filter: filter,
        find: find,
        mapObj: mapObj,
        map: map,
        values: values,
        allTrueR: allTrueR,
        anyTrueR: anyTrueR,
        unnestR: unnestR,
        flattenR: flattenR,
        pushR: pushR,
        uniqR: uniqR,
        unnest: unnest,
        flatten: flatten,
        assertPredicate: assertPredicate,
        assertMap: assertMap,
        assertFn: assertFn,
        pairs: pairs,
        arrayTuples: arrayTuples,
        applyPairs: applyPairs,
        tail: tail,
        copy: copy,
        _extend: _extend,
        silenceUncaughtInPromise: silenceUncaughtInPromise,
        silentRejection: silentRejection,
        notImplemented: notImplemented,
        services: services,
        Glob: Glob,
        curry: curry,
        compose: compose,
        pipe: pipe,
        prop: prop,
        propEq: propEq,
        parse: parse,
        not: not,
        and: and,
        or: or,
        all: all,
        any: any,
        is: is,
        eq: eq,
        val: val,
        invoke: invoke,
        pattern: pattern,
        isUndefined: isUndefined,
        isDefined: isDefined,
        isNull: isNull,
        isNullOrUndefined: isNullOrUndefined,
        isFunction: isFunction,
        isNumber: isNumber,
        isString: isString,
        isObject: isObject,
        isArray: isArray,
        isDate: isDate,
        isRegExp: isRegExp,
        isInjectable: isInjectable,
        isPromise: isPromise,
        Queue: Queue,
        maxLength: maxLength,
        padString: padString,
        kebobString: kebobString,
        functionToString: functionToString,
        fnToString: fnToString,
        stringify: stringify,
        beforeAfterSubstr: beforeAfterSubstr,
        hostRegex: hostRegex,
        stripLastPathElement: stripLastPathElement,
        splitHash: splitHash,
        splitQuery: splitQuery,
        splitEqual: splitEqual,
        trimHashVal: trimHashVal,
        splitOnDelim: splitOnDelim,
        joinNeighborsR: joinNeighborsR,
        get Category () { return exports.Category; },
        Trace: Trace,
        trace: trace,
        get DefType () { return exports.DefType; },
        Param: Param,
        ParamTypes: ParamTypes,
        StateParams: StateParams,
        ParamType: ParamType,
        PathNode: PathNode,
        PathUtils: PathUtils,
        resolvePolicies: resolvePolicies,
        defaultResolvePolicy: defaultResolvePolicy,
        Resolvable: Resolvable,
        NATIVE_INJECTOR_TOKEN: NATIVE_INJECTOR_TOKEN,
        ResolveContext: ResolveContext,
        resolvablesBuilder: resolvablesBuilder,
        StateBuilder: StateBuilder,
        StateObject: StateObject,
        StateMatcher: StateMatcher,
        StateQueueManager: StateQueueManager,
        StateRegistry: StateRegistry,
        StateService: StateService,
        TargetState: TargetState,
        get TransitionHookPhase () { return exports.TransitionHookPhase; },
        get TransitionHookScope () { return exports.TransitionHookScope; },
        HookBuilder: HookBuilder,
        matchState: matchState,
        RegisteredHook: RegisteredHook,
        makeEvent: makeEvent,
        get RejectType () { return exports.RejectType; },
        Rejection: Rejection,
        Transition: Transition,
        TransitionHook: TransitionHook,
        TransitionEventType: TransitionEventType,
        defaultTransOpts: defaultTransOpts,
        TransitionService: TransitionService,
        UrlMatcher: UrlMatcher,
        ParamFactory: ParamFactory,
        UrlMatcherFactory: UrlMatcherFactory,
        UrlRouter: UrlRouter,
        UrlRuleFactory: UrlRuleFactory,
        BaseUrlRule: BaseUrlRule,
        UrlService: UrlService,
        ViewService: ViewService,
        UIRouterGlobals: UIRouterGlobals,
        UIRouter: UIRouter,
        $q: $q,
        $injector: $injector,
        BaseLocationServices: BaseLocationServices,
        HashLocationService: HashLocationService,
        MemoryLocationService: MemoryLocationService,
        PushStateLocationService: PushStateLocationService,
        MemoryLocationConfig: MemoryLocationConfig,
        BrowserLocationConfig: BrowserLocationConfig,
        keyValsToObjectR: keyValsToObjectR,
        getParams: getParams,
        parseUrl: parseUrl$1,
        buildUrl: buildUrl,
        locationPluginFactory: locationPluginFactory,
        servicesPlugin: servicesPlugin,
        hashLocationPlugin: hashLocationPlugin,
        pushStateLocationPlugin: pushStateLocationPlugin,
        memoryLocationPlugin: memoryLocationPlugin,
        UIRouterPluginBase: UIRouterPluginBase
    });

    function getNg1ViewConfigFactory() {
        var templateFactory = null;
        return function (path, view) {
            templateFactory = templateFactory || services.$injector.get('$templateFactory');
            return [new Ng1ViewConfig(path, view, templateFactory)];
        };
    }
    var hasAnyKey = function (keys, obj) { return keys.reduce(function (acc, key) { return acc || isDefined(obj[key]); }, false); };
    /**
     * This is a [[StateBuilder.builder]] function for angular1 `views`.
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * handles the `views` property with logic specific to @uirouter/angularjs (ng1).
     *
     * If no `views: {}` property exists on the [[StateDeclaration]], then it creates the `views` object
     * and applies the state-level configuration to a view named `$default`.
     */
    function ng1ViewsBuilder(state) {
        // Do not process root state
        if (!state.parent)
            return {};
        var tplKeys = ['templateProvider', 'templateUrl', 'template', 'notify', 'async'], ctrlKeys = ['controller', 'controllerProvider', 'controllerAs', 'resolveAs'], compKeys = ['component', 'bindings', 'componentProvider'], nonCompKeys = tplKeys.concat(ctrlKeys), allViewKeys = compKeys.concat(nonCompKeys);
        // Do not allow a state to have both state-level props and also a `views: {}` property.
        // A state without a `views: {}` property can declare properties for the `$default` view as properties of the state.
        // However, the `$default` approach should not be mixed with a separate `views: ` block.
        if (isDefined(state.views) && hasAnyKey(allViewKeys, state)) {
            throw new Error("State '" + state.name + "' has a 'views' object. " +
                "It cannot also have \"view properties\" at the state level.  " +
                "Move the following properties into a view (in the 'views' object): " +
                (" " + allViewKeys.filter(function (key) { return isDefined(state[key]); }).join(', ')));
        }
        var views = {}, viewsObject = state.views || { $default: pick(state, allViewKeys) };
        forEach(viewsObject, function (config, name) {
            // Account for views: { "": { template... } }
            name = name || '$default';
            // Account for views: { header: "headerComponent" }
            if (isString(config))
                config = { component: config };
            // Make a shallow copy of the config object
            config = extend({}, config);
            // Do not allow a view to mix props for component-style view with props for template/controller-style view
            if (hasAnyKey(compKeys, config) && hasAnyKey(nonCompKeys, config)) {
                throw new Error("Cannot combine: " + compKeys.join('|') + " with: " + nonCompKeys.join('|') + " in stateview: '" + name + "@" + state.name + "'");
            }
            config.resolveAs = config.resolveAs || '$resolve';
            config.$type = 'ng1';
            config.$context = state;
            config.$name = name;
            var normalized = ViewService.normalizeUIViewTarget(config.$context, config.$name);
            config.$uiViewName = normalized.uiViewName;
            config.$uiViewContextAnchor = normalized.uiViewContextAnchor;
            views[name] = config;
        });
        return views;
    }
    var id$1 = 0;
    var Ng1ViewConfig = /** @class */ (function () {
        function Ng1ViewConfig(path, viewDecl, factory) {
            var _this = this;
            this.path = path;
            this.viewDecl = viewDecl;
            this.factory = factory;
            this.$id = id$1++;
            this.loaded = false;
            this.getTemplate = function (uiView, context) {
                return _this.component
                    ? _this.factory.makeComponentTemplate(uiView, context, _this.component, _this.viewDecl.bindings)
                    : _this.template;
            };
        }
        Ng1ViewConfig.prototype.load = function () {
            var _this = this;
            var $q$$1 = services.$q;
            var context = new ResolveContext(this.path);
            var params = this.path.reduce(function (acc, node) { return extend(acc, node.paramValues); }, {});
            var promises = {
                template: $q$$1.when(this.factory.fromConfig(this.viewDecl, params, context)),
                controller: $q$$1.when(this.getController(context)),
            };
            return $q$$1.all(promises).then(function (results) {
                trace.traceViewServiceEvent('Loaded', _this);
                _this.controller = results.controller;
                extend(_this, results.template); // Either { template: "tpl" } or { component: "cmpName" }
                return _this;
            });
        };
        /**
         * Gets the controller for a view configuration.
         *
         * @returns {Function|Promise.<Function>} Returns a controller, or a promise that resolves to a controller.
         */
        Ng1ViewConfig.prototype.getController = function (context) {
            var provider = this.viewDecl.controllerProvider;
            if (!isInjectable(provider))
                return this.viewDecl.controller;
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        return Ng1ViewConfig;
    }());

    /** @module view */
    /**
     * Service which manages loading of templates from a ViewConfig.
     */
    var TemplateFactory = /** @class */ (function () {
        function TemplateFactory() {
            var _this = this;
            /** @hidden */ this._useHttp = ng.version.minor < 3;
            /** @hidden */ this.$get = [
                '$http',
                '$templateCache',
                '$injector',
                function ($http, $templateCache, $injector$$1) {
                    _this.$templateRequest = $injector$$1.has && $injector$$1.has('$templateRequest') && $injector$$1.get('$templateRequest');
                    _this.$http = $http;
                    _this.$templateCache = $templateCache;
                    return _this;
                },
            ];
        }
        /** @hidden */
        TemplateFactory.prototype.useHttpService = function (value) {
            this._useHttp = value;
        };
        /**
         * Creates a template from a configuration object.
         *
         * @param config Configuration object for which to load a template.
         * The following properties are search in the specified order, and the first one
         * that is defined is used to create the template:
         *
         * @param params  Parameters to pass to the template function.
         * @param context The resolve context associated with the template's view
         *
         * @return {string|object}  The template html as a string, or a promise for
         * that string,or `null` if no template is configured.
         */
        TemplateFactory.prototype.fromConfig = function (config, params, context) {
            var defaultTemplate = '<ui-view></ui-view>';
            var asTemplate = function (result) { return services.$q.when(result).then(function (str) { return ({ template: str }); }); };
            var asComponent = function (result) { return services.$q.when(result).then(function (str) { return ({ component: str }); }); };
            return isDefined(config.template)
                ? asTemplate(this.fromString(config.template, params))
                : isDefined(config.templateUrl)
                    ? asTemplate(this.fromUrl(config.templateUrl, params))
                    : isDefined(config.templateProvider)
                        ? asTemplate(this.fromProvider(config.templateProvider, params, context))
                        : isDefined(config.component)
                            ? asComponent(config.component)
                            : isDefined(config.componentProvider)
                                ? asComponent(this.fromComponentProvider(config.componentProvider, params, context))
                                : asTemplate(defaultTemplate);
        };
        /**
         * Creates a template from a string or a function returning a string.
         *
         * @param template html template as a string or function that returns an html template as a string.
         * @param params Parameters to pass to the template function.
         *
         * @return {string|object} The template html as a string, or a promise for that
         * string.
         */
        TemplateFactory.prototype.fromString = function (template, params) {
            return isFunction(template) ? template(params) : template;
        };
        /**
         * Loads a template from the a URL via `$http` and `$templateCache`.
         *
         * @param {string|Function} url url of the template to load, or a function
         * that returns a url.
         * @param {Object} params Parameters to pass to the url function.
         * @return {string|Promise.<string>} The template html as a string, or a promise
         * for that string.
         */
        TemplateFactory.prototype.fromUrl = function (url, params) {
            if (isFunction(url))
                url = url(params);
            if (url == null)
                return null;
            if (this._useHttp) {
                return this.$http
                    .get(url, { cache: this.$templateCache, headers: { Accept: 'text/html' } })
                    .then(function (response) {
                    return response.data;
                });
            }
            return this.$templateRequest(url);
        };
        /**
         * Creates a template by invoking an injectable provider function.
         *
         * @param provider Function to invoke via `locals`
         * @param {Function} injectFn a function used to invoke the template provider
         * @return {string|Promise.<string>} The template html as a string, or a promise
         * for that string.
         */
        TemplateFactory.prototype.fromProvider = function (provider, params, context) {
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        /**
         * Creates a component's template by invoking an injectable provider function.
         *
         * @param provider Function to invoke via `locals`
         * @param {Function} injectFn a function used to invoke the template provider
         * @return {string} The template html as a string: "<component-name input1='::$resolve.foo'></component-name>".
         */
        TemplateFactory.prototype.fromComponentProvider = function (provider, params, context) {
            var deps = services.$injector.annotate(provider);
            var providerFn = isArray(provider) ? tail(provider) : provider;
            var resolvable = new Resolvable('', providerFn, deps);
            return resolvable.get(context);
        };
        /**
         * Creates a template from a component's name
         *
         * This implements route-to-component.
         * It works by retrieving the component (directive) metadata from the injector.
         * It analyses the component's bindings, then constructs a template that instantiates the component.
         * The template wires input and output bindings to resolves or from the parent component.
         *
         * @param uiView {object} The parent ui-view (for binding outputs to callbacks)
         * @param context The ResolveContext (for binding outputs to callbacks returned from resolves)
         * @param component {string} Component's name in camel case.
         * @param bindings An object defining the component's bindings: {foo: '<'}
         * @return {string} The template as a string: "<component-name input1='::$resolve.foo'></component-name>".
         */
        TemplateFactory.prototype.makeComponentTemplate = function (uiView, context, component, bindings) {
            bindings = bindings || {};
            // Bind once prefix
            var prefix = ng.version.minor >= 3 ? '::' : '';
            // Convert to kebob name. Add x- prefix if the string starts with `x-` or `data-`
            var kebob = function (camelCase) {
                var kebobed = kebobString(camelCase);
                return /^(x|data)-/.exec(kebobed) ? "x-" + kebobed : kebobed;
            };
            var attributeTpl = function (input) {
                var name = input.name, type = input.type;
                var attrName = kebob(name);
                // If the ui-view has an attribute which matches a binding on the routed component
                // then pass that attribute through to the routed component template.
                // Prefer ui-view wired mappings to resolve data, unless the resolve was explicitly bound using `bindings:`
                if (uiView.attr(attrName) && !bindings[name])
                    return attrName + "='" + uiView.attr(attrName) + "'";
                var resolveName = bindings[name] || name;
                // Pre-evaluate the expression for "@" bindings by enclosing in {{ }}
                // some-attr="{{ ::$resolve.someResolveName }}"
                if (type === '@')
                    return attrName + "='{{" + prefix + "$resolve." + resolveName + "}}'";
                // Wire "&" callbacks to resolves that return a callback function
                // Get the result of the resolve (should be a function) and annotate it to get its arguments.
                // some-attr="$resolve.someResolveResultName(foo, bar)"
                if (type === '&') {
                    var res = context.getResolvable(resolveName);
                    var fn = res && res.data;
                    var args = (fn && services.$injector.annotate(fn)) || [];
                    // account for array style injection, i.e., ['foo', function(foo) {}]
                    var arrayIdxStr = isArray(fn) ? "[" + (fn.length - 1) + "]" : '';
                    return attrName + "='$resolve." + resolveName + arrayIdxStr + "(" + args.join(',') + ")'";
                }
                // some-attr="::$resolve.someResolveName"
                return attrName + "='" + prefix + "$resolve." + resolveName + "'";
            };
            var attrs = getComponentBindings(component)
                .map(attributeTpl)
                .join(' ');
            var kebobName = kebob(component);
            return "<" + kebobName + " " + attrs + "></" + kebobName + ">";
        };
        return TemplateFactory;
    }());
    // Gets all the directive(s)' inputs ('@', '=', and '<') and outputs ('&')
    function getComponentBindings(name) {
        var cmpDefs = services.$injector.get(name + 'Directive'); // could be multiple
        if (!cmpDefs || !cmpDefs.length)
            throw new Error("Unable to find component named '" + name + "'");
        return cmpDefs.map(getBindings).reduce(unnestR, []);
    }
    // Given a directive definition, find its object input attributes
    // Use different properties, depending on the type of directive (component, bindToController, normal)
    var getBindings = function (def) {
        if (isObject(def.bindToController))
            return scopeBindings(def.bindToController);
        return scopeBindings(def.scope);
    };
    // for ng 1.2 style, process the scope: { input: "=foo" }
    // for ng 1.3 through ng 1.5, process the component's bindToController: { input: "=foo" } object
    var scopeBindings = function (bindingsObj) {
        return Object.keys(bindingsObj || {})
            // [ 'input', [ '=foo', '=', 'foo' ] ]
            .map(function (key) { return [key, /^([=<@&])[?]?(.*)/.exec(bindingsObj[key])]; })
            // skip malformed values
            .filter(function (tuple) { return isDefined(tuple) && isArray(tuple[1]); })
            // { name: ('foo' || 'input'), type: '=' }
            .map(function (tuple) { return ({ name: tuple[1][2] || tuple[0], type: tuple[1][1] }); });
    };

    /** @module ng1 */ /** for typedoc */
    /**
     * The Angular 1 `StateProvider`
     *
     * The `$stateProvider` works similar to Angular's v1 router, but it focuses purely
     * on state.
     *
     * A state corresponds to a "place" in the application in terms of the overall UI and
     * navigation. A state describes (via the controller / template / view properties) what
     * the UI looks like and does at that place.
     *
     * States often have things in common, and the primary way of factoring out these
     * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
     * nested states.
     *
     * The `$stateProvider` provides interfaces to declare these states for your app.
     */
    var StateProvider = /** @class */ (function () {
        function StateProvider(stateRegistry, stateService) {
            this.stateRegistry = stateRegistry;
            this.stateService = stateService;
            createProxyFunctions(val(StateProvider.prototype), this, val(this));
        }
        /**
         * Decorates states when they are registered
         *
         * Allows you to extend (carefully) or override (at your own peril) the
         * `stateBuilder` object used internally by [[StateRegistry]].
         * This can be used to add custom functionality to ui-router,
         * for example inferring templateUrl based on the state name.
         *
         * When passing only a name, it returns the current (original or decorated) builder
         * function that matches `name`.
         *
         * The builder functions that can be decorated are listed below. Though not all
         * necessarily have a good use case for decoration, that is up to you to decide.
         *
         * In addition, users can attach custom decorators, which will generate new
         * properties within the state's internal definition. There is currently no clear
         * use-case for this beyond accessing internal states (i.e. $state.$current),
         * however, expect this to become increasingly relevant as we introduce additional
         * meta-programming features.
         *
         * **Warning**: Decorators should not be interdependent because the order of
         * execution of the builder functions in non-deterministic. Builder functions
         * should only be dependent on the state definition object and super function.
         *
         *
         * Existing builder functions and current return values:
         *
         * - **parent** `{object}` - returns the parent state object.
         * - **data** `{object}` - returns state data, including any inherited data that is not
         *   overridden by own values (if any).
         * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
         *   or `null`.
         * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is
         *   navigable).
         * - **params** `{object}` - returns an array of state params that are ensured to
         *   be a super-set of parent's params.
         * - **views** `{object}` - returns a views object where each key is an absolute view
         *   name (i.e. "viewName@stateName") and each value is the config object
         *   (template, controller) for the view. Even when you don't use the views object
         *   explicitly on a state config, one is still created for you internally.
         *   So by decorating this builder function you have access to decorating template
         *   and controller properties.
         * - **ownParams** `{object}` - returns an array of params that belong to the state,
         *   not including any params defined by ancestor states.
         * - **path** `{string}` - returns the full path from the root down to this state.
         *   Needed for state activation.
         * - **includes** `{object}` - returns an object that includes every state that
         *   would pass a `$state.includes()` test.
         *
         * #### Example:
         * Override the internal 'views' builder with a function that takes the state
         * definition, and a reference to the internal function being overridden:
         * ```js
         * $stateProvider.decorator('views', function (state, parent) {
         *   let result = {},
         *       views = parent(state);
         *
         *   angular.forEach(views, function (config, name) {
         *     let autoName = (state.name + '.' + name).replace('.', '/');
         *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
         *     result[name] = config;
         *   });
         *   return result;
         * });
         *
         * $stateProvider.state('home', {
         *   views: {
         *     'contact.list': { controller: 'ListController' },
         *     'contact.item': { controller: 'ItemController' }
         *   }
         * });
         * ```
         *
         *
         * ```js
         * // Auto-populates list and item views with /partials/home/contact/list.html,
         * // and /partials/home/contact/item.html, respectively.
         * $state.go('home');
         * ```
         *
         * @param {string} name The name of the builder function to decorate.
         * @param {object} func A function that is responsible for decorating the original
         * builder function. The function receives two parameters:
         *
         *   - `{object}` - state - The state config object.
         *   - `{object}` - super - The original builder function.
         *
         * @return {object} $stateProvider - $stateProvider instance
         */
        StateProvider.prototype.decorator = function (name, func) {
            return this.stateRegistry.decorator(name, func) || this;
        };
        StateProvider.prototype.state = function (name, definition) {
            if (isObject(name)) {
                definition = name;
            }
            else {
                definition.name = name;
            }
            this.stateRegistry.register(definition);
            return this;
        };
        /**
         * Registers an invalid state handler
         *
         * This is a passthrough to [[StateService.onInvalid]] for ng1.
         */
        StateProvider.prototype.onInvalid = function (callback) {
            return this.stateService.onInvalid(callback);
        };
        return StateProvider;
    }());

    /** @module ng1 */ /** */
    /**
     * This is a [[StateBuilder.builder]] function for angular1 `onEnter`, `onExit`,
     * `onRetain` callback hooks on a [[Ng1StateDeclaration]].
     *
     * When the [[StateBuilder]] builds a [[StateObject]] object from a raw [[StateDeclaration]], this builder
     * ensures that those hooks are injectable for @uirouter/angularjs (ng1).
     */
    var getStateHookBuilder = function (hookName) {
        return function stateHookBuilder(stateObject, parentFn) {
            var hook = stateObject[hookName];
            var pathname = hookName === 'onExit' ? 'from' : 'to';
            function decoratedNg1Hook(trans, state) {
                var resolveContext = new ResolveContext(trans.treeChanges(pathname));
                var subContext = resolveContext.subContext(state.$$state());
                var locals = extend(getLocals(subContext), { $state$: state, $transition$: trans });
                return services.$injector.invoke(hook, this, locals);
            }
            return hook ? decoratedNg1Hook : undefined;
        };
    };

    /**
     * @internalapi
     * @module ng1
     */ /** */
    /**
     * Implements UI-Router LocationServices and LocationConfig using Angular 1's $location service
     */
    var Ng1LocationServices = /** @class */ (function () {
        function Ng1LocationServices($locationProvider) {
            // .onChange() registry
            this._urlListeners = [];
            this.$locationProvider = $locationProvider;
            var _lp = val($locationProvider);
            createProxyFunctions(_lp, this, _lp, ['hashPrefix']);
        }
        /**
         * Applys ng1-specific path parameter encoding
         *
         * The Angular 1 `$location` service is a bit weird.
         * It doesn't allow slashes to be encoded/decoded bi-directionally.
         *
         * See the writeup at https://github.com/angular-ui/ui-router/issues/2598
         *
         * This code patches the `path` parameter type so it encoded/decodes slashes as ~2F
         *
         * @param router
         */
        Ng1LocationServices.monkeyPatchPathParameterType = function (router) {
            var pathType = router.urlMatcherFactory.type('path');
            pathType.encode = function (x) {
                return x != null ? x.toString().replace(/(~|\/)/g, function (m) { return ({ '~': '~~', '/': '~2F' }[m]); }) : x;
            };
            pathType.decode = function (x) {
                return x != null ? x.toString().replace(/(~~|~2F)/g, function (m) { return ({ '~~': '~', '~2F': '/' }[m]); }) : x;
            };
        };
        Ng1LocationServices.prototype.dispose = function () { };
        Ng1LocationServices.prototype.onChange = function (callback) {
            var _this = this;
            this._urlListeners.push(callback);
            return function () { return removeFrom(_this._urlListeners)(callback); };
        };
        Ng1LocationServices.prototype.html5Mode = function () {
            var html5Mode = this.$locationProvider.html5Mode();
            html5Mode = isObject(html5Mode) ? html5Mode.enabled : html5Mode;
            return html5Mode && this.$sniffer.history;
        };
        Ng1LocationServices.prototype.baseHref = function () {
            return this._baseHref || (this._baseHref = this.$browser.baseHref() || this.$window.location.pathname);
        };
        Ng1LocationServices.prototype.url = function (newUrl, replace, state) {
            if (replace === void 0) { replace = false; }
            if (isDefined(newUrl))
                this.$location.url(newUrl);
            if (replace)
                this.$location.replace();
            if (state)
                this.$location.state(state);
            return this.$location.url();
        };
        Ng1LocationServices.prototype._runtimeServices = function ($rootScope, $location, $sniffer, $browser, $window) {
            var _this = this;
            this.$location = $location;
            this.$sniffer = $sniffer;
            this.$browser = $browser;
            this.$window = $window;
            // Bind $locationChangeSuccess to the listeners registered in LocationService.onChange
            $rootScope.$on('$locationChangeSuccess', function (evt) { return _this._urlListeners.forEach(function (fn) { return fn(evt); }); });
            var _loc = val($location);
            // Bind these LocationService functions to $location
            createProxyFunctions(_loc, this, _loc, ['replace', 'path', 'search', 'hash']);
            // Bind these LocationConfig functions to $location
            createProxyFunctions(_loc, this, _loc, ['port', 'protocol', 'host']);
        };
        return Ng1LocationServices;
    }());

    /** @module url */ /** */
    /**
     * Manages rules for client-side URL
     *
     * ### Deprecation warning:
     * This class is now considered to be an internal API
     * Use the [[UrlService]] instead.
     * For configuring URL rules, use the [[UrlRulesApi]] which can be found as [[UrlService.rules]].
     *
     * This class manages the router rules for what to do when the URL changes.
     *
     * This provider remains for backwards compatibility.
     *
     * @deprecated
     */
    var UrlRouterProvider = /** @class */ (function () {
        /** @hidden */
        function UrlRouterProvider(router) {
            this._router = router;
            this._urlRouter = router.urlRouter;
        }
        UrlRouterProvider.injectableHandler = function (router, handler) {
            return function (match) { return services.$injector.invoke(handler, null, { $match: match, $stateParams: router.globals.params }); };
        };
        /** @hidden */
        UrlRouterProvider.prototype.$get = function () {
            var urlRouter = this._urlRouter;
            urlRouter.update(true);
            if (!urlRouter.interceptDeferred)
                urlRouter.listen();
            return urlRouter;
        };
        /**
         * Registers a url handler function.
         *
         * Registers a low level url handler (a `rule`).
         * A rule detects specific URL patterns and returns a redirect, or performs some action.
         *
         * If a rule returns a string, the URL is replaced with the string, and all rules are fired again.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // Here's an example of how you might allow case insensitive urls
         *   $urlRouterProvider.rule(function ($injector, $location) {
         *     var path = $location.path(),
         *         normalized = path.toLowerCase();
         *
         *     if (path !== normalized) {
         *       return normalized;
         *     }
         *   });
         * });
         * ```
         *
         * @param ruleFn
         * Handler function that takes `$injector` and `$location` services as arguments.
         * You can use them to detect a url and return a different url as a string.
         *
         * @return [[UrlRouterProvider]] (`this`)
         */
        UrlRouterProvider.prototype.rule = function (ruleFn) {
            var _this = this;
            if (!isFunction(ruleFn))
                throw new Error("'rule' must be a function");
            var match = function () { return ruleFn(services.$injector, _this._router.locationService); };
            var rule = new BaseUrlRule(match, identity);
            this._urlRouter.rule(rule);
            return this;
        };
        /**
         * Defines the path or behavior to use when no url can be matched.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // if the path doesn't match any of the urls you configured
         *   // otherwise will take care of routing the user to the
         *   // specified url
         *   $urlRouterProvider.otherwise('/index');
         *
         *   // Example of using function rule as param
         *   $urlRouterProvider.otherwise(function ($injector, $location) {
         *     return '/a/valid/url';
         *   });
         * });
         * ```
         *
         * @param rule
         * The url path you want to redirect to or a function rule that returns the url path or performs a `$state.go()`.
         * The function version is passed two params: `$injector` and `$location` services, and should return a url string.
         *
         * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
         */
        UrlRouterProvider.prototype.otherwise = function (rule) {
            var _this = this;
            var urlRouter = this._urlRouter;
            if (isString(rule)) {
                urlRouter.otherwise(rule);
            }
            else if (isFunction(rule)) {
                urlRouter.otherwise(function () { return rule(services.$injector, _this._router.locationService); });
            }
            else {
                throw new Error("'rule' must be a string or function");
            }
            return this;
        };
        /**
         * Registers a handler for a given url matching.
         *
         * If the handler is a string, it is
         * treated as a redirect, and is interpolated according to the syntax of match
         * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
         *
         * If the handler is a function, it is injectable.
         * It gets invoked if `$location` matches.
         * You have the option of inject the match object as `$match`.
         *
         * The handler can return
         *
         * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
         *   will continue trying to find another one that matches.
         * - **string** which is treated as a redirect and passed to `$location.url()`
         * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
         *     if ($state.$current.navigable !== state ||
         *         !equalForKeys($match, $stateParams) {
         *      $state.transitionTo(state, $match, false);
         *     }
         *   });
         * });
         * ```
         *
         * @param what A pattern string to match, compiled as a [[UrlMatcher]].
         * @param handler The path (or function that returns a path) that you want to redirect your user to.
         * @param ruleCallback [optional] A callback that receives the `rule` registered with [[UrlMatcher.rule]]
         *
         * Note: the handler may also invoke arbitrary code, such as `$state.go()`
         */
        UrlRouterProvider.prototype.when = function (what, handler) {
            if (isArray(handler) || isFunction(handler)) {
                handler = UrlRouterProvider.injectableHandler(this._router, handler);
            }
            this._urlRouter.when(what, handler);
            return this;
        };
        /**
         * Disables monitoring of the URL.
         *
         * Call this method before UI-Router has bootstrapped.
         * It will stop UI-Router from performing the initial url sync.
         *
         * This can be useful to perform some asynchronous initialization before the router starts.
         * Once the initialization is complete, call [[listen]] to tell UI-Router to start watching and synchronizing the URL.
         *
         * #### Example:
         * ```js
         * var app = angular.module('app', ['ui.router']);
         *
         * app.config(function ($urlRouterProvider) {
         *   // Prevent $urlRouter from automatically intercepting URL changes;
         *   $urlRouterProvider.deferIntercept();
         * })
         *
         * app.run(function (MyService, $urlRouter, $http) {
         *   $http.get("/stuff").then(function(resp) {
         *     MyService.doStuff(resp.data);
         *     $urlRouter.listen();
         *     $urlRouter.sync();
         *   });
         * });
         * ```
         *
         * @param defer Indicates whether to defer location change interception.
         *        Passing no parameter is equivalent to `true`.
         */
        UrlRouterProvider.prototype.deferIntercept = function (defer) {
            this._urlRouter.deferIntercept(defer);
        };
        return UrlRouterProvider;
    }());

    /**
     * # Angular 1 types
     *
     * UI-Router core provides various Typescript types which you can use for code completion and validating parameter values, etc.
     * The customizations to the core types for Angular UI-Router are documented here.
     *
     * The optional [[$resolve]] service is also documented here.
     *
     * @module ng1
     * @preferred
     */
    ng.module('ui.router.angular1', []);
    var mod_init = ng.module('ui.router.init', ['ng']);
    var mod_util = ng.module('ui.router.util', ['ui.router.init']);
    var mod_rtr = ng.module('ui.router.router', ['ui.router.util']);
    var mod_state = ng.module('ui.router.state', ['ui.router.router', 'ui.router.util', 'ui.router.angular1']);
    var mod_main = ng.module('ui.router', ['ui.router.init', 'ui.router.state', 'ui.router.angular1']);
    var mod_cmpt = ng.module('ui.router.compat', ['ui.router']); // tslint:disable-line
    var router = null;
    $uiRouterProvider.$inject = ['$locationProvider'];
    /** This angular 1 provider instantiates a Router and exposes its services via the angular injector */
    function $uiRouterProvider($locationProvider) {
        // Create a new instance of the Router when the $uiRouterProvider is initialized
        router = this.router = new UIRouter();
        router.stateProvider = new StateProvider(router.stateRegistry, router.stateService);
        // Apply ng1 specific StateBuilder code for `views`, `resolve`, and `onExit/Retain/Enter` properties
        router.stateRegistry.decorator('views', ng1ViewsBuilder);
        router.stateRegistry.decorator('onExit', getStateHookBuilder('onExit'));
        router.stateRegistry.decorator('onRetain', getStateHookBuilder('onRetain'));
        router.stateRegistry.decorator('onEnter', getStateHookBuilder('onEnter'));
        router.viewService._pluginapi._viewConfigFactory('ng1', getNg1ViewConfigFactory());
        var ng1LocationService = (router.locationService = router.locationConfig = new Ng1LocationServices($locationProvider));
        Ng1LocationServices.monkeyPatchPathParameterType(router);
        // backwards compat: also expose router instance as $uiRouterProvider.router
        router['router'] = router;
        router['$get'] = $get;
        $get.$inject = ['$location', '$browser', '$window', '$sniffer', '$rootScope', '$http', '$templateCache'];
        function $get($location, $browser, $window, $sniffer, $rootScope, $http, $templateCache) {
            ng1LocationService._runtimeServices($rootScope, $location, $sniffer, $browser, $window);
            delete router['router'];
            delete router['$get'];
            return router;
        }
        return router;
    }
    var getProviderFor = function (serviceName) { return [
        '$uiRouterProvider',
        function ($urp) {
            var service = $urp.router[serviceName];
            service['$get'] = function () { return service; };
            return service;
        },
    ]; };
    // This effectively calls $get() on `$uiRouterProvider` to trigger init (when ng enters runtime)
    runBlock.$inject = ['$injector', '$q', '$uiRouter'];
    function runBlock($injector$$1, $q$$1, $uiRouter) {
        services.$injector = $injector$$1;
        services.$q = $q$$1;
        // https://github.com/angular-ui/ui-router/issues/3678
        if (!$injector$$1.hasOwnProperty('strictDi')) {
            try {
                $injector$$1.invoke(function (checkStrictDi) { });
            }
            catch (error) {
                $injector$$1.strictDi = !!/strict mode/.exec(error && error.toString());
            }
        }
        // The $injector is now available.
        // Find any resolvables that had dependency annotation deferred
        $uiRouter.stateRegistry
            .get()
            .map(function (x) { return x.$$state().resolvables; })
            .reduce(unnestR, [])
            .filter(function (x) { return x.deps === 'deferred'; })
            .forEach(function (resolvable) { return (resolvable.deps = $injector$$1.annotate(resolvable.resolveFn, $injector$$1.strictDi)); });
    }
    // $urlRouter service and $urlRouterProvider
    var getUrlRouterProvider = function (uiRouter) { return (uiRouter.urlRouterProvider = new UrlRouterProvider(uiRouter)); };
    // $state service and $stateProvider
    // $urlRouter service and $urlRouterProvider
    var getStateProvider = function () { return extend(router.stateProvider, { $get: function () { return router.stateService; } }); };
    watchDigests.$inject = ['$rootScope'];
    function watchDigests($rootScope) {
        $rootScope.$watch(function () {
            trace.approximateDigests++;
        });
    }
    mod_init.provider('$uiRouter', $uiRouterProvider);
    mod_rtr.provider('$urlRouter', ['$uiRouterProvider', getUrlRouterProvider]);
    mod_util.provider('$urlService', getProviderFor('urlService'));
    mod_util.provider('$urlMatcherFactory', ['$uiRouterProvider', function () { return router.urlMatcherFactory; }]);
    mod_util.provider('$templateFactory', function () { return new TemplateFactory(); });
    mod_state.provider('$stateRegistry', getProviderFor('stateRegistry'));
    mod_state.provider('$uiRouterGlobals', getProviderFor('globals'));
    mod_state.provider('$transitions', getProviderFor('transitionService'));
    mod_state.provider('$state', ['$uiRouterProvider', getStateProvider]);
    mod_state.factory('$stateParams', ['$uiRouter', function ($uiRouter) { return $uiRouter.globals.params; }]);
    mod_main.factory('$view', function () { return router.viewService; });
    mod_main.service('$trace', function () { return trace; });
    mod_main.run(watchDigests);
    mod_util.run(['$urlMatcherFactory', function ($urlMatcherFactory) { }]);
    mod_state.run(['$state', function ($state) { }]);
    mod_rtr.run(['$urlRouter', function ($urlRouter) { }]);
    mod_init.run(runBlock);
    /** @hidden TODO: find a place to move this */
    var getLocals = function (ctx) {
        var tokens = ctx.getTokens().filter(isString);
        var tuples = tokens.map(function (key) {
            var resolvable = ctx.getResolvable(key);
            var waitPolicy = ctx.getPolicy(resolvable).async;
            return [key, waitPolicy === 'NOWAIT' ? resolvable.promise : resolvable.data];
        });
        return tuples.reduce(applyPairs, {});
    };

    /**
     * The current (or pending) State Parameters
     *
     * An injectable global **Service Object** which holds the state parameters for the latest **SUCCESSFUL** transition.
     *
     * The values are not updated until *after* a `Transition` successfully completes.
     *
     * **Also:** an injectable **Per-Transition Object** object which holds the pending state parameters for the pending `Transition` currently running.
     *
     * ### Deprecation warning:
     *
     * The value injected for `$stateParams` is different depending on where it is injected.
     *
     * - When injected into an angular service, the object injected is the global **Service Object** with the parameter values for the latest successful `Transition`.
     * - When injected into transition hooks, resolves, or view controllers, the object is the **Per-Transition Object** with the parameter values for the running `Transition`.
     *
     * Because of these confusing details, this service is deprecated.
     *
     * ### Instead of using the global `$stateParams` service object,
     * inject [[$uiRouterGlobals]] and use [[UIRouterGlobals.params]]
     *
     * ```js
     * MyService.$inject = ['$uiRouterGlobals'];
     * function MyService($uiRouterGlobals) {
     *   return {
     *     paramValues: function () {
     *       return $uiRouterGlobals.params;
     *     }
     *   }
     * }
     * ```
     *
     * ### Instead of using the per-transition `$stateParams` object,
     * inject the current `Transition` (as [[$transition$]]) and use [[Transition.params]]
     *
     * ```js
     * MyController.$inject = ['$transition$'];
     * function MyController($transition$) {
     *   var username = $transition$.params().username;
     *   // .. do something with username
     * }
     * ```
     *
     * ---
     *
     * This object can be injected into other services.
     *
     * #### Deprecated Example:
     * ```js
     * SomeService.$inject = ['$http', '$stateParams'];
     * function SomeService($http, $stateParams) {
     *   return {
     *     getUser: function() {
     *       return $http.get('/api/users/' + $stateParams.username);
     *     }
     *   }
     * };
     * angular.service('SomeService', SomeService);
     * ```
     * @deprecated
     */

    /**
     * # Angular 1 Directives
     *
     * These are the directives included in UI-Router for Angular 1.
     * These directives are used in templates to create viewports and link/navigate to states.
     *
     * @ng1api
     * @preferred
     * @module directives
     */ /** for typedoc */
    /** @hidden */
    function parseStateRef(ref) {
        var parsed;
        var paramsOnly = ref.match(/^\s*({[^}]*})\s*$/);
        if (paramsOnly)
            ref = '(' + paramsOnly[1] + ')';
        parsed = ref.replace(/\n/g, ' ').match(/^\s*([^(]*?)\s*(\((.*)\))?\s*$/);
        if (!parsed || parsed.length !== 4)
            throw new Error("Invalid state ref '" + ref + "'");
        return { state: parsed[1] || null, paramExpr: parsed[3] || null };
    }
    /** @hidden */
    function stateContext(el) {
        var $uiView = el.parent().inheritedData('$uiView');
        var path = parse('$cfg.path')($uiView);
        return path ? tail(path).state.name : undefined;
    }
    /** @hidden */
    function processedDef($state, $element, def) {
        var uiState = def.uiState || $state.current.name;
        var uiStateOpts = extend(defaultOpts($element, $state), def.uiStateOpts || {});
        var href = $state.href(uiState, def.uiStateParams, uiStateOpts);
        return { uiState: uiState, uiStateParams: def.uiStateParams, uiStateOpts: uiStateOpts, href: href };
    }
    /** @hidden */
    function getTypeInfo(el) {
        // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
        var isSvg = Object.prototype.toString.call(el.prop('href')) === '[object SVGAnimatedString]';
        var isForm = el[0].nodeName === 'FORM';
        return {
            attr: isForm ? 'action' : isSvg ? 'xlink:href' : 'href',
            isAnchor: el.prop('tagName').toUpperCase() === 'A',
            clickable: !isForm,
        };
    }
    /** @hidden */
    function clickHook(el, $state, $timeout, type, getDef) {
        return function (e) {
            var button = e.which || e.button, target = getDef();
            if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || el.attr('target'))) {
                // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
                var transition_1 = $timeout(function () {
                    if (!el.attr('disabled')) {
                        $state.go(target.uiState, target.uiStateParams, target.uiStateOpts);
                    }
                });
                e.preventDefault();
                // if the state has no URL, ignore one preventDefault from the <a> directive.
                var ignorePreventDefaultCount_1 = type.isAnchor && !target.href ? 1 : 0;
                e.preventDefault = function () {
                    if (ignorePreventDefaultCount_1-- <= 0)
                        $timeout.cancel(transition_1);
                };
            }
        };
    }
    /** @hidden */
    function defaultOpts(el, $state) {
        return {
            relative: stateContext(el) || $state.$current,
            inherit: true,
            source: 'sref',
        };
    }
    /** @hidden */
    function bindEvents(element, scope, hookFn, uiStateOpts) {
        var events;
        if (uiStateOpts) {
            events = uiStateOpts.events;
        }
        if (!isArray(events)) {
            events = ['click'];
        }
        var on = element.on ? 'on' : 'bind';
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            element[on](event_1, hookFn);
        }
        scope.$on('$destroy', function () {
            var off = element.off ? 'off' : 'unbind';
            for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
                var event_2 = events_2[_i];
                element[off](event_2, hookFn);
            }
        });
    }
    /**
     * `ui-sref`: A directive for linking to a state
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * ### Linked State
     * The attribute value of the `ui-sref` is the name of the state to link to.
     *
     * #### Example:
     * This will activate the `home` state when the link is clicked.
     * ```html
     * <a ui-sref="home">Home</a>
     * ```
     *
     * ### Relative Links
     * You can also use relative state paths within `ui-sref`, just like a relative path passed to `$state.go()` ([[StateService.go]]).
     * You just need to be aware that the path is relative to the state that *created* the link.
     * This allows a state to create a relative `ui-sref` which always targets the same destination.
     *
     * #### Example:
     * Both these links are relative to the parent state, even when a child state is currently active.
     * ```html
     * <a ui-sref=".child1">child 1 state</a>
     * <a ui-sref=".child2">child 2 state</a>
     * ```
     *
     * This link activates the parent state.
     * ```html
     * <a ui-sref="^">Return</a>
     * ```
     *
     * ### hrefs
     * If the linked state has a URL, the directive will automatically generate and
     * update the `href` attribute (using the [[StateService.href]]  method).
     *
     * #### Example:
     * Assuming the `users` state has a url of `/users/`
     * ```html
     * <a ui-sref="users" href="/users/">Users</a>
     * ```
     *
     * ### Parameter Values
     * In addition to the state name, a `ui-sref` can include parameter values which are applied when activating the state.
     * Param values can be provided in the `ui-sref` value after the state name, enclosed by parentheses.
     * The content inside the parentheses is an expression, evaluated to the parameter values.
     *
     * #### Example:
     * This example renders a list of links to users.
     * The state's `userId` parameter value comes from each user's `user.id` property.
     * ```html
     * <li ng-repeat="user in users">
     *   <a ui-sref="users.detail({ userId: user.id })">{{ user.displayName }}</a>
     * </li>
     * ```
     *
     * Note:
     * The parameter values expression is `$watch`ed for updates.
     *
     * ### Transition Options
     * You can specify [[TransitionOptions]] to pass to [[StateService.go]] by using the `ui-sref-opts` attribute.
     * Options are restricted to `location`, `inherit`, and `reload`.
     *
     * #### Example:
     * ```html
     * <a ui-sref="home" ui-sref-opts="{ reload: true }">Home</a>
     * ```
     *
     * ### Other DOM Events
     *
     * You can also customize which DOM events to respond to (instead of `click`) by
     * providing an `events` array in the `ui-sref-opts` attribute.
     *
     * #### Example:
     * ```html
     * <input type="text" ui-sref="contacts" ui-sref-opts="{ events: ['change', 'blur'] }">
     * ```
     *
     * ### Highlighting the active link
     * This directive can be used in conjunction with [[uiSrefActive]] to highlight the active link.
     *
     * ### Examples
     * If you have the following template:
     *
     * ```html
     * <a ui-sref="home">Home</a>
     * <a ui-sref="about">About</a>
     * <a ui-sref="{page: 2}">Next page</a>
     *
     * <ul>
     *     <li ng-repeat="contact in contacts">
     *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
     *     </li>
     * </ul>
     * ```
     *
     * Then (assuming the current state is `contacts`) the rendered html including hrefs would be:
     *
     * ```html
     * <a href="#/home" ui-sref="home">Home</a>
     * <a href="#/about" ui-sref="about">About</a>
     * <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
     *
     * <ul>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
     *     </li>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
     *     </li>
     *     <li ng-repeat="contact in contacts">
     *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
     *     </li>
     * </ul>
     *
     * <a href="#/home" ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
     * ```
     *
     * ### Notes
     *
     * - You can use `ui-sref` to change **only the parameter values** by omitting the state name and parentheses.
     * #### Example:
     * Sets the `lang` parameter to `en` and remains on the same state.
     *
     * ```html
     * <a ui-sref="{ lang: 'en' }">English</a>
     * ```
     *
     * - A middle-click, right-click, or ctrl-click is handled (natively) by the browser to open the href in a new window, for example.
     *
     * - Unlike the parameter values expression, the state name is not `$watch`ed (for performance reasons).
     * If you need to dynamically update the state being linked to, use the fully dynamic [[uiState]] directive.
     */
    var uiSrefDirective;
    uiSrefDirective = [
        '$uiRouter',
        '$timeout',
        function $StateRefDirective($uiRouter, $timeout) {
            var $state = $uiRouter.stateService;
            return {
                restrict: 'A',
                require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
                link: function (scope, element, attrs, uiSrefActive) {
                    var type = getTypeInfo(element);
                    var active = uiSrefActive[1] || uiSrefActive[0];
                    var unlinkInfoFn = null;
                    var hookFn;
                    var rawDef = {};
                    var getDef = function () { return processedDef($state, element, rawDef); };
                    var ref = parseStateRef(attrs.uiSref);
                    rawDef.uiState = ref.state;
                    rawDef.uiStateOpts = attrs.uiSrefOpts ? scope.$eval(attrs.uiSrefOpts) : {};
                    function update() {
                        var def = getDef();
                        if (unlinkInfoFn)
                            unlinkInfoFn();
                        if (active)
                            unlinkInfoFn = active.$$addStateInfo(def.uiState, def.uiStateParams);
                        if (def.href != null)
                            attrs.$set(type.attr, def.href);
                    }
                    if (ref.paramExpr) {
                        scope.$watch(ref.paramExpr, function (val$$1) {
                            rawDef.uiStateParams = extend({}, val$$1);
                            update();
                        }, true);
                        rawDef.uiStateParams = extend({}, scope.$eval(ref.paramExpr));
                    }
                    update();
                    scope.$on('$destroy', $uiRouter.stateRegistry.onStatesChanged(update));
                    scope.$on('$destroy', $uiRouter.transitionService.onSuccess({}, update));
                    if (!type.clickable)
                        return;
                    hookFn = clickHook(element, $state, $timeout, type, getDef);
                    bindEvents(element, scope, hookFn, rawDef.uiStateOpts);
                },
            };
        },
    ];
    /**
     * `ui-state`: A fully dynamic directive for linking to a state
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * **This directive is very similar to [[uiSref]], but it `$observe`s and `$watch`es/evaluates all its inputs.**
     *
     * A directive which links to a state (and optionally, parameters).
     * When clicked, this directive activates the linked state with the supplied parameter values.
     *
     * ### Linked State
     * The attribute value of `ui-state` is an expression which is `$watch`ed and evaluated as the state to link to.
     * **This is in contrast with `ui-sref`, which takes a state name as a string literal.**
     *
     * #### Example:
     * Create a list of links.
     * ```html
     * <li ng-repeat="link in navlinks">
     *   <a ui-state="link.state">{{ link.displayName }}</a>
     * </li>
     * ```
     *
     * ### Relative Links
     * If the expression evaluates to a relative path, it is processed like [[uiSref]].
     * You just need to be aware that the path is relative to the state that *created* the link.
     * This allows a state to create relative `ui-state` which always targets the same destination.
     *
     * ### hrefs
     * If the linked state has a URL, the directive will automatically generate and
     * update the `href` attribute (using the [[StateService.href]]  method).
     *
     * ### Parameter Values
     * In addition to the state name expression, a `ui-state` can include parameter values which are applied when activating the state.
     * Param values should be provided using the `ui-state-params` attribute.
     * The `ui-state-params` attribute value is `$watch`ed and evaluated as an expression.
     *
     * #### Example:
     * This example renders a list of links with param values.
     * The state's `userId` parameter value comes from each user's `user.id` property.
     * ```html
     * <li ng-repeat="link in navlinks">
     *   <a ui-state="link.state" ui-state-params="link.params">{{ link.displayName }}</a>
     * </li>
     * ```
     *
     * ### Transition Options
     * You can specify [[TransitionOptions]] to pass to [[StateService.go]] by using the `ui-state-opts` attribute.
     * Options are restricted to `location`, `inherit`, and `reload`.
     * The value of the `ui-state-opts` is `$watch`ed and evaluated as an expression.
     *
     * #### Example:
     * ```html
     * <a ui-state="returnto.state" ui-state-opts="{ reload: true }">Home</a>
     * ```
     *
     * ### Other DOM Events
     *
     * You can also customize which DOM events to respond to (instead of `click`) by
     * providing an `events` array in the `ui-state-opts` attribute.
     *
     * #### Example:
     * ```html
     * <input type="text" ui-state="contacts" ui-state-opts="{ events: ['change', 'blur'] }">
     * ```
     *
     * ### Highlighting the active link
     * This directive can be used in conjunction with [[uiSrefActive]] to highlight the active link.
     *
     * ### Notes
     *
     * - You can use `ui-params` to change **only the parameter values** by omitting the state name and supplying only `ui-state-params`.
     *   However, it might be simpler to use [[uiSref]] parameter-only links.
     *
     * #### Example:
     * Sets the `lang` parameter to `en` and remains on the same state.
     *
     * ```html
     * <a ui-state="" ui-state-params="{ lang: 'en' }">English</a>
     * ```
     *
     * - A middle-click, right-click, or ctrl-click is handled (natively) by the browser to open the href in a new window, for example.
     * ```
     */
    var uiStateDirective;
    uiStateDirective = [
        '$uiRouter',
        '$timeout',
        function $StateRefDynamicDirective($uiRouter, $timeout) {
            var $state = $uiRouter.stateService;
            return {
                restrict: 'A',
                require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
                link: function (scope, element, attrs, uiSrefActive) {
                    var type = getTypeInfo(element);
                    var active = uiSrefActive[1] || uiSrefActive[0];
                    var unlinkInfoFn = null;
                    var hookFn;
                    var rawDef = {};
                    var getDef = function () { return processedDef($state, element, rawDef); };
                    var inputAttrs = ['uiState', 'uiStateParams', 'uiStateOpts'];
                    var watchDeregFns = inputAttrs.reduce(function (acc, attr) { return ((acc[attr] = noop), acc); }, {});
                    function update() {
                        var def = getDef();
                        if (unlinkInfoFn)
                            unlinkInfoFn();
                        if (active)
                            unlinkInfoFn = active.$$addStateInfo(def.uiState, def.uiStateParams);
                        if (def.href != null)
                            attrs.$set(type.attr, def.href);
                    }
                    inputAttrs.forEach(function (field) {
                        rawDef[field] = attrs[field] ? scope.$eval(attrs[field]) : null;
                        attrs.$observe(field, function (expr) {
                            watchDeregFns[field]();
                            watchDeregFns[field] = scope.$watch(expr, function (newval) {
                                rawDef[field] = newval;
                                update();
                            }, true);
                        });
                    });
                    update();
                    scope.$on('$destroy', $uiRouter.stateRegistry.onStatesChanged(update));
                    scope.$on('$destroy', $uiRouter.transitionService.onSuccess({}, update));
                    if (!type.clickable)
                        return;
                    hookFn = clickHook(element, $state, $timeout, type, getDef);
                    bindEvents(element, scope, hookFn, rawDef.uiStateOpts);
                },
            };
        },
    ];
    /**
     * `ui-sref-active` and `ui-sref-active-eq`: A directive that adds a CSS class when a `ui-sref` is active
     *
     * A directive working alongside [[uiSref]] and [[uiState]] to add classes to an element when the
     * related directive's state is active (and remove them when it is inactive).
     *
     * The primary use-case is to highlight the active link in navigation menus,
     * distinguishing it from the inactive menu items.
     *
     * ### Linking to a `ui-sref` or `ui-state`
     * `ui-sref-active` can live on the same element as `ui-sref`/`ui-state`, or it can be on a parent element.
     * If a `ui-sref-active` is a parent to more than one `ui-sref`/`ui-state`, it will apply the CSS class when **any of the links are active**.
     *
     * ### Matching
     *
     * The `ui-sref-active` directive applies the CSS class when the `ui-sref`/`ui-state`'s target state **or any child state is active**.
     * This is a "fuzzy match" which uses [[StateService.includes]].
     *
     * The `ui-sref-active-eq` directive applies the CSS class when the `ui-sref`/`ui-state`'s target state is directly active (not when child states are active).
     * This is an "exact match" which uses [[StateService.is]].
     *
     * ### Parameter values
     * If the `ui-sref`/`ui-state` includes parameter values, the current parameter values must match the link's values for the link to be highlighted.
     * This allows a list of links to the same state with different parameters to be rendered, and the correct one highlighted.
     *
     * #### Example:
     * ```html
     * <li ng-repeat="user in users" ui-sref-active="active">
     *   <a ui-sref="user.details({ userId: user.id })">{{ user.lastName }}</a>
     * </li>
     * ```
     *
     * ### Examples
     *
     * Given the following template:
     * #### Example:
     * ```html
     * <ul>
     *   <li ui-sref-active="active" class="item">
     *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
     *   </li>
     * </ul>
     * ```
     *
     * When the app state is `app.user` (or any child state),
     * and contains the state parameter "user" with value "bilbobaggins",
     * the resulting HTML will appear as (note the 'active' class):
     *
     * ```html
     * <ul>
     *   <li ui-sref-active="active" class="item active">
     *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
     *   </li>
     * </ul>
     * ```
     *
     * ### Glob mode
     *
     * It is possible to pass `ui-sref-active` an expression that evaluates to an object.
     * The objects keys represent active class names and values represent the respective state names/globs.
     * `ui-sref-active` will match if the current active state **includes** any of
     * the specified state names/globs, even the abstract ones.
     *
     * #### Example:
     * Given the following template, with "admin" being an abstract state:
     * ```html
     * <div ui-sref-active="{'active': 'admin.**'}">
     *   <a ui-sref-active="active" ui-sref="admin.roles">Roles</a>
     * </div>
     * ```
     *
     * Arrays are also supported as values in the `ngClass`-like interface.
     * This allows multiple states to add `active` class.
     *
     * #### Example:
     * Given the following template, with "admin.roles" being the current state, the class will be added too:
     * ```html
     * <div ui-sref-active="{'active': ['owner.**', 'admin.**']}">
     *   <a ui-sref-active="active" ui-sref="admin.roles">Roles</a>
     * </div>
     * ```
     *
     * When the current state is "admin.roles" the "active" class will be applied to both the `<div>` and `<a>` elements.
     * It is important to note that the state names/globs passed to `ui-sref-active` override any state provided by a linked `ui-sref`.
     *
     * ### Notes:
     *
     * - The class name is interpolated **once** during the directives link time (any further changes to the
     * interpolated value are ignored).
     *
     * - Multiple classes may be specified in a space-separated format: `ui-sref-active='class1 class2 class3'`
     */
    var uiSrefActiveDirective;
    uiSrefActiveDirective = [
        '$state',
        '$stateParams',
        '$interpolate',
        '$uiRouter',
        function $StateRefActiveDirective($state, $stateParams, $interpolate, $uiRouter) {
            return {
                restrict: 'A',
                controller: [
                    '$scope',
                    '$element',
                    '$attrs',
                    function ($scope, $element, $attrs) {
                        var states = [];
                        var activeEqClass;
                        var uiSrefActive;
                        // There probably isn't much point in $observing this
                        // uiSrefActive and uiSrefActiveEq share the same directive object with some
                        // slight difference in logic routing
                        activeEqClass = $interpolate($attrs.uiSrefActiveEq || '', false)($scope);
                        try {
                            uiSrefActive = $scope.$eval($attrs.uiSrefActive);
                        }
                        catch (e) {
                            // Do nothing. uiSrefActive is not a valid expression.
                            // Fall back to using $interpolate below
                        }
                        uiSrefActive = uiSrefActive || $interpolate($attrs.uiSrefActive || '', false)($scope);
                        setStatesFromDefinitionObject(uiSrefActive);
                        // Allow uiSref to communicate with uiSrefActive[Equals]
                        this.$$addStateInfo = function (newState, newParams) {
                            // we already got an explicit state provided by ui-sref-active, so we
                            // shadow the one that comes from ui-sref
                            if (isObject(uiSrefActive) && states.length > 0) {
                                return;
                            }
                            var deregister = addState(newState, newParams, uiSrefActive);
                            update();
                            return deregister;
                        };
                        function updateAfterTransition(trans) {
                            trans.promise.then(update, noop);
                        }
                        $scope.$on('$destroy', setupEventListeners());
                        if ($uiRouter.globals.transition) {
                            updateAfterTransition($uiRouter.globals.transition);
                        }
                        function setupEventListeners() {
                            var deregisterStatesChangedListener = $uiRouter.stateRegistry.onStatesChanged(handleStatesChanged);
                            var deregisterOnStartListener = $uiRouter.transitionService.onStart({}, updateAfterTransition);
                            var deregisterStateChangeSuccessListener = $scope.$on('$stateChangeSuccess', update);
                            return function cleanUp() {
                                deregisterStatesChangedListener();
                                deregisterOnStartListener();
                                deregisterStateChangeSuccessListener();
                            };
                        }
                        function handleStatesChanged() {
                            setStatesFromDefinitionObject(uiSrefActive);
                        }
                        function setStatesFromDefinitionObject(statesDefinition) {
                            if (isObject(statesDefinition)) {
                                states = [];
                                forEach(statesDefinition, function (stateOrName, activeClass) {
                                    // Helper function to abstract adding state.
                                    var addStateForClass = function (stateOrName, activeClass) {
                                        var ref = parseStateRef(stateOrName);
                                        addState(ref.state, $scope.$eval(ref.paramExpr), activeClass);
                                    };
                                    if (isString(stateOrName)) {
                                        // If state is string, just add it.
                                        addStateForClass(stateOrName, activeClass);
                                    }
                                    else if (isArray(stateOrName)) {
                                        // If state is an array, iterate over it and add each array item individually.
                                        forEach(stateOrName, function (stateOrName) {
                                            addStateForClass(stateOrName, activeClass);
                                        });
                                    }
                                });
                            }
                        }
                        function addState(stateName, stateParams, activeClass) {
                            var state = $state.get(stateName, stateContext($element));
                            var stateInfo = {
                                state: state || { name: stateName },
                                params: stateParams,
                                activeClass: activeClass,
                            };
                            states.push(stateInfo);
                            return function removeState() {
                                removeFrom(states)(stateInfo);
                            };
                        }
                        // Update route state
                        function update() {
                            var splitClasses = function (str) { return str.split(/\s/).filter(identity); };
                            var getClasses = function (stateList) {
                                return stateList
                                    .map(function (x) { return x.activeClass; })
                                    .map(splitClasses)
                                    .reduce(unnestR, []);
                            };
                            var allClasses = getClasses(states)
                                .concat(splitClasses(activeEqClass))
                                .reduce(uniqR, []);
                            var fuzzyClasses = getClasses(states.filter(function (x) { return $state.includes(x.state.name, x.params); }));
                            var exactlyMatchesAny = !!states.filter(function (x) { return $state.is(x.state.name, x.params); }).length;
                            var exactClasses = exactlyMatchesAny ? splitClasses(activeEqClass) : [];
                            var addClasses = fuzzyClasses.concat(exactClasses).reduce(uniqR, []);
                            var removeClasses = allClasses.filter(function (cls) { return !inArray(addClasses, cls); });
                            $scope.$evalAsync(function () {
                                addClasses.forEach(function (className) { return $element.addClass(className); });
                                removeClasses.forEach(function (className) { return $element.removeClass(className); });
                            });
                        }
                        update();
                    },
                ],
            };
        },
    ];
    ng
        .module('ui.router.state')
        .directive('uiSref', uiSrefDirective)
        .directive('uiSrefActive', uiSrefActiveDirective)
        .directive('uiSrefActiveEq', uiSrefActiveDirective)
        .directive('uiState', uiStateDirective);

    /** @module ng1 */ /** for typedoc */
    /**
     * `isState` Filter: truthy if the current state is the parameter
     *
     * Translates to [[StateService.is]] `$state.is("stateName")`.
     *
     * #### Example:
     * ```html
     * <div ng-if="'stateName' | isState">show if state is 'stateName'</div>
     * ```
     */
    $IsStateFilter.$inject = ['$state'];
    function $IsStateFilter($state) {
        var isFilter = function (state, params, options) {
            return $state.is(state, params, options);
        };
        isFilter.$stateful = true;
        return isFilter;
    }
    /**
     * `includedByState` Filter: truthy if the current state includes the parameter
     *
     * Translates to [[StateService.includes]]` $state.is("fullOrPartialStateName")`.
     *
     * #### Example:
     * ```html
     * <div ng-if="'fullOrPartialStateName' | includedByState">show if state includes 'fullOrPartialStateName'</div>
     * ```
     */
    $IncludedByStateFilter.$inject = ['$state'];
    function $IncludedByStateFilter($state) {
        var includesFilter = function (state, params, options) {
            return $state.includes(state, params, options);
        };
        includesFilter.$stateful = true;
        return includesFilter;
    }
    ng
        .module('ui.router.state')
        .filter('isState', $IsStateFilter)
        .filter('includedByState', $IncludedByStateFilter);

    /**
     * @ng1api
     * @module directives
     */
    /**
     * `ui-view`: A viewport directive which is filled in by a view from the active state.
     *
     * ### Attributes
     *
     * - `name`: (Optional) A view name.
     *   The name should be unique amongst the other views in the same state.
     *   You can have views of the same name that live in different states.
     *   The ui-view can be targeted in a View using the name ([[Ng1StateDeclaration.views]]).
     *
     * - `autoscroll`: an expression. When it evaluates to true, the `ui-view` will be scrolled into view when it is activated.
     *   Uses [[$uiViewScroll]] to do the scrolling.
     *
     * - `onload`: Expression to evaluate whenever the view updates.
     *
     * #### Example:
     * A view can be unnamed or named.
     * ```html
     * <!-- Unnamed -->
     * <div ui-view></div>
     *
     * <!-- Named -->
     * <div ui-view="viewName"></div>
     *
     * <!-- Named (different style) -->
     * <ui-view name="viewName"></ui-view>
     * ```
     *
     * You can only have one unnamed view within any template (or root html). If you are only using a
     * single view and it is unnamed then you can populate it like so:
     *
     * ```html
     * <div ui-view></div>
     * $stateProvider.state("home", {
     *   template: "<h1>HELLO!</h1>"
     * })
     * ```
     *
     * The above is a convenient shortcut equivalent to specifying your view explicitly with the
     * [[Ng1StateDeclaration.views]] config property, by name, in this case an empty name:
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "": {
     *       template: "<h1>HELLO!</h1>"
     *     }
     *   }
     * })
     * ```
     *
     * But typically you'll only use the views property if you name your view or have more than one view
     * in the same template. There's not really a compelling reason to name a view if its the only one,
     * but you could if you wanted, like so:
     *
     * ```html
     * <div ui-view="main"></div>
     * ```
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "main": {
     *       template: "<h1>HELLO!</h1>"
     *     }
     *   }
     * })
     * ```
     *
     * Really though, you'll use views to set up multiple views:
     *
     * ```html
     * <div ui-view></div>
     * <div ui-view="chart"></div>
     * <div ui-view="data"></div>
     * ```
     *
     * ```js
     * $stateProvider.state("home", {
     *   views: {
     *     "": {
     *       template: "<h1>HELLO!</h1>"
     *     },
     *     "chart": {
     *       template: "<chart_thing/>"
     *     },
     *     "data": {
     *       template: "<data_thing/>"
     *     }
     *   }
     * })
     * ```
     *
     * #### Examples for `autoscroll`:
     * ```html
     * <!-- If autoscroll present with no expression,
     *      then scroll ui-view into view -->
     * <ui-view autoscroll/>
     *
     * <!-- If autoscroll present with valid expression,
     *      then scroll ui-view into view if expression evaluates to true -->
     * <ui-view autoscroll='true'/>
     * <ui-view autoscroll='false'/>
     * <ui-view autoscroll='scopeVariable'/>
     * ```
     *
     * Resolve data:
     *
     * The resolved data from the state's `resolve` block is placed on the scope as `$resolve` (this
     * can be customized using [[Ng1ViewDeclaration.resolveAs]]).  This can be then accessed from the template.
     *
     * Note that when `controllerAs` is being used, `$resolve` is set on the controller instance *after* the
     * controller is instantiated.  The `$onInit()` hook can be used to perform initialization code which
     * depends on `$resolve` data.
     *
     * #### Example:
     * ```js
     * $stateProvider.state('home', {
     *   template: '<my-component user="$resolve.user"></my-component>',
     *   resolve: {
     *     user: function(UserService) { return UserService.fetchUser(); }
     *   }
     * });
     * ```
     */
    var uiView;
    uiView = [
        '$view',
        '$animate',
        '$uiViewScroll',
        '$interpolate',
        '$q',
        function $ViewDirective($view, $animate, $uiViewScroll, $interpolate, $q$$1) {
            function getRenderer(attrs, scope) {
                return {
                    enter: function (element, target, cb) {
                        if (ng.version.minor > 2) {
                            $animate.enter(element, null, target).then(cb);
                        }
                        else {
                            $animate.enter(element, null, target, cb);
                        }
                    },
                    leave: function (element, cb) {
                        if (ng.version.minor > 2) {
                            $animate.leave(element).then(cb);
                        }
                        else {
                            $animate.leave(element, cb);
                        }
                    },
                };
            }
            function configsEqual(config1, config2) {
                return config1 === config2;
            }
            var rootData = {
                $cfg: { viewDecl: { $context: $view._pluginapi._rootViewContext() } },
                $uiView: {},
            };
            var directive = {
                count: 0,
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                compile: function (tElement, tAttrs, $transclude) {
                    return function (scope, $element, attrs) {
                        var onloadExp = attrs['onload'] || '', autoScrollExp = attrs['autoscroll'], renderer = getRenderer(attrs, scope), inherited = $element.inheritedData('$uiView') || rootData, name = $interpolate(attrs['uiView'] || attrs['name'] || '')(scope) || '$default';
                        var previousEl, currentEl, currentScope, viewConfig, unregister;
                        var activeUIView = {
                            $type: 'ng1',
                            id: directive.count++,
                            name: name,
                            fqn: inherited.$uiView.fqn ? inherited.$uiView.fqn + '.' + name : name,
                            config: null,
                            configUpdated: configUpdatedCallback,
                            get creationContext() {
                                // The context in which this ui-view "tag" was created
                                var fromParentTagConfig = parse('$cfg.viewDecl.$context')(inherited);
                                // Allow <ui-view name="foo"><ui-view name="bar"></ui-view></ui-view>
                                // See https://github.com/angular-ui/ui-router/issues/3355
                                var fromParentTag = parse('$uiView.creationContext')(inherited);
                                return fromParentTagConfig || fromParentTag;
                            },
                        };
                        trace.traceUIViewEvent('Linking', activeUIView);
                        function configUpdatedCallback(config) {
                            if (config && !(config instanceof Ng1ViewConfig))
                                return;
                            if (configsEqual(viewConfig, config))
                                return;
                            trace.traceUIViewConfigUpdated(activeUIView, config && config.viewDecl && config.viewDecl.$context);
                            viewConfig = config;
                            updateView(config);
                        }
                        $element.data('$uiView', { $uiView: activeUIView });
                        updateView();
                        unregister = $view.registerUIView(activeUIView);
                        scope.$on('$destroy', function () {
                            trace.traceUIViewEvent('Destroying/Unregistering', activeUIView);
                            unregister();
                        });
                        function cleanupLastView() {
                            if (previousEl) {
                                trace.traceUIViewEvent('Removing (previous) el', previousEl.data('$uiView'));
                                previousEl.remove();
                                previousEl = null;
                            }
                            if (currentScope) {
                                trace.traceUIViewEvent('Destroying scope', activeUIView);
                                currentScope.$destroy();
                                currentScope = null;
                            }
                            if (currentEl) {
                                var _viewData_1 = currentEl.data('$uiViewAnim');
                                trace.traceUIViewEvent('Animate out', _viewData_1);
                                renderer.leave(currentEl, function () {
                                    _viewData_1.$$animLeave.resolve();
                                    previousEl = null;
                                });
                                previousEl = currentEl;
                                currentEl = null;
                            }
                        }
                        function updateView(config) {
                            var newScope = scope.$new();
                            var animEnter = $q$$1.defer(), animLeave = $q$$1.defer();
                            var $uiViewData = {
                                $cfg: config,
                                $uiView: activeUIView,
                            };
                            var $uiViewAnim = {
                                $animEnter: animEnter.promise,
                                $animLeave: animLeave.promise,
                                $$animLeave: animLeave,
                            };
                            /**
                             * @ngdoc event
                             * @name ui.router.state.directive:ui-view#$viewContentLoading
                             * @eventOf ui.router.state.directive:ui-view
                             * @eventType emits on ui-view directive scope
                             * @description
                             *
                             * Fired once the view **begins loading**, *before* the DOM is rendered.
                             *
                             * @param {Object} event Event object.
                             * @param {string} viewName Name of the view.
                             */
                            newScope.$emit('$viewContentLoading', name);
                            var cloned = $transclude(newScope, function (clone) {
                                clone.data('$uiViewAnim', $uiViewAnim);
                                clone.data('$uiView', $uiViewData);
                                renderer.enter(clone, $element, function onUIViewEnter() {
                                    animEnter.resolve();
                                    if (currentScope)
                                        currentScope.$emit('$viewContentAnimationEnded');
                                    if ((isDefined(autoScrollExp) && !autoScrollExp) || scope.$eval(autoScrollExp)) {
                                        $uiViewScroll(clone);
                                    }
                                });
                                cleanupLastView();
                            });
                            currentEl = cloned;
                            currentScope = newScope;
                            /**
                             * @ngdoc event
                             * @name ui.router.state.directive:ui-view#$viewContentLoaded
                             * @eventOf ui.router.state.directive:ui-view
                             * @eventType emits on ui-view directive scope
                             * @description           *
                             * Fired once the view is **loaded**, *after* the DOM is rendered.
                             *
                             * @param {Object} event Event object.
                             */
                            currentScope.$emit('$viewContentLoaded', config || viewConfig);
                            currentScope.$eval(onloadExp);
                        }
                    };
                },
            };
            return directive;
        },
    ];
    $ViewDirectiveFill.$inject = ['$compile', '$controller', '$transitions', '$view', '$q', '$timeout'];
    /** @hidden */
    function $ViewDirectiveFill($compile, $controller, $transitions, $view, $q$$1, $timeout) {
        var getControllerAs = parse('viewDecl.controllerAs');
        var getResolveAs = parse('viewDecl.resolveAs');
        return {
            restrict: 'ECA',
            priority: -400,
            compile: function (tElement) {
                var initial = tElement.html();
                tElement.empty();
                return function (scope, $element) {
                    var data = $element.data('$uiView');
                    if (!data) {
                        $element.html(initial);
                        $compile($element.contents())(scope);
                        return;
                    }
                    var cfg = data.$cfg || { viewDecl: {}, getTemplate: noop };
                    var resolveCtx = cfg.path && new ResolveContext(cfg.path);
                    $element.html(cfg.getTemplate($element, resolveCtx) || initial);
                    trace.traceUIViewFill(data.$uiView, $element.html());
                    var link = $compile($element.contents());
                    var controller = cfg.controller;
                    var controllerAs = getControllerAs(cfg);
                    var resolveAs = getResolveAs(cfg);
                    var locals = resolveCtx && getLocals(resolveCtx);
                    scope[resolveAs] = locals;
                    if (controller) {
                        var controllerInstance = ($controller(controller, extend({}, locals, { $scope: scope, $element: $element })));
                        if (controllerAs) {
                            scope[controllerAs] = controllerInstance;
                            scope[controllerAs][resolveAs] = locals;
                        }
                        // TODO: Use $view service as a central point for registering component-level hooks
                        // Then, when a component is created, tell the $view service, so it can invoke hooks
                        // $view.componentLoaded(controllerInstance, { $scope: scope, $element: $element });
                        // scope.$on('$destroy', () => $view.componentUnloaded(controllerInstance, { $scope: scope, $element: $element }));
                        $element.data('$ngControllerController', controllerInstance);
                        $element.children().data('$ngControllerController', controllerInstance);
                        registerControllerCallbacks($q$$1, $transitions, controllerInstance, scope, cfg);
                    }
                    // Wait for the component to appear in the DOM
                    if (isString(cfg.component)) {
                        var kebobName = kebobString(cfg.component);
                        var tagRegexp_1 = new RegExp("^(x-|data-)?" + kebobName + "$", 'i');
                        var getComponentController = function () {
                            var directiveEl = [].slice
                                .call($element[0].children)
                                .filter(function (el) { return el && el.tagName && tagRegexp_1.exec(el.tagName); });
                            return directiveEl && ng.element(directiveEl).data("$" + cfg.component + "Controller");
                        };
                        var deregisterWatch_1 = scope.$watch(getComponentController, function (ctrlInstance) {
                            if (!ctrlInstance)
                                return;
                            registerControllerCallbacks($q$$1, $transitions, ctrlInstance, scope, cfg);
                            deregisterWatch_1();
                        });
                    }
                    link(scope);
                };
            },
        };
    }
    /** @hidden */
    var hasComponentImpl = typeof ng.module('ui.router')['component'] === 'function';
    /** @hidden incrementing id */
    var _uiCanExitId = 0;
    /** @hidden TODO: move these callbacks to $view and/or `/hooks/components.ts` or something */
    function registerControllerCallbacks($q$$1, $transitions, controllerInstance, $scope, cfg) {
        // Call $onInit() ASAP
        if (isFunction(controllerInstance.$onInit) && !(cfg.viewDecl.component && hasComponentImpl)) {
            controllerInstance.$onInit();
        }
        var viewState = tail(cfg.path).state.self;
        var hookOptions = { bind: controllerInstance };
        // Add component-level hook for onUiParamsChanged
        if (isFunction(controllerInstance.uiOnParamsChanged)) {
            var resolveContext = new ResolveContext(cfg.path);
            var viewCreationTrans_1 = resolveContext.getResolvable('$transition$').data;
            // Fire callback on any successful transition
            var paramsUpdated = function ($transition$) {
                // Exit early if the $transition$ is the same as the view was created within.
                // Exit early if the $transition$ will exit the state the view is for.
                if ($transition$ === viewCreationTrans_1 || $transition$.exiting().indexOf(viewState) !== -1)
                    return;
                var toParams = $transition$.params('to');
                var fromParams = $transition$.params('from');
                var getNodeSchema = function (node) { return node.paramSchema; };
                var toSchema = $transition$
                    .treeChanges('to')
                    .map(getNodeSchema)
                    .reduce(unnestR, []);
                var fromSchema = $transition$
                    .treeChanges('from')
                    .map(getNodeSchema)
                    .reduce(unnestR, []);
                // Find the to params that have different values than the from params
                var changedToParams = toSchema.filter(function (param) {
                    var idx = fromSchema.indexOf(param);
                    return idx === -1 || !fromSchema[idx].type.equals(toParams[param.id], fromParams[param.id]);
                });
                // Only trigger callback if a to param has changed or is new
                if (changedToParams.length) {
                    var changedKeys_1 = changedToParams.map(function (x) { return x.id; });
                    // Filter the params to only changed/new to params.  `$transition$.params()` may be used to get all params.
                    var newValues = filter(toParams, function (val$$1, key) { return changedKeys_1.indexOf(key) !== -1; });
                    controllerInstance.uiOnParamsChanged(newValues, $transition$);
                }
            };
            $scope.$on('$destroy', $transitions.onSuccess({}, paramsUpdated, hookOptions));
        }
        // Add component-level hook for uiCanExit
        if (isFunction(controllerInstance.uiCanExit)) {
            var id_1 = _uiCanExitId++;
            var cacheProp_1 = '_uiCanExitIds';
            // Returns true if a redirect transition already answered truthy
            var prevTruthyAnswer_1 = function (trans) {
                return !!trans && ((trans[cacheProp_1] && trans[cacheProp_1][id_1] === true) || prevTruthyAnswer_1(trans.redirectedFrom()));
            };
            // If a user answered yes, but the transition was later redirected, don't also ask for the new redirect transition
            var wrappedHook = function (trans) {
                var promise;
                var ids = (trans[cacheProp_1] = trans[cacheProp_1] || {});
                if (!prevTruthyAnswer_1(trans)) {
                    promise = $q$$1.when(controllerInstance.uiCanExit(trans));
                    promise.then(function (val$$1) { return (ids[id_1] = val$$1 !== false); });
                }
                return promise;
            };
            var criteria = { exiting: viewState.name };
            $scope.$on('$destroy', $transitions.onBefore(criteria, wrappedHook, hookOptions));
        }
    }
    ng.module('ui.router.state').directive('uiView', uiView);
    ng.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

    /** @module ng1 */ /** */
    /** @hidden */
    function $ViewScrollProvider() {
        var useAnchorScroll = false;
        this.useAnchorScroll = function () {
            useAnchorScroll = true;
        };
        this.$get = [
            '$anchorScroll',
            '$timeout',
            function ($anchorScroll, $timeout) {
                if (useAnchorScroll) {
                    return $anchorScroll;
                }
                return function ($element) {
                    return $timeout(function () {
                        $element[0].scrollIntoView();
                    }, 0, false);
                };
            },
        ];
    }
    ng.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

    /**
     * Main entry point for angular 1.x build
     * @module ng1
     */ /** */
    var index$1 = 'ui.router';

    exports.default = index$1;
    exports.core = index;
    exports.watchDigests = watchDigests;
    exports.getLocals = getLocals;
    exports.getNg1ViewConfigFactory = getNg1ViewConfigFactory;
    exports.ng1ViewsBuilder = ng1ViewsBuilder;
    exports.Ng1ViewConfig = Ng1ViewConfig;
    exports.StateProvider = StateProvider;
    exports.UrlRouterProvider = UrlRouterProvider;
    exports.root = root;
    exports.fromJson = fromJson;
    exports.toJson = toJson;
    exports.forEach = forEach;
    exports.extend = extend;
    exports.equals = equals;
    exports.identity = identity;
    exports.noop = noop;
    exports.createProxyFunctions = createProxyFunctions;
    exports.inherit = inherit;
    exports.inArray = inArray;
    exports._inArray = _inArray;
    exports.removeFrom = removeFrom;
    exports._removeFrom = _removeFrom;
    exports.pushTo = pushTo;
    exports._pushTo = _pushTo;
    exports.deregAll = deregAll;
    exports.defaults = defaults;
    exports.mergeR = mergeR;
    exports.ancestors = ancestors;
    exports.pick = pick;
    exports.omit = omit;
    exports.pluck = pluck;
    exports.filter = filter;
    exports.find = find;
    exports.mapObj = mapObj;
    exports.map = map;
    exports.values = values;
    exports.allTrueR = allTrueR;
    exports.anyTrueR = anyTrueR;
    exports.unnestR = unnestR;
    exports.flattenR = flattenR;
    exports.pushR = pushR;
    exports.uniqR = uniqR;
    exports.unnest = unnest;
    exports.flatten = flatten;
    exports.assertPredicate = assertPredicate;
    exports.assertMap = assertMap;
    exports.assertFn = assertFn;
    exports.pairs = pairs;
    exports.arrayTuples = arrayTuples;
    exports.applyPairs = applyPairs;
    exports.tail = tail;
    exports.copy = copy;
    exports._extend = _extend;
    exports.silenceUncaughtInPromise = silenceUncaughtInPromise;
    exports.silentRejection = silentRejection;
    exports.notImplemented = notImplemented;
    exports.services = services;
    exports.Glob = Glob;
    exports.curry = curry;
    exports.compose = compose;
    exports.pipe = pipe;
    exports.prop = prop;
    exports.propEq = propEq;
    exports.parse = parse;
    exports.not = not;
    exports.and = and;
    exports.or = or;
    exports.all = all;
    exports.any = any;
    exports.is = is;
    exports.eq = eq;
    exports.val = val;
    exports.invoke = invoke;
    exports.pattern = pattern;
    exports.isUndefined = isUndefined;
    exports.isDefined = isDefined;
    exports.isNull = isNull;
    exports.isNullOrUndefined = isNullOrUndefined;
    exports.isFunction = isFunction;
    exports.isNumber = isNumber;
    exports.isString = isString;
    exports.isObject = isObject;
    exports.isArray = isArray;
    exports.isDate = isDate;
    exports.isRegExp = isRegExp;
    exports.isInjectable = isInjectable;
    exports.isPromise = isPromise;
    exports.Queue = Queue;
    exports.maxLength = maxLength;
    exports.padString = padString;
    exports.kebobString = kebobString;
    exports.functionToString = functionToString;
    exports.fnToString = fnToString;
    exports.stringify = stringify;
    exports.beforeAfterSubstr = beforeAfterSubstr;
    exports.hostRegex = hostRegex;
    exports.stripLastPathElement = stripLastPathElement;
    exports.splitHash = splitHash;
    exports.splitQuery = splitQuery;
    exports.splitEqual = splitEqual;
    exports.trimHashVal = trimHashVal;
    exports.splitOnDelim = splitOnDelim;
    exports.joinNeighborsR = joinNeighborsR;
    exports.Trace = Trace;
    exports.trace = trace;
    exports.Param = Param;
    exports.ParamTypes = ParamTypes;
    exports.StateParams = StateParams;
    exports.ParamType = ParamType;
    exports.PathNode = PathNode;
    exports.PathUtils = PathUtils;
    exports.resolvePolicies = resolvePolicies;
    exports.defaultResolvePolicy = defaultResolvePolicy;
    exports.Resolvable = Resolvable;
    exports.NATIVE_INJECTOR_TOKEN = NATIVE_INJECTOR_TOKEN;
    exports.ResolveContext = ResolveContext;
    exports.resolvablesBuilder = resolvablesBuilder;
    exports.StateBuilder = StateBuilder;
    exports.StateObject = StateObject;
    exports.StateMatcher = StateMatcher;
    exports.StateQueueManager = StateQueueManager;
    exports.StateRegistry = StateRegistry;
    exports.StateService = StateService;
    exports.TargetState = TargetState;
    exports.HookBuilder = HookBuilder;
    exports.matchState = matchState;
    exports.RegisteredHook = RegisteredHook;
    exports.makeEvent = makeEvent;
    exports.Rejection = Rejection;
    exports.Transition = Transition;
    exports.TransitionHook = TransitionHook;
    exports.TransitionEventType = TransitionEventType;
    exports.defaultTransOpts = defaultTransOpts;
    exports.TransitionService = TransitionService;
    exports.UrlMatcher = UrlMatcher;
    exports.ParamFactory = ParamFactory;
    exports.UrlMatcherFactory = UrlMatcherFactory;
    exports.UrlRouter = UrlRouter;
    exports.UrlRuleFactory = UrlRuleFactory;
    exports.BaseUrlRule = BaseUrlRule;
    exports.UrlService = UrlService;
    exports.ViewService = ViewService;
    exports.UIRouterGlobals = UIRouterGlobals;
    exports.UIRouter = UIRouter;
    exports.$q = $q;
    exports.$injector = $injector;
    exports.BaseLocationServices = BaseLocationServices;
    exports.HashLocationService = HashLocationService;
    exports.MemoryLocationService = MemoryLocationService;
    exports.PushStateLocationService = PushStateLocationService;
    exports.MemoryLocationConfig = MemoryLocationConfig;
    exports.BrowserLocationConfig = BrowserLocationConfig;
    exports.keyValsToObjectR = keyValsToObjectR;
    exports.getParams = getParams;
    exports.parseUrl = parseUrl$1;
    exports.buildUrl = buildUrl;
    exports.locationPluginFactory = locationPluginFactory;
    exports.servicesPlugin = servicesPlugin;
    exports.hashLocationPlugin = hashLocationPlugin;
    exports.pushStateLocationPlugin = pushStateLocationPlugin;
    exports.memoryLocationPlugin = memoryLocationPlugin;
    exports.UIRouterPluginBase = UIRouterPluginBase;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-ui-router.js.map

/**
 * oclazyload - Load modules on demand (lazy load) with angularJS
 * @version v1.0.10
 * @link https://github.com/ocombe/ocLazyLoad
 * @license MIT
 * @author Olivier Combe <olivier.combe@gmail.com>
 */
!function(e,n){"use strict";var r=["ng","oc.lazyLoad"],o={},t=[],i=[],a=[],s=[],u=e.noop,c={},d=[],l=e.module("oc.lazyLoad",["ng"]);l.provider("$ocLazyLoad",["$controllerProvider","$provide","$compileProvider","$filterProvider","$injector","$animateProvider",function(l,f,p,m,v,y){function L(n,o,t){if(o){var i,s,l,f=[];for(i=o.length-1;i>=0;i--)if(s=o[i],e.isString(s)||(s=E(s)),s&&-1===d.indexOf(s)&&(!w[s]||-1!==a.indexOf(s))){var h=-1===r.indexOf(s);if(l=g(s),h&&(r.push(s),L(n,l.requires,t)),l._runBlocks.length>0)for(c[s]=[];l._runBlocks.length>0;)c[s].push(l._runBlocks.shift());e.isDefined(c[s])&&(h||t.rerun)&&(f=f.concat(c[s])),j(n,l._invokeQueue,s,t.reconfig),j(n,l._configBlocks,s,t.reconfig),u(h?"ocLazyLoad.moduleLoaded":"ocLazyLoad.moduleReloaded",s),o.pop(),d.push(s)}var p=n.getInstanceInjector();e.forEach(f,function(e){p.invoke(e)})}}function $(n,r){function t(n,r){var o,t=!0;return r.length&&(o=i(n),e.forEach(r,function(e){t=t&&i(e)!==o})),t}function i(n){return e.isArray(n)?M(n.toString()):e.isObject(n)?M(S(n)):e.isDefined(n)&&null!==n?M(n.toString()):n}var a=n[2][0],s=n[1],c=!1;e.isUndefined(o[r])&&(o[r]={}),e.isUndefined(o[r][s])&&(o[r][s]={});var d=function(e,n){o[r][s].hasOwnProperty(e)||(o[r][s][e]=[]),t(n,o[r][s][e])&&(c=!0,o[r][s][e].push(n),u("ocLazyLoad.componentLoaded",[r,s,e]))};if(e.isString(a))d(a,n[2][1]);else{if(!e.isObject(a))return!1;e.forEach(a,function(n,r){e.isString(n)?d(n,a[1]):d(r,n)})}return c}function j(n,r,o,i){if(r){var a,s,u,c;for(a=0,s=r.length;s>a;a++)if(u=r[a],e.isArray(u)){if(null!==n){if(!n.hasOwnProperty(u[0]))throw new Error("unsupported provider "+u[0]);c=n[u[0]]}var d=$(u,o);if("invoke"!==u[1])d&&e.isDefined(c)&&c[u[1]].apply(c,u[2]);else{var l=function(n){var r=t.indexOf(o+"-"+n);(-1===r||i)&&(-1===r&&t.push(o+"-"+n),e.isDefined(c)&&c[u[1]].apply(c,u[2]))};if(e.isFunction(u[2][0]))l(u[2][0]);else if(e.isArray(u[2][0]))for(var f=0,h=u[2][0].length;h>f;f++)e.isFunction(u[2][0][f])&&l(u[2][0][f])}}}}function E(n){var r=null;return e.isString(n)?r=n:e.isObject(n)&&n.hasOwnProperty("name")&&e.isString(n.name)&&(r=n.name),r}function _(n){if(!e.isString(n))return!1;try{return g(n)}catch(r){if(/No module/.test(r)||r.message.indexOf("$injector:nomod")>-1)return!1}}var w={},O={$controllerProvider:l,$compileProvider:p,$filterProvider:m,$provide:f,$injector:v,$animateProvider:y},x=!1,b=!1,z=[],D={};z.push=function(e){-1===this.indexOf(e)&&Array.prototype.push.apply(this,arguments)},this.config=function(n){e.isDefined(n.modules)&&(e.isArray(n.modules)?e.forEach(n.modules,function(e){w[e.name]=e}):w[n.modules.name]=n.modules),e.isDefined(n.debug)&&(x=n.debug),e.isDefined(n.events)&&(b=n.events)},this._init=function(o){if(0===i.length){var t=[o],a=["ng:app","ng-app","x-ng-app","data-ng-app"],u=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/,c=function(e){return e&&t.push(e)};e.forEach(a,function(n){a[n]=!0,c(document.getElementById(n)),n=n.replace(":","\\:"),"undefined"!=typeof o[0]&&o[0].querySelectorAll&&(e.forEach(o[0].querySelectorAll("."+n),c),e.forEach(o[0].querySelectorAll("."+n+"\\:"),c),e.forEach(o[0].querySelectorAll("["+n+"]"),c))}),e.forEach(t,function(n){if(0===i.length){var r=" "+o.className+" ",t=u.exec(r);t?i.push((t[2]||"").replace(/\s+/g,",")):e.forEach(n.attributes,function(e){0===i.length&&a[e.name]&&i.push(e.value)})}})}0!==i.length||(n.jasmine||n.mocha)&&e.isDefined(e.mock)||console.error("No module found during bootstrap, unable to init ocLazyLoad. You should always use the ng-app directive or angular.boostrap when you use ocLazyLoad.");var d=function l(n){if(-1===r.indexOf(n)){r.push(n);var o=e.module(n);j(null,o._invokeQueue,n),j(null,o._configBlocks,n),e.forEach(o.requires,l)}};e.forEach(i,function(e){d(e)}),i=[],s.pop()};var S=function(n){try{return JSON.stringify(n)}catch(r){var o=[];return JSON.stringify(n,function(n,r){if(e.isObject(r)&&null!==r){if(-1!==o.indexOf(r))return;o.push(r)}return r})}},M=function(e){var n,r,o,t=0;if(0==e.length)return t;for(n=0,o=e.length;o>n;n++)r=e.charCodeAt(n),t=(t<<5)-t+r,t|=0;return t};this.$get=["$log","$rootElement","$rootScope","$cacheFactory","$q",function(n,t,a,c,l){function f(e){var r=l.defer();return n.error(e.message),r.reject(e),r.promise}var p,m=c("ocLazyLoad");return x||(n={},n.error=e.noop,n.warn=e.noop,n.info=e.noop),O.getInstanceInjector=function(){return p?p:p=t.data("$injector")||e.injector()},u=function(e,r){b&&a.$broadcast(e,r),x&&n.info(e,r)},{_broadcast:u,_$log:n,_getFilesCache:function(){return m},toggleWatch:function(e){e?s.push(!0):s.pop()},getModuleConfig:function(n){if(!e.isString(n))throw new Error("You need to give the name of the module to get");return w[n]?e.copy(w[n]):null},setModuleConfig:function(n){if(!e.isObject(n))throw new Error("You need to give the module config object to set");return w[n.name]=n,n},getModules:function(){return r},isLoaded:function(n){var o=function(e){var n=r.indexOf(e)>-1;return n||(n=!!_(e)),n};if(e.isString(n)&&(n=[n]),e.isArray(n)){var t,i;for(t=0,i=n.length;i>t;t++)if(!o(n[t]))return!1;return!0}throw new Error("You need to define the module(s) name(s)")},_getModuleName:E,_getModule:function(e){try{return g(e)}catch(n){throw(/No module/.test(n)||n.message.indexOf("$injector:nomod")>-1)&&(n.message='The module "'+S(e)+'" that you are trying to load does not exist. '+n.message),n}},moduleExists:_,_loadDependencies:function(n,r){var o,t,i,a=[],s=this;if(n=s._getModuleName(n),null===n)return l.when();try{o=s._getModule(n)}catch(u){return f(u)}return t=s.getRequires(o),e.forEach(t,function(o){if(e.isString(o)){var t=s.getModuleConfig(o);if(null===t)return void z.push(o);o=t,t.name=void 0}if(s.moduleExists(o.name))return i=o.files.filter(function(e){return s.getModuleConfig(o.name).files.indexOf(e)<0}),0!==i.length&&s._$log.warn('Module "',n,'" attempted to redefine configuration for dependency. "',o.name,'"\n Additional Files Loaded:',i),e.isDefined(s.filesLoader)?void a.push(s.filesLoader(o,r).then(function(){return s._loadDependencies(o)})):f(new Error("Error: New dependencies need to be loaded from external files ("+o.files+"), but no loader has been defined."));if(e.isArray(o)){var u=[];e.forEach(o,function(e){var n=s.getModuleConfig(e);null===n?u.push(e):n.files&&(u=u.concat(n.files))}),u.length>0&&(o={files:u})}else e.isObject(o)&&o.hasOwnProperty("name")&&o.name&&(s.setModuleConfig(o),z.push(o.name));if(e.isDefined(o.files)&&0!==o.files.length){if(!e.isDefined(s.filesLoader))return f(new Error('Error: the module "'+o.name+'" is defined in external files ('+o.files+"), but no loader has been defined."));a.push(s.filesLoader(o,r).then(function(){return s._loadDependencies(o)}))}}),l.all(a)},inject:function(n){var r=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],o=arguments.length<=2||void 0===arguments[2]?!1:arguments[2],t=this,a=l.defer();if(e.isDefined(n)&&null!==n){if(e.isArray(n)){var s=[];return e.forEach(n,function(e){s.push(t.inject(e,r,o))}),l.all(s)}t._addToLoadList(t._getModuleName(n),!0,o)}if(i.length>0){var u=i.slice(),c=function f(e){z.push(e),D[e]=a.promise,t._loadDependencies(e,r).then(function(){try{d=[],L(O,z,r)}catch(e){return t._$log.error(e.message),void a.reject(e)}i.length>0?f(i.shift()):a.resolve(u)},function(e){a.reject(e)})};c(i.shift())}else{if(r&&r.name&&D[r.name])return D[r.name];a.resolve()}return a.promise},getRequires:function(n){var o=[];return e.forEach(n.requires,function(e){-1===r.indexOf(e)&&o.push(e)}),o},_invokeQueue:j,_registerInvokeList:$,_register:L,_addToLoadList:h,_unregister:function(n){e.isDefined(n)&&e.isArray(n)&&e.forEach(n,function(e){o[e]=void 0})}}}],this._init(e.element(n.document))}]);var f=e.bootstrap;e.bootstrap=function(n,l,g){return r=["ng","oc.lazyLoad"],o={},t=[],i=[],a=[],s=[],u=e.noop,c={},d=[],e.forEach(l.slice(),function(e){h(e,!0,!0)}),f(n,l,g)};var h=function(n,r,o){(s.length>0||r)&&e.isString(n)&&-1===i.indexOf(n)&&(i.push(n),o&&a.push(n))},g=e.module;e.module=function(e,n,r){return h(e,!1,!0),g(e,n,r)},"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="oc.lazyLoad")}(angular,window),function(e){"use strict";e.module("oc.lazyLoad").directive("ocLazyLoad",["$ocLazyLoad","$compile","$animate","$parse","$timeout",function(n,r,o,t,i){return{restrict:"A",terminal:!0,priority:1e3,compile:function(i,a){var s=i[0].innerHTML;return i.html(""),function(i,a,u){var c=t(u.ocLazyLoad);i.$watch(function(){return c(i)||u.ocLazyLoad},function(t){e.isDefined(t)&&n.load(t).then(function(){o.enter(s,a),r(a.contents())(i)})},!0)}}}}])}(angular),function(e){"use strict";e.module("oc.lazyLoad").config(["$provide",function(n){n.decorator("$ocLazyLoad",["$delegate","$q","$window","$interval",function(n,r,o,t){var i=!1,a=!1,s=o.document.getElementsByTagName("head")[0]||o.document.getElementsByTagName("body")[0];return n.buildElement=function(u,c,d){var l,f,h=r.defer(),g=n._getFilesCache(),p=function(e){var n=(new Date).getTime();return e.indexOf("?")>=0?"&"===e.substring(0,e.length-1)?e+"_dc="+n:e+"&_dc="+n:e+"?_dc="+n};switch(e.isUndefined(g.get(c))&&g.put(c,h.promise),u){case"css":l=o.document.createElement("link"),l.type="text/css",l.rel="stylesheet",l.href=d.cache===!1?p(c):c;break;case"js":l=o.document.createElement("script"),l.src=d.cache===!1?p(c):c;break;default:g.remove(c),h.reject(new Error('Requested type "'+u+'" is not known. Could not inject "'+c+'"'))}l.onload=l.onreadystatechange=function(e){l.readyState&&!/^c|loade/.test(l.readyState)||f||(l.onload=l.onreadystatechange=null,f=1,n._broadcast("ocLazyLoad.fileLoaded",c),h.resolve(l))},l.onerror=function(){g.remove(c),h.reject(new Error("Unable to load "+c))},l.async=d.serie?0:1;var m=s.lastChild;if(d.insertBefore){var v=e.element(e.isDefined(window.jQuery)?d.insertBefore:document.querySelector(d.insertBefore));v&&v.length>0&&(m=v[0])}if(m.parentNode.insertBefore(l,m),"css"==u){if(!i){var y=o.navigator.userAgent.toLowerCase();if(y.indexOf("phantomjs/1.9")>-1)a=!0;else if(/iP(hone|od|ad)/.test(o.navigator.platform)){var L=o.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),$=parseFloat([parseInt(L[1],10),parseInt(L[2],10),parseInt(L[3]||0,10)].join("."));a=6>$}else if(y.indexOf("android")>-1){var j=parseFloat(y.slice(y.indexOf("android")+8));a=4.4>j}else if(y.indexOf("safari")>-1){var E=y.match(/version\/([\.\d]+)/i);a=E&&E[1]&&parseFloat(E[1])<6}}if(a)var _=1e3,w=t(function(){try{l.sheet.cssRules,t.cancel(w),l.onload()}catch(e){--_<=0&&l.onerror()}},20)}return h.promise},n}])}])}(angular),function(e){"use strict";e.module("oc.lazyLoad").config(["$provide",function(n){n.decorator("$ocLazyLoad",["$delegate","$q",function(n,r){return n.filesLoader=function(o){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=[],a=[],s=[],u=[],c=null,d=n._getFilesCache();n.toggleWatch(!0),e.extend(t,o);var l=function(r){var o,l=null;if(e.isObject(r)&&(l=r.type,r=r.path),c=d.get(r),e.isUndefined(c)||t.cache===!1){if(null!==(o=/^(css|less|html|htm|js)?(?=!)/.exec(r))&&(l=o[1],r=r.substr(o[1].length+1,r.length)),!l)if(null!==(o=/[.](css|less|html|htm|js)?((\?|#).*)?$/.exec(r)))l=o[1];else{if(n.jsLoader.hasOwnProperty("ocLazyLoadLoader")||!n.jsLoader.hasOwnProperty("requirejs"))return void n._$log.error("File type could not be determined. "+r);l="js"}"css"!==l&&"less"!==l||-1!==i.indexOf(r)?"html"!==l&&"htm"!==l||-1!==a.indexOf(r)?"js"===l||-1===s.indexOf(r)?s.push(r):n._$log.error("File type is not valid. "+r):a.push(r):i.push(r)}else c&&u.push(c)};if(t.serie?l(t.files.shift()):e.forEach(t.files,function(e){l(e)}),i.length>0){var f=r.defer();n.cssLoader(i,function(r){e.isDefined(r)&&n.cssLoader.hasOwnProperty("ocLazyLoadLoader")?(n._$log.error(r),f.reject(r)):f.resolve()},t),u.push(f.promise)}if(a.length>0){var h=r.defer();n.templatesLoader(a,function(r){e.isDefined(r)&&n.templatesLoader.hasOwnProperty("ocLazyLoadLoader")?(n._$log.error(r),h.reject(r)):h.resolve()},t),u.push(h.promise)}if(s.length>0){var g=r.defer();n.jsLoader(s,function(r){e.isDefined(r)&&(n.jsLoader.hasOwnProperty("ocLazyLoadLoader")||n.jsLoader.hasOwnProperty("requirejs"))?(n._$log.error(r),g.reject(r)):g.resolve()},t),u.push(g.promise)}if(0===u.length){var p=r.defer(),m="Error: no file to load has been found, if you're trying to load an existing module you should use the 'inject' method instead of 'load'.";return n._$log.error(m),p.reject(m),p.promise}return t.serie&&t.files.length>0?r.all(u).then(function(){return n.filesLoader(o,t)}):r.all(u)["finally"](function(e){return n.toggleWatch(!1),e})},n.load=function(o){var t,i=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],a=this,s=null,u=[],c=r.defer(),d=e.copy(o),l=e.copy(i);if(e.isArray(d))return e.forEach(d,function(e){u.push(a.load(e,l))}),r.all(u).then(function(e){c.resolve(e)},function(e){c.reject(e)}),c.promise;if(e.isString(d)?(s=a.getModuleConfig(d),s||(s={files:[d]})):e.isObject(d)&&(s=e.isDefined(d.path)&&e.isDefined(d.type)?{files:[d]}:a.setModuleConfig(d)),null===s){var f=a._getModuleName(d);return t='Module "'+(f||"unknown")+'" is not configured, cannot load.',n._$log.error(t),c.reject(new Error(t)),c.promise}e.isDefined(s.template)&&(e.isUndefined(s.files)&&(s.files=[]),e.isString(s.template)?s.files.push(s.template):e.isArray(s.template)&&s.files.concat(s.template));var h=e.extend({},l,s);return e.isUndefined(s.files)&&e.isDefined(s.name)&&n.moduleExists(s.name)?n.inject(s.name,h,!0):(n.filesLoader(s,h).then(function(){n.inject(null,h).then(function(e){c.resolve(e)},function(e){c.reject(e)})},function(e){c.reject(e)}),c.promise)},n}])}])}(angular),function(e){"use strict";e.module("oc.lazyLoad").config(["$provide",function(n){n.decorator("$ocLazyLoad",["$delegate","$q",function(n,r){return n.cssLoader=function(o,t,i){var a=[];e.forEach(o,function(e){a.push(n.buildElement("css",e,i))}),r.all(a).then(function(){t()},function(e){t(e)})},n.cssLoader.ocLazyLoadLoader=!0,n}])}])}(angular),function(e){"use strict";e.module("oc.lazyLoad").config(["$provide",function(n){n.decorator("$ocLazyLoad",["$delegate","$q",function(n,r){return n.jsLoader=function(o,t,i){var a=[];e.forEach(o,function(e){a.push(n.buildElement("js",e,i))}),r.all(a).then(function(){t()},function(e){t(e)})},n.jsLoader.ocLazyLoadLoader=!0,n}])}])}(angular),function(e){"use strict";e.module("oc.lazyLoad").config(["$provide",function(n){n.decorator("$ocLazyLoad",["$delegate","$templateCache","$q","$http",function(n,r,o,t){return n.templatesLoader=function(i,a,s){var u=[],c=n._getFilesCache();return e.forEach(i,function(n){var i=o.defer();u.push(i.promise),t.get(n,s).then(function(o){var t=o.data;e.isString(t)&&t.length>0&&e.forEach(e.element(t),function(e){"SCRIPT"===e.nodeName&&"text/ng-template"===e.type&&r.put(e.id,e.innerHTML)}),e.isUndefined(c.get(n))&&c.put(n,!0),i.resolve()})["catch"](function(e){i.reject(new Error('Unable to load template file "'+n+'": '+e.data))})}),o.all(u).then(function(){a()},function(e){a(e)})},n.templatesLoader.ocLazyLoadLoader=!0,n}])}])}(angular),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,n){var r;if(null==this)throw new TypeError('"this" is null or not defined');var o=Object(this),t=o.length>>>0;if(0===t)return-1;var i=+n||0;if(Math.abs(i)===1/0&&(i=0),i>=t)return-1;for(r=Math.max(i>=0?i:t-Math.abs(i),0);t>r;){if(r in o&&o[r]===e)return r;r++}return-1});
/*! 
 * angular-loading-bar v0.9.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2016 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","$log","cfpLoadingBar",function(b,c,d,e,f,g){function h(){d.cancel(j),g.complete(),l=0,k=0}function i(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var j,k=0,l=0,m=g.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||i(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===k&&(j=d(function(){g.start()},m)),k++,g.set(l/k)),a},response:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),a):(f.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),a)},responseError:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),b.reject(a)):(f.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),b.reject(a))}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.autoIncrement=!0,this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){if(k||(k=a.get("$animate")),c.cancel(m),!r){var e=b[0],g=e.querySelector?e.querySelector(n):b.find(n)[0];g||(g=e.getElementsByTagName("body")[0]);var h=angular.element(g),i=g.lastChild&&angular.element(g.lastChild);d.$broadcast("cfpLoadingBar:started"),r=!0,v&&k.enter(o,h,i),u&&k.enter(q,h,o),f(w)}}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,t&&(c.cancel(l),l=c(function(){g()},250))}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.autoIncrement,u=this.includeSpinner,v=this.includeBar,w=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,autoIncrement:this.autoIncrement,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.1 - 2015-02-20
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(a){return{link:function(b,c,d){function e(b){function d(){j===e&&(j=void 0)}var e=a(c,b);return j&&j.cancel(),j=e,e.then(d,d),e}function f(){k?(k=!1,g()):(c.removeClass("collapse").addClass("collapsing"),e({height:c[0].scrollHeight+"px"}).then(g))}function g(){c.removeClass("collapsing"),c.addClass("collapse in"),c.css({height:"auto"})}function h(){if(k)k=!1,i(),c.css({height:0});else{c.css({height:c[0].scrollHeight+"px"});{c[0].offsetWidth}c.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(i)}}function i(){c.removeClass("collapsing"),c.addClass("collapse")}var j,k=!0;b.$watch(d.collapse,function(a){a?h():f()})}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(b,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(a,b,c,d){d.addGroup(a),a.$watch("isOpen",function(b){b&&d.closeOthers(a)}),a.toggleOpen=function(){a.isDisabled||(a.isOpen=!a.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(a,b,c,d,e){d.setHeading(e(a,function(){}))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b,this.close=a.close}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"@",close:"&"}}}).directive("dismissOnTimeout",["$timeout",function(a){return{require:"alert",link:function(b,c,d,e){a(function(){e.close()},parseInt(d.dismissOnTimeout,10))}}}]),angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active",this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){var d=b.hasClass(e.activeClass);(!d||angular.isDefined(c.uncheckable))&&a.$apply(function(){f.$setViewValue(d?null:a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$interval","$transition",function(a,b,c,d){function e(){f();var b=+a.interval;!isNaN(b)&&b>0&&(h=c(g,b))}function f(){h&&(c.cancel(h),h=null)}function g(){var b=+a.interval;i&&!isNaN(b)&&b>0?a.next():a.pause()}var h,i,j=this,k=j.slides=a.slides=[],l=-1;j.currentSlide=null;var m=!1;j.select=a.select=function(c,f){function g(){if(!m){if(j.currentSlide&&angular.isString(f)&&!a.noTransition&&c.$element){c.$element.addClass(f);{c.$element[0].offsetWidth}angular.forEach(k,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(c,{direction:f,active:!0,entering:!0}),angular.extend(j.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=d(c.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(c,j.currentSlide)}else h(c,j.currentSlide);j.currentSlide=c,l=i,e()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var i=k.indexOf(c);void 0===f&&(f=i>l?"next":"prev"),c&&c!==j.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){m=!0}),j.indexOfSlide=function(a){return k.indexOf(a)},a.next=function(){var b=(l+1)%k.length;return a.$currentTransition?void 0:j.select(k[b],"next")},a.prev=function(){var b=0>l-1?k.length-1:l-1;return a.$currentTransition?void 0:j.select(k[b],"prev")},a.isActive=function(a){return j.currentSlide===a},a.$watch("interval",e),a.$on("$destroy",f),a.play=function(){i||(i=!0,e())},a.pause=function(){a.noPause||(i=!1,f())},j.addSlide=function(b,c){b.$element=c,k.push(b),1===k.length||b.active?(j.select(k[k.length-1]),1==k.length&&a.play()):b.active=!1},j.removeSlide=function(a){var b=k.indexOf(a);k.splice(b,1),k.length>0&&a.active?j.select(b>=k.length?k[b-1]:k[b]):l>b&&l--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"=?"},link:function(a,b,c,d){d.addSlide(a,b),a.$on("$destroy",function(){d.removeSlide(a)}),a.$watch("active",function(b){b&&d.select(a)})}}}),angular.module("ui.bootstrap.dateparser",[]).service("dateParser",["$locale","orderByFilter",function(a,b){function c(a){var c=[],d=a.split("");return angular.forEach(e,function(b,e){var f=a.indexOf(e);if(f>-1){a=a.split(""),d[f]="("+b.regex+")",a[f]="$";for(var g=f+1,h=f+e.length;h>g;g++)d[g]="",a[g]="$";a=a.join(""),c.push({index:f,apply:b.apply})}}),{regex:new RegExp("^"+d.join("")+"$"),map:b(c,"index")}}function d(a,b,c){return 1===b&&c>28?29===c&&(a%4===0&&a%100!==0||a%400===0):3===b||5===b||8===b||10===b?31>c:!0}this.parsers={};var e={yyyy:{regex:"\\d{4}",apply:function(a){this.year=+a}},yy:{regex:"\\d{2}",apply:function(a){this.year=+a+2e3}},y:{regex:"\\d{1,4}",apply:function(a){this.year=+a}},MMMM:{regex:a.DATETIME_FORMATS.MONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.MONTH.indexOf(b)}},MMM:{regex:a.DATETIME_FORMATS.SHORTMONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)}},MM:{regex:"0[1-9]|1[0-2]",apply:function(a){this.month=a-1}},M:{regex:"[1-9]|1[0-2]",apply:function(a){this.month=a-1}},dd:{regex:"[0-2][0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},d:{regex:"[1-2]?[0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},EEEE:{regex:a.DATETIME_FORMATS.DAY.join("|")},EEE:{regex:a.DATETIME_FORMATS.SHORTDAY.join("|")}};this.parse=function(b,e){if(!angular.isString(b)||!e)return b;e=a.DATETIME_FORMATS[e]||e,this.parsers[e]||(this.parsers[e]=c(e));var f=this.parsers[e],g=f.regex,h=f.map,i=b.match(g);if(i&&i.length){for(var j,k={year:1900,month:0,date:1,hours:0},l=1,m=i.length;m>l;l++){var n=h[l-1];n.apply&&n.apply.call(k,i[l])}return d(k.year,k.month,k.date)&&(j=new Date(k.year,k.month,k.date,k.hours)),j}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,d){var e,f,g,h,i=c.split("-"),j=i[0],k=i[1]||"center";e=d?this.offset(a):this.position(a),f=b.prop("offsetWidth"),g=b.prop("offsetHeight");var l={center:function(){return e.left+e.width/2-f/2},left:function(){return e.left},right:function(){return e.left+e.width}},m={center:function(){return e.top+e.height/2-g/2},top:function(){return e.top},bottom:function(){return e.top+e.height}};switch(j){case"right":h={top:m[k](),left:l[j]()};break;case"left":h={top:m[k](),left:e.left-f};break;case"bottom":h={top:m[j](),left:l[k]()};break;default:h={top:e.top-g,left:l[k]()}}return h}}}]),angular.module("ui.bootstrap.datepicker",["ui.bootstrap.dateparser","ui.bootstrap.position"]).constant("datepickerConfig",{formatDay:"dd",formatMonth:"MMMM",formatYear:"yyyy",formatDayHeader:"EEE",formatDayTitle:"MMMM yyyy",formatMonthTitle:"yyyy",datepickerMode:"day",minMode:"day",maxMode:"year",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller("DatepickerController",["$scope","$attrs","$parse","$interpolate","$timeout","$log","dateFilter","datepickerConfig",function(a,b,c,d,e,f,g,h){var i=this,j={$setViewValue:angular.noop};this.modes=["day","month","year"],angular.forEach(["formatDay","formatMonth","formatYear","formatDayHeader","formatDayTitle","formatMonthTitle","minMode","maxMode","showWeeks","startingDay","yearRange"],function(c,e){i[c]=angular.isDefined(b[c])?8>e?d(b[c])(a.$parent):a.$parent.$eval(b[c]):h[c]}),angular.forEach(["minDate","maxDate"],function(d){b[d]?a.$parent.$watch(c(b[d]),function(a){i[d]=a?new Date(a):null,i.refreshView()}):i[d]=h[d]?new Date(h[d]):null}),a.datepickerMode=a.datepickerMode||h.datepickerMode,a.uniqueId="datepicker-"+a.$id+"-"+Math.floor(1e4*Math.random()),this.activeDate=angular.isDefined(b.initDate)?a.$parent.$eval(b.initDate):new Date,a.isActive=function(b){return 0===i.compare(b.date,i.activeDate)?(a.activeDateId=b.uid,!0):!1},this.init=function(a){j=a,j.$render=function(){i.render()}},this.render=function(){if(j.$modelValue){var a=new Date(j.$modelValue),b=!isNaN(a);b?this.activeDate=a:f.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'),j.$setValidity("date",b)}this.refreshView()},this.refreshView=function(){if(this.element){this._refreshView();var a=j.$modelValue?new Date(j.$modelValue):null;j.$setValidity("date-disabled",!a||this.element&&!this.isDisabled(a))}},this.createDateObject=function(a,b){var c=j.$modelValue?new Date(j.$modelValue):null;return{date:a,label:g(a,b),selected:c&&0===this.compare(a,c),disabled:this.isDisabled(a),current:0===this.compare(a,new Date)}},this.isDisabled=function(c){return this.minDate&&this.compare(c,this.minDate)<0||this.maxDate&&this.compare(c,this.maxDate)>0||b.dateDisabled&&a.dateDisabled({date:c,mode:a.datepickerMode})},this.split=function(a,b){for(var c=[];a.length>0;)c.push(a.splice(0,b));return c},a.select=function(b){if(a.datepickerMode===i.minMode){var c=j.$modelValue?new Date(j.$modelValue):new Date(0,0,0,0,0,0,0);c.setFullYear(b.getFullYear(),b.getMonth(),b.getDate()),j.$setViewValue(c),j.$render()}else i.activeDate=b,a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)-1]},a.move=function(a){var b=i.activeDate.getFullYear()+a*(i.step.years||0),c=i.activeDate.getMonth()+a*(i.step.months||0);i.activeDate.setFullYear(b,c,1),i.refreshView()},a.toggleMode=function(b){b=b||1,a.datepickerMode===i.maxMode&&1===b||a.datepickerMode===i.minMode&&-1===b||(a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)+b])},a.keys={13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"};var k=function(){e(function(){i.element[0].focus()},0,!1)};a.$on("datepicker.focus",k),a.keydown=function(b){var c=a.keys[b.which];if(c&&!b.shiftKey&&!b.altKey)if(b.preventDefault(),b.stopPropagation(),"enter"===c||"space"===c){if(i.isDisabled(i.activeDate))return;a.select(i.activeDate),k()}else!b.ctrlKey||"up"!==c&&"down"!==c?(i.handleKeyDown(c,b),i.refreshView()):(a.toggleMode("up"===c?1:-1),k())}}]).directive("datepicker",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{datepickerMode:"=?",dateDisabled:"&"},require:["datepicker","?^ngModel"],controller:"DatepickerController",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}).directive("daypicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/day.html",require:"^datepicker",link:function(b,c,d,e){function f(a,b){return 1!==b||a%4!==0||a%100===0&&a%400!==0?i[b]:29}function g(a,b){var c=new Array(b),d=new Date(a),e=0;for(d.setHours(12);b>e;)c[e++]=new Date(d),d.setDate(d.getDate()+1);return c}function h(a){var b=new Date(a);b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1}b.showWeeks=e.showWeeks,e.step={months:1},e.element=c;var i=[31,28,31,30,31,30,31,31,30,31,30,31];e._refreshView=function(){var c=e.activeDate.getFullYear(),d=e.activeDate.getMonth(),f=new Date(c,d,1),i=e.startingDay-f.getDay(),j=i>0?7-i:-i,k=new Date(f);j>0&&k.setDate(-j+1);for(var l=g(k,42),m=0;42>m;m++)l[m]=angular.extend(e.createDateObject(l[m],e.formatDay),{secondary:l[m].getMonth()!==d,uid:b.uniqueId+"-"+m});b.labels=new Array(7);for(var n=0;7>n;n++)b.labels[n]={abbr:a(l[n].date,e.formatDayHeader),full:a(l[n].date,"EEEE")};if(b.title=a(e.activeDate,e.formatDayTitle),b.rows=e.split(l,7),b.showWeeks){b.weekNumbers=[];for(var o=h(b.rows[0][0].date),p=b.rows.length;b.weekNumbers.push(o++)<p;);}},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())},e.handleKeyDown=function(a){var b=e.activeDate.getDate();if("left"===a)b-=1;else if("up"===a)b-=7;else if("right"===a)b+=1;else if("down"===a)b+=7;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getMonth()+("pageup"===a?-1:1);e.activeDate.setMonth(c,1),b=Math.min(f(e.activeDate.getFullYear(),e.activeDate.getMonth()),b)}else"home"===a?b=1:"end"===a&&(b=f(e.activeDate.getFullYear(),e.activeDate.getMonth()));e.activeDate.setDate(b)},e.refreshView()}}}]).directive("monthpicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/month.html",require:"^datepicker",link:function(b,c,d,e){e.step={years:1},e.element=c,e._refreshView=function(){for(var c=new Array(12),d=e.activeDate.getFullYear(),f=0;12>f;f++)c[f]=angular.extend(e.createDateObject(new Date(d,f,1),e.formatMonth),{uid:b.uniqueId+"-"+f});b.title=a(e.activeDate,e.formatMonthTitle),b.rows=e.split(c,3)},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())},e.handleKeyDown=function(a){var b=e.activeDate.getMonth();if("left"===a)b-=1;else if("up"===a)b-=3;else if("right"===a)b+=1;else if("down"===a)b+=3;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getFullYear()+("pageup"===a?-1:1);e.activeDate.setFullYear(c)}else"home"===a?b=0:"end"===a&&(b=11);e.activeDate.setMonth(b)},e.refreshView()}}}]).directive("yearpicker",["dateFilter",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/year.html",require:"^datepicker",link:function(a,b,c,d){function e(a){return parseInt((a-1)/f,10)*f+1}var f=d.yearRange;d.step={years:f},d.element=b,d._refreshView=function(){for(var b=new Array(f),c=0,g=e(d.activeDate.getFullYear());f>c;c++)b[c]=angular.extend(d.createDateObject(new Date(g+c,0,1),d.formatYear),{uid:a.uniqueId+"-"+c});a.title=[b[0].label,b[f-1].label].join(" - "),a.rows=d.split(b,5)},d.compare=function(a,b){return a.getFullYear()-b.getFullYear()},d.handleKeyDown=function(a){var b=d.activeDate.getFullYear();"left"===a?b-=1:"up"===a?b-=5:"right"===a?b+=1:"down"===a?b+=5:"pageup"===a||"pagedown"===a?b+=("pageup"===a?-1:1)*d.step.years:"home"===a?b=e(d.activeDate.getFullYear()):"end"===a&&(b=e(d.activeDate.getFullYear())+f-1),d.activeDate.setFullYear(b)},d.refreshView()}}}]).constant("datepickerPopupConfig",{datepickerPopup:"yyyy-MM-dd",currentText:"Today",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","dateParser","datepickerPopupConfig",function(a,b,c,d,e,f,g){return{restrict:"EA",require:"ngModel",scope:{isOpen:"=?",currentText:"@",clearText:"@",closeText:"@",dateDisabled:"&"},link:function(h,i,j,k){function l(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function m(a){if(a){if(angular.isDate(a)&&!isNaN(a))return k.$setValidity("date",!0),a;if(angular.isString(a)){var b=f.parse(a,n)||new Date(a);return isNaN(b)?void k.$setValidity("date",!1):(k.$setValidity("date",!0),b)}return void k.$setValidity("date",!1)}return k.$setValidity("date",!0),null}var n,o=angular.isDefined(j.closeOnDateSelection)?h.$parent.$eval(j.closeOnDateSelection):g.closeOnDateSelection,p=angular.isDefined(j.datepickerAppendToBody)?h.$parent.$eval(j.datepickerAppendToBody):g.appendToBody;h.showButtonBar=angular.isDefined(j.showButtonBar)?h.$parent.$eval(j.showButtonBar):g.showButtonBar,h.getText=function(a){return h[a+"Text"]||g[a+"Text"]},j.$observe("datepickerPopup",function(a){n=a||g.datepickerPopup,k.$render()});var q=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");q.attr({"ng-model":"date","ng-change":"dateSelection()"});var r=angular.element(q.children()[0]);j.datepickerOptions&&angular.forEach(h.$parent.$eval(j.datepickerOptions),function(a,b){r.attr(l(b),a)}),h.watchData={},angular.forEach(["minDate","maxDate","datepickerMode"],function(a){if(j[a]){var c=b(j[a]);if(h.$parent.$watch(c,function(b){h.watchData[a]=b}),r.attr(l(a),"watchData."+a),"datepickerMode"===a){var d=c.assign;h.$watch("watchData."+a,function(a,b){a!==b&&d(h.$parent,a)})}}}),j.dateDisabled&&r.attr("date-disabled","dateDisabled({ date: date, mode: mode })"),k.$parsers.unshift(m),h.dateSelection=function(a){angular.isDefined(a)&&(h.date=a),k.$setViewValue(h.date),k.$render(),o&&(h.isOpen=!1,i[0].focus())},i.bind("input change keyup",function(){h.$apply(function(){h.date=k.$modelValue})}),k.$render=function(){var a=k.$viewValue?e(k.$viewValue,n):"";i.val(a),h.date=m(k.$modelValue)};var s=function(a){h.isOpen&&a.target!==i[0]&&h.$apply(function(){h.isOpen=!1})},t=function(a){h.keydown(a)};i.bind("keydown",t),h.keydown=function(a){27===a.which?(a.preventDefault(),a.stopPropagation(),h.close()):40!==a.which||h.isOpen||(h.isOpen=!0)},h.$watch("isOpen",function(a){a?(h.$broadcast("datepicker.focus"),h.position=p?d.offset(i):d.position(i),h.position.top=h.position.top+i.prop("offsetHeight"),c.bind("click",s)):c.unbind("click",s)}),h.select=function(a){if("today"===a){var b=new Date;angular.isDate(k.$modelValue)?(a=new Date(k.$modelValue),a.setFullYear(b.getFullYear(),b.getMonth(),b.getDate())):a=new Date(b.setHours(0,0,0,0))}h.dateSelection(a)},h.close=function(){h.isOpen=!1,i[0].focus()};var u=a(q)(h);q.remove(),p?c.find("body").append(u):i.after(u),h.$on("$destroy",function(){u.remove(),i.unbind("keydown",t),c.unbind("click",s)})}}}]).directive("datepickerPopupWrap",function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault(),a.stopPropagation()})}}}),angular.module("ui.bootstrap.dropdown",[]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document",function(a){var b=null;this.open=function(e){b||(a.bind("click",c),a.bind("keydown",d)),b&&b!==e&&(b.isOpen=!1),b=e},this.close=function(e){b===e&&(b=null,a.unbind("click",c),a.unbind("keydown",d))};var c=function(a){if(b){var c=b.getToggleElement();a&&c&&c[0].contains(a.target)||b.$apply(function(){b.isOpen=!1})}},d=function(a){27===a.which&&(b.focusToggleElement(),c())}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate",function(a,b,c,d,e,f){var g,h=this,i=a.$new(),j=d.openClass,k=angular.noop,l=b.onToggle?c(b.onToggle):angular.noop;this.init=function(d){h.$element=d,b.isOpen&&(g=c(b.isOpen),k=g.assign,a.$watch(g,function(a){i.isOpen=!!a}))},this.toggle=function(a){return i.isOpen=arguments.length?!!a:!i.isOpen},this.isOpen=function(){return i.isOpen},i.getToggleElement=function(){return h.toggleElement},i.focusToggleElement=function(){h.toggleElement&&h.toggleElement[0].focus()},i.$watch("isOpen",function(b,c){f[b?"addClass":"removeClass"](h.$element,j),b?(i.focusToggleElement(),e.open(i)):e.close(i),k(a,b),angular.isDefined(b)&&b!==c&&l(a,{open:!!b})}),a.$on("$locationChangeSuccess",function(){i.isOpen=!1}),a.$on("$destroy",function(){i.$destroy()})}]).directive("dropdown",function(){return{controller:"DropdownController",link:function(a,b,c,d){d.init(b)}}}).directive("dropdownToggle",function(){return{require:"?^dropdown",link:function(a,b,c,d){if(d){d.toggleElement=b;var e=function(e){e.preventDefault(),b.hasClass("disabled")||c.disabled||a.$apply(function(){d.toggle()})};b.bind("click",e),b.attr({"aria-haspopup":!0,"aria-expanded":!1}),a.$watch(d.isOpen,function(a){b.attr("aria-expanded",!!a)}),a.$on("$destroy",function(){b.unbind("click",e)})}}}}),angular.module("ui.bootstrap.modal",["ui.bootstrap.transition"]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(b,c,d){b.backdropClass=d.backdropClass||"",b.animate=!1,a(function(){b.animate=!0})}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(a,b){return b.templateUrl||"template/modal/window.html"},link:function(c,d,e){d.addClass(e.windowClass||""),c.size=e.size,b(function(){c.animate=!0,d[0].querySelectorAll("[autofocus]").length||d[0].focus()}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).directive("modalTransclude",function(){return{link:function(a,b,c,d,e){e(a.$parent,function(a){b.empty(),b.append(a)})}}}).factory("$modalStack",["$transition","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d,e,f){function g(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function h(a){var b=c.find("body").eq(0),d=n.get(a).value;n.remove(a),j(d.modalDomEl,d.modalScope,300,function(){d.modalScope.$destroy(),b.toggleClass(m,n.length()>0),i()})}function i(){if(k&&-1==g()){var a=l;j(k,l,150,function(){a.$destroy(),a=null}),k=void 0,l=void 0}}function j(c,d,e,f){function g(){g.done||(g.done=!0,c.remove(),f&&f())}d.animate=!1;var h=a.transitionEndEventName;if(h){var i=b(g,e);c.bind(h,function(){b.cancel(i),g(),d.$apply()})}else b(g)}var k,l,m="modal-open",n=f.createNew(),o={};return e.$watch(g,function(a){l&&(l.index=a)}),c.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&(a.preventDefault(),e.$apply(function(){o.dismiss(b.key,"escape key press")})))}),o.open=function(a,b){n.add(a,{deferred:b.deferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var f=c.find("body").eq(0),h=g();if(h>=0&&!k){l=e.$new(!0),l.index=h;var i=angular.element("<div modal-backdrop></div>");i.attr("backdrop-class",b.backdropClass),k=d(i)(l),f.append(k)}var j=angular.element("<div modal-window></div>");j.attr({"template-url":b.windowTemplateUrl,"window-class":b.windowClass,size:b.size,index:n.length()-1,animate:"animate"}).html(b.content);var o=d(j)(b.scope);n.top().value.modalDomEl=o,f.append(o),f.addClass(m)},o.close=function(a,b){var c=n.get(a);c&&(c.value.deferred.resolve(b),h(a))},o.dismiss=function(a,b){var c=n.get(a);c&&(c.value.deferred.reject(b),h(a))},o.dismissAll=function(a){for(var b=this.getTop();b;)this.dismiss(b.key,a),b=this.getTop()},o.getTop=function(){return n.top()},o}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(angular.isFunction(a.templateUrl)?a.templateUrl():a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i),b.controllerAs&&(d[b.controllerAs]=f)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,backdropClass:b.backdropClass,windowClass:b.windowClass,windowTemplateUrl:b.windowTemplateUrl,size:b.size})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse",function(a,b,c){var d=this,e={$setViewValue:angular.noop},f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(f,g){e=f,this.config=g,e.$render=function(){d.render()},b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){d.itemsPerPage=parseInt(b,10),a.totalPages=d.calculateTotalPages()}):this.itemsPerPage=g.itemsPerPage},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.render=function(){a.page=parseInt(e.$viewValue,10)||1},a.selectPage=function(b){a.page!==b&&b>0&&b<=a.totalPages&&(e.$setViewValue(b),e.$render())},a.getText=function(b){return a[b+"Text"]||d.config[b+"Text"]},a.noPrevious=function(){return 1===a.page},a.noNext=function(){return a.page===a.totalPages},a.$watch("totalItems",function(){a.totalPages=d.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),a.page>b?a.selectPage(b):e.$render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@"},require:["pagination","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c){return{number:a,text:b,active:c}}function h(a,b){var c=[],d=1,e=b,f=angular.isDefined(k)&&b>k;f&&(l?(d=Math.max(a-Math.floor(k/2),1),e=d+k-1,e>b&&(e=b,d=e-k+1)):(d=(Math.ceil(a/k)-1)*k+1,e=Math.min(d+k-1,b)));for(var h=d;e>=h;h++){var i=g(h,h,h===a);c.push(i)}if(f&&!l){if(d>1){var j=g(d-1,"...",!1);c.unshift(j)}if(b>e){var m=g(e+1,"...",!1);c.push(m)}}return c}var i=f[0],j=f[1];if(j){var k=angular.isDefined(e.maxSize)?c.$parent.$eval(e.maxSize):b.maxSize,l=angular.isDefined(e.rotate)?c.$parent.$eval(e.rotate):b.rotate;c.boundaryLinks=angular.isDefined(e.boundaryLinks)?c.$parent.$eval(e.boundaryLinks):b.boundaryLinks,c.directionLinks=angular.isDefined(e.directionLinks)?c.$parent.$eval(e.directionLinks):b.directionLinks,i.init(j,b),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){k=parseInt(a,10),i.render()
});var m=i.render;i.render=function(){m(),c.page>0&&c.page<=c.totalPages&&(c.pages=h(c.page,c.totalPages))}}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{totalItems:"=",previousText:"@",nextText:"@"},require:["pager","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){var f=e[0],g=e[1];g&&(b.align=angular.isDefined(d.align)?b.$parent.$eval(d.align):a.align,f.init(g,a))}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$document","$position","$interpolate",function(e,f,g,h,i,j){return function(e,k,l){function m(a){var b=a||n.trigger||l,d=c[b]||b;return{show:b,hide:d}}var n=angular.extend({},b,d),o=a(e),p=j.startSymbol(),q=j.endSymbol(),r="<div "+o+'-popup title="'+p+"title"+q+'" content="'+p+"content"+q+'" placement="'+p+"placement"+q+'" animation="animation" is-open="isOpen"></div>';return{restrict:"EA",compile:function(){var a=f(r);return function(b,c,d){function f(){D.isOpen?l():j()}function j(){(!C||b.$eval(d[k+"Enable"]))&&(s(),D.popupDelay?z||(z=g(o,D.popupDelay,!1),z.then(function(a){a()})):o()())}function l(){b.$apply(function(){p()})}function o(){return z=null,y&&(g.cancel(y),y=null),D.content?(q(),w.css({top:0,left:0,display:"block"}),D.$digest(),E(),D.isOpen=!0,D.$digest(),E):angular.noop}function p(){D.isOpen=!1,g.cancel(z),z=null,D.animation?y||(y=g(r,500)):r()}function q(){w&&r(),x=D.$new(),w=a(x,function(a){A?h.find("body").append(a):c.after(a)})}function r(){y=null,w&&(w.remove(),w=null),x&&(x.$destroy(),x=null)}function s(){t(),u()}function t(){var a=d[k+"Placement"];D.placement=angular.isDefined(a)?a:n.placement}function u(){var a=d[k+"PopupDelay"],b=parseInt(a,10);D.popupDelay=isNaN(b)?n.popupDelay:b}function v(){var a=d[k+"Trigger"];F(),B=m(a),B.show===B.hide?c.bind(B.show,f):(c.bind(B.show,j),c.bind(B.hide,l))}var w,x,y,z,A=angular.isDefined(n.appendToBody)?n.appendToBody:!1,B=m(void 0),C=angular.isDefined(d[k+"Enable"]),D=b.$new(!0),E=function(){var a=i.positionElements(c,w,D.placement,A);a.top+="px",a.left+="px",w.css(a)};D.isOpen=!1,d.$observe(e,function(a){D.content=a,!a&&D.isOpen&&p()}),d.$observe(k+"Title",function(a){D.title=a});var F=function(){c.unbind(B.show,j),c.unbind(B.hide,l)};v();var G=b.$eval(d[k+"Animation"]);D.animation=angular.isDefined(G)?!!G:n.animation;var H=b.$eval(d[k+"AppendToBody"]);A=angular.isDefined(H)?H:A,A&&b.$on("$locationChangeSuccess",function(){D.isOpen&&p()}),b.$on("$destroy",function(){g.cancel(y),g.cancel(z),F(),r(),D=null})}}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig",function(a,b,c){var d=this,e=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.bars=[],a.max=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,this.addBar=function(b,c){e||c.css({transition:"none"}),this.bars.push(b),b.$watch("value",function(c){b.percent=+(100*c/a.max).toFixed(2)}),b.$on("$destroy",function(){c=null,d.removeBar(b)})},this.removeBar=function(a){this.bars.splice(this.bars.indexOf(a),1)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},templateUrl:"template/progressbar/progress.html"}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(a,b,c){var d={$setViewValue:angular.noop};this.init=function(e){d=e,d.$render=this.render,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):c.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):c.stateOff;var f=angular.isDefined(b.ratingStates)?a.$parent.$eval(b.ratingStates):new Array(angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max);a.range=this.buildTemplateObjects(f)},this.buildTemplateObjects=function(a){for(var b=0,c=a.length;c>b;b++)a[b]=angular.extend({index:b},{stateOn:this.stateOn,stateOff:this.stateOff},a[b]);return a},a.rate=function(b){!a.readonly&&b>=0&&b<=a.range.length&&(d.$setViewValue(b),d.$render())},a.enter=function(b){a.readonly||(a.value=b),a.onHover({value:b})},a.reset=function(){a.value=d.$viewValue,a.onLeave()},a.onKeydown=function(b){/(37|38|39|40)/.test(b.which)&&(b.preventDefault(),b.stopPropagation(),a.rate(a.value+(38===b.which||39===b.which?1:-1)))},this.render=function(){a.value=d.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(c,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())}),a.active=!0,a.onSelect()},b.addTab=function(a){c.push(a),1===c.length?a.active=!0:a.active&&b.select(a)},b.removeTab=function(a){var e=c.indexOf(a);if(a.active&&c.length>1&&!d){var f=e==c.length-1?e-1:e+1;b.select(c[f])}c.splice(e,1)};var d;a.$on("$destroy",function(){d=!0})}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=angular.isDefined(c.justified)?a.$parent.$eval(c.justified):!1}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){b.$watch("active",function(a){a&&f.select(b)}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0}).controller("TimepickerController",["$scope","$attrs","$parse","$log","$locale","timepickerConfig",function(a,b,c,d,e,f){function g(){var b=parseInt(a.hours,10),c=a.showMeridian?b>0&&13>b:b>=0&&24>b;return c?(a.showMeridian&&(12===b&&(b=0),a.meridian===p[1]&&(b+=12)),b):void 0}function h(){var b=parseInt(a.minutes,10);return b>=0&&60>b?b:void 0}function i(a){return angular.isDefined(a)&&a.toString().length<2?"0"+a:a}function j(a){k(),o.$setViewValue(new Date(n)),l(a)}function k(){o.$setValidity("time",!0),a.invalidHours=!1,a.invalidMinutes=!1}function l(b){var c=n.getHours(),d=n.getMinutes();a.showMeridian&&(c=0===c||12===c?12:c%12),a.hours="h"===b?c:i(c),a.minutes="m"===b?d:i(d),a.meridian=n.getHours()<12?p[0]:p[1]}function m(a){var b=new Date(n.getTime()+6e4*a);n.setHours(b.getHours(),b.getMinutes()),j()}var n=new Date,o={$setViewValue:angular.noop},p=angular.isDefined(b.meridians)?a.$parent.$eval(b.meridians):f.meridians||e.DATETIME_FORMATS.AMPMS;this.init=function(c,d){o=c,o.$render=this.render;var e=d.eq(0),g=d.eq(1),h=angular.isDefined(b.mousewheel)?a.$parent.$eval(b.mousewheel):f.mousewheel;h&&this.setupMousewheelEvents(e,g),a.readonlyInput=angular.isDefined(b.readonlyInput)?a.$parent.$eval(b.readonlyInput):f.readonlyInput,this.setupInputEvents(e,g)};var q=f.hourStep;b.hourStep&&a.$parent.$watch(c(b.hourStep),function(a){q=parseInt(a,10)});var r=f.minuteStep;b.minuteStep&&a.$parent.$watch(c(b.minuteStep),function(a){r=parseInt(a,10)}),a.showMeridian=f.showMeridian,b.showMeridian&&a.$parent.$watch(c(b.showMeridian),function(b){if(a.showMeridian=!!b,o.$error.time){var c=g(),d=h();angular.isDefined(c)&&angular.isDefined(d)&&(n.setHours(c),j())}else l()}),this.setupMousewheelEvents=function(b,c){var d=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||b>0};b.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementHours():a.decrementHours()),b.preventDefault()}),c.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementMinutes():a.decrementMinutes()),b.preventDefault()})},this.setupInputEvents=function(b,c){if(a.readonlyInput)return a.updateHours=angular.noop,void(a.updateMinutes=angular.noop);var d=function(b,c){o.$setViewValue(null),o.$setValidity("time",!1),angular.isDefined(b)&&(a.invalidHours=b),angular.isDefined(c)&&(a.invalidMinutes=c)};a.updateHours=function(){var a=g();angular.isDefined(a)?(n.setHours(a),j("h")):d(!0)},b.bind("blur",function(){!a.invalidHours&&a.hours<10&&a.$apply(function(){a.hours=i(a.hours)})}),a.updateMinutes=function(){var a=h();angular.isDefined(a)?(n.setMinutes(a),j("m")):d(void 0,!0)},c.bind("blur",function(){!a.invalidMinutes&&a.minutes<10&&a.$apply(function(){a.minutes=i(a.minutes)})})},this.render=function(){var a=o.$modelValue?new Date(o.$modelValue):null;isNaN(a)?(o.$setValidity("time",!1),d.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(a&&(n=a),k(),l())},a.incrementHours=function(){m(60*q)},a.decrementHours=function(){m(60*-q)},a.incrementMinutes=function(){m(r)},a.decrementMinutes=function(){m(-r)},a.toggleMeridian=function(){m(720*(n.getHours()<12?1:-1))}}]).directive("timepicker",function(){return{restrict:"EA",require:["timepicker","?^ngModel"],controller:"TimepickerController",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f,b.find("input"))}}}),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "'+c+'".');return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?i.$eval(k.typeaheadAppendToBody):!1,u=i.$eval(k.typeaheadFocusFirst)!==!1,v=b(k.ngModel).assign,w=g.parse(k.typeahead),x=i.$new();i.$on("$destroy",function(){x.$destroy()});var y="typeahead-"+x.$id+"-"+Math.floor(1e4*Math.random());j.attr({"aria-autocomplete":"list","aria-expanded":!1,"aria-owns":y});var z=angular.element("<div typeahead-popup></div>");z.attr({id:y,matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&z.attr("template-url",k.typeaheadTemplateUrl);var A=function(){x.matches=[],x.activeIdx=-1,j.attr("aria-expanded",!1)},B=function(a){return y+"-option-"+a};x.$watch("activeIdx",function(a){0>a?j.removeAttr("aria-activedescendant"):j.attr("aria-activedescendant",B(a))});var C=function(a){var b={$viewValue:a};q(i,!0),c.when(w.source(i,b)).then(function(c){var d=a===l.$viewValue;if(d&&m)if(c.length>0){x.activeIdx=u?0:-1,x.matches.length=0;for(var e=0;e<c.length;e++)b[w.itemName]=c[e],x.matches.push({id:B(e),label:w.viewMapper(x,b),model:c[e]});x.query=a,x.position=t?f.offset(j):f.position(j),x.position.top=x.position.top+j.prop("offsetHeight"),j.attr("aria-expanded",!0)}else A();d&&q(i,!1)},function(){A(),q(i,!1)})};A(),x.query=void 0;var D,E=function(a){D=d(function(){C(a)},o)},F=function(){D&&d.cancel(D)};l.$parsers.unshift(function(a){return m=!0,a&&a.length>=n?o>0?(F(),E(a)):C(a):(q(i,!1),F(),A()),p?a:a?void l.$setValidity("editable",!1):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[w.itemName]=a,b=w.viewMapper(i,d),d[w.itemName]=void 0,c=w.viewMapper(i,d),b!==c?b:a)}),x.select=function(a){var b,c,e={};e[w.itemName]=c=x.matches[a].model,b=w.modelMapper(i,e),v(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:w.viewMapper(i,e)}),A(),d(function(){j[0].focus()},0,!1)},j.bind("keydown",function(a){0!==x.matches.length&&-1!==h.indexOf(a.which)&&(-1!=x.activeIdx||13!==a.which&&9!==a.which)&&(a.preventDefault(),40===a.which?(x.activeIdx=(x.activeIdx+1)%x.matches.length,x.$digest()):38===a.which?(x.activeIdx=(x.activeIdx>0?x.activeIdx:x.matches.length)-1,x.$digest()):13===a.which||9===a.which?x.$apply(function(){x.select(x.activeIdx)}):27===a.which&&(a.stopPropagation(),A(),x.$digest()))}),j.bind("blur",function(){m=!1});var G=function(a){j[0]!==a.target&&(A(),x.$digest())};e.bind("click",G),i.$on("$destroy",function(){e.unbind("click",G),t&&H.remove()});var H=a(z)(x);t?e.find("body").append(H):j.after(H)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?(""+b).replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html",'<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')}]),angular.module("template/datepicker/day.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/day.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/month.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/month.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html",'<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')}]),angular.module("template/datepicker/year.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/year.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]),angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')}]),angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
}]),angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html",'<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')}]);
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.22.2';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'YYYY-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

/* globals define, module, require, angular, moment */
/* jslint vars:true */

/**
 * @license angular-date-time-input
 * (c) 2013-2015 Knight Rider Consulting, Inc. http://www.knightrider.com
 * License: MIT
 *
 *    @author Dale "Ducky" Lotts
 *    @since  2013-Sep-23
 */

;(function (root, factory) {
  'use strict'
  /* istanbul ignore if */
  if (typeof module !== 'undefined' && module.exports) {
    var ng = typeof angular === 'undefined' ? require('angular') : angular
    var mt = typeof moment === 'undefined' ? require('moment') : moment
    factory(ng, mt)
    module.exports = 'ui.bootstrap.datetimepicker'
    /* istanbul ignore next */
  } else if (typeof define === 'function' && /* istanbul ignore next */ define.amd) {
    define(['angular', 'moment'], factory)
  } else {
    factory(root.angular, root.moment)
  }
}(this, function (angular, moment) {
  'use strict'
  angular.module('ui.dateTimeInput', [])
    .service('dateTimeParserFactory', DateTimeParserFactoryService)
    .directive('dateTimeInput', DateTimeInputDirective)

  DateTimeParserFactoryService.$inject = []

  function DateTimeParserFactoryService () {
    return function ParserFactory (modelType, inputFormats, dateParseStrict) {
      var result
      // Behaviors
      switch (modelType) {
        case 'Date':
          result = handleEmpty(dateParser)
          break
        case 'moment':
          result = handleEmpty(momentParser)
          break
        case 'milliseconds':
          result = handleEmpty(millisecondParser)
          break
        default: // It is assumed that the modelType is a formatting string.
          result = handleEmpty(stringParserFactory(modelType))
      }

      return result

      function handleEmpty (delegate) {
        return function (viewValue) {
          if (angular.isUndefined(viewValue) || viewValue === '' || viewValue === null) {
            return null
          } else {
            return delegate(viewValue)
          }
        }
      }

      function dateParser (viewValue) {
        return momentParser(viewValue).toDate()
      }

      function momentParser (viewValue) {
        return moment(viewValue, inputFormats, moment.locale(), dateParseStrict)
      }

      function millisecondParser (viewValue) {
        return moment.utc(viewValue, inputFormats, moment.locale(), dateParseStrict).valueOf()
      }

      function stringParserFactory (modelFormat) {
        return function stringParser (viewValue) {
          return momentParser(viewValue).format(modelFormat)
        }
      }
    }
  }

  DateTimeInputDirective.$inject = ['dateTimeParserFactory']

  function DateTimeInputDirective (dateTimeParserFactory) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        'dateFormats': '='
      },
      link: linkFunction
    }

    function linkFunction (scope, element, attrs, controller) {
      // validation
      if (angular.isDefined(scope.dateFormats) && !angular.isString(scope.dateFormats) && !angular.isArray(scope.dateFormats)) {
        throw new Error('date-formats must be a single string or an array of strings i.e. date-formats="[\'YYYY-MM-DD\']" ')
      }

      if (angular.isDefined(attrs.modelType) && (!angular.isString(attrs.modelType) || attrs.modelType.length === 0)) {
        throw new Error('model-type must be "Date", "moment", "milliseconds", or a moment format string')
      }

      // variables
      var displayFormat = attrs.dateTimeInput || moment.defaultFormat

      var dateParseStrict = (attrs.dateParseStrict === undefined || attrs.dateParseStrict === 'true')

      var modelType = (attrs.modelType || 'Date')

      var inputFormats = [attrs.dateTimeInput, modelType].concat(scope.dateFormats).concat([moment.ISO_8601]).filter(unique)
      var formatterFormats = [modelType].concat(inputFormats).filter(unique)

      // Behaviors
      controller.$parsers.unshift(dateTimeParserFactory(modelType, inputFormats, dateParseStrict))

      controller.$formatters.push(formatter)

      controller.$validators.dateTimeInput = validator

      element.bind('blur', applyFormatters)

      // Implementation

      function unique (value, index, self) {
        return ['Date', 'moment', 'milliseconds', undefined].indexOf(value) === -1 &&
          self.indexOf(value) === index
      }

      function validator (modelValue, viewValue) {
        if (angular.isUndefined(viewValue) || viewValue === '' || viewValue === null) {
          return true
        }
        return moment(viewValue, inputFormats, moment.locale(), dateParseStrict).isValid()
      }

      function formatter (modelValue) {
        if (angular.isUndefined(modelValue) || modelValue === '' || modelValue === null) {
          return null
        }

        if (angular.isDate(modelValue)) {
          return moment(modelValue).format(displayFormat)
        } else if (angular.isNumber(modelValue)) {
          return moment.utc(modelValue).format(displayFormat)
        }
        return moment(modelValue, formatterFormats, moment.locale(), dateParseStrict).format(displayFormat)
      }

      function applyFormatters () {
        controller.$viewValue = controller.$formatters.filter(keepAll).reverse().reduce(applyFormatter, controller.$modelValue)
        controller.$render()

        function keepAll () {
          return true
        }

        function applyFormatter (memo, formatter) {
          return formatter(memo)
        }
      }
    }
  }
}))


/* globals define, jQuery, module, require, angular, moment */
/* jslint vars:true */

/**
 * @license angularjs-bootstrap-datetimepicker
 * Copyright 2016 Knight Rider Consulting, Inc. http://www.knightrider.com
 * License: MIT
 *
 * @author        Dale "Ducky" Lotts
 * @since        2013-Jul-8
 */

;(function (root, factory) {
  'use strict'
  /* istanbul ignore if */
  if (typeof module !== 'undefined' && module.exports) {
    var ng = typeof angular === 'undefined' ? require('angular') : angular
    var mt = typeof moment === 'undefined' ? require('moment') : moment
    factory(ng, mt)
    module.exports = 'ui.bootstrap.datetimepicker'
    /* istanbul ignore next */
  } else if (typeof define === 'function' && /* istanbul ignore next */ define.amd) {
    define(['angular', 'moment'], factory)
  } else {
    factory(root.angular, root.moment)
  }
}(this, function (angular, moment) {
  'use strict'
  angular.module('ui.bootstrap.datetimepicker', [])
    .service('dateTimePickerConfig', DateTimePickerConfigProvider)
    .service('dateTimePickerValidator', DateTimePickerValidatorService)
    .directive('datetimepicker', DatetimepickerDirective)

  DatetimepickerDirective.$inject = ['dateTimePickerConfig', 'dateTimePickerValidator']

  function DatetimepickerDirective (defaultConfig, configurationValidator) {
    var directiveDefinition = {
      bindToController: false,
      controller: DirectiveController,
      controllerAs: 'dateTimePickerController',
      replace: true,
      require: 'ngModel',
      restrict: 'E',
      scope: {
        beforeRender: '&',
        onSetTime: '&'
      },
      templateUrl: 'templates/datetimepicker.html'
    }

    DirectiveController.$inject = ['$scope', '$element', '$attrs']

    function DirectiveController ($scope, $element, $attrs) {
      // Configuration
      var ngModelController = $element.controller('ngModel')

      var configuration = createConfiguration()
      $scope.screenReader = configuration.screenReader

      // Behavior
      $scope.changeView = changeView
      ngModelController.$render = $render

      if (configuration.configureOn) {
        $scope.$on(configuration.configureOn, function () {
          configuration = createConfiguration()
          $scope.screenReader = configuration.screenReader
          ngModelController.$render()
        })
      }

      if (configuration.renderOn) {
        $scope.$on(configuration.renderOn, ngModelController.$render)
      }

      // Implementation

      var viewToModelFactory = {
        year: yearModelFactory,

        month: monthModelFactory,

        day: dayModelFactory,

        hour: hourModelFactory,

        minute: minuteModelFactory,

        setTime: setTime
      }

      function changeView (viewName, dateObject, event) {
        if (event) {
          event.stopPropagation()
          event.preventDefault()
        }

        if (viewName && (dateObject.utcDateValue > -Infinity) && dateObject.selectable && viewToModelFactory[viewName]) {
          var result = viewToModelFactory[viewName](dateObject.utcDateValue)

          var weekDates = []
          if (result.weeks) {
            for (var i = 0; i < result.weeks.length; i += 1) {
              var week = result.weeks[i]
              for (var j = 0; j < week.dates.length; j += 1) {
                var weekDate = week.dates[j]
                weekDates.push(weekDate)
              }
            }
          }

          $scope.beforeRender({
            $view: result.currentView,
            $dates: result.dates || weekDates,
            $leftDate: result.leftDate,
            $upDate: result.previousViewDate,
            $rightDate: result.rightDate
          })

          $scope.data = result
        }
      }

      function yearModelFactory (milliseconds) {
        var selectedDate = moment.utc(milliseconds).startOf('year')
        // View starts one year before the decade starts and ends one year after the decade ends
        // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
        // Truncate the last digit from the current year and subtract 1 to get the start of the decade
        var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10)
        var startDate = moment.utc(startOfDecade(milliseconds)).subtract(1, 'year').startOf('year')

        var yearFormat = 'YYYY'
        var activeFormat = formatValue(ngModelController.$modelValue, yearFormat)
        var currentFormat = moment().format(yearFormat)

        var result = {
          'currentView': 'year',
          'nextView': configuration.minView === 'year' ? 'setTime' : 'month',
          'previousViewDate': new DateObject({
            utcDateValue: null,
            display: startDecade + '-' + (startDecade + 9)
          }),
          'leftDate': new DateObject({utcDateValue: moment.utc(startDate).subtract(9, 'year').valueOf()}),
          'rightDate': new DateObject({utcDateValue: moment.utc(startDate).add(11, 'year').valueOf()}),
          'dates': []
        }

        for (var i = 0; i < 12; i += 1) {
          var yearMoment = moment.utc(startDate).add(i, 'years')
          var dateValue = {
            'active': yearMoment.format(yearFormat) === activeFormat,
            'current': yearMoment.format(yearFormat) === currentFormat,
            'display': yearMoment.format(yearFormat),
            'future': yearMoment.year() > startDecade + 9,
            'past': yearMoment.year() < startDecade,
            'utcDateValue': yearMoment.valueOf()
          }

          result.dates.push(new DateObject(dateValue))
        }

        return result
      }

      function monthModelFactory (milliseconds) {
        var startDate = moment.utc(milliseconds).startOf('year')
        var previousViewDate = startOfDecade(milliseconds)

        var monthFormat = 'YYYY-MMM'
        var activeFormat = formatValue(ngModelController.$modelValue, monthFormat)
        var currentFormat = moment().format(monthFormat)

        var result = {
          'previousView': 'year',
          'currentView': 'month',
          'nextView': configuration.minView === 'month' ? 'setTime' : 'day',
          'previousViewDate': new DateObject({
            utcDateValue: previousViewDate.valueOf(),
            display: startDate.format('YYYY')
          }),
          'leftDate': new DateObject({utcDateValue: moment.utc(startDate).subtract(1, 'year').valueOf()}),
          'rightDate': new DateObject({utcDateValue: moment.utc(startDate).add(1, 'year').valueOf()}),
          'dates': []
        }

        for (var i = 0; i < 12; i += 1) {
          var monthMoment = moment.utc(startDate).add(i, 'months')
          var dateValue = {
            'active': monthMoment.format(monthFormat) === activeFormat,
            'current': monthMoment.format(monthFormat) === currentFormat,
            'display': monthMoment.format('MMM'),
            'utcDateValue': monthMoment.valueOf()
          }

          result.dates.push(new DateObject(dateValue))
        }

        return result
      }

      function dayModelFactory (milliseconds) {
        var selectedDate = moment.utc(milliseconds)
        var startOfMonth = moment.utc(selectedDate).startOf('month')
        var previousViewDate = moment.utc(selectedDate).startOf('year')
        var endOfMonth = moment.utc(selectedDate).endOf('month')

        var startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days')

        var dayFormat = 'YYYY-MMM-DD'
        var activeFormat = formatValue(ngModelController.$modelValue, dayFormat)
        var currentFormat = moment().format(dayFormat)

        var result = {
          'previousView': 'month',
          'currentView': 'day',
          'nextView': configuration.minView === 'day' ? 'setTime' : 'hour',
          'previousViewDate': new DateObject({
            utcDateValue: previousViewDate.valueOf(),
            display: startOfMonth.format('YYYY-MMM')
          }),
          'leftDate': new DateObject({utcDateValue: moment.utc(startOfMonth).subtract(1, 'months').valueOf()}),
          'rightDate': new DateObject({utcDateValue: moment.utc(startOfMonth).add(1, 'months').valueOf()}),
          'dayNames': [],
          'weeks': []
        }

        for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
          result.dayNames.push(moment.utc().weekday(dayNumber).format('dd'))
        }

        for (var i = 0; i < 6; i += 1) {
          var week = {dates: []}
          for (var j = 0; j < 7; j += 1) {
            var dayMoment = moment.utc(startDate).add((i * 7) + j, 'days')
            var dateValue = {
              'active': dayMoment.format(dayFormat) === activeFormat,
              'current': dayMoment.format(dayFormat) === currentFormat,
              'display': dayMoment.format('D'),
              'future': dayMoment.isAfter(endOfMonth),
              'past': dayMoment.isBefore(startOfMonth),
              'utcDateValue': dayMoment.valueOf()
            }
            week.dates.push(new DateObject(dateValue))
          }
          result.weeks.push(week)
        }

        return result
      }

      function hourModelFactory (milliseconds) {
        var selectedDate = moment.utc(milliseconds).startOf('day')
        var previousViewDate = moment.utc(selectedDate).startOf('month')

        var hourFormat = 'YYYY-MM-DD H'
        var activeFormat = formatValue(ngModelController.$modelValue, hourFormat)
        var currentFormat = moment().format(hourFormat)

        var result = {
          'previousView': 'day',
          'currentView': 'hour',
          'nextView': configuration.minView === 'hour' ? 'setTime' : 'minute',
          'previousViewDate': new DateObject({
            utcDateValue: previousViewDate.valueOf(),
            display: selectedDate.format('ll')
          }),
          'leftDate': new DateObject({utcDateValue: moment.utc(selectedDate).subtract(1, 'days').valueOf()}),
          'rightDate': new DateObject({utcDateValue: moment.utc(selectedDate).add(1, 'days').valueOf()}),
          'dates': []
        }

        for (var i = 0; i < 24; i += 1) {
          var hourMoment = moment.utc(selectedDate).add(i, 'hours')
          var dateValue = {
            'active': hourMoment.format(hourFormat) === activeFormat,
            'current': hourMoment.format(hourFormat) === currentFormat,
            'display': hourMoment.format('LT'),
            'utcDateValue': hourMoment.valueOf()
          }

          result.dates.push(new DateObject(dateValue))
        }

        return result
      }

      function minuteModelFactory (milliseconds) {
        var selectedDate = moment.utc(milliseconds).startOf('hour')
        var previousViewDate = moment.utc(selectedDate).startOf('day')

        var minuteFormat = 'YYYY-MM-DD H:mm'
        var activeFormat = formatValue(ngModelController.$modelValue, minuteFormat)
        var currentFormat = moment().format(minuteFormat)

        var result = {
          'previousView': 'hour',
          'currentView': 'minute',
          'nextView': 'setTime',
          'previousViewDate': new DateObject({
            utcDateValue: previousViewDate.valueOf(),
            display: selectedDate.format('lll')
          }),
          'leftDate': new DateObject({utcDateValue: moment.utc(selectedDate).subtract(1, 'hours').valueOf()}),
          'rightDate': new DateObject({utcDateValue: moment.utc(selectedDate).add(1, 'hours').valueOf()}),
          'dates': []
        }

        var limit = 60 / configuration.minuteStep

        for (var i = 0; i < limit; i += 1) {
          var hourMoment = moment.utc(selectedDate).add(i * configuration.minuteStep, 'minute')
          var dateValue = {
            'active': hourMoment.format(minuteFormat) === activeFormat,
            'current': hourMoment.format(minuteFormat) === currentFormat,
            'display': hourMoment.format('LT'),
            'utcDateValue': hourMoment.valueOf()
          }

          result.dates.push(new DateObject(dateValue))
        }

        return result
      }

      function setTime (milliseconds) {
        var tempDate = new Date(milliseconds)
        var newDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds(), tempDate.getUTCMilliseconds())

        switch (configuration.modelType) {
          case 'Date':
            // No additional work needed
            break
          case 'moment':
            newDate = moment([tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds(), tempDate.getUTCMilliseconds()])
            break
          case 'milliseconds':
            newDate = milliseconds
            break
          default: // It is assumed that the modelType is a formatting string.
            newDate = moment([tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate(), tempDate.getUTCHours(), tempDate.getUTCMinutes(), tempDate.getUTCSeconds(), tempDate.getUTCMilliseconds()]).format(configuration.modelType)
        }

        var oldDate = ngModelController.$modelValue
        ngModelController.$setViewValue(newDate)

        if (configuration.dropdownSelector) {
          jQuery(configuration.dropdownSelector).dropdown('toggle')
        }

        $scope.onSetTime({newDate: newDate, oldDate: oldDate})

        return viewToModelFactory[configuration.startView](milliseconds)
      }

      function $render () {
        $scope.changeView(configuration.startView, new DateObject({utcDateValue: getUTCTime(ngModelController.$viewValue)}))
      }

      function startOfDecade (milliseconds) {
        var startYear = (parseInt(moment.utc(milliseconds).year() / 10, 10) * 10)
        return moment.utc(milliseconds).year(startYear).startOf('year')
      }

      function formatValue (timeValue, formatString) {
        if (timeValue) {
          return getMoment(timeValue).format(formatString)
        } else {
          return ''
        }
      }

      /**
       * Converts a time value into a moment.
       *
       * This function is now necessary because moment logs a warning when parsing a string without a format.
       * @param modelValue
       *  a time value in any of the supported formats (Date, moment, milliseconds, and string)
       * @returns {moment}
       *  representing the specified time value.
       */

      function getMoment (modelValue) {
        return moment(modelValue, angular.isString(modelValue) ? configuration.parseFormat : undefined)
      }

      /**
       * Converts a time value to UCT/GMT time.
       * @param modelValue
       *  a time value in any of the supported formats (Date, moment, milliseconds, and string)
       * @returns {number}
       *  number of milliseconds since 1/1/1970
       */

      function getUTCTime (modelValue) {
        var tempDate = new Date()
        if (modelValue) {
          var tempMoment = getMoment(modelValue)
          if (tempMoment.isValid()) {
            tempDate = tempMoment.toDate()
          } else {
            throw new Error('Invalid date: ' + modelValue)
          }
        }
        return tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000)
      }

      function createConfiguration () {
        var directiveConfig = {}

        if ($attrs.datetimepickerConfig) {
          directiveConfig = $scope.$parent.$eval($attrs.datetimepickerConfig)
        }

        var configuration = angular.extend({}, defaultConfig, directiveConfig)

        configurationValidator.validate(configuration)

        return configuration
      }
    }

    function DateObject () {
      var tempDate = new Date(arguments[0].utcDateValue)
      var localOffset = tempDate.getTimezoneOffset() * 60000

      this.utcDateValue = tempDate.getTime()
      this.selectable = true

      this.localDateValue = function localDateValue () {
        return this.utcDateValue + localOffset
      }

      var validProperties = ['active', 'current', 'display', 'future', 'past', 'selectable', 'utcDateValue']

      var constructorObject = arguments[0]

      Object.keys(constructorObject).filter(function (key) {
        return validProperties.indexOf(key) >= 0
      }).forEach(function (key) {
        this[key] = constructorObject[key]
      }, this)
    }

    return directiveDefinition
  }

  function DateTimePickerConfigProvider () {
    var defaultConfiguration = {
      configureOn: null,
      dropdownSelector: null,
      minuteStep: 5,
      minView: 'minute',
      modelType: 'Date',
      parseFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
      renderOn: null,
      startView: 'day'
    }

    var defaultLocalization = {
      'bg': {previous: 'предишна', next: 'следваща'},
      'ca': {previous: 'anterior', next: 'següent'},
      'da': {previous: 'forrige', next: 'næste'},
      'de': {previous: 'vorige', next: 'weiter'},
      'en-au': {previous: 'previous', next: 'next'},
      'en-gb': {previous: 'previous', next: 'next'},
      'en': {previous: 'previous', next: 'next'},
      'es-us': {previous: 'atrás', next: 'siguiente'},
      'es': {previous: 'atrás', next: 'siguiente'},
      'fi': {previous: 'edellinen', next: 'seuraava'},
      'fr': {previous: 'précédent', next: 'suivant'},
      'hu': {previous: 'előző', next: 'következő'},
      'it': {previous: 'precedente', next: 'successivo'},
      'ja': {previous: '前へ', next: '次へ'},
      'ml': {previous: 'മുൻപുള്ളത്', next: 'അടുത്തത്'},
      'nl': {previous: 'vorige', next: 'volgende'},
      'pl': {previous: 'poprzednia', next: 'następna'},
      'pt-br': {previous: 'anteriores', next: 'próximos'},
      'pt': {previous: 'anterior', next: 'próximo'},
      'ro': {previous: 'anterior', next: 'următor'},
      'ru': {previous: 'предыдущая', next: 'следующая'},
      'sk': {previous: 'predošlá', next: 'ďalšia'},
      'sv': {previous: 'föregående', next: 'nästa'},
      'tr': {previous: 'önceki', next: 'sonraki'},
      'uk': {previous: 'назад', next: 'далі'},
      'zh-cn': {previous: '上一页', next: '下一页'},
      'zh-tw': {previous: '上一頁', next: '下一頁'}
    }

    var screenReader = defaultLocalization[moment.locale().toLowerCase()]

    return angular.extend({}, defaultConfiguration, {screenReader: screenReader})
  }

  DateTimePickerValidatorService.$inject = ['$log']

  function DateTimePickerValidatorService ($log) {
    return {
      validate: validator
    }

    function validator (configuration) {
      var validOptions = [
        'configureOn',
        'dropdownSelector',
        'minuteStep',
        'minView',
        'modelType',
        'parseFormat',
        'renderOn',
        'startView',
        'screenReader'
      ]

      var invalidOptions = Object.keys(configuration).filter(function (key) {
        return (validOptions.indexOf(key) < 0)
      })

      if (invalidOptions.length) {
        throw new Error('Invalid options: ' + invalidOptions.join(', '))
      }

      // Order of the elements in the validViews array is significant.
      var validViews = ['minute', 'hour', 'day', 'month', 'year']

      if (validViews.indexOf(configuration.startView) < 0) {
        throw new Error('invalid startView value: ' + configuration.startView)
      }

      if (validViews.indexOf(configuration.minView) < 0) {
        throw new Error('invalid minView value: ' + configuration.minView)
      }

      if (validViews.indexOf(configuration.minView) > validViews.indexOf(configuration.startView)) {
        throw new Error('startView must be greater than minView')
      }

      if (!angular.isNumber(configuration.minuteStep)) {
        throw new Error('minuteStep must be numeric')
      }
      if (configuration.minuteStep <= 0 || configuration.minuteStep >= 60) {
        throw new Error('minuteStep must be greater than zero and less than 60')
      }
      if (configuration.configureOn !== null && !angular.isString(configuration.configureOn)) {
        throw new Error('configureOn must be a string')
      }
      if (configuration.configureOn !== null && configuration.configureOn.length < 1) {
        throw new Error('configureOn must not be an empty string')
      }
      if (configuration.renderOn !== null && !angular.isString(configuration.renderOn)) {
        throw new Error('renderOn must be a string')
      }
      if (configuration.renderOn !== null && configuration.renderOn.length < 1) {
        throw new Error('renderOn must not be an empty string')
      }
      if (configuration.modelType !== null && !angular.isString(configuration.modelType)) {
        throw new Error('modelType must be a string')
      }
      if (configuration.modelType !== null && configuration.modelType.length < 1) {
        throw new Error('modelType must not be an empty string')
      }
      if (configuration.modelType !== 'Date' && configuration.modelType !== 'moment' && configuration.modelType !== 'milliseconds') {
        // modelType contains string format, overriding parseFormat with modelType
        configuration.parseFormat = configuration.modelType
      }
      if (configuration.dropdownSelector !== null && !angular.isString(configuration.dropdownSelector)) {
        throw new Error('dropdownSelector must be a string')
      }

      /* istanbul ignore next */
      if (configuration.dropdownSelector !== null && ((typeof jQuery === 'undefined') || (typeof jQuery().dropdown !== 'function'))) {
        $log.error('Please DO NOT specify the dropdownSelector option unless you are using jQuery AND Bootstrap.js. ' +
          'Please include jQuery AND Bootstrap.js, or write code to close the dropdown in the on-set-time callback. \n\n' +
          'The dropdownSelector configuration option is being removed because it will not function properly.')
        delete configuration.dropdownSelector
      }
    }
  }
})); // eslint-disable-line semi

angular.module("rzTable",[]),angular.module("rzTable").directive("rzTable",["resizeStorage","$injector","$parse",function(t,n,e){function o(t){}function r(t,n,e){W=n,I=t.container?$(t.container):$(W).parent(),t.options=e.rzOptions?t.options||{}:{},$(W).addClass(t.options.tableClass||"rz-table"),h(W,e,t),u(W,e,t),a(W,e,t),s(W,e,t)}function i(t,n,e){return function(o,r){e.busy!==!0&&void 0!==r&&r!==o&&(l(t),h(t,n,e))}}function s(t,n,e){e.$watch("profile",i(t,n,e)),e.$watch("mode",i(t,n,e)),e.$watch("busy",i(t,n,e))}function a(t,n,e){e.$watch(function(){return $(t).find("th").length},i(t,n,e))}function u(n,o,r){if(o.rzModel){var i=e(o.rzModel);i.assign(r.$parent,{update:function(){l(n),h(n,o,r)},reset:function(){c(n),this.clearStorageActive(),this.update()},clearStorage:function(){t.clearAll()},clearStorageActive:function(){t.clearCurrent(n,w,S)}})}}function l(t){x=!0,d(t)}function c(t){$(t).outerWidth("100%"),$(t).find("th").width("auto")}function d(t){D.map(function(t){t.remove()}),D=[]}function h(n,e,o){if(!o.busy){T=$(n).find("th"),w=o.mode,C=!angular.isDefined(o.saveTableSizes)||o.saveTableSizes,S=o.profile;var r=z(o,e);r&&(O=new r(n,T,I),C&&(E=t.loadTableSizes(n,o.mode,o.profile)),M=O.handles(T),R=O.ctrlColumns,O.setup(),g(E),M.each(function(t,e){f(o,n,e)}))}}function f(t,n,e){var o=$("<div>",{"class":t.options.handleClass||"rz-handle"});$(e).prepend(o),D.push(o);var r=O.handleMiddleware(o,e);p(t,n,o,r)}function p(t,n,e,o){$(e).mousedown(function(n){x&&(O.onFirstDrag(o,e),O.onTableReady(),x=!1),t.options.onResizeStarted&&t.options.onResizeStarted(o);var r={};O.intervene&&(r=O.intervene.selector(o),r.column=r,r.orgWidth=$(r).width()),n.preventDefault(),$(e).addClass(t.options.handleClassActive||"rz-handle-active");var i=n.clientX,s=$(o).width();A=m(t,o,i,s,r),$(window).mousemove(A),$(window).one("mouseup",y(t,o,e))})}function m(t,n,e,o,r){return function(i){var s=i.clientX,a=s-e,u=O.calculate(o,a);if(!(u<v(n)||O.restrict(u,a))){if(O.intervene){var l=O.intervene.calculator(r.orgWidth,a);if(l<v(r.column))return;if(O.intervene.restrict(l,a))return;$(r.column).width(l)}t.options.onResizeInProgress&&t.options.onResizeInProgress(n,u,a),$(n).width(u)}}}function v(t){return parseInt($(t).css("min-width"))||0}function z(t,e){try{var o=e.rzMode?t.mode:"BasicResizer",r=n.get(o);return r}catch(i){return console.error("The resizer "+t.mode+" was not found"),null}}function y(t,n,e){return function(){$(e).removeClass(t.options.handleClassActive||"rz-handle-active"),A&&$(window).unbind("mousemove",A),t.options.onResizeEnded&&t.options.onResizeEnded(n),O.onEndDrag(),b()}}function b(){C&&(E||(E={}),$(T).each(function(t,n){var e=angular.element(n).scope(),o=e.rzCol||$(n).attr("id");o&&(E[o]=O.saveAttr(n))}),t.saveTableSizes(W,w,S,E))}function g(t){t&&($(W).width("auto"),R.each(function(n,e){var o=angular.element(e).scope(),r=o.rzCol||$(e).attr("id"),i=t[r];$(e).css({width:i})}),O.onTableReady())}var w,C,S,T=null,R=null,M=null,A=null,D=[],W=null,I=null,O=null,x=!0,E=null;return o.$inject=["$scope","$attrs","$element"],{restrict:"A",link:r,controller:o,scope:{mode:"=rzMode",profile:"=?rzProfile",busy:"=?rzBusy",saveTableSizes:"=?rzSave",options:"=?rzOptions",model:"=rzModel",container:"@rzContainer"}}}]),angular.module("rzTable").directive("rzCol",[function(){function t(t,n,e){t.rzCol=t.$eval(e.rzCol)}return{restrict:"A",priority:650,link:t,require:"^^rzTable",scope:!0}}]),angular.module("rzTable").service("resizeStorage",["$window",function(t){function n(t,n,o){var r=t.attr("id");return r?e+"."+t.attr("id")+"."+n+(o?"."+o:""):void console.error("Table has no id",t)}var e="ngColumnResize";this.loadTableSizes=function(e,o,r){var i=n(e,o,r),s=t.localStorage.getItem(i);return JSON.parse(s)},this.saveTableSizes=function(e,o,r,i){var s=n(e,o,r);if(s){var a=JSON.stringify(i);t.localStorage.setItem(s,a)}},this.clearAll=function(){for(var n=[],o=0;o<t.localStorage.length;++o){var r=localStorage.key(o);r&&r.startsWith(e)&&n.push(r)}n.map(function(n){t.localStorage.removeItem(n)})},this.clearCurrent=function(e,o,r){var i=n(e,o,r);i&&t.localStorage.removeItem(i)}}]),angular.module("rzTable").factory("ResizerModel",[function(){function t(t,n,e){this.table=t,this.columns=n,this.container=e,this.handleColumns=this.handles(),this.ctrlColumns=this.ctrlColumns()}return t.prototype.setup=function(){$(this.container).css({overflowX:"hidden"})},t.prototype.onTableReady=function(){$(this.table).outerWidth("100%")},t.prototype.getMinWidth=function(t){return parseInt($(t).css("min-width"))||0},t.prototype.handles=function(){return this.columns},t.prototype.ctrlColumns=function(){return this.handleColumns},t.prototype.onFirstDrag=function(){$(this.ctrlColumns).each(function(t,n){$(n).width($(n).width())})},t.prototype.handleMiddleware=function(t,n){return n},t.prototype.restrict=function(t){return!1},t.prototype.calculate=function(t,n){return t+n},t.prototype.onEndDrag=function(){},t.prototype.saveAttr=function(t){return $(t).outerWidth()},t}]),angular.module("rzTable").factory("BasicResizer",["ResizerModel",function(t){function n(n,i,s){t.call(this,n,i,s),this.ctrlColumns=this.columns,this.intervene={selector:e,calculator:o,restrict:r}}function e(t){return $(t).next()}function o(t,n){return t-n}function r(t){return t<25}return n.prototype=Object.create(t.prototype),n.prototype.setup=function(){$(this.container).css({overflowX:"hidden"}),$(this.table).css({width:"100%"})},n.prototype.handles=function(){return $(this.columns).not(":last")},n.prototype.onFirstDrag=function(){this.onEndDrag()},n.prototype.onEndDrag=function(){var t=$(this.table).outerWidth(),n=[];$(this.columns).each(function(e,o){var r=$(o).outerWidth(),i=r/t*100+"%";n.push(function(){$(o).css({width:i})})}),n.map(function(t){t()})},n.prototype.saveAttr=function(t){return $(t)[0].style.width},n}]),angular.module("rzTable").factory("FixedResizer",["ResizerModel",function(t){function n(n,e,o){t.call(this,n,e,o),this.fixedColumn=$(n).find("th").first(),this.bound=!1}return n.prototype=Object.create(t.prototype),n.prototype.setup=function(){$(this.container).css({overflowX:"hidden"}),$(this.table).css({width:"100%"}),$(this.columns).first().css({width:"auto"})},n.prototype.handles=function(){return $(this.columns).not(":last")},n.prototype.ctrlColumns=function(){return $(this.columns).not(":first")},n.prototype.onFirstDrag=function(){$(this.ctrlColumns).each(function(t,n){$(n).width($(n).width())})},n.prototype.handleMiddleware=function(t,n){return $(n).next()},n.prototype.restrict=function(t,n){return this.bound&&this.bound<n?(this.bound=!1,!1):!!(this.bound&&this.bound>n)||(this.fixedColumn.width()<=this.getMinWidth(this.fixedColumn)?(this.bound=n,$(this.fixedColumn).width(this.minWidth),!0):void 0)},n.prototype.onEndDrag=function(){this.bound=!1},n.prototype.calculate=function(t,n){return t-n},n}]),angular.module("rzTable").factory("OverflowResizer",["ResizerModel",function(t){function n(n,e,o){t.call(this,n,e,o)}return n.prototype=Object.create(t.prototype),n.prototype.setup=function(){$(this.container).css({overflow:"auto"})},n.prototype.onTableReady=function(){$(this.table).width(1)},n}]);
(function (root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'));
    } else {
        root.angularClipboard = factory(root.angular);
  }
}(this, function (angular) {

return angular.module('angular-clipboard', [])
    .factory('clipboard', ['$document', '$window', function ($document, $window) {
        function createNode(text, context) {
            var node = $document[0].createElement('textarea');
            node.style.position = 'absolute';
            node.style.fontSize = '12pt';
            node.style.border = '0';
            node.style.padding = '0';
            node.style.margin = '0';
            node.style.left = '-10000px';
            node.style.top = ($window.pageYOffset || $document[0].documentElement.scrollTop) + 'px';
            node.textContent = text;
            return node;
        }

        function copyNode(node) {
            try {
                // Set inline style to override css styles
                $document[0].body.style.webkitUserSelect = 'initial';

                var selection = $document[0].getSelection();
                selection.removeAllRanges();

                var range = document.createRange();
                range.selectNodeContents(node);
                selection.addRange(range);
                // This makes it work in all desktop browsers (Chrome)
                node.select();
                // This makes it work on Mobile Safari
                node.setSelectionRange(0, 999999);

                try {
                    if(!$document[0].execCommand('copy')) {
                        throw('failure copy');
                    }
                } finally {
                    selection.removeAllRanges();
                }
            } finally {
                // Reset inline style
                $document[0].body.style.webkitUserSelect = '';
            }
        }

        function copyText(text, context) {
            var left = $window.pageXOffset || $document[0].documentElement.scrollLeft;
            var top = $window.pageYOffset || $document[0].documentElement.scrollTop;
            
            var node = createNode(text, context);
            $document[0].body.appendChild(node);
            copyNode(node);

            $window.scrollTo(left, top);
            $document[0].body.removeChild(node);
        }

        return {
            copyText: copyText,
            supported: 'queryCommandSupported' in $document[0] && $document[0].queryCommandSupported('copy')
        };
    }])
    .directive('clipboard', ['clipboard', function (clipboard) {
        return {
            restrict: 'A',
            scope: {
                onCopied: '&',
                onError: '&',
                text: '=',
                supported: '=?'
            },
            link: function (scope, element) {
                scope.supported = clipboard.supported;

                element.on('click', function (event) {
                    try {
                        clipboard.copyText(scope.text, element[0]);
                        if (angular.isFunction(scope.onCopied)) {
                            scope.$evalAsync(scope.onCopied());
                        }
                    } catch (err) {
                        if (angular.isFunction(scope.onError)) {
                            scope.$evalAsync(scope.onError({err: err}));
                        }
                    }
                });
            }
        };
    }]);

}));

/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('sifter', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
}(this, function() {

	/**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
	var Sifter = function(items, settings) {
		this.items = items;
		this.settings = settings || {diacritics: true};
	};

	/**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
	Sifter.prototype.tokenize = function(query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string : words[i],
				regex  : new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
	Sifter.prototype.iterator = function(object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function(callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
	Sifter.prototype.getScoreFunction = function(search, options) {
		var self, fields, tokens, token_count, nesting;

		self        = this;
		search      = self.prepareSearch(search, options);
		tokens      = search.tokens;
		fields      = search.options.fields;
		token_count = tokens.length;
		nesting     = search.options.nesting;

		/**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
		var scoreValue = function(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
		var scoreObject = (function() {
			var field_count = fields.length;
			if (!field_count) {
				return function() { return 0; };
			}
			if (field_count === 1) {
				return function(token, data) {
					return scoreValue(getattr(data, fields[0], nesting), token);
				};
			}
			return function(token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(getattr(data, fields[i], nesting), token);
				}
				return sum / field_count;
			};
		})();

		if (!token_count) {
			return function() { return 0; };
		}
		if (token_count === 1) {
			return function(data) {
				return scoreObject(tokens[0], data);
			};
		}

		if (search.options.conjunction === 'and') {
			return function(data) {
				var score;
				for (var i = 0, sum = 0; i < token_count; i++) {
					score = scoreObject(tokens[i], data);
					if (score <= 0) return 0;
					sum += score;
				}
				return sum / token_count;
			};
		} else {
			return function(data) {
				for (var i = 0, sum = 0; i < token_count; i++) {
					sum += scoreObject(tokens[i], data);
				}
				return sum / token_count;
			};
		}
	};

	/**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
	Sifter.prototype.getSortFunction = function(search, options) {
		var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

		self   = this;
		search = self.prepareSearch(search, options);
		sort   = (!search.query && options.sort_empty) || options.sort;

		/**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
		get_field = function(name, result) {
			if (name === '$score') return result.score;
			return getattr(self.items[result.id], name, options.nesting);
		};

		// parse options
		fields = [];
		if (sort) {
			for (i = 0, n = sort.length; i < n; i++) {
				if (search.query || sort[i].field !== '$score') {
					fields.push(sort[i]);
				}
			}
		}

		// the "$score" field is implied to be the primary
		// sort field, unless it's manually specified
		if (search.query) {
			implicit_score = true;
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					implicit_score = false;
					break;
				}
			}
			if (implicit_score) {
				fields.unshift({field: '$score', direction: 'desc'});
			}
		} else {
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					fields.splice(i, 1);
					break;
				}
			}
		}

		multipliers = [];
		for (i = 0, n = fields.length; i < n; i++) {
			multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
		}

		// build function
		fields_count = fields.length;
		if (!fields_count) {
			return null;
		} else if (fields_count === 1) {
			field = fields[0].field;
			multiplier = multipliers[0];
			return function(a, b) {
				return multiplier * cmp(
					get_field(field, a),
					get_field(field, b)
				);
			};
		} else {
			return function(a, b) {
				var i, result, a_value, b_value, field;
				for (i = 0; i < fields_count; i++) {
					field = fields[i].field;
					result = multipliers[i] * cmp(
						get_field(field, a),
						get_field(field, b)
					);
					if (result) return result;
				}
				return 0;
			};
		}
	};

	/**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.prepareSearch = function(query, options) {
		if (typeof query === 'object') return query;

		options = extend({}, options);

		var option_fields     = options.fields;
		var option_sort       = options.sort;
		var option_sort_empty = options.sort_empty;

		if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
		if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
		if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

		return {
			options : options,
			query   : String(query || '').toLowerCase(),
			tokens  : this.tokenize(query),
			total   : 0,
			items   : []
		};
	};

	/**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.search = function(query, options) {
		var self = this, value, score, search, calculateScore;
		var fn_sort;
		var fn_score;

		search  = this.prepareSearch(query, options);
		options = search.options;
		query   = search.query;

		// generate result scoring function
		fn_score = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function(item, id) {
				score = fn_score(item);
				if (options.filter === false || score > 0) {
					search.items.push({'score': score, 'id': id});
				}
			});
		} else {
			self.iterator(self.items, function(item, id) {
				search.items.push({'score': 1, 'id': id});
			});
		}

		fn_sort = self.getSortFunction(search, options);
		if (fn_sort) search.items.sort(fn_sort);

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
		a = asciifold(String(a || ''));
		b = asciifold(String(b || ''));
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @param  {Boolean} nesting Handle nesting or not
	 * @return {Object}          The resolved property value
	 */
	var getattr = function(obj, name, nesting) {
	    if (!obj || !name) return;
	    if (!nesting) return obj[name];
	    var names = name.split(".");
	    while(names.length && (obj = obj[names.shift()]));
	    return obj;
	};

	var trim = function(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || (typeof $ !== 'undefined' && $.isArray) || function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
		'b': '[b␢βΒB฿𐌁ᛒ]',
		'c': '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
		'd': '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
		'e': '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
		'f': '[fƑƒḞḟ]',
		'g': '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
		'h': '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
		'i': '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
		'j': '[jȷĴĵɈɉʝɟʲ]',
		'k': '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
		'l': '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
		'n': '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
		'o': '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
		'p': '[pṔṕṖṗⱣᵽƤƥᵱ]',
		'q': '[qꝖꝗʠɊɋꝘꝙq̃]',
		'r': '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
		's': '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
		't': '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
		'u': '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
		'v': '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
		'w': '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
		'x': '[xẌẍẊẋχ]',
		'y': '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
		'z': '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]'
	};

	var asciifold = (function() {
		var i, n, k, chunk;
		var foreignletters = '';
		var lookup = {};
		for (k in DIACRITICS) {
			if (DIACRITICS.hasOwnProperty(k)) {
				chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
				foreignletters += chunk;
				for (i = 0, n = chunk.length; i < n; i++) {
					lookup[chunk.charAt(i)] = k;
				}
			}
		}
		var regexp = new RegExp('[' +  foreignletters + ']', 'g');
		return function(str) {
			return str.replace(regexp, function(foreignletter) {
				return lookup[foreignletter];
			}).toLowerCase();
		};
	})();


	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;
}));



/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('microplugin', factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
}(this, function() {
	var MicroPlugin = {};

	MicroPlugin.mixin = function(Interface) {
		Interface.plugins = {};

		/**
		 * Initializes the listed plugins (with options).
		 * Acceptable formats:
		 *
		 * List (without options):
		 *   ['a', 'b', 'c']
		 *
		 * List (with options):
		 *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
		 *
		 * Hash (with options):
		 *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
		 *
		 * @param {mixed} plugins
		 */
		Interface.prototype.initializePlugins = function(plugins) {
			var i, n, key;
			var self  = this;
			var queue = [];

			self.plugins = {
				names     : [],
				settings  : {},
				requested : {},
				loaded    : {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function(name) {
			var self    = this;
			var plugins = self.plugins;
			var plugin  = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' +  name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
		 * Initializes a plugin.
		 *
		 * @param {string} name
		 */
		Interface.prototype.require = function(name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
		 * Registers a plugin.
		 *
		 * @param {string} name
		 * @param {function} fn
		 */
		Interface.define = function(name, fn) {
			Interface.plugins[name] = {
				'name' : name,
				'fn'   : fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function(vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
}));

/**
 * selectize.js (v0.12.6)
 * Copyright (c) 2013–2015 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('selectize', ['jquery','sifter','microplugin'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'), require('sifter'), require('microplugin'));
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
}(this, function($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = (typeof pattern === 'string') ? new RegExp(pattern, 'i') : pattern;
	
		var highlight = function(node) {
			var skip = 0;
			// Wrap matching part of text node with highlighting <span>, e.g.
			// Soccer  ->  <span class="highlight">Soc</span>cer  for regex = /soc/i
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} 
			// Recurse element node, looking for child text nodes to highlight, unless element 
			// is childless, <script>, <style>, or already highlighted: <span class="hightlight">
			else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && ( node.className !== 'highlight' || node.tagName !== 'SPAN' )) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};
	
		return $element.each(function() {
			highlight(this);
		});
	};
	
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with() and pass js strict mode
	 */
	$.fn.removeHighlight = function() {
		return this.find("span.highlight").each(function() {
			this.parentNode.firstChild.nodeName;
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};
	
	
	var MicroEvent = function() {};
	MicroEvent.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];
	
			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function(event /* , args... */){
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	/**
	 * Mixin will delegate all MicroEvent.js function in the destination object.
	 *
	 * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
	 *
	 * @param {object} the object which will support MicroEvent
	 */
	MicroEvent.mixin = function(destObject){
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++){
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};
	
	var IS_MAC        = /Mac/.test(navigator.userAgent);
	
	var KEY_A         = 65;
	var KEY_COMMA     = 188;
	var KEY_RETURN    = 13;
	var KEY_ESC       = 27;
	var KEY_LEFT      = 37;
	var KEY_UP        = 38;
	var KEY_P         = 80;
	var KEY_RIGHT     = 39;
	var KEY_DOWN      = 40;
	var KEY_N         = 78;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE    = 46;
	var KEY_SHIFT     = 16;
	var KEY_CMD       = IS_MAC ? 91 : 17;
	var KEY_CTRL      = IS_MAC ? 18 : 17;
	var KEY_TAB       = 9;
	
	var TAG_SELECT    = 1;
	var TAG_INPUT     = 2;
	
	// for now, android support in general is too spotty to support validity
	var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
	
	
	var isset = function(object) {
		return typeof object !== 'undefined';
	};
	
	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 * @param {string} value
	 * @returns {string|null}
	 */
	var hash_key = function(value) {
		if (typeof value === 'undefined' || value === null) return null;
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};
	
	/**
	 * Escapes a string for use within HTML.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_html = function(str) {
		return (str + '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
	
	/**
	 * Escapes "$" characters in replacement strings.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_replace = function(str) {
		return (str + '').replace(/\$/g, '$$$$');
	};
	
	var hook = {};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked before the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.before = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked after the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.after = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be invoked once.
	 *
	 * @param {function} fn
	 * @returns {function}
	 */
	var once = function(fn) {
		var called = false;
		return function() {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be called once
	 * every `delay` milliseconds (invoked on the falling edge).
	 *
	 * @param {function} fn
	 * @param {int} delay
	 * @returns {function}
	 */
	var debounce = function(fn, delay) {
		var timeout;
		return function() {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};
	
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 * @param {object} self
	 * @param {array} types
	 * @param {function} fn
	 */
	var debounce_events = function(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};
	
		// override trigger method
		self.trigger = function() {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};
	
		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;
	
		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};
	
	/**
	 * A workaround for http://bugs.jquery.com/ticket/6696
	 *
	 * @param {object} $parent - Parent element to listen on.
	 * @param {string} event - Event name.
	 * @param {string} selector - Descendant selector to filter by.
	 * @param {function} fn - Event handler.
	 */
	var watchChildEvent = function($parent, event, selector, fn) {
		$parent.on(event, selector, function(e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};
	
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 * @param {object} input
	 * @returns {object}
	 */
	var getSelection = function(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};
	
	/**
	 * Copies CSS properties from one element to another.
	 *
	 * @param {object} $from
	 * @param {object} $to
	 * @param {array} properties
	 */
	var transferStyles = function($from, $to, properties) {
		var i, n, styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};
	
	/**
	 * Measures the width of a string within a
	 * parent element (in pixels).
	 *
	 * @param {string} str
	 * @param {object} $parent
	 * @returns {int}
	 */
	var measureString = function(str, $parent) {
		if (!str) {
			return 0;
		}
	
		if (!Selectize.$testInput) {
			Selectize.$testInput = $('<span />').css({
				position: 'absolute',
				top: -99999,
				left: -99999,
				width: 'auto',
				padding: 0,
				whiteSpace: 'pre'
			}).appendTo('body');
		}
	
		Selectize.$testInput.text(str);
	
		transferStyles($parent, Selectize.$testInput, [
			'letterSpacing',
			'fontSize',
			'fontFamily',
			'fontWeight',
			'textTransform'
		]);
	
		return Selectize.$testInput.width();
	};
	
	/**
	 * Sets up an input to grow horizontally as the user
	 * types. If the value is changed manually, you can
	 * trigger the "update" handler to resize:
	 *
	 * $input.trigger('update');
	 *
	 * @param {object} $input
	 */
	var autoGrow = function($input) {
		var currentWidth = null;
	
		var update = function(e, options) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
			options = options || {};
	
			if (e.metaKey || e.altKey) return;
			if (!options.force && $input.data('grow') === false) return;
	
			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = (
					(keyCode >= 48 && keyCode <= 57)  || // 0-9
					(keyCode >= 65 && keyCode <= 90)   || // a-z
					(keyCode >= 96 && keyCode <= 111)  || // numpad 0-9, numeric operators
					(keyCode >= 186 && keyCode <= 222) || // semicolon, equal, comma, dash, etc.
					keyCode === 32 // space
				);
	
				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();
					else character = character.toLowerCase();
					value += character;
				}
			}
	
			placeholder = $input.attr('placeholder');
			if (!value && placeholder) {
				value = placeholder;
			}
	
			width = measureString(value, $input) + 4;
			if (width !== currentWidth) {
				currentWidth = width;
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};
	
		$input.on('keydown keyup update blur', update);
		update();
	};
	
	var domToString = function(d) {
		var tmp = document.createElement('div');
	
		tmp.appendChild(d.cloneNode(true));
	
		return tmp.innerHTML;
	};
	
	var logError = function(message, options){
		if(!options) options = {};
		var component = "Selectize";
	
		console.error(component + ": " + message)
	
		if(options.explanation){
			// console.group is undefined in <IE11
			if(console.group) console.group();
			console.error(options.explanation);
			if(console.group) console.groupEnd();
		}
	}
	
	
	var Selectize = function($input, settings) {
		var key, i, n, dir, input, self = this;
		input = $input[0];
		input.selectize = self;
	
		// detect rtl environment
		var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
		dir = computedStyle ? computedStyle.getPropertyValue('direction') : input.currentStyle && input.currentStyle.direction;
		dir = dir || $input.parents('[dir]:first').attr('dir') || '';
	
		// setup default state
		$.extend(self, {
			order            : 0,
			settings         : settings,
			$input           : $input,
			tabIndex         : $input.attr('tabindex') || '',
			tagType          : input.tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
			rtl              : /rtl/i.test(dir),
	
			eventNS          : '.selectize' + (++Selectize.count),
			highlightedValue : null,
			isBlurring       : false,
			isOpen           : false,
			isDisabled       : false,
			isRequired       : $input.is('[required]'),
			isInvalid        : false,
			isLocked         : false,
			isFocused        : false,
			isInputHidden    : false,
			isSetup          : false,
			isShiftDown      : false,
			isCmdDown        : false,
			isCtrlDown       : false,
			ignoreFocus      : false,
			ignoreBlur       : false,
			ignoreHover      : false,
			hasOptions       : false,
			currentResults   : null,
			lastValue        : '',
			caretPos         : 0,
			loading          : 0,
			loadedSearches   : {},
	
			$activeOption    : null,
			$activeItems     : [],
	
			optgroups        : {},
			options          : {},
			userOptions      : {},
			items            : [],
			renderCache      : {},
			onSearchChange   : settings.loadThrottle === null ? self.onSearchChange : debounce(self.onSearchChange, settings.loadThrottle)
		});
	
		// search system
		self.sifter = new Sifter(this.options, {diacritics: settings.diacritics});
	
		// build options table
		if (self.settings.options) {
			for (i = 0, n = self.settings.options.length; i < n; i++) {
				self.registerOption(self.settings.options[i]);
			}
			delete self.settings.options;
		}
	
		// build optgroup table
		if (self.settings.optgroups) {
			for (i = 0, n = self.settings.optgroups.length; i < n; i++) {
				self.registerOptionGroup(self.settings.optgroups[i]);
			}
			delete self.settings.optgroups;
		}
	
		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}
	
		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};
	
	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	MicroEvent.mixin(Selectize);
	
	if(typeof MicroPlugin !== "undefined"){
		MicroPlugin.mixin(Selectize);
	}else{
		logError("Dependency MicroPlugin is missing",
			{explanation:
				"Make sure you either: (1) are using the \"standalone\" "+
				"version of Selectize, or (2) require MicroPlugin before you "+
				"load Selectize."}
		);
	}
	
	
	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	$.extend(Selectize.prototype, {
	
		/**
		 * Creates all elements and sets up event bindings.
		 */
		setup: function() {
			var self      = this;
			var settings  = self.settings;
			var eventNS   = self.eventNS;
			var $window   = $(window);
			var $document = $(document);
			var $input    = self.$input;
	
			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var classes;
			var classes_plugins;
			var inputId;
	
			inputMode         = self.settings.mode;
			classes           = $input.attr('class') || '';
	
			$wrapper          = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control          = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input    = $('<input type="text" autocomplete="off" />').appendTo($control).attr('tabindex', $input.is(':disabled') ? '-1' : self.tabIndex);
			$dropdown_parent  = $(settings.dropdownParent || $wrapper);
			$dropdown         = $('<div>').addClass(settings.dropdownClass).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);
	
			if(inputId = $input.attr('id')) {
				$control_input.attr('id', inputId + '-selectized');
				$("label[for='"+inputId+"']").attr('for', inputId + '-selectized');
			}
	
			if(self.settings.copyClassesToDropdown) {
				$dropdown.addClass(classes);
			}
	
			$wrapper.css({
				width: $input[0].style.width
			});
	
			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}
	
			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				$input.attr('multiple', 'multiple');
			}
	
			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}
	
			// if splitOn was not passed in, construct it from the delimiter to allow pasting universally
			if (!self.settings.splitOn && self.settings.delimiter) {
				var delimiterEscaped = self.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				self.settings.splitOn = new RegExp('\\s*' + delimiterEscaped + '+\\s*');
			}
	
			if ($input.attr('autocorrect')) {
				$control_input.attr('autocorrect', $input.attr('autocorrect'));
			}
	
			if ($input.attr('autocapitalize')) {
				$control_input.attr('autocapitalize', $input.attr('autocapitalize'));
			}
			$control_input[0].type = $input[0].type;
	
			self.$wrapper          = $wrapper;
			self.$control          = $control;
			self.$control_input    = $control_input;
			self.$dropdown         = $dropdown;
			self.$dropdown_content = $dropdown_content;
	
			$dropdown.on('mouseenter mousedown click', '[data-disabled]>[data-selectable]', function(e) { e.stopImmediatePropagation(); });
			$dropdown.on('mouseenter', '[data-selectable]', function() { return self.onOptionHover.apply(self, arguments); });
			$dropdown.on('mousedown click', '[data-selectable]', function() { return self.onOptionSelect.apply(self, arguments); });
			watchChildEvent($control, 'mousedown', '*:not(input)', function() { return self.onItemSelect.apply(self, arguments); });
			autoGrow($control_input);
	
			$control.on({
				mousedown : function() { return self.onMouseDown.apply(self, arguments); },
				click     : function() { return self.onClick.apply(self, arguments); }
			});
	
			$control_input.on({
				mousedown : function(e) { e.stopPropagation(); },
				keydown   : function() { return self.onKeyDown.apply(self, arguments); },
				keyup     : function() { return self.onKeyUp.apply(self, arguments); },
				keypress  : function() { return self.onKeyPress.apply(self, arguments); },
				resize    : function() { self.positionDropdown.apply(self, []); },
				blur      : function() { return self.onBlur.apply(self, arguments); },
				focus     : function() { self.ignoreBlur = false; return self.onFocus.apply(self, arguments); },
				paste     : function() { return self.onPaste.apply(self, arguments); }
			});
	
			$document.on('keydown' + eventNS, function(e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});
	
			$document.on('keyup' + eventNS, function(e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});
	
			$document.on('mousedown' + eventNS, function(e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						return false;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur(e.target);
					}
				}
			});
	
			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function() {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function() {
				self.ignoreHover = false;
			});
	
			// store original children and tab index so that they can be
			// restored when the destroy() method is called.
			this.revertSettings = {
				$children : $input.children().detach(),
				tabindex  : $input.attr('tabindex')
			};
	
			$input.attr('tabindex', -1).hide().after(self.$wrapper);
	
			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}
	
			// feature detect for the validation API
			if (SUPPORTS_VALIDITY_API) {
				$input.on('invalid' + eventNS, function(e) {
					e.preventDefault();
					self.isInvalid = true;
					self.refreshState();
				});
			}
	
			self.updateOriginalInput();
			self.refreshItems();
			self.refreshState();
			self.updatePlaceholder();
			self.isSetup = true;
	
			if ($input.is(':disabled')) {
				self.disable();
			}
	
			self.on('change', this.onChange);
	
			$input.data('selectize', self);
			$input.addClass('selectized');
			self.trigger('initialize');
	
			// preload options
			if (settings.preload === true) {
				self.onSearchChange('');
			}
	
		},
	
		/**
		 * Sets up default rendering functions.
		 */
		setupTemplates: function() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;
	
			var templates = {
				'optgroup': function(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				}
			};
	
			self.settings.render = $.extend({}, templates, self.settings.render);
		},
	
		/**
		 * Maps fired events to callbacks provided
		 * in the settings used when creating the control.
		 */
		setupCallbacks: function() {
			var key, fn, callbacks = {
				'initialize'      : 'onInitialize',
				'change'          : 'onChange',
				'item_add'        : 'onItemAdd',
				'item_remove'     : 'onItemRemove',
				'clear'           : 'onClear',
				'option_add'      : 'onOptionAdd',
				'option_remove'   : 'onOptionRemove',
				'option_clear'    : 'onOptionClear',
				'optgroup_add'    : 'onOptionGroupAdd',
				'optgroup_remove' : 'onOptionGroupRemove',
				'optgroup_clear'  : 'onOptionGroupClear',
				'dropdown_open'   : 'onDropdownOpen',
				'dropdown_close'  : 'onDropdownClose',
				'type'            : 'onType',
				'load'            : 'onLoad',
				'focus'           : 'onFocus',
				'blur'            : 'onBlur'
			};
	
			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a click event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onClick: function(e) {
			var self = this;
	
			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
	    // also necessary to reopen a dropdown that has been closed by
	    // closeAfterSelect
			if (!self.isFocused || !self.isOpen) {
				self.focus();
				e.preventDefault();
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a mouse down event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onMouseDown: function(e) {
			var self = this;
			var defaultPrevented = e.isDefaultPrevented();
			var $target = $(e.target);
	
			if (self.isFocused) {
				// retain focus by preventing native handling. if the
				// event target is the input it should not be modified.
				// otherwise, text selection within the input won't work.
				if (e.target !== self.$control_input[0]) {
					if (self.settings.mode === 'single') {
						// toggle dropdown
						self.isOpen ? self.close() : self.open();
					} else if (!defaultPrevented) {
						self.setActiveItem(null);
					}
					return false;
				}
			} else {
				// give control focus
				if (!defaultPrevented) {
					window.setTimeout(function() {
						self.focus();
					}, 0);
				}
			}
		},
	
		/**
		 * Triggered when the value of the control has been changed.
		 * This should propagate the event to the original DOM
		 * input / select element.
		 */
		onChange: function() {
			this.$input.trigger('change');
		},
	
		/**
		 * Triggered on <input> paste.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onPaste: function(e) {
			var self = this;
	
			if (self.isFull() || self.isInputHidden || self.isLocked) {
				e.preventDefault();
				return;
			}
	
			// If a regex or string is included, this will split the pasted
			// input and create Items for each separate value
			if (self.settings.splitOn) {
	
				// Wait for pasted text to be recognized in value
				setTimeout(function() {
					var pastedText = self.$control_input.val();
					if(!pastedText.match(self.settings.splitOn)){ return }
	
					var splitInput = $.trim(pastedText).split(self.settings.splitOn);
					for (var i = 0, n = splitInput.length; i < n; i++) {
						self.createItem(splitInput[i]);
					}
				}, 0);
			}
		},
	
		/**
		 * Triggered on <input> keypress.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyPress: function(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && this.settings.mode === 'multi' && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},
	
		/**
		 * Triggered on <input> keydown.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyDown: function(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;
	
			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}
	
			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					if (self.isOpen) {
						e.preventDefault();
						e.stopPropagation();
						self.close();
					}
					return;
				case KEY_N:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_P:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
						e.preventDefault();
					}
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.selectOnTab && self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
	
						// Default behaviour is to jump to the next field, we only want this
						// if the current field doesn't accept any more entries
						if (!self.isFull()) {
							e.preventDefault();
						}
					}
					if (self.settings.create && self.createItem()) {
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}
	
			if ((self.isFull() || self.isInputHidden) && !(IS_MAC ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				return;
			}
		},
	
		/**
		 * Triggered on <input> keyup.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyUp: function(e) {
			var self = this;
	
			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},
	
		/**
		 * Invokes the user-provide option provider / loader.
		 *
		 * Note: this function is debounced in the Selectize
		 * constructor (by `settings.loadThrottle` milliseconds)
		 *
		 * @param {string} value
		 */
		onSearchChange: function(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function(callback) {
				fn.apply(self, [value, callback]);
			});
		},
	
		/**
		 * Triggered on <input> focus.
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		onFocus: function(e) {
			var self = this;
			var wasFocused = self.isFocused;
	
			if (self.isDisabled) {
				self.blur();
				e && e.preventDefault();
				return false;
			}
	
			if (self.ignoreFocus) return;
			self.isFocused = true;
			if (self.settings.preload === 'focus') self.onSearchChange('');
	
			if (!wasFocused) self.trigger('focus');
	
			if (!self.$activeItems.length) {
				self.showInput();
				self.setActiveItem(null);
				self.refreshOptions(!!self.settings.openOnFocus);
			}
	
			self.refreshState();
		},
	
		/**
		 * Triggered on <input> blur.
		 *
		 * @param {object} e
		 * @param {Element} dest
		 */
		onBlur: function(e, dest) {
			var self = this;
			if (!self.isFocused) return;
			self.isFocused = false;
	
			if (self.ignoreFocus) {
				return;
			} else if (!self.ignoreBlur && document.activeElement === self.$dropdown_content[0]) {
				// necessary to prevent IE closing the dropdown when the scrollbar is clicked
				self.ignoreBlur = true;
				self.onFocus(e);
				return;
			}
	
			var deactivate = function() {
				self.close();
				self.setTextboxValue('');
				self.setActiveItem(null);
				self.setActiveOption(null);
				self.setCaret(self.items.length);
				self.refreshState();
	
				// IE11 bug: element still marked as active
				dest && dest.focus && dest.focus();
	
				self.isBlurring = false;
				self.ignoreFocus = false;
				self.trigger('blur');
			};
	
			self.isBlurring = true;
			self.ignoreFocus = true;
			if (self.settings.create && self.settings.createOnBlur) {
				self.createItem(null, false, deactivate);
			} else {
				deactivate();
			}
		},
	
		/**
		 * Triggered when the user rolls over
		 * an option in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionHover: function(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},
	
		/**
		 * Triggered when the user clicks on an option
		 * in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionSelect: function(e) {
			var value, $target, $option, self = this;
	
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
	
			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem(null, function() {
					if (self.settings.closeAfterSelect) {
						self.close();
					}
				});
			} else {
				value = $target.attr('data-value');
				if (typeof value !== 'undefined') {
					self.lastQuery = null;
					self.setTextboxValue('');
					self.addItem(value);
					if (self.settings.closeAfterSelect) {
						self.close();
					} else if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},
	
		/**
		 * Triggered when the user clicks on an item
		 * that has been selected.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onItemSelect: function(e) {
			var self = this;
	
			if (self.isLocked) return;
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
			}
		},
	
		/**
		 * Invokes the provided method that provides
		 * results to a callback---which are then added
		 * as options to the control.
		 *
		 * @param {function} fn
		 */
		load: function(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass(self.settings.loadingClass);
	
			self.loading++;
			fn.apply(self, [function(results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(self.isFocused && !self.isInputHidden);
				}
				if (!self.loading) {
					$wrapper.removeClass(self.settings.loadingClass);
				}
				self.trigger('load', results);
			}]);
		},
	
		/**
		 * Sets the input field of the control to the specified value.
		 *
		 * @param {string} value
		 */
		setTextboxValue: function(value) {
			var $input = this.$control_input;
			var changed = $input.val() !== value;
			if (changed) {
				$input.val(value).triggerHandler('update');
				this.lastValue = value;
			}
		},
	
		/**
		 * Returns the value of the control. If multiple items
		 * can be selected (e.g. <select multiple>), this returns
		 * an array. If only one item can be selected, this
		 * returns a string.
		 *
		 * @returns {mixed}
		 */
		getValue: function() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},
	
		/**
		 * Resets the selected items to the given value.
		 *
		 * @param {mixed} value
		 */
		setValue: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				this.clear(silent);
				this.addItems(value, silent);
			});
		},
	
		/**
		 * Sets the selected item.
		 *
		 * @param {object} $item
		 * @param {object} e (optional)
		 */
		setActiveItem: function($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;
	
			if (self.settings.mode === 'single') return;
			$item = $($item);
	
			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				if (self.isFocused) {
					self.showInput();
				}
				return;
			}
	
			// modify selection
			eventName = e && e.type.toLowerCase();
	
			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end   = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap  = begin;
					begin = end;
					end   = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if ((eventName === 'mousedown' && self.isCtrlDown) || (eventName === 'keydown' && this.isShiftDown)) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}
	
			// ensure control has focus
			self.hideInput();
			if (!this.isFocused) {
				self.focus();
			}
		},
	
		/**
		 * Sets the selected item in the dropdown menu
		 * of available options.
		 *
		 * @param {object} $object
		 * @param {boolean} scroll
		 * @param {boolean} animate
		 */
		setActiveOption: function($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;
	
			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;
	
			$option = $($option);
			if (!$option.length) return;
	
			self.$activeOption = $option.addClass('active');
	
			if (scroll || !isset(scroll)) {
	
				height_menu   = self.$dropdown_content.height();
				height_item   = self.$activeOption.outerHeight(true);
				scroll        = self.$dropdown_content.scrollTop() || 0;
				y             = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top    = y;
				scroll_bottom = y - height_menu + height_item;
	
				if (y + height_item > height_menu + scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_bottom}, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_top}, animate ? self.settings.scrollDuration : 0);
				}
	
			}
		},
	
		/**
		 * Selects all items (CTRL + A).
		 */
		selectAll: function() {
			var self = this;
			if (self.settings.mode === 'single') return;
	
			self.$activeItems = Array.prototype.slice.apply(self.$control.children(':not(input)').addClass('active'));
			if (self.$activeItems.length) {
				self.hideInput();
				self.close();
			}
			self.focus();
		},
	
		/**
		 * Hides the input element out of view, while
		 * retaining its focus.
		 */
		hideInput: function() {
			var self = this;
	
			self.setTextboxValue('');
			self.$control_input.css({opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000});
			self.isInputHidden = true;
		},
	
		/**
		 * Restores input visibility.
		 */
		showInput: function() {
			this.$control_input.css({opacity: 1, position: 'relative', left: 0});
			this.isInputHidden = false;
		},
	
		/**
		 * Gives the control focus.
		 */
		focus: function() {
			var self = this;
			if (self.isDisabled) return;
	
			self.ignoreFocus = true;
			self.$control_input[0].focus();
			window.setTimeout(function() {
				self.ignoreFocus = false;
				self.onFocus();
			}, 0);
		},
	
		/**
		 * Forces the control out of focus.
		 *
		 * @param {Element} dest
		 */
		blur: function(dest) {
			this.$control_input[0].blur();
			this.onBlur(null, dest);
		},
	
		/**
		 * Returns a function that scores an object
		 * to show how good of a match it is to the
		 * provided query.
		 *
		 * @param {string} query
		 * @param {object} options
		 * @return {function}
		 */
		getScoreFunction: function(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},
	
		/**
		 * Returns search options for sifter (the system
		 * for scoring and sorting results).
		 *
		 * @see https://github.com/brianreavis/sifter.js
		 * @return {object}
		 */
		getSearchOptions: function() {
			var settings = this.settings;
			var sort = settings.sortField;
			if (typeof sort === 'string') {
				sort = [{field: sort}];
			}
	
			return {
				fields      : settings.searchField,
				conjunction : settings.searchConjunction,
				sort        : sort,
				nesting     : settings.nesting
			};
		},
	
		/**
		 * Searches through available options and returns
		 * a sorted array of matches.
		 *
		 * Returns an object containing:
		 *
		 *   - query {string}
		 *   - tokens {array}
		 *   - total {int}
		 *   - items {array}
		 *
		 * @param {string} query
		 * @returns {object}
		 */
		search: function(query) {
			var i, value, score, result, calculateScore;
			var self     = this;
			var settings = self.settings;
			var options  = this.getSearchOptions();
	
			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}
	
			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, {score: calculateScore}));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}
	
			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}
	
			return result;
		},
	
		/**
		 * Refreshes the list of available options shown
		 * in the autocomplete dropdown menu.
		 *
		 * @param {boolean} triggerDropdown
		 */
		refreshOptions: function(triggerDropdown) {
			var i, j, k, n, groups, groups_order, option, option_html, optgroup, optgroups, html, html_children, has_create_option;
			var $active, $active_before, $create;
	
			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}
	
			var self              = this;
			var query             = $.trim(self.$control_input.val());
			var results           = self.search(query);
			var $dropdown_content = self.$dropdown_content;
			var active_before     = self.$activeOption && hash_key(self.$activeOption.attr('data-value'));
	
			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}
	
			// render and group available options individually
			groups = {};
			groups_order = [];
	
			for (i = 0; i < n; i++) {
				option      = self.options[results.items[i].id];
				option_html = self.render('option', option);
				optgroup    = option[self.settings.optgroupField] || '';
				optgroups   = $.isArray(optgroup) ? optgroup : [optgroup];
	
				for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
					optgroup = optgroups[j];
					if (!self.optgroups.hasOwnProperty(optgroup)) {
						optgroup = '';
					}
					if (!groups.hasOwnProperty(optgroup)) {
						groups[optgroup] = document.createDocumentFragment();
						groups_order.push(optgroup);
					}
					groups[optgroup].appendChild(option_html);
				}
			}
	
			// sort optgroups
			if (this.settings.lockOptgroupOrder) {
				groups_order.sort(function(a, b) {
					var a_order = self.optgroups[a].$order || 0;
					var b_order = self.optgroups[b].$order || 0;
					return a_order - b_order;
				});
			}
	
			// render optgroup headers & join groups
			html = document.createDocumentFragment();
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].childNodes.length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = document.createDocumentFragment();
					html_children.appendChild(self.render('optgroup_header', self.optgroups[optgroup]));
					html_children.appendChild(groups[optgroup]);
	
					html.appendChild(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: domToString(html_children),
						dom:  html_children
					})));
				} else {
					html.appendChild(groups[optgroup]);
				}
			}
	
			$dropdown_content.html(html);
	
			// highlight matching terms inline
			if (self.settings.highlight) {
				$dropdown_content.removeHighlight();
				if (results.query.length && results.tokens.length) {
					for (i = 0, n = results.tokens.length; i < n; i++) {
						highlight($dropdown_content, results.tokens[i].regex);
					}
				}
			}
	
			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}
	
			// add create option
			has_create_option = self.canCreate(query);
			if (has_create_option) {
				$dropdown_content.prepend(self.render('option_create', {input: query}));
				$create = $($dropdown_content[0].childNodes[0]);
			}
	
			// activate
			self.hasOptions = results.items.length > 0 || has_create_option;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					$active_before = active_before && self.getOption(active_before);
					if ($active_before && $active_before.length) {
						$active = $active_before;
					} else if (self.settings.mode === 'single' && self.items.length) {
						$active = self.getOption(self.items[0]);
					}
					if (!$active || !$active.length) {
						if ($create && !self.settings.addPrecedence) {
							$active = self.getAdjacentOption($create, 1);
						} else {
							$active = $dropdown_content.find('[data-selectable]:first');
						}
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) { self.open(); }
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) { self.close(); }
			}
		},
	
		/**
		 * Adds an available option. If it already exists,
		 * nothing will happen. Note: this does not refresh
		 * the options list dropdown (use `refreshOptions`
		 * for that).
		 *
		 * Usage:
		 *
		 *   this.addOption(data)
		 *
		 * @param {object|array} data
		 */
		addOption: function(data) {
			var i, n, value, self = this;
	
			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}
	
			if (value = self.registerOption(data)) {
				self.userOptions[value] = true;
				self.lastQuery = null;
				self.trigger('option_add', value, data);
			}
		},
	
		/**
		 * Registers an option to the pool of options.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOption: function(data) {
			var key = hash_key(data[this.settings.valueField]);
			if (typeof key === 'undefined' || key === null || this.options.hasOwnProperty(key)) return false;
			data.$order = data.$order || ++this.order;
			this.options[key] = data;
			return key;
		},
	
		/**
		 * Registers an option group to the pool of option groups.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOptionGroup: function(data) {
			var key = hash_key(data[this.settings.optgroupValueField]);
			if (!key) return false;
	
			data.$order = data.$order || ++this.order;
			this.optgroups[key] = data;
			return key;
		},
	
		/**
		 * Registers a new optgroup for options
		 * to be bucketed into.
		 *
		 * @param {string} id
		 * @param {object} data
		 */
		addOptionGroup: function(id, data) {
			data[this.settings.optgroupValueField] = id;
			if (id = this.registerOptionGroup(data)) {
				this.trigger('optgroup_add', id, data);
			}
		},
	
		/**
		 * Removes an existing option group.
		 *
		 * @param {string} id
		 */
		removeOptionGroup: function(id) {
			if (this.optgroups.hasOwnProperty(id)) {
				delete this.optgroups[id];
				this.renderCache = {};
				this.trigger('optgroup_remove', id);
			}
		},
	
		/**
		 * Clears all existing option groups.
		 */
		clearOptionGroups: function() {
			this.optgroups = {};
			this.renderCache = {};
			this.trigger('optgroup_clear');
		},
	
		/**
		 * Updates an option available for selection. If
		 * it is visible in the selected items or options
		 * dropdown, it will be re-rendered automatically.
		 *
		 * @param {string} value
		 * @param {object} data
		 */
		updateOption: function(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options, order_old;
	
			value     = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);
	
			// sanity checks
			if (value === null) return;
			if (!self.options.hasOwnProperty(value)) return;
			if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	
			order_old = self.options[value].$order;
	
			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			data.$order = data.$order || order_old;
			self.options[value_new] = data;
	
			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];
	
			if (cache_items) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (cache_options) {
				delete cache_options[value];
				delete cache_options[value_new];
			}
	
			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}
	
			// invalidate last query because we might have updated the sortField
			self.lastQuery = null;
	
			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},
	
		/**
		 * Removes a single option.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		removeOption: function(value, silent) {
			var self = this;
			value = hash_key(value);
	
			var cache_items = self.renderCache['item'];
			var cache_options = self.renderCache['option'];
			if (cache_items) delete cache_items[value];
			if (cache_options) delete cache_options[value];
	
			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value, silent);
		},
	
		/**
		 * Clears all options.
		 */
		clearOptions: function() {
			var self = this;
	
			self.loadedSearches = {};
			self.userOptions = {};
			self.renderCache = {};
			var options = self.options;
			$.each(self.options, function(key, value) {
				if(self.items.indexOf(key) == -1) {
					delete options[key];
				}
			});
			self.options = self.sifter.items = options;
			self.lastQuery = null;
			self.trigger('option_clear');
		},
	
		/**
		 * Returns the jQuery element of the option
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getOption: function(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},
	
		/**
		 * Returns the jQuery element of the next or
		 * previous selectable option.
		 *
		 * @param {object} $option
		 * @param {int} direction  can be 1 for next or -1 for previous
		 * @return {object}
		 */
		getAdjacentOption: function($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},
	
		/**
		 * Finds the first element with a "data-value" attribute
		 * that matches the given value.
		 *
		 * @param {mixed} value
		 * @param {object} $els
		 * @return {object}
		 */
		getElementWithValue: function(value, $els) {
			value = hash_key(value);
	
			if (typeof value !== 'undefined' && value !== null) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}
	
			return $();
		},
	
		/**
		 * Returns the jQuery element of the item
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getItem: function(value) {
			return this.getElementWithValue(value, this.$control.children());
		},
	
		/**
		 * "Selects" multiple items at once. Adds them to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItems: function(values, silent) {
			this.buffer = document.createDocumentFragment();
	
			var childNodes = this.$control[0].childNodes;
			for (var i = 0; i < childNodes.length; i++) {
				this.buffer.appendChild(childNodes[i]);
			}
	
			var items = $.isArray(values) ? values : [values];
			for (var i = 0, n = items.length; i < n; i++) {
				this.isPending = (i < n - 1);
				this.addItem(items[i], silent);
			}
	
			var control = this.$control[0];
			control.insertBefore(this.buffer, control.firstChild);
	
			this.buffer = null;
		},
	
		/**
		 * "Selects" an item. Adds it to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItem: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				var $item, $option, $options;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, value_next, wasFull;
				value = hash_key(value);
	
				if (self.items.indexOf(value) !== -1) {
					if (inputMode === 'single') self.close();
					return;
				}
	
				if (!self.options.hasOwnProperty(value)) return;
				if (inputMode === 'single') self.clear(silent);
				if (inputMode === 'multi' && self.isFull()) return;
	
				$item = $(self.render('item', self.options[value]));
				wasFull = self.isFull();
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				if (!self.isPending || (!wasFull && self.isFull())) {
					self.refreshState();
				}
	
				if (self.isSetup) {
					$options = self.$dropdown_content.find('[data-selectable]');
	
					// update menu / remove the option (if this is not one item being added as part of series)
					if (!self.isPending) {
						$option = self.getOption(value);
						value_next = self.getAdjacentOption($option, 1).attr('data-value');
						self.refreshOptions(self.isFocused && inputMode !== 'single');
						if (value_next) {
							self.setActiveOption(self.getOption(value_next));
						}
					}
	
					// hide the menu if the maximum number of items have been selected or no options are left
					if (!$options.length || self.isFull()) {
						self.close();
					} else if (!self.isPending) {
						self.positionDropdown();
					}
	
					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
	
					if (!self.isPending) {
						self.updateOriginalInput({silent: silent});
					}
				}
			});
		},
	
		/**
		 * Removes the selected item matching
		 * the provided value.
		 *
		 * @param {string} value
		 */
		removeItem: function(value, silent) {
			var self = this;
			var $item, i, idx;
	
			$item = (value instanceof $) ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);
	
			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}
	
				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value, silent);
				}
	
				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}
	
				self.refreshState();
				self.updatePlaceholder();
				self.updateOriginalInput({silent: silent});
				self.positionDropdown();
				self.trigger('item_remove', value, $item);
			}
		},
	
		/**
		 * Invokes the `create` method provided in the
		 * selectize options that should provide the data
		 * for the new item, given the user input.
		 *
		 * Once this completes, it will be added
		 * to the item list.
		 *
		 * @param {string} value
		 * @param {boolean} [triggerDropdown]
		 * @param {function} [callback]
		 * @return {boolean}
		 */
		createItem: function(input, triggerDropdown) {
			var self  = this;
			var caret = self.caretPos;
			input = input || $.trim(self.$control_input.val() || '');
	
			var callback = arguments[arguments.length - 1];
			if (typeof callback !== 'function') callback = function() {};
	
			if (typeof triggerDropdown !== 'boolean') {
				triggerDropdown = true;
			}
	
			if (!self.canCreate(input)) {
				callback();
				return false;
			}
	
			self.lock();
	
			var setup = (typeof self.settings.create === 'function') ? this.settings.create : function(input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};
	
			var create = once(function(data) {
				self.unlock();
	
				if (!data || typeof data !== 'object') return callback();
				var value = hash_key(data[self.settings.valueField]);
				if (typeof value !== 'string') return callback();
	
				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(triggerDropdown && self.settings.mode !== 'single');
				callback(data);
			});
	
			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}
	
			return true;
		},
	
		/**
		 * Re-renders the selected item lists.
		 */
		refreshItems: function() {
			this.lastQuery = null;
	
			if (this.isSetup) {
				this.addItem(this.items);
			}
	
			this.refreshState();
			this.updateOriginalInput();
		},
	
		/**
		 * Updates all state-dependent attributes
		 * and CSS classes.
		 */
		refreshState: function() {
			this.refreshValidityState();
			this.refreshClasses();
		},
	
		/**
		 * Update the `required` attribute of both input and control input.
		 *
		 * The `required` property needs to be activated on the control input
		 * for the error to be displayed at the right place. `required` also
		 * needs to be temporarily deactivated on the input since the input is
		 * hidden and can't show errors.
		 */
		refreshValidityState: function() {
			if (!this.isRequired) return false;
	
			var invalid = !this.items.length;
	
			this.isInvalid = invalid;
			this.$control_input.prop('required', invalid);
			this.$input.prop('required', !invalid);
		},
	
		/**
		 * Updates all state-dependent CSS classes.
		 */
		refreshClasses: function() {
			var self     = this;
			var isFull   = self.isFull();
			var isLocked = self.isLocked;
	
			self.$wrapper
				.toggleClass('rtl', self.rtl);
	
			self.$control
				.toggleClass('focus', self.isFocused)
				.toggleClass('disabled', self.isDisabled)
				.toggleClass('required', self.isRequired)
				.toggleClass('invalid', self.isInvalid)
				.toggleClass('locked', isLocked)
				.toggleClass('full', isFull).toggleClass('not-full', !isFull)
				.toggleClass('input-active', self.isFocused && !self.isInputHidden)
				.toggleClass('dropdown-active', self.isOpen)
				.toggleClass('has-options', !$.isEmptyObject(self.options))
				.toggleClass('has-items', self.items.length > 0);
	
			self.$control_input.data('grow', !isFull && !isLocked);
		},
	
		/**
		 * Determines whether or not more items can be added
		 * to the control without exceeding the user-defined maximum.
		 *
		 * @returns {boolean}
		 */
		isFull: function() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},
	
		/**
		 * Refreshes the original <select> or <input>
		 * element to reflect the current state.
		 */
		updateOriginalInput: function(opts) {
			var i, n, options, label, self = this;
			opts = opts || {};
	
			if (self.tagType === TAG_SELECT) {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					label = self.options[self.items[i]][self.settings.labelField] || '';
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected">' + escape_html(label) + '</option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
				self.$input.attr('value',self.$input.val());
			}
	
			if (self.isSetup) {
				if (!opts.silent) {
					self.trigger('change', self.$input.val());
				}
			}
		},
	
		/**
		 * Shows/hide the input placeholder depending
		 * on if there items in the list already.
		 */
		updatePlaceholder: function() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;
	
			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update', {force: true});
		},
	
		/**
		 * Shows the autocomplete dropdown containing
		 * the available options.
		 */
		open: function() {
			var self = this;
	
			if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
			self.focus();
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({visibility: 'hidden', display: 'block'});
			self.positionDropdown();
			self.$dropdown.css({visibility: 'visible'});
			self.trigger('dropdown_open', self.$dropdown);
		},
	
		/**
		 * Closes the autocomplete dropdown menu.
		 */
		close: function() {
			var self = this;
			var trigger = self.isOpen;
	
			if (self.settings.mode === 'single' && self.items.length) {
				self.hideInput();
	
				// Do not trigger blur while inside a blur event,
				// this fixes some weird tabbing behavior in FF and IE.
				// See #1164
				if (!self.isBlurring) {
					self.$control_input.blur(); // close keyboard on iOS
				}
			}
	
			self.isOpen = false;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.refreshState();
	
			if (trigger) self.trigger('dropdown_close', self.$dropdown);
		},
	
		/**
		 * Calculates and applies the appropriate
		 * position of the dropdown.
		 */
		positionDropdown: function() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);
	
			this.$dropdown.css({
				width : $control[0].getBoundingClientRect().width,
				top   : offset.top,
				left  : offset.left
			});
		},
	
		/**
		 * Resets / clears all selected items
		 * from the control.
		 *
		 * @param {boolean} silent
		 */
		clear: function(silent) {
			var self = this;
	
			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.lastQuery = null;
			self.setCaret(0);
			self.setActiveItem(null);
			self.updatePlaceholder();
			self.updateOriginalInput({silent: silent});
			self.refreshState();
			self.showInput();
			self.trigger('clear');
		},
	
		/**
		 * A helper method for inserting an element
		 * at the current caret position.
		 *
		 * @param {object} $el
		 */
		insertAtCaret: function($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			var el = $el[0];
			var target = this.buffer || this.$control[0];
	
			if (caret === 0) {
				target.insertBefore(el, target.firstChild);
			} else {
				target.insertBefore(el, target.childNodes[caret]);
			}
	
			this.setCaret(caret + 1);
		},
	
		/**
		 * Removes the current selected item(s).
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		deleteSelection: function(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;
	
			direction = (e && e.keyCode === KEY_BACKSPACE) ? -1 : 1;
			selection = getSelection(self.$control_input[0]);
	
			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}
	
			// determine items that will be removed
			values = [];
	
			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) { caret++; }
	
				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}
	
			// allow the callback to abort
			if (!values.length || (typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false)) {
				return false;
			}
	
			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}
	
			self.showInput();
			self.positionDropdown();
			self.refreshOptions(true);
	
			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}
	
			return true;
		},
	
		/**
		 * Selects the previous / next item (depending
		 * on the `direction` argument).
		 *
		 * > 0 - right
		 * < 0 - left
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceSelection: function(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;
	
			if (direction === 0) return;
			if (self.rtl) direction *= -1;
	
			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);
	
			if (self.isFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0
					? selection.start === 0 && selection.length === 0
					: selection.start === valueLength;
	
				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
				}
			}
		},
	
		/**
		 * Moves the caret left / right.
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceCaret: function(direction, e) {
			var self = this, fn, $adj;
	
			if (direction === 0) return;
	
			fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				$adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},
	
		/**
		 * Moves the caret to the specified index.
		 *
		 * @param {int} i
		 */
		setCaret: function(i) {
			var self = this;
	
			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}
	
			if(!self.isPending) {
				// the input must be moved by leaving it in place and moving the
				// siblings, due to the fact that focus cannot be restored once lost
				// on mobile webkit devices
				var j, n, fn, $children, $child;
				$children = self.$control.children(':not(input)');
				for (j = 0, n = $children.length; j < n; j++) {
					$child = $($children[j]).detach();
					if (j <  i) {
						self.$control_input.before($child);
					} else {
						self.$control.append($child);
					}
				}
			}
	
			self.caretPos = i;
		},
	
		/**
		 * Disables user input on the control. Used while
		 * items are being asynchronously created.
		 */
		lock: function() {
			this.close();
			this.isLocked = true;
			this.refreshState();
		},
	
		/**
		 * Re-enables user input on the control.
		 */
		unlock: function() {
			this.isLocked = false;
			this.refreshState();
		},
	
		/**
		 * Disables user input on the control completely.
		 * While disabled, it cannot receive focus.
		 */
		disable: function() {
			var self = this;
			self.$input.prop('disabled', true);
			self.$control_input.prop('disabled', true).prop('tabindex', -1);
			self.isDisabled = true;
			self.lock();
		},
	
		/**
		 * Enables the control so that it can respond
		 * to focus and user input.
		 */
		enable: function() {
			var self = this;
			self.$input.prop('disabled', false);
			self.$control_input.prop('disabled', false).prop('tabindex', self.tabIndex);
			self.isDisabled = false;
			self.unlock();
		},
	
		/**
		 * Completely destroys the control and
		 * unbinds all event listeners so that it can
		 * be garbage collected.
		 */
		destroy: function() {
			var self = this;
			var eventNS = self.eventNS;
			var revertSettings = self.revertSettings;
	
			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();
	
			self.$input
				.html('')
				.append(revertSettings.$children)
				.removeAttr('tabindex')
				.removeClass('selectized')
				.attr({tabindex: revertSettings.tabindex})
				.show();
	
			self.$control_input.removeData('grow');
			self.$input.removeData('selectize');
	
			if (--Selectize.count == 0 && Selectize.$testInput) {
				Selectize.$testInput.remove();
				Selectize.$testInput = undefined;
			}
	
			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);
	
			delete self.$input[0].selectize;
		},
	
		/**
		 * A helper method for rendering "item" and
		 * "option" templates, given the data.
		 *
		 * @param {string} templateName
		 * @param {object} data
		 * @returns {string}
		 */
		render: function(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;
	
			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}
	
			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}
	
			// render markup
			html = $(self.settings.render[templateName].apply(this, [data, escape_html]));
	
			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				if (!data[self.settings.disabledField]) {
					html.attr('data-selectable', '');
				}
			}
			else if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html.attr('data-group', id);
				if(data[self.settings.disabledField]) {
					html.attr('data-disabled', '');
				}
			}
			if (templateName === 'option' || templateName === 'item') {
				html.attr('data-value', value || '');
			}
	
			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html[0];
			}
	
			return html[0];
		},
	
		/**
		 * Clears the render cache for a template. If
		 * no template is given, clears all render
		 * caches.
		 *
		 * @param {string} templateName
		 */
		clearCache: function(templateName) {
			var self = this;
			if (typeof templateName === 'undefined') {
				self.renderCache = {};
			} else {
				delete self.renderCache[templateName];
			}
		},
	
		/**
		 * Determines whether or not to display the
		 * create item prompt, given a user input.
		 *
		 * @param {string} input
		 * @return {boolean}
		 */
		canCreate: function(input) {
			var self = this;
			if (!self.settings.create) return false;
			var filter = self.settings.createFilter;
			return input.length
				&& (typeof filter !== 'function' || filter.apply(self, [input]))
				&& (typeof filter !== 'string' || new RegExp(filter).test(input))
				&& (!(filter instanceof RegExp) || filter.test(input));
		}
	
	});
	
	
	Selectize.count = 0;
	Selectize.defaults = {
		options: [],
		optgroups: [],
	
		plugins: [],
		delimiter: ',',
		splitOn: null, // regexp or string for splitting up values from a paste command
		persist: true,
		diacritics: true,
		create: false,
		createOnBlur: false,
		createFilter: null,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		addPrecedence: false,
		selectOnTab: false,
		preload: false,
		allowEmptyOption: false,
		closeAfterSelect: false,
	
		scrollDuration: 60,
		loadThrottle: 300,
		loadingClass: 'loading',
	
		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		valueField: 'value',
		labelField: 'text',
		disabledField: 'disabled',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		lockOptgroupOrder: false,
	
		sortField: '$order',
		searchField: ['text'],
		searchConjunction: 'and',
	
		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',
	
		dropdownParent: null,
	
		copyClassesToDropdown: true,
	
		/*
		load                 : null, // function(query, callback) { ... }
		score                : null, // function(search) { ... }
		onInitialize         : null, // function() { ... }
		onChange             : null, // function(value) { ... }
		onItemAdd            : null, // function(value, $item) { ... }
		onItemRemove         : null, // function(value) { ... }
		onClear              : null, // function() { ... }
		onOptionAdd          : null, // function(value, data) { ... }
		onOptionRemove       : null, // function(value) { ... }
		onOptionClear        : null, // function() { ... }
		onOptionGroupAdd     : null, // function(id, data) { ... }
		onOptionGroupRemove  : null, // function(id) { ... }
		onOptionGroupClear   : null, // function() { ... }
		onDropdownOpen       : null, // function($dropdown) { ... }
		onDropdownClose      : null, // function($dropdown) { ... }
		onType               : null, // function(str) { ... }
		onDelete             : null, // function(values) { ... }
		*/
	
		render: {
			/*
			item: null,
			optgroup: null,
			optgroup_header: null,
			option: null,
			option_create: null
			*/
		}
	};
	
	
	$.fn.selectize = function(settings_user) {
		var defaults             = $.fn.selectize.defaults;
		var settings             = $.extend({}, defaults, settings_user);
		var attr_data            = settings.dataAttr;
		var field_label          = settings.labelField;
		var field_value          = settings.valueField;
		var field_disabled       = settings.disabledField;
		var field_optgroup       = settings.optgroupField;
		var field_optgroup_label = settings.optgroupLabelField;
		var field_optgroup_value = settings.optgroupValueField;
	
		/**
		 * Initializes selectize from a <input type="text"> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_textbox = function($input, settings_element) {
			var i, n, values, option;
	
			var data_raw = $input.attr(attr_data);
	
			if (!data_raw) {
				var value = $.trim($input.val() || '');
				if (!settings.allowEmptyOption && !value.length) return;
				values = value.split(settings.delimiter);
				for (i = 0, n = values.length; i < n; i++) {
					option = {};
					option[field_label] = values[i];
					option[field_value] = values[i];
					settings_element.options.push(option);
				}
				settings_element.items = values;
			} else {
				settings_element.options = JSON.parse(data_raw);
				for (i = 0, n = settings_element.options.length; i < n; i++) {
					settings_element.items.push(settings_element.options[i][field_value]);
				}
			}
		};
	
		/**
		 * Initializes selectize from a <select> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_select = function($input, settings_element) {
			var i, n, tagName, $children, order = 0;
			var options = settings_element.options;
			var optionsMap = {};
	
			var readData = function($el) {
				var data = attr_data && $el.attr(attr_data);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};
	
			var addOption = function($option, group) {
				$option = $($option);
	
				var value = hash_key($option.val());
				if (!value && !settings.allowEmptyOption) return;
	
				// if the option already exists, it's probably been
				// duplicated in another optgroup. in this case, push
				// the current group to the "optgroup" property on the
				// existing option so that it's rendered in both places.
				if (optionsMap.hasOwnProperty(value)) {
					if (group) {
						var arr = optionsMap[value][field_optgroup];
						if (!arr) {
							optionsMap[value][field_optgroup] = group;
						} else if (!$.isArray(arr)) {
							optionsMap[value][field_optgroup] = [arr, group];
						} else {
							arr.push(group);
						}
					}
					return;
				}
	
				var option             = readData($option) || {};
				option[field_label]    = option[field_label] || $option.text();
				option[field_value]    = option[field_value] || value;
				option[field_disabled] = option[field_disabled] || $option.prop('disabled');
				option[field_optgroup] = option[field_optgroup] || group;
	
				optionsMap[value] = option;
				options.push(option);
	
				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};
	
			var addGroup = function($optgroup) {
				var i, n, id, optgroup, $options;
	
				$optgroup = $($optgroup);
				id = $optgroup.attr('label');
	
				if (id) {
					optgroup = readData($optgroup) || {};
					optgroup[field_optgroup_label] = id;
					optgroup[field_optgroup_value] = id;
					optgroup[field_disabled] = $optgroup.prop('disabled');
					settings_element.optgroups.push(optgroup);
				}
	
				$options = $('option', $optgroup);
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};
	
			settings_element.maxItems = $input.attr('multiple') ? null : 1;
	
			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};
	
		return this.each(function() {
			if (this.selectize) return;
	
			var instance;
			var $input = $(this);
			var tag_name = this.tagName.toLowerCase();
			var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
			if (!placeholder && !settings.allowEmptyOption) {
				placeholder = $input.children('option[value=""]').text();
			}
	
			var settings_element = {
				'placeholder' : placeholder,
				'options'     : [],
				'optgroups'   : [],
				'items'       : []
			};
	
			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}
	
			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings_user));
		});
	};
	
	$.fn.selectize.defaults = Selectize.defaults;
	$.fn.selectize.support = {
		validity: SUPPORTS_VALIDITY_API
	};
	
	
	Selectize.define('drag_drop', function(options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;
	
		self.lock = (function() {
			var original = self.lock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.disable();
				return original.apply(self, arguments);
			};
		})();
	
		self.unlock = (function() {
			var original = self.unlock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.enable();
				return original.apply(self, arguments);
			};
		})();
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(this, arguments);
	
				var $control = self.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					disabled: self.isLocked,
					start: function(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({overflow: 'visible'});
					},
					stop: function() {
						$control.css({overflow: 'hidden'});
						var active = self.$activeItems ? self.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function() {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		})();
	
	});
	
	Selectize.define('dropdown_header', function(options) {
		var self = this;
	
		options = $.extend({
			title         : 'Untitled',
			headerClass   : 'selectize-dropdown-header',
			titleRowClass : 'selectize-dropdown-header-title',
			labelClass    : 'selectize-dropdown-header-label',
			closeClass    : 'selectize-dropdown-header-close',
	
			html: function(data) {
				return (
					'<div class="' + data.headerClass + '">' +
						'<div class="' + data.titleRowClass + '">' +
							'<span class="' + data.labelClass + '">' + data.title + '</span>' +
							'<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' +
						'</div>' +
					'</div>'
				);
			}
		}, options);
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		})();
	
	});
	
	Selectize.define('optgroup_columns', function(options) {
		var self = this;
	
		options = $.extend({
			equalizeWidth  : true,
			equalizeHeight : true
		}, options);
	
		this.getAdjacentOption = function($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, $option, $options, $optgroup;
	
				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);
	
					if(e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}
	
					$options = $optgroup.find('[data-selectable]');
					$option  = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}
	
				return original.apply(this, arguments);
			};
		})();
	
		var getScrollbarWidth = function() {
			var div;
			var width = getScrollbarWidth.width;
			var doc = document;
	
			if (typeof width === 'undefined') {
				div = doc.createElement('div');
				div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
				div = div.firstChild;
				doc.body.appendChild(div);
				width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
				doc.body.removeChild(div);
			}
			return width;
		};
	
		var equalizeSizes = function() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;
	
			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;
	
			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({height: height_max});
			}
	
			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth() - getScrollbarWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({width: width});
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({width: width_last});
				}
			}
		};
	
		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	
	
	});
	
	Selectize.define('remove_button', function(options) {
		options = $.extend({
				label     : '&times;',
				title     : 'Remove',
				className : 'remove',
				append    : true
			}, options);
	
			var singleClose = function(thisRef, options) {
	
				options.className = 'remove-single';
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					return $('<span>').append(html_container)
						.append(html_element);
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var id = $(self.$input.context).attr('id');
							var selectizer = $('#'+id);
	
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							self.clear();
						});
	
					};
				})();
			};
	
			var multiClose = function(thisRef, options) {
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					var pos = html_container.search(/(<\/[^>]+>\s*)$/);
					return html_container.substring(0, pos) + html_element + html_container.substring(pos);
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							var $item = $(e.currentTarget).parent();
							self.setActiveItem($item);
							if (self.deleteSelection()) {
								self.setCaret(self.items.length);
							}
						});
	
					};
				})();
			};
	
			if (this.settings.mode === 'single') {
				singleClose(this, options);
				return;
			} else {
				multiClose(this, options);
			}
	});
	
	
	Selectize.define('restore_on_backspace', function(options) {
		var self = this;
	
		options.text = options.text || function(option) {
			return option[this.settings.labelField];
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		})();
	});
	

	return Selectize;
}));
/**
 * Angular Selectize2
 * https://github.com/machineboy2045/angular-selectize
 **/

angular.module('selectize', []).value('selectizeConfig', {}).directive("selectize", ['selectizeConfig', function(selectizeConfig) {
  return {
    restrict: 'EA',
    require: '^ngModel',
    scope: { ngModel: '=', config: '=?', options: '=?', ngDisabled: '=', ngRequired: '&' },
    link: function(scope, element, attrs, modelCtrl) {

      Selectize.defaults.maxItems = null; //default to tag editor

      var selectize,
          config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);

      modelCtrl.$isEmpty = function(val) {
        return val === undefined || val === null || !val.length; //override to support checking empty arrays
      };

      function createItem(input) {
        var data = {};
        data[config.labelField] = input;
        data[config.valueField] = input;
        return data;
      }

      function toggle(disabled) {
        disabled ? selectize.disable() : selectize.enable();
      }

      var validate = function() {
        var isInvalid = (scope.ngRequired() || attrs.required || config.required) && modelCtrl.$isEmpty(scope.ngModel);
        modelCtrl.$setValidity('required', !isInvalid);
      };

      function generateOptions(data) {
        if (!data)
          return [];

        data = angular.isArray(data) || angular.isObject(data) ? data : [data]

        return $.map(data, function(opt) {
          return typeof opt === 'string' ? createItem(opt) : opt;
        });
      }

      function updateSelectize() {
        validate();

        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

        if (!angular.equals(selectize.items, scope.ngModel)) {
          selectize.addOption(generateOptions(scope.ngModel));
          selectize.setValue(scope.ngModel);
        }
      }

      var onChange = config.onChange,
          onOptionAdd = config.onOptionAdd;

      config.onChange = function() {
        if(scope.disableOnChange)
          return;

        if (!angular.equals(selectize.items, scope.ngModel))
          scope.$evalAsync(function() {
            var value = angular.copy(selectize.items);
            if (config.maxItems == 1) {
              value = value[0]
            }
            modelCtrl.$setViewValue( value );
          });

        if (onChange) {
          onChange.apply(this, arguments);
        }
      };

      config.onOptionAdd = function(value, data) {
        if( scope.options.indexOf(data) === -1 ) {
          scope.options.push(data);

          if (onOptionAdd) {
            onOptionAdd.apply(this, arguments);
          }
        }
      };

      if(scope.options){
        // replace scope options with generated options while retaining a reference to the same array
        scope.options.splice(0, scope.options.length, generateOptions(scope.options) );
      }else{
        // default options = [ngModel] if no options specified
        scope.options = generateOptions( angular.copy(scope.ngModel) );
      }

      var angularCallback = config.onInitialize;

      config.onInitialize = function() {
        selectize = element[0].selectize;
        selectize.addOption(scope.options);
        selectize.setValue(scope.ngModel);

        //provides a way to access the selectize element from an
        //angular controller
        if (angularCallback) {
          angularCallback(selectize);
        }

        scope.$watch('options', function() {
          scope.disableOnChange = true;
          selectize.clearOptions();
          selectize.addOption(scope.options);
          selectize.setValue(scope.ngModel);
          scope.disableOnChange = false;
        }, true);

        scope.$watchCollection('ngModel', updateSelectize);
        scope.$watch('ngDisabled', toggle);
      };

      element.selectize(config);

      element.on('$destroy', function() {
        if (selectize) {
          selectize.destroy();
          element = null;
        }
      });
    }
  };
}]);

/**
  * bootstrap-switch - Turn checkboxes and radio buttons into toggle switches.
  *
  * @version v3.3.4
  * @homepage https://bttstrp.github.io/bootstrap-switch
  * @author Mattia Larentis <mattia@larentis.eu> (http://larentis.eu)
  * @license Apache-2.0
  */

(function(a,b){if('function'==typeof define&&define.amd)define(['jquery'],b);else if('undefined'!=typeof exports)b(require('jquery'));else{b(a.jquery),a.bootstrapSwitch={exports:{}}.exports}})(this,function(a){'use strict';function c(j,k){if(!(j instanceof k))throw new TypeError('Cannot call a class as a function')}var d=function(j){return j&&j.__esModule?j:{default:j}}(a),e=Object.assign||function(j){for(var l,k=1;k<arguments.length;k++)for(var m in l=arguments[k],l)Object.prototype.hasOwnProperty.call(l,m)&&(j[m]=l[m]);return j},f=function(){function j(k,l){for(var n,m=0;m<l.length;m++)n=l[m],n.enumerable=n.enumerable||!1,n.configurable=!0,'value'in n&&(n.writable=!0),Object.defineProperty(k,n.key,n)}return function(k,l,m){return l&&j(k.prototype,l),m&&j(k,m),k}}(),g=d.default||window.jQuery||window.$,h=function(){function j(k){var l=this,m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};c(this,j),this.$element=g(k),this.options=g.extend({},g.fn.bootstrapSwitch.defaults,this._getElementOptions(),m),this.prevOptions={},this.$wrapper=g('<div>',{class:function(){var o=[];return o.push(l.options.state?'on':'off'),l.options.size&&o.push(l.options.size),l.options.disabled&&o.push('disabled'),l.options.readonly&&o.push('readonly'),l.options.indeterminate&&o.push('indeterminate'),l.options.inverse&&o.push('inverse'),l.$element.attr('id')&&o.push('id-'+l.$element.attr('id')),o.map(l._getClass.bind(l)).concat([l.options.baseClass],l._getClasses(l.options.wrapperClass)).join(' ')}}),this.$container=g('<div>',{class:this._getClass('container')}),this.$on=g('<span>',{html:this.options.onText,class:this._getClass('handle-on')+' '+this._getClass(this.options.onColor)}),this.$off=g('<span>',{html:this.options.offText,class:this._getClass('handle-off')+' '+this._getClass(this.options.offColor)}),this.$label=g('<span>',{html:this.options.labelText,class:this._getClass('label')}),this.$element.on('init.bootstrapSwitch',this.options.onInit.bind(this,k)),this.$element.on('switchChange.bootstrapSwitch',function(){for(var n=arguments.length,o=Array(n),p=0;p<n;p++)o[p]=arguments[p];!1===l.options.onSwitchChange.apply(k,o)&&(l.$element.is(':radio')?g('[name="'+l.$element.attr('name')+'"]').trigger('previousState.bootstrapSwitch',!0):l.$element.trigger('previousState.bootstrapSwitch',!0))}),this.$container=this.$element.wrap(this.$container).parent(),this.$wrapper=this.$container.wrap(this.$wrapper).parent(),this.$element.before(this.options.inverse?this.$off:this.$on).before(this.$label).before(this.options.inverse?this.$on:this.$off),this.options.indeterminate&&this.$element.prop('indeterminate',!0),this._init(),this._elementHandlers(),this._handleHandlers(),this._labelHandlers(),this._formHandler(),this._externalLabelHandler(),this.$element.trigger('init.bootstrapSwitch',this.options.state)}return f(j,[{key:'setPrevOptions',value:function(){this.prevOptions=e({},this.options)}},{key:'state',value:function(l,m){return'undefined'==typeof l?this.options.state:this.options.disabled||this.options.readonly||this.options.state&&!this.options.radioAllOff&&this.$element.is(':radio')?this.$element:(this.$element.is(':radio')?g('[name="'+this.$element.attr('name')+'"]').trigger('setPreviousOptions.bootstrapSwitch'):this.$element.trigger('setPreviousOptions.bootstrapSwitch'),this.options.indeterminate&&this.indeterminate(!1),this.$element.prop('checked',!!l).trigger('change.bootstrapSwitch',m),this.$element)}},{key:'toggleState',value:function(l){return this.options.disabled||this.options.readonly?this.$element:this.options.indeterminate?(this.indeterminate(!1),this.state(!0)):this.$element.prop('checked',!this.options.state).trigger('change.bootstrapSwitch',l)}},{key:'size',value:function(l){return'undefined'==typeof l?this.options.size:(null!=this.options.size&&this.$wrapper.removeClass(this._getClass(this.options.size)),l&&this.$wrapper.addClass(this._getClass(l)),this._width(),this._containerPosition(),this.options.size=l,this.$element)}},{key:'animate',value:function(l){return'undefined'==typeof l?this.options.animate:this.options.animate===!!l?this.$element:this.toggleAnimate()}},{key:'toggleAnimate',value:function(){return this.options.animate=!this.options.animate,this.$wrapper.toggleClass(this._getClass('animate')),this.$element}},{key:'disabled',value:function(l){return'undefined'==typeof l?this.options.disabled:this.options.disabled===!!l?this.$element:this.toggleDisabled()}},{key:'toggleDisabled',value:function(){return this.options.disabled=!this.options.disabled,this.$element.prop('disabled',this.options.disabled),this.$wrapper.toggleClass(this._getClass('disabled')),this.$element}},{key:'readonly',value:function(l){return'undefined'==typeof l?this.options.readonly:this.options.readonly===!!l?this.$element:this.toggleReadonly()}},{key:'toggleReadonly',value:function(){return this.options.readonly=!this.options.readonly,this.$element.prop('readonly',this.options.readonly),this.$wrapper.toggleClass(this._getClass('readonly')),this.$element}},{key:'indeterminate',value:function(l){return'undefined'==typeof l?this.options.indeterminate:this.options.indeterminate===!!l?this.$element:this.toggleIndeterminate()}},{key:'toggleIndeterminate',value:function(){return this.options.indeterminate=!this.options.indeterminate,this.$element.prop('indeterminate',this.options.indeterminate),this.$wrapper.toggleClass(this._getClass('indeterminate')),this._containerPosition(),this.$element}},{key:'inverse',value:function(l){return'undefined'==typeof l?this.options.inverse:this.options.inverse===!!l?this.$element:this.toggleInverse()}},{key:'toggleInverse',value:function(){this.$wrapper.toggleClass(this._getClass('inverse'));var l=this.$on.clone(!0),m=this.$off.clone(!0);return this.$on.replaceWith(m),this.$off.replaceWith(l),this.$on=m,this.$off=l,this.options.inverse=!this.options.inverse,this.$element}},{key:'onColor',value:function(l){return'undefined'==typeof l?this.options.onColor:(this.options.onColor&&this.$on.removeClass(this._getClass(this.options.onColor)),this.$on.addClass(this._getClass(l)),this.options.onColor=l,this.$element)}},{key:'offColor',value:function(l){return'undefined'==typeof l?this.options.offColor:(this.options.offColor&&this.$off.removeClass(this._getClass(this.options.offColor)),this.$off.addClass(this._getClass(l)),this.options.offColor=l,this.$element)}},{key:'onText',value:function(l){return'undefined'==typeof l?this.options.onText:(this.$on.html(l),this._width(),this._containerPosition(),this.options.onText=l,this.$element)}},{key:'offText',value:function(l){return'undefined'==typeof l?this.options.offText:(this.$off.html(l),this._width(),this._containerPosition(),this.options.offText=l,this.$element)}},{key:'labelText',value:function(l){return'undefined'==typeof l?this.options.labelText:(this.$label.html(l),this._width(),this.options.labelText=l,this.$element)}},{key:'handleWidth',value:function(l){return'undefined'==typeof l?this.options.handleWidth:(this.options.handleWidth=l,this._width(),this._containerPosition(),this.$element)}},{key:'labelWidth',value:function(l){return'undefined'==typeof l?this.options.labelWidth:(this.options.labelWidth=l,this._width(),this._containerPosition(),this.$element)}},{key:'baseClass',value:function(){return this.options.baseClass}},{key:'wrapperClass',value:function(l){return'undefined'==typeof l?this.options.wrapperClass:(l||(l=g.fn.bootstrapSwitch.defaults.wrapperClass),this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(' ')),this.$wrapper.addClass(this._getClasses(l).join(' ')),this.options.wrapperClass=l,this.$element)}},{key:'radioAllOff',value:function(l){if('undefined'==typeof l)return this.options.radioAllOff;var m=!!l;return this.options.radioAllOff===m?this.$element:(this.options.radioAllOff=m,this.$element)}},{key:'onInit',value:function(l){return'undefined'==typeof l?this.options.onInit:(l||(l=g.fn.bootstrapSwitch.defaults.onInit),this.options.onInit=l,this.$element)}},{key:'onSwitchChange',value:function(l){return'undefined'==typeof l?this.options.onSwitchChange:(l||(l=g.fn.bootstrapSwitch.defaults.onSwitchChange),this.options.onSwitchChange=l,this.$element)}},{key:'destroy',value:function(){var l=this.$element.closest('form');return l.length&&l.off('reset.bootstrapSwitch').removeData('bootstrap-switch'),this.$container.children().not(this.$element).remove(),this.$element.unwrap().unwrap().off('.bootstrapSwitch').removeData('bootstrap-switch'),this.$element}},{key:'_getElementOptions',value:function(){return{state:this.$element.is(':checked'),size:this.$element.data('size'),animate:this.$element.data('animate'),disabled:this.$element.is(':disabled'),readonly:this.$element.is('[readonly]'),indeterminate:this.$element.data('indeterminate'),inverse:this.$element.data('inverse'),radioAllOff:this.$element.data('radio-all-off'),onColor:this.$element.data('on-color'),offColor:this.$element.data('off-color'),onText:this.$element.data('on-text'),offText:this.$element.data('off-text'),labelText:this.$element.data('label-text'),handleWidth:this.$element.data('handle-width'),labelWidth:this.$element.data('label-width'),baseClass:this.$element.data('base-class'),wrapperClass:this.$element.data('wrapper-class')}}},{key:'_width',value:function(){var l=this,m=this.$on.add(this.$off).add(this.$label).css('width',''),n='auto'===this.options.handleWidth?Math.round(Math.max(this.$on.width(),this.$off.width())):this.options.handleWidth;return m.width(n),this.$label.width(function(o,p){return'auto'===l.options.labelWidth?p<n?n:p:l.options.labelWidth}),this._handleWidth=this.$on.outerWidth(),this._labelWidth=this.$label.outerWidth(),this.$container.width(2*this._handleWidth+this._labelWidth),this.$wrapper.width(this._handleWidth+this._labelWidth)}},{key:'_containerPosition',value:function(){var l=this,m=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this.options.state,n=arguments[1];this.$container.css('margin-left',function(){var o=[0,'-'+l._handleWidth+'px'];return l.options.indeterminate?'-'+l._handleWidth/2+'px':m?l.options.inverse?o[1]:o[0]:l.options.inverse?o[0]:o[1]})}},{key:'_init',value:function(){var l=this,m=function(){l.setPrevOptions(),l._width(),l._containerPosition(),setTimeout(function(){if(l.options.animate)return l.$wrapper.addClass(l._getClass('animate'))},50)};if(this.$wrapper.is(':visible'))return void m();var n=window.setInterval(function(){if(l.$wrapper.is(':visible'))return m(),window.clearInterval(n)},50)}},{key:'_elementHandlers',value:function(){var l=this;return this.$element.on({'setPreviousOptions.bootstrapSwitch':this.setPrevOptions.bind(this),'previousState.bootstrapSwitch':function(){l.options=l.prevOptions,l.options.indeterminate&&l.$wrapper.addClass(l._getClass('indeterminate')),l.$element.prop('checked',l.options.state).trigger('change.bootstrapSwitch',!0)},'change.bootstrapSwitch':function(n,o){n.preventDefault(),n.stopImmediatePropagation();var p=l.$element.is(':checked');l._containerPosition(p),p===l.options.state||(l.options.state=p,l.$wrapper.toggleClass(l._getClass('off')).toggleClass(l._getClass('on')),!o&&(l.$element.is(':radio')&&g('[name="'+l.$element.attr('name')+'"]').not(l.$element).prop('checked',!1).trigger('change.bootstrapSwitch',!0),l.$element.trigger('switchChange.bootstrapSwitch',[p])))},'focus.bootstrapSwitch':function(n){n.preventDefault(),l.$wrapper.addClass(l._getClass('focused'))},'blur.bootstrapSwitch':function(n){n.preventDefault(),l.$wrapper.removeClass(l._getClass('focused'))},'keydown.bootstrapSwitch':function(n){!n.which||l.options.disabled||l.options.readonly||(37===n.which||39===n.which)&&(n.preventDefault(),n.stopImmediatePropagation(),l.state(39===n.which))}})}},{key:'_handleHandlers',value:function(){var l=this;return this.$on.on('click.bootstrapSwitch',function(m){return m.preventDefault(),m.stopPropagation(),l.state(!1),l.$element.trigger('focus.bootstrapSwitch')}),this.$off.on('click.bootstrapSwitch',function(m){return m.preventDefault(),m.stopPropagation(),l.state(!0),l.$element.trigger('focus.bootstrapSwitch')})}},{key:'_labelHandlers',value:function(){var l=this;this.$label.on({click:function(o){o.stopPropagation()},'mousedown.bootstrapSwitch touchstart.bootstrapSwitch':function(o){l._dragStart||l.options.disabled||l.options.readonly||(o.preventDefault(),o.stopPropagation(),l._dragStart=(o.pageX||o.originalEvent.touches[0].pageX)-parseInt(l.$container.css('margin-left'),10),l.options.animate&&l.$wrapper.removeClass(l._getClass('animate')),l.$element.trigger('focus.bootstrapSwitch'))},'mousemove.bootstrapSwitch touchmove.bootstrapSwitch':function(o){if(null!=l._dragStart){var p=(o.pageX||o.originalEvent.touches[0].pageX)-l._dragStart;o.preventDefault(),p<-l._handleWidth||0<p||(l._dragEnd=p,l.$container.css('margin-left',l._dragEnd+'px'))}},'mouseup.bootstrapSwitch touchend.bootstrapSwitch':function(o){if(l._dragStart){if(o.preventDefault(),l.options.animate&&l.$wrapper.addClass(l._getClass('animate')),l._dragEnd){var p=l._dragEnd>-(l._handleWidth/2);l._dragEnd=!1,l.state(l.options.inverse?!p:p)}else l.state(!l.options.state);l._dragStart=!1}},'mouseleave.bootstrapSwitch':function(){l.$label.trigger('mouseup.bootstrapSwitch')}})}},{key:'_externalLabelHandler',value:function(){var l=this,m=this.$element.closest('label');m.on('click',function(n){n.preventDefault(),n.stopImmediatePropagation(),n.target===m[0]&&l.toggleState()})}},{key:'_formHandler',value:function(){var l=this.$element.closest('form');l.data('bootstrap-switch')||l.on('reset.bootstrapSwitch',function(){window.setTimeout(function(){l.find('input').filter(function(){return g(this).data('bootstrap-switch')}).each(function(){return g(this).bootstrapSwitch('state',this.checked)})},1)}).data('bootstrap-switch',!0)}},{key:'_getClass',value:function(l){return this.options.baseClass+'-'+l}},{key:'_getClasses',value:function(l){return g.isArray(l)?l.map(this._getClass.bind(this)):[this._getClass(l)]}}]),j}();g.fn.bootstrapSwitch=function(j){for(var l=arguments.length,m=Array(1<l?l-1:0),n=1;n<l;n++)m[n-1]=arguments[n];return Array.prototype.reduce.call(this,function(o,p){var q=g(p),r=q.data('bootstrap-switch'),s=r||new h(p,j);return r||q.data('bootstrap-switch',s),'string'==typeof j?s[j].apply(s,m):o},this)},g.fn.bootstrapSwitch.Constructor=h,g.fn.bootstrapSwitch.defaults={state:!0,size:null,animate:!0,disabled:!1,readonly:!1,indeterminate:!1,inverse:!1,radioAllOff:!1,onColor:'primary',offColor:'default',onText:'ON',offText:'OFF',labelText:'&nbsp',handleWidth:'auto',labelWidth:'auto',baseClass:'bootstrap-switch',wrapperClass:'wrapper',onInit:function(){},onSwitchChange:function(){}}});

/*
 * ngDialog - easy modals and popup windows
 * http://github.com/likeastore/ngDialog
 * (c) 2013-2015 MIT License, https://likeastore.com
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        if (typeof angular === 'undefined') {
            factory(require('angular'));
        } else {
            factory(angular);
        }
        module.exports = 'ngDialog';
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var m = angular.module('ngDialog', []);

    var $el = angular.element;
    var isDef = angular.isDefined;
    var style = (document.body || document.documentElement).style;
    var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
    var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
    var focusableElementSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    var disabledAnimationClass = 'ngdialog-disabled-animation';
    var forceElementsReload = { html: false, body: false };
    var scopes = {};
    var openIdStack = [];
    var keydownIsBound = false;
    var openOnePerName = false;


    m.provider('ngDialog', function () {
        var defaults = this.defaults = {
            className: 'ngdialog-theme-default',
            appendClassName: '',
            disableAnimation: false,
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            closeByNavigation: false,
            appendTo: false,
            preCloseCallback: false,
            overlay: true,
            cache: true,
            trapFocus: true,
            preserveFocus: true,
            ariaAuto: true,
            ariaRole: null,
            ariaLabelledById: null,
            ariaLabelledBySelector: null,
            ariaDescribedById: null,
            ariaDescribedBySelector: null,
            bodyClassName: 'ngdialog-open',
            width: null,
            height: null
        };

        this.setForceHtmlReload = function (_useIt) {
            forceElementsReload.html = _useIt || false;
        };

        this.setForceBodyReload = function (_useIt) {
            forceElementsReload.body = _useIt || false;
        };

        this.setDefaults = function (newDefaults) {
            angular.extend(defaults, newDefaults);
        };

        this.setOpenOnePerName = function (isOpenOne) {
            openOnePerName = isOpenOne || false;
        };

        var globalID = 0, dialogsCount = 0, closeByDocumentHandler, defers = {};

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
                var $elements = [];

                var privateMethods = {
                    onDocumentKeydown: function (event) {
                        if (event.keyCode === 27) {
                            publicMethods.close('$escape');
                        }
                    },

                    activate: function($dialog) {
                        var options = $dialog.data('$ngDialogOptions');

                        if (options.trapFocus) {
                            $dialog.on('keydown', privateMethods.onTrapFocusKeydown);

                            // Catch rogue changes (eg. after unfocusing everything by clicking a non-focusable element)
                            $elements.body.on('keydown', privateMethods.onTrapFocusKeydown);
                        }
                    },

                    deactivate: function ($dialog) {
                        $dialog.off('keydown', privateMethods.onTrapFocusKeydown);
                        $elements.body.off('keydown', privateMethods.onTrapFocusKeydown);
                    },

                    deactivateAll: function (els) {
                        angular.forEach(els,function(el) {
                            var $dialog = angular.element(el);
                            privateMethods.deactivate($dialog);
                        });
                    },

                    setBodyPadding: function (width) {
                        var originalBodyPadding = parseInt(($elements.body.css('padding-right') || 0), 10);
                        $elements.body.css('padding-right', (originalBodyPadding + width) + 'px');
                        $elements.body.data('ng-dialog-original-padding', originalBodyPadding);
                        $rootScope.$broadcast('ngDialog.setPadding', width);
                    },

                    resetBodyPadding: function () {
                        var originalBodyPadding = $elements.body.data('ng-dialog-original-padding');
                        if (originalBodyPadding) {
                            $elements.body.css('padding-right', originalBodyPadding + 'px');
                        } else {
                            $elements.body.css('padding-right', '');
                        }
                        $rootScope.$broadcast('ngDialog.setPadding', 0);
                    },

                    performCloseDialog: function ($dialog, value) {
                        var options = $dialog.data('$ngDialogOptions');
                        var id = $dialog.attr('id');
                        var scope = scopes[id];

                        if (!scope) {
                            // Already closed
                            return;
                        }

                        if (typeof $window.Hammer !== 'undefined') {
                            var hammerTime = scope.hammerTime;
                            hammerTime.off('tap', closeByDocumentHandler);
                            hammerTime.destroy && hammerTime.destroy();
                            delete scope.hammerTime;
                        } else {
                            $dialog.unbind('click');
                        }

                        if (dialogsCount === 1) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                        }

                        if (!$dialog.hasClass('ngdialog-closing')){
                            dialogsCount -= 1;
                        }

                        var previousFocus = $dialog.data('$ngDialogPreviousFocus');
                        if (previousFocus && previousFocus.focus) {
                            previousFocus.focus();
                        }

                        $rootScope.$broadcast('ngDialog.closing', $dialog, value);
                        dialogsCount = dialogsCount < 0 ? 0 : dialogsCount;
                        if (animationEndSupport && !options.disableAnimation) {
                            scope.$destroy();
                            $dialog.unbind(animationEndEvent).bind(animationEndEvent, function () {
                                privateMethods.closeDialogElement($dialog, value);
                            }).addClass('ngdialog-closing');
                        } else {
                            scope.$destroy();
                            privateMethods.closeDialogElement($dialog, value);
                        }
                        if (defers[id]) {
                            defers[id].resolve({
                                id: id,
                                value: value,
                                $dialog: $dialog,
                                remainingDialogs: dialogsCount
                            });
                            delete defers[id];
                        }
                        if (scopes[id]) {
                            delete scopes[id];
                        }
                        openIdStack.splice(openIdStack.indexOf(id), 1);
                        if (!openIdStack.length) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                            keydownIsBound = false;
                        }
                    },

                    closeDialogElement: function($dialog, value) {
                        var options = $dialog.data('$ngDialogOptions');
                        $dialog.remove();
                        if (dialogsCount === 0) {
                            $elements.html.removeClass(options.bodyClassName);
                            $elements.body.removeClass(options.bodyClassName);
                            privateMethods.resetBodyPadding();
                        }
                        $rootScope.$broadcast('ngDialog.closed', $dialog, value);
                    },

                    closeDialog: function ($dialog, value) {
                        var preCloseCallback = $dialog.data('$ngDialogPreCloseCallback');

                        if (preCloseCallback && angular.isFunction(preCloseCallback)) {

                            var preCloseCallbackResult = preCloseCallback.call($dialog, value);

                            if (angular.isObject(preCloseCallbackResult)) {
                                if (preCloseCallbackResult.closePromise) {
                                    preCloseCallbackResult.closePromise.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    }, function () {
                                        return false;
                                    });
                                } else {
                                    preCloseCallbackResult.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    }, function () {
                                        return false;
                                    });
                                }
                            } else if (preCloseCallbackResult !== false) {
                                privateMethods.performCloseDialog($dialog, value);
                            } else {
                                return false;
                            }
                        } else {
                            privateMethods.performCloseDialog($dialog, value);
                        }
                    },

                    onTrapFocusKeydown: function(ev) {
                        var el = angular.element(ev.currentTarget);
                        var $dialog;

                        if (el.hasClass('ngdialog')) {
                            $dialog = el;
                        } else {
                            $dialog = privateMethods.getActiveDialog();

                            if ($dialog === null) {
                                return;
                            }
                        }

                        var isTab = (ev.keyCode === 9);
                        var backward = (ev.shiftKey === true);

                        if (isTab) {
                            privateMethods.handleTab($dialog, ev, backward);
                        }
                    },

                    handleTab: function($dialog, ev, backward) {
                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length === 0) {
                            if (document.activeElement && document.activeElement.blur) {
                                document.activeElement.blur();
                            }
                            return;
                        }

                        var currentFocus = document.activeElement;
                        var focusIndex = Array.prototype.indexOf.call(focusableElements, currentFocus);

                        var isFocusIndexUnknown = (focusIndex === -1);
                        var isFirstElementFocused = (focusIndex === 0);
                        var isLastElementFocused = (focusIndex === focusableElements.length - 1);

                        var cancelEvent = false;

                        if (backward) {
                            if (isFocusIndexUnknown || isFirstElementFocused) {
                                focusableElements[focusableElements.length - 1].focus();
                                cancelEvent = true;
                            }
                        } else {
                            if (isFocusIndexUnknown || isLastElementFocused) {
                                focusableElements[0].focus();
                                cancelEvent = true;
                            }
                        }

                        if (cancelEvent) {
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                    },

                    autoFocus: function($dialog) {
                        var dialogEl = $dialog[0];

                        // Browser's (Chrome 40, Forefix 37, IE 11) don't appear to honor autofocus on the dialog, but we should
                        var autoFocusEl = dialogEl.querySelector('*[autofocus]');
                        if (autoFocusEl !== null) {
                            autoFocusEl.focus();

                            if (document.activeElement === autoFocusEl) {
                                return;
                            }

                            // Autofocus element might was display: none, so let's continue
                        }

                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length > 0) {
                            focusableElements[0].focus();
                            return;
                        }

                        // We need to focus something for the screen readers to notice the dialog
                        var contentElements = privateMethods.filterVisibleElements(dialogEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span'));

                        if (contentElements.length > 0) {
                            var contentElement = contentElements[0];
                            $el(contentElement).attr('tabindex', '-1').css('outline', '0');
                            contentElement.focus();
                        }
                    },

                    getFocusableElements: function ($dialog) {
                        var dialogEl = $dialog[0];

                        var rawElements = dialogEl.querySelectorAll(focusableElementSelector);

                        // Ignore untabbable elements, ie. those with tabindex = -1
                        var tabbableElements = privateMethods.filterTabbableElements(rawElements);

                        return privateMethods.filterVisibleElements(tabbableElements);
                    },

                    filterTabbableElements: function (els) {
                        var tabbableFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if ($el(el).attr('tabindex') !== '-1') {
                                tabbableFocusableElements.push(el);
                            }
                        }

                        return tabbableFocusableElements;
                    },

                    filterVisibleElements: function (els) {
                        var visibleFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                                visibleFocusableElements.push(el);
                            }
                        }

                        return visibleFocusableElements;
                    },

                    getActiveDialog: function () {
                        var dialogs = document.querySelectorAll('.ngdialog');

                        if (dialogs.length === 0) {
                            return null;
                        }

                        // TODO: This might be incorrect if there are a mix of open dialogs with different 'appendTo' values
                        return $el(dialogs[dialogs.length - 1]);
                    },

                    applyAriaAttributes: function ($dialog, options) {
                        if (options.ariaAuto) {
                            if (!options.ariaRole) {
                                var detectedRole = (privateMethods.getFocusableElements($dialog).length > 0) ?
                                    'dialog' :
                                    'alertdialog';

                                options.ariaRole = detectedRole;
                            }

                            if (!options.ariaLabelledBySelector) {
                                options.ariaLabelledBySelector = 'h1,h2,h3,h4,h5,h6';
                            }

                            if (!options.ariaDescribedBySelector) {
                                options.ariaDescribedBySelector = 'article,section,p';
                            }
                        }

                        if (options.ariaRole) {
                            $dialog.attr('role', options.ariaRole);
                        }

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-labelledby', options.ariaLabelledById, options.ariaLabelledBySelector);

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-describedby', options.ariaDescribedById, options.ariaDescribedBySelector);
                    },

                    applyAriaAttribute: function($dialog, attr, id, selector) {
                        if (id) {
                            $dialog.attr(attr, id);
                        }

                        if (selector) {
                            var dialogId = $dialog.attr('id');

                            var firstMatch = $dialog[0].querySelector(selector);

                            if (!firstMatch) {
                                return;
                            }

                            var generatedId = dialogId + '-' + attr;

                            $el(firstMatch).attr('id', generatedId);

                            $dialog.attr(attr, generatedId);

                            return generatedId;
                        }
                    },

                    detectUIRouter: function() {
                        //Detect if ui-router module is installed if not return false
                        try {
                            angular.module('ui.router');
                            return true;
                        } catch(err) {
                            return false;
                        }
                    },

                    getRouterLocationEventName: function() {
                        if(privateMethods.detectUIRouter()) {
                            return '$stateChangeStart';
                        }
                        return '$locationChangeStart';
                    }
                };

                var publicMethods = {
                    __PRIVATE__: privateMethods,

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - appendClassName {String} - dialog theme class to be appended to defaults
                     * - disableAnimation {Boolean} - set to true to disable animation
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default true
                     * - closeByDocument {Boolean} - default true
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set)
                     * - bodyClassName {String} - class added to body at open dialog
                     * @return {Object} dialog
                     */
                    open: function (opts) {
                        var dialogID = null;
                        opts = opts || {};
                        if (openOnePerName && opts.name) {
                            dialogID = opts.name.toLowerCase().replace(/\s/g, '-') + '-dialog';
                            if (this.isOpen(dialogID)) {
                                return;
                            }
                        }
                        var options = angular.copy(defaults);
                        var localID = ++globalID;
                        dialogID = dialogID || 'ngdialog' + localID;
                        openIdStack.push(dialogID);

                        // Merge opts.data with predefined via setDefaults
                        if (typeof options.data !== 'undefined') {
                            if (typeof opts.data === 'undefined') {
                                opts.data = {};
                            }
                            opts.data = angular.merge(angular.copy(options.data), opts.data);
                        }

                        angular.extend(options, opts);

                        var defer;
                        defers[dialogID] = defer = $q.defer();

                        var scope;
                        scopes[dialogID] = scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

                        var $dialog, $dialogParent, $dialogContent;

                        var resolve = angular.extend({}, options.resolve);

                        angular.forEach(resolve, function (value, key) {
                            resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                        });

                        $q.all({
                            template: loadTemplate(options.template || options.templateUrl),
                            locals: $q.all(resolve)
                        }).then(function (setup) {
                            var template = setup.template,
                                locals = setup.locals;

                            if (options.showClose) {
                                template += '<div class="ngdialog-close"></div>';
                            }

                            var hasOverlayClass = options.overlay ? '' : ' ngdialog-no-overlay';
                            $dialog = $el('<div id="' + dialogID + '" class="ngdialog' + hasOverlayClass + '"></div>');
                            $dialog.html((options.overlay ?
                                '<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">' + template + '</div>' :
                                '<div class="ngdialog-content" role="document">' + template + '</div>'));

                            $dialog.data('$ngDialogOptions', options);

                            scope.ngDialogId = dialogID;

                            if (options.data && angular.isString(options.data)) {
                                var firstLetter = options.data.replace(/^\s*/, '')[0];
                                scope.ngDialogData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : new String(options.data);
                                scope.ngDialogData.ngDialogId = dialogID;
                            } else if (options.data && angular.isObject(options.data)) {
                                scope.ngDialogData = options.data;
                                scope.ngDialogData.ngDialogId = dialogID;
                            }

                            if (options.className) {
                                $dialog.addClass(options.className);
                            }

                            if (options.appendClassName) {
                                $dialog.addClass(options.appendClassName);
                            }

                            if (options.width) {
                                $dialogContent = $dialog[0].querySelector('.ngdialog-content');
                                if (angular.isString(options.width)) {
                                    $dialogContent.style.width = options.width;
                                } else {
                                    $dialogContent.style.width = options.width + 'px';
                                }
                            }

                            if (options.height) {
                                $dialogContent = $dialog[0].querySelector('.ngdialog-content');
                                if (angular.isString(options.height)) {
                                    $dialogContent.style.height = options.height;
                                } else {
                                    $dialogContent.style.height = options.height + 'px';
                                }
                            }

                            if (options.disableAnimation) {
                                $dialog.addClass(disabledAnimationClass);
                            }

                            if (options.appendTo && angular.isString(options.appendTo)) {
                                $dialogParent = angular.element(document.querySelector(options.appendTo));
                            } else {
                                $dialogParent = $elements.body;
                            }

                            privateMethods.applyAriaAttributes($dialog, options);

                            if (options.preCloseCallback) {
                                var preCloseCallback;

                                if (angular.isFunction(options.preCloseCallback)) {
                                    preCloseCallback = options.preCloseCallback;
                                } else if (angular.isString(options.preCloseCallback)) {
                                    if (scope) {
                                        if (angular.isFunction(scope[options.preCloseCallback])) {
                                            preCloseCallback = scope[options.preCloseCallback];
                                        } else if (scope.$parent && angular.isFunction(scope.$parent[options.preCloseCallback])) {
                                            preCloseCallback = scope.$parent[options.preCloseCallback];
                                        } else if ($rootScope && angular.isFunction($rootScope[options.preCloseCallback])) {
                                            preCloseCallback = $rootScope[options.preCloseCallback];
                                        }
                                    }
                                }

                                if (preCloseCallback) {
                                    $dialog.data('$ngDialogPreCloseCallback', preCloseCallback);
                                }
                            }

                            scope.closeThisDialog = function (value) {
                                privateMethods.closeDialog($dialog, value);
                            };

                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

                                var label;

                                if (options.controllerAs && angular.isString(options.controllerAs)) {
                                    label = options.controllerAs;
                                }

                                var controllerInstance = $controller(options.controller, angular.extend(
                                    locals,
                                    {
                                        $scope: scope,
                                        $element: $dialog
                                    }),
                                    true,
                                    label
                                );

                                if(options.bindToController) {
                                    angular.extend(controllerInstance.instance, {ngDialogId: scope.ngDialogId, ngDialogData: scope.ngDialogData, closeThisDialog: scope.closeThisDialog, confirm: scope.confirm});
                                }

                                if(typeof controllerInstance === 'function'){
                                    $dialog.data('$ngDialogControllerController', controllerInstance());
                                } else {
                                    $dialog.data('$ngDialogControllerController', controllerInstance);
                                }
                            }

                            $timeout(function () {
                                var $activeDialogs = document.querySelectorAll('.ngdialog');
                                privateMethods.deactivateAll($activeDialogs);

                                $compile($dialog)(scope);
                                var widthDiffs = $window.innerWidth - $elements.body.prop('clientWidth');
                                $elements.html.addClass(options.bodyClassName);
                                $elements.body.addClass(options.bodyClassName);
                                var scrollBarWidth = widthDiffs - ($window.innerWidth - $elements.body.prop('clientWidth'));
                                if (scrollBarWidth > 0) {
                                    privateMethods.setBodyPadding(scrollBarWidth);
                                }
                                $dialogParent.append($dialog);

                                privateMethods.activate($dialog);

                                if (options.trapFocus) {
                                    privateMethods.autoFocus($dialog);
                                }

                                if (options.name) {
                                    $rootScope.$broadcast('ngDialog.opened', {dialog: $dialog, name: options.name});
                                } else {
                                    $rootScope.$broadcast('ngDialog.opened', $dialog);
                                }
                            });

                            if (!keydownIsBound) {
                                $elements.body.bind('keydown', privateMethods.onDocumentKeydown);
                                keydownIsBound = true;
                            }

                            if (options.closeByNavigation) {
                                var eventName = privateMethods.getRouterLocationEventName();
                                $rootScope.$on(eventName, function ($event) {
                                    if (privateMethods.closeDialog($dialog) === false)
                                        $event.preventDefault();
                                });
                            }

                            if (options.preserveFocus) {
                                $dialog.data('$ngDialogPreviousFocus', document.activeElement);
                            }

                            closeByDocumentHandler = function (event) {
                                var isOverlay = options.closeByDocument ? $el(event.target).hasClass('ngdialog-overlay') : false;
                                var isCloseBtn = $el(event.target).hasClass('ngdialog-close');

                                if (isOverlay || isCloseBtn) {
                                    publicMethods.close($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
                                }
                            };

                            if (typeof $window.Hammer !== 'undefined') {
                                var hammerTime = scope.hammerTime = $window.Hammer($dialog[0]);
                                hammerTime.on('tap', closeByDocumentHandler);
                            } else {
                                $dialog.bind('click', closeByDocumentHandler);
                            }

                            dialogsCount += 1;

                            return publicMethods;
                        });

                        return {
                            id: dialogID,
                            closePromise: defer.promise,
                            close: function (value) {
                                privateMethods.closeDialog($dialog, value);
                            }
                        };

                        function loadTemplateUrl (tmpl, config) {
                            var config = config || {};
                            config.headers = config.headers || {};

                            angular.extend(config.headers, {'Accept': 'text/html'});

                            $rootScope.$broadcast('ngDialog.templateLoading', tmpl);
                            return $http.get(tmpl, config).then(function(res) {
                                $rootScope.$broadcast('ngDialog.templateLoaded', tmpl);
                                return res.data || '';
                            });
                        }

                        function loadTemplate (tmpl) {
                            if (!tmpl) {
                                return 'Empty template';
                            }

                            if (angular.isString(tmpl) && options.plain) {
                                return tmpl;
                            }

                            if (typeof options.cache === 'boolean' && !options.cache) {
                                return loadTemplateUrl(tmpl, {cache: false});
                            }

                            return loadTemplateUrl(tmpl, {cache: $templateCache});
                        }
                    },

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - name {String}
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - appendClassName {String} - dialog theme class to be appended to defaults
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default false
                     * - closeByDocument {Boolean} - default false
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set); not called on confirm
                     * - bodyClassName {String} - class added to body at open dialog
                     *
                     * @return {Object} dialog
                     */
                    openConfirm: function (opts) {
                        var defer = $q.defer();
                        var options = angular.copy(defaults);

                        opts = opts || {};

                        // Merge opts.data with predefined via setDefaults
                        if (typeof options.data !== 'undefined') {
                            if (typeof opts.data === 'undefined') {
                                opts.data = {};
                            }
                            opts.data = angular.merge(angular.copy(options.data), opts.data);
                        }

                        angular.extend(options, opts);

                        options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
                        options.scope.confirm = function (value) {
                            defer.resolve(value);
                            var $dialog = $el(document.getElementById(openResult.id));
                            privateMethods.performCloseDialog($dialog, value);
                        };

                        var openResult = publicMethods.open(options);
                        if (openResult) {
                            openResult.closePromise.then(function (data) {
                                if (data) {
                                    return defer.reject(data.value);
                                }
                                return defer.reject();
                            });
                            return defer.promise;
                        }
                    },

                    isOpen: function(id) {
                        var $dialog = $el(document.getElementById(id));
                        return $dialog.length > 0;
                    },

                    /*
                     * @param {String} id
                     * @return {Object} dialog
                     */
                    close: function (id, value) {
                        var $dialog = $el(document.getElementById(id));

                        if ($dialog.length) {
                            privateMethods.closeDialog($dialog, value);
                        } else {
                            if (id === '$escape') {
                                var topDialogId = openIdStack[openIdStack.length - 1];
                                $dialog = $el(document.getElementById(topDialogId));
                                if ($dialog.data('$ngDialogOptions').closeByEscape) {
                                    privateMethods.closeDialog($dialog, '$escape');
                                }
                            } else {
                                publicMethods.closeAll(value);
                            }
                        }

                        return publicMethods;
                    },

                    closeAll: function (value) {
                        var $all = document.querySelectorAll('.ngdialog');

                        // Reverse order to ensure focus restoration works as expected
                        for (var i = $all.length - 1; i >= 0; i--) {
                            var dialog = $all[i];
                            privateMethods.closeDialog($el(dialog), value);
                        }
                    },

                    getOpenDialogs: function() {
                        return openIdStack;
                    },

                    getDefaults: function () {
                        return defaults;
                    }
                };

                angular.forEach(
                    ['html', 'body'],
                    function(elementName) {
                        $elements[elementName] = $document.find(elementName);
                        if (forceElementsReload[elementName]) {
                            var eventName = privateMethods.getRouterLocationEventName();
                            $rootScope.$on(eventName, function () {
                                $elements[elementName] = $document.find(elementName);
                            });
                        }
                    }
                );

                return publicMethods;
            }];
    });

    m.directive('ngDialog', ['ngDialog', function (ngDialog) {
        return {
            restrict: 'A',
            scope: {
                ngDialogScope: '='
            },
            link: function (scope, elem, attrs) {
                elem.on('click', function (e) {
                    e.preventDefault();

                    var ngDialogScope = angular.isDefined(scope.ngDialogScope) ? scope.ngDialogScope : 'noScope';
                    angular.isDefined(attrs.ngDialogClosePrevious) && ngDialog.close(attrs.ngDialogClosePrevious);

                    var defaults = ngDialog.getDefaults();

                    ngDialog.open({
                        template: attrs.ngDialog,
                        className: attrs.ngDialogClass || defaults.className,
                        appendClassName: attrs.ngDialogAppendClass,
                        controller: attrs.ngDialogController,
                        controllerAs: attrs.ngDialogControllerAs,
                        bindToController: attrs.ngDialogBindToController,
                        disableAnimation: attrs.ngDialogDisableAnimation,
                        scope: ngDialogScope,
                        data: attrs.ngDialogData,
                        showClose: attrs.ngDialogShowClose === 'false' ? false : (attrs.ngDialogShowClose === 'true' ? true : defaults.showClose),
                        closeByDocument: attrs.ngDialogCloseByDocument === 'false' ? false : (attrs.ngDialogCloseByDocument === 'true' ? true : defaults.closeByDocument),
                        closeByEscape: attrs.ngDialogCloseByEscape === 'false' ? false : (attrs.ngDialogCloseByEscape === 'true' ? true : defaults.closeByEscape),
                        overlay: attrs.ngDialogOverlay === 'false' ? false : (attrs.ngDialogOverlay === 'true' ? true : defaults.overlay),
                        preCloseCallback: attrs.ngDialogPreCloseCallback || defaults.preCloseCallback,
                        bodyClassName: attrs.ngDialogBodyClass || defaults.bodyClassName
                    });
                });
            }
        };
    }]);

    return m;
}));

/**
 * angular-ui-notification - Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animating
 * @author Alex_Crack
 * @version v0.3.6
 * @link https://github.com/alexcrack/angular-ui-notification
 * @license MIT
 */
angular.module("ui-notification",[]),angular.module("ui-notification").provider("Notification",function(){this.options={delay:5e3,startTop:10,startRight:10,verticalSpacing:10,horizontalSpacing:10,positionX:"right",positionY:"top",replaceMessage:!1,templateUrl:"angular-ui-notification.html",onClose:void 0,closeOnClick:!0,maxCount:0,container:"body",priority:10},this.setOptions=function(t){if(!angular.isObject(t))throw new Error("Options should be an object!");this.options=angular.extend({},this.options,t)},this.$get=["$timeout","$http","$compile","$templateCache","$rootScope","$injector","$sce","$q","$window",function(t,i,e,n,o,s,a,r,l){var p=this.options,c=p.startTop,u=p.startRight,d=p.verticalSpacing,f=p.horizontalSpacing,m=p.delay,g=[],h=!1,y=function(s,y){function C(i){function n(t){["-webkit-transition","-o-transition","transition"].forEach(function(i){C.css(i,t)})}var o=s.scope.$new();o.message=a.trustAsHtml(s.message),o.title=a.trustAsHtml(s.title),o.t=s.type.substr(0,1),o.delay=s.delay,o.onClose=s.onClose;var r=function(t,i){return t._priority-i._priority},m=function(t,i){return i._priority-t._priority},y=function(){var t=0,i=0,e=c,n=u,o=[];"top"===s.positionY?g.sort(r):"bottom"===s.positionY&&g.sort(m);for(var a=g.length-1;a>=0;a--){var l=g[a];if(s.replaceMessage&&a<g.length-1)l.addClass("killed");else{var h=parseInt(l[0].offsetHeight),y=parseInt(l[0].offsetWidth),C=o[l._positionY+l._positionX];v+h>window.innerHeight&&(C=c,i++,t=0);var v=e=C?0===t?C:C+d:c,_=n+i*(f+y);l.css(l._positionY,v+"px"),"center"==l._positionX?l.css("left",parseInt(window.innerWidth/2-y/2)+"px"):l.css(l._positionX,_+"px"),o[l._positionY+l._positionX]=v+h,p.maxCount>0&&g.length>p.maxCount&&0===a&&l.scope().kill(!0),t++}}},C=e(i)(o);C._positionY=s.positionY,C._positionX=s.positionX,C._priority=s.priority,C.addClass(s.type);var _=function(t){t=t.originalEvent||t,("click"===t.type||"opacity"===t.propertyName&&t.elapsedTime>=1)&&(o.onClose&&o.$apply(o.onClose(C)),C.remove(),g.splice(g.indexOf(C),1),o.$destroy(),y())};s.closeOnClick&&(C.addClass("clickable"),C.bind("click",_)),C.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd",_),angular.isNumber(s.delay)&&t(function(){C.addClass("killed")},s.delay),n("none"),angular.element(document.querySelector(s.container)).append(C);var k=-(parseInt(C[0].offsetHeight)+50);if(C.css(C._positionY,k+"px"),g.push(C),"center"==s.positionX){var w=parseInt(C[0].offsetWidth);C.css("left",parseInt(window.innerWidth/2-w/2)+"px")}t(function(){n("")}),o._templateElement=C,o.kill=function(i){i?(o.onClose&&o.$apply(o.onClose(o._templateElement)),g.splice(g.indexOf(o._templateElement),1),o._templateElement.remove(),o.$destroy(),t(y)):o._templateElement.addClass("killed")},t(y),h||(angular.element(l).bind("resize",function(i){t(y)}),h=!0),v.resolve(o)}var v=r.defer();"object"==typeof s&&null!==s||(s={message:s}),s.scope=s.scope?s.scope:o,s.template=s.templateUrl?s.templateUrl:p.templateUrl,s.delay=angular.isUndefined(s.delay)?m:s.delay,s.type=y||s.type||p.type||"",s.positionY=s.positionY?s.positionY:p.positionY,s.positionX=s.positionX?s.positionX:p.positionX,s.replaceMessage=s.replaceMessage?s.replaceMessage:p.replaceMessage,s.onClose=s.onClose?s.onClose:p.onClose,s.closeOnClick=null!==s.closeOnClick&&void 0!==s.closeOnClick?s.closeOnClick:p.closeOnClick,s.container=s.container?s.container:p.container,s.priority=s.priority?s.priority:p.priority;var _=n.get(s.template);return _?C(_):i.get(s.template,{cache:!0}).then(function(t){C(t.data)})["catch"](function(t){throw new Error("Template ("+s.template+") could not be loaded. "+t)}),v.promise};return y.primary=function(t){return this(t,"primary")},y.error=function(t){return this(t,"error")},y.success=function(t){return this(t,"success")},y.info=function(t){return this(t,"info")},y.warning=function(t){return this(t,"warning")},y.clearAll=function(){angular.forEach(g,function(t){t.addClass("killed")})},y}]}),angular.module("ui-notification").run(["$templateCache",function(t){t.put("angular-ui-notification.html",'<div class="ui-notification"><h3 ng-show="title" ng-bind-html="title"></h3><div class="message" ng-bind-html="message"></div></div>')}]);
/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */

(function() {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirPagination';
    var DEFAULT_ID = '__default';

    /**
     * Module
     */
    angular.module(moduleName, [])
        .directive('dirPaginate', ['$compile', '$parse', 'paginationService', dirPaginateDirective])
        .directive('dirPaginateNoCompile', noCompileDirective)
        .directive('dirPaginationControls', ['paginationService', 'paginationTemplate', dirPaginationControlsDirective])
        .filter('itemsPerPage', ['paginationService', itemsPerPageFilter])
        .service('paginationService', paginationService)
        .provider('paginationTemplate', paginationTemplateProvider)
        .run(['$templateCache',dirPaginationControlsTemplateInstaller]);

    function dirPaginateDirective($compile, $parse, paginationService) {

        return  {
            terminal: true,
            multiElement: true,
            priority: 100,
            compile: dirPaginationCompileFn
        };

        function dirPaginationCompileFn(tElement, tAttrs){

            var expression = tAttrs.dirPaginate;
            // regex taken directly from https://github.com/angular/angular.js/blob/v1.4.x/src/ng/directive/ngRepeat.js#L339
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            var filterPattern = /\|\s*itemsPerPage\s*:\s*(.*\(\s*\w*\)|([^\)]*?(?=\s+as\s+))|[^\)]*)/;
            if (match[2].match(filterPattern) === null) {
                throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);

            addNoCompileAttributes(tElement);

            // If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
            // dir-pagination-controls directives that may be looking for this ID.
            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);

            return function dirPaginationLinkFn(scope, element, attrs){

                // Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
                // potentially register a new ID if it evaluates to a different value than the rawId.
                var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;
                
                // (TODO: this seems sound, but I'm reverting as many bug reports followed it's introduction in 0.11.0.
                // Needs more investigation.)
                // In case rawId != paginationId we deregister using rawId for the sake of general cleanliness
                // before registering using paginationId
                // paginationService.deregisterInstance(rawId);
                paginationService.registerInstance(paginationId);

                var repeatExpression = getRepeatExpression(expression, paginationId);
                addNgRepeatToElement(element, attrs, repeatExpression);

                removeTemporaryAttributes(element);
                var compiled =  $compile(element);

                var currentPageGetter = makeCurrentPageGetterFn(scope, attrs, paginationId);
                paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                if (typeof attrs.totalItems !== 'undefined') {
                    paginationService.setAsyncModeTrue(paginationId);
                    scope.$watch(function() {
                        return $parse(attrs.totalItems)(scope);
                    }, function (result) {
                        if (0 <= result) {
                            paginationService.setCollectionLength(paginationId, result);
                        }
                    });
                } else {
                    paginationService.setAsyncModeFalse(paginationId);
                    scope.$watchCollection(function() {
                        return collectionGetter(scope);
                    }, function(collection) {
                        if (collection) {
                            var collectionLength = (collection instanceof Array) ? collection.length : Object.keys(collection).length;
                            paginationService.setCollectionLength(paginationId, collectionLength);
                        }
                    });
                }

                // Delegate to the link function returned by the new compilation of the ng-repeat
                compiled(scope);
                 
                // (TODO: Reverting this due to many bug reports in v 0.11.0. Needs investigation as the
                // principle is sound)
                // When the scope is destroyed, we make sure to remove the reference to it in paginationService
                // so that it can be properly garbage collected
                // scope.$on('$destroy', function destroyDirPagination() {
                //     paginationService.deregisterInstance(paginationId);
                // });
            };
        }

        /**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
        function getRepeatExpression(expression, paginationId) {
            var repeatExpression,
                idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);

            if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:\s*[^|\s]*)/, "$1 : '" + paginationId + "'");
            } else {
                repeatExpression = expression;
            }

            return repeatExpression;
        }

        /**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
        function addNgRepeatToElement(element, attrs, repeatExpression) {
            if (element[0].hasAttribute('dir-paginate-start') || element[0].hasAttribute('data-dir-paginate-start')) {
                // using multiElement mode (dir-paginate-start, dir-paginate-end)
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
            } else {
                attrs.$set('ngRepeat', repeatExpression);
            }
        }

        /**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
        function addNoCompileAttributes(tElement) {
            angular.forEach(tElement, function(el) {
                if (el.nodeType === 1) {
                    angular.element(el).attr('dir-paginate-no-compile', true);
                }
            });
        }

        /**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
        function removeTemporaryAttributes(element) {
            angular.forEach(element, function(el) {
                if (el.nodeType === 1) {
                    angular.element(el).removeAttr('dir-paginate-no-compile');
                }
            });
            element.eq(0).removeAttr('dir-paginate-start').removeAttr('dir-paginate').removeAttr('data-dir-paginate-start').removeAttr('data-dir-paginate');
            element.eq(element.length - 1).removeAttr('dir-paginate-end').removeAttr('data-dir-paginate-end');
        }

        /**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
        function makeCurrentPageGetterFn(scope, attrs, paginationId) {
            var currentPageGetter;
            if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
            } else {
                // If the current-page attribute was not set, we'll make our own.
                // Replace any non-alphanumeric characters which might confuse
                // the $parse service and give unexpected results.
                // See https://github.com/michaelbromley/angularUtils/issues/233
                var defaultCurrentPage = (paginationId + '__currentPage').replace(/\W/g, '_');
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
            }
            return currentPageGetter;
        }
    }

    /**
     * This is a helper directive that allows correct compilation when in multi-element mode (ie dir-paginate-start, dir-paginate-end).
     * It is dynamically added to all elements in the dir-paginate compile function, and it prevents further compilation of
     * any inner directives. It is then removed in the link function, and all inner directives are then manually compiled.
     */
    function noCompileDirective() {
        return {
            priority: 5000,
            terminal: true
        };
    }

    function dirPaginationControlsTemplateInstaller($templateCache) {
        $templateCache.put('angularUtils.directives.dirPagination.template', '<ul class="pagination" ng-if="1 < pages.length || !autoHide"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by tracker(pageNumber, $index)" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' || ( ! autoHide && pages.length === 1 ) }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>');
    }

    function dirPaginationControlsDirective(paginationService, paginationTemplate) {

        var numberRegex = /^\d+$/;

        var DDO = {
            restrict: 'AE',
            scope: {
                maxSize: '=?',
                onPageChange: '&?',
                paginationId: '=?',
                autoHide: '=?'
            },
            link: dirPaginationControlsLinkFn
        };

        // We need to check the paginationTemplate service to see whether a template path or
        // string has been specified, and add the `template` or `templateUrl` property to
        // the DDO as appropriate. The order of priority to decide which template to use is
        // (highest priority first):
        // 1. paginationTemplate.getString()
        // 2. attrs.templateUrl
        // 3. paginationTemplate.getPath()
        var templateString = paginationTemplate.getString();
        if (templateString !== undefined) {
            DDO.template = templateString;
        } else {
            DDO.templateUrl = function(elem, attrs) {
                return attrs.templateUrl || paginationTemplate.getPath();
            };
        }
        return DDO;

        function dirPaginationControlsLinkFn(scope, element, attrs) {

            // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
            // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
            // no corresponding dir-paginate directive and wrongly throwing an exception.
            var rawId = attrs.paginationId ||  DEFAULT_ID;
            var paginationId = scope.paginationId || attrs.paginationId ||  DEFAULT_ID;

            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
                var idMessage = (paginationId !== DEFAULT_ID) ? ' (id: ' + paginationId + ') ' : ' ';
                if (window.console) {
                    console.warn('Pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive, which was not found at link time.');
                }
            }

            if (!scope.maxSize) { scope.maxSize = 9; }
            scope.autoHide = scope.autoHide === undefined ? true : scope.autoHide;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

            var paginationRange = Math.max(scope.maxSize, 5);
            scope.pages = [];
            scope.pagination = {
                last: 1,
                current: 1
            };
            scope.range = {
                lower: 1,
                upper: 1,
                total: 1
            };

            scope.$watch('maxSize', function(val) {
                if (val) {
                    paginationRange = Math.max(scope.maxSize, 5);
                    generatePagination();
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
                }
            }, function(length) {
                if (0 < length) {
                    generatePagination();
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return (paginationService.getItemsPerPage(paginationId));
                }
            }, function(current, previous) {
                if (current != previous && typeof previous !== 'undefined') {
                    goToPage(scope.pagination.current);
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return paginationService.getCurrentPage(paginationId);
                }
            }, function(currentPage, previousPage) {
                if (currentPage != previousPage) {
                    goToPage(currentPage);
                }
            });

            scope.setCurrent = function(num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    num = parseInt(num, 10);
                    paginationService.setCurrentPage(paginationId, num);
                }
            };

            /**
             * Custom "track by" function which allows for duplicate "..." entries on long lists,
             * yet fixes the problem of wrongly-highlighted links which happens when using
             * "track by $index" - see https://github.com/michaelbromley/angularUtils/issues/153
             * @param id
             * @param index
             * @returns {string}
             */
            scope.tracker = function(id, index) {
                return id + '_' + index;
            };

            function goToPage(num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    var oldPageNumber = scope.pagination.current;

                    scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = num;
                    updateRangeValues();

                    // if a callback has been set, then call it with the page number as the first argument
                    // and the previous page number as a second argument
                    if (scope.onPageChange) {
                        scope.onPageChange({
                            newPageNumber : num,
                            oldPageNumber : oldPageNumber
                        });
                    }
                }
            }

            function generatePagination() {
                if (paginationService.isRegistered(paginationId)) {
                    var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;
                    scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = page;
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    } else {
                        updateRangeValues();
                    }
                }
            }

            /**
             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination
             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";
             */
            function updateRangeValues() {
                if (paginationService.isRegistered(paginationId)) {
                    var currentPage = paginationService.getCurrentPage(paginationId),
                        itemsPerPage = paginationService.getItemsPerPage(paginationId),
                        totalItems = paginationService.getCollectionLength(paginationId);

                    scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
                    scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);
                    scope.range.total = totalItems;
                }
            }
            function isValidPageNumber(num) {
                return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
            }
        }

        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i ++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange/2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }
    }

    /**
     * This filter slices the collection into pages based on the current page number and number of items per page.
     * @param paginationService
     * @returns {Function}
     */
    function itemsPerPageFilter(paginationService) {

        return function(collection, itemsPerPage, paginationId) {
            if (typeof (paginationId) === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (angular.isObject(collection)) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);

                if (collection instanceof Array) {
                    // the array just needs to be sliced
                    return collection.slice(start, end);
                } else {
                    // in the case of an object, we need to get an array of keys, slice that, then map back to
                    // the original object.
                    var slicedObject = {};
                    angular.forEach(keys(collection).slice(start, end), function(key) {
                        slicedObject[key] = collection[key];
                    });
                    return slicedObject;
                }
            } else {
                return collection;
            }
        };
    }

    /**
     * Shim for the Object.keys() method which does not exist in IE < 9
     * @param obj
     * @returns {Array}
     */
    function keys(obj) {
        if (!Object.keys) {
            var objKeys = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    objKeys.push(i);
                }
            }
            return objKeys;
        } else {
            return Object.keys(obj);
        }
    }

    /**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
    function paginationService() {

        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function(instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.deregisterInstance = function(instanceId) {
            delete instances[instanceId];
        };
        
        this.isRegistered = function(instanceId) {
            return (typeof instances[instanceId] !== 'undefined');
        };

        this.getLastInstanceId = function() {
            return lastRegisteredInstance;
        };

        this.setCurrentPageParser = function(instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function(instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function(instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function(instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function(instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function(instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function(instanceId) {
            return instances[instanceId].collectionLength;
        };

        this.setAsyncModeTrue = function(instanceId) {
            instances[instanceId].asyncMode = true;
        };

        this.setAsyncModeFalse = function(instanceId) {
            instances[instanceId].asyncMode = false;
        };

        this.isAsyncMode = function(instanceId) {
            return instances[instanceId].asyncMode;
        };
    }

    /**
     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.
     */
    function paginationTemplateProvider() {

        var templatePath = 'angularUtils.directives.dirPagination.template';
        var templateString;

        /**
         * Set a templateUrl to be used by all instances of <dir-pagination-controls>
         * @param {String} path
         */
        this.setPath = function(path) {
            templatePath = path;
        };

        /**
         * Set a string of HTML to be used as a template by all instances
         * of <dir-pagination-controls>. If both a path *and* a string have been set,
         * the string takes precedence.
         * @param {String} str
         */
        this.setString = function(str) {
            templateString = str;
        };

        this.$get = function() {
            return {
                getPath: function() {
                    return templatePath;
                },
                getString: function() {
                    return templateString;
                }
            };
        };
    }
})();

var com_github_culmat_jsTreeTable =  (function(){

	function depthFirst(tree, func, childrenAttr) {
		childrenAttr = childrenAttr || 'children'
		function i_depthFirst(node) {
			if (node[childrenAttr]) {
				$.each(node[childrenAttr], function(i, child) {
					i_depthFirst(child)
				})
			}
			func(node)
		}
		$.each(tree, function(i, root) {
			i_depthFirst(root)
		})
		return tree
	}
	
	/*
	 * make a deep copy of the object
	 */
	function copy(data){
		return JSON.parse(JSON.stringify(data))
	}
	
	function makeTree (data, idAttr, refAttr, childrenAttr) {
		var data_tmp = data
		idAttr = idAttr || 'id'
		refAttr = refAttr || 'parent'
		childrenAttr = childrenAttr || 'children'
	
		var byName = []
		$.each(data_tmp, function(i, entry) {
			byName[entry[idAttr]] = entry
		})
		var tree = []
		$.each(data_tmp, function(i, entry) {
			var parents = entry[refAttr]
			if(!$.isArray(parents)){
				parents = [parents]
			}
			if(parents.length == 0){
				tree.push(entry)
			} else {
				var inTree = false;
				$.each(parents, function(i,parentID){
					var parent = byName[parentID]
					if (parent) {
						if (!parent[childrenAttr]) {
							parent[childrenAttr] = []
						}
						if($.inArray(entry, parent[childrenAttr])< 0)
							parent[childrenAttr].push(entry)
						inTree = true
					} 
				})
				if(!inTree){
					tree.push(entry)
				}
			}
		})
		return tree
	}
	
	function renderTree(tree, childrenAttr, idAttr, attrs, renderer, tableAttributes) {
		childrenAttr = childrenAttr || 'children'
		idAttr = idAttr || 'id'
		tableAttributes = tableAttributes || {}
		var maxLevel = 0;
		var ret = []
	
		var table = $("<table>")
		$.each(tableAttributes, function(key, value){
			if(key == 'class' && value != 'jsTT') {
				table.addClass(value)
			} else {
				table.attr(key, value)			
			}
		})
		var thead = $("<thead>")
		var tr = $("<tr>")
		var tbody = $("<tbody>")
	
		table.append(thead)
		thead.append(tr)
		table.append(tbody)
		if (attrs) {
			$.each(attrs, function(attr, desc) {
				$(tr).append($('<th>' + desc + '</th>'))
			})
		} else {
			$(tr).append($('<th>' + idAttr + '</th>'))
			$.each(tree[0], function(key, value) {
				if (key != childrenAttr && key != idAttr)
					$(tr).append($('<th>' + key + '</th>'))
			})
		}
	
		function render(node, parent) {
			var tr = $("<tr>")
			$(tr).attr('data-tt-id', node[idAttr])
			$(tr).attr('data-tt-level', node['data-tt-level'])
			if(!node[childrenAttr] || node[childrenAttr].length == 0)
				$(tr).attr('data-tt-isleaf', true)
			else
				$(tr).attr('data-tt-isnode', true)
			if (parent) {
				$(tr).attr('data-tt-parent-id', parent[idAttr])
			}
			if (renderer) {
				renderer($(tr), node)
			}else if (attrs) {
				$.each(attrs, function(attr, desc) {
					$(tr).append($('<td>' + node[attr] + '</td>'))
				})
			} else {
				$(tr).append($('<td>' + node[idAttr] + '</td>'))
				$.each(node, function(key, value) {
					if (key != childrenAttr && key != idAttr && key != 'data-tt-level')
						$(tr).append($('<td>' + value + '</td>'))
				})
			}
			tbody.append(tr)
		}
	
		function i_renderTree(subTree, childrenAttr, level, parent) {
			maxLevel = Math.max(maxLevel, level)
			$.each(subTree, function(i, node) {
				node['data-tt-level'] = level
				render(node, parent)
				if (node[childrenAttr]) {
					$.each(node[childrenAttr], function(i, child) {
						i_renderTree([ child ], childrenAttr, level + 1, node)
					})
				}
			})
		}
		i_renderTree(tree, childrenAttr, 1)
		if (tree[0])
			tree[0].maxLevel = maxLevel
		return table
	}
	
	function attr2attr(nodes, attrs){
		$.each(nodes,  function(i, node) {
			$.each(attrs,  function(j, at) {
				node[at] = $(node).attr(at)
			})	
		})
		return nodes
	}
	
	function treeTable(table){
		table.addClass('jsTT')
		table.expandLevel = function (n) {
			$("tr[data-tt-level]", table).each(function(index) {
				var level = parseInt($(this).attr('data-tt-level'))
				if (level > n-1) {
					this.trCollapse(true)
				} else if (level == n-1){
					this.trExpand(true)
				}
			})
		}
		function getLevel(node){
			var level = node.attr('data-tt-level')
			if(level != undefined ) return parseInt(level)
			var parentID = node.attr('data-tt-parent-id')
			if( parentID == undefined){
				return 0
			} else {
				return getLevel($('tr[data-tt-id="'+parentID+'"]', table).first()) + 1
			} 
		}
		$("tr[data-tt-id]", table).each(function(i,node){
			node = $(node)
			node.attr('data-tt-level', getLevel(node)) 
		})
		var dat = $("tr[data-tt-level]", table).get()
		$.each(dat,  function(j, d) {
			d.trChildrenVisible = true
			d.trChildren = []
		})	
		dat  = attr2attr(dat, ['data-tt-id', 'data-tt-parent-id'])
		dat = makeTree(dat, 'data-tt-id', 'data-tt-parent-id', 'trChildren')
		
		var imgExpand = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAHlJREFUeNrcU1sNgDAQ6wgmcAM2MICGGlg1gJnNzWQcvwQGy1j4oUl/7tH0mpwzM7SgQyO+EZAUWh2MkkzSWhJwuRAlHYsJwEwyvs1gABDuzqoJcTw5qxaIJN0bgQRgIjnlmn1heSO5PE6Y2YXe+5Cr5+h++gs12AcAS6FS+7YOsj4AAAAASUVORK5CYII="
		var imgCollapse = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAHFJREFUeNpi/P//PwMlgImBQsA44C6gvhfa29v3MzAwOODRc6CystIRbxi0t7fjDJjKykpGYrwwi1hxnLHQ3t7+jIGBQRJJ6HllZaUUKYEYRYBPOB0gBShKwKGA////48VtbW3/8clTnBIH3gCKkzJgAGvBX0dDm0sCAAAAAElFTkSuQmCC"
		$("tr[data-tt-level]", table).each(function(index, tr) {
			var level = $(tr).attr('data-tt-level')
			var td = $("td",tr).first()
			if(tr.trChildren.length>0){
				td.prepend($('<img id="state" style="cursor:pointer" src="'+imgCollapse+'"/>'))			
			}  else {
				td.prepend($('<span style="padding-left:16px;" /></span>'))
			}
			td.prepend($('<span style="padding-left:'+(15*parseInt(level-1))+'px;" /></span>'))
			// td.css('white-space','nowrap')
			tr.trExpand = function(changeState){
				if(this.trChildren.length < 1) return
				if(changeState) {
					this.trChildrenVisible = true
					$('#state', this).get(0).src= imgCollapse
				} 
				var doit = changeState || this.trChildrenVisible
				$.each(this.trChildren, function(i, ctr) {
					if(doit) $(ctr).css('display', 'table-row')
					ctr.trExpand()
				})
			}
			tr.trCollapse = function(changeState){
				if(this.trChildren.length < 1) return
				if(changeState) {
					this.trChildrenVisible = false
					$('#state', this).get(0).src= imgExpand
				}
				$.each(this.trChildren, function(i, ctr) {
					$(ctr).css('display', 'none')
					ctr.trCollapse()
				})
			}
			$(tr).click(function() {
				this.trChildrenVisible ? this.trCollapse(true) : this.trExpand(true)
			})
		})
		return table
	}
	
	function appendTreetable(tree, options) {
		function inALine(nodes) {
			var tr = $('<tr>')
			$.each(nodes, function(i, node){
				tr.append($('<td style="padding-right: 20px;">').append(node))
			})
			return $('<table border="0"/>').append(tr)
			
		}
		options = options || {}
		options.idAttr = (options.idAttr || 'id')
		options.childrenAttr = (options.childrenAttr || 'children')
		var controls = (options.controls || [])
	
		if (!options.mountPoint)
			options.mountPoint = $('body')
		
		if (options.depthFirst)
			depthFirst(tree, options.depthFirst, options.childrenAttr)
		var rendered = renderTree(tree, options.childrenAttr, options.idAttr,
				options.renderedAttr, options.renderer, options.tableAttributes)
	
		treeTable(rendered)
		if (options.replaceContent) {
			options.mountPoint.html('')
		}
		var initialExpandLevel = options.initialExpandLevel ? parseInt(options.initialExpandLevel) : -1
		initialExpandLevel = Math.min(initialExpandLevel, tree[0].maxLevel)
		rendered.expandLevel(initialExpandLevel)
		if(options.slider){
			var slider = $('<div style="margin-right: 15px;">')
			slider.width('200px')
			slider.slider({
				min : 1,
				max : tree[0].maxLevel,
				range : "min",
				value : initialExpandLevel,
				slide : function(event, ui) {
					rendered.expandLevel(ui.value)
				}
			})
			controls = [slider].concat(options.controls)
		}
		
	    if(controls.length >0){
	    	options.mountPoint.append(inALine(controls))    	
	    }
		options.mountPoint.append(rendered)
		return rendered
	}
	
	return {
		depthFirst : depthFirst,
		makeTree : makeTree,
		renderTree : renderTree,
		attr2attr : attr2attr,
		treeTable : treeTable,
		appendTreetable : appendTreetable,
		jsTreeTable : '1.0',
		register : function(target){
			$.each(this, function(key, value){ if(key != 'register') target[key] = value})
		}
	}
})();
