<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>

<html>
	<head>
		<title>The StatEasy Content Creator</title>
		<link rel="stylesheet" href="/css/tokens.css" type="text/css">
		<link rel="stylesheet" href="/css/print.css" type="text/css" media="print">
		<link rel="stylesheet" href="/css/jquery.autocomplete.css" type="text/css">

		<script src="/js/jquery-1.6.1.js" type="text/javascript"></script>
		<script src="/js/jquery.easing.1.3.js" type="text/javascript"></script>
		<script src="/js/jquery.corners.min.js" type="text/javascript"></script>
		<script src="/js/jquery.dropshadow.js" type="text/javascript"></script>
		<script src="/js/jquery.autocomplete.js" type="text/javascript"></script>
		
		<meta name="apple-mobile-web-app-capable" content="yes"/>
		
		<link rel="shortcut icon" href="/images/favicon_1.jpg" />
		
		<script type="text/javascript">
			$(document).ready(function(){

				$(".autofocus").focus();
			});
		</script>
		
	</head>

	<body>

<div id="container">
	<div id="header">
		<img src="/images/logo.png" class="headerLogo" />
		
		<c:if test="${mediaView != 'true'}"><div id="gameType"><span id="gameTypeInnerText"><a href="/hello.htm" title="Return to the Welcome page." class="noUnderline">Logout</a></span></div></c:if>

		<c:if test="${ not empty notificationMessage }">
			<div id="notification"><table id="notificationTable" class="${ notificationMessage.notificationType }"><tr><td>${ notificationMessage.message }</td></tr></table></div>
		</c:if>
		
		<div id="sportUpdates"></div>
	</div>
	<div id="navigation">
		<c:if test="${mediaView != 'true'}">
		<ul id="launch">
			<li class="main
				<c:if test="${viewName == 'launch' }">
					tabbed
				</c:if> 
			"><a href="/launch.htm" title="Select an action from the StatEasy dashboard">Dashboard</a></li>
		</ul>
		<ul id="config">
			<li class="main
				<c:if test="${viewName == 'configuration' }">
					tabbed
				</c:if> 
			">
			<c:set var="destUrl">/configure/stats.htm</c:set>
			<a href="${destUrl}" title="Configure your stats, reports, views, teams, or players">Configuration</a></li>
		</ul>
		<ul id="account">
			<li class="main">
			<a href="${serverUrl}" target="_blank">Social Sports Network</a>
			</li>
		</ul>
		<c:if test="${fn:length(tutorialLinks) > 0}">
		<ul id="account">
			<li class="main
			<c:if test="${viewName == 'tutorials' }">
					tabbed
				</c:if>">
			<a href="/tutorials.htm">${sportName} Tutorials</a>
			</li>
		</ul>
		</c:if>

		</c:if>

	</div>
