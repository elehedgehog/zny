window.positionCenter = [];
// export let center = [23.16, 113.23];
const posIcon = L.icon({
    iconUrl: 'assets/typhoon_current@3x.png',
    iconSize: [30, 30],
    iconAnchor: [9, 25]
});
// let posMarker = L.marker(center, { icon: posIcon }).addTo(map);

let interval = setInterval(() => {          //获取位置
    if(window.locationInfo && window.locationInfo.lat && window.locationInfo.lon) {
        positionCenter = [window.locationInfo.lat, window.locationInfo.lon];
        // map.removeLayer(posMarker);
        let posMarker = L.marker(positionCenter, { icon: posIcon }).addTo(map);
        clearInterval(interval);
    }
}, 1000);