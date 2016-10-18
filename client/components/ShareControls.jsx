import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';
import TextControl from './TextControl.jsx';
import eventService from '../eventService.js';


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
		this.handleURLChange = this.handleURLChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
	}

	startClearTimer(){
		if (this.timer){clearInterval(this.timer);}
		this.timer = setTimeout(()=>{
			this.setState({
				urlSuccessMsg : null,
				nameSuccessMsg : null
			});
		},4000);
	};


	handleURLChange(galleryName){
		this.props.handleURLChange(galleryName).then(()=>{
			this.setState({
				nameSuccessMsg : null,
				urlSuccessMsg : 'URL changed to '+window.location.host + '/'+galleryName,
				urlErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this.startClearTimer();
		},(err)=>{
			this.setState({
				urlSuccessMsg : null,
				urlErrorMsg : err
			});
		});
	}


	handleNameChange(nickname){
		this.props.handleNameChange(nickname).then(()=>{
			this.setState({
				nameSuccessMsg : null,
				nameSuccessMsg : 'Name changed to '+nickname,
				urlSuccessMsg : null,
				nameErrorMsg : null
			});
			eventService.emit('collapse-dropdowns');
			this.startClearTimer();
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
					buttonClassName="item item--url-change"
					buttonText="Change URL"
					defaultValue={this.props.galleryName}
					inputDescription={currentURL}
					inputDescriptionLink={'http://' + currentURL}
					submitText="Save"
					handleSubmit={this.handleURLChange}
					width={270}
					successMsg={this.state.urlSuccessMsg}
					errorMsg={this.state.urlErrorMsg}
				/>
				<TextControl
					buttonClassName="item item--name"
					buttonText={this.props.name}
					defaultValue={this.props.name}
					inputDescription="Enter Your Name:"
					handleSubmit= {this.handleNameChange}
					submitText="Save"
					width={270}
					successMsg={this.state.nameSuccessMsg}
					errorMsg={this.state.nameErrorMsg}
				/>
				<TextControl
					buttonClassName="item item--share"
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
	handleURLChange : PropTypes.func
}
