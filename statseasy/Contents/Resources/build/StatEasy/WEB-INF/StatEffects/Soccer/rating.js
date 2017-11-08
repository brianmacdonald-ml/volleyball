
function execute() {
	var allStats = relevantStat.event.allStats;
	var previousStatIndex = relevantStat.getStatIndex() - 1;
	
	if ((0 <= previousStatIndex) && 
		(allStats.get(previousStatIndex).statType.statEffect != undefined) && 
		(allStats.get(previousStatIndex).statType.effectName == "Ratable")) 
	{
		allStats.get(previousStatIndex).setNumericalAtIndex(relevantStat.getAllData().get(0).numericalData, 0);
		modifiedStats.add(allStats.get(previousStatIndex));
	} else {
		logger.debug(allStats.get(previousStatIndex).statType.name);
		logger.debug(allStats.get(previousStatIndex).statType.effectName);
		newState.set("warningMessage", "I didn't find anything to rate before this " + relevantStat.statType.name);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Rating",
	friendlyName: "Rate the previous stat on a 0 - 5 scale.",
	version     : 1.3,
	execute     : execute,
};