
function execute() {
	adjustTeam();
	var baseOn = relevantStat.allData.get(0).numericalData;
	var baseTo = relevantStat.allData.get(1).numericalData;
	
	if(baseOn == 0){
		player = currentState.get("playerAtFirst")
		newState.set("playerAtFirst", 0);
	}
	else if(baseOn == 1){
		player = currentState.get("playerAtSecond");
		newState.set("playerAtSecond", 0);
	}
	else if(baseOn == 2){
		player = currentState.get("playerAtThird");
		newState.set("playerAtThird", 0);
	}
	else{
		
		player = currentState.get("currentBatter");
	}
	if(baseOn < 3){
		addRunner(relevantStat.opponentStat, Number(baseOn+1), 2);
	}
	else{
		addBatter(relevantStat.opponentStat, 2);
	}
	
	
	if(baseTo == 1){
		newState.set("playerAtSecond", player);
	}
	else if(baseTo == 2){
		newState.set("playerAtThird", player);
	}
	else if(baseTo == 0){
		newState.set("playerAtFirst", player);
	}
	

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Runner Advanced",
	friendlyName: "A runner advanced",
	version:      3.4,
	execute:      execute,
	provides: "%sep:'Runner'"
};