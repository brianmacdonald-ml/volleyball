/*
 * Required for all LiveViews
 */
var classname = "DebugLiveView";
var version = 1.3;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function DebugLiveView(myTargetDivId, dataManager) {
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
		
		var showBeginningGameState = $("#" + self.targetDivId + "-stateSelector").attr("checked");
		var stateNames = collectAllStateNames(dataManager.allStats, showBeginningGameState);
		
		var tableHtml = "<table cellspacing='0' class='striped'><tr><th>Index</th><th>Name</th><th>Opp?</th><th>Seek Time</th><th>Time</th><th>End Time</th><th>Game Time</th>";
		for (var i in stateNames) {
			tableHtml += "<th>" + stateNames[i] + "</th>";
		}
		tableHtml += "</tr>";
		
		tableHtml += getTableHtml(dataManager.allStats, showBeginningGameState, stateNames);
		
		tableHtml += "<tr class='thebottomrow'><td colspan=" + (7 + stateNames.length) + ">&nbsp;</td></tr></table>";
		
		$("#" + self.targetDivId + "-stateContainer").html(tableHtml);
		
		self.shown = true;
		self.valid = true;
		self.drawn = true;
		
	}
	this.show = show;
	
	function getTableHtml(fromTheseStats, fromBeginning, gameStateNames) {
		var tableHtml = "";
		var whichState = fromBeginning ? "getBeginningGameState" : "getEndingGameState";
		
		for (var i in fromTheseStats) {
			var stat = fromTheseStats[i];
			
			tableHtml += "<tr><td>" + stat.getStatIndex() + "</td>" +
					"<td>" + stat.getName() + "</td>" +
					"<td>" + stat.isOpponentStat() + "</td>" +
					"<td>" + stat.getSeekTime() + "</td>" +
					"<td>" + stat.getTime() + "</td>" +
					"<td>" + stat.getEndTime() + "</td>" +
					"<td>" + stat.getGameTime() + "</td>";
			
			var state = stat[whichState]();
			for (var j in gameStateNames) {
				var value = state[gameStateNames[j]];
				tableHtml += "<td>" + (value != undefined ? value : "?") + "</td>";
			}
			
			tableHtml += "</tr>";
		}
		
		return tableHtml;
	}
	
	function collectAllStateNames(fromTheseStats, fromBeginning) {
		var stateNames = {};
		var whichState = fromBeginning ? "getBeginningGameState" : "getEndingGameState";
		for (var i in fromTheseStats) {
			var stat = fromTheseStats[i];
			var state = stat[whichState]();
			for (var name in state) {
				stateNames[name] = 1;
			}
		}
		
		delete stateNames.id;
		
		var stateNamesArray = [];
		for (var i in stateNames) {
			stateNamesArray.push(i);
		}
		
		stateNamesArray.sort();
		
		return stateNamesArray;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//                          HTML Manipulation
	////////////////////////////////////////////////////////////////////////////
	function addAllHtml() {
		var myDiv = $("#" + self.targetDivId);
		
		var allHtml = "<h2>GameState</h2><p>Display \
			<input type='radio' name='state' value='Beginning Game State' checked='checked' id='" + self.targetDivId + "-stateSelector'>Beginning Game State</input>\
			or <input type='radio' name='state' value='Ending Game State'/>Ending Game State</input></p>\
			<div id='" + self.targetDivId + "-stateContainer'></div>";
		
		myDiv.html(allHtml);
		
		myDiv.delegate("input", "click", function () {
			self.valid = false;
			show();
		});
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

