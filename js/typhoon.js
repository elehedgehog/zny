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
        addNewsTip(data[i].intlid, '北京时: ' + new Date(lastrealTime).Format('yyyy年MM月dd日 HH:00') + '台风' + data[i].tscname)

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
  $.ajax({ url: latestTyUrl }).then(data => {
    for (let opt of data) {
      if(!opt.tscname) opt.tscname = '未命名'
    }
    if (!data.length) return;
    // 初始化helper
    initHelper().then(() => {
      getTyphoon(data, currentTyIds);
    })
  });
}



//查询当前是否有台风
$.get(tyUrl, (data) => {
    //let data = [];
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
});
