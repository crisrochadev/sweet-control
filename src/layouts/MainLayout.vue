<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="primary"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-primary sweet-font font-extrabold"> <q-icon name="img:/app-2.png" class="mb-2"/> Sweet Control </q-toolbar-title>

        <div>
          <q-btn icon="logout" round flat color="primary" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="showMenu" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :user="user"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { supabase } from "src/boot/supabase";
import { useAuth } from "src/stores/auth";

const linksList = [
  {
    title: "Despesas",
    caption: "Controle seus gastos",
    icon: "wallet",
    link: "/despesas",
  },
  {
    title: "Entradas",
    caption: "Controle seus ganhos",
    icon: "money",
    link: "/entradas",
  },
  {
    title: "Painel do seu controle",
    caption: "Monitore seus ganhos e gastos",
    icon: "mdi-chart-bar",
    link: "/graficos",
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
    link: "/perfil"
  },
  {
    title: "Sair",
    caption: "Toque se deseja sair",
    icon: "logout",
    link: "/sair"
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  data() {
    const auth = useAuth()
    return {
      essentialLinks: linksList,
      leftDrawerOpen: false,
      supabase,
      showMenu:false,
      user:auth.session.user
    };
  },
  methods: {
    async logout() {
      await supabase.auth.signOut();
      this.$router.go();
    },
    toggleLeftDrawer() {
      this.showMenu = !this.showMenu
    },
  },
});
</script>
