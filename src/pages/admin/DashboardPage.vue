<template>
  <q-page padding class="w-full h-full relative overflow-hidden flex flex-col">
    <div class="w-full h-[80svh] relative overflow-hidden grid" style="grid-template-rows: 65% 1.5rem 1fr">
      <div
        class="w-full flex flex-col justify-center items-center gap-2 flex-col overflow-hidden flex-1"
      >
        <q-img src="/safe.svg" width="80px" />
        <h2
          class="leading-6 flex flex-col uppercase font-bold text-cyan-600 text-3xl"
        >
          <span class="text-4xl">Dinheiro</span>
          <span>Guardado</span>
        </h2>
        <div
          class="bg-cyan-600 text-white text-3xl font-bold p-2 rounded flex justify-center items-center gap-1"
        >
          <span>{{ db.totalSafe.toLocaleString('pt-br', {style:'currency', currency:'BRL'}) }}</span>
        </div>
        <div
          class="w-full grid grid-cols-2 gap-2"
        >
          <q-btn
            dense
            label="Retirar"
            unelevated
            color="red-6"
            icon="arrow_downward"
            size="md"
            class="w-full"
            @click="handleSafe('down')"
          ></q-btn>
          <q-btn
            dense
            label="Guardar"
            unelevated
            color="green-6"
            icon="arrow_upward"
            size="md"
            class="w-full"
            @click="handleSafe('up')"
          ></q-btn>
        </div>
      </div>
      <h2 class="h-6 uppercase py-1 leading-3 font-bold w-full border-b border-cyan-600 text-cyan-600 text-sm">Histórico</h2>
      <q-scroll-area class="w-full h-full">
        <div
          v-for="item in db.safes"
          :key="item"
          class="text-gray-200 flex gap-1 justify-between items-center w-full p-1 my-1"
        >
          <p>{{ item.cadastreDate.toLocaleString('pt-br') }}</p>
          <p :class="item.type == 'up' ? 'font-bold text-cyan-600' : 'font-bold text-red-600'"> {{ item.value.toLocaleString('pt-br', {style:'currency', currency:'BRL'}) }}</p>
          <q-icon
            :name="item.type == 'up' ? 'arrow_upward' : 'arrow_downward'"
            :color="item.type == 'up' ? 'green' : 'red'"
          />
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useDatabase } from "src/stores/database";

export default {
  data() {
    return {
      value: null,
      q: useQuasar(),
      db: useDatabase(),
    };
  },
  async mounted(){
    await this.db.changeWallet(this.db.currentWallet)
    await this.db.getSafes()
  },

  methods: {
    handleSafe(type) {
      this.q
        .dialog({
          class: "text-white bg-cyan-10",
          position: "top",
          title:
            (type == "up" ? "Guardar dinheiro na " : "Retirar dinheiro da ") +
            "carteira " +
            this.db.wallet.name,
          message:
            type == "up"
              ? "Não esqueça de adicionar dinheiro a sua conta ou guardar em algum lugar, isso é só um controle ok ?"
              : "Não esqueça que isso é apenas um controle, marque exatamente o valor que você retirou do seu dinheiro guardado!",
          prompt: {
            model: "",
            type: "text",
            filled: true,
            mask: "##,##",
            reverseFillMask: true,
            dense: true,
            labelColor: "cyan-6",
            color: "cyan-6",
            label: "Valor",
            prefix: "R$",
            inputClass: "text-white",
            inputmode:'numeric'
          },
          ok: {
            push: true,
            color: type == "up" ? "green" : "red",
            label: type == "up" ? "Guardar" : "Retirar",
          },
          cancel: {
            label: "Cancelar",
            color: "cyan-6",
            outline: true,
          },
        })
        .onOk(async (val) => {
          if (!val || val.length == 0) {
            return;
          }
          if(Number(val.replace(',', '.')) > this.total && type == 'down'){
            this.q.dialog({
              class: "text-white bg-cyan-10",
              title:'Atenção',
              message:`Você tem guardado ${this.total.toLocaleString('pt-br', {style:'currency', currency:"BRL"})}, verifique o valor da retirada!`,
              ok:{
                label:'ok',
                color:'cyan-6',
                push:true
              }
            });
            return;
          }
          this.db.safe.value = val
          await this.db.createSafe(type);
        });
    },
  },
};
</script>

<style  scoped>
.dark-bg {
  background: #1f2937;
}
</style>
