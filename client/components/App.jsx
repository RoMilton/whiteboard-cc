import React from 'react';
import Toolbar from './Toolbar.jsx';
import Board from './Board.jsx';

/**
 * Whiteboard App
 *
 * @class App
 * @extends React.Component
 */
export default class App extends React.Component {
	render(){
		return (
			<div id="container">
				<Toolbar 
					
				/>
				<main className="main">
					<Board />
				</main>
			</div>
		)
	}
}