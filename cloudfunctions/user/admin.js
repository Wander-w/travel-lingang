const utils = require('./utils')

async function adminLogin(db, params) {
  const {
    account,
    password
  } = params

  // 为空校验 4到16位（字母，数字，下划线，减号）
  if (!account) throw ("账号不允许为空")
  if (!password) throw ("密码不允许为空")

  const accountRule = /^[a-zA-Z0-9_-]{4,16}$/
  const passwordRule = /^(\w|\.){6,20}$/
  if (!accountRule.test(account)) throw ("账号不合法：4到16位（字母，数字，下划线，减号)")
  if (!passwordRule.test(password)) throw ("密码不合法：6-20个字母、数字、下划线、点")

  const hasUserResult = await db.collection('account').where({
    account,
  }).get()

  // check account
  if (!hasUserResult.data.length)
    throw ('该账号不存在')

  const userResult = await db.collection('account').where({
    account,
    password
  }).get()

  // check 密码
  if (!userResult.data.length) throw ('密码不正确')

  // 验证成功 派发Token
  const token = utils.randomToken(userResult.data[0]._id)

  return {
    token
  }
}

async function adminGetAccountInfo(db, params) {
  return utils.getUserInfo(db, params.token)
}

exports.adminLogin = adminLogin
exports.adminGetAccountInfo = adminGetAccountInfo