const jwt = require('jsonwebtoken')

const secretKey = 'Hello jsonwebtoken'

const tokenPrefix = "Bearer "
exports.tokenPrefix = tokenPrefix

// 生成一个token
function randomToken(userId, expirationTime = exports.setExpirationTime(2)) {
  return jwt.sign({
    userId,
    expirationTime
  }, secretKey)
}

// 设置过期时间
function setExpirationTime(day) {
  return Date.now() + 1000 * 60 * 60 * 24 * day
}

// 检测是否过期
function checkOverdue(token) {
  const curDateTime = Date.now()

  const {
    userId,
    expirationTime
  } = jwt.verify(token.substring(tokenPrefix.length), secretKey)

  let isOverdue = curDateTime > expirationTime

  return isOverdue ? isOverdue : userId
}

// 微信获取用户信息
async function getUserInfo(db, token) {
  const userId = checkOverdue(token)

  if (typeof userId === 'boolean') return false

  const userInfoResult = await db.collection('userInfo').where({
    userId
  }).get()
  return userInfoResult.data[0]
}
exports.randomToken = randomToken
exports.checkOverdue = checkOverdue
exports.setExpirationTime = setExpirationTime
exports.getUserInfo = getUserInfo