import Shape from './Shape.js';

/**
* The Straight Line shape is a line between two points on the canvas. If Straight Line is drawn, and then
* re-drawn with new co-ordinates, the previous one will be cleared first.
*
* @class Shape.StraightLine
* @extends Shape
*/
export default Shape.StraightLine = class extends Shape{

	/**
	* Draws a Straight Line onto a canvas from a serialized Straight Line
	*
	* @memberOf Shape.StraightLine
	* @method drawFromModel
	* @param {Object} Serialized Shape Model
	* @param {HTMLElement} Canvas node to draw shape on
	* @static
	*/
	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = shapeModel.col;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = shapeModel.pts;
		ctx.beginPath();
		ctx.moveTo(positions[0][0],positions[0][1]);
		ctx.lineTo(positions[1][0],positions[1][1]);
		ctx.closePath();
		ctx.stroke();
	}


	/**
	* Draws the line at the between the startPos and clickPos co-ordinates. 
	*
	* If the Shape is not at its first click, the the previous shape will be removed before
	* it is drawn again.
	* 
	* @memberOf Shape.StraightLine
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
				this.points.push(this.clickPos); // add point
		}
		// draw line
		let ctx = this.ctx;
		ctx.strokeStyle = this.color;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		ctx.lineTo(this.clickPos[0], this.clickPos[1]);
		ctx.closePath();
		ctx.stroke();
	}

}