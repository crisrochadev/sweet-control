import moment from 'moment'
import configMoment from 'src/config/configMoment'
import { defineStore } from 'pinia'
import 'moment/locale/pt-br'
import { userAuth } from 'src/boot/firebase';
import { createExpense, createSafe, createWallet, deleteExpense, getExpense, getExpensesForMonth, getWallet, getWallets, updateExpense, getSafes } from 'src/boot/database';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
moment.defineLocale('pt-br', configMoment);


export const useDatabase = defineStore('database', {
  state() {

    return {
      q: useQuasar(),
      router: useRouter(),
      date: moment(Date.now()),
      months: configMoment.months,
      currentExpense: 0,
      safes: [],
      wallets: [],
      totalSafe: 0,
      safe: {
        value: null,
        cadastreDate: moment().format('DD/MM/YYYY'),
        walletid: null
      },
      openNewWallet: false,
      currentIncome: 0,
      newExpenseOpen: false,
      currentWallet: useStorage('wallet-name', null),
      openWallets: false,
      wallet: {
        name: null,
        color: null,
        default: false,
      },
      type: "Despesas",
      types: ["Despesas", "Receita", "Tudo"],
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
        delectedType: null,
        wallet: null
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
      console.log('resetar')
      this.expense = {
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
        delectedType: null,
        wallet: null
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
          this.resetExpense()
          return;
        }
        const user = await userAuth();
        this.expense['userid'] = user.uid;
        this.expense['wallet'] = this.currentWallet;

        // Salva a data original para ser usada em cada parcela
        const originalDate = moment(this.expense.date, 'DD/MM/YYYY');

        console.log('VAI ENTRAR AQUI')

        // Verifica se existem parcelas a serem criadas
        if (this.expense.installments > 1) {
          const savedExpense = await createExpense(this.expense);
          for (let i = 1; i < this.expense.installments; i++) {
            // Calcula a data da parcela atual
            this.expense.date = moment(originalDate).add(i, 'months').format('DD/MM/YYYY');
            this.expense.parent = savedExpense;
            this.expense.installment += 1;
            const res = await createExpense(this.expense);
          }
        } else {
          const res = await createExpense(this.expense);

          this.resetExpense();
        }

        // Fecha o modal e reseta o estado da despesa
        this.newExpenseOpen = false;
        this.resetExpense();
        await this.getExpenses()
      });
    },

    async getCurrentWallet() {

      this.loading(async () => {
        const res = await getWallet(this.currentWallet)
        if (Object.keys(res).length > 0) {
          this.wallet = res;
        }
      })
    },
    async getWallets() {
      this.loading(async () => {
        const res = await getWallets();
        this.wallets = res;
      })
    },

    async changeWallet(id) {
      this.currentWallet = id;
      await this.getCurrentWallet()
      await this.getExpenses();
      await this.getSafes();
      this.openWallets = false;
    },
    async createWallet(walletName) {
      this.wallet.name = walletName
      this.loading(async () => {
        if (!this.currentWallet) {
          this.wallet = {
            name: 'Padrão',
            color: 'cyan-6',
            default: true,
          }
        }
        const res = await createWallet(this.wallet);
        if (res) {

          if (!this.currentWallet) {
            this.q.dialog({
              title: "Sucesso!",
              message: 'Sua carteira "Padrão" foi criada!',
              ok: {
                color: 'green',
                label: 'Continuar',
                push: true
              },
              cancel: false,
              persistent: true,
              class: 'bg-grey-9 text-white'
            }).onOk(async () => {
              this.currentWallet = res;
              this.wallet = {
                name: null,
                color: null,
                default: false,
              }
              await this.getWallets()
              await this.getCurrentWallet()
            })
          } else {
            this.currentWallet = res;
            this.wallet = {
              name: null,
              color: null,
              default: false,
            }
            await this.getWallets()
            await this.getCurrentWallet()
            this.openNewWallet = false;
          }
        }
      })
    },
    async getExpenses() {
      this.loading(async () => {

        setTimeout(async () => {
          const totalExpeses = await getExpensesForMonth(this.date.format('DD/MM/YYYY'), this.currentWallet);
          let type = this.type == 'Despesas' ? 'expense' : this.type == 'Receita' ? 'income' : null;
          if(type) this.expenses = totalExpeses.filter(item => item.type === type);
          else this.expenses = totalExpeses;
          console.log(totalExpeses)

          // Resetando os valores de currentExpense e currentIncome
          this.currentExpense = 0;
          this.currentIncome = 0;



          console.log(totalExpeses)


          // Iterando sobre as despesas retornadas e somando os valores de acordo com o tipo
          totalExpeses.forEach(expense => {
            if (expense.type === 'expense') {
              this.currentExpense += Number(expense.ammount.replace(',', '.'));
            } else if (expense.type === 'income') {
              this.currentIncome += Number(expense.ammount.replace(',', '.'));
            }
          });


          // Preenchendo os anos de 2024 até 2085
          for (let year = 2024; year < 2085; year++) {
            this.years.push(year);
          }
        }, 300)
      });
    },
    async getByType(type) {
      this.type = type;
      await this.getExpenses()
    },
    async deleteExpense(expense, { reset }) {

      this.loading(async () => {
        let dialog = {
          title: "Atenção!",
          message: "Deseja deletar " + expense.description + "?" + (expense.mode && expense.mode == 'safe' ? " Este valor será removido do dinheiro guardado! " : ""),
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
            ok: {
              color: 'red',
              class: 'text-white',
              push: true,
              label: 'DELETAR'
            },
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
            cancel: {
              outline: true,
              color: 'white',
              label: "CANCELAR"
            },
            persistent: true
          }
        }
        this.q.dialog(dialog).onOk(async data => {
          if (expense.repeat.value == 3) {
            if (data == 2) {
              expense.delectedDate = moment(this.date).format('DD/MM/YYYY');
              expense.delectedType = 2;
              await updateExpense(expense.id, expense);

            } else if (data == 1) {
              expense.delectedDate = moment(this.date).format('DD/MM/YYYY');
              expense.delectedType = 1;
              await updateExpense(expense.id, expense);

            } else {
              await deleteExpense(expense.id);

            }
          }
          else {
            if (Number(expense.installments) > 1) {

              if (data == 1) {
                await deleteExpense(expense.id);
                if (expense.mode && expense.mode == 'safe') {
                  this.safe['value'] = expense.ammount;
                  await this.createSafe('down')
                  this.safe = {
                    value: null,
                    cadastreDate: moment().format('DD/MM/YYYY'),
                    walletid: null
                  }
                }
                reset()
              } else if (data == 2) {
                const curEx = await getExpense('parent', expense.parent ? expense.parent : expense.id);

                for (let ex of curEx) {
                  if (Number(ex.installment) >= Number(expense.installment)) {
                    await deleteExpense(ex.id);
                  }
                }
                const delthis = await deleteExpense(expense.parent ? expense.parent : expense.id);


              }
              else if (data == 3) {
                const curEx = await getExpense('parent', expense.parent ? expense.parent : expense.id);
                for (let ex of curEx) {
                  await deleteExpense(ex.id);
                }

                await deleteExpense(expense.parent ? expense.parent : expense.id);

              }
            } else {
              await deleteExpense(expense.id);

            }
          }



        }).onCancel(() => {
          reset()
        }).onDismiss(async () => {
          console.log('aqui')
          await this.changeWallet()
          reset()
        })

      })

    },



    async checkExpense(expense, notCheck = false) {
      this.loading(async () => {
        let newexpense = { ...expense }
        let expenseId = newexpense.id
        delete newexpense.id;
        if (!notCheck) newexpense.done = !expense.done;
        await updateExpense(expenseId, newexpense);
        await this.getExpenses()
      })
    },
    async createSafe(type) {
      if (type == 'up' && this.safe.value && Number(this.safe.value.replace(',', '.')) > (this.currentIncome - this.currentExpense)) {
        this.q.dialog({
          ok: {
            color: 'green',
            label: 'Continuar',
            push: true
          },
          cancel: false,
          persistent: true,
          class: 'bg-grey-9 text-white',
          title: 'Atenção',
          message: `O seu saldo é de ${(this.currentIncome - this.currentExpense).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}, você não tem saldo para guardar.`
        });
        return
      }
      this.safe['wallet'] = this.currentWallet;
      this.safe['type'] = type;
      this.safe['walletid'] = this.currentWallet;
      const user = await userAuth();
      this.safe['userid'] = user.uid;

      this.expense = {
        description: 'Dinheiro guardado',
        date: this.safe.cadastreDate,
        repeat: { label: 'Não Repetir', value: 1 },
        ammount: this.safe.value,
        installments: 1,
        type: 'expense',
        done: true,
        installment: 1,
        parent: null,
        delectedDate: null,
        delectedType: null,
        wallet: this.currentWallet,
        mode: 'safe'
      }
      this.loading(async () => {
        if (type == 'up') await this.createExpense();
        await createSafe(this.safe);
        await this.getSafes()
      })
    },
    async getSafes() {
      this.loading(async () => {
        this.safes = await getSafes(this.currentWallet);
        const re = this.safes.reduce((acc, item) => {
          if (item.type == 'down') {
            acc += item.value
          }
          return acc
        }, 0)
        const gua = this.safes.reduce((acc, item) => {
          if (item.type == 'up') {
            acc += item.value
          }
          return acc
        }, 0)

        this.totalSafe = gua - re;
      })
    }
  }
})
