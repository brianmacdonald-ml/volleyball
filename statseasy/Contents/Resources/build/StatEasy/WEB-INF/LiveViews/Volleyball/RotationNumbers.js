/*
 * Required for all LiveViews
 */
var classname = "RotationNumbers";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function RotationNumbers(myTargetDivId, dataManager) {
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
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}
		
		var relevantDiv = document.getElementById(this.targetDivId);
		if (!this.drawn) {
			$(relevantDiv).append("<table><tr><td>Our Ro. #</td><td><div id='" + this.targetDivId + "-ourRotation'></div></td></tr>" +
					"<tr><td>Their Ro. #</td><td><div id='" + this.targetDivId + "-theirRotation'></div></td></tr></table>");
		}

		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		$("#" + this.targetDivId + "-ourRotation").html(gameState.ourRotation);
		$("#" + this.targetDivId + "-theirRotation").html(gameState.theirRotation);
		
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

