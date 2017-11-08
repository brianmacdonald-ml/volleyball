<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<link rel="stylesheet" href="/css/jquery.validation/validationEngine.jquery.css?sv=${serverVersion}" type="text/css" media="screen" charset="utf-8" />
<script src="/js/jquery.validation/jquery.validationEngine-en.js?sv=${serverVersion}" type="text/javascript"></script>
<script src="/js/jquery.validation/jquery.validationEngine.js?sv=${serverVersion}" type="text/javascript"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/validateHelper.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/noUser.js?sv=${serverVersion}"></script>

<div id="content"><div id="innercontent">
<div id="formContent" class="middle">

<h1>Welcome to StatEasy!</h1>

<div class="tab_interface">

	<c:choose>
		<c:when test="${loginFirst and not registerNow}">
			<div id="b" class="tab active">LOGIN</div>
			<div id="a" class="tab last">REGISTER</div>
		</c:when>
		<c:otherwise>
			<div id="a" class="tab active">REGISTER</div>
			<div id="b" class="tab last">LOGIN</div>
		</c:otherwise>
	</c:choose>

	<div class="clear"></div>
	
	<div class="tabbody a">
	
		<!-- <form method="post" enctype="multipart/form-data" id="registerForm" action="${requestedUrl}"> -->
		<form:form commandName="registerForm" action="${requestedUrl}" method="post" enctype="multipart/form-data">
		
		<form:input type="hidden" path="action" id="action" value="register" />
		
			<p>To begin using StatEasy, we need to personalize your copy.
			<p>First, enter a valid email address - this will serve as your username. Then, create a password that will be used to identify you in the future.</p>
		
			<div class="signUpForm">
			<div class="field"><div class="label">Email:</div><form:input path="j_username" id="username2" type="text"/></div>
			<div class="field"><div class="label">Password:</div><form:input path="j_password" id="password2" type="password"/></div>
			<div class="field"><div class="label">Confirm Password:</div><input name="password_confirm" id="password2_confirm" type="password"/></div><br />
			<div class="field"><div class="label">Full Name:</div><form:input path="fullname" id="fullname" type="text"/></div>
			<div class="field"><div class="label">Phone Number:</div><form:input path="phoneNumber" id="phoneNumber" type="text"/></div>
			</div>
		
			<p>Finally, choose the sports you'd like to support.</p>
			
			<div class="signUpForm">
			<div class="field">
				<c:forEach items="${sportConfigurations}" var="config">
				<div class="sport_check"><form:input type="checkbox" path="sports" value="${config.name}" /> ${config.name}</div>
				</c:forEach>
			</div>
			<div class="clear"></div>
			<br />
			</div>
		
			<input type="button" id="register" name="register" value="Create your StatEasy user" class="hoverGreen"/>
			
		</form:form>
	
	</div>
	
	<div class="tabbody b">
	
		<form method="post" id="loginForm" action="${loginUrl}">
	
			<p>If you've already registered as a StatEasy user, enter your username and password here.</p>
		
			<div class="signUpForm">
			<div class="field"><div class="label">Email:</div><input name="j_username" id="username1" type="text"/></div>
			<div class="field"><div class="label">Password:</div><input name="j_password" id="password1" type="password"/></div>
			<input type="submit" id="login" name="login" value="Login to StatEasy" class="hoverGreen"/>
			<br/><br/>
			</div>
			<a href="${serverUrl}password.htm" target="_blank">Forgot your password?</a>
			<div class="clear"></div>
			
			<input type="hidden" name="action" id="action" value="login" />
			
		</form>
			
	</div>

</div>

</div>
</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>