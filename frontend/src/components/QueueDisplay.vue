<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { apiService, type DashboardData } from '@/services/api';
import { useAudio } from '@/composables/useAudio';
import Card from '@/components/ui/Card.vue';

const { announceQueue } = useAudio();

const dashboardData = ref<DashboardData | null>(null);
const currentTime = ref(new Date());
const refreshInterval = ref<number>();
const timeInterval = ref<number>();
const lastAnnouncedQueue = ref<string>('');

const fetchData = async () => {
  try {
    const data = await apiService.getDashboardData();
    dashboardData.value = data;
  } catch (err) {
    console.error('Failed to fetch display data:', err);
  }
};

const updateTime = () => {
  currentTime.value = new Date();
};

// Watch for changes in queue data to trigger announcements
watch(dashboardData, (newData) => {
  if (newData && newData.top_staff.length > 0) {
    // This is a simple way to detect new queue calls
    // In a real implementation, you'd want a more sophisticated method
    // like WebSocket or Server-Sent Events for real-time updates
  }
}, { deep: true });

onMounted(() => {
  fetchData();
  updateTime();
  
  // Refresh data every 3 seconds for display
  refreshInterval.value = setInterval(fetchData, 3000);
  
  // Update time every second
  timeInterval.value = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  if (timeInterval.value) {
    clearInterval(timeInterval.value);
  }
});

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('id-ID', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-5xl font-bold text-primary">Sistem Antrian Digital</h1>
        <p class="text-xl text-muted-foreground">{{ formatDate(currentTime) }}</p>
        <p class="text-3xl font-mono font-bold">{{ formatTime(currentTime) }}</p>
      </div>

      <!-- Main Display Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Queue Status -->
        <div class="lg:col-span-2">
          <Card class="p-8">
            <h2 class="text-3xl font-bold mb-6 text-center">Status Antrian</h2>
            
            <div class="grid grid-cols-2 gap-8">
              <!-- Currently Serving -->
              <div class="text-center space-y-4">
                <h3 class="text-xl font-semibold text-muted-foreground">Sedang Dilayani</h3>
                <div class="bg-primary/10 border border-primary/20 rounded-lg p-8">
                  <div class="text-6xl font-bold text-primary mb-2">
                    <!-- This would show the currently called queue in a real implementation -->
                    R003
                  </div>
                  <p class="text-lg text-muted-foreground">Reservasi</p>
                  <p class="text-sm text-muted-foreground">Staff: Lina</p>
                </div>
              </div>

              <!-- Next in Queue -->
              <div class="text-center space-y-4">
                <h3 class="text-xl font-semibold text-muted-foreground">Selanjutnya</h3>
                <div class="bg-secondary/50 border rounded-lg p-8">
                  <div class="text-6xl font-bold text-secondary-foreground mb-2">
                    R004
                  </div>
                  <p class="text-lg text-muted-foreground">Reservasi</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Statistics -->
        <div class="space-y-6">
          <!-- Waiting Count -->
          <Card class="p-6 text-center">
            <h3 class="text-lg font-semibold mb-4">Antrian Menunggu</h3>
            <div class="text-4xl font-bold text-primary">
              {{ dashboardData?.waiting_count || 0 }}
            </div>
          </Card>

          <!-- Active Staff -->
          <Card class="p-6 text-center">
            <h3 class="text-lg font-semibold mb-4">Staff Aktif</h3>
            <div class="text-4xl font-bold text-primary">
              {{ dashboardData?.active_staff_count || 0 }}
            </div>
          </Card>

          <!-- Today's Total -->
          <Card class="p-6 text-center">
            <h3 class="text-lg font-semibold mb-4">Total Hari Ini</h3>
            <div class="text-4xl font-bold text-primary">
              {{ dashboardData?.top_staff.reduce((sum, staff) => sum + staff.total_served, 0) || 0 }}
            </div>
          </Card>
        </div>
      </div>

      <!-- Queue Types Info -->
      <div class="grid grid-cols-2 gap-6">
        <Card class="p-6 text-center">
          <div class="text-4xl mb-4">📅</div>
          <h3 class="text-xl font-semibold mb-2">Reservasi (R)</h3>
          <p class="text-muted-foreground">Pelanggan dengan appointment</p>
        </Card>

        <Card class="p-6 text-center">
          <div class="text-4xl mb-4">🚶</div>
          <h3 class="text-xl font-semibold mb-2">Walk-in (W)</h3>
          <p class="text-muted-foreground">Pelanggan datang langsung</p>
        </Card>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-muted-foreground">
        <p>🔄 Update otomatis setiap 3 detik | Skema: 2 Reservasi : 1 Walk-in</p>
      </div>
    </div>
  </div>
</template>
