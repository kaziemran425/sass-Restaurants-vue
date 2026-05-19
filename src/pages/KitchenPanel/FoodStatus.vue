<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-dark">
        <q-icon name="restaurant_menu" class="q-mr-sm text-primary" /> Food Availability Status
      </div>
      <div class="row q-gutter-sm items-center">
        <q-input
          outlined
          dense
          v-model="search"
          placeholder="Search items or category..."
          style="width: 280px"
          bg-color="white"
          clearable
        >
          <template v-slot:append><q-icon name="search" /></template>
        </q-input>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center" style="height: 40vh;">
      <q-spinner-dots color="primary" size="4em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="food in filteredMenu" :key="food.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card
          flat
          bordered
          class="status-card shadow-1 column full-height"
          :class="food.isAvailable ? 'bg-white' : 'bg-red-1 border-red'"
        >
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="row items-center no-wrap" style="width: 75%;">
              <q-avatar
                :color="food.isAvailable ? 'blue-1' : 'red-2'"
                :text-color="food.isAvailable ? 'primary' : 'negative'"
                size="md"
                class="q-mr-sm shadow-1"
              >
                <q-icon :name="getCategoryIcon(food.category)" size="sm" />
              </q-avatar>
              <div class="text-subtitle1 text-weight-bold ellipsis text-dark" :title="food.name">
                {{ food.name }}
              </div>
            </div>

            <q-toggle
              v-model="food.isAvailable"
              checked-icon="check"
              unchecked-icon="clear"
              :color="food.isAvailable ? 'positive' : 'negative'"
              @update:model-value="updateStatus(food)"
            >
              <q-tooltip>{{ food.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock' }}</q-tooltip>
            </q-toggle>
          </q-card-section>

          <q-card-section class="q-pt-md text-caption row justify-between items-center">
            <span class="text-grey-7 text-weight-medium">{{ food.category }}</span>
            <q-badge
              :color="food.isAvailable ? 'green-6' : 'red-6'"
              class="q-px-sm q-py-xs text-weight-bold shadow-1"
            >
              {{ food.isAvailable ? 'In Stock' : 'Out of Stock' }}
            </q-badge>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="filteredMenu.length === 0" class="col-12 flex flex-center column text-grey-6 q-pa-xl" style="height: 40vh;">
        <q-icon name="search_off" size="5em" class="opacity-50 q-mb-md" />
        <div class="text-h6">No menu items found</div>
        <div class="text-caption">Try adjusting your search query.</div>
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
        // Enriched dummy data mapping to the POS items you have
        menuItems.value = [
          { id: 1, name: 'Beef Burger Combo', category: 'Fast Food', isAvailable: true },
          { id: 2, name: 'Chicken Pasta Alfredo', category: 'Fast Food', isAvailable: true },
          { id: 3, name: 'BBQ Chicken Pizza (L)', category: 'Pizza', isAvailable: false },
          { id: 4, name: 'French Fries', category: 'Fast Food', isAvailable: true },
          { id: 5, name: 'Cold Coffee', category: 'Drinks', isAvailable: true },
          { id: 6, name: 'Chocolate Brownie', category: 'Dessert', isAvailable: false },
          { id: 7, name: 'Mango Shake', category: 'Drinks', isAvailable: true }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save changes to LocalStorage
    watch(menuItems, (newVal) => {
      localStorage.setItem('saas_menu_items', JSON.stringify(newVal))
    }, { deep: true })

    const filteredMenu = computed(() => {
      if (!search.value) return menuItems.value

      const lowerSearch = search.value.toLowerCase()
      return menuItems.value.filter(item =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch)
      )
    })

    const updateStatus = async (food) => {
      // In a real app, this might trigger an API call to sync across the POS terminals
      $q.notify({
        color: food.isAvailable ? 'positive' : 'negative',
        message: `${food.name} is now ${food.isAvailable ? 'In Stock' : 'Out of Stock'}`,
        icon: food.isAvailable ? 'check_circle' : 'cancel',
        position: 'top-right'
      })
    }

    const getCategoryIcon = (category) => {
      switch(category) {
        case 'Fast Food': return 'lunch_dining'
        case 'Pizza': return 'local_pizza'
        case 'Drinks': return 'local_cafe'
        case 'Dessert': return 'cake'
        case 'Platter': return 'ramen_dining'
        default: return 'restaurant'
      }
    }

    return {
      search,
      menuItems,
      filteredMenu,
      isLoading,
      updateStatus,
      getCategoryIcon
    }
  }
}
</script>

<style scoped>
.status-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}
.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
  border-color: var(--q-primary);
}
.border-red {
  border-color: var(--q-negative) !important;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
