import React from 'react';

/**
 * The Whiteboard Canvas has one purpose - to allow the drawing of new shapes.
 * After the new shape is created, the insertNewShape() callback is fired and 
 * the canvas is cleared
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DrawingCanvas extends React.Component {
	
	initialiseCanvas(){
		let canvas = this.refs.canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = true;
	}

};