function addKeyListeners() {
	keypress.register_combo({
		keys: "left",
		on_keydown: function() {
			if (MainHex && gameState ==1) {
				MainHex.rotate(1);
			} else if(hex1 && hex2 && gameState ==5){
				hex1.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "right",
		on_keydown: function() {
			if (MainHex && gameState==1){
				MainHex.rotate(-1);
			} else if(hex1 && hex2 && gameState ==5){
				hex1.rotate(-1);
			}
		}
	});
		keypress.register_combo({
		keys: "down",
		on_keydown: function() {
			// var tempSpeed = settings.speedModifier;
			if (MainHex && gameState == 1){
				//speed up block temporarily
				if(settings.speedUpKeyHeld == false){
					settings.speedUpKeyHeld = true;
					window.rush *=4;
				}
			} else if(hex1 && hex2 && gameState ==5){
				if(settings.speedUpKeyHeld1 == false){
					settings.speedUpKeyHeld1 = true;
					window.rush1 *=4;
				}
			}
			// settings.speedModifier = tempSpeed;
		},
		on_keyup:function(){
			if ((MainHex || hex1 || hex2) && gameState !== 0){
				//speed up block temporarily
				window.rush /=4;
				window.rush1 /=4;
				settings.speedUpKeyHeld1 = false;
				settings.speedUpKeyHeld = false;

			}
		}	
	});
	
	keypress.register_combo({
		keys: "a",
		on_keydown: function() {
			if (hex2 && gameState !== 0) {
				hex2.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "d",
		on_keydown: function() {
			if (hex2 && gameState !== 0){
				hex2.rotate(-1);
			}
		}
	});
	
	keypress.register_combo({
		keys: "s",
		on_keydown: function() {
			// var tempSpeed = settings.speedModifier;
			if (hex1&&hex2 && gameState !== 0){
				//speed up block temporarily
				if(settings.speedUpKeyHeld2 == false){
					settings.speedUpKeyHeld2 = true;
					window.rush2*=4;
				}
			}
			// settings.speedModifier = tempSpeed;
		},
		on_keyup:function(){
			if ((MainHex || hex1 || hex2) && gameState !== 0){
				//speed up block temporarily
				window.rush2 /=4;
				settings.speedUpKeyHeld2 = false;
			}
		}	
	});

	$("#singlePlayer").on('mousedown', function(){
		resumeGame(1);
	})

	$("#twoPlayer").on('mousedown', function(){
		resumeGame(5);
	})

	$("#pauseBtn").on('touchstart mousedown', function() {
		if (gameState != 1 && gameState != -1 && gameState!=5) {
			return;
		}

		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}
		pause();
		return false;
	});

	$("#colorBlindBtn").on('touchstart mousedown', function() {
	window.colors = ["#8e44ad", "#f1c40f", "#3498db", "#d35400"];

	window.hexColorsToTintedColors = {
		"#8e44ad": "rgb(229,152,102)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#d35400": "rgb(210,180,222)"
	};

	window.rgbToHex = {
		"rgb(142,68,173)": "#8e44ad",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(211,84,0)": "#d35400"
	};

	window.rgbColorsToTintedColors = {
		"rgb(142,68,173)": "rgb(229,152,102)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(210,180,222)"
	};
	});

	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$("#restart").on('touchstart', function() {
		
			canRestart = false;
			$("#gameoverscreen").fadeOut();
	});

}
else {
	$("#restart").on('mousedown', function() {
		
		location.reload();
		location.reload();
		canRestart = false;
		$("#gameoverscreen").fadeOut();
	});


}
	
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$("#restartBtn").on('touchstart', function() {
			
			init(1);
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});

	}
	else {
		$("#restartBtn").on('mousedown', function() {
			location.reload();
			location.reload();
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});


	}

}
function inside (point, vs) {
	
	var x = point[0], y = point[1];
	
	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];
		
		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	
	return inside;
};



