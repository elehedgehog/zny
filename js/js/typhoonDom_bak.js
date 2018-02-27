import { getSimilarTy } from './getSimilarTy'
import { getSeawaveData, delMarker, delBoundary, hasData } from './seawaveDom'
import { getNoDataTips } from './util/tips'
import * as _area from './business/alarmArea'
import { judge } from './business/judgeArea'
import { getVelLevel, getDirLevel } from './util/wind'
import { viewerCor } from './business/viewer'
import * as overlay from './util/overlay'
import _boundary from './boundary'
import { addNewsTip, removeNewsTip } from './util/newsTip'

let tyInterval = setInterval(() => {
    //已经获取到 当前台风信息 用户信息  时执行
    let fstAreas = window.fstAreas;
    if(window.locationInfo && (fstAreas === false || (Array.isArray(fstAreas) && fstAreas.length === currentTyNum))) {
        // initTySpot();
        $('.decisionArea').click()
        clearInterval(tyInterval);
    }
}, 500);
let spots_global = {};
//获取后台数据  初始化用户决策区
const initTySpot = () => {
    _area.getTyphoonspot()  
    .then(res => {
        console.log(res)
        if(res.result !== 'S_OK') return;
        let spots = res.tagObject.spots;

        let hasSZPoint = false;     //判断是否添加过深圳蛇口
        for(let spot of spots) {   
            if(spot.lon === 113.92 && spot.lat === 22.48) {
                hasSZPoint = true;
                break;
            }
        }
        if(!hasSZPoint) {
            _area.addTyphoonspot('22.48', '113.92', [200, 400, 600, 800])    //添加深圳蛇口
            .then(res => {
               initTySpot();
            });
        } else {
            for(let spot of spots) {
                spots_global[spot.typhoonspotid] = spot;
                const lat = spot.lat,
                    lon = spot.lon,
                    radius = spot.radius,
                    typhoonspotid = spot.typhoonspotid;
                if(!Array.isArray(radius)) continue;
                let radiusArr = radius.sort((a, b) => a < b);
                let maxRadiu = radiusArr[0];
                let bool = judge(lat, lon, maxRadiu);         //判断是否受当前台风影响
                getInterpPoints(lon, lat).then(res => {
                    if(res.windPower >= 7) bool = true;       //判断风力是否大于7级
                    _area.addArea(lat, lon, radius, typhoonspotid, bool, res);
                })
                .catch(e => {
                    _area.addArea(lat, lon, radius, typhoonspotid, bool, {})
                })
            }
            console.log(spots_global);  
        }
    });
}
$('.decisionArea').click(function(e) {      //决策区开关按钮
    e.stopPropagation()
    let el = $('.cloudMap li.tyListUl_com').eq(0)     // 添加决策区按钮
    if ($(this).hasClass('on')) {
        el.hide()
        _area.clearAllInfo()
    } else {
        el.show()
        initTySpot()
    }
    $(this).toggleClass('on')
})

