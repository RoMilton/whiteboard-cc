import React, {PropTypes} from 'react';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Alert extends React.Component {
	
	constructor(props){
		super(props);
		this.state = { visible : false };
	}

	componentWillReceiveProps(nextProps){
		this.setState({ visible : true });
	}

	componentDidUpdate(){
		setTimeout(()=>{
			this.setState({'visible':false});
		},this.props.duration);
	}

	render(){
		let getStyles = ()=>{
			return {
				display : visible ? 'block' : 'none'
			};
		};
		return (
			<div 
				style={getStyles()}
				ref="container"
				className="alert"
			>
				{this.props.text}
			</div>
		)
	}
}


Alert.PropTypes = {
	text : PropTypes.string,
	duration : PropTypes.number
};

Alert.defaultProps = {
	duration : 5000
};