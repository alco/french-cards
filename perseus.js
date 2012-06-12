/*
 * Dependencies: jQuery
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