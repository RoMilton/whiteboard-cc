import Shape from './Shape.js';

/**
* The line shape is a bunch of smaller line segments that connect with each other.
* Together, they appear as one long line. The line shape can be infitely long.
*
* @class Shape.Line
* @extends Shape
*/
export default Shape.Line = class extends Shape{

	/**
	* Draws a Line onto a canvas from a serialized Line
	*
	* @memberOf Shape.Line
	* @method drawFromModel
	* @param {Object} Serialized Shape Model
	* @param {HTMLElement} Canvas node to draw shape on
	* @static
	*/
	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = shapeModel.col;
		ctx.lineWidth = 5;
		let positions = shapeModel.pts;
		positions.forEach((lineSegment)=>{
			ctx.beginPath();
			ctx.lineJoin = "round";
			ctx.lineCap="round";
			ctx.moveTo(lineSegment[0][0],lineSegment[0][1]);
			ctx.lineTo(lineSegment[1][0],lineSegment[1][1]);
			ctx.closePath();
			ctx.stroke();
		});
	}


	/**
	* Draws a segment of the line. The segment will start at where the previous segment ended.
	* The segment will end at the latest click position.
	*
	* @memberOf Shape.Line
	* @method draw
	*/
	draw(){
		if (this.status === Shape.STATUS.idle){ return; }
		let ctx = this.ctx;
		let clickPos = this.clickPos;
		let prevClickPos = this.prevClickPos;
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.lineJoin = "round";
		ctx.lineCap="round";
		if(this.status === Shape.STATUS.middle){
			var start = [prevClickPos[0], prevClickPos[1]];
			var finish = [clickPos[0], clickPos[1]];
		}else{
			var start = [clickPos[0], clickPos[1]];
			var finish = [clickPos[0]+0.1, clickPos[1]+0.1];
		}
		ctx.moveTo(start[0],start[1]);
		ctx.lineTo(finish[0],finish[1]);

		this.points.push([start, finish]);
			
		ctx.closePath();
		ctx.stroke();
	}

}