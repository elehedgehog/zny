import { ZmapHelper } from './util/ZmapHelper.js'

//匹配相似台风  函数
export const getSimilarTy = (tsid,angle=30,anglediff=30,speed=30,speeddiff=30,strength=30) => {
  if(!tsid) return;
  $('#simTyphoon ul .similarTyInner').remove();     //移除相似台风li 
  const url = `http://119.29.102.103:9021/typhoon/matchTyphoon?tsid=${tsid}&w_windspeed=${strength}&w_speed=${speed}&w_direction=${angle}&w_speed_change=${speeddiff}&w_direction_change=${anglediff}&_=${Date.now()}`
  $.ajax({ url }).then(data => {
    data = JSON.parse(data)
    if (!data.length) {
      getNoSimi();
      if($('.simiMatch').hasClass('on')) $('.closeSimi').click();
      removeAllSimTy();
      return;
    }

    for (let el of data) {
      $('#simTyphoon ul').prepend(`<li class="similarTyInner" tyid="${el.tsid}"><a>${el.cname}</a></li>`);
    }
    let simiMatchHeight = $('.simiMatch').height();
    $('.simiMatch').css({'transform': 'translateY(0%)', bottom: 0}).addClass('on');
    $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom': simiMatchHeight + 30 +'px'});
    
  });
}

//无相似台风弹窗
const getNoSimi = () => {       
  $('.hint_noSimiTy').fadeIn(1000, function() {
    setTimeout(function() {
      $('.hint_noSimiTy').fadeOut();
    }, 1000);
  });
}


//绘制台风函数
let similarTyLayer = {};      //存放相似台风图层
const drawSimilayTy = (tyid, res) => {
  //移除相似台风
  if(similarTyLayer[tyid]) {
    map.removeLayer(similarTyLayer[tyid]);
    delete similarTyLayer[tyid];
    return;
  }
  //新增相似台风
  let json = {
    tsid: tyid,
    intlid: (res.info && res.info[0]) ? res.info[0].intlid : null,
    tscname: (res.info && res.info[0] && res.info[0].info && res.info[0].info.cname) ? res.info[0].info.cname : null,
    tsename: (res.info && res.info[0] && res.info[0].info && res.info[0].info.ename) ? res.info[0].info.ename : null,
    real: [],
    fst: []
  }

  if (res.real && Array.isArray(res.real)) {
    res.real.sort((a, b) => a.datetime - b.datetime)
    for (let el of res.real) {
      let real = formartTyphData(el)
      json.real.push(real)
    }
  }
  
  if (res.forecast && Array.isArray(res.forecast)) {
    res.forecast.sort((a, b) => a.leadtime - b.leadtime)
    for (let opt of res.forecast) {
      if (!opt.location.lon || !opt.location.lat) continue
      let fst = formartTyphData(opt)
      json.fst.push(fst)
    }
  }

  const helper = new ZmapHelper(map, window.positionCenter)
  let lyGp = helper.drawTy(json);
  similarTyLayer[tyid] = lyGp.tyLayerGroup;
  map.addLayer(similarTyLayer[tyid]);
  lyGp.layersGoesBack.map((el) => {
      el.layer.bringToBack();
  });
  // 设置点击台风为视角中心
  const tyReal = json.real,
    realLen = tyReal.length;
  const point = [tyReal[realLen - 1].lat, tyReal[realLen - 1].lon];   //最新台风点
  map.setView(point, 4);
}

//移除所有相似台风
const removeAllSimTy = () => {    
  for(let i in similarTyLayer)
    map.removeLayer(similarTyLayer[i]);
  similarTyLayer = {};
}


//新增相似台风li 点击事件 绑定
$('#simTyphoon').on('click', '.similarTyInner', function() {
  $(this).toggleClass('simSelected');
  const tyid = $(this).attr('tyid');
  if($(this).hasClass('simSelected')) {
    let url = `http://119.29.102.103:9021/typhoon/findForecastReal?tsid=${tyid}&_=${Date.now()}`
    $.ajax({ url }).then((data) => {
      drawSimilayTy(tyid, JSON.parse(data));      //加载台风 
    });
  } else {
    drawSimilayTy(tyid);     //删除台风图层
  }
});

// 格式化台风实况点 预测点
function formartTyphData(opt) {
  return {
    time: opt.datetime,
    datetime: new Date(opt.datetime).Format('yyyy-MM-dd HH:mm:ss'),
    leadtime: opt.leadtime || null,
    level: opt.elements.tcrank,
    lon: opt.location.lon,
    lat: opt.location.lat,
    ps: opt.elements.pressure,
    ws: opt.elements.windspeed,
    rr06: opt.elements.rr06 || null,
    rr07: opt.elements.rr07 || null,
    rr08: opt.elements.rr08 || null,
    rr10: opt.elements.rr10 || null
  }
}