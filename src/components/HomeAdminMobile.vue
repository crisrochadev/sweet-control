<template>
  <q-page padding>
    <div class="flex justify-between items-center mb-4">
      <q-btn-dropdown
        :label="db.type"
        flat
        dense
        :color="db.type == 'Despesas' ? 'red-5' : db.type == 'Tudo' ? 'white' : 'green-6'"
        class="w-[calc(33%_-_15px)]"
        size="sm"
      >
        <q-list dense class="bg-gray-700 text-white">
          <q-item
            v-for="t in db.types"
            :key="t"
            clickable
            v-close-popup
            @click="() => db.getByType(t)"
            :class="[t == db.type ? 'bg-cyan-900' : '']"
          >
            <q-item-section class="uppercase font-bold text-[12px]">{{
              t
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        icon="redo"
        flat
        round
        color="cyan-6"
        size="sm"
        @click="db.resetDate"
      />
      <q-btn-dropdown
        size="sm"
        :label="db.getMonth(3)"
        flat
        dense
        color="white"
        class="w-2/5"
      >
        <q-list dense class="bg-gray-700 text-white">
          <q-item
            v-for="month in db.months"
            :key="month"
            clickable
            v-close-popup
            :class="[
              db.months.indexOf(month) + 1 == db.month ? 'bg-cyan-900' : '',
            ]"
            @click="
              () => {
                db.setDate('month', month);
              }
            "
          >
            <q-item-section class="uppercase font-bold text-[12px]">{{
              month
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown
        size="sm"
        :label="db.year"
        flat
        dense
        color="white"
        class="w-1/5"
      >
        <q-list dense class="bg-gray-700 text-white h-64 overflow-y-auto">
          <q-item
            v-for="year in db.years"
            :key="year"
            clickable
            v-close-popup
            :class="[year == db.year ? 'bg-cyan-900' : '']"
            @click="
              () => {
                db.setDate('year', year);
              }
            "
          >
            <q-item-section class="uppercase font-bold text-[12px]">{{
              year
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div
      class="w-full flex items-center justify-between mt-2 border-b-2 pb-1 border-gray-700"
    >
      <div class="text-md text-cyan-600">
        <p class="text-[12px] text-white">Receita</p>
        <p>
          {{
            db.currentIncome.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
      </div>
      <div>
        <p class="text-[12px] text-white">Despesas</p>
        <p class="text-md text-red-500">
          {{
            db.currentExpense.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
      </div>
      <div
        class="text-md"
        :class="
          db.currentIncome > db.currentExpense
            ? 'text-green-500'
            : db.currentExpense == db.currentIncome
            ? 'text-yellow-500'
            : 'text-red-500'
        "
      >
        <p class="text-[12px] text-white">Saldo</p>
        <p>
          {{
            (db.currentIncome - db.currentExpense).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
      </div>
    </div>
    <q-scroll-area class="h-[calc(100svh_-_195px)] pb-10 pt-2 ">
      <q-list>
        <q-slide-item
          class="rounded shadow-md bg-gray-900 my-2 hover:bg-gray-700"
          right-color="red"
          left-color="cyan-5"
          @right="(props) => db.deleteExpense(expense, props)"
          @left="(props) => openExpense(expense, props)"
          v-for="expense in db.expenses"
          :key="expense.id"
        >
          <template v-slot:left>
            <q-icon
              :name="
                expense.done
                  ? 'edit'
                  : 'edit'
              "
            />
          </template>
          <template v-slot:right>
            <q-icon name="delete" color="white" />
          </template>
          <q-item  class="w-full">
            <q-item-section side>
              <q-btn
              @click="() => db.checkExpense(expense)"
                :icon="
                  expense.done
                    ? 'fa-solid fa-thumbs-up'
                    : 'fa-solid fa-thumbs-down'
                "
                dense flat
                :color="expense.done ? 'green' : 'red'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label caption class="text-gray-300 text-[12px]">{{
                expense.date.toLocaleString("pt-BR", { style: "date" })
              }}</q-item-label>
              <q-item-label class="text-white">{{
                expense.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section
              side
              class="text-sm font-extrabold"
              :class="[
                expense.type == 'expense' ? 'text-red-600' : 'text-cyan-600',
              ]"
            >
              {{
                expense.ammount.toLocaleString("pt-br", {
                  currency: "BRL",
                  style: "currency",
                })
              }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </q-scroll-area>
    <q-dialog
      full-width
      full-height
      v-model="db.newExpenseOpen"
      position="top"
    >
      <q-card class="bg-cyan-900 h-full">
        <div class="flex w-full justify-between items-center px-2">
          <q-tabs
            class="flex-1 text-gray-300"
            dense
            v-model="db.expense.type"
            active-color="cyan-6"
          >
            <q-tab label="Despesa" name="expense" />
            <q-tab label="Receita" name="income" />
          </q-tabs>
        </div>
        <q-form
          @submit.prevent="db.createExpense"
          class="p-2 flex justify-between flex-col gap-2 h-[calc(100%_-_50px)]"
        >
          <div>
            <q-input
              label="Descrição"
              filled
              dense
              :rules="[(val) => !!val || 'Preencha esse campo']"
              v-model="db.expense.description"
              color="cyan-6"
              input-class="text-white"
              label-color="cyan-6"
            />
            <q-input
              label="Vencimento"
              filled
              dense
              v-model="db.expense.date"
              color="cyan-6"
              input-class="text-white"
              label-color="cyan-6"
              mask="##/##/####"
              :rules="[(val) => !!val || 'Preencha esse campo']"
              inputmode="numeric"
            >
              <template #append>
                <q-btn icon="calendar_month" color="cyan-6" round dense flat>
                  <q-menu>
                    <q-date
                      v-model="db.expense.date"
                      minimal
                      mask="DD/MM/YYYY"
                      :locale="myLocale"
                    ></q-date>
                  </q-menu>
                </q-btn>
              </template>
            </q-input>
            <q-input
              label="Valor"
              prefix="R$"
              class="text-cyan-6"
              filled
              required
              :rules="[(val) => !!val || 'Preencha esse campo']"
              dense
              mask="#,##"
              inputmode="numeric"
              :reverse-fill-mask="true"
              color="cyan-6"
              v-model="db.expense.ammount"
              input-class="text-white"
              label-color="cyan-6"
            />
            <q-select
              label="Repetir"
              filled
              :rules="[(val) => !!val || 'Preencha esse campo']"
              dense
              dark
              v-model="db.expense.repeat"
              color="cyan-6"
              input-class="text-white"
              label-color="cyan-6"
              option-value="value"
              option-label="label"
              :options="[
                { label: 'Não repetir', value: 1 },
                { label: 'Repetir mensalmente', value: 2 },
                { label: 'Fixo', value: 3 },
              ]"
            />
            <q-input
              label="Número de parcelas"
              v-if="db.expense.repeat.value == 2"
              filled
              dense
              color="cyan-6"
              input-class="text-white"
              label-color="cyan-6"
              v-model="db.expense.installments"
            />
          </div>
          <div class="w-full flex items-center justify-between">
            <q-btn
              type="button"
              label="Cancelar"
              @click="db.newExpenseOpen = false"
              flat
              color="cyan-6"
              push
              size="md"
            />
            <q-btn type="submit" label="Salvar" color="cyan-6" push size="md" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { useDatabase } from "src/stores/database";

export default {
  data() {
    const db = useDatabase();
    return {
      db,
      myLocale: {
        /* começando com Domingo */
        days: "Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado".split("_"),
        daysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
        months:
          "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split(
            "_"
          ),
        monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split(
          "_"
        ),
        firstDayOfWeek: 1, // 0-6, 0 - Domingo, 1 - Segunda, ...
        format24h: true,
        pluralDay: "dias",
      },
    };
  },
  async mounted() {
    await this.db.getExpenses();
  },
  computed: {
    year: {
      get() {
        return this.db.date.format("YYYY");
      },
      set(val) {
        let newval = Number(val);
        if (newval && newval != "" && newval > 1000) {
          this.db.setDate(`${newval}-${this.db.date.format("MM")}-01`);
        }
      },
    },
    day: {
      get() {
        return this.db.date.format("DD");
      },
      set(val) {
        let newval = Number(val);
        if (newval && newval != "" && newval > 0 && newval < 32) {
          this.db.setDate(
            `${this.db.year}-${this.db.date.format("MM")}-${newval}`
          );
        }
      },
    },
  },
  methods: {
    openExpense(expense, {reset}) {
      this.db.expense = {
        description: expense.description,
        date: expense.date,
        repeat: expense.repeat,
        ammount: expense.ammount,
        installments: expense.installments,
        type: expense.type,
        id: expense.id,
        done: expense.done,
      };
      this.db.newExpenseOpen = true;
      this.db.updateExpenseOpen = true;
      reset()
    },
  },
};
</script>
