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
          newc["duedate"] = moment(new Date(control.duedate))
            .add(i, "months")
            .format("YYYY-MM-DD");
          newcontrol.push(newc);
        }
      }
      const { error } = await supabase.from("allcontrol").insert(newcontrol);

      return error;
    },
  },
});
