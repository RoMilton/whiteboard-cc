import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class OwnMousePointer extends React.Component {

	render(){
		let getPointerStyles = ()=>{
			let styles = {
				backgroundColor : this.props.color
			}
			if ( this.props.pos.length){
				styles.left = this.props.pos[0] + 'px';
				styles.top = this.props.pos[1] + 'px';
			}
			return styles;
		};

		return (
			<div
				className="cursors__pointer"
				style={ getPointerStyles() }
			>
				{this.props.name}
			</div>
		)
	}

}

OwnMousePointer.propTypes = {
	name : PropTypes.string,
	color : PropTypes.string,
	tool : PropTypes.string,
	pos : PropTypes.array
}