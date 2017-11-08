var terminalStats = {
	"Strikeout"				: true,
	"Walk"					: true,
	"Strike"				: true,
	"Ball"					: true,
	"End Of Play"			: true,
	"Foul"					: true,
	"Touchback"				: true,
	"Fair Catch"			: true,
	"Field Goal Attempt"	: true,
	"2 Point Conversion"	: true,
	"Out of Bounds"			: true,
	"No Return"				: true,
	"Kneel On Ball"         : true,
	"Out of Bounds"         : true,
	"Dead Ball"       		: true,
};

var startStats = {
	"Pitch"					: true,
}
var atBatStat = {
	"Set Batter"			: true,
}

var carryStats = {
	"Carry"					: true,
	"Pass Complete"			: true,
	"Return"				: true,
	"Recovered"				: true,
	"Pass Intercepted"		: true,
	"Lateral"				: true,
}

var metaStats = {
	"Formation"				: true,
	"Play Call" 			: true,
	"Motion" 				: true,
	"Back Set" 				: true,
	"Hash Mark" 			: true,
	"Formation Shift" 		: true,
	"Blitz" 				: true,
	"Coverage" 				: true,
	"Front" 				: true,
	"Onside Kick" 			: true,
}	

function isTerminalStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (terminalStats[someStat.statType.statEffectObject.name]);
}

function isStartStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (startStats[someStat.statType.statEffectObject.name]);
}

function isAtBatStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (atBatStat[someStat.statType.statEffectObject.name]);
}

function isMetaStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (metaStats[someStat.statType.statEffectObject.name]);
}

function isWhistle(someStat) {
	return (someStat.statType.statEffectObject != null) && ("Whistle" == someStat.statType.statEffectObject.name);
}

function statTypeMatches(someStat, typeName) {
	return (someStat.statType.name == typeName);
}

function isNotMetaAndNotWhistleStat(someStat) {
	return !isMetaStat(someStat) && !isWhistle(someStat) && !statTypeMatches(someStat, "Tackle Assist");
}

function isCarryStat(someStat) {
	return (someStat.statType.statEffectObject != null) && (carryStats[someStat.statType.statEffectObject.name]);
}

function untilCarryOrSnap(someStat) {
	return isStartStat(someStat) || isCarryStat(someStat);
}

function isTerminalOrStart(someStat) {
	return (isTerminalStat(someStat) && !isWhistle(someStat)) || isStartStat(someStat);
}

function clearPlayStatesIfTerminal() {
	if (isTerminalStat(relevantStat)) {
		logger.debug("Terminal play detected, clearing play states.");
		clearPlayStates();
	}
}

function clearPlayStates() {
	var unsetThese = ["formation", "playCall", "motion", "backSet", "hash", "formationShift", "blitz", "coverage", "front"];
	
	for (var i in unsetThese) {	
		newState.unset(unsetThese[i]);
	}
}

function spreadGameStateBackToTerminal(stateName, stateValue) {
	var allStats = relevantStat.event.allStats;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	newState.set(stateName, stateValue);
	
	traverseBack(isTerminalStat, function (currentStat) {
		logger.debug("Found " + currentStat.getStatText() + " as a non terminal action.  Setting " + stateName + " to " + stateValue);
		
		currentStat.beginningGameState.set(stateName, stateValue);
		currentStat.endingGameState.set(stateName, stateValue);
		
		modifiedStats.add(currentStat);
	});
}

function setTimeStamps() {
	var stoppingEvent = traverseBack(isStartStat, function (currentStat) {
		var statTypeName = getStatTypeName(currentStat);
		
		logger.debug("Pitch stat found at index " + currentStat.statIndex + " @ " + currentStat.timeInSeconds);
		relevantStat.timeTaken = currentStat.timeTaken;
		relevantStat.endTimeOffset = 5.0;  //In seconds
		
	});

	if (stoppingEvent != undefined) {
		logger.debug("Found a " + stoppingEvent.statType.name + " start stat as index " + stoppingEvent.statIndex);
		relevantStat.seekTimeOffset = stoppingEvent.timeInSeconds - relevantStat.timeInSeconds - 5.0;
	}
}

