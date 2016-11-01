import React, {PropTypes} from 'react';

/**
 * Banner Alert that displays across centre of screen.
 *
 * @class Alert
 * @extends React.Component
 */
export default class Alert extends React.Component {

	// after component mounts
	componentDidMount(){
		if (this.props.visible){
			this._startTimer();
		}
	}


	// after component updates
	componentDidUpdate(){
		if (this.props.visible){
			this._startTimer();
		}
	}


	/**
	* Starts a timer, and upon it's completion, calls the handleFinish callback.
	* This method should be called every time the alert is made visible.
	*
	* @memberOf Alert
	* @method _startTimer
	*/
	_startTimer(){
		if (!this.props.visible){return;}
		if (this.props.handleFinish){
			// clear timer if exists
			if (this.timer){ clearTimeout(this.timer); } 
			// create new timer
			this.timer = setTimeout(()=>{
				if (this.props.visible){ this.props.handleFinish(); }
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
	handleFinish : PropTypes.func.isRequired, // callback fired after timer has completed
	visible : PropTypes.bool, // whether alert is visible
	text : PropTypes.string, // text to display inside alert
	duration : PropTypes.number // duration in milliseconds that alert is visible before firing handleFinish callback
};

Alert.defaultProps = {
	duration : 2000,
	visible : false
};