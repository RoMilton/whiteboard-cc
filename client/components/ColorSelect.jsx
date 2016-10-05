import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class ColorSelect extends React.Component {
	
	constructor(props){
		super(props);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
	}

	componentDidMount(){
 		document.addEventListener('click', this.handleDocumentClick);
	}

	componentWillUnmount(){
		document.removeEventListener('click', this.handleDocumentClick);
	}

	handleDocumentClick(e){
		e.stopPropagation();
		if (!this.props.visible || !this.props.handleClickOutside){return;}
		let area = this.refs.dropdownCard;
		if (!area.contains(e.target)) {
			this.props.handleClickOutside(e)
		}
	}

	render(){
		let getItemCSSClass = (col)=>{
			return classNames({
				'is-active' : col === this.props.selectedColor
			});
		}
		return(
			<ul className="color-palette">
				{this.props.colors.map((col,index)=>{
					return <li
						className={getItemCSSClass(col)}
						key={index}
						onClick={()=>{
							this.props.handleColorClick(col)
						}}
						style={{backgroundColor:col}}
					/>
				})}
			</ul>
		)
	}
}

ColorSelect.propTypes = {
	colors : PropTypes.array.isRequired,
	selectedColor : PropTypes.string.isRequired,
	handleColorClick : PropTypes.func,
	handleClickOutside : PropTypes.func,
	visible : PropTypes.bool
}

ColorSelect.defaultProps = {
	visible : false
};