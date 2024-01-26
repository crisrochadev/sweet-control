<template>
  <q-card class="h-full grid grid-rows-[60px,1px,1fr,1px,200px] bg-accent">
    <q-card-section
      header
      class="flex justify-between font-bold text-gray-700 items-center"
    >
      <q-btn
        flat
        dense
        v-if="tabb == 'register' || tabb == 'recover'"
        icon="mdi-arrow-left-thick"
        color="primary"
        :label="tabb == 'register' ? 'Entrar' : 'Voltar'"
        @click="tabb = 'login'"
      />
      <p
        v-if="tabb == 'register'"
        class="flex-1 text-left font-medium text-xs pl-4"
      >
        já tem cadastro?
      </p>
      <p
        v-if="tabb == 'login'"
        class="flex-1 text-right font-medium text-xs pr-4"
      >
        Não tem cadastro?
      </p>
      <q-btn
        flat
        dense
        v-if="tabb == 'login'"
        icon-right="mdi-arrow-right-thick"
        color="primary"
        label="Cadastre-se"
        @click="tabb = 'register'"
      />
    </q-card-section>
    <q-separator />
    <q-card-section class="">
      <slot />
    </q-card-section>
    <q-separator v-if="tabb != 'recover'" />
    <q-card-actions class="relative" v-if="tabb != 'recover'">
      <span
        class="absolute -top-3 left-2/4 -translate-x-2/4 bg-accent text-sw-primary"
        >ou</span
      >
      <div
        class="relative flex justify-center items-center flex-col gap-2 mx-auto w-11/12 md:w-8/12"
      >
        <q-btn
          class="full-width"
          icon="mdi-google"
          size="md"
          text-color="red-8"
          outline
          label="Entrar com Google"
        />
        <q-btn
          icon="mdi-facebook"
          size="md"
          label="Entrar com Facebook"
          class="full-width"
          text-color="blue-8"
          outline
          @click="facebook"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script>
import {supabase} from 'src/boot/supabase';

export default {
  props: ["title", "tab"],
  emits: ["update:tab"],
  computed: {
    tabb: {
      get() {
        return this.tab;
      },
      set(newvalue) {
        this.$emit("update:tab", newvalue);
      },
    },
  },
  methods: {
    async facebook() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
      });
      console.log(data,error)
    },
  },
};
</script>
<style lang=""></style>
