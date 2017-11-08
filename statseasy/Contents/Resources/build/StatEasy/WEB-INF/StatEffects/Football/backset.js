
function execute() {
	spreadGameStateBackToTerminal("backSet", relevantStat.statType.name);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Back Set",
	friendlyName: "Sets the back set that the offense is in.",
	version     : 1.3,
	execute     : execute,
};