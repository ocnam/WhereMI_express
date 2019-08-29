var clips = window.getSaveClip();    //Ottieni array clip salvate
var update_btn = document.getElementById('update');

update_btn.onclick = function(){
  var lastClip = clips[clips.length - 1];

  clips.forEach(function(item){
    console.log(item);
  });
}
