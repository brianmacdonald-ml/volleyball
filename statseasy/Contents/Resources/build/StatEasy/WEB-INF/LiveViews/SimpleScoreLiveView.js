/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function SimpleScoreLiveView(myTargetDivId, myPlayerShortcuts, myStatShortcuts, allStats, currentGameState) {
	this.targetDivId = myTargetDivId;
	
	/*
	 * We only need this much info since this is what we're displaying
	 */
	//this.gameState = currentGameState;  // Using live versions so we can update w/ ajax :)
	
	this.shown = false;
}

/* 
 * Do some quick setup.  Should not be long running, we don't want to delay 
 * other LiveViews.  This will be called on page startup.  This might not be
 * necessary, since any non-long running tasks should really be done in the 
 * constructor.  Or maybe we execute these after the window is done being 
 * displayed
 */
function SimpleScoreLiveView_prepareToShow() {
}
SimpleScoreLiveView.prototype.prepareToShow = SimpleScoreLiveView_prepareToShow;

/*
 * Helper method to append a score to a table
 */
function SimpleScoreLiveView_appendScore(statTypeTable, descriptiveText, score) {
	var dataRow = document.createElement("tr");
	
	var textColumn = document.createElement("td");
	textColumn.innerHTML = descriptiveText;
	dataRow.appendChild(textColumn);
	
	var scoreColumn = document.createElement("td");
	scoreColumn.innerHTML = score;
	dataRow.appendChild(scoreColumn);
	
	statTypeTable.appendChild(dataRow);
	
	return dataRow;
}
SimpleScoreLiveView.appendScore = SimpleScoreLiveView_appendScore;

/* 
 * This is to actually do any required long running tasks.  This is when 
 * we're going to be shown.
 */ 
function SimpleScoreLiveView_show() {
	if (this.shown) {
		return;
	}
	
	var relevantDiv = document.getElementById(this.targetDivId);
	/*
	 * Populate the DIV with Score Info!
	 */
	
	var scoreTable = document.createElement("table");
	
	SimpleScoreLiveView.appendScore(scoreTable, "Our Score:", currentGameState.ourScore);
	SimpleScoreLiveView.appendScore(scoreTable, "Their Score:", currentGameState.theirScore);
	
	relevantDiv.appendChild(scoreTable);
	
	this.shown = true;
}
SimpleScoreLiveView.prototype.show = SimpleScoreLiveView_show;

/*
 * If we kicked off any background processes, now would be the time to stop 
 * them since we're about to go away.
 */
function SimpleScoreLiveView_stopShowing() {
}
SimpleScoreLiveView.prototype.stopShowing = SimpleScoreLiveView_stopShowing;

