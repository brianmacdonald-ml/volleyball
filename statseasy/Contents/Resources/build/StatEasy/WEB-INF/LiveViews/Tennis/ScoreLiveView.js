/*
 * Required for all LiveViews
 */
var classname = "ScoreLiveView";
var version = 1.3;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ScoreLiveView(myTargetDivId, dataManager) {
	this.targetDivId = myTargetDivId;
	
	this.shown = false;
	this.valid = false;
	this.drawn = false;
		
	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {}
	this.preparetoShow = prepareToShow;
	
	function invalidate() {
		this.valid = false;
	}
	this.invalidate = invalidate;
	
	/*
	 * Helper method to append a score to a table
	 */
	function appendScore(ourScore, theirScore) {
		if (ourScore == undefined) {
			ourScore = 0;
		}
		if (theirScore == undefined) {
			theirScore = 0;
		}
		var innerHtml = "<table>" + 
			"<tr><td>" + dataManager.game.ourTeamName + ":</td><td>" + ourScore + "</td></tr>" +
			"<tr><td>" + dataManager.game.theirTeamName + ":</td><td>" + theirScore + "</td></tr>" +
			"</table>";
		
		return innerHtml;
	}
	
    function scores(ourScore, theirScore) {
        var scores = [
            "Love",
            "15",
            "30",
            "40"
        ];
        
        // For comparison purposes, they must be numbers
        ourScore = Number(ourScore);
        theirScore = Number(theirScore);
        
        var adjOurScore = "Love";
        var adjTheirScore = "Love";
        
        if (ourScore < scores.length) {
            adjOurScore = scores[ourScore];
        } else {
            adjOurScore = "Game (" + ourScore + ")";
        }
        if (theirScore < scores.length) {
            adjTheirScore = scores[theirScore];
        } else {
            adjTheirScore = "Game (" + theirScore + ")";
        }
        if (ourScore == theirScore) {
            if (ourScore > 2) {
                adjOurScore = "Deuce";
                adjTheirScore = "Deuce";
            }
        } else if ((ourScore > theirScore) && (theirScore >= 3)) {
            if (ourScore - theirScore == 1) {
                adjOurScore = "Adv";
                adjTheirScore = "-"
            } else {
                adjOurScore = "Game (" + ourScore + ")";
                adjTheirScore = theirScore;
            }
        } else if ((theirScore > ourScore) && (ourScore >= 3)) {
            if (theirScore - ourScore == 1) {
                adjOurScore = "-";
                adjTheirScore = "Adv";
            } else {
                adjOurScore = ourScore;
                adjTheirScore = "Game (" + theirScore + ")";
            }
        }
        
        return [adjOurScore, adjTheirScore];
    }
    
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}
		
		var relevantDiv = document.getElementById(this.targetDivId);
		if (!this.drawn) {
			$(relevantDiv).append("<div id='" + this.targetDivId + "-court'></div>");
		}
		
		/*
		 * Populate the DIV with Score Info!
		 */
		var innerHtml = "";
		
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		var gameGrouping = dataManager.groupings[dataManager.game.associatedEvent];
		var isTiebreak = gameGrouping.attributes["Tiebreak Game?"] == "yes";
		
		var setGrouping = dataManager.groupings[gameGrouping.parentGroup];
		if (setGrouping.parentGroup != undefined) {
			var ourLine = [];
			var theirLine = [];
			var matchGrouping = dataManager.groupings[setGrouping.parentGroup];
			for (var i in matchGrouping.childrenGroups) {
				var setId = matchGrouping.childrenGroups[i];
				var setObj = dataManager.groupings[setId];
				
				if (setId == setGrouping.id) {
					var ourScoreSoFar = 0;
					var theirScoreSoFar = 0;
					for (var j in setGrouping.childrenGroups) {
						var gameId = setGrouping.childrenGroups[j];
						var gameObj = dataManager.groupings[gameId];
						
						if (gameId == gameGrouping.id) {
							break;
						} else {
							if (gameObj.pointsFor > gameObj.pointsAgainst) {
								ourScoreSoFar++;
							} else {
								theirScoreSoFar++;
							}
						}
					}
					
					ourLine.push(ourScoreSoFar);
					theirLine.push(theirScoreSoFar);
					
					break;
				} else {
					ourLine.push(setObj.pointsFor);
					theirLine.push(setObj.pointsAgainst);
				}
			}
			
			innerHtml += "<table cellspacing='0' class='setResults'><tr><td class='upperLeft'>&nbsp;</td>";
			for (var i in ourLine) {
				innerHtml += "<td class='setNumber'>Set " + (Number(i) + 1) + "</td>";
			}
			innerHtml += "</tr><tr><td class='setTeamName'>" + dataManager.game.ourTeamName + "</td>";
			for (var i in ourLine) {
				innerHtml += "<td class='setScore'>" + ourLine[i] + "</td>";
			}
			innerHtml += "</tr><tr><td class='setTeamName'>" + dataManager.game.theirTeamName + "</td>";
			for (var i in theirLine) {
				innerHtml += "<td class='setScore'>" + theirLine[i] + "</td>";
			}
			innerHtml += "</tr></table>";
		}
		
		if (gameState == undefined) {
			if (!isTiebreak) {
				innerHtml += appendScore("Love", "Love");
			} else {
				innerHtml += appendScore(0, 0);
			}
		} else {
			if (!isTiebreak) {
	            var score = scores(gameState.ourScore, gameState.theirScore);
				innerHtml += appendScore(score[0], score[1]);
			} else {
				innerHtml += appendScore(gameState.ourScore, gameState.theirScore);
			}
		}
		
		innerHtml += "<div style='clear:both'></div>";
		
		$("#" + this.targetDivId + "-court").html(innerHtml);
		
		this.shown = true;
		this.valid = true;
		this.drawn = true;
		
	}
	this.show = show;
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
}

