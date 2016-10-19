import React from 'react';
import ShapeMap from '../shapes/ShapeMap.js';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayBoard extends React.Component {

	drawShapes(shapes){
		shapes.forEach((shapeModel)=>{
			this.drawOneShape(shapeModel);
		});
	}

	drawOneShape(shapeModel){
		ShapeMap[shapeModel.type].class.drawFromModel(
			shapeModel,
			this.refs.canvas
		);
	}

	componentDidMount(){
		this.ctx = this.refs.canvas.getContext('2d');
		let shapes = this.props.board.shapes;
		this.drawShapes(shapes);		
	}

	clear(){
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
	}

	componentWillReceiveProps(nextProps,nextState){
		let shapes = nextProps.board.shapes;
			
		if (this.props.board.id !== nextProps.board.id
		|| nextProps.board.redrawAll){
			this.clear();
			this.drawShapes(shapes);
		}else if (shapes.length){
			let shapeModel = shapes[shapes.length-1];
			this.drawOneShape(shapeModel);
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		for (let key in nextProps){
			if ( key !== 'board'
			&& nextProps[key] !== (this.props[key] )){
				// a prop other than 'board' has been updated
				return true;
			}
		}
		// only board has updated, no need to re-render
		return false;
	}

	render(){
		return (
			<canvas 
				className = {"display-canvas " + this.props.className || ''}
				ref="canvas"
				width={this.props.width}
				height={this.props.height}
			/>
		)
	}
}

DisplayBoard.propTypes = {
	board : React.PropTypes.object.isRequired,
	width : React.PropTypes.string,
	height : React.PropTypes.string,
	className : React.PropTypes.string,
	name : React.PropTypes.string
}

DisplayBoard.defaultProps = {
	width : '1095',
	height : '688'
}