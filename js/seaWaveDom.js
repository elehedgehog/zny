import * as overlay from './util/overlay'
import { getVelLevel, getDirLevel } from './util/wind'
import { getNoDataTips } from './util/tips'
import _boundary from './boundary'
import { viewerCor } from './business/viewer'
import { addNewsTip, removeNewsTip } from './util/newsTip'
let currentArea;                  //当前点击站点 中文名
let seaData = {                   //当前点击站点 海浪预报数据
    24: {},
    48: {},
};
let oceanData = [];               //所有站点 所有时段  海洋预报数据
let currentAreaMsg = {};          //当前点击站点 海洋预报数据
let areaCorrObj = {               //获取海洋预报数据时 转换中文名称
    汕头附近海面: '广东东部海面',
    汕尾附近海面: '广东东部海面',
    湛江附近海面: '广东西部海面'
};

//海浪  (获取 点 海浪预报)
export let hasData = false;
export const getSeawaveData = () => {   //点击顶部导航栏 海浪按钮时调用
  let listUrl = `http://119.29.102.103:8111/SeaWaveForecast/listByDate?date={date}&cacheCtrl=${Date.now()}`;
  
  let date = new Date()
  let url = listUrl.replace('{date}', new Date(date).Format('yyyy-MM-dd HH:00:00'));
  $.ajax({ url })
  .then(msg => {
    if(!$('.swList').hasClass('on') || !msg) return;    //获取不到点信息 选中状态已取消
    if(/DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) {
      date = new Date(date).getTime() - 24*60*60*1000;      //获取不到数据 取前一天数据
      let url = listUrl.replace('{date}', new Date(date).Format('yyyy-MM-dd HH:00:00'));
      return $.ajax({ url });
    }
    hasData = true;
    getPoint(msg);
    addNewsTip('seawave', '北京时: ' + new Date(date).Format('yyyy年MM月dd日 HH:00') + '&nbsp;海浪预报')
    return false;
  }).then(msg => {
    if(!$('.swList').hasClass('on') || !msg) return;
    if(/DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) {
      getNoDataTips('.seaWave_noData');    //无数据弹窗
      hasData = false;
      removeNewsTip('seawave')
      return;
    }
    hasData = true;
    getPoint(msg);
    addNewsTip('seawave', '北京时: ' + new Date(date).Format('yyyy年MM月dd日 HH:00') + '&nbsp;海浪预报')
  }); 
}

const mapEvent = () => {
  $('.tycontener_bottSeawave').removeClass('on').stop().animate({'bottom': '-5.4rem'});
  if($('.early_warn').hasClass('on')) return;
  if($('.simiMatch').hasClass('on')) return;
  if($('.rainProgressbar').hasClass('on')) return;
  $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
}
const contEvent = function(e) {  
  if($(e.target).is('.imgEx') || $(e.target).is('.imgEx *')) return;  //点击时不执行
  if($(e.target).is('.cloudMap .tyListUl_com:nth-child(2)') || $(e.target).is('.cloudMap .tyListUl_com:nth-child(2) *')) return;
  mapEvent();
}
//填充点
const getPoint = (msg) => {
  map.addEventListener('click', mapEvent);
  $('#tyswNav,#makePolicy,.simityList').click(mapEvent)
  map.addEventListener('movestart', mapEvent);

  //添加海域边界
  let polygonOpt = { color: '#fff',weight: 1,fillColor: 'blue', fillOpacity: 0.1,opacity: 0.1, renderer: waveRenderer };
  for(let i in _boundary){
    let info = _boundary[i];
    
    let event = (e) => {           //数据点点击事件
      L.DomEvent.stopPropagation(e);
      $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}).removeClass('on');
      if(!hasData) return;             //无数据
      if($('.buoy_bott').hasClass('on')) {           //展开了详细数据
          $('.buoy_bott').removeClass('on').stop().animate({bottom: '-5.8rem'});
          
          if($('.tycontener_bottSeawave').hasClass('on')) {
            $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom': '5.9rem'});

          } else if($('.rainProgressbar').hasClass('on')){
            $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom': '3.3rem'});  

          }else {
            $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
          }
      }
      
      if($('.simiMatch.on').length) $('.closeSimi').click();     //相似台风
      $('#tyswNav>ul>li.a').click();     //台风 云图 雷暴
      $('.cloudMap ul li img.on').click();        //决策区  地图切片
      $('.typhoon_seaWave p').click();            //默认恢复到海浪表格数据页
      if($('.early_warn').hasClass('on'))         //决策区详细信息
        $('.early_warn').removeClass('on').stop().animate({bottom:'-4.4rem'});   
      $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom':  5.9 +'rem'});    //图例 右下角工具栏
      $('.tycontener_bottSeawave').addClass('on').show().stop().animate({bottom:'0rem'});      //展开详细数据
      $('.tycontener_bottSeawave').click(function(e){
        e.stopPropagation();
      });
     
      currentArea = i;     // 点 中文名称

      msg.map((item) => {
        if (currentArea === item.vf01015Cn) {
          seaData[item.v04320] = item;
        }
      });
      console.log(seaData);     //seaData为当前点击区域 24H  48H的海洋预报数据
      dealTable();              //填充海浪预报数据
    }

    let polygon = L.polygon(info.bd, polygonOpt);
    polygon.id = 'boundaryP';
    L.DomEvent.on(polygon, 'click', event);
    polygon.addTo(map);
    let icon = L.divIcon({ html: `<div class="areaBoundary">${i}</div>` });
    let marker = L.marker(_boundary[i].center, { icon: icon });
    marker.id = 'boundaryM';
    L.DomEvent.on(marker, 'click', event);
    marker.addTo(map);
  }

  viewerCor()
};


