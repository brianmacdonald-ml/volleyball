
function execute() {
	adjustTeam();
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
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
	
	addPlayer(!relevantStat.opponentStat, 2, 3);
	
	addPitcher(!relevantStat.opponentStat, 4);

	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Stolen Base",
	friendlyName: "A runner stole a base",
	version:      1.4,
	execute:      execute,
	provides: "%sep:'Runner' stole a base from %seo:'Pitcher' and %seo:'Catcher' "
};