//componenti statici
var player = document.getElementById('player');
var titleRec = document.getElementById('titleRecPlayer');
var rec = document.getElementById('rec');
var pause = document.getElementById('pause');
var stop = document.getElementById('stop');
var messageLabel = document.getElementById('message');
var labelAzioni = document.getElementById('labelAzioni');
var salva = document.getElementById('salva');
var update = document.getElementById('update');
var tabClipSalvate = document.getElementById('tabClipSalvate');
var contenutoTabClipSalvate = document.getElementById('tbodyClipSalvate');
var dettaglioPanel = document.getElementById('dettagliClipPanel');
var labelTabSaveClip = document.getElementById('labelTab');
var geoText = document.getElementById('txtGeoloc');

var clipRegistrate= [];   //array di clip salvate

//geolocalizzazione + find address
getLocation();

//Contolla il supporto delle API video/audio
var checkCompatibility = function(){
  if(!navigator.mediaDevices){
    alert('navigator.mediaDevices is undefined \n(Probabile restrizione HTTPS/localhost)');

    //Restrizione userMedia (localhost or HTTPs)
    var isSecureOrigin = location.protocol === 'https:' || location.host.includes('localhost');
    if (!isSecureOrigin) {
      alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.'+'\n\nChanging protocol to HTTPS');
      location.protocol = 'HTTPS';
      //location = document.URL.replace ("http://","https://");
    }
    return false;
  }else{
    if(!navigator.mediaDevices.getUserMedia){
      alert('"navigator.mediaDevices.getUserMedia" not supported on your browser! \nUse the latest version of Chrome, Firefox or Opera');
      return false;
    }else{
      if (window.MediaRecorder == undefined) {
        alert('MediaRecorder not supported on your browser! (sorry Edge :/)\nUse the latest version of Chrome, Firefox or Opera');
        return false;
      }else{
        console.log("OK: Supporto API audio/video (MediaRecorder)")
        return true;
      }}}
}();

//Funzione principale per far partire flusso audio
rec.onclick = function(){
  if(checkCompatibility){
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(manageAudioStream)
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
          if(err.name = "NotAllowedError"){
            alert("Per utilizzare questa funzione devi autorizzare l'utilizzo del microfono!");
            location.reload();
          }});
  }}

//Gestisci stream audio
var manageAudioStream = function(stream) {
  var optionsStream = {mimeType: 'video/webm;codecs=h264'};
  var mediaRecorder = new MediaRecorder(stream,optionsStream);
  mediaRecorder.ondataavailable = handleDataAvailable;

  var buffer = [];    //buffer registrazionie

  //start rec
  mediaRecorder.start();
  rec.disabled = true;
  stop.disabled = false;
  pause.disabled = false;
  salva.disabled = false;
  update.disabled = true;
  player.style ="display:none";
  labelAzioni.style = "display:none";
  salva.style="display:none";
  update.style="display:none";

  //countdown
  var seconds = 0;
  function incrementSeconds(){
    seconds+=1;
    messageLabel.innerHTML = "<span class='badge badge-success'>...in ascolto("+seconds+"s)</span>";
  }
  var countdown = setInterval(incrementSeconds,1000);

  //beffering dello stream
  function handleDataAvailable(event) {
    if (event.data.size > 0) {
      buffer.push(event.data);
    } else {console.log("NO_DATA");}
  }

  pause.onclick = function(){
    switch (mediaRecorder.state) {
      case "recording":
        clearInterval(countdown);   //stop countdown
        mediaRecorder.pause();
        messageLabel.innerHTML = "<span class='badge badge-warning'>In pausa("+seconds+"s)</span>";
        pause.innerText = "Resume";
        break;
      case "paused":
        mediaRecorder.resume();
        countdown = setInterval(incrementSeconds,1000);
        pause.innerText ="Pause";
        break;
    }
  }

  //Stop stream
  stop.onclick = function (){
    if(mediaRecorder.state == "recording"){
      clearInterval(countdown);   //stop countdown
      mediaRecorder.stop();
    }

    //Cambiamenti UI
    stop.disabled = true;
    rec.disabled = false;
    pause.disabled = true;

    if(seconds<2){ alert("Hey, è troppo breve!");return;}

    labelAzioni.style = "display:initial";
    salva.style="display:initial";
    update.style="display:initial";
    labelAzioni.innerHTML = "<u>Azioni</u> <span class='badge badge-secondary'>Clip:"+seconds+"s</span>";
    messageLabel.innerHTML = "<span class='badge badge-danger'>Registrazione terminata</span>";
  }

  salva.onclick = function(){
    var blob = new Blob(buffer,{type:'audio/mpeg3'});     //audio/mpeg3 or video/webm

    //Salvo in un array clip e metadati tecnici
    clip = {
      //url: URL.createObjectURL(blob),
      raw: blob,
      durata: seconds,
      orario: new Date().toLocaleTimeString()
    }
    clipRegistrate.push(clip);

    //aggiorno la tabella clip
    contenutoTabClipSalvate.innerHTML = "";
    clipRegistrate.forEach(function(clip,index){
      contenutoTabClipSalvate.innerHTML += "<tr><th scope='row'>"+(index+1)+"</th><td>"+clip.durata+"s</<td><td>"+clip.orario+"</td><td><button class='btn btn-primary' onclick='replayClip("+index+")'>Play</button></td><td><button class='btn btn-link' onclick='downloadClip("+index+")'>Download</button></td></tr>";
    });

    //Cambiamenti UI
    tabClipSalvate.style= "display:initial";
    labelTabSaveClip.style = "display:initial";
    labelTabSaveClip.innerHTML = "Clip salvate<span class='badge badge-secondary'>"+clipRegistrate.length+"</span>";
    dettaglioPanel.style = "display:initial";
    update.disabled= false;
    salva.disabled = true;
  }
}
//riproduco nel player audio
function replayClip(index) {
  var clip = clipRegistrate[index];
  var urlClip = URL.createObjectURL(clip.raw);

  player.src = urlClip;
  player.style = "display:initial";
  player.play();
}

//Creazione del link di download
function downloadClip(index){
  var clip = clipRegistrate[index];
  var urlClip = URL.createObjectURL(clip.raw);

  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = urlClip;
  a.download = "clip_"+clip.durata+"s("+clip.orario.substr(0,5)+").mp4";
  a.click();
  window.URL.revokeObjectURL(urlClip);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      window.lat = position.coords.latitude;
      window.long = position.coords.longitude;

      reversePosition(window.lat,window.long);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function reversePosition(lat,long){
  addressReverse = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + long;

  $.get(addressReverse, function( data ) {
    var addressData = data.address;
    geoText.value = data.display_name;
  })
      .fail(function() {
        return "fail";
      });
}

function getLatLong(address){
  api = "https://nominatim.openstreetmap.org/?format=json&addressdetails=1&q=" + address + "&format=json&limit=1";

  $.get(api, function( data ) {
    window.lat  = data[0].lat;
    window.long = data[0].lon;
  })
      .fail(function() {
        alert("fail");
      });
}

//autocomplete localita'
geoText.oninput = function(){
  geoText.placeholder = "Inserisci località"
  var geocoder = new maptiler.Geocoder({
    input: 'txtGeoloc',
    key: 'w3QgmoHc3HOrAZj366SR'
  });

  geocoder.on('select', function(item) {
    geoText.value = item.place_name;
    getLatLong(item.place_name);
  });
};



//funzione globale per ottenere le clip registrate
window.getSaveClip = function(){
  return clipRegistrate;
};