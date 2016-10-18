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
		this.setState({ isVisible: !isVisible });
	}

	hideDropdown(e) {
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