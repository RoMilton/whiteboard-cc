/*
* Generic utility functions for use server and client.
*
* This class is not meant to be instantiated. Instead it contains many
* static methods that can be called directly.
*
* @class Utils
*/

export default class Utils{

	/**
	* Determines how bright a given color is, and returns a number between
	* 0 and 255. (0 being darkest and 255 being brightest)
	*
	* @memberOf Utils
	* @method getBrightness
	* @param {String} color - color in hex format
	* @return {Number} Number from 0 to 255 (0 is darkest and 255 is brightest)
	*/
	static getBrightness(color){
		var color = color.substring(1);	     // strip #
		var rgb = parseInt(color, 16);   // convert rrggbb to decimal
		var r = (rgb >> 16) & 0xff;  // extract red
		var g = (rgb >>  8) & 0xff;  // extract green
		var b = (rgb >>  0) & 0xff;  // extract blue
		var brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		return brightness;
	}


	/**
	* Selects an item from an array of possible values, that doesn't also exist in a
	* second array of invalid values.
	*
	* However, if all items from the array of possible values also exist in the array of 
	* invalid values, then one will be selected regardless.
	*
	* @memberOf Utils
	* @method validItemFromArrays
	* @param {Array[]} values - an array of possible values
	* @param {Array[]} invalidValues - an array of invalid values, some of these values can match 
		the first array 
	* @param {Boolean} random - true to randomly select item, false to select first valid item
	* @return {Any} Item taken from array of possible values
	*/
	static validItemFromArrays(values,invalidValues,random = true){
		let vals = values.slice();
		// for each invalid value
		invalidValues.forEach((item)=>{
			let i = vals.indexOf(item);
			if (i > -1) {
				// remove invalid
				vals.splice(i,1);
			}
		});

		// if there are no valid values left
		if (vals.length === 0){
			vals = values;
		}
		return random ? vals[Math.floor(Math.random()*vals.length)] : vals[0];
	}


	/**
	* Generates and returns an alphanumeric random global unique identifier.
	*
	* @memberOf Utils
	* @method getBrightness
	* @param {String} color - color in hex format
	* @return {String} alphanumeric guid string
	*/
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