import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

Meteor.startup(function(){

	let load = (sessionData)=>{
		ReactDOM.render(<App session = {sessionData} />, document.getElementById('whiteboard-app'));
	};

	let noData = ()=>{
		console.log('no data received');
	};

	Router.route('/:sessionName?', function(){
		let sessionLink = this.params.sessionName;
		if (sessionLink){
			load({link : sessionLink});
		}
		else{
			$.ajax({
				type: "GET",
				url: 'create-session/',
				contentType: "application/json",
				dataType: "json",
			}).done(load).fail(noData);
		}
	});
	
});