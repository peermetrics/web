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
  TimeScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Line as LineChart } from 'vue-chartjs'

import 'chartjs-adapter-moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
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
            // stacked: true,
            type: 'time',
            time: {
              displayFormats: {
                minute: 'hh:mm', // Display format for hour and minute
                hour: 'hh:mm' // Backup display format for hour and minute
              },
              unit: 'minute',
              unitStepSize: 1 // Display time every 15 minutes
            },
            grid: {
              display: false,
            }
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: this.externalTooltipHandler
          }
        }
      }
    }
  },
  methods: {
    getOrCreateTooltip(chart) {
      let tooltipEl = chart.canvas.parentNode.querySelector('div');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.margin = '0px';

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      return tooltipEl;
    },

    externalTooltipHandler(context) {
      // Tooltip Element
      const {chart, tooltip} = context;
      const tooltipEl = this.getOrCreateTooltip(chart);

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }

      // Set Text
      if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(b => b.lines);

        const tableHead = document.createElement('thead');

        titleLines.forEach(title => {
          const tr = document.createElement('tr');
          tr.style.borderWidth = 0;

          const th = document.createElement('th');
          th.style.borderWidth = 0;
          th.style.color = 'white';
          const text = document.createTextNode(title);

          th.appendChild(text);
          tr.appendChild(th);
          tableHead.appendChild(tr);
        });

        const tableBody = document.createElement('tbody');
        bodyLines.forEach((body, i) => {
          const colors = tooltip.labelColors[i];

          const span = document.createElement('span');
          span.style.background = colors.backgroundColor;
          span.style.borderColor = colors.borderColor;
          span.style.borderWidth = '2px';
          span.style.marginRight = '10px';
          span.style.height = '10px';
          span.style.width = '10px';
          span.style.display = 'inline-block';

          const tr = document.createElement('tr');
          tr.style.backgroundColor = 'inherit';
          tr.style.borderWidth = 0;

          const td = document.createElement('td');
          td.style.borderWidth = 0;

          const text = document.createTextNode(body);

          td.appendChild(span);
          td.appendChild(text);
          tr.appendChild(td);
          tableBody.appendChild(tr);
        });

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
          tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
      }

      const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY + 'px';
      tooltipEl.style.font = tooltip.options.bodyFont.string;
      tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    }
  },
  computed: {
    chartData() {
      return {
        datasets: this.data,
      }
    }
  },
}
</script>

<style scoped>
.chart-wrapper {
  background-color: white;
}
</style>
