const createColumnChart = {
  mounted() {
    //this will be added to the mounted of the component in which this mixin is called 
    if (this.chartId && (this.seriesData.length > 0 || Object.entries(this.seriesData).length > 0))
      this.createColumnChart();
  },

  data() {
    return {
      type: 'column',
      chart: null
    }
  },

  methods: {
    // this method will be added to the existing methods of the component in which this mixin is called
    createColumnChart() {
      // if chart exists, just update the data
      if (this.chart) {
        this.chart.update({
          series: this.series
        })
        return
      }

      // add the option for components to overwride some of the options
      const chartOptions = {
        credits: false,
        chart: {
          type: this.type
        },
        title: this.titleText ?? "",
        xAxis: {
          categories: this.categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: this.titleYAxis ?? "",
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
            }
          }
        },
        colors: this.colors ?? [],

        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            stacking: 'normal',
          }
        },
        series: this.series,

        // add extra options from component
        ...this.chartOptions ?? {},
      }

      this.chart = Highcharts.chart(this.chartId, chartOptions)
    },

    dataWatcher(val, prev) {
      // if we had no values previously, the div was removed from DOM
      // force recreate the chart by making chart = null
      if (prev.length === 0) {
        this.chart = null
      }

      if (val.length) {
        this.$nextTick(this.createColumnChart)
      } else if (this.chart) {
        this.chart.destroy()
      }
    },
  }
}

export default createColumnChart;