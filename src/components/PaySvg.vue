<template>
   <q-knob
      readonly
      v-model="value"
      show-value
      size="120px"
      :thickness="0.25"
      :color="value > 75 ? 'red-6' : value > 50 ? 'orange-6' : 'green-6'"
      track-color="green-6"
    >

    <p :class="value > 75 ? 'text-red-600' : value > 50 ? 'text-orange-600' : 'text-green-600'" class="f-black">
      {{ value }}%
    </p>
    </q-knob>
</template>
<script>
export default {
  props: ["expense", "incoming"],
  computed:{
    value(){
      return ((this.incoming / this.expense) * 100).toFixed(0)
    }
  }
};
</script>
