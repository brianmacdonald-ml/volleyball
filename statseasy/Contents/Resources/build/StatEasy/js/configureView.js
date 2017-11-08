var ALLSTATS = "allStats";
var DATASTATS = "dataStats";
var SIMPLE = "SIMPLE";
var ADVANCED = "ADVANCED";

var activeSelection = ALLSTATS;

var activeColumnEntry = SIMPLE;

function statColumn(name, functionName, statId, statName, definition, id, formatType) {
	this.name = name;
	this.statId = statId;
	this.statName = statName;
	this.functionName = functionName;
	this.definition = definition;
	this.id = id;
	this.formatType = formatType;
	
	this.htmlRowId;
	this.currentIndex;
}

function addColumnFormTo(addTo) {
	
	var numCols = $("#columnTable tr").length - 1;
	var index = numCols - 1;
	var innerHtml = "<tr>\
			<td><input type='text' name='allColumns[" + index + "].name' size='4'/></td>\
			<td><input type='text' name='allColumns[" + index + "].definition' size='40'/></td>\
			<td><input type='text' name='allColumns[" + index + "].index' size='3'/></td>\
			<td><input type='text' name='allColumns[" + index + "].tableNumber' size='3'/></td>\
			<td>\
				<input type='checkbox' name='allColumns[" + index + "].separator' size='3'/>\
				<input type='hidden' name='_allColumns[" + index + "].separator' value='on'/>\
			</td>\
			<td>\
				<select name='allColumns[" + index + "].formatType'>\
					<option value='number' selected='selected'>Number</option>\
					<option value='percentage'>Percentage</option>\
					<option value='currency'>Currency</option>\
				</select>\
				<input name='allColumns[" + index + "].formatPattern' type='text' size='5'/>\
			</td>\
			<td></td>\
		</tr>";
	
	$('#columnTable .thebottomrow').before(innerHtml);
	
	// Grow the column count appropriately
	$('#columnCount').attr('value', numCols);
}

function step1ResultsSetup() {
	$("#step1stuffResult").append($("<p>").append("You've selected: " + $("#name").val())
			  .append($("<input>").attr("id","goBackToStep1").attr("type","button").attr("value","I want to change the general info").attr("class","leftMargin").attr("onclick","backToStep('1')")));
}

/*************
 * DIALOG EVENT
 */
var rowCounter = 0;
var actualColumnCount = 0;
var editing;
var noEntriesYet = null;
var noGroupEntries = null;

/**
 * Used when creating a NEW column.
 * @param theDialog
 * @return
 */
function addAColumn(theDialog) {
	if (!inputsForColumnNameAreValid()) return;
	
	var isAdvanced = $("#definitionInput").is(':visible');
	$(theDialog).dialog("close");
	
	var column = stripColumnInfoFromDialog(isAdvanced);
	
	// Increment both counters
	rowCounter++;
	actualColumnCount++;

	removeNoEntryText();
	
	// Add the new statColumn to the table
	$("#mainTable").append( makeANewStatColumn(column, rowCounter, actualColumnCount) );
	
	// Update the column count
	updateColumnCount();
	$("#definitionInput").val("");
}

function addAColumnGroup(theDialog) {
	if (!inputsForColumnGroupAreValid()) return;
	
	$(theDialog).dialog("close");
	
	var columnGroup = stripColumnGroupInfoFromDialog();
	
	removeNoGroupEntriesText();
	
	$("#columnGroupTable").append( makeANewColumnGroup(columnGroup) );
}

/**
 * Used when updating an existing column. Assumes the column to be edited
 * is saved in the editing variable.
 * @param theDialog - the dialog to be closed
 */
function updateAColumn(theDialog) {
	if (!inputsForColumnNameAreValid()) return;
	
	var isAdvanced = $("#definitionInput").is(':visible');
	$(theDialog).dialog("close");
	
	var column = stripColumnInfoFromDialog(isAdvanced);
	
	column.htmlRowId = editing.htmlRowId;
	column.currentIndex = editing.currentIndex;
	
	columns[column.htmlRowId] = column;
	
	updateContentOfExistingRow(column);
	$("#definitionInput").val("");
}

