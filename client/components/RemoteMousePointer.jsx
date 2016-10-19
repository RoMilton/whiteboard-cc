import React, {PropTypes} from 'react';
import classNames from 'classnames';
import MousePointer from './MousePointer.jsx';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class RemoteMousePointer extends MousePointer {

	constructor(props){
		super(props);
		this.state = {
			pos : [],
			updatedCount : 0
		}
		this.receivedCount = 0;
	}

	componentDidMount(){
		if (this.props.listenToSessionId){
			this._listenToStream(this.props.listenToSessionId);
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		return (this.receivedCount > nextState.updatedCount - 5);
	}

	componentWillUpdate(nextProps,nextState){
		if (nextProps.listenToSessionId !== this.props.listenToSessionId){
			this._listenToStream(nextProps.listenToSessionId);
		}
	}

	_listenToStream(listenToSessionId){
		if (!listenToSessionId) {return;}
		Streamy.on('pointer-pos-'+listenToSessionId, (pos)=>{
			this.receivedCount++;
			if (pos){
				this.setState({
					pos : [pos.x, pos.y],
					updatedCount : this.state.updatedCount++ 
				});
			}
		});
	}

	render(){
		return (
			<div
				ref = "pointer"
				key = { this.props.id }
				className="cursors__pointer"
				style={ this._getPointerStyles(this.state.pos) }
			>
				{this.props.name}
			</div>
		)
	}

}

RemoteMousePointer.propTypes = {
	name : PropTypes.string,
	bgColor : PropTypes.string,
	listenToSessionId : PropTypes.string
}