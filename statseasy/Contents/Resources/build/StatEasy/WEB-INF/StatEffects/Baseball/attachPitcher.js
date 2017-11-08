
function execute() {
	adjustTeamToOther();
	var prefix = !relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !!relevantStat.opponentStat ? "their" : "our";
	var pitcher = currentState.get(otherPrefix + "PlayerAtPosition1");
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	

	
	if (pitcher == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[otherPrefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	addPitcher(relevantStat.opponentStat, 0);

	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Attach Pitcher",
	friendlyName: "Attaches a pitcher to a stat",
	version:      1.4,
	execute:      execute,
	provides: "by %sep:'Pitcher'"
};