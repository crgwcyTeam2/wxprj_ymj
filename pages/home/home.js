import req from "../../utils/request.js";
import api from "../../utils/api.js";
//home.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banner_list: ['/images/home/banner_test_pic.png', '/images/home/banner_test_pic.png', '/images/home/banner_test_pic.png', '/images/home/banner_test_pic.png'],
    artists:[1,2,3,4,5,6,7,8,9],
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    var that = this;
    // 请求完成登录
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        if (utils.isEmpty(token)) {
          that.wxLogin();
        } else {
          that.requestAction();
        }
      },
      fail: function (err) {
        that.wxLogin();
      }
    })
  },

  // 系统登录
  wxLogin() {
   // console.log('xxxxxxxxxxxxxxxxxxxxxxxstart wxLogin=',resCode);
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this;
        let param = {
          code: res.code
        }
        console.log('Login code:', res.code, api.urlString.loginURL)

        req.Post(api.urlString.loginURL, param, function success(res) {
          console.log('xxxxxxxxxxxxxxxxxxxxurlString.wxLogin res=',res);
          // wx.setStorageSync("token", res.data.token);
          // wx.setStorageSync("phone", res.data.phone);
          // that.requestAction();
        });
      },
    })
  },

  requestLogin() {
    wx.showLoading({
      title: 'loading'
    });
    let U = url.urlString.frontPage;
    let that = this;
    req.Post(U, {}, function success(res) {
      wx.hideLoading();
      if (res.code == 0) {
        that.setData({
          homeData: res.data.list[0].floorDatas,
          nexFlower: res.data.list.slice(2, res.data.list.length)
        })
      } else {
        wx.showToast({
          title: '系统错误',
          icon: "none"
        })
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  swiper_item_click() {

  },
  jia_mu_biao_click()
  {
    wx.navigateTo({
      url: '/pages/priceTable/priceTable',
    })
  },
  artist_item_click()
  {
    wx.navigateTo({
      url: '/pages/personalHome/personalHome',
    })
  }
})
