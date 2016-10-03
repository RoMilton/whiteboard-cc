import React from 'react';

/**
 *
 * @class Canvas
 * @extends React.Component
 */
export default class DisplayCanvas extends React.Component {

	componentDidMount(){
		
	}

	componentDidUpdate(prevProps,prevState){
	}

	render(){
		return (
			<img
				src= {this.props.imageDataURL}
			/>
		)
	}
}