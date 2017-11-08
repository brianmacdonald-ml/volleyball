

function replaceInputWithDate(whichInput, selectedDate) {
	var origName = $(whichInput).attr("name");
	$(whichInput).attr("name", "old" + origName);
	$(whichInput).after($("<input type='hidden' value='" + selectedDate.getTime() + "'/>").attr("name", origName));
}

function connectFormSubmission(formSelector) {
	$(formSelector).submit(function () {
		$(formSelector + " .DATE").each(function () {
			var selectedDate = $(this).datepicker("getDate");
			replaceInputWithDate(this, selectedDate);
		});
		$(formSelector + " .TIME").each(function () {
			var selectedDate = Date.parse($(this).val());
			replaceInputWithDate(this, selectedDate);
		});
		$(formSelector + " .DATETIME").each(function () {
			var selectedDate = Date.parse($(this).siblings(".datePart").val());
			var selectedTime = Date.parse($(this).siblings(".timePart").val());

			selectedDate.setHours(selectedTime.getHours());
			selectedDate.setMinutes(selectedTime.getMinutes());
			selectedDate.setSeconds(selectedTime.getSeconds());

			$(this).val(selectedDate.getTime());
		});
	});
}

function getDateFrom(object, notRequired) {
	var dateString = $(object).val();
	var actualDate = undefined;
	if ((dateString.length > 0) && isNaN(Number(dateString))) {
		actualDate = Date.parse(dateString);
	} else if (dateString.length > 0) {
		actualDate = new Date(Number(dateString));
	} else if (!notRequired) {
		actualDate = new Date();
	}
	
	return actualDate;
}

function connectGroupingFields(parentSelector) {
	if (parentSelector == undefined) {
		parentSelector = "";
	}
	
	$(parentSelector + " .DATE").each(function () {
		var actualDate = getDateFrom(this, $(this).attr("notRequired"));
		
		$(this).datepicker();
		if (actualDate != undefined) {
			$(this).datepicker("setDate", actualDate);
		}
	});
	$(parentSelector + " .TIME").each(function () {
		var actualDate = getDateFrom(this);

		$(this).val(actualDate.toString("h:mm:ss tt"));
	});
	$(parentSelector + " .DATETIME").each(function () {
		var actualDate = getDateFrom(this);

		$(this).attr("style", "display:none");
		$("<input type='text' class='timePart' />").insertAfter(this).val(actualDate.toString("h:mm:ss tt"));
		$("<input type='text' class='datePart' />").insertAfter(this).datepicker().datepicker("setDate", actualDate);
	});
	$(parentSelector + " .BOOLEAN").each(function () {
		var value = $(this).val();
		$(this).attr("style", "display:none");

		var name = $(this).attr("name");
		$(this).attr("name", "old" + name)
		
		// Issues #85 + #104 - put these in a span and only add it again if we don't see it
		if ($("#" + $(this).attr('id') + "_yesno_span").length == 0) {
			$(this).after("<span id='" + $(this).attr('id') + "_yesno_span'><input type='radio' name=\"" + name + "\" " + (value == "yes" ? "checked='checked' " : "") + "value='yes' />Yes" +
				"<br/>" +
				"<input type='radio' name=\"" + name + "\" " + (value != "yes" ? "checked='checked' " : "") + "value='no' />No</span>");
		}
	});
}