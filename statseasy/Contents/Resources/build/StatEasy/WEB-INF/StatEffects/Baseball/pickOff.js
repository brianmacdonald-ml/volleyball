
function execute() {
	adjustTeamToOther();
	var baseOn = relevantStat.allData.get(0).numericalData;
	
	if(baseOn == 0)
		baseOn = 1;
	else if(baseOn == 1)
		baseOn = 2;
	else if(baseOn == 2)
		baseOn = 3;
	
	relevantStat.setNumericalAtIndex(0,2);
	
	addRunner(!relevantStat.opponentStat, Number(baseOn), 3)
	
	addPitcher(relevantStat.opponentStat, 1);


}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Pickoff Attempt",
	friendlyName: "A pickoff attempt occured",
	version:      2.1,
	execute:      execute,
	provides: "%sep:'Pitcher' had a pickoff %sed?[Attempt, Success]:'Attempt or Success' on %seo:'Runner'"
};