function updateAColumnGroup(theDialog, group) {
	if (!inputsForColumnGroupAreValid()) return;
	
	$(theDialog).dialog("close");
	
	var columnGroup = stripColumnGroupInfoFromDialog();
	group.name = columnGroup.name;
	group.startIndex = columnGroup.startIndex;
	group.endIndex = columnGroup.endIndex;
	
	updateContentOfExistingGroup(group);
}

function stripColumnInfoFromDialog(isAdvanced) {
	var tempStatId = $("#" + activeSelection).val();
	var column = null;
	if (isAdvanced) {
		column = new statColumn(
			$("#columnName").val(), 
			"", 
			"", 
			"",
			$("#definitionInput").val(),
			"",
			$("input:radio[name=formatType]:checked").val());
	} else {
		column = new statColumn(
				$("#columnName").val(), 
				$("#functionName").val(), 
				tempStatId, 
				$("#" + activeSelection + "_" + tempStatId).text(),
				"",
				"",
				"number");
	}
	
	resetColumnFormData();
	return column;
}

function stripColumnGroupInfoFromDialog() {
	var columnGroup = undefined;
	
	columnGroup = {
		name       : $("#columnGroupName").val(),
		startIndex : $("#columnGroupStartIndex").val(),
		endIndex   : $("#columnGroupEndIndex").val(),
	};
	
	return columnGroup;
}

function updateColumnCount() {
	// Grow the column count appropriately
	$('#columnCount').attr("value", actualColumnCount);
}

function removeNoEntryText() {
	// cache the 'noentries' text
	if ($("#noEntriesYet").size() > 0) {
		noEntriesYet = $("#noEntriesYet").clone();
	}
	$("#noEntriesYet").remove();
}

function removeNoGroupEntriesText() {
	// cache the 'noentries' text
	if ($("#noGroupEntries").size() > 0) {
		noGroupEntries = $("#noGroupEntries").clone();
	}
	$("#noGroupEntries").remove();
}

function resetColumnFormData() {
	$("#columnName").val("");
}

function resetColumnGroupFormData() {
	$("#columnGroupName").val("");
	$("#columnGroupStartIndex").val("");
	$("#columnGroupEndIndex").val("");
}

function makeANewStatColumn(column, rowId, columnNumber) {
	var index = columnNumber - 1;
	
	column.htmlRowId = rowId;
	column.currentIndex = index;
	
	columns[rowId] = column;
	
	var finalRow = $("<td>").append($("<img>").attr({ 
		 	src: "/images/edit.png",
		 	class: "delete",
		 	title: "Edit row",
		 	onclick: "javascript: showColumnDialog('" + rowId + "')",
		 	id: "edit" + index
		})).append($("<img>").attr({ 
		 	src: "/images/close.png",
		 	class: "delete",
		 	title: "Delete row",
		 	onclick: "javascript: deleteThisRow('" + rowId + "')",
		 	id: "delete" + index
		}));
	
	var columnTR = $("<tr>").attr("id","row" + rowId).append($("<td>").append(makeATextInput("allColumns[" + index + "].index", columnNumber).attr({"size": 2})))
									.append($("<td>").append($("<span>").attr("title","displayname").append(column.name))
													 .append(makeAHiddenInput("allColumns[" + index + "].name", column.name)))
									.append($("<td>").append($("<span>").attr({
														"title":"displaycalc",
														"id": "displayCalc" + index
														}).append(showTheCalculation(column)))
													 .append(makeAHiddenInput("allColumns[" + index + "].definition", column.definition))
											         .append(makeAHiddenInput("allColumns[" + index + "].formOperand", column.functionName))
											         .append(makeAHiddenInput("allColumns[" + index + "].formColumnId", column.statId))
											         .append(makeAHiddenInput("allColumns[" + index + "].tableNumber", 1))
											         .append(makeAHiddenInput("allColumns[" + index + "].formatType", column.formatType)))
									.append(finalRow);
	return columnTR;
}

