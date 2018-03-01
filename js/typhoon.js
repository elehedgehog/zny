import { ZmapHelper } from './util/ZmapHelper.js'
import { removeAllArea, removeAreaInfo, addAreaInfo } from './business/alarmArea'
import { getVelLevel } from './util/wind.js'
import { hidePreWarnPopup } from './typhoonDom'
import { addNewsTip, removeNewsTip } from './util/newsTip'

let helper = null
const tyUrl = '/MeteoSyncServer/typhoon/getmsg' + `?cacheCtrl=${Date.now()}`,
      latestTyUrl = 'http://119.29.102.103:9021/typhoon/info/find_Latest_ByMaxtime?fcid=BCGZ&limit=3';
let tyLayerGroup = [],
    layersGoesBack = [],
    isTyDisplay = [];

let currentTyIds = [];    // 存放当前台风id集合 
let typhoonInfo = {}      // 存储前3个台风路径数据

export let tyCenter = {       //台风中心  (用于计算台风与决策区域的距离)
  0: null,
  1: null,
  2: null,
}
let moveView = true;

// --- 台风预报 --- //
const renderTyDOM = () => {
  let html = '';
  for(let tsid of currentTyIds) {
    html += `<li tsid="${tsid}"><a>${typhoonInfo[tsid].tscname}</a></li>`;
  }
  $('#tylistName ul').html(html);
  $('#tylistName ul li').eq(0).click();
}
// 台风列表点击选择台风
$('#tylistName').on('click', 'li', function() {
  $(this).addClass('on').siblings('li').removeClass('on');
  let tsid = Number($(this).attr('tsid'));
  getTyForecast(tsid);
});
const getTyForecast = tsid => {
  if (typhoonInfo[tsid].fst.length == 0) {
    $('.tylist_date ul').html('')
    $('#tyTsid').text('');
    $('#tyLongitude').text('');
    $('#tyLatitude').text('');
    $('#tyWindpower').text('');
    $('#tyWindspeed').text('');
    $('#tyCenterpressure').text('');
    $('#tySevencircle').text('');
    $('#tyTencircle').text('');
  } else {
    let html = '';
    for(let item of typhoonInfo[tsid].fst) {
      let time = item.time + item.leadtime*60*60*1000
      html += `<li time="${time}">
                <div class="tylistDate_div">
                  <p>${new Date(time).Format('dd')}日</p>
                  <p>${new Date(time).Format('HH')}时</p>
                </div>
              </li>`;
    }
    $('.tylist_date ul').html(html);
    $('.tylist_date ul li').eq(0).click();
  }
}
$('.tylist_date ul').scroll(function() {
  const visibleWidth = $(this).width()      //ul可视化区域宽度
  const totalWidth = document.querySelector('.tylist_date ul').scrollWidth   //ul总宽度
  const maxLeft = totalWidth - visibleWidth     //滚动条到左侧最大距离
  const left = $(this).scrollLeft()     //当前滚动条到左侧距离
  const lengthOfLi = $(this).find('li').length    //li个数
  const oneOfLi = maxLeft / lengthOfLi
  const n = Math.ceil(left / oneOfLi)
  $('.tylist_date ul li').eq(n).click()

  /*
  const left = $(this).scrollLeft()
  const widthOfLi = $('.tylist_date ul li').width()
  const liToLeft = document.querySelector('.tylist_date ul li.on').getBoundingClientRect().left
  if(liToLeft + 1/2 * widthOfLi < left) {
    const prev = Math.floor(left / widthOfLi),
        next = Math.ceil(left / widthOfLi)
    const n = left % widthOfLi
    if(n > 1/2 * widthOfLi) {
      $('.tylist_date ul li').eq(next).click()
    }
  }
  */
})
$('.tylist_date').on('click', 'li', function() {
  $(this).addClass('on').siblings('li').removeClass('on');
  let tsid = Number($('#tylistName li.on').attr('tsid'));
  let time = $(this).attr('time');
  for(let item of typhoonInfo[tsid].fst) {
    if(item.time + item.leadtime*60*60*1000 == time) {
      $('#tyTsid').text(tsid);
      $('#tyLongitude').text(item.lon);
      $('#tyLatitude').text(item.lat);
      $('#tyWindpower').text(getVelLevel(item.ws)+'级');
      $('#tyWindspeed').text(item.ws + '(m/s)');
      $('#tyCenterpressure').text(item.ps + '(hpa)');
      $('#tySevencircle').text(item.rr07 === null ? '无' : item.rr07 + 'km');
      $('#tyTencircle').text(item.rr10 === null ? '无' : item.rr10  + 'km');
      break;
    }
  }
});
// 台风列表、返回按钮
$('.typhoonList, #tylistReturn').on('click', function() {
    $('.tylist_content').toggle();
});
$('.typhoonList').click(function(){
   $('#tylistName ul li').eq(0).click();
   $('.tylist_date ul li').eq(0).click(); //初始化台风时次信息
   if($('.simiMatch').hasClass('on')) $('.closeSimi').click();
   if($('.early_warn').hasClass('on')) hidePreWarnPopup();
   if($('.cloudMap ul li:nth-child(1).on').length) $('.cloudMap ul li.on').eq(0).click(); 
   if($('.imgEx').hasClass('on')) $('.imgEx.on').click();
   if($('.cloudMap ul li:nth-child(2) img').hasClass('on')) $('.cloudMap ul li:nth-child(2) img.on').click();
   const $target = $('.cloudMap ul li').eq(0);
   if($target.hasClass('on')){
        $target.removeClass('on');
        $target.find('img').removeClass('on');
        const url = $target.find('img').data('url').replace('_pre', '');
        $target.find('img').attr('src', url);
    }
    $('.scrollbar').scrollLeft(0);
})


