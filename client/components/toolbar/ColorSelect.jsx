import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Displays a palette of colors. When a user clicks on a color, a 
 * callback can be fired passing the clicked color that was clicked on.
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
			<ul className="color-palette">
				{ this.props.colors.map((col,index)=>{
					return <li
						className={getItemCSSClass(col)}
						key={index}
						onClick={()=>{ this.props.handleColorClick(col)}}
						style={{backgroundColor:col}}
					/>
				})}
			</ul>
		)
	}
}

ColorSelect.propTypes = {
	colors : PropTypes.arrayOf(PropTypes.string).isRequired, // array of hex colors
	selectedColor : PropTypes.string, // currently selected color. If provided, it will be highlighted in UI
	handleColorClick : PropTypes.func // fired when user clicks on a color
}