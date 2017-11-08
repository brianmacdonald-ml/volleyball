function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var setChoiceDefn = {
		0 : 'k',
		1 : 'z',
		2 : 'e',
	};
	var setResult = relevantStat.allData.get(3).numericalData;

	if (setChoiceDefn[setResult] == 'k') {
		logger.debug("Kill Detected");
		pointFor(relevantStat, relevantStat.opponentStat, currentState, newState);
	} else if (setChoiceDefn[setResult] == 'e') {
		logger.debug("Error Detected");
		pointFor(relevantStat, !relevantStat.opponentStat, currentState, newState);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Setting Choice",
	friendlyName: "Awards points and rotates teams based on the result field in the 'Setting Choice' stat.",
	version     : 1.5,
	execute     : execute,
};