function StatEasyCanvas(canvasId, width, height) {
	var canvas = $(canvasId).get(0);
	var ctx = canvas.getContext("2d");
	if (width != undefined) {
		canvas.setAttribute('width', width);
	}
	if (height != undefined) {
		canvas.setAttribute('height', height);
	}

	paper.setup(canvas);
	enterDrawingMode();

	// Initialize static variables & functions
	if (StatEasyCanvas.allCanvases == undefined) {
		StatEasyCanvas.allCanvases = {};
		/**
		 * Broadcast an event to all other canvas objects registered with StatEasyCanvas.
		 * @param originCanvasId The canvasId of the canvas that broadcast this message
		 * @param startX Unit square x-coordinate of the beginning of the event
		 * @param startY Unit square y-coordinate of the beginning of the event
		 * @param endX Unit square x-coordinate of the end of the event
		 * @param endY Unit square y-coordinate of the end of the event
		 * @return
		 */
		StatEasyCanvas.broadcastEvent = function (originCanvasId, startX, startY, endX, endY) {
			for (someCanvasId in StatEasyCanvas.allCanvases) {
				if (someCanvasId != originCanvasId) {
					StatEasyCanvas.allCanvases[someCanvasId].receiveEvent(startX, startY, endX, endY);
				}
			}
		}

		StatEasyCanvas.enterCalibrationMode = function () {
			for (someCanvasId in StatEasyCanvas.allCanvases) {
				StatEasyCanvas.allCanvases[someCanvasId].enterCalibrationMode();
			}
		}

		StatEasyCanvas.clearAll = function () {
			for (someCanvasId in StatEasyCanvas.allCanvases) {
				StatEasyCanvas.allCanvases[someCanvasId].clear();
			}
		}
	}
	StatEasyCanvas.allCanvases[canvasId] = this;

	// Locals
	var allDrawings = new Array();
	var undoDrawings = new Array();
	var lastEvent = undefined;
	var calibrationData = [];
	var translator = undefined;
	var toolList = [new FreehandTool(), new ArrowTool(),
	                new XObjectTool, new OObjectTool(),
	                new SelectorTool(), new DeleteTool()];
	var currentTool = toolList[0];
	var currColor = "#000000";
	var offset = $(canvasId).offset();
	var canvasStrokeWidth = 4;
	var hitOptions = {
		    segments: true,
		    stroke: true,
		    fill: true,
		    tolerance: 10
		};

	// Modes
	function enterCalibrationMode() {
		var canvas = $(canvasId);

		canvas.unbind("mousedown");
		canvas.unbind("mouseup");
		canvas.unbind("mousemove");
		canvas.unbind("touchstart");
		canvas.unbind("touchmove");
		canvas.unbind("touchend");

		canvas.mousedown(canvasCalibrationClick);
		canvas.bind("touchstart", canvasCalibrationClick);
	}
	this.enterCalibrationMode = enterCalibrationMode;

	function enterDrawingMode() {
		var canvas = $(canvasId);

		canvas.unbind("mousedown");
		canvas.unbind("mouseup");
		canvas.unbind("mousemove");
		canvas.unbind("touchstart");
		canvas.unbind("touchmove");
		canvas.unbind("touchend");

		canvas.mousedown(canvasMousedown);
		canvas.mouseup(canvasMouseup);
		canvas.mousemove(canvasMousemove);
		canvas.bind("touchstart", canvasMousedown);
		canvas.bind("touchend", canvasMouseup);
		canvas.bind("touchmove", canvasMousemove);


	}
	this.enterDrawingMode = enterDrawingMode;

	// Functions	
	function canvasMousedown(event) {
		currentTool.mouseDown(event.pageX - offset.left, event.pageY - offset.top)
	}

	function canvasMouseup(event) {
		currentTool.mouseUp(event.pageX - offset.left, event.pageY - offset.top);
	}

	function canvasMousemove(event) {
		paper.project.activeLayer.selected = false;
		currentTool.mouseMove(event.pageX - offset.left, event.pageY - offset.top);
	}

	function calculateTransform(calibrationData) {
		return PerspectiveTransform.getQuadToSquare(calibrationData[0][0], calibrationData[0][1],
												    calibrationData[1][0], calibrationData[1][1],
												    calibrationData[2][0], calibrationData[2][1],
												    calibrationData[3][0], calibrationData[3][1]);
	}

	function canvasCalibrationClick(event) {
		var canvas = $(canvasId);
		var offset = canvas.offset();
		var clickX = event.pageX - offset.left; 
		var clickY = event.pageY - offset.top;

		if (calibrationData.length < 4) {
			drawCalibrationClick(clickX, clickY);
			var newLength = calibrationData.push([clickX, clickY]);
			if (newLength == 4) {
				enterDrawingMode();
				canvas.addClass("calibrated");
				translator = calculateTransform(calibrationData);
			}
		}
	}

	function receiveEvent(startX, startY, endX, endY){
		if (translator != undefined) {
			var tStart = translator.inverseTransform(startX, startY);
			var tEnd = translator.inverseTransform(endX, endY);
			drawLine(tStart[0], tStart[1], tEnd[0], tEnd[1]);
		}
	}
	this.receiveEvent = receiveEvent;

	function drawCalibrationClick(clickX, clickY) {
		ctx.beginPath();
		ctx.strokeStyle = "#00FF00";
		ctx.lineWidth = 2;
		ctx.arc(clickX, clickY, 5, 0, 2 * Math.PI, false);
		ctx.stroke();
	}

	function setColor(rgbString){
		currColor = rgbString;
	}
	this.setColor = setColor;

	function FreehandTool(){

		var isMouseDown = false;
		var freehandObject;

		this.mouseDown = function(x, y){
			freehandObject = new paper.Path();
			freehandObject.add(new paper.Point(x, y));
			freehandObject.strokeWidth= canvasStrokeWidth;
			freehandObject.strokeColor= currColor;
			freehandObject.fillColor= new paper.Color(0,0,0,0);
			freehandObject.simplify();
			allDrawings.push(freehandObject);
			isMouseDown = true;
		}
		this.mouseUp = function(x,y){
			isMouseDown = false;
		}
		this.mouseMove = function(x,y){
			if(isMouseDown)
				freehandObject.add(new paper.Point(x, y));
		}
	}

	function ArrowTool(){

		var isMouseDown = false;
		var arrowObject;

		this.mouseDown = function(x, y){
			arrowObject = new paper.Path();
			arrowObject.add(new paper.Point(x, y));
			arrowObject.strokeWidth= canvasStrokeWidth;
			arrowObject.strokeColor= currColor;
			arrowObject.fillColor= new paper.Color(0,0,0,0);
			arrowObject.simplify();
			allDrawings.push(arrowObject);
			isMouseDown = true;
		}
		this.mouseUp = function(x,y){
			isMouseDown = false;
			arrowObject.add(new paper.Point(x, y));

		}
		this.mouseMove = function(x,y){
			if(isMouseDown){
				arrowObject.removeSegment(1);
				arrowObject.add(new paper.Point(x, y));
			}

		}
	}
	function XObjectTool(){

		var isMouseDown = false;
		var xObject;
		var radius;
		var path1;
		var path2;
		var startX;
		var startY;

		this.mouseDown = function(x, y){
			xObject = new paper.Path();
			startX = x;
			startY = y;
			radius = 20;
			path1 = new paper.Path(new paper.Point(x-radius, y-radius), 
					new paper.Point(x+radius, y+radius));
			path2 = new paper.Path(new paper.Point(x-radius, y+radius), 
					new paper.Point(x+radius, y-radius));
			xObject = new paper.Group([path1, path2]);
			xObject.strokeWidth= canvasStrokeWidth;
			xObject.strokeColor= currColor;
			xObject.fillColor= new paper.Color(0,0,0,0);
			allDrawings.push(xObject);
			isMouseDown = true;
		}
		this.mouseUp = function(x,y){
			isMouseDown = false;

		}
		this.mouseMove = function(x,y){
			if(isMouseDown){
				xObject.removeChildren(0);
				xObject.removeChildren(1);
				radius = Math.max(Math.abs(startY-y),Math.abs(startX-x),20);
				path1 = new paper.Path(new paper.Point(startX-radius, startY-radius), 
						new paper.Point(startX+radius, startY+radius));
				path2 = new paper.Path(new paper.Point(startX-radius, startY+radius), 
						new paper.Point(startX+radius, startY-radius));
				xObject.addChild(path1);
				xObject.addChild(path2);
				xObject.strokeWidth= canvasStrokeWidth;
				xObject.strokeColor= currColor;
				xObject.fillColor= new paper.Color(0,0,0,0);
				allDrawings.push(xObject);
			}
		}

	}
	function OObjectTool(){

		var isMouseDown = false;
		var oObject;
		var radius = 20;
		var startX;
		var startY;

		this.mouseDown = function(x, y){
			oObject = new paper.Path();
			radius = 20;
			startX = x;
			startY = y;
			oObject = new paper.Path.Circle(new paper.Point(startX, startY),radius);
			oObject.strokeWidth= canvasStrokeWidth;
			oObject.strokeColor= currColor;
			oObject.fillColor= new paper.Color(0,0,0,0);
			allDrawings.push(oObject);
			isMouseDown = true;
		}
		this.mouseUp = function(x,y){
			isMouseDown = false;
		}
		this.mouseMove = function(x,y){
			if(isMouseDown){
				oObject.remove();
				radius = Math.max(Math.sqrt(Math.pow(startY-y,2)+ Math.pow(startX-x,2)),20);
				oObject = new paper.Path.Circle(new paper.Point(startX, startY),radius);
				oObject.strokeWidth= canvasStrokeWidth;
				oObject.strokeColor= currColor;
				oObject.fillColor= new paper.Color(0,0,0,0);
				allDrawings.push(oObject);
			}
		}
	}

	function SelectorTool(){
		var hitResult;
		var isMouseDown = false;
		this.mouseMove = function (x,y){
			if(!isMouseDown)
				hitResult = paper.project.hitTest(new paper.Point(x,y), hitOptions);
			if(hitResult){
				//Parent must be selected for the xobject because it is a grouping
				//of two lines, the entire parent must be selected for both lines to be
				if(hitResult.item.parent !=  paper.project.activeLayer){
					hitResult.item.parent.selected = true;
					if(isMouseDown)
						hitResult.item.parent.position = new paper.Point(x, y);
				}
				else{
					hitResult.item.selected = true;
					if(isMouseDown)
					hitResult.item.position = new paper.Point(x, y);
				}
			}
		}
		this.mouseDown = function (clickX, clickY){
			hitResult = paper.project.hitTest(new paper.Point(clickX,clickY), hitOptions);
			isMouseDown = true;
		}
		this.mouseUp = function (x,y){
			isMouseDown = false;
			hitResult = null;
		}
	}

	function DeleteTool(){
		var hitResult;
		var isMouseDown = false;
		this.mouseMove = function (x,y){
			if(!isMouseDown)
				hitResult = paper.project.hitTest(new paper.Point(x,y), hitOptions);
			if(hitResult){
				//Parent must be selected for the xobject because it is a grouping
				//of two lines, the entire parent must be selected for both lines to be
				if(hitResult.item.parent !=  paper.project.activeLayer){
					hitResult.item.parent.selected = true;
				}
				else{
					hitResult.item.selected = true;
				}
			}
		}
		this.mouseDown = function (clickX, clickY){
			isMouseDown = true;
			hitResult = paper.project.hitTest(new paper.Point(clickX,clickY), hitOptions);
			if(hitResult){
				if(hitResult.item.parent !=  paper.project.activeLayer)
					hitResult.item.parent.remove();	
				else
					hitResult.item.remove();
				hitResult = null;
			}
		}
		this.mouseUp = function (x,y){
			isMouseDown = false;
			hitResult = null;
		}
	}

	function setTool(tool){
		currentTool = toolList[tool];
	}
	this.setTool = setTool;

	function undoLastDrawing(){
		if(allDrawings.length > 0){
			allDrawings[allDrawings.length-1].visible = false;
			undoDrawings.push(allDrawings.pop());
		}
	}
	this.undoLastDrawing = undoLastDrawing;

	function redoLastDrawing(){
		if(undoDrawings.length > 0){
			allDrawings.push(undoDrawings.pop());
			allDrawings[allDrawings.length-1].visible = true;
		}
	}
	this.redoLastDrawing = redoLastDrawing;

	function clear() {
		ctx.clearRect(0, 0, width, height);
		undoDrawings = [ ];
		allDrawings = [ ];
	}
	this.clear = clear;

	function clearDrawings() {
		ctx.clearRect(0, 0, width, height);
		for(i=0; i<allDrawings.length; i++){
			allDrawings[i].remove();
		}
		for(i=0; i<undoDrawings.length; i++){
			undoDrawings[i].remove();
		}
		undoDrawings = [];
		allDrawings = [];
	}
	this.clearDrawings = clearDrawings;

	function saveToFile(videoObj) {
		if (saveToFile.dialogObject == undefined) {
			saveToFile.dialogObject = $('<div></div>')
				.html("When you are prompted to save your image, you must type an extension such as <b>.PNG</b> or <b>.JPG</b> at the end of the file name.")
				.dialog({
					autoOpen: false,
					title: 'Feature note...',
					modal: true,
				    height: '200',
				    width: '400',				
					buttons: {
						"Ok, I'll add .PNG or .JPG to the file name." : function () {
							$(this).dialog("close");

							ctx.drawImage(videoObj, 0, 0);

							newImg = ctx.getImageData(0,0,width,height)
							var url = canvas.toDataURL("image/png");
							url = url.replace("image/png", "image/octet-stream");
							newImg.src = url;

							ctx.clearRect(0, 0, width, height);

							document.location.href = url;
						}
					},
				});
		}

		saveToFile.dialogObject.dialog("open");
	}
	this.saveToFile = saveToFile;
}