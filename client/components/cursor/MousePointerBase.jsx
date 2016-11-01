import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Utils from '../../../universal/Utils.js';

/**
 * Parent class for the Mouse Pointer component.
 *
 * The mouse pointer is not a cursor, but a visual representation of where a user's mouse pointer is
 * on the screen. This is a solid square filled in the user's selected color, and with the user's nickname
 * written on it.
 *
 * This component is not meant to be implemented directly but instead extended by a child component.
 *
 * This class contains methods that calculate common styling that apply to all mouse pointers.
 *
 * @class MousePointer
 * @extends React.Component
 */
export default class MousePointer extends React.Component {

	constructor(props){
		super(props);

		// intial state
		this.state = {
			textColor : this._getTextColor(props.bgColor) // label content text color
		}
	}


	// when props are received
	componentWillReceiveProps(nextProps){
		if (nextProps.bgColor !== this.props.bgColor){
			this.setState({ textColor : this._getTextColor(nextProps.bgColor) });
		}
	}


	/**
	* Calculates the text color of the component. If the provided background color
	* is light, text color will be dark and vise-versa.
	*
	* @memberOf MousePointer
	* @method _getTextColor
	* @param {String} backgroundColor - color of component in hex format
	* @return {string} color of text in hex format
	*/
	_getTextColor(backgroundColor){
		return Utils.getBrightness(backgroundColor) > 200 ? '#3f2713' : '#fff';
	}


	/**
	* Calculates dynamic styles to be applied to the mouse pointer div.
	*
	* The returned object will be an object with each property a CSS property, and each
	* value a corresponding CSS value.
	*
	* @memberOf MousePointer
	* @method _getPointerStyles
	* @param {array[Number]} pos - position of mouse pointer
	* @return {Object} object containing CSS properties and values
	*/
	_getPointerStyles(pos){
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