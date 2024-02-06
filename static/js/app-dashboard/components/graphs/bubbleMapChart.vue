<template>
    <canvas id='canvas'></canvas>
</template>

<script>
import { Chart as ChartJS, CategoryScale, PointElement, Tooltip } from 'chart.js'
import { BubbleMapController, GeoFeature, ColorScale, ProjectionScale, SizeScale } from 'chartjs-chart-geo';
import * as ChartGeo from 'chartjs-chart-geo'
import Papa from 'papaparse';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Tooltip, ChartDataLabels, GeoFeature, ColorScale, ProjectionScale, CategoryScale, BubbleMapController, SizeScale, PointElement);

export default {
  name: "bubble-map-chart",
  data() {
    return {
      usStates: null,
      mapData: null
    }
  },
  mounted() {
    Promise.all([
      fetch('https://unpkg.com/us-atlas/states-10m.json')
          .then((r) => r.json()),
      fetch('https://gist.githubusercontent.com/mbostock/9535021/raw/928a5f81f170b767162f8f52dbad05985eae9cac/us-state-capitals.csv')
          .then((r) => r.text()).then((d) => Papa.parse(d, { dynamicTyping: true, header: true}).data)
    ]).then(([us, data]) => {
      this.usStates = us
      this.mapData = data

      console.log('here', [us, data])
      console.log('vas', document.getElementById("canvas"))

      const chart = new ChartJS(document.getElementById("canvas").getContext("2d"), {
        type: 'bubbleMap',
        data: {
          labels: this.mapData.map((d) => d.description),
          datasets: [{
            outline: ChartGeo.topojson.feature(this.usStates, this.usStates.objects?.states).features,
            showOutline: true,
            backgroundColor: ['#00f', '#0f0', '#f00'],
            data: this.mapData.map((d) => Object.assign(d, {value: Math.round(Math.random() * 10)})),
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            },
            datalabels: {
              align: 'top',
              formatter: (v) => {
                return v.name;
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return [
                    context.raw.name + ' (Latitude: '+context.raw.latitude+ ', Longitude: '+context.raw.longitude+')'
                  ];
                },
              }
            }
          },
          elements: {
            point: {
              radius: 5
            }
          },
          scales: {
            projection: {
              axis: 'x',
              projection: 'albersUsa',
            },
            size: {
              display: false,
              axis: 'x',
              size: [1, 20],
            }
          }
        }
      });

      console.log('chart', chart)
    });
  }
}
</script>