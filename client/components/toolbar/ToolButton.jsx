import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';

/**
 * Generic Toolbar Button. When clicked, the handleClick callback is fired
 *
 * @class ToolButton
 * @extends React.Component
 */

const ToolButton = ( props ) => (
	<div 
		data-tip={props.text}
		data-class="no-1030"
		className={props.className} 
		onClick={props.handleClick}
		style = {props.style || null}
	>
		<span>{props.text}</span>
	</div>
)

export default ToolButton;

ToolButton.PropTypes = {
	text: PropTypes.string, // text to display in button
	className: PropTypes.string, // CSS classname assigned to buton
	style: PropTypes.object, // object containing style properties and values
	handleClick: PropTypes.func // fired when button is clicked
}

ToolButton.defaultProps = {
	className : 'button'
}