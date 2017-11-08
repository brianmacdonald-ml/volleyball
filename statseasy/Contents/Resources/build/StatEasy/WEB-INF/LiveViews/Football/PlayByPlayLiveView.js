/*
 * Required for all LiveViews
 */
var classname = "PlayByPlayLiveView";
var version = 2.8;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function PlayByPlayLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
		
	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {}
	this.preparetoShow = prepareToShow;
	
	function invalidate() {
		this.valid = false;
	}
	this.invalidate = invalidate;
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (self.shown && self.valid) {
			return;
		}
		
		if (!self.shown) {
			addAllHtml();
		}
		
		var stateNames = collectAllStateNames(dataManager.allStats);
		var columnGroups = getColumnGroups();
		
		var tableHtml = "<table cellspacing='0' class='striped tablesorter statTable'>";
		
		var headHtml = "<thead>";
		headHtml += getColumnGroupHtml(columnGroups, stateNames);
		headHtml += "<tr><th>#</th>";
		for (var i in stateNames) {
			var classStr = isSeparatorCol(columnGroups, Number(i) + 1) ? " class='separatorCol'" : "";
			headHtml += "<th" + classStr + ">" + stateNames[i][0] + "</th>";
		}
		headHtml += "</tr></thead>"; 
		
		tableHtml += headHtml + "<tbody>";
		
		tableHtml += getTableHtml(filterStats(dataManager.allStats), stateNames, columnGroups);
		
		tableHtml += "</tbody><tbody><tr class='thebottomrow'><td colspan=" + (1 + stateNames.length) + ">&nbsp;</td></tr></tbody></table>";
		
		$("#" + self.targetDivId + "-stateContainer").html(tableHtml);
		
		$("#" + self.targetDivId + "-stateContainer").delegate("table tr", "click", playClickHandler);
		
		$(".tablesorter").tablesorter().stickyHeaders();
		
		makeExplicitWidths("#" + self.targetDivId + "-stateContainer table");
		
		adjustContainerWidth();
		scrollToBottom();
		
		self.shown = true;
		self.valid = true;
		self.drawn = true;
		
	}
	this.show = show;
	
	function adjustContainerWidth() {
		var div = $("#" + self.targetDivId);
		var headerWidth = div.find('thead').width();
		div.css('min-width', headerWidth + 27);
	}
	
	function scrollToBottom() {
		var divOffset = $("#" + self.targetDivId + "-stateContainer").offset().top;
		var pOffset = $("#" + self.targetDivId + "-stateContainer table").offset().top + $("#" + self.targetDivId + "-stateContainer table").height() - $("#" + self.targetDivId + "-stateContainer").height();
		var pScroll = pOffset - divOffset;
		
		$("#" + self.targetDivId + "-stateContainer").animate({scrollTop: "+=" + pScroll}, 500, null);
	}
	
	function makeExplicitWidths(table) {
		$("thead th", table).each(function (index) {
			var width = $(this).width();
			$(this).width(width);
		});
		$("tbody tr:nth-child(1) td", table).each(function (index) {
			var width = $(this).width();
			$(this).width(width);
		});
		$("thead", table).css({
			position : 'absolute',
			top      : '21px',
		});
		var height = $("thead", table).outerHeight();
		$("#" + self.targetDivId + "-stateContainer").css("margin-top", height + "px");
	}
	
	function playClickHandler() {
		var id = $(this).attr("statId");
		var stat = dataManager.getStatById(id);
		if (dataManager.viewer != undefined) {
			dataManager.viewer.highlightStat(stat);
			dataManager.viewer.scrollToStat(stat);
			dataManager.viewer.resetFocus();
		}
	}
	
	function getColumnGroupHtml(columnGroups, stateNames) {
		var groupHtml = "";
		
		if (columnGroups.length > 0) {
			groupHtml += "<tr class='columnGroup'>";
			
			// We'll (potentially) need an initial th to span up to the first group
			if (columnGroups[0].startIndex > 0) {
				groupHtml += "<td class='separatorCol' colspan='" + columnGroups[0].startIndex + "'>&nbsp;</td>";
			}
			
			for (var i in columnGroups) {
				groupHtml += "<td class='separatorCol' colspan='" + (columnGroups[i].endIndex - columnGroups[i].startIndex + 1) + "'>" + columnGroups[i].name + "</td>";
			}
			
			// We'll also (potentially) need a trailing th to span to the last column
			if (columnGroups[columnGroups.length - 1].endIndex < stateNames.length) {
				groupHtml += "<td class='separatorCol' colspan='" + (stateNames.length - columnGroups[0].endIndex) + "'>&nbsp;</td>";
			}
			
			groupHtml += "</tr>";
		}
		
		return groupHtml;
	}
	
	function isSeparatorCol(columnGroups, index) {
		for (var i in columnGroups) {
			if ((index + 1 == columnGroups[i].startIndex) || 
				(index == columnGroups[i].endIndex)) 
			{
				return true;
			}
		}
		
		return false;
	}
	
	var terminatingPlayNames = ["Sack", "Tackle", "Touchdown", "Pass Incomplete"];
	var infoPlayNames = ["Run", "Pass Complete", "Sack", "Pass Incomplete", "Punt"];
	
	function filterStats(filterThese) {
		var intoThese = [];
		
		var groupOpen = false;
		var groupIndex = 0;
		for (var i in filterThese) {
			groupOpen = groupOpen || filterThese[i].getName() == "Snap";
			var statTypeName = dataManager.statTypes[filterThese[i].getStatType()].name;
			
			if (infoPlayNames.some(matches(statTypeName))) {
				intoThese.push(filterThese[i]);
			}
			
			var groupTerminated = terminatingPlayNames.some(matches(statTypeName));
			if (groupOpen && groupTerminated) {
				groupOpen = false;
			}
		}
		
		return intoThese;
	}
	
	function matches(someName) {
		return function (element) {
			return element == someName;
		};
	}
	
	function getTableHtml(fromTheseStats, gameStateNames, columnGroups) {
		var tableHtml = "";
		
		for (var i in fromTheseStats) {
			var stat = fromTheseStats[i];
			
			var classStr = isSeparatorCol(columnGroups, 0) ? " class='separatorCol'" : "";
			tableHtml += "<tr class='statBehavior stat" + stat.getId() +"' statId='" + stat.getId() + "'><td" + classStr + ">" + (Number(i) + 1) + "</td>";
			
			for (var j in gameStateNames) {
				classStr = isSeparatorCol(columnGroups, Number(j) + 1) ? " class='separatorCol'" : "";
				tableHtml += "<td" + classStr + ">" + composeValueFromStat(stat, gameStateNames[j][1]) + "</td>";
			}
			
			tableHtml += "</tr>";
		}
		
		return tableHtml;
	}
	
	function composeValueFromStat(stat, declaration) {
		var fromState = stat.getBeginningGameState();
		
		if (typeof declaration == "string") {
			return fromState[declaration] || "?";
		} else if (typeof declaration == "function") {
			return declaration(stat);
		} else {
			var value = "";
			for (var i in declaration) {
				var stateName = declaration[i];
				if (fromState[stateName] != undefined) {
					if (value != "") {
						value += " ";
					}
					value += fromState[stateName];
				}
			}
			return value || "?";
		}
	}
	
	function getGainFromStat(stat) {
		// Run for a gain, pass complete for a gain, or sack for a loss
		var gainIndex = {
			"Sack" : 2,
			"Run"  : 1,
			"Pass Complete" : 1,
		};

		var checkIndex = gainIndex[dataManager.statTypes[stat.getStatType()].name];
		if (checkIndex != undefined) {
			return stat.getStatData(checkIndex) != undefined ? stat.getStatData(checkIndex) : "?";
		}
		
		return 0;
	}
	
	function getRunPassSelection(stat) {
		// Run for a gain, pass complete for a gain, or sack for a loss
		var selection = {
			"Sack" : "P",
			"Run"  : "R",
			"Pass Complete" : "P",
			"Pass Incomplete" : "P",
		};

		return selection[dataManager.statTypes[stat.getStatType()].name] || "?";
	}
	
	function getPossessionTeam(stat) {
		var fromState = stat.getBeginningGameState();
		if (fromState.hasBall == "weDo") {
			return dataManager.game.ourTeamName;
		} else if (fromState.hasBall == "theyDo") {
			return dataManager.game.theirTeamName;
		} else {
			return "?";
		}
	}
	
	function getColumnGroups() {
		return [
	        	{
	        		name : "Offense",
	        		startIndex : 6,
	        		endIndex : 9,
	        	},
	        	{
	        		name : "Defense",
	        		startIndex : 10,
	        		endIndex : 12,
	        	},
	        	{
	        		name : "Score",
	        		startIndex : 13,
	        		endIndex : 14,
	        	},
		    ];
	}
	
	function getYardLine(stat) {
		var fromState = stat.getBeginningGameState();
		var yardLine = fromState.yardLine;
		yardLine = 50 - Math.abs(yardLine);
		
		if (fromState.yardLine < 0) {
			yardLine = yardLine * -1;
		}
		
		return yardLine;
	}
	
	function collectAllStateNames(fromTheseStats) {
		var stateNamesArray = [
		    ["Down" , "down"],
		    ["Dist", "distance"],
		    ["YL", getYardLine],
		    ["Poss", getPossessionTeam],
		    ["Hash", "hash"],
		    ["Formation", ["formation", "backSet", "formationShift", "motion"]],
		    ["Play Call", "playCall"],
		    ["R/P", getRunPassSelection],
		    ["Gain", getGainFromStat],
		    ["Front", "front"],
		    ["Blitz", "blitz"],
		    ["Cov.", "coverage"],
		    [dataManager.game.ourTeamName, "ourScore"],
		    [dataManager.game.theirTeamName, "theirScore"],
	    ];
		
		return stateNamesArray;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//                          HTML Manipulation
	////////////////////////////////////////////////////////////////////////////
	function addAllHtml() {
		var myDiv = $("#" + self.targetDivId);
		
		var allHtml = "\
			<div id='" + self.targetDivId + "-stateContainer' style='height:400px;overflow-y:scroll'></div>";
		
		myDiv.html(allHtml);
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

