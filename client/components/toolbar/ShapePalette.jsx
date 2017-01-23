import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * List of Shapes buttons (such as Pen, Rect, Line). Callback is fired when shape is clicked.
 *
 * @class ShapePalette
 * @extends React.Component
 */

const ShapePalette = ( props ) => {
	// returns CSS class string
	let getCSSClass = (shapeName) => {
		return classNames({
			'shape-list__item' : true,
			[`shape-list__item--${shapeName}`]  : true,
			'is-active' : props.selectedShape === shapeName
		});
	};
	return (
		<ul className="shape-list">
			{
				Object.keys(props.shapes).map((key)=>{
					let shape = props.shapes[key];
					return <li 
						key = {key}
						className = {getCSSClass(key)}
						data-tip = {shape.description}
						onClick = {()=>{props.handleShapeChange(key)}}
					/ >;
				})
			}
		</ul>
	);
}

export default ShapePalette;

ShapePalette.propTypes = {
	shapes : PropTypes.object.isRequired, // object containing with shape names as properties.
	selectedShape : PropTypes.string.isRequired, // selected shape, must exist as property in above prop shapes
	handleShapeChange : PropTypes.func // fired when shape button is clicked
};
