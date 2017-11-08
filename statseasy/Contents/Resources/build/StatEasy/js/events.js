
var allEventViewers = [];

function EventViewer(divId, dataManager, settings) {
	var divObj = (!!divId) ? $("#" + divId + "-events") : null;
	var programmaticScroll = false;
	var allowAutoScrolling = true;
	var externallySetAllowAutoScrolling = true;
	
	allEventViewers[divId] = this;
	var thisEventViewer = this;
	var entryIdLookup = {};
	
	var basePath = "/";
	var initialModeCallback = editMode;
	var returnFocus = undefined;
	var editStatsUrl = dataManager.dataUrl;
	var showGameSeparators = false;
	var searchDivId = undefined;
	if (settings != undefined) {
		searchDivId = settings.searchDivId;
		returnFocus = settings.returnFocus;
		
		if (settings.basePath != undefined) {
			basePath = settings.basePath;
		}
		if (settings.initialModeCallback != undefined) {
			initialModeCallback = settings.initialModeCallback;
		}
		if (settings.editStatsUrl != undefined) {
			editStatsUrl = settings.editStatsUrl;
		}
		if (settings.showGameSeparators != undefined) {
			showGameSeparators = settings.showGameSeparators;
		}
	}

	var statList = new StatList(divId + "-events", {
		showGameSeparators : showGameSeparators,
		editSubmit : editSubmit,
		onEditEnd : resetFocus,
	});
	if (searchDivId != undefined) {
		new SearchBox(searchDivId, {
			dataManager : dataManager,
			statList : statList
		});
	}
	
	initEventData();
	
	function resetFocus() {
		if (returnFocus != undefined) {
			$(returnFocus).focus();
		}
	}
	this.resetFocus = resetFocus;
	
	function initEventData() {
		addHtml();
		if (initialModeCallback != undefined) {
			setMode(initialModeCallback);
		}

		dataManager.registerForNotification(DataManager.ADD,    handleAddResult);
		dataManager.registerForNotification(DataManager.EDIT,   handleEditResult);
		dataManager.registerForNotification(DataManager.DELETE, handleDeleteResult);
		dataManager.registerForNotification(DataManager.ERROR,  handleErrorResult);
		dataManager.registerForNotification(DataManager.WARNING,  handleWarningResult);
	}

	function addHtml() {
		
		var lastGameId = undefined;
		for (var i in dataManager.allStats) {
			var thisStat = dataManager.allStats[i];
			var entryId = statList.insertStat(thisStat);
			
			entryIdLookup[thisStat.getId()] = entryId;
			
			lastGameId = thisStat.getGameId();
		}
		
		for (var i in dataManager.allStats) {
			dataManager.allStats[i].displayed = true;
		}
	}
	
	function getDiv() {
		return divObj;
	}
	this.getDiv = getDiv;
	
	/**************************************************************************/
	/**                               Modes                                  **/
	/**************************************************************************/
	this.setAllowAutoScrolling = statList.setAllowAutoScrolling;
	
	function setMode(callback) {
		if (callback == editMode) {
			$("#" + divId + "-events .statList").addClass("editable");
			statList.setDeleteHandler(eventDelete);
		} else {
			$("#" + divId + "-events .statList").removeClass("editable");
			statList.setDeleteHandler();
		}
		statList.setClickHandler(callback);
	}
	this.setMode = setMode;
	
	function editMode(event, eventObj, eventId) {
		statList.showEditEntry(eventId);
	}
	this.editMode = editMode;
	
	function editSubmit(value, eventObj) {
		resetFocus();
		
		dataManager.editStat(eventObj, value, eventObj);
		
		var supplementalStats = eventObj.getSupplementalStats();
		for (var i in supplementalStats) {
			var stat = supplementalStats[i];
			thisEventViewer.fadeStat(stat);
		}
		
		return "<p>Processing '" + value + "'...</p><div class='clear'/>";
	}
	
	function handleEditResult(data) {
		var newEvents = data["allStats"];
		
		var handledStatIds = {};
		
		// New events start off opaque, so we pass true for the second param
		// (in case you were wondering what it did and were lazy like me)
		for (var i in newEvents) {
			insertEvent(newEvents[i], true);
			handledStatIds[newEvents[i].getId()] = true;
		}
		
		for (var i in data.deletedStats) {
			removeStatById(data.deletedStats[i].id);
			handledStatIds[data.deletedStats[i].id] = true;
		}
		// Then fade in
		for (var i in newEvents) {
			thisEventViewer.unfadeStat(newEvents[i]);
		}
		
		for (var i in data.modifiedStats) {
			if (!handledStatIds[i]) {
				updateEvent(i);
			}
		}
	}
	
	function eventDelete(stat, imgDOM) {
		deleteThisEvent = stat;
		
		$("<div title='Are you sure?'>Are you sure you want to delete '" + deleteThisEvent.getName() + "'? You cannot undo this action.</div>").dialog({ 
			closeText: '',
			modal: 'true',
		    height: '200',
		    width: '400',
			buttons: { 
				"Yes, delete it.": function() {
					$(this).dialog("close");
			
					resetFocus();
					
					dataManager.deleteStat(deleteThisEvent, deleteThisEvent);
					
					thisEventViewer.fadeStat(deleteThisEvent);
					
					var supplementalStats = deleteThisEvent.getSupplementalStats();
					for (var i in supplementalStats) {
						var stat = supplementalStats[i];
						thisEventViewer.fadeStat(stat);
					}
				},
				"No, do not delete it.": function() { $(this).dialog("close"); } 
			}
		});
	}
	this.eventDelete = eventDelete;
	
	function handleDeleteResult(data) {
		var newEvents = data.allStats;
		for (var i in newEvents) {
			insertEvent(newEvents[i]);
		}
		
		for (var i in data.deletedStats) {
			removeStatById(data.deletedStats[i].id);
		}
	}
	
	var newEventHighlighting = true;
	function setNetEventHighlighting(shouldHighlight) {
		newEventHighlighting = shouldHighlight;
	}
	this.setNetEventHighlighting = setNetEventHighlighting;
	
	function handleAddResult(data) {
		var newEvents = data.allStats;
		
		var handledStatIds = {};
		
		for (var i in newEvents) {
			insertEvent(newEvents[i]);
			handledStatIds[newEvents[i].getId()] = true;
		}
		
		if (newEventHighlighting && (newEvents.length > 0)) {
			for (var i in newEvents) {
				thisEventViewer.highlightStat(newEvents[i]);
			}
			thisEventViewer.scrollToStat(newEvents[0]);
		}
		
		for (var i in data.deletedStats) {
			removeStatById(data.deletedStats[i].id);
			handledStatIds[data.deletedStats[i].id] = true;
		}
		
		for (var i in data.modifiedStats) {
			if (!handledStatIds[i]) {	
				updateEvent(i);
			}
		}
	}
	
	function insertEvent(eventObj, startOpaque) {
		var atIndex = 0;
		for (var i in dataManager.allStats) {
			var stat = dataManager.allStats[i];
			if (stat.getId() == eventObj.getId()) {
				atIndex = Number(i);
				break;
			}
		}
		
		var entryId = statList.insertStat(eventObj, {opaque : startOpaque}, atIndex);
		
		entryIdLookup[eventObj.getId()] = entryId;
		
		eventObj.displayed = true;
	}
	
	function updateEvent(statId) {
		if (entryIdLookup[statId] == undefined) {
			return;
		}

		var atIndex = 0;
		for (var i in dataManager.allStats) {
			var stat = dataManager.allStats[i];
			if (stat.getId() == statId) {
				atIndex = Number(i);
				break;
			}
		}
		
		statList.updateStat(dataManager.allStats[atIndex], entryIdLookup[statId]);
	}
	
	function removeStatById(statId) {
		if (entryIdLookup[statId] == undefined) {
			return;
		}
		statList.removeEntry(entryIdLookup[statId]);
		delete entryIdLookup[statId];
	}
	
	function handleWarningResult(data) {
		var allWarnings = "";
		for (var i in data.warnings) {
			allWarnings += data.warnings[i] + "<br />";
		}
		displayDialog(data, allWarnings, "warning");
	}
	
	function handleErrorResult(data) {
		displayDialog(data, data.message, "error");
	}
	
	function displayDialog(data, message, type) {
		var id = divId + "-events";
		
		var eventObj = data["additionalData"];
		if ((eventObj != undefined) && (eventObj.getId != undefined) && (eventObj.getId() != undefined) && (entryIdLookup[eventObj.getId()] != undefined)) {
			id = statList.getEntryId(entryIdLookup[eventObj.getId()], true);
		}
		
		$.validationEngine.buildPrompt("#" + id, message, type);
	    $("#" + id).bind("mouseout", function() {
	        $.validationEngine.closePrompt("#" + id);
	    });
	}
	
	/***************************************************************************
	 *                             Stat Effects
	 **************************************************************************/
	this.highlightStat = statList.highlightStat;
	this.fadeStat = statList.fadeStat;
	this.unfadeStat = statList.unfadeStat;
	this.scrollToStat = function (stat) {
		statList.scrollToEntry(entryIdLookup[stat.getId()]);
	};
	
}