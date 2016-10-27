import Utils from './Utils.js';
import Whiteboard from './Whiteboard.js';

/**
* A gallery is a stack of one or more whiteboards, as well as a gallery name
* and a selected board index. Only one board can be selected at a time.
*
* A gallery instance can be serialized to a JS object to send to other users or
* to store in a DB.
*
* @class Gallery
*/
export default class Gallery{


	/**
	* Maximum count of boards that can be exist in this gallery
	* 
	* @memberOf Gallery
	* @property maxBoards
	* @static
	*/
	static get maxBoards(){
		return 6;
	}
	
	constructor(galleryModel = {}){
		this.galleryId = galleryModel.galleryId || Utils.guid();
		this.boards = [];
		if (galleryModel.boards){
			galleryModel.boards.forEach((board)=>{
				if (board instanceof Whiteboard){
					this.boards.push(board);
				}else if (board instanceof Array) {
					this.boards.push(new Whiteboard(board));
				}
			});
		}
		this.galleryName = galleryModel.galleryName || '';
		this.setSelectedBoard(galleryModel.iSelectedBoard || 0);
	}


	/**
	* Sets the selected whiteboard index. If a whiteboard does not exist at this
	* index, then it will be added first.
	* 
	* @memberOf Gallery
	* @method setSelectedBoard
	* @param {Number} iBoard - index of selected whiteboard in array this.boards
	*/
	setSelectedBoard(iSelectedBoard){
		if (!this.boards[iSelectedBoard]){
			this.addBoardAtIndex(iSelectedBoard);
		}
		this.iSelectedBoard = iSelectedBoard;
	}


	/**
	* Adds new, blank whiteboards up to and including a given index. For example if this gallery
	* contains 2 boards and this method is called with an argument of 5, then another 
	* 4 will be added, because that's how many need to be added until a board exists with
	* an index of 5.
	* 
	* @memberOf Gallery
	* @method addBoardAtIndex
	* @param {Number} iBoard - index of selected whiteboard
	*/
	addBoardAtIndex(iBoard){
		if (this.boards[iBoard] || this.boards.length >= Gallery.maxBoards ) return;
		let noOfBoardsToAdd = iBoard + 1 - this.boards.length;
		for (var i = 0; i<noOfBoardsToAdd; i++){
			this.boards.push(new Whiteboard());
		}
	}


	/**
	* Sets the name of the gallery
	* 
	* @memberOf Gallery
	* @method setGalleryName
	* @param {String} galleryName - new gallery name
	*/
	setGalleryName(galleryName){
		this.galleryName = galleryName;
	}


	/**
	* Converts the current gallery instance to a raw JavaScript object. Each instance
	* property will be assigned to a property of the object.
	* 
	* @memberOf Gallery
	* @method serialize
	* @return {Object} serialized gallery
	*/
	serialize(){
		return {
			galleryId : this.galleryId,
			boards : this.boards.map((board)=>{ return board.shapes.slice(); }),
			iSelectedBoard : this.iSelectedBoard,
			galleryName : this.galleryName
		};
	}

	/**
	* Creates a new gallery instance which exactly the same properties as the current instance.
	* 
	* @memberOf Gallery
	* @method clone
	* @return {Gallery} instance of gallery
	*/
	clone(){
		return new Gallery(this.serialize());
	}

}