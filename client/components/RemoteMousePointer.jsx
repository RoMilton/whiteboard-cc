import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class RemoteMousePointer extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			pos : [],
			updatedCount : 0
		}
		this.receivedCount = 0;
	}

	listenToStream(listenToSessionId){
		if (!listenToSessionId) {return;}
		Streamy.on('pointer-pos-'+listenToSessionId, (pos)=>{
			console.log('received pos');
			this.receivedCount++;
			if (pos){
				this.setState({
					pos : [pos.x, pos.y],
					updatedCount : this.state.updatedCount++ 
				});
			}
		});
	}

	shouldComponentUpdate(nextProps,nextState){
		return (this.receivedCount > nextState.updatedCount - 5);
	}

	componentDidMount(){
		if (this.props.listenToSessionId){
			this.listenToStream(this.props.listenToSessionId);
		}
	}

	componentWillUpdate(nextProps,nextState){
		if (nextProps.listenToSessionId !== this.props.listenToSessionId){
			this.listenToStream(nextProps.listenToSessionId);
		}
	}

	render(){
		let getPointerStyles = ()=>{
			let styles = {
				backgroundColor : this.props.color
			}
			if ( this.state.pos.length){
				styles.left = this.state.pos[0] + 'px';
				styles.top = this.state.pos[1] + 'px';
			}

			return styles;
		};

		return (
			<div
				ref = "pointer"
				key = { this.props.id }
				className="cursors__pointer"
				style={ getPointerStyles() }
			>
				{this.props.name}
			</div>
		)
	}

}

RemoteMousePointer.propTypes = {
	name : PropTypes.string,
	color : PropTypes.string,
	listenToSessionId : PropTypes.string
}