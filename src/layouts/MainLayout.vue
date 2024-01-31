<template>
  <q-layout
    view="lHh lpR fFf"
    class="flex w-full h-full relative bg-gradient-to-r from-white to-purple-50"
  >
    <q-header class="bg-transparent text-primary pt-2 ">
      <q-toolbar>
        <q-btn
          v-if="$route.path == '/'"
          dense
          color="white"
          unelevated
          text-color="grey-8"
          icon="menu"
          size="lg"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          v-else
          dense
          color="white"
          unelevated
          size="lg"
          text-color="grey-8"
          icon="mdi-chevron-left"
          @click="$router.back()"
        />

        <!-- <q-toolbar-title
          class="sweet-font font-extrabold flex-nowrap w-full flex-1 gap-2 flex justify-start items-center p-0 -mt-2 ml-4"
        >
          <q-avatar square size="25px">
            <img src="/logo.png" />
          </q-avatar>
        </q-toolbar-title> -->
        <!-- <q-btn
          color="primary"
          flat
          dense
          icon="add"
          @click="openDialog('top')"
          v-if="!$q.screen.xs && !$q.screen.sm"
        /> -->
        <q-space v-if="$route.path == '/'" />
        <q-toolbar-title
          v-else
          class="f-normal text-md flex-nowrap text-accent w-full flex-1 gap-2 flex justify-center items-center p-0 "
        >
          {{ $route.meta.title }}
        </q-toolbar-title>
        <div class="flex gap-2">
          <q-btn
            v-if="$route.path == '/'"
            dense
            color="white"
            unelevated
            text-color="grey-8"
            icon="search"
            size="lg"
            @click="toggleLeftDrawer"
          />
          <q-btn
            v-if="$route.path == '/'"
            dense
            color="white"
            unelevated
            text-color="grey-8"
            size="lg"
            icon="mdi-bell-outline"
          >
            <q-badge color="primary" rounded floating>4</q-badge>
          </q-btn>
          <q-btn
            v-else
            dense
            color="white"
            unelevated
            flat
            size="lg"
            text-color="grey-8"
            icon="mdi-dots-horizontal"
            @click="toggleLeftDrawer"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen">
      <div class="w-full flex justify-end">
        <q-btn
          color="white"
          text-color="primary"
          unelevated
          icon="close"
          @click="leftDrawerOpen = false"
        />
      </div>
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :user="user"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="h-full relative w-screen">
      <q-scroll-area class="h-full w-full mt-0">
        <router-view />
      </q-scroll-area>
    </q-page-container>

    <q-footer
      class="bg-transparent flex justify-center items-center shadow-md"
      v-if="$q.screen.sm || $q.screen.xs"
    >
      <div
        class="rounded-full w-12 h-12 absolute z-20 left-2/4 -translate-x-2/4"
      >
        <q-btn
          round
          icon="add"
          color="primary"
          class="w-full h-full"
          @click="openDialog('bottom')"
        />
      </div>
      <q-tabs
        dense
        indicator-color="accent"
        switch-indicator
        class="w-full shadow-2 rounded-t-md"
      >
        <q-route-tab
          dense
          exact
          to="/"
          color="primary"
          class="text-accent pt-2"
        >
          <div>
            <q-icon name="img:/chart.svg" size="md" />
            <p class="text-[10px]">Painel</p>
          </div>
        </q-route-tab>
        <q-route-tab
          dense
          exact
          to="/despesas"
          class="text-red-600 pt-2"
          style="padding-right: 35px !important"
        >
          <div>
            <q-icon name="img:/expense.svg" size="md" />
            <p class="text-[10px]">Despesas</p>
          </div>
        </q-route-tab>

        <q-route-tab
          dense
          exact
          to="/entradas"
          class="text-green-600 pt-2"
          style="padding-left: 40px !important"
        >
          <div>
            <q-icon name="img:/incoming.svg" size="md" />
            <p class="text-[10px]">Entradas</p>
          </div>
        </q-route-tab>
        <q-route-tab dense exact to="/perfil" class="text-accent pt-2">
          <div>
            <q-avatar>
              <q-icon
                :name="
                  user && user.user_metadata && user.user_metadata.avatar_url
                    ? 'img:' + user.user_metadata.avatar_url
                    : 'img:/user.svg'
                "
                size="md"
              />
            </q-avatar>
            <p class="text-[10px]">Perfil</p>
          </div>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { supabase } from "src/boot/supabase";
import { useAuth } from "src/stores/auth";
import NewControl from "src/components/NewControl.vue";

const linksList = [
  {
    title: "Painel",
    caption: "Monitore seus ganhos e gastos",
    icon: "mdi-chart-bar",
    link: "/graficos",
    footer: true,
  },
  {
    title: "Despesas",
    caption: "Controle seus gastos",
    icon: "wallet",
    link: "/despesas",
    footer: true,
  },
  {
    title: "Entradas",
    caption: "Controle seus ganhos",
    icon: "money",
    link: "/entradas",
    footer: true,
  },

  {
    title: "Calculadora",
    caption: "Calcule antes de gastar",
    icon: "mdi-calculator",
    link: "/calculadora",
  },
  {
    title: "Agenda",
    caption: "Veja seu eventos e planeje seus gastos",
    icon: "mdi-calendar-blank-outline",
    link: "/agenda",
  },
  {
    title: "Configurações",
    caption: "Configure seu app do seu jeito",
    icon: "settings",
    link: "/configuracoes",
  },
  {
    title: "Sua Conta",
    caption: "Configure sua conta",
    icon: "person",
    link: "/perfil",
    footer: true,
  },
  {
    title: "Sair",
    caption: "Toque se deseja sair",
    icon: "logout",
    link: "/sair",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    NewControl,
  },

  data() {
    const auth = useAuth();
    return {
      essentialLinks: linksList,
      leftDrawerOpen: false,
      supabase,
      showMenu: false,
      user: auth.session.user,
      fab: false,
      openNew: false,
    };
  },
  methods: {
    async logout() {
      await supabase.auth.signOut();
      this.$router.go();
    },
    toggleLeftDrawer() {
      this.showMenu = !this.showMenu;
    },
    openDialog(type) {
      console.log(type);
      this.openNew = !this.openNew;
      this.$q.dialog({
        component: NewControl,
        componentProps: {
          position: type,
        },
      });
    },
  },
});
</script>
