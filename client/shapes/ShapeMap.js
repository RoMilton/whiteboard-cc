import Line from '../shapes/Shape-Line.js';
import StraightLine from '../shapes/Shape-StraightLine.js';
import FillRect from '../shapes/Shape-FillRect.js';

// The one and only template for all shapes used by WhiteBoard App
const ShapeMap = {
	'pen' : { // shape name
		class : Line, // JS class to instantiate shape
		description : 'Pen Tool', // Description of shape
		isDefault : true // whether this shape is default
	},
	'line' : {
		class : StraightLine,
		description : 'Line Tool'
	},
	'rect' : {
		class : FillRect,
		description : 'Rectangle Tool'
	}
}

export default ShapeMap;