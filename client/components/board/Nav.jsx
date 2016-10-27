import React, {PropTypes} from 'react';
import classNames from 'classnames';
import DisplayCanvas from './DisplayCanvas.jsx';
import Gallery from '../../../universal/Gallery.js';

/**
 * Board Navigation. Allows users to navigate between multiple multiple boards.
 * 
 * Each navigation item is a thumbnail image. User can add a new board until the
 * max number of boards are reached
 *
 * @class Nav
 * @extends React.Component
 */
export default class NavBoards extends React.Component {

	render(){
		let getCSSClass = (iBoard) => {
			return classNames({
				'nav__item' : true,
				'is-active' : this.props.iSelectedBoard === iBoard
			});
		};
		return (
			<nav className="nav">
				<ol className="nav__list">
					{
						this.props.boards.map((board,index) => {
							return (
								<li 
									key={index}
									className={getCSSClass(index)}
									onTouchStart={()=>{ this.props.handleItemClick(index);}}
									onClick={()=>{ this.props.handleItemClick(index);}}
								>
									<DisplayCanvas
										shapes={board.shapes}
										id={index}
									/>
								</li>
							);
						})
					}
					{
						(this.props.boards.length < Gallery.maxBoards) &&
						<div 
							className="nav__item nav__item--add"
							onClick={ this.props.handleNewClick }
							onTouchStart = { this.props.handleNewClick }
						/>
					}
				</ol>
			</nav>
		)
	}
}

NavBoards.propTypes = {
	boards : PropTypes.array.isRequired,	// array of whiteboard instances
	iSelectedBoard : PropTypes.number.isRequired, // index of currently selected whiteboard
	handleItemClick : PropTypes.func,		// fired when local user clicks on existing board in navigation
	handleNewClick : PropTypes.func			// fired when local user clicks on 'add new board' button in navigation
}