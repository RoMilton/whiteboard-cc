import React, {PropTypes} from 'react';
import classNames from 'classnames';

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

		this.hideDropdown = this.hideDropdown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}


	componentDidMount() {
		// Hide dropdown block on click outside the block
		document.addEventListener('click', this.hideDropdown, false);
	}


	componentWillUnmount() {
		// Remove click event listener on component unmount
		document.removeEventListener('click', this.hideDropdown, false);
	}


	toggleDropdown() {
		const { isVisible } = this.state;

		// Toggle dropdown block visibility
		this.setState({ isVisible: !isVisible });
	}


	hideDropdown() {
		let { isActive } = this.state;
		// Hide dropdown block if it's not active
		if (!isActive) {
			this.setState({ isVisible: false });
		}
	}


	handleFocus() {
		// Make active on focus
		this.setState({ isActive: true });
	}


	handleBlur() {

		// Clean up everything on blur
		this.setState({
			isVisible: false,
			isActive: false,
		});
	}


	render() {
		let getCardStyles=()=>{
			let styles = {};
			styles[this.props.anchor] = '0px';
			return styles;
		};
		// let getArrowStyles=()=>{
		// 	//get width of toggle button
		// 	//let toggleButtonWidth = parseInt(window.getComputedStyle(this.refs.toggleButton).width);
		// 	let styles = {};
		// 	styles[this.props.anchor] = '25px';
		// 	return styles;
		// };
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
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					onClick={this.toggleDropdown}
				>
					<div 
						ref="toggleButton"
						className="dropdown__toggle"
					>
						{this.props.children[0]}
					</div>
					{
						this.state.isVisible && 
						<div 
							style={ getCardStyles() }
							className="dropdown__card"
						>
							{this.props.children[1]}
						</div>
					}
				</div>
		);
	}

}

DropDown.propTypes = {
	anchor : PropTypes.oneOf(['left','right'])
}

DropDown.defaultProps = {
	anchor : 'right'
}