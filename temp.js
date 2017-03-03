//init map view

function initMap(){
  var self = this;
  var map, infowindow, bounds

  //create a new map
  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: locations[0].position
        })

  //create an array to store markers
  self.markers = ko.observableArray();

  infowindow = new google.maps.InfoWindow()

  for(var i = 0; i < locations.length; i++){

    //create array per location in locations
    var marker = new google.maps.Marker({
      position: locations[i].position,
      map: map,
      animation: google.maps.DROP
    });

    self.markers.push(marker);

    marker.addListener('click', (function(content){
      return function() {
        populateInfoWindow(content, map, this, infowindow)
      }
    })(locations[i].name));
  };

  // set to display all markers
  bounds = new google.maps.LatLngBounds();


  for (var i  = 0; i < self.markers().length; i++){
    self.markers()[i].setMap(map);
    bounds.extend(self.markers()[i].position);
  }
  map.fitBounds(bounds);

};


function populateInfoWindow(content, map, marker, infowindow){
  if (infowindow.marker != marker) {
  infowindow.marker = marker;
  infowindow.setContent(content);
  infowindow.open(map, marker);
  // Make sure the marker property is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
  });
}


};
