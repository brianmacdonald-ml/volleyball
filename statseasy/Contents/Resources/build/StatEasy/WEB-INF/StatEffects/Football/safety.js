
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var distance = Number(currentState.get("distance"));
	var endingYardLine = !!relevantStat.opponentStat ? -50 : 50;
	
	spreadGameStateBackToStart("result", "safety");
	
	newState.set("yardLine", endingYardLine);
	
	var scoreString = prefix + "Score";
	if (currentState.get("hasBall") != undefined) {
		scoreString = (currentState.get("hasBall") === "theyDo") ? "ourScore" : "theirScore";
		relevantStat.opponentStat = currentState.get("hasBall") == "weDo";
	}
	 
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score + 2);
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, relevantStat.opponentStat);
	distanceData = distanceData * -1;  // The distance is calculated as a GAIN for the Safety.  We want a loss for the other team's carry.
	
	var carryStat = addDistanceToCarryStat(distanceData);
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
	
	newState.unset("down");
	newState.unset("distance");
	newState.unset("result");
}

function spreadGameStateBackToStart(stateName, stateValue) {
	var allStats = relevantStat.event.allStats;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	traverseBack(isStartStat, function (currentStat) {
		logger.debug("Found " + currentStat.getStatText() + " as a non start action.  Setting " + stateName + " to " + stateValue);
		
		currentStat.endingGameState.set(stateName, stateValue);
		
		modifiedStats.add(currentStat);
	});
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Safety",
	friendlyName: "A player ended the down in their own endzone, resulting in a Safety.",
	version     : 1.9,
	execute     : execute,
};