<template>
  <div class="chart-area">
    <LineChart
      v-if="chartData.datasets.length > 0"
      :data="chartData"
      :options="chartOptions"
      :style="myStyles"
    />
    <div v-else class="not-found">Sem dados para exibição do gráfico de Receitas x Despesas</div>
  </div>
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'RevenueExpensesChart',

  components: { LineChart },

  props: {
    monthlyRevenue: Array,
    monthlyExpenses: Array
  },

  data() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'gray',
              boxHeight: 15,
              boxWidth: 15,
              font: {
                size: '20px'
              }
            }
          },
          tooltip: {
            enabled: true,
            bodySpacing: 5,
            padding: 15,
            displayColors: false,
            titleFont: {
              size: 18
            },
            bodyFont: {
              size: 15
            }
          }
        }
      }
    }
  },

  computed: {
    myStyles() {
      return {
        height: `100%`,
        width: '85%',
        position: 'relative'
      }
    }
  },

  watch: {
    monthlyRevenue() {
      if (this.monthlyRevenue.length > 0 && this.monthlyExpenses.length > 0) {
        let monthlyRevenueLast12Months = this.$methods.filterLast12Months(this.monthlyRevenue)
        let monthlyExpensesLast12Months = this.$methods.filterLast12Months(this.monthlyExpenses)

        let labels = monthlyRevenueLast12Months.map((e) => e.month)
        let revenueData = monthlyRevenueLast12Months.map((e) => e.sum)
        let expensesData = monthlyExpensesLast12Months.map((e) => e.sum)

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Receita',
              backgroundColor: 'green',
              borderColor: 'rgba(64, 163, 79, 0.8)',
              pointRadius: 4,
              data: revenueData
            },
            {
              label: 'Despesas',
              backgroundColor: 'red',
              pointRadius: 4,
              borderColor: 'rgba(168, 59, 68, 0.8)',
              data: expensesData
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-area {
  width: 100%;
  height: 50%;
  min-height: 200px;
}

@media only screen and (max-width: 1000px) {
  .chart-area {
    height: fit-content;
    min-height: 400px;
  }
}
</style>