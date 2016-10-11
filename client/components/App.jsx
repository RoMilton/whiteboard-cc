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

	static get NAMES(){
		return [
			'User 1',
			'User 2',
			'User 3',
			'User 4',
			'User 5',
			'User 6',
			'User 7'
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
			//selectedColor : App.COLORS[0],
			boards : [this.getNewBoard()],
			iSelectedBoard : 0,
			history : [],
			activeUsers : []
		};

		Meteor.call('getGalleryId',this.props.source,(err,galleryId)=>{
			this.state.subscription = {
				gallery : Meteor.subscribe('galleries',[galleryId]),
				activeUsers : Meteor.subscribe('activeUsers',[galleryId]),
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
		Tracker.autorun(()=> {
			let gallery = this.gallery();
			// console.log('received gallery',gallery);
			if (gallery){
				let userIndex = (this.state.userIndex === undefined) ? gallery.boards.length - 1 : this.state.userIndex;
				this.setState({
					boards : gallery.boards,
					galleryName : gallery.galleryName,
					iSelectedBoard : gallery.iSelectedBoard,
					userIndex : userIndex
				});
			}
		});

		Tracker.autorun(()=> {
			let activeUsers = this.activeUsers();
			//console.log('activeUsers',activeUsers);
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
		//if (this.sendDataToServer){
		if (!Tracker.currentComputation){
			let gallery = this.gallery();
			if (gallery){
				gallery.boards = nextState.boards;
				gallery.iSelectedBoard = nextState.iSelectedBoard;
				Meteor.call('updateGallery',gallery);
			}

		}

		if (nextState.galleryName !== this.state.galleryName){
			this.setURL(nextState.galleryName);
		}

		if ( nextState.name !== this.state.name
		|| nextState.color !== this.state.selectedColor){
			Meteor.call('updateUser',nextState.name,nextState.selectedColor);
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
		return [null];
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
			return [this.getNewBoard()];
		});
		this.setState({
			boards : boards,
		});
	}

	clearAll(){
		let newBoards = [];
		newBoards.push([this.getNewBoard()]);
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
		boards[historyItem.iBoard][historyItem.userIndex] = historyItem.imageDataURL;
		this.setState({
			boards : boards
		});
		this.state.history.pop();
	}


	insertShape(imageDataURL){
		return new Promise((resolve,reject)=>{
			let { iSelectedBoard , userIndex } = this.state;
			let currentImage = this.state.boards[iSelectedBoard][userIndex];
			let newHistoryItem = {
				iBoard : iSelectedBoard,
				userIndex : userIndex,
				imageDataURL : currentImage
			}

			this.state.history.push(newHistoryItem);

			let updateState = (newImageDataUrl)=>{
				Utils.preloadImage(newImageDataUrl).then(()=>{
					let boards = this.state.boards.slice();
					boards[iSelectedBoard][userIndex] = newImageDataUrl;
					self.selfUpdate = true;
					this.setState({
						boards: boards
					});
					setTimeout(resolve,10);
				});
			}

			if (currentImage){
				Utils.mergeImages(currentImage,imageDataURL).then(updateState,reject);
			}else{
				updateState(imageDataURL)
			}
		});
	}

	render(){
		let sessionId = this.sessionId();
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
							<DisplayBoard images = {this.state.boards[this.state.iSelectedBoard]}/>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								onShapeFinish = {this.insertShape.bind(this)}
							/>
							{ this.state.activeUsers.length && 
								<CursorsWrapper 
									sessionId = { sessionId }
									activeUsers = {this.state.activeUsers}
								/>
							}
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
