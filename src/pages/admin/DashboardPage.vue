<template>
  <q-page padding class="w-full h-full relative overflow-hidden flex flex-col">
    <div class="w-full h-[80svh] relative overflow-hidden flex flex-col">
      <div
        class="w-full flex justify-center items-center gap-2 flex-col overflow-hidden flex-1"
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
          <span>R$ 1254821,15</span>
        </div>
        <div class="w-full grid grid-cols-2 gap-2 justify-between items-center p-2">
          <q-btn
            dense
            label="Retirar"
            unelevated
            color="red-6"
            icon="arrow_downward"
            size="sm"
            class="w-full"
            @click="handleSafe('down')"
          ></q-btn>
          <q-btn
            dense
            label="Guardar"
            unelevated
            color="green-6"
            icon="arrow_upward"
            size="sm"
            class="w-full"

            @click="handleSafe('up')"
          ></q-btn>
        </div>
        <div class="w-full flex flex-col">
          <h3
            class="leading-3 text-cyan-6 text-xs font-bold uppercase border-b border-cyan-600 w-full pb-2"
          >
            Histórico
          </h3>
        </div>
      </div>
      <q-scroll-area class="w-full h-[20%]">
        <div
          v-for="item in 15"
          :key="item"
          class="text-gray-200 flex gap-1 justify-between items-center w-full p-1 my-1"
        >
          <p>23/05/1989</p>
          <p>R$ 2554,00</p>
          <q-icon
            :name="item % 2 == 0 ? 'arrow_upward' : 'arrow_downward'"
            :color="item % 2 == 0 ? 'green' : 'red'"
          />
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { useDatabase } from 'src/stores/database';

export default {
  data() {
    return {
      value: null,
      q:useQuasar(),
      db:useDatabase()
    };
  },
  methods:{
    handleSafe(type){
      this.q.dialog({
        class:"text-white bg-cyan-10",
        position:'top',
        title: (type == 'up' ? 'Guardar dinheiro na ' : 'Retirar dinheiro da ') + 'carteira ' + this.db.wallet.name,
        message: type == 'up' ? 'Não esqueça de adicionar dinheiro a sua conta ou guardar em algum lugar, isso é só um controle ok ?':
        'Não esqueça que isso é apenas um controle, marque exatamente o valor que você retirou do seu dinheiro guardado!',
        prompt: {
            model: '',
            type: 'text' ,
            filled:true,
            mask:'##,##',
            reverseFillMask:true,
            dense:true,
            labelColor:'cyan-6',
            color:'cyan-6',
            label:'Valor',
            prefix:'R$',
            inputClass:'text-white'
          },
          ok:{
            push:true,
            color:type == 'up' ? 'green' : 'red',
            label:type == 'up' ? 'Guardar' : 'Retirar'
          },
          cancel:{
            label:'Cancelar',
            color:'cyan-6',
            outline:true
          }
      })
    }
  }
};
</script>

<style  scoped>
.dark-bg{
  background: #1F2937;
}
</style>
