export default {
	js: function (url, callback, errorCallback) {
		let script = document.createElement('script');

		script.onreadystatechange = callback;
		script.onload = callback;
		script.onerror = errorCallback;
		script.setAttribute("type", "text/javascript")
		script.setAttribute("src", url);

		try{
			document.body.appendChild(script);
		}
		catch(ex){
			console.log('Error loading js: '+url);
			console.log(ex);
		}
	},

	text: function (url, callback, errorCallback) {

		try{
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        callback(this.responseText);
      });
      xhr.addEventListener("error", errorCallback);
      xhr.addEventListener("abort", errorCallback);
      xhr.open("GET", url);
      xhr.send();
		}
		catch(ex){
			console.log('Error loading text file: '+url);
			console.log(ex);
      errorCallback('Exception: '+ex);
		}
	},

	image: function (url, callback, errorCallback) {
		let image = new Image();
		image.onload = callback;
		image.onerror = errorCallback;

		try{
			image.src = url;
		}
		catch(ex){
			console.log('Error loading image: '+url);
			console.log(ex);
		}

		return image;
	},

	css: function (url, callback) {
		let css = document.createElement("link");

		css.onreadystatechange = callback;
		css.onload = callback;
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		try{
			css.setAttribute("href", filename);
		}
		catch(ex){
			console.log('Error loading css: '+url);
			console.log(ex);
		}
	}
}
