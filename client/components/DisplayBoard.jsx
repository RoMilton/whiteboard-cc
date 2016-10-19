import React from 'react';
import ShapeMap from '../shapes/ShapeMap.js';
import CanvasBase from './CanvasBase.jsx';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayBoard extends CanvasBase {

	componentDidMount(){
		this._initialiseCanvas();
		this._drawShapes(this.props.shapes);
	}

	componentDidUpdate(prevProps,prevState){
		this._clear();
		this._drawShapes(this.props.shapes);
	}

	_drawShapes(shapes){
		shapes.forEach((shapeModel)=>{
			this._drawOneShape(shapeModel);
		});
	}

	_drawOneShape(shapeModel){
		ShapeMap[shapeModel.type].class.drawFromModel(
			shapeModel,
			this.refs.canvas
		);
	}

	_clear(){
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
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