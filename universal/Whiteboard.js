import Utils from './Utils.js';

export default class Whiteboard{

	constructor(shapes){
		this.shapes = shapes || [];
		this.id = Utils.guid();
	}
	
	addShape(shapeModel){
		this.shapes.push(shapeModel);
	}

	removeShape(shapeId){
		let index = this.shapes.findIndex(item => item.id === shapeId);
		if (index > -1){
			this.shapes.splice(index, 1);
		}
	}

	clear(){
		this.shapes = [];
	}

	lastShape(){
		return this.shapes[this.shapes.length - 1] || null;
	}

}