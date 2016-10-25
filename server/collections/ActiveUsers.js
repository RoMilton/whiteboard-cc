import Utils from '../../universal/Utils.js';
import Colors from '../../universal/Colors.js';

let ActiveUsers = new Mongo.Collection("activeUsers");

const defaultNames = [
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

ActiveUsers.addUser = (galleryId,sessionId,defaultName)=>{
	//console.log('inserting active user',sessionId);
	let activeUsers = ActiveUsers.find({sessionId: sessionId});
	
	let galleryUsers = ActiveUsers.find(
		{ galleryId: galleryId},
		{ fields: {
			'name' : 1, 
			'color' : 1 
		}}
	).fetch();

	let currentNames = galleryUsers.map((rec)=>{ return rec.name;});
	let currentColors = galleryUsers.map((rec)=>{ return rec.color;	});

	let nickname = defaultName || Utils.validItemFromArrays(defaultNames, currentNames);
	let color = Utils.validItemFromArrays(Colors,currentColors,false);

	if (activeUsers.fetch().length){
		ActiveUsers.update(
			{ sessionId : sessionId },
			{
				$set: {
					galleryId : galleryId,
					nickname : nickname,
					color : color
				}
			}
		);
	}else{
		ActiveUsers.insert({
			sessionId : sessionId,
			galleryId : galleryId,
			nickname : nickname,
			color : color
		});
	}
	return {
		nickname : nickname,
		color: color,
		userCount : currentNames.length + 1
	}
};

ActiveUsers.removeUser = (sessionId)=>{
	ActiveUsers.remove({
		sessionId : sessionId
	});
};

export default ActiveUsers;