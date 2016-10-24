import React, {PropTypes} from 'react';
import classNames from 'classnames';
import eventService from '../../eventService.js';

/**
 *
 * @class Dropdown
 * @extends React.Component
 */

export default class DropDown extends React.Component {

	constructor(props) {
		
		super(props);

		// Dropdown block is inactive & hidden by default
		this.state = {
			isActive: false,
			isVisible: false,
		};

		this._documentClick = this._documentClick.bind(this);
		this._hide = this._hide.bind(this);
		this._toggleDropdown = this._toggleDropdown.bind(this);
	}

	componentDidMount() {
		// Hide dropdown block on click outside the block
		document.addEventListener('click', this._documentClick, false);
		document.addEventListener('touchstart', this._documentClick, false);
		eventService.on('collapse-dropdowns',this._hide);
	}


	componentWillUnmount() {
		// Remove click event listener on component unmount
		document.removeEventListener('click', this._documentClick, false);
		document.removeEventListener('touchstart', this._documentClick, false);
		eventService.removeListener('collapse-dropdowns',this._hide);
	}

	_hide(){
		this.setState({ isVisible:false });
	}

	_clickedContent(e){
		let content = this.refs.content;
		return (content && content.contains(e.target));
	}

	_clickedToggle(e){
		let toggle = this.refs.toggle;
		return (toggle && toggle.contains(e.target));	
	}

	_toggleDropdown(e) {
		let { isVisible } = this.state;
		// Toggle dropdown block visibility
		this.setState({ isVisible : !isVisible });
	}

	_documentClick(e) {
		if ((!this.state.isVisible)
		|| (this._clickedContent(e) && !this.props.closeOnContentClick)
		|| this._clickedToggle(e)){
			// dont hide
			return;
		}	
		// hide
		this.setState({ isVisible: false });
	}

	render() {
		let getCardStyles=()=>{
			let styles = {};
			styles[this.props.anchor] = '2px';
			styles.width = this.props.width ? (this.props.width + 'px') : 'auto';
			return styles;
		};
		let getDropDownCSSClass=()=>{
			return classNames({
				dropdown : true,
				'is-active' : this.state.isVisible
			});
		}
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
	anchor : PropTypes.oneOf(['left','right']),
	closeButton : PropTypes.bool,
	width: PropTypes.number,
	showArrow : PropTypes.bool,
	closeOnContentClick : PropTypes.bool
}

DropDown.defaultProps = {
	anchor : 'right',
	closeOnContentClick : false,
	closeButton : true,
	showArrow : true
}