<template>
  <Pie :data="chartData" :options="chartOptions" :plugins="[pieLabelsLine]"/>
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

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
    count: {
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
  },
  data() {
    return {
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
          padding: this.padding,
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
                return this.tooltipTitle || '';
              },
              label: function(context) {
                return `${context.label}: ${context.formattedValue}%` || '';
              },
              afterLabel: (context) => {
                return `Count: ${this.count[context.dataIndex]}` || '';
              }
            }
          }
        },
      }
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: ['rgb(124, 181, 236)', 'rgb(67, 67, 72)', 'rgb(144, 237, 125)', 'rgb(247, 163, 92)'],
            data: this.datasets
          }
        ]
      }

    }
  }
}
</script>
