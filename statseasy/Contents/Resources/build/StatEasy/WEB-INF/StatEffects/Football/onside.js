
function execute() {
	var playStartingStat = traverseBack(isStartStat);
	if ((playStartingStat != undefined) && (playStartingStat.statType.name == "Kickoff")) {
		relevantStat.opponentStat = playStartingStat.opponentStat;
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Onside Kick",
	friendlyName: "The preceeding play was a kickoff and it was an onside kick.",
	version     : 1.0,
	execute     : execute,
};