/* eslint-env browser */
/* global _  */
(function() {
	'use strict';

	// Main application

	// XHR load handler that constructs HTML elements from json
	var buildList = function(hotels_array) {
		var template = _.template(
			document.getElementById('card-template').innerHTML
		);

		// builds hotel data for template from hotel id
		var getHotel = function(hotel) {

			var obj = {
				name: hotel.name,
				// remove the width/height params on url for scalable/retina image
				image: hotel.thumbnail_url.split('?')[0],
				// double rating and fix to one decimal place
				rating: (hotel.reviews.trustyou.ty_score * 2).toFixed(1)
			};

			// determine rating class based on rating
			if(obj.rating >= 8) {
				obj.ratingClass = 'excellent';
			} else if(obj.rating >= 6) {
				obj.ratingClass = 'good';
			} else if(obj.rating >= 4) {
				obj.ratingClass = 'fair';
			} else {
				obj.ratingClass = 'poor';
			}

			/*
			var pois = data.pois[id];
			var poi;
			// loop through pois to select nearest
			for(var i = 0, l = pois.length; i < l; ++i) {
				if(!poi || poi.distance > pois[i].distance) {
					poi = pois[i];
				}
			}

			// convert meters to mi, and fix to one decimal place
			obj.poi = (poi.distance * 0.000621371).toFixed(1) +
				' mi from ' + poi.name;
			*/
			obj.poi = '';

			return obj;
		};

		var hotels = '';
		// loop through hotels, append html to string
		for(var i = 0; i < hotels_array.length; i++) {
			hotels += template(getHotel(hotels_array[i]));
		}

		// add html cards into list container
		document.getElementById('card-list').innerHTML = hotels;

		var detail_buttons = document.getElementsByClassName('details');
		var current_card;

		for(var i = 0; i < detail_buttons.length; i++) {
			detail_buttons[i].addEventListener('click', function(ev) {
				var card = ev.target.parentElement;
				var expanded = document.getElementById('expanded');

				if(current_card) {
					current_card.classList.remove('open');
					expanded.classList.remove('open');

					if(current_card === card) {
						current_card = null;
						return;
					}

				}

				current_card = card;
				card.classList.add('open');

				var expanded = document.getElementById('expanded');
				var bounds = card.getBoundingClientRect();
				expanded.classList.add('open');
				expanded.style.top = Math.round(window.pageYOffset + bounds.top + bounds.height + 20) + 'px';

			});
		}
	};
	var hotels_data;
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('application/json');
	xhr.open('GET', 'data.json', true);
	xhr.onload = function() {
		hotels_data = JSON.parse(this.responseText)
		buildList(Object.values(hotels_data.hotels));
	};
	xhr.send(null);


	var searchField = document.getElementsByClassName('search')[0];
	searchField.addEventListener('input', function(ev) {
		var hotels = Object.values(hotels_data.hotels);
		var results = [];
		for(var i = 0; i < hotels.length; i++) {
			if(hotels[i].name.toLowerCase().indexOf(searchField.value.toLowerCase()) !== -1) {
				results.push(hotels[i]);
			}
		}

		buildList(results);
	})
})();
