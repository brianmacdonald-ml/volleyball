/*
 * Required for all LiveViews
 */
var classname = "ElectronicScoresheetLiveView";
var version = 1.9;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ElectronicScoresheetLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
	
	var allMatchData = [];
		
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
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (this.shown && this.valid) {
			return;
		}

		var isBaker = isBakerScored();
		
		if (!this.shown) {
			getAllMatchData();
			addAllHtml();
		}
		
		processStats(dataManager.allStats, isBaker, false);
		
		if (isBaker) {
			processMatchStats();
		}
		
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			innerHtml = updateTeamScores(0, 0);
		} else {
			innerHtml = updateTeamScores(gameState.ourScore, gameState.theirScore);
		}
		
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
	
	
	function updateTeamScores(ourScore, theirScore) {
		$("#ourScore").html(ourScore);
		$("#theirScore").html(theirScore);
	}
	
	function accountForSubs(stat, playerBowls, subList) {
		var player = getFirstPlayer(stat);
		var actualPlayerId = player.id;
		
		if (isBakerScored()) {
			return actualPlayerId;
		}
		
		var prefix = stat.isOpponentStat() ? "their" : "our";
		
		if (isSubStat(stat)) {
			var newPlayer;
			var existingPlayer;
			for (var i = 0; i < 2; i++) {
				var playerId = stat.getStatData(i);
				playerId = subList[playerId] != undefined ? subList[playerId] : playerId;
				if (playerBowls[playerId] != undefined) {
					existingPlayer = playerId;
				} else {
					newPlayer = playerId;
				}
			}
			if (newPlayer != undefined) {
				if (subList[newPlayer] == undefined) {
					var playerList = dataManager.allPlayers;
					if (stat.isOpponentStat()) {
						playerList = dataManager.allOpponents;
					}
					addPlayerNameToPlayerRow(existingPlayer, playerList[newPlayer].firstName + " " + playerList[newPlayer].lastName);
				}
				subList[newPlayer] = existingPlayer;
			}
		}
		
		if (subList[actualPlayerId] != undefined) {
			return subList[actualPlayerId];
		} else {
			return actualPlayerId;
		}
	}
	
	function processStats(allStats, isBaker, isSummary) {
		
		var clearedCheck = {
			theirSheet : false,
			ourSheet : false,
		};
		
		// Object indexed by player id that contains arrays for every ball bowled by player
		var playerBowls = {};
		var subList = {};
		var nextContactFoul = false;
		for (var index in allStats) {
			var stat = allStats[index];
			
			var insertionId;
			var insertionName;
			var player = getFirstPlayer(stat);
			if (player == undefined) {
				continue;
			}
			if (!isBaker) {
				insertionId = accountForSubs(stat, playerBowls, subList);
				insertionName = player.firstName + " " + player.lastName;
			} else {
				insertionId = stat.isOpponentStat();
				insertionName = stat.isOpponentStat() ? dataManager.game.theirTeamName : dataManager.game.ourTeamName;
			}
			
			if (playerBowls[insertionId] == undefined) {
				playerBowls[insertionId] = [];
				if (!isSummary) {
					var whichSheet = stat.isOpponentStat() ? "theirSheet" : "ourSheet";
					if (!clearedCheck[whichSheet]) {
						clearExisting(whichSheet);
						clearedCheck[whichSheet] = true;
					}
					addRowForPlayer(whichSheet, insertionId, insertionName);
				} else {
					addSummaryRowForPlayer(player, stat.isOpponentStat());
				}
			}
			
			if (isPinRemainingStat(stat)) {
				if (nextContactFoul) {
					stat.foul = true;
					nextContactFoul = false;
				}
				playerBowls[insertionId].push(stat);
			}
			
			if (isFoulStat(stat)) {
				nextContactFoul = true;
			}
		}
		
		for (var playerId in playerBowls) {
			var playerBowlArray = playerBowls[playerId];

			var startingScore = 0;
			var isScoreComplete = true;
			var numFrames = 0;
			for (var i = 0; i < playerBowlArray.length; i++) {
				var statScore = calculateScoreForStat(playerBowlArray, i);
				
				setPinsHit(playerId, playerBowlArray, i, getPinsHit(playerBowlArray, i));

				if ((Number(playerBowlArray[i].getBeginningGameState()["ballNumber"]) == 1) && (playerBowlArray[i].getBeginningGameState()["completeScore"] == "true")) {
					numFrames++;
				}
				
				var beginningFrame = Number(playerBowlArray[i].getBeginningGameState()["frameNumber"]) || 0;
				isScoreComplete = isScoreComplete && isCompleteFrame(playerBowlArray, i);
				if (!isTenthFrameExtra(playerBowlArray, i) && isScoreComplete) {
					startingScore += statScore;
					setFrameScore(playerId, playerBowlArray[i], startingScore);
				}
			}
			
			if (!isSummary) {
				setPlayerCurrentScore(playerId, startingScore);
			} else {
				setSummaryScore(playerId, startingScore, numFrames);
			}
		}
		
		if (isSummary) {
			$("#" + self.targetDivId + " .summary").trigger("update"); 
		}
		
		return subList;
	}
	
	function populateMatchStats(bakerBowls) {
		// First collect all stats available into one array
		var bakerStats = [];
		for (var i in allMatchData) {
			bakerStats[i] = allMatchData[i]; // Assume that the match data is already sorted appropriately
		}
		for (var i in dataManager.allStats) {
			var stat = dataManager.allStats[i];
			DataManager.insertStatIn(stat, bakerStats);
		}
		
		return bakerStats;
	}
	
	function processMatchStats() {
		var bakerStats = populateMatchStats();
		processStats(bakerStats, false, true);
	}
	
	function isBakerScored() {
		var parent = dataManager.groupings[dataManager.game.associatedEvent];
		
		return parent.attributes["Baker-Scored?"] == "yes";
	}
	
	function getAllMatchData() {
		var isBaker = isBakerScored();
		if (isBaker) {
			var parent = dataManager.groupings[dataManager.game.associatedEvent];
			var eventIndex = parent.index;
			while (parent.parentGroup != undefined) {
				parent = dataManager.groupings[parent.parentGroup];
			}
			
			dataManager.getAllDataForGrouping(parent.id, function (data) {
				// Strip all stats that are from this game (so they don't double count)
				// as well as all stats after this game.
				var statsThatArentThisGame = [];
				for (var i in data.allStats) {
					var someStat = data.allStats[i];
					var statGame = data.games[someStat.gameId];
					var statEvent = data.groupings[statGame.associatedEvent];
					if ((someStat.gameId != dataManager.game.id) && (statEvent.index < eventIndex)) {
						statsThatArentThisGame.push(someStat);
					}
				}
				data.allStats = statsThatArentThisGame;
				
				DataManager.receiveData(data, allMatchData);
				
				processMatchStats();
			});
		}
	}
	
	function getPinCountRemaining(stat) {
		var statTypeId = stat.getStatType();
		var statType = dataManager.statTypes[statTypeId];
		var pinCountBeforeContact = Number(stat.getBeginningGameState()["pinsRemaining"]);
		
		return (statType.name == "Miss / Gutter Ball") ? pinCountBeforeContact : countData("numerical", stat);
	}

	function getPinsHit(statArray, index) {
		if (index >= statArray.length) {
			return 0;
		}
		
		var stat = statArray[index];
		var pinCountAfterContact = getPinCountRemaining(stat);
		var pinCountBeforeContact = Number(stat.getBeginningGameState()["pinsRemaining"]);
		
		return pinCountBeforeContact - pinCountAfterContact;
	}

	function calculateScoreForStat(statArray, index) {
		var stat = statArray[index];
		var pinsRemaining = getPinCountRemaining(stat);
		
		var score = 0;
		if ((pinsRemaining == 0) && (stat.getBeginningGameState()["releaseNumber"] == "1")) {
			score = 10 + getPinsHit(statArray, index + 1) + getPinsHit(statArray, index + 2);
		} else if (pinsRemaining == 0) {
			score = getPinsHit(statArray, index) + getPinsHit(statArray, index + 1);
		} else {
			score = getPinsHit(statArray, index);
		}
		
		return score;
	}
	
	function setPinsHit(playerId, statArray, index, numberHit) {
		var stat = statArray[index];
		
		var beginningFrame = stat.getBeginningGameState()["frameNumber"] || 0;
		var beginningBall = stat.getBeginningGameState()["ballNumber"] || 0;
		var isSplit = stat.getEndingGameState()["split"] == "true";
		var pinsRemaining = getPinCountRemaining(stat);
		
		var domIndex = (beginningFrame - 1) * 2 + (beginningBall - 1) + 2;
		var targetDOM = $("#playerScoreRow" + playerId + " td:nth-child(" + domIndex + ") span");
		
		if (isSplit) {
			targetDOM.addClass("split");
		}
		
		if (stat.foul == true) {
			targetDOM.html("F");
		} else if (((pinsRemaining == 0) && (beginningBall == 1)) ||
			((0 < index) && (getPinCountRemaining(statArray[index - 1]) == 0) && (pinsRemaining == 0))) 
		{
			targetDOM.html("X");
		} else if (pinsRemaining == 0) {
			targetDOM.html("/");
		} else {
			if (numberHit == 0) {
				numberHit = "-";
			}
			targetDOM.html(numberHit);
		}
	}
	
	function isPinRemainingStat(stat) {
		var statTypeId = stat.getStatType();
		var statType = dataManager.statTypes[statTypeId];
		return statType.statEffectName == "Pin Remaining";
	}
	
	function isFoulStat(stat) {
		var statTypeId = stat.getStatType();
		var statType = dataManager.statTypes[statTypeId];
		return statType.name == "Foul";
	}
	
	function isSubStat(stat) {
		var statTypeId = stat.getStatType();
		var statType = dataManager.statTypes[statTypeId];
		return statType.name == "Substitution";
	}
	
	function isCompleteFrame(allBowls, i) {
		i = Number(i);
		
		var stat = allBowls[i];
		var statTypeId = stat.getStatType();
		var statType = dataManager.statTypes[statTypeId];
		
		if (statType.name == "Strike") {
			return i + 2 < allBowls.length;
		}
		
		if (statType.name == "Spare") {
			return i + 1 < allBowls.length;
		}
		
		// If ball number one isn't a strike, then we'll have to see if the 
		// next bowl is a spare to determine if this frame is complete
		if (stat.getBeginningGameState()["ballNumber"] == "1") {
			return (i + 1 < allBowls.length) && isCompleteFrame(allBowls, i + 1);
		}
		
		return true;
	}
	
	function tenthFrameExtraHelper(allBowls, i, ballNumber) {
		return (i >= 0) && 
				(Number(allBowls[i].getBeginningGameState()["frameNumber"]) == 10) && 
				(Number(allBowls[i].getBeginningGameState()["ballNumber"]) == ballNumber) &&
				(getPinCountRemaining(allBowls[i]) == 0);
	}
	
	function isTenthFrameExtra(allBowls, i) {
		var isExtra = false;
		
		if (Number(allBowls[i].getBeginningGameState()["frameNumber"]) != 10) {
			return false;
		}
		
		// if the ball two bowls ago is a first release strike in the tenth, then we are
		isExtra = tenthFrameExtraHelper(allBowls, i - 2, 1);
		// if the ball one bowl ago is a first release string in the tenth, then we are
		isExtra = isExtra || tenthFrameExtraHelper(allBowls, i - 1, 1);
		// if the ball one bowl ago is a second release spare in the tenth, then we are
		isExtra = isExtra || tenthFrameExtraHelper(allBowls, i - 1, 2);
		
		return isExtra;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//                          Stat-Data Manipulation
	////////////////////////////////////////////////////////////////////////////
	function getFirstPlayer(stat) {
		var playerId = getFirstData("player", stat);
		var playerList = dataManager.allPlayers;
		if (stat.isOpponentStat()) {
			playerList = dataManager.allOpponents;
		}
		
		return playerList[playerId];
	}
	
	function getFirstData(type, stat) {
		if (getFirstData.cache == undefined) {
			getFirstData.cache = {
				"numerical": {},
				"player": {},
			};
		}
		
		var statTypeId = stat.getStatType();
		
		if (getFirstData.cache[type][statTypeId] == undefined) {
			var statType = dataManager.statTypes[statTypeId];
			for (var i in statType.parseTypes) {
				if (statType.parseTypes[i].type == type) {
					getFirstData.cache[type][statTypeId] = i; 
				}
			}
		}
		
		var index = getFirstData.cache[type][statTypeId];
		if (index != undefined) {
			return stat.getStatData(index);
		}
	}
	
	function countData(type, stat) {
		if (countData.cache == undefined) {
			countData.cache = {
				"numerical": {},
				"player": {},
			};
		}
		
		var statTypeId = stat.getStatType();
		
		if (countData.cache[type][statTypeId] == undefined) {
			var statType = dataManager.statTypes[statTypeId];
			var count = 0;
			for (var i in statType.parseTypes) {
				if (statType.parseTypes[i].type == type) {
					count++; 
				}
			}
			countData.cache[type][statTypeId] = count;
		}
		
		return countData.cache[type][statTypeId];
	}
	
	////////////////////////////////////////////////////////////////////////////
	//                          HTML Manipulation
	////////////////////////////////////////////////////////////////////////////
	function addAllHtml() {
		var myDiv = $("#" + self.targetDivId);
		
		var allHtml = "<div id='ourSection'>\
			<p>" + dataManager.game.ourTeamName + " - Team Score: <span id='ourScore'>0</span></p>";
		allHtml += addScoresheetHtml("ourSheet");
		if (isBakerScored()) {
			allHtml += addSummaryTable("ourSummary");
		}
		allHtml += "</div>";
		
		allHtml += "<div id='theirSection'>\
			<p>" + dataManager.game.theirTeamName + " - Team Score: <span id='theirScore'>0</span></p>";
		allHtml += addScoresheetHtml("theirSheet");
		if (isBakerScored()) {
			allHtml += addSummaryTable("theirSummary");
		}
		allHtml += "</div>";
		
		myDiv.html(allHtml);
	}
	
	function addScoresheetHtml(tableId) {
		return "\
			<table id='" + tableId + "' class='scoresheet' cellspacing='0'>\
			    <tr>\
			        <td>Name</td>\
			        <td colspan='2'>1</td>\
			        <td colspan='2'>2</td>\
			        <td colspan='2'>3</td>\
			        <td colspan='2'>4</td>\
			        <td colspan='2'>5</td>\
			        <td colspan='2'>6</td>\
			        <td colspan='2'>7</td>\
			        <td colspan='2'>8</td>\
			        <td colspan='2'>9</td>\
			        <td colspan='3'>10</td>\
			        <td>Total</td>\
			    </tr>\
			    <tr class='removeMe'>\
			        <td colspan='22'>Set a Bowler</td>\
			    </tr>\
			</table>\
		";
	}
	
	function addPlayerNameToPlayerRow(playerId, playerName) {
		$("#playerScoreRow" + playerId + " td:first-child").append(" / " + playerName);
	}
	
	function addRowForPlayer(tableId, playerId, playerName) {
		$("#" + self.targetDivId + " #" + tableId + " .removeMe").remove();
		
		if ($("#" + self.targetDivId + " #playerScoreRow" + playerId).length > 0) {
			return;
		}
		
		$("#" + self.targetDivId + " #" + tableId).append("\
			    <tr id='playerScoreRow" + playerId + "'>\
			        <td rowspan='2'>" + playerName + "</td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td rowspan='2'><span>&nbsp;</td>\
			    </tr>\
			    <tr id='playerFrameRow" + playerId + "'>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='2'><span>&nbsp;</span></td>\
			        <td colspan='3'><span>&nbsp;</span></td>\
			    </tr>\
		");
	}

	function addSummaryTable(tableId) {
		
		return "\
			<table id='" + tableId + "' class='summary tablesorter' cellspacing='0'>\
				<thead>\
			    <tr>\
			        <th>First Name</th>\
			        <th>Last Name</th>\
			        <th>Match Total</th>\
			        <th>Frame Avg.</th>\
			        <th>Complete Frames</th>\
			    </tr>\
			    </thead><tbody>\
			    <tr class='removeMe'>\
			        <td colspan='2'>Set a Bowler</td>\
			    </tr>\
			    </tbody>\
			</table>\
		";
	}
	
	function addSummaryRowForPlayer(player, opponentStat) {
		var tableId = opponentStat ? "#theirSummary" : "#ourSummary"
		$("#" + self.targetDivId + " " + tableId + " .removeMe").remove();
		
		if ($("#" + self.targetDivId + " " + tableId + " #playerSummaryScoreRow" + player.id).length > 0) {
			return;
		}
		
		$("#" + self.targetDivId + " " + tableId + " tbody").append("\
			    <tr id='playerSummaryScoreRow" + player.id + "'>\
			        <td>" + player.firstName + "</td>\
			        <td>" + player.lastName + "</td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			        <td><span>&nbsp;</span></td>\
			    </tr>\
		");
		
		var rowCount = $("#" + self.targetDivId + " " + tableId + " tbody tr").length;
		if (rowCount == 2) {
			$("#" + self.targetDivId + " " + tableId).tablesorter({
				sortList: [[1, 0]]
			}).stickyHeaders();
		}
	}
	
	function clearExisting(tableId) {
		$("#" + tableId + " tr:not(:first-child):not(.removeMe)").remove();
	}
	
	function setFrameScore(playerId, stat, score) {
		var beginningFrame = stat.getBeginningGameState()["frameNumber"] || 0;
		
		var index = Number(beginningFrame);
		
		$("#playerFrameRow" + playerId + " td:nth-child(" + index + ") span").html(score);
	}
	
	function setPlayerCurrentScore(playerId, score) {
		$("#playerScoreRow" + playerId + " td:last-child span").html(score);
	}
	
	function setSummaryScore(playerId, score, numFrames) {
		$("#playerSummaryScoreRow" + playerId + " td:nth-child(3) span").html(score);
		$("#playerSummaryScoreRow" + playerId + " td:nth-child(4) span").html((score / numFrames).toFixed(2));
		$("#playerSummaryScoreRow" + playerId + " td:nth-child(5) span").html(numFrames);
	}
	
}