//海浪预报
//初始化海浪预报表格
const dealTable = () => {
  if($('#seaWaveTwentyF').hasClass('tydate_active'))      //判断当前选中的是哪一个状态 
    fillTable(24);
  else if($('#seaWaveFortyE').hasClass('tydate_active'))
    fillTable(48);
}

//填充海浪预报表格函数
const fillTable = (time) => {
  // let windPow;    //风力
  $('.tySeawave_pre tr:eq(0) td:eq(1)').text(seaData[time].vf01015Cn);                // 海域
  $('.tySeawave_pre tr:eq(1) td:eq(1)').text(seaData[time].v2202105 + 'm');           // 最高浪高
  $('.tySeawave_pre tr:eq(2) td:eq(1)').text(seaData[time].v2202106 + 'm');           // 最低浪高
  $('.tySeawave_pre tr:eq(3) td:eq(1)').text(seaData[time].v20059 + '-' + seaData[time].v20058 + 'm');    // 能见度
  $('.tySeawave_pre tr:eq(1) td:eq(3)').text(seaData[time].v11041 + '级'); //阵风
  $('.tySeawave_pre tr:eq(0) td:eq(3)').text(seaData[time].v11301 + '级'); //平均风

  // if(seaData[time].v11301) {
  //   let windLevel = getVelLevel(seaData[time].v11301);
  //   windPow = windLevel ? `${windLevel}级` : '无风';
  // }
  // else windPow = '无风';
  // $('.tySeawave_pre tr:eq(0) td:eq(3)').text(windPow);

  let windDer;  //风向
  if(seaData[time].v11001){
    let winDerect = getDirLevel(seaData[time].v11001);
    windDer = winDerect ? winDerect : '无风'
  }
  else windDer = '无风';
    $('.tySeawave_pre tr:eq(2) td:eq(3)').text(windDer);
}


//海洋预报
//获取当前点击站点  海洋预报数据函数
const getOceanMsg = () => {      
  currentAreaMsg = {};  
  for(let i in oceanData) {
    if(areaCorrObj[currentArea]) currentArea = areaCorrObj[currentArea];
    const info = oceanData[i];
    if(info.name === currentArea) {
      currentAreaMsg[info.leadtime] = info;
    }
  }
  console.log(currentAreaMsg);      //当前站点海洋预报数据  包括各个时间
} 

// 填充海洋预报表格函数
const fillOceanTable = leadtime => {
  const data = currentAreaMsg[leadtime];
  if(data) {
    $('.oceanPre tr:eq(0) td:eq(1)').text(data.weather);
    $('.oceanPre tr:eq(0) td:eq(3)').text(data.windDir + '风');
    $('.oceanPre tr:eq(1) td:eq(1)').text(data.windVel + '级');
    $('.oceanPre tr:eq(1) td:eq(3)').text(data.flurry + '级');
    $('.oceanPre tr:eq(2) td:eq(1)').text(data.visibility + 'km');
  } else {
    $('.oceanPre tr:eq(0) td:eq(1)').text('');
    $('.oceanPre tr:eq(0) td:eq(3)').text('');
    $('.oceanPre tr:eq(1) td:eq(1)').text('');
    $('.oceanPre tr:eq(1) td:eq(3)').text('');
    $('.oceanPre tr:eq(2) td:eq(1)').text('');
  }
}


