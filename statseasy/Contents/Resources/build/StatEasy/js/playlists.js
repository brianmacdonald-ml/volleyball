
var renameDialogObj = undefined;
var renameFunction = undefined;
function renamePlaylist(jsEvent, playlistName, playlistId, renameUrl, options) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	playlistName = decodeFromJava(playlistName);
	playlistName = Encoder.htmlEncode(playlistName);
	
	if (renameDialogObj == undefined) {
		renameDialogObj = $('<div></div>')
			.html("Generic message")
			.dialog({
				autoOpen: false,
				title: "Change this playlist's name",
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
	
	var displayName = playlistName;
	if (playlistName.indexOf(".") != -1) {
		displayName = displayName.substring(0, displayName.indexOf("."));
	}
	
	renameDialogObj.html("Name: <input type='text' value='" + displayName + "' size='40'/>");
	renameFunction = function () {
		var formHtml = "<form method='post' action='" + renameUrl + "'>\
				<input type='hidden' name='action' value='rename'/>\
				<input type='hidden' name='id' value='" + playlistId + "'/>";
		
		var newName = renameDialogObj.children("input").val();
		formHtml += "<input type='hidden' name='newName' value='" + newName + "'/>";
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
	
	renameDialogObj.dialog("open");
	renameDialogObj.children("input").focus();
}

$(document).ready(function () {
	$(".export").click(function () {
		$(this).after("Exporting...");
		$(this).remove();
	});
});