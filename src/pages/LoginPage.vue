<template>
  <div class="w-full h-full">
    <component :is="current" v-model:tab="tab">
      <template #header>
        <div class="w-full flex-1 flex justify-center flex-col items-center">
          <img src="/Finances.png" class="object-cover" />
          <div class="flex items-center w-full justify-center gap-2">
            <img src="/app-2.png" class="w-[80px] md:w-[120px]" />
            <h1
              class="sweet-font uppercase text-3xl md:text-[60px] md:leading-[50px] font-[900] text-primary"
            >
              <p>Sweet</p>
              <p>Control</p>
            </h1>
          </div>
          <p
            class="text-2xl md:text-2xl leading-7 text-gray-600 mt-2 text-center"
          >
            Controle suas despesas e receitas de forma simples
          </p>
        </div>
      </template>
      <template #login>
        <CardLogin title="Entrar" v-model:tab="tab">
          <q-form class="h-full w-full flex flex-col gap-8 justify-center">
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
              type="email"
              v-model="form.email"
            />
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Senha"
              class="rounded text-sw-primary"
              outlined
              required
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
            />
          </q-form>
        </CardLogin>
      </template>
      <template #register>
        <CardLogin title="Cadastrar" v-model:tab="tab">
          <q-form class="h-full w-full flex flex-col gap-4 justify-center">
            <h2
              class="text-center uppercase text-2xl font-bold text-gray-700 text-primary"
            >
              Cadastrar
            </h2>
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="email"
              class="border-2 text-sw-primary"
              outlined
              type="email"
              v-model="form.email"
            />
            <q-input
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Crie uma Senha"
              class="rounded text-sw-primary"
              outlined
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
              input-class="text-sw-primary text-lg font-bold placeholder:uppercase text-sm"
              placeholder="Confirma a senha"
              class="rounded text-sw-primary"
              outlined
              required
              v-model="form.c_password"
              :type="lookPass ? 'text' : 'password'"
              :rules="[
                (val) => val == form.password || 'As senhas não são iguais',
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

            <div class="flex gap-2">
              <q-toggle required v-model="form.terms">Concordo com os </q-toggle
              ><q-btn
                @click="openTerms = true"
                label="Termos e Serviços"
                dense
                flat
                color="grey-8"
              />
            </div>
            <div class="flex gap-2">
              <q-toggle required v-model="form.policy">Concordo com a </q-toggle>
              <q-btn
                label="Política de privacidade"
                dense
                flat
                color="grey-8"
                @click="openPolicy = true"
              />
            </div>
            <q-btn
              type="submit"
              label="Cadastrar"
              color="primary"
              class="full-width mb-4"
              size="lg"
            />
          </q-form>
        </CardLogin>
      </template>
      <template #recover>
        <CardLogin title="Recuperar senha" v-model:tab="tab">
          <q-form class="h-full w-full flex flex-col gap-8 justify-center">
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
import { useQuasar } from "quasar";
import MobileLogin from "src/components/MobileLogin.vue";
import DesktopLogin from "src/components/DesktopLogin.vue";
import CardLogin from "src/components/CardLogin.vue";
export default {
  components: { MobileLogin, DesktopLogin, CardLogin },
  data() {
    const $q = useQuasar();
    return {
      $q,
      tab: "login",
      lookPass: false,
      openTerms: false,
      openPolicy: false,
      form: {
        email: null,
        password: null,
        c_password: null,
        terms: false,
        policy: false,
      },
    };
  },
  computed: {
    current() {
      return this.$q.screen.sm ? "MobileLogin" : "DesktopLogin";
    },
  },
};
</script>
<style lang=""></style>
