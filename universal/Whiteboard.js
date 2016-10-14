import Utils from './Utils.js';

export default class Whiteboard{

	constructor(shapes){
		this.shapes = shapes || [];
		this.drawLastShapeOnly = true;
		this.id = Utils.guid();
		this.redrawAll = false;
	}
	
	addShape(shapeModel){
		this.shapes.push(shapeModel);
		this.redrawAll = false;
	}

	removeShape(shapeId){
		// let index = this.shapes.map(function(x) {return x.id; }).indexOf(shapeId);
		let index = this.shapes.findIndex(item => item.id === shapeId);
		if (index > -1){
			this.shapes.splice(index, 1);
			this.redrawAll = true;
			return true;
			console.log('22',this.shapes);
		}
		return false;
	}

	lastShape(){
		return this.shapes[this.shapes.length - 1] || null;
	}

}