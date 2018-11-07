//获取应用实例
const app = getApp()
var common = require('../../common/common.js');

Page({
  data: {
    isLogin: null
  },
  onLoad: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    });
  },
  getUserInfo: function (e) {
    //获取用户授权信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log("用户选择了不授权");
          app.globalData.isLogin = false;
          wx.showToast({
            title: '您取消了授权,如需更好的使用小程序请重新授权',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log("用户选择了授权,进行登陆");
          //拿到用户信息
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo;
              console.log(app.globalData.userInfo);
            }
          })
          //登陆
          common.login('my');
        }
      }
    })
    
  }
})
