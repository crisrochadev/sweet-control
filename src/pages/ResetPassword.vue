<template lang="">
  <div class="w-11/12 max-w-[400px] h-full max-h-[500px] mx-auto mt-6">
    <div class="w-full flex-1 flex justify-center flex-col items-center">
      <div class="flex items-center w-full justify-center gap-2">
        <img src="/inline.png" class="w-full" />
      </div>
    </div>
    <q-form @submit="reset" class="w-full h-full flex flex-col gap-4 mt-4">
      <h2 class="w-full text-center uppercase text-primary text-2xl">
        Redefina sua senha
      </h2>
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
            /[0-9]/.test(val) || 'A senha precisa conter pelo menos um número',
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
      <q-btn
        icon="save"
        size="lg"
        color="primary"
        label="salvar"
        class="full-width"
        type="submit"
      />
    </q-form>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { supabase } from "src/boot/supabase";

export default {
  data() {
    const $q = useQuasar();
    return {
      $q,
      form: {
        password: null,
        c_password: null,
      },
      lookPass: false,
    };
  },
  methods: {
    async reset(e) {
      e.preventDefault();
      const { data, error } = await supabase.auth.updateUser({
        password: this.form.password,
      });

      if (error) {
        if (
          error
            .toString()
            .includes(" New password should be different from the old password")
        ) {
          this.$q.dialog({
            title: "Atenção",
            message: "A nova senha precisa ser diferente da senha antiga",
          });
        }
        if (error.toString().includes("Auth session missing!")) {
          this.$q
            .dialog({
              title: "Atenção",
              message: "Link Expirado",
              ok: {
                color: "primary",
                label: "Inicio",
              },
            })
            .onOk(() => {
              this.$router.push("/");
            })
            .onDismiss(() => {
              this.$router.push("/");
            });
        }
      } else {
        this.$q
          .dialog({
            title: "Sucesso",
            message:
              "Senha Alterada com sucesso, voce sera redirecionado para o inicio",
            ok: {
              color: "primary",
              label: "OK",
            },
          })
          .onOk(() => {
            this.$router.push("/");
          })
          .onDismiss(() => {
            this.$router.push("/");
          });
      }

      console.log(data);
      console.log(error);
    },
  },
};
</script>
<style lang=""></style>
