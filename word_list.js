$(document).ready(function() {
    var topicListElem = $('#topic-list');
    var wordListElem = $('#word-list');
    var topics = ['LOTR', 'Dune', 'Crockery', 'Hojarasca', '[no topic]'];
    var selectedTopic, selectedWord;
    var wordEditorElem = $('#word-editor');
    wordEditorElem.hide();

    $('#words-div').height($('#topics-div').height());

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
            'Hojarasca': ['ataúd', 'hombro', 'aserrín', 'esclavo', 'sacudir'],
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
        resetEditor();
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
        populateEditor(word);
    }

    function resetEditor() {
        wordEditorElem.hide();

        $('.translations').each(function() {
            $(this).val('');
        });
        $('input[name="part-of-speech"]').each(function() {
            this.checked = false;
        });
    }

    function populateEditor(word) {
        resetEditor();

        var storedWords = Perseus.lookupObject('words');
        var index = -1;
        _.each(storedWords, function(obj, ind) {
            if (obj['word'] == word) {
                index = ind;
            }
        });
        if (index < 0) {
            return;
        }

        wordEditorElem.show();

        var wordData = storedWords[index];
        $('#word').val(wordData['word']);
        $('#source-lang').val(wordData['sourceLang']);
        _.each(wordData['partsOfSpeech'], function(obj) {
            var correctElem;
            $('input[name="part-of-speech"]').each(function(ind, elem) {
                if ($(elem).parent().text() == obj) {
                    correctElem = elem;
                }
            });
            console.log(correctElem);
            console.log(typeof(correctElem));
            correctElem.checked = true;
        });
        _.each(wordData['translations'], function(obj, key) {
            $('.translation').each(function() {
                if ($(this).hasClass(key)) {
                    $(this).val(obj);
                }
            });
        });
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
