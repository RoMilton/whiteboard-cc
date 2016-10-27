import React, {PropTypes} from 'react';
import ShapeMap from '../../shapes/ShapeMap.js';
import CanvasBase from './CanvasBase.jsx';

/**
 * A read-only canvas that can renders one or more shapes onto itelf. Because 
 * canvas elements have no child elements, shapes are inserted during the
 * componentDidMount() and componentDidUpdate() lifecycle methods.
 *
 * Each shape provided in the prop arrays must be a serialized form of a shape
 * in the ShapeMap.
 * 
 * @class Display Canvas
 * @extends React.Component
 */
export default class DisplayCanvas extends CanvasBase {

	constructor(props){
		super(props);
		this.lastDrawnShapeId = '';
	}


	// after component mounts
	componentDidMount(){
		this._initialiseCanvas();
		this._drawShapes(this.props.shapes);
	}


	// after component updates
	componentDidUpdate(prevProps,prevState){
		// if only 1 shape has been added
		if (this.props.shapes.length > 1
		&& this.lastDrawnShapeId === this.props.shapes[this.props.shapes.length - 2].id){
			// draw one shape
			// console.log('		drawing last shape only');
			this._drawOneShape(this.props.shapes[this.props.shapes.length-1]);
		}else{
			// draw all shapes
			// console.log('		drawing all shapes');
			this._clear();
			this._drawShapes(this.props.shapes);
		}
	}


	// returns true if shapes have changed
	shouldComponentUpdate(nextProps,nextState){
		let oldNumberOfShapes = this.props.shapes.length,
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

		// if no shapes have been added
		if (nextNumberOfShapes === oldNumberOfShapes
		&& this.lastDrawnShapeId === nextProps.shapes[nextNumberOfShapes-1].id){
			// console.log('	no shapes added');
			return false;
		}

		// console.log('	UPDATING: at least one shape has been added');
		return true;
	}
	

	/**
	* Draws multiple shapes on the canvas.
	*
	* @memberOf DisplayCanvas
	* @method _drawShapes
	* @param {Array[Object]} shapes - array of shapes. Each shape must be serialized form of shape in ShapeMap
	*/
	_drawShapes(shapes){
		shapes.forEach((shapeModel)=>{
			this._drawOneShape(shapeModel);
		});
	}


	/**
	* Draws a single shape on the canvas.
	*
	* @memberOf DisplayCanvas
	* @method _drawOneShape
	* @param {Object} shape - Serialized shape. Must be a shape in ShapeMap 
	*/
	_drawOneShape(shapeModel){
		ShapeMap[shapeModel.type].class.drawFromModel(
			shapeModel,
			this.refs.canvas
		);
		this.lastDrawnShapeId = shapeModel.id;
	}


	/**
	* Clears the canvas
	*
	* @memberOf DisplayCanvas
	* @method _clear
	*/
	_clear(){
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	render(){
		return (
			<canvas 
				className = {this.props.className}
				ref="canvas"
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

DisplayCanvas.propTypes = {
	shapes : PropTypes.arrayOf(PropTypes.object), //array of shape objects. Each shape object is a serialized form of a shape in ShapeMap
	width : PropTypes.number, 	// width of canvas context
	height : PropTypes.number,	// height of canvas context
	className : PropTypes.string, // css class name to be assigned to canvas
	id : PropTypes.number // optional unique identifier for canvas, used for debugging
}

DisplayCanvas.defaultProps = {
	className: '',
	shapes : [],
	width : 1095,
	height : 688,
	className : 'display-canvas'
}