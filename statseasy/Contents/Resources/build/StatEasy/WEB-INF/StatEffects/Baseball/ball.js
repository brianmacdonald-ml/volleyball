
function execute() {
	adjustTeam();
	var prefix = !relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !!relevantStat.opponentStat ? "their" : "our";
	var batter = currentState.get("currentBatter");
	var pitcher = currentState.get(prefix + "PlayerAtPosition1");
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	
	if (batter == undefined) {
		newState.set("warningMessage", "You must have a batter set for " + relevantStat.event[otherPrefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	if (pitcher == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	addBatter(relevantStat.opponentStat, 0);
	
	addPitcher(!relevantStat.opponentStat, 1);
	
	var ballCount = 0;
	
	if(currentState.get("ballCount")!= null)
		ballCount = Number(currentState.get("ballCount"));
	
	newState.set("ballCount", ballCount +1);
	if(ballCount >= 3){
		addWalk();
		if(currentState.get("playerAtFirst") != null && currentState.get("playerAtFirst") != 0){
			newState.set("playerAtSecond", currentState.get("playerAtFirst"));
			if(currentState.get("playerAtSecond") != null && currentState.get("playerAtSecond") != 0){
				newState.set("playerAtThird", currentState.get("playerAtSecond"));
				if(currentState.get("playerAtThird") != null && currentState.get("playerAtThird") != 0){
					newState.set("playerScored", currentState.get("playerAtThird"));
					addRunStat(currentState.get("playerAtThird"),3);
				}
			}
		}
		
		newState.set("playerAtFirst", batter);
		
		newState.set("strikeCount", 0);
		newState.set("ballCount", 0);
	}
	
	relevantStat.setNumericalAtIndex(ballCount, 2);
	
	var ballcount = !relevantStat.opponentStat ? "theirBallCount" : "ourBallCount";
	var balls = Number(currentState.get(ballcount));
	newState.set(ballcount, balls+1);
	
	setTimeStamps();
	
	adjustEndTime();
	
}
function addWalk() {
	var supplementalTypeName = "Walk";
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == supplementalTypeName) {
			supplementalStatType = statType;
		}
	}
	
	if (supplementalStatType != undefined) {
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		if(relevantStat.getAllData().get(0).time!=null){
			supplementalStat.setTimeAtIndex(relevantStat.getAllData().get(0).time, 0);
		}
			
		supplementalStat.setPlayerAtIndex(getBatter(supplementalStat.opponentStat), 0);
		supplementalStat.setPlayerAtIndex(getPitcher(!supplementalStat.opponentStat), 1);
		
		setTimeStamps();
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Ball",
	friendlyName: "Ball",
	version:      3.3,
	execute:      execute,
	provides: "on %sep:'Batter' pitched by %seo:'Pitcher' this is Ball %sed?[1,2,3,4]:'Ball Count'"
};