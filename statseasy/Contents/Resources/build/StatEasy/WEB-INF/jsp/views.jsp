<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css?sv=${serverVersion}" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js?sv=${serverVersion}" type="text/javascript"></script>
<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.metadata.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/stickyheaders.js?sv=${serverVersion}"></script>
<link rel="stylesheet" href="/css/tableSort.css?sv=${serverVersion}" type="text/css">
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js?sv=${serverVersion}"></script>

<script type="text/javascript">
$(document).ready(function () {
	$("#mainTable").tablesorter({ 
		sortList: [[0, 0]],
		headers: {  
            2: { // Third column, no sorting 
                sorter: false 
            },
		}
	}).stickyHeaders();
	$("#groupTable").tablesorter({ 
		sortList: [[0, 0]],
		headers: {  
            1: { // Second column, no sorting 
                sorter: false 
            },
		}
	}).stickyHeaders();
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">
<!-- 
	Views section 
-->
<h2 class="titleBorder borderBelow"><a href="/configure/views.htm?sportSelect=true" onclick='$.cookie("sport", "", { path : "/"})'>${sportName}</a> Stat Reports:</h2>

<table class="striped forNow tablesorter" id="mainTable">
  <thead>
	<tr>
	  <th>Name</th>
	  <th>Content</th>
	  <th>Actions</th>
	</tr>
  </thead>
  <tbody>
	<c:forEach items="${allViews}" var="view">
	  <tr>
		<td>
		  ${view.name}
		  <c:if test="${view.defaultView}">
		  	(Default)
		  </c:if>
		</td>
		<td>${view.contentRepresentation}</td>
		<c:choose>
			<c:when test="${view.type eq 'View'}">
			  <td>
			  	<a href="/configure/viewForm.htm?id=${view.id}">Edit</a> | 
			  	<a href="#" onclick='deleteObject(event, "${view.name}", ${view.id}, "/configure/viewForm.htm")'>Delete</a>
			  </td>
			</c:when>
			<c:otherwise>
				<td><a href="#" onclick='deleteObject(event, "${view.name}", ${view.id}, "/configure/viewForm.htm", {type: "SummaryView"})'>Delete</a></td>
			</c:otherwise> 
		</c:choose>
	  </tr>
	</c:forEach>
  </tbody>
  <tr class="thebottomrow">
	<td colspan="3">
		<a href="/configure/viewForm.htm">Create a new stat report</a>
	</td>
  </tr>
</table>

<!-- 
	Grouping section 
-->
<h2 class="titleBorder borderBelow">Named Groups:</h2>

<table class="striped forNow tablesorter stickyHeaderTable" id="groupTable">
  <thead>
	<tr>
	  <th>Name</th>
	  <th>Actions</th>
	</tr>
  </thead>
  <tbody>
	<c:forEach items="${allGroups}" var="group">
	  <tr>
		<td>
		  ${group.name}
		  <c:if test="${group.defaultGrouping}">(Default)</c:if>
		</td>
		<td>
		  <a href="/configure/namedGroup.htm?id=${group.id}">Edit</a>
		</td>
	  </tr>
	</c:forEach>
  </tbody>
  <tr class="thebottomrow">
	<td colspan="2">
		<a href="/configure/namedGroup.htm">Create a new named group</a>
	</td>
  </tr>
</table>

</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>