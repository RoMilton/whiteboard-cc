import React from 'react';
import ShapeMap from '../shapes/ShapeMap.js';
import CanvasBase from './CanvasBase.jsx';
import Utils from '../../universal/Utils.js';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayBoard extends CanvasBase {

	drawShapes(shapes){
		shapes.forEach((shapeModel)=>{
			this.drawOneShape(shapeModel);
		});
	}

	drawOneShape(shapeModel){
		ShapeMap[shapeModel.type].class.drawFromModel(
			shapeModel,
			this.refs.canvas
		);
	}

	componentDidMount(){
		this.initialiseCanvas();
		console.log('000');
		this.drawShapes(this.props.shapes);
	}

	clear(){
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	componentDidUpdate(prevProps,prevState){
		this.clear();
		this.drawShapes(this.props.shapes);
	}

	render(){
		return (
			<canvas 
				className = {"display-canvas " + this.props.className || ''}
				ref="canvas"
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

DisplayBoard.propTypes = {
	shapes : React.PropTypes.array,
	width : React.PropTypes.number,
	height : React.PropTypes.number,
	className : React.PropTypes.string
}

DisplayBoard.defaultProps = {
	shapes : [],
	width : 1095,
	height : 688
}