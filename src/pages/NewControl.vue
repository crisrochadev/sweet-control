<template>
  <q-dialog>
    <q-card style="width: 100dvw">
      <q-card-section
        class="flex justify-between"
        :class="[type == 'expense' ? 'bg-orange' : 'bg-green']"
      >
        <div class="text-h6 uppercase font-bold text-white">
          {{ type == "expense" ? "Nova Despesa" : "Nova Entrada" }}
        </div>
        <q-btn icon="close" flat dense round v-close-popup color="white" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 90vh; width: 100%" class="scroll">
        <q-form class="flex flex-col gap-2">
          <q-input
            class="uppercase font-bold text-sw-primary"
            label="Titulo"
            outlined
            color="orange"
            required
            dense
          />
          <q-input
            class="uppercase font-bold text-sw-primary"
            label="Valor"
            outlined
            color="orange"
            mask="##,##"
            reverse-fill-mask
            required
            prefix="R$"
            dense
          />
          <q-input
            class="uppercase font-bold text-sw-primary"
            label="Data"
            outlined
            color="orange"
            dense
          >
            <!-- <q-date v-model="form.duedate" /> -->
          </q-input>

          <q-btn-toggle
            v-model="form.repeat"
            spread
            dense
            glossy
            size="12px"
            toggle-color="orange"
            color="white"
            text-color="orange"
            class="h-10"
            :options="[
              { label: 'Uma Vez', value: 'unique' },
              { label: 'Parcelado', value: 'installments' },
              { label: 'Fixo', value: 'fixed' },
            ]"
          />
          <q-input
            class="uppercase font-bold text-sw-primary"
            label="Numero de parcelas"
            v-model="form.installments"
            v-if="form.repeat == 'installments'"
            outlined
            color="orange"
            dense
            type="number"
          />

          <q-input
            label="Descrição"
            class="uppercase font-bold text-sw-primary"
            v-model="form.description"
            flat
            outlined
            color="orange"
            dense
            type="textarea"
          />

          <div class="flex gap-2 justify-end items-center mt-4">
            <q-btn
              icon="save"
              label="Salvar"
              color="orange"
              glossy
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: ["type"],
  data() {
    return {
      form: {
        userId: null,
        type: "expense",
        installments: false,
        repeat: "unique",
        ammount: null,
        duedate: null,
        title: null,
        comment: null,
        description: null,
        installments: null,
        currentInstallment: null,
        currentMonth: null,
        completed: false,
        repeatId: null,
        currentYear: null,
        recalculate_id: null,
        haveRecalculate: null,
      },
    };
  },
  watch: {
    repeat(newvalue) {
      this.form.installments = newvalue.repeat == "installments";
    },
  },
};
</script>
<style lang=""></style>
