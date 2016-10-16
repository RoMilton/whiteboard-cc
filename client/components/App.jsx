import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';
import Utils from '../../universal/Utils.js';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayBoard from './DisplayBoard.jsx';
import Nav from './Nav.jsx';
import Alert from './Alert.jsx';
import Whiteboard from '../../universal/Whiteboard.js';
import CursorsWrapper from './CursorsWrapper.jsx';
import Colors from '../../universal/Colors.js'

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
			activeUsers : [],
			alert : {
				visible : false,
				text : ''
			}
		};

		Meteor.call('getGalleryId',this.props.source,(err,res)=>{
			// console.log('gallery received - ',res);
			this.state.name = res.user.nickname;
			this.state.selectedColor = res.user.color;
			let gallery = res.gallery;
			this.state.iSele
			this.state.galleryName = gallery.galleryName;
			this.setURL(gallery.galleryName);
			this.state.galleryId = gallery._id;
			this.state.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery._id]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery._id])
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
			console.log('received subscription',gallery);
			console.log('my session id',this.sessionId());
			if (gallery
			&& (gallery.lastUpdatedBy !== this.sessionId())){
				this.receivedData = true;
				this.updateGallery(gallery.iSelectedBoard,gallery.galleryName,gallery.lastUpdatedBy);
			}
		});

		Tracker.autorun(()=> {
			let activeUsers = this.activeUsers();
			let newState = {}
			newState.activeUsers = activeUsers;
			this.setState(newState);
		});
	}

	componentDidMount(){
		this.setUpTracker();
		Streamy.on('insert-shape',(data)=>{
			if (data.__from !== this.sessionId()){
				// console.log('received new shape',data);
				this.handleNewShape(data.shape,data.iBoard,false);
			}
		});

		Streamy.on('remove-shapes',(data)=>{
			if (data.__from !== this.sessionId()){
				data.items.forEach((itemToRemove)=>{
					this.removeShape(itemToRemove.iBoard,itemToRemove.shapeId);
				});
			}
		});

		Streamy.on('clear-all',(data)=>{
			if (data.__from !== this.sessionId()){
				this.handleClearAll(false);
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

	componentDidUpdate(prevProps, prevState){

		if (prevState.galleryName !== this.state.galleryName){
			this.setURL(this.state.galleryName);
		}

		if (!this.receivedData){
			if (this.state.iSelectedBoard !== prevState.iSelectedBoard){
				Meteor.call('changeBoard',{
					galleryId : this.state.galleryId,
					iBoard : this.state.iSelectedBoard
				},(err,result)=>{
					if (err){
						console.log('error changing board',err);
					}else{

					}
				 }
				);
			}
			//console.log('sending user',this.state.name);
			if ( this.state.name !== prevState.name
			|| this.state.selectedColor !== prevState.selectedColor){
				// console.log('111','sending',this.state.name);
				// console.log('this.state.name',this.state.name);
				// console.log('prevState.name',prevState.name);
				// console.log('this.state.color',this.state.color);
				// console.log('prevState.selectedColor',prevState.selectedColor);
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

	updateGallery(iSelectedBoard,galleryName,changedBy = this.sessionId()){
		let newState = {};
		if (galleryName){
			newState.galleryName = galleryName;
		}

		if (iSelectedBoard !== undefined && iSelectedBoard !== this.state.iSelectedBoard){
			this.initial = true;
			newState.iSelectedBoard = iSelectedBoard;
			
			let name = this.state.activeUsers.find((user)=>{return user.sessionId === changedBy}).name;

			newState.alert = {
				visible : true,
				text : 'Changed to board '+ (iSelectedBoard + 1) + ' by '+ name
			};
			this.initial = false;
			if (iSelectedBoard > this.state.boards.length - 1){
				newState.boards = this.state.boards.slice()
				let noOfBoardsToAdd = iSelectedBoard + 1 - this.state.boards.length;
				for (var i = 0; i<noOfBoardsToAdd; i++){
					newState.boards.push(new Whiteboard());
				}
			}

		}
		this.setState(newState);
	}

	changeBoard(iBoard){
		this.updateGallery(iBoard);
	}

	addBoard(){
		this.changeBoard(this.state.boards.length);
	}

	handleClearAll(send = true){
		let boards = this.state.boards.slice();
		boards.forEach(board=>{
			board.clear();
		});
		if (send){
			Streamy.sessions(this.allSessionIds()).emit('clear-all',{});
		}
		this.setState({
			boards : boards,
			history : []
		});
	}


	allSessionIds(){
		return this.state.activeUsers.map((user)=>{
			return user.sessionId;
		});
	}

	removeShape(iBoard,shapeModel){
		let boards = this.state.boards.slice();
		if (!boards[iBoard]){return;}
		boards[iBoard].removeShape(shapeModel);
		this.setState({
			boards : boards
		})
	}

	handleUndo(numberToRemove = 1){
		let history = this.state.history.slice(),
			boards = this.state.boards.slice();

		numberToRemove = numberToRemove === 'all' ? history.length : numberToRemove;
		let itemsToRemove = history.slice(history.length - numberToRemove);

		if (itemsToRemove){
			//console.log('itemsToRemove',itemsToRemove);
			Streamy.sessions(this.allSessionIds()).emit(
				'remove-shapes',
				{
					items : itemsToRemove
				}
			);

			itemsToRemove.forEach((historyItem)=>{			
				boards[historyItem.iBoard].removeShape(historyItem.shapeId);
			});		
			
			history = history.slice(0, history.length - itemsToRemove.length);

			this.setState({
				boards : boards,
				history : history
			});
		}
	}

	handleAlertFinish(){
		this.setState({
			alert : {
				visible : false,
				text : ''
			}
		});
	}

	handleNewShape(shapeModel, iBoard = this.state.iSelectedBoard, send = true ){
		let newState = {};
		if (send){
			let newItemObj = {
				iBoard : iBoard,
				shape : shapeModel
			}

			Streamy.sessions(this.allSessionIds()).emit(
				'insert-shape',
				newItemObj
			);

			newState.history = this.state.history.slice();
			newState.history.push({
				iBoard : iBoard,
				shapeId : shapeModel.id
			});
		}

		newState.boards = this.state.boards.slice();
		newState.boards[iBoard].addShape(shapeModel);

		this.setState(newState);
	}

	render(){
		
		let sessionId = this.sessionId();
		let selectedBoard = this.state.boards[this.state.iSelectedBoard]
		if (!this.state.activeUsers.length && this.state.boards.length){
			return (<div className="spinner"></div>);
		}
		return (
			<div id="container">
				<Toolbar
					tools = {App.TOOLS}
					colors = {Colors}
					name = {this.state.name}
					galleryName = {this.state.galleryName}
					selectedTool = {this.state.selectedTool}
					selectedColor = {this.state.selectedColor}
					handleColorClick = {this.changeColor.bind(this)}
					handleToolChange = {this.changeTool.bind(this)}
					handleUndoClick = {this.handleUndo.bind(this)}
					handleClearAllClick = {this.handleClearAll.bind(this)}
					handleNameChange = {this.changeName.bind(this)}
					handleURLChange = {this.handleURLChange.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							<DisplayBoard 
								board = {selectedBoard}
							/>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								onDrawFinish = {this.handleNewShape.bind(this)}
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
				<Alert
					visible = {this.state.alert.visible}
					text = {this.state.alert.text}
					handleAlertFinish = {this.handleAlertFinish.bind(this)}
				/>
				<ReactTooltip 
					place="bottom"
					effect="solid"
				/>
			</div>
		)
	}
}