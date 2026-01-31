<template>
  <div>
    <loader v-if="!isReady" />
    <div v-else>
      <div class="card-header">
        <a :href="participantPath(participant.id)">
          <div v-if="participant.name">
            <h5 class="card-title">{{participant.name}}</h5>
            <small class="text-muted">{{participant.participantId}}</small>
          </div>
          <h5 v-else class="card-title">{{participant.participantId}}</h5>
        </a>
      </div>

      <div v-if="allMeta" class="card-body">
        <p class="card-text">
          <span class="text-muted">
            Meta:
          </span>
          {{allMeta}}
        </p>

        <div class="dropdown-divider"></div>
      </div>

      <!-- If we have no events for this participant, no need to show the body. it will be empty -->
      <div v-if="participant.sessions.length === 0" class="card-body">
        <!-- if this participant was a SFU, show a special message -->
        <span v-if="participant.is_sfu" class="alert alert-info">
          SFU server
        </span>
        <span v-else class="alert alert-warning">
          This participant took part in the conference but it seems that we have no events captured for it.
        </span>
      </div>
      <div v-else class="card-body">
        <div>
          <p class="card-text">
            <span class="text-muted">
              Time on page:
            </span>
            {{totalDuration}}
          </p>
        </div>
        <div>
          <p class="card-text">
            <span class="text-muted">
              OS:
            </span>
            {{allOS}}
          </p>
        </div>
        <div>
          <p class="card-text">
            <span class="text-muted">
              Browser:
            </span>
            {{allBrowsers}}
          </p>
        </div>
        <div>
          <p class="card-text">
            <span class="text-muted">
              Microphones:
            </span>
            <template v-if="!allMicrophones.length">-</template>
            <ul v-else>
              <li v-for="(microphone,index) in allMicrophones" :key="index">
                {{microphone}}
              </li>
            </ul>
          </p>
        </div>
        <div v-if="allVideoCameras">
          <p class="card-text">
            <span class="text-muted">
              Video cameras:
            </span>
            <template v-if="!allVideoCameras.length">-</template>
            <ul v-else>
              <li v-for="(camera,index) in allVideoCameras" :key="index">
                {{camera}}
              </li>
            </ul>
          </p>
        </div>
        <div>
          <p class="card-text">
            <span class="text-muted">
              Output device:
            </span>
            <template v-if="!allOutputDevices.length">-</template>
            <ul v-else>
              <li v-for="(outputDevice,index) in allOutputDevices" :key="index">
                {{outputDevice}}
              </li>
            </ul>
          </p>
        </div>

        <div v-if="allAppVersions!=='-'">
          <p class="card-text">
            <span class="text-muted">
              App versions:
            </span>
            {{allAppVersions}}
          </p>
        </div>

        <div>
          <p class="card-text">
            <span class="text-muted">
              Location:
            </span>
            {{allLocation}}
          </p>
        </div>

        <div v-if="errors.length" class="mt-3">
          <span class="text-danger">
            This user had issues:
          </span>
          <div v-for="error in errors" :key="error.id">
            <a
              class="btn-link text-left"
              role="button"
              :href="'#' + getAccordionId(error.id)"
              data-toggle="collapse"
              aria-expanded="false"
              :aria-controls="'#' + getAccordionId(error.id)"
            >
              {{ error.title }}
              <i :class="true ? 'icon-chevron-down' : 'icon-chevron-right'"></i>
            </a>
            <div :id="getAccordionId(error.id)" class="collapse">
              <p>
                {{ error.explanation }}
              </p>
              <div class="mt-2">
                <!-- only if emos issue, show the score -->
                <span v-if="error.code === 'very_low_emos'">
                  eMOS score: {{ error.data[0].average }} <br>
                </span>
                <span v-else class="text-muted">Occurrences: {{ error.occurrences }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="warnings.length" class="mt-3">
          <span class="text-warning">
            This user had some mild issues:
          </span>
          <div v-for="warning in warnings" :key="warning.id" class="mt-1">
            <a
              class="btn-link text-left"
              role="button"
              :href="'#' + getAccordionId(warning.id)"
              data-toggle="collapse"
              aria-expanded="false"
              :aria-controls="getAccordionId(warning.id)"
            >
              {{ warning.title }}
              <i :class="true ? 'icon-chevron-down' : 'icon-chevron-right'"></i>
            </a>
            <div :id="getAccordionId(warning.id)" class="collapse">
              <p>
                {{ warning.explanation }}
              </p>
              <div class="mt-2">
                <!-- only if emos issue, show the score -->
                <span v-if="warning.code === 'low_emos'">
                  eMOS score: {{ warning.data[0].average }} <br>
                </span>
                <span v-else class="text-muted">Occurrences: {{ warning.occurrences }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../components/loader.vue";
export default {
  name: "participants-card",
  props: {
    participant: {
      type: Object,
      required: true
    }
  },

  components: {
    Loader
  },

  data() {
    return {
      isReady: false
    };
  },

  mounted() {
    if (this.participant) {
      this.isReady = true;
    }
  },

  methods: {
    participantPath(participantId) {
      if (window.peermetrics && typeof window.peermetrics.createPath === 'function') {
        return window.peermetrics.createPath('participant', participantId)
      }
      return '/participant/' + participantId
    },

    getAccordionId(issueId) {
      return 'accordion-' + issueId
    },

    getDevices(devices) {
      if (devices.constructor === Object)
        return {
          label: devices.label,
          kind: devices.kind
        };
      else
        return devices.map(item => ({
          label: item.label,
          kind: item.kind
        }));
    },

    getDevicesByType(devices, kind) {
      const devicesArr = this.details
        .flatMap(item => item.devices)
        .filter(item => item.kind === kind);

      devices = [...new Set(devicesArr.map(item => item.label))];

      return devices;
    },

    /**
     * Used to get a specific type of issue
     * @param  {String} type
     * @return {Arrat}
     */
    getTypeOfIssue (type='') {
      const warnings = this.details.map((item) => {
        if (item.issues && item.issues.length) {
          return item.issues.filter(issue => issue.type === type)
        }
      })
      // get rid of undefined
      .filter(Array.isArray)
      // flatten it
      .flat()

      let groupings = {}
      warnings.forEach((issue) => {
        if (issue.code in groupings) {
          groupings[issue.code].occurrences += 1
          groupings[issue.code].data.push(issue.data)
        } else {
          groupings[issue.code] = {
            // to make it unique
            id: issue.id,
            code: issue.code,
            title: issue.title,
            explanation: issue.explanation,
            occurrences: 1,
            data: [issue.data]
          }
        }
      })

      return Object.values(groupings)
    }
  },

  computed: {
    details() {
      const obj = this.participant.sessions.map(item => {
        const duration = item.duration || null

        let location = null
        if (item.geo_ip.city && item.geo_ip.country_code) {
          location = `${item.geo_ip.city}, ${item.geo_ip.country_code}`
        }

        return {
          duration: duration,
          browser: item.platform.browser.name,
          os: item.platform.os.name,
          peers: item.session_info.connections,
          devices: this.getDevices(item.devices),
          appVersion: item.appVersion,
          meta: item.metadata ? item.metadata.meta : null,
          location: location,
          issues: item.issues
        }
      });

      return obj.length ? obj : [{}];
    },
    totalDuration() {
      let stillPresent = false
      const sum = this.details.reduce(
        (accumulator, currentValue) => {
          if (currentValue.duration === null) {
            stillPresent = true
          }

          return accumulator + currentValue.duration
        },
        0
      );

      if (stillPresent) {
        return 'Still present'
      }

      return peermetrics.utils.secondsToHMS(sum)
    },
    allBrowsers() {
      const arr = this.details.map(item => item.browser);

      const browsers = [...new Set(arr)];
      const str = browsers.reduce(
        (accumulator, currentValue) => accumulator + currentValue + ", ",
        ""
      );
      return str.substring(0, str.length - 2);
    },
    allOS() {
      const arr = this.details.map(item => item.os);
      const os = [...new Set(arr)];
      const str = os.reduce(
        (accumulator, currentValue) => accumulator + currentValue + ", ",
        ""
      );
      return str.substring(0, str.length - 2);
    },
    allMicrophones() {
      return this.getDevicesByType(this.details, "audioinput")
    },
    allVideoCameras() {
      return this.getDevicesByType(this.details, "videoinput")
    },
    allOutputDevices() {
      return this.getDevicesByType(this.details, "audiooutput")
    },
    allMeta() {
      if (this.details[0].meta) {
        const str = this.details.reduce(
          (accumulator, currentValue) => accumulator + currentValue.meta + ", ",
          ""
        );
        return str.substring(0, str.length - 2);
      }
    },
    allAppVersions() {
      if (this.details.appVersion) {
        const str = this.details.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.appVersion + ", ",
          ""
        );
        return str.substring(0, str.length - 2);
      } else return "-";
    },
    allLocation() {
      const allLocationData = this.details
        .map(({ location }) => location)
        .filter(Boolean);

      if (allLocationData.length === 0) return  '-';

      return [...new Set(allLocationData)].join(', ');
    },

    errors () {
      return this.getTypeOfIssue('error')
    },

    warnings () {
      return this.getTypeOfIssue('warning')
    },
  }
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  i {
    font-size: 1.5em;
  }
  h5 {
    margin: 0;
  }
  p {
    font-size: 14px;
  }
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div {
    // display: flex;
    p {
      margin: 0;
      margin-right: 3px;
      word-wrap: normal;
    }
  }
}
</style>
