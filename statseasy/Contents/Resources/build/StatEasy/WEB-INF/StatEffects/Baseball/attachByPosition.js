
function execute() {

	var position = relevantStat.allData.get(0).numericalData;
	
	addPlayer(relevantStat.opponentStat, position, 1);
	
	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Attach by Position",
	friendlyName: "Attaches a player by position to a stat",
	version:      1.1,
	execute:      execute,
	provides: "%sep:'Player'"
};