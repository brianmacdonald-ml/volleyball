
<c:set var="requestUrl" scope="page">/reports.htm?${urlArgs}</c:set>

<table class="striped tablesorter statTable" id="team${view.team.id}">
<thead>
  <c:if test="${not empty view.allGroups }">
  <tr class="columnGroup">
  	<c:choose>
  	  <c:when test="${not empty view.additionalColumnName}">
  	  	<td>&nbsp;</td>
  	  	<td class="separatorCol">&nbsp;</td>
  	  	<c:set var="groupNameClass" scope="page" value=""/>
  	  </c:when>
  	  <c:otherwise>
  	  	<c:set var="groupNameClass" scope="page" value="separatorCol"/>
  	  	<td class="separatorCol">&nbsp;</td>
  	  </c:otherwise>
  	</c:choose>
  	<c:forEach items="${view.allGroups }" var="group">
  	  <c:if test="${group.columnCountBefore > 0}">
		<td class="separatorCol" colspan="${group.columnCountBefore}">&nbsp;</td>
  	  </c:if>
  	  <td class="separatorCol" colspan="${group.colspan }">${group.name }</td>
  	</c:forEach>
  </tr>
  </c:if>
  <tr>
  	<th class="${groupNameClass}">${groupingObj.name}</th>
  	<c:if test="${not empty view.additionalColumnName}">
  	  <th class="{sorter: 'digit'} separatorCol">${view.additionalColumnName}</th>
  	</c:if>
	<c:forEach items="${view.allColumns}" var="column">
	  <c:choose>
		<c:when test="${column.separator}">
		  <c:set var="thisColumnStyle" scope="page" value="separatorCol"/>
		</c:when>
		<c:otherwise>
		  <c:set var="thisColumnStyle" scope="page" value=""/>
		</c:otherwise>
	  </c:choose>
	  <th class="{sorter: 'digit'} ${thisColumnStyle}">${column.name}</th>
	</c:forEach>
  </tr>
 </thead>
 <tbody>
  <c:forEach items="${view.groups}" var="group" varStatus="rowCounter">
	<tr id="${group.id}">
	  <c:choose>
	  	<c:when test="${includeVideoLinks}">
	  	  <c:url var="url" value="${requestUrl}">
	  	  	<c:param name="action" value="watch" />
	  	  	<c:param name="row" value="${group.id}" />
	  	  	<c:param name="team" value="${view.team.id}" />
	  	  	<c:param name="op" value="${isOpponentView}" />
	  	  	<c:param name="viewIndex" value="${view.viewIndex }" />
	  	  </c:url>
	  	  <td class="${groupNameClass}">
	  	  	<c:choose>
	  	  	<c:when test="${includeVideoLinks}">
	  	  		<a href="${url}">${group.name}</a>
	  	  	</c:when>
	  	  	<c:when test="${linkToUpgrade}">
	  	  		<a href="#" class="linkToUpgrade">${group.name}</a>
	  	  	</c:when>
	  	  	<c:otherwise>
	  	  		${group.name}
	  	  	</c:otherwise>
	  	  	</c:choose>
	  	  </td>
	  	</c:when>
	  	<c:when test="${linkToUpgrade}">
	  	  <td class="${groupNameClass}"><a href="#" class="linkToUpgrade">${group.name}</a></td>
	  	</c:when>
	  	<c:otherwise>
	  	  <td class="${groupNameClass}">${group.name}</td>
	  	</c:otherwise>
	  </c:choose>
	  <c:if test="${not empty view.additionalColumnName}">
	  	<td class="separatorCol">
	  		<c:choose>
	  	  	<c:when test="${includeVideoLinks}">
	  	  		<a href="${url}">${group.additionalInfo}</a>
	  	  	</c:when>
	  	  	<c:when test="${linkToUpgrade}">
	  	  		<a href="#" class="linkToUpgrade">${group.additionalInfo}</a>
	  	  	</c:when>
	  	  	<c:otherwise>
	  	  		${group.additionalInfo}
	  	  	</c:otherwise>
	  	  	</c:choose>
	  	</td>
	  </c:if>
	  <c:forEach items="${view.allColumns}" var="column">
		<c:choose>
		  <c:when test="${column.separator}">
			<c:set var="thisColumnStyle" scope="page" value="separatorCol"/>
		  </c:when>
		  <c:otherwise>
			<c:set var="thisColumnStyle" scope="page" value=""/>
		  </c:otherwise>
		</c:choose>
		<td class="${thisColumnStyle} dataCell">
		  <c:choose>
			<c:when test="${not empty column.columnData[rowCounter.index]}">
		      <c:set var="content" scope="page">
		      	<c:choose>
		      	  <c:when test="${column.formatType eq 'time'}">
				  	<se:formatTime value="${column.columnData[rowCounter.index]}"></se:formatTime>
				  </c:when>
				  <c:otherwise>
				    <fmt:formatNumber value="${column.columnData[rowCounter.index]}" 
			  						  type="${column.formatType}"
									  pattern="${column.formatPattern}" />
				  </c:otherwise>
				</c:choose>
			  </c:set>
			  <c:choose>
			  	<c:when test="${includeVideoLinks}">
			  	  <c:url var="url" value="${requestUrl}">
			  	  	<c:param name="action" value="watch" />
			  	  	<c:param name="column" value="${column.id}" />
			  	  	<c:param name="row" value="${group.id}" />
	  	  			<c:param name="team" value="${view.team.id}" />
	  	  			<c:param name="op" value="${isOpponentView}" />
	  	  			<c:param name="viewIndex" value="${view.viewIndex }" />
			  	  </c:url>
			  	  <a href="${url}">${content}</a>
			  	</c:when>
			  	<c:when test="${linkToUpgrade}">
			  		<a href="#" class="linkToUpgrade">${content}</a>
			  	</c:when>
			  	<c:otherwise>
			  	  ${content}
			  	</c:otherwise>
			  </c:choose>
			</c:when>
			<c:otherwise>
			    0
			</c:otherwise>
		  </c:choose>
		</td>
	  </c:forEach>
	</tr>
  </c:forEach>
 </tbody>
  <c:if test="${view.totalRow}">
	<tr>
	  <c:choose>
  	  	<c:when test="${not empty view.additionalColumnName}">
	  	  <td class="separatorTotalCol" colspan="2">Total</td>
	  	</c:when>
	  	<c:otherwise>
	  	  <td class="separatorTotalCol">Total</td>
	  	</c:otherwise>
	  </c:choose>
	  <c:forEach items="${view.allColumns}" var="column">
		<c:choose>
		  <c:when test="${column.separator}">
			<c:set var="thisColumnStyle" scope="page" value="separatorTotalCol"/>
		  </c:when>
		  <c:otherwise>
			<c:set var="thisColumnStyle" scope="page" value="totalCol"/>
		  </c:otherwise>
		</c:choose>
		<td class="${thisColumnStyle} dataCell">
		  <c:choose>
		    <c:when test="${not empty column.totalRowData}">
		      <c:set var="content" scope="page">
		      	<c:choose>
		      	  <c:when test="${column.formatType eq 'time'}">
				  	<se:formatTime value="${column.totalRowData}"></se:formatTime>
				  </c:when>
				  <c:otherwise>
				    <fmt:formatNumber value="${column.totalRowData}" 
			  						  type="${column.formatType}"
									  pattern="${column.formatPattern}" />
				  </c:otherwise>
				</c:choose>
			  </c:set>
			  <c:choose>
			  	<c:when test="${includeVideoLinks}">
			  	  <c:url var="url" value="${requestUrl}">
			  	  	<c:param name="action" value="watch" />
			  	  	<c:param name="column" value="${column.id}" />
	  	  			<c:param name="team" value="${view.team.id}" />
	  	  			<c:param name="op" value="${isOpponentView}" />
	  	  			<c:param name="viewIndex" value="${view.viewIndex }" />
			  	  </c:url>
			  	  <a href="${url}">${content}</a>
			  	</c:when>
			  	<c:when test="${linkToUpgrade}">
			  	  <a href="#" class="linkToUpgrade">${content}</a>
			  	</c:when>
			  	<c:otherwise>
			  	  ${content}
			  	</c:otherwise>
			  </c:choose>
			</c:when>
			<c:otherwise>
			  0
			</c:otherwise>
		  </c:choose>
		</td>
	  </c:forEach>
	</tr>
  </c:if>
</table>