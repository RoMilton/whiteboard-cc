import React, {PropTypes} from 'react';
import classNames from 'classnames';
import MousePointerBase from './MousePointerBase.jsx';

/**
 * Fetches a remote user's mouse cursor position via a stream, and renders a 
 * floating label at this position. When the position updates, the label will
 * move to the new position.
 *
 * The label's background and content are provided via props.
 *
 * @class OwnMousePointer
 * @extends React.Component
 */
export default class RemoteMousePointer extends MousePointerBase {

	constructor(props){
		super(props);

		// initial state
		this.state.pos = [] // position of pointer,

		this.receivedCount = 0; // number of times new co-ords have been received
		this.updatedCount = 0 // number of times component has updated
	}


	// after component mounts
	componentDidMount(){
		if (this.props.sessionId){
			// update stream
			this._listenToStream(this.props.sessionId);
		}
	}


	// before component updates
	componentWillUpdate(nextProps,nextState){
		// if session id has changed
		if (nextProps.sessionId !== this.props.sessionId){
			// update stream
			this._listenToStream(nextProps.sessionId);
		}
	}

	// whether component should update
	shouldComponentUpdate(nextProps,nextState){
		// An influx of received co-ordinates happens when a remote user's connection
		// goes back to normal after experiencing some temporary lag or disconnection.
		// To deal with this, we skip re-render until the last 4 received co-ordinates,
		// allowing this component to catch up with the remote user.
		return (this.receivedCount > this.updatedCount - 5);
	}


	/**
	* Sets up event handler, to listen to remote user's update of mouse position co-ordinates
	* When the event is heard, a function is executed that updates state with the new position
	* co-ordinates
	*
	* @method _listenToStream
	* @param {String} sessionId - remote user's session Id to listen to
	*/
	_listenToStream(sessionId){
		if (!sessionId) {return;}
		Streamy.on('pointer-pos-'+sessionId, (pos)=>{
			if (pos){
				this.receivedCount++;
				this.setState({
					// update position after multiplying by scale
					pos : [
						pos.x * this.props.scale, 
						pos.y * this.props.scale
					],
				});
				this.updatedCount ++ // increment update count
			}
		});
	}

	render(){
		if (!this.state.pos.length){ return null; }
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
	name : PropTypes.string, // content to display inside label
	bgColor : PropTypes.string, // background color of component (used by base class)
	sessionId : PropTypes.string, // remote user's session id
	scale : PropTypes.number // scale to be applied to x and y co-ordinates
}

RemoteMousePointer.defaultProps = {
	scale : 1
}