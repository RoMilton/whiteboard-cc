import Utils from '../../universal/Utils.js';

/**
* A shape is template of an object that is drawn on a canvas. This class is not meant to be 
* implemented directly, insteadextended through child classes.
*
* A shape can be serialized into a raw JS object to it can be sent to other users or stored
* in DB.
*
* The shape also knows how to recreate itself from a serialized Shape Model, onto a canvas.
* 
* @class Shape
*/ 
export default class Shape {

	/**
	* All possible statuses
	*
	* @memberOf Shape
	* @property STATUS
	* @static
	*/
	static get STATUS(){
		return {
			idle : -1, // not currently drawing
			start: 0, // drawing the first point of a shape
			middle: 1, // drawing but neither the first nor last point of a shape
			end: 2 // drawing last point of a shape
		};
	}


	/**
	* Draws a shape onto a canvas from a serialized Shape Model
	*
	* @memberOf Shape
	* @method drawFromModel
	* @param {Object} Serialized Shape Model
	* @param {HTMLElement} Canvas node to draw shape on
	* @static
	*/
	static drawFromModel(model,canvas){
		//implemented by subclass
	}


	constructor(obj){
		this.id = Utils.guid(); //unique identifier of shape
		this.shapeType = obj.shapeType, //name of shape eg 'pen', line
		this.canvas = obj.canvas; // canvas to apply shape to
		this.color = obj.color; // color of shape
		this.points = []; // all points in shape, from beginning to end
		this.ctx = this.canvas.getContext('2d'); // canvas ontext
		this.onShapeSubmit = obj.onShapeSubmit; // callback fired when shape is finished
		this.clickPos = [];  // current click position
		this.prevClickPos = [] // previous click position
	}


	/**
	* Begins drawing a new shape at a given position on the canvas
	* 
	* @memberOf Shape
	* @method mouseDown
	* @param {Array[Number]} pos - array containig x and y positions on the canvas respectively
	*/
	mouseDown(pos){
		//store image data 
		this.imgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
		this.status = Shape.STATUS.start;
		this.addPoint(pos)
		this.draw();
	}


	/**
	* Finishes drawing the shape on a given position on a canvas, then fires the onShapeSubmit function,
	* passing the serialized shape as an argument. 
	* 
	* @memberOf Shape
	* @method mouseUp
	* @param {Array[Number]} pos - array containig x and y positions on the canvas respectively
	*/
	mouseUp(pos){
		this.status = Shape.STATUS.end;
		this.addPoint(pos);
		this.draw();
		this.onShapeSubmit(this.serialize());
		this.status = Shape.STATUS.idle; 
	}


	/**
	* Manipulates a shape by adding to it a given set of co-ordinates on the canvas.
	* 
	* @memberOf Shape
	* @method mouseMove
	* @param {Array[Number]} pos - array containig x and y positions on the canvas respectively
	*/
	mouseMove(pos){
		if (this.status === Shape.STATUS.idle){ return; }
		this.status = Shape.STATUS.middle;
		this.addPoint(pos);
		this.draw();
	}


	/**
	* Checks to see if mouse is down, and if so resumes drawing a shape. If mouse is not down,
	* shape will be finished
	* 
	* @memberOf Shape
	* @method mouseEnter
	* @param {Array[Number]} pos - array containig x and y positions on the canvas respectively
	*/
	mouseEnter(pos){
		// if current shape is unfinished and mouse is currently pressed
		if (this.status === Shape.STATUS.middle && this.isMouseDown){
			// resume drawing shape
			this.addPoint(pos);
			this.draw();
		// if mouse is not currently pressed
		}else if (!this.isMouseDown){
			// finish shape
			this.status = Shape.STATUS.end;
			this.draw();
			this.onShapeSubmit(this.serialize());
			this.status = Shape.STATUS.idle;
		}
	}


	/**
	* Sets clickPos and prevClickPos instance properties.
	* 
	* @memberOf Shape
	* @method addPoint
	* @param {Array[Number]} pos - array containig x and y positions on the canvas respectively
	*/
	addPoint(pos){
		this.prevClickPos = this.clickPos;
		this.clickPos = pos;
		if (this.status === Shape.STATUS.start){
			this.startPos = this.clickPos;
		}
	}


	/**
	* Removes the current shape from canvas, and returns the canvas to its saved state.
	* 
	* @memberOf Shape
	* @method removeShape
	*/
	removeShape(){
		if (this.imgData){
			// Clears the canvas
			this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); 
			// restore original image
			this.ctx.putImageData(this.imgData,0,0);
		}
	}


	/**
	* Draws a new point in the shape. This can be done by inspecting the instance properties 
	* clickPos, prevClickPos and status.
	*
	* @memberOf Shape
	* @method draw
	*/
	draw(){
		// implemented by subclass
	}


	/**
	* Converts shape instance into a raw JS object. The instance properties will become 
	* object properties.
	*
	* @memberOf Shape
	* @method serialize
	* @return {Object} Serialized Shape Model
	*/
	serialize(){
		return {
			id: this.id,
			type: this.shapeType,
			pts: this.points,
			col: this.color
		};
	}

}