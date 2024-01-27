<template>
  <div class="w-full h-full flex">
    <div class="w-2/4">
      <div class="w-full h-full p-2 flex flex-col justify-center items-center">
        <slot name="header" />
      </div>
    </div>
    <div class="w-2/4">
      <div class="w-full h-full p-2 flex flex-col justify-between items-center">
        <q-tab-panels
          class="w-full relative h-full bg-transparent"
          animated
          v-model="tabb"
          transition-next="slide-left"
          transition-prev="slide-right"
        >
          <q-tab-panel class="w-full h-full relative" name="login">
            <slot name="login" />
          </q-tab-panel>
          <q-tab-panel class="w-full h-full relative" name="register">
            <slot name="register" />
          </q-tab-panel>
          <q-tab-panel class="w-full h-full relative" name="recover">
            <slot name="recover" />
          </q-tab-panel>
          <q-tab-panel class="w-full h-full relative" name="recover">
            <slot name="more" />
          </q-tab-panel>
          <q-tab-panel class="w-full h-full relative" name="reset">
            <slot name="reset" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script>
import { useQuasar } from "quasar";

export default {
  name: "DesktopLogin",
  props: ["title","tab"],
  emits:['update:tab'],
  computed:{
    tabb:{
      get(){
        return this.tab
      },
      set(newvalue){
        this.$emit('update:tab', newvalue)
      }
    }
  },
  data() {
    const $q = useQuasar();
    return {
      $q,
    };
  },
};
</script>
<style lang=""></style>
