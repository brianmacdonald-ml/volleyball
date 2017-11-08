<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>


<script type="text/javascript">
	function error(name, description) {
	    this.name = name;
	    this.description = description;
	}
	var errors = new Array();
	<c:forEach items="${errors.fieldErrors}" var="error">
	    errors.push(new error("${error.field}","${error.defaultMessage}"));
	</c:forEach>
	
</script>

<script type="text/javascript" src="/js/seasonDisplay.js"></script>
<script type="text/javascript" src="/js/autocomplete.js"></script>
<script type="text/javascript" src="/js/date.js"></script>
<script type="text/javascript" src="/js/eventGrouping.js"></script>
<script type="text/javascript" src="/js/setupEvent.js"></script>

<script type="text/javascript">

    // Used for autocomplete
    var teamNames = ${opponentsInJson};

	// This is used for the pop up.
	var eventGroupings = ${allGroupingsInJson};
	var eventSerieses = ${eventSeriesInJson};
	<c:if test="${not empty selectedSeriesId}">
	   selectedSeriesId = ${selectedSeriesId};
	</c:if>
    <c:if test="${not empty selectedEventId}">
       selectedEventId = ${selectedEventId};
    </c:if>

	// Used for creating dates
	var rightNow = new Date();
	
</script>

<se:displayTypeNames var="topLevelGroupNames" allSeries="${eventSeries }"/>

<div id="content"><div id="innercontent">

<div class="middle" id="formContent">
<h2 class="titleBorder">
	<c:choose>
		<c:when test="${not empty gameId}">
			Create or pick a match for your game
		</c:when>
		<c:otherwise>
			Set up a new
			${topLevelGroupNames}
		</c:otherwise>
	</c:choose>
</h2>

	<div id="steps">
		<h3 id="step1">Create or choose a ${topLevelGroupNames}</h3>
		<form:form method="post" commandName="eventForm" id="eventForm">
		<input type="hidden" name="seasonId" value="${season}" />
		<div id="step1stuff">
			<p><input type="radio" name="createOrChoose" checked value="old" id="oldTeamRadio" class="radio"/>Create a new 
			<select id="actionInput" name="actionId">
	            <c:forEach items="${ topLevelTypes }" var="eventType" varStatus="counter">
                    <option selected value="${eventType.id}">${eventType.name}</option>
	            </c:forEach>
			</select>
			</p>
			<p style="padding-left:45px;margin-top:0px;margin-bottom:0px;font-weight:bold;">or</p>
			<p><input type="radio" name="createOrChoose" value="new" id="existingEventRadio" class="radio"/>
			     <a id="chooseExistingEventGrouping" class="noHref">Choose an existing
			      ${topLevelGroupNames}
			     </a>
			</p>
			<p><input type="button" class="hoverGreen" value="Done - I've selected my action" id="actionIsChosen" /></p>
		</div>
		<div id="step1stuffResult" style="display:none;">
		</div>
		<h3 id="step2" class="notyet">General information</h3>
		<div id="step2stuff" style="display:none;">
            <div id="step2DynamicStuff">
            
            </div>
			<p><input type="submit" class="hoverGreen" value="Done - Create this event" id="allInfoGathered" /></p>
		</div>
		</form:form>
	</div>
	<h2 class="borderAbove"></h2>
	<input type="button" class="hoverRed" value="Cancel - I don't want to set up this event right now" onclick='javascript: window.location="/launch.htm"' />
</div>

<div style="display:none;padding:10px;" id="selectEvent" title="Assign to which event?">
	<table style="width:100%" cellspacing="0" class="headers striped forNow">
		<tr>
			<th><img id='open_close_all' class='open_close' src='/images/minus.png'/><span style="margin-left: 10px">Name</span></td>
		</tr>
		<se:eventIter items="${topLevelGroupings}">
			<tr class="depth${depth} eventRow" id="eventId${event.id}">
				<td style="padding-left: ${10 + depth * 30}px">
					<c:if test="${not leaf}">
						<img class='open_close' src='/images/minus.png'/>
						<input type="radio" name="eventId" value="${event.id}"/>
					</c:if>
					${event.name}
				</td>
			</tr>
		</se:eventIter>
		<tr class="thebottomrow">
			<td>&nbsp;</td>
		</tr>
	</table>
</div>

</div></div>
<form:form method="post" commandName="eventForm" id="hiddenForm">
<c:forEach items="${ eventSeries }" var="thisSeries">
    <div id="infoFor${thisSeries.id}" style="display: none;">
        <input type="hidden" name="selectedSeries" value="${thisSeries.id}"/>
        <c:forEach items="${thisSeries.series}" var="eventType" varStatus="x">
            <div class="eventIndex${x.index} eventGrouping">
                <h4>Information for the new ${eventType.name}</h4>
                <table class="secondLevel">
                <c:if test="${eventType.opponentSpecLevel eq 'SPECIFIED'}">
                  <tr>
                    <td>Opponent</td>
                    <td>
                    
                       <div class="chooseOpponent">
                       <form:input id="opponent_${eventType.id}" path="eventGroupings[${x.index}].attributes[opponent]" cssClass="acInput" autocomplete="off"/>
                       <c:if test="${not empty opponents}">
                       	   <div id="opponent_${eventType.id}_resize" class="acResize">
	                       <div id="opponent_${eventType.id}_select" class="acSelector">
		                       <table cellspacing="0" class="striped">
		                       	 <c:forEach items="${opponents}" var="opponent">
		                       	   <tr id="opponent_${eventType.id}_row_${opponent.id}">
		                       	   	 <td><input id="opponent_${eventType.id}_radio_${opponent.id}" type="radio" name="opponent_${eventType.id}_radio" value="${opponent.teamName}" tabindex="-1"/> ${opponent.teamName}</td>
		                       	   </tr>
		                       	 </c:forEach>
		                       </table>
	                       </div>
	                       </div>
                       </c:if>
                       </div>
                       
                       <script type="text/javascript">
                       $('.chooseOpponent').autocomplete(teamNames, "opponent_${eventType.id}_", "team", ['name'], 'name');
                       </script>
                       
                    </td>
                  </tr>
                </c:if>
                <c:forEach items="${ eventType.additionalData }" var="dataElement">
                  <c:if test="${dataElement.specificationLevel eq 'SPECIFIED'}">
                    <tr>
                        <td>${dataElement.name}</td>
                        <td>
                            <form:input cssClass="${dataElement.type}"
                                path="eventGroupings[${x.index}].attributes[${dataElement.name}]"
                                id="dataElement_${eventType.id}_${dataElement.id}"/>
                        </td>
                    </tr>
                  </c:if>
                </c:forEach>
                </table>
            </div>
        </c:forEach>
    </div>
</c:forEach>
</form:form>



<%@ include file="/WEB-INF/jsp/footer.jsp" %>