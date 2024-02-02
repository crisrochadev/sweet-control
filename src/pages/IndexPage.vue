<template lang="">
  <q-page
    class="w-full h-full grid gap-2"
    style="grid-template-rows: 40% 35% 22%"
  >
    <!-- Relatório -->
    <div
      class="w-full h-full p-2 grid gap-2"
      style="grid-template-columns: 120px 1fr"
    >
      <q-btn-group
        dense
        spread
        flat
        class="w-full h-full"
        style="grid-column: 1/3"
      >
        <q-btn
          icon="mdi-chevron-left"
          color="primary"
          flat
          dense
          class="w-10"
          @click="changeMonth('subtract')"
        />
        <q-btn
          icon="mdi-undo-variant"
          color="primary"
          flat
          dense
          @click="current"
        />
        <q-btn-dropdown
          :label="month"
          color="primary"
          flat
          dense
          class="w-[70%]"
        >
          <q-list dense separator>
            <q-item
              v-close-popup
              :class="[m == month ? 'bg-primary' : '']"
              clickable
              v-for="m in config.months"
              :key="m"
              @click="month = m"
            >
              <q-item-section class="uppercase">{{ m }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          icon="mdi-chevron-right"
          color="primary"
          flat
          dense
          @click="changeMonth('add')"
        />
      </q-btn-group>
      <div class="w-full h-full flex justify-center items-center">
        <PaySvg :incoming="totalIncomings" :expense="totalExpenses" />
      </div>
      <div class="w-full h-full flex p-2 gap-2">
        <div class="p-0 w-full h-16">
          <div class="uppercase text-primary f-medium">Saldo</div>
          <div
            class="f-black text-xl"
            :class="[
              totalIncomings - totalExpenses <= 0 ? 'text-red' : 'text-green',
            ]"
          >
            R$ {{ (totalIncomings - totalExpenses).toLocaleString("pt-BR") }}
          </div>
        </div>
        <div>
          <div class="uppercase text-primary f-medium text-xs">Despesas</div>
          <div class="f-black text-lg">
            R$ {{ totalExpenses.toLocaleString("pt-BR") }}
          </div>
        </div>
        <div>
          <div class="uppercase text-primary f-medium text-xs">Entradas</div>
          <div class="f-black text-lg text-secondary">
            R$ {{ totalIncomings.toLocaleString("pt-BR") }}
          </div>
        </div>
      </div>
    </div>
    <!-- Menu 1 -->
    <div class="w-full h-full p-2">
      <q-list class="w-full">
        <q-item
          clickable
          to="/despesas"
          class="w-full rounded"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-item-section side>
            <q-icon name="fa-solid fa-share-from-square" color="primary" />
          </q-item-section>
          <q-item-section class="uppercase f-bold">
            Ver todas as Despesas
          </q-item-section>
          <q-item-section side>
            <q-icon name="mdi-chevron-right" color="primary" />
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/entradas"
          class="w-full rounded mt-2"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-item-section side>
            <q-icon name="fa-solid fa-hand-holding-dollar" color="primary" />
          </q-item-section>
          <q-item-section class="uppercase f-bold">
            Ver todas as Entradas
          </q-item-section>
          <q-item-section side>
            <q-icon name="mdi-chevron-right" color="primary" />
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/entradas"
          class="w-full rounded mt-2"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-item-section side>
            <q-icon name="mdi-chart-bar" color="primary" />
          </q-item-section>
          <q-item-section class="uppercase f-bold">
            Ver realatório completo
          </q-item-section>
          <q-item-section side>
            <q-icon name="mdi-chevron-right" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="w-full h-full p-2 grid grid-cols-3 gap-2">
      <q-btn
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="primary"
        unelevated
        to="/agenda"
      >
        <q-icon name="mdi-calendar" size="lg" class="full-width" />
        <p class="text-xs">Agenda</p>
      </q-btn>
      <q-btn
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="primary"
        unelevated
        to="/calculadora"
      >
        <q-icon name="mdi-calculator" size="lg" class="full-width" />
        <p class="text-xs">Calculadora</p>
      </q-btn>
      <q-btn
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="primary"
        unelevated
        to="/configuracoes"
      >
        <q-icon name="mdi-cog" size="lg" class="full-width" />
        <p class="text-xs">Configurações</p>
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
export default {
  components: { PaySvg },
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
    month: {
      get() {
        // console.log(this.store.month);
        return this.store.month;
      },
      set(newvalue) {
        const currentDay = moment(this.store.currentDate).format("DD");
        let month =
          this.config.months.indexOf(newvalue) + 1 <= 9
            ? "0" + (this.config.months.indexOf(newvalue) + 1)
            : this.config.months.indexOf(newvalue) + 1;
        this.store.currentDate =
          this.store.currentYear + "-" + month + "-" + currentDay;
        // console.log(this.store.currentYear + "-" + month + "-" + currentDay);
        this.store.currentMonth = month;
        this.store.month = newvalue;
      },
    },
  },
  watch: {
    async month() {
      await this.store.getControls();
    },
  },
  methods: {
    async changeMonth(type) {
      this.store.currentDate = moment(this.store.currentDate)
        [type](1, "months")
        .format("YYYY-MM-DD");
      this.store.currentMonth = moment(this.store.currentDate).format("MM");
      this.store.currentYear = moment(this.store.currentDate).format("YYYY");
      this.store.month = moment(this.store.currentDate).format("MMMM");
      await this.store.getControls();
    },
    async current() {
      // console.log("ola");
      this.store.currentDate = moment(Date.now()).format("YYYY-MM-DD");
      // console.log(this.store.currentDate);
      this.store.currentMonth = moment(this.store.currentDate).format("MM");
      this.store.currentYear = moment(this.store.currentDate).format("YYYY");
      this.store.month = moment(this.store.currentDate).format("MMMM");
      // console.log(this.store.month);
      await this.store.getControls();
    },
  },
};
</script>
<style lang=""></style>
