
function StatList(divId, settings) {
	var divObj = (!!divId) ? $("#" + divId) : null;
	var programmaticScroll = false;
	var allowAutoScrolling = true;
	var externallySetAllowAutoScrolling = true;
	
	var basePath = "/";
	
	var showGameSeparators = false;
	var onEditEnd = undefined;
	var editSubmit = undefined;
	if (settings != undefined) {
		if (settings.showGameSeparators != undefined) {
			showGameSeparators = settings.showGameSeparators;
		}
		if (settings.onEditEnd != undefined) {
			onEditEnd = settings.onEditEnd;
		}
		if (settings.editSubmit != undefined) {
			editSubmit = settings.editSubmit;
		}
	}
	
	var currentClickHandler = undefined;
	var currentDeleteHandler = undefined;
	var internalStatList = [];
	if (StatList.nextStatEntryId == undefined) {
		StatList.nextStatEntryId = 0;
	}
	
	init();
	
	function init() {
		divObj.html("<ul id='" + divId + "-statList'></ul>");
		
		divObj.scroll(function () {
			handleScrollEvent();
		});
		
		divObj.bind('dragstart', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            var target = ev.originalEvent.target;
            
            var offset = $(target).offset();
    		var clickX = ev.pageX - offset.left; 
    		var clickY = ev.pageY - offset.top;
            
    		var entryId = htmlIdToEntryId(target.id);
    		var entry = getEntryById(entryId);
    		var event = entry.event;
    		
            dt.setDragImage( target, clickX, clickY);
            
            dt.setData("text/text", event.getName());
            dt.setData("text/html", $(target).html());
            dt.setData("stateasy/entryId", entry.id);
            dt.setData("stateasy/statId", event.getId());
            dt.setData("stateasy/source", divId);
            
            $(target).addClass("dragging");
            
            return true;
        }).bind('dragend', function(ev) {
            var target = ev.originalEvent.target;
            
        	$(target).removeClass("dragging");
        	
            return false;
        });
		
		divObj.delegate("#" + divId + " .statEntry", "click", function (jsEvent) {
			jsEvent.stopPropagation();
			jsEvent.preventDefault();
			
			var eventObj = $(this);
			var i = htmlIdToEntryIndex(this.id);
			var event = internalStatList[i];
			var eventId = internalStatList[i].id;
			
			if (currentClickHandler) {
				currentClickHandler(event.event, eventObj, eventId);
			}
		});
		
		divObj.delegate("#" + divId + " .statEntry .delete", "click", function (jsEvent) {
			jsEvent.stopPropagation();
			jsEvent.preventDefault();
			
			var eventObj = $(this.parentNode.parentNode);
			var i = htmlIdToEntryIndex(this.parentNode.parentNode.id);
			var event = internalStatList[i];
			var eventId = internalStatList[i].id;
			
			if (currentDeleteHandler) {
				currentDeleteHandler(event.event, eventObj, eventId);
			}
		});
		
		divObj.delegate("#" + divId + " .statEntry .cancel", "click", function (jsEvent) {
			jsEvent.stopPropagation();
			jsEvent.preventDefault();
			
			var i = htmlIdToEntryIndex(this.parentNode.parentNode.parentNode.id);
			var event = internalStatList[i];
			var eventId = internalStatList[i].id;
			
			hideEditEntry(eventId);
		});
		
		divObj.delegate("#" + divId + " .statEntry input", "keydown", function (jsEvent) {
			if (jsEvent.keyCode == 27) {
				jsEvent.stopPropagation();
				jsEvent.preventDefault();
				
				var i = htmlIdToEntryIndex(this.parentNode.parentNode.parentNode.id);
				var event = internalStatList[i];
				var eventId = internalStatList[i].id;
				
				hideEditEntry(eventId);
			}
		});
		
		divObj.delegate("#" + divId + " .statEntry .submit", "click", function (jsEvent) {
			jsEvent.stopPropagation();
			jsEvent.preventDefault();
			
			$(this.parentNode).submit();
		});
		
		divObj.delegate("#" + divId + " .statEntry form", "submit", function (jsEvent) {
			jsEvent.stopPropagation();
			jsEvent.preventDefault();
			
			var i = htmlIdToEntryIndex(this.parentNode.parentNode.id);
			var event = internalStatList[i];
			
			var value = $("input", this).val();
			
			var newText = editSubmit(value, event.event);
			if (newText) {
				$(".interactive", this.parentNode.parentNode).html(newText);
			}
			
			hideEditEntry(internalStatList[i].id);
		});
	}
	
	function unbindAll() {
		divObj.unbind('scroll').unbind('dragstart').unbind('dragend');
		divObj.undelegate("#" + divId + " .statEntry", "click")
			.undelegate("#" + divId + " .statEntry .delete", "click")
			.undelegate("#" + divId + " .statEntry .cancel", "click")
			.undelegate("#" + divId + " .statEntry input", "keydown")
			.undelegate("#" + divId + " .statEntry .submit", "click")
			.undelegate("#" + divId + " .statEntry form", "submit");
	}
	this.unbindAll = unbindAll;
	
	/***************************************************************************
	 *             Click Handlers for Entry clicks & Delete image clicks
	 **************************************************************************/
	/**
	 * Set the click handler for all stat entries in this StatList.  This has the
	 * added side effect of adding a 'clickable' class to every stat in this StatList.
	 * @param callback The callback that will be called for every stat in this StatList.
	 * It must take two parameters: the stat object and the DOM object associated
	 * to that stat object in this StatList.
	 * @return
	 */
	function setClickHandler(callback) {
		$(".statEntry", divObj).addClass('clickable');
		currentClickHandler = callback;
	}
	this.setClickHandler = setClickHandler;
	
	/**
	 * Set the deletion handler for all stat entries in this StatList.  This has the
	 * added side effect of adding a 'deletable' class to every stat in this StatList.
	 * @param callback The callback that will be called when this stat has been 
	 * requested to be deleted.  It must take two parameters: the stat object and
	 * the DOM object associated to that stat object in this StatList.
	 * @return
	 */
	function setDeleteHandler(callback) {
		if (callback) {
			$(".statEntry", divObj).addClass('deletable');
		} else {
			$(".statEntry", divObj).removeClass('deletable');
		}
		currentDeleteHandler = callback;
	}
	this.setDeleteHandler = setDeleteHandler;
	
	/***************************************************************************
	 *                          HTML Content Generation
	 **************************************************************************/
	function getGameSeparatorHtml(targetEvent, id) {
		var groupingHeirarchy = targetEvent.getEventGroupingHeirarchy();
		
		var eventHtml = "";
		for (var i in groupingHeirarchy) {
			var parentGroup = groupingHeirarchy[i];
			eventHtml = "<li>" + parentGroup.name + "</li>" + eventHtml;
		}
			
		eventHtml = "<li class='gameSeparator' id='" + getEntryGameSeparatorId(id, true) + "'><ul>" + eventHtml + "</ul></li>";

		return eventHtml;
	}
	
	/*$.template("StatEasy.statItem", 
		"<li draggable='true' class='" +
				"{{if $item.opaque}}opaque {{/if}}" +
				"{{if $item.deletable}}deletable {{/if}}" + 
				"{{if $item.clickable}}opaque {{/if}}" + 
				"{{if isOpponentStat()}}opponent {{/if}}" + 
				"stat{{= getId()}}' " + 
				"id='{{= entryId}}'>" +
			"<p>{{if isOpponentStat()}}**{{/if}}{{= getName()}}</p>" +
			"<img src='{{= $item.basePath}}images/close.png'/>" +
			"<div class='clear'></div></li>"
	);*/
	
	function getEventHtml(targetEvent, options, id, interactiveOnly) {
		var opaque = false;
		var existingClasses = "";
		if (options != undefined) {
			if (options.opaque != undefined) {
				opaque = options.opaque;
			}
			if (options.classes != undefined) {
				existingClasses = options.classes;
			}
		}
		
		var eventHtml = "";
		var classes = " class='statEntry " + existingClasses + " ";
		if (opaque) {
			classes += "opaque ";
		}
		if (currentDeleteHandler != undefined) {
			classes += "deletable ";
		}
		if (currentClickHandler != undefined) {
			classes += "clickable ";
		}
		classes += "stat" + targetEvent.getStatId() + " ";

		var opponentSpecifier = "";
		if (targetEvent.isOpponentStat()) {
			classes += "opponent ";
			opponentSpecifier = "**";
		}
		classes += "'";
		
		if (!interactiveOnly) {
			eventHtml += "<li draggable='true' " + classes + " id='" + getEntryId(id, true) + "'>";
		}
		eventHtml += "\
				<div class='interactive'>\
					<p>" + opponentSpecifier + targetEvent.getName() + "</p>\
					<img src='" + basePath + "images/close.png' class='delete'/>\
					<div class='clear'></div>\
				</div>";
		if (!interactiveOnly) {
			eventHtml += "\
					<div class='editable'>\
						<form style='margin-bottom: 0;'>\
							<input style='width: 230px; height: 16px;' autocomplete='off' name='value' value='" + targetEvent.getShortcut() + "'>\
							<img class='cancel' src='/images/cancel.png'>\
							<img class='submit' src='/images/ok.png'>\
						</form>\
					</div>\
				</li>";
		}
		
		return eventHtml;
	}
	
	/***************************************************************************
	 *                          Entry Id Conversion
	 **************************************************************************/
	function htmlIdToEntryId(htmlId) {
		var lastDash = htmlId.lastIndexOf("-");
		if (lastDash < 0) {
			return;
		}
		
		return Number(htmlId.substr(lastDash + 1));
	}
	
	function htmlIdToEntryIndex(htmlId) {
		var entryId = htmlIdToEntryId(htmlId);
		return getEntryIndexById(entryId);
	}
	this.htmlIdToEntryIndex = htmlIdToEntryIndex;
	
	function getEntryId(someId, removeHash) {
		var hash = "";
		if (!removeHash) {
			hash = "#";
		}
		return hash + divId + "-event-" + someId;
	}
	this.getEntryId = getEntryId;
	
	function getEntryGameSeparatorId(someId, removeHash) {
		var hash = "";
		if (!removeHash) {
			hash = "#";
		}
		return hash + divId + "-eventSeparator-" + someId;
	}
	
	function getEntryIndexById(entryId) {
		for (var i in internalStatList) {
			if (internalStatList[i].id == entryId) {
				return Number(i);
			}
		}
		
		return undefined;
	}
	this.getEntryIndexById = getEntryIndexById;
	
	function getEntryById(entryId) {
		var index = getEntryIndexById(entryId);
		return internalStatList[index];
	}
	
	/***************************************************************************
	 *             Entry Manipulation (Insertion, Deletion, Moving, Hiding)
	 **************************************************************************/
	function insertStat(stat, options, index) {
		var newEntryId = StatList.nextStatEntryId++;
		if ((index == undefined) || (internalStatList.length <= index)) {
			// This is going at the end of the list
			index = internalStatList.length;
		}
		
		var eventHtml = getEventHtml(stat, options, newEntryId);
		
		// Can we insert this .before() something? Or do we need to .append() based on game ids.
		if (index < internalStatList.length) {
			var nextEvent = internalStatList[index].event;
			var entryId = getEntryId(internalStatList[index].id);
			if (nextEvent.getGameId() == stat.getGameId()) {
				$(entryId).before(eventHtml);
			} else {
				if (index - 1 < 0) {
					$("#" + divId + "-statList").prepend(eventHtml);
				} else {
					entryId = getEntryId(internalStatList[index - 1].id);
					$(entryId).after(eventHtml);
				}
			}
		} else {
			$("#" + divId + "-statList").append(eventHtml);
		}
		
		var statEntryId = getEntryId(newEntryId);
		
		internalStatList.splice(index, 0, {
			event: stat,
			id: newEntryId,
		});
		
		reconcileGameSeparators();
		
		return newEntryId;
	}
	this.insertStat = insertStat;
	
	function updateStat(stat, entryId) {
		var entryIndex = getEntryIndexById(entryId);
		var entryHtmlId = getEntryId(internalStatList[entryIndex].id);
		
		var extraClasses = $(entryHtmlId).hasClass("pastStat") ? "pastStat" : "";
		
		var eventHtml = getEventHtml(stat, {classes : extraClasses}, entryId, currentlyEditing[entryHtmlId]);
		
		$(entryHtmlId + (currentlyEditing[entryHtmlId] ? " .interactive" : "")).replaceWith(eventHtml);
		
		if (currentlyEditing[entryHtmlId]) {
			currentlyEditing[entryHtmlId] = false;
			showEditDOM(entryHtmlId);
		}
	}
	this.updateStat = updateStat;
	
	function reconcileGameSeparators() {
		if (!showGameSeparators) {
			return;
		}
		
		var currentGameId = undefined;
		
		for (var i in internalStatList) {
			var entry = internalStatList[i];
			if (entry.event.getGameId() != currentGameId) {
				currentGameId = entry.event.getGameId();
				
				// There should be a game separator here
				var gameSeparator = $(getEntryGameSeparatorId(entry.id));
				if (gameSeparator.length == 0) {
					$(getEntryId(entry.id)).before(getGameSeparatorHtml(entry.event, entry.id));
				}
			} else {
				// There shouldn't be a game separator here
				var gameSeparator = $(getEntryGameSeparatorId(entry.id));
				if (gameSeparator.length != 0) {
					gameSeparator.remove();
				}
			}
		}
	}
	
	function removeEntry(entryId) {
		var entryIndex = getEntryIndexById(entryId);
		var entryId = getEntryId(internalStatList[entryIndex].id);
		$(entryId).remove();
		var entryGameSeparatorId = getEntryGameSeparatorId(internalStatList[entryIndex].id);
		$(entryGameSeparatorId).remove();
		if (entryIndex != undefined) {
			internalStatList.splice(entryIndex, 1);
		}
		
		reconcileGameSeparators();
	}
	this.removeEntry = removeEntry;
	
	function filterEntriesThatMatch(value) {
		if (value == "") {
			$("#" + divId + " li").removeClass("hidden");//.css("display", "Block");
			return;
		}
		
		value = value.toLowerCase();
		
		for (var i in internalStatList) {
			var entry = internalStatList[i];
			var entryHtmlId = getEntryId(entry.id, true);
			
			// Here we're using the document.getElementById instead of jQuery 
			// because I found it affected performance of the video playback when searching.
			var eventObj = document.getElementById(entryHtmlId);
			
			var className = eventObj.getAttribute("class");
			className = className.replace("displayed", "", "g");
			className = className.replace("hidden", "", "g");
			
			if (entry.event.getName().toLowerCase().indexOf(value) != -1) {
				// Matches
				className += " displayed";
			} else {
				// Non-matches
				className += " hidden";
			}
			eventObj.setAttribute("class", className);
		}
	}
	this.filterEntriesThatMatch = filterEntriesThatMatch;
	
	/***************************************************************************
	 *                          Scrolling Control
	 **************************************************************************/
	function setAllowAutoScrolling(trueOrFalse) {
		externallySetAllowAutoScrolling = trueOrFalse;
	}
	this.setAllowAutoScrolling = setAllowAutoScrolling;
	
	function handleScrollEvent() {
		if (!programmaticScroll) {
			// Pause additional scrolling for 5 seconds
			allowAutoScrolling = false;
			setTimeout(function () {
				allowAutoScrolling = true;
			}, 5000);
		}
	}
	
	/***************************************************************************
	 *                             Entry Effects
	 **************************************************************************/
	var currentlyEditing = {};
	
	//////////////////////////// Editing
	function showEditDOM(jQuerySelector) {
		if (currentlyEditing[jQuerySelector]) {
			return;
		}
		
		$(jQuerySelector).attr("draggable", "");
		$(".editable", jQuerySelector).show();
		$(".editable input", jQuerySelector).select().focus();
		$(".interactive", jQuerySelector).hide();
		
		currentlyEditing[jQuerySelector] = true;
	}
	
	function showEditEntry(entryId) {
		var entryHtmlId = getEntryId(entryId);
		
		showEditDOM(entryHtmlId);
	}
	this.showEditEntry = showEditEntry;
	
	function showEditStat(stat) {
		showEditDOM(".stat" + stat.getId());
	}
	this.showEditStat = showEditStat;
	
	function hideEditDOM(jQuerySelector) {
		$(jQuerySelector).attr("draggable", "true");
		$(".editable", jQuerySelector).hide();
		$(".interactive", jQuerySelector).show();
		
		currentlyEditing[jQuerySelector] = false;
	}
	
	function hideEditEntry(entryId) {
		var entryHtmlId = getEntryId(entryId);
		
		hideEditDOM(entryHtmlId);
	}
	this.hideEditEntry = hideEditEntry;
	
	function hideEditStat(stat) {
		hideEditDOM(".stat" + stat.getId());
	}
	this.hideEditStat = hideEditStat;
	
	//////////////////////////// Highlighting
	function highlightDOM(jQuerySelector) {
		$(jQuerySelector).css("background-color", "red");
		setTimeout(function () {
			console.log("Removing background-color");
			$(jQuerySelector).css("background-color", "");
		}, 1000);
	}
	
	function highlightEntry(entryId) {
		var entryHtmlId = getEntryId(entryId);
		
		highlightDOM(entryHtmlId);
	}
	this.highlightEntry = highlightEntry;
	
	function highlightStat(stat) {
		highlightDOM(".stat" + stat.getId());
	}
	this.highlightStat = highlightStat;
	
	//////////////////////////// Fading
	function fadeDOM(jQuerySelector, opponentStat) {
		$(jQuerySelector).addClass("pastStat");
	}
	
	function fadeEntry(entryId) {
		var entryHtmlId = getEntryId(entryId);
		var event = getEntryById(entryId).event;
		
		fadeDOM(entryHtmlId, event.isOpponentStat());
	}
	this.fadeEntry = fadeEntry;
	
	function fadeStat(stat) {
		fadeDOM(".stat" + stat.getId(), stat.isOpponentStat());
	}
	this.fadeStat = fadeStat;
	
	//////////////////////////// Unfading
	function unfadeDOM(jQuerySelector) {
		$(jQuerySelector).removeClass("pastStat opaque");
	}
	
	function unfadeEntry(entryId) {
		var entryHtmlId = getEntryId(entryId);
		unfadeDOM(entryHtmlId);
	}
	this.unfadeEntry = unfadeEntry;
	
	function unfadeStat(stat) {
		unfadeDOM(".stat" + stat.getId());
	}
	this.unfadeStat = unfadeStat;
	
	//////////////////////////// Scrolling
	function scrollToEntry(entryId) {
		if (!allowAutoScrolling || !externallySetAllowAutoScrolling || programmaticScroll) {
			return;
		}
		var entryHtmlId = getEntryId(entryId);
		
		if ($(entryHtmlId).hasClass("hidden")) {
			// If the stat isn't shown, we can't scroll to it 
			return;
		}
		
		var divOffset = $("#" + divId).offset().top;
		var pOffset = $(entryHtmlId).offset().top - $("#" + divId).height() / 2;
		var pScroll = pOffset - divOffset;
		programmaticScroll = true;
		$("#" + divId).animate({scrollTop: "+=" + pScroll}, 500, null, function () { 
			// Once the scrolling animation completes, we know that any scroll event is user generated.
			programmaticScroll = false;
		});
	}
	this.scrollToEntry = scrollToEntry;
}

