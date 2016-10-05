import React, {PropTypes} from 'react';
import Dropdown from './Dropdown.jsx';


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
				<div class="dropdown">
					<div className="item item--url-change">Change URL</div>
						<Dropdown 
							visible = {this.props.showURLDropdown}
							handleClickOutside = {()=>{this.setDropdownVisibility('colorSelect',false)}}
							>
							URL DROPDOWN
						</Dropdown>
				</div>
				<div className="item item--name">Rohan</div>
				<div className="item item--share">Invite / Share</div>
			</div>
		);
	}

}

ShareBar.PropTypes = {
	showURLDropdown : PropTypes.func.bool,
	showNameDropdown : PropTypes.func.bool,
	showShareDropdown : PropTypes.func.bool,
	handleURLButtonClick : PropTypes.func,
	handleNameButtonClick : PropTypes.func,
	handleShareButtonClick : PropTypes.func,
	handleClickOnDropdownParent : PropTypes.func
}