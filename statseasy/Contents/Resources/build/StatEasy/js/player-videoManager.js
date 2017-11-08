
function VideoManager(dataManager, videoDiv, playerModeFunction, basePath, player, drawGameState, isServer) {
	var currentVideo;
	var currentSegment;
	var video = $("#" + videoDiv + "-video").get(0);
	var metaDataLoadedFunc;
	var newVideoTimeRequest;
	var videoPlaying = false;
	var playerMode;
	var oldState = {
		id : -1
	};
	var pauseTimeUpdate = false;
	
	var lastTimeUpdate = 0;
	var lastBufferStart = 0;
	var lastBufferEnd = 0;
	
	var exports = {
		playVideo : playVideo,
		sizeNotification : sizeNotification,
		
		// Video interaction exports
		isMuted : isMuted,
		toggleMuted : toggleMuted,
		isPaused : isPaused,
		pause : pause,
		play : play,
		getCurrentTime : getCurrentTime,
		setCurrentTime : setCurrentTime,
		getCurrentVideo : getCurrentVideo,
		requestFullScreen : requestFullScreen,
		setPlaybackRate : setPlaybackRate,
		updateTimeline : updateTimeline
	};
	
	// Functions that we want to make available to our player modes, but not to the population at large
	var playerModeExports = {
		loadVideo : loadVideo,
		getStateFromVideoTime : getStateFromVideoTime
	};
	for (var i in exports) {
		playerModeExports[i] = exports[i];
	}
	
	init();
	
	function init() {
		playerMode = new playerModeFunction(dataManager, playerModeExports, player);
		playerMode.initTimelines();
		var playerModeDelegations = {
			// playerMode-specific exports
			progressClicked : playerMode.progressClicked,
			progressHover : playerMode.progressHover,
			getDuration : playerMode.getDuration,
			playEvent : playerMode.playEvent,
			playFirstVideo : playerMode.playFirstVideo,
			initEventViewer : playerMode.initEventViewer,
			setEventViewer : playerMode.setEventViewer,
			registerNotificationFor : playerMode.registerNotificationFor,
		};
		for (var i in playerModeDelegations) {
			exports[i] = playerModeDelegations[i];
		}
		
		initListeners();
	}
	
	function updateTimeline(){
		if(playerMode != null){
			playerMode.initTimelines();
		}
		time_update();
	}
	
	function initListeners() {
		video.addEventListener("timeupdate", time_update, true);
		video.addEventListener("progress", dataLoaded, false);
		video.addEventListener("loadedmetadata", loadedMetaData, false);
		video.addEventListener("ended", videoEnded, false);
	}
	
	function getCurrentVideo() {
		return currentVideo;
	}
	
	function playVideo(videoId) {
		// Get the new video, be sure it has a valid timeline and then calculate where we'll "jump" to
		var newVideo = dataManager.gameVideos[videoId];
		
		var newTime = newVideo.getSameTimeAs(currentVideo.getTimeline(), getCurrentTime());
		
		newVideoTimeRequest = newTime;
		
		loadVideo(newVideo, newTime);
	}

	function loadVideo(someGameVideo, timeInVideo) {
		pauseTimeUpdate = true;
		
		currentVideo = someGameVideo;
		var segmentToLoad = videoTimeToSegment(currentVideo, timeInVideo);
		newVideoTimeRequest = videoTimeToSegmentTime(someGameVideo, timeInVideo);
		
		player.updateVideoSelection(currentVideo);
		player.drawSyncPoints(currentVideo);

		loadSegment(segmentToLoad);
	}
	
	function loadSegment(someSegment) {
		currentSegment = someSegment;
		video.pause();

		/*
		 * IE 9 has problems dynamically loading source elements. We have to completely wipe the video
		 * element and add it again using the html() method.
		 */
		if (what_ie_version != undefined && what_ie_version < 10) {
			addSourcesIE(someSegment);
		} else {
			addSources(someSegment);
		}

		video = $("#" + videoDiv + "-video").get(0);
		initListeners();
		video.load();
	}
	
	function addSources(segment) {
		$(video).html('');
		if (segment.videoSources.length == 0) {
			$(video).append($("<source src='" + basePath + "videos/" + segment.fileName + "' />"));
		} else {
			for (var srcIndex in segment.videoSources) {
				$(video).append($("<source src='" + videoPathName(segment.videoSources[srcIndex]) + "' />"));
			}
		}
	}
	
	function addSourcesIE(segment) {
		$('#' + videoDiv + '-videoElementWrapper').html('');
		var srcList = "";
		
		if (segment.videoSources.length == 0) {
			srcList += "<source src='" + basePath + "videos/" + segment.fileName + "' />";
		} else {
			for (var srcIndex in segment.videoSources) {
				srcList += "<source src='" + videoPathName(segment.videoSources[srcIndex]) + "' />";
			}
		}
		
		var videoElement = "<video id='" + videoDiv + "-video' autobuffer='autobuffer' preload='auto'>" + srcList + "</video>";
		$('#' + videoDiv + '-videoElementWrapper').html(videoElement);
	}
	
	function videoPathName(someSegmentSource) {
		var baseUrl = basePath + "videos";
		if (isServer) {
			baseUrl = "https://s3.amazonaws.com/" + someSegmentSource.location;
		}
		
		var escapedFileName = someSegmentSource.filename.replace("'", "&apos;");
		escapedFileName = escapedFileName.replace('"', '&quot;');
		
		return baseUrl + "/" + escapedFileName;
	}
	
	function videoEnded() {
		var foundSegment = false;
		var nextSegment = undefined;
		for (var i in currentVideo.getSegments()) {
			var segment = currentVideo.getSegments()[i];
			if (foundSegment) {
				nextSegment = segment;
			}
			foundSegment = segment.id == currentSegment.id;
		}
		
		if (nextSegment == undefined) {
			nextSegment = currentVideo.getSegments()[0];
		}
		
		loadSegment(nextSegment);
	}
	
	function loadedMetaData() {
		pauseTimeUpdate = false;
		
		// If there is a newVideoTimeRequest, then act on it and reset it
		if (newVideoTimeRequest != undefined) {
			video.currentTime = newVideoTimeRequest;
			newVideoTimeRequest = undefined;
		}
		
		// Whatever our state was when the load was requested, make sure it persists
		if (videoPlaying) {
			video.play();
		}
		
		if (!!metaDataLoadedFunc) {
			metaDataLoadedFunc();
		}
	}
	
	function sizeNotification(someFunction) {
		metaDataLoadedFunc = someFunction;
	}
	
	function time_update() {
		if (pauseTimeUpdate) {
			return;
		}
		pauseTimeUpdate = true;
		
		var percentProgress = playerMode.time_update();
		lastTimeUpdate = percentProgress;
		
		player.drawProgress(lastTimeUpdate, lastBufferStart, lastBufferEnd);
		
		//console.log("Setting video time to " + getCurrentTime());
		currentVideo.setCurrentTime(getCurrentTime());
		
		update_state();
		
		pauseTimeUpdate = false;
	}
	
	function dataLoaded() {
		for (var i = 0; i < video.buffered.length; i++) {
			if (video.currentTime >= video.buffered.start(i) && video.currentTime <= video.buffered.end(i)) {
				lastBufferStart = segmentTimeToVideoTime(currentSegment, video.buffered.start(i)) / getCurrentVideo().getDuration();
				lastBufferEnd = segmentTimeToVideoTime(currentSegment, video.buffered.end(i)) / getCurrentVideo().getDuration();
				
				player.drawProgress(lastTimeUpdate, lastBufferStart, lastBufferEnd);
			}
		}
	}
	
	// I feel like I should be able to merge this with the progressHover function...
	function update_state() {
		
		var currentStateAndStat = getStateFromVideoTime(currentVideo, getCurrentTime());
		var currentState = currentStateAndStat[0];
		var currentEvent = currentStateAndStat[1];
		
		if (oldState.id != currentState.id) {
			if (drawGameState) {
				var currentGame = dataManager.game;
				if (currentEvent != undefined) {
					currentGame = dataManager.games[currentEvent.getGameId()];
				}
				player.drawStateTable(currentGame, currentState);
			} else if (currentEvent != undefined) {
				dataManager.currentGameState = currentState.id;
				dataManager.game = dataManager.games[currentEvent.getGameId()];
				dataManager.game.currentGameState = currentState.id;
				LiveViewManager.notifyNewData();
			}
		}
	
		oldState = currentState;
	}
	
	function getStateFromVideoTime(someVideo, someTime) {
		var currentEvent = someVideo.mostStateRelevantEvent(someTime);
		var currentState;
		if (currentEvent != undefined) {
			var eventTime = someVideo.getTimeFor(currentEvent);
			
			if (someTime < eventTime) {
				currentState = currentEvent.getBeginningGameState();
			} else {
				currentState = currentEvent.getEndingGameState();
			}
		} else {
			if (dataManager.allStats && (dataManager.allStats.length > 0)) {
				currentEvent = dataManager.allStats[0];
				currentState = currentEvent.getBeginningGameState();
			} else {
				currentState = {
					id: -1,
					ourScore: 0,
					theirScore: 0,
				};
			}
		}
		
		return [currentState, currentEvent];
	}
	
	//////////////////////////// Segment Time Manipulation Functions
	function videoTimeToSegmentTime(gameVideo, timeInVideo) {
		var startingTime = 0;
		for (var i in gameVideo.getSegments()) {
			var segment = gameVideo.getSegments()[i];
			if ((startingTime <= timeInVideo) && (timeInVideo < (startingTime + segment.duration))) {
				return timeInVideo - startingTime;
			}
			startingTime += segment.duration;
		}
	}
	
	function videoTimeToSegment(gameVideo, timeInVideo) {
		var startingTime = 0;
		for (var i in gameVideo.getSegments()) {
			var segment = gameVideo.getSegments()[i];
			if ((startingTime <= timeInVideo) && (timeInVideo < (startingTime + segment.duration))) {
				return segment;
			}
			startingTime += segment.duration;
		}
		
		return gameVideo.getSegments()[0];
	}
	
	function segmentTimeToVideoTime(someSegment, segmentTime) {
		var startingTime = 0;
		for (var i in currentVideo.getSegments()) {
			var segment = currentVideo.getSegments()[i];
			if (segment.id == someSegment.id) {
				return startingTime + segmentTime;
			}
			startingTime += segment.duration;
		}
	}
	
	////////////////////////////  Video Interaction Functions
	
	function setCurrentTime(timeInVideo) {
		var requestSegment = videoTimeToSegment(currentVideo, timeInVideo);
		
		if (requestSegment.id != currentSegment.id) {
			loadVideo(currentVideo, timeInVideo);
		} else {
			video.currentTime = videoTimeToSegmentTime(currentVideo, timeInVideo);
		}
	}
	
	
	function getCurrentTime() {
		return segmentTimeToVideoTime(currentSegment, video.currentTime);
	}
	
	function play() {
		videoPlaying = true;
		video.play();
	}
	
	function pause() {
		videoPlaying = false;
		video.pause();
	}
	
	function isPaused() {
		return !videoPlaying;
	}
	
	function toggleMuted() {
		video.muted = !video.muted;
	}
	
	function isMuted() {
		return video.muted;
	}
	
	function requestFullScreen(withStats) {
		var elem;
		
		if (withStats) {
			// This was a request for full-screen stats+video. Expand the div containing both.
			elem = $('.middle')[0];
		} else {
			// This was a request for just the video to be full-screen.
			elem = video;
		}
		
		// Cross-browser compatibility
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	}
	
	function setPlaybackRate(rate) {
		video.playbackRate=rate;
	}
	
	return exports;
}