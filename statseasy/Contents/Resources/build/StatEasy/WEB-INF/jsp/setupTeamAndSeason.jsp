<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript" src="/js/wizardHelper.js"></script>
<script type="text/javascript" src="/js/autocomplete.js"></script>

<script type="text/javascript" src="/js/createAndAddPlayers.js"></script>
<script type="text/javascript" src="/js/setupTeamAndSeason.js"></script>

<style>
.noTeamsYet {
	display: none;
	color: green;
}
</style>

<script type="text/javascript">
	var ac, teams;
	$(function() {
		ac = $('.playersToAdd').autocomplete(${playersInJson}, "ac_", "player", ['firstName', 'lastName', 'name'], 'name');
		teams = ${teamsInJson};
	    // Override default autocomplete functionality
	    $('.playersToAdd').find('tr').die('click').live('click', function() {
			var input = $(this).find("input");
			var clickedPlayer = new player(
					input.attr("firstname"),
					input.attr("lastname"),
					input.attr("playerid"));
			addPlayerToTeam(clickedPlayer, true);
		});
		$("#oldTeamInput").trigger("change");
		
		<c:if test="${empty teams}">
		initNoTeamsYet();
		</c:if>
	});
	
	function initNoTeamsYet() {
		$(".noTeamsYet").show();
		$("input.radio[value='new']").prop("checked", true);
		$("#newTeamInput").focus();
	}
</script>

<script type="text/x-jquery-tmpl" id="playerToAddTemplate">
	<tr id="ac_row_\${id}">
		<td><div class="rowContainer"><input  id="ac_radio_\${id}" 
					firstname="\${firstName}" 
					lastname="\${lastName}" 
					playerid="\${id}" 
					type="radio" 
					name="player_radio" 
					value="\${name}" 
					tabindex="-1"/> \${name}
		</div></td>
	</tr>
</script>

<script type="text/x-jquery-tmpl" id="addedPlayerTemplate">
	<tr id="\${row_id}" name=\${name}>
		<td class="last">\${lastName}</td>
		<td class="first">\${firstName}</td>
		<td><a href="#" id="editPlayer">edit</a><input type="hidden" id="id" name="id" value="\${id}" /></td>
		<td><img src="/images/close.png" class="jQuery" onclick="javascript: deletePlayerRow('\${row_id}')" /></td>
	</tr>
</script>

<div id="content"><div id="innercontent">

