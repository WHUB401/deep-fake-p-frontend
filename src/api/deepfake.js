import request from '@/utils/request'

export function getDeepfakeResult(params) {
  return request({
    url: '/dfDetection/findAll',
    method: 'get',
    params
  })
}

export function getMediaResult(params) {
  return request({
    url: '/dfDetection/mediaResult',
    method: 'get',
    params
  })
}

export function getImageResult() {
  return request({
    url: '/dfDetection/downloadImageResult',
    method: 'get'
  })
}

export function startDetection(filename) {
  return request({
    url: '/dfDetection/runDetection',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function startDetectionImage() {
  return request({
    url: '/dfDetection/DetectionImage',
    method: 'post'
  })
}

export function deleteDetectionResult(filename) {
  return request({
    url: '/dfDetection/deleteResult',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function getDeepfakeResultPage(listQuery) {
  return request({
    url: '/dfDetection/listResultPage',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page - 1,
      sort: listQuery.sort,
      filename: listQuery.filename
    }
  })
}
