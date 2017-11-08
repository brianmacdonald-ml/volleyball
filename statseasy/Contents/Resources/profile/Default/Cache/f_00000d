
var allPlayers = {};

function StatPlayer(settings) {
	var exports = {
		updateVideoSelection : updateVideoSelection,
		drawSyncPoints : drawSyncPoints,
		drawProgress : drawProgress,
		isCondenseChecked : isCondenseChecked,
		inEditMode : inEditMode,
		toggle : toggle,
		play : play,
		pause : pause,
		setCurrentTime : setCurrentTime,
		seekRelative : seekRelative,
		persistTime : persistTime,
		videoClicked : videoClicked,
		removeSyncPoint : removeSyncPoint,
		getActiveSyncAndVideoTime : getActiveSyncAndVideoTime,
		drawStateTable : drawStateTable,
		handleKeyDown : handleKeyDown,
		handleKeyUp : handleKeyUp
	};

	// Player Mode Constants declared at the end of this file

	var divId = settings.id;
	var dataManager = settings.dataManager;
	var basePath = settings.basePath;
	var startingVidId = settings.startingVidId;
	var playerMode = settings.mode != undefined ? settings.mode : StatPlayer.SINGLE_EVENT_GROUPING_MODE;
	var drawGameState = settings.drawGameState;
	var isServer = settings.isServer != undefined ? settings.isServer : false;

	dataManager.player = exports;

	var divObj = (!!divId) ? $("#" + divId) : null;
	var playPause = null;
	var progress = null;
	var skipBack = null;
	var skipFwd = null;
	var slomoBack = null;
	var slomoFwd = null;
	var volume = null;
	var fullScreen = null;
	var fullScreenStats = null;
	var telestrator = null;
	var skipBackDelay = null;
	var slomoForwardDelay = null;
	var slomoBackwardDelay = null;
	var slomoBackwardInterval = null;
	var rewindInterval = null;
	var skipForwardDelay = null;
	var forwardInterval = null;
	var wasPlaying = false;
	var videoControlKeyDown = null;

	var os = null;

	if (basePath == undefined) {
		basePath = "/";
	}

	var condenseChecked = settings.condenseChecked != undefined ? settings.condenseChecked : true ;

	var PLAY_MODE = 1;
	var SYNC_MODE = 2;
	var EDIT_MODE = 3;
	var mode = PLAY_MODE;

	var initialSync = true;

	var currentVideo = null;

	var controlHeight = 30;
	var controlWidth = 30;
	var progressWidth = -1;

	allPlayers[divId] = exports;

	var statTimeline;
	var playlistTimeline;
	// Only used in playlist mode.  This will be set to the time requested of the 
	// video.  All time_update processing will stop until the video plays something
	// within 0.25 seconds of the requested time
	var requestedVideoTime = undefined;

	if (navigator.appVersion.indexOf("Mac")!=-1) {
		os = "mac";
	} else {
		os = "windows"; 
	}

	addHtml();

	var videoManager = new VideoManager(dataManager, divId, playerMode.behavior, basePath, exports, drawGameState, isServer);

	var eventViewer = settings.existingViewer;
	if (eventViewer == undefined) {
		eventViewer = videoManager.initEventViewer({
			divId : divId,
			dataManager : dataManager,
			basePath: basePath,
			showGameSeparators: true,
			searchDivId : divId + "-search",
		});
	} else {
		videoManager.setEventViewer(eventViewer);
	}

	// We need to resize some controls based on the video size.  This is our callback to be notified of video size changes
	videoManager.sizeNotification(waitForVideoSize);
	exports.getCurrentVideo = videoManager.getCurrentVideo;
	exports.registerNotificationFor = videoManager.registerNotificationFor;
	exports.getDuration = videoManager.getDuration;
	exports.updateTimeline = videoManager.updateTimeline;
	
	initObjects();
	initEventHandlers();

	videoManager.playFirstVideo(startingVidId, settings.restoreVideoTime);

	/***************************************************************************
	 *                       Multi-Game/Playlist Mode
	 **************************************************************************/

	function doNothing() {
		return function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
		}
	}

	/***************************************************************************
	 *                          HTML Generation
	 **************************************************************************/
	/**
	 * Mode                         | Usage
	 * ---------------------------------------
	 * MULTIPLE_EVENT_GROUPING_MODE | Video via a report
	 * NO_EVENT_GROUPING_MODE       | Watching a video outside of the context of an event. No stats are shown.
	 * SINGLE_EVENT_GROUPING_MODE   | Watching a video of one event.
	 * LIVE_VIEW_MODE               | Watching a video in a LiveView.  Used for 'Stat From a Video'.
	 * READ_ONLY_MODE               | Parent copy of StatEasy.  They can't modify anything.
	 * 
	 */

	function addHtml() {
		var videoHtml = "";
		var downtimeMenu = "";
		var modeMenu = "";
		var playlistMenu = "";
		var searchArea = "";

		if (playerMode.videoMenu) {
			videoHtml = "<li><a href='javascript:return false;'>Videos</a><ul class='navigation-2' id='" + divId + "-videos'>";
			for (i in dataManager.gameVideos) {
				videoHtml += "<li><a class='vid" + i + "' onclick='allPlayers[\"" + divId + "\"].videoClicked(" + i + ");return false;' href='javascript:return false;' style='width:250px'>" + dataManager.gameVideos[i].getName() + "</a></li>";
			}
			videoHtml += "</ul></li>";
		}

		if (playerMode.downtimeMenu) {
			downtimeMenu = "<li><a href='javascript:return false;' id='" + divId + "-condense'>Watch Downtime</a></li>";
		}

		if (playerMode.modeMenu) {
			modeMenu = "<li><a href='javascript:return false;' id='" + divId + "-mode'>In Play Mode</a>\
						<ul class='navigation-2' id='" + divId + "-mode-list'>\
							<li><a href='javascript:return false;' class='selected' id='" + divId + "-play'>Play Mode</a></li>\
							<li><a href='javascript:return false;' id='" + divId + "-sync'>Sync Mode</a></li>\
							<li><a href='javascript:return false;' id='" + divId + "-edit'>Edit Mode</a></li>\
						</ul>\
					</li>";
		}
		
		if (playerMode.playlistMenu) {
			playlistMenu = "<li><a href='javascript:return false;' id='" + divId + "-playlistMenu'>Show StatReels</a></li>";
		}

		if (playerMode.searchArea) {
			searchArea = "\
				<td class='searchArea'>\
			        " + SearchBox.getSearchHtml(divId + '-search') + "\
			    	<div id='" + divId + "-events' class='events'></div>\
			    </td>\
			    <td><div id='" + divId + "-syncData' class='syncData'></div></td>\
			    <td><div id='" + divId + "-playlist' class='playlists' style='display:none'>\
			    	<div id='" + divId + "-playlistListContent' class='allPlaylists'>\
				    	<h1>StatReels</h1>\
				    	" + SearchBox.getSearchHtml(divId + '-playlistListSearch') + "\
				        <div id='" + divId + "-playlistList' class='playlistList'><ul>\
				        </ul></div>\
				        <div class='playlistBottomBar'>\
				        	<input id='" + divId + "-playlistCreateNew' type='submit' value='Create a new StatReel'/>\
				        </div>\
				    </div>\
			    	<div id='" + divId + "-playlistSingle' class='singlePlaylist'>\
				    	<h1>StatReel</h1>\
				    	" + SearchBox.getSearchHtml(divId + '-playlistSearch') + "\
				        <div id='" + divId + "-playlistContent' class='playlistList events'><ul>\
				        	<li><a href='javascript:return false;'>Test</a><div class='clear'></div></li>\
				        </ul></div>\
				        <div class='playlistBottomBar'>\
				        	<div id='" + divId + "-playlistSave'>\
					        	<input id='" + divId + "-playlistSaveChanges' type='submit' value='Save Changes' class='hoverGreen'/>\
					        	<input id='" + divId + "-playlistCancel' type='submit' value='Cancel' class='hoverRed'/>\
					        </div>\
				        	<div id='" + divId + "-playlistSaving' style='display:none'>\
					        	Saving the StatReel...\
					        </div>\
				        </div>\
				    </div>\
				    <div id='" + divId + "-playlistNewDialog' title='Create New StatReel' style='display:none'>\
				    	<p>Give the new StatReel a title:</p>\
				    	<input type='text' id='" + divId + "-playlistNewName'/>\
					</div>\
			    </div></td>";
		}

		var gameStateClass = "";
		if (drawGameState) {
			gameStateClass = "class='gameState'";
		}

		var key = "";
		if (os == "mac") {
			key = "Alt";
		} else {
			key = "Ctrl";
		}

		var innerHtml = "<table class='statPlayer' cellspacing='0'>\
        	<tr>\
        		<td colspan='4'>\
        			<div class='navigation'>\
        			<ul class='navigation-1'>" + downtimeMenu + "<li><a href='javascript:return false;'>Telestrator</a>\
	        				<ul class='navigation-2'>\
	        					<li><a href='#' id='" + divId + "-setColorBlack'>Black</a></li>\
	        					<li><a href='#' id='" + divId + "-setColorBlue'>Blue</a></li>\
	        					<li><a href='#' id='" + divId + "-setColorRed'>Red</a></li>\
	        					<li><a href='#' id='" + divId + "-setColorGreen'>Green</a></li>\
	        					<li><a href='#' id='" + divId + "-setArrow'>Line</a></li>\
	        					<li><a href='#' id='" + divId + "-setFreehand'>Freehand</a></li>\
	        					<li><a href='#' id='" + divId + "-setX'>X</a></li>\
	        					<li><a href='#' id='" + divId + "-setO'>O</a></li>\
	        					<li><a href='#' id='" + divId + "-select'>Select</a></li>\
	        					<li><a href='#' id='" + divId + "-delete'>Delete</a></li>\
	        					<li><a href='#' id='" + divId + "-undo'>Undo</a></li>\
	        					<li><a href='#' id='" + divId + "-redo'>Redo</a></li>\
	        					<li><a href='#' id='" + divId + "-clear'>Clear</a></li>\
	        				</ul>\
	        			</li>" + videoHtml + modeMenu + playlistMenu + "</ul>\
        			</div>\
        		</td>\
        	</tr>\
            <tr>\
                <td class='videoContainerTD'>\
	                <div id='" + divId + "-videoContainer' class='videoContainer'>\
	                	<canvas id='" + divId + "-telestrator' class='telestrator'></canvas>\
				        <div id='" + divId + "-videoElementWrapper'><video id='" + divId + "-video' autobuffer='autobuffer' preload='auto'>\
				            Your browser does not support the <code>video</code> element.  <a href='http://www.mozilla.com/en-US/firefox/upgrade.html'>Go get a new one that does!</a>  Seriously!  You won't be disappointed!\
				        </video></div>\
				        <div id='" +divId + "-controls' class='controls'>\
			        		<canvas id='" + divId + "-skipBack' height='" + controlHeight + "px' width='" + controlWidth + "px' class='betterToolTip' alt='<b>Click:</b> Back 5 seconds<br /><b>Hold:</b> Rewind<br /><b>Keyboard Shortcut:</b> " + key + " + Left Arrow (Press or hold)'></canvas>\
			        		<canvas id='" + divId + "-slomoBack' height='" + controlHeight + "px' width='" + controlWidth + "px' class='betterToolTip' alt='<b>Click:</b> Back 1 frame<br /><b>Hold:</b> Slomo Backward<br /><b>Keyboard Shortcut:</b> " + key + " + Shift + Left Arrow (Press or hold)'></canvas>\
				        	<canvas id='" + divId + "-playPause' height='" + controlHeight + "px' width='" + controlWidth + "px' class='betterToolTip' alt='<b>Click:</b> Toggle Play/Pause<br /><b>Keyboard Shortcut:</b> Tab'></canvas>\
				        	<canvas id='" + divId + "-slomoFwd' height='" + controlHeight + "px' width='" + controlWidth + "px' class='betterToolTip' alt='<b>Click:</b> Forward 1 frame<br /><b>Hold:</b> Slomo Forward<br /><b>Keyboard Shortcut:</b> " + key + " + Shift + Right Arrow (Press or hold)'></canvas>\
				        	<canvas id='" + divId + "-skipFwd' height='" + controlHeight + "px' width='" + controlWidth + "px' class='betterToolTip' alt='<b>Click:</b> Forward 5 seconds<br /><b>Hold:</b> Fast-Forward<br /><b>Keyboard Shortcut:</b> " + key + " + Right Arrow (Press or hold)'></canvas>\
				        	<canvas id='" + divId + "-progress'></canvas>\
				        	<canvas id='" + divId + "-volume' height='" + controlHeight + "px' width='" + controlWidth + "px'></canvas>\
				        	<canvas id='" + divId + "-fullScreen' height='" + controlHeight + "px' width='" + controlWidth + "px'></canvas>\
				        	<canvas id='" + divId + "-fullScreenStats' height='" + controlHeight + "px' width='" + controlWidth + "px'></canvas>\
				        </div>\
				    </div>\
                </td>" + searchArea + "\
            </tr>\
            <tr>\
            	<td colspan='2'>\
			    	<div id='" + divId + "-gameState' " + gameStateClass + "></div>\
			    </td><td></td>\
            </tr>\
        </table>\
        <div id='" + divId + "-tooltip' class='tooltip gameState'></div>";
        divObj.html(innerHtml);
	}

	function waitForVideoSize() {
		resizeCanvasElements();
		resizeOtherDivs();
		draw();
	}

	function initObjects() {
		playPause = $("#" + divId + "-playPause").get(0);
		progress = $("#" + divId + "-progress").get(0);
		skipBack = $("#" + divId + "-skipBack").get(0);
		skipFwd = $("#" + divId + "-skipFwd").get(0);
		slomoBack = $("#" + divId + "-slomoBack").get(0);
		slomoFwd = $("#" + divId + "-slomoFwd").get(0);
		volume = $("#" + divId + "-volume").get(0);
		fullScreen = $("#" + divId + "-fullScreen").get(0);
		fullScreenStats = $("#" + divId + "-fullScreenStats").get(0);
	}

	function resizeCanvasElements() {
		var video = $("#" + divId + "-video");
		progressWidth = video.width() - (controlWidth * 8) + 8;
		//                                 7 controls        //We lose some pixels per canvas element

		progress.setAttribute('width', progressWidth + "px");
		progress.setAttribute('height', controlHeight + "px");

		telestrator = new StatEasyCanvas("#" + divId + "-telestrator", video.width(), video.height());

		$("#" + divId + "-events").height(video.height() - 12);

		clearProgress();
	}

	function resizeOtherDivs() {
		var video = $("#" + divId + "-video");
		var syncData = $("#" + divId + "-syncData");
		syncData.height((video.height() + 28) + "px");

		var playlist = $("#" + divId + "-playlist .playlistList");
		playlist.height((video.height() - 72) + "px");
	}

	/***************************************************************************
	 *                         Control Functions
	 **************************************************************************/
	function draw() {
		if (videoManager.isPaused()) {
			drawPlay();
		} else {
			drawPause();
		}
		drawProgress(undefined, 0, 0);
		drawSkipBack();
		drawSkipFwd();
		drawSlomoBack();
		drawSlomoFwd();
		if (videoManager.isMuted()) {
			drawMuted();
		} else {
			drawVolume();
		}
		drawFullScreen();
		drawFullScreenStats();
	}

	function clearContext(ctx, width) {
		ctx.save();

		var mainGrad = ctx.createLinearGradient(0, 0, 0, controlHeight);
		mainGrad.addColorStop(0, "#636363");
		mainGrad.addColorStop(1, "#020202");

		ctx.fillStyle = mainGrad;
		ctx.fillRect(0.5, 0.5, width-1, controlHeight - 1);
		ctx.strokeStyle = "rgb(0, 0, 0)";
		ctx.strokeRect(0.5, 0.5, width-1, controlHeight - 1);

		ctx.restore();
	}

	function drawPlay() {
		var ctx = playPause.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(9, 8);
		ctx.lineTo(22, 14);
		ctx.lineTo(9, 20);
		ctx.closePath();
		ctx.fill();
	}

	function drawPause() {
		var ctx = playPause.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.fillRect(8, 8, 5, 14);
		ctx.fillRect(17, 8, 5, 14);
	}

	function clearProgress() {
		var ctx = progress.getContext("2d");
		ctx.save();

		clearContext(ctx, progressWidth);

		var progressGrad = ctx.createLinearGradient(0, 0, 0, 10);
		progressGrad.addColorStop(0, "#000000");
		progressGrad.addColorStop(1, "#636363");

		ctx.fillStyle = progressGrad;
		ctx.fillRect(10.5, 10.5, progressWidth - 20, 10);
		ctx.strokeRect(10.5, 10.5, progressWidth - 20, 10);

		ctx.restore();
	}

	function drawProgress(percent, bufferStart, bufferEnd) {
		var ctx = progress.getContext("2d");

		clearProgress();

		if (percent != undefined) {
			var width = 5;

			var bufferRectLeft = (progressWidth-20) * bufferStart;
			var bufferRectRight = (progressWidth-20) * bufferEnd;
			ctx.fillStyle = "#978433";
			ctx.fillRect(bufferRectLeft + 10.5, 11.5, bufferRectRight - bufferRectLeft, 9);

			var centerPoint = (progressWidth - 20) * percent;
			ctx.fillStyle = "#bbbbbb";
			ctx.fillRect(10.5 + centerPoint - width/2, 10, width, 11);
		}
	}

	function drawSkipBack() {
		var ctx = skipBack.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(25, 10);
		ctx.lineTo(15, 15);
		ctx.lineTo(25, 20);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(15, 10);
		ctx.lineTo(5, 15);
		ctx.lineTo(15, 20);
		ctx.closePath();
		ctx.fill();
	}

	function drawSlomoBack() {
		var ctx = slomoBack.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(22, 10);
		ctx.lineTo(12, 15);
		ctx.lineTo(22, 20);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(18, 10);
		ctx.lineTo(8, 15);
		ctx.lineTo(18, 20);
		ctx.stroke();
	}

	function drawSkipFwd() {
		var ctx = skipFwd.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(5, 10);
		ctx.lineTo(15, 15);
		ctx.lineTo(5, 20);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(15, 10);
		ctx.lineTo(25, 15);
		ctx.lineTo(15, 20);
		ctx.closePath();
		ctx.fill();
	}

	function drawSlomoFwd() {
		var ctx = slomoFwd.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(8, 10);
		ctx.lineTo(18, 15);
		ctx.lineTo(8, 20);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = "#bbbbbb";
		ctx.beginPath();
		ctx.moveTo(12, 10);
		ctx.lineTo(22, 15);
		ctx.lineTo(12, 20);
		ctx.stroke();
	}

	function drawVolume() {
		var ctx = volume.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.fillRect(5, 13, 4, 4);

		ctx.beginPath();
		ctx.moveTo(9, 13);
		ctx.lineTo(16, 8);
		ctx.lineTo(16, 22);
		ctx.lineTo(9, 17);
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = "#bbbbbb";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(16, 15, 4.5, Math.PI / 4, Math.PI * 1.75, true);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(16, 15, 9, Math.PI / 4, Math.PI * 1.75, true);
		ctx.stroke();
	}

	function drawFullScreen() {
		var ctx = fullScreen.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";

		ctx.beginPath();
		ctx.moveTo(5, 5);
		ctx.lineTo(12, 5);
		ctx.lineTo(5, 12);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(25, 5);
		ctx.lineTo(18, 5);
		ctx.lineTo(25, 12);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(25, 25);
		ctx.lineTo(18, 25);
		ctx.lineTo(25, 18);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(5, 25);
		ctx.lineTo(12, 25);
		ctx.lineTo(5, 18);
		ctx.closePath();
		ctx.fill();
	}

	function drawFullScreenStats() {
		var ctx = fullScreenStats.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";

		ctx.beginPath();
		ctx.moveTo(5, 5);
		ctx.lineTo(12, 5);
		ctx.lineTo(5, 12);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(5, 25);
		ctx.lineTo(12, 25);
		ctx.lineTo(5, 18);
		ctx.closePath();
		ctx.fill();

		ctx.rect(18, 5, 8, 3);
		ctx.rect(18, 11, 8, 3);
		ctx.rect(18, 17, 8, 3);
		ctx.rect(18, 23, 8, 3);
		ctx.fill();
	}

	function drawMuted() {
		var ctx = volume.getContext("2d");

		clearContext(ctx, controlWidth);

		ctx.fillStyle = "#bbbbbb";
		ctx.fillRect(5, 13, 4, 4);

		ctx.beginPath();
		ctx.moveTo(9, 13);
		ctx.lineTo(16, 8);
		ctx.lineTo(16, 22);
		ctx.lineTo(9, 17);
		ctx.closePath();
		ctx.fill();

		ctx.strokeStyle = "#bbbbbb";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(20, 12.5);
		ctx.lineTo(25, 17.5);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(20, 17.5);
		ctx.lineTo(25, 12.5);
		ctx.stroke();
	}

	/***************************************************************************
	 *                          Event Handlers
	 **************************************************************************/
	function initEventHandlers() {
		betterToolTipController = new betterToolTip();

		$(playPause).click(toggle);
		$(playPause).mousedown(betterToolTipController.clearHelp());
		$(skipBack).mousedown(skipBackward);
		$(skipBack).mouseup(stopRewinding);
		$(skipFwd).mousedown(skipForward);
		$(skipFwd).mouseup(stopFastForwarding);
		$(slomoFwd).mousedown(frameForward);
		$(slomoFwd).mouseup(stopSlomoForward);
		$(slomoBack).mousedown(frameBackward);
		$(slomoBack).mouseup(stopSlomoBackward);
		$(volume).click(toggleMuted);
		$(fullScreen).click(requestFullScreen);
		$(fullScreenStats).click(requestFullScreenWithStats);
		$(document).keydown(handleKeyDown);
		$(document).keyup(handleKeyUp);

		$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
			resizeCanvasElements();
		});

		$(progress).click(progressClicked).mousemove(progressHover).mouseout(progressMouseout);

		$("#" + divId + "-condense").click(condenseChanged);
		$("#" + divId + "-setColorBlue").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setColor("#0000FF");
		});
		$("#" + divId + "-setColorRed").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setColor("#FF0000");
		});
		$("#" + divId + "-setColorGreen").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setColor("#00FF00");
		});
		$("#" + divId + "-setColorBlack").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setColor("#000000");
		});
		$("#" + divId + "-select").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(4);
		});
		$("#" + divId + "-setArrow").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(1);
		});
		$("#" + divId + "-setFreehand").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(0);
		});
		$("#" + divId + "-setO").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(3);
		});
		$("#" + divId + "-setX").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(2);
		});
		$("#" + divId + "-undo").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.undoLastDrawing();
		});
		$("#" + divId + "-redo").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.redoLastDrawing();
		});
		$("#" + divId + "-delete").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.setTool(5);
		});
		$("#" + divId + "-clear").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();

			telestrator.clearDrawings();
			StatEasyCanvas.clearAll();
		});
		$("#" + divId + "-saveToFile").click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			eventViewer.resetFocus();
			//find individual videoFrame
			telestrator.saveToFile(videoFrame);
		});
		$("#" + divId + "-sync").click(enterSyncMode);
		$("#" + divId + "-play").click(enterPlayMode);
		$("#" + divId + "-edit").click(enterEditMode);
		$("#" + divId + "-playlistMenu").click(toggleShowPlaylists);

		initPlaylistHandlers();
	}

	function appropriateTarget(originalTarget) {
		var target = originalTarget;
		if ((target == null) || (target == undefined)) {
			return;
		}

		while ((target.id != divId + "-playlistContent") && 
				(target.tagName != "LI")) {
			target = target.parentNode;
		}

		if (target.parentNode.parentNode.getAttribute("class").indexOf("gameSeparator") != -1) {
			// Then we're dragging over a gameSeparator, so target its stat
			target = target.parentNode.parentNode.nextSibling;
		}

		return target;
	}

	function initPlaylistHandlers() {
		var whereIsTheDrag = undefined; // Necessary because of extraneous leave events
		$("#" + divId + "-playlistSingle").bind('dragenter', function(ev) {
			var target = appropriateTarget(ev.originalEvent.target);
			whereIsTheDrag = ev.originalEvent.target;
            $(target).addClass('dragover');
            return false;
        })
        .bind('dragleave', function(ev) {
			var target = appropriateTarget(ev.originalEvent.target);
			if (appropriateTarget(whereIsTheDrag) != target) {
				$(target).removeClass('dragover');
			}
            return false;
        })
        .bind('dragend', function (ev) {
        	$("#" + divId + "-playlistContent").removeClass("dragover");
        	$("#" + divId + "-playlistContent li").removeClass("dragover");
        	return false;
        })
        .bind('dragover', function(ev) {
            return false;
        })
        .bind('drop', function(ev) {
            var dt = ev.originalEvent.dataTransfer;
            var dropTarget = appropriateTarget(ev.originalEvent.target);
            if (dropTarget == undefined) {
            	return;
            }
            
            $(dropTarget).removeClass('dragover');
            
            if ("statPlayer-playlistContent" == dt.getData("stateasy/source")) {
            	// We are moving an existing playlistEntry
            	currentPlaylist.moveEntry(dt.getData("stateasy/entryId"), dropTarget);
            	return false;
            }
            
            var statId = dt.getData("stateasy/statId");
            var stat = getEventById(statId);
            var gameVideo = undefined;
            if (videoManager.getCurrentVideo().coversStatId(statId)) {
            	gameVideo = videoManager.getCurrentVideo();
            } else if (stat.getPlayableGameVideo() != undefined) {
            	gameVideo = stat.getPlayableGameVideo();
            } else {
            	errorMessage("There is no video to add to the StatReel for that statistic.<br/>Have you synced video for it?");
            	return true;
            }
            var seekTime = gameVideo.getSeekTimeFor(stat);
            var time = gameVideo.getTimeFor(stat);
            var endTime = gameVideo.getEndTimeFor(stat);
            
            currentPlaylist.insertEntry(new PlaylistEntry({
            	targetStat : statId,
            	stat : stat,
            	targetVideo : gameVideo.getId(),
            	startTime : seekTime,
            	time : time,
            	endTime : endTime,
            }, dataManager), dropTarget);
            
            return false;
        });

		$("#" + divId + "-playlistCreateNew").click(createNewPlaylist);
		$("#" + divId + "-playlistSaveChanges").click(savePlaylist);
		$("#" + divId + "-playlistCancel").click(cancelNewPlaylist);
		$("#" + divId + "-playlistList ul li").live("click", selectPlaylist);

	}

	function selectPlaylist(jsEvent) {
		jsEvent.preventDefault();
		jsEvent.stopPropagation();
		var oTarget = $(this);
		var htmlId = oTarget.attr('id');
		var lastDash = htmlId.lastIndexOf("-");
		if (lastDash < 0) {
			return;
		}
		var playlistId = Number(htmlId.substr(lastDash + 1));

		var playlist = undefined;
		for (var i in dataManager.allPlaylists) {
			if (dataManager.allPlaylists[i].id == playlistId) {
				playlist = dataManager.allPlaylists[i];
			}
		}

		if (playlist == undefined) {
			return;
		}
		$("#" + divId + "-playlistSingle h1").html("StatReel: " + playlist.name);
		$("#" + divId + "-playlistContent").html("Loading...");

		$("#" + divId + "-playlistListContent").hide();
		$("#" + divId + "-playlistSingle").show();

		dataManager.getPlaylistInfo(playlist.id, function (playlistInfo) {
			currentPlaylist = new Playlist({
				divId : divId + "-playlistContent",
				dataManager : dataManager,
				creationInfo : playlistInfo,
				searchDivId : divId + "-playlistSearch"
			});
		});
	}

	function processPlaylistListing(allPlaylists) {
		$("#" + divId + "-playlistList").html("<ul></ul>");
		var $list = $("#" + divId + "-playlistList ul");

		for (var i in allPlaylists) {
			var playlist = allPlaylists[i];
			$list.append("<li id='" + divId + "-playlist-" + playlist.id + "'>" + playlist.name + "</li>");
		}
	}

	function savePlaylist() {
		$("#" + divId + "-playlistSave").hide();
		$("#" + divId + "-playlistSaving").show();
		currentPlaylist.save(function (data) {
			$("#" + divId + "-playlistSave").show();
			$("#" + divId + "-playlistSaving").hide();

			processPlaylistListing(data.allPlaylists);

			$("#" + divId + "-playlistSingle").hide();
			$("#" + divId + "-playlistListContent").show();

			currentPlaylist.unbindAll();
		});
	}

	function cancelNewPlaylist() {
		$("#" + divId + "-playlistSingle").hide();
		$("#" + divId + "-playlistListContent").show();

		currentPlaylist.unbindAll();
	}

	function createNewPlaylistCallback(thisDialog) {
		$(thisDialog).dialog("close");

		var $input = $("#" + divId + "-playlistNewDialog input");
		var newName = $input.val();
		$input.val("");
		$("#" + divId + "-playlistSingle h1").html("StatReel: " + newName);
		$("#" + divId + "-playlistContent").html("");

		currentPlaylist = new Playlist({
			divId : divId + "-playlistContent",
			dataManager : dataManager,
			creationInfo : newName,
			searchDivId : divId + "-playlistSearch",
		});

		$("#" + divId + "-playlistListContent").hide();
		$("#" + divId + "-playlistSingle").show();
	}

	var currentPlaylist = undefined;
	function createNewPlaylist() {
		if (createNewPlaylist.dialogObject == undefined) {
			createNewPlaylist.dialogObject = $("#" + divId + "-playlistNewDialog").dialog({
				modal: true,
			    height: '300',
			    width: '400',				
				buttons: {
					"Create my StatReel" : function () {
						createNewPlaylistCallback(this);
					},
					"Cancel" : function () {
						$(this).dialog("close");
					}
				},
			});

			$("#" + divId + "-playlistNewName").keyup(function(e) {
				if(e.keyCode == 13) {
					createNewPlaylistCallback(createNewPlaylist.dialogObject);
				}
			});
		}

		createNewPlaylist.dialogObject.dialog("open");
		$("#" + divId + "-playlistNewName").focus();
	}

	function toggle() {
		eventViewer.resetFocus();
		if (videoManager.isPaused()) {
			play();
		} else {
			pause();
		}
	}

	function toggleMuted() {
		eventViewer.resetFocus();
		videoManager.toggleMuted();
		if (videoManager.isMuted()) {
			drawMuted();
		} else {
			drawVolume();
		}
	}
	
	function setCurrentTime(sometime){
		videoManager.setCurrentTime(sometime);
	}
	
	function seekRelative(numSeconds) {
		videoManager.setCurrentTime(videoManager.getCurrentTime() + numSeconds);
	}

	var skipBackLength = 5;
	var rewindLength = 1;
	var skipForwardLength = 5;
	var fastForwardLength = 1.5;
	var frameLength = 1 / 16;

	function skipBackward() {
		betterToolTipController.clearHelp();
		eventViewer.resetFocus();
		videoManager.setCurrentTime(videoManager.getCurrentTime() - skipBackLength);
		wasPlaying = false;
		if (!videoManager.isPaused()) {
			wasPlaying = true;
		}
		skipBackDelay = setTimeout(function() {
			pause();
			rewindInterval = setInterval(function() {
				videoManager.setCurrentTime(videoManager.getCurrentTime() - rewindLength);
			}, 200);
		}, 1000);

		return false;
	}

	function skipForward() {
		betterToolTipController.clearHelp();
		eventViewer.resetFocus();
		videoManager.setCurrentTime(videoManager.getCurrentTime() + skipForwardLength);
		wasPlaying = false;
		if (!videoManager.isPaused()) {
			wasPlaying = true;
		}
		skipForwardDelay = setTimeout(function() {
			videoManager.setPlaybackRate(3.0);
			play();
		}, 1000);

		return false;
	}

	function frameForward() {
		betterToolTipController.clearHelp();
		eventViewer.resetFocus();
		pause();
		videoManager.setCurrentTime(videoManager.getCurrentTime() + frameLength);
		slomoForwardDelay = setTimeout(function() {
			videoManager.setPlaybackRate(0.25);
			play();
		}, 1000);

		return false;
	}

	function frameBackward() {
		betterToolTipController.clearHelp();
		eventViewer.resetFocus();
		pause();
		videoManager.setCurrentTime(videoManager.getCurrentTime() - frameLength);
		slomoBackwardDelay = setTimeout(function() {
			slomoBackwardInterval = setInterval(function() {
				videoManager.setCurrentTime(videoManager.getCurrentTime() - frameLength);
			}, 150);
		}, 1000);

		return false;
	}

	function stopRewinding() {
		if (wasPlaying) {
			play();
		}
		clearTimeout(skipBackDelay);
		clearInterval(rewindInterval);
	}

	function stopFastForwarding() {
		if (!wasPlaying) {
			pause();
		}
		clearTimeout(skipForwardDelay);
		videoManager.setPlaybackRate(1.0);
	}

	function stopSlomoForward() {
		pause();
		clearTimeout(slomoForwardDelay);
		videoManager.setPlaybackRate(1.0);
	}

	function stopSlomoBackward() {
		clearTimeout(slomoBackwardDelay);
		clearInterval(slomoBackwardInterval);
	}

	function requestFullScreen() {
		eventViewer.resetFocus();
		videoManager.requestFullScreen(false);
	}

	function requestFullScreenWithStats() {
		eventViewer.resetFocus();
		videoManager.requestFullScreen(true);
	}

	function persistTime() {
		var videoTimes = JSON.parse($.cookie("videoTimes"));
		if (videoTimes == null || videoTimes == undefined) {
			videoTimes = {};
		}

		videoTimes[videoManager.getCurrentVideo().getId()] = videoManager.getCurrentTime();

		$.cookie("videoTimes", JSON.stringify(videoTimes));
	}

	function progressClicked(event) {
		eventViewer.resetFocus();
		var offset = $(progress).offset();
		var clickX = event.pageX - offset.left - 10; 
		var clickY = event.pageY - offset.top;

		if ((0 <= clickX) && (clickX <= (progressWidth - 20))) {
			var percent = clickX / (progressWidth - 20);

			videoManager.progressClicked(percent);
		}
	}

	// WTB Refactoring.  This is getting to be a wall of text
	function progressHover(event) {
		var offset = $(progress).offset();
		var relativeX = event.pageX - offset.left - 10; 
		var relativeY = event.pageY - offset.top;

		if ((0 <= relativeX) && (relativeX <= (progressWidth - 20))) {
			var percent = relativeX / (progressWidth - 20);
			var container = $("#" + divId + "-tooltip");

			var progressInfo = videoManager.progressHover(percent);

			var relevantGame = progressInfo.relevantGame;
			var gameState = progressInfo.gameState;
			var time = progressInfo.time;

			container.html(getStateTable(relevantGame, gameState, time));

			var tooltip = $("#" + divId + "-tooltip table");
			tooltip.css("display", "block");
			// For the top, I want to position the tooltip to the top of the progress bar.
			// It just so happens that the progress bar's position is offset by its parent.
			// So I add the offset in and then shift the tooltip up by its height
			tooltip.css("top", $(progress).position().top + $(progress).offsetParent().position().top - tooltip.height() - 10);
			// The positioning of the left side is similar to the top in that its
			// left side is positioned relative to the parent's position, so I account for it.
			// Then I shift the tooltip to the left by one half of its width so that it is centered
			// above the mouse.  Then we shift it along the progress bar by the amount we calculated above
			tooltip.css("left", $(progress).position().left + $(progress).offsetParent().position().left - tooltip.width()/2 + relativeX);
		} else {
			var tooltip = $("#" + divId + "-tooltip table");
			tooltip.css("display", "none");
		}
	}

	function progressMouseout() {
		var tooltip = $("#" + divId + "-tooltip table");
		tooltip.css("display", "none");
	}

	function condenseChanged(e) {
		condenseChecked = !condenseChecked;

		var condense = "Skip Downtime";
		if (condenseChecked) {
			condense = "Watch Downtime";
		}
		$("#" + divId + "-condense").html(condense);

		e.preventDefault();
	}

	function isCondenseChecked() {
		return condenseChecked;
	}

	function videoPathName(someVideo) {
		return basePath + "videos/" + someVideo.getFileName();
	}

	function updateVideoSelection(currentVideo) {
		// Update the menu
		$("#" + divId + "-videos li a").removeClass("selected");
		$("#" + divId + "-videos .vid" + currentVideo.getId()).addClass("selected");
	}

	function videoClicked(videoIndex) {
		eventViewer.resetFocus();

		videoManager.playVideo(videoIndex);
	}

	function play() {
		videoManager.play();
		drawPause();
	}

	function pause() {
		videoManager.pause();
		drawPlay();
	}

	function handleKeyDown(evt) {
		var osFnKeyPressed = checkFnKey(evt);

		if (evt.which == 9) {  // TAB pressed
			evt.preventDefault();
			evt.stopPropagation();

			toggle();
		} else if (osFnKeyPressed) {
			if (videoControlKeyDown == null) {
				if (osFnKeyPressed && evt.shiftKey) {
					if (osFnKeyPressed && evt.shiftKey && evt.which == 37) {
						// Alt+Shift+LeftArrow
						videoControlKeyDown = 1;
						frameBackward();
					} else if (osFnKeyPressed && evt.shiftKey && evt.which == 39) {
						// Alt+Shift+RightArrow
						videoControlKeyDown = 2;
						frameForward();
					}
				} else {
					if (osFnKeyPressed && evt.which == 37) {
						// Alt+LeftArrow
						videoControlKeyDown = 3;
						skipBackward();
					} else if (osFnKeyPressed && evt.which == 39) {
						// Alt+RightArrow
						videoControlKeyDown = 4;
						skipForward();
					}
				}
			}
		}
	}

	function handleKeyUp(evt) {
		var osFnKeyPressed = checkFnKey(evt);

		switch(videoControlKeyDown) {
		case 1:
			if (evt.which == 37) {
				stopSlomoBackward();
				videoControlKeyDown = null;
			}
			break;
		case 2:
			if (evt.which == 39) {
				// Alt+Shift+RightArrow
				stopSlomoForward();
				videoControlKeyDown = null;
			}
			break;
		case 3:
			if (evt.which == 37) {
				// Alt+LeftArrow
				stopRewinding();
				videoControlKeyDown = null;
			}
			break;
		case 4:
			if (evt.which == 39) {
				// Alt+RightArrow
				stopFastForwarding();
				videoControlKeyDown = null;
			}
			break;
		}
	}

	/**
	 * Determine if the designated video control function key is
	 * being pressed on Mac(alt) or Windows(ctrl)
	 * @param evt key down event
	 * @returns boolean is key being pressed
	 */
	function checkFnKey(evt) {
		if (os == "mac") {
			return evt.altKey;
		} else {
			return evt.ctrlKey;
		}
	}

	/***************************************************************************
	 *                          Mode Selection
	 **************************************************************************/
	function updateModeMenu() {
		var title = "";
		var menuClass = "";

		if (mode == SYNC_MODE) {
			title = "In Sync Mode";
			menuClass = "-sync";
		} else if (mode == EDIT_MODE) {
			title = "In Edit Mode";
			menuClass = "-edit";
		} else {
			title = "In Play Mode";
			menuClass = "-play";
		}

		$("#" + divId + "-mode").html(title);
		$("#" + divId + "-mode-list a").removeClass();
		$("#" + divId + menuClass).addClass("selected");
	}

	function inEditMode() {
		return mode == EDIT_MODE;
	}

	function toggleShowPlaylists(jsEvent) {
		jsEvent.stopPropagation();
		jsEvent.preventDefault();

		toggleShowPlaylists.shown = !toggleShowPlaylists.shown;

		if (toggleShowPlaylists.shown) {
			$("#" + divId + "-playlistMenu").html("Showing...");

			dataManager.getPlaylistListing(function (data) {
				processPlaylistListing(data.allPlaylists);	
				$("#" + divId + "-playlistMenu").html("Hide StatReels");
				$("#" + divId + "-playlist").show(500);
			});
		} else {
			$("#" + divId + "-playlistMenu").html("Show StatReels");
			$("#" + divId + "-playlist").hide(500);
		}
	}

	function enterSyncMode(e) {

		if (mode != SYNC_MODE) {
			var syncPoints = videoManager.getCurrentVideo().getSyncPoints();
			mode = SYNC_MODE;

			if (syncPoints.length == 0) {
				$("#" + divId + "-syncData").width(180);
			}

			$("#" + divId + "-syncData").show(1000);

			eventViewer.setAllowAutoScrolling(false);
			eventViewer.setMode(syncMode);
			updateModeMenu();
		} else {
			enterPlayMode();
		}

		e.preventDefault();
	}

	function exitSyncMode() {
		$("#" + divId + "-syncData").hide(1000);
	}

	function enterPlayMode(e) {
		if (mode == SYNC_MODE) {
			exitSyncMode();
		}
		$("#" + divId + "-events .statEntry").removeClass("seekable unseekable");
		for (index in dataManager.allStats) {
			var stat = dataManager.allStats[index];
			if (stat.getPlayable()) {
				$(".stat" + stat.getId()).addClass("seekable");
			} else {
				$(".stat" + stat.getId()).addClass("unseekable");
			}
		}

		if (mode != PLAY_MODE) {
			mode = PLAY_MODE;
			eventViewer.setAllowAutoScrolling(true);
			eventViewer.setMode(videoManager.playEvent);
			updateModeMenu();
		}

		if (e != null) {
			e.preventDefault();
		}
	}

	function enterEditMode(e) {
		if (mode == SYNC_MODE) {
			exitSyncMode();
		}

		if (mode != EDIT_MODE) {
			mode = EDIT_MODE;
			eventViewer.setAllowAutoScrolling(true);
			eventViewer.setMode(eventViewer.editMode);
			updateModeMenu();
		}

		e.preventDefault();
	}

	function syncMode(event, eventObj) {
		handleNewSyncPoint({
			id: event.getId(),
			time: videoManager.getCurrentTime()
		});
	}

	/***************************************************************************
	 *                             Syncing
	 **************************************************************************/
	function handleNewSyncPoint(newSync) {
		if (handleNewSyncPoint.alert == undefined) {
			handleNewSyncPoint.alert = $('<div></div>')
				.html("Generic alert message")
				.dialog({
					autoOpen: false,
					title: 'Error with this Sync Point',
					modal: true,
				});
		}

		var syncPoints = videoManager.getCurrentVideo().getSyncPoints();

		// We keep the sync points sorted so we can determine if it is an error
		// to add this sync point
		var newIndex = 0;
		while ((newIndex < syncPoints.length) && (syncPoints[newIndex].time < newSync.time)) {
			newIndex++;
		}

		// Perform validation on the sync point.  All sync points must progress
		// linearly in time!
		// In each case, present the user with ways of fixing this and flash 
		// the offending sync points.
		var newSyncedEvent = getEventById(newSync.id);
		if ((newIndex - 1) >= 0) {
			var previousSyncedEvent = getEventById(syncPoints[newIndex-1].id);
			if (!(previousSyncedEvent.getTime() <= newSyncedEvent.getTime())) { 
				handleNewSyncPoint.alert.html("The sync point you just entered will overlap with the sync point for " + previousSyncedEvent.getName() + " (too late).  You cannot reorder stats using the sync points.");
				handleNewSyncPoint.alert.dialog("open");
				return;
			}
		}
		if (newIndex < syncPoints.length) {
			var nextSyncedEvent = getEventById(syncPoints[newIndex].id);
			if (!(newSyncedEvent.getTime() <= nextSyncedEvent.getTime())) {
				handleNewSyncPoint.alert.html("The sync point you just entered will overlap with the sync point for " + nextSyncedEvent.getName() + " (too early).  You cannot reorder stats using the sync points.");
				handleNewSyncPoint.alert.dialog("open");
				return;
			}
		}

		// Massage the sync point to have the appropriate properties
		newSync.delta = newSync.time - newSyncedEvent.getTime();
		newSync.gameId = newSyncedEvent.getGameId();
		newSync.startingStatIndex = newSyncedEvent.getStatIndex();

		// Add it
		var currentVideo = videoManager.getCurrentVideo();
		currentVideo.addSyncPoint(newIndex, newSync);

		drawSyncPoints();

		dataManager.setVideoSyncPoints(currentVideo.getId(), currentVideo.getSyncPoints());
	}

	function removeSyncPoint(index) {
		var currentVideo = videoManager.getCurrentVideo();
		
		currentVideo.removeSyncPoint(index);
		drawSyncPoints();
		
		dataManager.setVideoSyncPoints(currentVideo.getId(), currentVideo.getSyncPoints());
	}

	/**
	 * For the given eventId, return the active sync point and the current
	 * video time
	 */
	function getActiveSyncAndVideoTime(eventId) {
		var videoTime = videoManager.getCurrentTime();

		// delta = video.time - stat.time
		var syncPoint = videoManager.getCurrentVideo().getSyncPointForVideoTime(videoTime, eventId);

		return [syncPoint, videoTime];
	}

	function getEventById(id) {
		for (index in dataManager.allStats) {
			if (dataManager.allStats[index].getId() == id) {
				return dataManager.allStats[index];
			}
		}
		return null;
	}

	function drawSyncPoints(currentVideo) {
		if ((playerMode == StatPlayer.MULTIPLE_EVENT_GROUPING_MODE) || (playerMode == StatPlayer.LIVE_VIEW_MODE) || (playerMode == StatPlayer.PLAYLIST_MODE)) {
			return;
		}

		var syncPoints = videoManager.getCurrentVideo().getSyncPoints();
		var innerHtml = "<ul>";
		for (i in syncPoints) {
			innerHtml += "<li class='deletable'>\
					<span>" + getEventById(syncPoints[i].id).getName() + " @ " + toTimeString(syncPoints[i].time, 2) + "</span>\
					<img onclick='allPlayers[\"" + divId + "\"].removeSyncPoint(" + i + ")' src='" + basePath + "images/close.png'/>\
				<div class='clear'/></li>";
		}
		innerHtml += "</ul>";

		$("#" + divId + "-syncData").html(innerHtml);
	}

	/***************************************************************************
	 *                             Stat Logic
	 **************************************************************************/

	function getStateTable(thisGame, gameState, time) {
		var innerHtml = "<table>";

		if (thisGame != undefined) {
			var eventName = "";
			if (thisGame.associatedEvent == undefined) {
				eventName += "TakeStatsNow @ " + thisGame.startTime;
			} else {
				var parentGroupId = thisGame.associatedEvent;
				eventName = "<ul>";
				while (parentGroupId != undefined) {
					var parentGroup = dataManager.groupings[parentGroupId];
					eventName += "<li>" + parentGroup.name + "</li>";
					parentGroupId = parentGroup.parentGroup;
				}
				eventName += "</ul>";
			}
			innerHtml += "<tr><td colspan='2'>" + eventName + "</td></tr>";

			innerHtml += "<tr><td>" + thisGame.ourTeamName + ":</td><td>";
			innerHtml += gameState.ourScore + "</td></tr>";
			innerHtml += "<tr><td>" + thisGame.theirTeamName + ":</td><td>";
			innerHtml += gameState.theirScore + "</td></tr>";
		}

		if (time != undefined) {
			innerHtml += "<tr><td colspan='2' class='time'>" + toTimeString(time, 2) + "</td></tr>";
		}
		innerHtml += "</table>";

		return innerHtml;
	}

	function drawStateTable(currentGame, currentState) {
		var gameState = document.getElementById(divId + "-gameState");

		gameState.innerHTML = getStateTable(currentGame, currentState);
	}

	return exports;
}



