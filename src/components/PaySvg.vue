<template>
  <q-circular-progress
    :value="Number(value)"
    show-value
    :thickness="0.2"
    size="100px"
    color="grey-6"
    center-color="transparent"
    class="w-full full-width"
  >
  <q-badge floating color="transparent" v-if="value > 50" >
    <q-icon name="mdi-alert-circle" :color="getColor()" size="md"/>

  </q-badge>
    <q-chip class="w-[80px] h-[80px] rounded-full" :text-color="getColor()" :color="$q.dark.isActive ? 'dark' : 'white'">
      <div class="w-full text-center f-black text-2xl">{{ value }}%</div>
      <q-tooltip color="grey-6">R$ {{ this.expense.toLocaleString('pt-BR') }}</q-tooltip>
    </q-chip>
  </q-circular-progress>
</template>
<script>
import { useQuasar } from 'quasar';

export default {
  name:"PaySvg",
  props: ["expense", "incoming"],
  computed: {
    value() {
      return ((this.expense / this.incoming) * 100).toFixed(0);
    },
  },
  methods: {
    getColor() {
      if (this.value <= 50) return "blue-6";
      else if (this.value > 50 && this.value <= 75) return "purple-4";
      else if (this.value > 75 && this.value <= 100) return "orange-6";
      else if (this.value > 100) return "red";
    },
  },
  data(){
    const $q = useQuasar();
    return{
      $q
    }
  }
};
</script>
