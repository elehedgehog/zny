import * as overlay from './util/overlay'
import { getNoDataTips } from './util/tips'
import * as w from './util/wind'
import { hidePreWarnPopup } from './typhoonDom'
import { Coder } from './util/Coder'
import { addNewsTip, removeNewsTip } from './util/newsTip'
import { viewerCor } from './business/viewer'

const bounds = [            //图层边界
    [27, 108.5],
    [18.2, 119]
];

// 云图
const baseCloud = `http://119.29.102.103:8111/Satelite/renderCloud?datetime={datetime}&dataType=`;
const endOfCloud = `&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600`;
const getTime = `http://119.29.102.103:8111/Satelite/latestDatetime?dataType=ir2`; //云图请求时间
const showTime = `http://119.29.102.103:8111/Satelite/latestDatetime?dataType=ir1&timeStamp=$`;//云图时间框的时间
const urlCloud = {
  'visibleLight': `${baseCloud}VIS${endOfCloud}`,         //可见光
  'InfraRed': `${baseCloud}IR1${endOfCloud}`,             //红外线
  'steam': `${baseCloud}IR3${endOfCloud}`                 //水汽
};
const cloudBounds = [
    [53.55, 73.66],
    [3.86,150]
];

//云图事件
let cloudLoad = false;        //用于判断图层是否加载完毕
$('#cloudOverlay li').click(function(e) {
  e.stopPropagation();
  const id = $(this).attr('id');
  
  if ($(this).hasClass('on')) {
    if(cloudLoad) {
      cloudLoad = false;
      $(this).removeClass('on');
      overlay.removeOverlay(id);
      removeNewsTip(id)
    }
  } else {
    if($(this).siblings('li').hasClass('on') && !cloudLoad)  return;

    let getTimeUrl = getTime + `&cacheCtrl=${Date.now()}`
    $.ajax({url:getTimeUrl}).then(data =>{
      let time = data
      let url = urlCloud[id].replace('{datetime}', new Date(time).Format('yyyy-MM-dd HH:00:00')) + `&cacheCtrl=${Date.now()}`

      cloudLoad = false;
      let $bro = $(this).siblings('li.on')
      $(this).addClass('on')
      $bro.removeClass('on')
      removeNewsTip($bro.attr('id'))
      let showTimeUrl = showTime + `&cacheCtrl=${Date.now()}`
      $.ajax({url: showTimeUrl}).then(msg => {
        let datetime = new Date(msg).Format('yyyy-MM-dd HH:00')
        for (let item in urlCloud) {
          if (id === item) {
            let img = new Image();
            img.onload = () => {
              cloudLoad = true;
              overlay.addImageOverlay(id, url, cloudBounds);
              let cname = ''
              switch(item) {
                case 'InfraRed': cname = '红外云图'; break;
                case 'steam': cname = '水汽云图'; break;
                case 'visibleLight': cname = '可见光云图'; break;
              }
              addNewsTip(item, '北京时: '+ new Date(msg).Format('yyyy年MM月dd日 HH:00') + '&nbsp;' + cname)
              viewerCor()
            }
            img.onerror = () => {
              cloudLoad = true;
              getNoDataTips('.cloudNoData');
            }
            img.src = url;
          } else {
            overlay.removeOverlay(item);
          }
        }
      })
    })
  }
});
//组合反射率(雷达回波)
const mcrUrl = 'http://119.29.102.103:8111/roa1080/grid/swan/mcr/{datetime}/HTML/png/,,,,,/color/cache'
const dataMcrUrl = 'http://119.29.102.103:9022/dataunit/model/renderModelData?datetime={datetime}&model=swan&element=mcr&time=0&level=3&top=27&bottom=19.2&left=108.5&right=117&width=600&height=600 '
$('.tgReflex').click(function(e) {
  e.stopPropagation();
  if ($(this).hasClass('on')) {
    overlay.removeOverlay('mcr');
    removeNewsTip('tgReflex')
    $('.radar_colourCode').hide()
  } else {
    getImgFn(0, 'dataMcr', $(this));    
  }
  $(this).toggleClass('on');
});
const getImgFn = (i, type, $btn)=> {    //i为请求次数
  let time= Date.now() - Date.now() % (6*60*1000) - i*6*60*1000;
  time = new Date(time).Format('yyyy-MM-dd HH:mm:00')
  let url = type === 'mcr' ? mcrUrl : dataMcrUrl
  url = url.replace('{datetime}', time) + `&cacheCtrl=${Date.now()}`
  console.log(url)
  let img = new Image();
  img.onload = () => {
    if ($btn.hasClass('on'))
      addNewsTip('tgReflex', '北京时: ' + new Date(time.replace(/-/g, '/')).Format('yyyy年MM月dd日 HH:00') + '&nbsp;雷达回波')
    $btn.hasClass('on') ? overlay.addImageOverlay('mcr', url, bounds) : overlay.removeOverlay('mcr');
    viewerCor()
    $('.radar_colourCode').show()
  }
  img.onerror = () => {
    i++;
    if (type === 'dataMcr') {
      if(i < 3) getImgFn(i, 'dataMcr', $btn);
      
      else {
        i = 0
        getImgFn(i, 'mcr', $btn)
      }
    } else if (type === 'mcr') {
      if(i < 3) getImgFn(i, 'mcr', $btn);
      else {
        $('.radar_colourCode').hide()
        getNoDataTips('.cloudNoData');  // 取不到数据
      }
    }
    
  }
  img.src = url;
}
//雷暴追踪
$('.rsFollow').click(function(e) {
  e.stopPropagation();
  if($(this).hasClass('on'))  {
    overlay.removeOverlay('rainStorm');
    map.off('moveend', updateMap);
    // removeNewsTip('rainStorm')
  } else {
    getRsImg(0,$(this),(flag) => {
      if (!flag) {
        overlay.removeOverlay('rainStorm')
        map.off('moveend', updateMap);
      }
    });
  }
  $(this).toggleClass('on');
});
//获取雷暴追踪链接
let rsIndex = 0;
const getRsUrl = (i) => {
  // let time = Date.now() - i*60*60*1000;
  // let date = new Date(time).Format('yyyy-MM-dd HH:00:00');
  let ms = Date.now();
  ms -= (ms%360000 + i*360000);
  let date = new Date(ms).Format('yyyy-MM-dd HH:mm:00');
  let mapBound = map.getBounds();
  let left = mapBound.getWest(),
      right = mapBound.getEast(),
      bottom = mapBound.getSouth(),
      top = mapBound.getNorth();
  let rsbounds = [
    [top, left],
    [bottom, right]
  ];
  let contSize = map.getSize();
  // const url = `http://119.29.102.103:8111/roa1080/grid/thunder/titan/${date}/json/png/${left},${right},${top},${bottom},${contSize.x},${contSize.y}/color/cache?cacheCtrl=${Date.now()}`;
  const url = `http://119.29.102.103:9022/dataunit/titan/renderTitan?datetime=${date}&top=${top}&bottom=${bottom}&left=${left}&right=${right}&width=${contSize.x}&height=${contSize.y}&cacheCtrl=${Date.now()}`
  console.log(url)
  return {
    url,
    bounds: rsbounds
  };
}
//加载雷暴追踪函数
const getRsImg = (i,$btn,fn) => {
  let ms = Date.now();
  ms -= (ms%360000 + i*360000);
  let date = new Date(ms).Format('yyyy-MM-dd HH:mm:00');
  const id = 'rainStorm';
  const url = getRsUrl(i).url;
  let img = new Image;
  fn = fn || $.noop();
  img.onload = () => {
    // addNewsTip('rainStorm', '北京时: ' + new Date(ms).Format('yyyy年MM月dd日 HH:00') + '&nbsp;雷暴追踪')
    rsIndex = i;
    const rsbounds = getRsUrl(i).bounds;
    overlay.removeOverlay(id);
    overlay.addBusinessOverlay(id, url, rsbounds, {zIndex: 300});
    viewerCor()
    $btn.hasClass('on') ? fn(true): fn(false);
    if ($btn.hasClass('on'))
      map.on('moveend', updateMap);
  }
  img.onerror = () => {
    ++i;
    if(i >= 3) {
      fn(false)
      getNoDataTips('.cloudNoData');
      return;
    }
    getRsImg(i,$btn,fn);
  }
  img.src = url;
}
//地图移动 图层变化函数
let updateFlag;
const updateMap = () => {
  let flag = updateFlag = Math.random();
  let rsUrlInfo = getRsUrl(rsIndex);
  const url = rsUrlInfo.url;
  const rsbounds = rsUrlInfo.bounds;
  let id = 'rainStorm';
  let img = new Image();
  img.onload = () => {
	if(flag !== updateFlag)
		return;
    overlay.addBusinessOverlay(id, url, rsbounds, {zIndex: 300});
  }
  img.onerror = () => {
	if(flag !== updateFlag)
		return;
    overlay.removeOverlay(id);
  }
  img.src = url;
}

