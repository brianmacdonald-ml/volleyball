
function execute() {
	adjustTeam();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var batter = currentState.get("currentBatter");
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	
	if (batter == undefined) {
		newState.set("warningMessage", "You must have a batter set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	
	addBatter(relevantStat.opponentStat, 0);
	
	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Attach Batter On",
	friendlyName: "Attaches a batter to a stat",
	version:      1.1,
	execute:      execute,
	provides: "on %sep:'Batter'"
};