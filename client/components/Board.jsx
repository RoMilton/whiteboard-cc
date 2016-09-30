import React from 'react';

/**
 * Whiteboard Board
 *
 * @class Board
 * @extends React.Component
 */
export default class Board extends React.Component {

	componentDidMount(){
		var canvas = this.refs.board;
		this._width = canvas.width;
		this._height = canvas.height;
		this._ctx = canvas.getContext("2d");
		this._clickX = new Array();
		this._clickY = new Array();
		this._clickDrag = new Array();
		this._paint;

		// canvas needs height and width attributes to be set. Let's retrieve them from the CSS 
		var styles = window.getComputedStyle(canvas);
		canvas.setAttribute('width',parseInt(styles.width));
		canvas.setAttribute('height',parseInt(styles.height));
	}

	_handleMouseMove(e){
		if(this._paint){
			var canvas = this.refs.board;
			this._addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
			this._redraw();
		}
	}

	_handleMouseDown(e){
		//console.log('e',e);
		var canvas = this.refs.board;
		var mouseX = e.pageX - canvas.offsetLeft;
		var mouseY = e.pageY - canvas.offsetTop;
			
		this._paint = true;
		this._addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		this._redraw();
	}

	_handleMouseUp(e){
		this._paint = false;
	}

	_handleMouseOut(e){
		this._paint = false
	}

	_addClick(x, y, dragging)
	{
		this._clickX.push(x);
		this._clickY.push(y);
		this._clickDrag.push(dragging);
	}

	_redraw(){
		var ctx = this._ctx;
		var clickX = this._clickX;
		var clickY = this._clickY;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
		ctx.strokeStyle = this.props.selectedColor;
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;

		for(var i=0; i < clickX.length; i++) {		
			ctx.beginPath();
		if(this._clickDrag[i] && i){
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			ctx.moveTo(clickX[i]-1, clickY[i]);
		}
		ctx.lineTo(clickX[i], clickY[i]);
		ctx.closePath();
		ctx.stroke();
		}
	}

	render(){
		return (
			<canvas
				className="whiteboard"
				onMouseMove = {this._handleMouseMove.bind(this)}
				onMouseDown = {this._handleMouseDown.bind(this)}
				onMouseUp = {this._handleMouseUp.bind(this)}
				onMouseOut = {this._handleMouseOut.bind(this)}
				ref = "board"
			/>
		)
	}
}

Board.propTypes = {
	selectedColor : React.PropTypes.string.isRequired,
};
