function execute() {
	var scoreString = !relevantStat.opponentStat ? "theirScore" : "ourScore";
	
	addWrestler(relevantStat.opponentStat, 0);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 1);
	}
	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score + 1);

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Stalling",
	friendlyName: "Stalling",
	version: 1.2,
	execute: execute,
	provides: "given to %sep at %set"
};