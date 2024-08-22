<template>
  <q-page class="flex flex-center bg-gray-800 text-white">
    <q-form
    @submit.prevent="auth.recover"
      class="flex flex-col gap-3 w-full max-w-[400px] p-3 justify-between items-center"
    >
      <div class="flex items-center p-2 rounded">
        <img
          alt="Quasar logo"
          src="~assets/images/logo.png"
          style="width: 70px; height: 70px"
        />
        <h1
          class="leading-3 uppercase text-center font-extrabold text-cyan-6 "
        >
          <span class="block text-left text-3xl">Sweet</span
          ><span class="block text-left text-xl leading-3">Control</span>
        </h1>
      </div>
      <h2 class="text-center uppercase font-bold text-2xl text-cyan-6">Recuperar Senha</h2>
      <p>Enviaremos um email com o link para recuperar sua senha</p>
      <q-input
      required
        dense
        dark
        label="Email:"
        label-color="cyan-6"
        type="email"
        color="cyan-6"
        v-model="auth.email"
        filled
        class="full-width"
      ></q-input>

      <q-btn
        label="Enviar"
        push
        class="full-width"
        size="lg"
        color="cyan-6"
        type="submit"
      />
      <p class="text-sm text-center w-full">
        Lembrou a senha?
        <q-btn dense flat size="sm" color="cyan-6" to="/">Entrar</q-btn>
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
      auth
    };
  },
  mounted(){
    console.log(this.auth.type)
  }
});
</script>
