import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Calendar from '../views/Calendar.vue';
import Create from '../views/Create.vue';
import ManageAgendamento from '../views/ManageAgendamento.vue';
import Agendamentos from '../views/Agendamentos.vue';
import BlockDay from '../views/BlockDay.vue';
import BlockedDays from '../views/BlockedDays.vue'; 

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/calendar', name: 'Calendar', component: Calendar, meta: { requiresAuth: true } },
  { path: '/create', name: 'Create', component: Create },
  { path: '/manage-agendamento', name: 'ManageAgendamento', component: ManageAgendamento },
  { path: '/agendamentos', name: 'Agendamentos', component: Agendamentos },
  { path: '/block-day', name: 'BlockDay', component: BlockDay }, // Adicionar a rota para BlockDay
  { path: '/blocked-days', name: 'BlockedDays', component: BlockedDays } // Adicionar a rota para BlockedDays 

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token');

  if (requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;