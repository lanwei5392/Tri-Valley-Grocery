var clientID = 'MLKAH00K10UJONDVU3MKL0D3AHMXNDTWVLO0VUXNYWFJVLIT';
var clientSecret = '5T35BVD5RRXVJVKP3PTWG0OACJOHSXYU0O04OW5ORVBFAP1V';

var locations = [
	{	 
		title: 'Safeway 11060 Bollinger Canyon Rd. San Ramon', 
		location: {lat: 37.7741899, lng: -121.921662}
	},
	{	
		title: 'Safeway 3496 Camino Tassajara, Danville', 
		location: {lat: 37.79812270, lng: -121.917765}
	},
	{	
		title: 'Safeway 7499 Dublin Blvd. Dublin', 
		location: {lat: 37.705697, lng: -121.9270399}
	},
	{ 
		title: 'Safeway 4440 Tassajara Rd. Dublin', 
		location: {lat: 37.7068065, lng: -121.8733686}
	},
	{
		title: 'Safeway 1701 Santa Rita Rd. Pleasanton', 
		location: {lat: 37.6749034, lng: -121.8743729}
	},
	{
		title: 'Safeway 6790 Bernal Ave. Pleasanton', 
		location: {lat: 37.656118, lng: -121.8994875}
	},
	{
		title: 'Whole Foods Market 5200 Dublin Blvd, Dublin', 
		location: {lat: 37.7057644, lng: -121.8898424}
	},
    {
    	title: 'Whole Foods Market 100 Sunset Dr., San Ramon', 
    	location: {lat: 37.7617459, lng: -121.9612469}
    },
    { 
    	title: '99 Ranch Market 4299 Rosewood Dr, Pleasanton', 
    	location: {lat: 37.6994865, lng: -121.8732497}
    },
    {
     	title: '99 Ranch Market 7333 Regional St, Dublin', 
    	location: {lat: 37.7064817, lng: -121.9331843}
    }
];
var map;

var markers = [];

var marker;

var placeMarkers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.705697, lng: -121.9270399},
		zoom: 13,
		mapTypeControl: false
});


var	largeInfowindow = new google.maps.InfoWindow();
maxwidth: 200;

var defaultIcon = makeMarkerIcon('0091ff');

var highlightedIcon = makeMarkerIcon('ffff24');
	
var bounds = new google.maps.LatLngBounds();


for (var i = 0; i < locations.length; i++) {
	var position = locations[i].location;
    var content = locations[i].content;
	var title = locations[i].title;
	var marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		content: content,
		icon: defaultIcon,
		animation: google.maps.Animation.DROP,
		id: i
	});

markers.push(marker);

bounds.extend(marker.position);

marker.addListener('click', function() {
	populateInfoWindow(this, largeInfowindow);
});

marker.addListener('mouseover', function() {
	this.setIcon(highlightedIcon);
});
marker.addListener('mouseout', function() {
	this.setIcon(defaultIcon);
});
}

/*
google.maps.event.addEventListener(window, 'resize', function() {
	map.fitBounds(bounds);
});
*/
map.fitBounds(bounds);

document.getElementById('show-listings').addEventListener('click', showListings);
document.getElementById('hide-listings').addEventListener('click', function() {
	hideMarkers(markers);
});

var vm = new ViewModel();
ko.applyBindings(vm);
}

function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.setContent('');
		infowindow.marker = marker;
		setTimeout(function() {
                marker.setAnimation(null);
            	}, 2800);

	infowindow.addListener('closeclick', function() {
		infowindow.marker = null;
	});

	// Use of foursquare API to populate info window
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.position.lat() + ',' + marker.position.lng() + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20161212' ;

    $.getJSON(foursquareUrl, function(data){
      // save the response from foursquare
      var foursquareResponse = data.response.venues[0];
      // Foursquare attribution
      var foursquareUrl = 'https://foursquare.com/v/' + foursquareResponse.id;
      // Get direction for the store
      var directionUrl = 'https://www.google.com/maps/dir/Current+Location/' +
                        marker.position.lat() + ',' + marker.position.lng();
      // add information to info window
      infowindow.setContent('<div class="infowindow-box"><div class="infowindow-heading"><strong>Name: <em style="color:blue">' + marker.title+ '</em></strong></div>' +
        '<div><strong>FourSquare Link: </strong>' + '<a href="' + foursquareUrl + '">' + foursquareResponse.name + '</a></div>' +
        '<div><strong>Direction: </strong>' + '<a href="' + directionUrl + '">' + directionUrl + '</a></div>' +
        //'<div><strong>Direction: </strong>' + '<a href="' + directionUrl + '">' + directionUrl + '</a></div>' + + '</a></div>' +
        '<div><strong>Address: </strong>' + foursquareResponse.location.formattedAddress + '</div></div>' );
      // open info window
      infowindow.open(map, marker);
    }).fail(function(){
      // if failed to open info window throw error
      alert("\n* ERROR *\n\nThere are some problems in retrieving data from FourSquare web");
    });

    }
}


function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
	return markerImage;
}

var ViewModel = function() {
	var self = this;
	this.storeList = ko.observableArray([]);

	locations.forEach(function(storeItem) {
		self.storeList.push(storeItem);
	});

	this.currentStore = ko.observable( this.storeList()[0] );

	for (var i = 0; i < locations.length; i++) {
		this.storeList()[i].marker = markers[i];
	};


	this.selectedStore = function(clickedStore) {
		for (var i = 0; i < locations.length; i++) {
			var title = self.storeList()[i].title;
			if (clickedStore.title == title) {
				this.currentStore = self.storeList()[i];
			}
		};
		this.marker.setAnimation(google.maps.Animation.BOUNCE);
		google.maps.event.trigger(this.marker, 'click')
		
	};

	self.searchItem = ko.observable('');
    self.searchFilter = function(value) {
        self.storeList.removeAll();
        for (var i in locations) {
            if (locations[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.storeList.push(locations[i]);
            }
        }
    }
    
    self.markerFilter = function(value) {
        for (var i in locations) {
            if (locations[i].marker.setMap(map) !== null) {
                locations[i].marker.setMap(null);
            }
            if (locations[i].marker.title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                locations[i].marker.setMap(map);
            }
        }  
    }

    //Couple our search items with our search/marker filter functions
    self.searchItem.subscribe(self.searchFilter);
    self.searchItem.subscribe(self.markerFilter);
};

function errorHandling() {
	alert("Loading Google Maps Failed!! Please check your internet connection and try again.");
};
