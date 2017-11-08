function execute() {
	pointFor(relevantStat, relevantStat.opponentStat, currentState, newState);
	
	setFirstAttempt();
	
	addAssist(relevantStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Kill",
	friendlyName: "Do everything required for a kill",
	version: 1.4,
	execute: execute
};