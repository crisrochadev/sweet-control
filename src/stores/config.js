import moment from "../boot/moment";
import { defineStore } from "pinia";


export const useConfig = defineStore("config", {
  state: () => ({
    menu: [
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
    ],
    month:moment().format('MMMM'),
    months:[
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ]
  }),
});
