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
		this.handleMouseMove = this.handleMouseMove.bind(this);

		this.state = {
			ownPointerPos : []
		};
	}

	handleMouseMove(e){
		let wrapper = this.refs.wrapper;
		let rect = wrapper.getBoundingClientRect();
		
		let allSessions = this.props.activeUsers.map((user)=>{
			return user.sessionId;
		});

		let xPos = e.clientX - rect.left;
		let yPos = e.clientY - rect.top;

		// console.log('xPos',xPos);
		// console.log('yPos',yPos);

		Streamy.sessions(allSessions).emit(
			'pointer-pos-'+this.props.sessionId, 
			{ 
				x : xPos,
				y : yPos
			}
		);

		this.setState({
			ownPointerPos : [xPos,yPos]
		})
	}

	componentDidMount(){
		document.addEventListener('mousemove',this.handleMouseMove);
	}

	componentWillUnmount(){
		document.removeEventListener('mousemove',this.handleMouseMove);
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
									name={user.name}
									color={user.color}
							/>
						}else if (this.state.ownPointerPos.length){
							return <OwnMousePointer 
								key={user.sessionId}
								color={user.color}
								pos={this.state.ownPointerPos}
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
	activeUsers : PropTypes.array
}