
function execute() {
	adjustTeam();
	var baseOn = relevantStat.allData.get(0).numericalData;
	var position = relevantStat.allData.get(2).numericalData;
	
	if(baseOn == 0){
		baseOn = 1;
		baseString = "playerAtFirst";
	}
	else if(baseOn == 1){
		baseOn = 2;
		baseString = "playerAtSecond";
	}	
	else if(baseOn == 2){
		baseOn = 3;
		baseString = "playerAtThird";
	}
	addRunner(relevantStat.opponentStat, Number(baseOn), 3);
	
	addOut(baseOn);
	newState.set("strikeCount", 0);
	newState.set("ballCount", 0);
	
	addCatcherAssist(!relevantStat.opponentStat);
	addPlayerPutout(!relevantStat.opponentStat,getPlayer(!relevantStat.opponentStat,Number(position)+1),Number(position)+1)

	newState.set(baseString,0);
}

function addOut(base) {
	var supplementalTypeName = "Out";
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
		supplementalStat.opponentStat = !!relevantStat.opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		supplementalStat.setNumericalAtIndex(0, 0);
		outcount = 0;
		if(currentState.get("outCount")!= undefined){
			outcount = currentState.get("outCount");
		}
		outcount++;
		newState.set("outCount", outcount);
		supplementalStat.setNumericalAtIndex(outcount-1, 1);
		supplementalStat.setPlayerAtIndex(getRunner(supplementalStat.opponentStat, base), 0);
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

function addCatcherAssist(opponentStat) {
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
		supplementalStat.setNumericalAtIndex(1, 0);
		supplementalStat.setPlayerAtIndex(getPlayer(supplementalStat.opponentStat,2) ,1);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
	
}
function addPlayerPutout(opponentStat,player,position) {
	var supplementalTypeName = getPosition(position);
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
		supplementalStat.setPlayerAtIndex(getPlayer(supplementalStat.opponentStat,position) ,1);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
	
}
function getPosition(position){
	if(position == 1){
		return "Pitcher"
	}else if(position == 2){
		return "Catcher"
	}else if(position == 3){
		return "1st Baseman"
	}else if(position == 4){
		return "2nd Baseman"
	}else if(position == 5){
		return "3rd Baseman"
	}else if(position == 6){
		return "Shortstop"
	}else if(position == 7){
		return "Left Fielder"
	}else if(position == 8){
		return "Center Fielder"
	}else if(position == 9){
		return "Right Fielder"
	}
}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Caught Stealing",
	friendlyName: "A runner got caught stealing",
	version:      3.1,
	execute:      execute,
	provides: "%sep:'Runner' was caught"
};