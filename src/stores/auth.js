import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { login, logout, recoverPass, register, userAuth } from 'src/boot/firebase'
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
      router
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
    async recover() {
      this.loading(async () => {
        const res = await recoverPass(this.email)
        if (res) {
          this.q.dialog({
            title: "Atenção",
            message: "Se o email estiver cadastrado na nossa base de dados, enviamos um link para recuperação da sua senha!",
            color: "green",
            class: "bg-green text-white",
            ok: {
              flat: true,
              color: 'white',
            }
          }).onOk(() => this.router.push('/'))
        }
      })
    },
    async logout() {
      await logout();
      this.router.push('/')
    },
    async getUser(){
      const user = await  userAuth()
      console.log(user)
      if(user){
        this.email = user.email,
        this.name = user.displayName
      }
    }
  }
})
