import React, {PropTypes} from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayCanvas from './DisplayCanvas.jsx';
import CursorsWrapper from '../cursor/CursorsWrapper.jsx';
import Nav from './Nav.jsx';

export default class BoardsWrapper extends React.Component {

	static get DEFAULT_WIDTH(){
		return 1095;
	}

	constructor(props){
		super(props);
		this.state = { scale : 1 }

		this._calcScale = this._calcScale.bind(this);
	}

	componentDidMount(){
		this._calcScale();
		window.addEventListener('resize',this._calcScale);
	}

	componentWillUnmount(){
		window.removeEventListener('resize',this._calcScale);
	}

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
	boards : PropTypes.array.isRequired,
	iSelectedBoard : PropTypes.number.isRequired,
	sessionId : PropTypes.string.isRequired,
	activeUsers : PropTypes.array.isRequired,
	selectedShape : PropTypes.string.isRequired,
	selectedColor : PropTypes.string.isRequired,
	handleDrawStart : PropTypes.func,
	handleDrawFinish : PropTypes.func,
	handleBoardChange : PropTypes.func,
	handleBoardAdd : PropTypes.func
}