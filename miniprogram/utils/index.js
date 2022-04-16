module.exports = {
  scriptFormate(str) {
    return str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/&/g, "&amp;")
      .replace(/\$/g, "&dollar;");
  },

  //防抖
  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      const _self = this;
      const args = arguments;

      if (immediate) {
        let callNow = !timeout;

        timeout = setTimeout(function () {
          timeout = null;
        }, wait);

        if (callNow) {
          func();
        }
      } else {
        //不会立即执行
        timeout = setTimeout(() => {
          func.apply(_self, args);
        }, wait);
      }
    };
  },

  // 节流
  throttle(func, wait) {
    let timeout;
    return function () {
      if (!timeout) {
        timeout = setTimeout(function () {
          func();
          timeout = null;
        }, wait);
      }
    };
  },

  /**
   * 上传文件
   * 必须有文件的size和临时路径(tempFilePath)和文件类型(fileType)才会被上传
   */
  uploadFile(cloudPath, name, fileList) {
    return new Promise(async (resolve, reject) => {
      try {
        wx.showLoading({
          title: "上传文件中",
        });
        const normarlFileList = fileList
          .filter((item) => item.fileID)
          .map((item) => ({
            fileID: item.fileID,
            imagePath: item.imagePath,
          }));
          
        const uploadFileList = fileList.filter(
          (item) => item.size && item.tempFilePath && item.fileType
        );

        // 上传文件
        const fileResult = await Promise.all(
          uploadFileList.map(async (item) => {
            return await wx.cloud.uploadFile({
              cloudPath: `${cloudPath}${name}-${Date.now()}.png`,
              filePath: item.tempFilePath,
            });
          })
        );

        // 上传成功后拿到 图片信息
        const filePathResult = await wx.cloud.getTempFileURL({
          fileList: fileResult.map((item) => item.fileID),
        });

        // 格式化图片信息返回结果
        const result = normarlFileList;
        result.push(
          ...filePathResult.fileList.map((item) => ({
            imagePath: item.tempFileURL,
            fileID: item.fileID,
          }))
        );
        resolve(result);
      } catch (error) {
        console.error(error);
        reject("上传文件失败");
      } finally {
        wx.hideLoading();
      }
    });
  },

  // 格式化时间
  formateDate(dateStr) {
    const newDate = new Date(dateStr);
    const y = newDate.getFullYear();
    const m = newDate.getMonth() + 1;
    const d = newDate.getDate();
    return `${y}年${m}月${d}日`;
  },
};
