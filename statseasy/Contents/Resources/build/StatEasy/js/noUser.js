var validateExists;
$(function() {
	
	$('.sport_check').click(function (e) {
		if ($(e.target).attr("type") != "checkbox") {
			$(this).find('input')[0].checked=!$(this).find('input')[0].checked;
		}
	})
	
	$("#gameType").hide();
	$("#loggedIn").hide();
	
	$("#register").click(function() {
		if (!validateNotEmpty("username2", "Email address is required.")) {
			return;
		}
		if (!validateNotEmpty("password2", "Password is required.")) {
			return;
		}
		if (!validateNotEmpty("password2_confirm", "Confirm Password is required.")) {
			return;
		}
		if ($("#password2").val() !== $("#password2_confirm").val()) {
			buildPromptAndBinding("password2", "Password and Confirm Password must match.");
			return;
		}
		if ($("#why_download").val() === "-1") {
			buildPromptAndBinding("why_download", "Please choose a reason for downloading StatEasy.");
			return;
		}
		
		var interest_errors = false;
		$('.followup:visible input').each(function() {
			if (!validateNotEmpty($(this).attr('id'), "This field is required.")) {
				interest_errors = true;
				return false;
			}
		});
		
		if (($('#sports').length > 0) && ($('#sports:checked').length < 1)) {
			buildPromptAndBinding("sports", "Please choose at least one sport to begin your trial.");
			return;
		}
		
		if (interest_errors) {
			return;
		}
	
		$('#registerForm').prop("disabled", true);
		$('#registerForm').submit();
	});
	
	$("#login").click(function() {
		if (!validateNotEmpty("username1", "Email address is required.")) {
			return;
		}
		if (!validateNotEmpty("password1", "Password is required.")) {
			return;
		}
		
		$('#loginForm').submit();
	});
	
	$('#why_download').change(function() {
		$('.followup').hide();
		$("." + $(this).val() + "_followup").show();
	});
	
	$('#why_download').change();
})