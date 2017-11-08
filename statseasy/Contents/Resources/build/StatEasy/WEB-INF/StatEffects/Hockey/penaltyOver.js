
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var ourPenaltyCount = currentState.get("ourPenaltyCount");
	if (ourPenaltyCount == undefined) {
		newState.set("errorMessage", "No penalties for out team found in this Game.");
		return true;
	}
	var theirPenaltyCount = currentState.get("theirPenaltyCount");
	if (theirPenaltyCount == undefined) {
		newState.set("errorMessage", "No penalties for their team found in this Game.");
		return true;
	}
	
	var player = relevantStat.getAllData().get(0).getPlayer();
	if (findPenalty(relevantStat, allStats, player)){
		var prefix = !!relevantStat.opponentStat ? "their" : "our";
		var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
		var previousStatPrefix = !!previousStat.opponentStat ? "their" : "our";
		
		ourPenaltyCount = Number(ourPenaltyCount);
		theirPenaltyCount = Number(theirPenaltyCount);
		
		if (prefix == "our") {
		//our teams penalty has ended
			//A penalty cannot be over that doesn't exist.
			if (ourPenaltyCount == 0){
				newState.set("errorMessage", "Our team has no open penalty.");
			}
			//valid penatly
			else {
				//we have the same amount of guys on ice
				if (ourPenaltyCount == theirPenaltyCount){
					//do nothing
				}
				//if the previous stat was penalty over for their team - these penalties must have been coincendental penalties that are ending
				else if ((previousStat.statType.name =="Penalty Over") && (previousStatPrefix == "their")){					
					//do nothing
				}

				//else if we are still down players, their PP has not ended.
				else if ((ourPenaltyCount-1) > theirPenaltyCount){
					//do nothing
				}
				
				else {
					//create a stat indicating an ended PP for their team
					addPowerPlayOver(true);
				}
				ourPenaltyCount = ourPenaltyCount - 1;
				newState.set("ourPenaltyCount", ourPenaltyCount);
			}//end valid penalty
		}
		else {
			//A penalty cannot be over that doesn't exist.
			if (theirPenaltyCount == 0){
				newState.set("errorMessage", "Their team has no open penalty.");
			}
			//valid penatly
			else {
				if (ourPenaltyCount == theirPenaltyCount){
					//do nothing
				}
				//if the previous stat was penalty over for our team - these penalties must have been coincendental penalties
				else if ((previousStat.statType.name =="Penalty Over") && (previousStatPrefix == "our")){					
					//do nothing
				}
				
				
				//else if they are still down players, our PP has not ended.
				else if ((theirPenaltyCount-1) > ourPenaltyCount){
					//do nothing
				}
				
				
				else {
					//create a stat indicating an ended PP for our team
					addPowerPlayOver(false);
				}
				theirPenaltyCount = theirPenaltyCount - 1;
				newState.set("theirPenaltyCount", theirPenaltyCount);
			}//end valid penalty
		}//end their penalty ended
		
	}
}//end execute




function findPenalty(relevantStat, allStats, player){
	//when goal is scored, start look back at previous stats
	var playersPenalty;
	for (var i=relevantStat.getStatIndex(); i!= 0; --i){
		playersPenalty = allStats.get(i-1);
		 //look for an ending stat
		java.lang.System.out.println("HELLO" + playersPenalty)
//		java.lang.System.out.println("HELLO" + playersPenalty.getAllData().size())
		
		//check if this stat has a player associated with it.
		if (playersPenalty.getAllData().size() != 0) {
			if ((playersPenalty.getAllData().get(0).getPlayer() == player) && (playersPenalty.statType.name == "Penalty")) {
				return true;
			}
			//TODO check for a penalty over w/ dude's name on it...1st or 2nd? if we find one deny the penatly over
		}
	}
	newState.set("errorMessage", "No penalties found for " + player.lastName);

}

function addPowerPlayOver(opponentStat) {
	var supplementalTypeName = "Power Play Over";
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
	name:    "Penalty Over",
	friendlyName: "A penalty has ended",
	version: 1.0,
	execute: execute,
	provides : " "
};



