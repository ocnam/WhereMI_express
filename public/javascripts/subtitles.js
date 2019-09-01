$(document).ready(function(){
    $('#sub_en').click(function(){
        $('#track').attr('src', 'subtitles/english_sub.vtt');
    });
    $('#sub_it').click(function(){
        $('#track').attr('src', 'subtitles/italian_sub.vtt');
    });
    $('#sub_fr').click(function(){
        $('#track').attr('src', 'subtitles/french_sub.vtt');
    });
    $('#sub_ge').click(function(){
        $('#track').attr('src', 'subtitles/german_sub.vtt');
    });
    $('#sub_sp').click(function(){
        $('#track').attr('src', 'subtitles/spanish_sub.vtt');
    });
})