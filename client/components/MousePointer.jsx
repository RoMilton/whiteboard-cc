import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class MousePointer extends React.Component {

	getPointerStyles(pos){
		let styles = {
			backgroundColor : this.props.color,
			color : (this.props.color === '#ffffff' ) ? '#111' : ''
		}
		if (pos){
			styles.left = pos[0] + 'px';
			styles.top = pos[1] + 'px';
		}
		return styles;
	};

}