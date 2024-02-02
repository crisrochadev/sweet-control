<template>
  <q-page
    class="w-full h-full p-2 gap-2 grid"
    style="grid-template-rows: 50px 100px 1fr"
  >
    <menu-month />
    <TotalView :value="4500" :prev="4521.0" :saldo="15.63" />
    <q-list class="h-full overflow-auto">
      <q-slide-item
      @left="props => onLeft(props,expense)"
      @right="props => onRight(props,expense)"
        v-for="expense in store.expenses"
        :key="expense.id"
        class="my-2 h-14"
        left-color="green" right-color="orange"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >
        <template v-slot:left>
          <q-icon name="done" />
        </template>
        <template v-slot:right>
          <q-icon name="mdi-clock" />
        </template>
        <q-item class="w-full h-14">
          <q-item-section side>
            <q-icon name="mdi-check" dense round flat color="green" v-if="expense.completed"/>
            <q-icon name="mdi-clock" dense round flat color="orange" v-else/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="w-full uppercase f-bold text-primary">{{
              expense.title
            }}</q-item-label>
            <q-item-label caption class="w-full overflow-y-auto h-4">
              {{ expense.description }}
              <q-menu
                fit
                cover
                v-if="expense.description && expense.description.length > 30"
              >
                <q-card
                  class="p-2"
                  :class="[$q.dark.isActive ? 'bg-zinc-600' : 'bg-white']"
                >
                  <q-btn
                    icon="close"
                    v-close-popup
                    size="xs"
                    class="float-right"
                    round
                    flat
                  />
                  <p>{{ expense.description }}</p>
                </q-card>
              </q-menu>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="text-lg f-black"
              >R${{ expense.ammount.toLocaleString("pt-BR") }}</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-btn icon="mdi-eye-outline" dense round flat />
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import MenuMonth from "src/components/MenuMonth.vue";
import TotalView from "src/components/TotalView.vue";
import { useConfig } from "src/stores/config";
import { useControl } from "src/stores/control";

export default {
  components: { MenuMonth, TotalView },
  data() {
    const store = useControl();
    const $q = useQuasar();
    const config = useConfig();
    return {
      store,
      $q,
      config,
      timer:null
    };
  },
  computed: {
    expenses: {
      get() {
        return this.store.expenses;
      },
      set(newvalue) {
        this.store.expenses = newvalue;
      },
    },
  },
  methods: {
    onLeft({ reset }, expense) {
      expense.completed = true
      this.$q.notify("Despesa marcada como paga");
      this.finalize(reset);
    },

    onRight({ reset }, expense) {
      expense.completed = false
      this.$q.notify("Despesa desmarcada como paga");
      this.finalize(reset);
    },
    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  },
};
</script>
