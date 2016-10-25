import { Meteor } from 'meteor/meteor';
import ActiveUsers from './collections/ActiveUsers.js';

Meteor.startup(() => {
	// code to run on server at startup
	console.log('Server starting');

	//Clear Active Users
	ActiveUsers.remove({});

	//When active user disconnects
	Streamy.onDisconnect((session)=>{
		ActiveUsers.removeUser(session.__sid);
	});

});

