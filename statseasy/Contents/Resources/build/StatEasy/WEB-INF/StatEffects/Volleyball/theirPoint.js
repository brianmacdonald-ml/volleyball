function execute() {
	pointFor(relevantStat, !relevantStat.opponentStat, currentState, newState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Their Point",
	friendlyName: "Gives their team a point",
	version: 2.4,
	execute: execute
};