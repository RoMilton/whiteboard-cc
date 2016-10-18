import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';

export default class TextControl extends React.Component{

	render(){
		return (
			<DropDown width={this.props.width}>
				<div className={this.props.buttonClassName}>
					{this.props.buttonText.substr(0,16)}
				</div>
				<div>
					{ this.props.inputDescription && 
						<span className="label">
								{ this.props.inputDescriptionLink ?
									<a href={this.props.inputDescriptionLink} target="_blank">
										{this.props.inputDescription}	
									</a>
								 : this.props.inputDescription
								}
						</span>
					}
					<TextField 
						defaultValue = {this.props.defaultValue}
						handleSubmit = {this.props.handleSubmit}
						submitText = {this.props.submitText}
						readOnly = {this.props.readOnly}
					/>
				</div>
			</DropDown>
		);
	}

}

TextControl.propTypes = {
	buttonClassName : PropTypes.string,
	submitText : PropTypes.string,
	inputDescription : PropTypes.string,
	inputDesciptionLink : PropTypes.string,
	defaultValue : PropTypes.string,
	width : PropTypes.number,
	handleSubmit : PropTypes.func
}

TextControl.defaultProps = {
	buttonClassName : 'item'
}