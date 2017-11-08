
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var distance = Number(currentState.get("distance"));
	
	calculateNewDownAndDistance(0);
	
	// We can add the quarterback information now though.
	addQuarterback(!!relevantStat.opponentStat, 1);
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pass Incomplete",
	friendlyName: "An incomplete pass to a receiver.",
	version     : 1.7,
	execute     : execute,
	provides    : "thrown by %sep",
};