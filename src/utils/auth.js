import Cookies from 'js-cookie'
import { addURLParam } from '@/utils/index'
const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenHeader() {
  return { Authorization: getToken() }
}

export function AddToken(url) {
  return addURLParam(url, 'Authorization', getToken())
}

