import { ZmapHelper } from './util/ZmapHelper.js'
import { removeAllArea, removeAreaInfo, addAreaInfo } from './business/alarmArea'
import { getVelLevel } from './util/wind.js'
import { hidePreWarnPopup } from './typhoonDom'
import { addNewsTip, removeNewsTip } from './util/newsTip'

let helper = null
const tyUrl = '/MeteoSyncServer/typhoon/getmsg' + `?cacheCtrl=${Date.now()}`,
      latestTyUrl = '/MeteoSyncServer/typhoon/getlatest?num=3' + `&cacheCtrl=${Date.now()}`;
let tyLayerGroup = [],
    layersGoesBack = [],
    isTyDisplay = [];

export let tyCenter = {       //台风中心  (用于计算台风与决策区域的距离)
  0: null,
  1: null,
  2: null,
}
let moveView = true;

const getTyphoon = (data, currentTyIds) => {        //最近3个台风数据点击事件
  const len = data.length;
  for (let i = 0; i < len; i++) {
    tyLayerGroup.push('');
    layersGoesBack.push('');
    isTyDisplay.push(false);

    const tyLength = tyLayerGroup.length;
    let target = $(`#tyChange li:nth-child(${tyLength})`),
      targetChild = $(`#tyChange li:nth-child(${tyLength}) a`);
    targetChild.text(data[i].tscname).attr('tsid',data[i].tsid);
    
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
          let lyGp = helper.drawTy(data[i]);
          tyLayerGroup[i] = lyGp.tyLayerGroup;
          layersGoesBack[i] = lyGp.layersGoesBack;
        } else {
          map.addLayer(tyLayerGroup[i]);
          layersGoesBack[i].map((el) => {
              el.layer.bringToBack();
          });
        }
        // 设置点击台风为视角中心
        const tyReal = data[i].real,
          realLen = tyReal.length;
        let lastReal = tyReal[realLen - 1]
        let lat = lastReal.lat;
        let lon = lastReal.lon;
        if(moveView)
          map.setView([lat, lon], 4);
        let lastrealTime = new Date(lastReal.datetime.replace(/-/g, '/')).getTime() + 8*60*60*1000
        // addNewsTip(data[i].intlid, '北京时: ' + new Date(lastrealTime).Format('yyyy年MM月dd日 HH:00') + '台风' + data[i].tscname)

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



// --- 台风预报 --- //
let currentTyphoon = [];
const renderTyDOM = () => {
  let html = '';
  for(let info of currentTyphoon) {
    html += `<li tsid="${info.tsid}"><a>${info.tscname}</a></li>`;
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
  for(let info of currentTyphoon) {
    if(info.tsid === tsid) {
      let html = '';
      for(let item of info.fst) {
        let time = new Date(item.time);
        html += `<li time="${item.time}">
                  <div class="tylistDate_div">
                    <p>${time.Format('dd')}日</p>
                    <p>${time.Format('HH')}时</p>
                  </div>
                </li>`;
      }
      $('.tylist_date ul').html(html);
      $('.tylist_date ul li').eq(0).click();
      break;
    }
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
  for(let info of currentTyphoon) {
    if(info.tsid === tsid) {
      for(let item of info.fst) {
        if(item.time === time) {
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
      break;
    }
  }
});
// 台风列表、返回按钮
$('.typhoonList, #tylistReturn').on('click', function() {
    $('.tylist_content').toggle();
});
$('.typhoonList').click(function(){
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


// //获取最近3个台风数据
const getlatTy = (currentTyIds) => {
  // $.ajax({ url: latestTyUrl }).then(data => {
    let data = [{"tsid":538,"intlid":"1725","tscname":"鸿雁","tsename":"kirogi","real":[{"tsid":538,"datetime":"2017-11-19 09:00:00","level":"TD","lon":108.8,"lat":11.6,"ps":1004.0,"ws":14.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-19 06:00:00","level":"TD","lon":109.3,"lat":11.4,"ps":1003.0,"ws":16.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-19 03:00:00","level":"TS","lon":110.1,"lat":10.8,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-19 00:00:00","level":"TS","lon":110.8,"lat":10.7,"ps":1000.0,"ws":20.0,"rr06":"300.0","rr07":"190.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 21:00:00","level":"TS","lon":111.0,"lat":10.5,"ps":1000.0,"ws":20.0,"rr06":"300.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 18:00:00","level":"TS","lon":111.1,"lat":11.2,"ps":998.0,"ws":20.0,"rr06":"300.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 15:00:00","level":"TS","lon":111.3,"lat":11.8,"ps":998.0,"ws":20.0,"rr06":null,"rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 12:00:00","level":"TS","lon":112.0,"lat":11.6,"ps":998.0,"ws":20.0,"rr06":"300.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 09:00:00","level":"TS","lon":112.4,"lat":11.5,"ps":998.0,"ws":20.0,"rr06":"300.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 06:00:00","level":"TS","lon":113.3,"lat":11.3,"ps":998.0,"ws":20.0,"rr06":"300.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 03:00:00","level":"TS","lon":114.0,"lat":11.3,"ps":998.0,"ws":20.0,"rr06":null,"rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-18 00:00:00","level":"TS","lon":114.8,"lat":10.9,"ps":1000.0,"ws":18.0,"rr06":"280.0","rr07":"150.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 21:00:00","level":"TS","lon":115.6,"lat":10.5,"ps":1000.0,"ws":18.0,"rr06":"280.0","rr07":"170.0","rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 18:00:00","level":"TD","lon":116.4,"lat":10.3,"ps":1004.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 15:00:00","level":"TD","lon":116.9,"lat":10.2,"ps":1004.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 12:00:00","level":"TD","lon":117.0,"lat":10.2,"ps":1004.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 09:00:00","level":"TD","lon":117.7,"lat":10.1,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 06:00:00","level":"TD","lon":118.2,"lat":9.9,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 03:00:00","level":"TD","lon":119.0,"lat":9.2,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-17 00:00:00","level":"TD","lon":119.4,"lat":9.0,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-16 21:00:00","level":"TD","lon":121.0,"lat":7.9,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-16 18:00:00","level":"TD","lon":122.5,"lat":7.3,"ps":1006.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":538,"datetime":"2017-11-16 15:00:00","level":"TD","lon":123.1,"lat":7.3,"ps":1007.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"fst":[{"tsid":null,"datetime":"2017-11-19 09:00:00","leadtime":6,"level":"TD","lon":107.9,"lat":12.0,"ps":1006.0,"ws":10.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"tan":[{"leftlon":107.80252676814716,"leftlat":11.780685228331139,"rightlon":107.99747323185282,"rightlat":12.219314771668863}]},{"tsid":537,"intlid":"1724","tscname":"海葵","tsename":"haikui","real":[{"tsid":537,"datetime":"2017-11-12 09:00:00","level":"TD","lon":111.9,"lat":17.4,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 08:00:00","level":"TS","lon":112.0,"lat":17.5,"ps":1002.0,"ws":18.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 07:00:00","level":"TS","lon":112.2,"lat":17.5,"ps":1002.0,"ws":18.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 06:00:00","level":"TS","lon":112.3,"lat":17.5,"ps":1000.0,"ws":20.0,"rr06":"300.0","rr07":"190.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 05:00:00","level":"TS","lon":112.5,"lat":17.6,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 04:00:00","level":"TS","lon":112.6,"lat":17.6,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 03:00:00","level":"TS","lon":112.7,"lat":17.7,"ps":1000.0,"ws":20.0,"rr06":"300.0","rr07":"190.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 02:00:00","level":"TS","lon":112.8,"lat":17.8,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 01:00:00","level":"TS","lon":113.0,"lat":17.9,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-12 00:00:00","level":"TS","lon":113.1,"lat":17.8,"ps":1000.0,"ws":20.0,"rr06":"300.0","rr07":"190.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 23:00:00","level":"TS","lon":113.3,"lat":17.8,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 22:00:00","level":"TS","lon":113.4,"lat":17.8,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 21:00:00","level":"TS","lon":113.5,"lat":17.7,"ps":1000.0,"ws":20.0,"rr06":"240.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 20:00:00","level":"TS","lon":113.5,"lat":17.7,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 19:00:00","level":"TS","lon":113.5,"lat":17.7,"ps":1000.0,"ws":20.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 18:00:00","level":"TS","lon":113.5,"lat":17.7,"ps":1000.0,"ws":20.0,"rr06":"240.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 17:00:00","level":"TS","lon":113.6,"lat":17.7,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 16:00:00","level":"TS","lon":113.7,"lat":17.8,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 15:00:00","level":"TS","lon":114.0,"lat":17.8,"ps":990.0,"ws":23.0,"rr06":"260.0","rr07":"120.0","rr08":"40.0","rr10":null},{"tsid":537,"datetime":"2017-11-11 14:00:00","level":"TS","lon":114.4,"lat":17.8,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 13:00:00","level":"STS","lon":114.6,"lat":17.8,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 12:00:00","level":"STS","lon":114.8,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":"280.0","rr07":"140.0","rr08":"50.0","rr10":null},{"tsid":537,"datetime":"2017-11-11 11:00:00","level":"STS","lon":115.0,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 10:00:00","level":"STS","lon":115.1,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 09:00:00","level":"STS","lon":115.2,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":"280.0","rr07":"140.0","rr08":"50.0","rr10":null},{"tsid":537,"datetime":"2017-11-11 08:00:00","level":"STS","lon":115.2,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 07:00:00","level":"STS","lon":115.3,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 06:00:00","level":"STS","lon":115.3,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":"280.0","rr07":"140.0","rr08":"50.0","rr10":null},{"tsid":537,"datetime":"2017-11-11 05:00:00","level":"STS","lon":115.5,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 04:00:00","level":"STS","lon":115.6,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 03:00:00","level":"STS","lon":115.7,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":"280.0","rr07":"140.0","rr08":"50.0","rr10":null},{"tsid":537,"datetime":"2017-11-11 02:00:00","level":"STS","lon":115.7,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-11 01:00:00","level":"STS","lon":115.8,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"130.0","rr08":null,"rr10":"80.0"},{"tsid":537,"datetime":"2017-11-11 00:00:00","level":"STS","lon":115.8,"lat":17.9,"ps":985.0,"ws":25.0,"rr06":"280.0","rr07":"130.0","rr08":"50.0","rr10":"80.0"},{"tsid":537,"datetime":"2017-11-10 23:00:00","level":"TS","lon":115.9,"lat":17.8,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 22:00:00","level":"TS","lon":116.4,"lat":17.5,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 21:00:00","level":"TS","lon":116.5,"lat":17.5,"ps":990.0,"ws":23.0,"rr06":"260.0","rr07":"120.0","rr08":"40.0","rr10":null},{"tsid":537,"datetime":"2017-11-10 20:00:00","level":"TS","lon":116.5,"lat":17.4,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 19:00:00","level":"TS","lon":116.7,"lat":17.3,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 18:00:00","level":"TS","lon":116.9,"lat":17.2,"ps":990.0,"ws":23.0,"rr06":"260.0","rr07":"120.0","rr08":"40.0","rr10":null},{"tsid":537,"datetime":"2017-11-10 17:00:00","level":"TS","lon":117.1,"lat":17.1,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 16:00:00","level":"TS","lon":117.4,"lat":17.1,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"120.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 15:00:00","level":"TS","lon":117.6,"lat":17.1,"ps":990.0,"ws":23.0,"rr06":"260.0","rr07":"120.0","rr08":"40.0","rr10":null},{"tsid":537,"datetime":"2017-11-10 14:00:00","level":"TS","lon":117.6,"lat":17.0,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 13:00:00","level":"TS","lon":117.6,"lat":16.9,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 12:00:00","level":"TS","lon":117.7,"lat":16.9,"ps":995.0,"ws":20.0,"rr06":"240.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 11:00:00","level":"TS","lon":117.7,"lat":16.8,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 10:00:00","level":"TS","lon":117.8,"lat":16.8,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 09:00:00","level":"TS","lon":118.0,"lat":16.5,"ps":995.0,"ws":20.0,"rr06":"240.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 08:00:00","level":"TS","lon":118.0,"lat":16.4,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 07:00:00","level":"TS","lon":118.1,"lat":16.2,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 06:00:00","level":"TS","lon":118.2,"lat":16.0,"ps":995.0,"ws":20.0,"rr06":"240.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 05:00:00","level":"TS","lon":118.5,"lat":15.6,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 04:00:00","level":"TS","lon":118.7,"lat":15.4,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 03:00:00","level":"TS","lon":118.9,"lat":15.2,"ps":995.0,"ws":20.0,"rr06":"280.0","rr07":"100.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-10 00:00:00","level":"TS","lon":119.4,"lat":15.0,"ps":998.0,"ws":18.0,"rr06":"260.0","rr07":"80.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 21:00:00","level":"TS","lon":119.8,"lat":14.8,"ps":998.0,"ws":18.0,"rr06":"280.0","rr07":"170.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 18:00:00","level":"TS","lon":120.3,"lat":14.2,"ps":998.0,"ws":18.0,"rr06":"280.0","rr07":"170.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 15:00:00","level":"TS","lon":121.0,"lat":14.0,"ps":998.0,"ws":18.0,"rr06":"280.0","rr07":"170.0","rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 12:00:00","level":"TD","lon":121.5,"lat":13.8,"ps":1000.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 09:00:00","level":"TD","lon":122.2,"lat":13.5,"ps":1000.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":537,"datetime":"2017-11-09 06:00:00","level":"TD","lon":122.8,"lat":13.0,"ps":1000.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"fst":[{"tsid":null,"datetime":"2017-11-12 09:00:00","leadtime":6,"level":"TD","lon":111.3,"lat":17.2,"ps":1008.0,"ws":12.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"tan":[{"leftlon":111.37589466384405,"leftlat":16.972316008467878,"rightlon":111.22410533615597,"rightlat":17.427683991532124}]},{"tsid":534,"intlid":"1723","tscname":"达维","tsename":"damrey","real":[{"tsid":534,"datetime":"2017-11-04 12:00:00","level":"TD","lon":106.4,"lat":12.5,"ps":1005.0,"ws":14.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-04 09:00:00","level":"TS","lon":107.5,"lat":12.5,"ps":995.0,"ws":20.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-04 06:00:00","level":"STS","lon":108.0,"lat":12.5,"ps":982.0,"ws":28.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-04 03:00:00","level":"TY","lon":108.5,"lat":12.5,"ps":975.0,"ws":33.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-04 00:00:00","level":"TY","lon":109.1,"lat":12.6,"ps":965.0,"ws":38.0,"rr06":"460.0","rr07":"350.0","rr08":"240.0","rr10":"120.0"},{"tsid":534,"datetime":"2017-11-03 23:00:00","level":"STY","lon":109.2,"lat":12.7,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 22:00:00","level":"STY","lon":109.6,"lat":12.7,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 21:00:00","level":"STY","lon":109.7,"lat":12.7,"ps":955.0,"ws":42.0,"rr06":"500.0","rr07":"380.0","rr08":"280.0","rr10":"120.0"},{"tsid":534,"datetime":"2017-11-03 20:00:00","level":"STY","lon":110.0,"lat":12.8,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 19:00:00","level":"STY","lon":110.2,"lat":12.8,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 18:00:00","level":"STY","lon":110.3,"lat":12.8,"ps":955.0,"ws":42.0,"rr06":"510.0","rr07":"380.0","rr08":"260.0","rr10":"120.0"},{"tsid":534,"datetime":"2017-11-03 17:00:00","level":"STY","lon":110.6,"lat":12.8,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 16:00:00","level":"STY","lon":110.8,"lat":12.9,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 15:00:00","level":"STY","lon":110.9,"lat":12.9,"ps":955.0,"ws":42.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 14:00:00","level":"TY","lon":111.2,"lat":12.9,"ps":960.0,"ws":40.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 13:00:00","level":"TY","lon":111.5,"lat":12.9,"ps":960.0,"ws":40.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 12:00:00","level":"TY","lon":111.6,"lat":12.9,"ps":960.0,"ws":40.0,"rr06":"500.0","rr07":"370.0","rr08":"250.0","rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 11:00:00","level":"TY","lon":111.8,"lat":12.9,"ps":960.0,"ws":40.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 10:00:00","level":"TY","lon":112.0,"lat":12.9,"ps":960.0,"ws":40.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 09:00:00","level":"TY","lon":112.2,"lat":12.9,"ps":965.0,"ws":38.0,"rr06":"500.0","rr07":"370.0","rr08":"210.0","rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 08:00:00","level":"TY","lon":112.4,"lat":12.8,"ps":970.0,"ws":35.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 07:00:00","level":"TY","lon":112.6,"lat":12.8,"ps":970.0,"ws":35.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 06:00:00","level":"TY","lon":112.7,"lat":12.8,"ps":970.0,"ws":35.0,"rr06":"490.0","rr07":"360.0","rr08":"220.0","rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 05:00:00","level":"TY","lon":112.8,"lat":12.8,"ps":975.0,"ws":33.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 04:00:00","level":"TY","lon":112.9,"lat":12.8,"ps":975.0,"ws":33.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 03:00:00","level":"TY","lon":113.1,"lat":12.7,"ps":975.0,"ws":33.0,"rr06":"410.0","rr07":"300.0","rr08":"200.0","rr10":"90.0"},{"tsid":534,"datetime":"2017-11-03 02:00:00","level":"TY","lon":113.2,"lat":12.7,"ps":975.0,"ws":33.0,"rr06":null,"rr07":"450.0","rr08":null,"rr10":"100.0"},{"tsid":534,"datetime":"2017-11-03 01:00:00","level":"STS","lon":113.3,"lat":12.7,"ps":980.0,"ws":30.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":"50.0"},{"tsid":534,"datetime":"2017-11-03 00:00:00","level":"STS","lon":113.5,"lat":12.7,"ps":980.0,"ws":30.0,"rr06":"480.0","rr07":"350.0","rr08":"180.0","rr10":"60.0"},{"tsid":534,"datetime":"2017-11-02 23:00:00","level":"STS","lon":113.7,"lat":12.6,"ps":982.0,"ws":28.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":"50.0"},{"tsid":534,"datetime":"2017-11-02 22:00:00","level":"STS","lon":113.7,"lat":12.6,"ps":982.0,"ws":28.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":"50.0"},{"tsid":534,"datetime":"2017-11-02 21:00:00","level":"STS","lon":113.7,"lat":12.6,"ps":982.0,"ws":28.0,"rr06":"400.0","rr07":"350.0","rr08":"200.0","rr10":"50.0"},{"tsid":534,"datetime":"2017-11-02 20:00:00","level":"STS","lon":113.8,"lat":12.6,"ps":982.0,"ws":28.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":"50.0"},{"tsid":534,"datetime":"2017-11-02 19:00:00","level":"STS","lon":113.9,"lat":12.6,"ps":982.0,"ws":28.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":"50.0"},{"tsid":534,"datetime":"2017-11-02 18:00:00","level":"STS","lon":114.0,"lat":12.6,"ps":985.0,"ws":25.0,"rr06":"400.0","rr07":"350.0","rr08":"200.0","rr10":null},{"tsid":534,"datetime":"2017-11-02 17:00:00","level":"STS","lon":114.1,"lat":12.7,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 16:00:00","level":"STS","lon":114.4,"lat":12.7,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 15:00:00","level":"STS","lon":114.7,"lat":12.8,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 14:00:00","level":"STS","lon":115.0,"lat":12.8,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 13:00:00","level":"STS","lon":115.3,"lat":12.8,"ps":985.0,"ws":25.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 12:00:00","level":"STS","lon":115.5,"lat":12.9,"ps":985.0,"ws":25.0,"rr06":"400.0","rr07":"350.0","rr08":"200.0","rr10":null},{"tsid":534,"datetime":"2017-11-02 11:00:00","level":"TS","lon":115.8,"lat":13.1,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 10:00:00","level":"TS","lon":116.0,"lat":13.1,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 09:00:00","level":"TS","lon":116.1,"lat":13.1,"ps":990.0,"ws":23.0,"rr06":"400.0","rr07":"350.0","rr08":"200.0","rr10":null},{"tsid":534,"datetime":"2017-11-02 08:00:00","level":"TS","lon":116.4,"lat":13.0,"ps":990.0,"ws":23.0,"rr06":null,"rr07":"400.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 07:00:00","level":"TS","lon":116.7,"lat":13.0,"ps":995.0,"ws":20.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 06:00:00","level":"TS","lon":116.8,"lat":13.0,"ps":995.0,"ws":20.0,"rr06":"300.0","rr07":"190.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 05:00:00","level":"TS","lon":116.9,"lat":12.8,"ps":998.0,"ws":18.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 04:00:00","level":"TS","lon":117.0,"lat":12.7,"ps":998.0,"ws":18.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 03:00:00","level":"TS","lon":117.1,"lat":12.6,"ps":998.0,"ws":18.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 02:00:00","level":"TS","lon":117.2,"lat":12.6,"ps":998.0,"ws":18.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 01:00:00","level":"TS","lon":117.4,"lat":12.6,"ps":999.0,"ws":18.0,"rr06":null,"rr07":"300.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-02 00:00:00","level":"TS","lon":117.5,"lat":12.5,"ps":999.0,"ws":18.0,"rr06":"280.0","rr07":"170.0","rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 21:00:00","level":"TD","lon":117.6,"lat":12.1,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 18:00:00","level":"TD","lon":117.8,"lat":12.0,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 15:00:00","level":"TD","lon":118.2,"lat":12.0,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 12:00:00","level":"TD","lon":119.0,"lat":11.9,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 09:00:00","level":"TD","lon":119.7,"lat":11.8,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 06:00:00","level":"TD","lon":120.1,"lat":11.8,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 03:00:00","level":"TD","lon":120.7,"lat":11.6,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-11-01 00:00:00","level":"TD","lon":120.8,"lat":11.6,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-10-31 21:00:00","level":"TD","lon":121.4,"lat":11.5,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-10-31 18:00:00","level":"TD","lon":122.2,"lat":11.3,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-10-31 15:00:00","level":"TD","lon":123.0,"lat":11.2,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-10-31 12:00:00","level":"TD","lon":123.9,"lat":11.1,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":534,"datetime":"2017-10-31 09:00:00","level":"TD","lon":125.2,"lat":11.0,"ps":1005.0,"ws":15.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"fst":[{"tsid":null,"datetime":"2017-11-04 00:00:00","leadtime":6,"level":"STS","lon":105.2,"lat":12.4,"ps":982.0,"ws":28.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null},{"tsid":null,"datetime":"2017-11-04 00:00:00","leadtime":12,"level":"TD","lon":103.6,"lat":12.3,"ps":1002.0,"ws":16.0,"rr06":null,"rr07":null,"rr08":null,"rr10":null}],"tan":[{"leftlon":105.21993091516488,"leftlat":12.16082901802123,"rightlon":105.1800690848351,"rightlat":12.63917098197877},{"leftlon":103.62994157735449,"leftlat":11.820934762328214,"rightlon":103.57005842264552,"rightlat":12.779065237671787}]}]
    for (let opt of data) {
      if(!opt.tscname) opt.tscname = '未命名'
    }
    if (!data.length) return;
    // 初始化helper
    initHelper().then(() => {
      getTyphoon(data, currentTyIds);
    })
  // });
}



//查询当前是否有台风
// $.get(tyUrl, (data) => {
  let data = []
    for (let opt of data) {
      if(!opt.tscname) opt.tscname = '未命名'
    }
    const num = data.length;

    let currentTyIds = [];      //存放当前台风id集合
    for(let info of data) {
      currentTyIds.push(info.tsid)
    }
    
    if(!data.length) window.fstAreas = false;     //用于预警区域点 的判断
    window.currentTyNum = data.length;            //当前台风数量
    const text = num ? '当前有台风' : '当前无台风';

    currentTyphoon = data;
    for(let info of data) {
      if(info.fst.length) {
        info.fst.map(item => {
          let time = new Date(item.datetime.replace(/\-/g, "/")).getTime();
          time += (8 + item.leadtime) * 60 * 60 * 1000;
          item.time = new Date(time).Format('yyyy/MM/dd HH:mm:ss');
        });
        $('.typhoonList').show();
      }
    }
    renderTyDOM();

    // $('.hint-content').text(text).show()
    $('.hint-content').text(text).fadeIn(500, () => {
      $('.hint-content').fadeOut(2000);
    });      
    getlatTy(currentTyIds);
// });
