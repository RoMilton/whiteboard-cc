import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RemoteMousePointer from './RemoteMousePointer.jsx';
import OwnMousePointer from './OwnMousePointer.jsx';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class CursorsWrapper extends React.Component {

	constructor(props){
		super(props);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this.state = {
			ownPointerPos : []
		};
	}

	_handleMouseMove(e){
		//if this is a touchscreen swipe, ignore
		if (e.changedTouches){return;}

		let wrapper = this.refs.wrapper;
		let rect = wrapper.getBoundingClientRect();
		
		let allSessions = this.props.activeUsers.map((user)=>{
			return user.sessionId;
		});

		let xPos = e.clientX - rect.left;
		let yPos = e.clientY - rect.top;

		Streamy.sessions(allSessions).emit(
			'pointer-pos-'+this.props.sessionId, 
			{ 
				x : xPos / this.props.scale,
				y : yPos / this.props.scale
			}
		);

		this.setState({
			ownPointerPos : [xPos,yPos]
		})
	}

	componentDidMount(){
		document.addEventListener('mousemove',this._handleMouseMove);
	}

	componentWillUnmount(){
		document.removeEventListener('mousemove',this._handleMouseMove);
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
									listenToSessionId= {user.sessionId}
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
	sessionId : PropTypes.string,
	activeUsers : PropTypes.array,
	scale : PropTypes.number
}

CursorsWrapper.defaultProps = {
	scale : 1
}