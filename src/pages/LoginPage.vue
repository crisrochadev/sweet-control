<template>
  <div class="w-full h-full bg-gradient-to-r from-purple-50 to-purple-100">
    <component :is="current" v-model:tab="tab">
      <template #header>
        <div class="w-10/12 flex-1 flex justify-center flex-col items-center">
          <div class=" relative w-5/12">
            <img src="/logo.svg" class="object-cover w-full h-full" />
          </div>
          <div class="flex items-center w-full justify-center gap-2">
            <h1
              class="mt-4 sweet-font uppercase text-4xl md:text-[60px] md:leading-[50px] font-[900] text-primary"
            >
              SweetControl
            </h1>
          </div>
          <p
            class="text-2xl md:leading-7 leading-6 text-gray-600 font-light mt-2 text-center"
          >
            Controle suas despesas e receitas de forma simples
          </p>
        </div>
      </template>
      <template #login>
        <CardLogin title="Entrar" v-model:tab="tab">
          <q-form
            @submit="login"
            class="h-full w-full lg:w-8/12 flex flex-col gap-8 justify-center"
          >
            <h2
              class="text-center uppercase text-2xl font-bold text-gray-700 text-primary"
            >
              Entrar
            </h2>
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="email"
              class="border-2 text-sw-primary"
              outlined
              required
              dense
              type="email"
              v-model="form.email"
            />
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Senha"
              class="rounded text-sw-primary"
              outlined
              required
              dense
              v-model="form.password"
              :type="lookPass ? 'text' : 'password'"
            >
              <template #append>
                <q-btn
                  :icon="lookPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                  round
                  flat
                  color="primary"
                  @click="lookPass = !lookPass"
                />
              </template>
            </q-input>
            <p class="text-right -mt-6 text-secondary">
              Esqueceu a senha?
              <q-btn @click="tab = 'recover'" label="recuperar" flat dense />
            </p>

            <q-btn
              type="submit"
              label="Entrar"
              color="primary"
              class="full-width mb-4"
              size="lg"
              dense
            />
          </q-form>
        </CardLogin>
      </template>
      <template #register>
        <CardLogin title="Cadastrar" v-model:tab="tab">
          <q-form
            @submit="register"
            class="h-full w-full lg:w-8/12 flex flex-col gap-2 justify-center"
          >
            <h2
              class="text-center uppercase text-lg font-bold text-gray-700 text-primary"
            >
              Cadastrar
            </h2>
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Nome"
              class="text-sw-primary"
              outlined
              dense
              v-model="form.displayName"
              :rules="[(val) => !!val || 'O Nome é obrigatório']"
            />
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="email"
              class="text-sw-primarymb-4"
              outlined
              dense
              type="email"
              v-model="form.email"
              :rules="[(val) => !!val || 'O Email é obrigatório']"
            />
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Crie uma Senha"
              class="rounded text-sw-primary"
              outlined
              dense
              required
              v-model="form.password"
              :type="lookPass ? 'text' : 'password'"
              :rules="[
                (val) =>
                  /[0-9]/.test(val) ||
                  'A senha precisa conter pelo menos um número',
                (val) =>
                  /[A-Z]/.test(val) ||
                  'A senha precisa conter pelo menos uma letra maiúscula',
                (val) =>
                  (val && val.length > 6) ||
                  'A senha precisa conter 6 caractéres ou mais',
                (val) => !!val || 'A senha é obrigatória',
              ]"
            >
              <template #append>
                <q-btn
                  :icon="lookPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                  round
                  flat
                  required
                  color="primary"
                  @click="lookPass = !lookPass"
                />
              </template>
            </q-input>
            <q-input
              dense
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Confirma a senha"
              class="rounded text-sw-primary"
              outlined
              required
              v-model="form.c_password"
              :type="lookPass ? 'text' : 'password'"
              :rules="[
                (val) => val == form.password || 'As senhas não são iguais',
                (val) => !!val || 'A confirmação de senha é obrigatória',
              ]"
            >
              <template #append>
                <q-btn
                  :icon="lookPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                  round
                  flat
                  color="primary"
                  @click="lookPass = !lookPass"
                />
              </template>
            </q-input>

            <p class="text-gray-700 text-xs lg:text-[15px] ml-2">
              Para continuar, voce precisa conconcordar com:
            </p>
            <div class="flex gap-2 items-center justify-between h-8 -mb-4">
              <div>
                <q-toggle size="xs" required v-model="terms" />

                <q-btn
                  @click="openTerms = true"
                  label="Termos e Serviços"
                  dense
                  flat
                  size="sm"
                  color="primary"
                />
              </div>
              <q-icon
                v-if="errTerms"
                name="mdi-alert-circle"
                class="cursor-pointer"
                size="xs"
                color="red"
              >
                <q-tooltip class="bg-red">
                  Para cadastrar precisa concordar com os termos e serviços
                </q-tooltip>
              </q-icon>
            </div>

            <div class="flex gap-2 items-center justify-between">
              <div>
                <q-toggle size="xs" required v-model="policy" />
                <q-btn
                  label="Política de prívacidade"
                  dense
                  flat
                  size="sm"
                  color="primary"
                  @click="openPolicy = true"
                />
              </div>
              <q-icon
                v-if="errPolicy"
                name="mdi-alert-circle"
                class="cursor-pointer"
                size="xs"
                color="red"
              >
                <q-tooltip class="bg-red">
                  Para cadastrar precisa concordar com a plítica de prívacidade
                </q-tooltip>
              </q-icon>
            </div>
            <q-btn
              type="submit"
              label="Cadastrar"
              color="primary"
              class="full-width mb-4"
              size="lg"
              dense
            />
          </q-form>
        </CardLogin>
      </template>
      <template #recover>
        <CardLogin title="Recuperar senha" v-model:tab="tab">
          <q-form
            @submit="recover"
            class="h-full w-full md:w-8/12 flex flex-col gap-8 justify-center"
          >
            <h2
              class="text-center uppercase text-2xl font-bold text-gray-700 text-primary"
            >
              Recuperar Senha
            </h2>
            <p class="mx-auto leading-5 text-gray-700 font-bold text-lg">
              Digite seu email, que enviaremos um link para recuperação de
              senha.
            </p>
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="email"
              class="border-2 text-sw-primary"
              outlined
              dense
              required
              type="email"
              v-model="form.email"
            />

            <q-btn
              type="submit"
              label="Enviar"
              color="primary"
              class="full-width mb-4"
              size="lg"
              dense
            />
          </q-form>
        </CardLogin>
      </template>
    </component>
  </div>
  <q-dialog v-model="openTerms">
    <q-card class="w-full h-full">
      <q-card-section header class="uppercase font-bold text-primary text-lg">
        <q-item>
          <q-item-section side>
            <q-avatar>
              <q-icon name="manage_accounts" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section> Termos e Serviços </q-item-section>
          <q-item-section side>
            <q-avatar>
              <q-btn
                icon="close"
                round
                flat
                color="primary"
                @click="openTerms = false"
              />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card-section class="h-[calc(100%_-_160px)] w-full">
        <q-scroll-area class="h-full w-full">
          <iframe
            src="/terms-and-services.html"
            class="w-full"
            style="height: 250dvh"
            frameborder="1"
          />
        </q-scroll-area>
      </q-card-section>
      <q-separator />
      <q-card-actions class="flex justify-end gap-2 my-2">
        <q-btn
          label="Fechar"
          color="primary"
          outline
          icon="close"
          @click="openTerms = false"
        />
        <q-btn
          label="Concordar e Fechar"
          color="primary"
          icon="check"
          @click="(form.terms = true), (openTerms = false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="openPolicy">
    <q-card class="w-full h-full">
      <q-card-section header class="uppercase font-bold text-primary text-lg">
        <q-item>
          <q-item-section side>
            <q-avatar>
              <q-icon name="manage_accounts" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section> Politicas de privacidade </q-item-section>
          <q-item-section side>
            <q-avatar>
              <q-btn
                icon="close"
                round
                flat
                color="primary"
                @click="openPolicy = false"
              />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card-section class="h-[calc(100%_-_160px)] w-full">
        <q-scroll-area class="h-full w-full">
          <iframe
            src="/policy-and-privacity.html"
            class="w-full"
            style="height: 180dvh"
            frameborder="1"
          />
        </q-scroll-area>
      </q-card-section>
      <q-separator />
      <q-card-actions class="flex justify-end gap-2 my-2">
        <q-btn
          label="Fechar"
          color="primary"
          outline
          icon="close"
          @click="openPolicy = false"
        />
        <q-btn
          label="Concordar e Fechar"
          color="primary"
          icon="check"
          @click="(form.policy = true), (openPolicy = false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { QSpinnerHourglass, QSpinnerPie, useQuasar } from "quasar";
