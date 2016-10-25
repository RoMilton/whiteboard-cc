import React, {PropTypes} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Tracker } from 'meteor/tracker';
import ReactTooltip from 'react-tooltip';
import Toolbar from './toolbar/Toolbar.jsx';
import BoardsWrapper from './board/BoardsWrapper.jsx';
import Alert from './alert/Alert.jsx';
import ShapeMap from '../shapes/ShapeMap.js';
import Colors from '../../universal/Colors.js';
import Gallery from '../../universal/Gallery.js';

// Mongo collections
Galleries = new Mongo.Collection("galleries");
ActiveUsers = new Mongo.Collection("activeUsers");

/**
 * Whiteboard App
 *
 * App that displays a gallery of whiteboards on which local and remote users can draw
 * on in real time.
 *
 * Up to 6 boards can be added per gallery. When one user switches to a new board,
 * remote users will switch to the new board as well.
 *
 * If a default URL link is not provided as @prop defGalleryName, a suitable defalt link will
 * be retrieved from the server.
 *
 * @class App
 * @extends React.Component
 */
export default class App extends TrackerReact(React.Component) {

	// constructor
	constructor(props){
		super(props);

		// default state
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

		this.defGalleryName = props.defGalleryName;

		// binding methods here instead of render() speeds up re-renders
		this._handleColorChange = this._handleColorChange.bind(this)
		this._handleShapeChange = this._handleShapeChange.bind(this);
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


	// after component mounts
	componentDidMount(){

		// prevents 'swipe to refresh' when swipe down on mobile browsers
		document.body.addEventListener('touchmove', this._preventDefault);

		let newState = {};
		
		// retrieve gallery and user data for this session, providing the default defGalleryName
		Meteor.call('initialiseSession',this.defGalleryName,(err,res)=>{
			if (err){ return; }
			newState.nickname = res.user.nickname;
			newState.selectedColor = res.user.color;

			// create new gallery using model
			let gallery = new Gallery(res.gallery);
			newState.gallery = gallery;

			// set browser url to gallery name
			this._setBrowserUrl(gallery.galleryName);

			// subscribe to Meteor server publications to be informed of DB updates
			newState.subscription = {
				gallery : Meteor.subscribe('galleries',[gallery.galleryId]),
				activeUsers : Meteor.subscribe('activeUsers',[gallery.galleryId])
			};
			this._setUpTracker();
			this.setState(newState);
		
			// when remote user inserts shape
			Streamy.on('insert-shape',(data)=>{
				if (data.__from !== this._sessionId()){
					this._handleNewShape(data.shape,data.iBoard,data.__from);
				}
			});

			// when remote user removes specific shapes
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

			// when remote user clears all whiteboards
			Streamy.on('clear-all',(data)=>{
				if (data.__from !== this._sessionId()){
					this._handleClearAll(false);
				}
			});

		});
	}


	// before component unmounts
	componentWillUnmount() {
		// clean up subscriptions and listeners
		if (this.state.subscription){
			this.state.subscription.gallery.stop();
			this.state.subscription.activeUsers.stop();
		}
		document.body.removeEventListener('touchmove', this._preventDefault);
	}


	/**
	* Manipulates the browser URL so it will contain a given string after the domain.
	*
	* For example, calling this method passing 'abc' will result in browser changing
	* address to http://domain.com/abc
	*
	* @memberof App
	* @method _setBrowserUrl
	* @param {string} galleryName 
	*/
	_setBrowserUrl(galleryName){
		if (galleryName) { history.pushState(null, null,galleryName); }
	}


	/**
	* Returns the unique sessionId for the user.
	* 
	* @memberof App
	* @method _sessionId
	*/
	_sessionId(){
		// even though it's called _lastSessionId, this is Meteor's standard place for current session id.
		return Meteor.default_connection._lastSessionId;
	}


	/**
	* Sets up the Meteor Trackers. These correspond with the 'Publish' functions on
	* the server. It will be run every time a relevant mongodb collection is updated.
	* 
	* @memberof App
	* @method _setUpTracker
	*/
	_setUpTracker(){
		// When Galleries collection is updated
		Tracker.autorun(()=> {
			let newGallery = Galleries.find().fetch()[0];
			if (!newGallery || !this.state.gallery) { return; } // nothing to retrieve or update
			if (newGallery.lastUpdatedBy === this._sessionId()){ return } // self-updated
			
			//if selected board has changed
			if (newGallery.iSelectedBoard !== this.state.gallery.iSelectedBoard){
				this._handleBoardChange(newGallery.iSelectedBoard,newGallery.lastUpdatedBy);
			}

			//if gallery board has changed
			if (newGallery.galleryName !== this.state.gallery.galleryName){
				this._handleUrlChange(newGallery.galleryName,newGallery.lastUpdatedBy);
			}
		});

		// When Active Users collection is updated
		Tracker.autorun(()=> {
			let activeUsers = ActiveUsers.find().fetch();
			let newState = {}
			newState.activeUsers = activeUsers;
			this.setState(newState);
		});
	}


	/**
	* Simple method to prevent default action of a given event. This is in its own 
	* function so any event listeners that perform this can be cleanly removed later on.
	* 
	* @memberof App
	* @method _preventDefault
	* @param {Event} Browser event
	*/
	_preventDefault(event){
		event.preventDefault();
	}


	/**
	* Changes users's own nickname. 
	* 
	* Calls a server to perform the change and returns the result.
	* 
	* @memberof App
	* @method _handleNicknameChange
	* @param {String} newName - new Nickname to change to
	* @return {Promise} - Promise that resolves when nickname has changed, 
	*					passing new name as argument
	*/
	_handleNicknameChange(newName){
		return new Promise((resolve,reject)=>{
			Meteor.call('updateNickname',newName, (err,result)=>{
				if (err){
					// change was unsuccessful
					reject(err.reason);
				}else{
					// change was succesful so change state
					this.setState({
						nickname : newName
					});
					resolve(newName)
				}
			});
		});
	}


	/**
	* Changes user's own nickname by calling the server and returning the result.
	* 
	* @memberof App
	* @method _handleNicknameChange
	* @param {String} newName - new Nickname to change to
	* @return {Promise} - Promise that resolves when nickname has changed, 
	*					passing new name as argument
	*/
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
	 * @memberof App
	 * @method getDefaultTool
	 */
	_getDefaultTool(){
		//for each tool
		for (let key in ShapeMap){
			if (ShapeMap[key].isDefault) {return key;}
		}
	}


	/**
	 * Changes the user's selected Shape (such as Pen, Line, Rectangle);
	 *
	 * @method _handleShapeChange
	 * @param {String} toolName - String representing new shape. Must be property in ShapeMap.
	 */
	_handleShapeChange(toolName){
		this.setState({
			selectedShape : toolName
		});
	}


	/**
	 * Changes the user's selected color and notifies the server.
	 *
	 * @method _handleColorChange
	 * @param {String} toolName - Hex string representing color.
	 * @return {Promise} promise that resolves if change is succesful, 
	 */
	_handleColorChange(newCol){
		return new Promise((resolve,reject)=>{
			// do not need to wait for server response to update state
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


	/**
	 * Changes the selected board of the gallery. 
	 *
	 * @method _handleBoardChange
	 * @param {Number} iBoard - index of board
	 * @param {String} changedBy - sessionId of user responsible for change
	 * @return {Promise} promise that resolves if change is succesful
	 */
	_handleBoardChange(iBoard, changedBy = this._sessionId()){
		return new Promise((resolve,reject)=>{
			let newState = {};
			newState.gallery = this.state.gallery.clone();

			// set selected board
			newState.gallery.setSelectedBoard(iBoard);
			// get nickname of user responsible for name		
			let nickname = this.state.activeUsers.find((user)=>{return user.sessionId === changedBy}).nickname;
			// creat alert
			newState.alert = {
				visible : true,
				text : 'Changed to board '+ (iBoard + 1) + ' by '+ nickname
			};
			this.setState(newState);

			// if current user is responsible for this change
			if (changedBy === this._sessionId()){
				
				// notify server
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


	/**
	* Adds a new, blank whiteboard.
	* 
	* @memberof App
	* @method _handleBoardAdd
	*/
	_handleBoardAdd(){
		this._handleBoardChange(this.state.gallery.boards.length);
	}


	/**
	* Returns an array containing all active users' session IDs.
	* 
	* @memberof App
	* @method _allSessionIds
	* @param {Array[String]} Array of session IDs
	*/
	_allSessionIds(){
		return this.state.activeUsers.map((user)=>{
			return user.sessionId;
		});
	}

	/**
	* Undoes drawing of shapes performed by current user. 
	*
	* Can remove a given number of actions or all actions, depending on argument provided.
	* 
	* @memberof App
	* @method _handleUndo
	* @param {Number||String} numberToRemove - the count of actions to undo or 'all' to remove all.
	*/
	_handleUndo(numberToRemove = 1){
		let history = this.state.history.slice(),
			gallery = this.state.gallery.clone(),
			boards = gallery.boards;

		numberToRemove = numberToRemove === 'all' ? history.length : numberToRemove;
		
		// get shapes from history
		let itemsToRemove = history.slice(history.length - numberToRemove);

		if (itemsToRemove){
			// notify server
			Meteor.call('removeShapes',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds(),
				items : itemsToRemove
			});

			// for each shape
			itemsToRemove.forEach((historyItem)=>{			
				// remove shape from board
				boards[historyItem.iBoard].removeShape(historyItem.shapeId);
			});

			// remove item from history
			history = history.slice(0, history.length - itemsToRemove.length);

			this.setState({
				gallery : gallery,
				history : history
			});
		}
	}


	/**
	* Clears all shapes on every whiteboard drawn by current user
	* 
	* @memberof App
	* @method _handleClearAll
	*/
	_handleClearMy(){
		this._handleUndo('all');
	}


	/**
	* Clears all shapes on every whiteboard drawn by any user.
	*
	* This will return all whiteboards to a blank slate.
	* 
	* @memberof App
	* @method _handleClearAll
	* @param {Boolean} sendToServer - if true, the server's will be notified of change
	*/
	_handleClearAll(sendToServer = true){		
		let gallery = this.state.gallery.clone();

		if (sendToServer){
			// call meteor method
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


	/**
	* Hides main alert by setting the alert.visible state property to false.
	* 
	* @memberof App
	* @method _handleAlertFinish
	*/
	_handleAlertFinish(){
		// if alert is visible
		if (this.state.alert.visible){
			this.setState({
				alert : {
					visible : false,
					text : ''
				}
			});
		}
	}


	/**
	* Inserts a given shape into one of the whiteboards. The given shape must be in the form of 
	* serialized Shape object.
	*
	* If a board index is not provided, the currently selected whiteboard will be used.
	
	* 
	* @memberof App
	* @method _handleNewShape
	* @param {Object} shapeModel - A serialized Shape. See @class Shape.js
	* @param {Number} iBoard - index of the board to insert into
	* @param {String} createdBy - the sessionId of the person who created the shape
	*/
	_handleNewShape(shapeModel, iBoard = this.state.gallery.iSelectedBoard, createdBy = this._sessionId()){
		let newState = {},
			gallery = this.state.gallery.clone();
		
		// if the current user created the shape
		if (createdBy === this._sessionId()){
			let newItemObj = {
				iBoard : iBoard,
				shape : shapeModel
			}
			// send shape to server
			Meteor.call('insertShape',{
				galleryId : this.state.gallery.galleryId,
				activeUsers : this._allSessionIds(),
				iBoard : iBoard,
				shape : shapeModel
			});

			// add to history
			newState.history = this.state.history.slice();
			newState.history.push({
				iBoard : iBoard,
				shapeId : shapeModel.id
			});
		}

		// add shape to whiteboard
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
			<div id="container" className="container">
				<Toolbar
					shapes= {ShapeMap}
					colors = {Colors}
					nickname = {this.state.nickname}
					galleryName = {this.state.gallery.galleryName}
					selectedShape = {this.state.selectedShape}
					selectedColor = {this.state.selectedColor}
					handleColorClick = {this._handleColorChange}
					handleShapeChange = {this._handleShapeChange}
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

App.propTypes = {
	// Default gallery name. 
	// If provided and a gallery exists with that name, it will be retrieved. 
	// If provided and no gallery exists with that name, a new one will be created using at that name.
	// If not provided, a gallery will be created with a random name instead.
	defGalleryName : PropTypes.string 
}