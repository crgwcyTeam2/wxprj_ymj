const app = getApp()
// "template/getPhone/getPhone",
Page(
  {
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    if (app.globalData.userInfo || wx.getStorageSync('authorization')) {
      wx.switchTab({
          url: '/pages/home/home',
      })
    } else {
        this.wxGetUserInfo();
    }
  },


 // 获取用户授权数据
  bindGetUserInfo(e) {
    var that = this;
    wx.setStorageSync("authorization", true);
    app.globalData.userInfo = e.detail.userInfo;
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

//  微信版本兼容
  wxGetUserInfo() {
    if (app.globalData.userInfo) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    } else if (this.data.canIUse) {
      var that = this;
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo;
//        console.log("xxxxxxxxxxxxxxxxxxxwxGetUserInfo222",res.userInfo);
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      var that = this;
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          wx.switchTab({
            url: '/pages/home/home',
          })
        }
      })
    }
  },


})