const getInterpPoints = (lon, lat) => {         //获取决策区详细数据
    let date = new Date().Format('yyyy/MM/dd 20:00:00');
    date = new Date(date).getTime();
    let nowTime = Date.now();
    if(date < nowTime) {
        date = new Date().Format('yyyy-MM-dd 08:00:00');
    } else {
        date = date - 24*60*60*1000;
        date = new Date(date).Format('yyyy-MM-dd 08:00:00');
    }
    
    let url = `http://119.29.102.103:8111/Alarm/getInterpPoints?datetime=${date}&leadtime=0&points[0][]=${lon}&points[0][]=${lat}&cacheCtrl=${Date.now()}`;
    let stormUrl = `http://119.29.102.103:8111/Alarm/getTideInterpPoints?datetime=${date}&leadtime=0&points[0][]=${lon}&points[0][]=${lat}&cacheCtrl=${Date.now()}`; //风暴增水
    // let url = `https://www.fenglingzhixun.cn:9005/Alarm/getInterpPoints?datetime=${date}&leadtime=0&points[0][]=${lon}&points[0][]=${lat}&cacheCtrl=${Date.now()}`;
    // let stormUrl = `https://www.fenglingzhixun.cn:9005/Alarm/getTideInterpPoints?datetime=${date}&leadtime=0&points[0][]=${lon}&points[0][]=${lat}&cacheCtrl=${Date.now()}`; //风暴增水
    let data;
    return new Promise((resolve, reject) => {
        $.ajax({
            url, 
            timeout: 2000, 
            success: res => {
                if(/DB_ERROR/.test(res) || /null/.test(res) || !res.length) {
                    reject();
                    return;
                }
                data = res[0];
                for(let i in data) {
                    if(/null/.test(data[i]) || data[i] === -999.9)  data[i] = '';
                }
                if(data.windPower)
                    data.windPower = getVelLevel(data.windPower);
                if(data.windDirection)
                    data.windDirection = getDirLevel(data.windDirection);
                if(data.waveHeight)
                    data.waveHeight = data.waveHeight.toFixed(2);
                if(data.waveProid)
                    data.waveProid = data.waveProid.toFixed(2);
                if(data.waveDir) 
                    data.waveDir = getDirLevel(data.waveDir).replace('风', '');
                $.ajax({ url: stormUrl, timeout: 5000 }).then(msg => {
                    if( !msg || /DB_ERROR/.test(msg) || /null/.test(msg) || !msg.length) data.windWater = 0;
                    data.windWater = msg[0];     //将风暴增水的msg数据添加到预警状态的data数据里
                    if(data.windWater) data.windWater = data.windWater.toFixed(2);
                    else data.windWater = 0;
                    resolve(data);
                })
            },
            error: err => {
                reject()
            }
        })
    });
}


// ----- DOM操作 ----- //
let simObj = {
    similar: '.typhoon_cusWin',
};
let susNavObj = {
    typhoon: '#tyChangeWraper',
    seaWave: '.tycontener_bottSeawave',
    cloud: '#cloudOverlay',
    thunder: '.rainstormImg',
    actual: '.actualImg'
}
 $('#tyswNav>ul>li').on('click', function() {
    hidePreWarnPopup();                                                                  // 预警状态信息栏
    if(val !== 'typhoon' && $('.simiMatch').hasClass('on')) $('.closeSimi').click();     // 关闭相似台风 
    if($('.cloudMap ul li img.on').length) $('.cloudMap ul li img.on').click();          // 决策区 图层
    if($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click();
    if($('.imgEx').hasClass('on')) $('.imgEx').click();                                  // 图例
    

    let val = $(this).attr('name');
    let url;
    if($(this).hasClass('a')) {        //清除导航栏选中状态
        if((val === 'typhoon' && !$('#tyChangeWraper li.layer-selected, .defenceArea.on, .decisionArea.on').length) || (val === 'cloud' && !$('#cloudOverlay li.on').length) || (val === 'thunder' && !$('.rainstormImg li.on').length) || (val === 'actual' && !$('.actualImg li.on').length)) {    
           $(this).removeClass('on')
        }   
        $(susNavObj[val]).hide();                                  //台风 云图 雷暴
    } else {                            //导航栏选中
        if(val === 'seawave') {                                 //海浪
            if($(this).hasClass('on')) {
                deleteOcean();
                removeNewsTip('seawave')
            }
            else {
                getSeawaveData();
                $('.buoy_bott').removeClass('on').stop().animate({bottom: '-5.8rem'});
                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
            }
            $(this).toggleClass('on');
        }
        else if (val === 'thunder') {
            if ($('.rainForecast').hasClass('on')) {
                $('.rainProgressbar').stop().animate({'bottom': '0rem'}).addClass('on');
                $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '3.33rem'});
            } else {
                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'})
            }
            $(this).addClass('on');
        } else {
            $(this).addClass('on');
            
        }

        if (val !== 'thunder') {
            if ($('.rainForecast').hasClass('on')) {
                $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}).removeClass('on');
                $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'})
            }
        }
 
        if(val !== 'typhoon')
            toggleNavSel('#tyChangeWraper', '.layer-selected', '.tyList');
        if(val !== 'cloud')
            toggleNavSel('#cloudOverlay', '.on', '.rdList');
        if(val !== 'thunder')
            toggleNavSel('.rainstormImg', '.on', '.tsList');
        if(val !== 'actual')
            toggleNavSel('.actualImg', '.on', '.buoyList');
        for(let i in susNavObj) {
            if(i === 'typhoon' || i === 'cloud' || i === 'thunder' || i === 'actual') $(susNavObj[i]).hide();               //先隐藏 台风 云图 雷暴 窗口
        }
            
        if(val !== 'seawave' && val !== 'buoy')  $(susNavObj[val]).show();            //台风 云图 雷暴
    }
    $(this).siblings().removeClass('a');
    if(val !== 'seawave' && val !== 'buoy') $(this).toggleClass('a');              //海浪没有a
});

