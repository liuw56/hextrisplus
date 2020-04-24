
function showText(text) {
	var messages = {
		'paused': "<div class='centeredHeader unselectable'>Game Paused</div>",
		'pausedAndroid': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://play.google.com/store/apps/details?id=com.hextris.hextrisadfree' target='_blank'Want to support the developers? Don't like ads? Tap for Hextris ad-free!</a></div>",
		'pausediOS': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://itunes.apple.com/us/app/hextris-ad-free/id912895524?mt=8' target='_blank'>Want to support the developers? Don't like ads? Tap for Hextris ad-free!</a></div>",
		'pausedOther': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='margin-top:10px;position:absolute;left:50%;margin-left:-190px;max-width:380px;font-size:18px;'><a href = 'http://hextris.github.io/' target='_blank'>Want to support the developers? Click here to buy one of the ad-free mobile versions!</a></div>",
		'start': "<div class='centeredHeader unselectable' style='line-height:80px;'>Press enter to start</div>"
	};

	if (text == 'paused') {
		if (settings.os == 'android') {
			text = 'pausedAndroid'
		} else if (settings.os == 'ios') {
            text = 'pausediOS'
        } else if (settings.platform == 'nonmobile') {
            text = 'pausedOther'
        }
	}

	if (text == 'gameover') {
	   //Clay('client.share.any', {text: 'Think you can beat my score of '+ score + ' in Super Cool Game?'})
		$("#gameoverscreen").fadeIn();
    	}
	$(".overlay").html(messages[text]);
	$(".overlay").fadeIn("1000", "swing");

}

function gameOverDisplay() {
	settings.ending_block=false;
	var c = document.getElementById("canvas");
	if(gameState==5) c = document.getElementById("canvas1");
	c.className = "blur";
	updateHighScores(); 
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0);
	}
	else {
		$("#currentHighScore").text(highscores[0])
	}
		$("#gameoverscreen").fadeIn();

	if(gameState!=5){
		$("#cont1").fadeIn();
		$("#buttonCont ").fadeIn();
		$("#socialShare").fadeIn();
		$("#restart").fadeIn();
	}else{
		document.getElementById("winner").innerHTML = winner;
		$("#cont2").fadeIn();
	}
	set_score_pos();
}

function updateHighScores (){
	$(".cScore").text(score);	
    $("#1place").text(highscores[0]);
    $("#2place").text(highscores[1]);
	$("#3place").text(highscores[2]);

}

function checkVisualElements(arg) {
	if (arg && $('#openSideBar').is(":visible")) $('#openSideBar').fadeOut(150, "linear");
	if (!$('#pauseBtn').is(':visible')) $('#pauseBtn').fadeIn(150, "linear");
	$('#fork-ribbon').fadeOut(150);
	if (!$('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear");
	if ($('#buttonCont').is(':visible')) $('#buttonCont').fadeOut(150, "linear");
}

function hideUIElements() {
	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').hide();
}

function showHelp() {
	if ($('#openSideBar').attr('src') == './images/btn_back.svg') {
		$('#openSideBar').attr('src', './images/btn_help.svg');
		if (gameState != 0 && gameState != -1 && gameState != 2) {
			$('#fork-ribbon').fadeOut(150, 'linear');
		}
	} else {
		$('#openSideBar').attr('src', './images/btn_back.svg');
		if (gameState == 0 && gameState == -1 && gameState == 2) {
			$('#fork-ribbon').fadeIn(150, 'linear');
		}
	}

	$("#inst_main_body").html("<div id = 'instructions_head'>HOW TO PLAY</div><p>The goal of Hextris is to stop blocks from leaving the inside of the outer gray hexagon.</p><p>" + (settings.platform != 'mobile' ? 'Press the right and left arrow keys' : 'Tap the left and right sides of the screen') + " to rotate the Hexagon." + (settings.platform != 'mobile' ? ' Press the down arrow to speed up the block falling' : '') + " </p><p>Clear blocks and get points by making 3 or more blocks of the same color touch.</p><p>Time left before your combo streak disappears is indicated by <span style='color:#f1c40f;'>the</span> <span style='color:#e74c3c'>colored</span> <span style='color:#3498db'>lines</span> <span style='color:#2ecc71'>on</span> the outer hexagon</p> <hr> <p id = 'afterhr'></p> By <a href='http://loganengstrom.com' target='_blank'>Logan Engstrom</a> & <a href='http://github.com/garrettdreyfus' target='_blank'>Garrett Finucane</a><br>Find Hextris on <a href = 'https://itunes.apple.com/us/app/id903769553?mt=8' target='_blank'>iOS</a> & <a href ='https://play.google.com/store/apps/details?id=com.hextris.hextris' target='_blank'>Android</a><br>More @ the <a href ='http://hextris.github.io/' target='_blank'>Hextris Website</a>");
	if (gameState == 1||gameState==5) {
		pause();
	}

	if ($("#pauseBtn").attr('src') == "./images/btn_pause.svg" && gameState != 0 && !infobuttonfading) {
		return;
	}

	$("#openSideBar").fadeIn(150, "linear");
	$('#helpScreen').fadeToggle(150, "linear");
}

function setBottomContainer(trueCanvas) {
	var buttonOffset = $("#buttonCont").offset().top;
	var playOffset = trueCanvas.height / 2 + 100 * settings.scale;
	var delta = buttonOffset - playOffset - 29;
	if (delta < 0) {
		$("#bottomContainer").css("margin-bottom", "-" + Math.abs(delta) + "px");
	}
}

function set_score_pos() {
	$("#cont1").css('margin-top', '0');
	var middle_of_container = ($("#cont1").height() / 2 + $("#cont1").offset().top);
	var top_of_bottom_container = $("#buttonCont").offset().top
	var igt = $("#highScoreInGameText")
	var igt_bottom = igt.offset().top + igt[0].offsetHeight
	var target_midpoint = (top_of_bottom_container + igt_bottom) / 2
	var diff = (target_midpoint - middle_of_container)
	$("#cont1").css("margin-top", diff + "px");
}



	
