/*
 * Required for all LiveViews
 */
var classname = "ScoresheetLiveView";
var version = 1.1;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ScoresheetLiveView(myTargetDivId, dataManager) {
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
		if (this.shown && this.valid) {
			return;
		}
		
		if (!self.shown) {
			addScoresheetHtml();
			addUnchangingData();
		}
		
		processStats(dataManager.allStats);
		
		this.shown = true;
		this.valid = true;
		
	}
	this.show = show;
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
	function processStats(allStats) {
		var ourLineupSet = false;
		var theirLineupSet = false;
		var initialServiceSet = false;
		var whoHasFirstServe = undefined;
		
		var ourSubsUsed = 0;
		var theirSubsUsed = 0;
		var ourScore = 0;
		var theirScore = 0;
		var scoresAtSideout = {
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: [],
			8: [],
			9: [],
			10: [],
			11: [],
			12: [],
			servicePosition: 1,
		};
		var positions = {};
		var players = {};
		
		for (var index in allStats) {
			var stat = allStats[index];
			var startingState = stat.getBeginningGameState();
			var endingState = stat.getEndingGameState();
			
			var substitutions = [];
			if (!ourLineupSet && allPositionsSet(endingState, 0)) {
				setStartingLineup(endingState, 0, players, positions);
				ourLineupSet = true;
			} else if (ourLineupSet && ((substitutions = getSubsBetweenStates(startingState, endingState, 0)).length > 0)) {
				processSubstitutions(substitutions, startingState, 0, players, positions);
				ourSubsUsed += substitutions.length;
			}
			
			if (!theirLineupSet && allPositionsSet(endingState, 6)) {
				setStartingLineup(endingState, 6, players, positions);
				theirLineupSet = true;
			} else if (theirLineupSet && ((substitutions = getSubsBetweenStates(startingState, endingState, 6)).length > 0)) {
				processSubstitutions(substitutions, startingState, 6, players, positions);
				theirSubsUsed += substitutions.length;
			}
			
			if (!initialServiceSet && isServiceSet(endingState)) {
				setInitialService(endingState, scoresAtSideout);
				initialServiceSet = true;
				whoHasFirstServe = endingState["hasServe"];
			}
			
			var pointScoredBy = whoScoredThePoint(startingState, endingState);
			if (pointScoredBy != "noOne") {
				if (!initialServiceSet) {
					// Error!
				}
				if (!theirLineupSet) {
					// Error!
				}
				if (!ourLineupSet) {
					// Error!
				}
				
				ourScore = endingState["ourScore"];
				theirScore = endingState["theirScore"];
				
				// If the scoring of the point caused a sideout
				if (pointScoredBy != startingState["hasServe"]) {
					processSideout(startingState, pointScoredBy, scoresAtSideout, whoHasFirstServe);
				}
			}
		}
		
		processLineup(positions);
		processSubsAndPoints(ourSubsUsed, theirSubsUsed, ourScore, theirScore);
	}
	
	function processSideout(startingState, pointScoredBy, scoresAtSideout, whoHasFirstServe) {
		var offset;
		var relevantScore;
		var teamText;
		
		if (pointScoredBy == "theyDo") {
			offset = 0;
			relevantScore = startingState["ourScore"];
			teamText = " #ourTeamScoreAfterServeOrd";
		} else {
			offset = 6;
			relevantScore = startingState["theirScore"];
			teamText = " #theirTeamScoreAfterServeOrd";
		}
		var serveOrd = scoresAtSideout.servicePosition;
		scoresAtSideout[serveOrd + offset].push(relevantScore);
		var serviceNumber = scoresAtSideout[serveOrd + offset].length;
		
		$("#" + self.targetDivId + teamText + serveOrd + "Serve" + serviceNumber + " .contentText").html(relevantScore);
		
		if (pointScoredBy != whoHasFirstServe) {
			scoresAtSideout.servicePosition = serveOrd == 6 ? 1 : serveOrd + 1;
		}
	}
	
	function whoScoredThePoint(startingState, endingState) {
		// The odd contents of the return var is because we want to compare who
		// scored the point with who has the serve.  We do some real work when
		// the receiving team scores a point
		var whoScoredIt = "noOne";
		
		if (startingState["ourScore"] != endingState["ourScore"]) {
			whoScoredIt = "weDo";
		}
		
		if (startingState["theirScore"] != endingState["theirScore"]) {
			whoScoredIt = "theyDo";
		}
		
		return whoScoredIt;
	}
	
	function isServiceSet(gameState) {
		return gameState["hasServe"] != undefined;
	}
	
	function setInitialService(gameState, scoresAtSideout) {
		var isOurServe = gameState["hasServe"] == "weDo";
		
		if (isOurServe) {
			$("#" + self.targetDivId + " #ourTeamServe").addClass("active");
			$("#" + self.targetDivId + " #theirTeamReceive").addClass("active");
			$("#" + self.targetDivId + " #theirTeamScoreAfterServeOrd1Serve1").addClass("crossedOut");
			scoresAtSideout[7].push(0);
		} else {
			$("#" + self.targetDivId + " #ourTeamReceive").addClass("active");
			$("#" + self.targetDivId + " #theirTeamServe").addClass("active");
			$("#" + self.targetDivId + " #ourTeamScoreAfterServeOrd1Serve1").addClass("crossedOut");
			scoresAtSideout[1].push(0);
		}
	}
	
	function processSubsAndPoints(ourSubsUsed, theirSubsUsed, ourScore, theirScore) {
		$("#" + self.targetDivId + " #ourTeamSubs span:lt(" + ourSubsUsed + ")").addClass("oldData");
		$("#" + self.targetDivId + " #theirTeamSubs span:lt(" + theirSubsUsed + ")").addClass("oldData");
		
		for (var score = 1; score <= ourScore; score++) {
			$("#" + self.targetDivId + " #ourTeamPoints" + score).addClass("oldData");
		}
		
		for (var score = 1; score <= theirScore; score++) {
			$("#" + self.targetDivId + " #theirTeamPoints" + score).addClass("oldData");
		}
	}
	
	function setServeOrderLine(htmlContent, position, subNumber) {
		var teamText;
		if (position > 6) {
			teamText = " #theirTeamServeOrd";
			position -= 6;
		} else {
			teamText = " #ourTeamServeOrd";
		}
		
		var lineNum = Math.floor(subNumber / 3) + 1;
		if (lineNum > 3) { lineNum = 3; }
		
		$("#" + self.targetDivId + teamText + position + "Line" + lineNum).html(
			htmlContent
		);
	}

	function processLineup(positions) {
		// Add the HTML for the lineup portion of the scoresheet
		var htmlContent = "";
		var playerList;
		
		for (var position in positions) {
			if (position > 6) {
				playerList = dataManager.allOpponents;
			} else {
				playerList = dataManager.allPlayers;
			}
			
			for (var subNumber in positions[position]) {
				var playerId = positions[position][subNumber];
				var player = playerList[playerId];
				var playerText = player != undefined ? player.number : "?";
				if (subNumber != positions[position].length - 1) {
					htmlContent += "<span class='playerNumber oldData'>";
				} else {
					htmlContent += "<span class='playerNumber'>";
				}
				htmlContent += playerText + "</span>";
				
				if ((subNumber % 3 == 2) || (subNumber == positions[position].length - 1)) {
					setServeOrderLine(htmlContent, position, subNumber);
					htmlContent = "";
				}
			}
			
		}
	}
	
	function processSubstitutions(substitutions, startingState, offset, players, positions) {
		for (var index in substitutions) {
			var startingPlayerId = substitutions[index].starting;
			var endingPlayerId = substitutions[index].ending;
			
			// Update the list of people in a particular position
			var position = players[startingPlayerId];
			var subNumber = positions[position].push(endingPlayerId) - 1; // The first element on the list doesn't count as a sub.
			
			// Set the score at the time of the sub
			setScoreAtSub(startingState["ourScore"], startingState["theirScore"], position, subNumber);
			
			// Put this player in the same serve order as the player they came in for
			players[endingPlayerId] = position;
		}
		
	}
	
	function setScoreAtSub(ourScore, theirScore, position, subNumber) {
		var locationId = " #ourTeamScoreAtSubNum";
		if (position > 6) {
			locationId = " #theirTeamScoreAtSubNum";
			position = position - 6;
			var temp = theirScore;
			theirScore = ourScore;
			ourScore = temp;
		}
		locationId = locationId + subNumber + "InServeOrd" + position;
		
		$("#" + self.targetDivId + locationId + " .ourScore").html(ourScore);
		$("#" + self.targetDivId + locationId + " .theirScore").html(theirScore);
	}
	
	function getSubsBetweenStates(startingState, endingState, offset) {
		var substitutions = [];
		
		for (var position = 1; position <= 6; position++) {
			var rotatedPosition = position == 1 ? 6 : position - 1;
			var startingPlayerId = startingState["position_" + (position + offset)];
			var endingPlayerId = endingState["position_" + (position + offset)];
			var rotatedPlayerId = endingState["position_" + (rotatedPosition + offset)];
			
			if ((startingPlayerId != endingPlayerId) && (startingPlayerId != rotatedPlayerId)) {
				// Didn't stay the same and didn't rotate. This position just got SUBBED O.U.T. (Like trout)
				substitutions.push({
					'starting': startingPlayerId, 
					'ending' : endingPlayerId
				});
			}
		}
		
		return substitutions;
	}
	
	function setStartingLineup(gameState, offset, players, positions) {
		var playerList = dataManager.allPlayers;
		var teamText = " #ourTeamServeOrd";
		if (offset == 6) {
			playerList = dataManager.allOpponents;
			teamText = " #theirTeamServeOrd";
		}
		for (var position = 1; position <= 6; position++) {
			var playerId = gameState["position_" + (position + offset)];
			
			// We'll be appending to this list later, so we need it to be an array
			positions[position + offset] = [playerId];
			players[playerId] = position + offset;
		}
	}
	
	function allPositionsSet(gameState, offset) {
		var allSet = true;
		for (var position = 1; position <= 6; position++) {
			allSet = allSet && (gameState["position_" + (position + offset)] != undefined);
		}
		return allSet; 
	}
	
	/*
	 * This includes team names & team letters
	 */
	function addUnchangingData() {
		$("#" + self.targetDivId + " #ourTeamName").html(dataManager.game.ourTeamName);
		$("#" + self.targetDivId + " #theirTeamName").html(dataManager.game.theirTeamName);
		$("#" + self.targetDivId + " #ourTeamLetter").html("A");
		$("#" + self.targetDivId + " #theirTeamLetter").html("B");
	}
	
	function addScoresheetHtml() {
		var myDiv = $("#" + self.targetDivId);
		
		myDiv.html("\
				<table class='electronicScoreSheet' cellspacing='0'>\
			    <tr>\
			        <td rowspan='13' class='gameNumber'><div><p>SET&nbsp;1</p></div></td>\
			        <td colspan='3'  style='border-right:none'><div class='infoText'>START <span class='enteredText' id='startTime'>:</span></div></td>\
			        <td colspan='6'  style='border-right:none'><div class='infoText'>TEAM <span id='ourTeamName' class='enteredText'></span></div></td>\
			        <td              style='border-right:none'><div class='notatedCell'><div class='notationText'>Libero#</div><div class='contentText'></div></div></td>\
			        <td              class='centered' style='border-right:none'><div class='teamLetter' id='ourTeamLetter'>A</div></td>\
			        <td              class='centered' style='border-left:none'><div class='serveOrReceive' id='ourTeamServe'>S</div><div class='serveOrReceive' id='ourTeamReceive'>R</div></td>\
			        <td              class='smallerText centered pointsHeader'>Points</td>\
			        <td              class='smallerText centered pointsHeader'>Points</td>\
			        <td              class='centered' style='border-right:none'><div class='serveOrReceive' id='theirTeamServe'>S</div><div class='serveOrReceive' id='theirTeamReceive'>R</div></td>\
			        <td              class='centered' style='border-left:none'><div class='teamLetter' id='theirTeamLetter'>B</div></td>\
			        <td              style='border-left:none'><div class='notatedCell'><div class='notationText'>Libero#</div><div class='contentText'></div></div></td>\
			        <td colspan='6'  style='border-left:none'><div class='infoText'>TEAM <span id='theirTeamName' class='enteredText'></span></div></td>\
			        <td colspan='3'  style='border-left:none'><div class='infoText'>END <span class='enteredText' id='endTime'>:</span></div></td>\
			    </tr>\
			    <tr class='noBorderBottom'>\
			        <td colspan='2' class='centered'>I</td>\
			        <td colspan='2' class='centered'>II</td>\
			        <td colspan='2' class='centered'>III</td>\
			        <td colspan='2' class='centered'>IV</td>\
			        <td colspan='2' class='centered'>V</td>\
			        <td colspan='2' class='centered'>VI</td>\
			        <td rowspan='9'>\
			            <table class='pointsTable' id='ourTeamPoints' cellspacing='0'>\
			                <tr>\
			                    <td><span id='ourTeamPoints1'>1</div></td>\
			                    <td><span id='ourTeamPoints12'>12</span></td>\
			                    <td><span id='ourTeamPoints23'>23</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints2'>2</span></td>\
			                    <td><span id='ourTeamPoints13'>13</span></td>\
			                    <td><span id='ourTeamPoints24'>24</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints3'>3</span></td>\
			                    <td><span id='ourTeamPoints14'>14</span></td>\
			                    <td><span id='ourTeamPoints25'>25</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints4'>4</span></td>\
			                    <td><span id='ourTeamPoints15'>15</span></td>\
			                    <td><span id='ourTeamPoints26'>26</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints5'>5</span></td>\
			                    <td><span id='ourTeamPoints16'>16</span></td>\
			                    <td><span id='ourTeamPoints27'>27</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints6'>6</span></td>\
			                    <td><span id='ourTeamPoints17'>17</span></td>\
			                    <td><span id='ourTeamPoints28'>28</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints7'>7</span></td>\
			                    <td><span id='ourTeamPoints18'>18</span></td>\
			                    <td><span id='ourTeamPoints29'>29</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints8'>8</span></td>\
			                    <td><span id='ourTeamPoints19'>19</span></td>\
			                    <td><span id='ourTeamPoints30'>30</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints9'>9</span></td>\
			                    <td><span id='ourTeamPoints20'>20</span></td>\
			                    <td><span id='ourTeamPoints31'>31</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints10'>10</span></td>\
			                    <td><span id='ourTeamPoints21'>21</span></td>\
			                    <td><span id='ourTeamPoints32'>32</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='ourTeamPoints11'>11</span></td>\
			                    <td><span id='ourTeamPoints22'>22</span></td>\
			                    <td><span id='ourTeamPoints33'>33</span></td>\
			                </tr>\
			            </table>\
			        </td>\
			        <td rowspan='9'>\
			            <table class='pointsTable' id='theirTeamPoints' cellspacing='0'>\
			                <tr>\
			                    <td><span id='theirTeamPoints1'>1</span></td>\
			                    <td><span id='theirTeamPoints12'>12</span></td>\
			                    <td><span id='theirTeamPoints23'>23</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints2'>2</span></td>\
			                    <td><span id='theirTeamPoints13'>13</span></td>\
			                    <td><span id='theirTeamPoints24'>24</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints3'>3</span></td>\
			                    <td><span id='theirTeamPoints14'>14</span></td>\
			                    <td><span id='theirTeamPoints25'>25</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints4'>4</span></td>\
			                    <td><span id='theirTeamPoints15'>15</span></td>\
			                    <td><span id='theirTeamPoints26'>26</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints5'>5</span></td>\
			                    <td><span id='theirTeamPoints16'>16</span></td>\
			                    <td><span id='theirTeamPoints27'>27</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints6'>6</span></td>\
			                    <td><span id='theirTeamPoints17'>17</span></td>\
			                    <td><span id='theirTeamPoints28'>28</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints7'>7</span></td>\
			                    <td><span id='theirTeamPoints18'>18</span></td>\
			                    <td><span id='theirTeamPoints29'>29</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints8'>8</span></td>\
			                    <td><span id='theirTeamPoints19'>19</span></td>\
			                    <td><span id='theirTeamPoints30'>30</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints9'>9</span></td>\
			                    <td><span id='theirTeamPoints20'>20</span></td>\
			                    <td><span id='theirTeamPoints31'>31</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints10'>10</span></td>\
			                    <td><span id='theirTeamPoints21'>21</span></td>\
			                    <td><span id='theirTeamPoints32'>32</span></td>\
			                </tr>\
			                <tr>\
			                    <td><span id='theirTeamPoints11'>11</span></td>\
			                    <td><span id='theirTeamPoints22'>22</span></td>\
			                    <td><span id='theirTeamPoints33'>33</span></td>\
			                </tr>\
			            </table>\
			        </td>\
			        <td colspan='2' class='centered'>I</td>\
			        <td colspan='2' class='centered'>II</td>\
			        <td colspan='2' class='centered'>III</td>\
			        <td colspan='2' class='centered'>IV</td>\
			        <td colspan='2' class='centered'>V</td>\
			        <td colspan='2' class='centered'>VI</td>\
			    </tr>\
			    <tr class='noBorderBottom'>\
			        <td colspan='2'><div id='ourTeamServeOrd1Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd2Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd3Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd4Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd5Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd6Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd1Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd2Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd3Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd4Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd5Line1'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd6Line1'>&nbsp;</div></td>\
			    </tr>\
			    <tr class='noBorderBottom dashedBorderTop'>\
			        <td colspan='2'><div id='ourTeamServeOrd1Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd2Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd3Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd4Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd5Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd6Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd1Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd2Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd3Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd4Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd5Line2'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd6Line2'>&nbsp;</div></td>\
			    </tr>\
			    <tr class='dashedBorderTop'>\
			        <td colspan='2'><div id='ourTeamServeOrd1Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd2Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd3Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd4Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd5Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='ourTeamServeOrd6Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd1Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd2Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd3Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd4Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd5Line3'>&nbsp;</div></td>\
			        <td colspan='2'><div id='theirTeamServeOrd6Line3'>&nbsp;</div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum1InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum5InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum1InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum5InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum2InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum6InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum2InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum6InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum3InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum7InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum3InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum7InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			    </tr>\
			    <tr class='alternateNoRightBorder'>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum4InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='ourTeamScoreAtSubNum8InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd1'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd2'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd3'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd4'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd5'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum4InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			        <td class='squareCell'><div class='scoreAtSub' id='theirTeamScoreAtSubNum8InServeOrd6'><div class='ourScore'></div><div class='theirScore'></div></div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve5'><div class='notationText'>5</div><div class='contentText' ></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve1'><div class='notationText'>1</div><div class='contentText' ></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve5'><div class='notationText'>5</div><div class='contentText' ></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve1'><div class='notationText'>1</div><div class='contentText' ></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve5'><div class='notationText'>5</div><div class='contentText' ></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd1Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd1Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd2Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd2Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd3Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd3Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd4Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd4Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd5Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd5Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd6Serve1'><div class='notationText'>1</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd6Serve5'><div class='notationText'>5</div><div class='contentText'></div></div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='smallerText centered solidRightBorder'>Time<br/>Outs</td>\
			        <td class='smallerText centered solidRightBorder'>Time<br/>Outs</td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd1Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd1Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd2Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd2Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd3Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd3Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd4Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd4Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd5Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd5Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd6Serve2'><div class='notationText'>2</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='theirTeamScoreAfterServeOrd6Serve6'><div class='notationText'>6</div><div class='contentText'></div></div></td>\
			    </tr>\
			    <tr class='noBorderBottom alternateNoRightBorder'>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='solidRightBorder centered'>:</td>\
			        <td class='solidRightBorder centered'>:</td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve3'><div class='notationText'>3</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve7'><div class='notationText'>7</div><div class='contentText'></div></div></td>\
			    </tr>\
			    <tr class='alternateNoRightBorder'>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='solidRightBorder centered'>:</td>\
			        <td class='solidRightBorder centered'>:</td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd1Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd2Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd3Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd4Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd5Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve4'><div class='notationText'>4</div><div class='contentText'></div></div></td>\
			        <td class='squareCell'><div class='notatedCell' id='ourTeamScoreAfterServeOrd6Serve8'><div class='notationText'>8</div><div class='contentText'></div></div></td>\
			    </tr>\
			    <tr>\
			        <td colspan='12' style='border-left:none;'>\
			            <div class='infoText' id='ourTeamSubs'>Substitutions: \
			                <span id='ourTeamSubNum1'>1</span>\
			                <span id='ourTeamSubNum2'>2</span>\
			                <span id='ourTeamSubNum3'>3</span>\
			                <span id='ourTeamSubNum4'>4</span>\
			                <span id='ourTeamSubNum5'>5</span>\
			                <span id='ourTeamSubNum6'>6</span>\
			                <span id='ourTeamSubNum7'>7</span>\
			                <span id='ourTeamSubNum8'>8</span>\
			                <span id='ourTeamSubNum9'>9</span>\
			                <span id='ourTeamSubNum10'>10</span>\
			                <span id='ourTeamSubNum11'>11</span>\
			                <span id='ourTeamSubNum12'>12</span>\
			            </div>\
			        </td>\
			        <td colspan='2'>&nbsp;</td>\
			        <td colspan='2'>&nbsp;</td>\
			        <td colspan='12'>\
			            <div class='infoText' id='theirTeamSubs'>Substitutions:\
			                <span id='theirTeamSubNum1'>1</span>\
			                <span id='theirTeamSubNum2'>2</span>\
			                <span id='theirTeamSubNum3'>3</span>\
			                <span id='theirTeamSubNum4'>4</span>\
			                <span id='theirTeamSubNum5'>5</span>\
			                <span id='theirTeamSubNum6'>6</span>\
			                <span id='theirTeamSubNum7'>7</span>\
			                <span id='theirTeamSubNum8'>8</span>\
			                <span id='theirTeamSubNum9'>9</span>\
			                <span id='theirTeamSubNum10'>10</span>\
			                <span id='theirTeamSubNum11'>11</span>\
			                <span id='theirTeamSubNum12'>12</span>\
			            </div>\
			        </td>\
			    </tr>\
			</table>\
		");
	}
	
}

