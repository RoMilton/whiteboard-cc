import Shape from './Shape.js';

export default Shape.FillRect = class extends Shape{

	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = shapeModel[2];
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = shapeModel[1];
		ctx.beginPath();
		let width = positions[1][0] - positions[0][0];
		let height = positions[1][1] - positions[0][1];
		ctx.fillRect(positions[0][0],positions[0][1],width,height);
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
		ctx.fillStyle = this.color;
		if(this.status !== Shape.STATUS.start){
			let width = this.clickPos[0] - this.startPos[0];
			let height = this.clickPos[1] - this.startPos[1];
			ctx.fillRect(this.startPos[0],this.startPos[1],width,height);
		}

	}

}
