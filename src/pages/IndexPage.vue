<template>
  <q-page
    class="w-full h-full p-2 grid gap-6"
    style="grid-template-rows: 75% 20% "
  >
    <div class=" flex flex-col gap-12">
      <MenuMonth />
      <PaySvg :expense="totalExpenses" :incoming="totalIncomings" class=""/>
    </div>

    <div class=" flex justify-center items-center">
      <q-btn class="text-primary" unelevated to="/agenda">
        <q-icon name="mdi-calendar" class="full-width" size="xl" />
        <p>Agenda</p>
      </q-btn>
      <q-btn class="text-primary" unelevated to="/calculadora">
        <q-icon name="mdi-calculator" class="full-width" size="xl" />
        <p>Calculadora</p>
      </q-btn>
    </div>

  </q-page>
</template>
<script>
import moment from "moment";
import { useQuasar } from "quasar";
import PaySvg from "src/components/PaySvg.vue";
import { useConfig } from "src/stores/config";
import { useControl } from "src/stores/control";
import MenuMonth from 'src/components/MenuMonth.vue'
export default {
  components: { PaySvg , MenuMonth},
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

  computed: {
    totalExpenses() {
      return this.store.expenses.reduce((acc, item) => {
        acc = acc + Number(item.ammount);
        return acc;
      }, 0);
    },
    totalIncomings() {
      return this.store.incomings.reduce((acc, item) => {
        acc = acc + Number(item.ammount);
        return acc;
      }, 0);
    },

  },

  methods: {

  },
};
</script>
<style lang=""></style>
