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
    mw.finish();
    setActiveArea(sessionStatsArea);
}

function showStats() {
    setActiveArea(statsArea);
    var statsTable = $('#stats-table-body');
    var answers = mw.getPreviousAnswers();

    function arrayToTR(array) {
        var result = '<tr>';
        for (var index in array) {
            result += '<td>' + array[index] + '</td>';
        }
        return $(result + '</tr>');
    }

    // CardID | Progress | Right/Wrong Ratio | Next Appearance
    var rows = [];
    for (var index in answers) {
        var answer = answers[index];
        var time = -mw.hours_since(answer.nextAppearance);
        var appearance;
        if (time <= 0)
            appearance = "now";
        else {
            time = Math.ceil(time);
            appearance = "in about " + time + (time > 1 ? " hours" : " hour");
        }
        var row = [
            answer.id,
            0,
            answer.rightCount + ":" + answer.wrongCount,
            appearance
        ];
        rows.push(row);
    }
    rows.sort(function(a, b) {
        var a_comps = a[0].split('.');
        var b_comps = b[0].split('.');
        for (var index in a_comps) {
            var aa = a_comps[index];
            var bb = b_comps[index];
            var cmp = alphanum(aa, bb);
            if (cmp === 0)
                continue;
            return cmp;
        }
    });
    statsTable.children().remove();
    for (var index in rows) {
        statsTable.append(arrayToTR(rows[index]));
    }
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
    var cardData = mw.cardWithID(session.currentCardID);
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
    showStats();
});

setOnClick('.restart-but', function() {
    mw.clearSession();
    startNewSession();
});

// Alphanumerical string comparison

function alphanum(a, b) {
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}

})(jQuery, Mwalimu, window);
