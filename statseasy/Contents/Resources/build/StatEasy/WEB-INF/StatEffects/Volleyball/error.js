function execute() {
	pointFor(relevantStat, !relevantStat.opponentStat, currentState, newState);
	
	setFirstAttempt();
	
	addSetAttempt(relevantStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Error",
	friendlyName: "Do everything required for an error",
	version: 1.7,
	execute: execute
};