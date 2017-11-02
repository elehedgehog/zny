import { tyCenter } from '../typhoon'       //3个台风中心点经纬度
import { _tyUrl } from '../util/url.conf'
import * as overlay from '../util/overlay'
import { hidePreWarnPopup } from '../typhoonDom'

let _areas = {};

const _lines = ['firstTyLine', 'secondTyLine', 'thirdTyLine'];
const _divIcons = ['firstTipDiv', 'secondTipDiv', 'thirdTipDiv'];
const _classNames = ['distance-iconOne', 'distance-iconTwo', 'distance-iconThree']; 
const _allLayerId = ['firstTyLine', 'secondTyLine', 'thirdTyLine','firstTipDiv', 'secondTipDiv', 'thirdTipDiv'];

const addCircle = (lat, lon, radius, pointId) => {       //添加预警范围区域
  const opts = {
    fillOpacity: 0.3,
    weight: 1,
    renderer: areaRenderer,
  };
  let colors = [
    { color: '#adb7c3', fillColor: '#adb7c3' },
    { color: '#C18BA5', fillColor: '#C18BA5' },
    { color: '#C6987E', fillColor: '#C6987E' },
    { color: '#BCAF83', fillColor: '#BCAF83' },
    { color: '#83CECB', fillColor: '#83CECB' },
    { color: '#fcc', fillColor: '#fcc' },
    { color: '#aaa', fillColor: '#aaa' },
    { color: '#428CD5', fillColor: '#428CD5' },
    { color: '#fff', fillColor: '#fff' },
  ]
  let colorsLen = radius.length - 1;
  radius.map((r, index) => {
    let circle = L.circle([lat, lon], r * 1.852 * 1000, Object.assign({}, opts, colors[colorsLen - index]));
    circle.id = 'circle';
    circle.addTo(map);
    _areas[pointId].layers.circle.push(circle);
  });
}
const addCenterPoint = (point, pointId, bool, pData) => {       //添加预警区域中心点
  // const icon = L.icon({
  //   className: 'preWarnPonit',
  //   iconUrl: 'assets/typhoon_decision@3x.png', 
  //   iconSize: [25, 25],
  //   iconAnchor: [12.5, 12.5],
  // });
  const icon = L.divIcon({
    className: 'warnPonit',
    html: `<div class="${ bool ? 'warn_point_on' : 'warn_point'}"><div></div><div></div><div></div></div>`
  });
  const events = {
    click: e => {
      $('#waveHeight').text(pData.waveHeight ? pData.waveHeight + 'm' : '');
      $('#waveDir').text(pData.waveDir ? pData.waveDir : '');
      $('#wavePeriod').text(pData.waveProid ? pData.waveProid + 's' : '');
      $('#windPowers').text(pData.windPower ? pData.windPower + '级' : '');
      $('#stormSurge').text(pData.windWater);                     //风暴增水
      $('#windDirs').text(pData.windDirection ? pData.windDirection : '');
      // console.log(pData);

      if($('.simiMatch.on').length) $('.closeSimi').click();
      $('.early_head').attr('pointid', pointId);
      map.addEventListener('movestart', hidePreWarnPopup);
      map.addEventListener('click', hidePreWarnPopup);
      $('.tycontener_bottSeawave').stop().animate({'bottom': '-4.93rem'});
      $('.early_warn').addClass('on').stop().animate({bottom:'0rem'});      //展开详细信息
      $('.imgEx,.tyCl_list,.cloudPopup').stop().animate({'bottom':  4.4 +'rem'});
    }
  }
  let marker = L.marker(point, { icon: icon });
  for(var ev in events)
	  marker.on(ev,events[ev]);
  marker.id = 'centerPoint';
  marker.addTo(map);
  _areas[pointId].layers.centerPoint = marker;
}
const getSelectTyIndex = () => {          //获取当前选中台风index
  let arr = [];
  $('#tyChangeWraper .layer-selected').map(function() {
    const index = $(this).index();
    arr.push(index);
  });
  return arr;
}
const addPolyline = (point, arr, pointId) => {            //增加虚线
  const opts = {
    color: 'red', 
    weight: 2, 
    dashArray: '4, 5', 
    dashOffset: '2',
    renderer: areaRenderer,
  };
  arr.map( i => {
    let latlngs = [point, tyCenter[i]];
    let polyline = L.polyline(latlngs, opts);
    polyline.id = _lines[i];
    polyline.addTo(map);
    _areas[pointId].layers.polyline.push(polyline);
  });
}
const addDistance = (point, arr, pointId) => {           //增加预警中心点到各台风点距离
  arr.map( i => {
    let distance = L.latLng(tyCenter[i]).distanceTo(point);
    distance = ((distance / 1000) / 1.852).toFixed(2) + '海里'; 
    _areas[pointId].distances[i] = distance;
  });
}
const addDivIcon = (point, arr, pointId) => {            //添加距离div
  arr.map( i => {
    const tyName = $('#tyChange li').eq(i).find('a').text();
    const distance =  _areas[pointId].distances[i];
    const opts = L.divIcon({
        className: `${_classNames[i]}`,
        html: `<div class="distanceIcon"><span></span><span>距离${tyName}台风中心${distance}</span></div>`
    });
    let divIcon = L.marker(point, { icon: opts });
    divIcon.id = _divIcons[i];
    divIcon.addTo(map);
    _areas[pointId].layers.divIcon.push(divIcon);
  });
}


