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
					<DropDown 
						anchor="left"
						closeOnContentClick={true}
					>
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
						handleClick={ ()=>{this.props.handleUndoClick(1)} }
					>
						Undo
					</ToolButton>
					<ToolButton 
						className="button button--clear button--dropdown"
					>
						<span>Clear My Sketches</span>
						<DropDown>
							<span className="button--dropdown__toggle" />
							<ul className="options-list">
								<li onClick={()=>{this.props.handleUndoClick('all')}} >Clear My Sketches</li>
								<li onClick={this.props.handleClearAllClick} > Clear Everything</li>
							</ul>
						</DropDown>
						
					</ToolButton>
				</div>
				<ShapePalette
					tools={this.props.tools}
					selectedTool = {this.props.selectedTool}
					handleToolChange = {this.props.handleToolChange}
				/>
				<ShareControls 
					name = {this.props.name}
					galleryName = {this.props.galleryName}
					handleNameChange = {this.props.handleNameChange}
					handleURLChange = {this.props.handleURLChange}
				/>
			</header>
		)
	}
}

Toolbar.propTypes = {
	colors : React.PropTypes.array.isRequired,
	selectedTool : React.PropTypes.string.isRequired,
	selectedColor : React.PropTypes.string.isRequired,
	name : React.PropTypes.string,
	url : React.PropTypes.string,
	tools : React.PropTypes.array.isRequired,
	handleToolChange : React.PropTypes.func,
	handleUndoClick : React.PropTypes.func,
	handleColorClick: React.PropTypes.func,
	handleNameChange: React.PropTypes.func,
	handleURLChange : React.PropTypes.func,
	handleClearMyClick : React.PropTypes.func,
	handleClearAllClick : React.PropTypes.func
};

Toolbar.defaultProps = {
};
