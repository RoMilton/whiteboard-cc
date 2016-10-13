export default class Utils{

	static mergeImages(imageSrc1,imageSrc2,fileType = 'png'){
		return new Promise((resolve,reject)=>{
			let c = document.createElement("canvas");
			let ctx = c.getContext("2d");
			let imageObj1 = new Image();
			let imageObj2 = new Image();
			imageObj1.src = imageSrc1;
			imageObj1.onload = ()=>{
				imageObj2.src = imageSrc2;
				imageObj2.onload = ()=>{
					c.setAttribute('width',Math.max(imageObj1.width,imageObj2.width));
					c.setAttribute('height',Math.max(imageObj1.height,imageObj2.height));
					ctx.drawImage(imageObj1, 0, 0);
					ctx.drawImage(imageObj2, 0, 0);
					resolve (c.toDataURL("image/png"));
				}
			}
		});
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