// pages/jiFenGoodsDetail/jiFenGoodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_list: ['/images/goodsDetail/banner_test.png', '/images/goodsDetail/banner_test.png', '/images/goodsDetail/banner_test.png', '/images/goodsDetail/banner_test.png'],
    banner_index:0,
    banner_total:0
  },
  bindSwiperChange(e)
  {
    this.setData({
      banner_index:e.detail.current+1
    });
  },
  lijiduihuanClick()
  {
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm',
    })
      // wx.showToast({
      //   title: '暂时不支持',
      //   icon:'none'
      // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData(
        {
          banner_total: this.data.banner_list.length
        }
      )
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