var nextGroupRowId = 1;
function makeANewColumnGroup(columnGroup) {
	if (columnGroup.rowId == undefined) {
		columnGroup.rowId = nextGroupRowId++;
	}
	
	if (columnGroup.id == undefined) {
		viewObj.allGroups.push(columnGroup);
	}
	
	var editImage = $("<img src='/images/edit.png' class='delete' title='Edit Row' id='editGroup" + columnGroup.rowId + "'/>").click(function () {
		showColumnGroupDialog(columnGroup);
	});
	var deleteImage = $("<img src='/images/close.png' class='delete' title='Delete Row' id='deleteGroup" + columnGroup.rowId + "'/>").click(function () {
		deleteThisGroup(columnGroup);
	});
	
	return $("<tr id='group" + columnGroup.rowId + "'>").append("<td><span id='group" + columnGroup.rowId + "Name'>" + columnGroup.name + "</span></td>")
														.append("<td><span id='group" + columnGroup.rowId + "StartIndex'>" + columnGroup.startIndex + "</span></td>")
														.append("<td><span id='group" + columnGroup.rowId + "EndIndex'>" + columnGroup.endIndex + "</span></td>")
														.append($("<td>").append(editImage).append(deleteImage));
}

/**
 * If the user used the simple method, this returns it in a special format.
 * If the user used the advanced method, it returns the definition as written.
 * @param column - the column information
 * @return the formatted text
 */
function showTheCalculation(column) {
	if (activeColumnEntry == SIMPLE && column.statId != "") {
		return "Show the <b>" + column.functionName + "</b> of each <b>" + column.statName + "</b>.";
	} else {
		return column.definition;
	}

}


/**
 * Deletes the selected row from the table
 * @param deleteMe - id of the row to be deleted
 * @return void function
 */
function deleteThisRow(rowId) {
	$("#row" + rowId).remove();
	actualColumnCount--;
	if (actualColumnCount == 0) {
		$("#mainTable").append(noEntriesYet);
	}
	updateIndexOfExistingRows();
	updateColumnCount();
	
	var columnId = getColumnByHtmlId(rowId).id;
	if (columnId != undefined) {
		updateDeleteList(columnId);
	}
}

function deleteThisGroup(columnGroup) {
	$("#group" + columnGroup.rowId).remove();
	if ($("#columnGroupTable tr").size() == 1) {
		$("#columnGroupTable").append(noGroupEntries);
	}
	
	if (columnGroup.id != undefined) {
		updateGroupsDeleteList(columnGroup);
	}
	
	var needleIndex = undefined;
	for (var i in viewObj.allGroups) {
		var group = viewObj.allGroups[i];
		if (group.rowId == columnGroup.rowId) {
			needleIndex = i;
			break;
		}
	}
	if (needleIndex != undefined) {
		viewObj.allGroups.splice(needleIndex, 1);
	}
}

/**
 * Keeps track of columns to be deleted.
 * @param columnId - new column to be added to list.
 */
function updateDeleteList(columnId) {
	deletedColumnIds = $("#deletedColumnIds").val();
	if (deletedColumnIds == "") {
		$("#deletedColumnIds").val(columnId);
	} else {
		$("#deletedColumnIds").val(deletedColumnIds + "," + columnId);
	}
}

function updateGroupsDeleteList(columnGroup) {
	deletedColumnIds = $("#deletedColumnGroupIds").val();
	if (deletedColumnIds == "") {
		$("#deletedColumnGroupIds").val(columnGroup.id);
	} else {
		$("#deletedColumnGroupIds").val(deletedColumnIds + "," + columnGroup.id);
	}
}

function getColumnByHtmlId(rowId) {
	for (var i=0; i < columns.length; i++) {
		var column = columns[i];
		if (column != null) {
			if (column.htmlRowId == rowId) {
				return column;
			}
		}
	}
}

/**
 * Used to make certain all the indices are lined up
 * Also make sure the order is incrementing by 1
 * @return nothing
 */
function updateIndexOfExistingRows() {
	var counter = 0;
	$.each($("#mainTable").find("tr"), function(index, theRow) {
		$.each($(theRow).find("input"), function(index, theInput) {
			if ($(theInput).attr("type") == "text") {
				$(theInput).val(counter);
			}
		});
		counter++;
	});
}

