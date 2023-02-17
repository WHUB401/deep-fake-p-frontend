import request from '@/utils/request'

export function hasForgeryResult(filaName) {
  return request({
    url: '/forgeryDetection/hasResult',
    method: 'get',
    params: { filename: filaName }
  })
}

export function startforgery(filename) {
  return request({
    url: '/forgeryDetection/runforgery',
    method: 'post',
    params: { filename: filename }
  })
}

export function getAllForgeryResult(params) {
  return request({
    url: '/forgeryDetection/findAll',
    method: 'get',
    params
  })
}

export function deleteForgeryResult(filename) {
  return request({
    url: '/forgeryDetection/deleteResult',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function getForgeryResultPage(listQuery) {
  return request({
    url: '/forgeryDetection/listResultPage',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page - 1,
      sort: listQuery.sort,
      filename: listQuery.filename
    }
  })
}

export function getImagesResultTar() {
  return request({
    url: '/forgeryDetection/downloadImageResult',
    method: 'get'
  })
}

export function startDetectionAllImages() {
  return request({
    url: '/forgeryDetection/detectAllImages',
    method: 'post'
  })
}
