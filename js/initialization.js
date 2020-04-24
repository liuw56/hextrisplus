$(document).ready(function () {
	initialize();
});
function initialize(a) {	
	window.rush = 1;
	window.rush1 =1;
	window.rush2 =1;
	window.lastTime = Date.now();
	
	window.iframHasLoaded = false;
	window.colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
	window.hexColorsToTintedColors = {
		"#e74c3c": "rgb(241,163,155)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#2ecc71": "rgb(150,227,183)"
	};

	window.rgbToHex = {
		"rgb(231,76,60)": "#e74c3c",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(46,204,113)": "#2ecc71"
	};

	window.rgbColorsToTintedColors = {
		"rgb(231,76,60)": "rgb(241,163,155)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(150,227,183)"
	};

	window.hexagonBackgroundColor = ['rgb(236, 240, 241)', 'rgb(237, 148, 31)', 'rgb(122, 98, 240)','rgb(217, 234, 211)', 'rgb(208, 224, 227)'];
	window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
	window.centerBlue = 'rgb(44,62,80)';
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;
	window.op = 0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}") {
		op = 1;
	}

	window.textShown = false;
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
			window.setTimeout(callback, 1000 / framerate);
		};
	})();
	$('#clickToExit').bind('click', toggleDevTools);
	window.settings;
	if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.rrssb-email').remove();
		settings = {
			os: "other",
			platform: "mobile",
			startDist: 227,
			creationDt: 60,
			baseScale: 1.4,
			scale: 1,
			// twoPlayerScale: 1,
			prevScale: 1,
			baseHexWidth: 87,
			hexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 20,
			rows: 7,
			speedModifier: 0.73,
			speedUpKeyHeld: false,
			speedUpKeyHeld1:false,
			speedUpKeyHeld2:false,
			creationSpeedModifier: 0.73,
			comboTime: 310
		};
	} else {
		settings = {
			os: "other",
			platform: "nonmobile",
			baseScale: 1,
			startDist: 340,
			creationDt: 9,
			scale: 1,
			// twoPlayerScale: 1,
			prevScale: 1,
			hexWidth: 65,
			baseHexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 15,
			rows: 8,
			speedModifier: 0.65,
			speedUpKeyHeld: false,
			speedUpKeyHeld1:false,
			speedUpKeyHeld2:false,

			creationSpeedModifier: 0.65,
			comboTime: 310
		};

	}
	if (/Android/i.test(navigator.userAgent)) {
		settings.os = "android";
	}

	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
		settings.os = "ios";
	}

	window.canvas = document.getElementById('canvas');
	window.ctx = canvas.getContext('2d');
	window.trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};

	// Create context for the multiplayer mode
	window.canvasFake = document.getElementById('canvas1');
    window.c = canvasFake.getContext('2d');
    // canvasFake.width = $(window).width();
	// canvasFake.height = $(window).height();
	window.twoPlayerCanvas = {
		width: canvasFake.width,
		height: canvasFake.height
	};
	scaleCanvas();
	
	window.framerate = 60;
	window.history = {};
	window.score = 0;
	// window.scoreAdditionCoeff = 1;
	// score of player 1 and player 2
	window.p1Score = 0;
	window.p2Score =0;
	window.prevScore = 0;
	window.numHighScores = 3;
	window.winner;

	highscores = [];
	if (localStorage.getItem('highscores')) {
		try {
			highscores = JSON.parse(localStorage.getItem('highscores'));
		} catch (e) {
			highscores = [];
		}
	}
	window.blocks = [];
	window.blocksTwoPlayer = [[],[]];
	window.p1End = false;
	window.p2End = false;
	window.MainHex;
	window.hex1;
	window.hex2;
	window.gdx = 0;
	window.gdy = 0;
	window.devMode = 0;
	window.lastGen = undefined;
	window.prevTimeScored = undefined;
	window.nextGen = undefined;
	window.spawnLane = 0;
	window.importing = 0;
	window.importedHistory = undefined;
	window.gameState;
	window.waveTwoPlayer;
	setStartScreen();

	if (a != 1) {
		if(importing ==1){
			location.reload();
		}
		window.canRestart = 1;
		window.onblur = function (e) {
			if (gameState == 1 || gameState==5) {
				pause();
			}
		};
		$('#startBtn').off();

		if (settings.platform == 'mobile') {
			$('#startBtn').on('touchstart', startBtnHandler);
		} else {
			// It controls the startbutton
			$('#startBtn').on('mousedown', startBtnHandler);
		}

		document.addEventListener('touchmove', function (e) {
			e.preventDefault();
		}, false);
		if($("#canvas").is(":visible"))$(window).resize(scaleCanvas);

		$(window).unload(function () {

			if (gameState == 1 || gameState == -1 || gameState === 0) localStorage.setItem("saveState", exportSaveStateInterface());
			else localStorage.setItem("saveState", "{}");
		});

		addKeyListenersInterface();
		
		document.addEventListener("pause", handlePause, false);
		document.addEventListener("backbutton", handlePause, false);
		// document.addEventListener("menubutton", handlePause, false); //menu button on android

		setTimeout(function () {
			if (settings.platform == "mobile") {
				try {
					document.body.removeEventListener('touchstart', handleTapBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('touchstart', handleTap, false);
				} catch (e) {

				}

				document.body.addEventListener('touchstart', handleTapBefore, false);
			} else {
				try {
					document.body.removeEventListener('mousedown', handleClickBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('mousedown', handleClick, false);
				} catch (e) {

				}

				document.body.addEventListener('mousedown', handleClickBefore, false);
			}
		}, 1);
	}
	
	
}

function startBtnHandler() {
	setTimeout(function () {
		if (settings.platform == "mobile") {
			try {
				document.body.removeEventListener('touchstart', handleTapBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('touchstart', handleTap, false);
			} catch (e) {

			}

			document.body.addEventListener('touchstart', handleTap, false);
		} else {
			try {
				document.body.removeEventListener('mousedown', handleClickBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('mousedown', handleClick, false);
			} catch (e) {

			}
			document.body.addEventListener('mousedown', handleClick, false);
		}
	}, 5);

	// if (!canRestart) return false;

	if (importing == 1) {
		init();
		checkVisualElementsInterface(0);
	} else {
		modeSelectionDisplay();

	if(gameState==1){			
		resumeGame(1);
	}else if(gameState==5)resumeGame(5);
	}
	
}

function handlePause() {
	if (gameState == 1 || gameState == 2 || gameState == 5) {
		pause();
	}
}

function handleTap(e) {
	handleClickTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

function handleClick(e) {
	handleClickTap(e.clientX, e.clientY);
}


function handleTapBefore(e) {
	var x = e.changedTouches[0].clientX;
	var y = e.changedTouches[0].clientY;

	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelpInterface();
		return;
	}
}

function handleClickBefore(e) {
	// Get horizental coords
	var x = e.clientX;
	var y = e.clientY;

	// }

	// add the mode page and css!!!!
	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelpInterface();
		return;
	}
}

function handleClickTap(x,y) {
	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelpInterface();
		return;
	}

	var radius = settings.hexWidth ;
	var halfRadius = radius/2;
	var triHeight = radius *(Math.sqrt(3)/2);
	var Vertexes =[
		[radius,0],
		[halfRadius,-triHeight],
		[-halfRadius,-triHeight],
		[-radius,0],
		[-halfRadius,triHeight],
		[halfRadius,triHeight]];
	Vertexes = Vertexes.map(function(coord){ 
		return [coord[0] + trueCanvas.width/2, coord[1] + trueCanvas.height/2]});

	if (!MainHex || gameState === 0 || gameState==-1) {
		return;
	}

	if (x < window.innerWidth/2) {
		MainHex.rotate(1);
	}
	if (x > window.innerWidth/2) {
		MainHex.rotate(-1);
	}
}

function toggleDevTools() {
	$('#devtools').toggle();
}

