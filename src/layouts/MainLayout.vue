<template>
  <q-layout
    view="lHh lpR fFf"
    class="flex w-full h-full relative bg-gradient-to-r from-purple-50 to-purple-100"
  >
    <q-header class="bg-transparent text-primary pt-2">
      <q-toolbar>
        <q-btn
          v-if="$route.path == '/'"
          dense
          color="white"
          unelevated
          text-color="grey-8"
          icon="menu"
          size="md"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          v-else
          dense
          color="white"
          unelevated
          size="md"
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
          class="f-medium uppercase text-sm flex-nowrap text-accent w-full flex-1 gap-2 flex justify-center items-center p-0"
        >
          {{ $route.meta.title }}
        </q-toolbar-title>
        <div class="flex gap-2">
          <q-btn
            v-if="$route.path == '/'"
            dense
            color="white"
            class="w-10"
            unelevated
            text-color="grey-8"
            icon="search"
            size="md"
            @click="toggleLeftDrawer"
          />
          <q-btn
            v-if="$route.path == '/'"
            dense
            color="white"
            unelevated
            text-color="grey-8"
            size="md"
            class="w-10"
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
      class="bg-transparent flex justify-center items-center shadow-md h-14"
      v-if="$q.screen.sm || $q.screen.xs"
    >
      <q-tabs
        active-class="text-accent  bg-transparent"
        class="text-accent bg-transparent"

        dense
      >
        <q-route-tab exact to="/" text-color="accent">
          <q-icon name="mdi-chart-arc" size="lg" />
          <p class="text-[10px]">Painel</p>
        </q-route-tab>
        <q-route-tab exact to="/despesas" text-color="grey-6">
          <q-icon name="img:/expense.svg" size="lg" />
          <p class="text-[10px]">Despesas</p>
        </q-route-tab>
        <q-btn icon="add" class="h-12 w-12" size="md" round color="primary" @click="openDialog('bottom')"/>
        <q-route-tab exact to="/entradas" text-color="grey-6">
          <q-icon name="img:/incoming.svg" size="lg" />
          <p class="text-[10px]">Entradas</p>
        </q-route-tab>
        <q-route-tab exact to="/perfil" text-color="grey-6">
          <q-avatar
            round
            size="md"
            v-if="user.user_metadata && user.user_metadata.avatar_url"
          >
            <q-img :src="user.user_metadata.avatar_url" />
          </q-avatar>
          <q-icon size="lg" name="mdi-account" v-else />
          <p class="text-[10px]">Perfil</p>
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
