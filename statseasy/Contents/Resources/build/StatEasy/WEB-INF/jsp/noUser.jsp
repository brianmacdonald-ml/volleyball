<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<link rel="stylesheet" href="/css/jquery.validation/validationEngine.jquery.css" type="text/css" media="screen" charset="utf-8" />
<script src="/js/jquery.validation/jquery.validationEngine-en.js" type="text/javascript"></script>
<script src="/js/jquery.validation/jquery.validationEngine.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript" src="/js/validateHelper.js"></script>
<script type="text/javascript" src="/js/noUser.js"></script>

<div id="content"><div id="innercontent">
<div id="formContent" class="middle">

<h1>Welcome to StatEasy!</h1>

<div class="tab_interface">

	<div id="a" class="tab active">REGISTER</div>
	<div id="b" class="tab last">LOGIN</div>
	<div class="clear"></div>
	
	<div class="tabbody a">
	
		<!-- <form method="post" enctype="multipart/form-data" id="registerForm" action="${requestedUrl}"> -->
		<form:form commandName="registerForm" action="${requestedUrl}" method="post" enctype="multipart/form-data">
		
		<form:input type="hidden" path="action" id="action" value="register" />
		
			<p>To begin using StatEasy, we need to personalize your copy.
			<p>First, enter a valid email address - this will serve as your username. Then, create a password that will be used to identify you in the future.</p>
		
			<div class="signUpForm">
			<div class="field"><div class="label">Email:</div><form:input path="username" id="username2" type="text"/></div>
			<div class="field"><div class="label">Password:</div><form:input path="password" id="password2" type="password"/></div>
			<div class="field"><div class="label">Confirm Password:</div><input name="password_confirm" id="password2_confirm" type="password"/></div>
			<div class="field"><div class="label">Phone Number:</div><form:input path="phoneNumber" id="phoneNumber" type="text"/></div>
			</div>
		
			<p>We'd love to hear a little bit about why you downloaded StatEasy.</p>
			
			<div class="signUpForm">
			<div class="field">
			<form:select path="interestLevel.role" id="why_download">
				<option value="-1">-- Please choose the best option --</option>
				<option value="COACH">I'm an interested coach or assistant coach</option>
				<option value="PARENT">I'm an interested parent or relative</option>
				<option value="CURIOUS">I'm just curious</option>
				<option value="OTHER">Other...</option>
			</form:select>
			</div>
			
			<div class="coach_followup parent_followup followup">
				<div class="field">
					<div class="label">Level:</div><form:select path="interestLevel.level" id="level">
						<option value="HIGH_SCHOOL">High School</option>
						<option value="COLLEGE">College</option>
						<option value="OTHER">Other</option>
					</form:select>
				</div>
				<div class="field">
					<div class="label">Sport:</div><form:input path="interestLevel.sport" id="sport" type="text" />
				</div>
				<div class="field">
					<div class="label">School:</div><form:input path="interestLevel.school" id="school" type="text" />
				</div>
				<div class="field">
					<div class="label">Team(s):</div><form:input path="interestLevel.teams" id="teams" type="text" />
				</div>
			</div>
			
			<div class="other_followup followup">
				<div class="field">
					<div class="label">Reason:</div><form:input path="interestLevel.otherReason" id="otherReason" type="text" />
				</div>
			</div>
			</div>
		
			<p>To customize your copy of StatEasy, provide a logo for your team or school.</p>
		
			<div class="signUpForm">
			<div class="field"><div class="label">Logo:</div><form:input path="logo" id="logo" type="file" /></div>
			</div>
		
			<p>Finally, choose the sports you'd like to support for your trial.</p>
			
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
	
		<form method="post" enctype="multipart/form-data" id="loginForm" action="${requestedUrl}">
	
			<p>If you've already registered as a StatEasy user, enter your username and password here.</p>
		
			<div class="signUpForm">
			<div class="field"><div class="label">Email:</div><input name="username" id="username1" type="text"/></div>
			<div class="field"><div class="label">Password:</div><input name="password" id="password1" type="password"/></div>
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