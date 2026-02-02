<template>
  <div>
    <div class="row">
      <div class="col-md">
        <edit-name :app="app" />
        <edit-domain :app="app" />
      </div>

      <div class="col-md">
        <span class="lead">Filters</span>
        <div class="row">
          <div class="col">
            <label for="app-version">App version</label>
            <div>
              <select id="app-version" name="app-version" class="form-control form-control-sm" v-model="selectedAppVersion">
              <option value="">All</option>
              <option v-for="item in appVersions" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            </div>
          </div>

          <div class="col">
            <label for="browser-filter">Browser</label>
            <div>
              <select name="browser-filter" id="browser-filter" class="form-control form-control-sm" v-model="selectedBrowser">
                <option value="">All</option>
                <option v-for="item in browsers" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="col">
            <label for="os-filter">OS</label>
            <div>
              <select name="os-filter" id="os-filter" class="form-control form-control-sm" v-model="selectedOs">
                <option value="">All</option>
                <option v-for="item in os" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="col">
            <label for="os-filter">Country</label>
            <div>
              <select name="os-filter" id="os-filter" class="form-control form-control-sm" v-model="selectedCountry">
                <option value="">All</option>
                <option v-for="item in countries" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.conferences && data.conferences.length === 0" class="row mt-4">
      <div class="col">
        <div class="alert alert-info">
          <p>
            There is not data to display yet. Start collecting metrics by adding peer metrics to your app.
          </p>
          <p>
            You can find all the details in our <a :href="docsPath">docs</a> on how to integrate with your favourite SDK or use it directly.
          </p>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col">
        <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="graphs-tab"
              data-toggle="tab"
              href="#graphs"
              role="tab"
              aria-controls="graphs"
              aria-selected="true"
            >Graphs</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="conferences-tab"
              data-toggle="tab"
              href="#conferences"
              role="tab"
              aria-controls="conferences"
              aria-selected="false"
            >Conference list</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="tab-content" id="dashboardTabContent">
      <div
        class="tab-pane fade show active"
        id="graphs"
        role="tabpanel"
        aria-labelledby="graphs-tab"
      >
        <graphs-tab
          :conferences="conferences"
          :sessions="sessions"
          :connections="connections"
          :issues="issues"
        />
      </div>
      <div class="tab-pane fade" id="conferences" role="tabpanel" aria-labelledby="conferences-tab">
        <conferences-tab :conferences="conferences" />
      </div>
    </div>
  </div>
</template>

<script>
import EditName from "./editName.vue";
import EditDomain from "./editDomain.vue";
import ConferencesTab from "./conferencesTab.vue";
import GraphsTab from "./graphsTab.vue";

