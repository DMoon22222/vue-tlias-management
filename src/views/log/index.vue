<script setup>
import { onMounted, ref } from 'vue'
import { queryPageApi } from '@/api/log'

const tableData = ref([])

const pagination = ref({
  currentPage: 1,
  pageSize: 15,
  total: 0
})

const handleSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  queryPage()
}

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  queryPage()
}

const queryPage = async () => {
  const result = await queryPageApi(pagination.value.currentPage, pagination.value.pageSize)
  if (result.code) {
    tableData.value = result.data.rows
    pagination.value.total = result.data.total
  }
}

onMounted(() => {
  queryPage()
})
</script>

<template>
  <div>
    <div id="title">日志管理</div>
    <br />
  </div>

  <el-table :data="tableData" border style="width: 100%" fit size="small">
    <el-table-column prop="operateEmpName" label="操作人" align="center" width="100" />
    <el-table-column prop="operateTime" label="操作时间" align="center" width="180" />
    <el-table-column prop="className" label="类名" align="center" width="300" />
    <el-table-column prop="methodName" label="方法名" align="center" width="100" />
    <el-table-column prop="costTime" label="操作耗时(ms)" align="center" width="120" />
    <el-table-column prop="methodParams" label="请求参数" align="center" width="280">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto" popper-style="font-size:12px">
          <template #default>
            <div>参数: {{ scope.row.methodParams }}</div>
          </template>
          <template #reference>
            <el-tag v-if="!scope.row.methodParams || scope.row.methodParams.length <= 30">
              {{ scope.row.methodParams }}
            </el-tag>
            <el-tag v-else>
              {{ scope.row.methodParams.substring(0, 30) + '...' }}
            </el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="returnValue" label="返回值" align="center" />
  </el-table>
  <br />

  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped>
#title {
  font-size: 20px;
  font-weight: 600;
}
</style>
