function Block(fallingLane, color, iter, distFromHex, settled, hex) {
	// whether or not a block is rested on the center hex or another block
	this.settled = (settled === undefined) ? 0 : 1;
	this.height = settings.blockHeight;
	//the lane which the block was shot from
	this.fallingLane = fallingLane;
	this.checked=0;
	//the angle at which the block falls
	this.angle = 90 - (30 + 60 * fallingLane);
	//for calculating the rotation of blocks attached to the center hex
	this.angularVelocity = 0;
	this.targetAngle = this.angle;
	this.color = color;
	//blocks that are slated to be deleted after a valid score has happened
	this.deleted = 0;
	//blocks slated to be removed from falling and added to the hex
	this.removed = 0;
	//value for the opacity of the white blcok drawn over falling block to give it the glow as it attaches to the hex
	this.tint = 0;
	//value used for deletion animation
	this.opacity = 1;
	//boolean for when the block is expanding
	this.initializing = 1;
	this.ict = hex.ct;
	//speed of block
	this.iter = iter;
	//number of iterations before starting to drop
	this.initLen = settings.creationDt;
	//side which block is attached too
	this.attachedLane = 0;
	//distance from center hex
	// if (gameState == 5) {
	// 	this.distFromHex = distFromHex || settings.startDist * settings.twoPlayerScale;
	// } else {
		this.distFromHex = distFromHex || settings.startDist * settings.scale;
	// }

	this.incrementOpacity = function() {
		if (this.deleted) {
			//add shakes
			if (this.opacity >= 0.925) {
				var tLane = this.attachedLane - hex.position;
				tLane = hex.sides - tLane;
				while (tLane < 0) {
					tLane += hex.sides;
				}

				tLane %= hex.sides;
				hex.shakes.push({lane:tLane, magnitude:3 * (window.devicePixelRatio ? window.devicePixelRatio : 1) * (settings.scale)});
			}
			//fade out the opacity
			this.opacity = this.opacity - 0.075 * hex.dt;
			if (this.opacity <= 0) {
				//slate for final deletion
				this.opacity = 0;
				this.deleted = 2;
				if (gameState == 1 || gameState==0) {
					localStorage.setItem("saveState", exportSaveState());
				}
			}
		}
	};

	this.getIndex = function (){
		//get the index of the block in its stack
		var parentArr = hex.blocks[this.attachedLane];
		for (var i = 0; i < parentArr.length; i++) {
			if (parentArr[i] == this) {
				return i;
			}
		}
	};

	this.draw = function(attached, offset) {
		// var ctx_1;
		// this.height = settings.blockHeight;
		// if (gameState == 5) {
		// 	ctx_1 = c;
		// 	this.height = settings.blockHeight;
		// 	if (Math.abs(settings.twoPlayerScale - settings.prevScale) > 0.000000001) {
		// 		this.distFromHex *= (settings.twoPlayerScale/settings.prevScale);
		// 	}
		// }
		// else {
		// 	ctx_1 = ctx;
		// 	this.height = settings.blockHeight;
		// 	if (Math.abs(settings.scale - settings.prevScale) > 0.000000001) {
		// 		this.distFromHex *= (settings.scale/settings.prevScale);
		// 	}
		// }
		var ctx_1 = gameState==5?c:ctx;
		this.height = settings.blockHeight;
		if (Math.abs(settings.scale - settings.prevScale) > 0.000000001) {
			this.distFromHex *= (settings.scale/settings.prevScale);
		}

		this.incrementOpacity();
		if(attached === undefined)
			attached = false;

		if(this.angle > this.targetAngle) {
			this.angularVelocity -= angularVelocityConst * hex.dt;
		}
		else if(this.angle < this.targetAngle) {
			this.angularVelocity += angularVelocityConst * hex.dt;
		}

		if (Math.abs(this.angle - this.targetAngle + this.angularVelocity) <= Math.abs(this.angularVelocity)) { //do better soon
			this.angle = this.targetAngle;
			this.angularVelocity = 0;
		}
		else {
			this.angle += this.angularVelocity;
		}
		
		this.width = 2 * this.distFromHex / Math.sqrt(3);
		this.widthWide = 2 * (this.distFromHex + this.height) / Math.sqrt(3);
		//this.widthWide = this.width + this.height + 3;
		var p1;
		var p2;
		var p3;
		var p4;
		if (this.initializing) {
			var rat = ((hex.ct - this.ict)/this.initLen);
			if (rat > 1) {
				rat = 1;
			}
			p1 = rotatePoint((-this.width / 2) * rat, this.height / 2, this.angle);
			p2 = rotatePoint((this.width / 2) * rat, this.height / 2, this.angle);
			p3 = rotatePoint((this.widthWide / 2) * rat, -this.height / 2, this.angle);
			p4 = rotatePoint((-this.widthWide / 2) * rat, -this.height / 2, this.angle);
			if ((hex.ct - this.ict) >= this.initLen) {
				this.initializing = 0;
			}
		} else {
			p1 = rotatePoint(-this.width / 2, this.height / 2, this.angle);
			p2 = rotatePoint(this.width / 2, this.height / 2, this.angle);
			p3 = rotatePoint(this.widthWide / 2, -this.height / 2, this.angle);
			p4 = rotatePoint(-this.widthWide / 2, -this.height / 2, this.angle);
		}

		if (this.deleted) {
			ctx_1.fillStyle = "#FFF";
		} else if (gameState === 0) {
			if (this.color.charAt(0) == 'r') {
				ctx_1.fillStyle = rgbColorsToTintedColors[this.color];
			}
			else {
				ctx_1.fillStyle = hexColorsToTintedColors[this.color];
			}
		}
		else {
			ctx_1.fillStyle = this.color;
		}

		ctx_1.globalAlpha = this.opacity;
		if(gameState==5){
			if(offset!=undefined){												
				var baseX = trueCanvas.width / 4*3 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
			}else{
				var baseX = trueCanvas.width / 4 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
			}
			var baseY = trueCanvas.height / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdy;
		// position for player 2 blocks
		} else {
			var baseX = trueCanvas.width / 2  + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
			var baseY = trueCanvas.height / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdy;
		}
		
		ctx_1.beginPath();
		ctx_1.moveTo(baseX + p1.x, baseY + p1.y);
		ctx_1.lineTo(baseX + p2.x, baseY + p2.y);
		ctx_1.lineTo(baseX + p3.x, baseY + p3.y);
		ctx_1.lineTo(baseX + p4.x, baseY + p4.y);
		ctx_1.closePath();
		ctx_1.fill();

		if (this.tint) {
			if (this.opacity < 1) {
				if (gameState == 1 || gameState==0) {
					localStorage.setItem("saveState", exportSaveState());
				}

				this.iter = 2.25;
				this.tint = 0;
			}
			
			ctx_1.fillStyle = "#FFF";
			ctx_1.globalAlpha = this.tint;
			ctx_1.beginPath();
			ctx_1.moveTo(baseX + p1.x, baseY + p1.y);
			ctx_1.lineTo(baseX + p2.x, baseY + p2.y);
			ctx_1.lineTo(baseX + p3.x, baseY + p3.y);
			ctx_1.lineTo(baseX + p4.x, baseY + p4.y);
			ctx_1.lineTo(baseX + p1.x, baseY + p1.y);
			ctx_1.closePath();
			ctx_1.fill();
			
			this.tint -= 0.02 * hex.dt;
			if (this.tint < 0) {
				this.tint = 0;
			}
		}

		ctx_1.globalAlpha = 1;
	};
}

