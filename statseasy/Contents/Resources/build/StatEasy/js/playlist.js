
function Playlist(settings) {
	var creationInfo = settings.creationInfo;
	var dataManager = settings.dataManager;
	var divId = settings.divId;
	var searchDivId = settings.searchDivId;
	var mode = settings.mode || Playlist.EDIT_MODE;
	var clickHandler = settings.clickHandler;
	
	var statList = new StatList(divId, {
		showGameSeparators : true,
	});
	
	if (searchDivId != undefined) {
		new SearchBox(searchDivId, {
			dataManager : dataManager,
			statList : statList,
		});
	}
	
	if (mode == Playlist.EDIT_MODE) {
		statList.setDeleteHandler(deleteEntry);
	}
	
	var id = undefined;
	var name = undefined;
	var entries = [];
	var entryIdLookup = {};
	
	if (typeof creationInfo == "string") {
		name = creationInfo;
	} else {
		populatePlaylist(creationInfo);
	}
	
	function setMode(callback) {
		statList.setClickHandler(callback);
	}
	this.setMode = setMode;
	
	function populatePlaylist(playlistInfo) {
		id = playlistInfo.id;
		name = playlistInfo.name;
		for (var i in playlistInfo.entries) {
			var entry = playlistInfo.entries[i];
			var stat = undefined;
			if (dataManager.statsById != undefined) {
				stat = new StatEvent(dataManager.statsById[entry.targetStat], dataManager);
			} else {
				var i = 0;
				while ((stat == undefined) && (i < dataManager.allStats.length)) {
					if (entry.targetStat == dataManager.allStats[i].getId()) {
						stat = dataManager.allStats[i];
					}
					i++;
				}
			}
			// Lame test to see if there's an object
			if (dataManager.gameVideos[entry.targetVideo].getId == undefined) {
				dataManager.gameVideos[entry.targetVideo] = new GameVideo(dataManager.gameVideos[entry.targetVideo], dataManager);
			}
			var gameVideo = dataManager.gameVideos[entry.targetVideo];
			
			insertEntry(new PlaylistEntry({
				id : entry.id,
				targetStat : stat.getId(),
				stat : stat,
            	targetVideo : gameVideo.getId(),
            	startTime : entry.startTime,
            	time : entry.time,
            	endTime : entry.endTime,
			}, dataManager));
		}
	}
	
	function insertEntryAtIndex(entryData, index) {
		var entryId = statList.insertStat(entryData, undefined, index);
		entryIdLookup[entryData.getId()] = entryId;
		
		entries.splice(index, 0, entryData);
		
		statList.scrollToEntry(entryId);
		
		return entryId;
	}
	
	function insertEntry(entryData, dropTarget) {
		var index = undefined;
		if ((dropTarget == undefined) || ($(dropTarget).hasClass("playlistList"))) {
			// Append
			index = entries.length;
		} else {
			index = statList.htmlIdToEntryIndex(dropTarget.id);
		}
		
		return insertEntryAtIndex(entryData, index);
	}
	this.insertEntry = insertEntry;
	
	function moveEntry(entryId, dropTarget) {
		var fromIndex = statList.getEntryIndexById(entryId);
		var toIndex = statList.htmlIdToEntryIndex(dropTarget.id);
		var entryData = entries[fromIndex];
		
		deleteEntry(undefined, undefined, entryId);
		
		if (fromIndex < toIndex) {
			toIndex = toIndex - 1;
		}
		
		return insertEntryAtIndex(entryData, toIndex);
	}
	this.moveEntry = moveEntry;
	
	function deleteEntry(stat, imgDOM, entryId) {
		var index = statList.getEntryIndexById(entryId);
		statList.removeEntry(entryId);
		
		var myEntry = entries[index];
		entries.splice(index, 1);
		
		delete entryIdLookup[myEntry.id];
	}
	
	function save(callback) {
		var toSend = {};
		if (id != undefined) {
			toSend.id = id;
		}
		toSend.name = name;
		toSend.entries = [];
		
		for (var i in entries) {
			toSend.entries.push({
				index : i,
				targetStat : entries[i].stat.getId(),
				targetVideo : entries[i].getPlayableGameVideo().getId(),
				startTime : entries[i].startTime,
				time : entries[i].time,
				endTime : entries[i].endTime,
			});
		}
		
		dataManager.savePlaylist(toSend, callback);
	}
	this.save = save;
	
	this.unbindAll = statList.unbindAll;
	
	/***************************************************************************
	 *                             Stat Effects
	 **************************************************************************/
	this.highlightEntry = statList.highlightEntry;
	this.fadeEntry = statList.fadeEntry;
	this.unfadeEntry = statList.unfadeEntry;
	this.scrollToEntry = statList.scrollToEntry;
	
	// Duck typing this to be just like an EventViewer
	this.resetFocus = function () {};
	this.highlightStat = passAlongId(statList.highlightEntry);
	this.fadeStat = passAlongId(statList.fadeEntry);
	this.unfadeStat = passAlongId(statList.unfadeEntry);
	this.scrollToStat = passAlongId(statList.scrollToEntry);
	
	function passAlongId(passTo) {
		return function (statObj) {
			passTo(entryIdLookup[statObj.id]);
		}
	}
	
}

