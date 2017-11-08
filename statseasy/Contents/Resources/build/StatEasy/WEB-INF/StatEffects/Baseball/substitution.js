
function isPlayerInGame(playerNumber) {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	return newState.get(teamString + "Player" + playerNumber) == "In";
}

function isPlayerEntry(targetPlayer) {
	return function (someStat) {
		if (isEntryStat(someStat)) {
			for (var i = 0; i < someStat.allData.size(); i++) {
				var data = someStat.allData.get(i);
				if ((data.player != null) && (data.player.id == targetPlayer.id)) {
					return true;
				}
			}
		}
		
		return false;
	}
}

function enteredBefore(targetPlayer) {
	return traverseBack(isPlayerEntry(targetPlayer)) != null;
}

function addPlayerExit(goingOutPlayer) {
	var supplementalTypeName = "Player Exit";
	var supplementalStatType = getStatTypeByName(supplementalTypeName);
	
	if (supplementalStatType != undefined) {
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		supplementalStat.beginningGameState = relevantStat.beginningGameState;
		
		supplementalStat.setPlayerAtIndex(goingOutPlayer, 0);
		supplementalStat.setTimeAtIndex(relevantStat.gameTime, 1);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function addPlayerEntry(goingInPlayer) {
	supplementalTypeName = enteredBefore(goingInPlayer) ? "Player Entry" : "Game Played";
	supplementalStatType = getStatTypeByName(supplementalTypeName);
	
	if (supplementalStatType != undefined) {
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		supplementalStat.beginningGameState = relevantStat.beginningGameState;
		
		supplementalStat.setPlayerAtIndex(goingInPlayer, 0);
		supplementalStat.setTimeAtIndex(relevantStat.gameTime, 1);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function findPlayerPosition(opponentStat, playerNumber){
	var prefix = opponentStat ? "their" : "our";
	
	if (playerNumber == undefined) {
		newState.set("warningMessage", "You must have a player set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to sub this player.");
		return true;
	}
	
	for (var i = 0; i < 9; i++) {
		if (playerNumber == currentState.get(prefix + "PlayerAtPosition" + String(i+1))) {
			return prefix + "PlayerAtPosition" + String(i+1) ;
		}
	}
	
}
function atBase(playerNumber){
	if(playerNumber == currentState.get("playerAtFirst")){
		return true;
	}
	if(playerNumber == currentState.get("playerAtSecond")){
		return true;
	}
	if(playerNumber == currentState.get("playerAtThird")){
		return true;
	}
	if(playerNumber == currentState.get("currentBatter")){
		return true;
	}
	return false;
}
function findPlayerBase(playerNumber){
	if(playerNumber == currentState.get("playerAtFirst")){
		return "playerAtFirst";
	}
	if(playerNumber == currentState.get("playerAtSecond")){
		return "playerAtSecond";
	}
	if(playerNumber == currentState.get("playerAtThird")){
		return "playerAtThird";
	}
	if(playerNumber == currentState.get("currentBatter")){
		return "currentBatter";
	}
}

function substitute(goingOutPlayer, goingOutNumber, 
					goingInPlayer,  goingInNumber) 
{
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	
	var position = findPlayerPosition(relevantStat.opponentStat, goingOutNumber);
	newState.set(position, goingInNumber);
	if(atBase(goingOutNumber)){
		newState.set(findPlayerBase(goingOutNumber), goingInNumber);
	}
	
	newState.unset(teamString + "Player" + goingOutNumber);
	newState.set(teamString + "Player" + goingInNumber, "In");
	
	// If the game clock is not set, then don't add entry/exit times, because
	// they only exist to calculate play time
	if (relevantStat.gameTime == undefined) {
		return;
	}
	
	// Add a player exit for every player subbing out
	addPlayerExit(goingOutPlayer);
	
	// Add an entry for the player going in
	addPlayerEntry(goingInPlayer);
}

function getStatTypeByName(supplementalTypeName) {
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == supplementalTypeName) {
			supplementalStatType = statType;
		}
	}
	
	return supplementalStatType;
}

function execute() {
	var prefix = relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	
	var firstPlayer = relevantStat.allData.get(0).player;
	var firstPlayerNumber = playerIdToNumberMap[firstPlayer.id];
	var secondPlayer = relevantStat.allData.get(1).player;
	var secondPlayerNumber = playerIdToNumberMap[secondPlayer.id];
	substitute(secondPlayer,  secondPlayerNumber, firstPlayer, firstPlayerNumber) 
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name			: "Substitution",
	friendlyName	: "Substitute one player for another",
	version			: 3.5,
	execute			: execute,
	sharedCode		: true,
};