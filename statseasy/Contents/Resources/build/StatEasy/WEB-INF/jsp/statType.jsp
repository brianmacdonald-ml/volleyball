<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<link type="text/css" href="/css/colorpicker.css?sv=${serverVersion}" rel="stylesheet" />
<script src="/js/colorpicker.js?sv=${serverVersion}" type="text/javascript"></script>

<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/createStat.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/wizardHelper.js?sv=${serverVersion}"></script>

<div id="content">
	<div id="innercontent">
		<div class="middle" id="formContent">
		<c:choose>
			<c:when test="${not empty statType.id}">
  				<script type="text/javascript">
  			      var PARSE_INFORMATION = "${ se:escapeJS(statType.parseInformation) }";
  			      var ADVANCED_PARSE = ${ statType.advanced };
  			      var PARSE_ERRORS = "${ parseError }";
  			      var inUse = "${inUse}";
  			      $(document).ready(function() {
  			         $("#step1").addClass("complete");
  			         $("#step2").addClass("complete");
  			         $("#step3").addClass("complete");
  			         $("#step4").addClass("complete");
  	  			  });
  			    </script>
                <h2 class="titleBorder">Edit this statistic</h2>
            </c:when>
	        <c:otherwise>
	            <script type="text/javascript">
	               var PARSE_INFORMATION = null;
  			       var ADVANCED_PARSE = ${ statType.advanced };
  			       var PARSE_ERRORS = "${ parseError }";
	               var inUse = false;
                   $(document).ready(function() {
                      $("#step1").addClass("complete");
                      $("#step2").addClass("notyet");
                      $("#step2stuff").hide();
                      $("#step3").addClass("notyet");
                      $("#step3stuff").hide();
                    });
	            </script>
                <h2 class="titleBorder">Set up a new statistic</h2>
	        </c:otherwise>
        </c:choose>
			<form:form method="post" commandName="statType" enctype="multipart/form-data" id="createStatForm">
				<h3 id="step1">Select a name and shortcut for your stat:</h3>
				<div id="step1stuff"> 
					<table>
					  <tr>
					    <td>Statistic name:</td>
					    <td><form:input cssClass="autoFocus" path="name"/></td>
					    <td id="nameError"><form:errors path="name" cssClass="formErrors"/></td>
					  </tr>
					  <tr>
					    <td>Shortcut key:</td>
					    <td>
					    	<form:input path="shortcut"/>
					    </td>
					    <td id="shortcutError"><form:errors path="shortcut" cssClass="formErrors"/></td>
					  </tr>
					  <tr>
					  	<td colspan="3"><span class="tinyHelpText">The shortcut is the key or set of keys (no spaces) you will type to take this stat during a game.</span></td>
					  </tr>
					  <tr>
					    <td>Double tap:</td>
					    <td colspan="2"><form:checkbox path="doubleTap" id="doubleTap"/></td>
					  </tr>
					  <tr>
					  	<td colspan="3"><span class="tinyHelpText">Double tap the shortcut key to activate the stat.</span></td>
					  </tr>
					  <c:choose>
						  <c:when test="${not empty statType.id}">
								  <tr>
								  	<td>Seek Time Offset</td>
								  	<td><form:input path="seekTimeOffset"/></td>
								  	<td><form:errors path="seekTimeOffset" cssClass="formErrors"/></td>
								  </tr>
								  <tr>
								  	<td>End Time Offset</td>
								  	<td><form:input path="endTimeOffset"/></td>
								  	<td><form:errors path="endTimeOffset" cssClass="formErrors"/></td>
								  </tr>
								  <tr>
								  	<td colspan="3"><span class="tinyHelpText">Time offsets help line everything up properly when you synchronize your stats with video.</span></td>
								  </tr>
							   </table>
						    </div>
	                      </c:when>
	                      <c:otherwise>
		                        </table>
				                <p><input type="button" class="hoverGreen" value="Done - I've selected my name and shortcut" id="step1IsComplete" /></p>
			                </div>
			                <div id="step1stuffResult" style="display:none;"></div>
	                      </c:otherwise>
                    </c:choose>
				<h3 id="step2">Set up the information required to take this stat</h3>
				<div id="step2stuff"> 
					<form:hidden path="parseInformation"/>
				<div id="step2contents">
				<c:choose>
				    <c:when test="${inUse}">
                        <div class="mediumIndent">
                            <p style="font-weight:bold;text-decoration: underline;">Stat Sentence:</p>
                            <div id="sortable" class="mediumIndent">
                                <i>No players or additional factors necessary for this stat.</i>
                            </div>
                            <p><span class="tinyHelpText">The sentence cannot be edited since this statistic is already in use.</span></p> 
                        </div>
				    </c:when>
				    <c:otherwise>
						<table>
						  <tr>
						    <td>Number of players involved in this stat:</td>
						    <td><input type="text" size="1" id="numOfPlayers" name="players"/></td>
						    <td id=numOfPlayersError></td>
						  </tr>
						  <tr>
						    <td>Number of additional factors you want to capture with this stat:</td>
						    <td><input type="text" size="1" id="amountOfData" name="data"/></td>
						    <td id="dataError"></td>
						  </tr>
						  <tr>
						  	<td colspan="3">
						  		<span class="tinyHelpText">Additional factors are simply arbitrary numbers you want to associate with the stat. For example, you might want to use a number to rate the stat or to specify the location where the stat took place.</span><br/></br>
						  		<a href="#" id="advancedStat">Create an advanced stat sentence</a></br>
						  		<span class="tinyHelpText">Click the link above when you want to set up a stat that uses a defined set of letters and/or numbers for your data points.</span><br/>
						  	</td>
						  </tr>
						  <tr>
						  </tr>
						</table>
						<div class="mediumIndent">
							<p style="font-weight:bold;text-decoration: underline;">Stat Sentence:</p>
							<div id="sortable" class="mediumIndent">
								<i>No players or additional factors necessary for this stat.</i>
							</div>
							<p><span class="tinyHelpText">Use the arrows to change the order in which the information is typed when you take the stat.</span></p>
						</div>
                    </c:otherwise>
                </c:choose>
                </div>
            <c:choose>
               <c:when test="${not empty statType.id}">
				  </div>
			   </c:when>
			   <c:otherwise>
			        <p><input type="button" class="hoverGreen" value="Done - I've set up the stat information" id="step2IsComplete" /></p>
                    </div>
                    <div id="step2stuffResult" style="display:none;"></div>
			   </c:otherwise>
			 </c:choose>
				<h3 id="step3">Set up the effect of this stat</h3>
				<div id="step3stuff"> 
					<table>
					  <tr>
					    <td>How does this stat change the game?</td>
					    <td colspan="2" width="300">
					    	<form:select path="statEffectSelect" id="statEffect">
					    		<form:option value="none" label="No change to the game"/>
					    		<c:forEach items="${allStatEffects}" var="statEffect">
					    			<form:option value="${statEffect.id}" label="${statEffect.friendlyName}"/> 
					    		</c:forEach>
					    		<form:option value="other" label="Upload a new one..."/>
					    	</form:select>
			 				<c:set var="statEffectErrors"><form:errors path="statEffect"/></c:set>
			 				<c:choose>
			 					<c:when test="${empty statEffectErrors}">
					    			<input id="uploadLocator" style="display:none" type="file" name="file"/>
					 				<input type="hidden" name="editEffect" value="0" id="editIndicator"/>
				 				</c:when>
				 				<c:otherwise>
					    			<input id="uploadLocator" type="file" name="file"/>
					 				<input type="hidden" name="editEffect" value="1" id="editIndicator"/>
				 				</c:otherwise>
				 			</c:choose>
			 				<form:errors path="statEffect" cssClass="formErrors"/>
					    </td>
					  </tr>
					  <tr>
					    <td>Does this stat take place at the end of a play?</td>
					    <td colspan="2"> 
					    	<select id="actionEndingSelection">
					    		<option value="No">No, it never does</option>
					    		<option value="Could">It could, but not always</option>
					    		<option value="Yes">Yes, always</option>
					    	</select>
					    </td>
					  </tr>
					</table>
					<form:hidden path="actionEndingStat"/>
				<c:choose>
				  <c:when test="${not empty statType.id}">
					<h3 id="step4">Set up the shot chart information for this stat</h3>
					<div id="step4stuff">
					  <table>
					  	<tr>
					  	  <td>Is this stat something you'd like to collect location information for?</td>
					  	  <td><form:checkbox path="locationAware" id="isLocationAware"/></td>
					  	  <td>&nbsp;</td>
					  	  <td rowspan="7" class="locationAware"><canvas id="locationSample"></canvas></td>
					  	</tr>
					  	<tr class="locationAware">
					  	  <td>How many points will you collect for this stat?</td>
					  	  <td><form:input path="pointCount" id="pointCount"/></td>
					  	  <td><form:errors path="shortcut" cssClass="formErrors"/></td>
					  	</tr>
						<tr class="locationAware">
						  <td colspan="3"><span class="tinyHelpText">Use '-1' if you'd like to draw a freehand line, '1' for a point, '2' for a straight line, etc.</span></td>
						</tr>
					  	<tr class="locationAware">
					  	  <td>What color should this stat have in your shot charts?</td>
					  	  <td>
					  	  	<form:hidden path="color" id="color"/>
					  	  	<div id="colorPickerHolder"></div>
					  	  </td>
					  	  <td><form:errors path="color" cssClass="formErrors"/></td>
					  	</tr>
					  	<tr class="locationAware isPoint">
					  	  <td>What shape should the location have?</td>
					  	  <td>
					  	  	<form:select path="shape">
					    		<form:option value="POINT" label="No shape"/>
					    		<form:option value="SQUARE" label="Square"/>
					    		<form:option value="CIRCLE" label="Circle"/>
					    	</form:select>
					  	  </td>
					  	  <td><form:errors path="shape" cssClass="formErrors"/></td>
					  	</tr>
					  	<tr class="locationAware isLine">
					  	  <td>How thick should the line be?</td>
					  	  <td><form:input path="lineWidth"/></td>
					  	  <td><form:errors path="lineWidth" cssClass="formErrors"/></td>
					  	</tr>
					  	<tr class="locationAware isLine">
					  	  <td>How should the line look?</td>
					  	  <td>
					  	  	<form:select path="lineStyle">
					    		<form:option value="DOTTED" label="Dotted"/>
					    		<form:option value="DASHED" label="Dashed"/>
					    		<form:option value="SOLID" label="Solid"/>
					    		<form:option value="DOUBLE" label="Double"/>
					    	</form:select>
					  	  </td>
					  	  <td><form:errors path="lineStyle" cssClass="formErrors"/></td>
					  	</tr>
					  </table>
					</div> 
					
					
					<p><input type="button" class="hoverGreen" value="Done - Save my changes" id="step3IsComplete" /></p>
					<p><span class="tinyHelpText">This is the last step. Clicking the <b>Done</b> button will create this stat.</span></p>
				    </div>
		            <h2 class="borderAbove"></h2>
		            <input type="button" class="hoverRed" value="Cancel - I don't want to edit this stat" onclick='javascript: window.location="/configure/stats.htm"' />
				  </c:when>
				  <c:otherwise>
				    <p><input type="button" class="hoverGreen" value="Done - I've set up the stat effects" id="step3IsComplete" /></p>
                    <p><span class="tinyHelpText">This is the last step. Clicking the <b>Done</b> button will create this stat.</span></p>
	                </div>
	                <div id="step3stuffResult" style="display:none;"></div>
		            <h2 class="borderAbove"></h2>
		            <input type="button" class="hoverRed" value="Cancel - I don't want to set up this stat" onclick='javascript: window.location="/configure/stats.htm"' />
				  </c:otherwise>
				</c:choose>
			</form:form>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>