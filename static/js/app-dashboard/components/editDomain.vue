<template>
  <div>
    <p>
      Domain restriction:
      <a
        v-if="editedDomain"
        href="#"
        class="text-muted"
        data-toggle="modal"
        data-target="#edit-domain-modal"
      >
        {{ editedDomain }}
        <i class="icon-new-message opacity-20"></i>
      </a>
      <a v-else href="#" class="text-link" data-toggle="modal" data-target="#edit-domain-modal">Add</a>
      <p v-if="errorMessage">
        <span class="text-danger">{{ errorMessage }}</span>
      </p>
    </p>
    <div class="modal fade" id="edit-domain-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="edit-domain-title">Add a domain restriction for this app:</h5>
          </div>
          <div class="modal-body">
            <p>You can restrict metrics to a specific domain.</p>
            <p>Add the exact subdomain requests will come from, for example <code>subdomain.domain.com</code> instead of just <code>domain.com</code>.</p>
            <div class="form-group">
              <input class="form-control app-domain-value" type="text" v-model="editedDomainAux" />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn"
              data-dismiss="modal"
              @click="cancelDomainName()"
            >Cancel</button>
            <button
              type="sub"
              class="btn btn-primary save-app-domain"
              @click="saveDomainName()"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "edit-domain",
  props: {
    app: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      errorMessage: "",
      editedDomain: "",
      editedDomainAux: "",
      isValid: true
    };
  },
  mounted() {
    this.editedDomain = this.app.domain;
    this.editedDomainAux = this.app.domain;
  },
  methods: {
    cancelDomainName() {
      this.editedDomain = this.editedDomainAux;
    },
    saveDomainName() {
      $("#edit-domain-modal").modal("hide");

      peermetrics.put(peermetrics.urls['apps'] + '/' + peermetrics.app.id, {
        domain: this.editedDomainAux
      }).then(() => {
          this.editedDomain = this.editedDomainAux
          this.errorMessage = ""
      }).catch((err) => {
        this.editedDomainAux = this.editedDomain
        this.errorMessage = "There was an error saving the domain restriction. Please check that is a valid domain."
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>