((count(for)?[data[0]=w])/(count(fo,0)))

function execute() {
	
	
	var gameClockRunning = currentState.get("gameClockRunning");
	//gameclock is not defined yet...init
	if (gameClockRunning == undefined) {
		newState.set("errorMessage", "Your must set the period");
	}
	//game clock has already been initialized
	else {
		//if the game clock is running before a face-off...something went wrong
		if (newState.get("gameClockRunning") == "1") {
			newState.set("errorMessage", "Cannot take face off stat while game clock is running.");
			//newState.set("gameClockRunning", 0);
			
		} else {
			newState.set("gameClockRunning", 1);
		}
	}
	
//	java.lang.System.out.println("HELLO" + relevantStat.getGameTime());
	relevantStat.setTimeAtIndex(relevantStat.getGameTime(), 2);
	
	
	

}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Face off",
	friendlyName: "A face off",
	version: 1.0,
	execute: execute,
	provides: "%set",
};