$('.buoyStation').click(function(e){      //浮标站
    e.stopPropagation()
    if($(this).hasClass('on'))  deleBuoyData();
    else {
        getBuoyData();
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    }
    $(this).toggleClass('on');
})

const toggleNavSel = (child, classN, parent) => {       //切换选中
    if(!$(`${child} li${classN}`).length) {
        $(child).parents(parent).removeClass('on');
    }
}
const deleteOcean = () => {         //清除海浪数据
    delBoundary();             //移除边界
    if($('.tycontener_bottSeawave').hasClass('on')) {           //展开了详细数据
        $('.tycontener_bottSeawave').removeClass('on').stop().animate({'bottom': '-6rem'});
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    }
}


// ----- 左侧底下导航栏  (当前在右侧 且仅存在相似台风按钮) ----- //
$('.tySimilar>ul>li').on('click', function() {
    if($('.simiMatch').hasClass('on')) $('.closeSimi').click();     //关闭之前相似台风显示
    $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}).removeClass('on'); //隐藏降水播放
    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    hidePreWarnPopup();         //决策区底部信息框
    $('.imgEx.on').click();     //图例
    $('.cloudMap ul li img.on').click();    //右下
    let val = $(this).attr('name'),
        $img = $(this).children('img'),
        imgUrl = $img.data('url');
    $img.attr('src', imgUrl);       //图标颜色
    
   $('#tyswNav>ul>li.a').click();            //台风 云图 雷暴

   if($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click(); 
    
    //相似台风
    if(val === 'similar') {
        $(this).addClass('on');
        $(simObj[val]).show();
        //台风匹配 选择台风下拉框初始化   
        let tsObj = {};
        $('#tyChange .layer-selected').map(function() {
            const $child = $(this).find('a'),
                tsid = $child.attr('tsid'),
                name = $child.text();
            tsObj[tsid] = name;
        });
        $('.cusDetales_centerTy select option').remove();
        let html = '';
        for(let i in tsObj) {
            html = `<option value="${i}">${tsObj[i]}</option>` + html;
        }
        $('.cusDetales_centerTy select').html(html);
    }
   
});


