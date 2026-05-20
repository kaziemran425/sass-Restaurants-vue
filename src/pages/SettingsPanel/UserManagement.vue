<template>
  <q-page padding class="bg-grey-2">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-red-13">
         <q-icon name="manage_accounts" class="q-mr-sm text-red-13" /> System Users
      </div>
      <q-btn color="teal-13" icon="person_add"  dense label="Add New User" @click="openDialog()" />
    </div>

    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-username="props">
          <q-td :props="props" class="text-weight-bold text-dark">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge :color="getRoleColor(props.value)" class="q-px-sm q-py-xs text-weight-bold shadow-1">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <div v-if="props.row.role !== 'Super Admin' || props.row.id !== 1">
              <q-btn flat round dense icon="edit" color="blue-7" size="sm" class="q-mr-xs" @click="openDialog(props.row)">
                <q-tooltip>Edit User</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="lock_reset" color="orange-8" size="sm" class="q-mr-xs" @click="resetPassword(props.row)">
                <q-tooltip>Reset Password</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="delete" color="negative" size="sm" @click="deleteUser(props.row.id)">
                <q-tooltip>Delete User</q-tooltip>
              </q-btn>
            </div>
            <div v-else class="text-grey-6 text-caption italic">System Protected</div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="group_off" class="q-mb-md opacity-50" />
            <div class="text-h6">No system users found.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="userDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center justify-between q-pb-md">
          <div class="text-h6">{{ isEditMode ? 'Edit User' : 'Create System User' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit.prevent="saveUser">
          <q-card-section class="q-pt-md q-gutter-md">
            <q-input
              filled
              v-model="form.username"
              label="Username *"
              dense
              autofocus
              :rules="[val => !!val || 'Username is required']"
            />
            <q-input
              filled
              v-model="form.email"
              label="Email *"
              type="email"
              dense
              :rules="[val => !!val || 'Email is required']"
            />
            <q-select
              filled
              v-model="form.role"
              :options="roleOptions"
              label="Assign Role *"
              dense
              :rules="[val => !!val || 'Role is required']"
            />

            <q-input
              v-if="!isEditMode"
              filled
              v-model="form.password"
              label="Initial Password *"
              type="password"
              dense
              :rules="[val => !!val || 'Initial password is required']"
            />
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1 q-pa-md">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup />
            <q-btn
              unelevated
              :label="isEditMode ? 'Update User' : 'Create User'"
              color="primary"
              type="submit"
              :loading="isSaving"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State ---
    const isLoading = ref(false)
    const isSaving = ref(false)
    const users = ref([])

    // Dialog State
    const userDialog = ref(false)
    const isEditMode = ref(false)
    const editId = ref(null)

    // Form Initialization
    const getInitialForm = () => ({ username: '', email: '', role: '', password: '' })
    const form = reactive(getInitialForm())

    // Options & Definitions
    const roleOptions = ['Super Admin', 'Admin', 'Kitchen', 'Waiter', 'Cashier']

    const columns = [
      { name: 'username', label: 'Username', field: 'username', align: 'left', sortable: true },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'role', label: 'Role', field: 'role', align: 'center', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    // --- Core Logic ---
    const loadData = async () => {
      isLoading.value = true
      await new Promise(res => setTimeout(res, 400)) // Simulated API Delay

      const saved = localStorage.getItem('saas_system_users')
      if (saved) {
        users.value = JSON.parse(saved)
      } else {
        // Fallback default data
        users.value = [
          { id: 1, username: 'admin_emran', email: 'emran@sass.com', role: 'Super Admin' },
          { id: 2, username: 'waiter_01', email: 'waiter1@sass.com', role: 'Waiter' },
          { id: 3, username: 'chef_kabir', email: 'kabir@sass.com', role: 'Kitchen' }
        ]
      }
      isLoading.value = false
    }

    onMounted(() => loadData())

    // Auto-save changes to LocalStorage
    watch(users, (newVal) => {
      localStorage.setItem('saas_system_users', JSON.stringify(newVal))
    }, { deep: true })

    // --- Methods ---
    const getRoleColor = (role) => {
      switch (role) {
        case 'Super Admin': return 'deep-purple-7'
        case 'Admin': return 'primary'
        case 'Kitchen': return 'orange-9'
        case 'Waiter': return 'teal-7'
        case 'Cashier': return 'blue-7'
        default: return 'grey-7'
      }
    }

    const openDialog = (user = null) => {
      if (user) {
        // Edit Mode
        isEditMode.value = true
        editId.value = user.id
        Object.assign(form, { username: user.username, email: user.email, role: user.role, password: '' })
      } else {
        // Create Mode
        isEditMode.value = false
        editId.value = null
        Object.assign(form, getInitialForm())
      }
      userDialog.value = true
    }

    const saveUser = async () => {
      isSaving.value = true
      await new Promise(res => setTimeout(res, 500))

      if (isEditMode.value) {
        // Update existing user
        const index = users.value.findIndex(u => u.id === editId.value)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], username: form.username, email: form.email, role: form.role }
          $q.notify({ color: 'positive', message: 'User updated successfully', icon: 'check_circle', position: 'top-right' })
        }
      } else {
        // Create new user
        // (In a real app, you would hash the password before sending to API)
        users.value.unshift({
          id: Date.now(),
          username: form.username,
          email: form.email,
          role: form.role
        })
        $q.notify({ color: 'positive', message: 'User created successfully', icon: 'check_circle', position: 'top-right' })
      }

      userDialog.value = false
      isSaving.value = false
    }

    const deleteUser = (id) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(() => {
        users.value = users.value.filter(u => u.id !== id)
        $q.notify({ color: 'negative', message: 'User deleted', icon: 'delete', position: 'top-right' })
      })
    }

    const resetPassword = (user) => {
      $q.dialog({
        title: 'Reset Password',
        message: `Generate a new temporary password for <strong>${user.username}</strong>?`,
        html: true,
        cancel: true,
        persistent: true,
        color: 'orange-8'
      }).onOk(() => {
        // In a real app, call API to generate and send password reset email
        $q.notify({
          color: 'info',
          message: `Temporary password for ${user.username} is: temp1234`,
          timeout: 4000,
          position: 'top-right'
        })
      })
    }

    // --- Explicit Return ---
    return {
      isLoading,
      isSaving,
      userDialog,
      isEditMode,
      form,
      columns,
      users,
      roleOptions,
      getRoleColor,
      openDialog,
      saveUser,
      deleteUser,
      resetPassword
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
.italic {
  font-style: italic;
}
</style>
