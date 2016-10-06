import { Meteor } from 'meteor/meteor';

Sessions = new Mongo.Collection("sessions");

let RESERVED=[
	'create-session',
	'images'
];

let makeSessionName=(alphabeticLength = 5, numSuffixLength = 2)=>{
    var text = "";
    var possibleV = "aeiou";
    var possibleC = "bcdfghkmnpqrsty";
    var possibleN = "0123456789";

    for( var i=0; i < alphabeticLength; i++ ){
    	let poss = (i % 2) == 1 ? possibleV : possibleC;
        text += poss.charAt(Math.floor(Math.random() * poss.length));
    }

    for( var i=0; i < numSuffixLength; i++ ){
    	text += possibleN.charAt(Math.floor(Math.random() * possibleN.length));
    }

    return text;
}

let createSession = (sessionLink) => {
	sessionLink = sessionLink || makeSessionName();
	return new Promise((resolve,reject)=>{
		let newSession = {
			link : sessionLink,
			boards : [null], //empty board
		};
		Sessions.insert(newSession,(err,result)=>{
			if (err){
				reject(err)
			}else{
				resolve(sessionLink);
			}
		});
	});
};

Router.route('/create-session/', function () {
	var req = this.request;
	var res = this.response;
	res.setHeader('Content-Type', 'application/json');
	
	createSession().then((linkName)=>{
		res.end(JSON.stringify({link:linkName}));
	});

}, {where: 'server'});

Meteor.publish("session",function(sessionLink){
	let list = Sessions.find({link: sessionLink[0]});
	return list;
});

Meteor.methods({
	updateBoards(session){
		let test = Sessions.update(
			{ _id : session._id },
			{$set: {boards: session.boards}}
		);
	}
});

Meteor.startup(() => {
  // code to run on server at startup
});