function updateContentOfExistingRow(column) {
	// Update all the hidden inputs first
	$.each($("#row" + column.htmlRowId).find("input"), function(index, theInput) {
		var type = $(theInput).attr("name");
		if (type.indexOf("name") != -1) {
			$(theInput).val(column.name);
		} else if (type.indexOf("definition") != -1) {
			$(theInput).val(column.definition);
		} else if (type.indexOf("formOperand") != -1) {
			$(theInput).val(column.functionName);
		} else if (type.indexOf("formColumnId") != -1) {
			$(theInput).val(column.statId);
		} else if (type.indexOf("formatType") != -1) {
			$(theInput).val(column.formatType);
		}
	});
	
	// Update all the display information
	$.each($("#row" + column.htmlRowId).find("span"), function(index, theSpan) {
		var type = $(theSpan).attr("title");
		if (type == "displayname") {
			$(theSpan).empty().append(column.name);
		} else if (type == "displaycalc") {
			$(theSpan).empty().append(showTheCalculation(column));
		}
	});
}

function updateContentOfExistingGroup(group) {
	$("#group" + group.rowId + "Name").html(group.name);
	$("#group" + group.rowId + "StartIndex").html(group.startIndex);
	$("#group" + group.rowId + "EndIndex").html(group.endIndex);
}

/**
 * Switch pop up to allow for the user to enter a calculation
 */
function enableAdvanced() {
	var theWidth = $("#performSimpleInput").width();
	$("#performSimpleInput").hide();
	$("#performAdvancedLink").hide();
	$("#performAdvancedInput").css("width",theWidth);
	$("#performAdvancedInput").show();
	$("#performSimpleLink").show();
	$("#definitionInput").focus();
	activeColumnEntry = ADVANCED;
}

/**
 * Switch pop up to allow for simple calculation creation
 */
function enableSimple() {
	$("#performAdvancedInput").hide();
	$("#performSimpleLink").hide();
	$("#performSimpleInput").show();
	$("#performAdvancedLink").show();
	activeColumnEntry = SIMPLE;
}

/*************
 * DIALOG STUFF
 */
var columnDialog = null;
function showColumnDialog(columnIndex) {
	var column = columns[columnIndex];
	editing = column;
	var bothButtons;
	if (column != null) {
		bothButtons = {"Save my changes": function() { updateAColumn(this); }, "Cancel": function() { $(this).dialog("close"); $("#definitionInput").val("");} };
	} else {
		bothButtons = {"Add this column": function() { addAColumn(this); }, "Cancel": function() { $(this).dialog("close"); $("#definitionInput").val("");} };
	}
	
	if (columnDialog == null) {
		columnDialog = $("#addNewColumnDialog").dialog({ closeText: '',
														 modal: 'true',
														 width: 'auto',
										 				 buttons: bothButtons});
	} else {
		columnDialog.dialog('option', 'buttons', bothButtons);
		columnDialog.dialog("open");
	}
	
	if (column != null) {
		$("#columnName").val(column.name);
		if (column.statId != "") {
			enableSimple();
			$("#functionName").val(column.functionName);
			$("#allStats").val(column.statId);
		} else {
			enableAdvanced();
			$("#definitionInput").val(column.definition);
			$(":radio[value=" + column.formatType + "]").attr("checked", "checked");
		}
	} else {
		resetColumnFormData();
		enableSimple();
	}
	
	
	$("#columnName").focus();
}

var columnGroupDialog = null;
function showColumnGroupDialog(columnGroup) {
	var group = columnGroup;
	var bothButtons;
	
	if (group != null) {
		bothButtons = {"Save my changes": function() { updateAColumnGroup(this, group); }, "Cancel": function() { $(this).dialog("close");} };
	} else {
		bothButtons = {"Add this column group": function() { addAColumnGroup(this); }, "Cancel": function() { $(this).dialog("close");} };
	}
	
	if (columnGroupDialog == null) {
		columnGroupDialog = $("#addNewColumnGroupDialog").dialog({
			closeText: '',
			modal: 'true',
			width: 'auto',
			buttons: bothButtons
		});
	} else {
		columnGroupDialog.dialog('option', 'buttons', bothButtons);
		columnGroupDialog.dialog("open");
	}
	
	if (group != null) {
		$("#columnGroupName").val(group.name);
		$("#columnGroupStartIndex").val(group.startIndex);
		$("#columnGroupEndIndex").val(group.endIndex);
	} else {
		resetColumnGroupFormData();
	}
	
	$("#columnGroupName").focus();
}

