/*
 * Dependencies: Perseus
 */

(function($, window, document, undefined) {
    function hours_since(timestamp) {
        var current_time = new Date().getTime();
        var diff = current_time - timestamp;  // in milliseconds
        return diff / 1000 / 3600;
    }

    function hours_between(t1, t2) {
        if (t1 < t2) {
            var tmp = t1;
            t1 = t2;
            t2 = tmp;
        }

        var diff = t1 - t2;  // in milliseconds
        return diff / 1000 / 3600;
    }

    var user = new User();//Perseus.persistentObject("user", new User());

    var Mwalimu = {
        // Debug info
        // ***
        user: user,
        // ***

        cards: Cards,

        init: function() {
        },

        save: function() {
        },

        startSession: function() {
            var cards = this.getQuestionList(Cards, user);
            if (cards.length) {
                // Return a new session object
                return {
                    cards: cards,
                    cardCount: cards.length,
                    currentCard: 0,
                    get currentCardID() {
                        return cards[this.currentCard];
                    }
                };
            }
        },

        getQuestionList: function(cards, user) {
            var result = [];

            for (var cardID in cards) {
                // Search for previous answers with the same id to determine the knowledge level
                //
                // For now, we'll check the last two answers to determine the time for the next exposure.
                // If there is only one answer, this cardID will be shown after FIRST_REVIEW_HRS hours.
                // If there are no answers, show this cardID right now.
                var answers = user.guessedAnswers[cardID];
                if (answers && answers.length === 1) {
                    if (hours_since(answers[0].timestamp) < FIRST_REVIEW_HRS) {
                        continue;
                    }
                } else if (answers && answers.length > 1) {
                    var a = answers[answers.length-1];
                    var b = answers[answers.length-2];
                    var time_diff = hours_between(a.timestamp, b.timestamp);
                    if (hours_since(a.timestamp) < time_diff * 2) {
                        continue;
                    }
                }
                result.push(cardID);
            }

            return result;
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
