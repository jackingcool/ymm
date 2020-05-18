//index.js
//获取应用实例
const app = getApp()

Page({

  onReady: function() {
    // 生命周期函数 onReady 中获取自定义的 popover 组件，根据id获取
    this.popover = this.selectComponent('#popover');
  },

  onTap: function (e) {
    // 获取按钮元素的坐标信息
    var id = '#button' // 或者 e.target.id 获取点击元素的 ID 值
    wx.createSelectorQuery().select('#' + id).boundingClientRect(res => {
      // 调用自定义组件 popover 中的 onDisplay 方法
      this.popover.onDisplay(res);
    }).exec();
  },

  // 响应popover组件中的子元素点击事件
  onClickA: function (e) {
    wx.showToast({
      title: '你点击了A',
      icon: 'none'
    });
    // 调用自定义组件 popover 中的 onHide 方法
    this.popover.onHide();
  }

})
