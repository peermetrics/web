<template>
  <div>
    <div class="row">
      <div class="col-12 col-sm">
        <h3 class="mb-2 mt-2">
          Connected devices
        </h3>
        <p>
          This is a top {{ maxDevices }} list of devices the participant used to connect to conferences.
        </p>
        <b-card-group deck>
          <b-card header="Micropones" header-tag="header">
            <p v-for="device in inputDevices" :key="device.label">{{device.label}}</p>
          </b-card>
          <b-card header="Cameras" header-tag="header">
            <p v-for="device in videoDevices" :key="device.label">{{device.label}}</p>
          </b-card>
          <b-card header="Output Devices" header-tag="header">
            <p v-for="device in outputDevices" :key="device.label">{{device.label}}</p>
          </b-card>
        </b-card-group>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-sm">
        <h3 class="mb-2">
          Operating systems
        </h3>
        <div id="os-chart" class="pie-chart"></div>
      </div>
      <div class="col">
        <h3 class="mb-2">
          Browsers
        </h3>
        <div id="browser-chart" class="pie-chart"></div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <h3 class="mb-2">
          User locations
        </h3>
        <Loader v-if="sessions == null" />
        <map-chart v-if="showMap" :sessions="sessions" />
      </div>
    </div>
  </div>
</template>

<script>
import { BCardGroup, BCard } from "bootstrap-vue";

import MapChart from "../../components/mapChart.vue";
import Loader from "../../components/loader.vue";

export default {
  name: "devicesTab",

  components: {
    BCardGroup,
    BCard,
    MapChart,
    Loader
  },

  props: {
    sessions: {
      type: Array,
      required: true
    },
    displayed: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      maxDevices: 3,
      showMap: false
    }
  },

  watch: {
    sessions() {
      this.createOSChart();
      this.createBrowserChart();
    },

    // we need to wait for the tab to become visible before we instantiate <map-chart>
    // leaflet does not like when base elements are hidden
    displayed(val) {
      if (val) {
        setTimeout(() => {
          this.showMap = true
        // this is a bit more than bootstrap's "fade" CSS transition
        }, 160)
      }
    }
  },

  computed: {
    browsers() {
      let systems = []
      let drilldown = {}
      let len = this.sessions.length

      this.sessions.forEach(function (event) {
          if (event.platform) {
              let platform = event.platform
              let name = platform.browser.name
              let version = platform.browser.version

              systems.push(name)

              if (version) {
                  if (drilldown[name]) {
                      drilldown[name].push(version)
                  } else {
                      drilldown[name] = [version]
                  }
              }
          }
      })

      systems = peermetrics.utils.reduce(systems, len)

      let series = []
      let drilldownSeries = []
      for (let browser in systems) {
          series.push({
              name: browser,
              y: systems[browser],
              drilldown: drilldown[browser] ? browser : null
          })

          if (drilldown[browser]) {
              let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length)
              drilldownSeries.push({
                  name: browser,
                  id: browser,
                  data: Object.entries(versions)
              })
          }
      }

      return {
        series,
        drilldown: drilldownSeries
      }
    },

    operatingSystems() {
      let systems = []
      let drilldown = {}
      let len = this.sessions.length

      this.sessions.forEach(function (event) {
          if (event.platform) {
              let platform = event.platform
              let name = platform.os.name
              let version = platform.os.version

              systems.push(name)

              if (version) {
                  if (drilldown[name]) {
                      drilldown[name].push(version)
                  } else {
                      drilldown[name] = [version]
                  }
              }
          }
      })

      systems = peermetrics.utils.reduce(systems, len)

      let series = []
      let drilldownSeries = []
      for (let browser in systems) {
          series.push({
              name: browser,
              y: systems[browser],
              drilldown: drilldown[browser] ? browser : null
          })

          if (drilldown[browser]) {
              let versions = peermetrics.utils.reduce(drilldown[browser], drilldown[browser].length)
              drilldownSeries.push({
                  name: browser,
                  id: browser,
                  data: Object.entries(versions)
              })
          }
      }

      return {
        series,
        drilldown: drilldownSeries
      }
    },

    inputDevices() {
      const label = 'audioinput'

      return this.createDevicesList(this.sessions, label)
    },

    videoDevices() {
      const label = 'videoinput'

      return this.createDevicesList(this.sessions, label)
    },

    outputDevices() {
      const label = 'audiooutput'

      return this.createDevicesList(this.sessions, label)
    }
  },

  methods: {
    createOSChart() {
      const {series, drilldown} = this.operatingSystems

      Highcharts.chart("os-chart", {
        credits: false,
        chart: {
          type: "pie"
        },
        title: {
          text: ""
        },
        subtitle: {
          text: "Click the slices to view versions"
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
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
        },
        series: [
          {
            name: "OS",
            colorByPoint: true,
            data: series
          }
        ],
        drilldown: {
          series: drilldown
        }
      });
    },

    createBrowserChart() {
      const {series, drilldown} = this.browsers

      Highcharts.chart("browser-chart", {
        credits: false,
        chart: {
          type: "pie"
        },
        title: {
          text: ""
        },
        subtitle: {
          text: "Click the slices to view versions"
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
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
        },
        series: [
          {
            name: "Browser",
            colorByPoint: true,
            data: series
          }
        ],
        drilldown: {
          series: drilldown
        }
      });
    },

    createDevicesList(data = [], kind) {
      const filteredDevices = data.reduce((acc, item) => {
        // filter just the device kind that we care, and add it to filteredDevices
        return acc.concat(item.devices.filter((device) => device.kind === kind))
      }, [])
      .map(item => item.label);

      const counted = peermetrics.utils.reduce(filteredDevices);

      return Object.keys(counted)
        .map(item => ({
          label: item,
          count: counted[item]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, this.maxDevices);
    }
  }
};
</script>

<style>
  .pie-chart {
    height: 300px;
  }
</style>