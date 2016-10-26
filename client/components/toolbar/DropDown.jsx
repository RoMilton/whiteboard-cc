import React, {PropTypes} from 'react';
import classNames from 'classnames';
import eventService from '../../eventService.js';

/**
 * Generic dropdown card. First child element of this component will be the trigger,
 * that toggles the dropdown card when clicked.
 *
 * The second child element will be nested inside the dropdown card itself.
 *
 * Clicking outside the dropdown card will hide it.
 *
 * @class Dropdown
 * @extends React.Component
 */

export default class DropDown extends React.Component {

	constructor(props) {
		super(props);

		// initial state, inactive & hidden by default
		this.state = {
			isActive: false,
			isVisible: false,
		};

		this._documentClick = this._documentClick.bind(this);
		// bind methods here to speed up re-render
		this._hide = this._hide.bind(this);
		this._toggleDropdown = this._toggleDropdown.bind(this);
	}


	// after component mounts
	componentDidMount() {
		// Hide dropdown block on click outside the block
		document.addEventListener('click', this._documentClick, false);
		document.addEventListener('touchstart', this._documentClick, false);
		eventService.on('collapse-dropdowns',this._hide);
	}


	// before component unmounts
	componentWillUnmount() {
		// Remove click event listener on component unmount
		document.removeEventListener('click', this._documentClick, false);
		document.removeEventListener('touchstart', this._documentClick, false);
		eventService.removeListener('collapse-dropdowns',this._hide);
	}


	/**
	* Hides the dropdown card
	*
	* @memberOf Dropdown
	* @method _hide
	*/
	_hide(){
		this.setState({ isVisible:false });
	}


	/**
	* Returns whether a given click's target was inside the dropdown card
	*
	* @memberOf Dropdown
	* @method _clickedContent
	* @param {Event} e - click mouse event
	* @return {Boolean} true if click was inside dropdown card
	*/
	_clickedContent(e){
		let content = this.refs.content;
		return (content && content.contains(e.target));
	}


	/**
	* Returns whether a given click's target was the dropdown toggle button
	*
	* @memberOf Dropdown
	* @method _clickedToggle
	* @param {Event} e - click mouse event
	* @return {Boolean} true if click target was toggle button.
	*/
	_clickedToggle(e){
		let toggle = this.refs.toggle;
		return (toggle && toggle.contains(e.target));	
	}


	/**
	* Toggles visibility of the dropdown card
	*
	* @memberOf Dropdown
	* @method _toggleDropdown
	*/
	_toggleDropdown() {
		let { isVisible } = this.state;
		// Toggle dropdown block visibility
		this.setState({ isVisible : !isVisible });
	}


	/**
	* Fired on every document click. If the dropdown card is currently visible,
	* and the click occured outside the dropdown componenent, then the dropdown
	* card will be hidden
	*
	* @memberOf Dropdown
	* @method _toggleDropdown
	*/
	_documentClick(e) {
		if ((!this.state.isVisible) // dropdown card is already hidden
		|| (this._clickedContent(e) && !this.props.closeOnContentClick) // clicked in dropdown card
		|| this._clickedToggle(e)){ // clicked on toggle button
			// dont hide
			return;
		}
		// hide
		this._hide();
	}

	render() {
		//styles for container
		let getDropDownCSSClass=()=>{
			return classNames({
				dropdown : true,
				'is-active' : this.state.isVisible
			});
		}
		//styles just for dropdown card
		let getCardStyles=()=>{
			let styles = {};
			styles[this.props.anchor] = '2px';
			styles.width = this.props.width ? (this.props.width + 'px') : 'auto';
			return styles;
		};
		return (
			<div
				className={getDropDownCSSClass()}
				tabIndex="1"
			>
				<div
					ref="toggle"
					onClick={this._toggleDropdown} 
					className="dropdown__toggle"
				>
					{this.props.children[0]}

				</div>
				{
					this.state.isVisible && 
					<div 
						style={ getCardStyles() }
						className="dropdown__card"
						ref="content"
					>
						{this.props.closeButton && 
							<span onClick={this._toggleDropdown} className="dropdown__btnClose">&#10005;</span>}
						{this.props.children[1]}
					</div>
				}
			</div>
		);
	}

}

DropDown.propTypes = {
	anchor : PropTypes.oneOf(['left','right']), // side of trigger element that dropdown card should be anchored to
	closeButton : PropTypes.bool, // whether to display a small X on top right of dropdown card that closes card when clicked.
	width: PropTypes.number, // optional hardcoded width of dropdown card in pixels
	showArrow : PropTypes.bool, // whether to show the small traingle that appears to pertrude from dropdown card, pointing towards its trigger element
	closeOnContentClick : PropTypes.bool // whether to close the dropdown when its anything inside it is clicked
}

DropDown.defaultProps = {
	anchor : 'right',
	closeOnContentClick : false,
	closeButton : true,
	showArrow : true
}