import Shape from './Shape.js';

export default Shape.StraightLine = class extends Shape{

	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = shapeModel[2];
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = shapeModel[1];
		ctx.beginPath();
		ctx.moveTo(positions[0][0],positions[0][1]);
		ctx.lineTo(positions[1][0],positions[1][1]);
		ctx.closePath();
		ctx.stroke();
	}

	draw(){
		switch(this.status){
			case Shape.STATUS.idle:
				return;
			case Shape.STATUS.start:
				this.points.push(this.startPos)
				break;
			case Shape.STATUS.middle:
				this.removeShape();
				break;
			case Shape.STATUS.end:
				this.points.push(this.clickPos);
		}
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