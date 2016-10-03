import React from 'react';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import Nav from './Nav.jsx';

const TOOLS = [
	{
		name : 'pen',
		description : 'Pen Tool',
		isDefault : true,
	},
	{
		name : 'line',
		description : 'Line Tool'
	},
	{
		name : 'rect',
		description : 'Rectangle Tool'
	},
	{
		name : 'text',
		description : 'Insert Text'
	}
];

const COLORS = [
	'#1ABC9C',
	'#ae2be1',
	'#1846ec',
	'#93Cba4'
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
			selectedTool : this._getDefaultTool(),
			selectedColor : COLORS[2],
			boards : [],
			iSelectedBoard : 0
		};
	}


	/**
	 * Gets name of default tool (eg 'pen') that the user should start with.
	 * This is done by by looking which tool has 'is-default' property set to
	 * true in the TOOLS constant.
	 *
	 * @method getDefaultTool
	 */
	_getDefaultTool(){
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
	_handleToolChange(toolName){
		this.setState({
			selectedTool : toolName
		});
	}

	_handleUndo(){
		// this.setState({

		// })
	}

	_insertNewShape(imageDataURL){
		//console.log('imageData',imageDataURL);
		var boards = this.state.boards.slice();
		boards[this.state.iSelectedBoard] = imageDataURL;
		this.setState({
			boards : boards
		});
	}

	// componentDidUpdate(prevProps,prevState){

	// }

	render(){
		return (
			<div id="container">
				<Toolbar
					tools = {TOOLS}
					selectedTool = {this.state.selectedTool}
					selectedColor = {this.state.selectedColor}
					handleToolChange = {this._handleToolChange.bind(this)}
					handleUndoClick = {this._handleUndo.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							<ul className="main-board__list">
								<li>
									<div className="main-board__images">
										<img src={this.state.boards[this.state.iSelectedBoard]}
										/>
									</div>
								</li>
							</ul>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								insertNewShape = {this._insertNewShape.bind(this)}
							/>
						</div>
						<nav>
						</nav>
					</div>
				</main>
			</div>
		)
	}
}
