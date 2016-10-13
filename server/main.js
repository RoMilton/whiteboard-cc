import { Meteor } from 'meteor/meteor';

Galleries = new Mongo.Collection("galleries");
ActiveUsers = new Mongo.Collection("activeUsers");

let RESERVED=[
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
	//console.log('new gallery name',galleryName);
	return new Promise((resolve,reject)=>{
		let newSession = {
			galleryName : galleryName,
			//boards : [[null]], // 1 empty board
			iSelectedBoard : 0 // first board selected by default
		};
		Galleries.insert(newSession,(err,id)=>{
			if (err){
				reject(err)
			}else{
				resolve(id);
			}
		});
	});
};

// Router.route('/create-gallery/', function () {
// 	let req = this.request;
// 	let res = this.response;
// 	res.setHeader('Content-Type', 'application/json');
	
// 	createGallery().then((galleryName)=>{
// 		res.end(JSON.stringify({galleryName:galleryName}));
// 	});

// }, {where: 'server'});


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

let getGalleryByName = (galleryName)=>{
	//console.log('getGalleryByName',galleryName);
	let galleries = Galleries.find({galleryName: galleryName});
	let records = galleries.fetch();
	//console.log('results length',records.length);
	if (records.length){
		return records[0];
	}else{
		return null;
	}
}

let getGalleryById = (galleryId)=>{
	let galleries = Galleries.find({_id: galleryId});
	let records = galleries.fetch();
	//console.log('results length',records.length);
	if (records.length){
		return records[0];
	}else{
		return null;
	}
};

Meteor.publish('galleries',function([galleryId]){
	let galleries = Galleries.find(
		{_id: galleryId},
		{fields: { 'iSelectedBoard' : 1, 'galleryName' : 1 }}
	);
	//console.log('galleries',galleries.fetch()[0]);
	return galleries;
});


Meteor.publish('activeUsers',function([galleryId]){
	let records = Galleries.find({_id: galleryId}).fetch();
	if (records.length){
		let sessionId = this.connection.id;
		addActiveUser(records[0]._id,sessionId);
		let galleryId = records[0]._id;
		let activeUsers = ActiveUsers.find({galleryId: galleryId});
		return activeUsers;
	}
});

Meteor.methods({
	getGalleryId(galleryName){
		//console.log('getGalleryId()',galleryName);
		if (galleryName){
			let record = getGalleryByName(galleryName)
			if (record){
				return record;
			}
		}
		return createGallery(galleryName).then((galleryId)=>{
			let record = getGalleryById(galleryId);
			return record;
			//return galleryId;
		});
	},
	changeBoard(args){
		let sessionId = this.connection.id
		let { galleryId, iBoard } = args;

		Galleries.update(
			{ _id : galleryId },
			{ 
				$set: {
						iSelectedBoard: iBoard,
						lastUpdatedBy: sessionId
					}
				//$push: { boards: { $each: newBoards } },
			}
		);
	},
	// updateBoard(args){
	// 	let sessionId = this.connection.id
	// 	let {galleryId, iBoard,shape} = args;
	// 	Galleries.update(
	// 		{ _id : galleryId },
	// 		{ 
	// 			$set: {
	// 					//[`boards.${iBoard}.${userIndex}`] : newData,
	// 					lastUpdatedBy : sessionId
	// 				}
	// 		}
	// 	);
	// },
	updateGalleryName(names){
		let sessionId = this.connection.id
		let record = getGalleryByName(names.newName);
		if (record){
			throw new Meteor.Error(500, 'Name is already in use', '');	
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
	updateUser(name, color){
		let sessionId = this.connection.id;
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
	// addBoard(galleryId,noOfBoardsToAdd){
	// 	let sessionId = this.connection.id;
	// 	let newBoards = [];
	// 	for (var i = 0; i<noOfBoardsToAdd; i++){
	// 		newBoards.push([null]);
	// 	}
	// 	Galleries.update(
	// 		{ _id: galleryId },
 //   			{
 //   				$push: { boards: { $each: newBoards } },
 //   				$set:  {lastUpdatedBy : sessionId}
 //   			}
	// 	);
	// }
});

Meteor.startup(() => {
  // code to run on server at startup

  Streamy.onDisconnect((session)=>{
  	removeActiveUser(session.__sid);
  });

});