//获取自动站 风向风速数据
let isWindCompAlive = false
let windMarker = []
const getWindData= () => {
  const siteUrl = `http://10.148.83.228:8922/dataunit/station/findStationData_Latest?types[]=A&elements[]=wd2dd&elements[]=wd2df&elements[]=lat&elements[]=lon&provinces[]=广东&cacheCtrl=${Date.now()}`;
  const time= Date.now() - Date.now() % (5*60*1000) - 15*60*1000;
  let datetime = new Date( time).Format('yyyy-MM-dd HH:mm:00');
  $.ajax({url:siteUrl})
  .then(data =>{
    if (!isWindCompAlive) return
    // data = JSON.parse(data)
    if(/DB_ERROR/.test(data)) { getNoDataTips('.seaWave_noData'); return }
    const siteIcon = L.icon({
      iconUrl: 'assets/station.png',
      iconSize: [5, 5],
      iconAnchor: [2.5, 2.5]
    });
    const options = {
      icon: siteIcon,
      zIndexOffset: 1000,
    };
    var icon = { 
      iconUrl: 'assets/arrowhead@3x.png',      // 图片地址
      iconSize: [10,14], 
      iconAnchor: [5, 14] 
    }
    for (let item of data) {
      let center = [item.elems.lat, item.elems.lon]
      overlay.addMarker('sitePoint', center, options)
      if (item.elems.wd2dd) {
        let marker =L.angleMarker([item.elems.lat, item.elems.lon], { icon: new L.Icon(icon), iconAngle: item.elems.wd2dd, iconOrigin: '50% 100%' })
        windMarker.push(marker)
        marker.addTo(map)
      }
      if (item.elems.wd2df) {
        let className
        if (item.elems.wd2df < 90 || item.elems.wd2df > 270) className = 'wind_veltop'
        else className = 'wind_velbot'
        const opts = L.divIcon({
          html: `<div class="${className}">${ Math.floor(item.elems.wd2df * 100) / 100 + 'm/s' }</div>`
        });
        overlay.addMarker('windVel', [item.elems.lat, item.elems.lon], { icon: opts })
      }
    }



    // let windObj ={};
    // data.map(info =>{
    //   let center = [ info.latitude, info.longitude];
    //   overlay.addMarker('sitePoint', center, options);
    //   windObj[info.stationid] = info;
    // })
    // data.map(info =>{
    //   let center = [info.elems.lat,info.elems.lon];
    //   overlay.addMarker('sitePoint', center, options);
    //   windObj[info.id] = info;
    // })
    // viewerCor()
    // console.log(windObj)
    // $.ajax({url: windUrl}).then(msg => {
    //   if (!isWindCompAlive) return
    //   addNewsTip('wind', '北京时: ' + new Date(time).Format('yyyy年MM月dd日 HH:00') + '&nbsp;实时风况')
    //   msg = JSON.parse(msg);
    //   if(/DB_ERROR/.test(msg)) { getNoDataTips('.seaWave_noData'); return }
    //   console.log(msg)
    //   console.log(windObj)
    //   for (let info of msg) {
    //     if(windObj[info.id]) {
    //       windObj[info.id] = Object.assign(windObj[info.id], info)
    //     }
    //   }
     
    //   var icon = { 
    //     iconUrl: 'assets/arrowhead@3x.png',      // 图片地址
    //     iconSize: [10,14], 
    //     iconAnchor: [5, 14] 
    //   }
    //   for (let i in windObj) {
    //     let item = windObj[i]
    //     if (item.wind_dir) {
    //       let marker =L.angleMarker([item.elems.lat, item.elems.lon], { icon: new L.Icon(icon), iconAngle: item.wind_dir, iconOrigin: '50% 100%' })
    //       windMarker.push(marker)
    //       marker.addTo(map)
    //     }
    //     if (item.wind_vel) {
    //       let className
    //       if (item.wind_dir < 90 || item.wind_dir > 270) className = 'wind_veltop'
    //       else className = 'wind_velbot'
    //       const opts = L.divIcon({
    //         html: `<div class="${className}">${ Number(item.wind_vel) + 'm/s' }</div>`
    //       });
    //       overlay.addMarker('windVel', [item.elems.lat, item.elems.lon], { icon: opts })
    //     }
    //   }
    // })
  })
}
//实况风 
$('.actualWind').click(function(e){
  e.stopPropagation();

  if($(this).hasClass('on'))  {
    isWindCompAlive = false
    overlay.removeOverlay('sitePoint')
    overlay.removeOverlay('windVel')
    for (let opt of windMarker) {
      map.removeLayer(opt)
    }
    windMarker = []
    removeNewsTip('wind')
  } else {
    isWindCompAlive = true
    getWindData();
  }
  $(this).toggleClass('on');

})


