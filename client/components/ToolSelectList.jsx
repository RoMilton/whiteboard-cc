import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';

/**
 *
 * @class Dropdown
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
				<div
					onClick={this.props.handleClick}
					className='button--select__text button--select__text--clear'
				> <span>
					{this.props.text}
					</span>
				</div>
				<div className="button--select__arrow">
					<DropDown 
						showArrow = {false}
						width={170} 
						closeButton={false}
					>
						<div className="button--select__toggle" />
						<ul className="options-list">
							{this.props.optionNames.map((optionName,i)=>{
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
	text : PropTypes.string,
	description : PropTypes.string,
	handleClick : PropTypes.func,
	style : PropTypes.object,
	optionNames : PropTypes.arrayOf(PropTypes.string),
	optionClicks : PropTypes.arrayOf(PropTypes.func)
}