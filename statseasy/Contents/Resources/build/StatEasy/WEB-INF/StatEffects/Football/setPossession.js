
function execute() {
	newState.set("hasBall", !!relevantStat.opponentStat ? "theyDo" : "weDo");
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Set Posession",
	friendlyName: "Sets which team has posession.",
	version     : 1.0,
	execute     : execute,
};