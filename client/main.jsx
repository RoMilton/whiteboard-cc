import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

Meteor.startup(function(){

	Router.route('/:source?', function(){
		let source = this.params.source;
		ReactDOM.render(<App source = {source} />, document.getElementById('whiteboard-app'));
	});
	

	Streamy.on('hello-room1', function(d, s) {
	  console.log(d.data); // Will print 'world!'
	  // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
	});

});