import React from 'react';

export default class TextField extends React.Component{
	
	render(){
		return (
			<div className="text">
				<input type="text" className="text__input" />
			</div>
		);
	}
}