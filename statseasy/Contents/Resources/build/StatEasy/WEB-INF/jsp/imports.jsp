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

<script type="text/javascript">
function downloadEvent(jsEvent, uuid, msgId, url) {
	$('#shared_' + msgId).find(".downloadLink").html("Downloading event...");
	var download_url = "/take/gameStats.htm?id=";
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	var data = {
		uuid : uuid,
		msgId : msgId
	}
	
	$.post(url, data, function(resp) {
		var obj = JSON.parse(resp);
		$('#shared_' + obj.msgId).find(".downloadLink").html("Event downloaded. Video may not be available yet. <a href='" + download_url + obj.id + "'>Go there</a>");
	});
	
	
}

function dismissMessage(jsEvent,msgId,url){
	$('#shared_' + msgId).hide();
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	var data = {
		msgId : msgId
	}
	
	$.post(url, data, function(resp) {
		var obj = JSON.parse(resp);
	});
}
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Manage and review your imports:</h2>
<span class="tinyHelpText">To import a file into StatEasy, simply drag and drop the file onto the small <b>StatEasy is running...</b> window or click the <b>Browse to files...</b> button on that window.<br/><b>You must review all newly imported files in order to complete the import process for them.</b> After the process is complete, you will be able to view the imported information in StatEasy.<br/><br/></span>
    
<table cellspacing="0" class="striped forNow" id="mainTable">
  <thead>
  <tr>
    <th>File Name</th>
    <th>Import Status</th>
	<th>Date Imported</th>
	<th>Event</th>
	<th>&nbsp;</th>
  </tr>
  </thead>
  <tbody>
  <c:forEach items="${allImports}" var="statImport">
  	  <c:choose>
  	    <c:when test="${statImport.status == 'CONFIRMED'}">
  	      <tr>
  	    	<td>${statImport.fileName}</td>
  	    	<td>Complete</td>
  	    </c:when>
  	    <c:otherwise>
  	      <tr class="needsReview">
  	        <td><a href="/importExport.htm?action=review&id=${statImport.id}&season=${season}">${statImport.fileName}</a></td>
  	    	<td><a href="/importExport.htm?action=review&id=${statImport.id}&season=${season}">Needs to be reviewed</a></td>
  	    </c:otherwise>
  	  </c:choose>
  	  <td><fmt:formatDate value="${statImport.importDate}" type="both"/></td>
	  <c:choose>
		<c:when test="${not empty statImport.resultingGroup}">
		  <td>
			<ul>
			  <c:forEach items="${statImport.resultingGroup.groupingHeirarchy}" var="parentGroup">
				<li>${parentGroup.name}</li>
			  </c:forEach>
			</ul>
		  </td>
		  <td>&nbsp;</td>
	 	</c:when>
		<c:otherwise>
		  <td><a href="/importExport.htm?action=review&id=${statImport.id}&season=${season}">No event - Needs to be reviewed</a></td>
		  <td><img class='delete' onclick='deleteObject(event, "${statImport.fileName}", ${statImport.id}, "/importExport.htm", {season: ${season}})' src='/images/close.png'/></td>
		</c:otherwise>
	  </c:choose>
	</tr>
  </c:forEach>
  </tbody>
</table>

<c:if test="${fn:length(sharedContentByUser) > 0}">
	<h2>Shared Content</h2>
	<table cellspacing="0" class="striped forNow" id="mainTable">
	<tr>
		<th>From User</th>
		<th>Content</th>
		<th>Actions</th>
	</tr>
	<c:forEach items="${sharedContentByUser}" var="entry">
		<c:forEach items="${entry.value}" var="event">
			<tr id="shared_${event.id}">
			<td>${entry.key}</td>
			<td>${event.info}</td>
			<td class="downloadLink">
				<a href="#" onclick='downloadEvent(event, "${event.objectUuid}", ${event.id}, "/importExport.htm?action=download")'>Download</a>
				| <a href="#" onclick='dismissMessage(event, ${event.id}, "/importExport.htm?action=dismiss")'>Dismiss</a>
			</td>
			</tr>
		</c:forEach>
	</c:forEach>
	</table>
</c:if>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>