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
		this.lastUpdated = 0;
	}

	componentDidMount(){
		this._initialiseCanvas();
		this._drawShapes(this.props.board.shapes);
	}

	_setLastUpdated(){
		this.lastUpdated = this.props.board.lastUpdated;
	}

	componentWillReceiveProps(nextProps){
		let shapes = nextProps.board.shapes;
		if ((this.props.board.id !== nextProps.board.id)
		|| nextProps.board.redrawAll){
			console.log('clearing')
			console.log('shapes',shapes);
			this._clear();
			this._drawShapes(shapes);
		}else if (nextProps.board.lastUpdated > this.lastUpdated){
			console.log('one shape');
			let shapeModel = shapes[shapes.length-1];
			this._drawOneShape(shapeModel);
		}else{
			console.log('skipping1',nextProps.board.lastUpdated);
			console.log('skipping2',this.lastUpdated);
		}
	}

	// shouldComponentUpdate(nextProps,nextState){
	// 	console.log('this',this.props.board.shapes.length);
	// 	console.log('this',nextProps.board.shapes.length);
	// 	return true;
	// 	for (let key in nextProps){
	// 		if ( key !== 'board'
	// 		&& nextProps[key] !== (this.props[key] )){
	// 			// a prop other than 'board' has been updated
	// 			return true;
	// 		}
	// 	}
	// 	// only board has updated, no need to re-render
	// 	return false;
	

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
		this._setLastUpdated();
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
	board : PropTypes.object,
	width : PropTypes.number,
	height : PropTypes.number,
	className : PropTypes.string
}

DisplayCanvas.defaultProps = {
	className: '',
	shapes : [],
	width : 1095,
	height : 688
}