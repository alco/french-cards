/*
 * Dependencies: Perseus
 */

(function($, window, document, undefined) {
    var MILLISECS_TO_HOURS = 1 / 1000 / 3600;

    function time_since(timestamp) {
        var current_time = new Date().getTime();
        return current_time - timestamp;  // in milliseconds
    }

    function hours_since(timestamp) {
        return time_since(timestamp) * MILLISECS_TO_HOURS;
    }

    function time_between(t1, t2) {
        if (t1 < t2) {
            var tmp = t1;
            t1 = t2;
            t2 = tmp;
        }
        return t1 - t2;  // in milliseconds
    }

    function hours_between(t1, t2) {
        return time_between(t1, t2) * MILLISECS_TO_HOURS;
    }

    var _unloadHook = function() {
        Perseus.store();
    };

    var FIRST_REVIEW_HRS = 4;

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

    function projected_card_time(answers) {
        if (!answers || answers.length === 0) {
            return 0;
        }

        if (answers.length === 1) {
            if (answers[0].isRight) {
                return answers[0].timestamp + FIRST_REVIEW_HRS / MILLISECS_TO_HOURS;
            }
            return 0;
        }

        var a = answers[answers.length-1];
        var b = answers[answers.length-2];
        if (a.isRight) {
            if (b.isRight) {
                var time_diff = time_between(a.timestamp, b.timestamp);
                return a.timestamp + time_diff * 2;
            }
            return a.timestamp + FIRST_REVIEW_HRS / MILLISECS_TO_HOURS;
        }
        return 0;
    }

    var user = Perseus.persistentObject("user", new User());

    var Mwalimu = {
        // Debug info
        // ***
        user: user,
        hours_since: hours_since,
        // ***

        SESSION_GREETING: 0,
        SESSION_REVIEW: 1,
        SESSION_STATS: 2,

        cards: Cards,
        cardWithID: function(cardID) {
            var comps = cardID.split('.');
            if (comps[0] === "CoffeeBreak") {
                var lesson = Cards[comps[1]];
                var index = parseInt(comps[2]);
                return lesson["cards"][index-1];
            }
        },

        init: function(options) {
            if (options) {
                if (options.shouldSetupUnloadHook) {
                    window.onbeforeunload = buildUnloadHook();
                }
            }
        },

        finish: function() {
            Perseus.store();
        },

        startSession: function() {
            var session = Perseus.persistentObject("session", {});

            // First check to see if there is a suspended session
            if (session.timestamp && hours_since(session.timestamp) < 1) {
                // Renew the timestamp
                session.timestamp = new Date().getTime();
            } else {
                var cards = this.getQuestionList(user);
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

        getQuestionList: function(user) {
            var result = [];

            for (var cat_key in user.cardCategories) {
                var cats = user.cardCategories[cat_key];
                for (var lesson_key in cats) {
                    var lesson = cats[lesson_key];
                    for (var index in lesson) {
                        var cardID = cat_key + "." + lesson_key + "." + lesson[index];
                        // Search for previous answers with the same id to determine the knowledge level
                        //
                        // For now, we'll check the last two answers to determine the time for the next exposure.
                        // If there is only one answer, this cardID will be shown after FIRST_REVIEW_HRS hours.
                        // If there are no answers, show this cardID right now.
                        var answers = user.guessedAnswers[cardID];
                        var time = projected_card_time(answers);
                        if (new Date().getTime() > time) {
                            result.push(cardID);
                        }
                    }
                }
            }

            return result;
        },

        getPreviousAnswers: function() {
            var result = [];
            var answers = this.user.guessedAnswers;
            for (var cardID in answers) {
                var records = answers[cardID];

                var rightCount = 0,
                    wrongCount = 0,
                    nextAppearance = projected_card_time(records);

                for (var index in records) {
                    var ans = records[index];
                    if (ans.isRight)
                        ++rightCount;
                    else
                        ++wrongCount;
                }
                result.push({
                    id: cardID,
                    rightCount: rightCount,
                    wrongCount: wrongCount,
                    nextAppearance: nextAppearance
                });
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
