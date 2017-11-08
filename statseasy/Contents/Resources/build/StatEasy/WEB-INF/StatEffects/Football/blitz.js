
function execute() {
	spreadGameStateBackToTerminal("blitz", relevantStat.statType.name);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Blitz",
	friendlyName: "Sets how the defense is blitzing.",
	version     : 1.2,
	execute     : execute,
};