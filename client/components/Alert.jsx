import React, {PropTypes} from 'react';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class Alert extends React.Component {

	componentDidMount(){
		this._startTimer();
	}

	componentDidUpdate(){
		this._startTimer();
	}

	_startTimer(){
		if (this.props.visible){
			if (this.timer){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(()=>{
				this.props.handleAlertFinish();
			},this.props.duration);
		}
	}

	render(){
		return this.props.visible ? (
			<div 
				className = 'alert'
				style={{ display : this.props.visible ? 'block' : 'none' }}
			>
				{ this.props.text }
			</div>
		) : null;
	}
}


Alert.PropTypes = {
	handleFinish : PropTypes.func.isRequired,
	visible : PropTypes.bool,
	text : PropTypes.string,
	duration : PropTypes.number
};

Alert.defaultProps = {
	duration : 2000,
	visible : false
};