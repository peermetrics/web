<template>
  <div class="card card-lg text-center align-middle">
    <div class="card-body">
      <p>There is no data to display for this chart.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "no-data-message"
};
</script>

<style lang="scss" scoped>
.card {
  flex-grow: 1;
  margin-bottom: 0;

  .card-body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>