<template>
  <q-page padding>
    <div class="w-full flex flex-col gap-2">
      <q-input
        filled
        color="cyan-6"
        label-color="cyan-6"
        label="Nome"
        dense
        input-class="text-white"
        v-model="auth.name"
      />
      <q-input
        filled
        color="cyan-6"
        label-color="cyan-6"
        label="Email"
        dense
        input-class="text-white"
        v-model="auth.email"
      />
      <fieldset class="border border-cyan-600 rounded p-2">
        <legend
          class="leading-3 uppercase text-sm font-bold text-cyan-600 py-2"
        >
          Atualizar senha
        </legend>
        <q-form class="w-full flex flex-col gap-2">
          <q-input
            filled
            color="cyan-6"
            :type="type"
            label-color="cyan-6"
            label="Senha"
            dense
            input-class="text-white"
            v-model="password"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                size="sm"
                color="cyan-6"
                :icon="type == 'password' ? 'visibility' : 'visibility_off'"
                @click="type = type == 'password' ? 'text' : 'password'"
              />
            </template>
          </q-input>
          <q-input
            filled
            color="cyan-6"
            :type="type"
            label-color="cyan-6"
            label="Confirme a senha"
            dense

            input-class="text-white"
            v-model="confirm_password"
          >
            <template #append>
              <q-btn
                round
                dense
                flat
                size="sm"
                color="cyan-6"
                :icon="type == 'password' ? 'visibility' : 'visibility_off'"
                @click="type = type == 'password' ? 'text' : 'password'"
              />
            </template>
          </q-input>
          <q-btn
            class="full-width"
            color="cyan-6"
            label="salvar"
            push
            type="submit"
          />
        </q-form>
      </fieldset>
    </div>
  </q-page>
</template>

<script>
import { useAuth } from "src/stores/auth";

export default {
  data() {
    return {
      auth: useAuth(),
      password: null,
      confirm_password: null,
      type:'password'
    };
  },
  async mounted() {
    await this.auth.getUser();
  },
};
</script>
