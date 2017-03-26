
var myMapApp = {
    lat: 61.5016,
    lon: 23.7337,
    zoom: 12
}

$( document ).ready(function() {
    console.log( "ready!" );

    //
    // Put your cool code here!
    //

    var myMap = L.map('map').setView([myMapApp.lat, myMapApp.lon], myMapApp.zoom);
    var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
	maxZoom: 19
    });
    osmLayer.addTo(myMap);
});

