import Cookies from 'js-cookie'

const TokenKey = 'token'
const IdNum = 'id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get(IdNum)
}

export function setId(id) {
  return Cookies.set(IdNum, id)
}

export function removeId() {
  return Cookies.remove(IdNum)
}
