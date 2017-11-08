
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var endingYardLine = getYardLineFrom(relevantStat, 0, 1);
	
	newState.set("yardLine", endingYardLine);
	newState.set("hasBall", !!relevantStat.opponentStat ? "weDo" : "theyDo");
	newState.unset("down");
	newState.unset("distance");
	
	// We can add the quarterback information now though.
	addQuarterback(!!relevantStat.opponentStat, 4);
	
	if (!statAtOffsetHasEffectNamed(1, "Possession Change")) {
		newState.set("warningMessage", "Be sure to tell StatEasy what time this posession change happened");
	}
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pass Intercepted",
	friendlyName: "A pass to a receiver that was picked off by the other team.",
	version     : 1.3,
	execute     : execute,
	provides    : "run back for %sed yards, thrown by %sep",
};