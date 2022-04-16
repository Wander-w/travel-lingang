// common/upload-image/upload-image.js
Component({
  externalClasses: ["custom"],
  /**
   * 组件的属性列表
   */
  properties: {
    // 文件列表
    imageList: {
      type: Array,
      value: () => [],
    },
    // 最大上传数
    max: {
      type: [String, Number],
      value: 9,
    },
    maxDuration: {
      type: Number,
      value: 60,
    },
    // 上传提示文案
    uploadText: {
      type: String,
      value: "Upload",
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 删除文件
    handleRemoveFile(e) {
      this.triggerEvent("remove", e.target.dataset);
    },
    // 选择文件
    async handleSelectFile() {
      try {
        const { tempFiles } = await wx.chooseMedia({
          count: this.properties.max,
        });
        this.triggerEvent("selectFile", tempFiles);
      } catch (error) {
        wx.showToast({
          title: error.message,
          icon: "error",
          mask: true,
          duration: 1000,
        });
      }
    },

    // 预览图片
    handlePreview(e) {
      const url = e.target.dataset.src;
      const urls = this.properties.imageList.map((item) => item.tempFilePath);
      wx.previewImage({
        urls,
        current: url,
      });
    },
  },
});
