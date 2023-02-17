import request from '@/utils/request'

export function hasData(dataset, filename) {
  return request({
    url: '/adversarial/hasData',
    method: 'get',
    params: {
      dataset: dataset,
      filename: filename
    }
  })
}

export function getAdversarialResult(dataset, filename) {
  return request({
    url: '/adversarial/findResult',
    method: 'get',
    params: {
      dataset: dataset,
      filename: filename
    }
  })
}

export function getAllAdversarialLists() {
  return request({
    url: '/adversarial/listAllResult',
    method: 'get'
  })
}

export function getAdversarialPage(listQuery) {
  return request({
    url: '/adversarial/listResultPage',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page - 1,
      sort: listQuery.sort,
      dataset: listQuery.dataset,
      filename: listQuery.filename
    }
  })
}

export function deleteAdversarialResult(dataset, filename) {
  return request({
    url: '/adversarial/deleteResult',
    method: 'post',
    data: {
      dataset: dataset,
      filename: filename
    }
  })
}

export function getAdvPictureList(dataset, filename) {
  return request({
    url: '/adversarial/findAdvPictureList',
    method: 'get',
    params: {
      dataset: dataset,
      filename: filename
    }
  })
}

export function getAdvPicture(dataset, filename, picture) {
  return request({
    url: '/downloadFile/adversarial/advFile',
    method: 'get',
    data: {
      dataset: dataset,
      filename: filename,
      picture: picture
    }
  })
}

export function runAdversarialDetection(dataset, filename) {
  return request({
    url: '/adversarial/runDetection',
    method: 'post',
    data: {
      dataset: dataset,
      filename: filename
    }
  })
}
