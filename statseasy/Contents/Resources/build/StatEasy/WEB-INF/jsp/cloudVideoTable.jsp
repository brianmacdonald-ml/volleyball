<div class="tab-pane active" id="section1">
                        	<c:if test="${not empty view.allGroups }">
	                            <ul class="game_heading clearfix">
	                            	<c:forEach items="${view.allGroups }" var="group">
	                                <li class="hitting">${group.name}</li>
	                                </c:forEach>
	                            </ul>
                            </c:if>
                            <div class="stats_table clearfix">
                                <div class="stats_section1">
                                    <ul class="first clearfix">
                                        <li><label><input type="checkbox">Players </label></li>
                                    </ul>
                                    <c:set var="evenOrOdd" value="even" />
                                    <c:forEach items="${view.groups}" var="group" varStatus="rowCounter">
	                                    <ul class="${evenOrOdd} clearfix">
	                                        <li><label><input type="checkbox">${group.name} </label></li>
	                                    </ul>
	                                    <c:choose>
	                                    	<c:when test="${evenOrOdd == 'even'}">
	                                    		<c:set var="evenOrOdd" value="odd" />
	                                    	</c:when>
	                                    	<c:otherwise>
	                                    		<c:set var="evenOrOdd" value="even" />
	                                    	</c:otherwise>
	                                    </c:choose>
                                    </c:forEach>
                                    <ul class="${evenOrOdd} last clearfix">
                                        <li><label>Totals</label></li>
                                    </ul>
                                </div>
                                
                                <div class="stats_section2">
                                    <ul class="first clearfix">
                                         <li class="k">
                                             K
                                             <div class="caret_wrap">
                                                 <a href="#" class="caret up"></a>
                                                 <a href="#" class="caret"></a>
                                             </div>
                                         </li>
                                         <li class="e">
                                             E
                                             <div class="caret_wrap">
                                                <a href="#" class="caret up"></a>
                                                <a href="#" class="caret"></a>
                                             </div>
                                         </li>
                                         <li class="ta">
                                             TA
                                             <div class="caret_wrap">
                                                 <a href="#" class="caret up"></a>
                                                 <a href="#" class="caret"></a>
                                             </div>
                                         </li>
                                         <li class="pct">
                                             PCT
                                             <div class="caret_wrap">
                                                 <a href="#" class="caret up"></a>
                                                 <a href="#" class="caret"></a>
                                             </div>
                                         </li>
                                    </ul>
                                    <ul class="even clearfix">
                                         <li class="k">
                                             0
                                         </li>
                                         <li class="e">
                                             0
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct">
                                             0
                                         </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                         <li class="k not_zero">
                                             1
                                         </li>
                                         <li class="e">
                                             0
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct not_zero">
                                             0.5
                                         </li>
                                    </ul>
                                    <ul class="even clearfix">
                                         <li class="k">
                                             0
                                         </li>
                                         <li class="e">
                                             0
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct">
                                             0
                                         </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                         <li class="k">
                                             3
                                         </li>
                                         <li class="e not_zero">
                                             1
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct not_zero">
                                             0.3
                                         </li>
                                    </ul>
                                    <ul class="even clearfix">
                                         <li class="k not_zero">
                                             3
                                         </li>
                                         <li class="e">
                                             0
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct not_zero">
                                             0.6
                                         </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                         <li class="k not_zero">
                                             1
                                         </li>
                                         <li class="e">
                                             0
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct not_zero">
                                             0.5
                                         </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                         <li class="k not_zero">
                                             7
                                         </li>
                                         <li class="e not_zero">
                                             4
                                         </li>
                                         <li class="ta">
                                             0
                                         </li>
                                         <li class="pct not_zero">
                                             0.4
                                         </li>
                                    </ul>
                                </div>
                                <div class="stats_section3">
                                    <ul class="first clearfix">
                                        <li>
                                            AST
                                            <div class="caret_wrap">
                                                <a href="#" class="caret up"></a>
                                                <a href="#" class="caret"></a>
                                            </div>
                                        </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li>
                                            0
                                        </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li>
                                            0
                                        </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li>
                                            0
                                        </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li>
                                            0
                                        </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li class="not_zero">
                                            8
                                        </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li>
                                            0
                                        </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                        <li class="not_zero">
                                            8
                                        </li>
                                    </ul>
                                </div>
                                <div class="stats_section4">
                                    <ul class="first clearfix">
                                       <li class="a">
                                           A
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="e">
                                           E
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                       <li class="percent">
                                           %
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="hash">
                                           #
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="rating">
                                           Rating
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent not_zero">
                                        1.00
                                       </li>
                                       <li class="hash not_zero">
                                          3
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent ">
                                        0
                                       </li>
                                       <li class="hash">
                                          0
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent not_zero">
                                        1.00
                                       </li>
                                       <li class="hash not_zero">
                                          3
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent ">
                                        0
                                       </li>
                                       <li class="hash">
                                          0
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent not_zero">
                                        1.00
                                       </li>
                                       <li class="hash not_zero">
                                          3
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent ">
                                        0
                                       </li>
                                       <li class="hash">
                                          0
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                       <li class="a">
                                        0
                                       </li>
                                       <li class="e">
                                         0
                                       </li>
                                       <li class="percent not_zero">
                                        1.00
                                       </li>
                                       <li class="hash not_zero">
                                          3
                                       </li>
                                       <li class="rating">
                                          0
                                       </li>
                                    </ul>
                                </div>
                                <div class="stats_section5">
                                    <ul class="first clearfix">
                                       <li class="digs">
                                           Digs
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="mdigs">
                                          MDig
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="digs not_zero">
                                           4
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="digs">
                                           0
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="digs not_zero">
                                           4
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="digs">
                                           0
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="digs not_zero">
                                           4
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="digs">
                                           0
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                       <li class="digs not_zero">
                                           17
                                       </li>
                                       <li class="mdigs">
                                          0
                                       </li>
                                    </ul>
                                </div>
                                <div class="stats_section6">
                                    <ul class="first clearfix">
                                       <li class="bs">
                                           BS
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="db">
                                          DB
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                        <li class="tb">
                                          TB
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="bs">
                                           0
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="bs not_zero">
                                           1
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="bs">
                                           0
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="bs not_zero">
                                           1
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="bs">
                                           0
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="bs not_zero">
                                           1
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                       <li class="bs">
                                           0
                                       </li>
                                       <li class="db">
                                          0
                                       </li>
                                        <li class="tb">
                                          0
                                       </li>
                                    </ul>
                                </div>
                                <div class="stats_section7">
                                    <ul class="first clearfix">
                                       <li class="avg">
                                           Avg
                                           <div class="caret_wrap">
                                               <a href="#" class="caret up"></a>
                                               <a href="#" class="caret"></a>
                                           </div>
                                       </li>
                                       <li class="hash">
                                          #
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                        <li class="re">
                                          RE
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                       <li class="hash2">
                                          #
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                         <li class="fb">
                                          FB
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                       <li class="avg not_zero">
                                           3.0
                                       </li>
                                       <li class="hash not_zero">
                                          1
                                       </li>
                                        <li class="re">
                                          0
                                       </li>
                                       <li class="hash2">
                                          0
                                       </li>
                                       <li class="fb">
                                          0
                                       </li>
                                    </ul>
                                </div>
                                <div class="stats_section8">
                                    <ul class="first clearfix">
                                        <li class="bt">
                                          BT
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                         <li class="digrating">
                                          DigRating
                                          <div class="caret_wrap">
                                              <a href="#" class="caret up"></a>
                                              <a href="#" class="caret"></a>
                                          </div>
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="odd clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                    <ul class="even last clearfix">
                                        <li class="bt">
                                          0
                                       </li>
                                         <li class="digrating">
                                          0
                                       </li>
                                    </ul>
                                </div>
                            </div>
                        </div>