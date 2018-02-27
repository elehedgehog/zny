
let layers = L.featureGroup();
const setLatlon = () =>{
    let mapBounds = map.getBounds();
    let left = mapBounds._southWest.lng,
        bottom = mapBounds._southWest.lat,
        top = mapBounds._northEast.lat,
        right = mapBounds._northEast.lng;

    let mapHeight = top - bottom,
        mapWidth = right - left;
    let num;    //分成3格
    let screen= $('#zmap').width();
    if(screen>=768&&screen<=1024){
        num = 4;
    } else if(screen>1024){
        num = 8;
    } else {
        num = 3;
    }
    
    let lonGrid =  mapWidth/num, //每格宽度
        latGrid = lonGrid;

    const opts = {              //线条样式
        color: '#aaa', 
        weight: 1,
    //   dashOffset: '2'
    };

    for(let i=1; i<=num-1; i++) {
        let pointLat = left+lonGrid*i;  //第i条纬线
        let bottomPoint = [bottom, pointLat],
            topPoint = [top, pointLat];
        let latlngs = [bottomPoint, topPoint];
        let polyline = L.polyline(latlngs, opts);
        polyline.id = 'latlngLine';
        layers.addLayer(polyline);

        if (pointLat > 180) {
            let remainder = Math.ceil((pointLat - 180) / 360)
            pointLat -= remainder * 360
        } else if (pointLat < -180) {
            let remainder = Math.floor((pointLat + 180) / 360)
            pointLat -= remainder * 360
        }

        let obj = { html: `<span class="ponitLatlon">${Math.abs(pointLat.toFixed(2))}${pointLat > 0 ? 'E' : 'W'}</span>` };
        let topDivIcon = L.marker(topPoint, {  icon: L.divIcon( Object.assign({}, obj, { iconAnchor: [-5, -5] }) ) });
        let bottomDivIcon = L.marker(bottomPoint, {  icon: L.divIcon( Object.assign({}, obj, { iconAnchor: [-5, 20] }) ) });
        topDivIcon.id = 'latlngDivIcon';
        bottomDivIcon.id = 'latlngDivIcon';
        layers.addLayer(topDivIcon);
        layers.addLayer(bottomDivIcon);
    }

    let lonGridNum = mapHeight/latGrid;    //经线条数
    for(let i=1; i<=lonGridNum; i++){
        let pointLon = top - lonGrid*i; 
        let leftPoint = [pointLon, left],
            rightPoint = [pointLon, right];
        let latlngs = [leftPoint, rightPoint];
        let polyline = L.polyline(latlngs, opts);
        polyline.id = 'latlngLine';
        layers.addLayer(polyline);

        let obj = { html: `<span class="ponitLatlon">${pointLon.toFixed(2)}${pointLon > 0 ? 'N' : 'S'}</span>` };
        let leftDivIcon = L.marker(leftPoint, { icon: L.divIcon( Object.assign({}, obj, { iconAnchor: [-5, 20] }) ) });
        let rightDivIcon = L.marker(rightPoint, { icon: L.divIcon( Object.assign({}, obj, { iconAnchor: [40, 20] }) ) });
        leftDivIcon.id = 'latlngDivIcon';
        rightDivIcon.id = 'latlngDivIcon';
        layers.addLayer(leftDivIcon);
        layers.addLayer(rightDivIcon);
    }

    layers.addTo(map).bringToBack();
}
setLatlon();
const resetLonlat = () => {
    map.removeLayer(layers);
    layers = L.featureGroup();
    setLatlon();
}
map.on('moveend', resetLonlat);
