
var statEffectName = "Service";

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var theirPrefix = !!relevantStat.opponentStat ? "our" : "their";
	var ourPoint = false;
	var theirPoint = false;
	
	var serviceNumber = relevantStat.allData.get(0).numericalData;
	var serviceData = relevantStat.allData.get(1).numericalData;
	
	// Ace and Winners give a point.  The Stat definition should be %d?[1,2] %d?[a,i,o,n,w]
	if ((serviceData == 0) || (serviceData == 4)) {
		var score = Number(currentState.get(prefix + "Score"));
		newState.set(prefix + "Score", score+1);
		ourPoint = true;
	}
	
	// Net and Out on the second serve is a double fault and will award the other team a point
	if ((serviceNumber == 1) && ((serviceData == 2) || (serviceData == 3))) {
		var score = Number(currentState.get(theirPrefix + "Score"));
		newState.set(theirPrefix + "Score", score+1);
		theirPoint = true;
	}
	
	relevantStat.actionEndingStat = ourPoint || theirPoint;
	
	var hasServe = !!relevantStat.opponentStat ? "theyDo" : "weDo";
	newState.set("hasServe", hasServe);

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
	
	/////////////////////////// Break Point Portion ////////////////////////////
	// We only have a break point situation (won or lost) if a point was scored
	if (!ourPoint && !theirPoint) {
		return;
	}
	
	var tiebreakGame = relevantStat.event.eventGrouping.attributes.get("Tiebreak Game?");
	if (tiebreakGame == "yes") {
		return;
	}
	
	var ourScore = Number(currentState.get(prefix + "Score"));
	var theirScore = Number(currentState.get(theirPrefix + "Score"));
	var weHaveServe = hasServe == "weDo" && !relevantStat.opponentStat || 
		hasServe == "theyDo" && !!relevantStat.opponentStat;
	
	var scoreDifferential = undefined;
	var successful = undefined;
	var player = undefined;
	var opponentStat = undefined;
	var supplementalTypeName = undefined;
	
	logger.debug("Has Serve " + weHaveServe + " ourScore " + ourScore + " theirScore " + theirScore);
	
	// If we have the serve and they're about to win, the other team has a break point
	// If we won this point, it is an unsuccessful break point for them
	if (weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = !ourPoint;
		player = theirPlayer;
		opponentStat = !relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If they have the serve and we're about to win, our team have a break point
	// If we won this point, it is a successful break point for us
	} else if (!weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = ourPoint;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Break Point";
	// If we have the serve and we're about to win, we have a game point
	// If we won this point, it is a successful game point for us
	} else if (weHaveServe && (ourScore >= 3) && (ourScore - theirScore >= 1)) {
		scoreDifferential = ourScore - theirScore;
		successful = ourPoint;
		player = ourPlayer;
		opponentStat = !!relevantStat.opponentStat;
		supplementalTypeName = "Game Point";
	// If they have the serve and they're about to win, they have a game point
	// If we won this point, it is an unsuccessful game point for them
	} else if (!weHaveServe && (theirScore >= 3) && (theirScore - ourScore >= 1)) {
		scoreDifferential = theirScore - ourScore;
		successful = !ourPoint;
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
	name        : statEffectName,
	friendlyName: "Gives a point if the serve was an ace or a winner",
	version     : 3.3,
	execute     : execute,
	provides    : "%sep",
};