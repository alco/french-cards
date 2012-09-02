$(document).ready(function() {
    var topicListElem = $('#topic-list');
    var wordListElem = $('#word-list');
    var topics = ['LOTR', 'Dune', 'Crockery', '[no topic]'];
    var selectedTopic, selectedWord;

    _.each(topics, function(obj) {
        var li_elem = $('<li></li>');
        li_elem.appendTo(topicListElem);
        var a_elem = $('<a></a>');
        a_elem.appendTo(li_elem);
        a_elem.text(obj);
    });

    selectTopic($('#topic-list li')[0]);

    function displayWords(topic) {
        var words = {
            'LOTR': ['tarry', 'trough', 'founder', 'asunder', 'loom'],
            'Dune': ['rascal'],
            'Crockery': [],
            '[no topic]': ['wont', 'swath', 'swag']
        };
        wordListElem.children().remove();
        if (words[topic].length == 0) {
        } else {
            _.each(words[topic], function(obj) {
                var li_elem = $('<li></li>');
                li_elem.appendTo(wordListElem);
                var a_elem = $('<a></a>');
                a_elem.appendTo(li_elem);
                a_elem.text(obj);
            });
        }
    }


    $('#topic-list').on('click', 'li', function() {
        selectTopic(this);
    });

    function highlightTopic(elem) {
        removeTopicSelection();
        selectedTopic = $(elem);
        selectedTopic.addClass('selected');
    }

    function selectTopic(elem) {
        highlightTopic(elem);
        var topicName = $(elem).children('a').text();
        displayWords(topicName);
    }


    function removeTopicSelection() {
        if (selectedTopic) {
            selectedTopic.removeClass('selected');
            selectedTopic = null;
        }
    }

    $('#word-list').on('click', 'li', function() {
        selectWord(this);
        var word = $(this).children('a').text();
        editWord(word);
    });

    function editWord(word) {
    }

    function selectWord(elem) {
        removeWordSelection();
        selectedWord = $(elem);
        selectedWord.addClass('selected');
    }

    function removeWordSelection() {
        if (selectedWord) {
            selectedWord.removeClass('selected');
            selectedWord = null;
        }
    };
});
