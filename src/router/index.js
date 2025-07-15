import { createRouter, createWebHistory } from 'vue-router';
import demoPage from '../views/Demo.vue';


const routes = [
  { path: '/demo', component: demoPage}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;