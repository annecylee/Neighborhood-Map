// If getting the script successfuls
googleSuccess = function(){
      var mapElem = initMap();
      var map = mapElem.map;
      var infowindow = mapElem.infowindow;
      var bounds = mapElem.bounds;

      function viewModel(){

        var self = this;
        var categoryList = ['park', 'grocery', 'coffee', 'restaurant']

        // Create an array to store place name, markers
        this.elems = ko.observableArray([]);
        this.state = ko.observable();
        this.userInput = ko.observable()
        this.locations = ko.observable(locations);
        // InforWindow Content
        this.content = ko.observable({});

        // Init map and call it immediately
        this.init = (function(){

          this.locations().forEach(function(thisArg){

            var likes, link;

            // Get Foursqure venues information of the location
            $.ajax({
              url: thisArg.getFourSquareUrl,
              dataType: 'json',
            }).done(function(results) {
              var venues = results.response.venues

              var name = venues[0].name;

              // If data match, get link and likes
              if (name == thisArg.name) {
                var id = venues[0].id
                var detailUrl = 'https://api.foursquare.com/v2/venues/' + id
                    + '?client_id=YOUR_ID&client_secret=YOUR_SECRET&v=20170223'

                // Get Foursqure venues detial API
                $.ajax({
                  url: detailUrl,
                  dataType: 'json',
                }).done(function(results) {

                  link = results.response.venue.canonicalUrl;
                  likes = results.response.venue.likes.count;
                  self.content()[thisArg.name] = '<p>' + likes + ' people like \
                      + it</p>' + '<p><a href=' + link + '>more about it ... \
                      </a></p>'

                }).fail(function( jqXHR, textStatus) {
                  self.content('<p> Unknown people like it</p>' + '<p><a href='
                      + link + '>link unavailable temporarily</a></p>')
                });
              } else{
                self.content()[thisArg.name] = '<p>No likes data</p>' + '<p><a \
                    href=' + link + '>link unavailable</a></p>'
              }

            }).fail(function( jqXHR, textStatus) {
              self.content('<p> Unknown people like it</p>' + '<p><a href='
                  + link + '>link unavailable temporarily</a></p>')
            });


          //set marker per places
          var marker = new google.maps.Marker({
            position: thisArg.position,
            map: map,
            title: thisArg.name,
            animation: google.maps.DROP
          });

          // Extend the boundaries of the map for each marker and display the marker
          bounds.extend(thisArg.position);

          var elem = {location: thisArg, marker: marker, infowindow: infowindow,
                map: map, highlight: ko.observable(false)}

          self.elems.push(elem)
          // Enable to click marker to populate infowindow
          marker.addListener('click', (function(element){
            return function() {
              populateInfoWindow(element)
            }
          })(elem));

         });

        map.fitBounds(bounds);


      })();

        // Google Map API Inforwindow
        populateInfoWindow = function(element){

          var infowindow = element.infowindow;
          var location = element.location;
          var marker = element.marker;

          // InforWindow Foursqure Content

          // toggle highlight
          element.highlight(!element.highlight())

          //unhighlight element which is not selected in current state
          if (self.state() && self.state() != element){
            self.state().highlight(false)
          }

          //if a name is selected, it's infowindow opens, else, close infowindow
          if (!element.highlight()){
            infowindow.close(map, marker);
          } else {
            infowindow.setContent('<h3>' + marker.title + '</h3>'
                + self.content()[location.name]);
            infowindow.open(map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(function(){ marker.setAnimation(null); }, 750);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
              highlight = false
            });
          }
          self.state(element)
        }

        // If user's input matches data, populate autocomplete menu for user to select
        $('#autocomplete').autocomplete({
          source: function( request, response ) {
                  var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex(
                    request.term ), "i" );
                  response( $.grep( categoryList, function( item ){
                      return matcher.test( item );
                      }) );
                  },
        }).keyup(function(){
                    var userInput = $('input').val().toLowerCase()
                }).keyup(function (e) {
        if(e.which === 13) {
            $(".ui-menu-item").hide();
        }
    });

        // If park button is selected, show results of park
        this.parkSelected = function(item){
            self.userInput('park');
            $('input').val('park');
            self.menuIsClicked();
        }

        this.coffeeSelected = function(){
            self.userInput('coffee');
            $('input').val('coffee');
            self.menuIsClicked();
        }

        this.grocerySelected = function(){
            self.userInput('grocery');
            $('input').val('grocery');
            self.menuIsClicked();
        }

        this.restaurantSelected = function(){
            self.userInput('restaurant');
            $('input').val('restaurant');
            self.menuIsClicked();
        }

        // Filter event to control the view and data when user click filter button
        this.filter = function(){

          self.userInput($('input').val().toLowerCase());
          infowindow.close();

          if (self.userInput() && this.filteredPlaces().length) {
            self.menuIsClicked();
            self.feedback();
          }
        }

        // Return results based on user's input
        this.filteredPlaces = ko.computed(function(){

          return ko.utils.arrayFilter(self.elems(), function(place){

            if (self.userInput() == place.location.category.toLowerCase()
               || self.userInput() == place.location.name.toLowerCase()){
                 $( "#autocomplete" ).autocomplete( "close" );
                 place.marker.setVisible(true);
                 return true
            } else if (!self.userInput()){
                 place.marker.setVisible(true);
              return true
            }
            else{
                place.marker.setVisible(false);
            }
          })
        })

        // On mobile screen, if user click menu icon, corresponding view will show
        this.menuIsClicked = function(){

           $(".menu").toggleClass( "menu-color" );
           $(".filter-container").toggleClass( "filterSlide" );

          }


        //  Feedback message will show according to user's input
        this.feedback = function(){

          var feedback = $("#feedback")
          feedback.text(self.userInput() + " around you")
          feedback.show();
          setTimeout(function() { feedback.hide(); }, 2000);
          return false
          }
      };

      ko.applyBindings(viewModel());

}

// If fail to get the script
function googleError(){
	alert("Could not load Google Maps");
}
