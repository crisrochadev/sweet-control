<template>
  <home-admin-mobile v-if="screen.xs || screen.sm"/>
  <home-admin-desktop v-else />
</template>
<script setup>
import { useQuasar } from 'quasar';
import HomeAdminDesktop from 'src/components/HomeAdminDesktop.vue';
import HomeAdminMobile from 'src/components/HomeAdminMobile.vue';
import { ref } from 'vue';

const $q = useQuasar();
const screen = ref($q.screen)
</script>

  components: { HomeAdminDesktop },
