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

	closest(x, y, segments) {
		let closestDistance = Infinity;
		let closestPoint 	 = null;

		for (let segment of segments) {
			let point = this.cast(segment);
			if (point) {
				let distance = Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestPoint 	  = point;
				}
			}
		}

		return closestPoint;
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
		let delta = TWO_PI / 300;
		for (var i = 0; i < TWO_PI - delta; i += delta) {
			this.rays.push(new Ray(this.position, p5.Vector.fromAngle(i)));
		}
	}

	draw(segments) {
		let sourceX = this.position.x;
		let sourceY = this.position.y;

		// Draw source ball.
		fill(255);
		ellipse(sourceX, sourceY, 4, 4);

		// Draw rays.
		stroke(255, 128);
		for (let ray of this.rays) {
			let point = ray.closest(sourceX, sourceY, segments);
			
			if (point) {
				line(sourceX, sourceY, point.x, point.y);
			}
		}
	}
}


function randomizeSegments() {
	lineSegments = [];

	// Walls.
	lineSegments.push(new LineSegment(0, 0, 0, windowHeight));
	lineSegments.push(new LineSegment(0, 0, windowWidth, 0));
	lineSegments.push(new LineSegment(windowWidth, windowHeight, windowWidth, 0));
	lineSegments.push(new LineSegment(windowWidth, windowHeight, 0, windowHeight));

	for (let i = 0; i < segmentCount; ++i) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);

		lineSegments.push(new LineSegment(x1, y1, x2, y2));
	}
}


let lineSegments = [];
let source;
let button;
let slider;
let segmentCount;
function setup() {
	createCanvas(windowWidth, windowHeight);
	smooth();

  button = createButton('Randomize segments');
  button.position(20, 20);
  button.mousePressed(() => {randomizeSegments(); render();});

  slider = createSlider(0, 32, 1);
  slider.position(20, 60);
  segmentCount = slider.value();

  fill(255);
  text("Segments: " + slider.value(), 20, 54);

	source = new RaySource(
		createVector(windowWidth/2, windowHeight/2), 
		createVector(1, 0)
	);

	randomizeSegments();
	render();
}


function draw() {
	let shouldUpdate = false;

  if (keyIsDown(UP_ARROW)) {
  	source.position.x += source.direction.x * 2;
  	source.position.y += source.direction.y * 2;
  	shouldUpdate = true;
  } else if (keyIsDown(DOWN_ARROW)) {
  	source.position.x += source.direction.x * 2;
  	source.position.y += source.direction.y * 2;
  	shouldUpdate = true;
  }

	let value = slider.value();
	if (value != segmentCount) {
		segmentCount = value;
		randomizeSegments();
		shouldUpdate = true;
	}

	if (shouldUpdate) {
		render();
	}
}


function render() {
  background(0);
  fill(255);
  text("Segments: " + slider.value(), 20, 54);

  source.direction = createVector(mouseX - source.position.x, mouseY - source.position.y).normalize();
 
 	for (let lineSegment of lineSegments) {
 		lineSegment.draw();
  }
  source.draw(lineSegments);

}

