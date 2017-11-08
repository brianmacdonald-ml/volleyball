
function execute() {
	spreadGameStateBackToTerminal("formationShift", relevantStat.statType.name);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Formation Shift",
	friendlyName: "Sets the formation shift that the offense just performed.",
	version     : 1.2,
	execute     : execute,
};