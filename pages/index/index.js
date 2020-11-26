// pages/demo.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    flags: [false, false, false],
    col: [],
    block: {},
    time: 500,
    randomTime: 500,
    firstTime: "",
    punch: "",
    meetTime: "",
    windowWidth: "",//窗口宽度
    windowHeigh: "",//窗口高度
    packetList: [{}],//红包队列
    packetNum: 200,//总共红包的数量
    showInter: "",//  循环动画定时器
    className: "",
    showFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ showFlag: true });
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
    if (this.data.showFlag) {
      this.setTimeOutContent(0, this.data.time);
      this.getTime();
      this.getMeetTime();
      this.setData({ showFlag: false });
    }

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
    var timer = setInterval(function () {
      if (i == 0) {
        that.draw();
        clearInterval(timer);
        that.setData({ ['flags[' + i + ']']: true });
        that.setTimeOutContent(1, that.data.time += 3000);
      }

      if (i == 1) {
        that.setData({ time: that.data.time, ['flags[' + i + ']']: true });
        clearInterval(timer);
        that.setTimeOutContent(2, that.data.time);

      }

      if (i == 2) {
        clearInterval(timer);
        setTimeout(function () {
          that.setData({ time: that.data.time, ['flags[' + i + ']']: true });
          that.redPackStart();
          //默认滑动到底部
          that.pageScrollToBottom();
        }, 319993);
      }
    }, time);


  },
  async getTime() {
    var that = this;
    var now = util.formatTime(new Date()).split(":");
    var hour = now[0].split(" ")[1];
    that.setData({
      firstTime: hour + ":" + now[1]
    });
  },
  async getCurrentTime() {
    var that = this;
    var nowTime = new Date;
    that.setData({
      punch: util.formatDate(new Date, 'Y-M-D h:m:s'),
    })

    var timeout1 = setTimeout(function () {
      that.getCurrentTime();
    }, 1000);
  },
  async getMeetTime() {
    var that = this;
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
  },
  draw() {
    var that = this;
    that.data.dataList = [];
    var chatTimer = setInterval(() => {
      that.flags[1] = true;
      that.setData({
        flags: that.data.flags
      });
    }, that.data.time += 2000);

    for (let i = 0; i < 23; i++) {
      for (let j = 0; j < 16; j++) {
        that.setData({
          "block.row": i,
          "block.col": j,
          "block.class": "block",
        });
        that.data.col.push(that.data.block);
        that.setData({
          col: that.data.col
        })
        that.data.block = {};
        that.setData({
          block: that.data.block
        })
      }

      that.data.dataList.push(that.data.col);
      that.setData({
        dataList: that.data.dataList
      })
      that.data.col = [];
      that.setData({
        col: that.data.col
      })
    }

    for (let i = 0; i < 9; i++) {
      that.drawBlock(i + 7, 1, 'block-black', that.getRandomTime(100) * i);
    }
    that.data.time = 900;

    //left-ear
    that.drawBlock(6, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(5, 1, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(4, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(3, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(1, 1, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(0, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(0, 3, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(0, 4, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(0, 5, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(4, 3, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(3, 4, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(3, 5, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(1, 6, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 6, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 7, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 8, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 11, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(3, 12, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(4, 13, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(5, 14, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(6, 14, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(7, 14, 'block-black', that.data.time += that.getRandomTime(100));
    //right-ear
    that.drawBlock(16, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(17, 1, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(18, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(19, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 0, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 1, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(22, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(22, 3, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(22, 4, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(22, 5, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 2, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(18, 3, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(19, 4, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(19, 5, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 6, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 6, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 7, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 8, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 11, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(19, 12, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(18, 13, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(17, 14, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(16, 14, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(15, 14, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(8, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(9, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(10, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(11, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(12, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(13, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(14, 15, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(6, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(7, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(6, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(7, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(15, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(16, 9, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(15, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(16, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(11, 10, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(10, 11, 'block-black', that.data.time += that.getRandomTime(100));
    that.drawBlock(12, 11, 'block-black', that.data.time += that.getRandomTime(100));
    //yellow-ear
    that.drawBlock(1, 2, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(1, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(3, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(1, 4, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 4, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(1, 5, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(2, 5, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(19, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 4, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(20, 5, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 2, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 3, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 4, 'block-yellow', that.data.time += that.getRandomTime(100));
    that.drawBlock(21, 5, 'block-yellow', that.data.time += that.getRandomTime(100));
    //face-brown
    that.drawBlock(2, 1, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 1, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 1, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(3, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(4, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(5, 11, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(6, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(6, 13, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(7, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(7, 13, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(8, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(8, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(9, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(10, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(11, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(12, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(13, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(14, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 13, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(14, 14, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(15, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(15, 13, 'block-brown', that.data.time += that.getRandomTime(25));


    that.drawBlock(16, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(16, 13, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(17, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 3, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 12, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(17, 13, 'block-brown', that.data.time += that.getRandomTime(25));


    that.drawBlock(18, 4, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 5, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 11, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(18, 12, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(19, 6, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 7, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 8, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 9, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 10, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 11, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(18, 1, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 1, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(20, 1, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(18, 2, 'block-brown', that.data.time += that.getRandomTime(25));
    that.drawBlock(19, 2, 'block-brown', that.data.time += that.getRandomTime(25));

    that.drawBlock(11, 9, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 9, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 10, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 10, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 11, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(13, 12, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 9, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 10, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 10, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 11, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(9, 12, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(10, 12, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 12, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(12, 12, 'block-white', that.data.time += that.getRandomTime(25));
    that.drawBlock(11, 11, 'block-white', that.data.time += that.getRandomTime(25));
    clearInterval(chatTimer);
  },
  drawBlock(row, col, className, time) {
    var that = this;
    var timer = setInterval(() => {
      var blocktClass = 'dataList[' + row + '][' + col + '].class';
      that.setData({
        [blocktClass]: className,
        time: time
      });
      clearInterval(timer);
    }, time);

  },
  getRandomTime(num) {
    return Math.random() * num;
  },
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('.content').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  }
});