var locations = [
  {name: 'Moitozo Park', category: 'park', position: {lat: 37.406541, lng: -121.940163}},
  {name: "Children's Discovery Museum", category: 'park', position: {lat: 37.326862, lng: -121.892093}},
  {name: 'Riverview Park', category: 'park', position: {lat: 37.401464, lng: -121.942096}},
  {name: 'River Oak Park', category: 'park', position: {lat: 37.395815, lng: -121.945888}},
  {name: 'Ulistac Natural Area', category: 'park', position: {lat: 37.404283, lng: -121.955659}},
  {name: 'Starbucks', category: 'coffee', position: {lat: 37.40323, lng: -121.933263}},
  {name: 'Jang Su Jang', category: 'restaurant', position: {lat: 37.353714, lng: -121.994582}},
  {name: 'Safeway', category: 'grocery', position: {lat: 37.394812, lng: -121.947658}},
  {name: '99 Ranch', category: 'grocery', position: {lat: 37.422818, lng: -121.916808}},
];

// Foursquare venues search API
var baseUrl = 'https://api.foursquare.com/v2/venues/search?client_id=YOUR_ID&client_secret=YOUR_SECRET&v=20170223&ll='

// Add url to get Foursqure venues information to the locations array
locations.forEach(function(loc) {

  var lat, lng, ll;
  lat = loc.position.lat.toString()
  lng = loc.position.lng.toString()
  ll = lat + ',' + lng
  url = baseUrl + ll
  loc.getFourSquareUrl = url

});
