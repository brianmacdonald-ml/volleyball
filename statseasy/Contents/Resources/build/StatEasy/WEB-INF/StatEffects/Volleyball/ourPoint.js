function execute() {
	pointFor(relevantStat, relevantStat.opponentStat, currentState, newState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Our Point",
	friendlyName: "Gives us the point and rotates the players if we get the serve",
	version: 2.4,
	execute: execute
};