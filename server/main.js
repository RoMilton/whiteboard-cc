import Colors from '../universal/Colors.js';
import Utils from '../universal/Utils.js';
import { Meteor } from 'meteor/meteor';

Galleries = new Mongo.Collection("galleries");
ActiveUsers = new Mongo.Collection("activeUsers");

let RESERVED_NAMES = [
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

let DEFAULT_NAMES =[
	"Friendly Fox",
	"Brilliant Beaver",
	"Observant Owl",
	"Gregarious Giraffe",
	"Wild Wolf",
	"Diligent Dog",
	"Terrific Tiger",
	"Silent Seal",
	"Wacky Whale",
	"Curious Cat",
	"Intelligent Iguana"
];

let addActiveUser = (galleryId,sessionId,defaultName)=>{
	//console.log('inserting active user',sessionId);
	let activeUsers = ActiveUsers.find({sessionId: sessionId});
	
	let galleryUsers = ActiveUsers.find(
		{galleryId: galleryId},
		{fields: {
			'name' : 1 , 
			'color' : 1 
		}}
	).fetch();
	let currentNames = galleryUsers.map((rec)=>{ return rec.name;});
	let currentColors = galleryUsers.map((rec)=>{ return rec.color;	});

	//let nickname = defaultName || getNickname(currentNames);
	let nickname = defaultName || Utils.validItemFromArrays(DEFAULT_NAMES, currentNames);
	let color = Utils.validItemFromArrays(Colors,currentColors,false);

	if (activeUsers.fetch().length){
		
		ActiveUsers.update(
			{ sessionId : sessionId },
			{
				$set: {
					galleryId : galleryId,
					name : nickname,
					color : color
				}
			}
		);

	}else{
		ActiveUsers.insert({
			sessionId : sessionId,
			galleryId : galleryId,
			name : nickname,
			color : color
		});
	}

	return {
		nickname : nickname,
		color: color,
		userCount : currentNames.length + 1
	}
};

let removeActiveUser = (sessionId)=>{
	// console.log('removing active user',sessionId);
	ActiveUsers.remove({
		sessionId : sessionId
	});
};

let getGalleryByName = (galleryName)=>{
	//console.log('getGalleryByName',galleryName);
	let galleries = Galleries.find({galleryName: galleryName});
	let records = galleries.fetch();
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
		{fields: { 'iSelectedBoard' : 1, 'galleryName' : 1, 'lastUpdatedBy' : 1 }}
	);
	//console.log('galleries',galleries.fetch()[0]);
	return galleries;
});


Meteor.publish('activeUsers',function([galleryId]){
	let records = Galleries.find({_id: galleryId}).fetch();
	if (records.length){
		let galleryId = records[0]._id;
		let activeUsers = ActiveUsers.find({galleryId: galleryId});
		return activeUsers;
	}
});

Meteor.methods({
	getGalleryId(galleryName){
		let sessionId = this.connection.id;
		//console.log('getGalleryId()',galleryName);
		if (galleryName){
			let record = getGalleryByName(galleryName)
			if (record){
				let user = addActiveUser(record._id,sessionId);
				return {
					user : user,
					gallery : record
				};
			}
		}
		return createGallery(galleryName).then((galleryId)=>{
			let record = getGalleryById(galleryId);
			let user = addActiveUser(record._id,sessionId);
			return {
				user : user,
				gallery : record
			};
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
			}
		);
	},
	updateGalleryName(names){
		let sessionId = this.connection.id
		names.name = names.newName.trim();
		if (!names.newName){
			throw new Meteor.Error(500, 'You must provide a URL', '');	
		}
		let record = getGalleryByName(names.newName);
		if (record){
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
					name : nickname
				}
			}
		);
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

Meteor.startup(() => {
	// code to run on server at startup

	//Clear Active Users
	ActiveUsers.remove({});

	Streamy.onDisconnect((session)=>{
		removeActiveUser(session.__sid);
	});

});

