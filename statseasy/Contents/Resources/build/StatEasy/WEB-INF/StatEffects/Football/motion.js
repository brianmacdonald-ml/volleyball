
function execute() {
	spreadGameStateBackToTerminal("motion", relevantStat.statType.name);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Motion",
	friendlyName: "Sets the motion of the offense.",
	version     : 1.3,
	execute     : execute,
};