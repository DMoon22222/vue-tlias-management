<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryEmpGenderDataApi, queryEmpJobDataApi } from '@/api/report'

onMounted(() => {
  loadJobChart()
  loadGenderChart()
})

const loadJobChart = async () => {
  const result = await queryEmpJobDataApi()
  if (!result.code) return

  const jobList = result.data?.jobList || []
  const dataList = result.data?.dataList || []
  initJobChart(jobList, dataList)
}

const loadGenderChart = async () => {
  const result = await queryEmpGenderDataApi()
  if (!result.code) return

  initGenderChart(result.data || [])
}

const initJobChart = (jobList, dataList) => {
  const chart = echarts.init(document.getElementById('container1'))
  chart.setOption({
    title: {
      text: '员工职位统计',
      textStyle: {
        fontSize: 20
      },
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {},
    xAxis: {
      data: jobList
    },
    yAxis: {},
    series: [
      {
        name: '人数',
        type: 'bar',
        data: dataList,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#ffbf61' },
            { offset: 1, color: '#dd5f85' }
          ])
        }
      }
    ]
  })
}

const initGenderChart = (genderDataList) => {
  const chart = echarts.init(document.getElementById('container2'))
  chart.setOption({
    title: {
      text: '员工性别统计',
      textStyle: {
        fontSize: 20
      },
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        name: '性别',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        top: '5%',
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: genderDataList
      }
    ]
  })
}
</script>

<template>
  <div class="report_container" id="container1"></div>
  <div class="report_container" id="container2"></div>
</template>

<style scoped>
.report_container {
  width: 49%;
  height: 90%;
  float: left;
  margin-left: 5px;
}

#container1 {
  border-right: 1px dashed #ccc;
}
</style>
