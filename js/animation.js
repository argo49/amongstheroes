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

var moonInterval;

function draw(){
	var canvas = $('#canvas')[0];
	var jqCanvas = $($('#canvas')[0]);
	var ctx = canvas.getContext('2d');
	var canvasWidth  = jqCanvas.attr('width');
	var canvasHeight = jqCanvas.attr('height');
	var canvasX = Number(jqCanvas.css('left').substring(0,jqCanvas.css('left').length-2));
	var canvasY = Number(jqCanvas.css('top').substring(0,jqCanvas.css('top').length-2));

	//draw the background image to fill canvas
	var backgroundImage = document.getElementById('background');
	ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

	//make moons rotate sensually
	if(!moonInterval){
		moonInterval = window.setInterval(function(){
			drawMoons(canvasX, canvasY, canvasWidth, canvasHeight);
		}, 50);
	}
}


var moonDegrees = 0;
function drawMoons(canvasX, canvasY, canvasWidth, canvasHeight){
	//draw moons on top of planet in moonCanvas
	var moons = document.getElementById('moons');
	var moonW = (canvasWidth / 2.3);
	var moonH = (canvasWidth / 2.3);
	var moonX = canvasX + (canvasWidth / 11);
	var moonY = canvasY + (canvasHeight / 6);
	var moonCanvas = $('#moonCanvas')
		.attr('width', moonW)
		.attr('height', moonH)
		.css({
			left:moonX,
			top:moonY
		});
	var moonCtx = moonCanvas[0].getContext('2d');
	moonCanvas.attr('width', moonW);
	moonCanvas.attr('height', moonH);

	//make the moons rotate slowly and sensually
	moonDegrees += 0.2;
	rotateCanvas(moonDegrees, moonCanvas[0], moons)
}

function rotateCanvas(degrees, canvas, imageToRotate){
	var ctx = canvas.getContext('2d');
	var canvasHeight = $(canvas).attr('height');
	var canvasWidth = $(canvas).attr('width');

	ctx.save();
		ctx.translate(canvasWidth/2, canvasHeight/2);
		ctx.rotate(degrees*(Math.PI/180))
		ctx.drawImage(imageToRotate, -canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
	ctx.restore();
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
	clearInterval(moonInterval);
	moonInterval = undefined;

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
