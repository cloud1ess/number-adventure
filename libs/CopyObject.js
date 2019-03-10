export default {
	copy: function (original, copied) {
		let i;
    copied = copied || (original.length || original.length === 0 ? [] : {});
		for (i in original) {
			if (original.hasOwnProperty(i)) {
				if (original[i] instanceof Image) {
					copied[i] = original[i];
				} else if (typeof original[i] === 'object' && original[i] !== null) {
					copied[i] = original[i].length || original[i].length === 0 ? [] : {};
					this.copy(original[i], copied[i]);
				} else {
					copied[i] = original[i];
				}
			}
		}
    return copied;
	}
}
