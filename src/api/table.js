import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Video/findAll',
    method: 'get',
    params
  })
}
