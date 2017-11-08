

function isSubOrStartingLineup(someStat) {
	return (someStat.statType.statEffectObject != null) && 
	((someStat.statType.statEffectObject.name == "Substitution") || (someStat.statType.statEffectObject.name == "Set Lineup")
	|| (someStat.statType.statEffectObject.name == "Set Position") || (someStat.statType.statEffectObject.name == "New Pitcher")
	|| (someStat.statType.statEffectObject.name == "Pinch Hitter") || (someStat.statType.statEffectObject.name == "Pinch Runner"));
}


function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";

	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var otherPlayers = relevantStat.event[otherPrefix + "Season"].allPlayers;
	var inningsPlayed = new Array();
	
	for (var i = 0; i < allPlayers.size(); i++) {
		var player = allPlayers.get(i).player;
		inningsPlayed.push([player,0,0,"played"]);
	}
	for (var i = 0; i < otherPlayers.size(); i++) {
		var player = otherPlayers.get(i).player;
		inningsPlayed.push([player,0,0,"played"]);
	}
	inningsPlayed = goBack(isSubOrStartingLineup, inningsPlayed);
	for (var i = 0; i < allPlayers.size(); i++) {
		var player = allPlayers.get(i).player;
		for(var j = 0; j < inningsPlayed.length; j++ ){
			inning = inningsPlayed[j];
			if(inning[0] == player){
				setInningsPlayed(player, inning, relevantStat.opponentStat);
			}
		}
	}
	for (var i = 0; i < otherPlayers.size(); i++) {
		var player = otherPlayers.get(i).player;
		for(var j = 0; j < inningsPlayed.length; j++ ){
			inning = inningsPlayed[j];
			if(inning[0] == player){
				setInningsPlayed(player, inning, !relevantStat.opponentStat);
			}
		}
	}
}

function setInningsPlayed(player, inningsPlayed, opponentStat){
	if(inningsPlayed[3]== "played"){
		var supplementalTypeName = "Innings Played";
	}
	else{
		var supplementalTypeName = "Innings Pitched";
	}
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
		supplementalStat.opponentStat = opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		var innings = inningsPlayed[2] - inningsPlayed[1];

		supplementalStat.setNumericalAtIndex(innings, 1);
		supplementalStat.setPlayerAtIndex(player, 0);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function findType(typeName) {
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == typeName) {
			return statType;
		}
	}
}

function goBack(isStopStatFunction, inningsPlayed) {
	var allStats = relevantStat.event.allStats;
	
	var foundStopEvent = false;
	var stopRequested = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	while ((i < allStats.size()) && (0 <= i)) 
	{
		currentStat = allStats.get(i);
		
		foundStopEvent = isStopStatFunction(currentStat);
		if (foundStopEvent) {
			var newGameState = currentStat.getEndingGameState().clone();
			if(currentStat.statType.statEffectObject.name != "Set Lineup" && currentStat.statType.statEffectObject.name != "Set Position"){
				for(var j = 0; j < inningsPlayed.length; j++ ){
					inning = inningsPlayed[j];
					if(inning[0] == currentStat.allData.get(0).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2]==0){
							inning[2]=10
						}
					}
					else if(inning[0] == currentStat.allData.get(1).player){
						inning[2] =  (newGameState.get("inning"));
					}
				}
			}
			else if(currentStat.statType.statEffectObject.name == "Set Position"){
				for(var j = 0; j < inningsPlayed.length; j++ ){
					inning = inningsPlayed[j];
					if(inning[0] == currentStat.allData.get(1).player){
						inning[1] = newGameState.get("inning");
						if(inning[2]==0){
							inning[2]=10
						}
					}
					else if(inning[0] == currentStat.allData.get(2).player){
						inning[2] =  (newGameState.get("inning"));
					}
					if(currentStat.allData.get(0)==0){
						inning[3] = "pitched";
					}
				}
			}
			else{
				for(var j = 0; j < inningsPlayed.length; j++ ){
					inning = inningsPlayed[j];
					if(inning[0] == currentStat.allData.get(0).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
						inning[3] = "pitched";
					
					}
					else if(inning[0] == currentStat.allData.get(1).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(2).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(3).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(4).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(5).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(6).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(7).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
					else if(inning[0] == currentStat.allData.get(8).player){
						inning[1] =  (newGameState.get("inning"));
						if(inning[2] == 0){
							inning[2] = 10;
						}
					}
				}		
			}
		}
		i--;
	}
	return inningsPlayed;
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "End Of Game",
	friendlyName: "The end of the game",
	version:      7.8,
	execute:      execute,
};