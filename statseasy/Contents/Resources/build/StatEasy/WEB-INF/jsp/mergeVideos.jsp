<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>

<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<style type="text/css">
#mainTable td {
	cursor: move;
}
</style>
<script type="text/javascript">

function exchange(i, j, tableID)
{
	var oTable = document.getElementById(tableID);
	var trs = oTable.tBodies[0].getElementsByTagName("tr");
	
	if(i == j+1) {
		oTable.tBodies[0].insertBefore(trs[i], trs[j]);
	} else if(j == i+1) {
		oTable.tBodies[0].insertBefore(trs[j], trs[i]);
	} else {
		var tmpNode = oTable.tBodies[0].replaceChild(trs[i], trs[j]);
		if(typeof(trs[i]) != "undefined") {
			oTable.tBodies[0].insertBefore(tmpNode, trs[i]);
		} else {
			oTable.appendChild(tmpNode);
		}
	}
}

$(document).ready(function () {
	var originalRowIndex = undefined;
	$("#mainTable tr").bind("dragstart", function (ev) {
        var dt = ev.originalEvent.dataTransfer;
        var target = ev.originalEvent.target;
        
        dt.setDragImage( target, 0, 0 );
        
        dt.setData("stateasy/rowIndex", this.rowIndex);
        originalRowIndex = this.rowIndex;
        
		this.style.opacity = '0.4';

		return true;
	}).bind("dragend", function (ev) {
		this.style.opacity = '1';

		return false;
	}).bind("dragover", function (ev) {
		if ($(this).hasClass("nonDraggable")) {
			return;
		}
		if (ev.preventDefault) {
			ev.preventDefault();
		}
        var dt = ev.originalEvent.dataTransfer;
        var currentRowIndex = this.rowIndex;

        if (originalRowIndex != currentRowIndex) {
			exchange(originalRowIndex, currentRowIndex, "mainTable");
			originalRowIndex = currentRowIndex;
        }

		return false;
	});

	$("#mergeVideos").click(function (ev) {
		if (!validateNotEmpty("newName", "You must provide a name for this video.")) {
			return false;
		}
		
		var elemsToAdd = "";
		$("#mainTable tr").each(function (index, elem) {
			if (!$(elem).hasClass("nonDraggable")) {
				console.log("Adding " + $(elem).attr("id") + " with index " + index);
				elemsToAdd += "<input type='hidden' name='" + $(elem).attr("id") + "' value='" + index + "'/>";
			}
		});
		$("#mainTable").after(elemsToAdd);
	});
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Merge ${fn:length(allVideos)} videos into one continuous video:</h2>

<form method="post">
<input type="hidden" name="action" value="merge"/>

<table>
	<tr>
		<td>New Name:</td>
		<td><input type="input" name="newName" id="newName" class="autofocus" value="${commonName}" size="60"/></td>
	</tr>
</table>

<span class="tinyHelpText">
Arrange these videos in the order you would like them to be in the new video.
<br/><br/></span>

<table cellspacing="0" class="striped forNow" id="mainTable">
  <tr class="nonDraggable">
    <th>Video Name</th>
    <th>Duration</th>
	<th>Event</th>
  </tr>
  <c:forEach items="${allVideos}" var="video" varStatus="status">
  	<tr draggable="true" id="video${video.id}">
  	  <td>
  	  	${video.displayName}
  	  </td>
  	  <td><script type="text/javascript">document.write(toTimeString(${video.duration}, 2))</script></td>
	  <c:choose>
	  	<c:when test="${ not empty video.eventGrouping}">
		  	<td>
		  		<ul>
		  		<c:forEach items="${video.eventGrouping.groupingHeirarchy}" var="parentGroup">
		  			<li>${parentGroup.name}</li>
		  		</c:forEach>
		  		</ul>
		  	</td>
	  	</c:when>
	  	<c:otherwise>
	  		<td>No event for this video</td>
	  	</c:otherwise>
	  </c:choose>
	</tr>
  </c:forEach>
  <tr class="thebottomrow nonDraggable">
  	<td colspan="5">&nbsp;</td>
  </tr>
</table>

<input type="submit" value="Done - Merge these videos" class="hoverGreen" id="mergeVideos"/>
<input type="submit" name="submit" value="Cancel" class="hoverRed"/>

</form>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>