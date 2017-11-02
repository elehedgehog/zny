Date.prototype.Format = function(f,s,_f){
  if (s) this.Parse(s, _f);
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  var fmt = f ? f : 'yyyy-MM-dd HH:mm:ss';
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

Date.prototype.Parse = function(s,f){
  if(!s) return null;
  var df = "yMdHmsS",
    dt = [
      this.getFullYear(),
      this.getMonth(),
      this.getDate(),
      this.getHours(),
      this.getMinutes(),
      this.getSeconds(),
      this.getMilliseconds()
    ];
  var vals = s.replace(/(^[^0-9]+|[^0-9]+$)/g, "").split(/[^0-9]+/g);
  f = f ? f : df;
  var fs = f.match(/(y+|M+|d+|H+|m+|s+|S)/g);
  for(var i=0; i<fs.length; i++){
    var c = fs[i].charAt(0);
    var index = df.indexOf(c);
    if(index >= 0 && vals[i] != undefined)
      dt[index] = index == 1 ? vals[i] - 1 : vals[i];
  }
  this.setTime(Date.UTC.apply(null, dt) + this.getTimezoneOffset() * 60000);
  return this;
};
