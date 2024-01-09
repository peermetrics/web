<template>
  <b-form-group
    :label="filterLabel"
    :label-for="filterLabel"
    label-class="custom-label"
    class="col-3"
  >
    <b-dropdown
      :id="filterLabel"
      :text="selectedItemLabel"
      :disabled="disabled"
      class="custom-dropdown"
      variant="custom-dropdown-variant"
    >
      <b-dropdown-item @click="select('all')"> All</b-dropdown-item>
      <b-dropdown-item
        v-for="item in items"
        :disabled="item.disabled"
        :key="item.id"
        @click="select(item.id)"
      >
        <slot :item="item">
          <span>{{ item.id }}</span>
        </slot>
      </b-dropdown-item>
    </b-dropdown>
  </b-form-group>
</template>

<script>
export default {
  name: "FilterDropdown",
  props: {
    filterLabel: {
      required: true,
      type: String,
    },
    selectedItemLabel: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      validator: (value) => {
        return (
          Array.isArray(value) ||
          (typeof value === "object" && !peermetrics.utils.isNull(value))
        );
      },
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  created () {
  },
  computed: {
    isGroup() {
      return (
        typeof this.items === "object" &&
        !peermetrics.utils.isNull(this.items) &&
        !Array.isArray(this.items)
      );
    },
  },
  methods: {
    select(id) {
      this.$emit("onChange", id);
    },
  },
};
</script>

<style lang="scss">
.custom-label {
  font-size: 1.5rem !important;
}

.custom-dropdown {
  button {
    width: 100%;
    min-width: 200px;
    padding-right: 50px;
    overflow: hidden;
    text-align: left;
  }

  .dropdown-toggle::after {
    position: absolute;
    top: 45%;
    right: 8px;
    display: inline-block;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.25em solid;
    border-right: 0.25em solid transparent;
    border-bottom: 0;
    border-left: 0.25em solid transparent;
  }
}

.btn-custom-dropdown-variant {
  background: transparent;
  border: 1px solid;
}
</style>