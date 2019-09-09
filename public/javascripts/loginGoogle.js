//const API_KEY = "AIzaSyARgIB-2zTsZcy7IoYDUWlXu0a7yQDOj9s";
//const CLIENT_ID = "840091091157-fitfqdv3e84ivdh1fj0on6s1ganlu1eo.apps.googleusercontent.com";

//CODICI funzionanti per upload YT
const API_KEY = "AIzaSyAS5da-EZaeNOf8V1jRJKSfEhElyLiHeCY";
const CLIENT_ID = "954243260601-tsg6ehaeg4pma83lekjbkb3ut1ukp0cr.apps.googleusercontent.com";

/* work online
const API_KEY = "AIzaSyBcTEce_U3Ho-Ua4SiUmOvo0tPDzWkuBd4";
const CLIENT_ID = "899661843536-gl9bsjpnqbjkcddj1e8167o6e6anpmrd.apps.googleusercontent.com";
 */

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/youtube";

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
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
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
        utenteButton.onclick =handleAuthClick;
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
        utenteButton.style.display='none';
        //document.getElementById("update").display = 'initial';
        //document.getElementById("update").disabled = false;
        update.disabled=false;
    }
    else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        utenteButton.style.display='none';

        update.disabled=true;
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    if(gapi.auth2.getAuthInstance().isSignedIn.get())
    {
        alert("Sei già loggato");
        utenteButton.style.display='none';
        update.disabled=false;
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

window.uploadVideo = function uploadVideoYoutube(urlClip,titolo,metadata) {
    videoClip = createFileFromUrl(urlClip);     //ottengo i dati grezzi del video

    gapi.client.load('youtube', 'v3',function(){
        gapi.client.youtube.videos.insert({
            part: "snippet,status,id", 
            resource: {
                snippet: { 
                    categoryId: "22",
                    title: titolo,
                    description: metadata,   
                },
                status: { 
                    privacyStatus: 'public', 
                    embeddable: true  
                }, 
                media: { body: videoClip}
            }
        })
            .then(function(response) {
                console.log("ok");
             },function(err) {
                console.log("Errore Youtube API", err.result.error.errors);
             });

   });

    /* OLD VERSION
    var toSend = new FormData();
    var params = new Blob([ JSON.stringify(youtubeParameters) ], { "type" : "application/json" });
    toSend.append("video", params);
    toSend.append("mediaBody", clipVideo);

    gapi.client.request({
        'path': '/youtube/v3/videos'+ "?part=snippet,status",
        'method': 'POST',
        'body': toSend
      }).then(function(response) {
        console.log(response.result);
       // writeResponse(resp.result);
      });*/
}

async function createFileFromUrl(url){
    let response = await fetch(url);
    let data = await response.blob();
    let file = new File([data], "test.mp4", {type: 'video/mp4'});

    return file;
  }