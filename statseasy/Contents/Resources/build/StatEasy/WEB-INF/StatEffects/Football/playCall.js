
function execute() {
	spreadGameStateBackToTerminal("playCall", relevantStat.statType.name);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Play Call",
	friendlyName: "Sets the play call of the offense.",
	version     : 1.2,
	execute     : execute,
};