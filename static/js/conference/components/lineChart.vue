<template>
  <div>
    <h3>{{ title }}</h3>
    <div class="chart-wrapper" v-if="data.length > 0">
      <LineChart :data="chartData" class="chart lineChart" :options="options" />
    </div>
    <div class="container" v-else>
      <div class="row justify-content-center">
        <div class="col-12 mx-0 px-0">
          <div class="card card-lg text-center">
            <div class="card-body">
              <p>There are not data for this graph</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js'
import {Line as LineChart} from 'vue-chartjs'
import 'chartjs-adapter-moment';

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
  name: 'App',
  components: {
    LineChart
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    padding: {
      type: Number,
      default: () => 20
    },
    yTitle: {
      type: String,
      default: ''
    },
    customTooltip: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            display: false
          },
          tooltip: this.customTooltip
        },
        layout: {
          padding: {
            top: this.paddingTop ?? this.padding,
            right: this.paddingRight ?? this.padding,
            bottom: this.paddingBottom ?? this.padding,
            left: this.paddingLeft ?? this.padding,
          },
        },
        scales: {
          x: {
            stacked: true,
            type: 'time',
            time: {
              unit: 'second',
              tooltipFormat: "hh:mm:ss A",
              displayFormats: {
                "second": "hh:mm:ss"
              }
            },
            ticks: {
              stepSize: 10
            },
            grid: {
              display: false,
            }
          },
          y: {
            ticks: {
              callback: function (value) {
                if (value >= 1000) {
                  return value / 1000 + "k";
                } else {
                  return value;
                }
              },
            },
            title: {
              display: this.yTitle.length,
              text: this.yTitle,
            },
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      const colors = [
        {
          backgroundColor: 'rgb(124, 181, 236)',
          borderColor: 'rgb(124, 181, 236)',
        },
        {
          backgroundColor: 'rgb(51, 51, 51)',
          borderColor: 'rgb(51, 51, 51)',
        }
      ]
      return {
        datasets: this.data.map((d, index) => {
          return {
            backgroundColor: colors[index]?.backgroundColor,
            borderColor: colors[index]?.backgroundColor,
            label: d.name,
            ...d
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  background-color: white;
}
</style>
