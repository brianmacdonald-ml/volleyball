/*
 * Required for all LiveViews
 */
var classname = "WrestlingLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */

function WrestlingLiveView(myTargetDivId, dataManager) {
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
	}
	this.resize = resize;
	
	var copyGameStates = [
	    "period",
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
					<div class='topRow' >\
						<div class='dataItem'>\
							<div class='label'>" + dataManager.game.ourTeamName + "</div>\
							<div class='value ourScore'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>TIME</div>\
							<div class='value time'>&nbsp;</div>\
						</div>\
						<div class='dataItem'>\
							<div class='label'>" + dataManager.game.theirTeamName + "</div>\
							<div class='value theirScore'>&nbsp;</div>\
						</div>\
					</div>\
					<div class='clear'></div>\
					<div class='bottomRow' >\
						<div class='dataItem'>\
							<div class='label'>Round</div>\
							<div class='value round'>&nbsp;</div>\
						</div>\
					</div>\
					<div class='clear'></div>\
					<div class = 'scoreReport' align='center'  >\
						<table class='striped scoreSummary' cellspacing='0'>\
						</table>\
						<table class='striped' cellspacing='0'>\
							<tr ><th class='ourPlayer'>Our Player</th>\
							<th></th><th class='theirPlayer'>Their Player</th></tr>\
							<tr align='center'><td class='ourTakedownCount'>-</td><td>Takedowns</td><td class='theirTakedownCount'></td></tr>\
							<tr align='center'><td class='ourReversalCount'>-</td> <td>Reversals</td><td class='theirReversalCount'></td></tr>\
							<tr align='center'><td class='ourEscapeCount'>-</td><td>Escapes</td><td class='theirEscapeCount'></td></tr>\
							 <tr align='center'><td class='ourNearFallCount'>-</td><td>Near Fall Points</td><td class='theirNearFallCount'></td></tr>\
							 <tr align='center'><td class='ourPenaltyCount'>-</td><td>Penalties</td><td class='theirPenaltyCount'></td></tr>\
							<tr class='thebottomrow'>\
								<td colspan='2'>&nbsp;<td>\
							</tr>\
						</table>\
					</div>\
				</div>\
				<div class='clear'></div>";
			
			myDiv.html(innerHtml);
		}
		
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			gameState = {
				ourScore : 0,
				theirScore : 0
			};
		}
		if(gameState.ourPlayer != undefined && gameState.theirPlayer != undefined){
			ourPlayer = gameState.ourPlayer.name;
			theirPlayer = gameState.theirPlayer.name;
		}
		else{
			ourPlayer = "Our Player";
			theirPlayer = "Their Player";
		}
		
		
		for (var i in copyGameStates) {
			var stateName = copyGameStates[i];
			var stateValue = gameState[stateName];
			$("." + stateName, myDiv).html(stateValue);
		}
		
		// Set Time
		var myinterval;

		if(gameState["gameTime"] == undefined){
			$(".time", myDiv).html("00:00");
		}
		
		if(gameState["gameClockRunning"] != null && dataManager.allStats.length>0){
			
			time = Math.floor(gameState["gameTime"]/1000);
			ridingTime = (gameState["ridingTime"]);
			
			running = gameState["gameClockRunning"];
			ridingTimeRunning = gameState["ridingTimeOn"];
			
			if(dataManager.allStats[dataManager.allStats.length-1].getName().split(' ')[1] == "Clock"){
				
				myinterval = setInterval(function(){setTime()},1000);
				
				function setTime(){
					if(running == 1){
						if(time != 0){
							time--;
							if(ridingTimeRunning == 1){
								ridingTime++;
								dataManager.ridingTime = ridingTime;
							}
						}
					}
					else{
						ridingTimeRunning = 0
						running = 0;
						clearInterval(myinterval);
					}
					$(".time", myDiv).html(setTimeOnView(time));
				}
			}
			else if(dataManager.allStats[dataManager.allStats.length-1].getName().split(' ')[1] == "Round"){
				$(".time", myDiv).html(setTimeOnView(time));
			}
				
		}
		
		if(dataManager.allStats.length==0 || dataManager.allStats[dataManager.allStats.length-1].getEndingGameState()["round"] == undefined){
			round = 0;
		}else{
			round = dataManager.allStats[dataManager.allStats.length-1].getEndingGameState()["round"];
		}
		$(".round", myDiv).html(round);
		
		
		// Score Report
		
		if(gameState["scoreReport"] == null)
			gameState["scoreReport"] =  "" ;
		
		if(gameState["ourPlayer.name.last"] == null)
			gameState["ourPlayer.name.last"] = "Our Player";
		
		if(gameState["theirPlayer.name.last"]== null)
			gameState["theirPlayer.name.last"] = "Their Player";
		
		ourPlayer = gameState["ourPlayer.name.last"];
		theirPlayer = gameState["theirPlayer.name.last"];
		ourScoreReport = gameState["scoreReport"];
		
		$(".ourPlayer", myDiv).html(ourPlayer);
		$(".theirPlayer", myDiv).html(theirPlayer);
		
		if(gameState["ourTakedownCount"] != undefined)
			ourTakedownCount = gameState["ourTakedownCount"];
		else
			ourTakedownCount = 0;
		if(gameState["theirTakedownCount"] != undefined)
			theirTakedownCount = gameState["theirTakedownCount"];
		else
			theirTakedownCount = 0;
		if(gameState["ourReversalCount"] != undefined)
			ourReversalCount = gameState["ourReversalCount"];
		else
			ourReversalCount = 0;
		if(gameState["theirReversalCount"] != undefined)
			theirReversalCount = gameState["theirReversalCount"];
		else
			theirReversalCount = 0;
		if(gameState["ourEscapeCount"] != undefined)
			ourEscapeCount = gameState["ourEscapeCount"];
		else
			ourEscapeCount = 0;
		if(gameState["theirEscapeCount"] != undefined)
			theirEscapeCount = gameState["theirEscapeCount"];
		else
			theirEscapeCount = 0;
		if(gameState["ourNearFallCount"] != undefined)
			ourNearFallCount = gameState["ourNearFallCount"];
		else
			ourNearFallCount = 0;
		if(gameState["theirNearFallCount"] != undefined)
			theirNearFallCount = gameState["theirNearFallCount"];
		else
			theirNearFallCount = 0;
		if(gameState["ourPenaltyCount"] != undefined)
			ourPenaltyCount = gameState["ourPenaltyCount"];
		else
			ourPenaltyCount = 0;
		if(gameState["theirPenaltyCount"] != undefined)
			theirPenaltyCount = gameState["theirPenaltyCount"];
		else
			theirPenaltyCount = 0;
		
		
		gameState["scoreReport"] = ourScoreReport;
		dataManager.ourPlayer = ourPlayer;
		dataManager.theirPlayer = theirPlayer;
		
		$(".scoreSummary", myDiv).html(getReport(ourScoreReport));
		updateCounts(myDiv,ourTakedownCount, theirTakedownCount, ourReversalCount, 
				theirReversalCount, ourEscapeCount, theirEscapeCount, ourNearFallCount, theirNearFallCount, ourPenaltyCount, theirPenaltyCount);

		
		self.shown = true;
		self.valid = true;
		
	}
	this.show = show;
	
	function getReport(ourScoreReport){
		var split = ourScoreReport.split("-");
		var i = split.length-1;
		var finalReport = "<tr align='center'><th > " +"Play By Play" + "</th>\ " ;
		if(split.length == 1){
			finalReport  += "\n" +
			"<tr align='center'><td>-</td>\
			</tr>\ ";
		}
		while(i > 0){
			finalReport += "\n" +
			"<tr align='center'><td> " + split[i] +"</td></tr>\ ";
			i--;
		}
		
		return finalReport + "<tr class='thebottomrow'><td colspan='0'>&nbsp;<td></tr>\ " ;
	}
	
	function updateCounts(myDiv,ourTakedownCount, theirTakedownCount, ourReversalCount, 
			theirReversalCount, ourEscapeCount, theirEscapeCount, ourNearFallCount,
			theirNearFallCount,ourPenaltyCount, theirPenaltyCount){
		$(".ourTakedownCount", myDiv).html(ourTakedownCount);
		$(".theirTakedownCount", myDiv).html(theirTakedownCount);
		$(".ourReversalCount", myDiv).html(ourReversalCount);
		$(".theirReversalCount", myDiv).html(theirReversalCount);
		$(".ourEscapeCount", myDiv).html(ourEscapeCount);
		$(".theirEscapeCount", myDiv).html(theirEscapeCount);
		$(".ourNearFallCount", myDiv).html(ourNearFallCount);
		$(".theirNearFallCount", myDiv).html(theirNearFallCount);
		$(".ourPenaltyCount", myDiv).html(ourPenaltyCount);
		$(".theirPenaltyCount", myDiv).html(theirPenaltyCount);
	}
	
	function setTimeOnView(time){
		console.log(time);
		minute = Math.floor(time/60);
		second = time%60;
		if(Math.floor(time/60) < 10){
			minute = "0" + minute;
		}
		if(time%60 <10){
			second = "0" + second;
		}
		return (String(minute)+":"+String(second));		
	}
	

	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

