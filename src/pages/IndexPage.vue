<template>
  <q-page class="flex flex-center bg-gray-800 text-white">
    <q-form
      @submit.prevent="auth.login"
      class="flex flex-col gap-3 w-full max-w-[400px] p-3 justify-between items-center"
    >
      <div class="flex items-center p-2 rounded">
        <img
          alt="Quasar logo"
          src="~assets/images/logo.png"
          style="width: 70px; height: 70px"
        />
        <h1 class="leading-3 uppercase text-center font-extrabold text-cyan-6">
          <span class="block text-left text-3xl">Sweet</span
          ><span class="block text-left text-xl leading-3">Control</span>
        </h1>
      </div>
      <h2 class="text-center uppercase font-bold text-2xl text-cyan-6">
        Entrar
      </h2>
      <q-input
        dense
        dark
        label="Email:"
        label-color="cyan-6"
        type="email"
        color="cyan-6"
        v-model="auth.email"
        required
        filled
        class="full-width"
      ></q-input>
      <q-input
        dense
        dark
        label="Senha:"
        label-color="cyan-6"
        :type="auth.type"
        color="cyan-6"
        v-model="auth.password"
        filled
        required
        class="full-width"
      >
        <template #append>
          <q-btn
            flat
            dense
            :icon="auth.type == 'text' ? 'visibility_off' : 'visibility'"
            @click="auth.type = auth.type == 'text' ? 'password' : 'text'"
            color="cyan-6"
          />
        </template>
      </q-input>
      <p class="text-sm text-left w-full">
        Esqueceu a senha?
        <q-btn dense flat size="sm" color="cyan-6" to="/recover"
          >Recuperar</q-btn
        >
      </p>
      <q-btn
        label="Entrar"
        push
        class="full-width"
        size="lg"
        color="cyan-6"
        type="submit"
      />
      <p class="text-sm text-center w-full">
        Não tem cadastro?
        <q-btn dense flat size="sm" color="cyan-6" to="/register"
          >Cadastrar</q-btn
        >
      </p>
    </q-form>
  </q-page>
</template>

<script>
import { useAuth } from "src/stores/auth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    const auth = useAuth();
    return {
      auth,
    };
  },
  mounted() {
    console.log(this.auth.type);
  },
});
</script>
