import Shape from './Shape.js';

/**
* The Fill Rectangle shape is a rectangle, which is drawn between two points on a canvas. 
*
* If the Fill Rectangle is re-drawn with new co-ordinates, the previous one will be cleared first.
*
* @class Shape.FillRect
* @extends Shape
*/
export default Shape.FillRect = class extends Shape{

	/**
	* Draws a Filled Rectangle onto a canvas from a serialized Filled Rectangle
	*
	* @memberOf Shape.FillRect
	* @method drawFromModel
	* @param {Object} Serialized Shape Model
	* @param {HTMLElement} Canvas node to draw shape on
	* @static
	*/
	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = shapeModel.col;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = shapeModel.pts;
		ctx.beginPath();
		let width = positions[1][0] - positions[0][0];
		let height = positions[1][1] - positions[0][1];
		ctx.fillRect(positions[0][0],positions[0][1],width,height);
		ctx.closePath();
		ctx.stroke();
	}

	/**
	* Draws a rectangle at the between the startPos and clickPos co-ordinates. 
	*
	* If the Shape is not at its first click, the the previous shape will be removed before
	* it is drawn again.
	* 
	* @memberOf Shape.FillRect
	* @method draw
	*/
	draw(){

		switch(this.status){
			case Shape.STATUS.idle:
				return;
			case Shape.STATUS.start:
				this.points.push(this.startPos) // add point
				break;
			case Shape.STATUS.middle:
				this.removeShape(); // remove shape
				break;
			case Shape.STATUS.end:
				this.points.push(this.clickPos); //add point
		}

		let ctx = this.ctx;
		ctx.fillStyle = this.color;
		if(this.status !== Shape.STATUS.start){
			// calculate width by subtracting start x value from current x value
			let width = this.clickPos[0] - this.startPos[0];
			// calculate height by subtracting start y value from current y value
			let height = this.clickPos[1] - this.startPos[1];
			// draw rectangle
			ctx.fillRect(this.startPos[0],this.startPos[1],width,height);
		}

	}

}
