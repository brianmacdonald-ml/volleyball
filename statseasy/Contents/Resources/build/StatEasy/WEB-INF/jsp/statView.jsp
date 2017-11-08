<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript" src="/js/jquery.metadata.js"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js"></script>
<script type="text/javascript" src="/js/stickyheaders.js"></script>
<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/seasonDisplay.js"></script>
<script type="text/javascript" src="/js/objectSelector.js"></script>
<script type="text/javascript" src="/js/statView.js"></script>

<link rel="stylesheet" href="/css/tableSort.css" type="text/css">

<div id="content">
    <div id="innercontent">
        <div class="middle">

<h2 class="titleBorder borderBelow">${viewObj.name} for ${season.team.teamName} - ${season.name} <a id="reportOptions" href="#">(Report Options)</a></h2>

<form method="get" action="/reports.htm" id="reportForm" style="display:none">
<h2 class="titleBorder smaller">
	With <a id="setGameDialogLink" href="#">the included games</a>, view the stats using 
	<select name="viewId">
	  <c:forEach items="${allViewObjs}" var="view">
	  	<c:set var="selected" value=""/>
  		<c:if test='${view.id == viewObj.id}'>
  			<c:set var="selected" value="selected='selected'"/>
  		</c:if>
		<option value="${view.id}-${view.type}" ${selected}>${view.name}</option>
	  </c:forEach>
	</select>
	focused on
	<select name="grouping">
	  <c:forEach items="${allGroupings}" var="grouping">
	  	<c:set var="selected" value=""/>
	  	<c:if test="${grouping.id == selectedGrouping.id}">
	  	  <c:set var="selected" value="selected='true'"/>
	  	</c:if>
		<option value="${grouping.id}" ${selected}>${grouping.name}</option>
	  </c:forEach>
	</select>
	using <a id="setPlayerDialogLink" href="#">All Players</a> 
	<input type="hidden" name="season" value="${season.id}"/>
	<input class="hoverGreen" type="submit" value="Go"/>
</h2>
<div style="display:none;padding: 10px;" id="showGamesDialog" title="The events included in the report">
<table class="striped forNow">
	<tr>
		<th width="75%"><img id='open_close_all' class='open_close' src='/images/minus.png'/><input type="checkbox" name="selectAllEvents" id="selectAllEvents"/><span style="margin-left: 10px">Name</span></th>
	</tr>
	<se:eventIter items="${topLevelGroupings}">
		<tr class="depth${depth} eventRow" id="eventId${event.id}">
			<td style="padding-left: ${10 + depth * 30}px">
				<c:if test="${not leaf}">
					<img class='open_close' src='/images/minus.png'/>
				</c:if>
				<input type="checkbox" name="egId" value="${event.id}"/>
				${event.name}
			</td>
		</tr>
	</se:eventIter>
</table>
</div>
</form>



<c:set var="includeVideoLinks" scope="page" value="true"/>
<c:set var="linkToUpgrade" scope="page" value="false"/>
<%@ include file="/WEB-INF/jsp/statViewContent.jsp" %>

<p><input class="hoverGreen" type="button" value="Done with this report"  onclick='javascript: window.location="/take.htm?season=${season.id}"'/></p>
</div>
</div></div>

<script type="text/javascript">

var allPlayers = ${playersInJson};
var eventGroupings = ${allGroupingsInJson};
var selectedGroupingIds = ${selectedGroupingIds};
var selectedPlayers = ${selectedPlayersInJson};

$(document).ready(function () {
	$(".tablesorter").tablesorter({ 
        // define a custom text extraction function 
        textExtraction: function(node) { 
            // extract data from markup and return it
            var childLinks = node.getElementsByTagName("a");
            if (childLinks.length > 0) {
            	return node.getElementsByTagName("a")[0].innerHTML;
            } else {
                return "0"; //node.childNodes[0].textContent;
            } 
        },
        sortInitialOrder: 'desc'
    });
	
	$('.tableSorter').stickyHeaders();
});
</script>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>