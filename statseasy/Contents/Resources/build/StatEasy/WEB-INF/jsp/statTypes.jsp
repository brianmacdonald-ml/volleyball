<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<script type="text/javascript" src="/js/jquery.metadata.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/stickyheaders.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js?sv=${serverVersion}"></script>
<link rel="stylesheet" href="/css/tableSort.css?sv=${serverVersion}" type="text/css">

<script type="text/javascript">
$(document).ready(function () {
	$(".tablesorter").tablesorter({
		sortList: [[0, 0]],
		headers: {  
            4: { // Fifth column, no sorting 
                sorter: false 
            },
		}
	});
	
	$('.tableSorter').stickyHeaders();
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow"><a href="/configure/stats.htm?sportSelect=true" onclick='$.cookie("sport", "", { path : "/"})'>${sportName}</a> Stats: </h2>

<c:choose>
  <c:when test="${not empty allStatTypes}">
	<table class="striped forNow tablesorter" id="mainTable">
	  <thead>
	    <tr>
		  <th>Name</th>
		  <th>Shortcut</th>
		  <th>Stat Sentence</th>
		  <th>StatEffect</th>
		  <th>Action</th>
	    </tr>
	  </thead>
	  <tbody>
	  <c:forEach items="${allStatTypes}" var="statType">
		<tr>
		  <td>${statType.name}</td>
		  <td>${statType.maskedShortcut}</td>
		  <td style="white-space:normal">
		  	<c:forEach items="${statType.fullSentence}" var="statData">
		  		${statData}
		  	</c:forEach>
		  </td>
		  <c:choose>
		  	<c:when test="${not empty statType.statEffect}">
		  	  <td>${statType.effectName} (v${statType.effectVersion})</td>
		  	</c:when>
		  	<c:otherwise>
		  	  <td>[None]</td>
		  	</c:otherwise>
		  </c:choose>
		  <td>
		  	<c:choose>
		  	  <c:when test="${not statType.privateStat}">
		  	  	<a href="/configure/statType.htm?id=${statType.id}">Edit</a>
		  	  	| <a href="/configure/statType.htm?action=delete&id=${statType.id}">Delete</a>
		  	  	&nbsp;
		  	  </c:when>
		  	  <c:otherwise>
		  	  	<a href="/configure/statType.htm?id=${statType.id}">Edit</a>
		  	  	| <a href="/configure/statType.htm?action=delete&id=${statType.id}">Delete</a>
		  	  </c:otherwise>
		  	</c:choose>
		  </td>
		</tr>
	  </c:forEach>
	  </tbody>
	  	<tr class="thebottomrow"><td colspan="5">
		  	  <a href="/configure/statType.htm">Create a new stat</a>
	  	</td></tr>
	</table>
  </c:when>
  <c:otherwise>
	<p>You don't have any stats configured. You must <a href="/configure/statType.htm">add some stats</a> before you can start taking them in a game.</p><br/>
  </c:otherwise>
</c:choose>

</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>