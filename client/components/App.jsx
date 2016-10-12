import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';
import Utils from '../utils/Utils.js';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayBoard from './DisplayBoard.jsx';
import Nav from './Nav.jsx';
import Alert from './Alert.jsx';
import Whiteboard from '../Whiteboard.js';
import CursorsWrapper from './CursorsWrapper.jsx';

Galleries = new Mongo.Collection("galleries");
ActiveUsers = new Mongo.Collection("activeUsers");

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
			'#E74C3C',
			'#8B572A',
			'#7ED321',
			'#4A90E2',
			'#9013FE',
			'#B8E986',
			'#111',
			'#9B9B9B',
			'#ffffff',
			'#3A5065',
			'#417505',
			'#640F0F',
			'#F19F71',
			'#FFE1B5',
			'#39A7A2'
		];
	}

	static get NAMES(){
		return [
		    "Friendly Fox",
			"Brilliant Beaver",
			"Observant Owl",
			"Gregarious Giraffe",
			"Wild Wolf",
			"Silent Seal",
			"Wacky Whale",
			"Curious Cat",
			"Intelligent Iguana"
		];
	}

	/**
	 * The maximum number of boards in a gallery
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
			}
			// {
			// 	name : 'text',
			// 	description : 'Insert Text'
			// }
		];
	}

	constructor(props){
		super(props);

		this.state = {
			selectedTool : this.getDefaultTool(),
			//selectedColor : App.COLORS[0],
			boards : [this.getNewBoard()],
			iSelectedBoard : 0,
			history : [],
			activeUsers : []
		};

		Meteor.call('getGalleryId',this.props.source,(err,gallery)=>{
			this.state.galleryId = gallery._id;
			this.state.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery._id]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery._id]),
			};
		});

	}

	gallery(){
		return Galleries.find().fetch()[0];
	}

	activeUsers(){
		return ActiveUsers.find().fetch();
	}

	setURL(galleryName){
		if (galleryName) { history.pushState(null, null,galleryName); }
	}

	sessionId(){
		return Meteor.default_connection._lastSessionId;
	}

	setUpTracker(){
		// Tracker.autorun(()=> {
		// 	let gallery = this.gallery();
		// 	console.log('received subscription',this.state.boards);
		// 	if (gallery
		// 	&& (gallery.lastUpdatedBy !== this.sessionId())){
		// 		this.receivedData = true;
		// 		this.setState({
		// 			//boards : gallery.boards,
		// 			galleryName : gallery.galleryName,
		// 			iSelectedBoard : gallery.iSelectedBoard
		// 		});
		// 	}
		// });

		Tracker.autorun(()=> {
			let activeUsers = this.activeUsers();
			let newState = {}
			newState.activeUsers = activeUsers;
			if (!this.state.name){
				newState.name = App.NAMES[activeUsers.length-1];
			}
			if (!this.state.selectedColor){
				newState.selectedColor = App.COLORS[activeUsers.length-1];	
			}
			this.setState(newState);
		});
	}

	componentDidMount(){
		this.setUpTracker();
		Streamy.on('board-update',(data)=>{
			if (data.__from !== this.sessionId()){
				//insert new shape
			}
		});

	}

	componentWillUnmount() {
		if (this.state.subscription){
			this.state.subscription.gallery.stop();
			this.state.subscription.activeUsers.stop();
		}
	}

	changeName(newName){
		this.setState({
			name : newName
		});
	}

	handleURLChange(newURL){
		//console.log('handleURLChange',newURL);
		Meteor.call('updateGalleryName', {
			currentName : this.state.galleryName,
			newName : newURL
		},(err,res)=>{
			if (err){
				console.log('err',err);
			}else{
				//console.log('success',res);
				this.setState({
					galleryName : newURL
				});
			}
		});
	}

	componentWillUpdate(nextProps,nextState){
		if (nextState.galleryName !== this.state.galleryName){
			this.setURL(nextState.galleryName);
		}

	}

	componentDidUpdate(prevProps, prevState){
		if (!this.receivedData){
			// if (this.state.iSelectedBoard !== prevState.iSelectedBoard){
			// 	Meteor.call('changeBoard',{
			// 		galleryId : this.state.galleryId,
			// 		iBoard : this.state.iSelectedBoard
			// 	},(err,result)=>{
			// 		if (err){
			// 			console.log('error changing board',err);
			// 		}else{

			// 		}
			// 	 }
			// 	);
			// }

			if ( this.state.name !== prevState.name
			|| this.state.color !== prevState.selectedColor){
				Meteor.call('updateUser',this.state.name,this.state.selectedColor);
			}

		}else{
			this.receivedData = false;
		}
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
		return new Whiteboard();
	}

	addBoard(){
		let boards = this.state.boards.slice();
		boards.push(this.getNewBoard());
		console.log('99999');
		this.setState({
			boards : boards,
			iSelectedBoard : boards.length - 1
		});
	}

	clearMy(){
		// let boards = this.state.boards.map(()=>{
		// 	return [this.getNewBoard()];
		// });
		// this.setState({
		// 	boards : boards,
		// });
	}

	clearAll(){
		// let newBoards = [];
		// newBoards.push([this.getNewBoard()]);
		// this.setState({
		// 	boards : newBoards,
		// 	iSelectedBoard : newBoards.length - 1
		// });
	}

	changeBoard(iSelectedBoard){
		this.setState({
			iSelectedBoard : iSelectedBoard
		});
	}

	undoLast(){
		// if (!this.state.history.length){return;}
		// let boards = this.state.boards.slice();
		// let historyItem = this.state.history[this.state.history.length-1];
		// boards[historyItem.iBoard][historyItem.userIndex] = historyItem.imageDataURL;
		// this.setState({
		// 	boards : boards
		// });
		// Meteor.call('updateBoard',{
		// 	galleryId : this.state.galleryId,
		// 	iBoard : historyItem.iBoard,
		// 	userIndex : historyItem.userIndex,
		// 	newData : historyItem.imageDataURL,
		// 	activeUsers : this.state.activeUsers
		// });
		// this.state.history.pop();
	}

	handleShapeInsert(shapeModel, iBoard = this.state.iSelectedBoard){
		return new Promise((resolve,reject)=>{
			// console.log('handleShapeInsert()',shapeModel);
			// console.log('iBoard',iBoard);
			// console.log('inserting',this.state.boards);

			

			// let board = this.state.boards[iBoard];
			// board.addShape(shapeModel);
			
			let boards = this.state.boards.slice();
			boards[iBoard].addShape(shapeModel);
			this.setState({
				boards : boards,
				onlyRenderLastShape : true
			});

			resolve();
		});
	}

	render(){
		let sessionId = this.sessionId();
		let selectedBoard = this.state.boards[this.state.iSelectedBoard]
		//console.log('render()',selectedBoard.shapes);
		if (!this.state.activeUsers.length && this.state.boards.length){
			return (<div>Loading</div>);
		}
		return (
			<div id="container">
				<Toolbar
					tools = {App.TOOLS}
					colors = {App.COLORS}
					name = {this.state.name}
					galleryName = {this.state.galleryName}
					selectedTool = {this.state.selectedTool}
					selectedColor = {this.state.selectedColor}
					handleToolChange = {this.changeTool.bind(this)}
					handleUndoClick = {this.undoLast.bind(this)}
					handleColorClick = {this.changeColor.bind(this)}
					handleClearMyClick = {this.clearMy.bind(this)}
					handleClearAllClick = {this.clearAll.bind(this)}
					handleNameChange = {this.changeName.bind(this)}
					handleURLChange = {this.handleURLChange.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							{	
								selectedBoard.shapes.length && 
								<DisplayBoard 
									shapes = {selectedBoard.shapes}
									drawLastShapeOnly = {selectedBoard.drawLastShapeOnly }
								/>
							}
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								onDrawFinish = {this.handleShapeInsert.bind(this)}
							/>
							{ this.state.activeUsers.length && 
								<CursorsWrapper 
									sessionId = { sessionId }
									activeUsers = {this.state.activeUsers}
								/>
							}
						</div>
						
					</div>
				</main>
				<Alert
					text={this.state.alertText}
				/>
				<ReactTooltip 
					place="bottom"
					effect="solid"
				/>
			</div>
		)
	}
}
/*
<Nav
							boards = {this.state.boards}
							iSelectedBoard = {this.state.iSelectedBoard}
							onItemChange = {this.changeBoard.bind(this)}
							onItemAdd = {this.addBoard.bind(this)}
							maxBoardCount = {App.MAX_BOARD_COUNT}
						/>
*/