function checkPreviousStatForAtBat(){
	var allStats = relevantStat.event.allStats;
	
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	if (i>=0){
		var currentStat = allStats.get(i);
		if (getStatTypeName(currentStat) == "Set Batter") {
			currentStat.timeTaken = relevantStat.timeTaken;  //In seconds
		}
	}
	
	modifiedStats.add(currentStat);
}

function setAtBatEndTime(currentStat) {
	
	if (getStatTypeName(currentStat) == "At Bat") {
		var endTime = relevantStat.getTimeInSeconds() + 5.0;
		currentStat.endTimeOffset = endTime - currentStat.getTimeInSeconds();  //In seconds
	}
	
	modifiedStats.add(currentStat);

}

function setEndTime(currentStat) {
	var name = currentStat.getStatText();
	logger.debug("Updating the end time of " + name);
	
	var endTime = relevantStat.getTimeInSeconds() + 5.0;
	relevantStat.endTimeOffset = 5.0;
	currentStat.endTimeOffset = endTime - currentStat.getTimeInSeconds();  //In seconds
	
	modifiedStats.add(currentStat);
}


function adjustEndTime() {
//	traverseBack(isAtBatStat, setAtBatEndTime, true);
	traverseBack(isStartStat, setEndTime, true);
	
}

function getStatTypeName(someStat) {
	return someStat.statType.statEffectObject != undefined ? someStat.statType.statEffectObject.name : undefined;
}

function traverseBack(isStopStatFunction, iterationFunction, includeStoppingStat) {
	var allStats = relevantStat.event.allStats;
	
	var foundStopEvent = false;
	var stopRequested = false;
	var i = relevantStat.getStatIndex() - 1; // Start at the index just before this stat
	var currentStat;
	
	while ((i < allStats.size()) && (0 <= i) && !foundStopEvent && !stopRequested) 
	{
		currentStat = allStats.get(i);
		
		foundStopEvent = isStopStatFunction(currentStat);
		
		if ((!foundStopEvent || includeStoppingStat) && (iterationFunction != undefined)) {
			stopRequested = !!iterationFunction(currentStat);
		}
		i--;
	}
	
	if (foundStopEvent) {
		return currentStat;
	}
}

function adjustTeamToOther() {
	if (currentState.get("currentFieldingTeam") == "our") {
		relevantStat.opponentStat = false;
	} else if (currentState.get("currentFieldingTeam") == "their") {
		relevantStat.opponentStat = true;
	}
}

function adjustTeam() {
	if (currentState.get("currentFieldingTeam") == "our") {
		relevantStat.opponentStat = true;
	} else if (currentState.get("currentFieldingTeam") == "their") {
		relevantStat.opponentStat = false;
	}
}

function getJerseyFromPlayer(player, opponentStat){
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	return playerIdToNumberMap[player.id];
}

