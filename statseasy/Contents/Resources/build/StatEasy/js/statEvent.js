
function StatEvent(event, dataManager) {

	var id;
	var gameId;
	var eventStatType;
	var statIndex;
	var parentStatId;
	var time;
	var gameTime;
	var statData;
	var opponentStat;
	var beginningGameState;
	var endingGameState;
	var actionEndingStat;
	var seekTimeOffset;
	var endTimeOffset;
	var locationData;
	var color;

	initialize(event);
	
	function initialize(event) {
		id = event.id;
		gameId = event.gameId;
		eventStatType = event.statType;
		statIndex = event.statIndex;
		parentStatId = event.parentStatId;
		time = event.time;
		gameTime = event.gameTime;
		statData = event.statData;
		opponentStat = event.opponentStat;
		beginningGameState = event.beginningGameState;
		endingGameState = event.endingGameState;
		actionEndingStat = event.actionEndingStat;
		seekTimeOffset = event.seekTimeOffset;
		endTimeOffset = event.endTimeOffset;
		locationData = event.locationData;
		color = event.color;
		
		getName.storedName = undefined;
		getShortcut.shortcut = undefined;
	}
	this.initialize = initialize;
	
	/***************************************************************************
	 *                             Getters
	 **************************************************************************/
	function getId() {
		return id;
	}
	this.getId = getId;
	
	this.getStatId = getId;
	
	function isOpponentStat() {
		return opponentStat;
	}
	this.isOpponentStat = isOpponentStat;
	
	function getTime() {
		return time;
	}
	this.getTime = getTime;
	
	function getGameTime() {
		return gameTime;
	}
	this.getGameTime = getGameTime;
	
	function getStatIndex() {
		return statIndex;
	}
	this.getStatIndex = getStatIndex;
	
	function getParentStatId() {
		return parentStatId;
	}
	this.getParentStatId = getParentStatId;
	
	function getLocationData() {
		return locationData;
	}
	this.getLocationData = getLocationData;
	
	function getColor() {
		if (color != undefined) {
			return color;
		} else {
			var statType = dataManager.statTypes[eventStatType];
			return statType.color ? statType.color : "#00FF00";
		}
	}
	this.getColor = getColor;
	
	function getSupplementalStats() {
		var supplementalStats = [];
		for (var i in dataManager.allStats) {
			var stat = dataManager.allStats[i];
			if (stat.getParentStatId() == getId()) {
				supplementalStats.push(stat);
			}
		}
		return supplementalStats;
	}
	this.getSupplementalStats = getSupplementalStats;
	
	function getStatType() {
		return eventStatType;
	}
	this.getStatType = getStatType;
	
	function getStatData(index) {
		var statDataObj = statData[index];
		if (statDataObj == undefined) {
			return undefined;
		} else if (statDataObj.player != undefined) {
			return statDataObj.player;
		} else if (statDataObj.time != undefined) {
			return statDataObj.time;
		} else {
			return statDataObj.numericalData;
		}
	}
	this.getStatData = getStatData;
	
	function getGameId() {
		return gameId;
	}
	this.getGameId = getGameId;
	
	function getEventGroupingHeirarchy() {
		var groupingId = dataManager.games[getGameId()].associatedEvent;
		
		var parentGroupId = groupingId;
		var heirarchy = [];
		while (parentGroupId != undefined) {
			var parentGroup = dataManager.groupings[parentGroupId];
			heirarchy.push(parentGroup);
			parentGroupId = parentGroup.parentGroup;
		}
		
		return heirarchy;
	}
	this.getEventGroupingHeirarchy = getEventGroupingHeirarchy;
	
	function getPlayable() {
		return getCoveringVideoIds().length > 0;
	}
	this.getPlayable = getPlayable;
	
	function getBeginningGameState() {
		return dataManager.gameStates[beginningGameState];
	}
	this.getBeginningGameState = getBeginningGameState;
	
	function getEndingGameState() {
		return dataManager.gameStates[endingGameState];
	}
	this.getEndingGameState = getEndingGameState;
	
	function getPlayableGameVideo() {
		var playableGameVideo = undefined;
		var allVidIds = getCoveringVideoIds();
		if (allVidIds.length > 0) {
			playableGameVideo = dataManager.gameVideos[allVidIds[0]];
		}
		return playableGameVideo;
	}
	this.getPlayableGameVideo = getPlayableGameVideo;
	
	function isActionEndingStat() {
		if (actionEndingStat != undefined) {
			return actionEndingStat;
		}
		var statType = dataManager.statTypes[eventStatType];
		return statType.actionEndingStat;
	}
	this.isActionEndingStat = isActionEndingStat;
	
	function canContinuouslyPlayTo(anotherEntry) {
		return (this.getGameId() == anotherEntry.getGameId()) &&
			(anotherEntry.getSeekTime() <= this.getEndTime()) && // If this event ends after the next one has started 
			(anotherEntry.getEndTime() > this.getEndTime()); // and the next one ends after this one, then we're in a sequential overlap situation.
	}
	this.canContinuouslyPlayTo = canContinuouslyPlayTo;
	
	/***************************************************************************
	 *                             Video Management
	 **************************************************************************/
	var coveringVideo = {};
	function addCoveringVideo(videoId) {
		coveringVideo[videoId] = true;
	}
	this.addCoveringVideo = addCoveringVideo;
	
	function removeCoveringVideo(videoId) {
		coveringVideo[videoId] = false;
	}
	this.removeCoveringVideo = removeCoveringVideo;
	
	function isCoveredBy(video) {
		return coveringVideo[video.getId()];
	}
	this.isCoveredBy = isCoveredBy;
	
	/**
	 * List all of the video Ids that can play this stat
	 * @return
	 */
	function getCoveringVideoIds() {
		var coveringVidIds = [];
		for (var id in coveringVideo) {
			if (coveringVideo[id]) {
				coveringVidIds.push(id);
			}
		}
		return coveringVidIds;
	}
	this.getCoveringVideoIds = getCoveringVideoIds;
	
	/***************************************************************************
	 *                             Time Management
	 **************************************************************************/
	function getSeekTime() {
		return time + getSeekTimeOffset();
	}
	this.getSeekTime = getSeekTime;
	
	function getSeekTimeOffset() {
		if (seekTimeOffset != undefined) {
			return seekTimeOffset;
		}
		var statType = dataManager.statTypes[eventStatType];
		return statType.seekTimeOffset;
	}
	this.getSeekTimeOffset = getSeekTimeOffset;	
	
	function getEndTime() {
		return time + getEndTimeOffset();
	}
	this.getEndTime = getEndTime;
	
	function getEndTimeOffset() {
		if (endTimeOffset != undefined) {
			return endTimeOffset;
		}
		var statType = dataManager.statTypes[eventStatType];
		return statType.endTimeOffset;
	}
	this.getEndTimeOffset = getEndTimeOffset;
	
	function applicableTo(syncPoint) {
		return (syncPoint.gameId == gameId) && (syncPoint.startingStatIndex <= statIndex);
	}
	this.applicableTo = applicableTo;
	
	/***************************************************************************
	 *                             Generated Data
	 **************************************************************************/
	function getShortcut() {
		if (getShortcut.shortcut != undefined) {
			return getShortcut.shortcut;
		}
		
		var statType = dataManager.statTypes[eventStatType];
		var shortcut = "";
		if (opponentStat) {
			shortcut += ";";
		}
		shortcut += statType.shortcut;
		
		for (var i in statData) {
			if ((i >= statType.parseTypes.length) || (statType.parseTypes[i].statEffectProvided)) {
				continue;
			}
			
			if (statData[i].numericalData != null) {
				shortcut += " ";
				if ((statType.parseTypes[i].extraInformation != undefined) && 
					(statType.parseTypes[i].extraInformation.length > 0))
				{
					if (statData[i].numericalData < statType.parseTypes[i].extraInformation.length) {
						shortcut += statType.parseTypes[i].extraInformation[statData[i].numericalData].shortcut; 
					} else {
						shortcut += statData[i].numericalData - statType.parseTypes[i].extraInformation.length;
					}
				} else {
					shortcut += statData[i].numericalData;
				}
			} else if (statData[i].player != null) {
				shortcut += " ";
				var player = getPlayerAtIndex(i);
				if (player == undefined) {
					// No shortcut to add here.
				} else if ((player.shortcut != undefined) && (player.shortcut.length > 0)) {
					shortcut += player.shortcut;
				} else {
					shortcut += player.number;
				}
			} else if (statData[i].time != null) {
				shortcut += " " + statData[i].timeString;
			}
		}
		
		getShortcut.shortcut = shortcut;
		return getShortcut.shortcut;
	}
	this.getShortcut = getShortcut;
	
	function formatStatData(data, i, statType) {
		var eventName = "";
		
		if (data.player != null) {
			eventName += "\"";
			var player = getPlayerAtIndex(i);
			if (player != undefined) {
				eventName += player.lastName + ", " + player.firstName;
			} else {
				eventName += "?";
			}
			eventName += "\"";
		} else if (data.numericalData != null) {
			eventName += "(";
			if ((statType.parseTypes[i].extraInformation != undefined) && 
				(statType.parseTypes[i].extraInformation.length > 0))
			{
				if (data.numericalData < statType.parseTypes[i].extraInformation.length) {
					var statData = statType.parseTypes[i].extraInformation[data.numericalData];
					if (statData != undefined) {
						eventName += statData.textData != null ? statData.textData : statData.shortcut;
					} else {
						eventName += data.numericalData;
					}
				} else {
					eventName += data.numericalData - statType.parseTypes[i].extraInformation.length;
				}
			} else {
				eventName += data.numericalData;
			}
			eventName += ")";
		} else if (data.time != null) {
			eventName += "(" + data.timeString + ")";
		} else {
			eventName += "(-)";
		}
		
		return eventName;
	}
	
	function getName() {
		if (getName.storedName != undefined) {
			return getName.storedName;
		}
		
		var statType = dataManager.statTypes[eventStatType];
		var eventName = statType.name;
		
		var dataIndex = 0;
		for (var i in statType.fullSentence) {
			var statInfo = statType.fullSentence[i];
			
			eventName += " ";
			
			if (statInfo.textOnly) {
				eventName += statInfo.textData;
			} else {
				var data = undefined;
				if (dataIndex < statData.length) {
					data = statData[dataIndex];
				}

				if (data == undefined) {
					eventName += "(?)";
				} else {
					eventName += formatStatData(data, dataIndex, statType);
				}
				
				dataIndex++;
			}
		}
		
		getName.storedName = eventName;
		return getName.storedName;
	}
	this.getName = getName;
	
	function getPlayerAtIndex(index) {
		var opponentData = dataManager.statTypes[eventStatType].parseTypes[index].type == 'opponent';
		var playerId = statData[index].player;
		
		var playerObj;
		if ((opponentData && !opponentStat) || (!opponentData && opponentStat)) {
			playerObj = dataManager.allOpponents[playerId];
		} else {
			playerObj = dataManager.allPlayers[playerId];
		}
		
		return playerObj;
	}
}