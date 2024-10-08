const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: "login", component: () => import('pages/IndexPage.vue')
      },
      { path: 'recover', component: () => import('pages/RecoverPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      {
        path: 'admin', component: () => import('layouts/AdminLayout.vue'), children: [
          { path: '', component: () => import('pages/admin/IndexPage.vue') },
          { path: 'wallets', component: () => import('pages/admin/WalletsPage.vue') },
          { path: 'dashboard', component: () => import('pages/admin/DashboardPage.vue') },
          { path: 'user', component: () => import('pages/admin/UserPage.vue') },
        ]
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
