var clips = window.getSaveClip();    //Ottieni array clip salvate
var update_btn = document.getElementById('update');
var selectLingua = document.getElementById("selectLingua");
var selectCategoria = document.getElementById("selectCategoria");
var selectAudience = document.getElementById("selectAudience");
var selectDetail = document.getElementById("selectDetail");
var player = document.getElementById('player');

//8FPHF800+-8FPHF8VV+-8FPHF8VV+57:what:ita:*
//8FPHF800+-8FPHF8VV+-8FPHF8VV+57:why:ita:his-art:Aall:P2

//||OLC||:how:ita:his:Agen:P1

update_btn.onclick = function(){
  var lastClip;
  //nessuna clip vecchia caricata
  if(player.readyState == 0){
    lastClip = clips[clips.length - 1];
    console.log("Ultima clip");
  }else{
    lastClip = player.src;
    console.log("Clip precedente");
  }

  console.log(lastClip);
  /*
  clips.forEach(function(item){
    console.log(item);
  });*/

  //get value - metadati(form)
  var scopo = document.querySelector('input[name="checkScopo"]:checked').value;
  var lingua = selectLingua.options[selectLingua.selectedIndex].value;
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].value;
  var pubblico = selectAudience.options[selectAudience.selectedIndex].value;
  var dettaglio = selectDetail.options[selectDetail.selectedIndex].value;

  console.log("LAT: " + window.lat);
  console.log("LONG: "+ window.long);

  var urlCodereverse = "https://plus.codes/api?address=" + window.lat +","+window.long;

  $.get(urlCodereverse, function( data ) {
    var openLocationCode = data.plus_code.global_code;
    console.log(data);

    if(categoria != "none"){
      var metadati = openLocationCode +":"+scopo+":"+lingua+":"+categoria +":A"+ pubblico +":P"+dettaglio;
    }else{
      var metadati = openLocationCode +":"+scopo+":"+lingua+":*";
    }
    alert(metadati);
  })
      .fail(function() {
        alert( "error OLC Conversion" );
      });
}