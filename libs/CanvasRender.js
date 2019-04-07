const setStroke = (ctx, strokeData) => {
	Object.assign(ctx, strokeData)
	// ctx.lineWidth 
	// ctx.strokeStyle
}
const setFill = (ctx, fillColour) => {
	ctx.fillStyle = fillColour || ctx.fillStyle;
}

export default {
	line: function (ctx, data) {
		setStroke(ctx, data.stroke)
		ctx.beginPath();
		ctx.moveTo(data.from.x, data.from.y);
		ctx.lineTo(data.to.x, data.to.y);
		ctx.stroke();
	},

	rect: function (ctx, data) {
		ctx.beginPath();
		setFill(ctx, data.colour)
		setStroke(ctx, data.stroke)
		if (!data.rounded) {
			ctx.rect(data.x, data.y, data.wid, data.hei); 
		} else {
			const x = data.x
			const y = data.y
			const w = data.wid
			const h = data.hei
			const r = data.rounded
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x,  y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
		}
		if (data.stroke) ctx.stroke();
		if (data.colour) ctx.fill();
	},

	strokeRect: function (ctx, data) {
		setStroke(ctx, data.stroke)
		ctx.strokeRect(data.x, data.y, data.wid, data.hei);
	},

	fillRect: function (ctx, data) {
		setFill(ctx, data.colour)
		ctx.fillRect(data.x, data.y, data.wid, data.hei);
	},

	circle: function (ctx, data) {
		setFill(ctx, data.colour)
		setStroke(ctx, data.stroke)
		ctx.beginPath();
		ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
		if (data.stroke) ctx.stroke();
		if (data.colour) ctx.fill();
	},

	image: function (ctx, data) {
		if (typeof data.img === 'string') return;

		if (data.rotation != 0) {
			// rotate 45º image "imgSprite", based on its rotation axis located at x=20,y=30 and draw it on context "ctx" of the ctx on coordinates x=200,y=100
			//rotateAndPaintImage ( ctx, imgSprite, 45*TO_RADIANS, 200, 100, 20, 30 );
			ctx.translate(data.x - data.origX, data.y - data.origY);
			ctx.rotate(data.rotation);
			if (data.sx && data.sy) {
				ctx.drawImage(data.img, data.sx, data.sy, data.sWid, data.sHei, data.origX, data.origY, data.wid, data.hei);

			} else if (data.wid && data.hei) {
				ctx.drawImage(data.img, data.origX, data.origY, data.wid, data.hei);

			} else {
				ctx.drawImage(data.img, data.origX, data.origY);
			}
			ctx.rotate(-data.rotation);
			ctx.translate(-data.x + data.origX, -data.y + data.origY);

		} else {

			if (data.sx && data.sy) {
				ctx.drawImage(data.img, data.sx, data.sy, data.sWid, data.sHei, data.x, data.y, data.wid, data.hei);
			} else if (data.wid && data.hei) {
				ctx.drawImage(data.img, data.x, data.y, data.wid, data.hei);
			} else {
				ctx.drawImage(data.img, data.x, data.y);
			}
		}
	},

	text: function (ctx, data) {
		ctx.font = data.font;
		setFill(ctx, data.colour)
		ctx.fillText(data.text, data.x, data.y);
	},

	sprite: function (ctx, data) {
		if (data.playing) {
			data.frameTimer--;
			if (data.frameTimer <= 0) {
				data.frameTimer = data.frameRate;
				data.currentFrame++
				if (data.currentFrame >= data.frames.length) {
					data.currentFrame = 0;
					data.playing = data.autoPlay;
				}
			}
		}
		let xFrame = data.frames[data.currentFrame] * data.wid;

		if (data.rotation != 0) {
			ctx.translate(data.x - data.origX, data.y - data.origY);
			ctx.rotate(data.rotation);

			if (data.outputWid && data.outputHei) {
				ctx.drawImage(data.img, xFrame, 0, data.wid, data.hei, data.origX, data.origY, data.outputWid, data.outputHei);
			} else {
				ctx.drawImage(data.img, xFrame, 0, data.wid, data.hei, data.origX, data.origY, data.wid, data.hei);
			}

			ctx.rotate(-data.rotation);
			ctx.translate(-data.x + data.origX, -data.y + data.origY);

		} else {
			if (data.outputWid && data.outputHei) {
				ctx.drawImage(data.img, xFrame, 0, data.wid, data.hei, data.x, data.y, data.outputWid, data.outputHei);
			} else {
				ctx.drawImage(data.img, xFrame, 0, data.wid, data.hei, data.x, data.y, data.wid, data.hei);
			}

		}
	},

	path: function (ctx, data) {
		let path = data.path, i = 1;

		ctx.beginPath();
		setStroke(ctx, data.stroke)
		setFill(ctx, data.colour)
		ctx.moveTo(path[0].x, path[0].y);

		while (i < path.length) {
			ctx.lineTo(path[i].x, path[i].y);
			i++;
		}
    if (data.colour || data.closePath) ctx.closePath();
		if (data.stroke) ctx.stroke();
    if (data.colour) ctx.fill();
	},

	imageData: function (ctx, data) {
		ctx.putImageData(data.imgData, data.x, data.y, data.x, data.y, data.wid, data.hei);
	}
}
