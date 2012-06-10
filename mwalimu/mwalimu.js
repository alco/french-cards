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

    var _unloadHook = function() {
        Perseus.store();
    };

    function buildUnloadHook() {
        var prevUnloadHandler = window.onbeforeunload;
        if (prevUnloadHandler != null) {
            return function() {
                prevUnloadHandler();
                _unloadHook();
            };
        } else {
            return _unloadHook;
        }
    }

    var FIRST_REVIEW_HRS = 4;

    var user = Perseus.persistentObject("user", new User());

    var Mwalimu = {
        // Debug info
        // ***
        user: user,
        // ***

        SESSION_GREETING: 0,
        SESSION_REVIEW: 1,
        SESSION_STATS: 2,

        cards: Cards,

        init: function(options) {
            if (options) {
                if (options.shouldSetupUnloadHook) {
                    window.onbeforeunload = buildUnloadHook();
                }
            }
        },

        startSession: function() {
            var session = Perseus.persistentObject("session", {});

            // First check to see if there is a suspended session
            if (session.timestamp && hours_since(session.timestamp) < 1) {
                // Renew the timestamp
                session.timestamp = new Date().getTime();
            } else {
                var cards = this.getQuestionList(Cards, user);
                if (cards.length === 0) {
                    return false;
                }

                this.clearSession();

                // Return a new session object
                session = Perseus.persistentObject("session", {
                    state: this.SESSION_GREETING,
                    timestamp: new Date().getTime(),
                    cards: cards,
                    cardCount: cards.length,
                    currentCard: 0,
                });
            }

            session.__defineGetter__("currentCardID", function() {
                return this.cards[this.currentCard];
            });

            return session;
        },

        clearSession: function() {
            Perseus.removeObject("session");
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
                    if (answers[0].isRight && hours_since(answers[0].timestamp) < FIRST_REVIEW_HRS) {
                        continue;
                    }
                } else if (answers && answers.length > 1) {
                    var a = answers[answers.length-1];
                    var b = answers[answers.length-2];
                    if (a.isRight) {
                        if (b.isRight) {
                            var time_diff = hours_between(a.timestamp, b.timestamp);
                            if (hours_since(a.timestamp) < time_diff * 2) {
                                continue;
                            }
                        } else if (hours_since(a.timestamp) < FIRST_REVIEW_HRS) {
                            continue;
                        }
                    }
                }
                result.push(cardID);
            }

            return result;
        },

        addAnswer: function(session, type) {
            var isRight = (type == 'right');

            this.user.addAnswer(session.currentCardID, isRight);
        }
    };

    window.Mwalimu = Mwalimu;

})(jQuery, window, document);
