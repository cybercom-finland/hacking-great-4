angular.module('starter').controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    'OpenDataService',
    'leafletData',
    'leafletMapEvents',
    'leafletMarkerEvents',
    '$compile',
    function(
	$scope,
	$cordovaGeolocation,
	$stateParams,
	$ionicModal,
	$ionicPopup,
	LocationsService,
	InstructionsService,
	OpenDataService,
	leafletData,
	leafletMapEvents,
	leafletMarkerEvents,
	$compile
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.locations = LocationsService.savedLocations;
        $scope.newLocation;

        /*if(!InstructionsService.instructions.newLocations.seen) {

          var instructionsPopup = $ionicPopup.alert({
            title: 'Add Locations',
            template: InstructionsService.instructions.newLocations.text
          });
          instructionsPopup.then(function(res) {
            InstructionsService.instructions.newLocations.seen = true;
            });

        }*/

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
		enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.goTo(0);

	  angular.extend($scope, {
	      markers: {}
	  });

	  leafletData.getMap().then(function(map) {
	      OpenDataService.getBusStops(function(geojsonData) {
		  //console.log(L);
		  var geoJsonLayer = L.geoJSON(geojsonData);
		  //map.addLayer(geoJsonLayer);
		  var markers = L.markerClusterGroup();
		  markers.addLayer(geoJsonLayer);
		  map.addLayer(markers);
	      });

	      OpenDataService.getVisitTampereEvents(function (jsonData) {
		  for (var i = 0; i < jsonData.length; i++) {
		      var circle = L.circle([jsonData[i].location[0], jsonData[i].location[1]], {
			  color: 'red',
			  fillColor: '#DF01A5',
			  fillOpacity: 0.5,
			  radius: 100
		      });
		      var html = "<h3>" + jsonData[i].title + "</h3>" +
			  "<img style='margin:10px;width:100px;' align='left' src='" + jsonData[i].image.src + "'>" +
			  "<span>" + jsonData[i].description + "</span>";
		      
		      circle.bindPopup(html);
		      circle.addTo(map);
		  }
	      });

	      var busIcon = L.icon({
		  iconUrl: 'img/bus.png',
		  iconSize: [64, 64],
		  iconAnchor: [32, 32],
		  popupAnchor: [64, 32]
	      });

	      $scope.busses = [];
	      
	      $scope.showBuses = function(map) {
		  OpenDataService.getBusses(function (data) {
		      var journeys = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;
		      console.log(journeys);
		      for (var i = 0; i < journeys.length; i++) {
			  var found = false;
			  var busses = $scope.busses;
			  for (var j = 0; j < busses.length; j++) {
			      if (journeys[i].MonitoredVehicleJourney.VehicleRef.value == busses[j].journey.MonitoredVehicleJourney.VehicleRef.value) {
				  found = true;
				  busses[j].marker.setLatLng([journeys[i].MonitoredVehicleJourney.VehicleLocation.Latitude, journeys[i].MonitoredVehicleJourney.VehicleLocation.Longitude]);
				  break;
			      }
			  }
			  if (!found) {
			      var location = [journeys[i].MonitoredVehicleJourney.VehicleLocation.Latitude, journeys[i].MonitoredVehicleJourney.VehicleLocation.Longitude];
			      var marker = L.marker(location, {icon: busIcon});

			      var busData = {
				  journey: journeys[i],
				  marker: marker
			      };

			      marker.addTo(map);
			      $scope.busses.push(busData);
			  }
		      }
		  });
	      }
	      
	      setInterval($scope.showBuses.bind(null, map), 1000);
	  });
      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(LocationsService.savedLocations.length - 1);
      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function(locationKey) {

        var location = LocationsService.savedLocations[locationKey];

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };

        /*$scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: location.name,
          focus: true,
          draggable: false
        };*/

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };	
    }]);
