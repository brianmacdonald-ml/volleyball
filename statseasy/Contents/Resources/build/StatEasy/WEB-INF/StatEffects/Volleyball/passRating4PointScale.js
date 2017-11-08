function execute() {
	passRating(4);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Pass Rating - 4 Point Scale",
	friendlyName: "4 Point Scale for Passer Rating",
	version     : 1.0,
	execute     : execute,
	sharedCode	: true,
};