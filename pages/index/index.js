//index.js
//获取应用实例
const app = getApp()
let col1H = 0;
let col2H = 0;

Page({
  data: {
    productIndex: 0,
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    imgUrls0: [],//第一栏广告
    imgUrls1_0: [],//第二栏广告
    imgUrls1_1: [],//第二栏广告
    imgUrls2: [],//第三栏广告
    circular: true,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  imageLoad: function () {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth//图片宽度
    });
    this.setData({
      imageHeight: this.data.imageWidth / 2,//图片高度
    })
  },
  // 新增
  onLoad: function () {
    this.getAdData();
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.loadImages();
      }
    })
  },

  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function () {
    var that = this;
    let index = that.data.productIndex;
    wx.request({
      url: app.globalData.base + '/wechat/product/list?count=10&index=' + index,
      method: 'GET',
      success: function (res) {
        if (res.data.messages === 'success') {
          // let csrfTokenAll = res.header["Set-Cookie"];
          // let csrfToken = csrfTokenAll.substring(10, 42);
          // wx.setStorageSync("cookie", csrfToken);
          let images = res.data.data;
          index++;
          that.setData({
            productIndex: index
          });

          let baseId = "img-" + (+new Date());

          for (let i = 0; i < images.length; i++) {
            images[i].id = baseId + "-" + i;
          }

          that.setData({
            loadingCount: images.length,
            images: images
          });
        } else {
          console.log("数据获取失败");
        }
      }
    });
  },

  getAdData: function () {
    var that = this;
    // 获取首页信息
    wx.request({
      url: app.globalData.base + '/wechat/',
      method: 'GET',
      success: function (res) {
        if (res.data.messages === 'success') {
          var navigations = res.data.data.navigations;
          var adsTop = res.data.data.adsTop;
          var adsCentral = res.data.data.adsCentral;
          var imgUrls1_0_d = [];
          var imgUrls1_1_d = [];
          for (var i = 0; i < 5; i++) {
            imgUrls1_0_d[i] = navigations[i];
          }
          var y = 0;
          for (var i = 5;  i < 10; i++) {
            imgUrls1_1_d[y] = navigations[i];
            y++;
          }
          that.setData({
            imgUrls0: adsTop,
            imgUrls1_0: imgUrls1_0_d,
            imgUrls1_1: imgUrls1_1_d,
            imgUrls2: adsCentral
          });
        } else {
          console.log("数据获取失败");
        }
      }
    });
  },
  seeProductInfo: function (event) {
    //跳转到商品显示页面
    console.log(event);
    let id = event.currentTarget.dataset.pid;
    wx.navigateTo({
      url: "../product/product?id="+id
    });
  }
})