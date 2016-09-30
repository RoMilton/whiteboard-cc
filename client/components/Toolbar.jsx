import React from 'react';
import ToolPalette from './ToolPalette.jsx';

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
					<div className="button button--filled" style={colorStyles}></div>
					<div className="button button--undo">Undo</div>
					<div className="button button--clear button--dropdown">Clear My Sketches
						<span className="button--dropdown__toggle"></span>
					</div>
				</div>
				<ToolPalette
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
	selectedTool : React.PropTypes.string.isRequired,
	selectedColor : React.PropTypes.string.isRequired,
	tools : React.PropTypes.array.isRequired,
	handleToolChange : React.PropTypes.func
};

Toolbar.defaultProps = {
};
