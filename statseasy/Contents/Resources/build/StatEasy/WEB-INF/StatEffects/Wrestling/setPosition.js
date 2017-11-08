
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var position = relevantStat.allData.get(0);

	if (position == "neutral") {
		otherPosition = "neutral";
	} else if (position =="offensive") {
		otherPosition = "defensive";
	} else {
		otherPosition = "offensive";
	}
	
	newState.set(prefix + "Position", position);
	newState.set(otherPrefix + "Position", otherPosition);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Postition",
	friendlyName: "Sets the current position for this game",
	version:      1.2,
	execute:      execute
};