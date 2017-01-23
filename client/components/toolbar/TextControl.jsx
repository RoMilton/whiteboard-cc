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
 * @class TextControl
 * @extends React.Component
 */

const TextControl = ( props ) => {
	// strip button text if it's too long
	let text = props.buttonText.length > props.buttonTextLimit ? 
		(props.buttonText.substr(0,props.buttonTextLimit) + '...') :
		props.buttonText;

	return (
		<DropDown width={props.width} >
			<div 
				data-tip={text}
				data-class="no-1250"
				className={props.buttonClassName}>
				<span>
					{ text }
				</span>
				{
					props.successMsg &&
					<div className="msg-box msg-box--notif">	
						<span className="msg-box__text msg-box__text--success">{props.successMsg}</span>
					</div>
				}
			</div>
			<div className="text-ctrl">
				{ props.inputDescription && 
					<span className="label label--link">
						{ props.inputDescriptionLink ?
							<a href={props.inputDescriptionLink} target="_blank">
								{props.inputDescription}	
							</a>
						 : props.inputDescription
						}
					</span>
				}
				<TextField 
					defaultValue = {props.defaultValue}
					handleSubmit = {props.handleSubmit}
					submitText = {props.submitText}
					readOnly = {props.readOnly}
				/>
					{
						props.errorMsg &&
						<div className="msg-box">
							<span className="msg-box__text msg-box__text--error">{props.errorMsg}</span>
						</div>
					}
			</div>
		</DropDown>
	);
}

export default TextControl;

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