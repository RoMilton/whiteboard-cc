import { Meteor } from 'meteor/meteor';

Galleries = new Mongo.Collection("galleries");
ActiveUsers = new Mongo.Collection("activeUsers");

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


let addActiveUser = (galleryId,sessionId)=>{
	console.log('inserting active user',sessionId);
	let activeUsers = ActiveUsers.find({sessionId: sessionId});

	if (activeUsers.fetch().length){

		ActiveUsers.update(
			{ sessionId : sessionId },
			{
				$set: {
					galleryId : galleryId
				}
			}
		);

	}else{

		ActiveUsers.insert({
			sessionId : sessionId,
			galleryId : galleryId
		});

	}
};

let removeActiveUser = (sessionId)=>{
	console.log('removing active user',sessionId);
	ActiveUsers.remove({
		sessionId : sessionId
	});
};

Meteor.publish('galleries',function([galleryName]){
	let galleries = Galleries.find({galleryName: galleryName});
	let records = galleries.fetch();
	if (records.length){
		let sessionId = this.connection.id;
		addActiveUser(galleries.fetch()[0]._id,sessionId);
	}

	return galleries;
});


Meteor.publish('activeUsers',function([galleryName]){
	let galleries = Galleries.find({galleryName: galleryName}).fetch();
	if (galleries.length){
		let galleryId = galleries[0]._id;
		//console.log('subscribing to gallery',galleryId);
		let activeUsers = ActiveUsers.find({galleryId: galleryId});
		return activeUsers;
	}
});

Meteor.methods({
	updateGallery(gallery){
		let sessionId = this.connection.id
		Galleries.update(
			{ _id : gallery._id },
			{ 
				$set: {
						boards: gallery.boards,
						iSelectedBoard: gallery.iSelectedBoard,
						lastUpdatedBy: sessionId
					}
			}
		);
	},
	updateUser(name, color){
		console.log('name',name);
		console.log('color',color);
		let sessionId = this.connection.id;
		console.log('sessionId',sessionId);
		ActiveUsers.update(
			{ sessionId : sessionId},
			{
				$set: {
					name : name,
					color : color
				}
			}
		);
	}
});

Meteor.startup(() => {
  // code to run on server at startup

  Streamy.onDisconnect((session)=>{
  	removeActiveUser(session.__sid);
  });

});

