<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<c:set var="currTeam" value="" />

<c:forEach items="${allViews}" var="view" varStatus="viewCounter">
	<c:if test="${currTeam != view.team}">
		<h2>${view.team.teamName}</h2>
	</c:if>
	<c:set var="isOpponentView" value="${!viewCounter.first}"/>
	<c:choose>
		<c:when test="${view.flipColRow}">
			<%@ include file="/WEB-INF/jsp/statViewTableRotated.jsp" %>
		</c:when>
		<c:otherwise>
			<%@ include file="/WEB-INF/jsp/statViewTable.jsp" %>
		</c:otherwise>
	</c:choose>
	
	<c:set var="currTeam" value="${view.team}" />
</c:forEach>