// -----   相似台风   ------ //
//关闭弹窗函数
function hideSim(popup, num) {
    $(popup).hide();
    const $target = $('.tySimilar ul li').eq(num);
    $target.removeClass('on');
    const url = $target.find('img').data('url').replace('_pre', '');
    $target.find('img').attr('src', url).removeClass('on');
}
// 窗口 打叉按钮 取消按钮
$('.typhoon_close,.cusDetales_cancleTy').on('click' ,function() {
    hideSim('.typhoon_cusWin', 0);
});
// 窗口 确定按钮
$('.cusDetales_confirmTy').on('click', function() {
    hideSim('.typhoon_cusWin', 0);
    const tsid = $('.cusDetales_centerTy select').val(),
        lon = $('input[name="lon"]').val(),
        lat = $('input[name="lat"]').val(),
        angle = $('input[name="angle"]').val(),
        anglediff = $('input[name="anglediff"]').val(),
        speed = $('input[name="speed"]').val(),
        speeddiff = $('input[name="speeddiff"]').val(),
        strength = $('input[name="strength"]').val();
    getSimilarTy(tsid,lon,lat,angle,anglediff,speed,speeddiff,strength);
});
// 台风匹配 伸缩按钮
$('.simiTyHide').on('click', function() {
    if($(this).hasClass('on')) {        //展开
        let simiMatchHeight = $('.simiMatch').height();
        $('.simiMatch').css({transform: 'translateY(0%)', bottom: '0'});
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': simiMatchHeight + 30 +'px'});
    } else {
        $('.simiMatch').css({transform: 'translateY(100%)', bottom: '1.2rem'});
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '1.766667rem'});
    }
    $(this).toggleClass('on');
});
// 台风匹配 关闭按钮
$('.closeSimi').on('click', function(){
    if($('.simiTyHide').hasClass('on')) $('.simiTyHide').removeClass('on');
    $('.simiMatch').css({transform: 'translateY(100%)', bottom: 0}).removeClass('on');
    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    $('#simTyphoon ul li.simSelected').map(function() {
        $(this).click();        //清除选中台风
    });
});


