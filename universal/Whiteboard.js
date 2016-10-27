import Utils from './Utils.js';

/**
* A whiteboard is collection of one or more shapes. This class contains methods
* to add a new shape, remove a shape or remove all shapes.
*
* @class WhiteBoard
*/ 
export default class Whiteboard{

	constructor(shapes){
		this.shapes = shapes || [];
		this.redrawAll = true;
		this.id = Utils.guid();
		this.setLastUpdated();
	}
	

	/**
	* Adds a new shape to the whiteboard
	*
	* @memberOf Whiteboard
	* @method addShape
	* @param {Object} JS object representing a shape
	*/
	addShape(shapeModel){
		// if shape does not have id, return
		if (!shapeModel.id){return;}
		this.shapes.push(shapeModel);
		this.setLastUpdated();
	}


	/**
	* Removes a shape with a given id from the whiteboard
	*
	* @memberOf Whiteboard
	* @method addShape
	* @param {String} ShapeId - ID of shape to remove
	*/
	removeShape(shapeId){
		// get index of shape with given id
		let index = this.shapes.findIndex(item => item.id === shapeId);
		// if shape exists
		if (index > -1){
			// remove from array
			this.shapes.splice(index, 1);
			this.setLastUpdated();
		}
	}


	/**
	* Removes all shapes from whiteboard
	*
	* @memberOf Whiteboard
	* @method addShape
	*/
	clear(){
		this.shapes = [];
		this.setLastUpdated();
	}


	/**
	* Sets the lastUpdated property of the whiteboard to the current date and time
	*
	* @memberOf Whiteboard
	* @method setLastUpdated
	*/
	setLastUpdated(){
		this.lastUpdated = Date.now();
	}

}