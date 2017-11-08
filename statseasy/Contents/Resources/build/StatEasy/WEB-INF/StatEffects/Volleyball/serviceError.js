function execute() {
	var newServer = relevantStat.opponentStat ? "theyDo" : "weDo";
	currentState.set("hasServe", newServer);
	
	pointFor(relevantStat, !relevantStat.opponentStat, currentState, newState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Service Error",
	friendlyName: "Gives their team a point",
	version: 1.4,
	execute: execute
};