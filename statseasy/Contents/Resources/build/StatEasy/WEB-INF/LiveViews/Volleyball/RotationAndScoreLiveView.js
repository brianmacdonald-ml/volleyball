/*
 * Required for all LiveViews
 */
var classname = "RotationAndScoreLiveView";
var version = 1.7;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function RotationAndScoreLiveView(myTargetDivId, dataManager) {
	this.targetDivId = myTargetDivId;
	
	this.shown = false;
	this.valid = false;
	this.drawn = false;
		
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
	 * Helper method to append a score to a table
	 */
	function appendScore(ourScore, theirScore) {
		if (ourScore == undefined) {
			ourScore = 0;
		}
		if (theirScore == undefined) {
			theirScore = 0;
		}
		var innerHtml = "<table>" + 
			"<tr><td>" + dataManager.game.ourTeamName + ":</td><td>" + ourScore + "</td></tr>" +
			"<tr><td>" + dataManager.game.theirTeamName + ":</td><td>" + theirScore + "</td></tr>" +
			"</table>";
		
		return innerHtml;
	}

	function getPlayer(position) {
		var playerList = dataManager.allPlayers;
		if (position > 6) {
			playerList = dataManager.allOpponents;
		}
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState != undefined) {
			var player = playerList[gameState["position_" + position]];
			if (player != undefined) {
				return player.firstName + " " + player.lastName;
			}
		}
		return "?";
	}
	
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
		
		var relevantDiv = document.getElementById(this.targetDivId);
		if (!this.drawn) {
			$(relevantDiv).append("<div id='" + this.targetDivId + "-court'></div>");
		}
		
		/*
		 * Populate the DIV with Score Info!
		 */
		var innerHtml = "";
		
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			innerHtml = appendScore(0, 0);
		} else {
			innerHtml = appendScore(gameState.ourScore, gameState.theirScore);
		}
		
		/*
		 * Populate the DIV with rotation info!
		 */
		var height = 360;
		innerHtml += "<table class='court' style='padding:0px' cellspacing='0'>" +
			"<tr class='opponent-backrow'><td>" + getPlayer(7) + "</td><td>" + getPlayer(12) + "</td><td>" + getPlayer(11) + "</td></tr>" + 
			"<tr class='opponent-frontrow'><td>" + getPlayer(8) + "</td><td>" + getPlayer(9) + "</td><td>" + getPlayer(10) + "</td></tr>" + 
			"<tr class='our-frontrow'><td>" + getPlayer(4) + "</td><td>" + getPlayer(3) + "</td><td>" + getPlayer(2) + "</td></tr>" + 
			"<tr class='our-backrow'><td>" + getPlayer(5) + "</td><td>" + getPlayer(6) + "</td><td>" + getPlayer(1) + "</td></tr>" + 
			"</table><div style='clear:both'></div>";
		
		$("#" + this.targetDivId + "-court").html(innerHtml);
		
		if (!this.drawn && (typeof StatEasyCanvas != "undefined")) {
			$(relevantDiv).append(
				"<canvas id='RotationAndScoreCanvas' style='position:absolute;left: 0px; top: 0px;'></canvas>" +
				"<input type='submit' id='RotationAndScoreCalibrate' value='Calibrate this drawing area' style='position:absolute;bottom:15px;left:15px'/>"
			);
			setTimeout(function () {
				// The Owner DIV has 5px of padding on either side = +10px
				new StatEasyCanvas("#RotationAndScoreCanvas", $(relevantDiv).width() + 10, $(relevantDiv).height() + 20);
				$("#RotationAndScoreCalibrate").click(function (jsEvent) {
					$("#RotationAndScoreCalibrate").hide(500);
					StatEasyCanvas.enterCalibrationMode();
					jsEvent.preventDefault();
				});
			}, 500);
		}
		
		this.shown = true;
		this.valid = true;
		this.drawn = true;
		
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

