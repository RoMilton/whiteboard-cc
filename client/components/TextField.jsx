import React, {PropTypes} from 'react';

export default class TextField extends React.Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			text : 'test'
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
			this.props.handleSubmit(e.target.value)
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
					onChange={this.handleTextChange}
					onKeyUp={this.handleKeyUp}
					className="text__input" 
				/>
			</div>
		);
	}
}

TextField.propTypes = {
	value : PropTypes.string,
	handleSubmit : PropTypes.func
}

TextField.defaultProps = {
	handleSubmit : 	()=>{}
}