/*************
 * VALIDATION
 */
function inputsForNameAreValid() {
	return validateNotEmpty("name", "This field is required. Please enter a report name.");
}

function inputsForColumnNameAreValid() {
	return validateNotEmpty("columnName", "This field is required. Please enter a column name.");
}

function inputsForColumnGroupAreValid() {
	var valid = validateNotEmpty("columnGroupName", "This field is required. Please enter a column group name.");
	valid = valid && validateNotEmpty("columnGroupStartIndex", "This field is required. Please enter the number of the first column in the group.");
	valid = valid && validateNotEmpty("columnGroupEndIndex", "This field is required. Please enter the number of the last column in the group.");
	if (valid && ($("#columnGroupStartIndex").val() == $("#columnGroupEndIndex").val())) {
		buildPromptAndBinding("columnGroupStartIndex", "Start and end indexes must be different");
		valid = false;
	}
	return valid;
}

function configureBindingPrompt(id) {
    $("#edit" + id).bind("click", function() {
        $.validationEngine.closePrompt("#mainTable");
    });
	$("#delete" + id).bind("mousedown", function() {
		$.validationEngine.closePrompt("#displayCalc" + id);
	});
}

function bindValidationToDoc(ids) {
	$("#mainTable").bind("click", function() {
		for (var i=0 ;i < ids.length; i++) {
			$.validationEngine.closePrompt("#displayCalc" + ids[i]);			
		}
	});
	$("#showColumnD").bind("click", function() {
		for (var i=0 ;i < ids.length; i++) {
			$.validationEngine.closePrompt("#displayCalc" + ids[i]);			
		}
	});
}

function buildColumnGroupInputs() {
	var inputText = "";
	for (var i in viewObj.allGroups) {
		var group = viewObj.allGroups[i];
		if (group.id != undefined) {
			inputText += "<input type='hidden' name='allGroups[" + i + "].id' value='" + group.id + "'/>";
		}
		inputText += "<input type='hidden' name='allGroups[" + i + "].name' value=\"" + group.name + "\"/>";
		inputText += "<input type='hidden' name='allGroups[" + i + "].startIndex' value='" + group.startIndex + "'/>";
		inputText += "<input type='hidden' name='allGroups[" + i + "].endIndex' value='" + group.endIndex + "'/>";
	}
	inputText += "<input type='hidden' name='columnGroupCount' value='" + viewObj.allGroups.length + "'/>";
	
	$("#viewForm").append(inputText);
}

$(document).ready(function () {
	registerStepComplete(1, function() {
		// Check to see if inputs are valid. If not, return and skip the rest of the stuff in this method.
		if (!inputsForNameAreValid()) return;
		stepIsComplete(1, step1ResultsSetup);
	});
	$("#functionName").bind("change", function() {
		if ($("#functionName").val() == NUMBER) {
			$("#" + DATASTATS).hide();
			$("#" + ALLSTATS).show();
			activeSelection = ALLSTATS;
		} else {
			$("#" + ALLSTATS).hide();
			$("#" + DATASTATS).show();
			activeSelection = DATASTATS;
		}
	});
	var errorIds = new Array();
	for (var i=0; i < errors.length; i++) {
		if (errors[i].name != "None") {
			inputId = errors[i].name;
			$.validationEngine.buildPrompt("#displayCalc" + inputId,errors[i].description,"error");
			configureBindingPrompt(inputId);
			errorIds.push(inputId);
		}
	}
	bindValidationToDoc(errorIds);
	
	for (var i in viewObj.allGroups) {
		var group = viewObj.allGroups[i];
		$("#columnGroupTable").append( makeANewColumnGroup(group) );
	}
	
	$("#viewForm").submit(buildColumnGroupInputs);
});