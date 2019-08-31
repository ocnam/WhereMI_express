var update_btn = document.getElementById('update');
var selectLingua = document.getElementById("selectLingua");
var selectCategoria = document.getElementById("selectCategoria");
var selectAudience = document.getElementById("selectAudience");
var selectDetail = document.getElementById("selectDetail");
var player = document.getElementById('player');

var clips = window.getSaveClip();    //Ottieni array clip salvate
var lastClip,metadati;

update_btn.onclick = function(){
  getClip(); //ottieni la clip audio
  buildMetadati();  //creazione stringa metadati
  sendClipServer();  //invio clip server per upload
}

function getClip(){
  //seleziona la clip
  if(player.readyState == 0){   //nessuna clip precedente, seleziona l'ultima registrazione
    lastClip = clips[clips.length - 1];
    console.log("Ultima clip");
  }else{
    lastClip = player.src;  //clip precedente caricata 
    console.log("Clip precedente");
  }
  console.log(lastClip);
  
  /*clips.forEach(function(item){
    console.log(item);
  });*/
}

function buildMetadati(){
  //ottengo valori form
  var scopo = document.querySelector('input[name="checkScopo"]:checked').value;
  var lingua = selectLingua.options[selectLingua.selectedIndex].value;
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].value;
  var pubblico = selectAudience.options[selectAudience.selectedIndex].value;
  var dettaglio = selectDetail.options[selectDetail.selectedIndex].value;

  //Ottengo il codice OLC
  var urlCodereverse = "https://plus.codes/api?address=" + window.lat +","+window.long;
  $.get(urlCodereverse, function( data ) {
    var openLocationCode = data.plus_code.global_code;

    if(categoria != "none"){
      metadati = openLocationCode +":"+scopo+":"+lingua+":"+categoria +":A"+ pubblico +":P"+dettaglio;
    }else{
      metadati = openLocationCode +":"+scopo+":"+lingua+":*";     //metadati base 
    }
    alert(metadati);
  })
      .fail(function() {
        alert( "error OLC Conversion" );
      });
}

function sendClipServer(){

  //converto dati grezzi
  var reader = new window.FileReader();
  reader.readAsDataURL(lastClip.url);
  reader.onloadend = function () {
    var dataClipUrl = reader.result; //dati da inviare al server (node)

    //chiamata API al server locale
    $.post( "/api/audioclip", { clip: dataClipUrl, durata:lastClip.durata, orario:lastClip.orario})
      .done(function( ack ) {
        alert( "Response node.js --> " + ack );
      })
      .fail(function() {
        alert( "error send clip to our server" );
      });
  }
}