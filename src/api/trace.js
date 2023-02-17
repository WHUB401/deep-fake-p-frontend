import request from '@/utils/request'

export function hasTraceResult(filaname) {
  return request({
    url: '/trace/hasResult',
    method: 'get',
    params: { filename: filaname }
  })
}

export function findTraceResult(filaname) {
  return request({
    url: '/trace/findResult',
    method: 'get',
    params: { filename: filaname }
  })
}

export function startTrace(filename) {
  return request({
    url: '/trace/detection',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function deleteTraceResult(filename) {
  return request({
    url: '/trace/deleteResult',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function getTraceResultPage(listQuery) {
  return request({
    url: '/trace/listResultPage',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page - 1,
      sort: listQuery.sort,
      filename: listQuery.filename
    }
  })
}
