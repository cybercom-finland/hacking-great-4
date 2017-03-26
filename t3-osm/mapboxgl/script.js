
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

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXJub21hIiwiYSI6ImJHZGxfV2cifQ.IA3pNhzGXg6RH9guFP-XrQ';
    var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/outdoors-v10',
	center: [myMapApp.lon, myMapApp.lat],
	zoom: myMapApp.zoom,
    });
});

