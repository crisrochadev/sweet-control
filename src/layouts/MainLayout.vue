<template>
  <q-layout
    view="lHh lpR fFf"
    class="flex w-full h-full relative"
    :class="{
      dark: dark,
      'bg-purple-50': !dark,
      'bg-dark-page': dark,
    }"
  >
    <q-header class="bg-transparent text-prim pt-2">
      <q-toolbar class="flex justify-between items-center">
        <q-btn
          v-if="$route.path == '/'"
          dense
          :color="dark ? 'dark' : 'white'"
          :text-color="dark ? 'grey-2' : 'grey-8'"
          unelevated
          icon="menu"
          size="md"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          v-if="$route.path == '/'"
          dense
          :color="dark ? 'dark' : 'white'"
          :text-color="dark ? 'grey-2' : 'grey-8'"
          unelevated
          icon="mdi-compare"
          size="md"
          class="ml-2"
          @click="$q.dark.toggle"
        />
        <q-btn
          v-else
          dense
          :color="dark ? 'dark' : 'white'"
          :text-color="dark ? 'grey-2' : 'grey-8'"
          unelevated
          size="md"
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
          color="p"
          flat
          dense
          icon="add"
          @click="openDialog('top')"
          v-if="!$q.screen.xs && !$q.screen.sm"
        /> -->
        <q-space v-if="$route.path == '/' && !openSearch" />
        <q-toolbar-title
          v-else
          class="f-medium uppercase text-sm flex-nowrap text-accent f-bold w-full flex-1 gap-2 flex justify-center items-center p-0"
        >
          <transition
            enter-active-class="animated lightSpeedInRight"
            leave-active-class="animated lightSpeedInLeft"
          >
            <q-select
              v-if="$route.path == '/' && openSearch"
              class="mx-2 w-[90%]"
              dense
              outlined
              placeholder="O que esta procurando?"
              color="primary"
              v-model="search"
              ref="input_search"
              :options="searchs"
              use-input
            />
          </transition>

          {{ $route.meta.title }}
        </q-toolbar-title>
        <div class="flex gap-2">
          <q-btn
            v-if="$route.path == '/'"
            dense
            :color="dark ? 'dark' : 'white'"
            :text-color="dark ? 'grey-2' : 'grey-8'"
            class="w-10"
            unelevated
            icon="search"
            size="md"
            @click="openSearch = !openSearch"
          />
          <q-btn
            v-if="$route.path == '/'"
            dense
            :color="dark ? 'dark' : 'white'"
            :text-color="dark ? 'grey-2' : 'grey-8'"
            unelevated
            size="md"
            class="w-10"
            icon="mdi-bell-outline"
          >
            <q-badge color="p" rounded floating>4</q-badge>
          </q-btn>
          <q-btn
            v-else
            dense
            :color="dark ? 'dark' : 'white'"
            :text-color="dark ? 'grey-2' : 'grey-8'"
            unelevated
            size="md"
            icon="mdi-dots-horizontal"
            @click="toggleLeftDrawer"
          />
          <q-btn
          v-if="$q.screen.md || $q.screen.lg || $q.screen.xl"
          icon="add"
          class="h-12 w-12 "
          size="md"
          round
          color="primary"
          @click="openDialog('top')"
        />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen">
      <div class="w-full flex justify-end">
        <q-btn
          :color="$q.dark.isActive ? 'dark' : 'white'"
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

    <q-page-container class="h-full relative w-screen ">
        <router-view />
    </q-page-container>

    <q-footer
      class="flex justify-center items-center shadow-md"
      style="background-color: transparent"
      v-if="$q.screen.sm || $q.screen.xs"
    >
      <q-tabs
        switch-indicator
        indicator-color="primary"
        active-class="text-a  bg-transparent"
        class="text-a bg-transparent h-20 pt-2"
        dense
      >
        <q-route-tab exact to="/">
          <q-icon
            name="mdi-chart-arc"
            size="md"
            :color="dark ? 'grey-3' : 'dark'"
          />
          <p
            class="text-[10px] mt-1"
            :class="dark ? 'text-zinc-300' : 'text-dark'"
          >
            Painel
          </p>
        </q-route-tab>
        <q-route-tab exact to="/despesas" text-color="grey-6">
          <q-icon
            name="fa-solid fa-share-from-square"
            size="sm"
            :color="dark ? 'grey-3' : 'dark'"
          />
          <p
            class="text-[10px] mt-1"
            :class="dark ? 'text-zinc-300' : 'text-dark'"
          >
            Despesas
          </p>
        </q-route-tab>
        <q-btn
          icon="add"
          class="h-12 w-12 -mt-2"
          size="md"
          round
          color="primary"
          @click="openDialog('bottom')"
        />
        <q-route-tab exact to="/entradas" text-color="grey-6">
          <q-icon
            name="fa-solid fa-hand-holding-dollar"
            size="sm"
            :color="dark ? 'grey-3' : 'dark'"
          />
          <p
            class="text-[10px] mt-1"
            :class="dark ? 'text-zinc-300' : 'text-dark'"
          >
            Entradas
          </p>
        </q-route-tab>
        <q-route-tab exact to="/perfil" text-color="grey-6">
          <q-avatar
            round
            size="md"
            v-if="user.user_metadata && user.user_metadata.avatar_url"
          >
            <q-img :src="user.user_metadata.avatar_url" />
          </q-avatar>
          <q-icon size="md" name="mdi-account" v-else />
          <p
            class="text-[10px] mt-1"
            :class="dark ? 'text-zinc-300' : 'text-dark'"
          >
            Perfil
          </p>
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
import { useQuasar } from "quasar";
import { useControl } from "src/stores/control";

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
    const $q = useQuasar();
    const store = useControl();
    return {
      essentialLinks: linksList,
      $q,
      store,
      leftDrawerOpen: false,
      supabase,
      showMenu: false,
      user: auth.session.user,
      fab: false,
      openNew: false,
      openSearch: false,
      search: null,
      searchs: [],
    };
  },
  watch: {
    search() {
      this.filter();
      console.log(this.searchs);
    },
  },
  methods: {
    filter() {
      {
        const conteudo = document.getElementById("sweet");
        const textos = [];

        if (conteudo) {
          const elementos = document.querySelectorAll("div");
          elementos.forEach((elemento) => {
            if (
              elemento.innerText &&
              elemento.innerText
                .toLowerCase()
                .includes(this.search.toLowerCase())
            ) {
              const pattern = /^[a-zA-Z0-9 ]*$/;
              if (
                !textos.includes(elemento.innerText) &&
                pattern.test(elemento.innerText)
              )
                textos.push(elemento.innerText);
            }
          });
        }

        this.searchs = textos;
      }
    },
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
  computed: {
    dark() {
      return this.$q.dark.isActive;
    },
  },
  async mounted() {
    await this.store.getControls();
  },
});
</script>
