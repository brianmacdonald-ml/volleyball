
function execute() {
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if(scoringChance.statType.name.indexOf("Field Goal") > -1) {
		relevantStat.timeTaken = scoringChance.timeTaken;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Assist",
	friendlyName: "Gives the player an assist.",
	version: 1.5,
	execute: execute
};