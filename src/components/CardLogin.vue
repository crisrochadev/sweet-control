<template>
  <q-card
    class="h-auto min-h-full w-full flex flex-col justify-between items-center gap-2 p-0 flex-nowrap"
  >
    <q-card-section class="w-full h-[60px] flex justify-between items-center">
      <q-btn
        flat
        dense
        v-if="tabb == 'register' || tabb == 'recover'"
        icon="mdi-arrow-left-thick"
        color="primary"
        :label="tabb == 'register' ? 'Entrar' : 'Voltar'"
        @click="tabb = 'login'"
      />
      <p
        v-if="tabb == 'register'"
        class="flex-1 text-left font-medium text-xs pl-4"
      >
        já tem cadastro?
      </p>
      <p
        v-if="tabb == 'login'"
        class="flex-1 text-right font-medium text-xs pr-4"
      >
        Não tem cadastro?
      </p>
      <q-btn
        flat
        dense
        v-if="tabb == 'login'"
        icon-right="mdi-arrow-right-thick"
        color="primary"
        label="Cadastre-se"
        @click="tabb = 'register'"
      />
    </q-card-section>
    <q-card-section class="w-full flex justify-center flex-wrap items-center">
      <slot />
    </q-card-section>
    <q-card-section class="w-full h-[150px]">
      <div class="relative w-full h-[1px] bg-gray-200">
        <span
          v-if="tabb !== 'recover'"
          class="absolute -top-3 left-2/4 -translate-x-2/4 bg-white text-sw-primary"
          >ou</span
        >
      </div>
      <div class="h-full items-center justify-center flex gap-4 mt-4">
        <q-btn
          icon="mdi-google"
          size="md"
          class="h-10 w-10 lg:h-14 lg:w-14"
          text-color="red-8"
          outline
          @click="google"
          v-if="tabb !== 'recover'"
        />
        <q-btn
          icon="mdi-facebook"
          size="md"
          text-color="blue-8"
          outline
          class="h-10 w-10 lg:h-14 lg:w-14"
          @click="facebook"
          v-if="tabb !== 'recover'"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { QSpinnerPie } from "quasar";
import { supabase } from "src/boot/supabase";
import { useAuth } from "src/stores/auth";

export default {
  props: ["title", "tab", "countTime"],
  emits: ["update:tab"],
  computed: {
    tabb: {
      get() {
        return this.tab;
      },
      set(newvalue) {
        this.$emit("update:tab", newvalue);
      },
    },
  },
  data() {
    const auth = useAuth();
    return {
      auth,
      time: null,
      dial: null,
    };
  },
  methods: {
    show() {
      this.$q.loading.show({
        spinner: QSpinnerPie,
        spinnerColor: "primary",
        spinnerSize: 140,
        backgroundColor: "accent",
        message: "Aguarde...",
        messageColor: "primary",
      });
    },
    hide() {
      this.$q.loading.hide();
    },
    async loginWithProvider(e, provider) {
      e.preventDefault();

      this.show();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      this.hide();
      this.$q.loading.hide();
      if (error) {
        if (error.toString().includes(" Email rate limit exceeded")) {
          this.$q.dialog({
            title: "Erro",
            message:
              "Houve muitas tentativas de cadastro, por favor, tente novamente mais tarde",
            ok: "OK",
            color: "red",
          });

          return;
        } else if (error.toString().includes("For security purposes")) {
          this.time = Number(
            error.toString().split("after")[1].substring(0, 3)
          );
          this.countTime();
          this.dial = this.$q.dialog({
            title: "Acabamos de verificar",
            message: `Por favor aguarde ${this.time} segundos`,
            class: "w-full flex justify-center",
            progress: {
              spinner: QSpinnerHourglass,
              color: "primary",
            },
            ok: false,
            color: "red",
          });
        } else {
          this.$q.dialog({
            title: "Erro",
            message:
              "Houve um erro inesperado no cadastro code + " + error.code,
            ok: "OK",
            color: "red",
          });
        }
      }

      // console.log(data);
      if (data && data.user) {
        this.auth.user = data.user;

        const profile = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            terms: this.terms,
            policy: this.policy,
          })
          .select();
        // console.log(profile);
        if (profile && profile.data) {
          this.auth.user["profile"] = profile.data[0];
          this.$q.dialog({
            title: "Deu Certo!",
            message: `Enviamos um email para ${this.form.email}, por favor, clique no link enviado para confirmar sua conta.`,
            ok: {
              label: "ok",
              color: "primary",
            },
          });
        } else {
          if (profile.error.code == "23503" || profile.error.code == "23505") {
            this.$q
              .dialog({
                title: "Atenção",
                message: "Usuário já Cadastrado",
                ok: {
                  label: "Entrar",
                  color: "primary",
                  outline: true,
                },
                cancel: {
                  label: "sair",
                  color: "grey-8",
                  outline: true,
                },
                color: "primary",
              })
              .onOk(() => {
                this.tab = "login";
              });
          } else {
            const del = await supabase
              .from("profiles")
              .delete()
              .eq("id", data.user.id);

            // console.log(del);

            this.$q.dialog({
              title: "Erro",
              message:
                "Houve um erro inesperado no cadastro - code " +
                profile.error.code,
              ok: "OK",
              color: "red",
            });
          }
        }
      }
    },
    async google(e) {
      e.preventDefault();
      await this.loginWithProvider(e, "google");
    },
    async facebook(e) {
      e.preventDefault();
      await this.loginWithProvider(e, "facebook");
    },
  },
};
</script>
<style lang=""></style>
