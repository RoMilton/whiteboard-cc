import React, {PropTypes} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';


/**
 * An text input and submit button that fires a given callback.
 *
 * @class TextField
 * @extends React.Component
 */
export default class TextField extends React.Component{
	
	constructor(props){
		super(props);
		
		// initial state
		this.state = { text : props.defaultValue}

		// bind methods here to speed up re-render
		this._handleTextChange = this._handleTextChange.bind(this);
		this._handleKeyUp = this._handleKeyUp.bind(this);
		this._handleInputClick = this._handleInputClick.bind(this);
	}


	// after component mounts
	componentDidMount(){
		this.refs.input.select();
	}


	/**
	* Called when input contents have changed, updating the state with the new
	* input value.
	*
	* @memberOf TextField
	* @method _handleTextChange
	* @param {Event} e - input onchange event
	*/
	_handleTextChange(e){
		this.setState({text : e.target.value});
	}


	/**
	* Called when key up is performed on input. 
	*
	* Checks to see if enter key is pressed, and if so, submits the TextField.
	*
	* @memberOf TextField
	* @method _handleKeyUp
	* @param {Event} e - input keyup event
	*/
	_handleKeyUp(e){
		if (e.which == 13 || e.keyCode == 13){
			this._handleSubmit();
		}
	}


	/**
	* Called when input is directly clicked on. If the input is readonly, the 
	* input's contents will be highlighted.
	*
	* @memberOf TextField
	* @method _handleKeyUp
	* @param {Event} e - input onchange event
	*/
	_handleInputClick(){
		if (this.props.readOnly){
			this.refs.input.select();
		}
	}


	/**
	* Submits the TextField by calling the handleSubmit callback
	*
	* @memberOf TextField
	* @method _handleSubmit
	*/
	_handleSubmit(){
		if (this.props.handleSubmit){
			this.props.handleSubmit(this.state.text);
		}
	}

	render(){
		return (
			<div className="text">
				<input 
					ref="input"
					autoFocus
					type="text" 
					value={this.state.text}
					onChange={this._handleTextChange}
					onKeyUp={this._handleKeyUp}
					className="text__input" 
					readOnly={this.props.readOnly}
					onClick={this._handleInputClick}
				/>
				<div
					onClick={ this._handleSubmit }
					className="text__submit"
				>
					{ this.props.copyToClipBoard ? 
						<CopyToClipboard text={this.state.text}>
							<span>{ this.props.submitText }</span>
						</CopyToClipboard>
				  	: this.props.submitText }
				</div>
			</div>
		);
	}
}

TextField.propTypes = {
	defaultValue : PropTypes.string, // default value of input
	handleSubmit : PropTypes.func, // fired when user hits enter or clicks submit
	submitText : PropTypes.string, // text to go in submit button
	readOnly : PropTypes.bool, // whether or not input is read only
	copyToClipBoard : PropTypes.bool // if true, the text in the input will be copied to clipboard when user clicks submit button
}

TextField.defaultProps = {
	submitText : 'Save',
	readOnly : false,
	copyToClipBoard : true
}