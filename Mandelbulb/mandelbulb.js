// The object to hold all the information about the plot:
let params = {};

// Change this to whatever the div is called:
params.div_id = "div_plot_area";

// An array of objects, one per data point:
params.data = [];
params.default_point_height = 3;
params.point_type = 'square';
params.geom_type = 'point';


let pi = 3.14159265;
let maxIterations = 20;
let maxX = 1;
let maxY = 1;
let maxZ = 1;
let step = 0.01;
let maxDistance = Math.sqrt(maxX * maxX + maxY * maxY + maxZ * maxZ);

init_plot();


function init_plot() {
  let pts = createPoints();
  params.data = [];

  for (let i = 0; i < pts.length; i++) {

    let p = {
      x: pts[i].x,
      y: pts[i].y,
      z: pts[i].z
    };

    let color = getColor(p);
    p.color = 65536 * color.r + 256 * color.g + color.b;

    params.data.push(p);

  }
  // Make the plot:
  three_d.make_scatter(params);
}


function createPoints() {
  var pnts = [];

  for (let x = maxX * -1; x <= maxX; x = x + step) {
    for (let y = maxY * -1; y <= maxY; y = y + step) {
      for (let z = maxZ * -1; z <= maxZ; z = z + step) {

        let c = { x: x, y: y, z: z };
        let i = getDivergingIteration(c);

        if (i >= maxIterations) {
          pnts.push(c);
        };
      }
    }
  }

  return pnts;
}


function getColor(p) {
  let color = { r: 2, g: 166, b: 43 }

  let pR = color.r / maxDistance;
  let pG = color.g / maxDistance;
  let pB = color.b / maxDistance;

  let distance = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

  return {
    r: pR * (maxDistance - distance),
    g: pG * (maxDistance - distance),
    b: pB * (maxDistance - distance)
  };
}

function getDivergingIteration(c) {
  let i = 0;

  let zn = { x: 0, y: 0, z: 0 };

  while (i < maxIterations) {

    let distance = Math.sqrt(zn.x * zn.x + zn.y * zn.y + zn.z * zn.z);

    if (distance > maxDistance) //is divergent
      break;

    //zn ^ n
    zn = pow(zn, 8);

    //zn ^ n + c
    zn = sum(zn, c);

    i++;
  }

  return i;
}


function pow(p, n) {

  let x = p.x;
  let y = p.y;
  let z = p.z;

  let r = Math.sqrt(x * x + y * y + z * z);
  let theta = Math.atan2(Math.sqrt(x * x + y * y), z);
  let phi = Math.atan2(y, x);

  tx = Math.pow(r, n) * Math.sin(theta * n) * Math.cos(phi * n);
  ty = Math.pow(r, n) * Math.sin(theta * n) * Math.sin(phi * n);
  tz = Math.pow(r, n) * Math.cos(theta * n);

  return { x: tx, y: ty, z: tz };
}


function sum(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y,
    z: point1.z + point2.z
  }
}
