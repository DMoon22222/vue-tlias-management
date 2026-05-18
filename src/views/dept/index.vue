<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept'

// 列表数据
const deptList = ref([])

// 对话框状态
const showDialog = ref(false)
const formTitle = ref('')

// 表单数据与校验
const deptForm = ref({ id: undefined, name: '' })
const deptFormRef = ref(null)
const formRules = {
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
}

// 查询部门列表
const queryAll = async () => {
  const result = await queryAllApi()
  deptList.value = result.data
}

onMounted(() => {
  queryAll()
})

// 编辑部门
const edit = async (id) => {
  formTitle.value = '编辑部门'
  const result = await queryByIdApi(id)
  if (result.code) {
    deptForm.value = result.data
    showDialog.value = true
    return
  }

  ElMessage.error(result.msg || '查询部门失败')
}

// 删除部门
const deleteById = async (id) => {
  try {
    await ElMessageBox.confirm('您确认删除该部门吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const result = await deleteByIdApi(id)
    if (result.code) {
      ElMessage.success('删除成功')
      await queryAll()
      return
    }

    ElMessage.error(result.msg || '删除失败')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除')
      return
    }
    ElMessage.error('删除失败')
    console.error(error)
  }
}

// 打开新增弹窗
const add = () => {
  formTitle.value = '新增部门'
  deptForm.value = { id: undefined, name: '' }
  showDialog.value = true
  //重置表单的校验规则-提示信息
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
}

// 重置表单
const resetForm = () => {
  deptFormRef.value?.resetFields()
}

// 提交表单
const save = async () => {
  if (!deptFormRef.value) return

  const valid = await deptFormRef.value.validate().catch(() => false)
  if (!valid) {
    ElMessage.error('表单校验不通过')
    return
  }

  const api = deptForm.value.id ? updateApi : addApi
  const result = await api(deptForm.value)

  if (result.code) {
    ElMessage.success('操作成功')
    showDialog.value = false
    resetForm()
    await queryAll()
  } else {
    ElMessage.error(result.msg || '操作失败')
  }
}
</script>

<template>
  <h1>部门管理</h1>

  <div class="toolbar">
    <el-button type="primary" @click="add">+ 新增部门</el-button>
  </div>

  <el-table :data="deptList" border style="width: 100%">
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="300" align="center" />
    <el-table-column prop="updateTime" label="最后修改时间" width="300" align="center" />
    <el-table-column fixed="right" label="操作" align="center">
      <template #default="scope">
        <el-button size="small" @click="edit(scope.row.id)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="showDialog" :title="formTitle" width="30%" @close="resetForm">
    <el-form ref="deptFormRef" :model="deptForm" :rules="formRules">
      <el-form-item label="部门名称" prop="name" label-width="80px">
        <el-input v-model="deptForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
