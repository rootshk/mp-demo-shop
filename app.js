//初始化
App({
  //全局变量
  globalData: {
    base: 'http://192.168.0.49:8080',
    userInfo: null,
    isLogin: null
  },
  //启动
  onLaunch: function () {
    var that = this;
    //获取用户授权信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.globalData.isLogin = false;
        } else {
          that.globalData.isLogin = true;
        }
      }
    })
  },
})