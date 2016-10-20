export default class Utils{

	static getBrightness(color){
		var color = color.substring(1);	     // strip #
		var rgb = parseInt(color, 16);   // convert rrggbb to decimal
		var r = (rgb >> 16) & 0xff;  // extract red
		var g = (rgb >>  8) & 0xff;  // extract green
		var b = (rgb >>  0) & 0xff;  // extract blue
		var brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		return brightness;
	}

	static validItemFromArrays(validValues,invalidValues,random = true){
		let vals = validValues.slice();
		invalidValues.forEach((item)=>{
			let i = vals.indexOf(item);
			if (i > -1) {
				vals.splice(i,1);
			}
		});
		if (vals.length === 0){
			vals = validValues;
		}
		return random ? vals[Math.floor(Math.random()*vals.length)] : vals[0];
	}

	static preloadImage(imageSrc){
		return new Promise((resolve,reject)=>{
			let image = new Image();
			image.src = imageSrc;
			image.onload = ()=>{
				resolve(image);
			};
			image.onerror = ()=>{
				reject();
			};
		});
	}

	static guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}
}