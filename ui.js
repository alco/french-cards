/*
 * Dependencies: jQuery, Mwalimu
 *
 * The contents of this file is expected to be included at the global scope.
 */
(function($, mw, window, undefined) {

var mainContainer = $('#main-container'),

    greetingArea = $('#greeting-area'),
    studyArea = $('#study-area'),
    statsArea = $('#stats-area'),
    sessionStatsArea = $('#session-stats-area'),

    greetingElem = greetingArea.children('#greeting'),
    startSessionBut = $('#start-session-but'),

    cardElem = $('#card'),
    titleElem = $('#card-title p'),
    contentElem = $('#card-content p');

function setActiveArea(area) {
    mainContainer.children().replaceWith(area);
}

function startReviewSession(session) {
    session.state = mw.SESSION_REVIEW;
    setActiveArea(studyArea);
    showCard(session);
}

function showSessionStats(session) {
    session.state = mw.SESSION_STATS;
    setActiveArea(sessionStatsArea);
}

function startNewSession(msg) {
    setActiveArea(greetingArea);
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
            startReviewSession(session);
            $('#session-resumed').show();
        } else if (session.state == mw.SESSION_STATS) {
            showSessionStats(session);
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

    var areas = [greetingArea, studyArea, statsArea, sessionStatsArea];
    for (var index in areas) {
        var area = areas[index];
        area.detach();
        area.show();
    }

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
        showSessionStats(session);
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

function setOnClick(selector, fun) {
    mainContainer.on('click', selector, fun);
}

setOnClick('#start-session-but', function() {
    startReviewSession(session);
});

setOnClick('#tap-to-show-answer', function() {
    setClass(cardElem, 'answer');
});

setOnClick('#wrong-but', function() {
    wrongAnswer();
    nextCard(session);
});

setOnClick('#right-but', function() {
    rightAnswer();
    nextCard(session);
});

setOnClick('#skip-but', function() {
    nextCard(session);
});

///

setOnClick('#view-stats-but', function() {
    setActiveArea(statsArea);
    var statsTable = $('#stats-table-body');
    statsTable.html('<tr><td>hello</td></tr>');
});

setOnClick('.restart-but', function() {
    mw.clearSession();
    startNewSession();
});

})(jQuery, Mwalimu, window);
