// components/dashboard/cate/cate.js

import {
  cateNavList
} from "../../../dict/index";
import {
  uploadFile
} from "../../../utils/index";

const uploadCloudPath = `travel-lingang/cate/images/`;
const app = getApp()
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
          open_time: value.open_time,
          tag: value.tag.join(","),
          type: value.type,
          filePath: fileAddField(
            JSON.parse(JSON.stringify(value.images)),
            "imagePath"
          ),
          cateList: JSON.parse(JSON.stringify(value.cate_list)).map((item) => {
            return {
              name: item.name,
              files: fileAddField(item.files, "imagePath"),
            };
          }),
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
    // 开放时间
    open_time: "",
    // 标签
    tag: "",
    // 图片列表
    filePath: [],
    // 招牌菜
    cateList: [],

    // 景点类型
    type: cateNavList[0].label,
    selectOptions: cateNavList.map((item) => item.label),

    removeFileIDList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变数据
    handleChange(e) {
      this.setData({
        [e.target.dataset.key]: e.detail
      });
    },
    // 选择文件
    handleSelectFile(e) {
      const {
        filePath,
        cateList
      } = this.data;

      const key = e.target.dataset.key;
      const index = key === "filePath" ? null : e.target.dataset.index;

      if (key === "filePath") {
        filePath.push(...e.detail);
        this.setData({
          filePath
        });
      } else if (key === "cateList") {
        cateList[index].files.push(...e.detail);
        this.setData({
          cateList
        });
      }
    },
    // 删除文件
    handleRemoveFile(e) {
      const {
        index: payLoadIndex
      } = e.detail;
      const {
        filePath,
        cateList,
        removeFileIDList
      } = this.data;

      const key = e.target.dataset.key;
      const index = key === "filePath" ? null : e.target.dataset.index;

      if (key === "filePath") {
        filePath[payLoadIndex].fileID &&
          removeFileIDList.push(filePath[payLoadIndex].fileID);

        this.setData({
          filePath: filePath.filter(
            (_, itemIndex) => itemIndex !== payLoadIndex
          ),
        });
      } else if (key === "cateList") {
        cateList[index].files[payLoadIndex].fileID &&
          removeFileIDList.push(cateList[index].files[payLoadIndex].fileID);

        this.setData({
          [`cateList[${index}].files`]: cateList[index].files.filter(
            (_, itemIndex) => itemIndex !== payLoadIndex
          ),
        });
      }

      this.setData({
        removeFileIDList,
      });
    },

    // 添加一条招牌表单
    handleAppendCateList(e) {
      const max = e.target.dataset.max;

      const cateList = this.data.cateList;
      if (cateList.length > max - 1) {
        wx.showToast({
          title: "最多可添加三个招牌菜",
          icon: "none",
        });
      } else {
        if (cateList.length === 0 || cateList[cateList.length - 1].name) {
          cateList.push({
            name: "",
            files: []
          });
        } else {
          wx.showToast({
            title: "请先将上一条添加完成",
            icon: "none",
          });
        }

        this.setData({
          cateList
        });
      }
    },

    handleChangeCateItem(e) {
      const value = e.detail;
      const index = e.target.dataset.index;
      const cateList = this.data.cateList;
      cateList[index].name = value;
      this.setData({
        cateList,
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
          open_time,
          tag,
          filePath,
          cateList,
          type,
          removeFileIDList,
        } = this.data;

        let error = "";
        if (!error && !name) error = "请输入美食名称";
        if (!error && !city) error = "请输入城市";
        if (!error && !address) error = "请输入地址";
        if (!cateList.every((item) => item.name)) error = "请检查招牌菜标题";

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
        const filePathList = await uploadFile(
          uploadCloudPath,
          name.replace(/\s/g, ""),
          filePath
        );

        const catePathList = await Promise.all(
          cateList.map(async (item) => {
            return {
              name: item.name,
              files: await uploadFile(
                uploadCloudPath,
                `${name.replace(/\s/g, "")}-招牌菜(cate_list)-${item.name}`,
                item.files
              ),
            };
          })
        );

        removeFileIDList.length > 0 &&
          wx.cloud.deleteFile({
            fileList: removeFileIDList
          });

        // 上传文件
        await wx.cloud.callFunction({
          name: "cate",
          data: {
            requestType: isUpdate ? "updateCate" : "addCate",
            _id,
            name,
            address,
            city,
            facilities: newFacilities,
            open_time,
            tag: newTag,
            filePath: filePathList,
            cate_list: catePathList,
            type,
          },
        });

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
            open_time: "",
            tag: "",
            filePath: [],
            cateList: [],
            type: cateNavList[0].label,
          });
        }
        app.data.bus.emit('randomCateBannerList')
      } catch (error) {
        console.error(error);
      }
    },
  },
});