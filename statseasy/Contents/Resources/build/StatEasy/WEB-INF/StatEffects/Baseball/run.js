
function execute() {
	adjustTeam();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var baseOn = relevantStat.allData.get(0).numericalData;
	
	if(baseOn == 0)
		baseOn = 1;
	else if(baseOn == 1)
		baseOn = 2;
	else if(baseOn == 2)
		baseOn = 3;
	
	
	addRunner(relevantStat.opponentStat, Number(baseOn), 2)
	
	addPitcher(!relevantStat.opponentStat, 3);
	
//	addBatter(relevantStat.opponentStat, 4);
	
	var batter = currentState.get("currentBatter");
	var pitcher = currentState.get(otherPrefix + "PlayerAtPosition1");
	
	if (batter == undefined) {
		newState.set("warningMessage", "You must have a batter set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}
	

//	addPitcher(!relevantStat.opponentStat, 1);
	
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	if(baseOn == 1 && currentState.get("playerAtFirst") != null && currentState.get("playerAtFirst") != 0){
		newState.set("playerScored", currentState.get("playerAtFirst"));
		newState.set("playerAtFirst", 0);
		if(baseOn == 2 && currentState.get("playerAtSecond") != null && currentState.get("playerAtSecond") != 0){
			newState.set("playerScored", currentState.get("playerAtSecond"));
			newState.set("playerAtSecond", 0);
			if(baseOn == 3 && currentState.get("playerAtThird") != null && currentState.get("playerAtThird") != 0){
				newState.set("playerScored", currentState.get("playerAtThird"));
				newState.set("playerAtThird", 0);
				
			}
		}
	}
	

	
	newState.set(scoreString, score+1);
	
	if(relevantStat.allData.get(1).numericalData==0){
		addRBIStat();
	}
	adjustEndTime();

}

function addRBIStat() {
	var supplementalTypeName = "Run Batted In";
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
	name:         "Run",
	friendlyName: "A player made a run!",
	version:      3.8,
	execute:      execute,
	provides: "by %sep:'Player' on %seo:'Pitcher'"
};