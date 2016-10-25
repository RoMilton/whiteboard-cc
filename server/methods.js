import Gallery from '../universal/Gallery.js';
import Galleries from './collections/Galleries.js';
import ActiveUsers from './collections/ActiveUsers.js';

Meteor.methods({
	initialiseSession(galleryName){
		let sessionId = this.connection.id,
			galleryModel;

		if (galleryName){
			galleryModel = Galleries.findOne({galleryName: galleryName});
		}
		if (!galleryModel){
			galleryModel = Galleries.createGallery(galleryName);
		} 

		let user = ActiveUsers.addUser(galleryModel.galleryId,sessionId);

		return {
			user : user,
			gallery : galleryModel
		};
	},
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
	updateNickname(nickname){
		let sessionId = this.connection.id;

		nickname = nickname.trim(); 
		//console.log('nickname',nickname);
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
	insertShape(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId, iBoard, shape } = args;

		activeUsers.forEach((sid)=>{
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
			
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}

	},
	removeShapes(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId, items } = args;
		activeUsers.forEach((sid)=>{
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
			
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}

	},
	clearAll(args){
		let sessionId = this.connection.id,
			{activeUsers, galleryId} = args;

		activeUsers.forEach((sid)=>{
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
			Galleries.updateBoards(
				galleryId,
				gallery.serialize().boards,
				sessionId
			);
		}
	},
	updateColor(color){
		let sessionId = this.connection.id;

		color = color.trim();
		if (!color){
			throw new Meteor.Error(500, "You must provide a color", '');	
		}
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
