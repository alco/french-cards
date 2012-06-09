/*
 * Dependencies: jQuery, Mwalimu
 *
 * The contents of this file is expected to be included at the global scope.
 */
(function($, mw, window, undefined) {

var greetingArea = $('#greeting-area'),
    greetingElem = greetingArea.children('#greeting'),
    startSessionBut = greetingArea.children('#start-session-but'),

    studyArea = $('#study-area');

window.startSession = function() {
    var msg = "Hello, Alex! ";
    var cardCount = mw.getQuestionList().length;
    if (cardCount) {
        var cardsWord = (cardCount == 1 ? "card" : "cards");
        msg += "I have " + cardCount + " " + cardsWord + " for you to review.";
        startSessionBut.show();
    } else {
        msg += "Looks like there is nothing for you to review at the moment. You can study new cards or come back in about N hours.";
    }
    greetingElem.html(msg);
}

window.setClass = function(elem, klass) {
    elem.removeClass();
    elem.addClass(klass);
}

startSessionBut.click(function() {
    greetingArea.hide();
    studyArea.show();
});

$('#tap-to-show-answer').click(function() {
    setClass($('#card'), 'answer');
});

$('#wrong-but').click(function() {
    wrongAnswer();
    nextCard();
});

$('#skip-but').click(function() {
    user.skipCard();
    nextCard();
});

$('#right-but').click(function() {
    rightAnswer();
    nextCard();
});

window.showCard = function(index) {
    var titleElem = $('#card-title p'),
        contentElem = $('#card-content p');

    if (user.currentCard >= questions.length) {
        titleElem.html("The End");
        contentElem.html("");
        setClass($('#card'), 'choice');
        user.currentCard = -1;
        return;
    }

    if (index < 0)
        index = 0;

    var cardData = questions[index];
    titleElem.html(cardData["en"]);
    contentElem.html(cardData["fr"]);
    setClass($('#card'), 'choice');

    $('#counter').html((index+1) + "/" + questions.length);
}

//        $('#flip-card-but').click(function() {
//            $(this).hide();
//            $('#card-content').css({
//                color: "black"
//            });
//        });

})(jQuery, Mwalimu, window);
