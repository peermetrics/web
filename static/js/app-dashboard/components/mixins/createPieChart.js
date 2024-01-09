const createPieChart = {

  mounted() {
    //this will be added to the mounted of the component in which this mixin is called 
    if (this.chartId && this.dataSeries.series.length > 0)
      this.createPieChart();
  },
  data() {
    return {
      chart: null
    }
  },
  methods: {
    //this method will be added to the existing methods of the component in which this mixin is called
    createPieChart() {
      const { series, drilldown } = this.dataSeries

      // if chart exists, just update the data
      if (this.chart) {
        this.chart.update({
          series: [
            {
              name: this.seriesName ? this.seriesName : "",
              colorByPoint: true,
              data: series
            }
          ],
          drilldown: {
            series: drilldown
          }
        })
        return
      }

      this.chart = Highcharts.chart(this.chartId, {
        credits: false,
        chart: {
          type: "pie"
        },
        title: {
          text: this.titleText ? this.titleText : ""
        },
        subtitle: {
          text: this.subtitleText ? this.subtitleText : ""
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: "{point.name}: {point.y:.1f}%"
            }
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: this.pointFormat
        },
        series: [
          {
            name: this.seriesName ? this.seriesName : "",
            colorByPoint: true,
            data: series
          }
        ],
        drilldown: {
          series: drilldown
        }
      });
    },

    dataWatcher(val, prev) {
      // if we had no values previously, the div was removed from DOM
      // force recreate the chart by making chart = null
      if (prev.length === 0 && this.chart) {
        this.chart.destroy()
        this.chart = null
      }

      if (val.length) {
        this.$nextTick(this.createPieChart)
      } else if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },
  }
}

export default createPieChart;