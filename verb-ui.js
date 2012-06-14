$('#test-infinitive').change(function() {
    var checked = $(this).prop("checked");
    if (checked) {
        $('#infinitive-input').show();
        $('#infinitive-label').hide();
    } else {
        $('#infinitive-input').hide();
        $('#infinitive-label').show();
    }
});

$('#display-pronouns').change(function() {
    var checked = $(this).prop("checked");
    if (checked) {
        for (var i = 1; i <= 6; ++i) {
            $('#pron' + i).show();
        }
    } else {
        for (var i = 1; i <= 6; ++i) {
            $('#pron' + i).hide();
        }
    }
});
