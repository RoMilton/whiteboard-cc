import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RemoteMousePointer from './RemoteMousePointer.jsx';
import OwnMousePointer from './OwnMousePointer.jsx';

/**
 * Tracks the user's own mouse pointer, and streams its co-ordinates to other users
 * This component does not have any UI of its own, instead its children components
 * are responsible for displaying UI to show where every user's mouse pointer is.
 *
 * @class CursorsWrapper
 * @extends React.Component
 */
export default class CursorsWrapper extends React.Component {

	constructor(props){
		super(props);
		
		// initial state
		this.state = {
			ownPointerPos : [] // stores x and y co-ordinates respectively
		};

		// extract session IDs 
		this._cacheSessionIds(this.props.activeUsers);

		//bind mouse move callback so 'this' can be used inside it
		this._handleMouseMove = this._handleMouseMove.bind(this);

		this.moveCount = 0;


		this.prevMouseX=-1; 
		this.prevMouseY=-1;
		this.prevMouseTime;
	}


	// after component mounts
	componentDidMount(){
		document.addEventListener('mousemove',this._handleMouseMove);
	}


	// before component unmounts
	componentWillUnmount(){
		document.removeEventListener('mousemove',this._handleMouseMove);
	}


	// when props are received
	componentWillReceiveProps(nextProps,nextState){
		this._cacheSessionIds(nextProps.activeUsers);
	}


	/**
	* Inspects given activeUsers and creates a new array just with its session Ids.
	* Calling this method only when props are updated prevents the mapping from being done every
	* time the mouse moves.
	*
	* @memberOf CursorsWrapper
	* @method _cacheSessionIds
	* @param {Array[Object]} Array of Objects, each one representing an active Users with an assigned sessionId property
	*/
	_cacheSessionIds(activeUsers){
		this.allSessionIds = activeUsers.map((user)=>{
			return user.sessionId;
		});
	}


	/**
	* Method to be called when user's mouse moves. The mouse pointer co-ordinates will
	* be calculated in relation to the container div. For example, if the pointer
	* is outside the container div by 50 pixels to the left and 20px to the top, the 
	* co-ordinates will be -50 and 20 for the x and y respectively. 
	*
	* If a scale is provided, then it will be multiplied to both the x and y co-ordinates
	* before sending them to remote users.
	* 
	* The session Ids of users that are sent to are provided the prop activeUsers. 
	*
	* @method _handleMouseMove
	* @param {Event} Mouse move event
	*/
	_handleMouseMove(e){
		// if this is a touchscreen swipe, ignore
		if (e.changedTouches){ return; }
		this.moveCount++;
		let wrapper = this.refs.wrapper,
			rect = wrapper.getBoundingClientRect();

		// get mouse position in relation to container div
		let xPos = e.clientX - rect.left;
		let yPos = e.clientY - rect.top;

		// calculate distance that mouse has moved
		let mousetravel = Math.max( Math.abs(xPos-this.prevMouseX), Math.abs(yPos-this.prevMouseY) );
		let timeNow = new Date().getTime();
		if (this.prevMouseTime && this.prevMouseTime!=timeNow) {
			// get mouse speed 
			var pps = Math.round(mousetravel / (timeNow - this.prevMouseTime) * 1000); // pixels per second by dividing the distance by time
		}
		this.prevMouseTime = timeNow; 

		// if mouse speed is less than 1500 pixels per second
		if (pps < 1500) {
			// stream mouse position to remote users after applying scale
			Streamy.sessions(this.allSessionIds).emit(
				'pointer-pos-'+this.props.sessionId, 
				{ 
					x : xPos / this.props.scale,
					y : yPos / this.props.scale
				}
			);
		}

		this.setState({
			ownPointerPos : [xPos,yPos]
		});

		this.prevMouseX = xPos;
		this.prevMouseY = yPos;
	}


	render(){
		return (
			<div 
				ref = 'wrapper'
				className="cursors"
			>
				{ 
					this.props.activeUsers.map((user)=>{
						if (user.sessionId !== this.props.sessionId) {
							return <RemoteMousePointer
									key={user.sessionId}
									sessionId= {user.sessionId}
									name={user.nickname}
									bgColor={user.color}
									scale={this.props.scale}
							/>
						}else if (this.state.ownPointerPos.length){
							return <OwnMousePointer 
								key={user.sessionId}
								bgColor={user.color}
								pos={this.state.ownPointerPos}
								name={user.nickname}
							/>
						}else{
							return false;
						}
							
					})
				}
			</div>
		)
	}

}

CursorsWrapper.propTypes = {
	sessionId : PropTypes.string.isRequired, // local session id
	activeUsers : PropTypes.array, // array containing objects representing remote users. Each object must have sessionId property
	scale : PropTypes.number // scale that will be multiplied to x and y co-ordinates
}

CursorsWrapper.defaultProps = {
	activeUsers : [],
	scale : 1,
}