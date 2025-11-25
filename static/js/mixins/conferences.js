/**
 * Vue.js mixin providing conference-related functionality including pagination,
 * validation, and utility methods for conference management.
 */
const conferencesFunctions = {
  /**
   * Returns the initial data state for conference pagination.
   * @returns {Object} Data object containing pagination settings
   */
  data() {
    return {
      perPage: 20,
      currentPage: 1,
    };
  },
  computed: {
    /**
     * Returns a paginated and sorted array of conferences.
     * Conferences are sorted by creation date in descending order (newest first)
     * and sliced according to current pagination settings.
     * @returns {Array} Paginated array of conference objects, or empty array if conferences is null
     */
    conferencesPagination() {
      if(this.conferences == null) return []
      return this.conferences
        .concat()
        .sort((conference1, conference2) => {
          const time1 = new Date(conference1.created_at).getTime();
          const time2 = new Date(conference2.created_at).getTime();

          return Math.sign(time2 - time1);
        })
        .slice(
          this.perPage * (this.currentPage - 1),
          this.perPage * this.currentPage,
      );
    },
  },

  methods: {
    /**
     * Checks if a conference has a name.
     * @param {Object} conference - The conference object to check
     * @returns {boolean} True if the conference has a non-empty name, false otherwise
     */
    hasName(conference) {
      return !!conference.conference_name;
    },
    /**
     * Checks if a conference has any error-type issues.
     * @param {Object} conference - The conference object to check
     * @returns {boolean} True if the conference has at least one error issue, false otherwise
     */
    hasError(conference) {
      return conference.issues.some((issue) => issue.type === 'error')
    },
    /**
     * Checks if a conference has any warning-type issues.
     * @param {Object} conference - The conference object to check
     * @returns {boolean} True if the conference has at least one warning issue, false otherwise
     */
    hasWarning(conference) {
      return conference.issues.some((issue) => issue.type === 'warning')
    },
    /**
     * Creates a URL path for a specific conference.
     * @param {Object} conference - The conference object containing the ID
     * @returns {string} The generated path for the conference
     */
    createPath(conference) {
      return peermetrics.createPath('conference', conference.id)
    }
  },
};

export default conferencesFunctions;
