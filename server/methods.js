import Gallery from '../universal/Gallery.js';
import Galleries from './collections/Galleries.js';
import ActiveUsers from './collections/ActiveUsers.js';

// methods that can be called from client.
Meteor.methods({
	/**
	* Initialises a new user by adding them to a gallery
	*
	* Checks to see if a gallery with given gallery name exists. If so it will be 
	* retrieved. If doesn't exist, a new gallery will be created with given name.
	*
	* @method insertShape
	* @param {Object} args - object with two properties
	* 				galleryId {String} - unique galleryId
	* 				iBoard {Number} - index of board to select
	*/
	initialiseSession(galleryName){
		let sessionId = this.connection.id,
			galleryModel;

		if (galleryName){
			galleryModel = Galleries.findOne({galleryName: galleryName});
		}
		if (!galleryModel){
			galleryModel = Galleries.createGallery(galleryName);
		} 

		// add an active user
		let user = ActiveUsers.addUser(galleryModel.galleryId,sessionId);

		// return user and gallery details
		return {
			user : user,
			gallery : galleryModel
		};
	},
	/**
	* Sets the selected board of a gallery
	*
	* @method insertShape
	* @param {Object} args - object with two properties
	* 				galleryId {String} - unique galleryId
	* 				iBoard {Number} - index of board to select
	*/
	changeBoard(args){
		let sessionId = this.connection.id,
			{ galleryId, iBoard } = args;

		Galleries.update(
			{ galleryId : galleryId },
			{ 
				$set: {
						iSelectedBoard: iBoard,
						lastUpdatedBy: sessionId
					}
			}
		);
	},
	/**
	* Updates the a gallery's name
	*
	* @method insertShape
	* @param {Object} names - object with two properties
	* 				currentName {String} - current name of gallery 
	* 				newName {String} - name to set gallery to
	*/
	updateGalleryName(names){
		let sessionId = this.connection.id

		names.newName = names.newName.toLowerCase().trim();

		if (!names.newName){
			throw new Meteor.Error(500, 'You must provide a URL', '');	
		}
		if (Galleries.isNameInUse(names.newName)){
			throw new Meteor.Error(500, "'" +names.newName +"' is already in use", '');	
		}else{
			Galleries.update(
				{ galleryName : names.currentName },
				{
					$set: {
						galleryName: names.newName,
						lastUpdatedBy: sessionId
					}
				}
			);
		}
	},
	/**
	* Updates the nickname of the user
	*
	* @method insertShape
	* @param {String} nickname - new nickname of user
	*/
	updateNickname(nickname){
		let sessionId = this.connection.id;

		nickname = nickname.trim(); 
		if (!nickname){
			throw new Meteor.Error(500, "You must provide a name", '');	
		}
		ActiveUsers.update(
			{ sessionId : sessionId},
			{
				$set: {
					nickname : nickname
				}
			}
		);
	},
	/**
	* Inserts a new shape into a gallery
	*
	* @method insertShape
	* @param {Object} args - object with following properties:
	*			activeUsers {Array[Object]} - array of all active users in session to stream to
	*			galleryId {String} - unique galleryId of current gallery,
	*			iBoard {Number} - index of whiteboard to insert into
	*			shape {Object} - serialized shape to insert
	*/
	insertShape(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId, iBoard, shape } = args;

		// for each active user
		activeUsers.forEach((sid)=>{
			// stream
			Streamy.sessions(sid).emit(
				'insert-shape',
				{
					iBoard : iBoard,
					shape : shape,
					__from : sessionId
				}
			);
		});

		let galleryModel = Galleries.findOne({galleryId:galleryId});
		if (galleryModel){
			let gallery = new Gallery(galleryModel);
			// create board if doesn't exist
			if (!gallery.boards[iBoard]){ gallery.addBoardAtIndex(iBoard); }
			// insert shape
			gallery.boards[iBoard].addShape(shape);
			
			// update DB
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}

	},
	/**
	* Removes shapes from a whiteboard. For performance reasons, all users are informed
	* via a stream, which is faster than relying only on MongoDB transactions.
	*
	* @method removeShapes
	* @param {Object} args - object with following properties:
	*			activeUsers {Array[Object]} - array of all active users in session to stream to
	*			galleryId {String} - unique galleryId of current gallery,
	*			items {Array[Object]} - array of objects to remove. Each object must have a shapeId and iBoard proeprty
	*/
	removeShapes(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId, items } = args;

		// for each active user
		activeUsers.forEach((sid)=>{
			// stream
			Streamy.sessions(sid).emit(
				'remove-shapes',
				{
					items : items,
					__from: sessionId
				}
			);
		});
		let galleryModel = Galleries.findOne({galleryId:galleryId});
		if (galleryModel){
			let gallery = new Gallery(galleryModel);
			// insert shape
			items.forEach((item)=>{
				gallery.boards[item.iBoard].removeShape(item.shapeId);
			});
			// update DB
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}

	},
	/**
	* Clears all whiteboards. For performance reasons, all users are informed
	* via a stream, which is faster than relying only on MongoDB transactions.
	*
	* @method clearAll
	* @param {Object} args - object with following properties:
	*			activeUsers {Array[Object]} - array of all active users in session to stream to
	*			galleryId {String} - unique galleryId of current gallery,
	*/
	clearAll(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId} = args;

		// for each active user
		activeUsers.forEach((sid)=>{
			// stream to other users
			Streamy.sessions(sid).emit('clear-all',{
				__from: sessionId
			});
		});
		let galleryModel = Galleries.findOne({galleryId:galleryId});
		if (galleryModel){
			let gallery = new Gallery(galleryModel);
			// insert shape
			gallery.boards.forEach(board=>{
				board.clear();
			});
			// update DB
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}
	},
	/**
	* Updates a user's color.
	*
	* @method updateColor
	* @param {String} color - new color in hex format
	*/
	updateColor(color){
		let sessionId = this.connection.id;

		color = color.trim();
		if (!color){
			throw new Meteor.Error(500, "You must provide a color", '');	
		}
		//update DB
		ActiveUsers.update(
			{ sessionId : sessionId},
			{
				$set: {
					color : color
				}
			}
		);
	}
});
