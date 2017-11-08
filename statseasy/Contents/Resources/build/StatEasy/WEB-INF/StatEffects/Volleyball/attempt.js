
function execute() {
	setFirstAttempt();

	addSetAttempt(relevantStat);
	
	currentState.unset("setType");
	newState.unset("setType");
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name         : "Attempt",
	friendlyName : "A player attacks the ball, and no point is awarded to either team.  Adds a set attempt for our setter, if one is set.",
	version      : 2.3,
	execute      : execute
};