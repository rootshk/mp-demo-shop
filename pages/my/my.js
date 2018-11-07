//index.js
//获取应用实例
const app = getApp()
var common = require('../common/common.js');

Page({
  data: {
    isLogin: null
  },
  onLoad: function () {
    
  },
  onShow: function () {
    //通过app的登陆态来修改登陆显示状态
    this.setData({
      isLogin: app.globalData.isLogin
    });
  }
})
