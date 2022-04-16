import {
  getUserState
} from './utils'

function useUserState() {
  return {
    isLogin: false,
    defaultAvatar: "/images/user-avatar_default.png",
    userInfo: null
  }
}

function useUserMethods() {
  return {
    // 退出登录
    logout() {
      const {
        store,
        user
      } = getUserState()

      user.isLogin = false
      user.userInfo = null

      store.setState({
        user
      })
      wx.removeStorageSync('token')
      wx.removeStorageSync('token_type')
    },

    // 登录
    async login(fn) {
      wx.showLoading({
        title: '登录中...',
      })

      fn()
    },

    // 设置用户信息
    setUserInfo(
      userInfo, callback
    ) {
      const {
        store,
        user
      } = getUserState()
      user.isLogin = true
      user.userInfo = userInfo

      store.setState({
        user
      })

      callback && callback(user)
    },

    async getUserInfo() {
      const token = wx.getStorageSync('token')
      const token_type = wx.getStorageSync('token_type')

      if (!token && !token_type && (token_type !== 'wechat' | token_type !== 'admin')) throw Error("lack_token_token_type")

      const userResult = await wx.cloud.callFunction({
        name: "user",
        data: {
          requestType: token_type === 'wechat' ? "wechatGetUserInfo" : "adminGetAccountInfo",
          token
        }
      })
      if (typeof userResult.result === 'boolean' && !userResult.result) {
        return this.logout()
      }
      this.setUserInfo(userResult.result)
    }
  }
}

module.exports = {
  useUserState,
  useUserMethods
}