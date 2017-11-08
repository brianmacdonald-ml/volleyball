/*
 * Required for all LiveViews
 */
var classname = "VideoLiveView";
var version = 1.6;

function inc(filename) {
	if (typeof document === 'undefined') {
		return;
	}
	
	var body = document.getElementsByTagName('body').item(0);
	script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	body.appendChild(script);
}

inc("/js/player.js");
inc("/js/gameVideo.js");
inc("/js/timeline.js");
inc("/js/canvas.js");

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function VideoLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
	
	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {
	}
	this.prepareToShow = prepareToShow;
	
	function invalidate() {
		self.valid = false;
	}
	this.invalidate = invalidate;
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (self.shown && self.valid) {
			return;
		}
		
		if (!self.shown) {
			$("#" + self.targetDivId).append("<div id='" + self.targetDivId + "-video'></div><p>Press the TAB key to pause/play.<br/>Press ALT-LeftArrow to skip back 5 seconds</p>");
			
			if (dataManager.gameVideos != undefined) {
				
				dataManager.viewer.setNetEventHighlighting(false);
				var player = new StatPlayer({
					id: self.targetDivId + "-video", 
					dataManager: dataManager,
					drawGameState: true,
					mode: StatPlayer.LIVE_VIEW_MODE,
					existingViewer: dataManager.viewer,
					condenseChecked: false,
					restoreVideoTime: true,
					isServer: false
				});
				
				$(".newLink").click(function () {
					player.persistTime();
				});
			} else {
				var firstLevelGrouping = dataManager.groupings[dataManager.game.associatedEvent];
				var firstLevelGroupingType = dataManager.groupingTypes[firstLevelGrouping.myType];
				var associateMessage = "There is no video associated to this " + firstLevelGroupingType.name;
				
				associateMessage += "<br/><br/><a href='../video/videos.htm?season=" + firstLevelGrouping.ourSeason + "&returnTo=" + firstLevelGrouping.associatedEvent + "'>Click here</a> to associate a video to it.";
				
				$("#" + self.targetDivId + "-video").append(associateMessage);
			}
		}
		
		self.shown = true;
		self.valid = true;
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

