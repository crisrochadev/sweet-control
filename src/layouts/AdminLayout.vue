<template>
  <q-layout view="hHh Lpr fFf " class="bg-gray-800">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="bg-gray-800 h-10 flex justify-between items-center p-2">
      <div class="flex justify-start items-center gap-2">
        <q-img src="~/assets/images/logo.png" width="25px" />
        <h1 class="leading-3 uppercase text-cyan-6 font-extrabold">
          Sweet Control
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

    <!-- (Optional) The Footer -->
    <q-footer>
      <div class="bg-gray-700 grid grid-cols-5">
        <q-btn
          icon="fa-solid fa-dashboard"
          flat
          class="text-[10px] p-2 full-width"
          color="cyan-6"
        />
        <q-btn
          icon="fa-solid fa-wallet"
          flat
          class="text-[10px] p-2 full-width"
          color="cyan-6"
        />
        <div class="relative">
          <div class="bg-gray-800 h-16 w-16 flex justify-center items-center absolute -top-10 rounded-full">
            <q-btn
            @click="db.newExpenseOpen = !db.newExpenseOpen"
              push
              class="text-md flex justify-center items-center  w-12 h-12 "
              round
              color="cyan-6"
            >
              <q-icon name="fa-solid fa-plus" />
            </q-btn>
          </div>
        </div>
        <q-btn
          icon="fa-solid fa-dollar-sign"
          flat
          class="text-[10px] p-2 full-width"
          color="cyan-6"
        />
        <q-btn
          icon="fa-solid fa-user"
          flat
          class="text-[10px] p-2 full-width"
          color="cyan-6"
        />
      </div>
    </q-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { useAuth } from "src/stores/auth";
import { useDatabase } from "src/stores/database";

export default {
  data() {
    const q = useQuasar();
    const auth = useAuth();
    const db = useDatabase()
    return {
      q,
      menuOpen: false,
      auth,
      db
    };
  },
};
</script>
