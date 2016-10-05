import React from 'react';
import ReactTooltip from 'react-tooltip';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Button
 * @extends React.Component
 */
export default class ToolButton extends React.Component {

	render(){
		// let getCSSClass(){
		// 	return classNames({
		// 		'button',
		// 		`button--${this.props.cssSuffix}`,
		// 		this.props.cssClasses
		// 	});
		// }
		return (
			<div 
				data-tip={this.props.description}
				className={this.props.className || 'button'} 
				onClick={this.props.handleClick}
				style = {this.props.style || null}
			>
				{this.props.children}
			</div>
		)

	}
}