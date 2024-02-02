<template>
 <div class="flex justify-between items-center max-w-[320px] mx-auto">
        <q-btn
          :color="$q.dark.isActive ? 'dark' : 'white'"
          text-color="primary"
          unelevated
          icon="mdi-chevron-left"
          @click="store.changeMonth('subtract')"
        />
        <q-btn
          :color="$q.dark.isActive ? 'dark' : 'white'"
          text-color="primary"
          unelevated
          icon="mdi-undo"
          @click="store.current"
        />
        <q-btn-dropdown
          :color="$q.dark.isActive ? 'dark' : 'white'"
          text-color="primary"
          unelevated
          :label="store.month"
        >
        <q-list dense separator>
          <q-item v-close-popup :class="{'bg-primary' : month == store.month}" v-for="month in config.months" :key="month" clickable @click="store.setMonth(month)">
            <q-item-section>{{ month }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
        <q-btn
          :color="$q.dark.isActive ? 'dark' : 'white'"
          text-color="primary"
          unelevated
          icon="mdi-chevron-right"
          @click="store.changeMonth('add')"
        />
      </div>
</template>
<script>
import { useQuasar } from 'quasar';
import { useConfig } from 'src/stores/config';
import { useControl } from 'src/stores/control';

export default {
  name:"MenuMonth",
  data(){
    const $q = useQuasar();
    const store = useControl();
    const config = useConfig();
    return { $q, store , config}
  }
}
</script>
<style lang="">

</style>