function SearchBox(divId, settings) {
	var dataManager = settings.dataManager;
	var statList = settings.statList;
	
	$("#" + divId + " input").keyup(filterEvents);
	$("#" + divId + " input").focus(clearIfNecessary);
	$("#" + divId + " .clearSearch").click(clearSearchNow);
	
	function clearSearchNow() {
		$("#" + divId + " input").val("");
		statList.filterEntriesThatMatch("");
	}
	
	function clearIfNecessary() {
		var value = $(this).val();
		
		if (value == "Search...") {
			$(this).val("");
		}
	}
	
	function filterEvents() {
		var value = $(this).val();
		
		if (value == "") {
			statList.filterEntriesThatMatch(value);
			return;
		}
		
		var re = /(;?)#(\d+)/;
		var match = re.exec(value);
		if (match) {
			var semicolon = match[1];
			var playerNumber = parseInt(match[2]);
			
			var playerMap = dataManager.allPlayers;
			if (semicolon) {
				playerMap = dataManager.allOpponents;
			}
			
			var player = null;
			for (playerId in playerMap) {
				if (playerMap[playerId].number == playerNumber) {
					player = playerMap[playerId];
				}
			}
			var replaceText = "NOTXXFOUND";
			if (player) {
				value = value.replace(re, player.lastName + ", " + player.firstName);
			}
		}
		
		statList.filterEntriesThatMatch(value);
	}

}

SearchBox.getSearchHtml = function (someDivId) {
	return "<div id='" + someDivId + "' class='search'>\
    		<span class='sbox_left'></span>\
    		<span class='sbox'><input type='input' value='Search...' autosave='bsn_srch' results='5' name='search' class='lightText'/></span>\
    		<span class='sbox_right clearSearch'></span>\
		</div>";
}