Playlist.EDIT_MODE = 1;
Playlist.PLAY_MODE = 2;

function PlaylistEntry(entry, dataManager) {
	
	PlaylistEntry.newId = -1;
	
	this.id = entry.id != null ? entry.id : getNewId();
	this.targetStat = entry.targetStat;
	this.targetVideo = entry.targetVideo;
	this.startTime = entry.startTime;
	this.time = entry.time;
	this.endTime = entry.endTime;
	this.stat = entry.stat;
	
	function getNewId() {
		return PlaylistEntry.newId--;
	}
	
	function getId() {
		return this.id;
	}
	this.getId = getId;
	
	function getStatId() {
		return this.getStat().getId();
	}
	this.getStatId = getStatId;
	
	function getTime() {
		return this.time;
	}
	this.getTime = getTime;
	
	function getSeekTime() {
		return this.getTime() + this.getSeekTimeOffset();
	}
	this.getSeekTime = getSeekTime;
	
	function getSeekTimeOffset() {
		return this.startTime - this.getTime();
	}
	this.getSeekTimeOffset = getSeekTimeOffset;
	
	function getEndTime() {
		return this.getTime() + this.getEndTimeOffset();
	}
	this.getEndTime = getEndTime;
	
	function getEndTimeOffset() {
		return this.endTime - this.getTime();
	}
	this.getEndTimeOffset = getEndTimeOffset;
	
	function getPlayable() {
		return true;
	}
	this.getPlayable = getPlayable;
	
	function getPlayableGameVideo() {
		return dataManager.gameVideos[this.targetVideo];
	}
	this.getPlayableGameVideo = getPlayableGameVideo;
	
	function getStat() {
		if (this.stat == undefined) {
			this.stat = dataManager.getStatById(this.targetStat);
		}
		return this.stat;
	}
	this.getStat = getStat;
	
	function getBeginningGameState() {
		var stat = this.getStat();
		return stat.getBeginningGameState();
	}
	this.getBeginningGameState = getBeginningGameState;
	
	function getEndingGameState() {
		var stat = this.getStat();
		return stat.getEndingGameState();
	}
	this.getEndingGameState = getEndingGameState;
	
	function getGameId() {
		var stat = this.getStat();
		return stat.getGameId();
	}
	this.getGameId = getGameId;
	
	function canContinuouslyPlayTo(anotherEntry) {
		return (this.targetVideo == anotherEntry.targetVideo) &&
			(anotherEntry.getSeekTime() <= this.getEndTime()) && // If this event ends after the next one has started 
			(anotherEntry.getEndTime() > this.getEndTime()); // and the next one ends after this one, then we're in a sequential overlap situation.
	}
	this.canContinuouslyPlayTo = canContinuouslyPlayTo;

	function isCoveredBy(video) {
		var stat = this.getStat();
		return stat.isCoveredBy(video);
	}
	this.isCoveredBy = isCoveredBy;
	
	if (this.stat == undefined) {
		this.getStat();
	}
	
	this.isOpponentStat = this.stat.isOpponentStat;
	this.getName = this.stat.getName;
	this.getShortcut = this.stat.getShortcut;
	this.getEventGroupingHeirarchy = this.stat.getEventGroupingHeirarchy;
	
}
