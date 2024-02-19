<template>
  <div class="chartjs-wrapper">
    <Pie :data="chartData" :options="chartOptions" :plugins="[pieLabelsLine]"/>
    <div v-if="Object.keys(drilldown).length" class="pie-header">
      <span class="hint">Click the slices to view versions</span>
    </div>
    <div v-if="selectedDrilldownName" class="pie-breadcrumbs">
      <span class="drilldown-link" @click="goBack">{{ tooltipTitle }}</span> / {{ selectedDrilldownName }}
    </div>
  </div>
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { getElementAtEvent, Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'App',
  components: {
    Pie
  },
  props: {
    labels: {
      type: Array,
      default: () => []
    },
    datasets: {
      type: Array,
      default: () => []
    },
    drilldown: {
      type: Array,
      default: () => []
    },
    tooltipTitle: {
      type: String,
      default: () => ''
    },
    padding: {
      type: Number,
      default: () => 50
    },
    paddingTop: {
      type: Number,
      default: () => undefined
    },
    paddingRight: {
      type: Number,
      default: () => undefined
    },
    paddingBottom: {
      type: Number,
      default: () => undefined
    },
    paddingLeft: {
      type: Number,
      default: () => undefined
    },
  },
  data() {
    return {
      selectedDrilldownName: '',
      drilldownChartData: {},
      pieLabelsLine: {
        id: "pieLabelsLine",
        afterDraw(chart) {
          const {
            ctx,
            chartArea: { width, height },
          } = chart;

          const cx = chart._metasets[0].data[0].x;
          const cy = chart._metasets[0].data[0].y;

          const sum = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

          chart.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
              const { x: a, y: b } = datapoint.tooltipPosition();

              const x = 2 * a - cx;
              const y = 2 * b - cy;

              // draw line
              const halfwidth = width / 2;
              const halfheight = height / 2;
              const xLine = x >= halfwidth ? x + 20 : x - 20;
              const yLine = y >= halfheight ? y + 20 : y - 20;

              const extraLine = x >= halfwidth ? 10 : -10;

              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
              ctx.fill();
              ctx.moveTo(x, y);
              ctx.lineTo(xLine, yLine);
              ctx.lineTo(xLine + extraLine, yLine);
              // ctx.strokeStyle = dataset.backgroundColor[index];
              ctx.strokeStyle = "black";
              ctx.stroke();

              // text
              ctx.font = "12px Arial";
              // control the position
              const textXPosition = x >= halfwidth ? "left" : "right";
              const plusFivePx = x >= halfwidth ? 5 : -5;
              ctx.textAlign = textXPosition;
              ctx.textBaseline = "middle";
              // ctx.fillStyle = dataset.backgroundColor[index];
              ctx.fillStyle = "black";

              ctx.fillText(
                  `${chart.data.labels[index]}: ${((chart.data.datasets[0].data[index] * 100) / sum).toFixed(2)}%`,
                  xLine + extraLine + plusFivePx,
                  yLine
              );
            });
          });
        },
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: this.paddingTop ?? this.padding,
            right: this.paddingRight ?? this.padding,
            bottom: this.paddingBottom ?? this.padding,
            left: this.paddingLeft ?? this.padding,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
            font: {
              weight: 'bold'
            },
          },
          tooltip: {
            callbacks: {
              title: () => {
                if (this.selectedDrilldownName) {
                  return this.selectedDrilldownName
                }

                return this.tooltipTitle || '';
              },
              label: function(context) {
                return `${context.label}: ${context.formattedValue}%` || '';
              },
              afterLabel: (context) => {
                if (!this.datasets?.[0].count) {
                  return null
                }

                return `Count: ${this.datasets?.[context.dataIndex].count}` || '';
              }
            }
          }
        },
        onHover: (event, chartElement) => {
          const isActive = this.drilldown.length && chartElement[0] && !this.selectedDrilldownName;
          event.native.target.style.cursor = isActive ? 'pointer' : 'default';
        },
        onClick: (e) => {
          if (!this.drilldown.length || Object.keys(this.drilldownChartData).length) {
            return;
          }

          const el = getElementAtEvent(e.chart, e.native)[0]

          if (!el) {
            return
          }

          const dataset = this.datasets[el.index]
          this.selectedDrilldownName = dataset.name

          const drillDownData = this.drilldown.find(d => d.name === dataset.name);

          this.drilldownChartData = {
            labels: drillDownData.data.map(d => d[0]),
            datasets: [
              {
                backgroundColor: ['rgb(124, 181, 236)', 'rgb(67, 67, 72)', 'rgb(144, 237, 125)', 'rgb(247, 163, 92)'],
                data: drillDownData.data.map(d => d[1])
              }
            ]
          }
        }
      }
    }
  },

  computed: {
    chartData() {
      if (Object.keys(this.drilldownChartData).length) {
        return this.drilldownChartData
      }

      return {
        labels: this.datasets.map(s => s.name),
        datasets: [
          {
            backgroundColor: ['rgb(124, 181, 236)', 'rgb(67, 67, 72)', 'rgb(144, 237, 125)', 'rgb(247, 163, 92)'],
            data: this.datasets.map(d => d.y)
          }
        ]
      }
    }
  },

  methods: {
    goBack() {
      this.drilldownChartData = {}
      this.selectedDrilldownName = ''
    }
  }
}
</script>

<style scoped>
.chartjs-wrapper {
  position: relative;
}

.pie-header {
  font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 100%;
  text-align: center;
  top: 6px;

  .hint {
    font-size: 12px;
    color: rgb(102, 102, 102)
  }
}

.pie-breadcrumbs {
  font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
  position: absolute;
  top: 0;
  padding-top: 2rem;
  padding-left: 1rem;
  font-size: 12px;
}

.drilldown-link {
  color: blue;
  cursor: pointer;
  padding: 4px 2px;
}

.drilldown-link:hover {
  background: rgb(230,230,230);
}
</style>