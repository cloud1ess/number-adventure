let tasks = {};
let lastTime;
let stopped = true;
let currentId = 0;
let multiplier = 1;

function tick() {
	let task,
		time = new Date().getTime(),
		diff = (time - (lastTime || time)) * multiplier;

	lastTime = time;

	if (diff < 400) {
		for (task in tasks) {
			tasks[task].execute(diff, tasks[task]);
		}
	}

	if (!stopped) {
		window.requestAnimationFrame(tick);
	}
}

function tickHeartBeat(diff, data) {
	data.callback(diff);
}

function tickTimer(diff, timer) {
	timer.remaining -= diff;

	if (timer.remaining <= 0) {
		timer.callback();
		timer.remaining += timer.duration;

		if (!timer.repeat) {
      delete tasks[timer.id];
		}
	}
}

function paused(diff) {
}

function setExecutable(data) {
	data.execute = !data.duration && data.repeat ? tickHeartBeat : tickTimer
}

function generateId() {
	return currentId++;
}

export default {
	start: function () {
		lastTime = new Date().getTime();
		stopped = false;
		window.requestAnimationFrame(tick);
	},

	stop: function () {
		stopped = true;
    lastTime = null;
	},

	registerTask: function (callback, duration, repeat) {
		let id = generateId();

		tasks[id] = {
			id: id,
			remaining: duration,
			callback: callback,
			duration: duration,
			repeat: repeat
		}
		setExecutable(tasks[id]);

		return id;
	},

	unregisterTask: function (id) {
		delete tasks[id];
	},

	setSpeed: function (speed) {
		multiplier = speed;
	},

	pauseTask: function (id, newPaused) {
		if (newPaused) {
			tasks[id].execute = paused
		} else {
			setExecutable(tasks[id]);
		}
	},

	getSpeed: function () {
		return multiplier;
	}
}