export const getTyphoonspot = () => {         //获取后台数据接口
  const userId = window.locationInfo.userId;
  // const userId = '8dd76bbcad114776beb80c8514eb898d';
  const url = _tyUrl.obtain();
  return $.post({ url, dataType: 'json', data: { userId } });
}
export const addTyphoonspot = (lat, lon, radius) => {      //添加数据接口
  // const userId = window.locationInfo.userId;
  const userId = '8dd76bbcad114776beb80c8514eb898d';  
  const url = _tyUrl.add();
  const params = {
    userId,
    lon,
    lat,
    radius,
  }
  return $.post({ url, dataType: 'json', data: params });
}
export const modifyTyphoonspot = (lat, lon, radius, typhoonid) => {      //编辑数据接口
  const userId = window.locationInfo.userId;
  // const userId = '8dd76bbcad114776beb80c8514eb898d';
  const url = _tyUrl.modify();
  const params = {
    userId,
    lon,
    lat,
    radius,
    typhoonid,
  }
  return $.post({ url, dataType: 'json', data: params });
}
export const removeTyphoonpot = typhoonid => {       //删除数据接口
  const userId = window.locationInfo.userId;
  // const userId = '8dd76bbcad114776beb80c8514eb898d';
  const url = _tyUrl.remove();
  const params = {
    userId,
    typhoonid,
  }
   return $.post({ url, dataType: 'json', data: params });
}


//总的添加区域函数
export const addArea = (lat, lon, radius, pointId, bool, pData) => {      //添加预警区域
  lat = Number(lat);
  lon = Number(lon);
  let point = [lat, lon];             //决策区中心点经纬度
  _areas[pointId] = { 
    point, 
    distances: {},
    layers: {       //存放图层
      circle: [],
      centerPoint: null,
      divIcon: [],
      polyline: [],
    },        
  };
  addCircle(lat, lon, radius, pointId);
  addCenterPoint(point, pointId, bool, pData);
  let selectedTyArr = getSelectTyIndex();
  addPolyline(point, selectedTyArr, pointId);
  addDistance(point, selectedTyArr, pointId);
  addDivIcon(point, selectedTyArr, pointId);
}

export const addAreaInfo = i => {       //添加台风时
  for(let key in _areas) {
    let area = _areas[key];
    addPolyline(area.point, [i], key);
    if(!area.distances[i]) {      //距离
      let distance = L.latLng(tyCenter[i]).distanceTo(area.point);
      distance = ((distance / 1000) / 1.852).toFixed(2) + '海里'; 
      area.distances[i] = distance;
    }
    //divIcon
    const tyName = $('#tyChange li').eq(i).find('a').text();
    const opts = L.divIcon({
        className: `${_classNames[i]}`,
        html: `<div class="distanceIcon"><span></span><span>距离${tyName}台风中心${area.distances[i]}</span></div>`
    });
    let divIcon = L.marker(area.point, { icon: opts });
    divIcon.id = _divIcons[i];
    divIcon.addTo(map);
    _areas[key].layers.divIcon.push(divIcon);
  }
}

export const removeAreaInfo = i => {      //删除台风时
  map.eachLayer( layer => {
    if(layer.id === _lines[i] || layer.id === _divIcons[i]) 
      map.removeLayer(layer);
  }); 
}

export const removeSingleArea = pointId => {        //删除决策区   (点 范围圆圈 虚线 距离div)
  for(let layer in _areas[pointId].layers) {
    const l = _areas[pointId].layers[layer];
    if(Array.isArray(l)) {
      l.map(item => {
        map.removeLayer(item);    //虚线 距离div  范围圆圈
      });
    }
    else map.removeLayer(l);      //点
  }
  delete _areas[pointId];
}

export const removeAllArea = () => {        //删除所有决策区距离信息  (虚线  距离div)
  map.eachLayer( layer => {
    if(_allLayerId.indexOf(layer.id) !== -1) 
      map.removeLayer(layer);
  });
  for(let key in _areas) {
    _areas[key].layers.polyline = [];
    _areas[key].layers.divIcon = [];
  }
}