function render() {
	var grey = '#bdc3c7';
	if (gameState === 0) {
		grey = "rgb(220, 223, 225)";
	}
	
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard(ctx);
	if (gameState === 1 || gameState === 2 || gameState === -1 || gameState === 0) {
		if (op < 1) {
			op += 0.01;
		}
		// it controlls the opacity of the canvas
		ctx.globalAlpha = op;
		drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6,ctx);
		// it is the outter line on the hexagon for timing
		drawTimer(MainHex);
		ctx.globalAlpha = 1;
	} 
	var i;
	for (i = 0; i < MainHex.blocks.length; i++) {
		for (var j = 0; j < MainHex.blocks[i].length; j++) {
			var block = MainHex.blocks[i][j];
			block.draw(true);
		}
	}
	for (i = 0; i < blocks.length; i++) {
		blocks[i].draw(false);
	}
	MainHex.draw(2, 2, ctx,trueCanvas);
	
	if (gameState ==1 || gameState ==-1 || gameState === 0) {
		drawScoreboard();
	 } 
	//  score text
	for (i = 0; i < MainHex.texts.length; i++) {
		var alive = MainHex.texts[i].draw();
		if(!alive){
			MainHex.texts.splice(i,1);
			i--;
		}
	}

	if ((MainHex.ct < 650 && (gameState !== 0) && !MainHex.playThrough)) {
		if (MainHex.ct > (650 - 50)) {
			ctx.globalAlpha = (50 - (MainHex.ct - (650 - 50)))/50;
		}

		if (MainHex.ct < 50) {
			ctx.globalAlpha = (MainHex.ct)/50;
		}

		renderBeginningText();
		ctx.globalAlpha = 1;

	}
	
	if (gameState == -1) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = 'rgb(236,240,241)';
		ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
		ctx.globalAlpha = 1;
	}

	settings.prevScale = settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
}

function setUpHex(){
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	// MainHex generation
	MainHex = saveState.hex || new Hex(settings.hexWidth, trueCanvas);

	// generating hexs for new mode
	hex1 = new Hex($(window).width()/2, twoPlayerCanvas);
	hex2 = new Hex($(window).width()/2, twoPlayerCanvas);

	if (saveState.hex) {
		MainHex.playThrough += 1;
	}
	MainHex.sideLength = settings.hexWidth;

	var i;
	var block;
	if (saveState.blocks) {
		saveState.blocks.map(function (o) {
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color];
			}
		});

		for (i = 0; i < saveState.blocks.length; i++) {
			block = saveState.blocks[i];
			blocks.push(block);
		}
	} else {
		blocks = [];
	}

	gdx = saveState.gdx || 0;
	gdy = saveState.gdy || 0;
	comboTime = saveState.comboTime || 0;

	for (i = 0; i < MainHex.blocks.length; i++) {
		for (var j = 0; j < MainHex.blocks[i].length; j++) {
			MainHex.blocks[i][j].height = settings.blockHeight;
			MainHex.blocks[i][j].settled = 0;
		}
	}
	// convert blocks' color
	MainHex.blocks.map(function (i) {
		i.map(function (o) {
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color];
			}
		});
	});

	MainHex.y = -100;

	waveone = saveState.wavegen || new waveGen(MainHex);

	MainHex.texts = []; //clear texts
	hex1.texts=[];
	hex2.texts=[];
	MainHex.delay = 15;
	hex1.delay = 15;
	hex2.delay = 15;
	hideText();

	// setting up for two player mode 
	hex1.sideLength = settings.hexWidth;
	hex2.sideLength = settings.hexWidth;

	// adding blocks to hexes
	
	waveTwoPlayer = [new waveGen(hex1), new waveGen(hex2)];
	blocksTwoPlayer = [[],[]];
}



function renderBeginningText() {
	var upperheight = (trueCanvas.height/2) - ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (5/6);
	var lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
    var mob, fontSize;
    if(/mobile|Mobile|iOS|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mob = true;
        input_text = 'Tap the screen\'s left and right';
        action_text = 'sides to rotate the hexagon';
        score_text = 'Match 3+ blocks to score';
        fontSize = 35;
    } else {
        mob = false;
        input_text = 'Use the right and left arrow keys';
        action_text = 'to rotate the hexagon';
        score_text = 'Match 3+ blocks to score!';
        fontSize = 27;
	}
	
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight-0*settings.scale, fontSize, '#2c3e50', input_text);
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight+33*settings.scale, fontSize, '#2c3e50', action_text);
    if (!mob) {
	    drawKey("",(trueCanvas.width)/2 + 2 * settings.scale-2.5,upperheight+38*settings.scale);
    }

	renderText((trueCanvas.width)/2 + 2 * settings.scale,lowerheight,fontSize, '#2c3e50', score_text);
}

function drawKey(key, x, y) {
	var ctx_1 = gameState==5? c:ctx;
	ctx_1.save();

	switch (key) {
		case "left":
			ctx_1.translate(x, y + settings.scale * 13);
			ctx_1.rotate(3.14159);
			ctx_1.font = "20px Fontawesome";
			ctx_1.scale(settings.scale, settings.scale);
			ctx_1.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		case "right":
			ctx_1.font = "20px Fontawesome";
			ctx_1.translate(x , y + settings.scale * 27.5);
			ctx_1.scale(settings.scale, settings.scale);
			ctx_1.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		
		default:
			drawKey("left", x - 5, y);
			drawKey("right", x + 5, y);
	}
	ctx_1.restore();
}


