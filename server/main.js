import { Meteor } from 'meteor/meteor';

Sessions = new Mongo.Collection("sessions");

let RESERVED=[
	'board-session',
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
	console.log('createSession()');
	sessionLink = sessionLink || makeSessionName();
	let newSession = {
		link : sessionLink,
		boards : [null], //empty board
	};
	let result = Sessions.insert(newSession);
};


loadSession = (sessionLink)=>{
	// try loading
	return new Promise((resolve, reject) =>{
		sessions.findOne({link:sessionLink}, function(err, item) {

			if (item) {
				resolve(item);
			}
			else{
				reject('item not found');
			}
		});
	});
}

Router.route('/board-session/:sessionLink?', function () {
	var req = this.request;
	var res = this.response;
	res.setHeader('Content-Type', 'application/json');

	//let respond = (sessionData)=>{
	res.end(JSON.stringify({link:'test'}));
	//}
	//respond(sessionData);

}, {where: 'server'});


Meteor.startup(() => {
  // code to run on server at startup
});
