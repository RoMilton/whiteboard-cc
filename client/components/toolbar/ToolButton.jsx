import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';

/**
 * Generic Toolbar Button. When clicked, the handleClick callback is fired
 *
 * @class ToolButton
 * @extends React.Component
 */
export default class ToolButton extends React.Component {
	render(){
		return (
			<div 
				data-tip={this.props.text}
				data-class="no-1030"
				className={this.props.className} 
				onClick={this.props.handleClick}
				style = {this.props.style || null}
			>
				<span>{this.props.text}</span>
			</div>
		);
	}
}

ToolButton.PropTypes = {
	text: PropTypes.string, // text to display in button
	className: PropTypes.string, // CSS classname assigned to buton
	style: PropTypes.object, // object containing style properties and values
	handleClick: PropTypes.func // fired when button is clicked
}

ToolButton.defaultProps = {
	className : 'button'
}