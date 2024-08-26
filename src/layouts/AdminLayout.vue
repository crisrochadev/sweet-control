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
            :icon="db.openNewWallet ? 'close' : 'add'"
            push
            color="cyan-6"
            dense
            @click="db.openNewWallet = !db.openNewWallet"
          />
        </q-card-section>
        <transition
          enter-active-class="animated flipInX"
          leave-active-class="animated flipOutX"
        >
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
              input-class="text-cyan-6"
              v-model="db.wallet.name"
              required
              label="Nome da carteira"
            />
            <q-btn
              label="Salvar"
              class="full-width"
              color="cyan-6"
              push
              @click="db.createWallet"
            />
          </div>
        </transition>
        <q-card-section>
          <q-list>
            <q-item
              v-for="wallet in db.wallets"
              :key="wallet.id"
              clickable
              @click="db.changeWallet(wallet.id)"
              class="hover:bg-cyan-800 my-2 shadow-md rounded"
            >
              <q-item-section class="text-white">
                {{ wallet.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- (Optional) The Footer -->
    <q-footer class="h-8">
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
          class="text-[10px] p-2 full-width"
          color="cyan-6"
          to="/admin/dashboard"
        />
        <q-btn
          :icon="db.openWallets ? 'fa-solid fa-times' : 'fa-solid fa-wallet'"
          flat
          class="text-[10px] p-2 full-width"
          :class="[db.openWallets ? 'bg-cyan-9' : '']"
          color="cyan-6"
          @click="db.openWallets = !openWallets"
        />
        <div class="relative" v-if="$route.path !== '/admin/dashboard' && $route.path !== '/admin/user'">
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
          class="text-[10px] p-2 full-width"
          color="cyan-6"
          to="/admin"
        />
        <q-btn
          icon="fa-solid fa-user"
          flat
          class="text-[10px] p-2 full-width"
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
      openNewWallet: false,
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
    }else{
      console.log('entrou aqui')
      console.log(this.db.currentWallet)
      await this.db.changeWallet(this.db.currentWallet);
    }
  },
};
</script>
