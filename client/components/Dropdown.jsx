import React from 'react';

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
			dropdownIsActive: false,
			dropdownIsVisible: false,
		};

		// We should bind `this` to click event handler right here
		this._hideDropdown = this._hideDropdown.bind(this);

		this._handleFocus = this._handleFocus.bind(this);
		this._handleBlur = this._handleBlur.bind(this);
		this._toggleDropdown = this._toggleDropdown.bind(this);
	}


	componentDidMount() {
		// Hide dropdown block on click outside the block
		document.addEventListener('click', this._hideDropdown, false);
	}


	componentWillUnmount() {
		// Remove click event listener on component unmount
		document.removeEventListener('click', this._hideDropdown, false);
	}


	_toggleDropdown() {
		const { dropdownIsVisible } = this.state;

		// Toggle dropdown block visibility
		this.setState({ dropdownIsVisible: !dropdownIsVisible });
	}


	_hideDropdown() {
		const { dropdownIsActive } = this.state;
		// Hide dropdown block if it's not active
		if (!dropdownIsActive) {
			this.setState({ dropdownIsVisible: false });
		}
	}


	_handleFocus() {
		// Make active on focus
		this.setState({ dropdownIsActive: true });
	}


	_handleBlur() {

		// Clean up everything on blur
		this.setState({
			dropdownIsVisible: false,
			dropdownIsActive: false,
		});
	}


	render() {

		return (
				<div
					className="dropdown"
					tabIndex="1"
					onFocus={this._handleFocus}
					onBlur={this._handleBlur}
					onClick={this._toggleDropdown}
				>
					<div className="dropdown__toggle">
						{this.props.children[0]}
					</div>
					{
						this.state.dropdownIsVisible &&
						<div className="dropdown__card">
							{this.props.children[1]}
						</div>
					}
				</div>
		);
	}
				
 }
