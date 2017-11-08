/*
 * Required for all LiveViews
 */
var classname = "GameTrackerLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function GameTrackerLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
		
	
	
	var currentlySelectedViewId;
	var currentlySelectedGroupingId;
	var currentlySelectedGroupingFocusId;
	var currentlySelectedGroupingFocusName;
	var allPlayersSelected;
	var playerSelector;
	var selectedPlayers;
	
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
	

	
	
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}
		
		var myDiv = $("#" + self.targetDivId);
		var ourShotCount = 0;
		var theirShotCount = 0;
		var ourBlockedShotCount = 0;
		var theirBlockedShotCount = 0;
		var ourHitCount = 0;
		var theirHitCount = 0;
		var ourFaceOffWinsCount = 0;
		var theirFaceOffWinsCount = 0;
		var ourPPCount = 0;
		var theirPPCount = 0;
		var ourPPGoalCount = 0;
		var theirPPGoalCount = 0;
		var ourTotalPIMs = 0;
		var theirTotalPIMs = 0;
		
		
		if (!self.shown) {
			var gameState = dataManager.gameStates[dataManager.game.currentGameState];
			if (gameState == undefined) {
				gameState = {
					ourScore : 0,
					theirScore : 0,
				};
			}
			var innerHtml ="\
				" +
				"<div id ='allcontent'>" +
					"<div id='sidebar'>\
					<div id='scoreByPeriod'> <table class='striped' cellspacing='0' >\
						<tr>\
						<th class='separatorCol'>&nbsp;</th>\
						<th class='separatorCol'>1</th>\
						<th class='separatorCol'>2</th>\
						<th class='separatorCol'>3</th>\
						<th class='separatorCol'>F</th>\
					</tr><tr>\
						<td class='separatorCol'><span class='weDo poss'></span>" + dataManager.game.ourTeamName + "</td>\
						<td class='ourScoreQ1 separatorCol'>-</td>\
						<td class='ourScoreQ2 separatorCol'>-</td>\
						<td class='ourScoreQ3 separatorCol'>-</td>\
						<td class='ourScore separatorCol'>-</td>\
					</tr><tr>\
						<td class='separatorCol'><span class='theyDo poss'></span>" + dataManager.game.theirTeamName + "</td>\
						<td class='theirScoreQ1 separatorCol'>-</td>\
						<td class='theirScoreQ2 separatorCol'>-</td>\
						<td class='theirScoreQ3 separatorCol'>-</td>\
						<td class='theirScore separatorCol'>-</td>\
						</tr><tr class='thebottomrow'>\
						<td colspan='6'>&nbsp;<td>\
					</tr>\
					</table>\
					<div id='teamStats'></div>\
					</div></div>" +
					"<div id ='scoreSummary'>" +
					"<div id='ourTeamScore'>" + dataManager.game.ourTeamName + "<br><span id='ourScore'>" + gameState.ourScore + " </span><div id='ourPP'>PP</div> </div>\
					<div id='gameClock' class='timer'><div class='numbers'>&nbsp;</div></div>\
					<div id='theirTeamScore'>" + dataManager.game.theirTeamName + "<br><span id='theirScore'>" + gameState.theirScore + "</span><div id='theirPP'>PP</div> </div>\
					</div>\
					<div id='goalSummary'></div>\
					<div class='clear'></div>\
				    <div id='penaltySummary'></div>\
					<div class='clear'></div>\
			        <div id='playerStats'></div>\
	                <div id='goalieStats'></div>\
	                <div class='clear'></div>" ;
	
			myDiv.html(innerHtml);
		}
		

		
		
		// period scores
		var ourPScore = 0;
		var theirPScore = 0;
		var period = 0;
		for (var i in dataManager.allStats) {
			var currentStat = dataManager.allStats[i];
			
			if (currentStat.getBeginningGameState()["period"] != currentStat.getEndingGameState()["period"]) {
				// period changed - reset period scores
				period++;
				ourPScore = 0;
				theirPScore = 0;
			}
			
			// Get the diff between beginning game state and ending game state scores (will be 0 unless score changed)
			ourPScore += (currentStat.getEndingGameState()["ourScore"] - currentStat.getBeginningGameState()["ourScore"]);
			theirPScore += (currentStat.getEndingGameState()["theirScore"] - currentStat.getBeginningGameState()["theirScore"]);
			
			// If the period has been set, set the scores in the view
			if (period != 0) {
				$(".ourScoreQ" + period, myDiv).html(ourPScore);
				$(".theirScoreQ" + period, myDiv).html(theirPScore);
				
				$(".ourScore", myDiv).html(currentStat.getEndingGameState()["ourScore"]);
				$(".theirScore", myDiv).html(currentStat.getEndingGameState()["theirScore"]);
				
				$("#ourScore", myDiv).html(currentStat.getEndingGameState()["ourScore"]);
				$("#theirScore", myDiv).html(currentStat.getEndingGameState()["theirScore"]);
			}
		}
		
		
		$('#goalSummary').html("<h1>Scoring Summary</h1>");				
		$('#penaltySummary').html("<h1>Penalty Summary</h1>");
		$('#ourPP').hide();
		$('#theirPP').hide();
		
		
		
		for (var i=0; i < dataManager.allStats.length; i++) {
			var currentStat = dataManager.allStats[i];
			var statShortcut = currentStat.getShortcut();

			//count up the game stats
			//if shot
			if ((statShortcut.substring(0,2) == 'sa') || (statShortcut.substring(0,3) == ';sa')){
				//if its an opponents save, that means it was our shot
				if (currentStat.isOpponentStat()){
					ourShotCount = ourShotCount + 1;
				}
				else {
					theirShotCount = theirShotCount + 1;
				}
			}

			//if blocked shot
			else if ((statShortcut.substring(0,2) == 'bs') || (statShortcut.substring(0,3) == ';bs')){
				if (currentStat.isOpponentStat()){
					theirBlockedShotCount = theirBlockedShotCount + 1;
				}
				else {
					ourBlockedShotCount = ourBlockedShotCount + 1;
				}
			}
			
			//if hit
			else if ((statShortcut[0] == "h") || (statShortcut.substring(0,2) == ';h')){
				if (currentStat.isOpponentStat()){
					theirHitCount = theirHitCount + 1;
				}
				else {
					ourHitCount = ourHitCount + 1;
				}
			}

			//if fo 
			else if (statShortcut.substring(0,3) == 'for') {
				//find win or loss
				var stat = currentStat.getName();
				var faceOffStatus = parseForDataAtPosOne(stat);
				
				if (faceOffStatus == "win"){
					ourFaceOffWinsCount	= ourFaceOffWinsCount + 1;
				}
				else {
					theirFaceOffWinsCount = theirFaceOffWinsCount + 1;
				}
				
			}
			
			//if ppo
			else if ((statShortcut.substring(0,3) == 'ppo') || (statShortcut.substring(0,4) == ';ppo')){
				if (currentStat.isOpponentStat()){
					theirPPCount = theirPPCount + 1;
				}
				else {
					ourPPCount = ourPPCount + 1;
				}
			}
			
			//is it a new period?
			else if (statShortcut.substring(0,2) == 'sp'){
				var stat = currentStat.getName();
				//get type of Goal
				period = parseForDataAtPosOne(stat)
				$('#goalSummary').append("<span id='period'>Period: " + period + "</span>");
				$('#penaltySummary').append("<span id='period'>Period: " + period + "</span>");
				
			}			
			
			//if pim
			else if ((statShortcut.substring(0,3) == 'pim') || (statShortcut.substring(0,4) == ';pim')){
				//set up goal DIV
				var divId = "penalty" + i;
				var penaltyTeam = ""
				
				//get info on the penalty
				var stat = currentStat.getName();
				var penaltyToPlayer = parseForPlayer(stat);
				var penaltyMins = parseForDataAtPosOne(stat);
				var penaltyType = parseForDataAtLastPos(stat);
					
				if (currentStat.isOpponentStat()){
					$('#penaltySummary').append("<div id='" + divId + "' class='theirPenalty'></div>");
					$('#penalty'+i).html("");
					penaltyTeam = dataManager.game.theirTeamName;
					theirTotalPIMs = theirTotalPIMs + parseInt(penaltyMins);
				}
				else {
					$('#penaltySummary').append("<div id='" + divId + "' class='ourPenalty'></div>");
					$('#penalty'+i).html("");
					penaltyTeam = dataManager.game.ourTeamName;
					ourTotalPIMs = ourTotalPIMs + parseInt(penaltyMins);
				}
			
				
				$('#penalty'+i).append("<span class='penaltyTeam'>" + penaltyTeam + "</span><span class='penaltyRecord'>" + penaltyToPlayer + " (" +
						penaltyMins + ":00) (" + penaltyType + ")" + "</span>");

				
				
			}//end if pim
			
			
			
			
			
			//else if goal
			//get the scoring summary information
			else if ((statShortcut == "g") || (statShortcut == ';g')){
				//set up goal DIV
				var divId = "goal" + i;

				
				//which team scored the goal?
				if (currentStat.isOpponentStat()){
					$('#goalSummary').append("<div id='" + divId + "' class='theirGoal'></div>");
					$('#goal'+i).html("");
					//a goal is a shot on goal, bump the count
					theirShotCount = theirShotCount + 1;
				}
				else{
					$('#goalSummary').append("<div id='" + divId + "' class='ourGoal'></div>");
					$('#goal'+i).html("");
					//a goal is a shot on goal, bump the count
					ourShotCount = ourShotCount + 1;
				}
				
				var stat = currentStat.getName();
				//get type of Goal
				goalType = parseForDataAtLastPos(stat)

				if (goalType == 'PPG'){
					if (currentStat.isOpponentStat()){
						theirPPGoalCount = theirPPGoalCount + 1;
					}
					else {
						ourPPGoalCount = ourPPGoalCount + 1;
					}
				}
				
				//find the player that scored the goal
				var goalScorer = parseForPlayer(stat);
				$('#goal'+i).append("<span class='goalScorer'>" + goalScorer + " (" +
						goalType + ")" + "</span>");
				
				//check for assists
				if (dataManager.allStats[i+1] != undefined){
					var nextStat = dataManager.allStats[i+1];
					var nextStatShortcut = nextStat.getShortcut();
					if ((nextStatShortcut[0] == "a") || (nextStatShortcut.substring(0,2) == ';a')){
						stat = nextStat.getName();
						assistPlayer = parseForPlayer(stat);
						assistType = parseForDataAtPosOne(stat)
						$('#goal'+i).append("<span class='assistPlayer'> - ASST: " + assistPlayer + " (" +
								assistType + ")" + "</span>");		

						
						//check for 2nd assist
						if (dataManager.allStats[i+2] != undefined){
							var nextStat2 = dataManager.allStats[i+2];
							var nextStat2Shortcut = nextStat2.getShortcut();
							if ((nextStat2Shortcut[0] == "a") || (nextStat2Shortcut.substring(0,2) == ';a')){
								stat = nextStat2.getName();
								assistPlayer2 = parseForPlayer(stat);
								assistType2 = parseForDataAtPosOne(stat)
								$('#goal'+i).append("<span class='assistPlayer'> AND " + assistPlayer2 + " (" +
										assistType2 + ")" +  "</span>");

							}//end 2nd assist
						}
					}//end assist if
				}
				
				//add the smart score ex. 2-1 our team, or 2-2 tie, or 2-1 their team
				ourScore = currentStat.getEndingGameState()["ourScore"] ;
				theirScore = currentStat.getEndingGameState()["theirScore"] ;
				if (ourScore > theirScore){
					$('#goal'+i).append("<span class='smartScore'>" + ourScore + "-" 
							+ theirScore + " " + dataManager.game.ourTeamName + "</span>");
				}
				else if (ourScore < theirScore){
					$('#goal'+i).append("<span class='smartScore'>" + theirScore + "-" 
							+ ourScore + " " + dataManager.game.theirTeamName + "</span>");
				}
				else{
					$('#goal'+i).append("<span class='smartScore'>" + theirScore + "-" 
							+ ourScore + " tie" + "</span>");
				}
			}//end goal if
			
			
		}//end of for every stat

		$('#teamStats').html("<table class='striped'>\
				<tr>\
				<th>" + dataManager.game.ourTeamName + "</th>\
				<th></th>\
				<th>" + dataManager.game.theirTeamName + "</th>\
				</tr>\
				<tr>\
				<td>" + ourShotCount + "</td>\
				<td>Shots</td>\
				<td>" + theirShotCount + "</td>\
				</tr>\
				<tr>\
				<td>" + ourBlockedShotCount + "</td>\
				<td>Blocked Shots</td>\
				<td>" + theirBlockedShotCount + "</td>\
				</tr>\
				<tr>\
				<td>" + ourHitCount + "</td>\
				<td>Hits</td>\
				<td>" + theirHitCount + "</td>\
				</tr>\
				<tr>\
				<td>" + ourFaceOffWinsCount + "</td>\
				<td>FaceOffs</td>\
				<td>" + theirFaceOffWinsCount + "</td>\
				</tr>\
				<tr>\
				<td>" + ourPPGoalCount + "/" + ourPPCount + "</td>\
				<td>PowerPlay</td>\
				<td>" + theirPPGoalCount + "/" + theirPPCount + "</td>\
				</tr>\
				<tr>\
				<td>" + ourTotalPIMs + "</td>\
				<td>Penalty Mins.</td>\
				<td>" + theirTotalPIMs + "</td>\
				</tr>\
				</table>\
				");	
				

		//powerplay checker
		var lastStat = undefined;
		if (dataManager.allStats.length > 0) {
			lastStat = dataManager.allStats[dataManager.allStats.length - 1];

			if (lastStat.getEndingGameState()["ourPenaltyCount"] > lastStat.getEndingGameState()["theirPenaltyCount"]){
				//we are shorthanded, they are on PP
				//show PP div
				$('#theirPP').show();
			}
			else if (lastStat.getEndingGameState()["ourPenaltyCount"] < lastStat.getEndingGameState()["theirPenaltyCount"]){
				//we are on PP, they are shorthanded
				//show PP div
				$('#ourPP').show();
				
			}
			else {
				$('#ourPP').hide();
				$('#theirPP').hide();
			}
		
		}
		
		
		
		//stuff for player stats
		var someGrouping = dataManager.groupings[dataManager.game.associatedEvent];
		currentlySelectedGroupingId = someGrouping.id;

				
		for (i in dataManager.reportGroupings) {
			if (dataManager.reportGroupings[i].name == "Players") {
				playersGroupingFocusId =  dataManager.reportGroupings[i].id 
				}
		}
		
	
		for (i in dataManager.allViews) {
//			var viewID = dataManager.allViews[i].id + "-" + dataManager.allViews[i].name;
			if (dataManager.allViews[i].name == "Player Stats"){
				$('#playerStats').html("<h1>Player Stats</h1>");
				getStats(dataManager.allViews[i].id, currentlySelectedGroupingId, playersGroupingFocusId, '#playerStats')
			}
			if (dataManager.allViews[i].name == "Goalie Stats"){
				$('#goalieStats').html("<h1>Goalie Stats</h1>");
				getStats(dataManager.allViews[i].id, currentlySelectedGroupingId, playersGroupingFocusId, '#goalieStats')
			}
			
		}
		
		
		
		
		
		self.shown = true;
		self.valid = true;
	
		updateClock();
		
	}//end show
	this.show = show;
	
	function parseForPlayer(stat){
		var startIndex = stat.indexOf("\"")+1;
		var endIndex = stat.indexOf("\"",startIndex);
		var parsedStat = stat.substring(startIndex, endIndex);
		return parsedStat;
	}
	
	function parseForDataAtPosOne(stat){	
		var startIndex = stat.indexOf("(")+1;
		var endIndex = stat.indexOf(")",startIndex);
		var parsedStat = stat.substring(startIndex, endIndex);
		return parsedStat;
	}
	
	function parseForDataAtLastPos(stat){	
		var startIndex = stat.lastIndexOf("(")+1;
		var endIndex = stat.lastIndexOf(")");
		var parsedStat = stat.substring(startIndex, endIndex);
		return parsedStat;
	}
	
	function getStats(viewId, currentlySelectedGroupingId, currentlySelectedGroupingFocusId, div) {

		var urlVariables = {
			viewId: viewId,
			egId: currentlySelectedGroupingId,
			grouping: currentlySelectedGroupingFocusId,
			format: 'ajax'
		};
		
		if (!allPlayersSelected) {
			urlVariables.playerIds = selectedPlayers;
		}
		
		$.get(
			dataManager.viewUrl, 
			urlVariables,
			function (data, textStatus) {
				//var responseHolder = $('<div></div>').html(data);
				$(div).append(data);
				
				var sorterOptions = {
			        sortInitialOrder: 'desc'
			    };
				if (currentSortInfo != undefined) {
					sorterOptions["sortList"] = currentSortInfo;
				}
				
				if (playerFilter && ("Players" == currentlySelectedGroupingFocusName)) {
					var gameState = dataManager.gameStates[dataManager.game.currentGameState];
					
					var playerNumberToId = {
						our		: {},
						their	: {},
					};
					addPlayersToMap(dataManager.allPlayers, playerNumberToId.our);
					addPlayersToMap(dataManager.allOpponents, playerNumberToId.their);
					
					var allowablePlayerIds = {
						our		: {},
						their	: {},
					};
					for (var stateName in gameState) {
						var team = undefined;
						var playerNumber = undefined;
						if ("ourPlayer" == stateName.substring(0,9)) {
							team = "our";
							playerNumber = stateName.substring("ourPlayer".length, stateName.length);
						} else if ("theirPlayer" == stateName.substring(0,11)) {
							team = "their";
							playerNumber = stateName.substring("theirPlayer".length, stateName.length);
						}
						
						if (team != undefined) {
							var inOrOut = gameState[stateName];
							if (inOrOut == "In") {
								var playerId = playerNumberToId[team][playerNumber];
								allowablePlayerIds[team][playerId] = true;
							}
						}
					}
					
					hidePlayersNotInTheGame("our", allowablePlayerIds);
					hidePlayersNotInTheGame("their", allowablePlayerIds);
				}
				
				$(".tablesorter").filter(":visible").tablesorter(sorterOptions).bind("sortInfo", function (e, sortInfo) {
			    	currentSortInfo = sortInfo;
			    }).each(function() {
			    	$(this).stickyHeaders();
			    });
			}
		);
	
	
	}//end getstats
	
	function updateClock() {
		var lastStat = undefined;
		if (dataManager.allStats.length > 0) {
			lastStat = dataManager.allStats[dataManager.allStats.length - 1];
		}
		
		if ((lastStat == undefined) || (lastStat.getGameTime() == undefined)) {
			$("#gameClock").removeClass("stopped").removeClass("running").html("&nbsp;");
			return;
		}
		
		var isRunning = lastStat.getEndingGameState()["gameClockRunning"] == "1";
		var gameTime = undefined;
		if (isRunning) {
			$("#gameClock").removeClass("stopped").addClass("running");
			var lastGameTime = lastStat.getGameTime();
			var lastStatTime = lastStat.getTime();
			var thisStatTime = new Date().getTime() / 1000;
			var elapsedTime = thisStatTime - lastStatTime;
			
			if (lastStat.getEndingGameState()["gameClockDirection"] == "up") {
				gameTime = lastGameTime + elapsedTime;
			} else {
				gameTime = lastGameTime - elapsedTime;
				if (gameTime < 0) {
					gameTime = 0;
				}
			}
		} else {
			$("#gameClock").addClass("stopped").removeClass("running");
			gameTime = lastStat.getGameTime();
		}
		
		$("#gameClock .numbers").html(toTimeString(gameTime, 1));
		
		(function() {
			setTimeout(updateClock, 50);
		})();
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

