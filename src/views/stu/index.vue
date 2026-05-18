<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addApi, deleteApi, handleViolationApi, queryInfoApi, queryPageApi, updateApi } from '@/api/stu'
import { queryAllApi as queryAllClazzApi } from '@/api/clazz'

const degrees = ref([
  { name: '初中', value: 1 },
  { name: '高中', value: 2 },
  { name: '大专', value: 3 },
  { name: '本科', value: 4 },
  { name: '硕士', value: 5 },
  { name: '博士', value: 6 }
])

const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }
])

const whethers = ref([
  { name: '是', value: 1 },
  { name: '否', value: 0 }
])

const searchStu = ref({
  clazzId: '',
  degree: '',
  name: ''
})

const tableData = ref([])
const clazzs = ref([])
const selectedIds = ref([])
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const dialogFormVisible = ref(false)
const formTitle = ref('新增学员')
const labelWidth = ref(100)
const stuFormRef = ref()

const stu = ref({
  id: '',
  name: '',
  no: '',
  gender: '',
  phone: '',
  idCard: '',
  isCollege: '',
  address: '',
  degree: '',
  graduationDate: '',
  clazzId: ''
})

const rules = ref({
  name: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应为2-10个字符', trigger: 'blur' }
  ],
  no: [
    { required: true, message: '学号为必填项', trigger: 'blur' },
    { len: 10, message: '学号长度应为10个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '性别为必填项', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '手机号为必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入合法的手机号', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '身份证号为必填项', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '请输入合法的身份证号', trigger: 'blur' }
  ],
  isCollege: [
    { required: true, message: '是否院校学员为必填项', trigger: 'change' }
  ]
})

const clearStu = () => {
  stu.value = {
    id: '',
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: ''
  }
}

const resetForm = () => {
  stuFormRef.value?.resetFields()
}

const queryAllClazz = async () => {
  const result = await queryAllClazzApi()
  if (result.code) {
    clazzs.value = result.data
  } else {
    ElMessage.error(result.msg || '加载班级数据失败')
  }
}

const queryPage = async () => {
  const result = await queryPageApi(
    searchStu.value.clazzId,
    searchStu.value.degree,
    searchStu.value.name,
    pagination.value.currentPage,
    pagination.value.pageSize
  )

  if (result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  } else {
    ElMessage.error(result.msg || '加载学员数据失败')
  }
}

const handleSearch = () => {
  pagination.value.currentPage = 1
  queryPage()
}

const clear = () => {
  searchStu.value = {
    clazzId: '',
    degree: '',
    name: ''
  }
  pagination.value.currentPage = 1
  queryPage()
}

const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.currentPage = 1
  queryPage()
}

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const addStu = async () => {
  formTitle.value = '新增学员'
  clearStu()
  dialogFormVisible.value = true
  await nextTick()
  resetForm()
}

const updateStu = async (id) => {
  const result = await queryInfoApi(id)
  if (!result.code) {
    ElMessage.error(result.msg || '查询学员信息失败')
    return
  }

  formTitle.value = '修改学员'
  dialogFormVisible.value = true
  stu.value = result.data
  await nextTick()
  stuFormRef.value?.clearValidate()
}

const save = async () => {
  if (!stuFormRef.value) return

  const valid = await stuFormRef.value.validate().catch(() => false)
  if (!valid) return

  const result = stu.value.id
    ? await updateApi(stu.value)
    : await addApi(stu.value)

  if (result.code) {
    ElMessage.success('操作成功')
    dialogFormVisible.value = false
    queryPage()
  } else {
    ElMessage.error(result.msg || '保存失败')
  }
}

