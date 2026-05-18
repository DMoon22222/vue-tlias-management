<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { queryPageApi,addApi,queryInfoApi,updateApi,deleteApi } from '@/api/emp'
import { queryAllApi as queryAllDeptApi } from '@/api/dept'
import{ElMessageBox} from 'element-plus'

//token
const token = ref('')
// 元数据
const jobs = ref([
  { name: '班主任', value: 1 },
  { name: '讲师', value: 2 },
  { name: '学工主管', value: 3 },
  { name: '教研主管', value: 4 },
  { name: '咨询师', value: 5 },
  { name: '其他', value: 6 }
])

const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 }
])

const depts = ref([])

// 搜索条件
const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: ''
})

// 员工列表与分页
const empList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

// 新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')
const avatarPreviewUrl = ref('')

// 监听日期范围，拆成 begin / end
watch(
  () => searchEmp.value.date,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length === 2) {
      searchEmp.value.begin = newVal[0]
      searchEmp.value.end = newVal[1]
    } else {
      searchEmp.value.begin = ''
      searchEmp.value.end = ''
    }
  }
)

// 查询员工列表
const search = async () => {
  try {
    const result = await queryPageApi(
    searchEmp.value.name,
    searchEmp.value.gender,
    searchEmp.value.begin,
    searchEmp.value.end,
    currentPage.value,
    pageSize.value
    )

    if (result.code) {
      empList.value = result.data.rows
      total.value = result.data.total
    } else {
      empList.value = []
      total.value = 0
      ElMessage.error(result.msg || '员工列表加载失败')
    }
  } catch (error) {
    empList.value = []
    total.value = 0
    ElMessage.error('员工列表加载失败')
  }
}

// 查询部门列表
const queryAllDepts = async () => {
  try {
    const result = await queryAllDeptApi()
    if (result.code) {
      depts.value = result.data
    } else {
      depts.value = []
      ElMessage.error(result.msg || '部门列表加载失败')
    }
  } catch (error) {
    depts.value = []
    ElMessage.error('部门列表加载失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  search()
}

const clear = () => {
  searchEmp.value = { name: '', gender: '', date: [], begin: '', end: '' }
  currentPage.value = 1
  search()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  search()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  search()
}

const resetEmployee = () => {
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }
  avatarPreviewUrl.value = ''
}

const addEmp = () => {
  resetEmployee()
  dialogVisible.value = true
  dialogTitle.value = '新增员工'
  //重置表单的校验规则-提示信息
  if (empFormRef.value) {
    empFormRef.value.resetFields();
  }
}

// 头像上传成功
const handleAvatarSuccess = (response, uploadFile) => {
  if (!response.code) {
    ElMessage.error(response.msg || '头像上传失败')
    return
  }

  employee.value.image = response.data
  if (uploadFile?.raw) {
    avatarPreviewUrl.value = URL.createObjectURL(uploadFile.raw)
  }
  ElMessage.success('头像上传成功')
}

// 头像上传失败
const handleAvatarError = () => {
  ElMessage.error('头像上传失败')
}

// 上传前校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传 JPG/PNG 图片')
    return false
  }

  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传 10MB 以内图片')
    return false
  }

  return true
}
//添加工作经历
const addExperItem=()=>{ 
  employee.value.exprList.push({ company: '', job: '', begin: '', end: '',exprDate:[] });
}
//删除工作经历
const delExprItem=(index)=>{
  employee.value.exprList.splice(index, 1);
}
//侦听-employee员工对象中的工作经历信息
watch(()=>employee.value.exprList, (newVal, oldVal) => {
  if(employee.value.exprList&&employee.value.exprList.length>0){
    employee.value.exprList.forEach((expr)=>{
      expr.begin=expr.exprDate[0];
      expr.end=expr.exprDate[1];
    })
  }
},{ deep: true })
//保存员工
const save=async ()=>{
  //表单校验
  if (!empFormRef.value) return

  const valid = await empFormRef.value.validate().catch(() => false)
  if (valid){//通过
    let result;
    if(employee.value.id){//修改
       result = await updateApi(employee.value);
    } else { //新增
       result = await addApi(employee.value);
    }
    if (result.code) {//成功
      ElMessage.success('保存成功')
      dialogVisible.value = false
        search()
      } else {//失败
        ElMessage.error(result.msg)
      }
  }else{//校验不通过
    ElMessage.error('表单校验不通过')
  }
}
//表单引用
const empFormRef = ref()
//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    //正则表达式：/……/：^:以……开始；$:以……结束；1[3-9]：第一位是1，第二位是3-9之间的任意数字；\d{9}：后面跟着9个数字
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
});
//编辑
const edit = async (id) => { 
  const result = await queryInfoApi(id);
  if (result.code) {
    dialogVisible.value = true
    dialogTitle.value = '修改员工'
    employee.value = result.data

    //对工作经历进行处理
    let exprList=employee.value.exprList;
    if(exprList&&exprList.length>0){
      employee.value.exprList.forEach((expr)=>{
        expr.exprDate=[expr.begin,expr.end];
      })
  }
}
}
//删除员工
const deleteById=(id)=>{
   //弹出确认框
    ElMessageBox.confirm('您确定要删除该员工吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const result = await deleteApi(id);
      if (result.code) {//确认
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    }).catch(() => {
      //取消删除
      ElMessage.info('已取消删除')
    })

}
//记录勾选员工的id
const selectedIds = ref([])
//复选框勾选发生变化时触发
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}
//批量删除
const deleteByIds = () => {
    //弹出确认框
    ElMessageBox.confirm('您确定要删除该员工吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if(selectedIds.value&&selectedIds.value.length>0){
      const result = await deleteApi(selectedIds.value);
      if (result.code) {//确认
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
      }else{
        ElMessage.info('你没有选择任何要删除的数据')
      }
    }).catch(() => {
      //取消删除
      ElMessage.info('已取消删除')
    })
}


