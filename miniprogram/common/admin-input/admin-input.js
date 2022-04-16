// common/admin-input/admin-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: String,

    type: {
      type: String,
      value: "input",
    },

    value: String,
  },

  observers: {
    value(v) {
      if (v) this.setData({ isValid: true });
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 仿伪类
    isValid: false, // :valid  <input required />
    isFoucs: false, // :foucs
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFoucs() {
      this.setData({ isFoucs: true, isValid: !!this.properties.value });
    },
    handleBlur() {
      this.setData({ isFoucs: false, isValid: !!this.properties.value });
    },
    handleInput(e) {
      const value = e.detail.value;
      this.triggerEvent("change", value);
    },
  },
});
