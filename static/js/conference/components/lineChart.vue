<template>
  <div>
    <h3>{{ title }}</h3>
    <div class="chart-wrapper" v-if="data.length > 0">
      <div :id="`lineChart-${id}`" class="chart lineChart"></div>
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
<script>
export default {
  name: "HighChart",
  props: {
    title: {
      type: String,
      required: true,
    },
    yAxis: {
      type: String,
      default: "",
    },
    hideTooltip: {
      type: Boolean,
      default: false,
    },
    customTooltip: {
      type: Function,
      default: () => false,
    },
    data: {
      required: true,
      validator: (value) => {
        return Array.isArray(value) || peermetrics.utils.isNull(value);
      },
    },
  },
  mounted() {
    this.id = this._uid;

    // Wait to add div with id "minutes-per-day-chart" in DOM and after Highchart will render the chart
    setTimeout(() => {
      this.createChart();
    }, 0);
  },
  data() {
    return {
      id: null,
    };
  },
  methods: {
    createChart() {
      if (this.data.length > 0) {
        // create a new chart only if data exist
        const that = this;
        Highcharts.chart(`lineChart-${this.id}`, {
          credits: false,

          chart: {
            type: "line",
          },

          title: {
            text: null,
          },

          yAxis: {
            title: {
              text: this.yAxis,
            },
          },

          xAxis: {
            type: "datetime",
          },

          legend: {
            // layout: 'horizontal',
            align: "center",
            verticalAlign: "bottom",
          },

          series: this.data,

          tooltip: {
            enabled: !this.hideTooltip,
            formatter: function () {
              const time = Highcharts.dateFormat("%I:%M:%S %p", this.x);
              const seriesName = this.series.name;
              const color = this.point.color;
              const value = this.y;

              const html = !that.customTooltip()
                ? `<small>${time}</small><br/><p><span style="color:${color};">● </span> ${seriesName}: ${value}</p>`
                : that.customTooltip({ time, color, seriesName, value });
              return html;
            },
          },

          plotOptions: {
            series: {
              animation: false,
            },
          },
        });
      }
    },
  },
};
</script>
<style>
.chart > div {
  flex: auto !important;
}
</style>
