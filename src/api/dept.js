import request from '@/utils/request'

// 查询全部部门数据
export const queryAllApi = () => {
  return request.get('/depts')
}

// 新增部门
export const addApi = (data) => {
  return request.post('/depts', data)
}

// 根据 id 查询部门
export const queryByIdApi = (id) => {
  return request.get(`/depts/${id}`)
}

// 修改部门
export const updateApi = (data) => {
  return request.put('/depts', data)
}

// 删除部门
export const deleteByIdApi = (id) => {
  return request.delete(`/depts/${id}`)
}
