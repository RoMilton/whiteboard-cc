import React from 'react';
import classNames from 'classnames';

/**
 * My component, just for me, u no touchy.
 *
 * @class App
 * @extends React.Component
 */
export default ToolPalette = class extends React.Component {
	render(){
		// returns CSS class string
		let getCSSClass = (tool) => {
			return classNames({
				'tool-list__item' : true,
				[`tool-list__item--${tool.name}`]  : true,
				'is-active' : this.props.selectedTool === tool.name
			});
		};
		return (
			<ul className="tool-list">
				{
					this.props.tools.map((tool)=>{
						return <li 
							key = {tool.name}
							className={getCSSClass(tool)}
							onClick = {()=>{this.props.handleToolChange(tool.name)}}
						/ >
					})
				}
			</ul>
		)
	}
}

ToolPalette.propTypes = {
	selectedTool : React.PropTypes.string.isRequired,
	tools : React.PropTypes.array.isRequired,
	handleToolChange : React.PropTypes.func
};
