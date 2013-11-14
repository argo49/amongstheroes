// callback uses two params, (a = array of oImgs and n = # of images loaded)
// (maybe check to see they're the same number?)

function ImagePreloader(images, callback){
	//store the callback
	this.callback 		= callback;

	//initialize the internal state
	this.nLoaded 		= 0;
	this.nProcessed 	= 0;
	this.aImages 		= new Array();

	//record the number of images
	this.nImages		= images.length;

	//for each image call preload()
	for(var i = 0; i < images.length; i++){
		this.preload(images[i]);
	}

}

//passing the image src as parameter
ImagePreloader.prototype.preload = function(image){
	//create a new image object and add to array
	var oImage = new Image();
	this.aImages.push(oImage);

	//set up event handlers for the image object
	oImage.onload  = ImagePreloader.prototype.onload;
	oImage.onerror = ImagePreloader.prototype.onerror;
	oImage.onabort = ImagePreloader.prototype.onabort;

	//assign pointer back to this
	oImage.preloader = this;
	oImage.bLoaded   = false;

	//assign the .src property of the Image object
	oImage.src = image;

}

ImagePreloader.prototype.onComplete = function(){
	this.nProcessed++;
	if(this.nProcessed == this.nImages){
		this.callback(this.aImages, this.nLoaded);
	}

}

ImagePreloader.prototype.onload = function(){
	this.bLoaded = true;
	this.preloader.nLoaded++;
	this.preloader.onComplete();
}

ImagePreloader.prototype.onerror = function(){
	this.bError = true;
	this.preloader.onComplete();
}

ImagePreloader.prototype.onabort = function(){
	this.bAbort = true;
	this.preloader.onComplete();
}

// http://www.webreference.com/programming/javascript/gr/column3/index.html