function renderTwoPlayer(){
	// two lines below might needs to be added to the animloop
		$("#canvas").fadeOut();
		$('#canvas1').show();

		c.clearRect(0, 0, twoPlayerCanvas.width, twoPlayerCanvas.height);
		clearGameBoard(c);

		renderText(twoPlayerCanvas.width/4, twoPlayerCanvas.height/8,30,'#3E502C',"Player 1");
		renderText(twoPlayerCanvas.width/4*3, twoPlayerCanvas.height/8,30,'#0C343D',"Player 2");
		if (gameState === 5 || gameState === 2 || gameState === -1 || gameState === 0) {
			if (op < 1) {
				op += 0.01;
			}
			// drawTimer(hex1);
			// drawTimer(hex2);
			c.globalAlpha = op;
			drawPolygon(twoPlayerCanvas.width/4, twoPlayerCanvas.height/2, 6, (settings.rows*settings.blockHeight)*(2/Math.sqrt(3))+settings.hexWidth, 30, hexagonBackgroundColor[3],false,6,c);
			drawPolygon(twoPlayerCanvas.width/4, twoPlayerCanvas.height/2, 6, (settings.rows*settings.blockHeight)*(2/Math.sqrt(3))+settings.hexWidth, 30, hexagonBackgroundColor[4],false,6,c,twoPlayerCanvas.width/2);
		}	

		var i;
		var j;
		var block;
		for (i = 0; i < hex1.blocks.length; i++) {			
			for (j = 0; j < hex1.blocks[i].length; j++) {
				block = hex1.blocks[i][j];
				block.draw(true, twoPlayerCanvas.width/2);
			}
		}
		for (i = 0; i < blocksTwoPlayer[0].length; i++) {									
			blocksTwoPlayer[0][i].draw(false, twoPlayerCanvas.width/2);
		}

		for (i = 0; i < hex2.blocks.length; i++) {
			for (j = 0; j < hex2.blocks[i].length; j++) {
				block = hex2.blocks[i][j];
				block.draw(true);
			}
		}
		for (i = 0; i < blocksTwoPlayer[1].length; i++) {
			blocksTwoPlayer[1][i].draw(false);
		}
	
		hex1.draw(4,2,c,twoPlayerCanvas, twoPlayerCanvas.width/2);
		hex2.draw(4,2,c,twoPlayerCanvas);
		
		drawScoreboard();
		if(hex2.ct<650){
			renderBeginningText();
		}

		if (gameState == -1) {
			c.globalAlpha = 0.9;
			c.fillStyle = 'rgb(236,240,241)';
			c.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
			c.globalAlpha = 1;
		}
		settings.prevScale = settings.scale;//twoPlayerScale;
		settings.hexWidth = settings.baseHexWidth * settings.scale;
		settings.blockHeight = settings.baseBlockHeight * settings.scale;//twoPlayerScale;
}

function drawScoreboard() {
	if (scoreOpacity < 1) {
		scoreOpacity += 0.01;
		textOpacity += 0.01;
	}
	ctx.globalAlpha = textOpacity;
	var scoreSize = 50;
	var scoreString = String(score);
	if (scoreString.length == 6) {
		scoreSize = 43;
	} else if (scoreString.length == 7) {
		scoreSize = 35;
	} else if (scoreString.length == 8) {
		scoreSize = 31;
	} else if (scoreString.length == 9) {
		scoreSize = 27;
	}
	//if (rush ==1){
		var color = "rgb(236, 240, 241)";
	//}
	var fontSize = settings.platform == 'mobile' ? 35 : 30;
	var h = trueCanvas.height / 2 + gdy + 100 * settings.scale;
	if (gameState === 0) {
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 150, "#2c3e50", "HextrisPlus");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h + 10, fontSize, "rgb(44,62,80)", 'Play!');
	} else if (gameState != 0 && textOpacity > 0 && gameState!==5) {
		textOpacity -= 0.05;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy - 155 * settings.scale, 150, "#2c3e50", "HextrisPlus");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h, fontSize, "rgb(44,62,80)", 'Play!');
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	} else if(gameState==5) {
		c.globalAlpha = textOpacity;
		renderText(trueCanvas.width/4+gdx, trueCanvas.height / 2 + gdy, scoreSize, color, p2Score);
		renderText(trueCanvas.width/4*3+gdx, trueCanvas.height / 2 + gdy, scoreSize, color, p1Score);
	} else {
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	}

	ctx.globalAlpha = 1;
}

// this is not for drawing the colored hex background
function clearGameBoard(ctx) {
	if(gameState==5){
		drawPolygon(twoPlayerCanvas.width / 4, twoPlayerCanvas.height / 2, 6, trueCanvas.width / 4, 30, hexagonBackgroundColor[0], 0, 'rgba(0,0,0,0)', c);
		drawPolygon(twoPlayerCanvas.width / 4, twoPlayerCanvas.height / 2, 6, trueCanvas.width / 4, 30, hexagonBackgroundColor[0], 0, 'rgba(0,0,0,0)', c, twoPlayerCanvas.width/2);
	} else {
		drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor[0], 0, 'rgba(0,0,0,0)',ctx);
	}
}

	