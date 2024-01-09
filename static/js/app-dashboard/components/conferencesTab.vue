<template>
  <div>
    <div class="mt-3">
      <p>This is a list of conferences for this app:</p>
    </div>
    <div class="row mt-3">
      <div class="col">
        <div id="conference-list-holder" class="list-group list-group-flush list-custom">
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

            <i 
              v-if="hasError(conference)"
              class="icon-cross text-danger"
              title="We detected errors for this conference."
              data-toggle="tooltip"
              data-placement="top"
              @mouseover="tooltipHover"
              ></i>
            <i 
              v-else-if="hasWarning(conference)"
              class="icon-warning text-warning"
              title="There are some warnings for this conference."
              data-toggle="tooltip"
              data-placement="top"
              @mouseover="tooltipHover"
              ></i>
          </a>
        </div>

        <b-pagination
          v-if="conferences && conferences.length > perPage"
          :total-rows="rows"
          v-model="currentPage"
          :per-page="perPage"
          aria-controls="conference-list-holder"
          class="mt-3"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { BPagination } from "bootstrap-vue";
import conferencesFunctions from "../../mixins/conferences"
export default {
  name: "conferences-tab",
  props: {
    conferences: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    }
  },
  components: {
    BPagination
  },
  mixins: [conferencesFunctions],

  computed: {
    rows() {
      if(!this.conferences) return 0
      return this.conferences.length;
    }
  },

  methods: {
    // TODO: hack. find the right solution for this
    // move away from jq in the future. this is the only way to force tooltips to appear
    // tried with <b-icon> but they use SVGs. we use css icons now
    tooltipHover(ev) {
      $(ev.target).tooltip('show')
    }
  },
};
</script>

<style lang="scss" scoped>
.list-custom {
  a {
    display: flex;
    justify-content: space-between;
  }
}
</style>
