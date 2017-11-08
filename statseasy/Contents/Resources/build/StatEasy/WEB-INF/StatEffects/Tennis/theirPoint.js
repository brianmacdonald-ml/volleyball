

function execute() {
	var scoreString = !!relevantStat.opponentStat ? "ourScore" : "theirScore";	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Their Point",
	friendlyName: "Awards a point to the other team",
	version: 1.0,
	execute: execute
};