import req from "/utils/request.js";
import api from "/utils/api.js";
var that;
App({
  onLaunch: function () {
    that = this;
  },
  onShow: function (options) {
    console.log(options);
    // console.log("this.globalData.isLogin=" + this.globalData.isLogin)
    // console.log("options.path = " + options.path)

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
    wx.login({
      success: res => {
        that.globalData.code = res.code;

        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (!res.authSetting['scope.userInfo']) {
              console.log("authSetting:fail");
              that.globalData.isDenyAuthorize = true;  // 未授权
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
        that.requestLoginByCode(res, that.requestLoginByCodeSuccess);
      },
      fail: res => {
        //this.requestLoginByCode();
          console.log('get usrInfo error');
      },
    })
  },

  requestLoginByCodeSuccess(res)
  {
   // console.log('requestLoginByCodeSuccess')

    this.globalData.openId = res.data.openId;
    this.globalData.token = res.data.accessToken == null ? "" : res.data.accessToken;
    this.globalData.userId = res.data.memberId;
    this.globalData.memberDefaultCardId = res.data.memberDefaultCardId;
    this.globalData.memberCompanyId = res.data.memberCompanyId;  //绑定的公司id
    this.globalData.memberCompanyUserRole = res.data.memberCompanyUserRole;   //0-普通员工, 1-超级管理员，2-管理员

    this.globalData.isLogin = true;

    if (this.globalData.memberCompanyId) {
      this.globalData.ispersonal = false
    } else {
      this.globalData.ispersonal = true
    }
    console.log('global data:', this.globalData)
  },


  requestLoginByCode(res,requestLoginByCodeSuccess) {
    let url = api.urlString.loginByCode;
    let that = this;

    wx.showLoading({
      title: 'loading'
    });
    let param={
      'code': that.globalData.code,
      'rowData': res.rawData ? res.rawData : "",
      'signature': res.signature ? res.signature : "",
      'encryptedData': res.encryptedData ? res.encryptedData : "",
      'iv': res.iv ? res.iv : "",
      'openId': that.globalData.openId,
      //"isDebug": "false",
    };

    req.Post(url, param, function success(res) {
      wx.hideLoading();
      console.log('req.Post res=',res);
      requestLoginByCodeSuccess(res);
    });
  },

  // loginByCode(_rawData, _signature, _encryptedData, _iv) {
  //   wx.request({
  //     url: that.globalData.userurl + '/app/user/loginByCode',
  //     data: {
  //       'code': that.globalData.code,
  //       'rowData': _rawData ? _rawData : "",
  //       'signature': _signature ? _signature : "",
  //       'encryptedData': _encryptedData ? _encryptedData : "",
  //       'iv': _iv ? _iv : "",
  //       'openId': that.globalData.openId,
  //       //   "isDebug": "false",
  //     },
  //     header: {
  //       'content-type': 'application/json',
  //       'token': that.globalData.token,
  //     },
  //     method: 'POST',
  //     success: function (res) {
  //       console.log('success:', res)
  //       if (res.data.status == 0) {
  //         that.globalData.openId = res.data.data.openId;
  //         that.globalData.token = res.data.data.accessToken == null ? "" : res.data.data.accessToken;
  //         that.globalData.userId = res.data.data.memberId;
  //         that.globalData.memberDefaultCardId = res.data.data.memberDefaultCardId;
  //         that.globalData.memberCompanyId = res.data.data.memberCompanyId;  //绑定的公司id
  //         that.globalData.memberCompanyUserRole = res.data.data.memberCompanyUserRole;   //0-普通员工, 1-超级管理员，2-管理员
  //         that.globalData.isLogin = true;
  //         if (that.globalData.memberCompanyId) {
  //           that.globalData.ispersonal = false
  //         } else {
  //           that.globalData.ispersonal = true
  //         }
  //         console.log('global data:', that.globalData)
  //       }
  //     }
  //   })
  // },

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
    uploadFileurl:'https://test-api-minapp-tuiing.anmav.cn/',
    appId:'wx1d09378c5ebca84d'
    //userurl: 'https://uat-api-minapp-tuiing.anmav.cn/app/',
    //uploadFileurl: 'https://uat-api-minapp-tuiing.anmav.cn/'
    //userurl: 'https://api-minapp-tuiing.anmav.cn/app/',
    //uploadFileurl: 'https://api-minapp-tuiing.anmav.cn/'
  }
})