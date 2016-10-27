import Gallery from '../../universal/Gallery.js';

let Galleries = new Mongo.Collection("galleries");

// reserved names, gallery name cannot be any of these
const RESERVED_NAMES = [
	'IMAGES'
];


/**
* Returns a random name suitable for a gallery. This is by default 5 alphabetic characters
* followed by 2 numeric characters. 
*
* The alphabetic characters will always alternate between consonant and vowel
* readability.
*
* @param {Number} alphabeticLength - length of alphabetic characters
* @param {Number} numSuffixLength - length of numeric charaters
* @return {String} new name
*/
Galleries.makeGalleryName = (alphabeticLength = 5, numSuffixLength = 2)=>{
	let text = "";
	let possibleV = "aeiou";
	let possibleC = "bcdfghkmnpqrsty";
	let possibleN = "0123456789";

	for( let i=0; i < alphabeticLength; i++ ){
		let poss = (i % 2) == 1 ? possibleV : possibleC;
			text += poss.charAt(Math.floor(Math.random() * poss.length));
	}

	for( let i=0; i < numSuffixLength; i++ ){
		text += possibleN.charAt(Math.floor(Math.random() * possibleN.length));
	}

	return text;
};


/**
* Creates a new gallery in mongo collection Galleries.
*
* If no gallery name is provided, a random one will be created using the makeGalleryName function.
*
* @param {String} galleryName - optional gallery name. If not provided, a random one will be created
* @return {String} new name
* @return {Object} new gallery record
*/
Galleries.createGallery = (galleryName)=>{
	let gallery = new Gallery();
	gallery.setGalleryName(galleryName || Galleries.makeGalleryName());
	let galleryModel = gallery.serialize();
	Galleries.insert(galleryModel);
	return galleryModel;
};


/**
* Returns whether a gallery exists with the given name
*
* @param {String} galleryName - name of gallery to look up
* @return {Boolean} true if gallery exists, false if not
*/
Galleries.isNameInUse = (galleryName)=>{
	let record = Galleries.findOne({galleryName: galleryName});
	return (record || RESERVED_NAMES.indexOf(galleryName.toUpperCase()) > -1);
};


/**
* Updates the boards of a gallery with a given galleryId
*
* @param {String} galleryId - galleryId of gallery
* @param {Array[Object]} boards - array of whiteboards
* @param {lastUpdatedBy} lastUpdatedBy - sessionID of user performing update
*/
Galleries.updateBoards = (galleryId, boards, lastUpdatedBy)=>{
	Galleries.update({ galleryId : galleryId },{ 
		$set: {
			boards : boards,
			lastUpdatedBy : lastUpdatedBy
		}
	});
};

export default Galleries;