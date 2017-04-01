
var myMapApp = {
    lat: 61.5016,
    lon: 23.7337,
    zoom: 12,
    busses: [],
    busIcon: null
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
    
    showBusStops(myMap);
    getVisitTampereEvents(myMap);
    createBusIcon();
    setInterval(showBuses.bind(null, myMap), 1000);
});

function showBusStops(myMap) {

    $.getJSON("data/Tampere_bus_stops.geojson", function (geojsonData) {
	console.log(geojsonData);
	var geoJsonLayer = L.geoJSON(geojsonData);
	var markers = L.markerClusterGroup();
	markers.addLayer(geoJsonLayer);
	myMap.addLayer(markers);
    });
    
    // Get features from the remote server
    /*$.getJSON("http://opendata.navici.com/tampere/opendata/ows", {
	service: "WFS",
	version: "2.0.0",
	request: "GetFeature",
	typeName: "opendata:BUSSIPYSAKIT",
	outputFormat: "json",
	srsName: "EPSG:4326"
    }, function (geojsonData) {

	console.log(geojsonData);
	L.geoJSON(geojsonData).addTo(myMap);
	
    });*/
}

function getVisitTampereEvents(myMap) {
    var startDateTimeInMilliseconds = Date.now(); // Current date and time
    var endDateTimeInMilliseconds = startDateTimeInMilliseconds + 86400000; // + one day
    console.log(startDateTimeInMilliseconds);
    console.log(endDateTimeInMilliseconds);

    $.getJSON("https://visittampere.fi/api/search", {
	calendar: true,
	start_datetime: startDateTimeInMilliseconds,
	end_datetime: endDateTimeInMilliseconds,
	limit: 10,
	offset: 0,
	type: "event"
    }, function (jsonData) {
	console.log(jsonData);
	for (var i = 0; i < jsonData.length; i++) {
	    var circle = L.circle([jsonData[i].location[0], jsonData[i].location[1]], {
		color: 'red',
		fillColor: '#DF01A5',
		fillOpacity: 0.5,
		radius: 100
	    });
	    circle.bindPopup("<h3>" + jsonData[i].title + "</h3>" +
			     "<img style='margin:10px;width:100px;' align='left' src='" + jsonData[i].image.src + "'>" +
			    "<span>" + jsonData[i].description + "</span>");
	    circle.addTo(myMap);
	}
    });
}

function createBusIcon() {
    myMapApp.busIcon = L.icon({
	iconUrl: 'img/bus.png',
	iconSize: [64, 64],
	iconAnchor: [32, 32],
	popupAnchor: [64, 32]
    });
}

function showBuses(myMap) {
    $.getJSON('http://data.itsfactory.fi/siriaccess/vm/json', function (data) {
	var journeys = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
	console.log(journeys);
	for (var i = 0; i < journeys.length; i++) {
	    var found = false;
	    var busses = myMapApp.busses;
	    for (var j = 0; j < busses.length; j++) {
		if (journeys[i].MonitoredVehicleJourney.VehicleRef.value == busses[j].journey.MonitoredVehicleJourney.VehicleRef.value) {
		    found = true;
		    busses[j].marker.setLatLng([journeys[i].MonitoredVehicleJourney.VehicleLocation.Latitude, journeys[i].MonitoredVehicleJourney.VehicleLocation.Longitude]);
		    break;
		}
	    }
	    if (!found) {
		var location = [journeys[i].MonitoredVehicleJourney.VehicleLocation.Latitude, journeys[i].MonitoredVehicleJourney.VehicleLocation.Longitude];
		var marker = L.marker(location, {icon: myMapApp.busIcon});
		
		var busData = {
		    journey: journeys[i],
		    marker: marker
		};

		marker.addTo(myMap);
		myMapApp.busses.push(busData);
	    }
	}
    });
}
