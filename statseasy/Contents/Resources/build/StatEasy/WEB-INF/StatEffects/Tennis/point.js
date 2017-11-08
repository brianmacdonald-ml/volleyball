

function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
	
	
	///////////////////////// Supplemental Portion /////////////////////////////
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var theirPrefix = !!relevantStat.opponentStat ? "our" : "their";
	
	var tiebreakGame = relevantStat.event.eventGrouping.attributes.get("Tiebreak Game?");
	if (tiebreakGame == "yes") {
		return;
	}
	
	var ourScore = Number(currentState.get(prefix + "Score"));
	var theirScore = Number(currentState.get(theirPrefix + "Score"));
	var weHaveServe = currentState.get("hasServe") == "weDo" && !relevantStat.opponentStat || 
		currentState.get("hasServe") == "theyDo" && !!relevantStat.opponentStat;
	
	var scoreDifferential = undefined;
	var successful = undefined;
	var player = undefined;
	var opponentStat = undefined;
	var supplementalTypeName = undefined;
	
	logger.debug("Has Serve " + weHaveServe + " ourScore " + ourScore + " theirScore " + theirScore);
	
	// If we have the serve and they're about to win, the other team has a break point
	// Since we won this point, it is an unsuccessful break point for them
	if (weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = false;
		player = theirPlayer;
		opponentStat = !relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If they have the serve and we're about to win, our team have a break point
	// Since we won this point, it is a successful break point for us
	} else if (!weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = true;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If we have the serve and we're about to win, we have a game point
	// Since we won this point, it is a successful game point for us
	} else if (weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = true;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Game Point";
	// If they have the serve and they're about to win, they have a game point
	// Since we won this point, it is an unsuccessful game point for them
	} else if (!weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = false;
		player = theirPlayer;
		opponentStat = !relevantStat.opponentStat;
		supplementalTypeName = "Game Point";
	}
	
	if (supplementalTypeName != undefined) {
		var supplementalStatType = undefined;
		for (var i = 0; i < allStatTypes.size(); i++) {
			var statType = allStatTypes.get(i);
			if (statType.name == supplementalTypeName) {
				supplementalStatType = statType;
			}
		}
		
		if (supplementalStatType == undefined) {
			newState.set("errorMessage", "You must have a stat called '" + supplementalTypeName + "' in order to take this stat.");
			return;
		}
		
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		var whoGotItData = new Packages.com.ressq.stateasy.model.StatData();
		whoGotItData.player = player;
		supplementalStat.allData.add(whoGotItData);
		
		var successData = new Packages.com.ressq.stateasy.model.StatData();
		successData.numericalData = successful ? 0 : 1;
		supplementalStat.allData.add(successData);
		
		var scoreDifferentialData = new Packages.com.ressq.stateasy.model.StatData();
		scoreDifferentialData.numericalData = scoreDifferential;
		supplementalStat.allData.add(scoreDifferentialData);
		
		newStats.add(supplementalStat);
		
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Point",
	friendlyName: "Awards a point",
	version: 1.1,
	execute: execute
};