function addBatter(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers ;
	var playerId = currentState.get("currentBatter");
	
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a Batter set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (playerId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	if(ourPlayer != null){
		relevantStat.setPlayerAtIndex(ourPlayer, index);
	}
	else{
		newState.set("warningMessage", "Please set a lineup for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}	
}

function getBatter(opponentStat){
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers ;
	var playerId = currentState.get("currentBatter");
	
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a Batter set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (playerId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	if(ourPlayer != null){
		return ourPlayer;
	}
	else{
		newState.set("warningMessage", "Please set a lineup for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
	}
}

function getPitcher(opponentStat){
	return getPlayer(opponentStat, 1);
}

function addPitcher(opponentStat, index) {
	return addPlayer(opponentStat, 1, index);
}

function addPlayer(opponentStat, position, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var playerId = currentState.get(prefix + "PlayerAtPosition" + String(position));
	
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (playerId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	relevantStat.setPlayerAtIndex(ourPlayer, index);
}

function getPlayer(opponentStat, position){
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var playerId = currentState.get(prefix + "PlayerAtPosition" + String(position));
	
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (playerId == playerInSeason.number) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	return ourPlayer;
}

function addCatcherPutOut(opponentStat) {
	var supplementalTypeName = "Catcher";
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
		supplementalStat.opponentStat = !relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		var prefix = supplementalStat.opponentStat ? "their" : "our";
		supplementalStat.setNumericalAtIndex(2, 0);
		supplementalStat.setPlayerAtIndex(getPlayer(supplementalStat.opponentStat,2) ,1);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
	
}

function findPlayerBase(opponentStat, player){
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}	
	var playerId = playerIdToNumberMap[player.id];
	
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a player set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to sub this player.");
		return true;
	}
	if(playerId == currentState.get("playerAtThird")){
		return 3;
	}
	else if(playerId == currentState.get("playerAtSecond")){
		return 2;
	}
	else if(playerId == currentState.get("playerAtFirst")){
		return 1;
	}
	else{
		return 0;
	}	
}


function addRunner(opponentStat, base, index) {
		var prefix = opponentStat ? "their" : "our";
		var otherPrefix = !opponentStat ? "their" : "our";
			var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
		
		if(base == 1)
			var playerId = currentState.get("playerAtFirst");
		else if(base == 2)
			var playerId = currentState.get("playerAtSecond");
		else if(base == 3)
			var playerId = currentState.get("playerAtThird");
		if (playerId == undefined) {
			newState.set("warningMessage", "You must have a runner set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
			return true;
		}
		
		var playerIdToNumberMap = {};
		for (var i = 0; i < allPlayers.size(); i++) {
			var playerInSeason = allPlayers.get(i);
			playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
		}
		
		var ourPlayer = null;
		for (var i = 0; i < allPlayers.size(); i++) {
			var playerInSeason = allPlayers.get(i);
			if (Number(playerId) == playerIdToNumberMap[playerInSeason.player.id]) {
				ourPlayer = playerInSeason.player;
				relevantStat.setPlayerAtIndex(ourPlayer, index);
			}
		}
	}

function getRunner(opponentStat, base) {
	var prefix = opponentStat ? "their" : "our";
	var otherPrefix = !opponentStat ? "their" : "our";
		var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	if(base == 1)
		var playerId = currentState.get("playerAtFirst");
	else if(base == 2)
		var playerId = currentState.get("playerAtSecond");
	else if(base == 3)
		var playerId = currentState.get("playerAtThird");
	if (playerId == undefined) {
		newState.set("warningMessage", "You must have a runner set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var playerIdToNumberMap = {};
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (Number(playerId) == playerIdToNumberMap[playerInSeason.player.id]) {
			ourPlayer = playerInSeason.player;
			return ourPlayer
		}
	}
}

function addRunStat(playerId, baseFrom){
	var prefix = relevantStat.opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	
	var supplementalTypeName = "Run";
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
		var prefix = supplementalStat.opponentStat ? "their" : "our";
		
		var playerIdToNumberMap = {};
		for (var i = 0; i < allPlayers.size(); i++) {
			var playerInSeason = allPlayers.get(i);
			playerIdToNumberMap[playerInSeason.player.id] = playerInSeason.number;
		}
		
		var ourPlayer = null;
		for (var i = 0; i < allPlayers.size(); i++) {
			var playerInSeason = allPlayers.get(i);
			if (Number(playerId) == playerIdToNumberMap[playerInSeason.player.id]) {
				ourPlayer = playerInSeason.player;
				supplementalStat.setPlayerAtIndex(ourPlayer, 2);
				supplementalStat.setNumericalAtIndex(baseFrom-1,0);
				
			}
		}
	
		supplementalStat.setNumericalAtIndex(0,1);
		supplementalStat.setPlayerAtIndex(getPitcher(!relevantStat.opponentStat), 3);
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
	addRBIStat();
	
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

function changeBattingTeam(){
	inning = Number(currentState.get("inning"));
	inning = inning +0.5;
	newState.set("inning", inning);
	newState.set("outCount", 0)
	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);
	newState.set("playerAtFirst",0);
	newState.set("playerAtSecond",0);
	newState.set("playerAtThird",0);
	newState.set("playerScored",0);
	newState.set("playerScored1",0);
	newState.set("playerScored2",0);
	newState.set("playerScored3",0);
	if(currentState.get("currentBattingTeam") == "their"){
		newState.set("currentBattingTeam", "our");
		newState.set("currentFieldingTeam", "their");
	}
	else{
		newState.set("currentFieldingTeam", "our");
		newState.set("currentBattingTeam", "their");
	}
}

function execute() {
	adjustTeamToOther();
	checkPreviousStatForAtBat();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pitch",
	friendlyName: "Marks the beginning of the play.",
	version     : 14.7,
	execute     : execute,
	sharedCode	: true,
};