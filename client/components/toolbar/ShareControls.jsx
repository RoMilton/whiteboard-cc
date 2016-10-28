import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';
import TextControl from './TextControl.jsx';
import eventService from '../../eventService.js';
import ActiveUsers from './ActiveUsers.jsx';


/**
 * Colletion of buttons dedicated to social actions such as inviting other people and changing own name
 *
 * @class ShareControls
 * @extends React.Component
 */
export default class ShareControls extends React.Component {

	constructor(props){
		super(props);

		// set initial state
		this.state = {
			urlSuccessMsg : null,
			urlErrorMsg : null,
			nameSuccessMsg : null,
			nameErrorMsg : null
		}

		// bind methods here to speed up re-render
		this._handleUrlChange = this._handleUrlChange.bind(this);
		this._handleNicknameChange = this._handleNicknameChange.bind(this);
	}

	/**
	* Starts a timer, then clears all success messages upon its completion.
	*
	* @memberOf ShareControls
	* @method clearAfterTimer
	*/
	_clearAfterTimer(){
		if (this.timer){clearTimeout(this.timer);}
		this.timer = setTimeout(()=>{
			this.setState({
				urlSuccessMsg : null,
				nameSuccessMsg : null
			});
		},4000);
	};


	/**
	* Changes gallery address by firing the handleUrlChange callback, then displays an 
	* appropriate notification showing whether the change was successful.
	*
	* @memberOf ShareControls
	* @method _handleUrlChange
	* @param {String} galleryName - new gallery name to change the address to.
	*/
	_handleUrlChange(galleryName){
		this.props.handleUrlChange(galleryName).then((newGalleryName)=>{
			this.setState({
				nameSuccessMsg : null,
				urlSuccessMsg : 'URL changed to '+window.location.host + '/'+newGalleryName,
				urlErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this._clearAfterTimer();
		},(err)=>{
			this.setState({
				urlSuccessMsg : null,
				urlErrorMsg : err
			});
		});
	}


	/**
	* Changes current user's nickname firing the handleNicknameChange callback, then displays an 
	* appropriate notification showing whether the change was successful.
	*
	* @memberOf ShareControls
	* @method _handleNicknameChange
	* @param {String} nickname - new nickname to change to
	*/
	_handleNicknameChange(nickname){
		this.props.handleNicknameChange(nickname).then(()=>{
			this.setState({
				nameSuccessMsg : null,
				nameSuccessMsg : 'Name changed to '+nickname,
				urlSuccessMsg : null,
				nameErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this._clearAfterTimer();
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
					defaultValue={this.props.nickname}
					inputDescription="Enter Your Nickname:"
					handleSubmit= {this._handleNicknameChange}
					submitText="Save"
					width={270}
					successMsg={this.state.nameSuccessMsg}
					errorMsg={this.state.nameErrorMsg}
				/>
				<ActiveUsers
					nickname = {this.props.nickname}
					activeUsers = {this.props.activeUsers}
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
	nickname : PropTypes.string,  // current user's nickname
	galleryName :  PropTypes.string, // current gallery name
	handleUrlChange : PropTypes.func, // fired when gallery name is changed
	activeUsers : PropTypes.arrayOf(PropTypes.object) // array containing objects representing remote users. Each object must have sessionId property
}