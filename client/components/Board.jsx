import React from 'react';


class Shape {
	
	constructor(obj){
		//console.log('Shape.Line()',obj);
		//super();
		this.canvas = obj.canvas;
		this.color = obj.color;
		this.ctx = this.canvas.getContext('2d');
	}

	initialise(obj){

	}

	mouseDown(pos){
		//store image data 
		this.imgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);		
		
		this.status = STATUS.start;
		this.addPoint(pos)
		this.draw();
	}

	mouseUp(pos){
		this.status = STATUS.end;
		this.addPoint(pos)
		this.draw();
		this.status = STATUS.idle;
	}

	mouseMove(pos){
		if (this.status === STATUS.idle){ return; }
		this.status = STATUS.middle;
		this.addPoint(pos)
		this.draw();
	}

	mouseOut(pos){
		this.status = STATUS.idle;
		//this.addPoint(pos)
	}

	addPoint(pos){
		this.prevClickPos = this.clickPos;
		this.clickPos = pos;
		if (this.status === STATUS.start){
			this.startPos = this.clickPos;
		}
	}

	removeShape(){
		if (this.imgData){
			// Clears the canvas
			this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); 
			// restore original images
			this.ctx.putImageData(this.imgData,0,0);
		}
	}

	draw(){

	}

}


const STATUS = {
	idle : 0, // not currently drawing
	start: 1, // drawing the first point of a shape
	middle: 2, // drawing but neither the first nor last point of a shape
	end: 3 // drawing last point of a shape
}

Shape.Line = class extends Shape{

	draw(){
		if (this.status === STATUS.idle){ return; }
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
		if(this.status === STATUS.middle){
			ctx.moveTo(prevClickPos[0], prevClickPos[1]);
			ctx.lineTo(clickPos[0], clickPos[1]);
		}else{
			ctx.moveTo(clickPos[0], clickPos[1]);
			ctx.lineTo(clickPos[0]+0.1, clickPos[1]+0.1);
		}
		
		ctx.closePath();
		ctx.stroke();
	}

}


Shape.StraightLine = class extends Shape{

	draw(){
		if (this.status === STATUS.idle){ return; }
		let ctx = this.ctx;
		ctx.strokeStyle = this.color;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		ctx.beginPath();
		if(this.status === STATUS.middle){
			this.removeShape();
		}
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		ctx.lineTo(this.clickPos[0], this.clickPos[1]);
		ctx.closePath();
		ctx.stroke();
	}

}


Shape.FillRect = class extends Shape{

	draw(){
		if (this.status === STATUS.idle){ return; }
		let ctx = this.ctx;
		
		//ctx.strokeStyle = this.color;
		//ctx.lineJoin = "round";
		//ctx.lineWidth = 5;
		//ctx.beginPath();
		if(this.status === STATUS.middle){
			this.removeShape();
		}
		ctx.fillStyle = this.color;

		if(this.status !== STATUS.start){
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
 * Main Whiteboard Component
 *
 * @class Board
 * @extends React.Component
 */
export default class Board extends React.Component {

	componentDidMount(){
		let canvas = this.refs.board;
		this._width = canvas.width;
		this._height = canvas.height;
		this._ctx = canvas.getContext("2d");
		// this._clickX = new Array();
		// this._clickY = new Array();
		this._clickPos = [];
		this._prevClickPos = [];

		//this._clickDrag = new Array();
		this._paint;

		// canvas needs height and width attributes to be set. Let's retrieve them from the CSS 
		let styles = window.getComputedStyle(canvas);
		canvas.setAttribute('width',parseInt(styles.width));
		canvas.setAttribute('height',parseInt(styles.height));
	}

	_handleMouseMove(e){
		if(this._paint && this._currShape){
			let canvas = this.refs.board;
			this._currShape.mouseMove([e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]);
		}
	}

	_handleMouseDown(e){
		let canvas = this.refs.board;
		this._paint = true;

		// create a new shape
		this._currShape = new TOOLS[this.props.tool]({
			canvas : canvas,
			color : this.props.color
		});

		this._currShape.mouseDown([e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]);
	}

	componentwillReceiveNewProps(nextProps){
		if (this._currShape){
			this._currShape.color = nextProps.color;
		}
	}

	_handleMouseUp(e){
		let canvas = this.refs.board;
		this._currShape.mouseUp([e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]);
	}

	_handleMouseOut(e){
		if (this._currShape){ this._currShape.mouseOut(); }
		this._paint = false
	}

	render(){
		return (
			<canvas
				className="whiteboard"
				onMouseMove = {this._handleMouseMove.bind(this)}
				onMouseDown = {this._handleMouseDown.bind(this)}
				onMouseUp = {this._handleMouseUp.bind(this)}
				onMouseOut = {this._handleMouseOut.bind(this)}
				ref = "board"
			/>
		)
	}
}

Board.propTypes = {
	color : React.PropTypes.string.isRequired,
	tool : React.PropTypes.string.isRequired,
};
