function circle(context, x, y, radius, color){
	var colorPattern = new RegExp('^#(((\\d|\\w){3})|((\\d|\\w){6}))$');

	if(color && colorPattern.test(color)){
		context.fillStyle = color;
	}

	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI*2);
	context.closePath();
	context.fill();
}

function rectangle(context, x, y, width, height, color){
	var colorPattern = new RegExp('^#((\\d{3})|(\\d{6}))$');

	if(color && colorPattern.test(color)){
		context.fillStyle = color;
	}

	context.beginPath();
	context.rect(x, y, width, height);
	context.closePath();
	context.fill();
}

function square(context, x, y, size, color){
	var colorPattern = new RegExp('^#((\\d{3})|(\\d{6}))$');

	if(color && colorPattern.test(color)){
		context.fillStyle = color;
	}

	context.beginPath();
	context.rect(x, y, size, size);
	context.closePath();
	context.fill();
}

//pass an Image() object
function image(image){
	var height = image.height;
	var width = image.width;
	$('#content').append($('<canvas width="' + width + '" height="' + height + '"/>'))

}
			
function draw(){
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d');
	var canvasWidth = $(canvas).attr('width');
	var canvasHeight = $(canvas).attr('height');

	//draw the background image to fill canvas
	var backgroundImage = document.getElementById('background');
	ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

	//draw moons on top of planet
	var backgroundImage = document.getElementById('moons');
	var moonX = (canvasWidth / 11);
	var moonY = (canvasHeight / 6);
	var moonW = (canvasWidth / 2.3);
	var moonH = (canvasWidth / 2.3);
	ctx.drawImage(moons, moonX, moonY, moonW, moonH);

}

function preloadImages(imageSRCs){
	var canvas = $('#canvas')
	var loadingMessage = $('<div/>').addClass('loading').html('<h1>LOADING</h1>');

	// stay classy: tell the user you're loading images
	canvas.hide();
	$('#content').append(loadingMessage);

	// this imgPreloader takes care of loading the images
	imgPreloader = new ImagePreloader(imageSRCs, function(imgArr, numLoaded){
		if(this.nImages == numLoaded){
			loadingMessage.remove();
			canvas.show();
			for(var i = 0; i < imgArr.length; i++){
				var pathIdPattern = new RegExp("[^/]+\\.");
				var imgName = pathIdPattern.exec(imgArr[i].src)[0];
				var imgId = imgName.substring(0, imgName.length-1);
				$('div#images').append($(imgArr[i]).hide().attr("id", imgId));
			}
			resize();
		}else{
			loadingMessage.text('Sorry, there was a problem loading the site : / ');
			console.error("Only " + numLoaded + " of " + this.nImages + " images loaded successfully.");
		}
	});
}

//call on window resize
function resize(){
	var canvas = $($('#canvas')[0]);
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var newCanvasHeight;
	var newTop;
	var bgImage = $('#background');

	if(bgImage){
		newCanvasHeight = (bgImage.height()/bgImage.width())*windowWidth;

		if(newCanvasHeight > windowHeight){
			var newCanvasWidth = (bgImage.width()/bgImage.height())*windowHeight;
			canvas.attr('width', newCanvasWidth);
			canvas.attr('height', windowHeight);
		}else{
			canvas.attr('width', windowWidth);
			canvas.attr('height', newCanvasHeight);			
		}
	}

	newTop = (windowHeight / 2) - (canvas.attr('height') / 2);
	newLeft = (windowWidth / 2) - (canvas.attr('width') / 2)
	canvas.css({top:newTop, left:newLeft});

	draw();
}

//initialization things
function init(){
	// store image names here
	var imageSRCs = $.map(["background.png", "moons.png"], function(img, idx){
		return "images/" + img;
	});
	preloadImages(imageSRCs);
	$(window).resize(resize);
}

$(document).ready(init);
//$(document).ready(resize(imgPreloader.aImages[0]));
