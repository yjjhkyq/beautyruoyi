import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/system/account/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/system/account/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return new Promise(function(resolve) {
    resolve({ code: 0, data: {
      roles: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }})
  })
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
}

