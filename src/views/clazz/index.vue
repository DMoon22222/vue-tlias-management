<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addApi, deleteApi, queryInfoApi, queryPageApi, updateApi } from '@/api/clazz'
import { queryAllApi as queryAllEmpApi } from '@/api/emp'

const subjects = ref([
  { name: 'Java', value: 1 },
  { name: '前端', value: 2 },
  { name: '大数据', value: 3 },
  { name: 'Python', value: 4 },
  { name: 'Go', value: 5 },
  { name: '嵌入式', value: 6 }
])

const searchClazz = ref({
  name: '',
  date: [],
  begin: '',
  end: ''
})

const tableData = ref([])
const emps = ref([])
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const dialogFormVisible = ref(false)
const formTitle = ref('新增班级')
const labelWidth = ref(90)
const clazzFormRef = ref()

const clazz = ref({
  id: '',
  name: '',
  room: '',
  beginDate: '',
  endDate: '',
  masterId: '',
  subject: ''
})

const rules = ref({
  name: [
    { required: true, message: '班级名称为必填项', trigger: 'blur' },
    { min: 4, max: 30, message: '班级名称长度应为4-30个字符', trigger: 'blur' }
  ],
  room: [
    { min: 1, max: 20, message: '班级教室长度应为1-20个字符', trigger: 'blur' }
  ],
  beginDate: [
    { required: true, message: '开课时间为必填项', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '结课时间为必填项', trigger: 'change' }
  ],
  subject: [
    { required: true, message: '学科为必填项', trigger: 'change' }
  ]
})

const clearClazz = () => {
  clazz.value = {
    id: '',
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    masterId: '',
    subject: ''
  }
}

const resetForm = () => {
  clazzFormRef.value?.resetFields()
}

const queryAllEmp = async () => {
  const result = await queryAllEmpApi()
  if (result.code) {
    emps.value = result.data
  } else {
    ElMessage.error(result.msg || '加载班主任数据失败')
  }
}

const queryPage = async () => {
  const result = await queryPageApi(
    searchClazz.value.begin,
    searchClazz.value.end,
    searchClazz.value.name,
    pagination.value.currentPage,
    pagination.value.pageSize
  )

  if (result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  } else {
    ElMessage.error(result.msg || '加载班级数据失败')
  }
}

const handleSearch = () => {
  pagination.value.currentPage = 1
  queryPage()
}

const clear = () => {
  searchClazz.value = {
    name: '',
    date: [],
    begin: '',
    end: ''
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

watch(
  () => searchClazz.value.date,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length === 2) {
      searchClazz.value.begin = newVal[0]
      searchClazz.value.end = newVal[1]
    } else {
      searchClazz.value.begin = ''
      searchClazz.value.end = ''
    }
  }
)

const addClazz = async () => {
  formTitle.value = '新增班级'
  clearClazz()
  dialogFormVisible.value = true
  await nextTick()
  resetForm()
}

const updateClazz = async (id) => {
  const result = await queryInfoApi(id)
  if (!result.code) {
    ElMessage.error(result.msg || '查询班级信息失败')
    return
  }

  formTitle.value = '修改班级'
  dialogFormVisible.value = true
  clazz.value = result.data
  await nextTick()
  clazzFormRef.value?.clearValidate()
}

const save = async () => {
  if (!clazzFormRef.value) return

  const valid = await clazzFormRef.value.validate().catch(() => false)
  if (!valid) return

  const result = clazz.value.id
    ? await updateApi(clazz.value)
    : await addApi(clazz.value)

  if (result.code) {
    ElMessage.success('操作成功')
    dialogFormVisible.value = false
    queryPage()
  } else {
    ElMessage.error(result.msg || '保存失败')
  }
}

const delById = (id) => {
  ElMessageBox.confirm('您确认删除此班级吗？', '删除班级', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await deleteApi(id)
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

onMounted(() => {
  queryPage()
  queryAllEmp()
})
</script>

<template>
  <div id="title">班级管理</div>
  <br />

  <el-form :inline="true" :model="searchClazz">
    <el-form-item label="班级名称">
      <el-input v-model="searchClazz.name" placeholder="请输入班级名称" />
    </el-form-item>

    <el-form-item label="结课时间">
      <el-date-picker
        v-model="searchClazz.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>

  <el-button type="success" @click="addClazz">+ 新增班级</el-button>
  <br />
  <br />

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column prop="name" label="班级名称" align="center" width="180" />
    <el-table-column prop="room" label="班级教室" align="center" width="120" />
    <el-table-column prop="masterName" label="班主任" align="center" width="120" />
    <el-table-column prop="beginDate" label="开课时间" align="center" width="140" />
    <el-table-column prop="endDate" label="结课时间" align="center" width="140" />
    <el-table-column prop="status" label="状态" align="center" width="120" />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" />
    <el-table-column label="操作" align="center" width="180">
      <template #default="scope">
        <el-button type="primary" size="small" @click="updateClazz(scope.row.id)">编辑</el-button>
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

  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="35%" @close="resetForm">
    <el-form ref="clazzFormRef" :model="clazz" :rules="rules">
      <el-form-item label="班级名称" :label-width="labelWidth" prop="name">
        <el-input v-model="clazz.name" placeholder="请输入班级名称" />
      </el-form-item>

      <el-form-item label="班级教室" :label-width="labelWidth" prop="room">
        <el-input v-model="clazz.room" placeholder="请输入班级教室" />
      </el-form-item>

      <el-form-item label="开课时间" :label-width="labelWidth" prop="beginDate">
        <el-date-picker
          v-model="clazz.beginDate"
          type="date"
          placeholder="请选择开课时间"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="结课时间" :label-width="labelWidth" prop="endDate">
        <el-date-picker
          v-model="clazz.endDate"
          type="date"
          placeholder="请选择结课时间"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="班主任" :label-width="labelWidth">
        <el-select v-model="clazz.masterId" placeholder="请选择班主任" style="width: 100%">
          <el-option v-for="emp in emps" :key="emp.id" :label="emp.name" :value="emp.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="学科" :label-width="labelWidth" prop="subject">
        <el-select v-model="clazz.subject" placeholder="请选择学科" style="width: 100%">
          <el-option v-for="subject in subjects" :key="subject.value" :label="subject.name" :value="subject.value" />
        </el-select>
      </el-form-item>
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