// ----- 右下工具栏  添加决策区 切换图层 ----- //
//切换弹窗函数
function togglePop($this, $pop) {
    var url = $this.data('url');
    if($this.hasClass('on')) 
        url = url.replace('_pre', '');
    $this.attr('src', url).toggleClass('on');
    $pop.toggle();
}
$('.cloudMap ul li img').on('click',function() {
    $('.imgEx.on').click();     //取消台风图例展开
    
    var className = $(this).data('class'),
        $pop = $('.' + className);
    togglePop($(this), $pop);       //更改图标颜色 弹窗

    var $bro = $(this).parent('li').siblings('.tyListUl_com').find('img');      //取消兄弟节点选中状态
    if($bro.hasClass('on')) {
        var broUrl = $bro.data('url').replace('_pre', '');
        $bro.attr('src', broUrl).removeClass('on');
        $('.' + $bro.data('class')).hide();
    }

    if($('.cloudMap ul li img.on').length)        //取消顶部导航栏选中状态
        $('#tyswNav>ul>li.a').click();     //台风 云图 雷暴
});
$('.typhoonList,.cloudMap ul li:nth-child(2)').on('click', function(){
    if($('.cloudMap ul li:nth-child(1).on').length) $('#makePolicy').click(); 
});
// -----   决策区   ------ //
// 左下工具栏 决策区按钮
$('#makePolicy').on('click', function() {
    $('.early_warn').removeClass('on').show().stop().animate({bottom:'-4.8rem'});
    $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}).removeClass('on'); //隐藏降水播放
    $('.tyCl_list,.getLonLat,.imgEx,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    if($('.simiMatch').hasClass('on')) $('.closeSimi').click();
    if($(this).hasClass('on')) {
        if(map.hasEventListeners('click', getLatLngEvent)) {
            map.removeEventListener('click', getLatLngEvent);
            $('.getLonLat').hide();
        } 
        const url = $(this).find('img').data('url').replace('_pre', '');
        $(this).find('img').attr('src', url);
    } else {
        let dataUrl = $('#makePolicy').find('img').data('url'); 
        $(this).find('img').attr('src', dataUrl);
        $('.cusLonLat_cusWin').show();
    }
    $("input[name='longitude'],input[name='latitude'],input[name='radius']").val('');
    $(this).toggleClass('on');
})
// 关闭决策区弹窗函数
const closeAreaPopup = () => {
    $('.cusLonLat_cusWin').hide();
    const $target = $('#makePolicy');
    $target.removeClass('on');
    $target.find('img').removeClass('on');
    const url = $target.find('img').data('url').replace('_pre', '');
    $target.find('img').attr('src', url);
}
// 添加决策区弹窗 关闭按钮 
$('.cusLonLat_close').on('click', function() {
    closeAreaPopup();
});
// 添加决策区弹窗 拾取坐标点 按钮
$('#customGet').on('click',function() {
    $('.cusLonLat_cusWin').hide();
    const tooltip = `<div class='getLonLat'>点击地图获取经纬度 </div>`;
    $("body").append(tooltip);
    $(".getLonLat").show();

    // 点击获取经纬度
    map.on('click', getLatLngEvent);
    let lonData = $("input[name='longitude']").val(),
        latData =  $("input[name='latitude']").val(),
        radiusData = $("input[name='radius']").val();
});
// 添加决策区弹窗 确定按钮
$('#customConfirm').on('click', function() {
    let lonData = $("input[name='longitude']").val(),
        latData =  $("input[name='latitude']").val();
    let rArr = [];
    $("input[name='radius']").map(function() {
        // let val = $(this).val();
         let val = Number($(this).val());

        if(val) rArr.push(val);
    });
    rArr.sort((a, b) => a > b)
    if(!lonData || !latData || !rArr.length) getNoDataTips('.hint_noNull');
    else addTyphoonspot(latData,lonData, rArr);
});
// 地图获取经纬度
const getLatLngEvent = pos => {     
    $(".getLonLat").remove();
    $('.cusLonLat_cusWin').fadeIn(function(){
        var latlng = pos.latlng; 
        var longitude = latlng.lng.toFixed(5),
            latitude = latlng.lat.toFixed(5);
        $('input[name="longitude"]').val(longitude);
        $('input[name="latitude"]').val(latitude);
    });
    map.off('click', getLatLngEvent);
}
// 添加决策区
const addTyphoonspot = (lat, lon, radius) => {      
    _area.addTyphoonspot(lat, lon, radius)
    .then(res => {
        if(res.result !== 'S_OK') return;
        const pointId = res.tagObject.typhoonspotid;
        let radiusArr = radius.sort((a, b) => a < b);
        let maxRadiu = radiusArr[0];
        let bool = judge(lat, lon, maxRadiu);         //判断是否受当前台风影响
        getInterpPoints(lon, lat).then(res => {
            if(res.windPower >= 7) bool = true;       //判断风力是否大于7级
            _area.addArea(lat, lon, radius, pointId, bool, res);
        })
        .catch(e => {
            _area.addArea(lat, lon, radius, pointId, bool, {})
        })
        spots_global[pointId] = res.tagObject;
    });
    closeAreaPopup();
}
// -----   台风图例   ------ //
$('.imgEx').on('click', function() {
    $('.imgEx_details').toggle();
    $(this).toggleClass('on');
    $('.cloudMap ul li:nth-child(2) img').removeClass('on');
    let url = $('.cloudMap ul li:nth-child(2) img').data('url').replace('_pre','');
    $('.cloudMap ul li:nth-child(2) img').attr('src',url);
    $('.mapImg').hide();

    if($('.cloudMap ul li:nth-child(1).on').length) $('.cloudMap ul li.on').eq(0).click();
     closeAreaPopup(); //取消添加决策获取经纬度的窗口
});

