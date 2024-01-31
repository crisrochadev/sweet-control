<template>
  <q-page class="w-dvw h-full">
    <q-form
      class="flex flex-col justify-between gap-2  w-full h-full p-4"
      @submit="addControl"
    >
      <div class="w-full flex flex-col gap-4">
        <q-input
          class="font-bold"
          input-class="text-gray-800"
          color="primary"
          label="Titulo"
          outlined
          v-model="store.control.title"
          required
          dense
        />
        <q-input
          class="uppercase font-bold"
          input-class="text-gray-800"
          color="primary"
          label="Valor"
          outlined
          v-model="store.control.ammount"
          required
          dense
          prefix="R$"
          inputmode="numeric"
          reverse-fill-mask
          mask="##,##"
        />
        <q-input
          class="uppercase font-bold"
          input-class="text-gray-800"
          color="primary"
          label="Data"
          outlined
          v-model="store.control.duedate"
          required
          inputmode="numeric"
          mask="##/##/####"
          dense
        >
          <template #after>
            <q-btn icon="event" round color="primary">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="store.control.duedate"
                  mask="DD/MM/YYYY"
                  minimal
                  :locale="{
                    days: [
                      'domingo',
                      'segunda',
                      'terça',
                      'quarta',
                      'quinta',
                      'sexta',
                      'sábado',
                    ],
                    daysSgort: [
                      'dom',
                      'seg',
                      'ter',
                      'quar',
                      'qui',
                      'sex',
                      'sab',
                    ],
                    months: [
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
                    ],
                    monthsShort: [
                      'jan',
                      'fev',
                      'mar',
                      'abr',
                      'mai',
                      'jun',
                      'jul',
                      'ago',
                      'set',
                      'out',
                      'nov',
                      'dez',
                    ],
                  }"
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn label="OK" color="primary" flat v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>

        <q-btn-toggle
          v-model="store.control.repeat"
          spread
          dense
          size="12px"
          :toggle-color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
          toggle-text-color="white"
          :color="store.control.type == 'expense' ? 'red-1' : 'green-1'"
          text-color="primary"
          class="h-10"
          :options="[
            { label: 'Vez', value: 'unique', icon: 'mdi-numeric-1' },
            {
              label: 'Parcelado',
              value: 'installments',
              icon: 'fas fa-divide',
            },
            { label: 'Fixo', value: 'fixed', icon: 'mdi-infinity' },
          ]"
        />

        <q-input
          class="uppercase font-bold"
          input-class="text-gray-800"
          color="primary"
          outlined
          v-model="store.control.installments"
          label="Numero de parcelas"
          v-if="store.control.repeat == 'installments'"
          dense
          type="number"
        />

        <q-input
          class="font-bold"
          input-class="text-gray-800"
          color="primary"
          label="Descrição"
          outlined
          v-model="store.control.description"
          dense
          type="textarea"
        />
      </div>

      <div class="flex gap-2 justify-center items-center mt-4">

        <q-btn
          class="full-width rounded-lg"
          :color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
          label="Salvar"
          type="submit"
          size="lg"
        />
      </div>
    </q-form>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import { useControl } from "src/stores/control";

export default {
  data() {
    const store = useControl();
    const $q = useQuasar();
    return {
      store,
      $q,
    };
  },

  mounted() {
    console.log(this.store);
  },
  watch: {
    repeat(newvalue) {
      this.store.control.installments = newvalue.repeat == "installments";
    },
  },
  methods: {
    // updateProxy() {
    //   this.store.control.duedate = date.value;
    // },

    // save() {
    //   date.value = proxyDate.value;
    // },
    async addControl(e) {
      e.preventDefault();
      this.$q.loading.show({
        spinner: QSpinnerPie,
        spinnerColor: "primary",
        spinnerSize: 140,
        backgroundColor: "accent",
        message: "Aguarde...",
        messageColor: "primary",
      });
      const control = this.store.editedControl();
      const error = await this.store.addControl(control);

      this.$q.loading.hide();
      if (!error) {
        this.$q.notify({
          title: "Sucesso",
          message:
            (this.store.control.type == "expense" ? "Despesa " : "Receita ") +
            "salva com sucesso",
          icon: "check",
          color: "green",
          position: "top",
          timeout: 2000,
          closeBtn: "X",
        });
        this.store.control = JSON.parse(
          JSON.stringify(this.store.defaultControl)
        );
      } else {
        {
          this.$q.notify({
            title: "Atenção",
            message:
              (this.store.control.type == "expense" ? "Despesa " : "Receita ") +
              " não pode ser salva, verifique os dados ou contate o suporte.",
            icon: "error",
            color: "red",
            position: "top",
            timeout: 2000,
            closeBtn: "X",
          });
        }
      }
    },
  },
};
</script>
<style lang=""></style>
