// pages/my/my.js
var  app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      usr_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData(
        {
          usr_info: app.globalData.userInfo
        }
      );
      console.log('xxxxxxxxxxxxxxx2',this.data.usr_info);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  my_order_item_click(){
    wx.navigateTo({
      url: '/pages/orderList/index',
    })
  },
  meiyuanClick()
  {
    wx.navigateTo({
      url: '/pages/meiyuanMall/meiyuanMall',
    })
  },
  consumerRecordClick()
  {
    wx.navigateTo({
      url: '/pages/consumerDetails/consumerDetails',
    })
  },
  addressManageClick()
  {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  modify_phone()
  {
    wx.navigateTo({
      url: '/pages/modifyBindPhone/modifyBindPhone',
    })
  },
  requestAction() {
    wx.showLoading({
      title: '加载中...'
    });
    let param = {};
   // let date = new Date();
   // + '?_t=' + date.getTime()
    let url = api.urlString.personalCenter;
    let that = this;
    req.Post(url, param, function success(res) {
       wx.hideLoading();
      that.data.phoneCallMsg.content = res.data.bsetPhone;
      that.setData({
        dataObj: res.data,
        phoneCallMsg: that.data.phoneCallMsg
      });
    });
  },
})