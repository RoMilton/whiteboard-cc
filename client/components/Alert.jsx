import React, {PropTypes} from 'react';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Alert extends React.Component {
	
	close(){
		if (this.timer){
			clearInterval(this.timer);
		}
		this.timer = setTimeout(()=>{
			this.props.handleAlertFinish();
		},this.props.duration);
	}

	componentDidMount(){
		this.close();
	}

	componentDidUpdate(){
		this.close();
	}

	render(){
		return (
			<div 
				className = 'alert'
				style={{ display : this.props.visible ? 'block' : 'none' }}
			>
				{
					this.props.visible && this.props.text
				}
			</div>
		)
	}
}


Alert.PropTypes = {
	handleAlertFinish : PropTypes.func.isRequired,
	visible : PropTypes.bool,
	text : PropTypes.string,
	duration : PropTypes.number
};

Alert.defaultProps = {
	duration : 2000,
	visible : false
};