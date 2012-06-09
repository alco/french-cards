var User = function() {
    this.currentCard = 0;
    this.viewedCardCount = 0;

    this.skippedCount = 0;
    this.skipCard = function() {
        this.skippedCount++;
    };

    this.guessedAnswers = [];
    this.examAnswers = [];

    var LEVEL_FIRST_OCCURENCE = 0,
    LEVEL_4_HOURS = 1,
    LEVEL_8_HOURS = 2,
    LEVEL_24_HOURS = 3,
    LEVEL_1_WEEK = 4,
    LEVEL_2_WEEKS = 5,
    LEVEL_1_MONTH = 6;

    // All time periods are given in hours
    var PERIODS = [
        4,
        8,
        24,
        24 * 7,
        24 * 14,
        24 * 30
    ];

    this.getQuestionList = function(cards) {
        var result = [];

        for (var question_id = 0; question_id < cards.length; ++question_id) {
            // Search for previous answers with the same id to determine the level
            var prevAnswer = null;
            for (var i = this.guessedAnswers.length-1; i >= 0; --i) {
                var ans = this.guessedAnswers[i];
                if (ans.id == question_id) {
                    prevAnswer = ans;
                    break;
                }
            }

            if (prevAnswer) {
                // Check to see whether enough time has passed
                var orig_time = prevAnswer.timestamp;
                var current_time = new Date().getTime();
                var diff = current_time - orig_time;  // in milliseconds
                var diff_in_hours = diff / 1000 / 3600;
                if (diff_in_hours > PERIODS[prevAnswer.level]) {
                    // take this question
                } else {
                    // skip the question
                    continue;
                }
            }

            result.push(cards[question_id]);
        }

        return result;
    };

    this.addAnswer = function(type) {
        var question_id = this.currentCard;

        // Search for previous answers with the same id to determine the level
        var level = LEVEL_FIRST_OCCURENCE;
        for (var i = this.guessedAnswers.length-1; i >= 0; --i) {
            var ans = this.guessedAnswers[i];
            if (ans.id == question_id) {
                level = ans.level+1;
                break;
            }
        }

        var answer = {
            id: question_id,
            level: level,
            timestamp: new Date().getTime(),
            type: type,
            thinkingTime: 0
        };

        this.guessedAnswers.push(answer);
    }
};
