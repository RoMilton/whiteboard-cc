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
		this.lastDrawnShapeId = '';
	}

	componentDidMount(){
		this._initialiseCanvas();
		this._drawShapes(this.props.shapes);
	}

	componentDidUpdate(prevProps,prevState){
		// check if only 1 shape has been added
		if (this.props.shapes.length > 1
		&& this.lastDrawnShapeId === this.props.shapes[this.props.shapes.length - 2].id){
			// console.log('		drawing last shape only');
			this._drawOneShape(this.props.shapes[this.props.shapes.length-1]);
		}else{
			// console.log('		drawing all shapes');
			this._clear();
			this._drawShapes(this.props.shapes);
		}
	}


	shouldComponentUpdate(nextProps,nextState){
		let lastDrawnShapeId,
			oldNumberOfShapes = this.props.shapes.length,
			nextNumberOfShapes = nextProps.shapes.length;
		// console.log('checking whether to update canvas: ',this.props.id);

		// if both canvases are blank
		if (!oldNumberOfShapes && !nextNumberOfShapes){
			// console.log('	both canvases are blank');
			return false; // skip render
		}

		// if canvas has been cleared
		if (oldNumberOfShapes && !nextNumberOfShapes){
			// console.log('	UPDATING: canvas has been cleared');
			return true; // render
		}

		// if at least one shape has been removed
		if (nextNumberOfShapes < oldNumberOfShapes){
			// console.log('	UPDATING: at least one shape removed');
			return true; //render
		}

		// check if no shapes have been added
		if (nextNumberOfShapes === oldNumberOfShapes
		&& this.lastDrawnShapeId === nextProps.shapes[nextNumberOfShapes-1].id){
			// console.log('	no shapes added');
			return false;
		}
		// console.log('	UPDATING: at least one shape has been added');
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
		this.lastDrawnShapeId = shapeModel.id;
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