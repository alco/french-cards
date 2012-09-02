$(document).ready(function(){
    var storedWords = Perseus.lookupObject("words", []);
    for (var i = 0; i < storedWords.length; ++i) {
        var word = storedWords[i];
        $('#word-list').append('<li>' + word.word + '</li>');
    }

    $('#add-new-word-but').click(function() {
        var word = $('#word').val();
        var sourceLang = $('#source-lang').val();
        var partsOfSpeech = [];
        $('input[name="part-of-speech"]').each(function() {
            if (this.checked) {
                partsOfSpeech.push($(this).parent().text());
            }
        });
        var translations = {};
        $('.translation').each(function() {
            var lang = $(this).prop('class').split(" ")[1];
            translations[lang] = $(this).val();
        });

        var newWord = {
            "word": word,
            "sourceLang": sourceLang,
            "partsOfSpeech": partsOfSpeech,
            "translations": translations
        };
        console.log('add new word');
        console.log(newWord);

        console.log(storedWords);
        storedWords.push(newWord);
        console.log(storedWords);
        Perseus.storeObject("words", storedWords);
    });

    $('#get-stored-words-but').click(function() {
        console.log(Perseus.retrieve("words"));
    });
});
