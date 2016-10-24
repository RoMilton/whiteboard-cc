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
	}

	componentDidMount(){
		if (this.props.visible){
			this._startTimer();
		}
	}

	componentDidUpdate(){
		if (this.props.visible){
			this._startTimer();
		}
	}

	_startTimer(){
		if (!this.props.visible){return;}
		if (this.props.handleFinish){
			if (this.timer){ clearTimeout(this.timer); }
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
	handleFinish : PropTypes.func.isRequired,
	visible : PropTypes.bool,
	text : PropTypes.string,
	duration : PropTypes.number
};

Alert.defaultProps = {
	duration : 2000,
	visible : false
};