const delById = (id) => {
  ElMessageBox.confirm('您确认删除此学员吗？', '删除学员', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await deleteApi(`${id}`)
    if (result.code) {
      ElMessage.success('删除成功')
      queryPage()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const delByIds = () => {
  if (!selectedIds.value.length) {
    ElMessage.info('请先选择要删除的学员')
    return
  }

  ElMessageBox.confirm('您确认删除选中的学员吗？', '删除学员', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await deleteApi(selectedIds.value.join(','))
    if (result.code) {
      ElMessage.success('删除成功')
      queryPage()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const openViolation = (id) => {
  ElMessageBox.prompt('请输入违纪扣分', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^\d+$/,
    inputErrorMessage: '请输入合法的分值'
  }).then(async ({ value }) => {
    const result = await handleViolationApi(id, value)
    if (result.code) {
      ElMessage.success('处理成功')
      queryPage()
    } else {
      ElMessage.error(result.msg || '处理失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  queryPage()
  queryAllClazz()
})
</script>

<template>
  <div id="title">学员管理</div>
  <br />

  <el-form :inline="true" :model="searchStu">
    <el-form-item label="姓名">
      <el-input v-model="searchStu.name" placeholder="请输入学员姓名" />
    </el-form-item>

    <el-form-item label="最高学历">
      <el-select v-model="searchStu.degree" placeholder="请选择" clearable>
        <el-option v-for="degree in degrees" :key="degree.value" :label="degree.name" :value="degree.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="所属班级">
      <el-select v-model="searchStu.clazzId" placeholder="请选择" clearable>
        <el-option v-for="clazz in clazzs" :key="clazz.id" :label="clazz.name" :value="clazz.id" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>

  <el-button type="success" @click="addStu">+ 新增学员</el-button>
  <el-button type="danger" @click="delByIds">- 批量删除</el-button>
  <br />
  <br />

  <el-table :data="tableData" border style="width: 100%" fit @selection-change="handleSelectionChange">
    <el-table-column type="selection" align="center" width="45" />
    <el-table-column prop="name" label="姓名" align="center" width="100" />
    <el-table-column prop="no" label="学号" align="center" width="140" />
    <el-table-column prop="clazzName" label="班级" align="center" width="180" />
    <el-table-column prop="gender" label="性别" align="center" width="70">
      <template #default="scope">
        {{ scope.row.gender === 1 ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="手机号" align="center" width="140" />
    <el-table-column prop="degree" label="最高学历" align="center" width="100">
      <template #default="scope">
        <span v-if="scope.row.degree === 1">初中</span>
        <span v-else-if="scope.row.degree === 2">高中</span>
        <span v-else-if="scope.row.degree === 3">大专</span>
        <span v-else-if="scope.row.degree === 4">本科</span>
        <span v-else-if="scope.row.degree === 5">硕士</span>
        <span v-else-if="scope.row.degree === 6">博士</span>
        <span v-else>其他</span>
      </template>
    </el-table-column>
    <el-table-column prop="violationCount" label="违纪次数" align="center" width="90" />
    <el-table-column prop="violationScore" label="违纪扣分" align="center" width="90" />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" width="180" />
    <el-table-column label="操作" align="center" width="230">
      <template #default="scope">
        <el-button type="primary" size="small" @click="updateStu(scope.row.id)">编辑</el-button>
        <el-button type="warning" size="small" @click="openViolation(scope.row.id)">违纪</el-button>
        <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <br />

  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :page-sizes="[5, 10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="50%" @close="resetForm">
    <el-form ref="stuFormRef" :model="stu" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="labelWidth" prop="name">
            <el-input v-model="stu.name" placeholder="请输入学员姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" :label-width="labelWidth" prop="no">
            <el-input v-model="stu.no" placeholder="请输入学员学号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" :label-width="labelWidth" prop="gender">
            <el-select v-model="stu.gender" placeholder="请选择" style="width: 100%">
              <el-option v-for="gender in genders" :key="gender.value" :label="gender.name" :value="gender.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" :label-width="labelWidth" prop="phone">
            <el-input v-model="stu.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号" :label-width="labelWidth" prop="idCard">
            <el-input v-model="stu.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否院校" :label-width="labelWidth" prop="isCollege">
            <el-select v-model="stu.isCollege" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in whethers" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="联系地址" :label-width="labelWidth">
            <el-input v-model="stu.address" placeholder="请输入联系地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" :label-width="labelWidth">
            <el-select v-model="stu.degree" placeholder="请选择" style="width: 100%">
              <el-option v-for="degree in degrees" :key="degree.value" :label="degree.name" :value="degree.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="毕业时间" :label-width="labelWidth">
            <el-date-picker
              v-model="stu.graduationDate"
              type="date"
              placeholder="请选择毕业时间"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级" :label-width="labelWidth">
            <el-select v-model="stu.clazzId" placeholder="请选择" style="width: 100%">
              <el-option v-for="clazz in clazzs" :key="clazz.id" :label="clazz.name" :value="clazz.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>
