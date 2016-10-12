import React from 'react';

//import  './DrawingCanvas.jsx';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayBoard extends React.Component {


	drawShapeOnCanvas(shapeModel){
		//Shape[shapeModel.Type].drawOnCanvas(this.refs.canvas,shapeModel);
		let model = shapeModel;
		//console.log('draw on canvas',shapeModel);
		let ctx = this.refs.canvas.getContext('2d');
		ctx.strokeStyle = shapeModel[2];
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
		//if (this.props.tool === 'pen'){
		ctx.beginPath();
		let positions = shapeModel[1];
		ctx.moveTo(positions[0][0],positions[0][1]);
		ctx.lineTo(positions[1][0],positions[1][1]);
		ctx.closePath();
		ctx.stroke();
	}

	componentWillReceiveProps(nextProps,nextState){
		if (nextProps.drawLastShapeOnly){
			let shapeModel = nextProps.shapes[nextProps.shapes.length-1];
			this.drawShapeOnCanvas(shapeModel);
		}else{
		//clearCanvas();
		// let shapes = board.shapes();
		// shapes.forEach((shapeModel)=>{
		// 	this.drawShapeOnCanvas(shapeModel)
		// });
		}
	}

	shouldComponentUpdate(){
		return false;
	}

	render(){
		//console.log('6666666666')
		return (
			<canvas 
				className="canvas--big"
				ref="canvas"
				width = '1095'
				height = '1095'
			/>
		)
	}
}

DisplayBoard.propTypes = {
	shapes : React.PropTypes.array,
	drawLastShapeOnly : React.PropTypes.bool
}