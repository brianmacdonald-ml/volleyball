
function execute() {
	adjustTeam();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var batter = currentState.get("currentBatter");
	var pitcher = currentState.get(otherPrefix + "PlayerAtPosition1");
	
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
	
	if (pitcher == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[otherPrefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	addBatter(relevantStat.opponentStat, 0);
	
	addPitcher(!relevantStat.opponentStat, 1);

	setTimeStamps();
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Attach Batter and Pitcher",
	friendlyName: "Attaches a batter and a pitcher to a stat",
	version:      1.3,
	execute:      execute,
	provides: "by %sep:'Batter' pitched by %seo:'Pitcher'"
};