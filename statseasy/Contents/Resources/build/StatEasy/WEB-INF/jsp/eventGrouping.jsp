<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/autocomplete.js"></script>
<script src="/js/date.js" type="text/javascript"></script>
<script src="/js/eventGrouping.js" type="text/javascript"></script>

<script type="text/javascript">

	// Used for autocomplete
	var teamNames = ${opponentsInJson};

	$(document).ready(function () {
		connectGroupingFields("#groupingForm");
		connectFormSubmission("#groupingForm");
	});
	
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2>Edit event '${eventGrouping.name}':</h2>
    
<form:form method="post" commandName="eventGrouping" id="groupingForm">

	<table>
		<c:if test="${eventGrouping.myType.opponentSpecLevel eq 'SPECIFIED'}">
			<tr>
				<td>Opponent</td>
				<td>
					<div class="chooseOpponent">
                       <form:input id="opponent_${eventType.id}" path="attributes[opponent]" cssClass="acInput" autocomplete="off"/>
                       <c:if test="${not empty opponents}">
                       	   <div id="opponent_${eventType.id}_resize" class="acResize">
	                       <div id="opponent_${eventType.id}_select" class="acSelector">
		                       <table cellspacing="0" class="striped">
		                       	 <c:forEach items="${opponents}" var="opponent">
		                       	   <tr id="opponent_${eventGrouping.myType.id}_row_${opponent.id}">
		                       	   	 <td><input id="opponent_${eventGrouping.myType.id}_radio_${opponent.id}" type="radio" name="opponent_${eventGrouping.myType.id}_radio" value="${opponent.teamName}" tabindex="-1"/> ${opponent.teamName}</td>
		                       	   </tr>
		                       	 </c:forEach>
		                       </table>
	                       </div>
	                       </div>
                       </c:if>
                       </div>
                       
                       <script type="text/javascript">
                       $('.chooseOpponent').autocomplete(teamNames, "opponent_${eventGrouping.myType.id}_", "team", ['name'], 'name');
                       </script>
				</td>
			</tr>
		</c:if>
		<c:forEach items="${ eventGrouping.myType.additionalData }" var="dataElement">
			<c:if test="${dataElement.specificationLevel eq 'SPECIFIED'}">
				<tr>
					<td>${dataElement.name}</td>
					<td>
						<form:input id="${dataElement.id}" cssClass="${dataElement.type}" path="attributes['${dataElement.name}']"/>
					</td>
				</tr>
			</c:if>
		</c:forEach>
	</table>
	
	<input class="hoverGreen" type="submit" name="Submit" value="Save my changes"/>
	<input class="hoverRed" type="submit" name="cancel" value="Cancel"/>

</form:form>

<c:if test="${not empty eventGrouping.childrenGroups}">
	<h2>${eventGrouping.myType.childType.name} events for this ${eventGrouping.myType.name}</h2>
	<table class="striped" cellspacing="0">
		<tr>
			<th>Name</th>
			<th>Actions</th>
		</tr>
		<c:forEach items="${eventGrouping.childrenGroups}" var="event">
			<tr>
				<td>${event.name}</td>
				<td>
					<c:if test="${not empty event.allVideos}">
						<a href="/video/video.htm?action=watch&eventGroupingId=${event.id}">Watch video</a> |
					</c:if>
					<c:choose>
						<c:when test="${not event.myType.leafType}">
							<a href="/eventSetup.htm?season=${season.id}&eventGroupingId=${event.id}">Create a new ${event.myType.childType.name}</a>
						</c:when>
						<c:otherwise>
							<a href="/take/gameStats.htm?id=${event.associatedEvent.id}">Take stats</a>
						</c:otherwise>
					</c:choose>
					| <a href="/eventGrouping.htm?id=${event.id}">Edit properties</a>
					<c:if test="${event.myType.index == 0}">
							|
						<a href="/importExport.htm?action=export&egId=${event.id}">Export</a>
					</c:if>
						| <a href="#" onclick='deleteObject(event, eventGroupings[${event.id}].name, ${event.id}, "/eventGrouping.htm")'>Delete</a>
				</td>
			</tr>
		</c:forEach>
		<tr class="thebottomrow">
			<td colspan="2">&nbsp;</td>
		</tr>
	</table>
</c:if>

</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>