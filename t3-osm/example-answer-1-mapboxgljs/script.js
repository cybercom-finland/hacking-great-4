
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
    var myMap = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v10',
	center: [myMapApp.lon, myMapApp.lat],
	zoom: myMapApp.zoom,
    });

    myMap.on('load', function () {	
	showBusStops(myMap);
	getVisitTampereEvents(myMap);
	createBusIcon();
	createBusLayer(myMap);
	setInterval(showBuses.bind(null, myMap), 1000);

    });
});

function showBusStops(myMap) {

    $.getJSON("data/Tampere_bus_stops.geojson", function (geojsonData) {
	console.log(geojsonData);

	//
	// See: https://www.mapbox.com/mapbox-gl-js/example/geojson-markers/
	//
	myMap.addLayer({"id": "points",
		       "type": "symbol",
			"source": {
			    "type": "geojson",
			    "data": geojsonData
			},
			layout: {
			    "icon-image": "bus-11" // https://www.mapbox.com/maki-icons/
			}
		       });
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

	//
	// See: https://www.mapbox.com/blog/data-driven-style-remote-sources/
	//
	
	var geojsonData = {
	    type: 'FeatureCollection',
	    features: []
	};
	
	for (var i = 0; i < jsonData.length; i++) {
	    geojsonData.features.push({
		type: 'Feature',
		properties: {
		    title: jsonData[i].title,
		    image: jsonData[i].image,
		    description: jsonData[i].description
		},
		geometry: {
		    type: 'Point',
		    coordinates: [ jsonData[i].location[1], jsonData[i].location[0] ]
		}
	    });
	}

	//
	// See https://www.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
	//
	myMap.addLayer({"id": "events",
			"type": "circle",
			"source": {
			    "type": "geojson",
			    "data": geojsonData
			},
			"paint": {
			    "circle-radius": 20,
			    "circle-color": "#DF01A5",
			    "circle-blur": 0.5
			}
		       });

	//
	// Show a popup on map click if there is a feature on the location and
	// the feature is on the events layer
	// See: https://www.mapbox.com/mapbox-gl-js/example/popup-on-click/
	//
	myMap.on('click', function (e) {
	    var features = myMap.queryRenderedFeatures(e.point, { layers: ['events'] });
	    
	    if (!features.length) {
		return;
	    }
	    
	    var feature = features[0];

	    console.log(feature.properties.image);
	    var image = JSON.parse(feature.properties.image);
	    
	    var html = "<div style='max-width: 200px;'><h3>" + feature.properties.title + "</h3>" +
		"<img style='margin:10px;width:100px;' align='left' src='" +
		image.src + "'>" + "<span>" +
		feature.properties.description + "</span></div>"; 
	    
	    // Populate the popup and set its coordinates
	    // based on the feature found.
	    var popup = new mapboxgl.Popup()
		.setLngLat(feature.geometry.coordinates)
		.setHTML(html)
		.addTo(myMap);
	});
	// Show that a feature is clickable by changing the mouse cursor
	myMap.on('mousemove', function (e) {
	    var features = myMap.queryRenderedFeatures(e.point, { layers: ['events'] });
	    myMap.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
	});
    });
}

function createBusIcon() {

    //
    // See https://www.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
    // or https://www.mapbox.com/maki-icons/
    // or 
}

function createBusLayer(myMap) {
    myMap.addSource('busses', { type: 'geojson', data: {
        type: 'FeatureCollection',
        features: []
    }});
    myMap.addLayer({
	"id": "busses",
	"type": "symbol",
	"source": "busses",
	"layout": {
	    "icon-image": "bus-15"
	}
    });
}

function showBuses(myMap) {

    //
    // See https://www.mapbox.com/mapbox-gl-js/example/live-update-feature/
    //
    
    var geojsonData = {
	type: 'FeatureCollection',
	features: []
    }
    
    $.getJSON('http://data.itsfactory.fi/siriaccess/vm/json', function (data) {
	var journeys = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
	console.log(journeys);
	for (var i = 0; i < journeys.length; i++) {

	    var location = [journeys[i].MonitoredVehicleJourney.VehicleLocation.Longitude, journeys[i].MonitoredVehicleJourney.VehicleLocation.Latitude];
	    
	    geojsonData.features.push({
		type: 'Feature',
		geometry: {
		    type: 'Point',
		    coordinates: location
		}
	    });
	}

	myMap.getSource('busses').setData(geojsonData);
    });
}
