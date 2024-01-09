<template>
  <b-modal
    ref="conferencesModal"
    size="lg"
    no-close-on-esc
    hide-footer
  >
    <template v-slot:modal-title>Conferences</template>
    <div class="row">
      <div class="col">
        <div
          id="conference-list-holder"
          class="list-group list-group-flush list-custom"
        >
          <a
            v-for="conference in conferences"
            :key="conference.id"
            :href="createPath(conference)"
            class="list-group-item list-group-item-action d-flex"
          >
            <div>
              <span v-if="hasName(conference)"
                >{{ conference.conference_name }},</span
              >
              <span v-else class="text-muted">No conference name,</span>
              <span class="text-muted">{{ conference.conference_id }}</span>
            </div>

            <i v-if="hasError(conference)" class="icon-cross text-danger"></i>
            <i
              v-else-if="hasWarning(conference)"
              class="icon-warning text-warning"
            ></i>
          </a>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import conferencesFunctions from "../mixins/conferences";

export default {
  name: "conference-list-modal",

  mixins: [conferencesFunctions],

  props: {
    conferences: {
      type: Array,
      required: true,
    },
  },

  methods: {
    show() {
      this.$refs["conferencesModal"].show();
    }
  }
};
</script>