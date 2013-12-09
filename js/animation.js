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

var numberOfMoons = 8;

// Changes the CSS of each moon to move vertically and horizontally a set amount of degrees
function drawMoons(canvasX, canvasY, canvasWidth, canvasHeight, degrees){
	// Draws moons on top of planet in moonCanvas
	var centerPlanetX = canvasX + (canvasWidth  * 0.285),
	    centerPlanetY = canvasY + (canvasHeight * 0.49),
	    moons    	  = [];

	// Populate array with jqQuery moon handles
    for(var i = 0; i < numberOfMoons; i++){
    	var moonImg = $('#moon' + i);
    	moons.push(moonImg);
    }

    // Orbit radius of the moons
    var orbitRadius = (0.15 * canvasWidth) + (moons[0].height() / 2);

    // Returns the new coordinates in a css object based on the degrees provided
    function moonCoords(degrees){
    	// http://stackoverflow.com/questions/20168357/stuttering-orbit-animation-when-updating-css-through-javascript-over-small-inter
		return {left:centerPlanetX + (orbitRadius * Math.cos((degrees*Math.PI)/180)), 
			  	top :centerPlanetY - (orbitRadius * Math.sin((degrees*Math.PI)/180))};
	}

	// Adds a set amount of degrees to the rotation of the moon
	function addDegrees(moon, degreeIncrement){
		var newAngle = moon.data('angle') + degreeIncrement;	
		moon.data('angle', newAngle);

		return moonCoords(newAngle);
	}

	// Change css of the moons
	for(var i = 0; i < numberOfMoons; i++){
		moons[i].css(addDegrees(moons[i], degrees), 1);
	}

}

// Create the visible moon imgs and set them in place with event handlers
function createMoons(canvasX, canvasY, canvasWidth, canvasHeight){
	var centerPlanetX = canvasX + (canvasWidth  * 0.285),
	    centerPlanetY = canvasY + (canvasHeight * 0.49),
	    moons         = [],
	    content       = $('#content');

	// Populate an array with jquery moon objects
	for(var i = 0; i < numberOfMoons; i++){
		var moonImg = $('#moon' + i)
			.addClass('moon')
			.on('mouseover', function(){
				if(moonInterval){
				    clearInterval(moonInterval);
				    moonInterval = undefined;
				}
			})
			.on('mouseout', function(){
				// Breaks on window resize since it's using the old values
				if(!moonInterval)
					setMoonInterval(canvasX, canvasY, canvasWidth, canvasHeight);
			})
			.height(canvasHeight * 0.08)
			.show();

		moonImg.appendTo(content);
		moons.push(moonImg);
	}

	// Radius of the moons' orbit
	var orbitRadius = (0.15 * canvasWidth) + (moons[0].height() / 2);

	// Returns a css object that should be used with jQuery.css() to place moons based on degrees
	function moonCoords(degrees){
		return {left:centerPlanetX + (orbitRadius * Math.cos((degrees*Math.PI)/180)), 
			  	top :centerPlanetY - (orbitRadius * Math.sin((degrees*Math.PI)/180))};
	}

	// Position of first moon in degrees (full moon)
	var zeroMoon = 90;

	// Set each moon in place based on it's position in degrees
	for(var i = 0; i < numberOfMoons; i++){
		moons[i].css(moonCoords(zeroMoon));
		moons[i].data("angle", zeroMoon);
		zeroMoon -= 45;
	}

	return true;
}


var moonInterval;
var moonsSet;

function draw(){
	var canvas = $('#canvas')[0];
	var jqCanvas = $($('#canvas')[0]);
	var ctx = canvas.getContext('2d');
	var canvasWidth  = jqCanvas.attr('width');
	var canvasHeight = jqCanvas.attr('height');
	var canvasX = Number(jqCanvas.css('left').slice(0, -2));
	var canvasY = Number(jqCanvas.css('top').slice(0, -2));

	//draw the background image to fill canvas
	var backgroundImage = document.getElementById('background');
	ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

	// If the moons are not set in position, set them
	if(!moonsSet){
		moonsSet = createMoons(canvasX, canvasY, canvasWidth, canvasHeight);
	}

	//make moons rotate sensually
	setMoonInterval(canvasX, canvasY, canvasWidth, canvasHeight);
}

// Move the moons vertically and horizontaly a small amount every iteration
function setMoonInterval(canvasX, canvasY, canvasWidth, canvasHeight){
	if(!moonInterval){
		moonInterval = window.setInterval(function(){
			drawMoons(canvasX, canvasY, canvasWidth, canvasHeight, -0.05);
		}, 1);
	}
}

function hideMoons(){
	for(var i = 0; i < 8; i++){
		$('#moon' + i).hide();
	}
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
	var fileNames = [
		"background.png"
		,"moon0.png"
		,"moon1.png"
		,"moon2.png"
		,"moon3.png"
		,"moon4.png"
		,"moon5.png"
		,"moon6.png"
		,"moon7.png"
	];
	// store image names here
	var imageSRCs = $.map(fileNames, function(img, idx){
		return "images/" + img;
	});
	preloadImages(imageSRCs);
	$(window).resize(resize);
}

$(document).ready(init);
//$(document).ready(resize(imgPreloader.aImages[0]));
