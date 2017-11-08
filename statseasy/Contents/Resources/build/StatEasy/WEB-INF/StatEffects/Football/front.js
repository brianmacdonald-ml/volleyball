
function execute() {
	var frontDefn = {
		0 : 'even',
		1 : 'odd',
	};
	var front = relevantStat.allData.get(0).numericalData;
	
	newState.set("front", frontDefn[front]);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Front",
	friendlyName: "Sets whether the defense is an even or odd front (e, or o)",
	version     : 1.1,
	execute     : execute,
};