
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var distance = Number(currentState.get("distance"));
	var endingYardLine = !!relevantStat.opponentStat ? -50 : 50;
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, relevantStat.opponentStat);
	
	var carryStat = addDistanceToCarryStat(distanceData);
	// If we just modify the ending state of the stat directly, all 
	// of the other stats that link to that gameState will have their down and distance 
	// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
	var newGameState = carryStat.getEndingGameState().clone();
	newGameState.set("down", "1");
	newGameState.set("distance", "10");
	newGameState.set("result", "2pc");
	carryStat.setEndingGameState(newGameState);
	
	modifiedStats.add(carryStat);
	
	newState.set("yardLine", endingYardLine);
	
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score + 2);
	
	adjustEndTime();
	
	clearPlayStatesIfTerminal();
	
	newState.unset("down");
	newState.unset("distance");
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "2 Point Conversion",
	friendlyName: "A run or a pass that results in a successful 2 point conversion!",
	version     : 1.2,
	execute     : execute,
};