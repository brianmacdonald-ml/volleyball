
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
	
	var outCount = 0;
	
	if(currentState.get("outCount")!= null)
		outCount = Number(currentState.get("outCount"));
	
	newState.set("outCount", outCount +1);
	
	relevantStat.setNumericalAtIndex(outCount, 1);

	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);
	
	if(outCount >= 2){
		newState.set("outCount", 0);
		changeBattingTeam();
	}
	
	setTimeStamps();
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Infield Fly",
	friendlyName: "Infield Fly",
	version:      1.2,
	execute:      execute,
	provides: "on %sep:'Batter' this is Out %sed?[1,2,3]:'Out Count'"
};