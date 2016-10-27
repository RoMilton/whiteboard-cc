import React, {PropTypes} from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayCanvas from './DisplayCanvas.jsx';
import CursorsWrapper from '../cursor/CursorsWrapper.jsx';
import Nav from './Nav.jsx';


/**
 * Container for the Drawing Canvas, Display Canvas, Navigation and Cursors components.
 *
 * The only state of this object is the scale. This measure the ratio that the container
 * div has been resized.
 *
 * @class BoardsWrapper
 * @extends React.Component
 */
export default class BoardsWrapper extends React.Component {

	/*
	* Width of the container in pixels when at maximum size
	*
	* @property MAX_BOARD_COUNT
	* @static
	*/
	static get DEFAULT_WIDTH(){
		return 1095;
	}


	constructor(props){
		super(props);
		this.state = { scale : 1 } // ratio of resize

		// bind here to 'this' can be used in event listener
		this._calcScale = this._calcScale.bind(this);
	}


	// after component mounts
	componentDidMount(){
		this._calcScale();
		window.addEventListener('resize',this._calcScale);
	}


	// before component unmounts
	componentWillUnmount(){
		window.removeEventListener('resize',this._calcScale);
	}


	/**
	* Calculates the ratio that the container div has resized in respect to
	* it's default. This should be called every time the browser resizes.
	*
	* @memberOf BoardsWrapper
	* @method _calcScale
	*/
	_calcScale(){
		let mainBoardDiv = this.refs.mainBoard,
			w = parseInt(mainBoardDiv.offsetWidth),
			scale = (w/BoardsWrapper.DEFAULT_WIDTH);
		this.setState({ scale : scale });
	}


	render(){
		return (
			<div className="wrap">
				<div className="main-board" ref="mainBoard">
					<div className="canvas-cont">
						<ul className='main-board__display-list'>
							{ this.props.boards.map((board,index)=>{
								return <li
									key = {index}
									style = { {display : index === this.props.iSelectedBoard ? '' : 'none'} }
								>	
									<DisplayCanvas 
										shapes = {board.shapes}
										id = {index}
									/>
								</li>
							})}
						</ul>
						<DrawingCanvas 
							scale = {this.state.scale}
							color = {this.props.selectedColor}
							selectedShape = {this.props.selectedShape}
							handleDrawFinish = {this.props.handleDrawFinish}
							handleDrawStart = {this.props.handleDrawStart}
						/>
					</div>
					{	!this.props.activeUsers.length ? null : 
							<CursorsWrapper 
								scale = {this.state.scale}
								sessionId = { this.props.sessionId }
								activeUsers = {this.props.activeUsers}
							/>
					}
				</div>
				<Nav
					boards = {this.props.boards}
					iSelectedBoard = {this.props.iSelectedBoard}
					handleItemClick = {this.props.handleBoardChange}
					handleNewClick = {this.props.handleBoardAdd}
					maxBoardCount = {this.props.maxBoardCount}
				/>
			</div>
		);
	}
}

BoardsWrapper.propTypes={
	boards : PropTypes.array.isRequired, 		// array of whiteboard instances
	iSelectedBoard : PropTypes.number.isRequired,	// index of currently selected whiteboard
	sessionId : PropTypes.string.isRequired,	// local session Id
	activeUsers : PropTypes.array.isRequired,	// array containing objects representing remote users. Each object must have sessionId property
	selectedShape : PropTypes.string.isRequired,// selected shape, must be property of ShapeMap shapes
	selectedColor : PropTypes.string.isRequired,// selected color in hex format
	handleDrawStart : PropTypes.func,			// fired when local user starts drawing a new shape
	handleDrawFinish : PropTypes.func,			// fired when local user completes drawing a new shape
	handleBoardChange : PropTypes.func,			// fired when local user clicks on existing board in navigation
	handleBoardAdd : PropTypes.func				// fired when local user clicks on 'add new board' button in navigation
}