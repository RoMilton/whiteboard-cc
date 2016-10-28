import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';

/**
* Displays the current number of active users. When the user clicks this number, 
* a dropdown apperas that displays an unordered list with each user's name and 
* assigned color.
*
* @class ActiveUsers
* @extends React.Component
*/
export default class ActiveUsers extends React.Component{

	render(){
		let personOrPeople = this.props.activeUsers.length == 1 ? 'person' : 'people';
		let labelText = this.props.activeUsers.length + ' ' + personOrPeople + ' currently viewing';
		return (
			<DropDown 
					anchor="right"
					width= {250}
					closeButton={true}
				>
				<div 
					data-class="no-1250"
					data-tip={ this.props.activeUsers.length + ' ' + personOrPeople }
					className="tool-link tool-link--users"
				>
					<div className="tool-link--users__count">
						{this.props.activeUsers.length}
					</div>
					<span>
						{personOrPeople}
					</span>
				</div>
					<div className="active-users">
						<span className="label label--link">{labelText}</span>
						<ul className='color-list'>
							{ this.props.activeUsers.map((user)=>{
								let isActive = (user.nickname == this.props.nickname);
								return <li
									className = {isActive && 'is-active'}
									key={user.sessionId}
								>
									<span 
										className='color-list__col'
										style={{ backgroundColor: user.color }} 
									/>
									{user.nickname + (isActive ? ' (You)' : '')}
								</li>
							})}
						</ul>
					</div>
			</DropDown>
		);
	}
}

ActiveUsers.propTypes = {
	activeUsers : PropTypes.arrayOf(PropTypes.object), // array containing objects representing remote users. Each object must have sessionId property
	nickname : PropTypes.string.isRequired // nickname of local user
}