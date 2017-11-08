var setStats = {
	"Set Attempt"			: true,
	"Assist"				: true,
	"Sideout Success"		: true,
	"Sideout Failure"		: true,
};

var attemptStats = {
	"Kill"			: true,
	"Error"			: true,
	"Attempt"		: true,
}

function isSetStat(someStat) {
	return setStats[someStat.statType.name];
}

function isNotSetStat(someStat) {
	logger.debug("Looking at " + someStat.statType.name);
	return !isSetStat(someStat) && !isAttemptStat(someStat);
}

function isAttemptStat(someStat) {
	return attemptStats[someStat.statType.name];
}

function execute() {
	logger.debug("Executing Set Type for " + relevantStat.statType.name);
	
	var stateName = "setType";
	var stateValue = relevantStat.statType.name;
	var stripText = "Set Type - ";
	if (stateValue.indexOf(stripText) == 0) {
		stateValue = stateValue.substr(stripText.length);
	}
	stateValue = stateValue.replace(/^\s+|\s+$/g, '');
	
	var previousStat = traverseBack(isNotSetStat, function (currentStat) {
		logger.debug("Found " + currentStat.getStatText() + " as a set related stat.  Setting " + stateName + " to " + stateValue);
		
		var beginningState = currentStat.beginningGameState.clone();
		beginningState.set(stateName, stateValue);
		currentStat.beginningGameState = beginningState;
		
		modifiedStats.add(currentStat);
		
		relevantStat.opponentStat = currentStat.opponentStat;
	});
	
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Type",
	friendlyName: "Sets the type of the set for the [Set Attempt, Assist] and the [Kill, Error, Attempt].",
	version: 3.2,
	execute: execute,
};