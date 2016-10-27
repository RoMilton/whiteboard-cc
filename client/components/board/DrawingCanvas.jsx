import React, {PropTypes} from 'react';
import classNames from 'classnames';
import CanvasBase from './CanvasBase.jsx';
import ShapeMap from '../../shapes/ShapeMap.js';

/**
 * The Drawing Canvas is used to draw a new shape. When mouse presses down on the
 * the canvas, a new shape is created. When user moves the mouse while mouse
 * is down, the co-ordinates are sent to the shape so it can manipulate accordinly. 
 * When user mouses up, the shape is finished and a callback is fired to handle it.
 *
 * The canvas is cleared after each shape that is drawn. This component is not meant
 * to display multiple shapes at the same time - use a read only component like
 * DisplayCanvas to achieve that.
 *
 * @class DrawingCanvas
 * @extends React.Component
 */
export default class DrawingCanvas extends CanvasBase {


	/**
	* CSS class assigned to canvas 
	*
	* @property cssClass
	* @static
	*/
	static get cssClass(){
		return 'canvas-cont__drawing-canvas';
	}


	constructor(props){
		super(props);

		// bind mouse callbacks here so 'this' can be used
		this._documentMouseDown = this._documentMouseDown.bind(this);
		this._documentMouseUp = this._documentMouseUp.bind(this);

		// bind methods here to speed up re-render
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseEnter = this._handleMouseEnter.bind(this);
	}


	// after component mounts
	componentDidMount(){
		this._initialiseCanvas();
		this._clickPos = [];
		this._prevClickPos = [];
		
		document.addEventListener('mousedown',this._documentMouseDown);
		document.addEventListener('mouseup',this._documentMouseUp);
	}


	// before component unmounts
	componentWillUnmount(){
		document.removeEventListener('mousedown',this._documentMouseDown);
		document.removeEventListener('mouseup',this._documentMouseUp);
	}


	// when props are received
	componentwillReceiveNewProps(nextProps){
		if (this._currShape){
			this._currShape.color = nextProps.color;
		}
	}


	/**
	* Callback to be fired on document mouse down event. 
	* 
	* @memberOf DrawingCanvas
	* @method _documentMouseDown
	*/
	_documentMouseDown(){
		this._setMouseDown(true);	
	}


	/**
	* Callback to be fired on document mouse up event. 
	* 
	* @memberOf DrawingCanvas
	* @method _documentMouseDown
	*/
	_documentMouseUp(){
		this._setMouseDown(false);
	}


	/*
	* If a shape is currently being drawn, this method will set its isMouseDown
	* property to a given value
	* 
	* @method _documentMouseDown
	* @param {Boolean} isMouseDown - whether the mouse is down any where on the document
	*/
	_setMouseDown(isMouseDown){
		if (this._currShape){ this._currShape.isMouseDown = isMouseDown; }
	}


	/*
	* Extracts the mouse or touch co-ordinates from a given event in relation to the 
	* canvas node. For example if the provided event is a click inside the canvas,
	* 20px to the left and 50 pixels from the top, the returned array will be [20,50].
	* 
	* @method _documentMouseDown
	* @param {Event} e - mouse or touch event (mousemove, mousedown, mouseenter, mouseexit, mouseup, touchstart, touchmove or touchend)
	* @return {Array[Number]} Array containing the x and y values respectively
	*/
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


	/**
	* Callback to be fired when mouse moves or touch moves on canvas. 
	*
	* Extracts the mouse/touch co-ordinates before passing them on to method mouseMove 
	* of the current Shape.
	*
	* @memberOf DrawingCanvas
	* @method _handleMouseMove
	* @param {Event} e - mousemove or touchmove event
	*/
	_handleMouseMove(e){
		if(this._currShape){
			// tell shape that mouse mouse occurred
			this._currShape.mouseMove(this._getMouseCoords(e));
		}
	}


	/**
	* Callback to be fired when mouse enters the canvas
	*
	* Extracts the mouse/touch co-ordinates before passing them on to method mouseEnter 
	* of the current Shape.
	*
	* @memberOf DrawingCanvas
	* @method _handleMouseEnter
	* @param {Event} e - mouseenter event
	*/
	_handleMouseEnter(e){
		if(this._currShape){
			// tell shape that mouse enter occurred
			this._currShape.mouseEnter(this._getMouseCoords(e));
		}
	}


	/**
	* Callback to be fired when mouse down or touchstart occurs on canvas.
	*
	* Instantiates a new shape of the type provided by prop selectedShape.
	*
	* Extracts the mouse/touch co-ordinates before passing them on to method mouseDown 
	* of the new Shape.
	*
	* @memberOf DrawingCanvas
	* @method _handleMouseDown
	* @param {Event} e - mousedown or touchstart event
	*/
	_handleMouseDown(e){
		// fire handleDrawStart callback if it's provided
		if (this.props.handleDrawStart) {this.props.handleDrawStart();}
		let canvas = this.refs.canvas;
		// create a new shape
		this._currShape = new ShapeMap[this.props.selectedShape].class({
			shapeName : this.props.selectedShape,
			canvas : canvas,
			color : this.props.color,
			onShapeSubmit : this.props.handleDrawFinish
		});
		// tell shape that mouse down occurred
		this._currShape.mouseDown(this._getMouseCoords(e));
	}


	/**
	* Callback to be fired when mouseup or touchend fires on canvas
	*
	* Extracts the mouse/touch co-ordinates before passing them on to method mouseUp 
	* of the current Shape.
	*
	* @memberOf DrawingCanvas
	* @method _handleMouseUp
	* @param {Event} e - mouseup or touchend event
	*/
	_handleMouseUp(e){
		if (this._currShape){
			// tell shape that mouseup occurred
			this._currShape.mouseUp(this._getMouseCoords(e));
			// clear canvas
			this._clear();
		}
	}


	/**
	* Clears the canvas.
	*
	* @memberOf DrawingCanvas
	* @method _clear
	*/
	_clear(){
		let canvas = this.refs.canvas;
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (this._currShape){ this._currShape = null; }
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
	color : PropTypes.string.isRequired,	// color of shapes that are drawn on this canvas
	selectedShape : PropTypes.string.isRequired, // currently selected shape, must be property of ShapeMap
	handleDrawStart : PropTypes.func, 		// fired when user begins drawing a shape (pressed down on mouse)
	handleDrawFinish : PropTypes.func,		// fired when user finishes drawing a shape (releases mouse button)
	width: PropTypes.number,				// width of canvas context
	height: PropTypes.number,				// height of canvas context
	scale : PropTypes.number				// scale to be multiplied against mouse co-ordinates when drawing shapes
};

DrawingCanvas.defaultProps = {
	width : 1095,
	height : 688,
	scale : 1
}
