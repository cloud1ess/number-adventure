export default {
	set: function (name, value, exdays) {
		let d = new Date();
		exdays = exdays || 999;
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		document.cookie = name + "=" + value + "; expires=" + d.toUTCString();
	},

	get: function (name) {
		let name = name + "=";
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	}
}
