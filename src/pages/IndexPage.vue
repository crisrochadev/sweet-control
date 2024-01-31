<template>
  <q-page class="w-full h-auto flex flex-col items-start px-2">
    <div class="w-full h-2/5 p-2 flex justify-between items-center gap-2">
      <q-btn-group class="w-full h-10" flat color="transparent">
        <q-btn
          icon="arrow_left"
          color="white"
          flat
          class="w-10 text-lg"
          text-color="accent"
          @click="previous"
        />
        <q-btn
          icon="undo"
          color="white"
          flat
          class="w-10 text-lg"
          text-color="accent"
          @click="current"
        />
        <q-btn-dropdown
          class="w-[calc(100%_-_7.5rem)]"
          flat
          color="white"
          text-color="accent"
          :label="store.month"
        >
          <q-list class="max-h-[300px]" separator dense>
            <q-item
              clickable
              v-close-popup
              @click="store.month = month"
              v-for="month in store.months"
              :key="month"
              :class="[store.month == month ? 'bg-primary text-white' : '']"
            >
              <q-item-section>
                <q-item-label class="uppercase">{{ month }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          icon="arrow_right"
          color="white"
          text-color="accent"
          flat
          class="w-10 text-lg"
          @click="next"
        />
      </q-btn-group>
      <div class="w-[140px] h-[140px]  flex justify-center items-center">
        <PaySvg :expense="5000" :incoming="4500" />
      </div>
      <div
        class="w-[calc(100%_-_150px)] p-2 flex flex-col gap-4  h-[140px]"
      >
        <q-card class="h-full">
          <q-card-section header class="w-full text-center f-medium text-accent">
            SALDO
          </q-card-section>
          <q-card-section  class="w-full text-center f-black text-accent text-lg" :class="saldo <= 0 ? 'text-red-6' : 'text-green-6'">
            R$ {{ saldo.toLocaleString('pt-BR') }}
          </q-card-section>
        </q-card>
      </div>

      <div
        class="flex  w-full h-18 flex-nowrap items-center justify-center gap-2"
      >
        <q-card>
          <q-item>
            <q-item-section side class="f-bold">R$</q-item-section>
            <q-item-section>
              <q-item-label caption class="f-bold">Entradas</q-item-label>
              <q-item-label class="f-bold text-green-600 text-lg">
                {{
                  totalIncoming.toLocaleString("pt-BR").length > 10
                    ? totalIncoming.toLocaleString("pt-BR").substring(0, 10) +
                      "..."
                    : totalIncoming.toLocaleString("pt-BR")
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
        <q-card>
          <q-item>
            <q-item-section side class="f-bold">R$</q-item-section>
            <q-item-section>
              <q-item-label caption class="f-bold">Despesas</q-item-label>
              <q-item-label class="f-bold text-red-600 text-lg">
                {{
                  totalExpense.toLocaleString("pt-BR").length > 10
                    ? totalExpense.toLocaleString("pt-BR").substring(0, 10) +
                      "..."
                    : totalExpense.toLocaleString("pt-BR")
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div
        class="w-full  h-2/4 p-2 flex justify-between items-center gap-2"
      >
        <q-card class="w-full">
          <q-item>
            <q-item-section side>
              <q-icon name="img:/expense.svg" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>R${{ totalExpense }}</q-item-label>
              <q-item-label class="uppercase f-bold text-accent"
                >Ver todas as Despesas</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_right" size="md" color="red-6" />
            </q-item-section>
          </q-item>
        </q-card>
        <q-card class="w-full">
          <q-item>
            <q-item-section side>
              <q-icon name="img:/incoming.svg" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>R${{ totalIncoming }}</q-item-label>
              <q-item-label class="uppercase f-bold text-accent"
                >Ver todas as Entradas</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_right" size="md" color="green-6" />
            </q-item-section>
          </q-item>
        </q-card>
        <q-card class="w-full">
          <q-item>
            <q-item-section side>
              <q-icon name="img:/chart.svg" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption
                >Acompanhar relatório de gastos</q-item-label
              >
              <q-item-label class="uppercase f-bold text-accent"
                >Ver relatório</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_right" size="md" color="primary" />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
      <div
      class="h-1/3 grid grid-cols-3 w-full p-2 gap-2 justify-center items-center "
    >
      <q-btn
        color="white"
        v-for="item in store.menu"
        :key="item.title"
        class="w-full min-h-20 flex justify-center items-center gap-2 flex-col"
      >
        <q-icon :name="item.icon" size="lg" color="primary" />
        <p class="uppercase f-normal text-primary text-[10px]">
          {{ item.title }}
        </p>
      </q-btn>
    </div>
    </div>


  </q-page>
</template>
<script>
import moment from "moment";
import { supabase } from "src/boot/supabase";
import PaySvg from "src/components/PaySvg.vue";
import { useAuth } from "src/stores/auth";
import { useConfig } from "src/stores/config";

export default {
  data() {
    const auth = useAuth();
    const store = useConfig();
    return {
      auth,
      store,
      loading: true,
      username: null,
      website: null,
      avatar_url: null,
      totalIncoming: 5000.52,
      totalExpense: 4500.97,
      date: moment(),
    };
  },
  mounted() {
    this.getProfile();
  },
  computed: {
    saldo() {
      return (this.totalIncoming - this.totalExpense);
    },
  },
  methods: {
    async getProfile() {
      console.log(this.auth.session);
      try {
        this.loading = true;
        const { user } = this.auth.session;
        const { data, error, status } = await this.$supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", user.id)
          .single();
        if (error && status !== 406) throw error;
        if (data) {
          this.username = data.username;
          this.website = data.website;
          this.avatar_url = data.avatar_url;
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      try {
        this.loading = true;
        const { user } = this.auth.session;
        const updates = {
          id: user.id,
          username: this.username,
          website: this.website,
          avatar_url: this.avatar_url,
          updated_at: new Date(),
        };
        const { error } = await supabase.from("profiles").upsert(updates);
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      try {
        this.loading = true;
        const { error } = await this.$supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    previous() {
      this.date = moment(this.date).subtract(1, "month");
      this.store.month = moment(this.date).format("MMMM");
    },
    next() {
      this.date = moment(this.date).add(1, "month");
      this.store.month = moment(this.date).format("MMMM");
    },
    current() {
      this.date = moment();
      this.store.month = moment().format("MMMM");
    },
  },
  components: { PaySvg },
};
</script>
