const routes = [
  {
    path: "/",
    name: "admin_layout",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        component:() => import("pages/Despesas.vue"),
        path: "despesas",
      },
      {
        component:() => import("pages/Entradas.vue"),
        path: "entradas",
      },
      {
        component:() => import("pages/Graficos.vue"),
        path: "graficos",
      },
      {
        component:() => import("pages/Calculadora.vue"),
        path: "calculadora",
      },
      {
        component:() => import("pages/Agenda.vue"),
        path: "agenda",
      },
      {
        component:() => import("pages/Configuracoes.vue"),
        path: "configuracoes",
      },
      {
        component:() => import("pages/Perfil.vue"),
        path: "perfil",
      },
      {
        component:() => import("pages/Sair.vue"),
        path: "sair",
      },
      {
        component:() => import("pages/NewControl.vue"),
        path: "novo",
      },
    ],
  },

  {
    path: "/reset",
    name: "reset",
    component: () => import("pages/ResetPassword.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
