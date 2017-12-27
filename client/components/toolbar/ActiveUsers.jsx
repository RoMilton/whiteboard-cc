import React, {PropTypes} from 'react';
import DropDown from './DropDown.jsx';

/**
* Displays the current number of active users. When the user clicks this number, 
* a dropdown appears that displays an unordered list with each user's name and 
* assigned color.
*
* @class ActiveUsers
* @extends React.Component
*/

const ActiveUsers = ( props ) => {
	let personOrPeople = props.activeUsers.length == 1 ? 'person' : 'people';
	let labelText = props.activeUsers.length + ' ' + personOrPeople + ' currently viewing';
	return (
		<DropDown 
				anchor="right"
				width= {250}
				closeButton={true}
			>
			<div 
				data-class="no-1250"
				data-tip={ props.activeUsers.length + ' ' + personOrPeople }
				className="tool-link tool-link--users"
			>
				<span>
					{ props.activeUsers.length }
				</span>
			</div>
				<div className="active-users">
					<span className="label label--link">{labelText}</span>
					<ul className='color-list'>
						{ props.activeUsers.map((user)=>{
							let isActive = (user.nickname == props.nickname);
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

export default ActiveUsers;

ActiveUsers.propTypes = {
	activeUsers : PropTypes.arrayOf(PropTypes.object), // array containing objects representing remote users. Each object must have sessionId property
	nickname : PropTypes.string.isRequired // nickname of local user
}