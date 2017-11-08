<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<div id="content"><div id="innercontent">

<h2>Which season would you like to collect stats for?</h2>
    
<ul>
  <c:forEach items="${team.allSeasons}" var="season" varStatus="seasonCounter">
	<li><a href="/take.htm?season=${season.id}">${season.name} (${season.headCoach} & ${season.assistantCoach})</a></li>
  </c:forEach>
</ul>

<a href="/configure/seasonForm.htm?team=${team.id}">Create a New Season for "${team.teamName}"</a>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>