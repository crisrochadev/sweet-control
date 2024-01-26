import { route } from "quasar/wrappers";
import { useAuth } from "src/stores/auth";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { supabase } from "src/boot/supabase";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((from, to, next) => {
    const auth = useAuth()
    supabase.auth.getSession().then(({ data }) => {
      auth.session = data.session;
    });

    supabase.auth.onAuthStateChange((_, _session) => {
      auth.session = _session;
    });

    console.log(from)
    if (from.name === "admin" || from.name === 'admin_layout') {
      if (!auth.session) {
        next("login");
        return;
      } else {
        next();
      }
    } else {
      next();
    }
  });
  return Router;
});
