import axios from 'axios'
import Router from '@/router/index'

const instance = axios.create({
  // baseURL: window.serverConfig.VUE_APP_HOST_URL
  baseURL: 'http://39.106.94.103:9999/'
})

instance.interceptors.request.use((config) => {

  const isLoginOrRegister = config.url.includes("/login") || config.url.includes("/register")

  if(!isLoginOrRegister && localStorage.getItem('token')) {
    config.headers['token'] = localStorage.getItem('token')
  }

  return config
}, (error) => Promise.reject(error))

instance.interceptors.response.use((response) => {

  if (!window.localStorage.getItem('token') && response.data.data != null) {
    window.localStorage.setItem('token', response.data.data.token)
  }

  if (response.status != 200) {
    return Promise.reject(response.data)
  }

  if(response.data.code != '200') {

    if (/^7\d{2}$/.test(response.data.code)) {
      window.localStorage.removeItem('token');
      Router.push({
        path: '/Login',
      });
      throw new Error('Token已过期或无法解析! 请重新登录。');

    } else {
      return Promise.reject(response.data)

    }
  }

  return response.data

}, (error) => Promise.reject(error))

export default instance
