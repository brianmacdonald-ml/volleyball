
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var endingYardLine = getYardLineFrom(relevantStat, 1, 2);
	
	advancedTo(endingYardLine);
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Tackle",
	friendlyName: "A player tackles the ball carrier.",
	version     : 5.6,
	execute     : execute,
};