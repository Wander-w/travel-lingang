// components/dashboard/scenic-spot/scenic-spot.js
import { scenicSpotNavList } from "../../../dict/index";
import { uploadFile } from "../../../utils/index";
const uploadCloudPath = `travel-lingang/scenic-spot/images/`;
const app = getApp();

const fileAddField = (arr, originField) => {
  return arr.map((item) => {
    item.tempFilePath = item[originField];
    return item;
  });
};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: Object,
  },

  observers: {
    detail(value) {
      if (value) {
        this.setData({
          name: value.name,
          address: value.address,
          city: value.city,
          facilities: value.facilities.join(","),
          notification: value.notification,
          open_time: value.open_time,
          tag: value.tag.join(","),
          type: value.type,
          filePath: fileAddField(
            JSON.parse(JSON.stringify(value.images)),
            "imagePath"
          ),
        });
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 景点名字
    name: "",
    // 地址
    address: "",
    // 城市
    city: "",
    // 设备
    facilities: "",
    // 通知
    notification: "",
    // 开放时间
    open_time: "",
    // 标签
    tag: "",
    // 图片列表
    filePath: [],

    // 景点类型
    type: scenicSpotNavList[0].label,
    selectOptions: scenicSpotNavList.map((item) => item.label),

    removeFileIDList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变数据
    handleChange(e) {
      this.setData({
        [e.target.dataset.key]: e.detail,
      });
    },

    // 选择文件
    handleSelectFile(e) {
      const { filePath } = this.data;
      filePath.push(...e.detail);
      this.setData({
        filePath,
      });
    },
    // 删除文件
    handleRemoveFile(e) {
      const { index } = e.detail;
      const { filePath, removeFileIDList } = this.data;
      if (filePath[index].fileID) {
        removeFileIDList.push(filePath[index].fileID);
      }
      this.setData({
        filePath: filePath.filter((_, itemIndex) => itemIndex !== index),
        removeFileIDList,
      });
    },

    async handlePublish() {
      try {
        const isUpdate = this.properties.detail;
        const _id = isUpdate ? this.properties.detail._id : null;
        const {
          name,
          address,
          city,
          facilities,
          notification,
          open_time,
          tag,
          filePath,
          type,
          removeFileIDList,
        } = this.data;

        let error = "";
        if (!error && !name) error = "请输入景点名称";
        if (!error && !city) error = "请输入景点城市";
        if (!error && !address) error = "请输入景点地址";

        const newTag = tag ? tag.split(",") : [];
        const newFacilities = facilities ? facilities.split(",") : [];

        if (
          newTag.some((item) => item === "") ||
          newFacilities.some((item) => item === "")
        )
          error = "请以逗号进行分割,末尾禁止添加";

        if (error) {
          wx.showToast({
            title: error,
            icon: "none",
          });
          return;
        }

        wx.showLoading({
          title: isUpdate ? "修改中" : "发布中",
        });

        // 上传及删除
        const cloudFilePath = await uploadFile(
          uploadCloudPath,
          name.replace(/\s/g, ""),
          filePath
        );
        removeFileIDList.length > 0 &&
          wx.cloud.deleteFile({
            fileList: removeFileIDList,
          });

        // 定义参数
        const params = {
          name: "scenic-spot",
          data: {
            requestType: isUpdate ? "updateScenicSpot" : "addScenicSpot",
            _id,
            name,
            address,
            city,
            facilities: newFacilities,
            notification,
            open_time,
            tag: newTag,
            filePath: cloudFilePath,
            type,
          },
        };

        // 上传文件
        await wx.cloud.callFunction(params);

        wx.hideLoading();

        if (isUpdate) {
          this.triggerEvent("updated");

          wx.navigateBack({
            delta: 1,
          });

          wx.showToast({
            title: "修改成功!",
            icon: "success",
          });
        } else {
          wx.showToast({
            title: "发布成功!",
            icon: "success",
          });

          this.setData({
            name: "",
            address: "",
            city: "",
            facilities: "",
            notification: "",
            open_time: "",
            tag: "",
            filePath: [],
            type: scenicSpotNavList[0].label,
          });
        }
        // app.data.bus.emit("randomScenicSpotBannerList");
      } catch (error) {
        console.error(error);
      }
    },
  },
});
