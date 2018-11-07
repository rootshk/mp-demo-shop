//获取app变量
var app = getApp()

function findStorage(str) {
   return wx.getStorage({
    key: str,
    success: function (res) {
      return res.data;
    },
    fail: function () {
      return false;
    }
  })
}

function hasStorage(str) {
  return wx.getStorage({
    key: str,
    success: function (res) {
      return true;
    },
    fail: function () {
      return false;
    }
  })
}
//统一登陆
function login(path) {
  // 登录
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: app.globalData.base + '/wechat/user/onLogin',
          method: 'POST',
          data: {
            code: res.code,
            userInfo: app.globalData.userInfo
          },
          header: {
            'content-type': 'application/json;charset=UTF-8'
          },
          success: function (res) {
            if (res.data.messages === 'success') {
              app.globalData.isLogin = true;
              wx.setStorage({
                key: "session",
                data: res.data.data
              });
              wx.switchTab({
                url: '../' + path
              });
              console.log("服务器登陆成功");
            } else {
              console.log(res);
              console.log("服务器登陆失败");
            }
          }
        })
      } else {
        console.log('微信登录失败！' + res.errMsg)
        status = false;
      }
    }
  });
}

//暴露接口
module.exports = {
  login: login,//登录
  findStorage: findStorage,
  hasStorage: hasStorage,
}