import React from 'react';

/**
 * Parent class for the Canvas component.
 *
 * This component is not meant to be implemented directly but instead extended by a child component.
 *
 * This class sets some default properties that should be applied to all canvases.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class DrawingCanvas extends React.Component {
	
	_initialiseCanvas(){
		let canvas = this.refs.canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = true;
	}

};