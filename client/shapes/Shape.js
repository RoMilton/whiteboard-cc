import Utils from '../../universal/Utils.js';

export default class Shape {

	static get STATUS(){
		return {
			idle : -1, // not currently drawing
			start: 0, // drawing the first point of a shape
			middle: 1, // drawing but neither the first nor last point of a shape
			end: 2 // drawing last point of a shape
		};
	}
	
	constructor(obj){
		this.id = Utils.guid();
		this.shapeName = obj.shapeName,
		this.canvas = obj.canvas;
		this.color = obj.color;
		this.ctx = this.canvas.getContext('2d');
		this.onShapeSubmit = obj.onShapeSubmit;
		this.points = [];
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
		this.onShapeSubmit(this.serialize());
		this.status = Shape.STATUS.idle;
	}

	mouseMove(pos){
		if (this.status === Shape.STATUS.idle){ return; }
		this.status = Shape.STATUS.middle;
		this.addPoint(pos);
		this.draw();
	}


	mouseEnter(pos){
		//console.log('mouse enter',this.isMouseDown);
		if (this.status === Shape.STATUS.middle && this.isMouseDown){
			this.addPoint(pos);
			this.draw();
		}else if (!this.isMouseDown){
			this.status = Shape.STATUS.end;
			this.draw();
			this.onShapeSubmit(this.serialize());
			this.status = Shape.STATUS.idle;
		}
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

	static drawFromModel(model,canvas){
	
	}

	serialize(){
		return {
			id: this.id,
			type: this.shapeName,
			pts: this.points,
			col: this.color
		};
	}

}