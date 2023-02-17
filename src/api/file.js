import request from '@/utils/request'

export function uploadFile(path, data) {
  return request({
    url: path,
    method: 'post',
    data: data
  })
}

export function deleteFile(path, params) {
  return request({
    url: path,
    method: 'delete',
    params
  })
}

export function deleteAllImage() {
  return request({
    url: '/delete/allImage',
    method: 'delete'
  })
}

export function getFileLists(fileType) {
  return request({
    url: '/findAll',
    method: 'get',
    params: { fileType: fileType }
  })
}

export function getLog(mission) {
  return request({
    url: '/downloadFile/missionLog',
    method: 'get',
    params: { mission: mission }
  })
}
