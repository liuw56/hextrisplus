
function init(b) {
	if (settings.ending_block && b == 1) { return; }
	
	// if (saveState.hex !== undefined) gameState = 1;
	if (b) {
		$("#pauseBtn").attr('src', "./images/btn_pause.svg");
		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}

		setTimeout(function () {
			if (gameState == 1) {
				$('#openSideBar').fadeOut(150, "linear");
			}
			infobuttonfading = false;
		}, 7000);
		clearSaveState();
		checkVisualElements(1);
	}
	if (highscores.length === 0) {
		$("#currentHighScore").text(0);
	}
	else {
		$("#currentHighScore").text(highscores[0])
	}
	document.getElementById("canvas").className="";
	document.getElementById("canvas1").className="";
	infobuttonfading = true;
	$("#pauseBtn").attr('src', "./images/btn_pause.svg");
	hideUIElements();
	var saveState = localStorage.getItem("saveState") || "{}";
	saveState = JSONfn.parse(saveState);
	history = {};
	importedHistory = undefined;
	importing = 0;
	score = saveState.score || 0;
	score = 0;
	prevScore = 0;
	p1Score, p2Score = 0;
	spawnLane = 0;
	op = 0;
	tweetblock = false;
	scoreOpacity = 0;
	setUpHex();

		
	gameState=1;

	$("#restartBtn").hide();
	$("#pauseBtn").show();
}




var spd = 1;

