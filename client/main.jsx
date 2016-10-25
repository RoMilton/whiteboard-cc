import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

// remove Meteor debug messages
Meteor._debug = (function (super_meteor_debug) {
	return function (error, info) {
	if (!(info && _.has(info, 'msg')))
		super_meteor_debug(error, info);
	}
})(Meteor._debug);

// when Meteor starts
Meteor.startup(function(){

	// get galleryName from URL, if any
	Router.route('/:galleryName?', function(){
		let galleryName = this.params.galleryName;
		// render app into div
		ReactDOM.render(<App defGalleryName = {galleryName} />, document.getElementById('whiteboard-app'));
	});

});