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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
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
            grid: {
              display: false,
            }
          },
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
  },
  mounted() {
    console.log(this.data)
  }
}
</script>

<style scoped>
.chart-wrapper {
  background-color: white;
}
</style>
