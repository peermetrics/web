<script>
  import ConferenceApp from "./components/app.vue";
  import { BootstrapVue } from 'bootstrap-vue';

  Vue.use(BootstrapVue);

  export default new Vue({
    el: "#app",
    render: h => h(ConferenceApp)
  });
</script>
