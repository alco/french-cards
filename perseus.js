/*
 * Dependencies: jQuery, Underscore.js
 */
var Perseus = new function() {
    this._refs = {};

    this.reset = function() {
        for (var key in this._refs) {
            localStorage.setItem(key, undefined);
        }
        this._refs = {};
    };

    this.persistentObject = function(key, obj) {
        var db_object = localStorage.getItem(key);
        if (db_object !== null && db_object != "__Perseus_null__") {
            db_object = JSON.parse(db_object);
            // clone obj
            var instance = $.extend(true, {}, obj);
            for (var prop in db_object) {
                instance[prop] = db_object[prop];
            }
            console.log("Loaded from localStorage");
            this._refs[key] = instance;
            return instance;
        } else {
            localStorage.setItem(key, JSON.stringify(obj));
            this._refs[key] = obj;
            return obj;
        }
    };

    function deserialize(obj) {
        var result;
        switch (obj.type) {
        case "array":
            result = _.map(obj.val, function(val, index) {
                return deserialize(val);
            });
            break;

        case "function":
            eval("var f = " + obj.val);
            result = f;
            break;

        case "number":
            result = parseFloat(obj.val);
            break;

        case "string":
            result = obj.val;
            break;

        case "null":
            result = null;
            break;

        case "object":
            result = {};
            for (var prop in obj.val) {
                if (!obj.val.hasOwnProperty(prop))
                    continue;

                var val = obj.val[prop];
                result[prop] = deserialize(val);
            }
            break;

        default:
            if (obj.type === undefined) {
                result = obj;
            } else {
                console.log("Unhandle case in deserialize: " + obj.type);
            }
        }
        return result;
    };

    this.lookupObject = function(key) {
        var db_object = localStorage.getItem(key);
        if (db_object === null)
            return null;

        return deserialize(JSON.parse(db_object));
    };

    function serialize(obj) {
        var db_object;
        if (_.isArray(obj)) {
            db_object = {
                type: "array",
                val: _.map(obj, function(val, index) {
                    return serialize(val);
                }),
            };
        } else if (_.isObject(obj) && !_.isEmpty(obj)) {
            db_object = {};
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop))
                    continue;

                var result;
                var val = obj[prop];
                db_object[prop] = serialize(val);
            }
            db_object = { type: "object", val: db_object };
        } else if (_.isFunction(obj)) {
            db_object = { type: "function", val: obj.toString() };
        } else if (_.isNumber(obj)) {
            db_object = { type: "number", val: obj };
        } else if (_.isString(obj)) {
            db_object = { type: "string", val: obj };
        } else if (_.isNull(obj)) {
            db_object = { type: "null" };
        } else {
            db_object = { type: "object", val: obj };
        }
        return db_object;
    };

    this.storeObject = function(key, obj) {
        var db_object = serialize(obj);
        localStorage.setItem(key, JSON.stringify(db_object));
    };

    this.removeObject = function(key) {
        localStorage.setItem(key, "__Perseus_null__");
        this._refs[key] = undefined;
    };

    this.store = function() {
        for (var key in this._refs) {
            localStorage.setItem(key, JSON.stringify(this._refs[key]));
        }
    };
};
