class LineSegment {
	constructor(x0, y0, x1, y1) {
		this.v0 = createVector(x0, y0);
		this.v1 = createVector(x1, y1);
	}

	draw() {
		stroke(255);
		line(this.v0.x, this.v0.y, this.v1.x, this.v1.y);
	}
}


class Ray {
	constructor(position, direction) {
		this.position  = position;
		this.direction = direction;
	}

	cast(segment) {
		const x1 = segment.v0.x;
		const y1 = segment.v0.y;
		const x2 = segment.v1.x;
		const y2 = segment.v1.y;
		
		const x3 = this.position.x;
		const y3 = this.position.y;
		const x4 = this.position.x + this.direction.x;
		const y4 = this.position.y + this.direction.y;

		const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (denominator == 0) {
			return;  // Lines are parallell.
		}

		const t =  ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

		if (0 < t && t < 1 && 0 < u) {
			let result = createVector();
			result.x = this.position.x + this.direction.x * u;
			result.y = this.position.y + this.direction.y * u;
			return result;
		} else {
			return;  // Lines do not intersect.
		}

	}

	draw() {
		stroke(255);
		const size = 16;
		line(this.position.x, this.position.y, this.position.x + this.direction.x * size, this.position.y + this.direction.y * size);
	}
}

class RaySource {
	constructor(position, direction) {
		this.position  = position;
		this.direction = direction;

		this.rays = [];
		let delta = TWO_PI / 200;
		for (var i = 0; i < TWO_PI - delta; i += delta) {
			this.rays.push(new Ray(this.position, p5.Vector.fromAngle(i)));
		}
	}

	draw(segments) {
		let x = this.position.x;
		let y = this.position.y;
		smooth();

		for (let ray of this.rays) {
			
			let closest_distance = Infinity;
			let closest_point 	 = null;
			
			for (let segment of segments) {
				let point = ray.cast(segment);
				if (point) {
					let distance = Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2);
					if (distance < closest_distance) {
						closest_distance = distance;
						closest_point 	 = point;
					}
				}
			}

			if (closest_point) {
				let px = closest_point.x;
				let py = closest_point.y;
				ellipse(px, py, 2, 2);
				stroke(255, 100);
				line(x, y, px, py);
			}
		}
		stroke(255);
		ellipse(this.position.x, this.position.y, 4, 4);
		noSmooth();
	}
}




let lineSegments = [];
let source;
function setup() {
	createCanvas(400, 400);

	lineSegments.push(new LineSegment(0, 0, 0, 400));
	lineSegments.push(new LineSegment(0, 0, 400, 0));
	lineSegments.push(new LineSegment(400, 400, 400, 0));
	lineSegments.push(new LineSegment(400, 400, 0, 400));

	for (let i = 0; i < 5; ++i) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);

		lineSegments.push(new LineSegment(x1, y1, x2, y2));
	}

	source = new RaySource(createVector(100, 200), createVector(1, 0));
}


function draw() {
  background(0);

  if (keyIsDown(UP_ARROW)) {
  	source.position.x += source.direction.x;
  	source.position.y += source.direction.y;
  } else if (keyIsDown(DOWN_ARROW)) {
  	source.position.x += source.direction.x;
  	source.position.y += source.direction.y;
  }

  source.direction = createVector(mouseX - source.position.x, mouseY - source.position.y).normalize();

 
 	for (let lineSegment of lineSegments) {
 		lineSegment.draw();
 	}
  source.draw(lineSegments);
}

