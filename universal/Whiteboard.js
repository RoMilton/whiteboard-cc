import Utils from './Utils.js';

export default class Whiteboard{

	constructor(shapes){
		this.shapes = shapes || [];
		this.drawLastShapeOnly = true;
		this.id = Utils.guid();
	}
	
	addShape(shapeModel){
		this.shapes.push(shapeModel);
	}

	removeShape(shapeModel){
		this.shapes.splice(this.shapes.indexOf(shapeModel), 1);
	}

	lastShape(){
		return this.shapes[this.shapes.length - 1] || null;
	}

}