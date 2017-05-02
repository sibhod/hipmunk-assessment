
/* eslint-env browser */
/* global _  */
(function() {
  'use strict';

  // Main application

  // XHR load handler that constructs HTML elements from json
  var buildList = function(data) {
    var template = _.template(
      document.getElementById('card-template').innerHTML
    );

    // builds hotel data for template from hotel id
    var getHotel = function(id) {
      var hotel = data.hotels[id];

      var obj = {
        name: hotel.name,
        // remove the width/height params on url for scalable/retina image
        image: hotel.thumbnail_url.split('?')[0],
        // double rating and fix to one decimal place
        rating: (hotel.reviews.trustyou.ty_score * 2).toFixed(1)
      };

      // determine rating class based on rating
      if (obj.rating >= 8) {
        obj.ratingClass = 'excellent';
      } else if (obj.rating >= 6) {
        obj.ratingClass = 'good';
      } else if (obj.rating >= 4) {
        obj.ratingClass = 'fair';
      } else {
        obj.ratingClass = 'poor';
      }

      var pois = data.pois[id];
      var poi;
      // loop through pois to select nearest
      for (var i = 0, l = pois.length; i < l; ++i) {
        if (!poi || poi.distance > pois[i].distance) {
          poi = pois[i];
        }
      }
      // convert meters to mi, and fix to one decimal place
      obj.poi = (poi.distance * 0.000621371).toFixed(1) +
        ' mi from ' + poi.name;

      return obj;
    };

    var hotels = '';
    // loop through hotels, append html to string
    for (var id in data.hotels) {
      if (id) {
        hotels += template(getHotel(id));
      }
    }

    // add html cards into list container
    document.getElementById('card-list').innerHTML = hotels;
  };

  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'data.json', true);
  xhr.onload = function() {
    buildList(JSON.parse(this.responseText));
  };
  xhr.send(null);
})();
