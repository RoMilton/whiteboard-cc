import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';

import Toolbar from './toolbar/Toolbar.jsx';
import BoardsWrapper from './board/BoardsWrapper.jsx';
import Alert from './alert/Alert.jsx';

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
			gallery : null
		};

		this.defaultSource = props.source;

		// binding methods here instead of render() speeds up re-renders
		this._handleColorChange = this._handleColorChange.bind(this)
		this._handleToolChange = this._handleToolChange.bind(this);
		this._handleUndo = this._handleUndo.bind(this);
		this._handleClearMy = this._handleClearMy.bind(this);
		this._handleClearAll = this._handleClearAll.bind(this);
		this._handleNicknameChange = this._handleNicknameChange.bind(this);
		this._handleUrlChange = this._handleUrlChange.bind(this);
		this._handleNewShape = this._handleNewShape.bind(this);
		this._handleBoardAdd = this._handleBoardAdd.bind(this);
		this._handleBoardChange = this._handleBoardChange.bind(this);
		this._handleAlertFinish = this._handleAlertFinish.bind(this);

	}

	_setBrowserUrl(galleryName){
		if (galleryName) { history.pushState(null, null,galleryName); }
	}

	_sessionId(){
		return Meteor.default_connection._lastSessionId;
	}

	_setUpTracker(){
		Tracker.autorun(()=> {
			let newGallery = Galleries.find().fetch()[0];
			if (!newGallery || !this.state.gallery) { return; }
			if (newGallery.lastUpdatedBy === this._sessionId()){ return }
			if (newGallery.iSelectedBoard !== this.state.gallery.iSelectedBoard){
				this._handleBoardChange(newGallery.iSelectedBoard,newGallery.lastUpdatedBy);
			}
			if (newGallery.galleryName !== this.state.gallery.galleryName){
				this._handleUrlChange(newGallery.galleryName,newGallery.lastUpdatedBy);
			}
		});

		Tracker.autorun(()=> {
			let activeUsers = ActiveUsers.find().fetch();
			let newState = {}
			newState.activeUsers = activeUsers;
			this.setState(newState);
		});
	}

	_preventDefault(event){
		event.preventDefault();
	}

	componentDidMount(){
		document.body.addEventListener('touchmove', this._preventDefault);

		let newState = {};
		
		Meteor.call('getGallery',this.defaultSource,(err,res)=>{
			newState.nickname = res.user.nickname;
			newState.selectedColor = res.user.color;
			let gallery = new Gallery(res.gallery);
			newState.gallery = gallery;
			this._setBrowserUrl(gallery.galleryName);

			newState.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery.galleryId]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery.galleryId])
			};

			this.setState(newState);
		
			this._setUpTracker();
			Streamy.on('insert-shape',(data)=>{
				if (data.__from !== this._sessionId()){
					this._handleNewShape(data.shape,data.iBoard,false);
				}
			});

			Streamy.on('remove-shapes',(data)=>{
				if (data.__from !== this._sessionId()){

					let gallery = this.state.gallery.clone();
					let boards = gallery.boards;

					data.items.forEach((itemToRemove)=>{
						if (!boards[itemToRemove.iBoard]){return;}
						boards[itemToRemove.iBoard].removeShape(itemToRemove.shapeId);
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

		});
	}

	componentWillUnmount() {
		if (this.state.subscription){
			this.state.subscription.gallery.stop();
			this.state.subscription.activeUsers.stop();
		}
		document.body.removeEventListener('touchmove', this._preventDefault);
	}

	_handleNicknameChange(newName){
		return new Promise((resolve,reject)=>{
			Meteor.call('updateNickname',newName, (err,result)=>{
				if (err){
					reject(err.reason);
				}else{
					this.setState({
						nickname : newName
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
				this._setBrowserUrl(this.state.gallery.galleryName);
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
			this.setState({
				selectedColor : newCol
			});
			Meteor.call('updateColor',newCol, (err,result)=>{
				if (err){
					reject(err.reason);
				}else{
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
			let nickname = this.state.activeUsers.find((user)=>{return user.sessionId === changedBy}).nickname;
			newState.alert = {
				visible : true,
				text : 'Changed to board '+ (iBoard + 1) + ' by '+ nickname
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

	_handleBoardAdd(){
		this._handleBoardChange(this.state.gallery.boards.length);
	}

	_handleClearAll(send = true){		
		let gallery = this.state.gallery.clone();

		if (send){
			Meteor.call('clearAll',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds()
			});
		}

		gallery.boards.forEach(board=>{
			board.clear();
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
			gallery = this.state.gallery.clone(),
			boards = gallery.boards;

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
		if (this.state.alert.visible){
			this.setState({
				alert : {
					visible : false,
					text : ''
				}
			});
		}
	}

	_handleNewShape(shapeModel, iBoard = this.state.gallery.iSelectedBoard, sessionId = this._sessionId()){
		let newState = {},
			gallery = this.state.gallery.clone();
		
		if (sessionId === this._sessionId()){
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
		gallery.boards[iBoard].addShape(shapeModel);
		newState.gallery = gallery;
		this.setState(newState);
	}

	render(){
		let sessionId = this._sessionId();
		if (!this.state.gallery){
			return (<div className="spinner"></div>);
		}
		return (
			<div id="container">
				<Toolbar
					shapes= {ShapeMap}
					colors = {Colors}
					name = {this.state.nickname}
					galleryName = {this.state.gallery.galleryName}
					selectedShape = {this.state.selectedShape}
					selectedColor = {this.state.selectedColor}
					handleColorClick = {this._handleColorChange}
					handleToolChange = {this._handleToolChange}
					handleUndoClick = {()=>{this._handleUndo(1)}}
					handleClearMyClick = {this._handleClearMy}
					handleClearAllClick = {this._handleClearAll}
					handleNicknameChange = {this._handleNicknameChange}
					handleUrlChange = {this._handleUrlChange}
				/>
				<main className="main">
					<BoardsWrapper
						boards={this.state.gallery.boards}
						iSelectedBoard = {this.state.gallery.iSelectedBoard}
						sessionId = { this._sessionId() }
						activeUsers = {this.state.activeUsers}
						selectedShape = {this.state.selectedShape}
						selectedColor = {this.state.selectedColor}
						handleDrawStart = {this._handleAlertFinish }
						handleDrawFinish = {this._handleNewShape }
						handleBoardChange = {this._handleBoardChange}
						handleBoardAdd = {this._handleBoardAdd}
					/>
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