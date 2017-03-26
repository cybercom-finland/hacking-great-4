
# Mobile maps with OpenStreetMap

A mobile application that uses OpenStreetMap will be built. Also, some open data other than the map itself will be  retrieved and shown on the map. You can choose the data freely but also  some ready to choose options will be given.

## Open data

Suggested open location data:
+ City of Tampere
  + http://www.tampere.fi/tampereen-kaupunki/tietoa-tampereesta/avoin-data.html
+ ITS Factory
  + http://wiki.itsfactory.fi/index.php/Main_Page
  + http://wiki.itsfactory.fi/index.php/Tampere_Public_Transport_SIRI_Interface_(Realtime_JSON_at_data.itsfactory.fi)
+ Visit Tampere
  + https://visittampere.fi/api-docs/

More options (many require small server component implementation):
+ http://www.paikkatietoikkuna.fi/web/fi/avoin-paikkatieto
+ http://directory.spatineo.com/

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

## Implementation instructions

[Leaflet.js](http://leafletjs.com/) and [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) are relatively easy to use but yet powerfull JavaScript libraries for creating interactive web maps.

There are very basic app skeletons for each in the repository:
+ [Mapbox GL JS app skeleton](/t3-osm/mapboxgl)
+ [Leaflet.js app skeleton](/t3-osm/leaflet)

(more details to be added)
