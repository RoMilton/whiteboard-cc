import React from 'react';
import ShapePalette from './ShapePalette.jsx';
import ColorSelect from './ColorSelect.jsx';
import ToolButton from './ToolButton.jsx';
import DropDown from './DropDown.jsx';
import ShareControls from './ShareControls.jsx';


/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Toolbar extends React.Component {
	constructor(props){
		super(props);
		this.handleColorClick = this.handleColorClick.bind(this);
	}

	handleColorClick(newCol){
		this.props.handleColorClick(newCol);
	}

	render(){
		let colorStyles = {
			backgroundColor : this.props.selectedColor
		};
		return (
			<header className="toolbar">
				<div className="toolbar__controls">
					<DropDown anchor="left">
						<ToolButton
							className="button button--filled" 
							style={colorStyles}
						>
						</ToolButton>
						<ColorSelect
							colors={this.props.colors} 
							selectedColor = {this.props.selectedColor}
							handleColorClick = {this.handleColorClick}
						/>
					</DropDown>
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
				<ShareControls 
				/>
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
