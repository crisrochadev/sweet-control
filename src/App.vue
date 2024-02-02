<template>
  <div id="sweet" :style="getStyle()">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import moment from 'moment'


export default defineComponent({
  name: "App",

  methods: {
    getStyle() {

      return { width: '100dvw', height: '100svh', position:'relative', overflow:'hidden' };
    },
  },
});
</script>
<style>
body {
  height: 100vh;
}
</style>
