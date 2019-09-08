var map = L.map('map').fitWorld();
var exmarker;


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

// add location via browser geolocation

function displayLocation(position) {
    console.log('position', position);
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //L.marker([lat, lng]).addTo(map);
    console.log('{longitude:' + lng + ', latitude:' + lat + '}');
    map.setView([lat, lng], 16);
    exmarker=L.marker([lat, lng]).addTo(map)
        .bindPopup('TU SEI QUI!')
        .openPopup();
}

navigator.geolocation.getCurrentPosition(displayLocation);

var searchControl = L.esri.Geocoding.geosearch().addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
        if (newMarker) {
            map.removeLayer(newMarker);
        }

    }
});

// indications on maps
/*   https://github.com/skedgo/tripkit-leaflet
let options ={
    "mapId" : "map",
    "googleTile": true,
    "floatPanel": false,
    "tripgoApiKey": "ba321828182b6531d9f5dd03c5055f4b"
}
L.tripgoRouting.mapLayer.initialize(options);

 */
// indications on maps
var control = L.Routing.control(L.extend(window.lrmConfig, {

    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    reverseWaypoints: true,
    showAlternatives: true,
    altLineOptions: {
        styles: [
            {color: 'black', opacity: 0.15, weight: 9},
            {color: 'white', opacity: 0.8, weight: 6},
            {color: 'blue', opacity: 0.5, weight: 2}
        ]
    }
})).addTo(map);

control.window.hidden;

L.Routing.errorControl(control).addTo(map);

//Draggable marker
var newMarker;

// set the popup information: latlng and address
function addPopup (marker) {
    // OSM Nomitatim documentation: http://wiki.openstreetmap.org/wiki/Nominatim
    var jsonQuery = "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + marker.getLatLng().lat + "&lon=" + marker.getLatLng().lng + "&zoom=18&addressdetails=1";

    $.getJSON(jsonQuery).done( function (result_data) {
        console.log(result_data);

        var road;

        if(result_data.address.road) {
            road = result_data.address.road;
        }
        else if (result_data.address.pedestrian) {
            road = result_data.address.pedestrian;
        }
        else {
            road = "No definido";
        }

        var popup_text = 	"<b>Latlng:</b> " + marker.getLatLng().lat + ", " + marker.getLatLng().lng +
            "</br><b>Road:</b> " + road + ", " + result_data.address.house_number +
            "</br><b>City:</b> " + result_data.address.city +
            "</br><b>Postal Code:</b> " + result_data.address.postcode;

        marker.bindPopup(popup_text).openPopup();
        map.removeLayer(exmarker);

    });

}


// add new marker on click
map.on('click', function(e) {

    // removes old marker
    if (newMarker) {
        map.removeLayer(newMarker);
    }

    // add draggable marker
    newMarker = L.marker([e.latlng.lat, e.latlng.lng], {draggable: true})
        .addTo(map)
        .on('dragend', function(e) {

            // add popup information on dragged marker
            addPopup(newMarker);
        });

    // add popup information on new marker
    addPopup(newMarker);

});


