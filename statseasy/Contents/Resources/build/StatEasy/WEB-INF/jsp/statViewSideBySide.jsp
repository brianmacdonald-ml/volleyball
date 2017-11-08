<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<c:set var="currentRowNumber" value="-1"/>
<c:set var="rowNumber" value="-1"/>

<table>
<c:forEach items="${allViews}" var="view" varStatus="viewCounter">
	<c:set var="colNumber" value="${viewCounter.index % numTeams}" />
	<c:if test="${colNumber == 0}">
		<c:set var="rowNumber" value="${rowNumber + 1}"/>
	</c:if>
	<c:set var="isOpponentView" value="${colNumber != 0}"/>
	
	<c:if test="${rowNumber != currentRowNumber}">
		<c:if test="${rowNumber != 0}"></tr></c:if>
		<tr>
	</c:if>
	
	<td style="vertical-align: top">
		<c:if test="${rowNumber == 0}">
			<h2>${view.team.teamName}</h2>
		</c:if>
		<c:choose>
			<c:when test="${view.flipColRow}">
				<%@ include file="/WEB-INF/jsp/statViewTableRotated.jsp" %>
			</c:when>
			<c:otherwise>
				<%@ include file="/WEB-INF/jsp/statViewTable.jsp" %>
			</c:otherwise>
		</c:choose>
	</td>
	
	<c:set var="currentRowNumber" value="${rowNumber}" />
</c:forEach>
	</tr>
</table>