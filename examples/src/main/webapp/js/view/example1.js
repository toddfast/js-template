(function($) {

	$(document).ready(function() {
		var favorites = {
			title: "Favorite Things", 
			favs: ["raindrops", "whiskers", "mittens"]
		};

		$("#template1").refillTemplate(favorites);
	});

})(jQuery);