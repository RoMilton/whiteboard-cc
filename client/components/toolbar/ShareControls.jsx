import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';
import TextControl from './TextControl.jsx';
import eventService from '../../eventService.js';


/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class ShareControls extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			urlSuccessMsg : null,
			urlErrorMsg : null,
			nameSuccessMsg : null,
			nameErrorMsg : null
		}
		this._handleUrlChange = this._handleUrlChange.bind(this);
		this._handleNameChange = this._handleNameChange.bind(this);
	}

	_startTimer(){
		if (this.timer){clearTimeout(this.timer);}
		this.timer = setTimeout(()=>{
			this.setState({
				urlSuccessMsg : null,
				nameSuccessMsg : null
			});
		},4000);
	};


	_handleUrlChange(galleryName){
		this.props.handleUrlChange(galleryName).then((newGalleryName)=>{
			this.setState({
				nameSuccessMsg : null,
				urlSuccessMsg : 'URL changed to '+window.location.host + '/'+newGalleryName,
				urlErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this._startTimer();
		},(err)=>{
			this.setState({
				urlSuccessMsg : null,
				urlErrorMsg : err
			});
		});
	}


	_handleNameChange(nickname){
		this.props.handleNameChange(nickname).then(()=>{
			this.setState({
				nameSuccessMsg : null,
				nameSuccessMsg : 'Name changed to '+nickname,
				urlSuccessMsg : null,
				nameErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this._startTimer();
		},(err)=>{
			this.setState({
				nameSuccessMsg : null,
				nameSuccessMsg : null,
				nameErrorMsg : err
			});
		});
	}

	render(){
		let currentURL = window.location.host + '/' + this.props.galleryName;
		return (
			<div className="toolbar__share">
				<TextControl
					buttonClassName="tool-link tool-link--url-change"
					buttonText="Change URL"
					defaultValue={this.props.galleryName}
					inputDescription={currentURL}
					inputDescriptionLink={'http://' + currentURL}
					submitText="Save"
					handleSubmit={this._handleUrlChange}
					successMsg={this.state.urlSuccessMsg}
					errorMsg={this.state.urlErrorMsg}
				/>
				<TextControl
					buttonClassName="tool-link tool-link--name"
					buttonText="Change Name"
					defaultValue={this.props.name}
					inputDescription="Enter Your Name:"
					handleSubmit= {this._handleNameChange}
					submitText="Save"
					width={270}
					successMsg={this.state.nameSuccessMsg}
					errorMsg={this.state.nameErrorMsg}
				/>
				<TextControl
					buttonClassName="tool-link tool-link--share"
					buttonText="Invite"
					submitText="Copy"
					width={320}
					defaultValue={currentURL}
					readOnly = {true}
					inputDescription="Share this link to invite others"
				/>
			</div>
		);
	}

}

ShareControls.propTypes = {
	name : PropTypes.string,
	handleNameChange : PropTypes.func,
	galleryName :  PropTypes.string,
	handleUrlChange : PropTypes.func
}
