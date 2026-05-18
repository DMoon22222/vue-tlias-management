<script setup>
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
//当前登录员工
const loginName=ref('')
const router=useRouter()
//钩子函数
onMounted(()=>{
 const loginUser = JSON.parse(localStorage.getItem('loginUser'));
 if(loginUser&&loginUser.name){
  loginName.value=loginUser.name
 }
})

//退出登录
const logout=()=>{
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {//确认
    ElMessage.success('退出登录成功');
    localStorage.removeItem('loginUser');
    //跳转到登录界面
    router.push('/login');
  }).catch(() => {//取消
    ElMessage.info('您已取消删除')
  })
}
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="title">Tlias 智能学习辅助系统</span>
        <span class="right-tool">
          <a href="javascript:void(0)"> 
            <el-icon><EditPen /></el-icon> 修改密码 
          </a>
          <span class="divider">|</span>
          <a href="javascript:void(0)"@click="logout"> 
            <el-icon><SwitchButton /></el-icon> 退出登录 【{{ loginName }}】
          </a>
        </span>
      </el-header>

      <el-container>
        <el-aside width="220px" class="aside">
          <el-menu router default-active="/index">
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>班级学员管理</span>
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>
                <span>班级管理</span>
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon><UserFilled /></el-icon>
                <span>学员管理</span>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>系统信息管理</span>
              </template>
              <el-menu-item index="/dept">
                <el-icon><HelpFilled /></el-icon>
                <span>部门管理</span>
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon><Avatar /></el-icon>
                <span>员工管理</span>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/stats">
              <template #title>
                <el-icon><Histogram /></el-icon>
                <span>数据统计管理</span>
              </template>
              <el-menu-item index="/report/emp">
                <el-icon><InfoFilled /></el-icon>
                <span>员工信息统计</span>
              </el-menu-item>
              <el-menu-item index="/report/stu">
                <el-icon><Share /></el-icon>
                <span>学员信息统计</span>
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><Document /></el-icon>
                <span>日志信息统计</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(to right, #00547d, #007fa4, #00aaa0, #00d072, #a8eb12);
}

.title {
  color: white;
  font-size: 32px;
  font-family: 'KaiTi', serif;
  line-height: 60px;
  font-weight: 700;
}

.right-tool {
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 60px;
}

.divider {
  color: white;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  border-right: 1px solid #ccc;
  min-height: calc(100vh - 60px);
}
</style>
