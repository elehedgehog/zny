export const Coder = {
    str2Bytes: function(str){
        var bytes = new Array();
        var len, c;
        len = str.length;
        for(var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if(c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    },
    legalChars: 'h7Y5-dAtlKjS8NQCyDIL0o1FUPxZinepcTwWbJ2qrkzB63s_gXmvfEuM4GHORaV9',
    encode: function(s){
        var data = this.str2Bytes(s);
        var data = this.randomData(data);
        var srcLen = data.length;

        var groupSize = Math.floor(srcLen/3);
        var pairLen = groupSize*3;
        var dstLen = groupSize*4 + (pairLen==srcLen ? 0 : 4);
        var buf = '';

        for (var grpPos=0; grpPos<groupSize; grpPos++){
            var p = grpPos*3;
            var d = ((data[p]&0xff)<<16) | ((data[p+1]&0xff)<<8) | (data[p+2]&0xff);
            buf += this.legalChars.charAt((d>>18)&63);
            buf += this.legalChars.charAt((d>>12)&63);
            buf += this.legalChars.charAt((d>>6)&63);
            buf += this.legalChars.charAt(d&63);
        }
        if (srcLen-pairLen==2){
            var p = pairLen;
            var d = ((data[p]&0xff)<<16) | ((data[p+1]&0xff)<<8);
            buf += this.legalChars.charAt((d>>18)&63);
            buf += this.legalChars.charAt((d>>12)&63);
            buf += this.legalChars.charAt((d>>6)&63);
        }else if (srcLen-pairLen==1){
            var p = pairLen;
            var d = ((data[p]&0xff)<<16);
            buf += this.legalChars.charAt((d>>18)&63);
            buf += this.legalChars.charAt((d>>12)&63);
        }
        return buf;
    },
    randomData: function(data) {
        var len = data.length;
        if (len<8) return data;
        var datNew = new Array(len+1);
        var rb = (Math.floor(Math.random()*200)+55);
        for (var i=0; i<7; i++){
            datNew[i] = (data[i] ^ rb);
        }
        datNew[7] = rb;
        for (var i=7; i<len; i++){
            datNew[i+1] = data[i] ^ rb;
        }
        return datNew;
    }
}
