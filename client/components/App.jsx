import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayBoard from './DisplayBoard.jsx';
import Nav from './Nav.jsx';
import Alert from './Alert.jsx';
import Whiteboard from '../../universal/Whiteboard.js';
import CursorsWrapper from './CursorsWrapper.jsx';
import Colors from '../../universal/Colors.js';
import ShapeMap from '../shapes/ShapeMap.js';

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

	constructor(props){
		super(props);

		this.state = {
			selectedShape : this._getDefaultTool(),
			//selectedColor : App.COLORS[0],
			boards : [new Whiteboard()],
			iSelectedBoard : 0,
			history : [],
			activeUsers : [],
			alert : {
				visible : false,
				text : ''
			}
		};

		Meteor.call('getGalleryId',this.props.source,(err,res)=>{
			this.state.name = res.user.nickname;
			this.state.selectedColor = res.user.color;
			let gallery = res.gallery;
			this.state.iSele
			this.state.galleryName = gallery.galleryName;
			this._setURL(gallery.galleryName);
			this.state.galleryId = gallery._id;
			this.state.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery._id]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery._id])
			};
		});

		// binding methods here to improve performance of re-renders
		this._handleColorChange = this._handleColorChange.bind(this)
		this._handleToolChange = this._handleToolChange.bind(this);
		this._handleUndo = this._handleUndo.bind(this);
		this._handleClearMy = this._handleClearMy.bind(this);
		this._handleClearAll = this._handleClearAll.bind(this);
		this._handleNameChange = this._handleNameChange.bind(this);
		this._handleUrlChange = this._handleUrlChange.bind(this);
		this._handleNewShape = this._handleNewShape.bind(this);
		this._handleAddBoard = this._handleAddBoard.bind(this);
		this._handleBoardChange = this._handleBoardChange.bind(this);
		this._handleAlertFinish = this._handleAlertFinish.bind(this);

	}

	_gallery(){
		return Galleries.find().fetch()[0];
	}

	_activeUsers(){
		return ActiveUsers.find().fetch();
	}

	_setURL(galleryName){
		if (galleryName) { history.pushState(null, null,galleryName); }
	}

	_sessionId(){
		return Meteor.default_connection._lastSessionId;
	}

	_setUpTracker(){
		Tracker.autorun(()=> {
			let gallery = this._gallery();
			console.log('received subscription',gallery);
			console.log('my session id',this._sessionId());
			if (gallery
			&& (gallery.lastUpdatedBy !== this._sessionId())){
				this.receivedData = true;
				this.updateGallery(gallery.iSelectedBoard,gallery.galleryName,gallery.lastUpdatedBy);
			}
		});

		Tracker.autorun(()=> {
			let activeUsers = this._activeUsers();
			let newState = {}
			newState.activeUsers = activeUsers;
			this.setState(newState);
		});
	}

	componentDidMount(){
		this._setUpTracker();
		Streamy.on('insert-shape',(data)=>{
			if (data.__from !== this._sessionId()){
				// console.log('received new shape',data);
				this._handleNewShape(data.shape,data.iBoard,false);
			}
		});

		Streamy.on('remove-shapes',(data)=>{
			if (data.__from !== this._sessionId()){
				data.items.forEach((itemToRemove)=>{
					this._removeShape(itemToRemove.iBoard,itemToRemove.shapeId);
				});
			}
		});

		Streamy.on('clear-all',(data)=>{
			if (data.__from !== this._sessionId()){
				this._handleClearAll(false);
			}
		});
	}

	componentWillUnmount() {
		if (this.state.subscription){
			this.state.subscription.gallery.stop();
			this.state.subscription.activeUsers.stop();
		}
	}

	_handleNameChange(newName){
		return new Promise((resolve,reject)=>{
			Meteor.call('updateNickname',newName, (err,result)=>{
				if (err){
					reject(err.reason);
				}else{
					this.setState({
						name : newName
					});
					resolve(newName)
				}
			});
		});
	}

	_handleUrlChange(newURL){
		return new Promise((resolve,reject)=>{
			Meteor.call('updateGalleryName', {
				currentName : this.state.galleryName,
				newName : newURL
			},(err,res)=>{
				if (err){
					reject(err.reason);
				}else{
					this.setState({
						galleryName : newURL
					});
					resolve(newURL);
				}
			});
		});
	}

	componentDidUpdate(prevProps, prevState){

		if (prevState.galleryName !== this.state.galleryName){
			this._setURL(this.state.galleryName);
		}

		if (!this.receivedData){
			if (this.state.iSelectedBoard !== prevState.iSelectedBoard){
				Meteor.call('_handleBoardChange',{
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
			// if ( this.state.name !== prevState.name
			// || this.state.selectedColor !== prevState.selectedColor){
				
			// }

		}else{
			this.receivedData = false;
		}
	}


	/**
	 * Gets name of default tool (eg 'pen') that the user should start with.
	 * This is done by by looking which tool has 'is-default' property set to
	 * true in the ShapeMap constant.
	 *
	 * @method getDefaultTool
	 */
	_getDefaultTool(){
		//for each tool
		for (let key in ShapeMap){
			if (ShapeMap[key].isDefault) {return key;}
		}
	}


	/**
	 * Handles tool change
	 *
	 * @method _handleToolChange
	 * @param {String} toolName - String to represent new tool. Must be property in TOOLS
	 */
	_handleToolChange(toolName){
		this.setState({
			selectedShape : toolName
		});
	}

	_handleColorChange(newCol){
		return new Promise((resolve,reject)=>{
			Meteor.call('updateColor',newCol, (err,result)=>{
				if (err){
					reject(err.reason);
				}else{
					this.setState({
						selectedColor : newCol
					});
					resolve(newCol)
				}
			});
		});
	}

	updateGallery(iSelectedBoard,galleryName,changedBy = this._sessionId()){
		let newState = {};
		if (galleryName){
			newState.galleryName = galleryName;
		}

		if (iSelectedBoard !== undefined && iSelectedBoard !== this.state.iSelectedBoard){
			
			newState.iSelectedBoard = iSelectedBoard;
			let name = this.state.activeUsers.find((user)=>{return user.sessionId === changedBy}).name;

			newState.alert = {
				visible : true,
				text : 'Changed to board '+ (iSelectedBoard + 1) + ' by '+ name
			};

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

	_handleBoardChange(iBoard){
		this.updateGallery(iBoard);
	}

	_handleAddBoard(){
		this._handleBoardChange(this.state.boards.length);
	}

	_handleClearAll(send = true){
		let boards = this.state.boards.slice();
		boards.forEach(board=>{
			board.clear();
		});
		if (send){
			Streamy.sessions(this._allSessionIds()).emit('clear-all',{});
		}
		this.setState({
			boards : boards,
			history : []
		});
	}


	_allSessionIds(){
		return this.state.activeUsers.map((user)=>{
			return user.sessionId;
		});
	}

	_removeShape(iBoard,shapeModel){
		let boards = this.state.boards.slice();
		if (!boards[iBoard]){return;}
		boards[iBoard].removeShape(shapeModel);
		this.setState({
			boards : boards
		})
	}

	_handleUndo(numberToRemove = 1){
		let history = this.state.history.slice(),
			boards = this.state.boards.slice();

		numberToRemove = numberToRemove === 'all' ? history.length : numberToRemove;
		let itemsToRemove = history.slice(history.length - numberToRemove);

		if (itemsToRemove){
			//console.log('itemsToRemove',itemsToRemove);
			Streamy.sessions(this._allSessionIds()).emit(
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

	_handleClearMy(){
		this._handleUndo('all');
	}

	_handleAlertFinish(){
		this.setState({
			alert : {
				visible : false,
				text : ''
			}
		});
	}

	_handleNewShape(shapeModel, iBoard = this.state.iSelectedBoard, send = true ){
		let newState = {};
		if (send){
			let newItemObj = {
				iBoard : iBoard,
				shape : shapeModel
			}

			Streamy.sessions(this._allSessionIds()).emit(
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
		let sessionId = this._sessionId();
		if (!this.state.activeUsers.length && this.state.boards.length){
			return (<div className="spinner"></div>);
		}
		return (
			<div id="container">
				<Toolbar
					shapes= {ShapeMap}
					colors = {Colors}
					name = {this.state.name}
					galleryName = {this.state.galleryName}
					selectedShape = {this.state.selectedShape}
					selectedColor = {this.state.selectedColor}
					handleColorClick = {this._handleColorChange}
					handleToolChange = {this._handleToolChange}
					handleUndoClick = {()=>{this._handleUndo(1)}}
					handleClearMyClick = {this._handleClearMy}
					handleClearAllClick = {this._handleClearAll}
					handleNameChange = {this._handleNameChange}
					handleUrlChange = {this._handleUrlChange}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							<DisplayBoard 
								shapes = {this.state.boards[this.state.iSelectedBoard].shapes}
							/>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								selectedShape = {this.state.selectedShape}
								onDrawFinish = {this._handleNewShape}
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
							onItemChange = {this._handleBoardChange}
							onItemAdd = {this._handleAddBoard}
							maxBoardCount = {App.MAX_BOARD_COUNT}
						/>
					</div>
				</main>
				<Alert
					visible = {this.state.alert.visible}
					text = {this.state.alert.text}
					handleFinish = {this._handleAlertFinish}
				/>
				<ReactTooltip 
					place="bottom"
					effect="solid"
				/>
			</div>
		)
	}
}