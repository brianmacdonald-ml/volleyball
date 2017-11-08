function execute() {
	var newServer = relevantStat.opponentStat ? "theyDo" : "weDo";
	currentState.set("hasServe", newServer);
	
	pointFor(relevantStat, relevantStat.opponentStat, currentState, newState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Service Ace",
	friendlyName: "Gives our team a point",
	version: 1.5,
	execute: execute
};