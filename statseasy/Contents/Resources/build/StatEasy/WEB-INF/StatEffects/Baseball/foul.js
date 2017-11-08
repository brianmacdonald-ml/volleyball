
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
	
	
	addBatter(relevantStat.opponentStat, 0)
	addPitcher(!relevantStat.opponentStat, 1);
	
	var strikeCount = 0;
	
	if(currentState.get("strikeCount")!= null){
		strikeCount = Number(currentState.get("strikeCount"));
	}
		
	if(strikeCount <2){
		strikeCount ++;
	}
	newState.set("strikeCount", strikeCount);
	
	relevantStat.setNumericalAtIndex(strikeCount-1,2);
	
	var pitchcount = !!relevantStat.opponentStat ? "theirPitchCount" : "ourPitchCount";
	var pitch = Number(currentState.get(pitchcount));
	newState.set(pitchcount, pitch+1);
	
	setTimeStamps();
	
	adjustEndTime();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Foul",
	friendlyName: "Foul",
	version:      1.4,
	execute:      execute,
	provides: "on %sep:'Batter' pitched by %seo:'Pitcher' this is Strike %sed?[1,2,3]:'Strike Count'"
};