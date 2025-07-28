<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { apiService, type DashboardData } from '@/services/api';
import Card from '@/components/ui/Card.vue';

const dashboardData = ref<DashboardData | null>(null);
const isLoading = ref(false);
const error = ref('');
const refreshInterval = ref<number>();

const fetchDashboardData = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const data = await apiService.getDashboardData();
    dashboardData.value = data;
  } catch (err) {
    error.value = 'Gagal memuat data dashboard';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
  // Refresh every 5 seconds
  refreshInterval.value = setInterval(fetchDashboardData, 5000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Dashboard Monitoring</h1>
      <p class="text-muted-foreground">Pantau status antrian dan performa staff</p>
    </div>

    <div v-if="error" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
      {{ error }}
    </div>

    <div v-if="dashboardData" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Waiting Count -->
      <Card class="p-6 text-center">
        <div class="text-4xl mb-2">⏳</div>
        <div class="text-3xl font-bold text-primary">{{ dashboardData.waiting_count }}</div>
        <p class="text-sm text-muted-foreground">Antrian Menunggu</p>
      </Card>

      <!-- Active Staff -->
      <Card class="p-6 text-center">
        <div class="text-4xl mb-2">👥</div>
        <div class="text-3xl font-bold text-primary">{{ dashboardData.active_staff_count }}</div>
        <p class="text-sm text-muted-foreground">Staff Aktif</p>
      </Card>

      <!-- Total Served Today -->
      <Card class="p-6 text-center">
        <div class="text-4xl mb-2">✅</div>
        <div class="text-3xl font-bold text-primary">
          {{ dashboardData.top_staff.reduce((sum, staff) => sum + staff.total_served, 0) }}
        </div>
        <p class="text-sm text-muted-foreground">Total Dilayani</p>
      </Card>
    </div>

    <!-- Top Staff Performance -->
    <div v-if="dashboardData">
      <Card class="p-6">
        <h2 class="text-2xl font-bold mb-4">Top 3 Staff Performance</h2>
        <div class="space-y-4">
          <div 
            v-for="(staff, index) in dashboardData.top_staff" 
            :key="staff.name"
            class="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
          >
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {{ index + 1 }}
              </div>
              <div>
                <p class="font-semibold">{{ staff.name }}</p>
                <p class="text-sm text-muted-foreground">Staff</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold">{{ staff.total_served }}</p>
              <p class="text-sm text-muted-foreground">Pelanggan Dilayani</p>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Auto Refresh Indicator -->
    <div class="text-center text-sm text-muted-foreground">
      <div class="flex items-center justify-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        Auto refresh setiap 5 detik
      </div>
    </div>
  </div>
</template>
