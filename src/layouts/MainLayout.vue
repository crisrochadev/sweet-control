<template>
  <q-layout
    view="hHh lpR fFf"
    class="flex w-full h-full relative bg-gradient-to-r from-purple-100 to-purple-200"
  >
    <q-header class="bg-transparent text-primary">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title
          class="sweet-font font-extrabold flex-nowrap w-full flex-1 gap-2 flex justify-start items-center p-0 -mt-2 ml-4"
        >
          <q-avatar square size="25px">
            <img src="/logo.png" />
          </q-avatar>
          <p class="text-2xl">SweetControl</p>
        </q-toolbar-title>
        <q-btn
          color="primary"
          flat
          dense
          icon="add"
          @click="openDialog('top')"
          v-if="!$q.screen.xs && !$q.screen.sm"
        />
      </q-toolbar>
    </q-header>

    <q-list
      class="h-[calc(100%_-_100px)] mt-[50px] shadow-md w-11/12 md:w-[300px] transition-all delay-100 bg-purple-50"
      :class="[
        showMenu
          ? 'ml-0'
          : '-ml-[100%] md:-ml-[240px]',
      ]"
    >
      <q-item-label header> Menu </q-item-label>

      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
        :user="user"
      />
    </q-list>

    <q-page-container class="h-[calc(100%_-_100px)] mt-[50px]">
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-transparent flex justify-center items-center shadow-md"
      v-if="$q.screen.sm || $q.screen.xs"
    >
    <div class="border-8 border-[#E4DEFE] rounded-full w-16 h-16 absolute z-20 left-2/4 -translate-x-2/4 -top-8">
      <q-btn round icon="add" color="primary" class="w-full h-full" @click="openDialog('bottom')"/>
    </div>
      <q-tabs

        indicator-color="transparent"
        class="bg-purple-1 w-[98%]  shadow-2 rounded-t-md "

      >
        <q-route-tab
          icon="img:/chart.svg"
          exact
          to="/"
          color="primary"
          class="text-sw-primary pt-2"
          active-class="bg-purple-300 text-primary"
        />
        <q-route-tab
          icon="img:/expense.svg"
          exact
          to="/despesas"
          class="text-red-600 pt-2"
          style="padding-right: 30px !important;"
          active-class="bg-red-100 text-red-600"
        />

        <q-route-tab
          icon="img:/incoming.svg"
          exact
          to="/entradas"
          class="text-green-600 pt-2 "
          style="padding-left: 30px !important;"
          active-class="bg-green-100 text-green-600"
        />
        <q-route-tab
          :icon="
            user && user.user_metadata && user.user_metadata.avatar_url
              ? 'img:' + user.user_metadata.avatar_url
              : 'img:/user.svg'
          "
          exact
          to="/perfil"
          class="text-primary pt-2"
          active-class="bg-purple-300 text-primary"
        />
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
