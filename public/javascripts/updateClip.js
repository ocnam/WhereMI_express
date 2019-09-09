//Elementi statici
var update_btn = document.getElementById('update');
var selectLingua = document.getElementById("selectLingua");
var selectCategoria = document.getElementById("selectCategoria");
var selectAudience = document.getElementById("selectAudience");
var selectDetail = document.getElementById("selectDetail");
var txt_titolo = document.getElementById("txtTitolo");
var player = document.getElementById('player');
var titoloForm = document.getElementById('titoloMetadati');
var formMeta = document.getElementById('dettagliClipPanel')

var lastClip,metadatiClip,titoloClip;
var clips = window.getSaveClip();    //Ottieni array clip salvate

update_btn.onclick = function(){
  getClip(); //ottieni la clip audio
  uploadClip();
}

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
  var scopo = document.querySelector('input[name="checkScopo"]:checked').value;
  var lingua = selectLingua.options[selectLingua.selectedIndex].value;
  var categoria = selectCategoria.options[selectCategoria.selectedIndex].value;
  var pubblico = selectAudience.options[selectAudience.selectedIndex].value;
  var dettaglio = selectDetail.options[selectDetail.selectedIndex].value;

  //Converto posizione nel codice OLC
  var urlCodereverse = "https://plus.codes/api?address=" + window.lat +","+window.long; //URL API di OLC(Plus code)
  $.get(urlCodereverse, function( data ) {
    var openLocationCode = data.plus_code.global_code;

    //Costruisco stringa metadati
    if(categoria != "none"){
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":"+categoria +":A"+ pubblico +":P"+dettaglio;
    }else{
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":*";     //metadati base 
    }
    console.log(metadatiClip);
    if(titoloClip!=""){  
      sendClipServer();   //richiamo funzione chiamata server

      //Cambiamenti UI
      titoloForm.innerText = "Uploading...";
      formMeta.classList.add("bg-warning");
    }else{
      alert("Inserisci il titolo!");  //titolo obbligatorio
    }
    
  })
      .fail(function() {
        alert( "error OLC Conversion" );
      });
}

function sendClipServer(){
  //Converto i dati grezzi flusso audio
  var reader = new window.FileReader();
  reader.readAsDataURL(lastClip.raw);
  reader.onloadend = function () {
    var clipAudio = reader.result; 

    //chiamata API al server locale (node.js)
    $.post( "/api/audioclip", { 
      clip: clipAudio, 
      durata:lastClip.durata, 
      orario:lastClip.orario,
      data: lastClip.data,
      titolo: titoloClip,
      metadati: metadatiClip,
    })
      .done(function( response ) {
        if(response.ack = "200 OK"){
          alert("Caricamento con successo! \nSarà online in circa 5 minuti");
          titoloForm.innerText = "Dettagli clip";
          formMeta.classList.remove("bg-warning");

          //Utilizza API youtube per caricamento video
          window.uploadVideo(response.url,response.titolo,metadatiClip);
        }else{
          alert("Errore interno al server, ritenta!")
        }
      })
      .fail(function() {
        alert( "Errore richiesta!" );
      });
  }
}