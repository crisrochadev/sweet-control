import moment from 'moment'
import configMoment from 'src/config/configMoment'
import { defineStore } from 'pinia'
import 'moment/locale/pt-br'
import { userAuth } from 'src/boot/firebase';
import { createExpense, deleteExpense, getExpense, getExpensesForMonth, updateExpense } from 'src/boot/database';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
moment.defineLocale('pt-br', configMoment);

console.log(configMoment)

export const useDatabase = defineStore('database', {
  state() {

    return {
      q: useQuasar(),
      router: useRouter(),
      date: moment(Date.now()),
      months: configMoment.months,
      currentExpense: 4212.44,
      currentIncome: 400.44,
      newExpenseOpen: false,
      years: [],
      expense: {
        description: null,
        date: null,
        repeat: { label: 'Não Repetir', value: 1 },
        ammount: null,
        installments: 1,
        type: 'expense',
        done: false,
        installment: 1,
        parent: null,
        delectedDate: null,
        delectedType: null
      },
      expenses: [],
      year: moment().format('YYYY'),
      day: moment().format('DD'),
      month: moment().format("MM"),
      updateExpenseOpen: false
    }
  },

  getters: {

  },

  actions: {
    async loading(callback) {
      this.q.loading.show()
      await callback()
      this.q.loading.hide()
    },
    resetExpense() {
      this.expense = {
        description: null,
        date: null,
        repeat: { label: 'Não Repetir', value: 1 },
        ammount: null,
        installments: 1,
        type: 'expense',
        expenses: []
      }
    },
    getMonth(type) {
      switch (type) {
        case 3:
          return this.date.format("MMMM")
        case 2:
          return this.date.format("MMM")
        case 1:
          return this.date.format("MM")
        default:
          return this.date.format("MM")

      }
    },
    async resetDate() {
      this.date = moment()
      await this.getExpenses()
    },
    async setDate(type, val) {
      switch (type) {
        case 'month':
          let month = (this.months.indexOf(val) + 1);
          this.month = month <= 9 ? '0' + month : month;
          break;
        case 'year':
          this.year = val;
          break;
        case 'day':
          this.day = val;
          break;
      }
      let date = `${this.year}-${this.month}-${this.day}`

      this.date = moment(date)
      await this.getExpenses()
    },
    async createExpense() {
      this.loading(async () => {
        if (this.updateExpenseOpen) {
          await this.checkExpense(this.expense, true);
          this.updateExpenseOpen = false;
          this.newExpenseOpen = false;
          return;
        }
        const user = await userAuth();
        this.expense['userid'] = user.uid;

        // Salva a data original para ser usada em cada parcela
        const originalDate = moment(this.expense.date, 'DD/MM/YYYY');


        // Verifica se existem parcelas a serem criadas
        if (this.expense.installments > 1) {
          const savedExpense = await createExpense(this.expense);
          for (let i = 1; i < this.expense.installments; i++) {
            // Calcula a data da parcela atual
            this.expense.date = moment(originalDate).add(i, 'months').format('DD/MM/YYYY');
            this.expense.parent = savedExpense;
            this.expense.installment += 1;
            const res = await createExpense(this.expense);
            console.log(res);
          }
        } else {
          const res = await createExpense(this.expense);
          console.log(res);
        }

        // Fecha o modal e reseta o estado da despesa
        this.newExpenseOpen = false;
        this.resetExpense();
        await this.getExpenses()
      });
    },

    async getExpenses() {
      this.loading(async () => {
        const res = await getExpensesForMonth(this.date.format('DD/MM/YYYY'));
        this.expenses = res;

        // Resetando os valores de currentExpense e currentIncome
        this.currentExpense = 0;
        this.currentIncome = 0;

        // Iterando sobre as despesas retornadas e somando os valores de acordo com o tipo
        this.expenses.forEach(expense => {
          console.log(expense)
          if (expense.type === 'expense') {
            console.log(expense.ammount)
            this.currentExpense += Number(expense.ammount.replace(',', '.'));
          } else if (expense.type === 'income') {
            this.currentIncome += Number(expense.ammount.replace(',', '.'));
          }
        });

        // Preenchendo os anos de 2024 até 2085
        for (let year = 2024; year < 2085; year++) {
          this.years.push(year);
        }
      });
    },
    async deleteExpense(expense, { reset }) {
      console.log(expense)
      this.loading(async () => {
        let dialog = {
          title: "Atenção!",
          message: "Deseja deletar " + expense.description + "?",
          cancel: {
            outline: true,
            color: 'white',
            label: "CANCELAR"
          },
          persistent: true,
          class: 'bg-grey-9 text-white',
          ok: {
            color: 'red',
            class: 'text-white',
            push: true,
            label: 'DELETAR'
          },

        }
        if (Number(expense.installments) > 1 || expense.repeat.value == 3) {
          dialog = {
            title: "Atenção!",
            message: "Deseja deletar " + expense.description + "?",
            class: 'bg-grey-9 text-white',
            options: {
              type: 'radio',
              model: 'opt1',
              // inline: true
              items: [
                { label: 'Apenas esta', value: 1, color: 'cyan-6' },
                { label: 'Esta e as próximas', value: 2 },
                { label: 'Todas', value: 3 }
              ]
            },
            cancel: true,
            persistent: true
          }
        }
        this.q.dialog(dialog).onOk(async data => {
          console.log('>>>> OK, received', data)
          if (expense.repeat.value == 3) {
            if (data == 2) {
              expense.delectedDate = moment(this.date).format('DD/MM/YYYY');
              expense.delectedType = 2;
              await updateExpense(expense.id, expense);
              reset()
            } else if (data == 1) {
              expense.delectedDate = moment(this.date).format('DD/MM/YYYY');
              expense.delectedType = 1;
              await updateExpense(expense.id, expense);
              reset()
            } else {
              await deleteExpense(expense.id);
              reset()
            }
          }
          else {
            if (Number(expense.installments) > 1) {
              if (data == 1) {
                await deleteExpense(expense.id);
                reset()
              } else if (data == 2) {
                const curEx = await getExpense('parent', expense.parent ? expense.parent : expense.id);
                console.log(curEx)
                for (let ex of curEx) {
                  if (Number(ex.installment) >= Number(expense.installment)) {
                    await deleteExpense(ex.id);
                  }
                }
                await await deleteExpense(expense.parent ? expense.parent : expense.id);
                reset()
              }
              else if (data == 3) {
                const curEx = await getExpense('parent', expense.parent ? expense.parent : expense.id);
                for (let ex of curEx) {
                  await deleteExpense(ex.id);
                }
                await deleteExpense(expense.parent ? expense.parent : expense.id);
                reset()
              }
            } else {
              await deleteExpense(expense.id);
              reset()
            }
          }


        }).onCancel(() => {
          reset()
        }).onDismiss(async () => {
          await this.getExpenses()
        })

      })

    },
    async checkExpense(expense, notCheck = false) {
      this.loading(async () => {
        let newexpense = { ...expense }
        if (!notCheck) newexpense.done = !expense.done;
        await updateExpense(expense.id, newexpense);
        await this.getExpenses()
      })
    },
  }
})
