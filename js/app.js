
var locations = [
	{	 
		title: 'Safeway 11060 Bollinger Canyon Rd. San Ramon', 
		location: {lat: 37.7736, lng: -121.92166},
		content: 'http://local.safeway.com/ca/san-ramon-2712.html?utm_source=G&utm_medium=Maps&utm_campaign=G+Place'
	},
	{	 
		title: 'Safeway 2505 San Ramon Valley Blvd. San Ramon', 
		location: {lat: 37.7736, lng: -121.9776353},
		content: 'http://local.safeway.com/ca/danville-1211.html'
	},
	{	
		title: 'Safeway 3496 Camino Tassajara, Danville', 
		location: {lat: 37.79812270, lng: -121.917765},
		content: 'http://local.safeway.com/ca/danville-1211.html'
	},
	{	
		title: 'Safeway 7499 Dublin Blvd. Dublin', 
		location: {lat: 37.705697, lng: -121.9270399},
		content: 'http://local.safeway.com/ca/dublin-1953.html'
	},
	{ 
		title: 'Safeway 4440 Tassajara Rd. Dublin', 
		location: {lat: 37.7068065, lng: -121.8733686},
		content: 'http://local.safeway.com/ca/dublin-1932.html'
	},
	{
		title: 'Safeway 1701 Santa Rita Rd. Pleasanton', 
		location: {lat: 37.6749034, lng: -121.8743729},
		content: 'http://local.safeway.com/ca/pleasanton-1502.html'
	},
	{
		title: 'Safeway 6790 Bernal Ave. Pleasanton', 
		location: {lat: 37.656118, lng: -121.8994875},
		content: 'http://local.safeway.com/ca/pleasanton-2856.html'
	},
	{
		title: 'Whole Foods Market 5200 Dublin Blvd, Dublin', 
		location: {lat: 37.7057644, lng: -121.8898424},
		content: 'http://www.wholefoodsmarket.com/stores/dublin-ca'
	},
    {
    	title: 'Whole Foods Market 100 Sunset Dr., San Ramon', 
    	location: {lat: 37.7617459, lng: -121.9612469},
    	content: 'http://www.wholefoodsmarket.com/stores/ram'
    },
    { 
    	title: '99 Ranch Market 4299 Rosewood Dr, Pleasanton', 
    	location: {lat: 37.6994865, lng: -121.8732497},
    	content: 'https://www.99ranch.com/stores/pleasanton-california'
    },
    {
     	title: '99 Ranch Market 7333 Regional St, Dublin', 
    	location: {lat: 37.7064817, lng: -121.9331843},
    	content: 'https://www.99ranch.com/stores/dublin-california'
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

		//infowindow.setContent('<div>' + marker.title + '</div>');
		//infowindow.open(map, marker);

	infowindow.addListener('closeclick', function() {
		infowindow.marker = null;
	});

	var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options

 	function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
        	
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<h2>' + marker.title + '</h2>' + '<div id="pano">' + '</div>'
                	+ '<a href="' + marker.content + '">' + marker.content + '</a>');
            var errorTimeout = setTimeout(function() { alert("Something went wrong"); }, 9000);
            clearTimeout(errorTimeout);
            var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                   heading: heading,
                   pitch: 30
                }
            };

            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
            }
    }
    
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
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
