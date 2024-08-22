import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { userAuth } from 'src/boot/firebase'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const user = await userAuth();

    console.log("ROTA ",user)
    if (to.path.startsWith('/admin')) {
      if (user) {
        next(); // Permite a navegação para rotas administrativas
      } else {
        next('/'); // Redireciona para a home se não estiver autenticado
      }
    } else {
      if (to.name === 'login') {
        if (user) {
          console.log(user)
          next('/admin'); // Redireciona para /admin se estiver autenticado e tentar acessar /
        } else {
          next(); // Permite a navegação para a home se não estiver autenticado
        }
      } else {
        next(); // Permite a navegação para outras rotas não-administrativas
      }
    }
  })

  return Router
})