//降水
// let getImageStringUrl = 'http://119.29.102.103:9002/nc/jsonp/bin/contour?binInfoArea.modelName=qpfacc&binInfoArea.datetime={date}&binInfoArea.varname=rain&binInfoArea.level=60&bounds.left=108.5&bounds.right=118.99&bounds.top=27&bounds.bottom=18.21&bounds.width=1050&bounds.height=880&shaderOn=true&contourOn=false&contourLabelOn=false&projName=equ'
let getImageStringUrl = `http://119.29.102.103:9022/dataunit/temporary/renderTemporaryData?datetime={date}&type=swan&element=qpf&time=60&level=3&top=27&bottom=19&left=108.5&right=119.0&width=600&height=600`
let rainTimes = []      // 10个时间戳
let rainLayer           // 云图图层

// 获取有数据的时间
const getRainTime = () => {
  return new Promise((resolve, reject) => {
    // let url = 'http://119.29.102.103:18888/' + Coder.encode('zxhcqpfimage/getpictime/user/post/,/')
    // $.ajax({ url }).then(res => {
    //   if (res.result === 'S_OK') resolve(res.tagObject)
    //   else reject()
    // })
    let url = `http://10.148.83.228:8922/dataunit/temporary/findTemporaryDataHeader_Latest?type=swan&element=qpf&time=60&level=3`
    $.ajax({ url }).then(res => {
      console.log(res)
      resolve(res[0].datetime)
    })
    
  })
}

