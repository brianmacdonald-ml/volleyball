/*
 * Required for all LiveViews
 */
var classname = "BaseballLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function BaseballLiveView(myTargetDivId, dataManager) {
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
	    "ballCount",
	    "strikeCount",
	    "outCount",
	    "currentBatter",
	    "inning",
	    "ourScore",
	    "theirScore",
	    "ourHits",
	    "theirHits",
	    "ourErrors",
	    "theirErrors",
	    "ourPitchCount",
	    "theirPitchCount",
	    "ourBallCount",
	    "theirBallCount",
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
						<div class='dataItem' style='margin-left:22px;'>\
							<div class='label'>INNING</div>\
							<div class='value inning'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>AT BAT</div>\
							<div class='value currentBatter'>&nbsp;</div>\
						</div>\
							<table class='striped pitchCount' cellspacing='0' style='float:left'>\
							<tr>\
								<th class='separatorCol'>Pitch Count</th>\
								<th class='separatorCol'>Strikes</th>\
								<th class='separatorCol'>Balls</th>\
								<th class='separatorCol'>Total</th>\
							</tr><tr>\
								<td class='separatorCol ourPlayerAtPosition1'><span class='weDo poss'></span>Our Pitcher</td>\
								<td class='theirPitchCount separatorCol'>-</td>\
								<td class='ourBallCount separatorCol'>-</td>\
								<td class='ourTotal separatorCol'>-</td>\
							</tr><tr>\
								<td class='separatorCol theirPlayerAtPosition1'><span class='theyDo poss'></span>Their Pitcher</td>\
								<td class='ourPitchCount separatorCol'>-</td>\
								<td class='theirBallCount separatorCol'>-</td>\
								<td class='theirTotal separatorCol'>-</td>\
							</tr><tr class='thebottomrow'>\
								<td colspan='3'>&nbsp;<td>\
							</tr>\
							</table>\
					<div class='clear'></div></div>\
					<div class='bottomRow'>\
						<div class='dataItem'>\
							<div class='label'>BALLS</div>\
							<div class='value ballCount'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>STRIKES</div>\
							<div class='value strikeCount'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>OUTS</div>\
							<div class='value outCount'>&nbsp;</div>\
						</div><div class='clear'></div>\
					</div>\
					<div class='clear'></div>\
				</div>\
				<div class='clear'></div>\
				<table class='striped' cellspacing='0' style='float:left'>\
					<tr>\
						<th class='separatorCol'>&nbsp;</th>\
						<th class='separatorCol'>1</th>\
						<th class='separatorCol'>2</th>\
						<th class='separatorCol'>3</th>\
						<th class='separatorCol'>4</th>\
						<th class='separatorCol'>5</th>\
						<th class='separatorCol'>6</th>\
						<th class='separatorCol'>7</th>\
						<th class='separatorCol'>8</th>\
						<th class='separatorCol'>9</th>\
						<th class='separatorCol'>10</th>\
						<th class='separatorCol'>R</th>\
						<th class='separatorCol'>H</th>\
						<th class='separatorCol'>E</th>\
					</tr><tr>\
						<td class='separatorCol'><span class='theyDo poss'></span>" + dataManager.game.theirTeamName + "</td>\
						<td class='theirScoreQ1 separatorCol'>-</td>\
						<td class='theirScoreQ2 separatorCol'>-</td>\
						<td class='theirScoreQ3 separatorCol'>-</td>\
						<td class='theirScoreQ4 separatorCol'>-</td>\
						<td class='theirScoreQ5 separatorCol'>-</td>\
						<td class='theirScoreQ6 separatorCol'>-</td>\
						<td class='theirScoreQ7 separatorCol'>-</td>\
						<td class='theirScoreQ8 separatorCol'>-</td>\
						<td class='theirScoreQ9 separatorCol'>-</td>\
						<td class='theirScoreQ10 separatorCol'>-</td>\
						<td class='theirScore separatorCol'>-</td>\
						<td class='theirHits separatorCol'>-</td>\
						<td class='theirErrors separatorCol'>-</td>\
					</tr><tr>\
						<td class='separatorCol'><span class='weDo poss'></span>" + dataManager.game.ourTeamName + "</td>\
						<td class='ourScoreQ1 separatorCol'>-</td>\
						<td class='ourScoreQ2 separatorCol'>-</td>\
						<td class='ourScoreQ3 separatorCol'>-</td>\
						<td class='ourScoreQ4 separatorCol'>-</td>\
						<td class='ourScoreQ5 separatorCol'>-</td>\
						<td class='ourScoreQ6 separatorCol'>-</td>\
						<td class='ourScoreQ7 separatorCol'>-</td>\
						<td class='ourScoreQ8 separatorCol'>-</td>\
						<td class='ourScoreQ9 separatorCol'>-</td>\
						<td class='ourScoreQ10 separatorCol'>-</td>\
						<td class='ourScore separatorCol'>-</td>\
						<td class='ourHits separatorCol'>-</td>\
						<td class='ourErrors separatorCol'>-</td>\
					</tr><tr class='thebottomrow'>\
						<td colspan='13'>&nbsp;<td>\
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
		if(gameState["inning"] == undefined){
			$(".inning", myDiv).html(0);
		}
		else{
			if(Number(gameState["inning"])== 0.5){
				$(".inning", myDiv).html(1);
			}else{
				$(".inning", myDiv).html(Math.floor(Number(gameState["inning"])));
			}
		}
		if(gameState["outCount"] == undefined){
			$(".outCount", myDiv).html(0);
		}
		if(gameState["ballCount"] == undefined){
			$(".ballCount", myDiv).html(0);
		}
		if(gameState["strikeCount"] == undefined){
			$(".strikeCount", myDiv).html(0);
		}
		if(gameState["ourHits"] == undefined){
			$(".ourHits", myDiv).html(0);
		}
		if(gameState["theirHits"] == undefined){
			$(".theirHits", myDiv).html(0);
		}
		if(gameState["ourErrors"] == undefined){
			$(".ourErrors", myDiv).html(0);
		}
		if(gameState["theirErrors"] == undefined){
			$(".theirErrors", myDiv).html(0);
		}
		if(gameState["ourPitchCount"] == undefined){
			$(".ourPitchCount", myDiv).html(0);
			ourPitchCount=0;
		}
		else{
			ourPitchCount = Number(gameState["ourPitchCount"]);
		}
		if(gameState["theirPitchCount"] == undefined){
			$(".theirPitchCount", myDiv).html(0);
			theirPitchCount=0;
		}
		else{
			theirPitchCount = Number(gameState["theirPitchCount"]);
		}
		if(gameState["ourBallCount"] == undefined){
			$(".ourBallCount", myDiv).html(0);
			ourBallCount=0;
		}
		else{
			ourBallCount = Number(gameState["ourBallCount"]);
		}
		if(gameState["theirBallCount"] == undefined){
			$(".theirBallCount", myDiv).html(0);
			theirBallCount=0;
		}
		else{
			theirBallCount = Number(gameState["theirBallCount"]);
		}
		$(".ourTotal", myDiv).html(ourBallCount+theirPitchCount);
		$(".theirTotal", myDiv).html(theirBallCount+ourPitchCount);
		
		if(getPitcher("our")!=null){
			$(".ourPlayerAtPosition1", myDiv).html(getPitcher("our"));
		}
		if(getPitcher("their")!=null){
			$(".theirPlayerAtPosition1", myDiv).html(getPitcher("their"));
		}
		
		var allPlayers = dataManager.allPlayers;
		var currentBatter = 0;
		if(gameState["currentBatter"]!=undefined){
			currentBatter = gameState["currentBatter"];
		}
		$(".currentBatter", myDiv).html(currentBatter);
	
		// inning scores
		var ourQScore = 0;
		var theirQScore = 0;
		var inning = 0;
		for (var i in dataManager.allStats) {
			var currentStat = dataManager.allStats[i];
			
			if (currentStat.getBeginningGameState()["inning"] != currentStat.getEndingGameState()["inning"]) {
				// inning changed - reset inning scores
				inning= currentStat.getEndingGameState()["inning"];
				if(inning%1==0){
					ourQScore = 0;
					theirQScore = 0;
				}
			}
			// Get the diff between beginning game state and ending game state scores (will be 0 unless score changed)
			ourQScore += (currentStat.getEndingGameState()["ourScore"] - currentStat.getBeginningGameState()["ourScore"]);
			theirQScore += (currentStat.getEndingGameState()["theirScore"] - currentStat.getBeginningGameState()["theirScore"]);
			
			// If the inning has been set, set the scores in the view
			if (inning != 0) {
				$(".ourScoreQ" + Math.floor(inning), myDiv).html(ourQScore);
				$(".theirScoreQ" + Math.floor(inning), myDiv).html(theirQScore);
			}
	
		
		}
		function getPitcher(prefix){
			if(prefix == "our"){
				var allPlayers = dataManager.allPlayers
			}
			else{
				var allPlayers = dataManager.allOpponents;
			}
			 
			var playerId = gameState[prefix + "PlayerAtPosition1"];
			console.log(allPlayers, playerId);
			var ourPlayer = null;
			for (playerInSeason in allPlayers) {
				var player = allPlayers[playerInSeason];
				if (playerId == player.number) {
					ourPlayer = player.lastName;
				}
			}
			return ourPlayer;
		}
		// yardLine pretty printing
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	


	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

