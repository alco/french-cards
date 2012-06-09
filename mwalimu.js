/*
 * Dependencies: Perseus
 */

(function($, window, document, undefined) {
    var Mwalimu = {
        init: function() {
        },
        save: function() {
        },
        getQuestionList: function(cards, user) {
            var list = [];
            return list;
        },
        unloadHook: function(e) {
            //Perseus.store();
        }
    };

    // Set up the unload hook
    var prevUnloadHandler = window.onbeforeunload;
    if (prevUnloadHandler != null) {
        var hook = Mwalimu.unloadHook;
        Mwalimu.unloadHook = function() {
            prevUnloadHandler();
            hook();
        };
    }

    window.Mwalimu = Mwalimu;
    window.onbeforeunload = Mwalimu.unloadHook;

})(jQuery, window, document);
