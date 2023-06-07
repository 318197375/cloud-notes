import Cookies from 'js-cookie'
/**
 *
 * @params {Object} info
 */
export function setCookie (info) {
  const arr = Object.entries(info)
  for (let i = 0; i < arr.length; i += 1) {
    Cookies.set(arr[i][0], arr[i][1]) // key , value
  }
  return true
}

/**
 * 获取用户的cookie信息
 */

export function getUserCookie () {
  return {
    username: Cookies.get('username'),
    role: Cookies.get('role')
  }
}

/**
 * 移除cookie
 */
export function removeUserCookie () {
  Cookies.remove('username')
  Cookies.remove('role')
  Cookies.remove('token')
  return true
}
