import Utils from './Utils.js';

export default class Whiteboard{

	constructor(shapes){
		this.shapes = shapes || [];
		this.redrawAll = true;
		this.id = Utils.guid();
		this.setLastUpdated();
	}
	
	addShape(shapeModel){
		this.shapes.push(shapeModel);
		this.setLastUpdated();
	}

	removeShape(shapeId){
		// let index = this.shapes.map(function(x) {return x.id; }).indexOf(shapeId);
		let index = this.shapes.findIndex(item => item.id === shapeId);
		if (index > -1){
			this.shapes.splice(index, 1);
			this.setLastUpdated();
		}
	}

	clear(){
		this.shapes = [];
		this.setLastUpdated();
	}

	setLastUpdated(){
		this.lastUpdated = Date.now();
	}

	lastShape(){
		return this.shapes[this.shapes.length - 1] || null;
	}

}