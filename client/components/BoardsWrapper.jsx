import React, {PropTypes} from 'react';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayCanvas from './DisplayCanvas.jsx';
import CursorsWrapper from './CursorsWrapper.jsx';
import Nav from './Nav.jsx';

export default class BoardsWrapper extends React.Component {

	render(){
		return (
			<div className="wrap">
				<div className="main-board">
					<div className="canvas-cont">
						<DisplayCanvas 
							board = {this.props.boards[this.props.iSelectedBoard]}
						/>
						<DrawingCanvas 
							color = {this.props.selectedColor}
							selectedShape = {this.props.selectedShape}
							onDrawFinish = {this.props.handleDrawFinish}
							onDrawStart = {this.props.handleDrawStart}
						/>
					</div>
					{	!this.props.activeUsers.length ? null : 
							<CursorsWrapper 
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