const initHelper = () => {
  return new Promise((resolve, reject) => {
    if (!window.positionCenter.length) {
      let int = setInterval(() => {
        if (window.positionCenter.length) {
          helper = new ZmapHelper(map, window.positionCenter)
          clearInterval(int)
          resolve()
        }
      }, 100)
    } else {
      helper = new ZmapHelper(map, window.positionCenter)
      resolve()
    }
  })
}


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

// 获取台风路径
const getTyphData = tsid => {
  return new Promise((resolve, reject) => {
    $.ajax({ url: `http://119.29.102.103:9021/typhoon/findForecastReal?tsid=${tsid}&_=${Date.now()}` })
    .then(res => {
      res = JSON.parse(res)
      let json = {
        tsid: tsid,
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

      typhoonInfo[tsid] = json
      resolve()
    })
  })
}

// 初始化上角台风菜单 添加点击事件  选中当前台风或第一个历史台风
const getTyphoon = (data) => {
  const len = data.length;
  for (let i = 0; i < len; i++) {
    tyLayerGroup.push('');
    layersGoesBack.push('');
    isTyDisplay.push(false);

    const tyLength = tyLayerGroup.length;
    let target = $(`#tyChange li:nth-child(${tyLength})`),
      targetChild = $(`#tyChange li:nth-child(${tyLength}) a`);
    targetChild.text(data[i].info.cname).attr('tsid',data[i].tsid);
    
    target.on('click', (e) => {
      e.stopPropagation();
      target.toggleClass('layer-selected');
      if(!target.hasClass('layer-selected')) {
        removeNewsTip(data[i].intlid)
        map.removeLayer(tyLayerGroup[i]);
        if(!$('#tyChangeWraper .layer-selected').length) {    //当前无台风选中
          removeAllArea();      //删除所有决策区 位置 距离DIV
          //const $target = $('.tySimilar .tyListUl_com').eq(-1);
          //if($target.hasClass('on')) $target.click();

          $('#simTyphoon ul li.simSelected').map(function() {
              $(this).click();        //清除选中台风
          });
          $('.simityList,.imgEx').hide();
          $('.tyCl_list,.imgEx').stop().animate({'bottom': '0.666667rem'});
          $('.simiMatch').css({transform: 'translateY(100%)', bottom: '0'});
        } else {
          removeAreaInfo(i);        //删除决策区关于该台风的信息 
        }
      } else {
        if(!isTyDisplay[i]) {
          isTyDisplay[i] = true;
          let lyGp = helper.drawTy(typhoonInfo[data[i].tsid]);
          tyLayerGroup[i] = lyGp.tyLayerGroup;
          layersGoesBack[i] = lyGp.layersGoesBack;
        } else {
          map.addLayer(tyLayerGroup[i]);
          layersGoesBack[i].map((el) => {
              el.layer.bringToBack();
          });
        }
        // 设置点击台风为视角中心
        const tyReal = typhoonInfo[data[i].tsid].real,
          realLen = tyReal.length;
        let lastReal = tyReal[realLen - 1]
        let lat = lastReal.lat;
        let lon = lastReal.lon;
        if(moveView)
          map.setView([lat, lon], 4);
        let lastrealTime = new Date(lastReal.datetime.replace(/-/g, '/')).getTime() + 8*60*60*1000
        // addNewsTip(data[i].intlid, '北京时: ' + new Date(lastrealTime).Format('yyyy年MM月dd日 HH:00') + '台风' + data[i].info.cname)

        if(!tyCenter[i]) tyCenter[i] = [lat, lon];
        addAreaInfo(i);           //添加决策区关于该台风的信息 
        $('.simityList,.imgEx').show();
      }
    });
  }

  $('#tyswNav li').eq(0).addClass('on');
  if(!currentTyIds.length) {
    $('#tyChange li:nth-child(1)').click();
  } else {
    currentTyIds.map((id, index) => {
      moveView = index === 0 ? true : false
      $('#tyChange li').map(function() {
        if($(this).find('a').attr('tsid') == id) {
          $(this).click();
        }
      });
    })
  }
}


// 获取最近3个台风数据
$.ajax({ url: latestTyUrl }).then(data => {
  data = JSON.parse(data)
  // !!!  for test
  // data[0].maxtime = new Date('2018-02-24 12:00:00').getTime()
  // data[1].maxtime = new Date('2018-02-24 10:00:00').getTime()
  let time = Date.now() - 12*60*60*1000
  for(let info of data) {
    if (info.maxtime > time)
      currentTyIds.push(info.tsid)
  }

  if(!currentTyIds.length) window.fstAreas = false;     //用于预警区域点 的判断
  window.currentTyNum = currentTyIds.length;            //当前台风数量

  // 获取台风详细数据
  let promiseArr = []
  for (let el of data) {
    promiseArr.push(getTyphData(el.tsid))
  }
  Promise.all(promiseArr)
  .then(() => {
    console.log(typhoonInfo)

    $('.hint-content')
    .text(currentTyIds.length ? '当前有台风' : '当前无台风')
    .fadeIn(500, () => {
      $('.hint-content').fadeOut(2000);
    });

    initHelper().then(() => {
      getTyphoon(data);
    })

    // 右下角台风预报
    if (currentTyIds.length) {
      $('.typhoonList').show()
      renderTyDOM()
    }
  })

});
