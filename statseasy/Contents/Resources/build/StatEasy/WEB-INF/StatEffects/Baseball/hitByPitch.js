
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
	
	if(currentState.get("playerAtFirst") != null && currentState.get("playerAtFirst") != 0){
		newState.set("playerAtSecond", currentState.get("playerAtFirst"));
		if(currentState.get("playerAtSecond") != null && currentState.get("playerAtSecond") != 0){
			newState.set("playerAtThird", currentState.get("playerAtSecond"));
			if(currentState.get("playerAtThird") != null && currentState.get("playerAtThird") != 0){
				newState.set("playerScored", currentState.get("playerAtThird"));
			}
		}
	}
	
	newState.set("playerAtFirst", batter);
	
	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);
	
	var ballcount = !relevantStat.opponentStat ? "theirBallCount" : "ourBallCount";
	var balls = Number(currentState.get(ballcount));
	newState.set(ballcount, balls+1);

	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Hit by Pitch",
	friendlyName: "Hit by Pitch",
	version:      1.1,
	execute:      execute,
	provides: "on %sep:'Batter' pitched by %seo:'Pitcher'"
};