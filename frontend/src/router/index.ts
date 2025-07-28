import { createRouter, createWebHistory } from 'vue-router';
import QueueTaker from '@/components/QueueTaker.vue';
import StaffPanel from '@/components/StaffPanel.vue';
import Dashboard from '@/components/Dashboard.vue';
import QueueDisplay from '@/components/QueueDisplay.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'queue-taker',
      component: QueueTaker,
    },
    {
      path: '/staff',
      name: 'staff-panel',
      component: StaffPanel,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/display',
      name: 'queue-display',
      component: QueueDisplay,
    },
  ],
});

export default router;
