//获取应用实例
const app = getApp();

Page({
  data: {
    skuModal: true,
    miniPrices: 0.00,
    miniPricesName: "无售价"
  },
  onLoad: function (option) {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth//图片宽度
    });
    this.setData({
      id: option.id,
    });
    this.getProductInfo(this.data.id);
  },
  getProductInfo: function (id) {
    var that = this;
    // 获取首页信息
    wx.request({
      url: app.globalData.base + '/wechat/product/' + id,
      method: 'GET',
      success: function (res) {
        if (res.data.messages === 'success') {
          that.setData({
            info: res.data.data
          });
          console.log(that.data.info);
          //初始化页面标题
          let name = res.data.data.name;
          if(name.length > 14) {
            name = name.substring(0, 11);
            name = name + "..";
          }
          //设置页面标题
          wx.setNavigationBarTitle({
            title: name//页面标题为路由参数
          })
          //拿到最低价
          let skus = res.data.data.skus;
          let miniPrice = 9999999999999;
          let miniPricesName = "售价";
          for (let i = 0; i < skus.length; i++) {
            let sku = skus[i];
            let skuPrices = sku.skuPrices;
            //如果没有SKUPRICE
            if (null == skuPrices || skuPrices.length == 0) {
              // sku
              let price = sku.price;
              if (price < miniPrice) {
                miniPrice = sku.price;
              }
            } else {
              for (let y = 0; y < skuPrices.length; y++) {
                let skuPrice = skuPrices[y];
                let price = skuPrice.price;
                if (price < miniPrice) {
                  miniPrice = skuPrice.price;
                  miniPricesName = skuPrice.name;
                }
              }
            }
          }
          // 设置最低价
          that.setData({
            miniPrice: miniPrice,
            miniPricesName: miniPricesName
          });
          let caption = res.data.data.caption;
          if (caption === null || caption === undefined || caption === "" ) {
            that.setData({
              hasCaption: false
            });
          } else {
            that.setData({
              hasCaption: true
            });
          }
          //设置厂商名称
          let brandName = res.data.data.brand.name;
          if (brandName.length > 4) {
            brandName = brandName.substring(0, 4);
            brandName = brandName + "...";
            that.setData({
              'info.brand.name': brandName
            });
          }
        }
      }
    });
  },
  radioChange: function (e) {
    console.log('radio发生change事件：', e);
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let id = e.detail.value;
    
  },
  hideSkuModal: function () {
    this.setData({
      skuModal: false
    });
  }
})