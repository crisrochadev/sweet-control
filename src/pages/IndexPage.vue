<template>
  <q-page
    class="w-full h-full p-2 grid"
    :class="{ custom: $q.dark.isActive }"
    :style="{
      gridTemplateRows: '42% 34% 24%',
      gridTemplateColumns: '1fr',
    }"
  >
    <div
      class="py-4 rounded-md w-full p-2 flex justify-between items-center gap-2 relative mt-2"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <q-btn-group class="absolute px-3 -top-4 left-2/4 -translate-x-2/4">
        <q-btn
          icon="mdi-chevron-left"
          dense
          unelevated
          :color="$q.dark.isActive ? 'dark' : 'white'"
          @click="previous"
        />
        <q-btn-dropdown
          dense
          unelevated
          :color="$q.dark.isActive ? 'dark' : 'white'"
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
          icon="mdi-chevron-right"
          dense
          unelevated
          :color="$q.dark.isActive ? 'dark' : 'white'"
          @click="next"
        />
      </q-btn-group>
      <div class="w-[140px] h-[140px] flex justify-center items-center">
        <PaySvg :expense="5000" :incoming="4586.3" />
      </div>
      <div class="w-[calc(100%_-_150px)] p-2 flex flex-col gap-4 h-[140px]">
        <q-card class="h-full" flat>
          <q-card-section
            header
            class="w-full text-center f-medium"
            :class="[$q.dark.isActive ? 'text-zinc-100' : 'text-accent']"
          >
            SALDO
          </q-card-section>
          <q-card-section
            class="w-full text-center f-black text-accent text-md"
            :class="saldo <= 0 ? 'text-red-6' : 'text-green-6'"
          >
            R$ {{ saldo}}
          </q-card-section>
        </q-card>
      </div>

      <div
        class="grid grid-cols-2 px-2 w-full h-18 flex-nowrap items-center justify-center gap-2"
      >
        <q-card flat>
          <q-item>
            <q-item-section side class="f-bold">R$</q-item-section>
            <q-item-section>
              <q-item-label caption class="f-bold">Entradas</q-item-label>
              <q-item-label class="f-bold text-green-600 text-lg">
                {{
                 totalExpense
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
        <q-card flat>
          <q-item>
            <q-item-section side class="f-bold">R$</q-item-section>
            <q-item-section>
              <q-item-label caption class="f-bold">Despesas</q-item-label>
              <q-item-label class="f-bold text-red-600 text-lg">
                {{
                 totalExpense
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div class="w-full py-2 flex justify-between items-center gap-2">
      <p
        class="uppercase f-bold"
        :class="[$q.dark.isActive ? 'text-zinc-100' : 'text-accent']"
      >
        Acompanhar
      </p>
      <q-card flat class="w-full">
        <q-item>
          <q-item-section side>
            <q-icon
              name="fa-solid fa-share-from-square"
              size="sm"
              color="primary"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="uppercase f-bold text-primary"
              >Ver todas as Despesas</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-icon name="arrow_right" size="md" color="primary" />
          </q-item-section>
        </q-item>
      </q-card>
      <q-card flat class="w-full">
        <q-item>
          <q-item-section side>
            <q-icon
              name="fa-solid fa-hand-holding-dollar"
              size="sm"
              color="primary"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="uppercase f-bold text-primary"
              >Ver todas as Entradas</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-icon name="arrow_right" size="md" color="primary" />
          </q-item-section>
        </q-item>
      </q-card>
      <q-card flat class="w-full">
        <q-item>
          <q-item-section side>
            <q-icon name="fa-solid fa-chart-line" size="sm" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="uppercase f-bold text-primary"
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
      class="w-full py-2 grid grid-cols-3 justify-between items-center gap-2"
    >
      <p
        style="grid-column: 1/4"
        class="uppercase f-bold"
        :class="[$q.dark.isActive ? 'text-zinc-100' : 'text-accent']"
      >
        Mais
      </p>
      <q-btn
        class="full-height"
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="a"
        unelevated
      >
        <q-icon name="mdi-calendar" size="50px" />
        <p class="text-xs">Agenda</p>
      </q-btn>
      <q-btn
        class="full-height"
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="a"
        unelevated
      >
        <q-icon name="mdi-calculator" size="50px" />
        <p class="text-xs">Calculadora</p>
      </q-btn>
      <q-btn
        class="full-height"
        :color="$q.dark.isActive ? 'dark' : 'white'"
        text-color="a"
        unelevated
      >
        <q-icon name="mdi-cog" size="50px" />
        <p class="text-xs">Configurações</p>
      </q-btn>
    </div>
  </q-page>
</template>
<script>
import moment from "moment";
import { supabase } from "src/boot/supabase";
import PaySvg from "src/components/PaySvg.vue";
import { useAuth } from "src/stores/auth";
import { useConfig } from "src/stores/config";
import { useControl } from "src/stores/control";

export default {
  data() {
    const auth = useAuth();
    const store = useConfig();
    const storeC = useControl()
    return {
      auth,
      store,
      storeC,
      loading: true,
      username: null,
      website: null,
      avatar_url: null,

      date: moment(),
    };
  },
  mounted() {
    this.getProfile();
  },
  computed: {
    totalExpense(){
      console.log(this.storeC.expenses)
        const total =  this.storeC.expenses.reduce((acc,item) => {
            acc = acc + Number(item.ammount);
            return acc
        },0);
        console.log(total)
        return total;
    },
    totalIncoming(){

    },
    saldo() {
      return this.totalIncoming - this.totalExpense;
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
    async previous() {
      this.storeC.currentDate = moment(this.storeC.currentDate)
        .subtract(1, "month")
        .format("YYYY-MM-DD");
        this.storeC.currentMonth = moment(this.storeC.currentDate).format("MM");
      this.storeC.currentYear = moment(this.storeC.currentDate).format("YYYY");
      await this.storeC.getControls();
    },
    async next() {
      this.storeC.currentDate = moment(this.storeC.currentDate)
        .add(1, "month")
        .format("YYYY-MM-DD");
        this.storeC.currentMonth = moment(this.storeC.currentDate).format("MM");
      this.storeC.currentYear = moment(this.storeC.currentDate).format("YYYY");
      await this.storeC.getControls();
    },
    async current() {
      this.storeC.currentDate = moment().format("YYYY-MM-DD");
      this.storeC.currentMonth = moment().format("MM");
      this.storeC.currentYear = moment().format("YYYY");
      await this.storeC.getControls();
    },
  },
  components: { PaySvg },
};
</script>
