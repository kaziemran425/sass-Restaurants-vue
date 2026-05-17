<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-weight-bold">Leave Requests</div>

    <div class="row q-col-gutter-md">
      <div v-for="leave in leaves" :key="leave.id" class="col-12 col-md-6">
        <q-card flat bordered style="border-radius: 12px;">
          <q-card-section class="row items-center justify-between no-wrap bg-grey-1">
            <div>
              <div class="text-h6 text-weight-bold">{{ leave.name }}</div>
              <div class="text-caption text-grey-8">{{ leave.type }} | Date: {{ leave.date }}</div>
            </div>
            <q-badge :color="getStatusColor(leave.status)" class="q-pa-sm">{{ leave.status }}</q-badge>
          </q-card-section>

          <q-card-section class="q-py-sm">
            <span class="text-grey-7">Reason:</span> {{ leave.reason || 'No specific reason provided.' }}
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-sm" v-if="leave.status === 'Pending'">
            <q-btn flat color="negative" label="Reject" icon="close" @click="updateStatus(leave.id, 'Rejected')" :loading="isProcessing === leave.id" />
            <q-btn unelevated color="positive" label="Approve" icon="check" @click="updateStatus(leave.id, 'Approved')" :loading="isProcessing === leave.id" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div v-if="leaves.length === 0" class="text-center text-grey q-mt-xl">
      No leave requests found.
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const leaves = ref([])
    const isProcessing = ref(null)

    onMounted(() => {
      const saved = localStorage.getItem('saas_leaves')
      if (saved) leaves.value = JSON.parse(saved)
      else {
        leaves.value = [
          { id: 1, name: 'Alice Smith', type: 'Sick Leave', date: '2026-05-15', reason: 'Fever and cold.', status: 'Pending' },
          { id: 2, name: 'Bob Wilson', type: 'Casual Leave', date: '2026-05-20', reason: 'Family event.', status: 'Pending' }
        ]
      }
    })

    watch(leaves, (newVal) => localStorage.setItem('saas_leaves', JSON.stringify(newVal)), { deep: true })

    const getStatusColor = (status) => {
      if (status === 'Approved') return 'green'
      if (status === 'Rejected') return 'red'
      return 'orange'
    }

    const updateStatus = async (id, status) => {
      isProcessing.value = id
      await new Promise(res => setTimeout(res, 600)) // Mock API Call
      const index = leaves.value.findIndex(l => l.id === id)
      if (index !== -1) leaves.value[index].status = status
      isProcessing.value = null

      $q.notify({
        color: status === 'Approved' ? 'positive' : 'negative',
        message: `Leave request ${status.toLowerCase()}`,
        icon: status === 'Approved' ? 'check_circle' : 'cancel'
      })
    }

    return { leaves, isProcessing, getStatusColor, updateStatus }
  }
}
</script>
