<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<div id="content">
	<div id="innercontent">
		<div class="middle" id="formContent">
			<form:form method="post">
				<input type="hidden" name="id" value="${agreement.id}"/>
				<h2>StatEasy User Agreements</h2>
				<p>Please click the button below if you've read the following agreement and agree to the terms:</p>
				<div class="agreementContainer">
				${agreement.content}
				</div>
				<input type="submit" class="hoverGreen" value="I've read the agreement and agree to the terms." />
			</form:form>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>