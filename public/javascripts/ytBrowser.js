function handleYTClientLoad() {
    gapi.load("client", loadClient);
}

//var mio_array = new Array();
//var i;
var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function loadClient() {
    gapi.client.setApiKey("AIzaSyBB87_JyTcyEldzmqN83ZO_e4Tfps5Dfzg");
    return gapi.client.load("youtube","v3", function () {
        console.log("GAPI client loaded for API");
        var results = gapi.client.youtube.search.list({
            part:"id,snippet",
            "maxResults": 50,
            "order": "date",
            "q": "8FPHFC5J+7W",
            "type": "video"
        });
        results.execute(function (response) {
            console.log(response);
            var arrayIniziale = response.result.items;

            //for(var y=0; y<arrayIniziale.length; y++){
            //     mio_array[y]=arrayIniziale[y].id.videoId;
            //}

            for(var i=0; i<arrayIniziale.length; i++)
            {
                var varVideoId=arrayIniziale[i].id.videoId;

                console.log(varVideoId);
                var title = arrayIniziale[i].snippet.title;
                console.log(title);
                var titleFinal=title.split(":")[0];
                console.log(titleFinal);
                //description video
                var olc = arrayIniziale[i].snippet.description;
                var olcFinal = olc.split(":")[0];
                var coordinate =OpenLocationCode.decode(olcFinal);
                console.log(coordinate);
                var purpose = arrayIniziale[i].snippet.description;
                var purposeFinal = purpose.split(":")[1];
                console.log(purposeFinal);
                var language = arrayIniziale[i].snippet.description;
                var languageFinal = language.split(":")[2];
                switch (languageFinal) { //(ita, eng, deu, fra, esp,
                    case "ita" :
                        languageFinal="Italian";
                        break;
                    case "eng" :
                        languageFinal="English";
                        break;
                    case "deu" :
                        languageFinal="German";
                        break;
                    case "fra" :
                        languageFinal="French";
                        break;
                    case "esp" :
                        languageFinal="Spanish";
                        break;
                    case "it" :
                        languageFinal="Italian";
                        break;
                    case "en" :
                        languageFinal="English";
                        break;
                    case "de" :
                        languageFinal="German";
                        break;
                    case "fr" :
                        languageFinal="French";
                        break;
                    case "es" :
                        languageFinal="Spanish";
                        break;
                }
                console.log(languageFinal);
                var content = arrayIniziale[i].snippet.description;
                var contentFinal = content.split(":")[3];
                switch (contentFinal) {
                    case "*":   // da togliere poi
                        contentFinal="undefined";
                        break;
                    case "none":
                        contentFinal = "None";
                        break;
                    case "nat":
                        contentFinal = "Nature";
                        break;
                    case "art":
                        contentFinal = "Art";
                        break;
                    case "his":
                        contentFinal = "History";
                        break;
                    case "flk":
                        contentFinal = "Folklore";
                        break;
                    case "mod":
                        contentFinal = "Modern culture";
                        break;
                    case "rel":
                        contentFinal = "Religion";
                        break;
                    case "cui":
                        contentFinal = "Cooking and drinks";
                        break;
                    case "spo":
                        contentFinal = "Sport";
                        break;
                    case "mus":
                        contentFinal = "Music";
                        break;
                    case "mov":
                        contentFinal = "Film";
                        break;
                    case "fas":
                        contentFinal = "Fashion";
                        break;
                    case "shp":
                        contentFinal = "Shopping";
                        break;
                    case "tec":
                        contentFinal = "Technology";
                        break;
                    case "pop":
                        contentFinal = "Cult. pop. and gossip";
                        break;
                    case "prs":
                        contentFinal = "Personal experiences";
                        break;
                    case "oth":
                        contentFinal = "Other";
                        break;
                }
                console.log(contentFinal);
                var audiance = arrayIniziale[i].snippet.description;
                var audianceFinal = audiance.split(":")[4];
                switch(audianceFinal) {
                    case "*":   // da togliere poi
                        audianceFinal="undefined";
                        break;
                    case "gen":
                        audianceFinal = "General pubblic";
                        break;
                    case "pre":
                        audianceFinal = "Pre-school";
                        break;
                    case "elm":
                        audianceFinal = "Primary school";
                        break;
                    case "mid":
                        audianceFinal = "Secondary school";
                        break;
                    case "scl":
                        audianceFinal = "Sector specialists";
                        break;
                }
                console.log(audianceFinal);

                var detail = arrayIniziale[i].snippet.description;
                var det = detail.split("%%%")[0];
                var detailFinal=det.split(":")[5];
               // console.log(det);
               // var det = detailFinal.split("%%%")[1];
               // var det=detailFinal.substr(1,2);
               // console.log(det);
               switch(detailFinal) {
                    case "*":   // da togliere poi
                        detailFinal="undefined";
                        break;
                    case "1":
                        detailFinal = "Light";
                        break;
                    case "2":
                        detailFinal = "Medium";
                        break;
                    case "3":
                        detailFinal = "Depth";
                        break;
                }
                console.log(detailFinal);

                var description = arrayIniziale[i].snippet.description;
                var descriptionFinal = description.split("%%%")[1];
                console.log(descriptionFinal);

                var markerPopup =` 
                <div id="${varVideoId}mappa" class="card" style="width:100%; height: 100%; ">
                    <div class="card-body">
                        <a class="card-title" href="https://www.google.com/search?q=+${titleFinal}" style="color: black; text-align: center; font-size: large"><strong>${titleFinal}</strong></a>
                          <!--  <div class="card-footer text-center">
                                   <button title="Previous"><i class="fa fa-fast-backward"></i></button>
                                   <button id="var" title="Play"><i class="fa fa-play"></i></button>
                                   <button class="pause" title="Pause"><i class="fa fa-pause"></i></button>
                                   <button title="Next"><i class="fa fa-fast-forward"></i></button>
                            </div> -->
                     </div>
                            <div id="${varVideoId}mappa" class="card-footer text-center">
                                <a href="#${varVideoId}link"><h5>Vai alla clip</h5></a>
                             </div>
                </div> `;

                marker = new L.marker([coordinate.latitudeCenter, coordinate.longitudeCenter], {icon: greenIcon})
                    .bindPopup(markerPopup)
                    .addTo(map);

               $("#clipYT").append(`
                   <div id="${varVideoId}link" class= "col-md-3 mb-2">
                        <div class="card h-100" > <!--h-100 setta la stessa altezza a tutte le card -->
                             <div class="card-body"  style="background-color: #34456a;">
                                 <a class="card-title" style="color: white" href="https://www.google.com/search?q=+${titleFinal}"><strong>${titleFinal}</strong></a>
                                 <p class="card-text" id="description" style="color: white;">${descriptionFinal}</p>
                             </div>
                             
                             <ul class="list-group list-group-flush">
                                 <li class="list-group-item"><strong>Purpose: </strong>${purposeFinal}</li>
                                 <li class="list-group-item"><strong>Language: </strong>${languageFinal}</li>
                                 <li class="list-group-item"><strong>Content: </strong>${contentFinal}</li>
                                 <li class="list-group-item"><strong>Audiance: </strong>${audianceFinal}</li>
                                 <li class="list-group-item"><strong>Detail: </strong>${detailFinal}</li>
                             </ul>
                             <div class="card-footer text-center">
                                  <!-- <button class="previous btn" title="Previous"><i class="fa fa-backward" id="previous"></i></button>
                                   <button id="${varVideoId}" class="btn" title="Play"><i class="fa fa-play-circle"></i></button>
                                   <button class="pause btn" title="Pause"><i class="fa fa-pause-circle"></i></button>
                                   <button id="next" class="next btn" title="Next"><i class="fa fa-forward"></i></button> -->
                                   <button class="previous"><i class="fa fa-backward"></i></button>
                                   <button id="${varVideoId}" title="Play"><i class="fa fa-play"></i></button>
                                   <button class="pause" title="Pause"><i class="fa fa-pause"></i></button>
                                   <button class="next" title="Next"><i class="fa fa-fast-forward"></i></button>
                                   <a id="${varVideoId}mappa" class="float-right"><i class="fas fa-map-marked-alt fa-2x"></i></a>
                             </div>                                   
                        </div>
                   </div>
                   <script>
                            $("#${varVideoId}").click(function(){
                                player.loadVideoById(this.id);
                            });
                            
                             $(".pause").click(function(){
                                player.pauseVideo();
                            });
                             
                             $(".previous").click(function() {
                                console.log("previous");
                                player.previousVideo();
                               // player.playVideo();
                            });

                            $(".next").click(function() {
                               console.log("next");
                               player.nextVideo();
                               //player.playVideo();
                             });
                             
                            $("#${varVideoId}mappa").on("click", function(event){
                                var $theId = "${varVideoId}mappa";
                                $.each(map._layers, function(i, item){
                                    if(this.options.myCustomId == $theId){
                                        this.openPopup();
                                        map.panTo(this._latlng)
                                    }
                              /* $.each(map._layers, function(i, item){
                                 if(this.options.myCustomId == "${varVideoId}mappa"){
                                    this.openPopup();
                                     map.flyTo(this._latlng)
                                 }*/
                                });
                                 });
                            
                             /*$("#next").click(function(){
                                 var next= mio_array[Math.random()*50];
                                player.loadVideoById(next.id);
                            });*/
                            
                           
                    </script>
               ` );
            }//end for

        });

    });




}

