import React from 'react';


class Shape {

	static get STATUS(){
		return {
			idle : -1, // not currently drawing
			start: 0, // drawing the first point of a shape
			middle: 1, // drawing but neither the first nor last point of a shape
			end: 2 // drawing last point of a shape
		};
	}
	
	constructor(obj){
		//console.log('Shape.Line()',obj);
		//super();
		this.canvas = obj.canvas;
		this.color = obj.color;
		this.ctx = this.canvas.getContext('2d');
		this.onShapeSubmit = obj.onShapeSubmit;
		this.points = [];
	}

	initialise(obj){

	}

	mouseDown(pos){
		//store image data 
		this.imgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
		this.status = Shape.STATUS.start;
		this.addPoint(pos)
		this.draw();
	}

	mouseUp(pos){
		this.status = Shape.STATUS.end;
		this.addPoint(pos);
		this.draw();
		this.status = Shape.STATUS.idle;
	}

	mouseMove(pos){
		if (this.status === Shape.STATUS.idle){ return; }
		this.status = Shape.STATUS.middle;
		this.addPoint(pos);
		this.draw();
	}

	mouseOut(){
		this.status = Shape.STATUS.end;
		this.draw();
		this.status = Shape.STATUS.idle;
	}

	addPoint(pos){
		this.prevClickPos = this.clickPos;
		this.clickPos = pos;
		if (this.status === Shape.STATUS.start){
			this.startPos = this.clickPos;
		}
	}

	removeShape(){
		if (this.imgData){
			// Clears the canvas
			this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); 
			// restore original image
			this.ctx.putImageData(this.imgData,0,0);
		}
	}

	getImageData(){
		return this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	}

	draw(){

	}

	serialize(shapeName,){
		return [
			shapeName,
			this.points,
			this.color,
			this.status
		];
	}

}

Shape.Line = class extends Shape{

	static get TYPE(){
		return 'Line';
	}

	static drawFromModel(model,canvas){
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = model[3];
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = model[1]
		ctx.moveTo(position[0][0],position[0][1]);
		ctx.lineTo(position[1][0],position[1][1]);
	}

	draw(){
		if (this.status === Shape.STATUS.idle){ return; }
		let ctx = this.ctx;
		let clickPos = this.clickPos;
		let prevClickPos = this.prevClickPos;
		//if (!this._paint){return;}
		//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
		ctx.strokeStyle = this.color;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		//if (this.props.tool === 'pen'){
		ctx.beginPath();
		if(this.status === Shape.STATUS.middle){
			var start = [prevClickPos[0], prevClickPos[1]];
			var finish = [clickPos[0], clickPos[1]];
		}else{
			var start = [clickPos[0], clickPos[1]];
			var finish = [clickPos[0]+0.1, clickPos[1]+0.1];
		}
		ctx.moveTo(start[0],start[1]);
		ctx.lineTo(finish[0],finish[1]);

		this.points = [start, finish];
		this.onShapeSubmit(this.serialize(Shape.Line.TYPE));
			
		ctx.closePath();
		ctx.stroke();
	}

}


Shape.StraightLine = class extends Shape{

	static get TYPE(){
		return 'Line';
	}

	draw(){
		if (this.status === Shape.STATUS.idle){ return; }
		let ctx = this.ctx;
		ctx.strokeStyle = this.color;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		ctx.beginPath();
		if(this.status === Shape.STATUS.middle){
			this.removeShape();
		}
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		ctx.lineTo(this.clickPos[0], this.clickPos[1]);
		ctx.closePath();
		ctx.stroke();
	}

}


Shape.FillRect = class extends Shape{

	static get TYPE(){
		return 'FillRect';
	}

	draw(){
		if (this.status === Shape.STATUS.idle){ return; }
		let ctx = this.ctx;
		
		//ctx.strokeStyle = this.color;
		//ctx.lineJoin = "round";
		//ctx.lineWidth = 5;
		//ctx.beginPath();
		if(this.status === Shape.STATUS.middle){
			this.removeShape();
		}
		ctx.fillStyle = this.color;

		if(this.status !== Shape.STATUS.start){
			let width = this.clickPos[0] - this.startPos[0];
			let height = this.clickPos[1] - this.startPos[1];
			ctx.fillRect(this.startPos[0],this.startPos[1],width,height);
		}
		
		// ctx.moveTo(this.startPos[0], this.startPos[1]);
		// ctx.lineTo(clickPos[0], clickPos[1]);
		//ctx.closePath();
		//ctx.stroke();
	}

}



const TOOLS = {
	'pen' : Shape.Line,
	'line' : Shape.StraightLine,
	'rect' : Shape.FillRect
}

/**
 * The Whiteboard Canvas has one purpose - to allow the drawing of new shapes.
 * After the new shape is created, the insertNewShape() callback is fired and 
 * the canvas is cleared
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DrawingCanvas extends React.Component {

	componentDidMount(){
		let canvas = this.refs.canvas;
		this._width = canvas.width;
		this._height = canvas.height;
		this._ctx = canvas.getContext("2d");
		// this._clickX = new Array();
		// this._clickY = new Array();
		this._clickPos = [];
		this._prevClickPos = [];

		// canvas needs height and width attributes to be set. Let's retrieve them from the CSS 
		let styles = window.getComputedStyle(canvas);
		canvas.setAttribute('width',parseInt(styles.width));
		canvas.setAttribute('height',parseInt(styles.height));
	}

	_getMouseCoords(e){
		let canvas = this.refs.canvas;
		let rect = canvas.getBoundingClientRect();
		//([e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]);
		return [
			e.clientX - rect.left,
			e.clientY - rect.top
    	];
	}

	_handleMouseMove(e){
		if(this._currShape){
			// console.log('mousemoving');
			// this._currShape.mouseMove(this._getMouseCoords(e));
			// console.log('e',e.pageX);
			// console.log('canvas',canvas.offsetLeft);
			this._currShape.mouseMove(this._getMouseCoords(e));
		}
	}

	_handleMouseDown(e){
		let canvas = this.refs.canvas;

		// create a new shape
		this._currShape = new TOOLS[this.props.tool]({
			canvas : canvas,
			color : this.props.color,
			onShapeSubmit : this.props.onDrawFinish
		});

		this._currShape.mouseDown(this._getMouseCoords(e));
	}

	componentwillReceiveNewProps(nextProps){
		if (this._currShape){
			this._currShape.color = nextProps.color;
		}
	}

	_handleMouseUp(e){
		if (this._currShape){
			this._currShape.mouseUp(this._getMouseCoords(e));
			this._finish();
		}
	}

	_finish(){
		if (this._currShape){
			let canvas = this.refs.canvas;
			//this.props.onShapeFinish(canvas.toDataURL("image/png")).then(()=>{
			// console.log('clearing the drawing canvas');
			this._ctx.clearRect(0, 0, canvas.width, canvas.height);
			this._currShape = null;
			//});
		}
	}

	_handleMouseOut(e){
		if (this._currShape){
			this._currShape.mouseOut();
			this._finish();
		}
	}

	render(){
		return (
			<canvas
				className="main-board__canvas"
				onMouseMove = {this._handleMouseMove.bind(this)}
				onMouseDown = {this._handleMouseDown.bind(this)}
				onMouseUp = {this._handleMouseUp.bind(this)}
				onMouseOut = {this._handleMouseOut.bind(this)}
				ref = "canvas"
			/>
		)
	}
}

DrawingCanvas.propTypes = {
	color : React.PropTypes.string.isRequired,
	tool : React.PropTypes.string.isRequired,
	onDrawFinish : React.PropTypes.func
};