import MobileLogin from "src/components/MobileLogin.vue";
import DesktopLogin from "src/components/DesktopLogin.vue";
import CardLogin from "src/components/CardLogin.vue";
import { supabase } from "src/boot/supabase";
import { useAuth } from "src/stores/auth";
export default {
  components: { MobileLogin, DesktopLogin, CardLogin },
  data() {
    const $q = useQuasar();
    const auth = useAuth();
    return {
      $q,
      auth,
      tab: "login",
      lookPass: false,
      openTerms: false,
      time: 0,
      openPolicy: false,
      errPolicy: false,
      dial: null,
      errTerms: false,
      form: {
        email: null,
        password: null,
        c_password: null,

        displayName: null,
      },
      terms: false,
      policy: false,
    };
  },

  computed: {
    current() {
      return this.$q.screen.sm || this.$q.screen.xs
        ? "MobileLogin"
        : "DesktopLogin";
    },
  },
  watch: {
    terms(newvalue) {
      // console.log(newvalue);
      if (newvalue) {
        this.errTerms = false;
        return;
      }
    },
    policy(newvalue) {
      // console.log(newvalue);

      if (newvalue) {
        this.errPolicy = false;
        return;
      }
    },
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
    async login(e) {
      e.preventDefault();
      this.show();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.form.email,
        password: this.form.password,
      });
      this.hide();
      if (error) {
        if (error.toString().includes("Invalid login credentials")) {
          this.$q.dialog({
            title: "Não foi possivel entrar",
            message: "Por favor verifique as informações preenchidas",
            ok: "OK",
            color: "red",
          });
          return;
        }
        this.$q.dialog({
          title: "Erro",
          message: "Houve um erro inesperado",
          ok: "OK",
          color: "red",
        });
      }
      if (data && data.user) {
        this.auth.user = data.user;
        this.$router.push({ name: "admin" });
      }
    },
    async register(e) {
      e.preventDefault();
      this.show();
      if (!this.terms) {
        this.errTerms = true;
        this.hide();
        return;
      }
      if (!this.policy) {
        this.errPolicy = true;
        this.hide();
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: this.form.email,
        password: this.form.password,
        displayName: this.displayName,
        options: {
          emailRedirectTo: "http://localhost:9200",
        },
      });

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
        this.hide();
        return;
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
          this.hide();
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
        this.hide();
      }
    },
    async recover(e) {
      e.preventDefault();
      this.show();
      // console.log(process.env.VUE_APP_PROD_URL);
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        this.form.email,
        {
          redirectTo: process.env.VUE_APP_PROD_URL + "/reset",
        }
      );

      if (error) {
        this.hide();
        if (error.toString().includes("For security purposes")) {
          // console.log(error);
          if (error.toString().includes("after")) {
            this.time = Number(
              error.toString().split("after")[1].substring(0, 3)
            );
          }
          if (error.toString().includes("every")) {
            this.time = Number(
              error.toString().split("every")[1].substring(0, 3)
            );
          }
          this.countTime();
          this.dial = this.$q.dialog({
            title: "Acabamos de enviar o email",
            message: `Por favor aguarde ${this.time} segundos`,
            progress: {
              spinner: QSpinnerHourglass,
              color: "primary",
            },
            ok: false,
            color: "red",
          });
        }
      } else {
        this.hide();
        this.$q.dialog({
          title: `Sucesso`,
          message:
            "Enviamos um link para redefinição de senha para o email " +
            this.form.email,
          class: "w-full flex justify-center",

          ok: {
            label: "OK",
            color: "primary",
            outline: true,
          },
          color: "green",
        });
      }
    },
    countTime() {
      setTimeout(() => {
        this.time--;
        this.dial.update({
          message: `Por favor aguarde ${this.time} segundos`,
        });
        if (this.time > 0) {
          this.countTime();
        } else {
          this.dial.hide();
        }
      }, 1000);
    },
  },
};
</script>
<style lang=""></style>
