/*
 * Required for all LiveViews
 */

// ATTENTION: The name of this LV must be HelpLiveView, because a LV named HelpLiveView is mandatory.
var classname = "HelpLiveView";
var version = 6.8;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function HelpLiveView(myTargetDivId, dataManager) {
	this.targetDivId = myTargetDivId;
	
	this.shown = false;
	this.valid = false;
	
	this.statGroups = {
			'Formation' 		: { title : 'Formations', canAdd : true, stats : [] },
			'Play_Call' 		: { title : 'Play Calls', canAdd : true, stats : [] }, 
			'Motion'			: { title : 'Motions', canAdd : true, stats : [] },
			'Back_Set'			: { title : 'Back Sets', canAdd : true, stats : [] },
			'Formation_Shift'	: { title : 'Formation Shifts', canAdd : true, stats : [] }, 
			'Blitz'				: { title : 'Blitzes', canAdd : true, stats : [] },
			'Normal_Stat'		: { title : 'Stats', canAdd : false, stats : [] }
	}

	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {
		$("#" + this.targetDivId).append("<div class='fb_tables'></div>");
		var fb_tables = $("#" + this.targetDivId).find('.fb_tables');
		
		// Build tables for special meta-stat groups
		for (var i in this.statGroups) {
			buildStatTable(fb_tables, this.statGroups[i].title, i, this.statGroups[i].canAdd);
		}
		
		$(".hideable_title").click(function() {
			
			$(this).parent().find('.hideable').toggle();
			
			// Save in local storage
			var localStorageName = getLocalStorageName($(this).parent().attr('id'));
			if ($(this).parent().find('.hideable').is(':visible')) {
				localStorage.setItem(localStorageName, true);
			} else {
				localStorage.setItem(localStorageName, false);
			}
			
			$(this).parent().find('.arrow').each(function() {
				if ($(this).attr('src') === "/images/arrow_right.png") {
					$(this).attr('src', '/images/arrow_down.png');
				} else {
					$(this).attr('src', '/images/arrow_right.png');
				}
			});
		});
		
		for (var i in this.statGroups) {
			if (localStorage.getItem(getLocalStorageName(i)) == "true") {
				showDiv(i);
			}
		}
		
		$('.addStatType').click(showAddStatDialog);
	}
	this.prepareToShow = prepareToShow;
	
	function showDiv(i) {
		$("#" + i + " .hideable").show();
		$("#" + i + " .arrow").attr('src', '/images/arrow_down.png');
	}
	
	function getLocalStorageName(id) {
		return "football.helpLiveView.statGroups." + id + ".visible";
	}
	
	function buildStatTable(parentDiv, title, id, canAdd) {
		var canAddText = "";
		var parseInformation = "<th>Parse Information</th>";
		if (canAdd) {
			canAddText = "<div class='addStatType'>Add " + id.replace("_", " ") + "</div>";
			parseInformation = "";
		}
		parentDiv.append("<div class='tableContainer fb_table' id='" + id + "'>" + canAddText + "<img src='/images/arrow_right.png' class='arrow' /><div class='hideable_title' style='font-weight: bold; font-size: large'>" + title + "</div><div class='clear'></div>");
		parentDiv.find('#' + id).append("<div class='hideable'><table class='striped tablesorter stickyHeaderTable cellspacing'><thead><tr><th>Name</th><th>Shortcut</th>" + parseInformation + "</tr></thead><tbody></tbody></table></div>");
	}
	
	function invalidate() {
		this.valid = false;
	}
	this.invalidate = invalidate;
	
	function constructPlayerTable(parentDiv, playerSource, title) {
		var ourPlayers = "<div class='tableContainer'><span style='font-weight: bold; font-size: large'>" + title + "</span>" +
			"<table class='striped tablesorter stickyHeaderTable cellspacing'>" +
			"<thead><tr><th>First</th><th>Last</th><th>Number</th><th>Shortcut</th></tr></thead><tbody>";
		
		var playerList = [];
		for (var i in playerSource) {
			playerList.push(playerSource[i]);
		}
		playerList.sort(function (a, b) {
			return a.lastName.localeCompare(b.lastName);
		});
		
		for (player in playerList) {
			var number = playerList[player].number;
			var shortcut = playerList[player].shortcut;
			ourPlayers += "<tr><td>" + playerList[player].firstName + "</td><td>" + playerList[player].lastName + "</td><td>" + number + "</td><td>" + shortcut + "</td></tr>";
		}
		ourPlayers += "</tbody></table></div>";
		
		parentDiv.append(ourPlayers);
	}
	
	function formatStatInfo(statInfo) {
		var parseInformation = "";
		
		if (statInfo.statEffectProvided) {
			parseInformation += "<span class='statEffectProvided'>";
		}
		
		parseInformation += "(";
		
		if (statInfo.textData != null) {
			parseInformation += statInfo.textData;
		} else {
			switch(statInfo.type) {
				case 'player':
					parseInformation += "Player";
					break;
				case 'numerical':
					parseInformation += "Data Point";
					break;
				case 'opponent':
					parseInformation += "Opponent";
					break;
				case 'time':
					parseInformation += "Time";
					break;
			}
			if ((statInfo.extraInformation != undefined) && 
				(statInfo.extraInformation.length > 0)) 
			{
				parseInformation += " values: ";
				for (var j in statInfo.extraInformation) {
					if (j != 0) {
						parseInformation += ", ";
					}
					parseInformation += statInfo.extraInformation[j].shortcut;
				}
				if (statInfo.allDigitsAllowed) {
					parseInformation += ", and all digits";
				}
			}
		}
		
		parseInformation += ")";
		
		if (statInfo.statEffectProvided) {
			parseInformation += "</span>";
		}
		
		parseInformation += " ";
		
		return parseInformation;
	}
	
	function updateStatTable(id, statList, canAdd) {
		var statDiv = $("#" + id);
		statDiv.find("table tbody tr").remove();
		
		statList.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
		
		for (var stat in statList) {
			var name = statList[stat].name;
			var shortcut = statList[stat].shortcut;
			
			var parseInformationDiv = "";
			if (!canAdd) {
				var parseInformation = "";
				for (var i in statList[stat].fullSentence) {
					if ((statList[stat].firstStatEffectIndex == undefined) || (i < statList[stat].firstStatEffectIndex)) {
						var statInfo = statList[stat].fullSentence[i];
						if (statInfo.textOnly) {
							parseInformation += statInfo.textData + " ";
						} else {
							parseInformation += formatStatInfo(statInfo);
						}
					}
				}
				parseInformationDiv = "<td>" + parseInformation + "</td>";
			}
			
			statDiv.find("table tbody").append("<tr><td>" + name + "</td><td>" + shortcut + "</td>" + parseInformationDiv + "</tr>");
		}
	}
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}
		
		for (var i in this.statGroups) {
			this.statGroups[i].stats = [];
		}
		
		for (var stat in dataManager.statTypes) {
			var thisStat = dataManager.statTypes[stat];
			
			if (thisStat.statEffectName !== undefined && thisStat.statEffectName.replace(" ", "_") in this.statGroups) {
				this.statGroups[thisStat.statEffectName.replace(" ", "_")].stats.push(thisStat);
			} else {
				this.statGroups["Normal_Stat"].stats.push(thisStat);
			}
		}
		
		// Build player tables
		$(".player_tables").remove();
		$(".fb_tables").after("<div class='player_tables'></div>");
		var player_tables = $("#" + this.targetDivId).find('.player_tables');
		constructPlayerTable(player_tables, dataManager.allPlayers, "Our Players:");
		constructPlayerTable(player_tables, dataManager.allOpponents, "Their Players:");
		$("#" + this.targetDivId).append("<div class='clear'></div>");
		
		for (var i in this.statGroups) {
			updateStatTable(i, this.statGroups[i].stats, this.statGroups[i].canAdd);
		}
		
		$(".tablesorter").tablesorter();
		
		$('.stickyHeaderTable').each(function() {
			$(this).stickyHeaders;
		});
		
		this.shown = true;
		this.valid = true;
	}
	this.show = show;
	
	function showAddStatDialog() {
		var type = $(this).parent().attr('id');
		var controls = '<table>' +
							'<tr><td style="white-space:nowrap;">Name:</td><td><input type="text" id="statTypeName" name="statTypeName"/></td></tr>' +
							'<tr><td style="white-space:nowrap;">Shortcut:</td><td><input type="text" id="statTypeShortcut" name="statTypeShortcut"/></td></tr>' +
						'</table>' +
						'<input type="hidden" name="statTypeType" id="statTypeType" value="' + type + '" />';
		var addStatTypeDiv = $("<div id='addStatTypeDialog' title='Add New Formation'><p>Enter a name and shortcut for the new formation:</p>" + controls + "</div>")
		$('#HelpLiveView_Div').append(addStatTypeDiv);
		$("#addStatTypeDialog").dialog({ closeText: '',
												modal: 'true',
												width: 'auto',
											 	buttons: { "Add formation": function() { createNewStatType(this); },
														   "Cancel": function() { $(this).dialog("close"); } },
												close: function(ev, ui) {
													$(this).remove();
												}
										});
		$("#statTypeName").focus();
	}
	
	function validateShortcutUnique(field, msg) {
		var shortcut = $("#" + field).val();
		for (var i in dataManager.statTypes) {
			if (dataManager.statTypes[i].shortcut == shortcut) {
				buildPromptAndBinding(field, msg);
				$("#" + field).focus();
				
				return false;
			}
		}
		
		return true;
	}
	
	function createNewStatType(thisDialog) {
		if (!validateNotEmpty("statTypeName","This field is required. Please enter a name.")) return;
		if (!validateNotEmpty("statTypeShortcut","This field is required. Please enter a shortcut.")) return;
		if (!validateShortcutUnique("statTypeShortcut","Shortcut must be unique.")) return;
		var statType = {
			name : $('#statTypeName').val(),
			shortcut : $('#statTypeShortcut').val(),
			type : $('#statTypeType').val().replace("_", " ")
		};
		dataManager.addStatType(statType, {});
		$(thisDialog).dialog("close");
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
}

