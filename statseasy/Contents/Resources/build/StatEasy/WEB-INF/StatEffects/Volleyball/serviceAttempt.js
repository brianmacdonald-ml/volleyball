
function execute() {
	currentState.unset("serveType");
	newState.unset("serveType");

	var newServer = !!relevantStat.opponentStat ? "theyDo" : "weDo";
	currentState.set("hasServe", newServer);
	newState.set("hasServe", newServer);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Service Attempt",
	friendlyName: "Will add a serve rating once a passer rating is taken.",
	version: 1.7,
	execute: execute,
};