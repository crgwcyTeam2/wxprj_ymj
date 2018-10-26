// pages/priceTable/priceTable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 0,
    searchData: [{name:'烫发'},{name:'染发'},{name:'护发'},{name:'其他'},{name:'充值卡'},{name:'折扣卡'},{name:'次卡'}],


  },

  menuClick(e) {
    this.setData({
      _num: e.target.dataset.num
    });
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

  }
})