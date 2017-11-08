
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var offense = relevantStat.allData.get(0).numericalData;
	var midi = relevantStat.allData.get(1).numericalData;
	var defense = relevantStat.allData.get(2).numericalData;
	
	if (offense + midi + defense > 10) {
		newState.set("errorMessage", "Formation numbers must add up to no more than 10");
	} else {
		newState.set(prefix + "Formation", offense + "-" + midi + "-" + defense);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Formation",
	friendlyName: "Sets the current formation.",
	version: 1.1,
	execute: execute
};