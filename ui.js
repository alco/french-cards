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

function startSession(session) {
    session.state = mw.SESSION_REVIEW;
    greetingArea.hide();
    studyArea.show();
    statsArea.hide();
    showCard(session);
}

function showStats(session) {
    session.state = mw.SESSION_STATS;
    greetingArea.hide();
    studyArea.hide();
    statsArea.show();
}

function startNewSession(msg) {
    greetingArea.show();
    studyArea.hide();
    statsArea.hide();
    startSessionBut.hide();

    if (msg === undefined)
        msg = "";

    // This var is intentionally global
    session = mw.startSession();
    if (session) {
        if (session.state == mw.SESSION_GREETING) {
            var cardsWord = (session.cardCount == 1 ? "card" : "cards");
            msg += "I have " + session.cardCount + " " + cardsWord + " for you to review.";
            startSessionBut.show();
        } else if (session.state == mw.SESSION_REVIEW) {
            $('#session-resumed').show();
            startSession(session);
        } else if (session.state == mw.SESSION_STATS) {
            showStats(session);
        } else {
            console.log("Unhandled session state: " + session.state);
        }
    } else {
        msg += "Looks like there is nothing for you to review at the moment. You can study new cards or come back in about N hours.";
    }
    greetingElem.html(msg);
}

window.init = function() {
    mw.init({
        shouldSetupUnloadHook: true,
    });

    var msg = "Hello, Alex! ";
    startNewSession(msg);
};

function setClass(elem, klass) {
    elem.removeClass();
    elem.addClass(klass);
};

function showCard(session) {
    var cardData = mw.cards[session.currentCardID];
    titleElem.html(cardData["en"]);
    contentElem.html(cardData["fr"]);
    setClass(cardElem, 'choice');

    $('#counter').html((session.currentCard+1) + "/" + session.cardCount);
};

function nextCard(session) {
    session.currentCard++;
    if (session.currentCard >= session.cardCount) {
        showStats(session);
    } else {
        showCard(session);
    }
}

function rightAnswer() {
    mw.addAnswer(session, 'right');
}

function wrongAnswer() {
    mw.addAnswer(session, 'wrong');
}

///

$('#start-session-but').click(function() {
    startSession(session);
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

$('#restart-but').click(function() {
    mw.clearSession();
    startNewSession();
});

})(jQuery, Mwalimu, window);
