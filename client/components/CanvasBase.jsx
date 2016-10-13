import React from 'react';
import Line from '../shapes/Shape-Line.js';
import StraightLine from '../shapes/Shape-StraightLine.js';
import FillRect from '../shapes/Shape-FillRect.js';


/**
 * The Whiteboard Canvas has one purpose - to allow the drawing of new shapes.
 * After the new shape is created, the insertNewShape() callback is fired and 
 * the canvas is cleared
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DrawingCanvas extends React.Component {
	
	constructor(props){
		super(props);
		
		this.SHAPES = {
			'pen' : Line,
			'line' : StraightLine,
			'rect' : FillRect
		}
	}
	

	initialize(){

	}

};