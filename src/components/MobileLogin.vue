<template>
  <q-tab-panels
    v-model="model"
    class="w-full h-full"
    animated
    transition-next="slide-up"
    transition-prev="slide-down"
  >
    <q-tab-panel name="init" class="w-full p-0">
      <div class="w-full h-full p-2 flex flex-col justify-center items-center">
        <slot name="header" />
        <q-btn
          label="Começar a controlar"
          outline
          color="primary"
          @click="model = 'forms'"
          class="mb-8"
          icon="img:/logo.png"
        />
      </div>
    </q-tab-panel>
    <q-tab-panel name="forms" class="w-full p-0">
      <div class="w-full h-full p-2 flex flex-col justify-between items-center">
        <q-tab-panels
          class="w-full h-full relative bg-transparent"
          animated
          v-model="tabb"
          transition-next="slide-left"
          transition-prev="slide-right"
        >
          <q-tab-panel class="w-full h-full relative" name="login">
            <slot name="login"/>
          </q-tab-panel>
          <q-tab-panel class="w-full h-full relative" name="register">
            <slot name="register"/>
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
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { useQuasar } from "quasar";

export default {
  name: "MobileLogin",
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
      model:'init'
    };
  },
};
</script>
<style lang=""></style>
