<template>
  <q-page padding>
    <q-card>
      <q-card-section class="bg-cyan-800">
        <h2 class="leading-3 text-cyan-300 font-bold uppercase">
          Gastos Mensais
        </h2>
      </q-card-section>
      <q-card-section class="bg-cyan-800 text-white">
        <div>
          <canvas ref="monthChart"></canvas>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Chart from "chart.js/auto";
import { useQuasar } from "quasar";
import { useDatabase } from "src/stores/database";

export default {
  data() {
    return {
      db: useDatabase(),
      q: useQuasar(),
    };
  },
  mounted() {
    this.db.type = 'Tudo';
    const ctx = this.$refs.monthChart.getContext("2d");

    const plugin = {
      id: "customCanvasBackgroundColor",
      beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = options.color || "#99ffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    };

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Receita", "Despesas", "Saldo"],
        datasets: [
          {
            label: "R$",
            data: [
              this.db.currentIncome,
              this.db.currentExpense,
              this.db.currentIncome - this.db.currentExpense,
            ],
            borderWidth: 1,
            backgroundColor: [
              "#4CAF50", // Cor para Receita
              "#F44336", // Cor para Despesas
              "#FFC107", // Cor para Saldo
            ],
            borderColor: "#fff",
          },
        ],
      },
      options: {
        plugins: {
          customCanvasBackgroundColor: {
            color: "#155E75",
          },
          legend: {
            position: "right", // Posiciona a legenda à direita
            labels: {
              color: "#fff", // Cor do texto das legendas
              boxWidth: 10, // Largura da caixa de cor
              font: {
                size: 10, // Tamanho da fonte da legenda
              },
            },
          },
        },
      },
      plugins: [plugin],
    });
  },
};
</script>
