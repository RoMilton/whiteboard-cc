import { Meteor } from 'meteor/meteor';

Galleries = new Mongo.Collection("galleries");

let RESERVED=[
	'create-gallery',
	'images'
];

let makeGalleryName=(alphabeticLength = 5, numSuffixLength = 2)=>{
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
}

let createGallery = (galleryName) => {
	galleryName = galleryName || makeGalleryName();
	return new Promise((resolve,reject)=>{
		let newSession = {
			galleryName : galleryName,
			boards : [[null]], // 1 empty board
			iSelectedBoard : 0 // first board selected by default
		};
		Galleries.insert(newSession,(err,result)=>{
			if (err){
				reject(err)
			}else{
				resolve(galleryName);
			}
		});
	});
};

Router.route('/create-gallery/', function () {
	let req = this.request;
	let res = this.response;
	res.setHeader('Content-Type', 'application/json');
	
	createGallery().then((galleryName)=>{
		res.end(JSON.stringify({galleryName:galleryName}));
	});

}, {where: 'server'});

Meteor.publish('galleries',function([galleryName]){
	console.log('cient connected');
	return Galleries.find({galleryName: galleryName});
	this._session.socket.on("close", function() {
		console.log('client disconnected');
	});
});

Meteor.methods({
	updateGallery(gallery){
		Galleries.update(
			{ _id : gallery._id },
			{ $set:
				{
					boards: gallery.boards,
					iSelectedBoard: gallery.iSelectedBoard,
					lastUpdatedBy: gallery.lastUpdatedBy
				}
			}
		);
	}
});

Meteor.startup(() => {
  // code to run on server at startup
});

