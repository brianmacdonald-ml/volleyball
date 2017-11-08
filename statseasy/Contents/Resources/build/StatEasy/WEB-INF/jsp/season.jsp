<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>
<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css?sv=${serverVersion}" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js?sv=${serverVersion}" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.tmpl.min.js?sv=${serverVersion}"></script>

<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/autocomplete.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/wizardHelper.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/createAndAddPlayers.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/editSeason.js?sv=${serverVersion}"></script>

<script type="text/javascript">
	var ac;
	$(function() {
		ac = $('.playersToAdd').autocomplete(${availablePlayers}, "ac_", "player", ['firstName', 'lastName', 'name'], 'name');
		// Override default autocomplete functionality
	    $('.playersToAdd').find('tr').die('click').live('click', function() {
			var input = $(this).find("input");
			var clickedPlayer = new player(
					input.attr("firstname"),
					input.attr("lastname"),
					input.attr("playerid"));
			addPlayerToTeam(clickedPlayer, true);
		});
	});
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

<div id="content"><div id="innercontent">
<div class="middle" id="formContent">
	<c:choose>
	  <c:when test="${empty season.id}">
		<h2>New Season:</h2>
	  </c:when>
	  <c:otherwise>
		<h2 class="titleBorder">Edit season '${season.team.teamName} - ${season.name}':</h2>
	  </c:otherwise>
	</c:choose>
    
	<form:form method="post" commandName="season">
		<div id="steps">
			<h3 id="step1" class="complete">Set up general information</h3>
			<div id="step1stuff">
				<table>
				  <tr>
				    <td>Season Name:</td>
				    <td><form:input cssClass="autofocus" path="name"/></td>
					<td><form:errors path="name" cssClass="formErrors"/></td>
				  </tr>
				  <tr>
				    <td>Head Coach:</td>
				    <td><form:input path="headCoach"/></td>
					<td><form:errors path="headCoach" cssClass="formErrors"/></td>
				  </tr>
				  <tr>
				    <td>Assistant Coach:</td>
				    <td><form:input path="assistantCoach"/></td>
				    <td><form:errors path="assistantCoach" cssClass="formErrors"/></td>
				  </tr>
				  <tr>
				    <td>Display in dashboard dropdown:</td>
				    <td><form:checkbox path="shown"/></td>
				    <td><form:errors path="shown" cssClass="formErrors"/></td>
				  </tr>
				</table>
			</div>

			<h3 id="step1" class="complete">Players in this season:</h3>
			<div id="step2stuff">
			<div class="playersToAdd">
				<span class="boldTitle">Choose/Add players:</span><br />
				<input id="playerToAdd" class="acInput" autocomplete="off" />
				<c:if test="${not empty season.allPlayers}">
					<div id="ac_resize" class="acResize">
					<div id="ac_select" class="acSelector">
						<table cellspacing="0" class="striped">
							<c:forEach items="${season.allPlayers}" var="player">
								<c:if test="${ not player.selected }">
								<tr id="ac_row_${player.player.id}">
								<td><div class="rowContainer"><input  id="ac_radio_${player.player.id}" 
											firstname="${player.player.firstName}" 
											lastname="${player.player.lastName}" 
											playerid="${player.player.id}" 
											type="radio" 
											name="player_radio" 
											value="${player.player.name}" 
											tabindex="-1"/> ${player.player.name}</div></td>
								</tr>
								</c:if>
							</c:forEach>
						</table>
					</div>
					</div>
				</c:if>
			</div>
			<div class="addPlayer">
				<input type="button" class="hoverGreen" value="add >" id="addPlayer"/>
			</div>
			<div class="addedPlayers">
				<span class="boldTitle">Players on this team for this season:</span>
				<table class="striped players" id="mainTable">
					  <tr>
						<th width="40%">Player</th>
					    <th>Shortcut</th>
					    <th>Number<span class="formatFormErrors">(Required)</span></th>
					    <th>Actions</th>
					  </tr>
				</table>
				<c:forEach items="${season.allPlayers}" var="playerInSeason" varStatus="playerCounter">
					    <c:if test="${ playerInSeason.selected }">
					    	<script type="text/javascript">
					    		somePlayer = new player("${playerInSeason.player.firstName}",
					    								"${playerInSeason.player.lastName}",
					    								"${playerInSeason.player.id}",
					    								"${playerInSeason.shortcut}",
														"${playerInSeason.number}");
					    		appendPlayerToList(somePlayer);
					    	</script>
						</c:if>
				</c:forEach>
			</div>
			<div class="playersToDelete">
			</div>
			<div class="clear"></div>

			<c:choose>
			  <c:when test="${empty season.id}">
				<input class="hoverGreen" type="button" value="Create this season"/>
			  </c:when>
			  <c:otherwise>
				<input id="editingIsComplete" class="hoverGreen" type="button" value="Save my changes"/>
			  </c:otherwise>
			</c:choose>
			<input class="hoverRed" type="submit" value="Cancel"/>
			<div style="display:none;" id="hiddenRemovedElements"></div>
			</form:form>
		</div>

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