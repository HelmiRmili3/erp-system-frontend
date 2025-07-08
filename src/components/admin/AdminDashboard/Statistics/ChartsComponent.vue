<template>
  <div class="flex bg-white rounded-lg p-4">
    <div class="flex flex-col justify-between w-full mx-auto p-4">
      <div class="chart-title">Daily sales</div>
      <div class="flex justify-center">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="w-full" />
      </div>
    </div>
    <div class="flex flex-col justify-between max-h-[250px] max-w-[250px] mx-auto p-4">
      <div class="chart-title">Total Incomes</div>
      <div class="flex justify-center">
        <Chart
          type="doughnut"
          :data="chartData"
          :plugins="[totalPlugin]"
          class="w-full md:w-[200px]"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { chartData, lineChartData } = defineProps(['chartData', 'lineChartData'])
onMounted(() => {
  setTimeout(() => {
    chartOptions.value = setChartOptions()
    lineChartOptions.value = setlineChartOptions()
  }, 1000)
})

const chartOptions = ref(null)
const totalPlugin = {
  id: 'totalPlugin',
  beforeDraw(chart) {
    const { width, height } = chart
    const ctx = chart.ctx
    const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0)

    ctx.save()
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${(total / 1000).toFixed(1)}K`, width / 2, height / 2.6) // Convert to "K" format
    ctx.restore()
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          cutout: '100%',
          color: textColor,
          font: {
            family: 'Poppins'
          }
        }
      }
    }
  }
}

const lineChartOptions = ref()
const setlineChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  return {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: '#f5f5f5'
        }
      }
    }
  }
}
</script>
<style lang="scss">
.chart-title {
  color: var(--Onyx-Black, #2a2a2a);

  /* Paragraph/Large/Meduim */
  font-family: 'Poppins';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>
