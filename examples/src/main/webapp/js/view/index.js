(function($) {

	$(document).ready(function() {
		var examples = {
			examples: [
				{
					label: "Favorite things",
					url: "example1.html"
				},
				{
					label: "Spectrum chooser",
					url: "example2.html"
				}
			]
		};

		$("#examples").refillTemplate(examples);
	});

})(jQuery);