import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';
import TextControl from './TextControl.jsx';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class ShareControls extends React.Component {

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
					handleSubmit={this.props.handleURLChange}
					width={270}
				/>
				<TextControl
					buttonClassName="item item--name"
					buttonText={this.props.name}
					defaultValue={this.props.name}
					inputDescription="Enter Your Name:"
					handleSubmit= {this.props.handleNameChange}
					submitText="Save"
					width={270}
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
