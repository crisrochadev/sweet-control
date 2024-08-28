import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { changePassword, login, logout, recoverPass, register, updateUser, userAuth, verifyPassword } from 'src/boot/firebase'
import { useRouter } from 'vue-router'

export const useAuth = defineStore('auth', {
  state() {
    const q = useQuasar()
    const router = useRouter()
    return {
      email: null,
      password: null,
      name: null,
      type: "password",
      q,
      router,
      isPass: false,
      currPass: null
    }
  },

  actions: {
    async loading(callback) {
      this.q.loading.show()
      await callback()
      this.q.loading.hide()
    },
    async login() {
      this.loading(async () => {
        const res = await login(this.email, this.password)
        console.log(res)
        if (res.errorCode) {
          if (res.errorCode == "auth/invalid-credential") {
            this.q.dialog({
              title: "Atenção",
              message: "Dados inválidos, verifique os dados digitados",
              color: "red",
              class: "bg-red text-white",
              ok: {
                flat: true,
                color: 'white',
              }
            })
          }
        } else {
          this.router.push('/admin')
        }
      })
    },
    async register() {
      this.loading(async () => {
        const res = await register(this.name, this.email, this.password)
        if (res.errorCode) {
          console.log(res)
          if (res.errorCode == "auth/email-already-in-use") {
            this.q.dialog({
              title: "Atenção",
              message: "Email já cadastrado, volte e faça login",
              color: "red",
              class: "bg-red text-white",
              ok: {
                flat: true,
                color: 'white',
              }
            })
          }
        } else {

          this.router.push('/admin')
        }
      })
    },
    async recover(isLogged = false) {
      this.loading(async () => {
        const res = await recoverPass(this.email)
        if (res) {
          this.q.dialog({
            title: "Atenção",
            message: isLogged ? "Enviamos um link para recuperação de senha, para seu email" : "Se o email estiver cadastrado na nossa base de dados, enviamos um link para recuperação da sua senha!",
            color: "green",
            class: "bg-green text-white",
            ok: {
              flat: true,
              color: 'white',
            }
          }).onOk(() => {
            if (!isLogged) this.router.push('/')
            if (newkey == 'password') {
              this.currPass = null;
              this.isPass = false;
            }
          })
        }
      })
    },
    async logout() {
      await logout();
      this.router.push('/')
    },
    async getUser() {
      const user = await userAuth()
      console.log(user)
      if (user) {
        this.email = user.email,
          this.name = user.displayName
      }
    },
    async updateUser(key, dialogText = null) {
      let newkey = key == 'name' ? 'displayName' : key;
      this.loading(async () => {
        let res = false;
        if (newkey == 'password') {
          res = await changePassword(this.currPass, this[newkey]);
        }
        else res = await updateUser({ [newkey]: this.value });
        console.log(res)
        if (res) {
          if (dialogText) {
            this.q.dialog({
              title: "Atenção",
              message: dialogText,
              class: 'bg-cyan-10 text-white'
            })
          }
        } else {
          this.q.dialog({
            title: "Atenção",
            message: 'Houve um erro inesperado na atualização dos dados, já estamos trabalhando nisso!',
            class: 'bg-red-10 text-white'
          })
        }
        this[newkey] = null
      })
    },
    async checkPass(password) {
      const user = await userAuth()
      this.currPass = password
      this.loading(async () => {
        console.log(user.email)
        const res = await verifyPassword(user.email, password);
        if (res) {
          this.isPass = true;
        } else {
          this.q.dialog({
            class: 'bg-cyan-800 text-white',
            title: "Erro",
            message: "A senha digitada está errada, por favor, se esqueceu a senha solicite a recuperação",
            cancel: {
              label: "Fechar",
              outline: true,
              color: 'white'
            },
            fullWidth: true,
            ok: {
              label: 'Recuperar',
              color: 'green-6',
              push: true
            }
          }).onOk(async () => {
            this.email = user.email

            await this.recover(true);
          })
        }
      })
    }
  }
})
