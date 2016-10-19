import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Utils from '../../universal/Utils.js';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class MousePointer extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			textColor : this.getTextColor(props.bgColor)
		}
	}

	getTextColor(backgroundColor){
		return Utils.getBrightness(backgroundColor) > 200 ? '#3f2713' : '#fff';
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.bgColor !== this.props.bgColor){
			this.setState({ textColor : this.getTextColor(nextProps.bgColor) });
		}
	}

	getPointerStyles(pos){
		let styles = {
			backgroundColor : this.props.bgColor,
			color : this.state.textColor
		}
		if (pos){
			styles.left = pos[0] + 'px';
			styles.top = pos[1] + 'px';
		}
		return styles;
	};

}