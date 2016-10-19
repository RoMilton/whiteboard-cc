import React from 'react';
import CanvasBase from './CanvasBase.jsx';
import ShapeMap from '../shapes/ShapeMap.js';

/**
 * The Whiteboard Canvas has one purpose - to allow the drawing of new shapes.
 * After the new shape is created, the insertNewShape() callback is fired and 
 * the canvas is cleared
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DrawingCanvas extends CanvasBase {

	constructor(props){
		super(props);
		this._documentMouseDown = this._documentMouseClick.bind(this,true);
		this._documentMouseUp = this._documentMouseClick.bind(this,false);
	}

	componentDidMount(){
		this._initialiseCanvas();
		
		this._clickPos = [];
		this._prevClickPos = [];
		
		document.addEventListener('mousedown',this._documentMouseDown);
		document.addEventListener('mouseup',this._documentMouseUp);
	}

	componentWillUnmount(){
		document.removeEventListener('mousedown',this._documentMouseDown);
		document.removeEventListener('mouseup',this._documentMouseUp);
	}

	componentwillReceiveNewProps(nextProps){
		if (this._currShape){
			this._currShape.color = nextProps.color;
		}
	}

	_documentMouseClick(status){
		//console.log('setting to',status);
		if (this._currShape){
			this._currShape.isMouseDown = status;
		}
	}

	_getMouseCoords(e){
		let canvas = this.refs.canvas;
		let rect = canvas.getBoundingClientRect();
		//([e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop]);
		return [
			e.clientX - rect.left,
			e.clientY - rect.top
    	];
	}

	_handleMouseMove(e){
		if(this._currShape){
			this._currShape.mouseMove(this._getMouseCoords(e));
		}
	}

	_handleMouseEnter(e){
		if(this._currShape){
			this._currShape.mouseEnter(this._getMouseCoords(e));
		}
	}

	_handleMouseDown(e){
		let canvas = this.refs.canvas;

		// create a new shape
		this._currShape = new ShapeMap[this.props.selectedShape].class({
			shapeName : this.props.selectedShape,
			canvas : canvas,
			color : this.props.color,
			onShapeSubmit : this.props.onDrawFinish
		});

		this._currShape.mouseDown(this._getMouseCoords(e));
	}

	_handleMouseUp(e){
		if (this._currShape){
			this._currShape.mouseUp(this._getMouseCoords(e));
			this._finish();
		}
	}

	_finish(){
		if (this._currShape){
			let canvas = this.refs.canvas;
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			this._currShape = null;
		}
	}

	render(){
		return (
			<canvas
				className="main-board__canvas"
				onMouseMove = {this._handleMouseMove.bind(this)}
				onMouseDown = {this._handleMouseDown.bind(this)}
				onMouseUp = {this._handleMouseUp.bind(this)}
				onMouseEnter = {this._handleMouseEnter.bind(this)}
				ref = "canvas"
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

DrawingCanvas.propTypes = {
	color : React.PropTypes.string.isRequired,
	selectedShape : React.PropTypes.string.isRequired,
	onDrawFinish : React.PropTypes.func,
	width: React.PropTypes.number,
	height: React.PropTypes.number
};

DrawingCanvas.defaultProps = {
	width : 1095,
	height : 688
}
