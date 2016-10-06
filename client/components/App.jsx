import React from 'react';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayBoard from './DisplayBoard.jsx';
import Nav from './Nav.jsx';
import Utils from '../utils/Utils.js';
import ReactTooltip from 'react-tooltip';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';

Session = new Mongo.Collection("sessions");

/**
 * Whiteboard App Component
 *
 * @class App
 * @extends React.Component
 */
export default class App extends TrackerReact(React.Component) {

	/**
	 * COLORS used by whiteboard App
	 *
	 * @property COLORS
	 * @static
	 */
	static get COLORS(){
		return [
			'#1846ec',
			'#F5A623',
			'#ae2be1',
			'#F8E71C',
			'#8B572A',
			'#7ED321',
			'#4A90E2',
			'#9013FE',
			'#B8E986',
			'#111',
			'#9B9B9B',
			'#fff',
			'#3A5065',
			'#417505',
			'#640F0F',
			'#F19F71',
			'#FFE1B5',
			'#39A7A2'
		];
	}

	/**
	 * The maximum number of boards in a session
	 *
	 * @property MAX_BOARD_COUNT
	 * @static
	 */
	static get MAX_BOARD_COUNT(){
		return 6;
	}


	/**
	 * tools used by whiteboard App
	 *
	 * @property COLORS
	 * @static
	 */
	static get TOOLS(){
		return [	
			{
				name : 'pen',
				description : 'Pen Tool',
				isDefault : true,
			},
			{
				name : 'line',
				description : 'Line Tool'
			},
			{
				name : 'rect',
				description : 'Rectangle Tool'
			},
			{
				name : 'text',
				description : 'Insert Text'
			}
		];
	}

	constructor(props){
		super(props);
		this.state = {
			selectedTool : this.getDefaultTool(),
			selectedColor : App.COLORS[0],
			boards : [null],
			iSelectedBoard : 0,
			history : [],
			subscription: {
				session: Meteor.subscribe('session',[props.session.link])
			}
		};
		
		Tracker.autorun(()=> {
		  let session = this.session();
		  console.log('new sess',session);
		  if (session){
			  this.setState({
			  	boards : session.boards
			  });
		  }
		});

	}

	session(){
		return Session.find().fetch()[0];
	}

	setURL(link){
		if (link) { history.pushState(null, null,link); }
	}

	componentDidMount(){
		this.setURL(this.props.session.link);
	}

	componentWillUnmount() {
		this.state.session.stop();     
	}

	componentWillUpdate(nextProps,nextState){
		if (this.props.session.link !== nextProps.session.link) {
			this.setURL(nextProps.session.link)
		};
		// console.log(this.session()[0]);
		Meteor.call('updateBoards',{
			_id : this.session()._id,
			boards : nextState.boards
		});
	}

	componentDidUpdate(){
		let session = this.session();
	}

	/**
	 * Gets name of default tool (eg 'pen') that the user should start with.
	 * This is done by by looking which tool has 'is-default' property set to
	 * true in the TOOLS constant.
	 *
	 * @method getDefaultTool
	 */
	getDefaultTool(){
		//for each tool
		for (let key in App.TOOLS){
			if (App.TOOLS[key].isDefault) {return App.TOOLS[key].name;}
		}
	}


	/**
	 * Handles tool change
	 *
	 * @method handleToolChange
	 * @param {String} toolName - String to represent new tool. Must be property in TOOLS
	 */
	changeTool(toolName){
		this.setState({
			selectedTool : toolName
		});
	}

	changeColor(newCol){
		this.setState({
			selectedColor : newCol
		});
	}

	getNewBoard(){
		return null;
	}

	addBoard(){
		let boards = this.state.boards.slice();
		boards.push(this.getNewBoard());
		this.setState({
			boards : boards,
			iSelectedBoard : boards.length - 1
		});
	}

	clearMy(){
		let boards = this.state.boards.map(()=>{
			return this.getNewBoard();
		});
		this.setState({
			boards : boards,
		});
	}

	clearAll(){
		let newBoards = [];
		newBoards.push(this.getNewBoard());
		this.setState({
			boards : newBoards,
			iSelectedBoard : newBoards.length - 1
		});
	}

	changeBoard(iSelectedBoard){
		this.setState({
			iSelectedBoard : iSelectedBoard
		});
	}

	undoLast(){
		if (!this.state.history.length){return;}
		let boards = this.state.boards.slice();
		let historyItem = this.state.history[this.state.history.length-1];
		boards[historyItem.iBoard] = historyItem.imageDataURL;
		this.setState({
			boards : boards
		});
		this.state.history.pop();
	}


	insertShape(imageDataURL){
		return new Promise((resolve,reject)=>{
			let boards = this.state.boards.slice();
			let iSelectedBoard = this.state.iSelectedBoard;
			let newHistoryItem = {
				iBoard : iSelectedBoard,
				imageDataURL : boards[iSelectedBoard]
			}
			this.state.history.push(newHistoryItem);

			let updateState = (newImageDataUrl)=>{
				Utils.preloadImage(newImageDataUrl).then(()=>{
					boards[iSelectedBoard] = newImageDataUrl;
					this.setState({
						boards: boards
					});
					setTimeout(resolve,10);
				});
			}

			if (boards[iSelectedBoard]){
				Utils.mergeImages(boards[iSelectedBoard],imageDataURL).then(updateState,reject);
			}else{
				updateState(imageDataURL)
			}
		});
	}

	render(){
		return (
			<div id="container">
				<Toolbar
					tools = {App.TOOLS}
					colors = {App.COLORS}
					selectedTool = {this.state.selectedTool}
					selectedColor = {this.state.selectedColor}
					handleToolChange = {this.changeTool.bind(this)}
					handleUndoClick = {this.undoLast.bind(this)}
					handleColorClick = {this.changeColor.bind(this)}
					handleClearMyClick = {this.clearMy.bind(this)}
					handleClearAllClick = {this.clearAll.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							<DisplayBoard
								boards = {this.state.boards}
								iSelectedBoard = {this.state.iSelectedBoard}
							/>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								onShapeFinish = {this.insertShape.bind(this)}
							/>
						</div>
						<Nav
							boards = {this.state.boards}
							iSelectedBoard = {this.state.iSelectedBoard}
							onItemChange = {this.changeBoard.bind(this)}
							onItemAdd = {this.addBoard.bind(this)}
							maxBoardCount = {App.MAX_BOARD_COUNT}
						/>
					</div>
				</main>
			<ReactTooltip 
				place="bottom"
				effect="solid"
			/>
			</div>
		)
	}
}
