import moment from "moment";
import { defineStore } from "pinia";
import { supabase } from "src/boot/supabase";
import { useAuth } from "./auth";

export const useControl = defineStore("control", {
  state() {
    const auth = useAuth();
    return {
      auth,
      control: {
        userId: null,
        type: "expense",
        installments: false,
        repeat: "unique",
        ammount: null,
        duedate: moment().format("DD/MM/YYYY"),
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
      defaultControl: {
        userId: null,
        type: "expense",
        installments: false,
        repeat: "unique",
        ammount: null,
        duedate: moment().format("DD/MM/YYYY"),
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
      expenses: [],
      incomings: [],
      totalIncoming: null,
      totalExpense: null,
      month: moment().format("MMMM"),
      year: moment().format("YYYY"),
      currentDate: moment().format("YYYY-MM-DD"),
      currentYear: moment().format("YYYY"),
      currentMonth: moment().format("MM"),
    };
  },
  actions: {
    editedControl() {
      let newcontrol = {};
      Object.entries(this.control).forEach(([key, value]) => {
        Object.entries(this.defaultControl).forEach(([k, v]) => {
          if (k == key && v !== value) {
            if (key == "ammount") {
              newcontrol[key] = parseFloat(value.replace(",", "."));
            } else if (key == "duedate") {
              console.log(value);
              newcontrol[key] = `${value.split("/")[2]}-${
                value.split("/")[1]
              }-${value.split("/")[0]}`;
            } else {
              newcontrol[key] = value;
            }
          }
          if (key == "type") {
            newcontrol[key] = value;
          }
        });
      });

      newcontrol["userId"] = this.auth.session.user.id;
      return newcontrol;
    },
    async addControl(control) {
      console.log(control.duedate);
      let newcontrol = control;
      if (control.installments > 1) {
        newcontrol = [];
        for (let i = 0; i < control.installments; i++) {
          let newc = { ...control };
          let dt = moment(new Date(control.duedate));
          newc["duedate"] = dt.add(i, "months").format("YYYY-MM-DD");
          newc["currentMonth"] = dt.format("MM");
          newc["currentYear"] = dt.format("YYYYY");
          newcontrol.push(newc);
        }
      } else {
      }

      console.log(newcontrol);
      const { error } = await supabase.from("allcontrol").insert(newcontrol);

      console.log(error);
      return error;
    },
    async getAllControls(type) {
      try {
        const { data, error } = await supabase
            .from("allcontrol")
            .select()
            .match({ userId: this.auth.session.user.id, type, type })
            .or(
                `repeat.eq.fixed,and(currentMonth.eq.${this.currentMonth},currentYear.eq.${this.currentYear})`
            );

        if (error) {
            throw new Error('Erro ao buscar dados no Supabase');
        } else {
            console.log('data ', data)
            return data
        }
    } catch (error) {
        console.error(error);


    }
  },



    async getControls() {
      this.expenses = await this.getAllControls('expense');
      this.expenses = await this.getAllControls('incoming');
    },
  },
});
