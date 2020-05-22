// pages/demo.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flags: [false, false, false, false, false],
    firstTime: null,
    punch: null,
    meetTime: null,
    windowWidth: "",//窗口宽度
    windowHeigh: "",//窗口高度
    packetList: [{}],//红包队列
    packetNum: 200,//总共红包的数量
    showInter: ''//  循环动画定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTimeOutContent(0, 3000);
    this.getTime();
    this.getCurrentTime();
    this.getMeetTime();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setTimeOutContent: function (i, time) {
    var that = this;
    var longTime = 30000;
    var timer = setInterval(function () {
      if (i == 3) {
        time = 10000;
      }
      that.setData({ ['flags[' + i + ']']: true });
      i++;
      //默认滑动到底部
      wx.pageScrollTo({
        scrollTop: 1000
      })
      if (i == 4) {
        clearInterval(timer);
        that.setTimeOutContent(4, longTime);
        setTimeout(function () {
          that.redPackStart();
        }, longTime);
      }

      if (i >= 5) {
        clearInterval(timer);
      }
    }, time);


  },
  getTime: function () {
    var that = this;
    var now = util.formatTime(new Date()).split(":");
    var hour = now[0].split(" ")[1];

    that.setData({
      firstTime: hour + ":" + now[1]
    });
  },
  getCurrentTime: function () {
    var that = this;
    var nowTime = new Date;
    that.setData({
      punch: util.formatDate(new Date, 'Y-M-D h:m:s'),
    })

    var timeout1 = setTimeout(function () {
      that.getCurrentTime();
    }, 1000);
  },
  getMeetTime: function () {
    const that = this;
    var time_start = new Date("2020-03-19 00:00:00".replace(/-/g, '/')).getTime();//设定开始时间
    var time_end = new Date(util.formatDate(new Date, 'Y-M-D h:m:s').replace(/-/g, '/')).getTime(); //设定结束时间(等于系统当前时间)
    //计算时间差
    var time_distance = time_end - time_start;
    if (time_distance > 0) {
      // 天时分秒换算
      var int_day = Math.floor(time_distance / 86400000)
      time_distance -= int_day * 86400000;

      var int_hour = Math.floor(time_distance / 3600000)
      time_distance -= int_hour * 3600000;

      var int_minute = Math.floor(time_distance / 60000)
      time_distance -= int_minute * 60000;

      var int_second = Math.floor(time_distance / 1000)
      // 时分秒为单数时、前面加零
      if (int_day < 10) {
        int_day = "0" + int_day;
      }
      if (int_hour < 10) {
        int_hour = "0" + int_hour;
      }
      if (int_minute < 10) {
        int_minute = "0" + int_minute;
      }
      if (int_second < 10) {
        int_second = "0" + int_second;
      }
      // 显示时间



      var timeout2 = setTimeout(() => {
        that.setData({
          meetTime: int_day + "天" + int_hour + "小时" + int_minute + "分" + int_second + "秒"
        })
        that.getMeetTime();
      }, 1000);

    } else {
      // 显示时间
      that.setData({
        meetTime: 0 + "天" + 0 + "小时" + 0 + "分" + 0 + "秒"
      })

    }
  },
  redPackStart: function () {

    var that = this;

    // 获取手机屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeigh: res.windowHeight,
          top: res.windowHeight - 100   //设置红包初始位置
        })
      }
    })

    //建立临时红包列表
    var packetList = [];
    //建立临时红包图片数组
    var srcList = ["../imgs/1.png", "../imgs/2.png"];
    //生成初始化红包
    for (var i = 0; i < that.data.packetNum; i++) {
      // 生成随机位置（水平位置）
      var left = Math.random() * that.data.windowWidth - 20;
      // 优化位置，防止红包越界现象，保证每个红包都在屏幕之内
      if (left < 0) {
        left += 20;
      } else if (left > that.data.windowWidth) {
        left -= 20;
      }
      // 建立临时单个红包
      var packet = {
        src: srcList[Math.ceil(Math.random() * 2) - 1],
        top: -30,
        left: left,
        speed: Math.random() * 2500 + 3000     //生成随机掉落时间，保证每个掉落时间保持在3秒到5.5秒之间
      }
      // 将单个红包装入临时红包列表
      packetList.push(packet);
      // 将生成的临时红包列表更新至页面数据，页面内进行渲染
      that.setData({
        packetList: packetList
      })
    }

    // 初始化动画执行当前索引
    var tempIndex = 0;
    // 开始定时器，每隔1秒掉落一次红包
    that.data.showInter = setInterval(function () {
      // 生成当前掉落红包的个数，1-3个
      var showNum = Math.ceil(Math.random() * 3);
      // 防止数组越界
      if (tempIndex * showNum >= that.data.packetNum) {
        // 如果所有预生成的红包已经掉落完，清除定时器
        clearInterval(that.data.showInter);
      } else {
        switch (showNum) {
          case 1:
            //设置临时红包列表当前索引下的top值，此处top值为动画运动的最终top值 
            packetList[tempIndex].top = that.data.windowHeigh;
            // 当前次掉落几个红包，索引值就加几
            tempIndex += 1;
            break;
          case 2:
            packetList[tempIndex].top = that.data.windowHeigh;
            packetList[tempIndex + 1].top = that.data.windowHeigh;
            tempIndex += 2;
            break;
          case 3:
            packetList[tempIndex].top = that.data.windowHeigh;
            packetList[tempIndex + 1].top = that.data.windowHeigh;
            packetList[tempIndex + 2].top = that.data.windowHeigh;
            tempIndex += 3;
            break;
          default:
            console.log();
        }
        // 更新红包列表数据
        that.setData({
          packetList: packetList
        })
      }
    }, 1000)
  }
});