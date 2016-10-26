import React, {PropTypes} from 'react';
import classNames from 'classnames';
import MousePointerBase from './MousePointerBase.jsx';

/**
 * A label that floats around the screen that indicates where the user's own cursor is. 
 *
 * The labels background and content are provided via props.
 *
 * @class OwnMousePointer
 * @extends React.Component
 */
export default class OwnMousePointer extends MousePointerBase {
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
	name : PropTypes.string, // text to display inside component
	bgColor : PropTypes.string, // // background color of component (used by base class)
}