const mapEvent = () => {
    $('.buoy_bott').removeClass('on').stop().animate({bottom: '-5.8rem'});
    if($('#tyswNav>ul>li').eq(1).hasClass('on') && hasData) return;      //如果海浪已经选中 说明有conteners事件了
    if($('.early_warn').hasClass('on')) return;         //决策点
    if($('.simiMatch').hasClass('on')) return;          //相似台风
    if($('.rainProgressbar').hasClass('on')) return;       //降水监测
    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({ 'bottom': '0.666667rem' });
}
const contEvent = function(e) {
    if($(e.target).attr('src') == 'assets/typhoon_forecast@3x.png') return;
    if($(e.target).is('.imgEx') || $(e.target).is('.imgEx *')) return;  //点击时不执行
    if($(e.target).is('.cloudMap .tyListUl_com:nth-child(2)') || $(e.target).is('.cloudMap .tyListUl_com:nth-child(2) *')) return;
    if($(e.target).is('.buoy_bott') || $(e.target).is('.buoy_bott *')) return;
    mapEvent();
}
// 获取浮标站点和数据
const getBuoyData = () =>{
    let nowTime = new Date().Format('yyyy-MM-dd HH:mm');
    $('.now_time').text(nowTime);
    let time = new Date().Format('yyyy/MM/dd HH:mm:00');
    time = new Date(time).getTime();
    time = time - time % (10*60*1000) - 10*60*1000;
    time = new Date(time).Format('yyyy-MM-dd HH:mm:00');

    const buoyUrl = `http://119.29.102.103:8111/roa1080/discrete/buoy/d3/V22041%3bV22042%3bV22043%3bV22044%3bV22062%3bV22062_001%3bV23001%3bV23001_001%3bV23002%3bV23002_001%3bV23003%3bV23003_001%3bV23004%3bV23004_001%3bV23005%3bV23006%3bV23007%3bV23007_001,${time}/JSON?cacheCtrl=${Date.now()}`;
    // const buoyUrl = `https://www.fenglingzhixun.cn:9005/roa1080/discrete/buoy/d3/V22041%3bV22042%3bV22043%3bV22044%3bV22062%3bV22062_001%3bV23001%3bV23001_001%3bV23002%3bV23002_001%3bV23003%3bV23003_001%3bV23004%3bV23004_001%3bV23005%3bV23006%3bV23007%3bV23007_001,${time}/JSON?cacheCtrl=${Date.now()}`;
    $.ajax({url:buoyUrl})
    .then(data => {
        if(/DB_ERROR/.test(data)) { getNoDataTips('.buoy_noData'); return }
        data = JSON.parse(data);

        $('.conteners').click(contEvent);
        map.addEventListener('movestart', mapEvent);

        const buoyIcon = L.icon({
            iconUrl: 'assets/typhoon_forecast@3x.png',
            iconSize: [25, 25],
            iconAnchor: [0, 0]
        });
        const buoyLabel = L.divIcon({
            className: 'ty-name-label',
            html: `<span class="buoyLabel">浮标站</span>`
        });
        
        data.map(info => {
            let center = [info.lat, info.lon];
            let events = {
                click: (e) =>{
                    $('.rainProgressbar').stop().animate({'bottom': '-2.67rem'}).removeClass('on');
                    if($('.tycontener_bottSeawave').hasClass('on')) {           //展开了详细数据
                        $('.tycontener_bottSeawave').removeClass('on').stop().animate({bottom: '-6rem'});
                        if($('.buoy_bott').hasClass('on'))  $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '6.466667rem'});
                        else $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
                    }
                    if($('.early_warn').hasClass('on'))         //决策区详细信息
                         $('.early_warn').removeClass('on').stop().animate({bottom:'-4.8rem'}); 
                    if($('.simiMatch.on').length) $('.closeSimi').click();
                    $('#buoyPos').text(Math.round(Number(info.V22041)*100)/100 === 9999 ? '--' : getDirLevel(Math.round(Number(info.V22041)*100)/100).replace('风', ''));  //浮标方位
                    $('#aboveTem').text(Math.round(Number(info.V22042)*100)/100 === 9999 ? '--' : Math.round(Number(info.V22042)*100)/100 + '℃'); //海表温度
                    $('#highTem').text(Math.round(Number(info.V22043)*100)/100 === 9999 ? '--' : Math.round(Number(info.V22043)*100)/100 + '℃');  //海表最高温度
                    $('#lowTem').text(Math.round(Number(info.V22044)*100)/100 === 9999 ? '--' : Math.round(Number(info.V22044)*100)/100 + '℃');  //海表最低温度
                    $('#effWaveHigh').text(Math.round(Number(info.V23002)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23002)*100)/100 + 'm');  //有效波高
                    $('#effWaveHighPriod').text(Math.round(Number(info.V23002_001)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23002_001)*100)/100 + 'm/s');  //有效波高周期
                    $('#aveWaveHigh').text(Math.round(Number(info.V23003)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23003)*100)/100 + 'm');  //平均波高
                    $('#aveWaveHighPriod').text(Math.round(Number(info.V23003_001)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23003_001)*100)/100 + 'm/s');  //平均波高周期
                    $('#bigestWaveHigh').text(Math.round(Number(info.V23004)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23004)*100)/100 + 'm');  //最大波高
                    $('#bigestWaveHighPriod').text(Math.round(Number(info.V23004_001)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23004_001)*100)/100 + 'm/s');  //最大波高周期
                    $('#oceanFlowSpeed').text(Math.round(Number(info.V23005)*100)/100 === 9999 ? '--' : Math.round(Number(info.V23005)*100)/100 + 'm/s');  // 表层海洋面流速
                    $('#oceanWaveDir').text(Math.round(Number(info.V23006)*100)/100 === 9999 ? '--' : getDirLevel(Math.round(Number(info.V23006)*100)/100).replace('风', '')); //表层海洋面波向
                    $('.buoy_bott').addClass('on').show().stop().animate({bottom:0});
                    $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '6.466667rem'}); 
                    $('.buoy_bott').click(function(e){
                        e.stopPropagation();
                    });
                }
            }
            const options = {
                icon: buoyIcon,
                zIndexOffset: 1000,
            };
            overlay.addMarker('buoyPoint', center, options, events);
            overlay.addMarker('buoyPoint', center, {icon: buoyLabel}, events)
        })
        viewerCor()
    })
}

