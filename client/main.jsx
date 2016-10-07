import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

Meteor.startup(function(){

	Router.route('/:source?', function(){
		let source = this.params.source;
		ReactDOM.render(<App source = {source} />, document.getElementById('whiteboard-app'));
	});
	
});