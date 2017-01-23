import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Displays a palette of colors. When a user clicks on a color, a 
 * callback can be fired passing the clicked color.
 *
 * @class ColorSelect
 * @extends React.Component
 */

const ColorSelect = ( props ) => {
	let getItemCSSClass = (col)=>{
		return classNames({
			'is-active' : col === props.selectedColor
		});
	}
	return(
		<ul className="color-palette">
			{ props.colors.map((col,index)=>{
				return <li
					className={getItemCSSClass(col)}
					key={index}
					onClick={()=>{ props.handleColorClick(col)}}
					style={{backgroundColor:col}}
				/>
			})}
		</ul>
	)
}

export default ColorSelect;

ColorSelect.propTypes = {
	colors : PropTypes.arrayOf(PropTypes.string).isRequired, // array of hex colors
	selectedColor : PropTypes.string, // currently selected color. If provided, it will be highlighted in UI
	handleColorClick : PropTypes.func // fired when user clicks on a color
}