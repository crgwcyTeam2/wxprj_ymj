var that;
App({
  onLaunch: function () {
    console.log("----app.js----onLaunch----")
    that = this;
  },
  onShow: function (options) {
    console.log("-----app.js----onShow------")
    console.log(options);
    console.log("this.globalData.isLogin=" + this.globalData.isLogin)
    console.log("options.path = " + options.path)

    if (options.path != "pages/index/index") { //分享进入
      this.globalData.shareUrl = options.path + '?';
      let _query = JSON.parse(JSON.stringify(options.query))
      for (let key in _query){
        this.globalData.shareUrl += key + "=" + _query[key] + '&';
      }
      console.log("this.globalData.shareUrl = " + this.globalData.shareUrl)
      
      if (!this.globalData.isLogin) { // 本次没有登录
        this.wxLoginFun();
      }
    }
  },

  wxLoginFun: function(){
    console.log('--------------登录-------------')
    wx.login({
      success: res => {
        that.globalData.code = res.code;

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (!res.authSetting['scope.userInfo']) {
              console.log("authSetting:fail");
              that.globalData.isDenyAuthorize = true;  // 未授权
              // wx.reLaunch({
              //   url: '/pages/index/index?isShare=true',
              // })
              wx.reLaunch({
                url: '/pages/getPhone/getPhone',
              })
            } else {
              that.getUserBaseData();
            }
          },
          fail() {
            console.log("wx.getSetting失败")
          }
        })
      }
    })
  },

  //已获得授权
  getUserBaseData() {
    let that=this;
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo;
        console.log('xxxxxxxxxxxxxxxxx res=', res, 'code=', that.globalData.code);
        this.loginByCode(res.rawData, res.signature, res.encryptedData, res.iv);
      },
      fail: res => {
        this.loginByCode();
      },
    })
  },

  loginByCode(_rawData, _signature, _encryptedData, _iv) {
    wx.request({
      url: that.globalData.userurl + '/app/user/loginByCode',
      data: {
        'code': that.globalData.code,
        'rowData': _rawData ? _rawData : "",
        'signature': _signature ? _signature : "",
        'encryptedData': _encryptedData ? _encryptedData : "",
        'iv': _iv ? _iv : "",
        'openId': that.globalData.openId,
      //   "isDebug": "false",
      },
      header: {
        'content-type': 'application/json',
        'token': that.globalData.token,
      },
      method: 'POST',
      success: function (res) {
        console.log('success:',res)
        if (res.data.status == 0) {
          that.globalData.openId = res.data.data.openId;
          that.globalData.token = res.data.data.accessToken == null ? "" : res.data.data.accessToken;
          that.globalData.userId = res.data.data.memberId;
          that.globalData.memberDefaultCardId = res.data.data.memberDefaultCardId;
          that.globalData.memberCompanyId = res.data.data.memberCompanyId;  //绑定的公司id
          that.globalData.memberCompanyUserRole = res.data.data.memberCompanyUserRole;   //0-普通员工, 1-超级管理员，2-管理员

          that.globalData.isLogin = true;
          
          if (that.globalData.memberCompanyId) {
            that.globalData.ispersonal = false
          } else {
            that.globalData.ispersonal = true
          }

        }
      }
    })
  },


  globalData: {
    token:'',
    isLogin: false,
    shareUrl: '',
    sacnCardId: '',
    sacnGroupId: '',
    userInfo: null,
    code:'',
    userId:'',
    themeColor: '#4e394a',
    ispersonal: true, //个人
    myBusinessCard:'',//名片信息
    memberDefaultCardId:'',//名片id
    memberCompanyId: '',//绑定的公司id
    memberCompanyUserRole: '', //0-普通员工, 1-超级管理员，2-管理员
    userurl: 'http://47.93.205.72:8080',
     uploadFileurl:'https://test-api-minapp-tuiing.anmav.cn/'
     //userurl: 'https://uat-api-minapp-tuiing.anmav.cn/app/',
     //uploadFileurl: 'https://uat-api-minapp-tuiing.anmav.cn/'
    //userurl: 'https://api-minapp-tuiing.anmav.cn/app/',
    //uploadFileurl: 'https://api-minapp-tuiing.anmav.cn/'
  }
})