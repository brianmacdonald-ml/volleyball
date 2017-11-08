var uploadedVideos = new Array();
var fileSelected;
var counter;

/*-----------------------------------------------
 * DATA RETRIEVAL FROM THE SERVER
 */

/**
 * Get the progress of the encoding files from the server
 */
function getVideoEncodingProgress() {
	if (uploadedVideos.length != 0) {
		for (var i = 0; i < uploadedVideos.length; i++) {
			if (uploadedVideos[i] != null) {
				var urlToPost = GET_VIDEO_PROGRESS_URL + uploadedVideos[i].videoId;
			
				$.getJSON(urlToPost, function(data) {
						updateEncodingForVideoId(data.videoId, data.percent, data.estSize, data.timeRemaining);
					});
			}
		}
		setTimeout(getVideoEncodingProgress, 1000);
	}
}

/**
 * GET THE VIDEO INFORMATION FROM THE IFRAME
 */
function stripVideoInfoFromiFrame() {
	var JSONreturn = eval('(' + $("#upload_target").contents().text() + ')');

	for (var i = 0; i < JSONreturn.ids.length; i++) {
		var videoObject = {
			videoId: JSONreturn.ids[i],
			id: i,
			percent: "",
			timeRemaining: ""
		}
		uploadedVideos.push(videoObject);
	}

	setTimeout(getVideoEncodingProgress, 2000);
}

/*-----------------------------------------------
 * CALLBACK METHODS
 */

/**
 * CALLBACK METHOD - GET VIDEO ENCODING PROGRESS
 * @param videoId - Id of the video
 * @param percent - Percent completed
 * @param estSize - Size of the encoded file
 * @param timeRemaining - Time left until encoding is complete
 * @return no return
 */

function updateEncodingForVideoId(videoId, percent, estSize, timeRemaining) {
	if (videoId != undefined) {
		var thisVideo = lookupVideoById(videoId);
		
		$("#progress" + thisVideo.id).empty();
		if (percent != "2") {
			$("#progress" + thisVideo.id).append((percent * 100).toFixed(0) + "% complete (" + formatTimeLeft(timeRemaining) + ")");
		} else {
			$("#progress" + thisVideo.id).append("Encoding complete");
			removeVideoById(thisVideo.videoId);
			if (weHaveEncodedAllVideos()) {
				encodingIsComplete();
			}
		}
	}
}

/*-----------------------------------------------
 * UTILITY / HELPER METHODS
 */

/**
 * HELPER METHOD TO FORMAT THE TIME LEFT INTO HOURS, MINS, SECS
 */
function formatTimeLeft(time) {
	return time + " secs remaining";
}

/**
 * ARE THERE ANY VIDEOS LEFT THAT ARE STILL ENCODING?
 */
function weHaveEncodedAllVideos() {
	for (var i = 0; i < uploadedVideos.length; i++) {
		if (uploadedVideos[i] != null) {
			return false;
		}
	}
	return true;
}

/**
 * GET VIDEO FROM CACHE BY ID
 */
function lookupVideoById(videoId) {
	for (var i = 0; i < uploadedVideos.length; i++) {
		if (uploadedVideos[i] != null && uploadedVideos[i].videoId == videoId) {
			return uploadedVideos[i];
		}
	}
}

/**
 * REMOVES VIDEO FROM CACHE
 */
function removeVideoById(videoId) {
	for (var i = 0; i < uploadedVideos.length; i++) {
		if (uploadedVideos[i] != null && uploadedVideos[i].videoId == videoId) {
			uploadedVideos[i] = null;
			return;
		}
	}
}

/**
 * DISABLE HELPER METHOD
 */
function disableFileCopy() {
	$("#submitUploadForm").click(function() {});
	$("#uploadTime").empty();
}

/**
 * ENABLE FILE UPLOAD HELPER
 */
function addSpecialClasses() {
	$("#step1").addClass("complete");
	$("#step2").removeClass("notyet");
	enableFileUpload();
}

/**
 * DISABLE FILE UPLOAD HELPER
 */
function removeSpecialClasses() {
	disableFileCopy();
	$("#step1").removeClass("complete");
	$("#step2").addClass("notyet");
}

/**
 * HELPER METHOD FOR CREATING A APPENDING A NEW VIDEO TO THE LIST FOR UPLOAD
 */
function buildNewVideoDiv(number) {
	var newRowDiv = $("<div>").attr("id", "newRow" + number).attr("class","newRowEncapsulation");
	var dontUploadLink = $("<a>").attr("id", "remove" + number).attr("onclick","removeDiv('" + number +  "');");
	dontUploadLink.append("Remove this video");
	
	var newTable = $("<table>").attr("width","100%").append($("<tr>").append($("<td>").append($("#pickVideo").val()))
																	 .append($("<td>").attr("align","right").attr("id","progress" + number).attr("class","extraActions").append(dontUploadLink)));
	newRowDiv.append(newTable);
	return newRowDiv;
}

/**
 * HELPER METHOD FOR CREATING THE FILE BROWSER
 */
function createPickVideoElement() {
	$("#files").append($("<div>").attr("id","rowAppender").append($("<input>").attr("id","pickVideo").attr("class","showMe").attr("type","file")));
}

