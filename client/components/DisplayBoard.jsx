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
					<li>
						<img 
							src= {this.props.boards[this.props.iSelectedBoard]}
							className = 'main-board__image'
						/>
					</li>
				}
			</ul>
		)
	}
}

DisplayBoard.propTypes = {
	iSelectedBoard : React.PropTypes.number.isRequired,
	boards : React.PropTypes.array.isRequired
}