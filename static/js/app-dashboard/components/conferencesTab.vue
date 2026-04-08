<template>
  <div>
    <div class="mt-3">
      <p>This is a list of conferences for this app:</p>
    </div>
    <div class="row mt-3">
      <div class="col">
        <div v-if="loading" class="text-center py-4">
          <span class="text-muted">Loading conferences...</span>
        </div>
        <div v-else id="conference-list-holder" class="list-group list-group-flush list-custom">
          <a
            v-for="conference in conferences"
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
          v-if="totalCount > perPage"
          :total-rows="totalCount"
          :value="currentPage"
          :per-page="perPage"
          aria-controls="conference-list-holder"
          class="mt-3"
          @input="onPageChange"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { BPagination } from "bootstrap-vue";
export default {
  name: "conferences-tab",
  props: {
    conferences: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 20,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BPagination
  },

  methods: {
    hasName(conference) {
      return !!conference.conference_name;
    },
    createPath(conference) {
      return peermetrics.createPath('conference', conference.id)
    },
    onPageChange(page) {
      this.$emit('page-changed', page);
    },
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
