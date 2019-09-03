var update_btn = document.getElementById('update');
var selectLingua = document.getElementById("selectLingua");
var selectCategoria = document.getElementById("selectCategoria");
var selectAudience = document.getElementById("selectAudience");
var selectDetail = document.getElementById("selectDetail");
var txt_titolo = document.getElementById("txtTitolo");
var player = document.getElementById('player');
var titoloForm = document.getElementById('titoloMetadati');


var clips = window.getSaveClip();    //Ottieni array clip salvate
var lastClip,metadatiClip,titoloClip;

update_btn.onclick = function(){
  getClip(); //ottieni la clip audio
  buildMetadati()
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
  titoloClip = txt_titolo.value;
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
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":"+categoria +":A"+ pubblico +":P"+dettaglio;
    }else{
      metadatiClip = openLocationCode +":"+scopo+":"+lingua+":*";     //metadati base 
    }
    if(titoloClip!=""){
      titoloForm.innerText = "Uploading...";
      sendClipServer(); //invia clip al server
    }else{
      alert("Inserisci il titolo!");
    }
    
  })
      .fail(function() {
        alert( "error OLC Conversion" );
      });
}

function sendClipServer(){
  console.log(metadatiClip);

  //converto dati grezzi
  var reader = new window.FileReader();
  reader.readAsDataURL(lastClip.raw);
  reader.onloadend = function () {
    var dataClipUrl = reader.result; //dati da inviare al server (node)
    //chiamata API al server locale
    $.post( "/api/audioclip", { 
      clip: dataClipUrl, 
      durata:lastClip.durata, 
      orario:lastClip.orario,
      titolo: titoloClip,
      metadati: metadatiClip,
    })
      .done(function( ack ) {
        if(ack = "200 OK"){
          alert("Caricamento con successo!");
          titoloForm.innerText = "Dettagli clip";
        }else{
          alert("Errore interno al server, ritenta")
        }
      })
      .fail(function() {
        alert( "Errore richiesta" );
      });
  }
}