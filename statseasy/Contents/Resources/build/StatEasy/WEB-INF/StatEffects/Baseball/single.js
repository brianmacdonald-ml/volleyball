
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
		
		if(currentState.get("playerAtSecond") != null && currentState.get("playerAtSecond") != 0){
			
			if(currentState.get("playerAtThird") != null && currentState.get("playerAtThird") != 0){
				newState.set("playerScored", currentState.get("playerAtThird"));
				addRunStat(currentState.get("playerAtThird"),3);
				var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
				var score = Number(currentState.get(scoreString));

				newState.set(scoreString, score+1);
			}
			newState.set("playerAtThird", currentState.get("playerAtSecond"));
		}
		newState.set("playerAtSecond", currentState.get("playerAtFirst"));
	}
	
	newState.set("playerAtFirst", batter);
	
	var hitString = !!relevantStat.opponentStat ? "theirHits" : "ourHits";
	var hits = Number(currentState.get(hitString));
	newState.set(hitString, hits+1);
	
	setTimeStamps();
	
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Single",
	friendlyName: "The Batter hit a single",
	version:      4.4,
	execute:      execute,
	provides: "by %sep:'Batter' on a pitch by %seo:'Pitcher'"
};