<template>
  <div>
    <h1 class="h2 mb-2">
      {{ editedName }}
      <a @click="$bvModal.show('editNameModal')">
        <i class="icon-new-message edit-app-name"></i>
      </a>
    </h1>

    <b-modal id="editNameModal" no-close-on-esc no-close-on-backdrop hide-header-close>
      <template v-slot:modal-title>Change the name of this app:</template>
      <div class="d-block text-center">
        <div class="form-group">
          <input
            class="form-control app-name-value"
            :class="isValid ? '' : 'is-invalid'"
            type="text"
            id="nameInput"
            v-model="editedName"
            required
          />
          <div v-if="!isValid" class="invalid-feedback">{{errorMessage}}</div>
          <div class="valid-feedback">Looks good!</div>
        </div>
      </div>

      <template v-slot:modal-footer>
        <button type="button" class="btn" @click="$bvModal.hide('editNameModal')">Cancel</button>
        <button type="sub" class="btn btn-primary save-app-name" @click="saveAppName()">Save</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'edit-name',
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: '',
      editedName: '',
      editedNameAux: '',
      isValid: true,
    };
  },
  mounted() {
    this.editedName = this.app.name;
    this.editedNameAux = this.app.name;
  },
  methods: {
    cancelAppName() {
      this.editedName = this.editedNameAux;
      this.isValid = true;
    },
    async saveAppName() {
      if (this.editedName === '') {
        this.isValid = false;
        this.errorMessage = 'You cannot leave this field empty.';
      } else if (this.editedName.length > 64) {
        this.isValid = false;
        this.errorMessage = 'Maximum length is 64 characters.';
      } else {
        //make db request
        this.isValid = true;
        const newNameResponse = await peermetrics
          .put(peermetrics.urls.apps + '/' + peermetrics.app.id, {
            name: this.editedName,
          })
          .catch(e => console.log(e));
        if (newNameResponse) {
          this.$nextTick(() => {
            this.$bvModal.hide('editNameModal');
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
