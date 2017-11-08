
var statEffectName = "Add Player & Their Point";

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var theirPrefix = !!relevantStat.opponentStat ? "our" : "their";

	///////////////////////// Add Player Portion ///////////////////////////////
	var matchAttrPlayer = undefined;
	var matchAttrTheirPlayer = undefined;
	var relevantPlayerId = undefined;
	var theirRelevantPlayerId = undefined;
	var ourPlayer = undefined;
	var theirPlayer = undefined;
	
	// Traverse the parent groups looking for the maximum parent to get data from
	var parentGrouping = relevantStat.event.eventGrouping;
	var maxParent = undefined;
	while (parentGrouping != null) {
		maxParent = parentGrouping;
		parentGrouping = parentGrouping.parentGroup;
	}
	if (maxParent != undefined) {
		matchAttrPlayer = maxParent.getAttributes().get(prefix + "Player");
		relevantPlayerId = Number(matchAttrPlayer);
		matchAttrTheirPlayer = maxParent.getAttributes().get(theirPrefix + "Player");
		theirRelevantPlayerId = Number(matchAttrTheirPlayer);
	}
	
	if (matchAttrPlayer == undefined) {
		newState.set("errorMessage", "You must first set a player for this event in order to take this stat.");
		return;
	}
	
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (relevantPlayerId == playerInSeason.player.id) {
			var whoHitItData = new Packages.com.ressq.stateasy.model.StatData();
			whoHitItData.player = playerInSeason.player;
			relevantStat.setDataAtIndex(2, whoHitItData);
			ourPlayer = playerInSeason.player;
		}
	}
	
	allPlayers = relevantStat.event[theirPrefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (theirRelevantPlayerId == playerInSeason.player.id) {
			theirPlayer = playerInSeason.player;
		}
	}
	
	/////////////////////////// Point Portion //////////////////////////////////
	var scoreString = !!relevantStat.opponentStat ? "ourScore" : "theirScore";	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
	
	/////////////////////////// Break Point Portion ////////////////////////////
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
	// Since the other team won this point, it is a successful break point for them
	if (weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = true;
		player = theirPlayer;
		opponentStat = !relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If they have the serve and we're about to win, our team have a break point
	// Since the other team won this point, it is an unsuccessful break point for us
	} else if (!weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = false;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If we have the serve and we're about to win, we have a game point
	// Since they won this point, it is an unsuccessful game point for us
	} else if (weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = false;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Game Point";
	// If they have the serve and they're about to win, they have a game point
	// Since they won this point, it is a successful game point for them
	} else if (!weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = true;
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
	name:         statEffectName,
	friendlyName: "Awards the other team a point & Adds data to a statistic: Which player hit the ball",
	version:      3.2,
	execute:      execute,
	provides:     "%sep",
};