function animLoop() {
	
	switch (gameState) {
		case 1:
			requestAnimFrame(animLoop);
			render();
			var now = Date.now();
			var dt = (now - lastTime) / 16.666 * rush;
			
			if (spd > 1) {
				dt *= spd;
			}

			if (gameState == 1) {
				if (!MainHex.delay) {
					update(MainHex,waveone,dt,blocks);
				}
				else {
					MainHex.delay--;
				}
			}

			lastTime = now;

			if (checkGameOver(MainHex) && !importing) {
				var saveState = localStorage.getItem("saveState") || "{}";
				saveState = JSONfn.parse(saveState);
				gameState = 2;

				setTimeout(function () {
					enableRestart();
				}, 150);

				if ($('#helpScreen').is(':visible')) {
					$('#helpScreen').fadeOut(150, "linear");
				}

				if ($('#pauseBtn').is(':visible')) $('#pauseBtn').fadeOut(150, "linear");
				if ($('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear");
				if ($('#openSideBar').is(':visible')) $('.openSideBar').fadeOut(150, "linear");

				canRestart = true;
				clearSaveState();
			}
			break;

		case 0:
			requestAnimFrame(animLoop);
			render();
			break;

		case -1:
			requestAnimFrame(animLoop);
			render();
			break;

		case 2:
			var now = Date.now();
			var dt = (now - lastTime) / 16.666 * rush;
			requestAnimFrame(animLoop);
			update(MainHex, waveone, dt, blocks);
			render();
			lastTime = now;
			break;

		case 3:
			requestAnimFrame(animLoop);
			fadeOutObjectsOnScreen();
			render();
			break;

		case 4:
			setTimeout(function () {
				initialize(1);
			}, 1);
			render();
			return;

		// added two player mode gamestate 5
		case 5:
			requestAnimationFrame(animLoop);
			renderTwoPlayer();
			var now = Date.now();
			var dt1 = (now - lastTime) / 16.666 * rush1;
			var dt2 =(now - lastTime) / 16.666 * rush2;
			if (spd > 1) {
				dt1 *= spd;
				dt2 *= spd;
			}
			if(!p1End){
				if (!hex1.delay) {
					update(hex1, waveTwoPlayer, dt1, blocksTwoPlayer,0);
				}
				else {
					hex1.delay--;
				}
			}
			if(!p2End){
				if (!hex2.delay) {					
					update(hex2, waveTwoPlayer, dt2, blocksTwoPlayer,1);
				}
				else {
					hex2.delay--;
				}
			}
			lastTime =now;
			var p1=checkGameOver(hex1);
			var p2 =checkGameOver(hex2);
			if(p1&&p2){
				$("#restartBtn").show();
				gameState = 2;

				setTimeout(() => {
					enableRestart();
				}, 150);
				canRestart=true;
				clearSaveState();
			}
			break;


		default:
			initialize();
			setStartScreen();
			break;
	}

	if (!(gameState == 1 || gameState == 2|| gameState==5)) {
		lastTime = Date.now();
	}
}

function enableRestart() {
	canRestart = 1;
}

function isInfringing(hex) {
	var bondary = settings.rows;
	for (var i = 0; i < hex.sides; i++) {
		var subTotal = 0;
		for (var j = 0; j < hex.blocks[i].length; j++) {
			subTotal += hex.blocks[i][j].deleted;
		}
		if (hex.blocks[i].length - subTotal > bondary) {
			return true;
		}
	}
	return false;
}

function checkGameOver(hex) {
	for (var i = 0; i < hex.sides; i++) {
		if (isInfringing(hex)) {
			var score_sub = score;
			if(hex==hex1 || hex==hex2){
				if(hex==hex1)p1End=true;
				else p2End = true;
				if(p1Score>p2Score){
					winner = "Player 2 Wins!  Congraduations!";
					score_sub = p1Score;
				}else if(p1Score==p2Score){
					winner = "Tie"
					score_sub = p1Score;
				}else{
					winner = "Player 1 Wins!  Congraduations!";
					score_sub = p2Score;
				}
				
			}
			writeHighScoresInterface();
			if(gameState!=5 || (p1End&&p2End)){
				gameOverDisplay(score_sub);
			}
			if (highscores.indexOf(score_sub) == -1) {
				highscores.push(score_sub);
			}
		return true;
		}
	}
	return false;
}

function resumeGame(state) {
	if($('#mode').is(":visible")||$('.modeSelection').is(":visible")) {
		$('.modeSelection').fadeOut();
		$('#mode').fadeOut();
	}
	gameState = state;
	hideUIElements();
	$('#pauseBtn').show();
	$('#restartBtn').hide();
	importing = 0;
	checkVisualElements(0);
}

var pausable = true;
function pause(o) {
    if (gameState == 0 || gameState == 2 || !pausable) {
        return;
    }
	pausable = false;
	writeHighScoresInterface();
	var message;
	if (o) {
		message = '';
	} else {
		message = 'paused';
	}
	var c;
	if (gameState==1){
		c = document.getElementById("canvas");
	} else {
		c = document.getElementById("canvas1");
	}
	
	if (gameState == -1) {
		$('#fork-ribbon').fadeOut(300, 'linear');
		$('#restartBtn').fadeOut(300, "linear");
		$('#buttonCont').fadeOut(300, "linear");
		if ($('#helpScreen').is(':visible')) {
			$('#helpScreen').fadeOut(300, "linear");
		}

		$("#pauseBtn").attr("src", "./images/btn_pause.svg");
		$('.helpText').fadeOut(300, 'linear');
		$('#overlay').fadeOut(300, 'linear');
		hideText();
		setTimeout(function() {
			gameState = prevGameState;
			pausable =true;
		}, 400);
	} else if (gameState != -2 && gameState !== 0 && gameState !== 2) {
		$('#restartBtn').fadeIn(300, "linear");
		$('#buttonCont').fadeIn(300, "linear");
		$('.helpText').fadeIn(300, 'linear');
		if (message == 'paused') {
			showText(message);
		}
		$('#fork-ribbon').fadeIn(300, 'linear');
		$("#pauseBtn").attr("src","./images/btn_resume.svg");
		$('#overlay').fadeIn(300, 'linear');
		prevGameState = gameState;
		setTimeout(function() {
		    pausable = true;
		}, 400);
		gameState = -1;
	}
}

function hideText() {
	$(".overlay").fadeOut(150, function() {
		$(".overlay").html("");
	})
}

function setStartScreen() {
	$('#startBtn').show();
	init();
	if (isStateSaved()) {
		importing = 0;
	} else {
		importing = 1;
	}

	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').show();

	gameState = 0;

	requestAnimFrame(animLoop);
}

function modeSelectionDisplay(){
	checkVisualElements(0);
	$("#startBtn").fadeOut();
	$("#mode").fadeIn(100, 'linear');
	$("#singlePlayer").fadeIn();
	$("#twoPlayer").fadeIn();
}

function addKeyListenersInterface(){
	addKeyListeners();
	return;
}

function scaleCanvas() {
	
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvasFake.width = $(window).width();
	canvasFake.height = $(window).height();
	
	if (canvas.height > canvas.width) {
		settings.scale = (canvas.width / 800) * settings.baseScale;
	} else {
		settings.scale = (canvas.height / 800) * settings.baseScale;
	}

	trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};
	twoPlayerCanvas = {
		width: canvasFake.width,
		height: canvasFake.height
	};

	if (window.devicePixelRatio) {
		var cw = $("#canvas").attr('width');
		var ch = $("#canvas").attr('height');
		var cw1 = $("#canvas").attr('width');
		var ch1 = $("#canvas").attr('height');

		$("#canvas").attr('width', cw * window.devicePixelRatio);
		$("#canvas").attr('height', ch * window.devicePixelRatio);
		$("#canvas").css('width', cw);
		$("#canvas").css('height', ch);
		$("#canvas1").attr('width', cw * window.devicePixelRatio);
		$("#canvas1").attr('height', ch * window.devicePixelRatio);
		$("#canvas1").css('width', cw);
		$("#canvas1").css('height', ch);

		trueCanvas = {
			width: cw,
			height: ch
		};
		twoPlayerCanvas = {
			width: cw1,
			height: ch1
		};

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		c.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
	setBottomContainer(trueCanvas);
	setBottomContainer(twoPlayerCanvas);
	set_score_pos();
}




function showHelpInterface(){
	showHelp();
	return;
}

function checkVisualElementsInterface(arg){
	checkVisualElements(arg);
	return;
}

function exportSaveStateInterface(){
	return exportSaveStateInterfaceInUpdate();
}