/* -----------------------------------------------
 * GENERAL INTERFACE INTERACTION
 */

/**
 * THE USER HAS SELECTED A FILE; TIME TO TURN ON FILE UPLOAD
 */
function enableFileUpload() {
	$("#uploadButtonTable").css("visibility","visible");
	$("#uploadTime").append("Feel free to select more videos above, or ")
					.append($("<input>").attr("type","submit").attr("id","submitUploadForm").attr("value","start bringing your videos into StatEasy"))
					.append($("<br>")).append($("<br>"))
					.append($("<span>").attr("class","tinyHelpText").append("(Psst...this process may take a few minutes to complete, and you will not be able to leave this page until it is done.)"));
	$("#submitUploadForm").click(function() {
		$("#videos").submit();
	});
}

/**
 * THE USER HAS MODIFIED THE LIST OF VIDEOS; UPDATE THE IDS ACCORDINGLY
 */

function updateRowNumbersForSubmission() {
	var i = 0;
	$("#files div.newRowEncapsulation").each(function(index) {
		$(this).attr("id","newRow" + i);
		$(this).find("input.hideMe").attr("id","pickVideo" + i).attr("name","files[" + i + "]");
		var actionsTD = $(this).find("td.extraActions");
		actionsTD.attr("id","progress" + i);
		actionsTD.empty();
		actionsTD.append($("<a>").attr("id","remove" + i).attr("onclick","removeDiv('" + i + "');").append("Remove this video"));
		i++;
	});

}

/**
 * REMOVE VIDEO FROM THE USER'S LIST
 */
function removeDiv(number) {
	$("#newRow" + number).remove();
	$("#pickVideo" + number).remove();
	fileSelected--;
	counter--;
	if(fileSelected == 0) {
		removeSpecialClasses();
	}
	updateRowNumbersForSubmission();
}

function encodingIsComplete() {
	$("#step3SubText").empty();
	$("#step3PreText").empty();
	$("#step3").addClass("complete");
	$("#step3SubText").append("The conversion process is complete.")
					  .append($("<br>")).append($("<br>"))
					  .append($("<a>").attr("href",GET_VIDEO_LIST_URL).append("Return to the videos page"));
}

/**
 * STEP 2 IS CONSIDERED COMPLETE
 * STEP 3 IS NOW IN PROGRESS
 */
function uploadComplete() {
	setTimeout(function() {
		stripVideoInfoFromiFrame();
		$("#step2").addClass("complete");
		$("#step3").removeClass("notyet");
		$("#waitForAMin").hide();
		setupEncodingSection();
	}, 100 );
}

/**
 * ONTO THE ENCODING STEP; SETUP THE LIST OF VIDEOS TO BE UPLOADED
 */
function setupEncodingSection() {
	 // Clean up some stuff we no longer need
	 $("#step1Stuff").empty();
	 var newTable = $("<table>").attr("width","100%").attr("class","title").append($("<tr>").append($("<td>").append("File name")));
	 $("#files").prepend($("<div>").attr("class","keepItClean").append(newTable));
	 $("#step3Stuff").prepend($("<div>").attr("class","heavyIndent").attr("id","step3PreText").append("We're going to convert these videos to a different format now. Don't worry...it's a technical thing."));
	 $("#step3Stuff").append($("<div>").attr("class","heavyIndent").attr("id","step3SubText").append("The conversion process is going to take a while. You can hang out on this page until the process is finished, or feel free to ")
			 													   .append($("<a>").attr("href",GET_VIDEO_LIST_URL).append("continue using StatEasy.")));
		
 	 for(var i = 0; i < uploadedVideos.length; i++) {
		 $("#progress" + uploadedVideos[i].id).empty();
		 $("#progress" + uploadedVideos[i].id).append($("<img>").attr("src","/images/encoding_files.gif"));
	 }
		
	 $("#step3Stuff").show();
}

/**
 * USER HAS CHOSEN A VIDEO; LET'S ADD IT TO THE LIST IN THE INTERFACE
 */
function pickVideoChange() {
	if (fileSelected == 0) {
		addSpecialClasses();
	}

	var newRowDiv = buildNewVideoDiv(counter)
	$("#files").append(newRowDiv);
	newRowDiv.append($("#pickVideo").clone().attr("name","files[" + counter + "]").attr("class","hideMe").attr("id","pickVideo" + counter));

	$("#rowAppender").remove();
	createPickVideoElement();

	$("#pickVideo").change(pickVideoChange);
	
	counter++;
	fileSelected++;
	
}

$(document).ready(function(){
	
	fileSelected = 0;
	counter = 0;
	$("#formContent").corners("12px");

	createPickVideoElement();
	
	$("#pickVideo").change(pickVideoChange);
	
	$("#videos").submit(function() {
		document.getElementById("videos").target = "upload_target";
		document.getElementById("upload_target").onload = uploadComplete;

		$("#step3Stuff").hide();
		$("#rowAppender").remove();
		$(".extraActions").empty();
		$("#step3Stuff").append($("#files").clone()); 
		$("#step1Stuff").hide("slow");
		$("#uploadButtonTable").hide("slow");
		$("#waitForAMin").show();
	});

	
});