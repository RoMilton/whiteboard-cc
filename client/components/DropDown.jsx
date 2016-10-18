import React, {PropTypes} from 'react';
import classNames from 'classnames';
import eventService from '../eventService.js';

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

		this.documentClick = this.documentClick.bind(this);
		this.hide = this.hide.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}

	hide(){
		this.setState({ isVisible:false });
	}

	componentDidMount() {
		// Hide dropdown block on click outside the block
		document.addEventListener('click', this.documentClick, false);
		eventService.on('collapse-dropdowns',this.hide);
	}


	componentWillUnmount() {
		// Remove click event listener on component unmount
		document.removeEventListener('click', this.documentClick, false);
		eventService.removeListener('collapse-dropdowns',this.hide);
	}


	clickedContent(e){
		let content = this.refs.content;
		return (content && content.contains(e.target));
	}

	clickedOnToggle(e){
		let toggle = this.refs.toggle;
		return (toggle && toggle.contains(e.target));	
	}

	toggleDropdown(e) {
		let { isVisible } = this.state;
		// Toggle dropdown block visibility
		this.setState({ isVisible : !isVisible });
	}

	documentClick(e) {
		if ((!this.state.isVisible)
		|| (this.clickedContent(e) && !this.props.closeOnContentClick)
		|| this.clickedOnToggle(e)){
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
			styles.width = this.props.width ? (this.props.width + 'px') : '';
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
					onClick={this.toggleDropdown} 
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
							<span onClick={this.toggleDropdown} className="dropdown__btnClose">&#10005;</span>}
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