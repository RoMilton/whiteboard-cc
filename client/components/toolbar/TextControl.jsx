import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';
import TextField from './TextField.jsx';

/**
 * Renders a Button that when clicked, displays a dropdown underneath it.
 *
 * The dropdown contains an arbitrary text description and a TextField that 
 * can be submitted.
 *
 * Also displays success/error notifications provided in the props.
 *
 * @class ShareControls
 * @extends React.Component
 */
export default class TextControl extends React.Component{

	render(){ 
		// strip button text if it's too long
		let text = this.props.buttonText.length > this.props.buttonTextLimit ? 
			(this.props.buttonText.substr(0,this.props.buttonTextLimit) + '...') :
			this.props.buttonText;

		return (
			<DropDown width={this.props.width} >
				<div 
					data-tip={text}
					data-class="no-1250"
					className={this.props.buttonClassName}>
					<span>
						{ text }
					</span>
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
	buttonClassName : PropTypes.string, // css class name added to button
	buttonTextLimit : PropTypes.number, // Limit to the amount of characters in the button. Any characters past this will be removed
	submitText : PropTypes.string, // text displayed in Textfield's submit button
	inputDescription : PropTypes.string, // Description to appear in dropdown
	inputDesciptionLink : PropTypes.string, // Hyperlink that user is sent to to when clicking on description
	defaultValue : PropTypes.string, // default value of TextField
	width : PropTypes.number, // width of dropdown
	handleSubmit : PropTypes.func, // fired when user submits TextField
	successMsg :  PropTypes.string, // Success message. If provided, a success notification will display with this text
	errorMsg :  PropTypes.string // Error message. If provided, an error notification will display with this text
}

TextControl.defaultProps = {
	buttonClassName : 'item',
	submitText : 'Save',
	buttonTextLimit : 16
}