export default {
  name: "dashboard-app",
  components: {
    ConferencesTab,
    GraphsTab,
    EditName,
    EditDomain,
  },
  data() {
    return {
      app: {
        name: peermetrics.app.name,
        domain: peermetrics.app.domain
      },
      // main object where we keep the data from the server
      data: {},

      conferences: null,
      sessions: null,
      connections: null,
      issues: null,

      appVersions: [],
      selectedAppVersion: '',

      browsers: [],
      selectedBrowser: '',

      os: [],
      selectedOs: '',

      countries: [],
      selectedCountry: '',
    };
  },

  computed: {
    docsPath() {
      if (window.peermetrics && typeof window.peermetrics.createPath === 'function') {
        try {
          return window.peermetrics.createPath('docs')
        } catch (e) {
          return '/docs'
        }
      }
      return '/docs'
    }
  },

  async created() {
    this.data.issues = await peermetrics.get(peermetrics.urls.issues(), {
      appId: peermetrics.app.id
    }).catch(e => {
      console.warn(e)
    });

    if(this.data.issues) {
      this.issues = Object.freeze(this.data.issues);
    }

    this.data.conferences = await peermetrics.get(peermetrics.urls.conferences(), {
      appId: peermetrics.app.id
    })
    .catch(e => {
      console.warn(e)
    });

    if(this.data.conferences) {
      this.data.conferences = peermetrics.utils.populateIssues(this.data.conferences, this.data.issues)
      this.conferences = Object.freeze(this.data.conferences);
    }

    this.data.sessions = await peermetrics.get(peermetrics.urls.sessions, {
      appId: peermetrics.app.id
    })
    .catch(e => console.warn(e));
    
    if(this.data.sessions) {
      this.data.sessions = peermetrics.utils.populateIssues(this.data.sessions, this.data.issues)
      this.sessions = Object.freeze(this.data.sessions);
    }

    this.data.connections = await peermetrics.get(peermetrics.urls.connections(), {
      appId: peermetrics.app.id
    })
    .catch(e => {
      console.warn(e)
    });
    
    if(this.data.connections) {
      this.data.connections = peermetrics.utils.populateIssues(this.data.connections, this.data.issues)
      this.connections = Object.freeze(this.data.connections);
    }

  },

  watch: {
    sessions() {
      // we only want to do this the first time
      if (this.appVersions.length) return

      let versionObject = {}
      let browserObject = {}
      let osObject = {}
      let countries = {}

      // go through all the sessions and build out the filters
      this.sessions?.map((session) => {
        const appVersion = session.app_version || 'Unknown'
        versionObject[appVersion] = {
          value: appVersion,
          label: appVersion
        }

        const browserName = session.platform?.browser?.name || 'Unknown'
        browserObject[browserName] = {
          value: browserName,
          label: browserName
        }

        const osName = session.platform?.os?.name || 'Unknown'
        osObject[osName] = {
          value: osName,
          label: osName
        }

        const countryCode = session.geo_ip?.country_code || 'Unknown'
        const countryName = peermetrics.globals.countryCodes[countryCode] || 'Unknown'
        countries[countryName] = {
          value: countryCode,
          label: countryName
        }
      })

      this.appVersions = this.extractValues(versionObject)
      this.browsers = this.extractValues(browserObject)
      this.os = this.extractValues(osObject)
      this.countries = this.extractValues(countries)
    },

    selectedAppVersion() {
      this.applyFilters()
    },

    selectedBrowser() {
      this.applyFilters()
    },

    selectedOs() {
      this.applyFilters()
    },

    selectedCountry() {
      this.applyFilters()
    },
  },

  methods: {
    extractValues (object) {
      return Object.values(object).sort((a, b) => a.value > b.value ? 1 : -1)
    },

    applyFilters () {
      // if no filters are applied, use all the data
      if (!this.selectedAppVersion && !this.selectedBrowser && !this.selectedOs && !this.selectedCountry) {
        this.sessions = Object.freeze(this.data.sessions)
        this.issues = Object.freeze(this.data.issues)
        this.connections = Object.freeze(this.data.connections)
        this.conferences = Object.freeze(this.data.conferences)
        return
      }

      let filters = {
        conferences: new Set(),
        issues: new Set(),
        sessions: new Set()
      }

      let compareValues = (val, toCompare) => {
        // if the filter is set to unknown, we care for falsy values
        if (toCompare.toLowerCase() === 'unknown') {
          return !val
        }

        // if we have a value for the filter
        if (toCompare) {
          return val === toCompare
        }

        return true
      }

      let filterFun = (session) => {
        return compareValues(session.app_version, this.selectedAppVersion) &&
               compareValues(session.platform?.browser?.name, this.selectedBrowser) &&
               compareValues(session.platform?.os?.name, this.selectedOs) &&
               compareValues(session.geo_ip?.country_code, this.selectedCountry)
      }

      this.sessions = this.data.sessions.filter((session) => {
        // if the session passes the filter
        if (filterFun(session)) {
          filters.conferences.add(session.conference)
          session.issues.map((issue) => {
            filters.issues.add(issue.id)  
          })
          filters.sessions.add(session.id)

          return true
        }

        return false
      })

      this.conferences = this.data.conferences.filter((conference) => {
        return filters.conferences.has(conference.id)
      })

      this.issues = this.data.issues.filter((issue) => {
        return filters.issues.has(issue.id)
      })

      this.connections = this.data.connections.filter((connection) => {
        return filters.sessions.has(connection.session)
      })
    }
  },
};
</script>
