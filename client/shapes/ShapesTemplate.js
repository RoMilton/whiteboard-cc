import Line from '../shapes/Shape-Line.js';
import StraightLine from '../shapes/Shape-StraightLine.js';
import FillRect from '../shapes/Shape-FillRect.js';

const ShapesTemplate = {
	'pen' : {
		class : Line,
		description : 'Pen Tool',
		isDefault : true
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

export default ShapesTemplate;