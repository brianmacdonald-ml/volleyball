function execute(){
	var serviceAttempt = getPrevious(isServiceAttempt);
	
	if (serviceAttempt != undefined) {
		relevantStat.opponentStat = serviceAttempt.opponentStat
		modifiedStats.add(relevantStat);
		
		var supplementalStatType = findStatTypeByName("Service Ace");
		if (supplementalStatType != undefined) {
			serviceAttempt.statType = supplementalStatType;
			
			pointFor(serviceAttempt, serviceAttempt.opponentStat, serviceAttempt.getBeginningGameState(), serviceAttempt.getEndingGameState());
			
			modifiedStats.add(serviceAttempt);
		} else {
			logger.debug("StatType 'Service Ace' was not found.");
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Change To Ace",
	friendlyName: "Changes a Service Attempt to a Service Ace",
	version     : 1.6,
	execute     : execute,
};