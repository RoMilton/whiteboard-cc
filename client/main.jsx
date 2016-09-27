import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

Meteor.startup(function(){
	ReactDOM.render(<App />, document.getElementById('whiteboard-app'));
});