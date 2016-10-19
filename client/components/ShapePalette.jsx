import React from 'react';
import classNames from 'classnames';

/**
 * List of Tool Options, presented side by side. When clicked on, fires 
 * a callback provided by prop handleToolChange.
 *
 * @class App
 * @extends React.Component
 */
export default ShapePalette = class extends React.Component {
	render(){
		// returns CSS class string
		let getCSSClass = (shapeName) => {
			return classNames({
				'tool-list__item' : true,
				[`tool-list__item--${shapeName}`]  : true,
				'is-active' : this.props.selectedTool === shapeName
			});
		};
		return (
			<ul className="tool-list">
				{
					Object.keys(this.props.shapes).map((key)=>{
						let shape = this.props.shapes[key];
						return <li 
							key = {key}
							className = {getCSSClass(key)}
							data-tip = {shape.description}
							onClick = {()=>{this.props.handleToolChange(key)}}
						/ >;
					})
				}
			</ul>
		)
	}
}

ShapePalette.propTypes = {
	selectedShape : React.PropTypes.string.isRequired,
	shapes : React.PropTypes.object.isRequired,
	handleToolChange : React.PropTypes.func
};
