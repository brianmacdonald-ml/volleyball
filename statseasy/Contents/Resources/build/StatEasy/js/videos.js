
var renameVideoObj = undefined;
var renameFunction = undefined;
function renameVideo(jsEvent, videoName, videoId, renameUrl, options) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	videoName = decodeFromJava(videoName);
	videoName = Encoder.htmlEncode(videoName);
	
	if (renameVideoObj == undefined) {
		renameVideoObj = $('<div></div>')
			.html("Generic message")
			.dialog({
				autoOpen: false,
				title: "Change this video's display name",
				modal: true,
			    height: '180',
			    width: '500',				
				buttons: {
					"Yes, rename it." : function () {
						$(this).dialog("close");
				
						if (renameFunction != undefined) {
							renameFunction();
						}
						
					},
					"No, do not rename it." : function () {
						$(this).dialog("close");
					}
				},
			});
	}
	
	var displayName = videoName;
	if (videoName.indexOf(".") != -1) {
		displayName = displayName.substring(0, displayName.indexOf("."));
	}
	
	renameVideoObj.html("Display name: <input type='text' value='" + displayName + "' size='40'/>");
	renameFunction = function () {
		var formHtml = "<form method='post' action='" + renameUrl + "'>\
				<input type='hidden' name='action' value='rename'/>\
				<input type='hidden' name='id' value='" + videoId + "'/>";
		
		var newName = escape(renameVideoObj.children("input").val());
		formHtml += "<input type='hidden' name='newDisplayName' value='" + newName + "'/>";
		if (options != undefined) {
			for (var i in options) {
				formHtml += "<input type='hidden' name='" + i + "' value='" + options[i] + "'/>";
			}
		}
		formHtml += "</form>";
		
		var newForm = $(formHtml);
		newForm.appendTo("#innercontent");
		newForm.submit();
	};
	
	renameVideoObj.dialog("open");
	renameVideoObj.children("input").focus();
}

function setMergeButtonState() {
	if ($("input:checked").size() >= 2) {
		$(".mergeVideos").removeAttr("disabled");
	} else {
		$(".mergeVideos").attr("disabled", "disabled");
	}
}


$(document).ready(function () {
	listenForProgress("/ws?clazz=gameVideo", {
		hideMessage : true,
		onComplete : function (mostRecent) {
			$("#videoWatchLink" + mostRecent.id).show(500);
		}
	}, null, "ws");

	$("input").click(setMergeButtonState);
	setMergeButtonState();
	
	$('.actions').change(function() {
		$(this).find("option:selected").each(function() {
			if ($(this).data("link")) {
				location.href=$(this).data("link");
			} else {
				eval($(this).data("fn"));
			}
		});
	});
	
	$(".shorten").shorten();
});