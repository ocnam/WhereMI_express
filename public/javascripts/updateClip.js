//Elementi statici
var update_btn = document.getElementById('update');
var selectLingua = document.getElementById("selectLingua");
var selectCategoria = document.getElementById("selectCategoria");
var selectAudience = document.getElementById("selectAudience");
var selectDetail = document.getElementById("selectDetail");
var txt_titolo = document.getElementById("txtTitolo");
var txt_descrizione = document.getElementById('txtDescrizione');
var player = document.getElementById('player');
var titoloForm = document.getElementById('titoloMetadati');
var formMeta = document.getElementById('dettagliClipPanel');

var lastClip,metadatiClip,titoloClip,descrizioneClip,openLocationCode;
var clips = window.getSaveClip();    //Ottieni array clip salvate

update_btn.onclick = function(){
  getClip(); //ottieni la clip audio
  uploadClip();
}

//Selezione clip 
function getClip(){
  if(player.readyState == 0){   //nessuna clip precedente, seleziona l'ultima registrazione
    lastClip = clips[clips.length - 1];
  }else{
    lastClip = window.correntAudioReplay; //Clip precedente (src player)
  }
}

function uploadClip(){
  //Ottengo valori form
  titoloClip = txt_titolo.value;
  descrizioneClip = txt_descrizione.value;
  var scopo = document.querySelector('input[name="checkScopo"]:checked').value;
  var lingua = selectLingua.options[selectLingua.selectedIndex].value;
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].value;
  var pubblico = selectAudience.options[selectAudience.selectedIndex].value;
  var dettaglio = selectDetail.options[selectDetail.selectedIndex].value;

  if(window.lat == undefined || window.long == undefined ){
    alert("Geolocalizzazione non riuscita! Inserisci una località manualmente");
    return;
  }

  //Converto posizione nel codice OLC
  var urlCodereverse = "https://plus.codes/api?address=" + window.lat +","+window.long; //URL API di OLC(Plus code)
  $.get(urlCodereverse, function( data ) {
    openLocationCode = data.plus_code.global_code;


    console.log(categoria);
    //Costruisco stringa metadati
   // if(categoria != "none"){
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":"+categoria +":"+ pubblico +":"+dettaglio;
    /*}else{
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":*";     //metadati base
    }*/
    console.log("Metadati:",metadatiClip);
    console.log("DESC:", descrizioneClip);

    if(titoloClip!=""){
      sendClipServer();   //richiamo funzione chiamata server

      //Cambiamenti UI
      titoloForm.innerText = "Uploading...";
      formMeta.classList.add("bg-warning");
    }else{ alert("Inserisci un titolo!") } //titolo obbligatorio
  })
    .fail(function() {alert( "Error OLC Conversion" )});
}

function sendClipServer(){
  //Converto i dati grezzi del flusso audio
  var reader = new window.FileReader();
  reader.readAsDataURL(lastClip.raw);
  reader.onloadend = function () {
    var clipAudio = reader.result;

    //API server locale --> Clip audio to video
    $.post( "/api/audioclip", {
      clip: clipAudio,
      durata:lastClip.durata,
      orario:lastClip.orario,
      data: lastClip.data,
      titolo: titoloClip,
      metadati: metadatiClip,
      posizione: openLocationCode
    })
      .fail(function(){ alert("Errore richiesta!") })
      .done(function(responseLocal) {
        if(responseLocal.ack = "200 OK"){
          console.log("OK - Conversione in clip video");

          //carica filmato su youtube
          var success = window.uploadToYoutube(responseLocal.url,responseLocal.titolo, metadatiClip, descrizioneClip);

          //Cambiamenti UI
          if(success){
            titoloForm.innerText = "Dettagli clip";
            formMeta.classList.remove("bg-warning");
            alert("Caricamento con successo! \nSarà online fra pochi minuti");
          }else{alert("Errore caricamento online")}
        }else{alert("500 - Errore interno al server, ritenta!")}
      });
  }
}