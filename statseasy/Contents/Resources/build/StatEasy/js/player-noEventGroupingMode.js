
function NoEventGroupingMode(dataManager, videoManager) {
	var exports = {
		playFirstVideo : playFirstVideo,
		progressClicked: progressClicked,
		progressHover: progressHover,
		getDuration : getDuration,
		time_update : time_update,
		initTimelines : noOp,
		setEventViewer : noOp,
		initEventViewer : function () {
			return {
				resetFocus : noOp,
			}
		},
		registerNotificationFor : noOp,
	};
	
	function noOp(options) {}
	
	function playFirstVideo(startingVidId) {
		var firstVideo;
		if (startingVidId != undefined) {
			firstVideo = dataManager.gameVideos[startingVidId];
		} else {
			for (var i in dataManager.gameVideos) {
				firstVideo = dataManager.gameVideos[i];
			}
		}
		
		videoManager.loadVideo(firstVideo, 0);
		
		return firstVideo;
	}
	
	function progressClicked(percent) {
		videoManager.setCurrentTime(percent * getDuration());
	}
	
	function progressHover(percent) {
		return {
			time : percent * getDuration(),
		};
	}
	
	function getDuration() {
		return videoManager.getCurrentVideo().getDuration();
	}
	
	function time_update() {
		return videoManager.getCurrentTime() / getDuration();
	}
	
	return exports;
}
