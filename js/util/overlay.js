let _overlays = new Object();

export const getMapInfo = () => {
	var container = $("#" + map.getContainer().id);
	var bounds = map.getBounds();
	var sw = bounds.getSouthWest(),
		ne = bounds.getNorthEast();
	sw = L.Util.GPS.gcjToWgs(sw.lat,sw.lng);
	ne = L.Util.GPS.gcjToWgs(ne.lat,ne.lng);
	return {
		bounds: bounds,
		sw: sw,
		ne: ne,
		pos: {
			width: container.width(),
			height: container.height(),
			top: ne.lat,
			bottom: sw.lat,
			left: sw.lon,
			right: ne.lon
		}
	};
} 

export const addImageOverlay = (id, url, bounds) => {
	let imgLayer = L.imageOverlay(url, bounds, { zIndex: 300 });
	imgLayer.id = id;
	_overlays[id] = imgLayer;
	imgLayer.addTo(map);
	let _id = ' '+id;
	imgLayer._image.className +=  _id;
}	

//opts:{bounds-地图边界, id-覆盖层ID, options-覆盖层配置, imgSrc-覆盖层图片地址}
export const addBusinessOverlay = (id,url,bounds,options) => {
	if(_overlays[id] && map.hasLayer(_overlays[id]))
		_overlays[id].setUrlAutoFit(url);
	else{
		var opts = options || {};
		var overlay = L.businessOverlay(url,bounds,opts);
		overlay.id = id;
		_overlays[id] = overlay;
		overlay.addTo(map);
	}
}

export const addMarker = (id,latlng,options,events,extraOpts) => {
	var opts = options || {};
	var marker = L.marker(latlng,opts);
	marker.id = id;
	options.label && marker.bindLabel(options.label);
	if(!$.isEmptyObject(events)){
		for(var ev in events)
			marker.on(ev,events[ev]);
	}
	if(!$.isEmptyObject(extraOpts)){
		for(var i in extraOpts)
			marker[i] = extraOpts[i];
	}
	marker.addTo(map);
};

export const removeOverlay = (arr) => {
	if(typeof(arr) != "string" && !(arr instanceof Array))
		return;
	var layers = arr instanceof Array ? arr : [arr];
	for(var i = 0; i < layers.length; i++){
		var id = layers[i];
		if(id in _overlays && map.hasLayer(_overlays[id])){
			map.removeLayer(_overlays[id]);
			delete _overlays[id];
		}else{
			map.eachLayer(function(layer){
				if(layer.id == id)
					map.removeLayer(layer);
			});
		}
	}
};
