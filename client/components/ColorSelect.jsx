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
	render(){
		let getItemCSSClass = (col)=>{
			return classNames({
				'is-active' : col === this.props.selectedColor
			});
		}
		return(
			<div 
				className='dropdown__card dropdown__card--color'
				style = {{display:this.props.visible ? 'block' : 'none'}}
			>
				<ul className="color-palette">
					{this.props.colors.map((col,index)=>{
						return <li
							className={getItemCSSClass(col)}
							key={index}
							onClick={()=>{
								console.log('this',this);
								this.props.handleColorClick(col)
							}}
							style={{backgroundColor:col}}
						/>
					})}
				</ul>
			</div>
		)
	}
}

ColorSelect.propTypes = {
	colors : PropTypes.array.isRequired,
	selectedColor : PropTypes.string.isRequired,
	handleColorClick : PropTypes.func,
	visible : PropTypes.bool
}

ColorSelect.defaultProps = {
	visible : false
};