<div class="middle" id="formContent">
<h2 class="titleBorder">Set up a new team and season</h2>

	<div id="steps">
		<h3 id="step1">Select a team or create a new one</h3>
		<p class="noTeamsYet">To get started using StatEasy, let's create a team and season to start taking stats with.</p>
		<form:form method="post" commandName="teamAndSeasonForm" id="teamAndSeasonForm">
		<div id="step1stuff">
			<c:if test="${not empty teams}">
				<p><input type="radio" name="newOrOld" value="old" id="oldTeamRadio" class="radio"/>Select an existing team: 
				<select id="oldTeamInput">
					<option selected value="default">-- Select a team --</option>
		    	<c:forEach items="${teams}" var="team" varStatus="rowCounter">
		    		<option value="${team.id}">${team.teamName}</option>
				</c:forEach>
				</select><span id="existingTeamNameError"></span></p>
				<p style="padding-left:45px;margin-top:0px;margin-bottom:0px;font-weight:bold;">or</p>
			</c:if>
			<p><input type="radio" name="newOrOld" value="new" id="newTeamRadio" class="radio"/>Create a new team: <input type="text" id="newTeamInput"/> <span id="newTeamNameError"></span></p>
			<p><input type="button" class="hoverGreen" value="Done - I've selected my team" id="step1IsComplete" /></p>
		</div>
		<div id="step1stuffResult" style="display:none;">
		</div>
		<h3 id="step2" class="notyet">Create a new season</h3>
		<div id="step2stuff" style="display:none;">
			<table>
			  <tr class="existingSeasonRow">
			  	<td>Start with an existing season:</td>
			  	<td>
			  		<select id="existingSeason" name="existingSeason">
			  		</select>
			  	</td>
			  </tr>
			  <tr>
			    <td>Season Name:</td>
			    <td><form:input path="seasonName" id="seasonName"/></td>
			    <td id="seasonNameError"></td>
			  </tr>
			  <tr>
			    <td>Head Coach:</td>
			    <td><form:input path="headCoach"/></td>
			    <td></td>
			  </tr>
			  <tr>
			    <td>Assistant Coach:</td>
			    <td><form:input path="assistantCoach"/></td>
			    <td></td>
			  </tr>
			</table>
			<p><input type="button" class="hoverGreen" value="Done - I've created my season" id="step2IsComplete" /></p>
		</div>
		<div id="step2stuffResult" style="display:none;"></div>
		<h3 id="step3" class="notyet">Add players to this team/season</h3>
		<div id="step3stuff" style="display:none;">
			<div class="playersToAdd">
				<span class="boldTitle">Choose/Add players:</span><br />
				<input id="playerToAdd" class="acInput" autocomplete="off" />
					<div id="ac_resize" class="acResize">
					<div id="ac_select" class="acSelector">
						<table cellspacing="0" class="striped">
							<c:forEach items="${players}" var="player">
								<tr id="ac_row_${player.id}">
								<td><div class="rowContainer"><input  id="ac_radio_${player.id}" 
											firstname="${player.firstName}" 
											lastname="${player.lastName}" 
											playerid="${player.id}" 
											type="radio" 
											name="player_radio" 
											value="${player.name}" 
											tabindex="-1"/> ${player.name}</div></td>
								</tr>
							</c:forEach>
						</table>
					</div>
					</div>
			</div>
			<div class="addPlayer">
				<input type="button" class="hoverGreen" value="add >" id="addPlayer"/>
			</div>
			<div class="addedPlayers">
				<span class="boldTitle">Players on this team for this season:</span>
				<table cellspacing="0" class="striped players" id="mainTable">
				  <tr class="dontremove">
				    <th>Last Name</th>
				    <th>First Name</th>
				    <th>&nbsp;</th>
				    <th class="skinny">&nbsp;</th>
				  </tr>
				  <tr id="noPlayersYet" class="dontremove">
				    <td colspan="4">No players yet.<br>Add existing players or create new ones using the links below.</td>
				  </tr>
				</table>
			</div>
			<div class="clear"></div>
			<p id="previousSeason">Start with players from a previous season: <select id="previousSeasons"></select> <input type="button" value="Add players to list." /></p>
			<p><input type="button" class="hoverGreen" value="Done - I've added my players" id="step3IsComplete"/></p>
		</div>
		<div id="step3stuffResult" style="display:none;"></div>
		<h3 id="step4" class="notyet">Set up player shortcuts and numbers</h3>
		<div id="step4stuff" style="display:none;">
			<div class="centerMeWithPadding">
				<p><span class="tinyHelpText">A player's shortcut or number is what you will type when taking stats for the player. Player shortcuts can only be letters with no spaces, such as a player's initials. Player numbers can only be digits with no spaces.</span></p>				
				<span class="formatFormErrors" id="numberAndShortcutError" style="display:none;"></span>				
				<table cellspacing="0" class="striped players" id="inputTable">
				  <tr>
				    <th width="50%">Name</th>
				    <th>Shortcut</th>
				    <th>Number<span class="formatFormErrors">(Required)</span></th>
				  </tr>
				</table>
			</div>
			<p id="noplayersText" style="display:none;">No players added to this season.</p>
			<p><input type="button" class="hoverGreen" value="Done - I've set up my shortcuts/numbers" id="step4IsComplete"/></p>
			<p><span class="tinyHelpText">This is the last step. Clicking the <b>Done</b> button will set up the team and season.</span></p>
		</div>
		</form:form>
	</div>
	<h2 class="borderAbove"></h2>
	<input type="button" class="hoverRed" value="Cancel - I don't want to set up this team and season" onclick='javascript: window.location="/launch.htm"' />
</div>

</div></div>

<div id="editPlayerDialog" title="Edit player">
	<table>
	  <tr>
	    <td style="white-space:nowrap;">First Name:</td>
	    <td><input type="text" id="firstName" name="firstName"/></td>
	  </tr>
	  <tr>
	    <td style="white-space:nowrap;">Last Name:</td>
	    <td><input type="text" id="lastName" name="lastName"/></td>
	  </tr>
	</table>
</div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>
