import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';

export default class TextControl extends React.Component{

	render(){
		let textLim = 16
		let text = this.props.buttonText.length > textLim ? 
			(this.props.buttonText.substr(0,textLim) + '...') :
			this.props.buttonText;
		return (
			<DropDown width={this.props.width} >
				<div className={this.props.buttonClassName}>
					{ text }
					{
						this.props.successMsg &&
						<div className="msg-box msg-box--notif">	
							<span className="msg-box__text msg-box__text--success">{this.props.successMsg}</span>
						</div>
					}
				</div>
				<div className="text-ctrl">
					{ this.props.inputDescription && 
						<span className="label label--link">
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
						{
							this.props.errorMsg &&
							<div className="msg-box">
								<span className="msg-box__text msg-box__text--error">{this.props.errorMsg}</span>
							</div>
						}
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
	handleSubmit : PropTypes.func,
	successMsg :  PropTypes.string,
	errorMsg :  PropTypes.string,
	closeOnSubmit : PropTypes.bool
}

TextControl.defaultProps = {
	buttonClassName : 'item',
	closeOnSubmit : true
}