
//init map view
function initMap(){
  var self = this;
  var map, infowindow, bounds

  //create a new map
  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: locations[0].position,

        });

        google.maps.event.addDomListener(window, "resize", function() {
         var center = map.getCenter();
         google.maps.event.trigger(map, "resize");
         map.setCenter(center);
      });

  infowindow = new google.maps.InfoWindow();

  bounds = new google.maps.LatLngBounds();

  // return {map: map}
  return {map: map, infowindow: infowindow, bounds: bounds}

};
