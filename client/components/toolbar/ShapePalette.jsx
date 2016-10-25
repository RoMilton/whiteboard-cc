import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * List of Tool Options, presented side by side. When clicked on, fires 
 * a callback provided by prop handleShapeChange.
 *
 * @class App
 * @extends React.Component
 */
export default ShapePalette = class extends React.Component {
	render(){
		// returns CSS class string
		let getCSSClass = (shapeName) => {
			return classNames({
				'shape-list__item' : true,
				[`shape-list__item--${shapeName}`]  : true,
				'is-active' : this.props.selectedShape === shapeName
			});
		};
		return (
			<ul className="shape-list">
				{
					Object.keys(this.props.shapes).map((key)=>{
						let shape = this.props.shapes[key];
						return <li 
							key = {key}
							className = {getCSSClass(key)}
							data-tip = {shape.description}
							onClick = {()=>{this.props.handleShapeChange(key)}}
						/ >;
					})
				}
			</ul>
		)
	}
}

ShapePalette.propTypes = {
	selectedShape : PropTypes.string.isRequired,
	shapes : PropTypes.object.isRequired,
	handleShapeChange : PropTypes.func
};
