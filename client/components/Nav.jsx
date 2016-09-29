import React from 'react';

/**
 * Board Navigation. Since Whiteboard app uses multiple boards, this component allows users
 * to toggle between them. This is done by clicking on a thumbnail image. User can add new board
 * until the maximum number is reached.
 *
 * @class Nav
 * @extends React.Component
 */
export default class Nav extends React.Component {
	render(){
		return (
			<nav>
				<ol className="nav-list">
					<li className="is-active"><canvas className="nav-list__whiteboard"></canvas></li>
					<li><canvas class="nav-list__whiteboard"></canvas></li>
				</ol>
			</nav>
		)
	}
}
