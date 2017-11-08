
function execute() {
	// The yardage data will be added later by the tackle or touchdown stat
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Carry",
	friendlyName: "Moves the ball via a pass, run, punt return, or kickoff return play.",
	version     : 1.4,
	execute     : execute,
	provides    : "for %sed yards"
};