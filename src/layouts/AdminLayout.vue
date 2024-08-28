<template>
  <q-layout class="bg-gray-800" view="hHh lpR fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="bg-gray-800 h-10 flex justify-between items-center p-2">
      <div class="flex justify-start items-center gap-2">
        <q-img src="~/assets/images/logo.png" width="25px" />
        <h1
          class="leading-3 uppercase font-extrabold"
          :class="`text-${db.wallet.color}`"
        >
          {{ db.wallet.name }}
        </h1>
      </div>
      <q-btn
        round
        flat
        dense
        icon="logout"
        size="sm"
        color="cyan-6"
        @click="auth.logout"
      />
    </q-header>

    <q-dialog full-width full-height v-model="db.openWallets" position="top">
      <q-card class="bg-cyan-900 h-full">
        <q-card-section class="flex justify-between items-center">
          <p class="text-white uppercase font-bold">Carteiras</p>
          <q-btn
            icon="close"
            dense
            flat
            color="cyan-6"
            @click="db.openWallets = !db.openWallets"
          />
        </q-card-section>
        <q-card-section class="flex justify-center px-2 items-center">
          <q-btn
            :icon-right="db.openNewWallet ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            push
            label="Nova Carteira"
            color="cyan-6"
            dense
            @click="openNewWallet"
            class="full-width"
          >
            <q-menu fit>
              <div
                class="flex flex-col gap-2 w-full p-2 bg-gray-800"
                v-if="db.openNewWallet"
              >
                <h1 class="leading-3 uppercase text-cyan-300 font-bold p-2">
                  Nova carteira
                </h1>
                <q-input
                  filled
                  dense
                  color="cyan-6"
                  label-color="cyan-6"
                  input-class="text-white"
                  v-model="curWallet"
                  required
                  label="Nome da carteira"
                />
                <q-btn
                  label="Salvar"
                  class="full-width"
                  color="cyan-6"
                  push
                  @click="db.createWallet(curWallet)"
                  v-close-popup
                />
              </div>
            </q-menu>
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-list class="max-h-[300px] oerflow-y-auto" dense>
            <q-item
              v-for="wallet in db.wallets"
              :key="wallet.id"
              clickable
              @click="db.changeWallet(wallet.id)"
              class="hover:bg-cyan-800 my-2 shadow-md rounded font-extrabold  uppercase"
              :class="[db.wallet.name == wallet.name ? 'bg-cyan-600 font-extrabold text-gray-900' : 'bg-cyan-800 text-white']"
            >
              <q-item-section >
                {{ wallet.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- (Optional) The Footer -->
    <q-footer class="h-auto">
      <div
        class="bg-gray-700 grid"
        :style="
          $route.path !== '/admin/dashboard' && $route.path !== '/admin/user'
            ? 'grid-template-columns:repeat(5,1fr)'
            : 'grid-template-columns:repeat(4,1fr)'
        "
      >
        <q-btn
          icon="img:/safe.svg"
          flat
          class="full-width"
          color="cyan-6"
          size="md"
          to="/admin/dashboard"
        />
        <q-btn
          :icon="db.openWallets ? 'fa-solid fa-times' : 'fa-solid fa-wallet'"
          flat
          class="p-2 full-width"
          size="md"
          :class="[db.openWallets ? 'bg-cyan-9' : '']"
          color="cyan-6"
          @click="db.openWallets = !openWallets"
        />
        <div
          class="relative"
          v-if="
            $route.path !== '/admin/dashboard' && $route.path !== '/admin/user'
          "
        >
          <div
            class="bg-gray-800 h-16 w-16 flex justify-center items-center absolute -top-10 rounded-full"
          >
            <q-btn
              @click="db.newExpenseOpen = !db.newExpenseOpen"
              push
              class="text-md flex justify-center items-center w-12 h-12"
              round
              color="cyan-6"
            >
              <q-icon
                :name="
                  db.newExpenseOpen ? 'fa-solid fa-times' : 'fa-solid fa-plus'
                "
              />
            </q-btn>
          </div>
        </div>
        <q-btn
          icon="fa-solid fa-dollar-sign"
          flat
          class="p-2 full-width"
          size="md"
          color="cyan-6"
          to="/admin"
        />
        <q-btn
          icon="fa-solid fa-user"
          flat
          class="p-2 full-width"
          size="md"
          color="cyan-6"
          to="/admin/user"
        />
      </div>
    </q-footer>

    <q-page-container class="w-full">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { getDefaultWallet } from "src/boot/database";
import { useAuth } from "src/stores/auth";
import { useDatabase } from "src/stores/database";

export default {
  data() {
    const q = useQuasar();
    const auth = useAuth();
    const db = useDatabase();
    return {
      q,
      menuOpen: false,
      auth,
      db,
      curWallet: null,
    };
  },
  async mounted() {
    await this.db.getWallets();
    if (!this.db.currentWallet) {
      const walletDefault = await getDefaultWallet();
      if (Object.keys(walletDefault).length === 0) {
        this.db.wallet.default = true;
        await this.db.createWallet();
      } else {
        this.db.wallet = walletDefault;
        this.db.currentWallet = walletDefault.id;
        await this.db.changeWallet(this.db.currentWallet);
      }
    }
  },
  methods: {
    openNewWallet() {
      this.db.openNewWallet = !this.db.openNewWallet;

    },
  },
};
</script>
