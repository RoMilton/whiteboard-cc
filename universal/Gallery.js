import Utils from './Utils.js';
import Whiteboard from './Whiteboard.js';

export default class Gallery{

	static get MAX_BOARDS(){
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
		this.setSelectedBoard(0);
	}

	setSelectedBoard(iSelectedBoard){
		if (!this.boards[iSelectedBoard]){
			this.addBoardAtIndex(iSelectedBoard);
		}
		this.iSelectedBoard = iSelectedBoard;
	}

	addBoardAtIndex(iBoard){
		if (this.boards[iBoard] || this.boards.length >= Gallery.MAX_BOARDS ) return;
		let noOfBoardsToAdd = iBoard + 1 - this.boards.length;
		for (var i = 0; i<noOfBoardsToAdd; i++){
			this.boards.push(new Whiteboard());
		}
	}

	setGalleryName(galleryName){
		this.galleryName = galleryName;
	}

	serialize(){
		return {
			galleryId : this.galleryId,
			boards : this.boards.map((board)=>{ return board.shapes; }),
			iSelectedBoard : this.iSelectedBoard,
			galleryName : this.galleryName
		};
	}

	clone(){
		return new Gallery(this.serialize());
	}

}