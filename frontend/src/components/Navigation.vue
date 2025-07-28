<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const route = useRoute();

const isActive = (routeName: string) => {
  return route.name === routeName;
};

const links = [
  { name: 'queue-taker', label: 'Ambil Antrian', icon: '🎫' },
  { name: 'staff-panel', label: 'Panel Staff', icon: '👨‍💼' },
  { name: 'dashboard', label: 'Dashboard', icon: '📊' },
  { name: 'queue-display', label: 'Display', icon: '📺' },
];
</script>

<template>
  <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="text-2xl">🏢</div>
          <h1 class="text-xl font-bold">Sistem Antrian</h1>
        </div>
        
        <div class="flex items-center gap-2">
          <router-link
            v-for="link in links"
            :key="link.name"
            :to="{ name: link.name }"
            class="no-underline"
          >
            <Button
              :variant="isActive(link.name) ? 'default' : 'ghost'"
              size="sm"
              class="gap-2"
            >
              <span>{{ link.icon }}</span>
              {{ link.label }}
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
