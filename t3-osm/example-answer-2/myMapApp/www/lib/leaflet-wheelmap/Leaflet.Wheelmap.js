L.WheelmapDefaultIconPath = function () {
  var scripts = document.getElementsByTagName('script'),
      leafletWheelmapRe = /[\/^]Leaflet.Wheelmap[\-\._]?([\w\-\._]*)\.js\??/;
  //console.log(scripts);

  var i, len, src, matches, path;

  for (i = 0, len = scripts.length; i < len; i++) {
    src = scripts[i].src;
    matches = src.match(leafletWheelmapRe);

    if (matches) {
      path = src.split(leafletWheelmapRe)[0];
      return (path ? path + '/' : '') + 'icons';
    }
  }
}

L.Wheelmap = L.FeatureGroup.extend({
	options: {
		icon: {
			iconSize: [32, 37],
      iconAnchor: [16, 37]
		},
    iconPath: null
	},

	initialize: function (nodes, options) {
		L.setOptions(this, options);
    this.options.iconPath = this.options.iconPath != null ? this.options.iconPath : L.WheelmapDefaultIconPath();
    //console.log(this.options.iconPath);
    L.FeatureGroup.prototype.initialize.call(this, nodes);
	},

  getNodeType: function(id) {
    var nodeTypes = {"conditions":{"page":1,"per_page":500,"format":"json","locale":"en"},"meta":{"page":1,"num_pages":1,"item_count_total":130,"item_count":130},"node_types":[{"id":1,"identifier":"bicycle_rental","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Bicycle rental","icon":"cycling.png"},{"id":2,"identifier":"boatyard","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Boat yard","icon":"boat.png"},{"id":3,"identifier":"bus_station","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Bus station","icon":"busstop.png"},{"id":4,"identifier":"bus_stop","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Bus stop","icon":"busstop.png"},{"id":5,"identifier":"car_rental","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Car rental","icon":"carrental.png"},{"id":6,"identifier":"car_sharing","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Car sharing","icon":"carrental.png"},{"id":7,"identifier":"ferry_terminal","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Ferry terminal","icon":"ferry.png"},{"id":8,"identifier":"fuel","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Gas station","icon":"fillingstation.png"},{"id":9,"identifier":"halt","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Halt","icon":"train.png"},{"id":10,"identifier":"parking","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Parking","icon":"parking.png"},{"id":11,"identifier":"platform","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Platform","icon":"train.png"},{"id":12,"identifier":"station","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Train station","icon":"train.png"},{"id":13,"identifier":"subway_entrance","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Subway entrance","icon":"underground.png"},{"id":14,"identifier":"terminal","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Airport terminal","icon":"airport_terminal.png"},{"id":15,"identifier":"tram_stop","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Tram stop","icon":"tramway.png"},{"id":16,"identifier":"cable_car","category_id":1,"category":{"id":1,"identifier":"public_transfer"},"localized_name":"Cable car","icon":"cablecar.png"},{"id":17,"identifier":"cafe","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Cafe","icon":"coffee.png"},{"id":18,"identifier":"bar","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Bar","icon":"bar_coktail.png"},{"id":19,"identifier":"drinking_water","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Drinking water","icon":"drinkingwater.png"},{"id":20,"identifier":"fast_food","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Fast Food","icon":"fastfood.png"},{"id":21,"identifier":"pub","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Pub","icon":"bar.png"},{"id":22,"identifier":"restaurant","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Restaurant","icon":"restaurant.png"},{"id":23,"identifier":"biergarten","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Biergarten","icon":"biergarten.png"},{"id":25,"identifier":"cinema","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Cinema","icon":"cinema.png"},{"id":26,"identifier":"gallery","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Gallery","icon":"museum_art.png"},{"id":27,"identifier":"nightclub","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Nightclub","icon":"dancinghall.png"},{"id":28,"identifier":"theatre","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Theatre","icon":"theater.png"},{"id":29,"identifier":"zoo","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Zoo","icon":"zoo.png"},{"id":30,"identifier":"brothel","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Brothel","icon":"lantern.png"},{"id":31,"identifier":"community_centre","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Community centre","icon":"communitycentre.png"},{"id":32,"identifier":"stripclub","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Stripclub","icon":"stripclub.png"},{"id":33,"identifier":"playground","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Playground","icon":"playground.png"},{"id":34,"identifier":"atm","category_id":4,"category":{"id":4,"identifier":"money_post"},"localized_name":"ATM","icon":"atm.png"},{"id":35,"identifier":"bureau_de_change","category_id":4,"category":{"id":4,"identifier":"money_post"},"localized_name":"Bureau de change","icon":"currencyexchange.png"},{"id":36,"identifier":"bank","category_id":4,"category":{"id":4,"identifier":"money_post"},"localized_name":"Bank","icon":"bank.png"},{"id":37,"identifier":"post_office","category_id":4,"category":{"id":4,"identifier":"money_post"},"localized_name":"Post office","icon":"postal.png"},{"id":38,"identifier":"college","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"College","icon":"university.png"},{"id":39,"identifier":"kindergarten","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"Kindergarten","icon":"daycare.png"},{"id":40,"identifier":"library","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"Library","icon":"library.png"},{"id":41,"identifier":"museum","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"Museum","icon":"museum_archeological.png"},{"id":42,"identifier":"school","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"School","icon":"school.png"},{"id":43,"identifier":"university","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"University","icon":"university.png"},{"id":44,"identifier":"alcohol","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Liquor","icon":"liquor.png"},{"id":45,"identifier":"bakery","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Bakery","icon":"bread.png"},{"id":46,"identifier":"beverages","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Beverages","icon":"liquor.png"},{"id":47,"identifier":"bicycle","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Bike shop","icon":"cycling.png"},{"id":48,"identifier":"books","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Books","icon":"library.png"},{"id":49,"identifier":"butcher","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Butcher","icon":"butcher.png"},{"id":50,"identifier":"clothes","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Clothes","icon":"clothers_male.png"},{"id":51,"identifier":"computer","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Computer","icon":"computers.png"},{"id":52,"identifier":"convenience","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Convenience","icon":"conveniencestore.png"},{"id":53,"identifier":"department_store","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Department store","icon":"departmentstore.png"},{"id":54,"identifier":"doityourself","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Do it yourself","icon":"tools.png"},{"id":55,"identifier":"dry_cleaning","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Dry cleaning","icon":"laundromat.png"},{"id":56,"identifier":"electronics","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Electronics","icon":"phones.png"},{"id":57,"identifier":"florist","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Florist","icon":"flowers.png"},{"id":58,"identifier":"furniture","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Furniture","icon":"homecenter.png"},{"id":59,"identifier":"garden_centre","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Garden centre","icon":"flowers.png"},{"id":60,"identifier":"hairdresser","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Hairdresser","icon":"barber.png"},{"id":61,"identifier":"hardware","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Hardware","icon":"tools.png"},{"id":62,"identifier":"laundry","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Laundry","icon":"laundromat.png"},{"id":63,"identifier":"mall","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Shopping centre","icon":"mall.png"},{"id":64,"identifier":"kiosk","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Kiosk","icon":"kiosk.png"},{"id":65,"identifier":"optician","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Optician","icon":"ophthalmologist.png"},{"id":66,"identifier":"shoes","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Shoes","icon":"shoes.png"},{"id":67,"identifier":"supermarket","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Supermarket","icon":"supermarket.png"},{"id":68,"identifier":"chemist","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Chemist / Drugstore","icon":"chemist.png"},{"id":69,"identifier":"stationery","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Stationery","icon":"stationery.png"},{"id":70,"identifier":"video","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Video rental store","icon":"music.png"},{"id":71,"identifier":"second_hand","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Second hand","icon":"2hand.png"},{"id":72,"identifier":"car_shop","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Car shop","icon":"car.png"},{"id":73,"identifier":"car_repair","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Car repair","icon":"car_repair.png"},{"id":74,"identifier":"sports","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Sports","icon":"weights.png"},{"id":75,"identifier":"photo","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Photo","icon":"photography.png"},{"id":76,"identifier":"sports_centre","category_id":7,"category":{"id":7,"identifier":"sport"},"localized_name":"Sports centre","icon":"tennis.png"},{"id":77,"identifier":"stadium","category_id":7,"category":{"id":7,"identifier":"sport"},"localized_name":"Stadium","icon":"stadium.png"},{"id":78,"identifier":"swimming_pool","category_id":7,"category":{"id":7,"identifier":"sport"},"localized_name":"Swimming pool","icon":"swimming.png"},{"id":79,"identifier":"archaeological_site","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Archaeological site","icon":"fossils.png"},{"id":80,"identifier":"arts_centre","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Arts centre","icon":"artgallery.png"},{"id":81,"identifier":"artwork","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Artwork","icon":"publicart.png"},{"id":82,"identifier":"attraction","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Attraction","icon":"artgallery.png"},{"id":83,"identifier":"beach","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Beach","icon":"beach.png"},{"id":84,"identifier":"castle","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Castle","icon":"castle.png"},{"id":85,"identifier":"cave_entrance","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Cave entrance","icon":"cave.png"},{"id":86,"identifier":"memorial","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Memorial","icon":"memorial.png"},{"id":87,"identifier":"theme_park","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"Theme park","icon":"themepark.png"},{"id":88,"identifier":"viewpoint","category_id":8,"category":{"id":8,"identifier":"tourism"},"localized_name":"View point","icon":"beautifulview.png"},{"id":90,"identifier":"bed_and_breakfast","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Bed and breakfast","icon":"bed_breakfast1.png"},{"id":91,"identifier":"camp_site","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Camp site","icon":"camping.png"},{"id":92,"identifier":"caravan_site","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Caravan site","icon":"camping.png"},{"id":93,"identifier":"chalet","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Chalet","icon":"home.png"},{"id":94,"identifier":"guest_house","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Guest house","icon":"villa.png"},{"id":95,"identifier":"hostel","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Hostel","icon":"lodging_0star.png"},{"id":96,"identifier":"hotel","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Hotel","icon":"lodging_0star.png"},{"id":97,"identifier":"motel","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Motel","icon":"lodging_0star.png"},{"id":98,"identifier":"place_of_worship","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Place of worship","icon":"prayer.png"},{"id":99,"identifier":"toilets","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Toilets","icon":"toilets.png"},{"id":100,"identifier":"company","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Company (Office)","icon":"workoffice.png"},{"id":101,"identifier":"lawyer","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Lawyer","icon":"court.png"},{"id":102,"identifier":"courthouse","category_id":11,"category":{"id":11,"identifier":"government"},"localized_name":"Courthouse","icon":"court.png"},{"id":103,"identifier":"townhall","category_id":11,"category":{"id":11,"identifier":"government"},"localized_name":"Town hall","icon":"bigcity.png"},{"id":104,"identifier":"embassy","category_id":11,"category":{"id":11,"identifier":"government"},"localized_name":"Embassy","icon":"embassy.png"},{"id":105,"identifier":"police","category_id":11,"category":{"id":11,"identifier":"government"},"localized_name":"Police","icon":"police.png"},{"id":106,"identifier":"doctors","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Doctor","icon":"medicine.png"},{"id":107,"identifier":"hospital","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Hospital","icon":"firstaid.png"},{"id":108,"identifier":"pharmacy","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Pharmacy","icon":"firstaid.png"},{"id":109,"identifier":"veterinary","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Veterinary","icon":"veterinary.png"},{"id":110,"identifier":"medical_supply","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Medical supplies","icon":"medicalstore.png"},{"id":111,"identifier":"hearing_aids","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Hearing aid dealer","icon":"hearing_aids.png"},{"id":112,"identifier":"social_facility","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Social facility","icon":"social_facility.png"},{"id":113,"identifier":"ice_cream","category_id":2,"category":{"id":2,"identifier":"food"},"localized_name":"Ice cream parlour","icon":"icecream.png"},{"id":114,"identifier":"casino","category_id":3,"category":{"id":3,"identifier":"leisure"},"localized_name":"Casino","icon":"poker.png"},{"id":115,"identifier":"driving_school","category_id":5,"category":{"id":5,"identifier":"education"},"localized_name":"Driving school","icon":"car.png"},{"id":116,"identifier":"deli","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Delicatessen","icon":"lobster-export.png"},{"id":117,"identifier":"confectionery","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Candy store","icon":"targ.png"},{"id":118,"identifier":"beauty","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Beauty salon","icon":"beautysalon.png"},{"id":119,"identifier":"jewelry","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Jewelry","icon":"jewelry.png"},{"id":120,"identifier":"gift","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Gift shop","icon":"gifts.png"},{"id":121,"identifier":"toys","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Toys","icon":"toys.png"},{"id":122,"identifier":"travel_agency","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Travel agency","icon":"travel_agency.png"},{"id":123,"identifier":"outdoor","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Outdoor supply","icon":"hiking.png"},{"id":124,"identifier":"organic","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Organic shop","icon":"restaurant_vegetarian.png"},{"id":125,"identifier":"pet","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Pet shop","icon":"cat.png"},{"id":126,"identifier":"fabric","category_id":6,"category":{"id":6,"identifier":"shopping"},"localized_name":"Fabric shop","icon":"textiles.png"},{"id":127,"identifier":"pitch","category_id":7,"category":{"id":7,"identifier":"sport"},"localized_name":"Sports field","icon":"soccer.png"},{"id":128,"identifier":"estate_agent","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Real estate agent","icon":"house.png"},{"id":129,"identifier":"insurance","category_id":10,"category":{"id":10,"identifier":"misc"},"localized_name":"Insurance","icon":"workoffice.png"},{"id":130,"identifier":"dormitory","category_id":9,"category":{"id":9,"identifier":"accommodation"},"localized_name":"Dormitory","icon":"apartment.png"},{"id":131,"identifier":"dentist","category_id":12,"category":{"id":12,"identifier":"health"},"localized_name":"Dentist","icon":"dentist.png"},{"id":132,"identifier":"government","category_id":11,"category":{"id":11,"identifier":"government"},"localized_name":"Government agency","icon":"office-building.png"}]}.node_types;
    for (var i = 0; i < nodeTypes.length; i++) {
      if (nodeTypes[i].id == id) {
        return nodeTypes[i];
      }
    }
    return null;
  },

	addLayers: function (nodes) {
		if (nodes) {
			for (var i = 0, len = nodes.length; i < len; i++) {
				this.addLayer(nodes[i]);
			}
		}
		return this;
	},

	addLayer: function (node) {
		L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(node));
	},

	createMarker: function (node) {
    //console.log(node);
    var imgURL = null;
    var nodeType = this.getNodeType(node.node_type.id);
    if (nodeType != null) {
      imgURL = this.options.iconPath + "/" + node.wheelchair + "/" + nodeType.icon;
    }
    else {
      imgURL = this.options.iconPath + "/" + node.wheelchair + ".png";
    }
		var marker = L.marker(node, {
      icon: L.divIcon(L.extend({
        html: '<div style="background-image: url(' + imgURL + ');"></div>​',
        className: 'leaflet-marker-wheelmap'
      }, node, this.options.icon)),
  		title: node.caption || ''
  		});
		marker.node = node;
		return marker;
	}
});

L.wheelmap = function (nodes, options) {
	return new L.Wheelmap(nodes, options);
};

if (L.MarkerClusterGroup) {

	L.Wheelmap.Cluster = L.MarkerClusterGroup.extend({
		options: {
			featureGroup: L.wheelmap,
			maxClusterRadius: 100,
			showCoverageOnHover: false,
			iconCreateFunction: function(cluster) {
				return new L.DivIcon(L.extend({
					className: 'leaflet-marker-wheelmap',
					html: '<div style="background-image: url(' + L.WheelmapDefaultIconPath() + "/undefined.png" + ');"></div>​<b>' + cluster.getChildCount() + '</b>'
				}, this.icon));
		  },
      icon: {
  			iconSize: [32, 37],
        iconAnchor: [16, 37]
  		}
		},

		initialize: function (options) {
			options = L.Util.setOptions(this, options);
			L.MarkerClusterGroup.prototype.initialize.call(this);
			this._nodes = options.featureGroup(null, options);
		},

		add: function (nodes) {
			this.addLayer(this._nodes.addLayers(nodes));
			return this;
		},

		clear: function () {
			this._nodes.clearLayers();
			this.clearLayers();
		},
    getDefaultWheelmapIconPath: function () {
      var scripts = document.getElementsByTagName('script'),
          leafletWheelmapRe = /[\/^]Leaflet.Wheelmap[\-\._]?([\w\-\._]*)\.js\??/;
      //console.log(scripts);

      var i, len, src, matches, path;

      for (i = 0, len = scripts.length; i < len; i++) {
        src = scripts[i].src;
        matches = src.match(leafletWheelmapRe);

        if (matches) {
          path = src.split(leafletWheelmapRe)[0];
          return (path ? path + '/' : '') + 'icons';
        }
      }
    }
	});

	L.wheelmap.cluster = function (options) {
		return new L.Wheelmap.Cluster(options);
	};

}
