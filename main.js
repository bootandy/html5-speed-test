/*
 * handle:
 * 800 X 400 canvas
 * 5000 rectangles
 * 2500 circles
 * 1000 fillText '10'
 * 500 30x30 sprites
 * 400 alpha trans sprites
 * 200 scaled sprites
 * 150 scaled alpha sprites
 */

//$(window).load(function() {
	
var ctx;
var width;
var height;
var delta;
var lastTime;
var frames;
var totalTime;
var updateTime;
var updateFrames;
var creats = new Array();
var run;
var toDraw;
var img = new Image();
img.src = 'bogeyblue.gif';

var scale = false;
var rotate = false;
var transparent = false;

	var canvas = $("#main");
	//var canvas = document.getElementById('main');
		
function init() {
	
	updateCanvasDimensions();
    width = canvas.get(0).width;
    height = canvas.get(0).height; 
    ctx = canvas.get(0).getContext('2d');
	ctx.font = '10px sans-serif';
	
	creats = new Array();
	var quantity = document.getElementById('quantity').value;
    for(var i=0; i < quantity; ++i) {
        addCreature();
    }
	
	if (document.getElementById('drawImage').checked) {
		toDraw = 'image';
	} else if (document.getElementById('drawLine').checked) {
		toDraw = 'line';
	} else if (document.getElementById('drawCircle').checked) {
		toDraw = 'circle';
	}else if (document.getElementById('drawText').checked) {
		toDraw = 'text';
	}
	 
	scale = (document.getElementById('scale').checked);
	rotate = (document.getElementById('rotate').checked);
	transparent = (document.getElementById('transparent').checked);
	
    lastTime = (new Date()).getTime();
    frames = 0;
    totalTime = 0;
    updateTime = 0;
    updateFrames =0;
    //setInterval(update, 20);
	update();
	run = true;
};


function addCreature() {
    var c = new Creature(Math.random()*width/2,Math.random()*height/2);
    creats.push(c);
};

function update() {
    var now = (new Date()).getTime();
    delta = now-lastTime;
    lastTime = now;
    totalTime+=delta;
    frames++;
    updateTime+=delta;
    updateFrames++;
	
    if(updateTime > 1000) {
        document.getElementById('fps_av').innerHTML = "FPS AVG: " + (1000*frames/totalTime);
		document.getElementById('fps_cur').innerHTML = "FPS NOW: " + (1000*updateFrames/updateTime);
        updateTime = 0;
        updateFrames = 0;
    }

    for(var i=0; i < creats.length; ++i) {
        creats[i].move();
    }

	drawTime = new Date().getTime(); 

    draw();
	
	drawTime = new Date().getTime() - drawTime; 
	document.getElementById('dt').innerHTML = "Total Draw time this cycle: "+drawTime + "ms";
	
	setTimeout(function() { 
		if (run) {
			update();
		} else {
			init();
		}
	}, 10);

}

function draw() {
    ctx.clearRect(0,0,width,height);
//	ctx.save()
//	ctx.scale(2, 2)
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
	
    creats.forEach(drawCreat);
	//ctx.fillStyle = "#FFFF55";
	//ctx.fillRect(0,0,width,height);
//	ctx.restore();
}

function updateCanvasDimensions() {
//	canvas.attr({height: $(window).height(), width: $(window).width()});
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();
};

function drawCreat(c,i,a) {
    if (!onScreen(c)) {
        return;
    }
	drawX = c.x;
	drawY = c.y;
	
	
	if (transparent || rotate || scale) {
		ctx.save();
	}
	
	if (transparent) {
		ctx.globalAlpha = 0.5;
	}
	if (scale) {
		ctx.scale(2,2);
		drawX = c.x/2;
		drawY = c.y/2;
	}
	if (rotate) {
		ctx.translate(drawX, drawY)
		drawX = 0;
		drawY = 0;
		ctx.rotate(Math.PI/2);
	}

	if (toDraw == 'image') {
		ctx.drawImage(img, drawX, drawY);
	} else if (toDraw == 'circle') {
		ctx.beginPath();
		ctx.arc(drawX, drawY, 5, 0, Math.PI*2, true);
		ctx.closePath(); 
		ctx.stroke();
	} else if (toDraw == 'line') {
		ctx.beginPath();
		ctx.moveTo(drawX, drawY);
		ctx.lineTo(drawX+5, drawY+5);
		ctx.closePath();
		ctx.stroke();
	} else if (toDraw == 'text') {
		ctx.fillText('hi', drawX, drawY);
	}

	if (transparent || rotate || scale) {
		ctx.restore();
	}

	if (transparent) {
		ctx.globalAlpha = 1;
	}
    //ctx.fill();
}

function onScreen(o) {
    return o.x >= 0 && o.y >= 0 && o.x <= width && o.y <=height;
}

function Creature(x1,y) {
    this.x = x1;
    this.y = y;
	this.oldx = this.x
	this.oldy = this.y

    this.dx = Math.random()*2;
    this.dy = Math.random()*2;

    this.move = function() {
		//if (Math.random() < 0.05) {
			this.oldx = this.x
			this.oldy = this.y
	        this.x += this.dx + bigX //+ Math.sin(this.x/200);
	        this.y += this.dy + bigY //+ Math.sin(this.y/200);
        //}
			
        if(this.x < 0 || this.x > width) {
            this.dx*=-1;
			
        }
        if(this.y < 0 || this.y > height) {
            this.dy*=-1;
        }
    }

}
var bigX = 0;
var bigY = 0;

document.body.onkeydown = function(event) {
  var keyCode; 
  if(event == null) {
    keyCode = window.event.keyCode; 
  }
  else {
    keyCode = event.keyCode; 
  }
 
  switch(keyCode)
  {
    case 37:
        bigX = -2;
      break;
     
    case 38:
        bigY = 2
      break; 
      
    case 39:
        bigX = 2;
      break; 
    
    case 40:
        bigY = -2;
      break; 
    
    default: 
      break; 
  } 
}

document.body.onkeyup = function(event) {
  var keyCode; 
  if(event == null) {
    keyCode = window.event.keyCode; 
  }
  else {
    keyCode = event.keyCode; 
  }
 
  switch(keyCode)
  {
    case 37:
    case 39:
        bigX = 0
      break; 
      
    case 38:
    case 40:
        bigY = 0;
      break; 
    
    default: 
      break; 
  } 
}

init();

//});

