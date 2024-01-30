<template>
  <Bar
      :id="$attrs.id"
      :options="chartOptions"
      :data="chartData"
  />
</template>

<script>
import { Bar, getElementAtEvent } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

export default {
  name: 'BarChart',
  components: { Bar },
  emits: ['chart-click'],
  props: {
    yTitle: {
      type: String,
      default: ''
    },
    labels: {
      type: Array,
      default: () => []
    },
    datasets: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: this.datasets
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            color: 'black',
            display: function(context) {
              return context.dataset.data[context.dataIndex] > 0;
            },
            font: {
              weight: 'bold'
            },
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            }
          },
          y: {
            stacked: true,
            suggestedMax: Math.ceil(Math.max(...this.datasets.flatMap(obj => obj.data)) / 10) * 10,
            title: {
              display: true,
              text: this.yTitle,
            }
          }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        onClick: (e) => {
          const el = getElementAtEvent(e.chart, e.native)[0]
          const element = el?.element

          if (!element) {
            return
          }

          const value = element.$context.raw
          const dataset = this.datasets[el.datasetIndex]

          this.$emit('chart-click', {
            xValue: this.labels[el.index],
            yValue: value,
            label: dataset.label,
            index: el.index
          })
        }
      }
    }
  }
}
</script>