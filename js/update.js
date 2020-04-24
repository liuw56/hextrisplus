//remember to update history function to show the respective iter speeds
function update(hex, wave, dt, blocks, playCode) {		
	hex.dt = dt;
	if (gameState == 1 ) {
		wave.update();
		if (hex.ct - wave.prevTimeScored > 1000) {
			wave.prevTimeScored = hex.ct;
		}
	}else if(gameState==5){
		wave[playCode].update();
		// wave[1].update();
		if (hex.ct - wave[playCode].prevTimeScored > 1000) {
			wave[playCode].prevTimeScored = hex.ct;
		}
		// if (hex.ct - wave[1].prevTimeScored > 1000) {
		// 	wave[1].prevTimeScored = hex.ct;
		// }
	}
	var lowestDeletedIndex = 99;
	var i;
	var j;
	var k;
	var block;
	
	if(gameState!=5){	
		for (i = 0; i < blocks.length; i++) {
			hex.doesBlockCollide(wave, blocks[i]);
			if (!blocks[i].settled) {
				if (!blocks[i].initializing) blocks[i].distFromHex -= blocks[i].iter * dt * settings.scale;
			} else if (!blocks[i].removed) {
				blocks[i].removed = 1;
			}
		}

		for (i = 0; i < hex.blocks.length; i++) {
			for (j = 0; j < hex.blocks[i].length; j++) {
				if (hex.blocks[i][j].checked ==1 ) {
					consolidateBlocks(hex,hex.blocks[i][j].attachedLane,hex.blocks[i][j].getIndex());
					hex.blocks[i][j].checked=0;
				}
			}
		}

		for (i = 0; i < hex.blocks.length; i++) {
			lowestDeletedIndex = 99;
			for (j = 0; j < hex.blocks[i].length; j++) {
				block = hex.blocks[i][j];
				if (block.deleted == 2) {
					hex.blocks[i].splice(j,1);
					blockDestroyed(wave);
					if (j < lowestDeletedIndex) lowestDeletedIndex = j;
					j--;
				}
			}
	
			if (lowestDeletedIndex < hex.blocks[i].length) {
				for (j = lowestDeletedIndex; j < hex.blocks[i].length; j++) {
					hex.blocks[i][j].settled = 0;
				}
			}
		}

		
			for (i = 0; i < hex.blocks.length; i++) {
				for (j = 0; j < hex.blocks[i].length; j++) {
					block = hex.blocks[i][j];
					hex.doesBlockCollide(wave,block, j, hex.blocks[i]);
					if (!hex.blocks[i][j].settled) {
						hex.blocks[i][j].distFromHex -= block.iter * dt * settings.scale;
					}
				}
			}
		
		}
		 else{

			for (i = 0; i < blocks[playCode].length; i++) {
				hex.doesBlockCollide(wave[playCode], blocks[playCode][i]);
				if (!blocks[playCode][i].settled) {
					if (!blocks[playCode][i].initializing) blocks[playCode][i].distFromHex -= blocks[playCode][i].iter * dt * settings.scale;
				} else if (!blocks[playCode][i].removed) {
					blocks[playCode][i].removed = 1;
				}
			}
	
			
	}

	// used at both state
	for (i = 0; i < hex.blocks.length; i++) {
		for (j = 0; j < hex.blocks[i].length; j++) {
			if (hex.blocks[i][j].checked ==1 ) {
				consolidateBlocks(hex,hex.blocks[i][j].attachedLane,hex.blocks[i][j].getIndex());
				hex.blocks[i][j].checked=0;
			}
		}
	}

	for (i = 0; i < hex.blocks.length; i++) {
		lowestDeletedIndex = 99;
		for (j = 0; j < hex.blocks[i].length; j++) {
			block = hex.blocks[i][j];
			if (block.deleted == 2) {
				hex.blocks[i].splice(j,1);
				blockDestroyed(wave);
				if (j < lowestDeletedIndex) lowestDeletedIndex = j;
				j--;
			}
		}

		if (lowestDeletedIndex < hex.blocks[i].length) {
			for (j = lowestDeletedIndex; j < hex.blocks[i].length; j++) {
				hex.blocks[i][j].settled = 0;
			}
		}
	}

	for (i = 0; i < hex.blocks.length; i++) {
		for (j = 0; j < hex.blocks[i].length; j++) {
			block = hex.blocks[i][j];
			hex.doesBlockCollide(wave,block, j, hex.blocks[i]);
			if (!hex.blocks[i][j].settled) {
				hex.blocks[i][j].distFromHex -= block.iter * dt * settings.scale;
			}
		}
	}

	if(gameState !=5){
		for(i = 0; i < blocks.length;i++){
			if (blocks[i].removed == 1) {
				blocks.splice(i,1);
				i--;
			}
		}	
	}else{
		for(i = 0; i < blocks[playCode].length;i++){
			if (blocks[playCode][i].removed == 1) {
				blocks[playCode].splice(i,1);
				i--;
			}
		}
	}
	
	hex.ct += dt;
}

