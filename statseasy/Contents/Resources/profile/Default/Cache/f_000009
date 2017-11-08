function LiveParser( inId, eventId, dataManager ) {
	var inToParse = (!!inId) ? $(inId) : null,
	buffer = '',
	typos = [];
	
	var statTypeMap = {}, playerRegex = '', opponentRegex = '';
	var self = this;
	
	init();
	initMatchFunctions();
	
	function init( inId ) {
		if (!!inId) {
			inToParse = $(inId);
		}
		
		if (!!inToParse.length) {
			inToParse.keyup(updateBuffer);
			inToParse.keydown(preventSubmission);
		}
		
		dataManager.registerForNotification(DataManager.ADD, handleAddResult);
		dataManager.registerForNotification(DataManager.ADD_TYPE, handleAddStatType);
		dataManager.registerForNotification(DataManager.ERROR, handleErrorResult);
	}
	this.init = init;

	function handleAddResult(data) {
		var statObj = $(data.additionalData);
		
		statObj.remove();
	}
	
	function handleErrorResult(data) {
		var statObj = $(data.additionalData);
		
		statObj.remove();
		
		$(inId).focus();
	}
	
	function handleAddStatType(data) {
		initMatchFunctions();
	}
	
	function sendStat( stat ) {
		if (sendStat.statIndex == undefined) {
			sendStat.statIndex = 0;
		}
		
		isDoubleTap.lastKey = undefined;
		
		var statObj = $('<span id="statInd' + sendStat.statIndex + '">' + stat + '</span>').appendTo($('#bufferDiv'));
		
		var addStatOptions = {};
		if (dataManager.player != undefined) {
			var result = dataManager.player.getActiveSyncAndVideoTime(eventId);
			var syncPoint = result[0];
			var videoTime = result[1];
			
			if (syncPoint == undefined) {
				var statTime = Math.round(videoTime * 1000);
				addStatOptions.statTime = statTime;
			} else {
				// delta = videoTime - statTime
				// ... 4th grade algebra ...
				// statTime = videoTime - delta
				addStatOptions.statTime = Math.round((videoTime - syncPoint.delta) * 1000);
			}
		}
		
		dataManager.addStat(eventId, stat, "#statInd" + sendStat.statIndex++, addStatOptions);
	}
	this.sendStat = sendStat;
	
	function preventSubmission( evt ) {
		if (evt.which == 13) {
			var originalValue = inToParse.val();
			inToParse.val(originalValue + " ");
			var sentStat = updateBuffer(evt);
			if (!sentStat) {
				inToParse.val(originalValue);
			}
		} else {
			if (dataManager.player != undefined) {
				dataManager.player.handleKeyDown(evt);
			}
		}
	}

	
	function isDoubleTap(keyPressed) {
		var date = new Date();
		var currentMillisecs = date.getTime();
		var doubleTapped = false;
		
		if ((isDoubleTap.lastKey != undefined) &&
			(isDoubleTap.lastKey == keyPressed) &&
			(currentMillisecs - isDoubleTap.lastKeydownMillsecs < 500))
		{
			doubleTapped = keyPressed;
		}
		
		isDoubleTap.lastKey = keyPressed;
		isDoubleTap.lastKeydownMillsecs = currentMillisecs;
		
		return doubleTapped;
	}

	function handleUserDoubleTapStatInput(keyPressed) {
		var result = self.matchDoubleTapStatType(keyPressed);
		
		if (result) {
			self.sendStat(keyPressed);
			
			var currentValue = inToParse.val();
			var index = currentValue.indexOf(keyPressed + keyPressed);
			if (index != -1) {  // And by now, we should find the stat
				var preStat = currentValue.substring(0, index);
				var postStat = currentValue.substring(index + 2);
				
				inToParse.val(preStat + postStat);
			}
		}
		
		return !!result;		
	}

	function handleUserStatInput(toParse) {			
		var tokens = tokenize(toParse);
		if (toParse.match(/^\s+$/) != null) {
			tokens = [toParse, ""];
		}
		
		var result = helperContainsStat(tokens, 0);
		
		if (result) {
			var matchedTokens = tokens.splice(result[0], result[1]);
			var submitStat = matchedTokens.join(" ");
			self.sendStat(submitStat);
			
			// Trim off the beginning blank space if there is one
			if (tokens[0] == "") {
				tokens.shift();
			}
			
			// Trim off the trailing blank space if there is only one space left
			if ((tokens.length == 1) && (tokens[0] == "")) {
				tokens = [];
			}
			
			// Put the remaining tokens back to be used by the user
			inToParse.val(tokens.join(" "));
		}
		
		return !!result;		
	}

	function updateBuffer( evt ) {
		if (evt.which == 13) {  // don't submit on enter
			evt.preventDefault();
		}
		
		if (dataManager.player != undefined) {
			dataManager.player.handleKeyUp(evt);
		}
		
		var toParse = inToParse.val();
		toParse = toParse.toLowerCase();
		
		if (toParse.trim() == "") {
			hideAutoComplete();
		}
		
		var doubleTapped = isDoubleTap(String.fromCharCode(evt.which));

		if (doubleTapped) {
			return handleUserDoubleTapStatInput(doubleTapped);
		}
		else
		{
			return handleUserStatInput(toParse);
		}

	}

	function initMatchFunctions() {
		var playerMap = {};
		$.each(dataManager.allPlayers, function( key, val ) {
			playerMap[val.number] = key;
			if (!!val.shortcut) {
				playerMap[val.shortcut.toLowerCase()] = key;
			}
		});
		
		self.matchPlayer = function (someToken) {
			return (playerMap[someToken]);
		}
		
		var opponentMap = {};
		$.each(dataManager.allOpponents, function( key, val ) {
			opponentMap[val.number] = key;
			if (!!val.shortcut) {
				opponentMap[val.shortcut.toLowerCase()] = key;
			}
		});
		
		self.matchOpponent = function (someToken) {
			return (opponentMap[someToken] || (dataManager.game.canAddOpponents && someToken.match(/\d+/)));
		}
		
		var statTypeMap = {};
		$.each(dataManager.statTypes, function( key, val ) {
			statTypeMap[val.shortcut.toLowerCase()] = key;
			statTypeMap[";" + val.shortcut.toLowerCase()] = key;
		});
		
		self.matchStatType = function (someToken) {
			if (statTypeMap[someToken]) {
				return dataManager.statTypes[statTypeMap[someToken]];
			}
			
			return false;
		}
		
		self.matchDoubleTapStatType = function (someToken) {
			if (statTypeMap[someToken]) {
				var statType = dataManager.statTypes[statTypeMap[someToken]];
				
				if (statType.doubleTap) {
					return statType;
				}
			}
			
			return false;
		}		
		
		self.matchData = function (someToken) {
			return someToken.match(/-?\d+/);
		}
		
		self.matchExtraInfo = function (someToken, extraInformation, allDigitsAllowed) {
			for (var i in extraInformation) {
				if (someToken.toLowerCase() == extraInformation[i].shortcut) {
					return true;
				}
			}
			
			if (allDigitsAllowed) {
				return self.matchData(someToken);
			}
			
			return false;
		}
		
		self.matchTime = function (someToken) {
			return someToken.match(/^[\d|:|.]+$/);
		}
	}
	
	function tokenize(testMe) {
		testMe.toLowerCase();
		var tokens = testMe.split(/\s+/);
		
		return tokens;
	}
	
	// for external testing
	function containsStat(testMe) {
		var tokens = tokenize(testMe);
		
		return helperContainsStat(tokens, 0);
	}
	this.containsStat = containsStat;
	
	function helperContainsStat(tokens, startIndex, dontDisplayAutoComplete) {
		if (tokens.length <= startIndex) {
			return false;
		}
		
		// First token is either a ; or is a statType
		var opponentStat = tokens[startIndex].charAt(0) == ';';
		
		// If the ; is a token all by itself, then "merge" the tokens together by
		// skipping the ; token and prepending it to the next token
		var mergedTokens = 0;
		if (opponentStat && (tokens[startIndex].length == 1)) {
			startIndex++;
			mergedTokens = 1;
		}
		
		var statType = self.matchStatType(tokens[startIndex]);
		// have we found a statType and did the user push the spacebar to select the stat
		if (statType && !statType.doubleTap && (startIndex + 1 < tokens.length)) {
			
			// This gets a little muddy.  Sorry.  This should be refactored.
			// We use i as an index to iterate through the token stream as well
			//   as to iterate through the statType.parseTypes.
			// At the end of the while loop, startIndex + i must be the index of
			//   the last unmatched token.
			// If all tokens are matched, then the matchedData array will contain
			//   all the matching tokens.
			
			var i = 0;
			// Find the rest of the entered stat
			var matchedData = [];
			while ((i < statType.parseTypes.length) && (startIndex + i + 1 < tokens.length)) {
				var matchedEntry = false;
				var tokenEntry = tokens[startIndex + i + 1];
				if ((!statType.parseTypes[i].statEffectProvided) && 
					(startIndex + i + 2 < tokens.length)) // Only "match" against a token if there is at least one token after it (like a space) 
				{
					switch (statType.parseTypes[i].type) {
						case 'player':
							if (!opponentStat) {
								matchedEntry = self.matchPlayer(tokenEntry);
							} else {
								matchedEntry = self.matchOpponent(tokenEntry);
							}
							break;
						case 'numerical':
							if ((statType.parseTypes[i].extraInformation != undefined) && 
								(statType.parseTypes[i].extraInformation.length > 0)) 
							{
								matchedEntry = self.matchExtraInfo(
										tokenEntry, 
										statType.parseTypes[i].extraInformation, 
										statType.parseTypes[i].allDigitsAllowed
									);
							} else {
								matchedEntry = self.matchData(tokenEntry);
							}
							break;
						case 'opponent':
							if (!opponentStat) {
								matchedEntry = self.matchOpponent(tokenEntry);
							} else {
								matchedEntry = self.matchPlayer(tokenEntry);
							}
							break;
						case 'time':
							matchedEntry = self.matchTime(tokenEntry);
							break;
					}
				}
				i++;
				if (matchedEntry) {
					matchedData.push(tokenEntry);
				} else {
					break;
				}
			}

			if (matchedData.length == statType.userProvidedDataCount) {
				hideAutoComplete();
				
				// We matched all of the parseTypes for the stat!
				return [startIndex - mergedTokens, 1 + statType.userProvidedDataCount + mergedTokens];
			} else {
				// We matched some of the parseTypes. 
				// Display an autocomplete box for the user based on what we know
				// about what has been typed.
				var lastUnmatchedToken = (startIndex + i < tokens.length) && (i != 0) ? tokens[startIndex + i] : null;
				if (!dontDisplayAutoComplete) {
					displayAutoComplete(statType, matchedData, lastUnmatchedToken, opponentStat);
				}
				
				if (i != 0) {
					// See if we can match a stat starting with the last thing we don't recognize
					return helperContainsStat(tokens, startIndex + i, true);
				} else {
					return false;
				}
			}
		} else if (!dontDisplayAutoComplete) {
			displayStatList(tokens[startIndex]);
		}
		
		// We didn't recognize this token as a statType, so move on to the next one
		return helperContainsStat(tokens, startIndex + 1);
	}
	
	function displayStatList(token) {
		if ((token != undefined) && (token.indexOf(";") == 0)) {
			token = token.substr(1);
		}
		if ((token == undefined) || (token == "") || (token == ";")) {
			
		} else {
			var selectedTypes = [];
			$.each(dataManager.statTypes, function( key, val ) {
				if (val.shortcut.toLowerCase().indexOf(token) == 0) {
					selectedTypes.push(val);
				}
			});
			
			selectedTypes.sort(function (lhs, rhs) {
				if (lhs.shortcut.length < rhs.shortcut.length) {
					return -1;
				} else if (lhs.shortcut.length > rhs.shortcut.length) {
					return 1;
				} else if (lhs.shortcut < rhs.shortcut) {
					return -1;
				} else if (lhs.shortcut > rhs.shortcut) {
					return 1;
				} else {
					return 0;
				}
			});

			var html = "<table>";
			for (var i in selectedTypes) {
				var val = selectedTypes[i];
				html += "<tr><td>" + val.shortcut.toLowerCase() + "</td><td>" + val.name + "</td></tr>";
			}
			html += "</table>";
			
			$(inId + "-autocomplete").html(html);
			$(inId + "-statDataDisplay").hide();
		}
	}
	
	function hideAutoComplete() {
		$(inId + "-autocomplete").html("<table><tr><td>No stats detected.</td></tr></table>");
		$(inId + "-statDataDisplay").hide();
	}
	
	function formatMatchedData(statDataInfo, opponentStat, matchedToken) {
		var html = " <span class='collected'>";
		
		if ((statDataInfo.type == "player" && !opponentStat) || (statDataInfo.type == "opponent" && opponentStat)) {
			html += getPlayerByToken(dataManager.allPlayers, matchedToken);
		} else if ((statDataInfo.type == "player" && opponentStat) || (statDataInfo.type == "opponent" && !opponentStat)) {
			html += getPlayerByToken(dataManager.allOpponents, matchedToken);
		} else if (statDataInfo.type == "time") {
			html += "(" + matchedToken + ")";
		} else if (statDataInfo.type == "numerical") {
			var matched = false;
			html += "("
			for (var i in statDataInfo.extraInformation) {
				var extraInfo = statDataInfo.extraInformation[i];
				if (extraInfo.shortcut == matchedToken) {
					matched = true;
					html += (extraInfo.textData != undefined ? extraInfo.textData : matchedToken)
				}
			}
			if (statDataInfo.allDigitsAllowed && !matched) {
				html += matchedToken;
			}
			html += ")";
		}
		
		html += "</span>";
		
		return html;
	}
	
	function getPlayerByToken(playerList, matchedToken) {
		for (var i in playerList) {
			var player = playerList[i];
			if ((player.shortcut == matchedToken) || (player.number == matchedToken)) {
				return "\"" + player.firstName + " " + player.lastName + "\"";
			}
		}
	}
	
	function autoCompletePlayers(playerList, unmatchedToken) {
		var html = "";
		var sortedPlayerList = [];
		for (var i in playerList) {
			var player = playerList[i];
			if ((unmatchedToken == null) || (unmatchedToken.length == 0) || ((player.shortcut != undefined) && (player.shortcut.indexOf(unmatchedToken) == 0)) || (player.number.toString().indexOf(unmatchedToken) == 0)) {
				sortedPlayerList.push(player);
			}
		}
		sortedPlayerList.sort(function (lhs, rhs) {
			if (lhs.number < rhs.number) {
				return -1;
			} else if (lhs.number > rhs.number) {
				return 1;
			} else {
				return 0;
			}
		});
		for (var i in sortedPlayerList) {
			var player = sortedPlayerList[i];
			html += "<tr><td>" + player.number + "</td><td>" + player.shortcut + "</td><td>" + player.firstName + " " + player.lastName + "</td></tr>";
		}
		return html;
	}
	
	function formatAllowableValues(statDataInfo, opponentStat, unmatchedToken) {
		if ((statDataInfo.type == "player" && !opponentStat) || (statDataInfo.type == "opponent" && opponentStat)) {
			return autoCompletePlayers(dataManager.allPlayers, unmatchedToken);
		} else if ((statDataInfo.type == "player" && opponentStat) || (statDataInfo.type == "opponent" && !opponentStat)) {
			return autoCompletePlayers(dataManager.allOpponents, unmatchedToken);
		} else if (statDataInfo.type == "time") {
			return "<tr><td>Any time value in the format 1:00.00</td></tr>";
		} else if (statDataInfo.type == "numerical") {
			var html = "";
			
			if (statDataInfo.extraInformationProcessed == undefined) {
				var allHaveTextData = true;
				for (var i in statDataInfo.extraInformation) {
					allHaveTextData = allHaveTextData && (statDataInfo.extraInformation[i].textData != undefined);
				}
				
				if (allHaveTextData) {
					statDataInfo.sortedExtraInfo = statDataInfo.extraInformation.slice(0);
					statDataInfo.sortedExtraInfo.sort(function (lhs, rhs) {
						if (lhs.textData < rhs.textData) {
							return -1;
						} else if (lhs.textData > rhs.textData) {
							return 1;
						} else {
							return 0;
						}
					});
				}
				
				statDataInfo.extraInformationProcessed = true;
			}
			
			var extraInfo = statDataInfo.extraInformation;
			if (statDataInfo.sortedExtraInfo != undefined) {
				extraInfo = statDataInfo.sortedExtraInfo;
			}
			html += extraInfoHelper(extraInfo, unmatchedToken);
			
			if (statDataInfo.allDigitsAllowed) {
				html += "<tr><td colspan='2'>And any numerical information.</td></tr>";
			}
			return html;
		}
	}
	
	function extraInfoHelper(extraInfoArray, unmatchedToken) {
		var html = "";
		for (var i in extraInfoArray) {
			var extraInfo = extraInfoArray[i];
			if ((unmatchedToken == null) || (unmatchedToken.length == 0) || (extraInfo.shortcut.indexOf(unmatchedToken) == 0)) {
				html += "<tr><td>" + extraInfo.shortcut + "</td><td>" + (extraInfo.textData != undefined ? extraInfo.textData : "&nbsp;") + "</td></tr>";
			}
		}
		
		return html;
	}
	
	function displayAutoComplete(statType, matchedData, lastUnmatchedToken, opponentStat) {
		var html = "<table><tr><td><span class='collected'>" + statType.name + "</span>";
		
		var parseIndex = 0;
		// Display the full sentence and complete the sentence with as much information as the user has provided
		for (var i in statType.fullSentence) {
			if ((statType.firstStatEffectIndex != undefined) && (i >= statType.firstStatEffectIndex)) {
				continue;
			}
			
			var statData = statType.fullSentence[i];
			if (statData.textOnly) {
				html += " <span class='textOnly'>" + statData.textData + "</span>";
			} else if (parseIndex < matchedData.length) {
				// We have data for this position
				html += formatMatchedData(statData, opponentStat, matchedData[parseIndex]);
				parseIndex++;
			} else {
				// We have no matched data for this position
				html += " <span class='textData";
				if (parseIndex == matchedData.length) {
					html += " currentlyEntering";
				}
				html += "'>(";
				if (statData.textData != null) {
					html += statData.textData;
				} else if (statData.type == "player") {
					html += "Player";
				} else if (statData.type == "opponent") {
					html += "Opponent";
				} else if (statData.type == "numerical") {
					html += "Data Point";
				} else if (statData.type == "time") {
					html += "Time";
				}
				html += ")</span>";
				parseIndex++;
			}
		}
		
		html += "</td></tr></table>";
		
		$(inId + "-autocomplete").html(html);
		
		if (matchedData.length < statType.parseTypes.length) {
			html = "<table>";
			var currentlyEntering = statType.parseTypes[matchedData.length];
			html += formatAllowableValues(currentlyEntering, opponentStat, lastUnmatchedToken);
			
			html += "</table>";
			
			$(inId + "-statDataDisplay").html(html).show();
		}
	}

}
