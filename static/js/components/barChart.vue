<template>
  <Bar
      ref="bar"
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
    xTitle: {
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
    },
    horizontal: {
      type: Boolean,
      default: () => false
    },
    xGrid: {
      type: Boolean,
      default: () => false
    },
    yGrid: {
      type: Boolean,
      default: () => false
    },
    datalabels: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      chartOptions: {
        indexAxis: this.horizontal ? 'y' : 'x',
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            color: 'black',
            display: (context) => {
              return this.datalabels && context.dataset.data[context.dataIndex] > 0;
            },
            font: {
              weight: 'bold'
            },
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: this.xTitle.length,
              text: this.xTitle,
            },
            grid: {
              display: this.yGrid,
            }
          },
          y: {
            stacked: true,
            suggestedMax: Math.ceil(Math.max(...this.datasets.flatMap(obj => obj.data)) / 10) * 10,
            title: {
              display: this.yTitle.length,
              text: this.yTitle,
            },
            grid: {
              display: this.xGrid,
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
  },

  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },
  }
}
</script>