(function example2($) {

	// Initialize our data
	var availableItems={
		items: [
			{
				name: "red",
				description: "The color red"
			},
			{
				name: "orange",
				description: "The color orange"
			},
			{
				name: "yellow",
				description: "The color yellow"
			},
			{
				name: "green",
				description: "The color green"
			},
			{
				name: "blue",
				description: "The color blue"
			},
			{
				name: "indigo",
				description: "The color indigo"
			},
			{
				name: "violet",
				description: "The color violet"
			}
		]};

	var selectedItems={
		items: [
		]};


	/**
	 *
	 *
	 */
	function renderLists() {
		$("#example2 .items-list.available")
			.refillTemplate(availableItems);
		$("#example2 .items-list.selected")
			.refillTemplate(selectedItems);
	}


	/**
	 *
	 *
	 */
	function onItemRendered(vars, item) {
		$(this).attr({
			"class": "item "+item.name
		});
	}


	/**
	 *
	 *
	 */
	function onItemClick(event) {
		var sourceList;
		var targetList;

		// Which list was the item in when clicked?
		var $list=$(this).parents(".items-list");
		if ($list.hasClass("available")) {
			sourceList=availableItems;
			targetList=selectedItems;
		}
		else {
			sourceList=selectedItems;
			targetList=availableItems;
		}

		// Get the item from the element
		var item=$(this).data("item");
		$(this).removeClass(item.name);

		// Remove the item from the list
		for (var i=0; i<sourceList.items.length; i++) {
			if (sourceList.items[i]==item) {
				sourceList.items.splice(i,1);
				break;
			}
		}

		// Add to the new list
		targetList.items.push(item);

		// Update the view
		renderLists();

		return false;
	};


	// Initialize the page
	$(document).ready(function onDocumentReady() {

		$("#itemTemplate")
			.templateCallback(onItemRendered)
			.click(onItemClick);

		renderLists();
	});

})(jQuery);