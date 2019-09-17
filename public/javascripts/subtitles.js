$(document).ready(function(){
    $('#sub_en').click(function(){
        $('#tracksub').attr('src', 'subtitles/english_sub.vtt');
    });
    $('#sub_it').click(function(){
        $('#tracksub').attr('src', 'subtitles/italian_sub.vtt');
    });
    $('#sub_fr').click(function(){
        $('#tracksub').attr('src', 'subtitles/french_sub.vtt');
    });
    $('#sub_de').click(function(){
        $('#tracksub').attr('src', 'subtitles/german_sub.vtt');
    });
    $('#sub_sp').click(function(){
        $('#tracksub').attr('src', 'subtitles/spanish_sub.vtt');
    });
})