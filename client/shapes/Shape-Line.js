import Shape from './Shape.js';

export default Shape.Line = class extends Shape{

	static drawFromModel(shapeModel,canvas){
		let ctx = canvas.getContext('2d');
		ctx.strokeStyle = shapeModel[2];
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		let positions = shapeModel[1];
		positions.forEach((lineSegment)=>{
			ctx.beginPath();
			ctx.moveTo(lineSegment[0][0],lineSegment[0][1]);
			ctx.lineTo(lineSegment[1][0],lineSegment[1][1]);
			ctx.closePath();
			ctx.stroke();
		});
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

		this.points.push([start, finish]);
			
		ctx.closePath();
		ctx.stroke();
	}

}