StatPlayer.NO_EVENT_GROUPING_MODE = {
	'videoMenu'    : false,
	'downtimeMenu' : false,
	'modeMenu'     : false,
	'playlistMenu' : false,
	'searchArea'   : false,
	'behavior'     : NoEventGroupingMode,
};
StatPlayer.SINGLE_EVENT_GROUPING_MODE = {
	'videoMenu'    : true,
	'downtimeMenu' : true,
	'modeMenu'     : true,
	'playlistMenu' : true,
	'searchArea'   : true,
	'behavior'     : SingleEventGroupingMode,
};
StatPlayer.MULTIPLE_EVENT_GROUPING_MODE = {
	'videoMenu'    : false,
	'downtimeMenu' : false,
	'modeMenu'     : false,
	'playlistMenu' : true,
	'searchArea'   : true,
	'behavior'     : ReportMode,
};
StatPlayer.PLAYLIST_MODE = {
	'videoMenu'    : false,
	'downtimeMenu' : false,
	'modeMenu'     : false,
	'playlistMenu' : true,
	'searchArea'   : true,
	'behavior'     : PlaylistMode,
};
StatPlayer.LIVE_VIEW_MODE = {
	'videoMenu'    : true,
	'downtimeMenu' : false,
	'modeMenu'     : false,
	'playlistMenu' : false,
	'searchArea'   : false,
	'behavior'     : SingleEventGroupingMode,
};
StatPlayer.READ_ONLY_MODE = {
	'videoMenu'    : true,
	'downtimeMenu' : true,
	'modeMenu'     : false,
	'playlistMenu' : false,
	'searchArea'   : true,	
	'behavior'     : SingleEventGroupingMode,
};