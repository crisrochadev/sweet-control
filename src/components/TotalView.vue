<template>
  <div
    class="p-2 flex items-center justify-between gap-2 rounded-md f-black"
    :class="[$q.dark.isActive ? 'bg-dark' : 'bg-white']"
  >
    <p class="flex flex-col items-center overflow-hidden">
      <span>Despesas</span>
      <span class="text-primary">R${{ prev.toLocaleString("pt-BR") }}</span>
    </p>
    <p class="flex flex-col items-center overflow-hidden">
      <span :class="color">Total</span>
      <span class="text-3xl">R${{ value.toLocaleString("pt-BR") }}</span>
    </p>
    <p class="flex flex-col items-center overflow-hidden">
      <span>Saldo</span>
      <span class="text-primary">R${{ saldo.toLocaleString("pt-BR") }}</span>
    </p>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { useConfig } from "src/stores/config";
import { useControl } from "src/stores/control";

export default {
  name: "total-view",
  props: ["value", "prev", "saldo", "color"],
  data() {
    const store = useControl();
    const $q = useQuasar();
    const config = useConfig();
    return {
      store,
      $q,
      config,
    };
  },

};
</script>
<style lang=""></style>
