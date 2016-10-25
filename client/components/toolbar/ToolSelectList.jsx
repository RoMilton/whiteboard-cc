import React, {PropTypes} from 'react';
import ToolButton from './ToolButton.jsx';
import DropDown from './DropDown.jsx';

/**
 * A button, that when clicked that displays a dropdown list of items.
 *
 * @class ToolSelectList
 * @extends React.Component
 */

export default class ToolSelectList extends React.Component {
	render(){
		return(
			<div 
				data-tip={this.props.description}
				className='button button--select'
				style = {this.props.style || null}
			>
				<ToolButton
					className='button--select__text button--select__text--clear'
					handleClick={this.props.handleClick}
					text={this.props.text}
				/>
				<div className="button--select__arrow">
					<DropDown 
						closeOnContentClick = {true}
						showArrow = {false}
						width={170} 
						closeButton={false}
					>
						<div className="button--select__toggle" />
						<ul className="options-list">
							{ this.props.optionNames.map((optionName,i)=>{
								return <li
									key={i}
									onClick={this.props.optionClicks[i] || null}
								>
									{optionName}
								</li>
							})}
						</ul>
					</DropDown>
				</div>
			</div>
		);
	}
}

ToolSelectList.propTypes = {
	text : PropTypes.string, // text to display in button
	description : PropTypes.string, // description. If provided tooltip will display this when hovering button
	handleClick : PropTypes.func, //fires when button (not dropdown item) is clicked
	style : PropTypes.object, // object containing style properties and values, assigned to button
	optionNames : PropTypes.arrayOf(PropTypes.string), // list of items to appear in dropdown list
	optionClicks : PropTypes.arrayOf(PropTypes.func) // list of functions to fire when clicking on respective list items, must correspond with order of items in optionNames
}