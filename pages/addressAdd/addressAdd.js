import addressTree from "../../utils/address_tree2.js";
import req from "../../utils/request.js";
import api from "../../utils/api.js";
// import utils from "../../utils/util.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedProvince: '北京',
    selectedCity: '北京市',
    selectedDistrict: '东城区',

    selectedCityId: 10004,
    currentOkselectedProvince: '',
    currentOkselectedCity: '',
    currentOkselectedDistrict: '',

    currentOkSelectCityId: -1,
    value: ['', '', ''],

    addressArray: [],

    provinceArray: [],
    cityArray: [],
    districtArray: [],
    oldpovinceIndex: 0,
    oldcityIndex: 0,
    oldistrictIndex: 0,
    popwindowHide: true,
    setDefaultFlag: 1,

    area:null,
    receiverName: null,
    receiverPhone: null,
    address: null,
    id:-1,
    jsonItem:{}

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // let jsonItems = options.itemData;
    // console.log(jsonItems);
    // this.setData({
    //   jsonItem:JSON.parse(jsonItems)
    // })
    let that = this;
    let data = wx.getStorage({
      key: 'addressData',
      success: function (res) {
        that.setData(
          {
            area: res.data.area,
            receiverName: res.data.receiverName,
            receiverPhone: res.data.receiverPhone,
            address:res.data.address,
            currentOkSelectCityId: res.data.areaId,
            id:res.data.id,
            setDefaultFlag: res.data.isDefault
          });
        wx.removeStorage({
          key: 'addressData',
          success: function () {
            console.log('addressData remove success');
          },
          fail: function () {
            console.log('addressData remove fail');
          }
        });
      },
      fail(error) {
        console.log('addressData remove failed');
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.addressArray = addressTree.addressData.AddrTree;
    let addressArray = this.data.addressArray;

    for (let i = 0; i < addressArray.length; i++) {
      this.data.provinceArray.push(addressArray[i].provinceName);
      if (i == 0) {
        for (let j = 0; j < addressArray[0].cityList.length; j++) {
          this.data.cityArray.push(addressArray[i].cityList[j].cityName);
          for (let z = 0; z < addressArray[0].cityList[0].districtList.length; z++) {
            this.data.districtArray.push(addressArray[0].cityList[0].districtList[z].districtName);
          }
        }

      }
      //    console.log('province name:', addressArray[i].provinceName);
    }
    //  this.data.provinceArray=addressTree.addressData.
    this.setData({
      provinceArray: this.data.provinceArray,
      cityArray: this.data.cityArray,
      districtArray: this.data.districtArray
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // requestAddressTree() {
  //   wx.showLoading({
  //     title: 'loading'
  //   });
  //   let param = {};
  //   let url = api.urlString.customerAddressTree;
  //   let that = this;
  //   req.Post(url, param, function success(res) {
  //     wx.hideLoading();
  //     console.log("address tree:", res);
  //   });
  // },
  requestAddressAddOrUpdate() {
    wx.showLoading({
      title: 'loading'
    });
    let param = {
      receiverName: this.data.receiverName,
      receiverPhone: this.data.receiverPhone,
      areaId: this.data.currentOkSelectCityId,
      address: this.data.address,
      isDefault: this.data.setDefaultFlag,
    };
    if(this.data.id!=-1)
    {
      param.id=this.data.id;
    }
    let url = api.urlString.customerAddressAdd;
    let that = this;
    req.Post(url, param, function success(res) {
      wx.hideLoading();
      console.log("address add success:", res);
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      } else {
        utils.showToastNone(res.message);
      }
    });
  },
  bindChange(e) {
    const val = e.detail.value;
    let addressArray = this.data.addressArray;
    let cityArray = [];
    let districtArray = [];
    //console.log('xxxxxxxxxxxxxx',val[0],val[1],val[2]);
    let pickerViewSelectValue;
    if (this.data.oldpovinceIndex != val[0]) {
      this.data.oldpovinceIndex = val[0];
      for (let j = 0; j < addressArray[val[0]].cityList.length; j++) {
        cityArray.push(addressArray[val[0]].cityList[j].cityName);
        for (let z = 0; z < addressArray[val[0]].cityList[0].districtList.length; z++) {
          districtArray.push(addressArray[val[0]].cityList[0].districtList[z].districtName);
        }
      }
      pickerViewSelectValue = [val[0], 0, 0];
      this.setData({
        cityArray: cityArray,
        districtArray: districtArray,
        value: pickerViewSelectValue
      });

      this.data.selectedCityId = addressArray[val[0]].cityList[0].districtList[0].districtId;

    } else if (this.data.oldcityIndex != val[1]) {
      this.data.oldcityIndex = val[1];
      var districtArray2 = [];

      for (let z = 0; z < addressArray[val[0]].cityList[val[1]].districtList.length; z++) {
        districtArray2.push(addressArray[val[0]].cityList[val[1]].districtList[z].districtName);
      }
      pickerViewSelectValue = [val[0], val[1], 0];

      this.setData({
        districtArray: districtArray2,
        value: pickerViewSelectValue
      });
      this.data.selectedCityId = addressArray[val[0]].cityList[val[1]].districtList[0].districtId;
    } else if (this.data.oldistrictIndex != val[2]) {
      pickerViewSelectValue = [val[0], val[1], val[2]];
      this.data.oldistrictIndex = val[2];
      this.data.selectedCityId = addressArray[val[0]].cityList[val[1]].districtList[val[2]].districtId;
    }
    if (pickerViewSelectValue != undefined) {
      this.data.selectedProvince = this.data.provinceArray[pickerViewSelectValue[0]];
      this.data.selectedCity = this.data.cityArray[pickerViewSelectValue[1]];
      this.data.selectedDistrict = this.data.districtArray[pickerViewSelectValue[2]];
    }
  },
  select_address_cancel() {
    let popwindowHide = true;
    this.setData({
      popwindowHide: popwindowHide
    });
  },
  select_address_ok() {
    let popwindowHide = true;
    this.data.currentOkSelectCityId = this.data.selectedCityId;
    this.data.currentOkselectedProvince = this.data.selectedProvince;
    this.data.currentOkselectedCity = this.data.selectedCity;
    this.data.currentOkselectedDistrict = this.data.selectedDistrict;

    this.setData({
      popwindowHide: popwindowHide,
      area: this.data.currentOkselectedProvince + '/' + this.data.currentOkselectedCity + '/' + this.data.currentOkselectedDistrict
    });
  },

  
  district_item_click() {
    let popwindowHide = false;
    this.setData({
      popwindowHide: popwindowHide
    });
  },
  default_icon_click() {

    if (this.data.setDefaultFlag == 0) {
      this.data.setDefaultFlag = 1;
    } else
      this.data.setDefaultFlag = 0;
    this.setData({
      setDefaultFlag: this.data.setDefaultFlag
    });
  },
  save_click() {
    console.log('receiverName:', this.data.receiverName)
    console.log('receiverPhone:', this.data.receiverPhone)
    console.log('address:', this.data.address)
    if (this.data.receiverName == null || this.data.receiverPhone == null ||
      this.data.address == null || this.data.currentOkSelectCityId == -1 ||
      this.checkPhone()
    ) {
    //  console.log(this.data.currentOkSelectCityId == -1, this.checkPhone());
      if (this.checkPhone())
        wx.showToast({
          title: '填写手机号码格式不对',
          icon: 'none',
          duration: 2000
        })
      else
        wx.showToast({
          title: '参数填写不合法',
          icon: 'none',
          duration: 2000
        })
    } else
      this.requestAddressAddOrUpdate();

  },
  bindReceiveName(e) {
    this.data.receiverName = e.detail.value;
  },
  bindPhoneNum(e) {
    this.setData({
      receiverPhone: e.detail.value
    })
  },
  bindDetailAddress(e) {
    this.data.address = e.detail.value;
  },

  checkPhone() {
    //"^0?1[3|4|5|6|7|8|9][0-9]\\d{8}$"
    ///^1[34578]\d{9}$/
    console.log('receiverPhone', this.data.receiverPhone);
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.data.receiverPhone))) {
      return true;
    } else {
      return false
    }
  },
  // 保存地址
  reqSaveAddress() 
  {
    let url = api.urlString.saveAddress;
    wx.showLoading({
      title: 'loading'
    });
    let param = {
      "address": "",
      "addressLabel": 0,
      "gender": 0,
      "id": 0,
      "isDefault": 0,
      "latitude": "",
      "locationAddress": "",
      "longitude": "",
      "phone": "",
      "receiver": "",
      "userId": ""
    };
    req.Post(url, param, function success(res) {
      wx.hideLoading();
      console.log('xxxxxxxxxxxxxxxxxreqSaveAddress  sucess res=', res);
    });
  },

  // 更新地址信息
  reqUpdateAddress() {
    let url = api.urlString.updateAddressInfo;
    wx.showLoading({
      title: 'loading'
    });
    let param = {
      "address": "",
      "addressLabel": 0,
      "gender": 0,
      "id": 0,
      "isDefault": 0,
      "latitude": "",
      "locationAddress": "",
      "longitude": "",
      "phone": "",
      "receiver": "",
      "userId": ""
    };
    req.Post(url, param, function success(res) {
      wx.hideLoading();
      console.log('xxxxxxxxxxxxxxxxxreqUpdateAddress  sucess res=', res);
    });
  },


})