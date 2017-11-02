export const judge = (lat, lon, radius) => {
  let polygons = window.fstAreas;
  if(polygons === false) return false;      //当前无台风
  let circle = {
    center: [lat, lon],
    radius: radius * 1.852,     //海里转公里
  }
  if (Array.isArray(polygons) && polygons.length) {
    for(let polygon of polygons) {
      let inPolygon = isPointInPolygon({ x: lon, y: lat }, polygon);
      if(inPolygon) return true;
      let bool = containPolygonByCircle(polygon, circle);
      if(bool) return true;
    }
  }
  return false;
}

const isPointInPolygon = (point, polygon) => {        //圆 是否在多边形内
  let px = point.x,
      py = point.y,
      flag = false;
  for (let i = 0, l = polygon.length, j = l - 1; i < l; j = i, i++) {
    let p1 = polygon[i],
        p2 = polygon[j];
    let sx = p1[1],
        sy = p1[0],
        tx = p2[1],
        ty = p2[0];

    if ((sx === px && sy === py) || (tx === px && ty === py)) return true;

    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      let x = sx + (py - sy) * (tx - sx) / (ty - sy);

      if (x === px) return true;
      if (x > px) flag = !flag;
    }
  }
  return flag
}

const containPolygonByCircle = (polygon, circle) => {     //圆 多边形是否相交
  for(let p of polygon) {
    if(L.latLng(p).distanceTo(circle.center) <= circle.radius * 1000) {
      return true;
    }
  }
  return false;
}