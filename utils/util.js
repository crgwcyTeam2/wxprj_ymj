const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

function screenWidth() {
  wx.getSystemInfo({
    success: function(res) {
      // success
      return res.windowWidth
    }
  })
};

function screenHeight() {
  wx.getSystemInfo({
    success: function(res) {
      // success
      return res.windowHeight
    }
  })
};

function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
};

/*
 *提示 无图标
 */
function showToastNone(obj) {
  wx.showToast({
    title: obj,
    icon: 'none'
  })
};

/*
 *提示成功
 */
function showToastSuc(obj) {
  wx.showToast({
    title: obj,
    icon: 'success'
  })
};

/*
 *checkMobile 判断手机号是否正确
 */
function checkMobile(str) {
  if (str == "") {
    showToastNone("手机号不能为空！");
  } else {
    var re = /^1\d{10}$/
    if (re.test(str)) {
      return true;
    } else {
      showToastNone("手机号格式错误！");
    }
  }
}

function isLoginWithPhone() {
  let phone = wx.getStorageSync('phone');
  if (isEmpty(phone) || phone == 0) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  } else {
    return true;
  }
}
/*
 *isVehicleNumber 车牌号正则
 */
function isVehicleNumber(vehicleNumber) {
  var result = false;
  if (vehicleNumber.length == 7) {
    var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    result = express.test(vehicleNumber);
  }
  return result;
}

function  parseFormatNum(number, n) {
  let i;
  if (n !=  0 ) {
    n = (n  >  0  &&  n  <=  20)  ?  n  :  2;
  }    
  number =  parseFloat((number  +  "").replace(/[^\d\.-]/g,  "")).toFixed(n)  +  "";    
  var  sub_val  =  number.split(".")[0].split("").reverse();    
  var  sub_xs  =  number.split(".")[1];

      
  var  show_html  =  "";    
  for  (i  =  0;  i  <  sub_val.length;  i++) {        
    show_html  +=  sub_val[i]  +  ((i  +  1)  %  3  ==  0  &&  (i  +  1)  !=  sub_val.length  ?  ","  :  "");    
  }

      
  if (n  ==  0 ) {        
    return  show_html.split("").reverse().join("");    
  } else {    
    return  show_html.split("").reverse().join("")  +  "."  +  sub_xs;    
  }
}


module.exports = {
  formatTime: formatTime,
  screenWidth: screenWidth,
  screenHeight: screenHeight,
  isEmpty: isEmpty,
  showToastNone: showToastNone,
  checkMobile: checkMobile,
  showToastSuc: showToastSuc,
  isVehicleNumber,
  isLoginWithPhone,
  parseFormatNum
}