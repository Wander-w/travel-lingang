// common/custom-navbar/custom-navbar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 页面标题
    title: {
      type: String,
      value: "Custom Navbar"
    },
    // 插槽Btn
    slotBtnText: {
      type: String,
      value: ""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isBack: false,

    navbar: {
      top: 0,
      width: 0,
      height: 0,
      marginLeft: 0,
      // 感应宽度 - 额... 指某种手机型号的的摄像头在中间位置 
      inductionWidth: 0,
    },

    form: {
      picture: null,
      title: "",
      content: ""
    }
  },
  lifetimes: {
    attached() {
      const isBack = getCurrentPages().length > 0
      const top = app.globalData.headerBtn.top
      const height = app.globalData.headerBtn.height

      // 胶囊距离右侧 （设备width - 胶囊right）
      const menuRight = app.globalData.systemInfo.screenWidth - app.globalData.headerBtn.right
      // 胶囊宽度
      const menuWidth = app.globalData.headerBtn.width

      // 设备宽度
      const deviceWidth = app.globalData.systemInfo.screenWidth

      // width : 设备宽度 - (右侧胶囊展宽 = 胶囊width + 胶囊距离右侧距离[*2为左侧留空隙对齐右侧]) - 
      const width = deviceWidth - (menuWidth + menuRight * 2)

      // 以右侧胶囊为基准,将剩余部分以1:2 进行划分其中inductionWidth占2也就是 设备宽度 = 2个胶囊 + 感应宽度 
      const inductionWidth = deviceWidth - (menuWidth + menuRight * 2) * 2
      
      // 空隙对齐右侧
      const marginLeft = menuRight

      this.setData({
        isBack,
        navbar: {
          top,
          height,
          width,
          marginLeft,
          inductionWidth
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    handleBack() {
      wx.navigateBack()
    },
    // 发布
    handlePublish(e) {
      this.triggerEvent('slotBtntap', e)
    },
  },
})