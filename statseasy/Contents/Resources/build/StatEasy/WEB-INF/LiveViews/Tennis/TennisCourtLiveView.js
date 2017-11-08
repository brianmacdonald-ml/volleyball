/*
 * Required for all LiveViews
 */
var classname = "TennisCourtLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function TennisCourtLiveView(myTargetDivId, dataManager) {
	this.targetDivId = myTargetDivId;
	
	this.shown = false;
	this.valid = false;
	this.drawn = false;
		
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
		
		var relevantDiv = document.getElementById(this.targetDivId);
		if (!this.drawn) {
			$(relevantDiv).append("<div id='" + this.targetDivId + "-court'></div>");
		}
		
		/*
		 * Populate the DIV with Score Info!
		 */
		var innerHtml = "";
		
		/*
		 * Populate the DIV with rotation info!
		 */
		var height = 360;
		innerHtml += "<table class='court' style='padding:0px' cellspacing='0'>" +
			"<tr><td class='alley' rowspan='2'>&nbsp;</td><td class='backCourt' colspan='2'>&nbsp;</td><td class='alley' rowspan='2'>&nbsp;</td></tr>" + 
			"<tr><td class='serviceCourt'>&nbsp;</td><td class='serviceCourt'>&nbsp;</td></tr>" + 
			"<tr><td class='alley' rowspan='2'>&nbsp;</td><td class='serviceCourt'>&nbsp;</td><td class='serviceCourt'>&nbsp;</td><td class='alley' rowspan='2'>&nbsp;</td></tr>" +
			"<tr><td class='backCourt' colspan='2'>&nbsp;</td></tr>" + 
			"</table><div style='clear:both'></div>";
		
		$("#" + this.targetDivId + "-court").html(innerHtml);
		
		if (!this.drawn && (typeof StatEasyCanvas != "undefined")) {
			$(relevantDiv).append(
				"<canvas id='TennisCourtCanvas' style='position:absolute;left: 0px; top: 0px;'></canvas>" +
				"<input type='submit' id='TennisCourtCalibrate' value='Calibrate this drawing area' style='position:absolute;bottom:15px;left:15px'/>"
			);
			setTimeout(function () {
				// The Owner DIV has 5px of padding on either side = +10px
				new StatEasyCanvas("#TennisCourtCanvas", $(relevantDiv).width() + 10, $(relevantDiv).height() + 10);
				$("#TennisCourtCalibrate").click(function (jsEvent) {
					$("#TennisCourtCalibrate").hide(500);
					StatEasyCanvas.enterCalibrationMode();
					jsEvent.preventDefault();
				});
			}, 500);
		}
		
		this.shown = true;
		this.valid = true;
		this.drawn = true;
		
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

