<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>

<c:choose>
  <c:when test="${not sideBySide}">
	<%@ include file="/WEB-INF/jsp/statViewSimple.jsp" %>
  </c:when>
  <c:otherwise>
  	<%@ include file="/WEB-INF/jsp/statViewSideBySide.jsp" %>
  </c:otherwise>
</c:choose>