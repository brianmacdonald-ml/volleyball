<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>

<div id="content"><div id="innercontent">
<c:choose>
<c:when test="${not empty allTeams}">

<!-- 
	Team section 
-->
<h2>Select a season for one of the following teams:</h2>
    
<table cellspacing="0" class="striped" id="mainTable">
  <tr>
    <th>Team Name</th>
	<th>Seasons</th>
  </tr>
  <c:forEach items="${allTeams}" var="team" varStatus="teamCounter">
  <c:choose>
  	<c:when test="${team.autogenerated}">
  	  <tr class="autogenerated">
  	</c:when>
  	<c:otherwise>
	  <tr>
  	</c:otherwise>
  </c:choose>
	  <td>${team.teamName}</td>
	  <td>
		<c:choose>
		  <c:when test="${fn:length(team.allSeasons) != 0}">
			<ul>
		      <c:forEach items="${team.allSeasons}" var="season" varStatus="seasonCounter">
				<li><a href="/take.htm?season=${season.id}">${season.name} (${season.headCoach} & ${season.assistantCoach})</a></li>
		      </c:forEach>
			</ul>
		  </c:when>
		  <c:otherwise>
			You have no seasons for this team.  <a href="/teamAndSeasonSetup.htm">Set up a new season</a>
		  </c:otherwise>
		</c:choose>
      </td>
	</tr>
  </c:forEach>
	<tr class="thebottomrow">
		<td colspan="2"><a href="/teamAndSeasonSetup.htm">Set up a new team and season</a></td>
	</tr>
</table>

<script type="text/javascript">
$(document).ready(function () {
	AutogeneratedHider("#mainTable", 2, "teams");
});
</script>

</c:when>
<c:otherwise><h2>Welcome to your new sport, ${currentSport.name}.<br/><br/>Before you can start taking stats, you have to <a href="/teamAndSeasonSetup.htm">set up a new team and season</a></h2></c:otherwise>
</c:choose>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>