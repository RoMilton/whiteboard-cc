import React from 'react';
import ShapePalette from './ShapePalette.jsx';
import ColorSelect from './ColorSelect.jsx';
import ToolButton from './ToolButton.jsx';
import DropDown from './DropDown.jsx';
import ShareControls from './ShareControls.jsx';
import ToolSelectList from './ToolSelectList.jsx';


/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Toolbar extends React.Component {

	render(){
		let colorStyles = {
			backgroundColor : this.props.selectedColor
		};
		return (
			<header className="toolbar">
				<div className="toolbar__controls">
					<DropDown 
						anchor="left"
						closeButton={false}
						closeOnContentClick={true}
						width = {267}
					>
						<ToolButton
							className="button button--filled" 
							style={colorStyles}
						>
						</ToolButton>
						<ColorSelect
							colors={this.props.colors} 
							selectedColor = {this.props.selectedColor}
							handleColorClick = {this.props.handleColorClick}
						/>
					</DropDown>
					<ToolButton 
						className="button button--undo" 
						handleClick={ this.props.handleUndoClick }
						text="Undo"
					/>
					<ToolSelectList
						buttonClassName="button button--clear"
						text="Clear My Sketches"
						handleClick={ this.props.handleClearMyClick }
						optionNames={['Clear My Sketches','Clear Everything']}
						optionClicks={[this.props.handleClearMyClick,this.props.handleClearAllClick]}
					/>
				</div>
				<ShapePalette
					shapes={this.props.shapes}
					selectedShape = {this.props.selectedShape}
					handleToolChange = {this.props.handleToolChange}
				/>
				<ShareControls 
					name = {this.props.name}
					galleryName = {this.props.galleryName}
					handleNicknameChange = {this.props.handleNicknameChange}
					handleUrlChange = {this.props.handleUrlChange}
				/>
			</header>
		)
	}
}

Toolbar.propTypes = {
	colors : React.PropTypes.array.isRequired,
	selectedShape : React.PropTypes.string.isRequired,
	selectedColor : React.PropTypes.string.isRequired,
	name : React.PropTypes.string,
	url : React.PropTypes.string,
	shapes : React.PropTypes.object.isRequired,
	handleToolChange : React.PropTypes.func,
	handleUndoClick : React.PropTypes.func,
	handleColorClick: React.PropTypes.func,
	handleNicknameChange: React.PropTypes.func,
	handleUrlChange : React.PropTypes.func,
	handleClearMyClick : React.PropTypes.func,
	handleClearAllClick : React.PropTypes.func
};

Toolbar.defaultProps = {
};
