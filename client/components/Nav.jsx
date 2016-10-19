import React, {PropTypes} from 'react';
import classNames from 'classnames';
import DisplayBoard from './DisplayBoard.jsx';

/**
 * Board Navigation. Since Whiteboard app uses multiple boards, this component allows users
 * to toggle between them. This is done by clicking on a thumbnail image. User can add new board
 * until the maximum number is reached.
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
									onClick={()=>this.props.onItemChange(index)}
								>
									<DisplayBoard 
										shapes={board.shapes}
									/>
								</li>
							);
						})
					}
				</ol>
				{
					(this.props.boards.length < this.props.maxBoardCount) &&
					<div 
						className="nav__item nav__item--add"
						onClick={()=>{this.props.onItemAdd()}}
					/>
				}
			</nav>
		)
	}
}

NavBoards.propTypes = {
	iSelectedBoard : PropTypes.number.isRequired,
	boards : PropTypes.array.isRequired,
	onItemChange : PropTypes.func.isRequired,
	onItemAdd : PropTypes.func.isRequired,
	maxBoardCount : PropTypes.number.isRequired 
}