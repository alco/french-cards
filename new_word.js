$(document).ready(function(){
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
    });
});
