<template>
  <q-card v-ripple class="cursor-pointer product-card shadow-1" @click="$emit('add')">
    <q-img :src="img" :ratio="1">
      <div class="absolute-bottom text-subtitle2 text-center q-pa-xs bg-black-5">
        ৳ {{ price }}
      </div>
    </q-img>
    <q-card-section class="q-pa-sm text-center">
      <div class="text-weight-bold ellipsis">{{ name }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['name', 'price', 'img'],
  setup() {
    return {}
  }
}
</script>

<style scoped>
.product-card { border-radius: 12px; transition: 0.3s; }
.product-card:hover { transform: scale(1.02); }
</style>
