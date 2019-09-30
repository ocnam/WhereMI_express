//const API_KEY = "AIzaSyARgIB-2zTsZcy7IoYDUWlXu0a7yQDOj9s";
//const CLIENT_ID = "840091091157-fitfqdv3e84ivdh1fj0on6s1ganlu1eo.apps.googleusercontent.com";

/* work online
const API_KEY = "AIzaSyBcTEce_U3Ho-Ua4SiUmOvo0tPDzWkuBd4";
const CLIENT_ID = "899661843536-gl9bsjpnqbjkcddj1e8167o6e6anpmrd.apps.googleusercontent.com";
 */

//CODICI funzionanti per upload YT + backup per esaurimento quote (error 403 - youtube.quota)
const API_KEY = [
  "AIzaSyAS5da-EZaeNOf8V1jRJKSfEhElyLiHeCY",
  "AIzaSyAVsSvaxjIPOft7YJeT9fS1j9ZRGCopiDU",
  "AIzaSyABpMtnPLOY12WGC9SmIHyhBevKFSjKymk"];
const CLIENT_ID = [
"954243260601-tsg6ehaeg4pma83lekjbkb3ut1ukp0cr.apps.googleusercontent.com",
"77613934136-ptfkras4muhhosos168148fkne2eertm.apps.googleusercontent.com",
"20350970616-95jl37dj5jukilg9c4egatiq3rr6h1je.apps.googleusercontent.com"];
var index = 2;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var utenteButton = document.getElementById('buttonLogin');
var update = document.getElementById('update');

/*function f() {
  alert("fai login");

}*/
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    var isSecureOrigin = location.protocol === 'https:' || location.host.includes('localhost');
    if (!isSecureOrigin) {
        location.protocol = 'HTTPS';
        console.log("Passo a HTTPS!");
    }
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        //apiKey: API_KEY[index],
        clientId: CLIENT_ID[index],
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        //alert("Sign-in successful");
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        if(utenteButton){utenteButton.onclick = handleAuthClick;}
    },  function(err) { console.error("Error loading GAPI client for API", err); });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
       
        //Elementi statici presenti solo nel editor
        if(utenteButton||update){
          utenteButton.style.display='none';
          update.disabled=false;
        }
        //document.getElementById("update").display = 'initial';
        //document.getElementById("update").disabled = false;
    }
    else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        if(utenteButton||update){
          utenteButton.style.display='none';
          update.disabled=true;
        } 
       
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    if(gapi.auth2.getAuthInstance().isSignedIn.get())
    {
        alert("Sei già loggato");
        if(utenteButton||update){
          utenteButton.style.display='none';
          update.disabled=false;
        } 
    }
    else{
        gapi.auth2.getAuthInstance().signIn();
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/*
  // user profile data
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var name = progile.getName();
    // console.log('ID: ' + profile.getId());
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail());
  }
*/

window.uploadToYoutube =  async function(urlClip,titolo,metadati,descrizioneClip){
    //Ottieni clip video da URL (hosted cloudinary.com)
    let response = await fetch(urlClip);
    var rawData = await response.blob();
    rawData.type = 'video/mp4';

    console.log("Preparo invio dati a Youtube (API)",rawData);
    uploadRawFile(rawData,titolo,metadati,descrizioneClip);
    return true;
}

async function uploadRawFile (videoclip,titolo,metadatiClip,descrizioneClip) {
  var token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  var params = {
    snippet: {
        categoryId: 27,
        title: titolo,
        description: metadatiClip + "%%%" + descrizioneClip,
        tags: [metadatiClip]
    },
    status: {
        privacyStatus: 'public',
        embeddable: true
    }
  };

  //Building request
  var request = new FormData();
  var metadatiYoutube = new Blob([JSON.stringify(params)], {type: 'application/json'});
  request.append('video', metadatiYoutube);
  request.append('mediaBody', videoclip);

  var okUpload;
  //Upload via API youtube (POST)
  $.ajax({
    method: 'POST',
    url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token=' + encodeURIComponent(token) + '&part=snippet,status',
    data: request,
    cache: false,
    contentType: false,
    processData: false,
  })
    .done(function(response) {
      console.log("Caricamento completato! YouTube:",response)
      return true;
    })
    .fail(function(response){
      var errors = response.responseJSON.error.errors[0];
      console.log("Errore API per Upload YT!",errors);
      return false;
    });
}
