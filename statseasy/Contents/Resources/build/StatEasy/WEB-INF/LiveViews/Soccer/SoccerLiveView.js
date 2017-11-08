/*
 * Required for all LiveViews
 */
var classname = "SoccerLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */

function SoccerLiveView(myTargetDivId, dataManager) {
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
	    "period",
	    "ourScore",
	    "theirScore",
	    "ourShotCount",
	    "theirShotCount",
		"ourSaveCount",
		"theirSaveCount",
		"ourFoulCount",
		"theirFoulCount",
		"ourCornerKickCount",
		"theirCornerKickCount",
		"ourRedCardCount",
		"theirRedCardCount",
		"ourYellowCardCount",
		"theirYellowCardCount",
	
	    
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
							<div class='label'>HALF</div>\
							<div class='value period'>&nbsp;</div>\
						</div>\
					</div>\
					<div class='clear'></div>\
					<div class = 'scoreReport' align='center'>\
						<table class='striped' cellspacing='0' >\
						<caption>Scoring Summary</caption>\
							<tr class = 'scoreSummary'></tr>\
							<tr class='thebottomrow'>\
								<td colspan='0'>&nbsp;<td>\
							</tr>\
						</table>\
						<table class='striped' cellspacing='0'>\
							<tr ><th> " + dataManager.game.ourTeamName + "</th>\
							<th>Game Summary</th><th>" + dataManager.game.theirTeamName +  "</th></tr>\
							<tr align='center'><td class='ourShotCount'>-</td><td>Shots</td><td class='theirShotCount'>0</td></tr>\
							<tr align='center'><td class='ourSaveCount'>-</td> <td>Saves</td><td class='theirSaveCount'>0</td></tr>\
							<tr align='center'><td class='ourFoulCount'>0</td><td>Fouls</td><td class='theirFoulCount'>0</td></tr>\
							<tr align='center'><td class='ourCornerKickCount'>0</td><td>Corner Kicks</td><td class='theirCornerKickCount'>0</td></tr>\
							 <tr align='center'><td class='ourRedCardCount'>0</td><td>Red Cards</td><td class='theirRedCardCount'>0</td></tr>\
							 <tr align='center'><td class='ourYellowCardCount'>0</td><td>Yellow Cards</td><td class='theirYellowCardCount'>0</td></tr>\
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
		
		for (var i in copyGameStates) {
			var stateName = copyGameStates[i];
			var stateValue = gameState[stateName];
			$("." + stateName, myDiv).html(stateValue);
		}
		
		
		// Set Time
		
		if(dataManager.allStats.length==0 || dataManager.allStats[dataManager.allStats.length-1].getEndingGameState()["period"] == undefined){
			period =0;
		}else{
			period = dataManager.allStats[dataManager.allStats.length-1].getEndingGameState()["period"];
		}
		$(".period", myDiv).html(period);
		
		
		
		var myinterval;
		
		if(gameState["gameClockRunning"] != null && dataManager.allStats.length>0){
			running = gameState["gameClockRunning"];
			
			
			if(dataManager.allStats[dataManager.allStats.length-1].getName().split(' ')[1] == "Clock"){
			
				var time = Math.floor(gameState["gameTime"]/1000);
				myinterval = setInterval(function(){setTime()},1000);
				
				function setTime(){
					if(running == 1){
						if(time != 0){
							time--;
						}
						$(".time", myDiv).html(setTimeOnView(time));
					}
					else{
						running = 0;
						clearInterval(myinterval);
					}
				}
			}
		}
		else{
			$(".time", myDiv).html("00:00");	
 		}
	//	$(".time", myDiv).html(setTimeOnView(time));
		
		// Score Report 
		if(gameState["ourScoreReport"] != undefined)
			ourScoreReport = gameState["ourScoreReport"];
		else
			ourScoreReport = "";
		if(gameState["theirScoreReport"] != undefined)
			theirScoreReport = gameState["theirScoreReport"];
		else
			theirScoreReport = "";
		if(gameState["ourShotCount"] != undefined)
			ourShotCount = gameState["ourShotCount"];
		else
			ourShotCount = 0;
		if(gameState["theirShotCount"] != undefined)
			theirShotCount = gameState["theirShotCount"];
		else
			theirShotCount = 0;
		if(gameState["ourCornerKickCount"] != undefined)
			ourCornerKickCount = gameState["ourCornerKickCount"];
		else
			ourCornerKickCount = 0;
		if(gameState["theirCornerKickCount"] != undefined)
			theirCornerKickCount = gameState["theirCornerKickCount"];
		else
			theirCornerKickCount = 0;
		if(gameState["ourSaveCount"] != undefined)
			ourSaveCount = gameState["ourSaveCount"];
		else
			ourSaveCount = 0;
		if(gameState["theirSaveCount"] != undefined)
			theirSaveCount = gameState["theirSaveCount"];
		else
			theirSaveCount = 0;
		if(gameState["ourFoulCount"] != undefined)
			ourFoulCount = gameState["ourFoulCount"];
		else
			ourFoulCount = 0;
		if(gameState["theirFoulCount"] != undefined)
			theirFoulCount = gameState["theirFoulCount"];
		else
			theirFoulCount = 0;
		if(gameState["ourRedCardCount"] != undefined)
			ourRedCardCount = gameState["ourRedCardCount"];
		else
			ourRedCardCount = 0;
		if(gameState["theirRedCardCount"] != undefined)
			theirRedCardCount = gameState["theirRedCardCount"];
		else
			theirRedCardCount = 0;
		if(gameState["ourYellowCardCount"] != undefined)
			ourYellowCardCount = gameState["ourYellowCardCount"];
		else
			ourYellowCardCount = 0;
		if(gameState["theirYellowCardCount"] != undefined)
			theirYellowCardCount = gameState["theirYellowCardCount"];
		else
			theirYellowCardCount = 0;
		console.log(ourShotCount)
		
		$(".scoreSummary", myDiv).html(getReport(ourScoreReport,theirScoreReport));
		updateCounts(myDiv, ourCornerKickCount, theirCornerKickCount, ourShotCount, 
				theirShotCount, ourSaveCount, theirSaveCount, ourFoulCount, theirFoulCount, 
				ourRedCardCount, theirRedCardCount, ourYellowCardCount, theirYellowCardCount  );
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function getReport(ourScoreReport, theirScoreReport){
		var i = 1;
		var ourSplit = ourScoreReport.split("-");
		var theirSplit = theirScoreReport.split("-");
		var ourString =dataManager.game.ourTeamName
		var theirString =dataManager.game.theirTeamName
		var finalReport = "<tr align='center'><th > " + ourString + "</th>\
		<th>" + theirString + "</th></tr>\ ";
		while(i < ourSplit.length && i < theirSplit.length){
			finalReport += "\n" +
			"<tr align='center'><td> " + ourSplit[i] +"</td>\
			<td> " +theirSplit[i]+"</td></tr>\ ";
			i++;
		}
		while(i < ourSplit.length){
			finalReport += "\n" +
			"<tr align='center'><td> " + ourSplit[i] +"</td>\
			<td>-</td></tr>\ ";
			i++;
		}
		while(i < theirSplit.length){
			finalReport += "\n" +
			"<tr align='center'><td>-</td>\
			<td>" + theirSplit[i] + "</td></tr>\ ";
			i++;
		}
		if(i == 1){
			finalReport  += "\n" +
			"<tr align='center'><td>-</td>\
			<td>-</td></tr>\ ";
		}
		return finalReport
	}
	
	function updateCounts(myDiv,ourCornerKickCount, theirCornerKickCount, ourShotCount, 
			theirShotCount, ourSaveCount, theirSaveCount, ourFoulCount, theirFoulCount, 
			ourRedCardCount, theirRedCardCount, ourYellowCardCount, theirYellowCardCount  ){
		$(".ourCornerKickCount", myDiv).html(ourCornerKickCount);
		$(".theirCornerKickCount", myDiv).html(theirCornerKickCount);
		$(".ourShotCount", myDiv).html(ourShotCount);
		$(".theirShotCount", myDiv).html(theirShotCount);
		$(".ourSaveCount", myDiv).html(ourSaveCount);
		$(".theirSaveCount", myDiv).html(theirSaveCount);
		$(".ourFoulCount", myDiv).html(ourFoulCount);
		$(".theirFoulCount", myDiv).html(theirFoulCount);
		$(".ourRedCardCount", myDiv).html(ourRedCardCount);
		$(".theirRedCardCount", myDiv).html(theirRedCardCount);
		$(".ourYellowCardCount", myDiv).html(ourYellowCardCount);
		$(".theirYellowCardCount", myDiv).html(theirYellowCardCount);
	}
	
	function summary(report){
		var ourString =dataManager.game.ourTeamName;
		var theirString =dataManager.game.theirTeamName;
		while(ourString.length>theirString.length){
			theirString = theirString + "  ";
		}
		while(ourString.length<theirString.length){
			ourString = ourString + "  ";
		}
		return  "<tr ><th> " + ourString + "</th>\
		<th></th><th>" + theirString +  "</th></tr>\ " +"\n" + report;
	}
	
	function setTimeOnView(time){
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

