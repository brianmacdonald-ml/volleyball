<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>
<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>
<script type="text/javascript">
	var NUMBER = "${number}";
	var SUM = "${sum}";
	var AVERAGE = "${average}";
	var columns = new Array();
	var actionUrl = '/configure/viewForm.htm';
	var viewId = "${view.id}";
	var viewObj = ${viewJSON};
	
	function error(name, description) {
		var start = name.indexOf("[");
		var end = name.indexOf("]");  
		if (start > 0 && end > 0 && end > start) {
			  this.name = name.substr(start + 1,end-start-1);
		} else {
			this.name = "None";
		}
		this.description = description;
	}
	var errors = new Array();
    <c:forEach items="${errors.fieldErrors}" var="error">
        errors.push(new error("${error.field}","${error.defaultMessage }"));
    </c:forEach>
    
    <c:if test="${empty view.id and empty errors}">
    $(document).ready(function() {
        $("#step2stuff").hide();
        $("#step1IsComplete").show();
        $("#step2").addClass("notyet");
        $("#step1").removeClass("complete");
        $("#step2").removeClass("complete");
    });
    </c:if>
	
</script>

<script type="text/javascript" src="/js/wizardHelper.js"></script>
<script type="text/javascript" src="/js/configureView.js"></script>

<div id="content"><div id="innercontent">
    <div class="middle" id="formContent">


<div style="display:none;padding: 10px;" id="addNewColumnDialog" title="Add new column">
	<table>
	  <tr>
	    <td style="white-space:nowrap;">Column name:</td>
	    <td><input type="text" id="columnName" name="columnName"/></td>
	    <td id="columnNameError"></td>
	  </tr>
	</table>
	<div>
		<p style="text-decoration:underline;">Column calculation:</p>
		<div id="performSimpleInput">
			Show the 
			<select id="functionName">
				<option>${number}</option>
				<option>${sum}</option>
				<option>${average}</option>
			</select>
			of each
			<select id="allStats">
				<c:forEach items="${allStatTypes}" var="statType" varStatus="rowCounter">
					<option value="${statType.id }" id="allStats_${statType.id }">${statType.name}</option>
				</c:forEach>
			</select>
			<select id="dataStats" style="display:none;">
				<c:forEach items="${allDataStatTypes}" var="statType" varStatus="rowCounter">
					<option value="${statType.id }" id="dataStats_${statType.id }">${statType.name}</option>
				</c:forEach>
			</select>
		</div>
		<div id="performAdvancedInput" style="display: none;text-align: center;">
			<textarea name="definition" style="width: 75%;" id="definitionInput" rows="4"></textarea><br/>
			<input type="radio" name="formatType" value="number" checked/>Number
			<input type="radio" name="formatType" value="percent"/>Percent
			<input type="radio" name="formatType" value="time"/>Time
		</div>
		<div style="margin-top: 10px;text-align: right;" id="performAdvancedLink">
			or <a href="javascript: enableAdvanced();">perform an advanced calculation.</a>
		</div>
		<div style="margin-top: 10px;text-align: right; display: none;" id="performSimpleLink">
			or <a href="javascript: enableSimple();">go back to the simple calculation.</a>
		</div>
	</div>
</div>

<div style="display:none;padding: 10px;" id="addNewColumnGroupDialog" title="Add new column group">
	<table>
	  <tr>
	    <td style="white-space:nowrap;">Column Group Name:</td>
	    <td><input type="text" id="columnGroupName" name="columnGroupName"/></td>
	    <td id="columnGroupNameError"></td>
	  </tr>
	  <tr>
	    <td style="white-space:nowrap;"># of First Column:</td>
	    <td><input type="text" id="columnGroupStartIndex" name="columnGroupStartIndex"/></td>
	    <td id="columnGroupStartIndexError"></td>
	  </tr>
	  <tr>
	    <td style="white-space:nowrap;"># of Last Column:</td>
	    <td><input type="text" id="columnGroupEndIndex" name="columnGroupEndIndex"/></td>
	    <td id="columnGroupEndIndexError"></td>
	  </tr>
	</table>
</div>

<c:choose>
  <c:when test="${empty view.id}">
		<h2 class="titleBorder">Create a new Stat Report:</h2>
  </c:when>
  <c:otherwise>
        <h2 class="titleBorder">Edit Stat Report: ${view.name}</h2>
  </c:otherwise>
