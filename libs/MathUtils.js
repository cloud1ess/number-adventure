export default {
	distanceBetweenPoints: function (a, b) {
		let xDiff = a.x - b.x
		let yDiff = a.y - b.y

		if (xDiff === 0) return Math.abs(yDiff)
		else if (yDiff === 0) return Math.abs(xDiff)

		return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
	},

	pointInRect: function (x, y, rx, ry, rx2, ry2) {
		return !(x < rx || x > rx2 || y < ry || y > ry2);
	},

	rectsOverlap: function (r11, r12, r21, r22) {
		return Math.min(r11.x, r12.x) < Math.max(r21.x, r22.x) &&
					 Math.min(r11.y, r12.y) < Math.max(r21.y, r22.y) &&
					 Math.max(r11.x, r12.x) > Math.min(r21.x, r22.x) &&
           Math.max(r11.y, r12.y) > Math.min(r21.y, r22.y)
	},

	angleBetweenTwoPoints: function (a, b) {
		return Math.atan2(b.y - a.y, b.x - a.x);
	},

	pointsWithinRange: function (a, b, range) {
		return this.distanceBetweenPoints(a, b) <= range;
	},

	pointFromVector: function (origin, angle, distance) {
		return {
			x: origin.x + Math.cos(angle) * distance,
			y: origin.y + Math.sin(angle) * distance
		}
	},

  addPoints: function (pointA, PointB) {
    return {
      x: pointA.x + PointB.x,
      y: pointA.y + PointB.y
    }
  },

  subtractPoints: function (pointA, PointB) {
    return {
      x: pointA.x - PointB.x,
      y: pointA.y - PointB.y
    }
  },

	isEven: function (a) {
		let half = a/2
		return Math.floor(half) === half
	},

  sign: function (a) {
    return Math.abs(a)/a;
  },

  changeSign: function (a) {
    return a*-1;
  },

  dot: function (a, b) {
    return a.x * b.x + a.y * b.y;
  },

	pointsAreEqual: function (a, b) {
		return a.x === b.x && a.y === b.y
	},

	randomColour: function () {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
	},

  intersectionOfLineAndCircle: function (circlePos, circleRadius, pointA, pointB) {
    let intersections ;

    let ABLen = this.distanceBetweenPoints(pointA, pointB);
    let ABLine = this.subtractPoints(pointB, pointA);
    let circleALine = this.subtractPoints(circlePos, pointA);
    let dX = ABLine.x/ABLen;
    let dY = ABLine.y/ABLen;
    let R = circleRadius;

    // Now the line equation is x = dX*t + Ax, y = dY*t + Ay with 0 <= t <= 1.
    // compute the value t of the closest point to the circle center (Cx, Cy)
    let t = dX*circleALine.x + dY*circleALine.y;

    // This is the projection of C on the line from A to B.
    // compute the coordinates of the point E on line and closest to C
    let pointE = {
      x: t*dX+pointA.x,
      y: t*dY+pointA.y
    }

    // compute the euclidean distance from E to C
    let LEC = this.distanceBetweenPoints(circlePos, pointE);

    // test if the line intersects the circle
    if( LEC < R) {
      // compute distance from t to circle intersection point
      let dt = Math.sqrt(R*R - LEC*LEC);
      let point1 = {
            x: pointA.x,
            y: pointA.y
          },
          point2= {
            x: pointB.x,
            y: pointB.y
          };

      if(t - dt > 0){
        point1.x = pointA.x + (t-dt)*dX;
        point1.y = pointA.y + (t-dt)*dY;
      }

      if(t + dt < ABLen){
        point2.x = pointA.x + (t+dt)*dX;
        point2.y = pointA.y + (t+dt)*dY;
      }

      if(t - dt < ABLen && t + dt > 0){
        intersections = [point1, point2];
      }
    }

    return intersections;

  }
}
