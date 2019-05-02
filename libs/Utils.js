export default {
  chooseRandom : function (array) {
    return array[Math.floor(Math.random()*array.length)]
  },
  chooseRandomFromSparse : function (array) {
    let tempArray = [];
    array.forEach(function (value) {
      if (value) tempArray.push(value)
    })
    return this.chooseRandom(tempArray);
  },
  remove: function (arr, item) {
    arr.splice(arr.indexOf(item), 1);
  },
  capitalise: function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  },
  deepSearch: function (object, searchTerm) {
    let i, found;
    for (i in object) {
      if (object.hasOwnProperty(i)) {
        if (object[i] === searchTerm) {
          found = found || {}
          found[i] = searchTerm

        } else if (typeof object[i] === 'object' && object[i] !== null) {
          let result = this.deepSearch(object[i], searchTerm);
          if (result) {
            found = found || {}
            found[i] = result
          }
        }
      }
    }
    return found
  },
  copy: function (original, copied) {
		let i;
    copied = copied || (typeof original === 'object'? (original.length || original.length === 0 ? [] : {}) : original);
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
	},
  combine: function (a, b) {
    let combined = {};
    let i

    for (i in a) {
      if (a.hasOwnProperty(i)) {
        combined[i] = a[i]
      }
    }

    for (i in b) {
      if (b.hasOwnProperty(i)) {
        combined[i] = b[i]
      }
    }

    return combined
  },
  deepCombine: function (a, b) {
    // B will overwrite values in A
    let combined = this.copy(a);
    let i;

    mergeBIntoA(combined, b)

    function mergeBIntoA (combinedBit, bBit) {
      for (i in bBit) {
        if (bBit.hasOwnProperty(i)) {
          if (bBit[i] instanceof Image) {
            combinedBit[i] = bBit[i];
          } else if (typeof bBit[i] === 'object' && bBit[i] !== null) {
            combinedBit[i] = combinedBit[i] || (bBit[i].length || bBit[i].length === 0 ? [] : {});
            mergeBIntoA(combinedBit[i], bBit[i]);
          } else {
            combinedBit[i] = bBit[i];
          }
        }
      }
    }

    return combined
  },
  createElement: function (type, parent, classes, props) {
    let element = document.createElement(type);
    if (!parent) {
      parent = document.body
    }
    if (classes) {
      classes.forEach(function (cssClass) {
        element.classList.add(cssClass)
      })
    }
    if (props) {
      for (let prop in props) {
        element[prop] = props[prop]
      }
    }
    parent.appendChild(element);
    return element
  },
  addTo: function (parent, key, value) {
    let originalValue = parent[key+'_o'] || parent[key];

    this.setValue(parent, key, originalValue + value)
  },
  setValue: function (parent, key, value) {
    let origKey = key+'_o'
    let modifyKey = key+'_m'
    value = value === undefined ? parent[origKey] || 0 : value

    if (parent[modifyKey]) {
      parent[origKey] = value;
      let totalMod = 1

      for (let i in parent[modifyKey]){
        totalMod += parent[modifyKey][i]
      }

      parent[key] = value * totalMod
    } else {
      parent[key] = value
    }
  },
  addModifier: function (parent, key, modifier, modifierId) {
    let origKey = key+'_o'
    let modifyKey = key+'_m'

    if (!parent[modifyKey]) {
      parent[modifyKey] = {};
      parent[origKey] = parent[key];
    }
    parent[modifyKey][modifierId] = modifier;

    this.setValue(parent, key)
  },
  removeModifier: function (parent, key, modifierId) {
    let modifyKey = key+'_m'

    if (!parent[modifyKey]) {
      return
    }
    delete parent[modifyKey][modifierId]

    this.setValue(parent, key)
  },
  last: function (arr) {
    return arr[arr.length-1]
  },
  randomise: function (arr) {
    const temp = this.copy(arr)
    const randomised = []
    while (temp.length) {
      let i = Math.floor(Math.random() * temp.length)
      randomised.push(temp[i])
      temp.splice(i, 1)
    }
    return randomised
  }
}
