//import './md5.js'

//const base_Url = "https://qa.hbunion.com/mobile/";//qa
const base_Url = "http://47.93.205.72:8080"
const key = "123456";//函百规定的Key
//const base_Url = "http://192.168.18.146:8083/mobile/";//张浩
//const base_Url = "http://192.168.18.149:8080/app/";//方永杰
//const base_Url = "http://192.168.18.153:8088/mobile/";//李旺
//const base_Url = "http://73c1eebd.ngrok.io/mobile/";//李旺

// 封装get请求方式
function reqGet (url,param,onSuccess,onfail){
    let appendUrl = base_Url + url + '.htm';
    // let md5Str = paramOperation(param);
    var token = '';
    wx.getStorage({
        key: 'token',
        success: function(res) {
            token = res.data;
            req(appendUrl,param,token,"GET",onSuccess,onfail);  
        },fail:function(err){
           // if(url =='/wx/onLogin')
            {
                req(appendUrl,param,token,"GET",onSuccess,onfail);  
            }
        }
    });
    // param.sign = md5Str;
    console.log(param);

};


function req(url,param,token,method,onSuccess,onfail){
    console.log(' req param:', param);
    wx.request({
        url:url,
        header:{
          'Content-Type':"application/json",
            'token':token
        },
        data:param,
        method:method,
        success:function(res){
            console.log('request success===',res);
            if (res.data.status == 0) {
                onSuccess(res.data);
            } else {
                wx.showToast(
                    {
                        title:res.data.message,
                        icon:'none'
                    })
                    if (onfail) {
                        onfail();
                    }
            }
        },
        fail:function(err){
          console.log('url=', url);
          console.log('request res error=', err);
            wx.showToast(
                {
                    title:'系统错误',
                    icon:'none'
                }
            )
            wx.hideLoading();
            console.log(err);
        },
    })
}
// 封装Post请求方法


const Post = function (url,param,onSuccess,onfail){
 //   var appendUrl = base_Url + url + '.htm';
    var appendUrl = base_Url + url;
    console.log(appendUrl);
    // var md5Str = paramOperation(param);
    // param.sign = md5Str;
    var token = "";
    //获取登录成功后存储的token
    var that = this;
    wx.getStorage({
        key: 'token',
        success: function(res) {
            token = res.data;
            req(appendUrl,param,token,"POST",onSuccess,onfail);
        },fail:function(err){
           // if(url =='/wx/onLogin')
           wx.hideLoading();
            {
                req(appendUrl,param,'',"POST",onSuccess,onfail);  
            }
        }
    });
    // console.log(token);

};

//md5加密等操作
var paramOperation = function(param){
    let keyArr = Object.keys(param);
    let sortKeys =  key.sort();
    var sortStr = "";
    for (let index = 0; index < sortKeys.length; index++) {
        let keyStr = sortKeys[index];
        let val = param[keyStr];
        sortStr = sortStr + keyStr + "=" +val;
        if(index == sortKeys.length - 1){
            sortStr = sortStr + "key=" + key;
        }    
    }
    if (sortStr == "" || sortStr == undefined || sortStr == null) {
        sortStr = sortStr + "key=" + key;
    }

    let paramDecode = decodeURI(sortStr);
    let md5Str = hex_md5(paramDecode);
    return md5Str;
}

module.exports ={
  reqGet,
  Post,
  base_Url
}