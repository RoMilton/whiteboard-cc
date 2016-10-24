import React, {PropTypes} from 'react';
import classNames from 'classnames';
import DisplayCanvas from './DisplayCanvas.jsx';

/**
 * Board Navigation. Since Whiteboard app uses multiple boards, this component allows users
 * to toggle between them. This is done by clicking on a thumbnail image. User can add new board
 * until the maximum number is reached.
 *
 * @class Nav
 * @extends React.Component
 */
export default class NavBoards extends React.Component {

	/**
	 * The maximum number of boards in a gallery
	 *
	 * @property MAX_BOARD_COUNT
	 * @static
	 */
	static get MAX_BOARD_COUNT(){
		return 6;
	}

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
										board={board}
									/>
								</li>
							);
						})
					}
					{
						(this.props.boards.length < NavBoards.MAX_BOARD_COUNT) &&
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
	iSelectedBoard : PropTypes.number.isRequired,
	boards : PropTypes.array.isRequired,
	handleItemClick : PropTypes.func,
	handleNewClick : PropTypes.func
}