//删除海浪点
export const delMarker = () => {
  overlay.removeOverlay('point');
  $('#tyswNav,#makePolicy,.simityList').unbind('click', contEvent);
  map.removeEventListener('click', mapEvent);
  map.removeEventListener('movestart', mapEvent);
}

export const delBoundary = () => {
  overlay.removeOverlay('boundaryP');
  overlay.removeOverlay('boundaryM');
  $('#tyswNav,#makePolicy,.simityList').unbind('click', contEvent);
  map.removeEventListener('click', mapEvent);  
  map.removeEventListener('movestart', mapEvent);
}




// -----  DOM 操作  ----- //
//海浪预报 海洋预报
$('.seaWave_head ul li p').on('click', function() {
    $('.seaWave_head ul li p').removeClass('tycontent_head_active');
    $(this).addClass('tycontent_head_active');
});

//海浪预报按钮
$('.typhoon_seaWave p').on('click', function(){
  $('.swiperLine').stop().animate({left:'0.55rem'}, 300);
  $('#seaOceans').hide();
  $('#seaWaves').show();
});

//海浪预报 24 48H
$('.typhoonSeawave_div').on('click', function() {
    $('.typhoonSeawave_div').removeClass('tydate_active')
    $(this).addClass('tydate_active');
});
$('#seaWaveTwentyF').click(() => { fillTable(24); });
$('#seaWaveFortyE').click(() => { fillTable(48); });


//海洋预报按钮
$('.typhoon_seaWavepre p').on('click', function(){
  $('#seaWaves').hide();
  $('#seaOceans').show()
  $('.swiperLine').animate({left:'2.48rem'},300);
  if(!oceanData.length) {            //第一次点击时  初始化所有站点海洋预报数据
    let deadline = new Date().Format('yyyy-MM-dd 17:00:00');      //当天17点以后取当天数据  17点以前取前一天数据
    deadline = new Date(deadline).getTime();
    let date;
    if(Date.now() > deadline) {
      date = new Date().Format('yyyy-MM-dd HH:00:00');
    } else {
      date = Date.now() - 24*60*60*1000;       //取前一天
      date = new Date(date).Format('yyyy-MM-dd HH:00:00');
    }
    console.log(date);
    let oceanUrl =  `http://119.29.102.103:8111/SeaForecast/listByDate?date=${date}&cacheCtrl=${Date.now()}`;
    $.ajax({type: 'get', url: oceanUrl})
    .then(data => {
      console.log(data)
      if(/DB_ERROR/.test(data) || /null/.test(data) || !data.length) return;
      oceanData = data;     // 获取所有站点海洋预报数据

      getOceanMsg();        // 获取当前站点海洋预报数据
      fillOceanTable(24);   // 初始化海洋表格  第1天
      $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
      $('.typhoonSeawave_ocean').eq(0).find('.oceanSeawave_div').addClass('ocean_active');
    });
  } else {
    getOceanMsg();
    fillOceanTable(24);   // 初始化海洋表格
    $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
    $('.typhoonSeawave_ocean').eq(0).find('.oceanSeawave_div').addClass('ocean_active');
  }
});

//海洋预报日期点击事件
$('.typhoonSeawave_ocean').on('click', function() {
  $('.oceanSeawave_div.ocean_active').removeClass('ocean_active');
  $(this).find('.oceanSeawave_div').addClass('ocean_active');

  const leadtime = $(this).attr('leadtime');
  fillOceanTable(leadtime);
});





/*
//用在决策区域 ?? 
const getWindDatetime = () => { //强风预警获取数据时间
    let now = Date.now(),
        time = new Date().Format('yyyy/MM/dd 20:00:00');
    time = new Date(time).getTime();
    if(now < time) 
        time -= 24*60*60*1000;
    return new Date(time).Format('yyyy-MM-dd 08:00:00');
}

let arr = [];
areaData.map(area => {
    arr.push([area.lon, area.lat]);
});
let datetime = getWindDatetime();
let params = {
    datetime,
    points: arr,
    leadtime: 0,
}
let windUrl = 'http://119.29.102.103:8111/Wind/getInterpPoints';            //强风预警链接
$.ajax({ url: windUrl , data: params}).then(windData => {
    areaData.map((area, index) => {
        area.windDirection = getDirLevel(windData[index].windDirection);
        area.windPower = getVelLevel(windData[index].windPower);
    });
    console.log(areaData);
})
*/
