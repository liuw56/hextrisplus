function Text(x,y,text,font,color,incrementFunction){
	this.x = x;
	this.y = y;
	this.font = font;
	this.color = color;
	this.opacity =1;
	this.text = text;
	this.alive=1;
	this.draw = function(){
		if (this.alive>0) {
			ctx.globalAlpha = this.opacity;
			renderText((this.x + gdx), (this.y + gdy),50,this.color,this.text);
			ctx.globalAlpha =1;
			incrementFunction(this);
			return true;
		}
		else {
			return false;
		}
	};
}

function fadeUpAndOut(text){
	text.opacity -= MainHex.dt * Math.pow(Math.pow((1-text.opacity), 1/3)+1,3)/100;
	text.alive = text.opacity;
	text.y -= 3 * MainHex.dt;
}

function renderText(x, y, fontSize, color, text, font) {
	var ctx_1 = gameState==5?c:ctx;
	ctx_1.save();
	if (!font) {
		var font = '20px Exo';
	}

	fontSize *= settings.scale;
	ctx_1.font = fontSize + font;
	ctx_1.textAlign = 'center';
	ctx_1.fillStyle = color;
	ctx_1.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
	ctx_1.restore();
}