const deleBuoyData = () => {
    overlay.removeOverlay('buoyPoint');
    $('.conteners').unbind('click', contEvent);
    map.removeEventListener('movestart', mapEvent);
    if($('.buoy_bott').hasClass('on')) {           //展开了详细数据
        $('.buoy_bott').removeClass('on').stop().animate({bottom: '-5.8rem'});
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom': '0.666667rem'});
    }
}
// -----   决策区 信息增删改   ------ //
//  预警状态 编辑按钮
$('.warnModify').on('click', function() {
    hidePreWarnPopup();
    const pointId = $('.early_head').attr('pointid');
    $('#modifyPointLon').val(spots_global[pointId].lon);
    $('#modifyPointLat').val(spots_global[pointId].lat);
    let html = '';
    spots_global[pointId].radius.map(r => {
        html = `<div class="wrapperMod clearfix"><dt>半径</dt><dd class="radiusIn"><input type="number" name="modifyRadius" value="${r}">海里<span class="modifyDel"></span></dd></div>` + html;
    });
    $('.preWarnDetales_center .wrapper').html(html);
    $('.preWarnDetales_center .wrapper .radiusIn').eq(-1).find('span').removeClass('modifyDel').addClass('modifyAdd');
    $('.preWarn_cusWin').show();
});

//预警区域编辑框半径删除按钮
$('.preWarnDetales_center').on('click', '.modifyDel', function(){
    let $parent = $(this).parents('.wrapperMod');
    $parent.remove();
});

//预警区域编辑框半径添加按钮
$('.preWarnDetales_center').on('click', '.modifyAdd', function(){
    $(this).removeClass('modifyAdd').addClass('modifyDel');
    $('.preWarnDetales_center .wrapper').append(`<dt>半径</dt><dd class="radiusIn"><input type="number" name="modifyRadius">海里<span class="modifyAdd"></span></dd>`);
    let height = $('.preWarnDetales_center .wrapper dt').size() * 1.25 * 75;
    $('.preWarnDetales_center .wrapper').scrollTop(height);
});

