
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/main', meta: { requiresAuth: true } },
      { path: '/main', name: 'index', component: () => import('pages/Index.vue'), meta: { requiresAuth: true } },
      { path: '/appeal/:action', name: 'appeal', component: () => import('pages/Appeal.vue'), meta: { requiresAuth: true } },
      { path: '/obr/:nomdobr', name: 'appealnumber', component: () => import('pages/Appeal/Number.vue'), meta: { requiresAuth: true } },
      { path: '/profile', name: 'profile', component: () => import('pages/Profile.vue'), meta: { requiresAuth: true } },
      { path: '/dashboard/appeal', name: 'dashboardappeal', component: () => import('pages/Dashboard/Appeal.vue'), meta: { requiresAuth: true } },
      { path: '/imu/main', name: 'imu', component: () => import('src/pages/Imu/Property.vue'), meta: { requiresAuth: true } },
      { path: '/imu/task/:pk', name: 'imu_task', component: () => import('src/pages/Imu/Task.vue'), meta: { requiresAuth: true } },
      { path: '/imu/archive', name: 'imu_archive', component: () => import('src/pages/Imu/Archive.vue'), meta: { requiresAuth: true } },
      { path: '/imu/template', name: 'imu_template', component: () => import('src/pages/Imu/Template.vue'), meta: { requiresAuth: true } },
      { path: '/block/main', name: 'block_main', component: () => import('src/pages/Block/Block.vue'), meta: { requiresAuth: true } }
    ]
  },
  { path: '/login', name: 'login', component: () => import('pages/Login.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes