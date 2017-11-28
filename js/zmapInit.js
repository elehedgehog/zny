

window.map = L.map('zmap', { 
        crs: L.CRS.EPSG900913, 
        attributionControl: false,
        renderer: L.svg(),
        zoomControl: false }
    ).setView([23, 113], 5);

const layerOpts = {
    subdomains: [1, 2, 3],
    maxZoom: 17,
    minZoom: 3
}

const layers = {
    // terLayer: new L.tileLayer("http://mt2.google.cn/vt/lyrs=t@132,r@269000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}", layerOpts),
    // satLayer: new L.tileLayer("http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G", layerOpts),
    // busLayer: new L.tileLayer("http://mt2.google.cn/vt/lyrs=m@235000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galileo", layerOpts)
    terLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=p&x={x}&y={y}&z={z}", layerOpts),
    satLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=y&x={x}&y={y}&z={z}", layerOpts),
    busLayer: new L.tileLayer("http://119.29.102.103:8097/vt/lyrs=m&x={x}&y={y}&z={z}", layerOpts)
}

layers.satLayer.addTo(map);       //初始化默认切片
window.areaRenderer = L.svg();          //决策区
areaRenderer.addTo(map);
window.waveRenderer = L.svg();          //海浪
waveRenderer.addTo(map);


// 切换地图切片
$('.mapImg span').on('click', function(e) {
    e.stopPropagation();
    if($(this).hasClass('layer-selected')) 
        return;
    const beforeId = $('.mapImg .layer-selected').attr('id');
    const currentLayer = $(this).attr('id');
    layers[currentLayer].addTo(map);            //添加新切片
    map.removeLayer(layers[beforeId]);          //移除旧切片
    changeWindColor(currentLayer)
    $(this).addClass('layer-selected').siblings().removeClass('layer-selected');
});

// 更改 实时风况 风速颜色
const changeWindColor = (type) => {
    if (!$('.actualWind').hasClass('on')) return
    let color = type === 'satLayer' ? '#eee' : '#444'
    $('.wind_veltop, .wind_velbot').css('color', color)
}

// 缩放地图隐藏决策区 距离div框 台风名称框
map.on('zoomend', () => {           
  const zoom = map._zoom;
  let $target = $('.distance-iconOne,.distance-iconTwo,.distance-iconThree,.areaBoundary,.wind_veltop,.wind_velbot,.buoyLabel');
  if(zoom < 5)
    $target.hide();
          
  else
    $target.show();
});


// 点击或者移动地图隐藏 出现的框
const hidePopup = () => {
    $('#tyswNav>ul>li.a').click();     //台风 云图 雷暴
    const $mapLayerBtn = $('.cloudMap ul li').eq(1).find('img');
    if($mapLayerBtn.hasClass('on'))             //右下图层按钮
        $mapLayerBtn.click();
    if($('.imgEx').hasClass('on')) $('.imgEx').click();         //图例
//     $('.buoy_bott').removeClass('on').stop().animate({'bottom': '-7.8rem'});
//     $('.tyCl_list,.imgEx').stop().animate({'bottom': '0.666667rem'});
}
map.addEventListener('movestart', hidePopup);
map.addEventListener('click', hidePopup);

// 初始化海洋预报 日期   
const initOceanTIme = () => {
  const today = Date.now();
  let html = '';
  for(let i = 1; i < 8; i++) {
    const date = today + i*24*60*60*1000;
    html += `<li class="typhoonSeawave_ocean" leadtime=${i*24}><div class="oceanSeawave_div"><p>${new Date(date).Format('dd')}日</p></div></li>`;
  }
  $(".oceanPreUl").append(html);
  $('.oceanPreUl li').eq(0).children('div').addClass('ocean_active');
}    
initOceanTIme();



// 添加防御区
L.polyline([[35, 120], [35, 150], [0, 150], [0, 140]], {
    color: 'red',
    dashArray: [5, 10],
    weight: 2
}).addTo(map)

let alarmPolyline = [
    [[25, 119], [25, 125], [15, 125], [15, 110], [22, 110]],
    [[25, 125], [25, 135], [0, 135]],
    [[25, 135], [25, 140], [0, 140], [0, 105], [10.5, 105]]
]
for (let el of alarmPolyline) {
    L.polyline(el, { color: 'red', weight: 2 }).addTo(map)
}

//添加九段线
let ninePolyline = [
    [[17, 109.5], [15, 110]],
    [[12, 110.5], [11, 110]],
    [[7.5, 105.2], [6, 105.5]],
    [[3, 112], [4, 113]],
    [[7.3, 115.8], [8, 116.8 ]],
    [[11, 118.5], [12, 119]],
    [[15, 119], [16, 119]],
    [[18, 119.5], [19, 120]],
    [[21, 121], [22, 122]],
]
for (let el of ninePolyline) {
    L.polyline(el, { color: '#E74727', weight: 5 }).addTo(map)
}
