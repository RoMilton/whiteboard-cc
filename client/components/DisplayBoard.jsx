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
			<div className="image-collection">
				{this.props.images.map((image,index)=>{
						if (image){
							return <img 
								className="image-collection__image"
								key={index}
								src={image}
							/>;
						}
					})
				}
			</div>
		)
	}
}

DisplayBoard.propTypes = {
	images : React.PropTypes.array.isRequired
}