</c:choose>
		<div id="steps">
			<form:form method="post" commandName="view" id="viewForm">
				<h3 id="step1" class="complete">Set up general information</h3>
				<div id="step1stuff">
					<table>
					  <tr>
					    <td>Name of this report:</td>
					    <td><form:input cssClass="autofocus" size="20" path="name"/></td>
					    <td id="reportNameError"><form:errors path="name" cssClass="formErrors"/></td>
					  </tr>
					  <tr>
					    <td>Include a row of totals in the report:</td>
					    <td><form:checkbox path="totalRow"/> Yes</td>
					    <td></td>
					  </tr>
					  <tr>
					    <td>Flip the rows of this report with the columns:</td>
					    <td><form:checkbox path="flipColRow"/> Yes</td>
					    <td></td>
					  </tr>
					  <tr>
					    <td>Include opponents in the main table:</td>
					    <td><form:checkbox path="mergeOpponentTables"/> Yes</td>
					    <td></td>
					  </tr>
					  <tr>
					    <td>Hide this report from the main dropdown:</td>
					    <td><form:checkbox path="hidden"/> Yes</td>
					    <td></td>
					  </tr>
					</table>
					<p><input type="button" class="hoverGreen" value="Done - I've named my report" id="step1IsComplete" style="display:none;"/></p>
				</div>
				<div id="step1stuffResult" style="display:none;">
				</div>
				<h3 id="step2" class="complete">Configure columns & groups for your report</h3>
				<div id="step2stuff" style="">
					<div style="margin-left:auto;margin-right: auto;width: 80%;">
						<span style="font-size: 18px;font-weight:bold;">List of columns for this report:</span>
						<table cellspacing="0" class="striped edit" id="mainTable" style="border: 3px solid #666;width:100%; padding: 10px;margin-bottom: 4px;">
						  <tr>
						  	<th width="10px">Order</th>
						    <th>Name</th>
						    <th>Data to display</th>
						    <th width="16px">&nbsp;</th>
						  </tr>
						  <c:if test="${empty view.allColumns}">
					          <input id="columnCount" name="columnCount" value="0" type="hidden"/>
	                          <tr id="noEntriesYet">
	                            <td colspan="4">No columns yet.<br>Add a new one using the link below.</td>
	                          </tr>
						  </c:if>
						</table>
                        <c:if test="${not empty view.allColumns}">
                            <input id="columnCount" name="columnCount" value="${fn:length(view.allColumns)}" type="hidden"/>
                            <c:forEach items="${view.allColumns}" var="column" varStatus="rowCounter">
                                  <script type="text/javascript">
                                      newStatColumn = new statColumn("${ column.name }", "${ column.formOperand }", "${ column.formColumnId }", $("#" + activeSelection + "_${ column.formColumnId }").text(), "${ column.definition }", "${ column.id }", "${ column.formatType }");
                                      // Increment both counters
                                      rowCounter++;
                                      actualColumnCount++;
                                      
                                      // Add the new statColumn to the table
                                      $("#mainTable").append( makeANewStatColumn(newStatColumn, rowCounter, actualColumnCount) );
                                      
                                      // Update the column count
                                      updateColumnCount();
                                  </script>               
                            </c:forEach>
                        </c:if>
						<p style="margin-top:0;">
							<a href="javascript:showColumnDialog();" style="font-size: 15px;" id="showColumnD">Add a new column</a>
						</p>
					</div>
					<div style="margin-left:auto;margin-right: auto;width: 80%;">
						<span style="font-size: 18px;font-weight:bold;">List of column groups for this report:</span>
						<table cellspacing="0" class="striped edit" id="columnGroupTable" style="border: 3px solid #666;width:100%; padding: 10px;margin-bottom: 4px;">
						  <tr>
						    <th>Name</th>
						    <th># of First Column</th>
						    <th># of Last Column</th>
						    <th width="16px">&nbsp;</th>
						  </tr>
						  <c:if test="${empty view.allGroups}">
	                          <tr id="noGroupEntries">
	                            <td colspan="4">No column groups yet.<br>Add a new one using the link below.</td>
	                          </tr>
						  </c:if>
						</table>
						<p style="margin-top:0;">
							<a href="javascript:showColumnGroupDialog();" style="font-size: 15px;" id="showColumnD">Add a new column group</a>
							<br></br><span class="tinyHelpText">Use a column group when you want to group two or more columns together by creating a generic header/title that spans the top of the grouped columns.</span>	
						</p>
					</div>
				<input type="hidden" name="deletedColumnIds" id="deletedColumnIds" value=""/>
				<input type="hidden" name="deletedColumnGroupIds" id="deletedColumnGroupIds" value=""/>
				 <c:choose>
                  <c:when test="${empty view.id}">
                    <p><input type="submit" class="hoverGreen" value="Done - create this report" id="columnsAreGood" /></p>
                    <p><span class="tinyHelpText">This is the last step. Clicking the <b>Done</b> button will create the report.</span></p>
                  </c:when>
                  <c:otherwise>
                    <input class="hoverGreen" type="submit" name="Submit" value="Save my changes"/>
                  </c:otherwise>
                </c:choose>
				</div>
			</form:form>
		</div>
		<h2 class="borderAbove"></h2>
		<input type="button" class="hoverRed" value="Cancel - I don't want to create this report" onclick='javascript: window.location="/configure/views.htm"' />

    </div>
</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>