
function SeasonDisplay(divId, eventGroupings, settings) {
	var radioButtonMode = false;
	var selectedGroupingIds = [];
	var plus_img = "/images/plus.png";
	var minus_img = "/images/minus.png";
	
	if (settings != undefined) {
		if (settings.radioButtonMode != undefined) {
			radioButtonMode = settings.radioButtonMode;
		}
		if (settings.selectedGroupingIds != undefined) {
			selectedGroupingIds = settings.selectedGroupingIds;
		}
	}
	// Shown IDs must be an array because the order in which we "click" on the 
	// events is important to restoring the saved state
	var shownIds = [];
	var idIndexLookup = {};
	
	for (var i in eventGroupings) {
		addChildOfClasses(eventGroupings[i]);
		addOpenCloseFunctionality(eventGroupings[i]);
		addSelectionFunctionality(eventGroupings[i]);
	}
	
	$(divId + " #selectAllEvents").change(selectAllEvents);
	$(divId + " #open_close_all").click(toggleAllOpenClose);
	
	$(divId).addClass("hierarchicalData");
	
	toggleAllOpenClose(false);
	restoreSavedSettings();
	restoreSelectedGroups(selectedGroupingIds);
	
	function restoreSelectedGroups(selectedGroupingIds) {
		for (var i in selectedGroupingIds) {
			var groupingId = selectedGroupingIds[i];
			$(divId + " #eventId" + groupingId + " input").attr("checked", true);
			$(divId + " .childOf" + groupingId + " input").attr("checked", true);
		}
	}
	
	function minimalSelectedSet() {
		for (var i in eventGroupings) {
			var maxCheckedEvent = getMaxCheckedEvent(eventGroupings[i]);
			if (maxCheckedEvent != undefined) {
				$(divId + " .childOf" + maxCheckedEvent.id + " input").removeAttr("checked");
			}
		}
	}
	this.minimalSelectedSet = minimalSelectedSet;
	
	function getMaxCheckedEvent(someEvent) {
		var maxChecked = undefined;
		var someEventId = someEvent.id;
		while ((someEventId != undefined) && ($(divId + " #eventId" + someEventId + " input").attr("checked"))) {
			maxChecked = someEvent;
			someEventId = eventGroupings[someEventId].parentGroup;
		}
		return maxChecked;
	}
	
	function restoreSavedSettings() {
		shownIds = JSON.parse($.cookie("shownIds"));
		if (shownIds == null || shownIds == undefined) {
			shownIds = [];
		}
		
		for (var i in shownIds) {
			if (eventGroupings[shownIds[i]] != undefined) {
				expandEvent(eventGroupings[shownIds[i]]);
				idIndexLookup[shownIds[i]] = Number(i);
			}
		}
	}
	
	function selectAllEvents() {
		var checked = $(divId + " #selectAllEvents").attr("checked");
		if (!checked) {
			$(divId + " .eventRow input").removeAttr("checked");
		} else {
			$(divId + " .eventRow input").attr("checked", checked);
		}
	}

	function addSelectionFunctionality(someEvent) {
		if (!radioButtonMode) {
			$(divId + " #eventId" + someEvent.id).click(function (jsEvent) {
				var originalTargetTag = jsEvent.originalEvent.target.tagName.toUpperCase();
				if (originalTargetTag == "A") {
					return;
				}
				
				var checked = $(divId + " #eventId" + someEvent.id + " input").attr("checked");
				
				if (originalTargetTag != "INPUT") {
					// Then toggle the checked state manually
					checked = !checked;
					if (checked) {
						$(divId + " #eventId" + someEvent.id + " input").attr("checked", checked);
					} else {
						$(divId + " #eventId" + someEvent.id + " input").removeAttr("checked");
					}
				}
				
				if (checked) {
					$(divId + " .childOf" + someEvent.id + " input").attr("checked", checked);
				} else {
					$(divId + " .childOf" + someEvent.id + " input").removeAttr("checked");
				}
				
				var parentId = someEvent.parentGroup;
				while (parentId != undefined) {
					var allChildrenCount = $(divId + " .childOf" + parentId).size();
					var selectedCount = $(divId + " .childOf" + parentId + " input:checked").size();
					
					var checked = (allChildrenCount == selectedCount);
					if (checked) {
						$(divId + " #eventId" + parentId + " input").attr("checked", checked);
					} else {
						$(divId + " #eventId" + parentId + " input").removeAttr("checked", checked);
					}
					
					parentId = eventGroupings[parentId].parentGroup;
				}
			});
		}
	}

	function addOpenCloseFunctionality(someEvent) {
		var openCloseFunction = openClose(someEvent);
		$(divId + " #eventId" + someEvent.id + " .open_close").data("event", someEvent).click(openCloseFunction);
		$(divId + " #eventId" + someEvent.id).dblclick(openCloseFunction);
	}
	
	function openClose(someEvent) {
		return function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			
			var $openCloseIcon = $(divId + " #eventId" + someEvent.id + " .open_close");
			
			if (isAMinus($openCloseIcon)) {
				$openCloseIcon.attr("src",plus_img);
				$(divId + " .childOf" + someEvent.id).hide();
				
				removeEventAndChildren(someEvent);
				
			} else {
				expandEvent(someEvent);
				
				var length = shownIds.push(someEvent.id);
				idIndexLookup[someEvent.id] = length - 1; 
			}
			$.cookie("shownIds", JSON.stringify(shownIds));
		}
	}
	
	function removeEventAndChildren(someEvent) {
		var index = idIndexLookup[someEvent.id];
		
		if (index == undefined) {
			return;
		}
		
		shownIds.splice(index, 1);
		delete idIndexLookup[someEvent.id];
		
		// We removed an id from our list, adjust the index
		for (var id in idIndexLookup) {
			if (index < idIndexLookup[id]) {
				idIndexLookup[id]--;
			}
		}
		
		for (var child in someEvent.childrenGroups) {
			var childToRemove = eventGroupings[someEvent.childrenGroups[child]];
			removeEventAndChildren(childToRemove);
		}
	}
	
	//This will expand a whole tree
	function addEventAndChildren(someEvent) {
		// If this event is already added, don't add it twice!
		if ((someEvent == undefined) || (idIndexLookup[someEvent.id] != undefined)) {
			return;
		}
		
		var length = shownIds.push(someEvent.id);
		idIndexLookup[someEvent.id] = length - 1;
		
		for (var child in someEvent.childrenGroups) {
			var childToAdd = eventGroupings[someEvent.childrenGroups[child]];
			addEventAndChildren(childToAdd);
		}
	}
	
	function expandEvent(someEvent) {
		$(divId + " #eventId" + someEvent.id + " .open_close").attr("src",minus_img);
		
		$(divId + " .childOf" + someEvent.id + " .open_close").attr("src", plus_img);
		
		var childDepth = depthOf(someEvent) + 1;
		$(divId + " .childOf" + someEvent.id + ".depth" + childDepth).show();
	}
	
	function depthOf(someEvent) {
		var depth = 0;
		var parentId = someEvent.parentGroup;
		while (parentId != undefined) {
			depth++;
			parentId = eventGroupings[parentId].parentGroup;
		}
		return depth;
	}

	function addChildOfClasses(someEvent) {
		var parentId = someEvent.parentGroup;
		while (parentId != undefined) {
			$(divId + " #eventId" + someEvent.id).addClass("childOf" + parentId)
			
			parentId = eventGroupings[parentId].parentGroup;
		}
	}
	
	function getMaxAncestor(someEvent) {
		var parentId = someEvent.parentGroup;
		var maxAncestor = someEvent;
		while (parentId != undefined) {
			maxAncestor = eventGroupings[parentId];
			parentId = eventGroupings[parentId].parentGroup;
		}
		
		return maxAncestor;
	}
	
	function setAllEventsShown() {
		for (var i in eventGroupings) {
			var parentEvent = getMaxAncestor(eventGroupings[i]);
			addEventAndChildren(parentEvent);
		}
	}
	
	/**
	 * Toggles all top level elements.
	 */
	function toggleAllOpenClose(setShownIds) {
		if (isAMinus($("#open_close_all"))) {
			$("img.open_close").attr("src",plus_img);
			$(".eventRow").hide();
			$(".depth0").show();
			
			if (setShownIds) {
				shownIds = [];
				idIndexLookup = {};
			}
			
		} else {
			$("img.open_close").attr("src",minus_img);
			$(".eventRow").show();
			
			if (setShownIds) {
				setAllEventsShown();
			}
			
		}
		
		if (setShownIds) {
			$.cookie("shownIds", JSON.stringify(shownIds));
		}
	}
	
	/**
	 * Determines from the element's source if it is a minus
	 */
	function isAMinus(element) {
		return ($(element).attr("src").indexOf("minus.png") >= 0);
	}
	
}