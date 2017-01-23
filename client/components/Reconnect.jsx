import React, {PropTypes} from 'react';

/**
* Informs the user they've been disconnected and allows them to reconnect by clicking a button
*
* @class Reconnect
* @extends React.Component
*/

const Reconnect = ( props ) => (
	<div className="content">
		<h2>We've lost you!</h2>
		<p>This usually means you've were disconnected from the internet.</p>
		<a 
			href={window.location.href}
			onClick={()=>{window.location.href=window.location.href}}
			className='button button--full'
		>
			Join Again
		</a>
	</div>
);

export default Reconnect;