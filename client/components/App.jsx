import React from 'react';
import Toolbar from './Toolbar.jsx';
import Board from './Board.jsx';
import Nav from './Nav.jsx';

const TOOLS = [
	{
		name : 'pen',
		description : 'Pen Tool'
	},
	{
		name : 'line',
		description : 'Line Tool'
	},
	{
		name : 'rect',
		description : 'Rectangle Tool',
		isDefault : true
	},
	{
		name : 'text',
		description : 'Insert Text'
	}
];


/**
 * Whiteboard App Component
 *
 * @class App
 * @extends React.Component
 */
export default class App extends React.Component {

	constructor(){
		super();
		this.state = {
			selectedTool : this.getDefaultTool()
		};
	}


	/**
	 * Gets name of default tool (eg 'pen') that the user should start with.
	 * This is done by by looking which tool has 'is-default' property set to
	 * true in the TOOLS constant.
	 *
	 * @method getDefaultTool
	 */
	getDefaultTool(){
		//for each tool
		for (let key in TOOLS){
			if (TOOLS[key].isDefault) {return TOOLS[key].name;}
		}
	}


	/**
	 * Handles tool change
	 *
	 * @method handleToolChange
	 * @param {String} toolName - String to represent new tool. Must be property in TOOLS
	 */
	handleToolChange(toolName){
		this.setState({
			selectedTool : toolName
		});
	}


	render(){
		return (
			<div id="container">
				<Toolbar
					tools = {TOOLS}
					selectedTool = {this.state.selectedTool}
					handleToolChange = {this.handleToolChange.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<Board />
						<Nav />
					</div>
				</main>
			</div>
		)
	}
}
