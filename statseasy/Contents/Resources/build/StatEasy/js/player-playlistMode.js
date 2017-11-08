
function PlaylistMode(dataManager, videoManager, player, eventViewer) {
	var superClass = new ReportMode(dataManager, videoManager, player, eventViewer);
	var exports = {
		initEventViewer : initEventViewer,
		initTimelines : initTimelines,
		setEventViewer : setEventViewer,
		updateTimelines : updateTimelines
	};
	
	for (var i in superClass) {
        if (superClass.hasOwnProperty(i) && (exports[i] == undefined)) {
            exports[i] = superClass[i];
        }
    }
	
	function initTimelines() {
		superClass.initTimelines(dataManager.playlist.entries);
	}
	
	///////////////////////////////////// Overrides
	
	var eventViewer = undefined;
	
	function initEventViewer(options) {
		options.creationInfo = options.dataManager.playlist;
		options.mode = Playlist.PLAY_MODE;
		options.clickHandler = playlistPlayMode;
		options.divId = options.divId + "-events";
		
		eventViewer = new Playlist(options);
		
		superClass.setEventViewer(eventViewer);
		
		return eventViewer;
	}
	
	function updateTimelines(){
		superClass.updateTimeline(dataManager.playlist.entries);
		eventViewer.updateStatList(dataManager.playlist.entries);
	}
	
	function setEventViewer(existingViewer) {
		eventViewer = existingViewer;
		
		superClass.setEventViewer(eventViewer);
	}
	
	function playlistPlayMode(event, eventObj, entry) {
		playEntry(event);
	}
	
	function playEntry(playlistEntry, doNotSetCurrentTime) {
		var targetVideoId = playlistEntry.targetVideo;
		var currentVideo = videoManager.getCurrentVideo();
		if (typeof targetVideoId == "object") {
			targetVideoId = targetVideoId.getId();
		}
		
		if (!doNotSetCurrentTime) {
			//playlistTimeline.setCurrentTime(playlistTimeline.getSeekTimeFor(playlistEntry));
		}
		
		if ((currentVideo != undefined) && currentVideo.getId() == targetVideoId) {
			var requestedVideoTime = currentVideo.getSeekTimeFor(playlistEntry);
			videoManager.setCurrentTime(requestedVideoTime);
		} else {
			// Find a gameVideo to play for this event
			var playableGameVideo = dataManager.gameVideos[targetVideoId];
			
			// Calculate where to jump to, based on the event passed in
			var newVideoTimeRequest = playableGameVideo.getSeekTimeFor(playlistEntry);
			//videoManager.setCurrentTime(newVideoTimeRequest);
			
			// Switch the video
			videoManager.loadVideo(playableGameVideo,newVideoTimeRequest);
		}
	}
	
	return exports;
}
