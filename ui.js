/*
 * Dependencies: jQuery, Mwalimu
 *
 * The contents of this file is expected to be included at the global scope.
 */
(function($, mw, window, undefined) {

var greetingArea = $('#greeting-area'),
    studyArea = $('#study-area'),
    statsArea = $('#stats-area'),

    greetingElem = greetingArea.children('#greeting'),
    startSessionBut = $('#start-session-but'),

    cardElem = $('#card'),
    titleElem = $('#card-title p'),
    contentElem = $('#card-content p');


window.startSession = function() {
    var msg = "Hello, Alex! ";
    // This var is intentionally global
    session = mw.startSession();
    if (session) {
        var cardsWord = (session.cardCount == 1 ? "card" : "cards");
        msg += "I have " + session.cardCount + " " + cardsWord + " for you to review.";
        startSessionBut.show();
    } else {
        msg += "Looks like there is nothing for you to review at the moment. You can study new cards or come back in about N hours.";
    }
    greetingElem.html(msg);
};

window.setClass = function(elem, klass) {
    elem.removeClass();
    elem.addClass(klass);
};

window.showCard = function(session) {
    var cardData = mw.cards[session.currentCardID];
    titleElem.html(cardData["en"]);
    contentElem.html(cardData["fr"]);
    setClass(cardElem, 'choice');

    $('#counter').html((session.currentCard+1) + "/" + session.cardCount);
};

window.nextCard = function(session) {
    session.currentCard++;
    if (session.currentCard >= session.cardCount) {
        studyArea.hide();
        statsArea.show();
    } else {
        showCard(session);
    }
};

window.rightAnswer = function() {
};

window.wrongAnswer = function() {
};

///

$('#start-session-but').click(function() {
    greetingArea.hide();
    studyArea.show();
    showCard(session);
});

$('#tap-to-show-answer').click(function() {
    setClass(cardElem, 'answer');
});

$('#wrong-but').click(function() {
    wrongAnswer();
    nextCard(session);
});

$('#right-but').click(function() {
    rightAnswer();
    nextCard(session);
});

$('#skip-but').click(function() {
    nextCard(session);
});

})(jQuery, Mwalimu, window);
