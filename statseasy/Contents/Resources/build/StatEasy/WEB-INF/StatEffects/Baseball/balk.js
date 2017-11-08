
function execute() {
	adjustTeamToOther();
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var pitcher = currentState.get(otherPrefix + "PlayerAtPosition1");
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	

	
	if (pitcher == undefined) {
		newState.set("warningMessage", "You must have a pitcher set for " + relevantStat.event[otherPrefix + "Season"].team.teamName + " in order to take this stat.");
	}
	
	addPitcher(relevantStat.opponentStat, 0);

	var ballcount = !relevantStat.opponentStat ? "theirBallCount" : "ourBallCount";
	var balls = Number(currentState.get(ballcount));
	newState.set(ballcount, balls+1);
	
	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Balk",
	friendlyName: "Balk",
	version:      1.2,
	execute:      execute,
	provides: "by %sep:'Pitcher'"
};