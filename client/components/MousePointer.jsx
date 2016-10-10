import React, {PropTypes} from 'react';
import classNames from 'classnames';

/**
 * Toolbar allows users to perform actions (undo, share, change color) on the
 * main whiteboard.
 *
 * @class Toolbar
 * @extends React.Component
 */
export default class MousePointer extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			pos : []
		}
	}

	moveOtherUserPointer(){

	}

	componentDidMount(){
		// if (this.props.ownCursor){

		// };
		console.log('listening to this','pointer-pos-'+this.props.id);

		Streamy.on('pointer-pos-'+this.props.id, (pos)=>{ 
			console.log('detected mouse move',pos);
			if (pos){
				this.setState({
					pos : [pos.x, pos.y]
				});
			}
		});
	}

	componentDidReceiveProps(){

	}

	componentWillUnmount(){

	}

	render(){
		let getPointerStyles = ()=>{
			return this.state.pos.length ? 
				{
					left : this.state.pos.x, 
					top: this.state.pos.y 
				} : 
				{};
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

MousePointer.propTypes = {
	id : PropTypes.string,
	name : PropTypes.string,
	color : PropTypes.string,
	ownPointer : PropTypes.bool
}