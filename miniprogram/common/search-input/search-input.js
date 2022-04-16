// common/search-input/search-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: "Please Input"
    },
    value: {
      type: String,
      value: ""
    },
    autocomplete: {
      type: Array,
      value: () => []
    },
    readonly: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAutocomplete: false,
    focus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      if (this.data.autocomplete.length) this.setData({
        isShowAutocomplete: true
      })
    },
    handleInput(e) {
      this.triggerEvent('input', e.detail)
      this.handleTap()
    },
    handleBlur() {
      if (this.data.isShowAutocomplete) this.setData({
        isShowAutocomplete: false
      })
    },
    handleClickItem(e) {
      const keyword = e.target.dataset.keyword
      this.triggerEvent('clickAutocomplete', keyword)
      this.handleBlur()
    },
    handleSearch() {
      this.triggerEvent('search', this.properties.value)
    }
  },
})