
function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Point",
	friendlyName: "Awards a point",
	version: 1.0,
	execute: execute
};