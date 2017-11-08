var serveStats = {
	"Service Attempt"	: true,
	"Service Ace"		: true,
	"Service Error"		: true,
}

function stopAtServe(someStat) {
	return serveStats[someStat.statType.name];
}

function execute() {
	var stateName = "serveType";
	var stateValue = relevantStat.statType.name;
	var stripText = "Serve Type - ";
	if (stateValue.indexOf(stripText) == 0) {
		stateValue = stateValue.substr(stripText.length);
	}
	
	stateValue = stateValue.replace(/^\s+|\s+$/g, '');
	
	var previousStat = traverseBack(stopAtServe, function (currentStat) {
		logger.debug("Found " + currentStat.getStatText() + " as a non serve stat.  Setting " + stateName + " to " + stateValue);
		
		// Set the "type" of this serve to be the name of this stat type.
		setBeginningState(currentStat, stateName, stateValue);
	});
	
	logger.debug("Previous Stat found " + (previousStat == null ? "null" : previousStat.statType.name));
	
	if ((previousStat != null) && 
		((previousStat.statType.name == "Service Attempt") || 
		 (previousStat.statType.name == "Service Ace") || 
		 (previousStat.statType.name == "Service Error"))) 
	{
		// Set the "type" of this serve to be the name of this stat type.
		setBeginningState(previousStat, stateName, stateValue);
		
		relevantStat.opponentStat = previousStat.opponentStat;
	}
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Serve Type",
	friendlyName: "Sets the type of the serve.",
	version: 1.9,
	execute: execute,
};