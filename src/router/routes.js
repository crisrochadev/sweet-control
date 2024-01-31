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
        meta:{title:"Despesas"}
      },
      {
        component:() => import("pages/Entradas.vue"),
        path: "entradas",
        meta:{title:"Entradas"}
      },
      {
        component:() => import("pages/Graficos.vue"),
        path: "graficos",
        meta:{title:"Painel"}
      },
      {
        component:() => import("pages/Calculadora.vue"),
        path: "calculadora",
        meta:{title:"Calculadora"}
      },
      {
        component:() => import("pages/Agenda.vue"),
        path: "agenda",
        meta:{title:"Agenda"}
      },
      {
        component:() => import("pages/Configuracoes.vue"),
        path: "configuracoes",
        meta:{title:"Configurações"}
      },
      {
        component:() => import("pages/Perfil.vue"),
        path: "perfil",
        meta:{title:"Perfil"}
      },
      {
        component:() => import("pages/Sair.vue"),
        path: "sair",
        meta:{title:"Sair"}
      },
      {
        component:() => import("pages/NewControl.vue"),
        path: "novo",
        meta:{title:"Adicionar Novo"}
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
