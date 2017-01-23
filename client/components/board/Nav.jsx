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


const Nav = ( props ) => {
	let getCSSClass = (iBoard) => {
		return classNames({
			'nav__item' : true,
			'is-active' : props.iSelectedBoard === iBoard
		});
	};
	return (
		<nav className="nav">
			<ol className="nav__list">
				{
					props.boards.map((board,index) => {
						return (
							<li 
								key={index}
								className={getCSSClass(index)}
								onTouchStart={()=>{ props.handleItemClick(index);}}
								onClick={()=>{ props.handleItemClick(index);}}
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
					(props.boards.length < Gallery.maxBoards) &&
					<div 
						className="nav__item nav__item--add"
						onClick={ props.handleNewClick }
						onTouchStart = { props.handleNewClick }
					/>
				}
			</ol>
		</nav>
	)
}

export default Nav;

Nav.propTypes = {
	boards : PropTypes.array.isRequired,	// array of whiteboard instances
	iSelectedBoard : PropTypes.number.isRequired, // index of currently selected whiteboard
	handleItemClick : PropTypes.func,		// fired when local user clicks on existing board in navigation
	handleNewClick : PropTypes.func			// fired when local user clicks on 'add new board' button in navigation
}