onMounted(() => {
  getToken()
  search()
  queryAllDepts()
})
//获取token
const getToken=()=>{
  const loginUserStr = localStorage.getItem('loginUser')
  if (!loginUserStr) {
    token.value = ''
    return
  }
  try {
    const loginUser = JSON.parse(loginUserStr)
    token.value = loginUser?.token || ''
  } catch (error) {
    token.value = ''
  }
}
</script>

<template>
  <h1>员工管理</h1>

  <div class="container">
    <el-form :inline="true" :model="searchEmp">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="container">
    <el-button type="primary" @click="addEmp">+ 新增员工</el-button>
    <el-button type="danger" @click="deleteByIds">- 批量删除</el-button>
  </div>

  <div class="container">
    <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" width="120" align="center" />

      <el-table-column prop="gender" label="性别" width="120" align="center">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>

      <el-table-column prop="image" label="头像" width="120" align="center">
        <template #default="scope">
          <el-image :src="scope.row.image" height="40px" />
        </template>
      </el-table-column>

      <el-table-column prop="deptName" label="所属部门" width="120" align="center" />

      <el-table-column prop="job" label="职位" width="120" align="center">
        <template #default="scope">
          <span v-if="scope.row.job === 1">班主任</span>
          <span v-else-if="scope.row.job === 2">讲师</span>
          <span v-else-if="scope.row.job === 3">学工主管</span>
          <span v-else-if="scope.row.job === 4">教研主管</span>
          <span v-else-if="scope.row.job === 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>

      <el-table-column prop="entryDate" label="入职时间" width="180" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="edit(scope.row.id)">
          <el-icon><EditPen /></el-icon>编辑
        </el-button>
          <el-button size="small" type="danger" @click="deleteById(scope.row.id)">
          <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!--新增员工/修改员工的对话框-->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" :rules="rules" ref="empFormRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%">
              <el-option v-for="g in genders" :key="g.value" :label="g.name" :value="g.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%">
              <el-option v-for="j in jobs" :key="j.value" :label="j.name" :value="j.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%">
              <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="employee.entryDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :headers="{'token':token}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatarPreviewUrl || employee.image" :src="avatarPreviewUrl || employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="addExperItem">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="3" v-for="expr in employee.exprList">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker
              type="daterange"
              v-model="expr.exprDate"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input v-model="expr.company" placeholder="请输入公司名称" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位"  v-model="expr.job" />
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="delExprItem">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0;
}

.avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  border: 1px dashed var(--el-border-color);
}
</style>
