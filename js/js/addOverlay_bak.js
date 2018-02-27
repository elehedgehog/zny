import * as overlay from './util/overlay'
import { getNoDataTips } from './util/tips'

// 雷暴预报
const currentStormUrl = 'http://119.29.102.103:8111/Titan/renderForecastStormByDatetime?left=110&right=118&top=27&bottom=20&width=900&height=400&time={time}';
const preStormUrl = `http://119.29.102.103:8111/Titan/renderForecastStormByDatetimeandMinute?left=110&right=118&top=27&bottom=20&width=750&height=1334&minute=`;

const bounds = [            //图层边界
    [27, 108.5],
    [18.2, 119]
];

// 云图
const baseCloud = `http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=`;
const endOfCloud = `&top=53.55&bottom=3.86&left=73.66&right=135.05&width=600&height=600`;
const urlCloud = {
  'visibleLight': `${baseCloud}VIS${endOfCloud}`,         //可见光
  'InfraRed': `${baseCloud}IR1${endOfCloud}`,             //红外线
  'steam': `${baseCloud}IR3${endOfCloud}`                 //水汽
};
const cloudBounds = [
    [53.55, 73.66],
    [3.86,135.05]
];

//云图事件
let cloudLoad = false;        //用于判断图层是否加载完毕
$('#cloudOverlay li').click(function(e) {
  e.stopPropagation();
  const id = $(this).attr('id');
  let time = Date.now() - 60*60*1000;     //取1小时前数据
  let url = urlCloud[id].replace('{datetime}', new Date(time).Format('yyyy-MM-dd HH:00:00')); 
  if ($(this).hasClass('on')) {
    if(cloudLoad) {
      cloudLoad = false;
      $(this).removeClass('on');
      overlay.removeOverlay(id);
    }
  } else {
    if($(this).siblings('li').hasClass('on') && !cloudLoad) return;
    cloudLoad = false;
    $(this).addClass('on').siblings('li').removeClass('on');
    for (let item in urlCloud) {
      if (id === item) {
        let img = new Image();
        img.onload = () => {
          cloudLoad = true;
          overlay.addImageOverlay(id, url, cloudBounds);
        }
        img.onerror = () => {
          cloudLoad = true;
          getNoDataTips('.cloudNoData');
        }
        img.src = url;
      }
      else overlay.removeOverlay(item);
    }
  }
});

//组合反射率
const mcrUrl = 'http://119.29.102.103:8111/mcr?datetime={datetime}/cache';
$('.tgReflex').click(function(e) {
  e.stopPropagation();
  if ($(this).hasClass('on')) {
    overlay.removeOverlay('mcr');
  } else {
    getImgFn(0,$(this));    
  }
  $(this).toggleClass('on');
});
  const getImgFn = (i, $btn)=> {    //i为请求次数
  const time= Date.now() - Date.now() % (6*60*1000) - i*6*60*1000;
  const url = mcrUrl.replace('{datetime}', new Date(time).Format('yyyy-MM-dd HH:mm:00'));
  let img = new Image();
  img.onload = () => {
    $btn.hasClass('on') ? overlay.addImageOverlay('mcr', url, bounds) : overlay.removeOverlay('mcr');
  }
  img.onerror = () => {
    i++;
    if(i <= 3) getImgFn(i, $btn);
  }
  img.src = url;
}

//雷暴追踪
$('.rsFollow').click(function(e) {
  e.stopPropagation();
  if($(this).hasClass('on'))  {
    overlay.removeOverlay('rainStorm');
    map.off('moveend', updateMap);
  } else {
    getRsImg(0,$(this),(flag) => {
      flag ? $('.rainStorm').show(): $('.rainStorm').hide();
    });
  }
  $(this).toggleClass('on');
});
//获取雷暴追踪链接
let rsIndex = 0;
const getRsUrl = (i) => {
  let time = Date.now() - i*60*60*1000;
  let date = new Date(time).Format('yyyy-MM-dd HH:00:00');
  let mapBound = map.getBounds();
  let left = mapBound._southWest.lng,
      right = mapBound._northEast.lng,
      bottom = mapBound._southWest.lat,
      top = mapBound._northEast.lat;
  let rsbounds = [
    [top, left],
    [bottom, right]
  ];
  let container = $("#" + map.getContainer().id);
  const url = `http://119.29.102.103:8111/thunder/titan?datetime=${date}&left=${left}&right=${right}&top=${top}&bottom=${bottom}&width=${container.width()}&height=${container.height()}`;
  return {
    url,
    bounds: rsbounds
  };
}
//加载雷暴追踪函数
const getRsImg = (i,$btn,fn) => {
  const id = 'rainStorm';
  const url = getRsUrl(i).url;
  let img = new Image;
  fn = fn || $.noop();
  img.onload = () => {
    rsIndex = i;
    const rsbounds = getRsUrl().bounds;
    overlay.removeOverlay(id);
    overlay.addBusinessOverlay(id, url, rsbounds, {zIndex: 300});
    $btn.hasClass('on') ? fn(true):fn(false);
    map.on('moveend', updateMap);
  }
  img.onerror = () => {
    i++;
    if(i >= 3) return;
    getRsImg(i,$btn,fn);
  }
  img.src = url;
}
//地图移动 图层变化函数
const updateMap = () => {
  const url = getRsUrl(rsIndex).url;
  const rsbounds = getRsUrl().bounds;
  let id = 'rainStorm';
  let img = new Image();
  img.onload = () => {
    overlay.addBusinessOverlay(id, url, rsbounds, {zIndex: 300});
  }
  img.onerror = () => {
    overlay.removeOverlay(id);
  }
  img.src = url;
}