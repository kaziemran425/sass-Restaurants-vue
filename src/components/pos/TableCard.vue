<template>
  <q-card
    v-ripple
    class="cursor-pointer table-card"
    :class="isOccupied ? 'bg-orange-1 border-orange' : 'bg-white'"
    @click="$emit('select')"
  >
    <q-card-section class="text-center">
      <q-icon
        name="table_restaurant"
        size="40px"
        :color="isOccupied ? 'orange-9' : 'blue-grey-4'"
      />
      <div class="text-h6 q-mt-sm">Table {{ label }}</div>
      <q-badge :color="isOccupied ? 'orange' : 'green'" class="q-mt-xs">
        {{ isOccupied ? 'Occupied' : 'Available' }}
      </q-badge>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['label', 'isOccupied'],
  setup() {
    return {}
  }
}
</script>

<style scoped>
.table-card { border-radius: 15px; border: 1px solid #ddd; }
.border-orange { border: 1px solid orange !important; }
</style>
