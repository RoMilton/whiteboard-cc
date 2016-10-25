import Gallery from '../../universal/Gallery.js';

let Galleries = new Mongo.Collection("galleries");

const RESERVED_NAMES = [
	'IMAGES'
];

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

Galleries.createGallery = (galleryName)=>{
	let gallery = new Gallery();
	gallery.setGalleryName(galleryName || Galleries.makeGalleryName());
	let galleryModel = gallery.serialize();
	Galleries.insert(galleryModel);
	return galleryModel;
};

Galleries.getGalleryByName=(galleryName)=>{
	//console.log('getGalleryByName',galleryName);
	let galleries = Galleries.find({galleryName: galleryName});
	let records = galleries.fetch();
	if (records.length){
		return records[0];
	}else{
		return null;
	}
};

Galleries.isNameInUse = (galleryName)=>{
	let record = Galleries.getGalleryByName(galleryName);
	return (record || RESERVED_NAMES.indexOf(galleryName.toUpperCase()) > -1);
};

Galleries.updateGalleryRec = (galleryId, set)=>{
	Galleries.update(
		{ galleryId : galleryId },
		{ 
			$set: set
		},(err,result)=>{
			//console.log('err',err);
		}
	);
}

export default Galleries;