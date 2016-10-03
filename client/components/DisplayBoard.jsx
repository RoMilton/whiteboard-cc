import React from 'react';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayBoard extends React.Component {

	componentDidMount(){
		
	}

	componentDidUpdate(prevProps,prevState){
	}

	render(){
		return (
			<ul className="main-board__list">
				{
					this.props.boards.map((board,index)=>{
						return <li 
							key={index}
							style = { {display : ((index === this.props.iSelectedBoard) ? 'block' : 'none')} }
							>
								<img 
									src= {board}
									className = 'main-board__image'
								/>
						</li>
					})
				}
				
			</ul>
		)
	}
}

DisplayBoard.propTypes = {
	iSelectedBoard : React.PropTypes.number.isRequired,
	boards : React.PropTypes.array.isRequired
}