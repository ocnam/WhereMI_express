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

var lang_filter,audience_filter,details_filter,clipLanguagePreference;

document.getElementById('btn_Filter').onclick = function(){
    var selectLang = document.getElementById("selectLingua");
    var selectAudience = document.getElementById("selectAudience");
    var selectDetails = document.getElementById("selectDetail");
    
    lang_filter = selectLang.options[selectLang.selectedIndex].value;
    audience_filter = selectAudience.options[selectAudience.selectedIndex].value;
    details_filter = selectDetails.options[selectDetails.selectedIndex].value;

    console.log("Dovrei filtrare per:"+ lang_filter +" | "+ audience_filter +" | "+ details_filter);
    loadClient();       //aggiorna lista clip
}

function getLangPref(itemSelected){
    clipLanguagePreference = itemSelected.value;
    alert("Preferenza lingua cambiata in:" + itemSelected.innerText + "("+clipLanguagePreference+")");

    if(clipLanguagePreference == "none"){
        clipLanguagePreference = undefined; 
    }
    loadClient();       //aggiorna lista clip
}

function loadClient() {
    //gapi.client.setApiKey("AIzaSyBB87_JyTcyEldzmqN83ZO_e4Tfps5Dfzg");
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

            $("#clipYT").html("");      //pulisco la lista
            var countFilterItem = 0;

            for(var i=0; i<arrayIniziale.length; i++)
            {
                var varVideoId=arrayIniziale[i].id.videoId;
                var varNextVideoid,varPrevVideoId;

                if(i != (arrayIniziale.length -1)){     //tranne ultimo video
                    varNextVideoid = arrayIniziale[i+1].id.videoId;
                }else{
                    varNextVideoid = arrayIniziale[0].id.videoId;       //ritorno al primo
                }

                if (i != 0){            //tranne primo video
                    varPrevVideoId = arrayIniziale[i-1].id.videoId;
                }else{
                    var indexLast = arrayIniziale.length-1; //ritorno all'ultimo
                    varPrevVideoId = arrayIniziale[indexLast].id.videoId;    
                }

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

                var filter_flag = -1;
                var AudianceClip = arrayIniziale[i].snippet.description.split(":")[4];
                var languageClip = arrayIniziale[i].snippet.description.split(":")[2];
                var detailClip = arrayIniziale[i].snippet.description.split("%%%")[0].split(":")[5];

                if(lang_filter || audience_filter || details_filter){
                    var matchLang = lang_filter.includes(languageClip);     //per compatibilità (ita e it) 
                    var matchAudience = (AudianceClip == AudianceClip);
                    var matchDetail = (detailClip == details_filter);

                    if(matchLang == true && matchAudience == true && matchDetail == true){
                        filter_flag = 1;
                        countFilterItem++;
                    }else{
                        filter_flag = 0;
                    }
                }

                if(clipLanguagePreference != undefined){
                    if(filter_flag = -1){
                        if(clipLanguagePreference.includes(languageClip)){
                            filter_flag = 1;
                            countFilterItem++;
                        }else{
                            filter_flag = 0;
                        }
                    }
                }

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

                marker = new L.marker([coordinate.latitudeCenter, coordinate.longitudeCenter], {icon: greenIcon, myCustomId: varVideoId + "mappa"})
                    .bindPopup(markerPopup)
                    .addTo(map);

            if(filter_flag == -1 || filter_flag == 1){
               $("#clipYT").append(`
                   <div id="${varVideoId}link" class= "col-md-3 mb-2">
                        <div class="card h-100" > <!--h-100 setta la stessa altezza a tutte le card -->
                             <div class="card-body" id="${varVideoId}header" style="background-color: #34456a;">
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
                                   <button title="Previus" class="${varPrevVideoId} previus"><i class="fa fa-backward"></i></button>
                                   <button title="Play"  class="${varVideoId}"><i class="fa fa-play"></i></button>
                                   <button title="Pause" class="pause" ><i class="fa fa-pause"></i></button>
                                   <button title="Next"  class="${varNextVideoid} next"><i class="fa fa-fast-forward"></i></button>
                                   <a id="${varVideoId}mappa" href="#map" class="float-right"><i class="fas fa-map-marked-alt fa-2x"></i></a>
                             </div>                                   
                        </div>
                   </div>
                   <script>
                        $(".${varVideoId}").click(function(){
                            var idVideo = this.className.split(" ")[0];
                            var action = this.className.split(" ")[1];
                           
                            console.log("RIPRODUCO: " + idVideo);
                            
                            if(action!=undefined){
                                console.log("RIPRODUCO_"+action+": " + idVideo);
                            }
                            
                            //Player YT
                            player.clearVideo();
                            player.loadVideoById(idVideo);
                            player.playVideo();

                            //Cambiamenti UI header
                            $("#${varVideoId}header").css("background-color","#4CAF50");
                            $("#${varPrevVideoId}header").css("background-color","#34456a");
                            $("#${varNextVideoid}header").css("background-color","#34456a");
                            $("#${varVideoId}header").css("transform","scale(1.1)");
                            $("#${varNextVideoid}header").css("transform","scale(1.0)");
                            $("#${varPrevVideoId}header").css("transform","scale(1.0)");
                        });
           
                        $(".pause").click(function(){
                            player.pauseVideo();
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
            }
            }//end for
            if(filter_flag != -1){
                alert("Elementi filtrati("+ countFilterItem+"/50)");
            }
        });

    });
}
/*
function nextVideo(title) {

    console.log(title+"bbbbbbbbb");
    for (var i = 0; i < arr.length; i++) {
        var varVideoId = arr[i].id.videoId;

        //console.log(varVideoId);
        var tit = arr[i].snippet.title;
        //console.log(tit);
        var titleFin = tit.split(":")[0];
        console.log(titleFin);
        if(titleFin == title)
        {
            player.loadVideoById(varVideoId);
        }
        // nextVideo(${titleFinal});
        //player.nextVideo();
        //player.playVideo();
    }
}*/