// 预警状态 编辑窗口 确定按钮
$('#preWarnConfirm').on('click', function(){
    let radius = [];
    $('input[name="modifyRadius"]').each(function() {
        if($(this).val()) radius.push(Number($(this).val()));
    });
    radius.sort((a, b) => a < b);
    if(!$('#modifyPointLon').val() || !$('#modifyPointLat').val() || !radius.length) {
        getNoDataTips('.hint_noNull');
        return;
    }
    const lat = $('#modifyPointLat').val(), //获取修改后的数据
        lon = $('#modifyPointLon').val(),
        pointId = $('.early_head').attr('pointid');
    _area.modifyTyphoonspot(lat, lon, radius, pointId)      //修改决策区域
    .then(data => {
        if(data.result === 'S_OK') {
            let radiusArr = radius.sort((a, b) => a < b);
            let radiusArrLen = radiusArr.length -1;
            let maxRadiu = radiusArr[0];
            let bool = judge(lat, lon, maxRadiu);         //判断是否受当前台风影响
            getInterpPoints(lon, lat).then(res => {
                _area.removeSingleArea(pointId);
                if(res.windPower >= 7) bool = true;       //判断风力是否大于7级
                _area.addArea(lat, lon, radius, pointId, bool, res);
            })
            .catch(e => {
                _area.removeSingleArea(pointId);
                _area.addArea(lat, lon, radius, pointId, bool, {})
            })
            spots_global[pointId] = { lat, lon, radius, typhoonspotid: pointId }
            $('.preWarn_cusWin').hide();
        }
        else alert(data.description);
    });
})
// 预警状态 编辑窗口 关闭取消按钮
$('.preWarnDetales_close,#preWarnCancel').on('click', function(){
    $('.preWarn_cusWin').hide();
})
// 预警状态 删除按钮
$('.warnDel').on('click', function() {
    const pointId = $('.early_head').attr('pointid');
    _area.removeTyphoonpot(pointId)         //删除决策区域
    .then(data => {
        if(data.result === 'S_OK') {
            _area.removeSingleArea(pointId);
            delete spots_global[pointId];
            hidePreWarnPopup();
        } else {
            alert(data.description);
        }
    });
})
// 隐藏预警状态  (决策区详细信息)
export const hidePreWarnPopup = () => {
    if($('.early_warn').hasClass('on') === false) return;
    $('.early_warn').removeClass('on').show().stop().animate({bottom:'-4.8rem'});
    if ($('.rainForecast').hasClass('on'))
        $('.imgEx,.tyCl_list,.getLonLat,.cloudPopup').stop().animate({'bottom':  3.33 +'rem'});
    else
        $('.tyCl_list,.imgEx,.getLonLat,.cloudPopup').stop().animate({'bottom':  0.6667 +'rem'});
}


// 添加半径按钮
$('.cusDetales_center').on('click', '#addRadius', function() {
    $(this).removeAttr('id').removeClass('add').addClass('del');
    let radiusDiv = `<div class="wrapperDiv clearfix"><dt>半径</dt><dd class="radiusIn"><input type="number" name="radius">海里<span class="add" id="addRadius"></span></dd></div>`;
    let $wrapper = $('#cusDetalesCenterDl .wrapper');
    $wrapper.append(radiusDiv);
    let height = $('#cusDetalesCenterDl .wrapper dt').size() * 1.25 * 75;
    $wrapper.scrollTop(height);
});

//添加半径删除按钮
$('.cusDetales_center').on('click', '.del', function() {
    // let $parent = $(this).parent('.radiusIn');
    // $parent.prev().remove();
    // $parent.remove();
    $(this).parents('.wrapperDiv').remove()
});

const calcScrollPos = () => {
    let height = $('#cusDetalesCenterDl .wrapper dt').size() * 1.25;
    $('#cusDetalesCenterDl .wrapper').scrollTop(height);
}

