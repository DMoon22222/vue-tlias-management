import request from '@/utils/request'

// 分页条件查询学员
export const queryPageApi = (clazzId, degree, name, page, pageSize) =>
  request.get(`/students?clazzId=${clazzId}&degree=${degree}&name=${name}&page=${page}&pageSize=${pageSize}`)

// 新增学员
export const addApi = (stu) => request.post('/students', stu)

// 根据ID查询学员
export const queryInfoApi = (id) => request.get(`/students/${id}`)

// 修改学员
export const updateApi = (stu) => request.put('/students', stu)

// 删除学员
export const deleteApi = (ids) => request.delete(`/students/${ids}`)

// 违纪处理
export const handleViolationApi = (id, score) => request.put(`/students/violation/${id}/${score}`)
