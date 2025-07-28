<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService, type QueueEntry } from '@/services/api';
import { useAudio } from '@/composables/useAudio';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';

const { announceQueue } = useAudio();

const staffId = ref(1); // In real app, this would come from auth
const isLoading = ref(false);
const currentCustomer = ref<QueueEntry | null>(null);
const hasBeenCalled = ref(false); // Track if customer has been called
const error = ref('');

const staffOptions = [
  { id: 1, name: 'Lina' },
  { id: 2, name: 'Budi' },
  { id: 3, name: 'Citra' },
];

const callNext = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const customer = await apiService.callNext(staffId.value);
    currentCustomer.value = customer;
    hasBeenCalled.value = true;
    
    // Announce the queue number
    const staffName = staffOptions.find(s => s.id === staffId.value)?.name;
    announceQueue(customer.queue_number, staffName);
  } catch (err: any) {
    if (err.message.includes('404')) {
      error.value = 'Tidak ada antrian yang menunggu';
    } else {
      error.value = 'Gagal memanggil antrian berikutnya';
    }
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const callAgain = () => {
  if (!currentCustomer.value) return;
  
  // Announce the queue number again
  const staffName = staffOptions.find(s => s.id === staffId.value)?.name;
  announceQueue(currentCustomer.value.queue_number, staffName);
};

const markDone = async () => {
  if (!currentCustomer.value) return;
  
  isLoading.value = true;
  
  try {
    await apiService.markAsDone(currentCustomer.value.id);
    currentCustomer.value = null;
    hasBeenCalled.value = false; // Reset state
  } catch (err) {
    error.value = 'Gagal menyelesaikan layanan';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const getTypeLabel = (type: 'R' | 'W') => type === 'R' ? 'Reservasi' : 'Walk-in';
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Panel Staff</h1>
      <p class="text-muted-foreground">Kelola antrian pelanggan</p>
    </div>

    <Card class="p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Pilih Staff</label>
          <select 
            v-model="staffId"
            class="w-full p-2 border rounded-md bg-background"
          >
            <option v-for="staff in staffOptions" :key="staff.id" :value="staff.id">
              {{ staff.name }}
            </option>
          </select>
        </div>

        <div class="flex gap-4">
          <!-- Show "Panggil Antrian Berikutnya" when no customer is being served -->
          <Button 
            v-if="!currentCustomer"
            @click="callNext" 
            :disabled="isLoading"
            size="lg"
            class="flex-1"
          >
            Panggil Antrian Berikutnya
          </Button>
          
          <!-- Show "Panggil Lagi" and "Selesai Layani" when customer is being served -->
          <template v-if="currentCustomer && hasBeenCalled">
            <Button 
              @click="callAgain" 
              :disabled="isLoading"
              variant="outline"
              size="lg"
              class="flex-1"
            >
              Panggil Lagi
            </Button>
            
            <Button 
              @click="markDone" 
              :disabled="isLoading"
              variant="default"
              size="lg"
              class="flex-1"
            >
              Selesai Layani
            </Button>
          </template>
        </div>
      </div>
    </Card>

    <div v-if="error" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
      {{ error }}
    </div>

    <div v-if="currentCustomer">
      <Card class="p-8 bg-primary/5 border-primary/20">
        <div class="text-center space-y-4">
          <h2 class="text-2xl font-bold">Sedang Melayani</h2>
          <div class="text-6xl font-bold text-primary">{{ currentCustomer.queue_number }}</div>
          <p class="text-lg">{{ getTypeLabel(currentCustomer.type) }}</p>
          <p class="text-sm text-muted-foreground">
            Dipanggil: {{ new Date(currentCustomer.created_at).toLocaleString('id-ID') }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-4">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm text-muted-foreground">Status: Sedang Dilayani</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
