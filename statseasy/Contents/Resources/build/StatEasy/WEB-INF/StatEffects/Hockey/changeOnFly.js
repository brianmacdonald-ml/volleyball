function execute() {
	var offIce = relevantStat.allData.get(0).player.id.toString();
	var onIce = relevantStat.allData.get(1).player.id.toString();
	
	var playersOnIce = currentState.get("On Ice");
	if (playersOnIce != null){
	    playersOnIce = playersOnIce.split(",");

	    //debug
	    //java.lang.System.out.println("offIce" + offIce)
	    //java.lang.System.out.println("onIce" + onIce)
	    //java.lang.System.out.println("Players on the ice after split" + playersOnIce)
	    
	    
	    //check if the player to be put on ice is already on the ice
	    if (playersOnIce.indexOf(onIce) > -1)
       	 	newState.set("errorMessage", "That player is already on the ice");
	    else{
	        //check to make sure player coming off is actually on ice
	         if (playersOnIce.indexOf(offIce) > -1){
	             var i = playersOnIce.indexOf(offIce);
	        	 playersOnIce[i] = onIce;
	             playersOnIce = playersOnIce.join();
	             //debug
	             //java.lang.System.out.println("Players on the ice after swap" + playersOnIce)
	             newState.set("On Ice", playersOnIce);
	         }
	         else 
	        	 newState.set("errorMessage", "That player is not on the ice");
	     }
	}
}



/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Change on the Fly",
	version: 1.0,
	execute: execute
};