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
export default class CursorsWrapper extends React.Component {

	componentDidMount(){
		let wrapper = this.refs.wrapper;
		document.addEventListener('mousemove',(e)=>{
			let rect = wrapper.getBoundingClientRect();
			// console.log('wrapp',rect);
			// console.log('rect',rect.top + document.body.scrollTop);
			// console.log('rect',rect.scrollLeft);
			console.log('broadcasting this','pointer-pos-'+this.props.sessionId);

			Streamy.broadcast('pointer-pos-'+this.props.sessionId, { 
				x : e.clientX - rect.left,
				y : e.clientY - rect.top
			});

		});
	}

	render(){
		return (
			<div 
				ref = 'wrapper'
				className="cursors"
			>
				{ 
					this.props.activeUsers.map((user)=>{
						console.log('user',user);
						return <MousePointer
							key={user.sessionId}
							id={user.sessionId}
							name={user.name}
							color={user.color}
							ownPointer = {user.sessionId !== this.props.sessionId}
						/>
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