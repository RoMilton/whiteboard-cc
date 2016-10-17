import React, {PropTypes} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class TextField extends React.Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			text : props.defaultValue
		}

		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	componentDidMount(){
		this.refs.input.select();
	}

	handleTextChange(e){
		this.setState({text : e.target.value});
	}

	handleKeyUp(e){
		if (e.which == 13 || e.keyCode == 13) {
			this.props.handleSubmit(e.target.value);
		}
	}

	getVal(){
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
					onChange={this.handleTextChange}
					onKeyUp={this.handleKeyUp}
					className="text__input" 
					readOnly={this.props.readOnly}
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
	handleSubmit : 	()=>{},
	submitText : 'Save',
	readOnly : false,
	copyToClipBoard : true
}