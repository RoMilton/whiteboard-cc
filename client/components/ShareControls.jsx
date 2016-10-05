import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class ShareBar extends React.Component {

	render(){
		return (
			<div className="toolbar__share">
				<DropDown anchor="right">
					<div className="item item--url-change">Change URL</div>
					<TextField 
						handleSubmit="" 
					/>
				</DropDown>
				<DropDown anchor="right">
					<div className="item item--name">Rohan</div>
					<TextField 
						handleSubmit="" 
					/>
				</DropDown>
				<div className="item item--share">Invite / Share</div>
			</div>
		);
	}

}
