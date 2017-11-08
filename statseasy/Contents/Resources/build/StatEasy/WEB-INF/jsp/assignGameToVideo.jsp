<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<script type="text/javascript">
	var URL = "/video/assignToGame.htm";
	var teams = ${allTeams};
	var seasons = ${allSeasons};
</script>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/wizardHelper.js"></script>
<script type="text/javascript" src="/js/seasonDisplay.js"></script>
<script type="text/javascript" src="/js/assignGameToVideo.js"></script>

<script type="text/javascript">
    var preSelectedTeamId = "${teamId}";
    var preSelectedSeasonId = "${seasonId}";
    $(document).ready(function() {
        if (preSelectedTeamId != "") {
            $("#teamSelect").val(preSelectedTeamId);
            $("#step1IsComplete").click();
            if (preSelectedSeasonId != "") {
                $("#seasonSelect").val(preSelectedSeasonId);
                $("#step2IsComplete").click();
            }
        }
    });
</script>

<div id="content"><div id="innercontent">

<div id='formContent' class='middle'>
	<h2>Associate video (${gameVideo.displayName}) to an event:</h2>
	<form:form method="post" commandName="videoToGameForm" id="associateVideoToGameForm">
	<div id="steps">
		<h3 id="step1">Select a team</h3>
		<div id="step1stuff"> 
			<p>
			<select id="teamSelect">
				<option selected value="default">-- Select a team --</option>
			</select><span id="teamSelectError"></span>
			</p>
			<p><input type="button" class="hoverGreen" value="Done - I've selected my team" id="step1IsComplete" /></p>
		</div>
		<div id="step1stuffResult" style="display:none;"></div>
		<h3 id="step2" class="notyet">Select a season</h3>
		<div id="step2stuff" style="display:none;"> 
			<p>
			<select id="seasonSelect">
				<option selected value="default">-- Select a season --</option>
			</select><span id="seasonSelectError"></span>
			</p>
			<p><input type="button" class="hoverGreen" value="Done - I've selected my season" id="step2IsComplete" /></p>
		</div>
		<div id="step2stuffResult" style="display:none;"></div>
		<h3 id="step3" class="notyet">Select an event</h3>
		<div id="step3stuff" style="display:none;"> 
			<p id="step3Loading">
			Loading content...
			</p>
			<div id="dynamicEventSelect"></div>
		</div>
		<div id="step3stuffResult" style="display:none;"></div>
		<h3 id="step4" class="notyet">Confirm association</h3>
		<div id="step4stuff" style="display:none;"> 
			<p>
			Review and confirm the details above.
			</p>
			<p><input type="submit" class="hoverGreen" value="Done - I've reviewed the details" id="step4IsComplete" /></p>
			<p><span class="tinyHelpText">This is the last step. Clicking the <b>Done</b> button will associate the video to the selected event.</span></p>
		</div>
	</div>
	<h2 class="borderAbove"></h2>
	<input type="submit" class="hoverRed" name="submit" value="Cancel - I don't want to associate this video to a game" />
	</form:form>
</div>
</div></div>