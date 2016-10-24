import React, {PropTypes} from 'react';
import ShapeMap from '../../shapes/ShapeMap.js';
import CanvasBase from './CanvasBase.jsx';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayCanvas extends CanvasBase {

	constructor(props){
		super(props);
		this.drawLastShapeOnly = false;
	}

	componentDidMount(){
		this._initialiseCanvas();
		this._drawShapes(this.props.shapes);
	}

	componentDidUpdate(prevProps,prevState){
		if (this.drawLastShapeOnly){
			let shapeModel = this.props.shapes[this.props.shapes.length-1];
			this._drawOneShape(shapeModel);
			// console.log('	one shape');
		}else{
			this._clear();
			this._drawShapes(this.props.shapes);
		}
	}


	shouldComponentUpdate(nextProps,nextState){
		let lastDrawnShapeId,
			currNumberOfShapes = this.props.shapes.length,
			nextNumberOfShapes = nextProps.shapes.length;

		// if no previous shapes
		if (!currNumberOfShapes){
			//draw all shapes
			this.drawLastShapeOnly = false;
			//render
			return true;
		}else{
			//get last drawn shape's id
			lastDrawnShapeId = this.props.shapes[currNumberOfShapes -1].id;
		}

		//by default, all shapes will be drawn
		this.drawLastShapeOnly = false;

		// if board id is same as before
		if (this.props.id === nextProps.id){
			// if number of shapes is unchanged and last shape's id unchanged
			if (currNumberOfShapes === nextNumberOfShapes && 
			lastDrawnShapeId === nextProps.shapes[nextNumberOfShapes - 1].id){
				// skip render
				return false;
			// if only 1 shape has been added
			}else if (currNumberOfShapes + 1 === nextNumberOfShapes){
				// draw final shape only
				this.drawLastShapeOnly = true;
			}
		}

		// render
		return true;
	}
	

	_drawShapes(shapes){
		shapes.forEach((shapeModel)=>{
			this._drawOneShape(shapeModel);
		});
	}

	_drawOneShape(shapeModel){
		// console.log('drawing shape');
		ShapeMap[shapeModel.type].class.drawFromModel(
			shapeModel,
			this.refs.canvas
		);
		//this._setLastUpdated();
	}

	_clear(){
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	render(){
		return (
			<canvas 
				className = {"display-canvas " + this.props.className}
				ref="canvas"
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

DisplayCanvas.propTypes = {
	shapes : PropTypes.array,
	width : PropTypes.number,
	height : PropTypes.number,
	className : PropTypes.string,
	id : PropTypes.number
}

DisplayCanvas.defaultProps = {
	className: '',
	shapes : [],
	width : 1095,
	height : 688
}