import React, {PropTypes} from 'react';
import ShapePalette from './ShapePalette.jsx';
import ColorSelect from './ColorSelect.jsx';
import ToolButton from './ToolButton.jsx';
import DropDown from './DropDown.jsx';
import ShareControls from './ShareControls.jsx';
import ToolSelectList from './ToolSelectList.jsx';


/**
 * Toolbar containing actions that manipulate settings and whiteboards.
 * 
 * Also contains social actions such as Invite/Share and change name
 *
 * @class Toolbar
 * @extends React.Component
 */

const Toolbar = ( props ) => {
	let colorStyles = {
		backgroundColor : props.selectedColor
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
						colors={props.colors} 
						selectedColor = {props.selectedColor}
						handleColorClick = {props.handleColorClick}
					/>
				</DropDown>
				<ToolButton 
					className="button button--undo" 
					handleClick={ props.handleUndoClick }
					text="Undo"
				/>
				<ToolSelectList
					buttonClassName="button button--clear"
					text="Clear My Sketches"
					handleClick={ props.handleClearMyClick }
					optionNames={['Clear My Sketches','Clear Everything']}
					optionClicks={[props.handleClearMyClick,props.handleClearAllClick]}
				/>
			</div>
			<ShapePalette
				shapes={props.shapes}
				selectedShape = {props.selectedShape}
				handleShapeChange = {props.handleShapeChange}
			/>
			<ShareControls 
				nickname = {props.nickname}
				galleryName = {props.galleryName}
				handleNicknameChange = {props.handleNicknameChange}
				handleUrlChange = {props.handleUrlChange}
				activeUsers = {props.activeUsers}
			/>
		</header>
	)
}

export default Toolbar;

Toolbar.propTypes = {
	colors : PropTypes.array.isRequired, 		// array of all possible colors in hex format
	shapes : PropTypes.object.isRequired, 		// object with shape types (such as 'pen','line') as properties
	selectedShape : PropTypes.string.isRequired, 	// selected shape, must be property of prop shapes
	selectedColor : PropTypes.string.isRequired, 	// selected color in hex format
	galleryName : PropTypes.string, 			// current gallery name
	nickname : PropTypes.string, 				// current user's nickname
	handleShapeChange : PropTypes.func, 		// fired when new shape is clicked
	handleUndoClick : PropTypes.func, 			// fired when undo is clicked
	handleColorClick: PropTypes.func, 			//fired when new color is clicked
	handleNicknameChange: PropTypes.func, 		//fired when new nickname is submitted
	handleUrlChange : PropTypes.func,			//fired when new gallery name is submitted
	handleClearMyClick : PropTypes.func,		// fired when Clear My sketches is clicked
	handleClearAllClick : PropTypes.func,		// fired when Clear Everything is clicked
	activeUsers : PropTypes.arrayOf(PropTypes.object), // array containing objects representing remote users. Each object must have sessionId property
};

Toolbar.defaultProps = {
};
