import React, {PropTypes} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class TextField extends React.Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			text : props.defaultValue
		}

		this._handleTextChange = this._handleTextChange.bind(this);
		this._handleKeyUp = this._handleKeyUp.bind(this);
		this._handleInputClick = this._handleInputClick.bind(this);
	}

	componentDidMount(){
		this.refs.input.select();
	}

	_handleTextChange(e){
		this.setState({text : e.target.value});
	}

	_handleKeyUp(e){
		if ((e.which == 13 || e.keyCode == 13) && this.props.handleSubmit){
			this.props.handleSubmit(e.target.value);
		}
	}

	_handleInputClick(){
		if (this.props.readOnly){
			this.refs.input.select();
		}
	}

	_getVal(){
		return this.refs.input.value;
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
					onClick={()=>{ this.props.handleSubmit(this.state.text);}}
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
	defaultValue : PropTypes.string,
	handleSubmit : PropTypes.func,
	submitText : PropTypes.string,
	readOnly : PropTypes.bool,
	copyToClipBoard : PropTypes.bool
}

TextField.defaultProps = {
	submitText : 'Save',
	readOnly : false,
	copyToClipBoard : true
}