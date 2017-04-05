
angular.module('starter').factory('OpenDataService', [ '$http', function($http) {
    var openDataObj = {

	getBusStops: function(callback) {
	    console.log("in show bus stops");
	    $http.get('data/Tampere_bus_stops.geojson').success(function(geojsonData) {
		console.log(geojsonData);

		callback(geojsonData);
	    });
	    
	},

	getVisitTampereEvents: function(callback) {

	    var startDateTimeInMilliseconds = Date.now(); // Current date and time
	    var endDateTimeInMilliseconds = startDateTimeInMilliseconds + 86400000; // + one day
	    console.log(startDateTimeInMilliseconds);
	    console.log(endDateTimeInMilliseconds);
	    
	    $http({url: "https://visittampere.fi/api/search",
		   method: "GET",
		   params: {
		       calendar: true,
		       start_datetime: startDateTimeInMilliseconds,
		       end_datetime: endDateTimeInMilliseconds,
		       limit: 10,
		       offset: 0,
		       type: "event"
		   }
		  }).success(function(jsonData) {
		      console.log(jsonData);
		      
		      callback(jsonData);
		  });
	    
	},
	getBusses: function(callback) {
	    $http.get('http://data.itsfactory.fi/siriaccess/vm/json').success(function(data) {
		console.log(data);

		callback(data);
	    });
	}
    };
    
    return openDataObj;
}]);
