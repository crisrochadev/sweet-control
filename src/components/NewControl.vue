<template>
  <q-dialog   :position="position" persistent>
    <q-card style="width: 700px; max-width: 95vw;border-radius:10px !important" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-card-section
        class="flex justify-between h-14 items-center py-0 px-2"
        header
      >
        <q-icon
          size="sm"
          :name="
            store.control.type == 'expense'
              ? 'fa-solid fa-share-from-square'
              : 'fa-solid fa-hand-holding-dollar'
          "
        />

        <div class="text-h6 uppercase f-medium  flex gap-2">
          <q-tabs
            v-model="store.control.type"
            :active-color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
          >
            <q-tab name="expense" label="Despesa" />
            <q-tab name="incoming" label="Receita" />
          </q-tabs>
        </div>
        <q-btn
          icon="close"
          size="15px"
          dense
            clearable
          round
          flat
          v-close-popup
          :color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
        />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 90dvh; width: 100%" class="scroll">
        <q-form class="flex flex-col gap-2" @submit="addControl">
          <q-input
            class="font-bold"
            input-class="text-gray-800"
            color="p"
            label="Titulo"
            outlined
            v-model="store.control.title"
            required
            dense
            clearable
          />
          <q-input
            class="uppercase font-bold"
            input-class="text-gray-800"
            color="p"
            label="Valor"
            outlined
            v-model="store.control.ammount"
            required
            dense
            clearable
            prefix="R$"
            inputmode="numeric"
            reverse-fill-mask
            mask="##,##"
          />
          <q-input
            class="uppercase font-bold"
            input-class="text-gray-800"
            color="p"
            label="Data"
            outlined
            v-model="store.control.duedate"
            required
            inputmode="numeric"
            mask="##/##/####"
            dense
            clearable
          >
            <template #after>
              <q-btn icon="event" class="full-height w-10" color="white" text-color="dark" unelevated>
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
                      <q-btn
                        label="Cancel"
                        color="p"
                        flat
                        v-close-popup
                      />
                      <q-btn label="OK" color="p" flat v-close-popup />
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
            clearable
            flat
            size="12px"
            color="white"
            text-color="a"
            :toggle-text-color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
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
            color="p"
            outlined
            v-model="store.control.installments"
            label="Numero de parcelas"
            v-if="store.control.repeat == 'installments'"
            dense
            clearable
            type="number"
          />

          <q-input
            class="font-bold"
            input-class="text-gray-800"
            color="p"
            label="Descrição"
            outlined
            v-model="store.control.description"
            dense
            clearable
            type="textarea"
          />

          <div class="flex gap-2 justify-end items-center mt-4">
               <q-btn
              icon="save"
              :color="store.control.type == 'expense' ? 'red-6' : 'green-6'"
              label="Salvar"
              type="submit"
              size="lg"
              class="full-width rounded-lg"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { QSpinnerPie, useQuasar } from "quasar";
import { useControl } from "src/stores/control";

export default {
  props: {
    position: {
      type: String,
      default: "bottom",
    },
  },
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
        spinnerColor: "p",
        spinnerSize: 140,
        backgroundColor: "a",
        message: "Aguarde...",
        messageColor: "p",
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
          closeBtn: 'X',
        });
        this.store.control = JSON.parse(JSON.stringify(this.store.defaultControl))
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
            closeBtn: 'X',
          });
        }
      }
    },
  },
};
</script>
<style lang=""></style>
