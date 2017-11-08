<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

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
	$(".tablesorter").tablesorter({
		sortList: [[0, 0]],
		headers: {  
            4: { // Fifth column, no sorting 
                sorter: false 
            },
		}
	}).stickyHeaders();
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">
<h2 class="titleBorder borderBelow"><a href="/configure/liveViews.htm?sportSelect=true" onclick='$.cookie("sport", "", { path : "/"})'>${sportName}</a> Live Views:</h2>

<table class="striped forNow tablesorter" id="mainTable">
  <thead>
	<tr>
	  <th>Display Name</th>
	  <th>Display Order</th>
	  <th>Info</th>
	  <th>Display During</th>
	  <th>Actions</th>
	</tr>
  </thead>
  <tbody>
  <c:forEach items="${allLiveViews}" var="liveView" varStatus="rowCounter">
	<tr>
	  <td>
	    ${liveView.displayName}
	  </td>
	  <td>${liveView.displayOrder}</td>
	  <td>${liveView.className} (v${liveView.version}) </td>
	  <td>${liveView.getDisplayInString()}</td>
	  <td>
		 <a href="/configure/liveViewForm.htm?id=${liveView.id}">Edit</a> |
		 <a href="#" onclick='deleteObject(event, "${liveView.displayName}", ${liveView.id}, "/configure/liveViewForm.htm")'>Delete</a>
	  </td>
	</tr>
  </c:forEach>
  </tbody>
    <tr class="thebottomrow">
   	  <td colspan="5">
	  	  <a href="/configure/liveViewForm.htm">Create a new live view</a>
   	  </td>
    </tr>
</table>


</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>