function writeHighScoresInterface(){
	writeHighScores();
	return;
}

function exportSaveStateInterfaceInUpdate(){
	return exportSaveState();
}

function search(twoD,oneD){
	// Searches a two dimensional array to see if it contains a one dimensional array. indexOf doesn't work in this case
	for(var i=0;i<twoD.length;i++){
		if(twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
			return true;
		}
	}
	return false;
}

function floodFill(hex, side, index, deleting) {
	if (hex.blocks[side] === undefined || hex.blocks[side][index] === undefined) return;

	//store the color
	var color = hex.blocks[side][index].color;
	//nested for loops for navigating the blocks
	for(var x =-1;x<2;x++){
		for(var y =-1;y<2;y++){
			//make sure the they aren't diagonals
			if(Math.abs(x)==Math.abs(y)){continue;}
			//calculate the side were exploring using mods
			var curSide =(side+x+hex.sides)%hex.sides;
			//calculate the index
			var curIndex = index+y;
			//making sure the block exists at this side and index
			if(hex.blocks[curSide] === undefined){continue;}
			if(hex.blocks[curSide][curIndex] !== undefined){
				// checking equivalency of color, if its already been explored, and if it isn't already deleted
				if(hex.blocks[curSide][curIndex].color == color && search(deleting,[curSide,curIndex]) === false && hex.blocks[curSide][curIndex].deleted === 0 ) {
					//add this to the array of already explored
					deleting.push([curSide,curIndex]);
					//recall with next block explored
					floodFill(hex,curSide,curIndex,deleting);
				}
			}
		}
	}
}

function consolidateBlocks(hex,side,index){
	//record which sides have been changed
	var sidesChanged =[];
	var deleting=[];
	var deletedBlocks = [];
	//add start case
	deleting.push([side,index]);
	//fill deleting	
	floodFill(hex,side,index,deleting);
	//make sure there are more than 3 blocks to be deleted
	if(deleting.length<3){return;}
	var i;
	for(i=0; i<deleting.length;i++) {
		var arr = deleting[i];
		//just making sure the arrays are as they should be
		if(arr !== undefined && arr.length==2) {
			//add to sides changed if not in there
			if(sidesChanged.indexOf(arr[0])==-1){
				sidesChanged.push(arr[0]);
			}
			//mark as deleted
			hex.blocks[arr[0]][arr[1]].deleted = 1;
			deletedBlocks.push(hex.blocks[arr[0]][arr[1]]);
		}
	}

	// add scores
	var now = hex.ct;
	if(now - hex.lastCombo < settings.comboTime ){
		settings.comboTime = (1/settings.creationSpeedModifier) * (waveone.nextGen/16.666667) * 3;
		hex.comboMultiplier += 1;
		hex.lastCombo = now;
		var coords = findCenterOfBlocks(deletedBlocks);
		hex.texts.push(new Text(coords['x'],coords['y'],"x "+hex.comboMultiplier.toString(),"bold Q","#fff",fadeUpAndOut));
	}
	else{
		settings.comboTime = 240;
		hex.lastCombo = now;
		hex.comboMultiplier = 1;
	}
	var adder = deleting.length * deleting.length * hex.comboMultiplier;
	hex.texts.push(new Text(hex.x,hex.y,"+ "+adder.toString(),"bold Q ",deletedBlocks[0].color,fadeUpAndOut));
		hex.lastColorScored = deletedBlocks[0].color;
	if(hex==hex1){
		p1Score+=adder;
	}else if(hex==hex2){
		p2Score+=adder;
	}else{
		score += adder;
	}
}

function blockDestroyed(wave) {
	if (wave.nextGen > 1350) {
		wave.nextGen -= 30 * settings.creationSpeedModifier;
	} else if (wave.nextGen > 600) {
		wave.nextGen -= 8 * settings.creationSpeedModifier;
	} else {
		wave.nextGen = 600;
	}

	if (wave.difficulty < 35) {
		wave.difficulty += 0.085 * settings.speedModifier;
	} else {
		wave.difficulty = 35;
	}
}

function findCenterOfBlocks(arr) {
	var avgDFH = 0;
	var avgAngle = 0;
	for (var i = 0; i < arr.length; i++) {
		avgDFH += arr[i].distFromHex;
		var ang = arr[i].angle;
		while (ang < 0) {
			ang += 360;
		}
		
		avgAngle += ang % 360;
	}

	avgDFH /= arr.length;
	avgAngle /= arr.length;

	return {
		x:trueCanvas.width/2 + Math.cos(avgAngle * (Math.PI / 180)) * avgDFH,
		y:trueCanvas.height/2 + Math.sin(avgAngle * (Math.PI / 180)) * avgDFH
	};
}

