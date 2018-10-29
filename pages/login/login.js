import api from '../../utils/api.js';
import req from '../../utils/request.js';
import util from '../../utils/util.js';
const app = getApp()


Page({
  data: {
    phoneInput: 0,
    verificationInput: 0,
    intro: '获取验证码',
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     this.wxLogin(res.code);
    //   }
    // });
  },

  // 手动输入绑定手机号
  onloadPhone() {
    var obj = {};
    obj.phoneNumber = this.data.phoneInput;
    this.updateInfo(obj, 1);
  },

  bindKeyInput: function(e) {
    this.setData({
      phoneInput: e.detail.value,
    })
  },

  // 绑定用户输入的内容
  bindKeyVetify(e) {
    this.setData({
      verificationInput: e.detail.value,
    })
  },
  // 系统登录
  wxLogin(resCode) {
    let param = {
      code: resCode
    }
    console.log('xxxxxxxxxxxxxxxxxxxwxLogin resCode=',resCode);
    req.Post(url.urlString.wxLogin, param, function success(res) {
      wx.setStorageSync("token", res.data.token);
      wx.setStorageSync("phone", res.data.phone);
    });
  },

  // 对于微信的信息进行解密
  getPhoneNumber(e) {
    console.log('xxxxxxxxxxxxxxxxxxxgetPhoneNumber e=',e);
    if(e.detail.encryptedData==undefined)
      console.log('xxxxxxxxxxxxxxxxxxxgetPhoneNumber encryptedData ==undefined');
    else
    {
  //  this.requestforPhone(e.detail.encryptedData, e.detail.iv);
      this.requestPhoneNum(e.detail.encryptedData, e.detail.iv);
    }
  },
  // 获取手机号解密
  requestforPhone(encryptedData, iv) {
    var that = this;
    let param = {
      "encryptedData": encryptedData,
      "iv": iv,
    };

    req.Post(url.urlString.decryptData, param, function Success(res) {
      that.updateInfo(JSON.parse(res.data), 0);
    });
  },

  requestPhoneNum(encryptedData,iv) {
    let url = api.urlString.parseAndBindPhone;
    let that = this;

    wx.showLoading({
      title: 'loading'
    });
    let param = {
      "appId": app.globalData.appId,
      "code": app.globalData.code,
      "encryptedData": encryptedData,
      "iv": iv,
      "openId": app.globalData.openId,
      "storeId": 1
    };

    req.Post(url, param, function success(res) {
      wx.hideLoading();
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxrequestPhoneNum res success');
   //   that.updateInfo(JSON.parse(res.data), 0);
    });
  },

  // 更新手机信息
  updateInfo(data, type) {
    wx.showLoading({
      title: '加载中'
    })
    let param = {
      "phone": data.phoneNumber,
      "type": type,
      "code": this.data.verificationInput
    };
    req.Post(url.urlString.wxUpdate, param, function Success(res) {
      wx.hideLoading();
      if (res.code == 0) {
        wx.setStorageSync('phone', data.phoneNumber);
        wx.setStorageSync('token', res.data.token);

        util.showToastNone('登录成功');
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      } else {
        util.showToastNone('绑定失败,输入手机号登录');
      }
    });
  },

  // 获取验证码
  getMsgCode(e) {
    var phone = this.data.phoneInput;
    if (util.isEmpty(phone)) {
      util.showToastNone("手机号不能为空！");
      return;
    } else {
      var re = /^1\d{10}$/
      if (!re.test(phone)) {
        util.showToastNone("手机号格式错误！");
        return;
      }
    }
    var that = this;
    req.Post(url.urlString.getValidateCode, {
      'phone': phone
    }, function Success(res) {
      if (res.code == 0) {
        util.showToastNone('已发送');
        var second = 60;
        setInterval(() => {
          second--;
          if (second <= 1) {
            that.setData({
              intro: "重新获取",
            })
            clearInterval();
          } else {
            that.setData({
              intro: "还剩" + second + '秒',
            })
          }
        }, 1000);
      } else {
        util.showToastNone(res.msg);
      }
    });
  },

})