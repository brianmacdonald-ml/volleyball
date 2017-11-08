
function execute() {
	var hashMarkDefn = {
		0 : 'left',
		1 : 'right',
		2 : 'center',
	};
	var hashMark = relevantStat.allData.get(0).numericalData;
	
	newState.set("hash", hashMarkDefn[hashMark]);
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Hash Mark",
	friendlyName: "Sets which hash mark the next play will start on (l, r, or c)",
	version     : 1.2,
	execute     : execute,
};