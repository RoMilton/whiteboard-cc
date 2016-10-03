import React from 'react';
import Toolbar from './Toolbar.jsx';
import DrawingCanvas from './DrawingCanvas.jsx';
import DisplayBoard from './DisplayBoard.jsx';
import Nav from './Nav.jsx';
import Utils from '../utils/Utils.js';

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

const MAX_BOARD_COUNT = 6;

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
			boards : ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='],
			iSelectedBoard : 0,
			history : []
		};
	}

	componentDidMount(){
		// let canvas = this.refs.displayBoard;
		// let styles = window.getComputedStyle(canvas);
		// canvas.setAttribute('width',parseInt(styles.width));
		// canvas.setAttribute('height',parseInt(styles.height));
	}

	
	get maxBoardCount() {
		return MAX_BOARD_COUNT;
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
	_changeTool(toolName){
		this.setState({
			selectedTool : toolName
		});
	}

	_getNewBoard(){
		return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	_addBoard(){
		let boards = this.state.boards.slice();
		boards.push(this._getNewBoard());
		this.setState({
			boards : boards,
			iSelectedBoard : boards.length - 1
		});
	}

	_changeBoard(iSelectedBoard){
		this.setState({
			iSelectedBoard : iSelectedBoard
		});
	}

	_undoLast(){
		if (!this.state.history.length){return;}
		let boards = this.state.boards.slice();
		let historyItem = this.state.history[this.state.history.length-1];
		boards[historyItem.iBoard] = historyItem.imageDataURL;
		this.setState({
			boards : boards
		});
		this.state.history.pop();
	}

	componentWillUpdate(prevProps,prevState){

	}

	componentDidUpdate(prevProps,prevState){
		// let iSelectedBoard = this.state.iSelectedBoard;
		// if (this.state.boards[iSelectedBoard] !== prevState.iSelectedBoard){
		// 	let canvas = this.refs.displayBoard;
		// 	let ctx = canvas.getContext('2d');
		// 	ctx.putImageData(this.state.boards[iSelectedBoard],0,0);
		// }
	}

	_insertShape(imageDataURL){
		return new Promise((resolve,reject)=>{
			let boards = this.state.boards.slice();
			let iSelectedBoard = this.state.iSelectedBoard;
			let newHistoryItem = {
				iBoard : iSelectedBoard,
				imageDataURL : boards[iSelectedBoard]
			}
			this.state.history.push(newHistoryItem);

			let updateState = (newImageDataUrl)=>{
				Utils.preloadImage(newImageDataUrl).then(()=>{
					boards[iSelectedBoard] = newImageDataUrl;
					this.setState({
						boards: boards
					});
					setTimeout(resolve,10);
				});
			}

			if (boards[iSelectedBoard]){
				Utils.mergeImages(imageDataURL,boards[iSelectedBoard]).then(updateState,reject);
			}else{
				updateState(imageDataURL)
			}
		});
	}

	render(){
		return (
			<div id="container">
				<Toolbar
					tools = {TOOLS}
					selectedTool = {this.state.selectedTool}
					selectedColor = {this.state.selectedColor}
					handleToolChange = {this._changeTool.bind(this)}
					handleUndoClick = {this._undoLast.bind(this)}
				/>
				<main className="main">
					<div className="wrap">
						<div className="main-board">
							<DisplayBoard
								boards = {this.state.boards}
								iSelectedBoard = {this.state.iSelectedBoard}
							/>
							<DrawingCanvas 
								color = {this.state.selectedColor}
								tool = {this.state.selectedTool}
								onShapeFinish = {this._insertShape.bind(this)}
							/>
						</div>
						<Nav
							boards = {this.state.boards}
							iSelectedBoard = {this.state.iSelectedBoard}
							onItemChange = {this._changeBoard.bind(this)}
							onItemAdd = {this._addBoard.bind(this)}
							maxBoardCount = {this.maxBoardCount}
						/>
					</div>
				</main>
			</div>
		)
	}
}
