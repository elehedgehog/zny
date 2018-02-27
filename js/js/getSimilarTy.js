import { ZmapHelper } from './util/ZmapHelper.js'

//匹配相似台风  函数
export const getSimilarTy = (tsid,lon=2,lat=2,angle=30,anglediff=30,speed=30,speeddiff=30,strength=30) => {
  if(!tsid) return;
  $('#simTyphoon ul .similarTyInner').remove();     //移除相似台风li 
  const url = `http://119.29.102.103:8111/roa1080/discrete/typhoon/d10/${tsid},${new Date().Format('yyyy-MM-dd HH:00:00')},${lon},${lat},${angle},${anglediff},${speed},${speeddiff},${strength}/JSON?cacheCtrl=${Date.now()}`;
  $.ajax({ url }).then(data => {
    if(typeof data === 'string' & /DB_ERROR/.test(data)) {
      getNoSimi();
      if($('.simiMatch').hasClass('on')) $('.closeSimi').click();
      removeAllSimTy();
      return;
    }
    data = JSON.parse(data);
    const typhoon = data[0].string;     //所有相似台风数组
    
    let prArr = [];
    typhoon.map(info => {
      info.replace(/(\d*),(\d*),(.*?),/, function($0,$1,$2,$3) {
        const tyid = $1;
        prArr.push(new Promise((resolve, reject) => {
          $.ajax({       //从该链接获取相似台风名称
            url: `http://119.29.102.103:8111/roa1080/discrete/typhoon/d2/${tyid},BCGZ/JSON?cacheCtrl=${Date.now()}`
          })     
          .then(res => {
            if(typeof res === 'string' & /DB_ERROR/.test(res)) reject();
            else {
              res = JSON.parse(res);
              const tscname = res[0].tscname;
              if(tscname) {
                // let year = res[0].real[0].time.split('-')[0]  年份
                $('#simTyphoon ul').prepend(`<li class="similarTyInner" tyid="${tyid}"><a>${tscname}</a></li>`);
              }
              resolve();
            }
          });
        }));
      });
    });

    Promise.all(prArr).then(() => {
      let simiMatchHeight = $('.simiMatch').height();
      $('.simiMatch').css({'transform': 'translateY(0%)', bottom: 0}).addClass('on');
      $('.tyCl_list,.imgEx,.cloudPopup').stop().animate({'bottom': simiMatchHeight + 30 +'px'});
    });
    
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
const drawSimilayTy = (tyid, data) => {
  //移除相似台风
  if(similarTyLayer[tyid]) {       
    map.removeLayer(similarTyLayer[tyid]);
    delete similarTyLayer[tyid];
    return;
  }
  //新增相似台风
  data = data[0];
  if(tyid) tyid = data.tsid;
  data.real.reverse();
  data.real.map((info) => {
    info.datetime =  info.time;
    info.lon = Number(info.lon);
    info.lat = Number(info.lat);
  });
  if(data.fst && data.fst.length) {
    data.fst.map((info) => {
      info.datetime =  info.time;
      info.lon = Number(info.lon);
      info.lat = Number(info.lat);
      info.leadtime = Number(info.leadtime);
    });
  }
  const helper = new ZmapHelper(map, window.positionCenter)
  let lyGp = helper.drawTy(data);
  similarTyLayer[tyid] = lyGp.tyLayerGroup;
  map.addLayer(similarTyLayer[tyid]);
  lyGp.layersGoesBack.map((el) => {
      el.layer.bringToBack();
  });
  // 设置点击台风为视角中心
  const tyReal = data.real,
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
    let url = `http://119.29.102.103:8111/roa1080/discrete/typhoon/d2/${tyid},BCGZ/JSONP/?cacheCtrl=${Date.now()}`
    $.ajax({ url }).then((data) => {
      if(typeof data === 'string' & /DB_ERROR/.test(data)) return;
      drawSimilayTy(tyid, JSON.parse(data));      //加载台风 
    });
  } else {
    drawSimilayTy(tyid);     //删除台风图层
  }
});