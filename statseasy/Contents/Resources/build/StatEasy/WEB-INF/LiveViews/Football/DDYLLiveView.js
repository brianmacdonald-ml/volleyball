/*
 * Required for all LiveViews
 */
var classname = "DDYLLiveView";
var version = 2.1;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function DDYLLiveView(myTargetDivId, dataManager) {
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
	
	function resize() {
		var relevantDiv = document.getElementById(this.targetDivId);
		var canvas = document.getElementById("RotationAndScoreCanvas");
		canvas.setAttribute('width', $(relevantDiv).width() + 10);
		canvas.setAttribute('height', $(relevantDiv).height() + 20);
	}
	this.resize = resize;
	
	var copyGameStates = [
	    "down",
	    "distance",
	    "quarter",
	    "ourScore",
	    "theirScore",
	];
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}
		
		var myDiv = $("#" + self.targetDivId);
		
		if (!self.shown) {
		
			var innerHtml ="\
				<div class='scoreboard'>\
					<div class='topRow'>\
						<div class='dataItem'>\
							<div class='label'>BALL ON</div>\
							<div class='value yardLine'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>DOWN</div>\
							<div class='value down'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>YDS TO GO</div>\
							<div class='value distance'>&nbsp;</div>\
						</div>\
					</div>\
					<div class='clear'></div>\
					<div class='bottomRow'>\
						<div class='dataItem' style='margin-left:22px;'>\
							<div class='value quarter'>&nbsp;</div>\
							<div class='label'>QUARTER</div>\
						</div>\
						<div class='dataItem drive' style='margin-left:25px;margin-right:6px;'>\
							<div class='value driveInfo'>&nbsp;</div>\
							<div class='label'>DRIVE</div>\
						</div>\
					</div>\
				</div>\
				<table class='striped' cellspacing='0' style='float:left'>\
					<tr>\
						<th class='separatorCol'>&nbsp;</th>\
						<th class='separatorCol'>1</th>\
						<th class='separatorCol'>2</th>\
						<th class='separatorCol'>3</th>\
						<th class='separatorCol'>4</th>\
						<th class='separatorCol'>T</th>\
					</tr><tr>\
						<td class='separatorCol'><span class='weDo poss'></span>" + dataManager.game.ourTeamName + "</td>\
						<td class='ourScoreQ1 separatorCol'>-</td>\
						<td class='ourScoreQ2 separatorCol'>-</td>\
						<td class='ourScoreQ3 separatorCol'>-</td>\
						<td class='ourScoreQ4 separatorCol'>-</td>\
						<td class='ourScore separatorCol'>-</td>\
					</tr><tr>\
						<td class='separatorCol'><span class='theyDo poss'></span>" + dataManager.game.theirTeamName + "</td>\
						<td class='theirScoreQ1 separatorCol'>-</td>\
						<td class='theirScoreQ2 separatorCol'>-</td>\
						<td class='theirScoreQ3 separatorCol'>-</td>\
						<td class='theirScoreQ4 separatorCol'>-</td>\
						<td class='theirScore separatorCol'>-</td>\
					</tr><tr class='thebottomrow'>\
						<td colspan='6'>&nbsp;<td>\
					</tr>\
				</table><div class='clear'></div>";
			
			myDiv.html(innerHtml);
		}
		
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			gameState = {
				ourScore : 0,
				theirScore : 0,
			};
		}
		
		for (var i in copyGameStates) {
			var stateName = copyGameStates[i];
			var stateValue = gameState[stateName];
			$("." + stateName, myDiv).html(stateValue);
		}
		if (gameState["yardLine"] != undefined) {
			var hOrA = gameState["yardLine"] > 0 ? "A" : "H";
			if (Math.abs(gameState["yardLine"]) == 0) {
				hOrA = "";
			}
			if (yardsToTouchdown(gameState) <= Number(gameState["distance"])) {
				$(".distance", myDiv).html("GL");
			}
			$(".yardLine", myDiv).html(hOrA + (50 - Math.abs(gameState["yardLine"])));
		}
		
		// Posession
		$(".poss", myDiv).html("");
		$("." + gameState["hasBall"], myDiv).html("*");
		
		// Drive information
		var startingYardLine = undefined;
		var endingYardLine = gameState["yardLine"];
		var numPlays = 0;
		var currentPoss = gameState["hasBall"];
		var i = dataManager.allStats.length - 1
		while ((0 <= i) && (dataManager.allStats[i].getEndingGameState()["hasBall"] == currentPoss)) {
			var currentStat = dataManager.allStats[i];
			var statTypeName = dataManager.statTypes[currentStat.getStatType()].name;
			if ((statTypeName == "Pass Complete") || (statTypeName == "Pass Incomplete") || (statTypeName == "Run")) {
				startingYardLine = currentStat.getBeginningGameState()["yardLine"];
				numPlays++;
			}
			i--;
		}
		
		if (startingYardLine != undefined) {
			var distance = distanceBetween(startingYardLine, endingYardLine, currentPoss == "theyDo");
			$(".driveInfo", myDiv).html(numPlays + " - " + distance);
		} else {
			$(".driveInfo", myDiv).html("0 - 0");
		}
		
		// Quarter scores
		var ourQScore = 0;
		var theirQScore = 0;
		var quarter = 0;
		for (var i in dataManager.allStats) {
			var currentStat = dataManager.allStats[i];
			
			if (currentStat.getBeginningGameState()["quarter"] != currentStat.getEndingGameState()["quarter"]) {
				// Quarter changed - reset quarter scores
				quarter++;
				ourQScore = 0;
				theirQScore = 0;
			}
			
			// Get the diff between beginning game state and ending game state scores (will be 0 unless score changed)
			ourQScore += (currentStat.getEndingGameState()["ourScore"] - currentStat.getBeginningGameState()["ourScore"]);
			theirQScore += (currentStat.getEndingGameState()["theirScore"] - currentStat.getBeginningGameState()["theirScore"]);
			
			// If the quarter has been set, set the scores in the view
			if (quarter != 0) {
				$(".ourScoreQ" + quarter, myDiv).html(ourQScore);
				$(".theirScoreQ" + quarter, myDiv).html(theirQScore);
			}
		}
		
		// yardLine pretty printing
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function yardsToTouchdown(gameState) {
		var yardLine = Number(gameState["yardLine"]);
		if (gameState["hasBall"] == "weDo") {
			return 50 - yardLine;
		} else {
			return yardLine + 50;
		}
	}
	
	function distanceBetween(startingYardLine, endingYardLine, opponentStat) {
		var distance = endingYardLine - startingYardLine;
		if (opponentStat) {
			distance = distance * -1;
		}
		return distance;
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

