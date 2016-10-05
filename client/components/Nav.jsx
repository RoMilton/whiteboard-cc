import React from 'react';
import classNames from 'classnames';

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
						this.props.boards.map(
							(board,index) => { 
								return <li 
									key={index}
									className={getCSSClass(index)}
									onClick={()=>{this.props.onItemChange(index)}} 
								>
									<img className="nav__image" src={board} />
								</li>
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
	iSelectedBoard : React.PropTypes.number.isRequired,
	boards : React.PropTypes.array.isRequired,
	onItemChange : React.PropTypes.func.isRequired,
	onItemAdd : React.PropTypes.func.isRequired,
	maxBoardCount : React.PropTypes.number.isRequired 
}