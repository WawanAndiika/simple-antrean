<script setup lang="ts">
import { ref } from 'vue';
import { apiService, type QueueEntry } from '@/services/api';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';

const isLoading = ref(false);
const lastTicket = ref<QueueEntry | null>(null);
const error = ref('');

const takeNumber = async (type: 'R' | 'W') => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const ticket = await apiService.takeQueueNumber(type);
    lastTicket.value = ticket;
  } catch (err) {
    error.value = 'Gagal mengambil nomor antrian';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const getTypeLabel = (type: 'R' | 'W') => type === 'R' ? 'Reservasi' : 'Walk-in';
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Sistem Antrian Digital</h1>
      <p class="text-muted-foreground">Pilih jenis layanan untuk mengambil nomor antrian</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Card class="p-6 text-center space-y-4">
        <div class="text-4xl">📅</div>
        <h3 class="text-xl font-semibold">Reservasi</h3>
        <p class="text-sm text-muted-foreground">Untuk pelanggan dengan appointment</p>
        <Button 
          @click="takeNumber('R')" 
          :disabled="isLoading"
          class="w-full"
          size="lg"
        >
          Ambil Nomor Reservasi
        </Button>
      </Card>

      <Card class="p-6 text-center space-y-4">
        <div class="text-4xl">🚶</div>
        <h3 class="text-xl font-semibold">Walk-in</h3>
        <p class="text-sm text-muted-foreground">Untuk pelanggan datang langsung</p>
        <Button 
          @click="takeNumber('W')" 
          :disabled="isLoading"
          variant="outline"
          class="w-full"
          size="lg"
        >
          Ambil Nomor Walk-in
        </Button>
      </Card>
    </div>

    <div v-if="error" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
      {{ error }}
    </div>

    <div v-if="lastTicket" class="text-center">
      <Card class="p-8 bg-primary/5 border-primary/20">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Nomor Antrian Anda</h2>
          <div class="text-6xl font-bold text-primary">{{ lastTicket.queue_number }}</div>
          <p class="text-lg">{{ getTypeLabel(lastTicket.type) }}</p>
          <p class="text-sm text-muted-foreground">
            Waktu: {{ new Date(lastTicket.created_at).toLocaleString('id-ID') }}
          </p>
          <p class="text-sm text-muted-foreground">
            Status: <span class="font-medium">{{ lastTicket.status === 'waiting' ? 'Menunggu' : lastTicket.status }}</span>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>
