
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	// The distance data will be added later by the tackle or touchdown stat
	
	// We can add the quarterback information now though.
	addQuarterback(!!relevantStat.opponentStat, 2);
	
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pass Complete",
	friendlyName: "A successful pass to a receiver by the quarterback.",
	version     : 1.3,
	execute     : execute,
	provides    : "for %sed yards, by %sep"
};