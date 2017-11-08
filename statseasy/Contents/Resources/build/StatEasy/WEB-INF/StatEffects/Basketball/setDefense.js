
function execute() {
	var defenseDefn = {
		0 : 'Man to Man',
		1 : '2-3',
		2 : '3-2',
		3 : '1-3-1',
		4 : 'Half Court',
		5 : 'Full Court'
	};
	var defense = relevantStat.allData.get(0).numericalData;

	var scoreString = relevantStat.opponentStat ? "their" : "our";
	
	newState.set(scoreString + "Defense", defenseDefn[defense]);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Set Defense",
	friendlyName: "Sets the defense type the team is using",
	version     : 1.2,
	execute     : execute,
};