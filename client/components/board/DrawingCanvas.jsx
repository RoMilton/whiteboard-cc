import React, {PropTypes} from 'react';
import classNames from 'classnames';
import CanvasBase from './CanvasBase.jsx';
import ShapeMap from '../../shapes/ShapeMap.js';

/**
 * The Whiteboard Canvas has one purpose - to allow the drawing of new shapes.
 * After the new shape is created, the insertNewShape() callback is fired and 
 * the canvas is cleared
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DrawingCanvas extends CanvasBase {

	static get cssClass(){
		return 'canvas-cont__drawing-canvas';
	}

	constructor(props){
		super(props);
		this._documentMouseDown = this._documentMouseClick.bind(this,true);
		this._documentMouseUp = this._documentMouseClick.bind(this,false);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseEnter = this._handleMouseEnter.bind(this);
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
		let x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX ;
		let y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY ;
		return [
			(x - rect.left) / this.props.scale,
			(y - rect.top) / this.props.scale
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
		if (this.props.handleDrawStart) {this.props.handleDrawStart();}
		let canvas = this.refs.canvas;
		// create a new shape
		this._currShape = new ShapeMap[this.props.selectedShape].class({
			shapeName : this.props.selectedShape,
			canvas : canvas,
			color : this.props.color,
			onShapeSubmit : this.props.handleDrawFinish
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
		let getCSSClass = ()=>{
			return classNames(
				DrawingCanvas.cssClass,
				DrawingCanvas.cssClass + '--' + this.props.selectedShape
			);
		}
		return (
			<canvas
				className = {getCSSClass()}
				ref = "canvas"
				width={this.props.width}
				height={this.props.height}
				onMouseMove = {this._handleMouseMove}
				onMouseDown = {this._handleMouseDown}
				onMouseUp = {this._handleMouseUp}
				onMouseEnter = {this._handleMouseEnter}
				onTouchStart = {this._handleMouseDown}
				onTouchMove = {this._handleMouseMove}
				onTouchEnd = {this._handleMouseUp}
			/>
		)
	}
}

DrawingCanvas.propTypes = {
	color : PropTypes.string.isRequired,
	selectedShape : PropTypes.string.isRequired,
	handleDrawStart : PropTypes.func,
	handleDrawFinish : PropTypes.func,
	width: PropTypes.number,
	height: PropTypes.number,
	scale : PropTypes.number
};

DrawingCanvas.defaultProps = {
	width : 1095,
	height : 688,
	scale : 1
}
