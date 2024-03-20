<template>
  <div>
    <div class="row">
      <div class="col">
        <h3 class="h5 mt-2">Call duration</h3>
        <bar-chart
            id="call-duration-chart"
            :labels="callDurationChartData.labels"
            :datasets="callDurationChartData.datasets"
            x-grid
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h3 class="h5 mt-4">{{ conferenceProblemTitle }}</h3>

        <div v-if="warningConferences.length < 1" class="col-12">
          <div class="card card-lg text-center">
            <div class="card-body">
              <h1 class="h5">Nothing here!</h1>
              <p>This participant didn't have any problems recently.</p>
            </div>
          </div>
        </div>
        <div v-else class="col-12">
          <div id="conference-list" class="list-group list-group-flush">
            <a
              v-for="conference in warningConferences"
              :key="conference.id"
              :href="createPath(conference)"
              class="list-group-item list-group-item-action"
            >
             <div>
              <span v-if="hasName(conference)">{{ conference.conference_name }},</span>
              <span v-else class="text-muted">No conference name,</span>
              <span class="text-muted">{{ conference.conference_id }}</span>
            </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h3 class="h5 mt-4">{{ participationTitle }}</h3>

        <div id="conference-list" class="list-group list-group-flush">
          <a
            v-for="conference in conferencesPagination"
            :key="conference.id"
            :href="createPath(conference)"
            class="list-group-item list-group-item-action"
          >
           <div>
              <span v-if="hasName(conference)">{{ conference.conference_name }},</span>
              <span v-else class="text-muted">No conference name,</span>
              <span class="text-muted">{{ conference.conference_id }}</span>
            </div>
          </a>
        </div>

        <b-pagination
          v-if="conferences.length > perPage"
          v-model="currentPage"
          :per-page="perPage"
          aria-controls="conference-list"
          class="mt-3"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { BPagination } from "bootstrap-vue";

import conferencesFunctions from "../../mixins/conferences"
import BarChart from "../../components/barChart.vue";


export default {
  name: "conferencesTab",

  components: {
    BarChart,
    BPagination
  },

  props: {
    conferences: {
      type: Array,
      required: true
    },
    sessions: {
      type: Array,
      required: true
    },
    isSfu: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  mixins: [conferencesFunctions],

  watch: {
    sessions() {
      // this.createDurationChart()
    },
    conferences() {
      // we only want this to run for sfus
      if (!this.isSfu) return

      // this.createDurationChart()
    },
  },

  computed: {
    conferenceProblemTitle() {
      if (this.isSfu) {
        return 'Conferences that had problems:'
      }

      return 'Conferences where this participant had problems:'
    },

    participationTitle() {
      if (this.isSfu) {
        return 'Conferences hosted by this server:'
      }

      return 'Conferences this participant attended:'
    },

    warningConferences() {
      // if an sfu, show all conferences that had at least one issue
      if (this.isSfu) {
        return this.conferences.filter((conference) => {
          return conference.issues.length
        })
      }

      // for participants, find all the confs where this specific participant had an issue
      const confWithIssues = []
      this.sessions.forEach((session) => {
        if (session.issues.length) {
          confWithIssues.push(session.conference)
        }
      })

      return this.conferences.filter((conference) => {
        return confWithIssues.includes(conference.id)
      })
    },

    callDurationChartData() {
      const dates = peermetrics.utils.createDatesArray(peermetrics.daysHistory)

      const aux = {}
      // if it's an SFU, look at conferences, else look at sessions
      const toParse = this.isSfu ? this.conferences : this.sessions
      toParse.forEach((session) => {
          var date = moment(session.created_at).format('MM/DD')

          if (date in aux) {
              aux[date] += session.duration
          } else {
              aux[date] = session.duration
          }
      })

      const seriesData = dates.map((date) => {
        if (aux[date]) {
          const val = aux[date] / 60
          return Number(val.toFixed(2))
        }

        return 0
      })

      return {
        labels: dates,
        datasets: [{
          label: 'Total duration (minutes)',
          data: seriesData,
          backgroundColor: peermetrics.colors.default
        }]
      }
    }
  },
};
</script>
