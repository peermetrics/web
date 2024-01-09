const conferencesFunctions = {
  data() {
    return {
      perPage: 20,
      currentPage: 1,
    };
  },
  computed: {
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
    hasName(conference) {
      return !!conference.conference_name;
    },
    hasError(conference) {
      return conference.issues.some((issue) => issue.type === 'error')
    },
    hasWarning(conference) {
      return conference.issues.some((issue) => issue.type === 'warning')
    },
    createPath(conference) {
      return peermetrics.createPath('conference', conference.id)
    }
  },
};

export default conferencesFunctions;
