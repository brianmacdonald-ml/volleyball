
function execute() {
	var coverage = relevantStat.allData.get(0).numericalData;
	
	newState.set("coverage", coverage);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Coverage",
	friendlyName: "Sets what coverage scheme the defense is in (0 - 8)",
	version     : 1.2,
	execute     : execute,
};