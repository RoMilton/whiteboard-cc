import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

Meteor._debug = (function (super_meteor_debug) {
	return function (error, info) {
	if (!(info && _.has(info, 'msg')))
		super_meteor_debug(error, info);
	}
})(Meteor._debug);

Meteor.startup(function(){

	Router.route('/:source?', function(){
		let source = this.params.source;
		ReactDOM.render(<App source = {source} />, document.getElementById('whiteboard-app'));
	});

});