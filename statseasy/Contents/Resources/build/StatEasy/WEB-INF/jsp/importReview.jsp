<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>


<%@page import="com.ressq.stateasy.service.ImportService"%>
<%@page import="com.ressq.stateasy.model.PlayerInSeason"%>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>

<script type="text/javascript">
var allTeams = ${teamJSON};
var allSeasons = ${seasonJSON};
var allPlayers = ${playerJSON};
var allOriginalSeasons = ${originalSeasonJSON};
var allOriginalTeams = ${originalTeamJSON};
var allOriginalPlayers = {};

var wrongIdPlayers = ${originalPlayerJSON};
for (var i in wrongIdPlayers) {
	var playerInSeason = wrongIdPlayers[i];
	allOriginalPlayers[playerInSeason.pisId] = playerInSeason;
}
</script>
<script type="text/javascript" src="/js/objectSelector.js"></script>
<script type="text/javascript" src="/js/importReview.js"></script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Review import of "${statImport.fileName}" on <fmt:formatDate value="${statImport.importDate}" type="both"/>:</h2>

This import will create:<br/>
${resolution.importGroup.name}

<table class="striped" cellspacing="0">
	<tr>
		<th>Object Type</th>
		<th>Name</th>
		<th>Details</th>
		<th>Status</th>
		<th>Action</th>
	</tr>


<c:forEach items="${resolution.allOriginalSeasons}" var="season">
	<c:set var="resolvedSeason" value="${se:resolvedSeason(resolution, season)}"/>
	<tr class="team" id="season${season.id}">
		<td>Team & Season</td>
		<c:choose>
			<c:when test="${not empty resolvedSeason}">
				<td class="name">${resolvedSeason.team.teamName} & ${resolvedSeason.name}</td>
				<td>&nbsp;</td>
				<td class="status">You <span class="have">already have</span> this team & season</td>
				<td class="action">StatEasy will use it</td>
			</c:when>
			<c:otherwise>
				<td class="name">${season.team.teamName} & ${season.name}</td>
				<td>&nbsp;</td>
				<td class="status">You <span class="need">do not have</span> this team & season</td>
				<td class="action">StatEasy will create it or <a href="#">you can choose one you already have</a></td>
			</c:otherwise>
		</c:choose>
	</tr>
	<c:forEach items="${season.allPlayers}" var="playerInSeason">
		<c:set var="resolvedPlayer" value="${se:resolvedPlayerInSeason(resolution, playerInSeason)}"/>
		<tr class="player" id="player${playerInSeason.id}">
			<td>Player</td>			
			<c:choose>
				<c:when test="${not empty resolvedPlayer}">
					<td class="name">${resolvedPlayer.player.firstName} ${resolvedPlayer.player.lastName}</td>
					<td>Shortcut: '${resolvedPlayer.shortcut}' Number: '${resolvedPlayer.number}'</td>
					<td class="status">You <span class="have">already have</span> this player</td>
					<td class="action">StatEasy will use it</td>
				</c:when>
				<c:otherwise>
					<td class="name">${playerInSeason.player.firstName} ${playerInSeason.player.lastName}</td>
					<td>Shortcut: '${playerInSeason.shortcut}' Number: '${playerInSeason.number}'</td>
					<td class="status">You <span class="need">do not have</span> this player</td>
					<td class="action">StatEasy will create it or <a href="#">you can choose one you already have</a></td>
				</c:otherwise>
			</c:choose>
		</tr>
	</c:forEach>
</c:forEach>
<c:forEach items="${resolution.allOriginalStatTypes}" var="statType">
	<tr>
		<td>Stat Type</td>
		<td>${statType.name}</td>
		<td>&nbsp;</td>			
		<c:choose>
			<c:when test="${not empty se:resolvedStatType(resolution, statType)}">
				<td>You <span class="have">already have</span> this stat type</td>
				<td>StatEasy will use it</td>
			</c:when>
			<c:otherwise>
				<td>You <span class="need">do not have</span> this stat type</td>
				<td>StatEasy will create it or <a href="#">you can choose one you already have</a></td>
			</c:otherwise>
		</c:choose>
	</tr>
</c:forEach>


</table>

<span class="tinyHelpText"><br/>Clicking the <b>Complete this import</b> button will start the import process. Once you have clicked the button, you cannot stop the process and you cannot undo it once it is complete.<br/><br/></span>

<form:form method="post" id="resolutionForm">
<input type="submit" name="submit" class="hoverGreen" id="completeImport" value="Complete this import"/>
<input type="submit" name="submit" class="hoverRed" value="Cancel"/>
</form:form>

<div style="display:none;padding: 10px;" id="importProgress" title="Import Progress">
	StatEasy is processing your import.  This will only take a minute or two. 
</div>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>