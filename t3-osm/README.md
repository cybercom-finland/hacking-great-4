
# Mobile maps with OpenStreetMap

A mobile application that uses OpenStreetMap will be built. Also, some open data other than the map itself will be  retrieved and shown on the map. You can choose the data freely but also  some ready to choose options will be given.

## Open data

Suggested open location data:
+ City of Tampere
  + http://www.tampere.fi/tampereen-kaupunki/tietoa-tampereesta/avoin-data.html
  + Bus stops: http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=17&alasivu=1&vapaasana=bussipys%C3%A4kit
+ ITS Factory
  + http://wiki.itsfactory.fi/index.php/Main_Page
  + Real-time bus locations and more: http://wiki.itsfactory.fi/index.php/Tampere_Public_Transport_SIRI_Interface_(Realtime_JSON_at_data.itsfactory.fi)
+ Visit Tampere
  + https://visittampere.fi/api-docs/
  + Events: https://visittampere.fi/search?type=event

More options (many require small server component implementation):
+ [Gispo - Avoimen Datan WMS- Ja WFS-Karttapalveluiden Osoitteita](https://gispohelp.zendesk.com/hc/fi/articles/208159815-Avoimen-datan-WMS-ja-WFS-karttapalveluiden-osoitteita)
+ [Paikkatietoikkuna - Avoin paikkatieto](http://www.paikkatietoikkuna.fi/web/fi/avoin-paikkatieto)
+ [Spatineo Directory](http://directory.spatineo.com/)

## Preparing to the #HackingGreat 4 @ Cybercom event

Depeding on your interests you should have [Node.js](https://nodejs.org/) (+ npm + serve) or [ionic](http://ionicframework.com/) framework installed.

Node.js allows you to build more traditional web application that can be viewed also on a regular desktop browser. The ionic framework allows you to build a natively wrapped mobile application that can be installed to an Android or iOS device provided you have followed the instructions at the http://ionicframework.com/docs/v2/intro/deploying/ before this event.

Node.js can be installed to the Ubuntu 16.04 with the following commands:
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
npm install -g serve
```

Depending on your skills with web technologies you may like to start with the
+ code in the [template dir](/t3-osm/template)
+ [Skeleton](http://getskeleton.com/) template
+ [ionic](http://ionicframework.com/) framework that utilizes [Cordova](https://cordova.apache.org/) and [AngularJS](https://angularjs.org/)

## Example application

In the example application we are going to build an application that shows bus stop locations, real-time bus locations and current events in Tampere.

[Leaflet.js](http://leafletjs.com/) and [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) are relatively easy to use but yet powerfull JavaScript libraries for creating interactive web maps.

There are very basic app skeletons for each in the repository:
+ [Mapbox GL JS app skeleton](/t3-osm/mapboxgl)
+ [Leaflet.js app skeleton](/t3-osm/leaflet)

## Implementation instructions for mobile HTML5 web site

We will start with the Leaflet.js app skeleton in the example but feel free to use the Mapbox GL JS app skeleton.

### Running and showing the app in a web browser

On command line in the hacking-great-4 directory type:
```
cd t3-osm/leaflet
serve
```

Then show the skeleton app in the browser by following instructions shown by the serve command.

### App skeleton code

The index.html includes Leaflet and jQuery library files and it has the map div that contains the map. Important is to notice the viewport meta tag values that are typically used with mobile HTML5 apps except the user-scalable=no attribute that is important for the map touch interaction to work.

The style.css file just defines the map to fill the whole browser window.

The script.js file defines default center coordinates and zoom for the map. When the index.html has been loaded by the browser the $( document ).ready() are run. Here the map is created and added to the div in the index.html. In addition, there a lot of different base maps that could be shown with the Leaflet (some examples shown at: https://wiki.openstreetmap.org/wiki/Tile_servers). Here we add basic OpenStreetMap layer to the map. After creating the map a data can be shown on top of it. 

### Showing bus stops

The bus stops with locations can be retrieved as GeoJSON that is easy to show with Leaflet. The jQuery library has getJSON function that can retrieve the bus stops via a REST call. The URL to call is given on the page: http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=17&alasivu=1&vapaasana=bussipys%C3%A4kit. Note: it is useful to add the srsName=EPSG:4326 parameter to query.

However, there is a catch. There are over 3600 bus stops in Tampere region and interaction with the map can become slow with so many stops and furthermore retrieving so much data can create unnecessary load for the server. These issues can be solved.

The first one can be solved using the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). The second one is often solved by caching the queries and results but in this case you can save the GeoJSON response as file and load it with the getJSON function from the local development web server.

There are nice [instructions on presenting GeoJSON data as a cluster on Leaflet map](https://medium.com/@walleyyang/clustering-points-from-a-geojson-file-with-leaflet-fffa6549a960) by Walley Yang.

### Showing events via Visit Tampere API

Retrieving events around Tampere can be done by a REST call to the Visit Tampere API. When you go to the https://visittampere.fi/api-docs/ and click the GET /search row you can see that to search events for a specific time period you have to provide start_datetime and end_datetime and these are given as milliseconds from epoch (epoch here means 1.1.1970). Luckily JavaScript Date.now() function returns current date and time in milliseconds from epoch.

The easiest way to try the actual REST calls is to open https://visittampere.fi/search?type=event in the browser and look for network traffic in the browser development console and give specific dates at the top of the browser window.

There are some interesting features in the API (besides getting the events) most likely to make hacking a bit safer and also easier. When you do the REST call without server component in the script.js there are only three events returned. if the (undocumented) calendar=true parameter is added then only two events are returned. Furthermore, adding the calendar=true parameter includes coordinates to the returned events. Having the coordinates in the response makes life easier as you would otherwise have to use a geocoding service to find out coordinates for the event address.

This time you can use L.marker function to create the event markers and marker.bindPopup function to show event data with the markers. It may be useful to see: http://leafletjs.com/examples/quick-start/.

Since the returned answer is JSON you can access, for example, title of the second event like: jsonData[1].title.

### Showing real-time bus locations

Showing the real-time bus locations is not much harder. You can use setInterval function to call your own function, for example, once per second that makes the jQuery getJSON call and updates the location of the bus if there is a marker on the map for the bus or creates a new marker if needed. You can add a variable under myMapApp object that stores the needed bus data in an array.

The REST call URL to the API that returns JSON is http://data.itsfactory.fi/siriaccess/vm/json as documented at the [ITS Factory wiki]('http://wiki.itsfactory.fi/index.php/Tampere_Public_Transport_SIRI_Interface_(Realtime_JSON_at_data.itsfactory.fi)').

Each bus is an array item under jsonData.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity. While the MonitoredVehicleJourney.LineRef tells the bus number, the unique identifier for each bus is value of the MonitoredVehicleJourney.VehicleRef. This identifier is needed for updating the bus location. 

What comes to Leaflet you can use L.marker for the busses but if you like you can change marker icon to something more illustrative (there is an icon under [example-answer-1-leaflet/img directory](/t3-osm/example-answer-1-leaflet/img), CC-0 license). There is a Leaflet tutorial for [Markers With Custom Icons](http://leafletjs.com/examples/custom-icons/).

## Implementation instructions for the ionic app

These instructions are for ionic version 1.

```
ionic start myMapApp https://github.com/calendee/ionic-leafletjs-map-demo
cd myMapApp
cordova plugin add cordova-plugin-geolocation
ionic serve
```

+ Edit myMapApp/www/index.html to use sass
+ Include Leaflet.js and Leaflet.markercluster like in the example 1
+ Also suggested is to use the [ionic-leafletjs-map-demo](https://github.com/calendee/ionic-leafletjs-map-demo), see also [angular-leaflet-directive](https://github.com/tombatossals/angular-leaflet-directive)
+ https://github.com/Eschon/Leaflet.markercluster, https://pastebin.com/raw/3ZjK6LtA

## Example answers

If needed you can take a look in the
+ example mobile web site map
  + [leaflet version](/t3-osm/example-answer-1-leaflet)
  + [Mapbox GL JS version](/t3-osm/example-answer-1-mapboxgljs)
+ TODO: Ionic example app

## Extra tasks

+ Implement a server component using NodeJS, Python, or your preferred framework / language that has a REST API for returning data, for example, from a CSV file or from a third party server.
+ Visualize GPX data
  + You can find existing GPS traces from OpenStreetMap

    ![GPS traces in OpenStreetMap](/t3-osm/OpenStreetMap_GPS_traces_Tampere.png)

  + If you have records, for example, in [sports-tracker.com](http://www.sports-tracker.com/) or [flow.polar.com](https://flow.polar.com/) you can download and use them
  + You can take a quick walk survey outside during the event and use a GPS logger, for example, [GPS Logger for Android](https://play.google.com/store/apps/details?id=com.mendhak.gpslogger&hl=en) or for iOS maybe [OpenGpxTracker](https://wiki.openstreetmap.org/wiki/OpenGpxTracker)
+ Focus the position of the map based on geolocation
  + See: [Using HTML Geolocation](https://www.w3schools.com/html/html5_geolocation.asp)
  + There is a nice [Manual Geolocation plugin](https://chrome.google.com/webstore/detail/manual-geolocation/jpiefjlgcjmciajdcinaejedejjfjgki) for Chromium / Chrome web browser
  