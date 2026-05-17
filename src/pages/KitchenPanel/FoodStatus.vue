<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        <q-icon name="inventory" class="q-mr-sm text-primary" /> Food Availability Status
      </div>
      <q-input outlined dense v-model="search" placeholder="Search Menu Item..." style="width: 250px" bg-color="white">
        <template v-slot:append><q-icon name="search" /></template>
      </q-input>
    </div>

    <div v-if="isLoading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="food in filteredMenu" :key="food.name" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="status-card shadow-1" :class="food.isAvailable ? 'bg-white' : 'bg-red-1'">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-subtitle1 text-weight-bold ellipsis" style="max-width: 70%;">{{ food.name }}</div>
            <q-toggle
              v-model="food.isAvailable"
              checked-icon="check"
              unchecked-icon="clear"
              :color="food.isAvailable ? 'positive' : 'negative'"
              @update:model-value="updateStatus(food)"
            />
          </q-card-section>

          <q-card-section class="q-pt-sm text-caption">
            Status:
            <q-badge :color="food.isAvailable ? 'green' : 'red'" class="q-ml-sm q-px-sm">
              {{ food.isAvailable ? 'In Stock' : 'Out of Stock' }}
            </q-badge>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMenu.length === 0" class="col-12 text-center text-grey q-pa-xl">
        <q-icon name="search_off" size="4em" />
        <div class="text-h6">No menu items found</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const search = ref('')
    const isLoading = ref(false)
    const menuItems = ref([])

    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Fake API Delay
      const saved = localStorage.getItem('saas_menu_items')
      if (saved) {
        menuItems.value = JSON.parse(saved)
      } else {
        menuItems.value = [
          { name: 'Classic Burger', isAvailable: true },
          { name: 'Cheese Pizza', isAvailable: true },
          { name: 'Grilled Chicken', isAvailable: false },
          { name: 'French Fries', isAvailable: true },
          { name: 'Vanilla Shake', isAvailable: true }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    watch(menuItems, (newVal) => {
      localStorage.setItem('saas_menu_items', JSON.stringify(newVal))
    }, { deep: true })

    const filteredMenu = computed(() => {
      return menuItems.value.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
    })

    const updateStatus = async (food) => {
      // API integration point for single item update
      $q.notify({
        color: food.isAvailable ? 'positive' : 'negative',
        message: `${food.name} is now ${food.isAvailable ? 'In Stock' : 'Out of Stock'}`,
        icon: food.isAvailable ? 'check_circle' : 'cancel'
      })
    }

    return { search, menuItems, filteredMenu, isLoading, updateStatus }
  }
}
</script>

<style scoped>
.status-card { border-radius: 12px; transition: all 0.3s ease; }
</style>
