import CanvasRender from './CanvasRender.js'
import MathUtils from './MathUtils.js'

export default function (canvasElement, hitBox = {}) {
	let pos = {x: 0, y: 0};
	let realPos = {x: 0, y: 0};
	let parentPos = {x: 0, y: 0};
	let rotation = 0;
	let hidden = false;
	let toDraw = [];
	let children = [];
	let eventCallbacks = {};
	let mouseHitBox = hitBox;
	let mouseEnabled = {mousedown: false, mouseup: false, mousemove: false, mousewheel: false};
	let canvas
	 
	if (canvasElement) {
		canvas = canvasElement.getContext("2d");
		canvasElement.addEventListener('mousedown', globalMouseHandle.bind(this), false);
		canvasElement.addEventListener('mouseup', globalMouseHandle.bind(this), false);
		canvasElement.addEventListener('mousemove', globalMouseHandle.bind(this), false);
		canvasElement.addEventListener('mousewheel', globalMouseHandle.bind(this), false);
		canvasElement.addEventListener('mouseout', globalMouseHandle.bind(this), false);
	}

	function addChild (panel) {
		children.push(panel);
	}

	function removeChild (panel) {
		let i = children.length;
		while (i >= 0) {
			if (panel === children[i]) {
				children.splice(i, 1);
				i = -1;
			}
			i--;
		}
	}

	function removeAllChildren () {
		let i = children.length - 1;
		while (i >= 0) {
			children[i].tearDown(true);
			children.splice(i, 1);
			i--;
		}
	}

	// ------ Mouse ------

	function setHitBox (box = mouseHitBox) {
		mouseHitBox = box;
	}

	function globalMouseHandle (evt) {
		let rect = canvasElement.getBoundingClientRect();
		let data = {
			handled: false,
			type: evt.type,
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};

		if (evt.type === 'mousewheel') {
			data.scroll = evt.wheelDelta;

		}
		sinkMouseEvent(data);
	}

	function sinkMouseEvent (evt) {
		let i = children.length - 1;

		while (i >= 0 && !evt.handled) {
			children[i].sinkMouseEvent(evt);
			i--;
		}
		if (!evt.handled && mouseEnabled[evt.type]) {
			if (!mouseHitBox || MathUtils.pointInRect(evt.x, evt.y, realPos.x + mouseHitBox.x1, realPos.y + mouseHitBox.y1, realPos.x + mouseHitBox.x2, realPos + mouseHitBox.y2)) {
				fireEvent(evt);
			}
		}
	}

	// ------ Render ------

	function render (parentCanvas) {
		let i = 0, toRender, data;
		parentCanvas = parentCanvas || canvas

		if (canvasElement) {
			canvasElement.width = canvasElement.width;
			canvas.fillStyle = "rgba(255, 255, 255, 0)";
			canvas.fillRect(0, 0, canvasElement.width, canvasElement.height);
		}

		if (!hidden) {
			while (i < toDraw.length) {
				toRender = toDraw[i];
				data = toRender.data;
				data.x = data.origX + realPos.x;
				data.y = data.origY + realPos.y;
				if (data.from && data.to) {
					data.from.x = data.from.x + realPos.x;
					data.from.y = data.from.y + realPos.y;
					data.to.x = data.to.x + realPos.x;
					data.to.y = data.to.y + realPos.y;
				}
				data.rotation = data.origRot + rotation;

				toRender.render(parentCanvas, data);
				i++;
			}

			renderChildren(parentCanvas);
		}
	}

	function renderChildren (parentCanvas) {
		let i = 0;

		while (i < children.length) {
			children[i].render(parentCanvas);
			i++;
		}
	}

	// ------ Drawing ------

	function clear () {
		toDraw.length = 0;

		let i = 0;
		while (i < children.length) {
			children[i].clear();
			i++;
		}
	}

	function drawLine (data) {
		addToDrawList(CanvasRender.line, data);
	}
	function drawRect (data) {
		addToDrawList(CanvasRender.rect, data);
	}
	function drawStrokeRect (data) {
		addToDrawList(CanvasRender.strokeRect, data);
	}
	function drawCircle (data) {
		addToDrawList(CanvasRender.circle, data);
	}
	function drawPath (data) {
		addToDrawList(CanvasRender.path, data);
	}
	function drawImage (data) {
		addToDrawList(CanvasRender.image, data);
	}
	function drawText (data) {
		addToDrawList(CanvasRender.text, data);
	}
	function drawSprite (data) {
		addToDrawList(CanvasRender.sprite, data);
	}
	function drawImageData (data) {
		addToDrawList(CanvasRender.imageData, data);
	}

	function addToDrawList (renderFunc, data) {
		data.origX = data.x || 0;
		data.origY = data.y || 0;
		data.origRot = data.rotation || 0;

		toDraw.push({render: renderFunc, data: data});
	}

	function playSprite (id) {
		let i = toDraw.length - 1;

		while (i >= 0) {
			if (toDraw[i].data.id === id) {
				toDraw[i].data.playing = true;
			}
			i--;
		}
	}

	// ------ Positioning ------

	function setPos (newPos) {
		pos.x = newPos.x;
		pos.y = newPos.y;

		updateRealPos(parentPos);
	}

	function updateRealPos (newParentPos) {
		parentPos.x = newParentPos.x;
		parentPos.y = newParentPos.y;
		realPos.x = parentPos.x + pos.x;
		realPos.y = parentPos.y + pos.y;

		let i = children.length - 1;

		while (i >= 0) {
			children[i].updateRealPos(realPos);
			i--;
		}
	}

	function setRotation (rot) {
		rotation = rot;
	}

	// ------ Events ------

	function fireEvent (event) {
		if (eventCallbacks[event.type]) {
			let i = eventCallbacks[event.type].length - 1;

			while (i >= 0) {
				eventCallbacks[event.type][i](event);
				i--;
			}
		}
	}

	function addEventCallback (type, callback) {
		if (!eventCallbacks[type]) {
			eventCallbacks[type] = [];
		}
		mouseEnabled[type] = true

		eventCallbacks[type].push(callback);
	}

	function tearDown (removeFromParent) {
		toDraw.length = 0;
		eventCallbacks = null;
		mouseEnabled = null
		canvas = null
		if (canvasElement) {
			canvasElement.removeEventListener('mousedown', globalMouseHandle.bind(this), false);
			canvasElement.removeEventListener('mouseup', globalMouseHandle.bind(this), false);
			canvasElement.removeEventListener('mousemove', globalMouseHandle.bind(this), false);
			canvasElement.removeEventListener('mousewheel', globalMouseHandle.bind(this), false);
			canvasElement.removeEventListener('mouseout', globalMouseHandle.bind(this), false);
		}

		let i = children.length - 1;

		while (i >= 0) {
			children[i].tearDown(false);
			children.splice(i, 1);
			i--;
		}
		children.length = 0;
	}

	return {
		addChild: addChild,
		removeChild: removeChild,
		removeAllChildren: removeAllChildren,
		render: render,
		clear: clear,
		drawLine: drawLine,
		drawRect: drawRect,
		drawStrokeRect: drawStrokeRect,
		drawCircle: drawCircle,
		drawPath: drawPath,
		drawImage: drawImage,
		drawText: drawText,
		drawSprite: drawSprite,
		drawImageData: drawImageData,
		playSprite: playSprite,
		setPos: setPos,
		setRotation: setRotation,
		setHitBox: setHitBox,
		fireEvent: fireEvent,
		sinkMouseEvent: sinkMouseEvent,
		addEventCallback: addEventCallback,
		tearDown: tearDown
	}
}
