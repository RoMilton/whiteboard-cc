import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayCanvas from './DisplayCanvas.jsx';
import Nav from './Nav.jsx';
import Alert from './Alert.jsx';
import CursorsWrapper from './CursorsWrapper.jsx';
import update from 'react-addons-update';


import ShapeMap from '../shapes/ShapeMap.js';
import Colors from '../../universal/Colors.js';
import Whiteboard from '../../universal/Whiteboard.js';
import Gallery from '../../universal/Gallery.js';

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
			selectedColor : '',
			history : [],
			activeUsers : [],
			alert : {
				visible : false,
				text : ''
			},
			gallery : {
				galleryId :'',
				galleryName : '',
				iSelectedBoard : 0
			}
		};

		Meteor.call('getGallery',this.props.source,(err,res)=>{
			this.state.name = res.user.nickname;
			this.state.selectedColor = res.user.color;
			let gallery = new Gallery(res.gallery);
			this.state.gallery = gallery;
			this._setURL(gallery.galleryName);

			this.state.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery.galleryId]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery.galleryId])
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
			let newGallery = this._gallery();
			if (!newGallery) { return; }
			if (newGallery.lastUpdatedBy === this._sessionId()){ return }
			if (newGallery.iSelectedBoard !== this.state.gallery.iSelectedBoard){
				this._handleBoardChange(newGallery.iSelectedBoard,newGallery.lastUpdatedBy);
			}
			if (newGallery.galleryName !== this.state.gallery.galleryName){
				this._handleUrlChange(newGallery.galleryName,newGallery.lastUpdatedBy);
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
				this._handleNewShape(data.shape,data.iBoard,false);
			}
		});

		Streamy.on('remove-shapes',(data)=>{
			if (data.__from !== this._sessionId()){
				let boards = this.state.gallery.boards.slice();
				data.items.forEach((itemToRemove)=>{
					if (!boards[itemToRemove.iBoard]){return;}
					boards[itemToRemove.iBoard].removeShape(itemToRemove.shapeId);
				});
				let gallery = update(this.state.gallery, { 
					boards: { $set : boards } 
				});

				this.setState({
					gallery : gallery
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

	_handleUrlChange(galleryName, changedBy = this._sessionId()){
		galleryName = galleryName.toLowerCase();
		return new Promise((resolve,reject)=>{
			let updateState = ()=>{
				let gallery = this.state.gallery;
				gallery.setGalleryName(galleryName);
				this._setURL(this.state.gallery.galleryName);
				this.setState({
					gallery : gallery
				});
				resolve(galleryName);
			}
			if (changedBy === this._sessionId()){
				Meteor.call('updateGalleryName', {
					currentName : this.state.gallery.galleryName,
					newName : galleryName
				},(err,res)=>{
					if (err){
						reject(err.reason);
					}else{
						updateState();
					}
				});
			}else{
				updateState();
			}
		});
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

	_handleBoardChange(iBoard, changedBy = this._sessionId()){
		return new Promise((resolve,reject)=>{
			let newState = {};
			newState.gallery = this.state.gallery;
			newState.gallery.setSelectedBoard(iBoard);			
			let name = this.state.activeUsers.find((user)=>{return user.sessionId === changedBy}).name;
			newState.alert = {
				visible : true,
				text : 'Changed to board '+ (iBoard + 1) + ' by '+ name
			};
			this.setState(newState);

			if (changedBy === this._sessionId()){
				Meteor.call('changeBoard',{
					galleryId : this.state.gallery.galleryId,
					iBoard : iBoard
				},(err,result)=>{
					if (err){
						reject(err)
					}else{
						resolve();
					}
				});
			}
		});
	}

	_handleAddBoard(){
		this._handleBoardChange(this.state.gallery.boards.length);
	}

	_handleClearAll(send = true){
		if (send){
			Meteor.call('clearAll',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds()
			});
		}
		let boards = this.state.gallery.boards.slice();
		boards.forEach(board=>{
			board.clear();
		});
		let gallery = update(this.state.gallery, { 
			boards: { $set : boards } 
		});

		this.setState({
			gallery : gallery,
			history : []
		});
	}


	_allSessionIds(){
		return this.state.activeUsers.map((user)=>{
			return user.sessionId;
		});
	}

	_handleUndo(numberToRemove = 1){
		let history = this.state.history.slice(),
			boards = this.state.gallery.boards.slice();

		numberToRemove = numberToRemove === 'all' ? history.length : numberToRemove;
		let itemsToRemove = history.slice(history.length - numberToRemove);

		if (itemsToRemove){

			Meteor.call('removeShapes',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds(),
				items : itemsToRemove
			});

			itemsToRemove.forEach((historyItem)=>{			
				boards[historyItem.iBoard].removeShape(historyItem.shapeId);
			});

			history = history.slice(0, history.length - itemsToRemove.length);

			let gallery = update(this.state.gallery, { 
				boards: { $set : boards } 
			});

			this.setState({
				gallery : gallery,
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

	_handleNewShape(shapeModel, iBoard = this.state.gallery.iSelectedBoard, send = true ){
		let newState = {};
		if (send){
			let newItemObj = {
				iBoard : iBoard,
				shape : shapeModel
			}

			Meteor.call('insertShape',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds(),
				iBoard : iBoard,
				shape : shapeModel
			});

			newState.history = this.state.history.slice();
			newState.history.push({
				iBoard : iBoard,
				shapeId : shapeModel.id
			});
		}

		let boards = this.state.gallery.boards.slice();
		boards[iBoard].addShape(shapeModel);

		newState.gallery = update(this.state.gallery, { 
			boards: { $set : boards } 
		});

		this.setState(newState);
	}

	render(){
		let sessionId = this._sessionId();
		if (!this.state.activeUsers.length || !this.state.gallery){
			return (<div className="spinner"></div>);
		}
		return (
			<div id="container">
				<Toolbar
					shapes= {ShapeMap}
					colors = {Colors}
					name = {this.state.name}
					galleryName = {this.state.gallery.galleryName}
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
							<DisplayCanvas 
								board = {this.state.gallery.boards[this.state.gallery.iSelectedBoard]}
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
							boards = {this.state.gallery.boards}
							iSelectedBoard = {this.state.gallery.iSelectedBoard}
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