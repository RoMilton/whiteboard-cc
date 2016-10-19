import React, {PropTypes} from 'react';
import classNames from 'classnames';
import MousePointer from './MousePointer.jsx';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class OwnMousePointer extends MousePointer {
	render(){
		return (this.props.pos[1] < 0) ? null : (
			<div
				className="cursors__pointer cursors__pointer--own"
				style={ this._getPointerStyles(this.props.pos) }
			>
				{this.props.name}
			</div>
		)
	}

}

OwnMousePointer.propTypes = {
	name : PropTypes.string,
	bgColor : PropTypes.string,
	tool : PropTypes.string
	
}