// 获取图片链接
const getRainUrl = datetime => {
  return `http://119.29.102.103:9022/dataunit/temporary/renderTemporaryData?datetime=${datetime}&type=swan&element=qpf&time=60&level=3&top=27&bottom=19&left=108.5&right=119.0&width=800&height=800`
  // return new Promise((resolve, reject) => {
  //   console.log(datetime)
  //   let url = getImageStringUrl.replace('{date}', datetime) + `&cacheCtrl=${Date.now()}`
  //   $.ajax({ url, dataType: 'jsonp' }).then(res => {
  //     if (res == null)
  //       reject()
  //     else {
  //       console.log('http://119.29.102.103:9002/' + res)
  //       resolve('http://119.29.102.103:9002/' + res)
  //     }
  //   })
  // })
}

$('.rainForecast').click(function(e) {
  if ($(this).hasClass('on')) {
    // removeNewsTip('rainForecast')
    $(this).removeClass('on');
    $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}, () => {
        if($('.buttonPlay').hasClass('on')) $('.buttonPlay').click();
        initProgress();
    });
    $('.rainProgressbar').removeClass('on');
    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    removeRainLayer()
  } else {
    $(this).addClass('on');
    $('.early_warn').stop().animate({bottom:'-4.8rem'});
    if(map.hasEventListeners('click', hidePreWarnPopup)) {  // 移除预警状态的点击和移动地图事件
        map.removeEventListener('click', hidePreWarnPopup);
        map.removeEventListener('movestart', hidePreWarnPopup);
    }
    getRainTime()
    .then(res => {
      // for (let opt of res) { 
      //   rainTimes.push(new Date(opt).Format('yyyy-MM-dd HH:mm:00'))
      // }
      for(let i=0; i<10; i++){
        let qpfTime = res - i*6*60*1000
        rainTimes.unshift(new Date(qpfTime).Format('yyyy-MM-dd HH:mm:00'))
      }

      let datetime = new Date(rainTimes[0].replace(/-/g, '/')).getTime() + 3600000
      let date = new Date(datetime).Format('yyyy-MM-dd HH:mm:00')
      $('.rain_nowtime').text(date)

      let url = getRainUrl(rainTimes[0])
      let img = new Image()
      img.onload = () => {
        // addNewsTip('rainForecast', '北京时: ' + new Date(datetime).Format('yyyy年MM月dd日 HH:mm') + '&nbsp;降水预测')

        $('.rainProgressbar').stop().animate({'bottom': '0rem'}).addClass('on');
        $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '3.33rem'});   
        addRainLayer(url)
        viewerCor()
      }
      img.onerror = () => {
        $('.rainProgressbar').stop().animate({'bottom': '0rem'}).addClass('on');
        $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '3.33rem'});
        getNoDataTips('.cloudNoData');
      }
      img.src = url

    })
    .catch(e => {
      getNoDataTips('.cloudNoData');
    })
  }
})

