import React from 'react';
import ShapePalette from './ShapePalette.jsx';
import ColorSelect from './ColorSelect.jsx';
import ToolButton from './ToolButton.jsx';


/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Toolbar extends React.Component {
	constructor(){
		super();
		
		let showDropdown = {
			colorSelect : false,
			undoList : false,
			changeURL : false,
			changeName : false,
			Share : false
		}

		this.state={
			showDropdown : showDropdown
		}

		this.toggleSubmenu = this.toggleSubmenu.bind(this);
		this.setSubmenuVisibility = this.setSubmenuVisibility.bind(this);
		this.handleColorClick = this.handleColorClick.bind(this);
	}

	toggleSubmenu(dropdownName){
		this.setSubmenuVisibility(dropdownName,!this.state.showDropdown[dropdownName]);
	}

	setSubmenuVisibility(dropdownName,visible){
		var showDropdown = this.state.showDropdown;
		showDropdown[dropdownName] = visible;
		this.setState({
			dropdown : showDropdown
		});
	}

	handleColorClick(newCol){
		this.setSubmenuVisibility('colorSelect',false);
		this.props.handleColorClick(newCol);
	}

	handleDropdownParentClick(e,dropdownName){
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		this.toggleSubmenu(dropdownName)
	}

	render(){
		let colorStyles = {
			backgroundColor : this.props.selectedColor
		};
		return (
			<header className="toolbar">
				<div className="toolbar__controls">
					<div className="dropdown">
						<ToolButton
							className="button button--filled" 
							style={colorStyles}
							handleClick={(e)=>{this.handleDropdownParentClick(e,'colorSelect');}}
						>
						</ToolButton>
						<ColorSelect
							colors={this.props.colors} 
							selectedColor = {this.props.selectedColor}
							handleColorClick = {this.handleColorClick}
							handleClickOutside = {()=>{this.setSubmenuVisibility('colorSelect',false)}}
							visible = {this.state.showDropdown.colorSelect}
						/>
					</div>
					<ToolButton 
						className="button button--undo" 
						handleClick={this.props.handleUndoClick}
					>
						Undo
					</ToolButton>
					<ToolButton 
						className="button button--clear button--dropdown"
					>
						Clear My Sketches
						<span className="button--dropdown__toggle"></span>
					</ToolButton>
				</div>
				<ShapePalette
					tools={this.props.tools}
					selectedTool = {this.props.selectedTool}
					handleToolChange = {this.props.handleToolChange}
				/>
				<div className="toolbar__share">
					<div className="item item--url-change">Change URL</div>
					<div className="item item--name">Rohan</div>
					<div className="item item--share">Invite / Share</div>
				</div>
			</header>
		)
	}
}

Toolbar.propTypes = {
	colors : React.PropTypes.array.isRequired,
	selectedTool : React.PropTypes.string.isRequired,
	selectedColor : React.PropTypes.string.isRequired,
	tools : React.PropTypes.array.isRequired,
	handleToolChange : React.PropTypes.func,
	handleUndoClick : React.PropTypes.func,
	handleColorClick: React.PropTypes.func
};

Toolbar.defaultProps = {
};
