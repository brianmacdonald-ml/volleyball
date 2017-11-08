/*
 * Required for all LiveViews
 */
var classname = "HelpLiveView";
var version = 2.9;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function HelpLiveView(myTargetDivId, dataManager) {
	this.targetDivId = myTargetDivId;
	
	this.shown = false;
	this.valid = false;

	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {}
	this.prepareToShow = prepareToShow;
	
	function invalidate() {
		this.valid = false;
	}
	this.invalidate = invalidate;
	
	function constructPlayerTable(playerSource, title, seasonId) {
		var link = "";
		var endLink = "";
		if (seasonId != undefined) {
			link = "<a href='/configure/seasonForm.htm?id=" + seasonId + "' title='Click to edit season'>";
			endLink = "</a>";
		}
		var ourPlayers = "<div class='tableContainer'><span style='font-weight: bold; font-size: large'>" + link + title + endLink + "</span>" +
			"<table class='striped tablesorter cellspacing'>" +
			"<thead><tr><th>First</th><th>Last</th><th>Number</th><th>Shortcut</th></tr></thead><tbody>";
		
		var playerList = [];
		for (var i in playerSource) {
			playerList.push(playerSource[i]);
		}
		playerList.sort(function (a, b) {
			return a.lastName.localeCompare(b.lastName);
		});
		
		for (player in playerList) {
			var number = playerList[player].number;
			var shortcut = playerList[player].shortcut;
			ourPlayers += "<tr><td>" + playerList[player].firstName + "</td><td>" + playerList[player].lastName + "</td><td>" + number + "</td><td>" + shortcut + "</td></tr>";
		}
		ourPlayers += "</tbody></table></div>";
		
		return ourPlayers;
	}
	
	function formatStatInfo(statInfo) {
		var parseInformation = "";
		
		if (statInfo.statEffectProvided) {
			parseInformation += "<span class='statEffectProvided'>";
		}
		
		parseInformation += "(";
		
		if (statInfo.textData != null) {
			parseInformation += statInfo.textData;
		} else {
			switch(statInfo.type) {
				case 'player':
					parseInformation += "Player";
					break;
				case 'numerical':
					parseInformation += "Data Point";
					break;
				case 'opponent':
					parseInformation += "Opponent";
					break;
				case 'time':
					parseInformation += "Time";
					break;
			}
			if ((statInfo.extraInformation != undefined) && 
				(statInfo.extraInformation.length > 0)) 
			{
				parseInformation += " values: ";
				for (var j in statInfo.extraInformation) {
					if (j != 0) {
						parseInformation += ", ";
					}
					parseInformation += statInfo.extraInformation[j].shortcut;
				}
				if (statInfo.allDigitsAllowed) {
					parseInformation += ", and all digits";
				}
			}
		}
		
		parseInformation += ")";
		
		if (statInfo.statEffectProvided) {
			parseInformation += "</span>";
		}
		
		parseInformation += " ";
		
		return parseInformation;
	}
	
	function constructStatTable(title) {
		var statTable = "<div class='tableContainer'><span style='font-weight: bold; font-size: large'>" + title + "</span>" +
			"<table class='striped tablesorter cellspacing'>" +
			"<thead><tr><th>Name</th><th>Shortcut</th><th>Parse Information</th></tr></thead><tbody>";
		
		var stats = [];
		for (var stat in dataManager.statTypes) {
			stats.push(dataManager.statTypes[stat]);
		}
		stats.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
		
		for (var stat in stats) {
			var name = stats[stat].name;
			var shortcut = stats[stat].maskedShortcut;
			var parseInformation = "";
			for (var i in stats[stat].fullSentence) {
				if ((stats[stat].firstStatEffectIndex == undefined) || (i < stats[stat].firstStatEffectIndex)) {
					var statInfo = stats[stat].fullSentence[i];
					if (statInfo.textOnly) {
						parseInformation += statInfo.textData + " ";
					} else {
						parseInformation += formatStatInfo(statInfo);
					}
				}
			}
			
			statTable += "<tr><td>" + name + "</td><td>" + shortcut + "</td><td>" + parseInformation + "</td></tr>";
		}
		
		statTable += "</tbody></table></div>";
		
		return statTable;
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
		/*
		 * Populate the DIV with Help Info!
		 */
		
		var innerHtml = "<table><tr>";
		innerHtml += "<td style='vertical-align:top;'>" + constructStatTable("Available Stats:") + "</td>";
		innerHtml += "<td style='vertical-align:top;'>" + constructPlayerTable(dataManager.allPlayers, dataManager.game.ourTeamName + ":", dataManager.game.ourSeasonId);
		innerHtml += constructPlayerTable(dataManager.allOpponents,  dataManager.game.theirTeamName + ":", dataManager.game.theirSeasonId) + "</td>";
		innerHtml += "</tr></table>";
		
		relevantDiv.innerHTML = innerHtml;
		
		$(".tablesorter").tablesorter().stickyHeaders();
		
		this.shown = true;
		this.valid = true;
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