//恢复滚动条
const initProgress = () => {
  num = 0;
  $('.progressBar').stop().css('width', '10%');
  $('.progressFrame .grayPoint.in').removeClass('in');
  $('.buttonPlay.on').removeClass('on');
}

// 点击播放按钮
$('.buttonPlay').click(function(e) {
  e.stopPropagation();
  if($(this).hasClass('on')) {
      clearTimeout(timeout);
      timeout = null;
      $(this).removeClass('on');
  } else {
    intvEvent();
    $(this).addClass('on');
  }
});

// 播放事件
let num = 0, timeout;
const intvEvent = () => {
  ++num;
  if(num > 9) {
    num = 0
    $('.progressBar').stop().css('width', '10%')
    $('.progressFrame .grayPoint.in').removeClass('in')
  }

  if (num > 0)
    $('.point').eq(num - 1).children('.grayPoint').addClass('in'); 
  $('.progressBar').stop().animate({'width': 10 + num * 10 + '%'}, 2000);
  $('progressRing').stop().animate({'left': 10 + num * 10 + '%'}, 2000);

  let date = new Date(rainTimes[num].replace(/-/g, '/')).getTime() + 3600000
  date = new Date(date).Format('yyyy-MM-dd HH:mm:00')
  $('.rain_nowtime').text(date)

  let url = getRainUrl(rainTimes[num])
  let img = new Image()
  img.onload = () => {

    if($('.rainForecast').hasClass('on') && $('.buttonPlay').hasClass('on')) {
      addRainLayer(url)
      timeout = setTimeout(intvEvent, 2000);
    } else {
      removeRainLayer()
    }
  }
  img.onerror = () => {
    removeRainLayer()
    if($('.rainForecast').hasClass('on') && $('.buttonPlay').hasClass('on')) {
      timeout = setTimeout(intvEvent, 2000);
    }
  }
  img.src = url

}

// 进度条点击事件
$('.grayPoint').click(function() {
  if($('.buttonPlay').hasClass('on')) return
  const $this = $(this);

  $this.addClass('in'); 
  $this.next().addClass('in'); 
  const $parent = $this.parent();
  $parent.prevAll().children('.grayPoint').addClass('in');
  $parent.nextAll().children('.grayPoint').removeClass('in');

  const index = $this.parent().index();
  num = index - 1;
  $('.progressBar').css('width', 10 + num * 10 + '%')
  $('.progressRing').css('left', 10 + num * 10 + '%')

  let date = new Date(rainTimes[num].replace(/-/g, '/')).getTime() + 3600000
  date = new Date(date).Format('yyyy-MM-dd HH:mm:00')
  $('.rain_nowtime').text(date)

  let url = getRainUrl(rainTimes[num])
  let img = new Image()
  img.onload = () => {
    addRainLayer(url)
  }
  img.onerror = () => {
    removeRainLayer()
  }
  img.src = url
  
});

// 降水图层
const addRainLayer = url => {
  if (rainLayer) {
    rainLayer.setUrl(url)
  } else {
    rainLayer = L.imageOverlay(url, bounds, { zIndex: 300 })
    rainLayer.addTo(map)
  }
}

// 删除降水图层
const removeRainLayer = () => {
  if (rainLayer) {
    map.removeLayer(rainLayer)
    rainLayer = null
  }
}