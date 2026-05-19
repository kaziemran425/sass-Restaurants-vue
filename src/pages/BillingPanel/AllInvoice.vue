<template>
  <q-page padding class="bg-grey-2">
    <q-card flat bordered style="border-radius: 12px;" class="bg-white">
      <q-card-section class="row items-center justify-between bg-grey-1">
        <div class="text-h5 text-weight-bold text-dark">
          <q-icon name="receipt_long" class="q-mr-sm text-primary" /> Invoices History
        </div>
        <div class="row q-gutter-sm items-center">
          <q-input dense outlined bg-color="white" v-model="filter" placeholder="Search Invoice..." style="width: 250px" clearable>
            <template v-slot:append><q-icon name="search" /></template>
          </q-input>
          <q-btn icon="refresh" color="primary" flat round @click="loadInvoices" :loading="isLoading">
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-table
        :rows="invoices"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
        class="text-grey-9"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'Paid' ? 'green-6' : 'orange-8'" class="q-px-sm q-py-xs text-weight-bold">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense color="primary" icon="visibility" size="sm" class="q-mr-xs" @click="openViewDialog(props.row)">
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="secondary" icon="print" size="sm" @click="printInvoice(props.row.id)">
              <q-tooltip>Print POS Receipt</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center flex-col text-grey-6 q-pa-xl column">
            <q-icon size="4em" name="receipt_long" class="q-mb-md opacity-50" />
            <div class="text-h6">No invoices found</div>
            <div class="text-caption">Process an order in POS first to generate an invoice.</div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="viewDialog">
      <q-card style="min-width: 450px; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row justify-between items-center q-pb-md">
          <div class="text-h6">Invoice Details</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md" v-if="selectedInvoice">
          <div class="row justify-between q-mb-sm">
            <span class="text-weight-bold text-grey-8">Invoice ID:</span>
            <span class="text-dark">{{ selectedInvoice.id }}</span>
          </div>
          <div class="row justify-between q-mb-sm">
            <span class="text-weight-bold text-grey-8">Date:</span>
            <span class="text-dark">{{ selectedInvoice.date }}</span>
          </div>
          <div class="row justify-between q-mb-md">
            <span class="text-weight-bold text-grey-8">Customer:</span>
            <span class="text-dark">{{ selectedInvoice.customer || 'Walk-in' }}</span>
          </div>

          <q-separator class="q-mb-md" />

          <div class="text-subtitle2 text-weight-bold q-mb-sm">Order Items:</div>

          <q-list dense separator class="bg-grey-1 rounded-borders q-pa-sm" v-if="selectedInvoice.items && selectedInvoice.items.length > 0">
            <q-item v-for="(item, index) in selectedInvoice.items" :key="index">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>৳ {{ formatMoney(item.price) }} x {{ item.qty }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-weight-bold text-dark">
                ৳ {{ formatMoney(item.price * item.qty) }}
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey-6 text-center q-py-sm bg-grey-1 rounded-borders">
            No item details available for this invoice.
          </div>

          <q-separator class="q-my-md" />

          <div class="row justify-between text-h6 text-weight-bold text-primary">
            <span>Total:</span>
            <span>{{ selectedInvoice.total }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 q-pa-md">
          <q-btn flat label="Close" color="grey-8" v-close-popup />
          <q-btn unelevated icon="print" label="Print Receipt" color="primary" @click="printInvoice(selectedInvoice.id)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // --- State Variables ---
    const filter = ref('')
    const isLoading = ref(false)
    const invoices = ref([])

    // Dialog State
    const viewDialog = ref(false)
    const selectedInvoice = ref(null)

    // --- Table Columns ---
    const columns = [
      { name: 'id', label: 'Invoice #', field: 'id', align: 'left', sortable: true },
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
      { name: 'total', label: 'Total Amount', field: 'total', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
    ]

    // --- Helper Methods ---
    const formatMoney = (val) => Number(val || 0).toLocaleString('en-IN')

    // --- Core Methods ---
    const loadInvoices = async () => {
      isLoading.value = true
      // Simulated API Delay
      await new Promise(res => setTimeout(res, 400))

      const saved = localStorage.getItem('saas_invoices')
      if (saved) {
        invoices.value = JSON.parse(saved)
      } else {
        // Fallback Dummy Data - Auto populates local storage if empty
        const dummyData = [
          {
            id: 'INV-1001',
            date: new Date().toISOString().split('T')[0],
            customer: 'Walk-in',
            total: '৳ 1,250',
            status: 'Paid',
            items: [
              { name: 'Chicken Cheese Pizza', price: 850, qty: 1 },
              { name: 'Cold Coffee', price: 200, qty: 2 }
            ]
          },
          {
            id: 'INV-1002',
            date: new Date().toISOString().split('T')[0],
            customer: 'Kazi Emran',
            total: '৳ 450',
            status: 'Paid',
            items: [
              { name: 'Pasta Alfredo', price: 450, qty: 1 }
            ]
          }
        ]
        invoices.value = dummyData
        localStorage.setItem('saas_invoices', JSON.stringify(dummyData))
      }
      isLoading.value = false
    }

    onMounted(() => loadInvoices())

    const openViewDialog = (invoice) => {
      selectedInvoice.value = invoice
      viewDialog.value = true
    }

    // --- POS Thermal Print Logic ---
    const printInvoice = (id) => {
      const invoice = invoices.value.find(inv => inv.id === id)
      if (!invoice) {
        $q.notify({ color: 'negative', message: 'Invoice not found!' })
        return
      }

      // Generate HTML for the items table
      let itemsHtml = ''
      if (invoice.items && invoice.items.length > 0) {
        itemsHtml = invoice.items.map(item => `
          <tr>
            <td class="text-left">${item.name}</td>
            <td class="text-center">${item.qty}</td>
            <td class="text-right">৳ ${formatMoney(item.price * item.qty)}</td>
          </tr>
        `).join('')
      } else {
        itemsHtml = `<tr><td colspan="3" class="text-center">No items found</td></tr>`
      }

      // Remove old iframe to prevent memory leaks
      const oldIframe = document.getElementById('print-receipt-iframe')
      if (oldIframe) {
        oldIframe.remove()
      }

      // Create a hidden iframe
      const iframe = document.createElement('iframe')
      iframe.id = 'print-receipt-iframe'
      iframe.style.position = 'absolute'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'

      document.body.appendChild(iframe)

      // Write content into the iframe
      const doc = iframe.contentWindow.document
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt_${invoice.id}</title>
            <style>
              /* Base styling */
              body {
                font-family: 'Courier New', Courier, monospace;
                color: #000;
                width: 72mm; /* Standard 80mm paper has ~72mm printable area */
                margin: 0 auto;
                font-size: 13px;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .font-bold { font-weight: bold; }
              .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 4px 0; }

              /* CRITICAL: Print Specific Media Query for POS Thermal Paper */
              @media print {
                @page {
                  size: 80mm auto; /* Sets paper size to 80mm width and auto height */
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 4mm;
                }
                html, body {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="text-center font-bold" style="font-size: 18px; margin-bottom: 5px;">YOUR RESTAURANT</div>
            <div class="text-center">123 Main Street, Dhaka</div>
            <div class="text-center">Phone: +880 123 456 789</div>

            <div class="divider"></div>

            <div><span class="font-bold">Date:</span> ${invoice.date}</div>
            <div><span class="font-bold">Invoice:</span> ${invoice.id}</div>
            <div><span class="font-bold">Customer:</span> ${invoice.customer || 'Walk-in'}</div>

            <div class="divider"></div>

            <table>
              <thead>
                <tr>
                  <th class="text-left font-bold">Item</th>
                  <th class="text-center font-bold">Qty</th>
                  <th class="text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="divider"></div>

            <table>
              <tr>
                <td class="text-left font-bold" style="font-size: 15px;">Total Amount:</td>
                <td class="text-right font-bold" style="font-size: 15px;">${invoice.total}</td>
              </tr>
            </table>

            <div class="divider"></div>

            <div class="text-center" style="margin-top: 15px;">Thank you for your business!</div>
            <div class="text-center" style="font-size: 11px; margin-top: 5px;">Powered by SaaS POS</div>
          </body>
        </html>
      `)
      doc.close()

      // Give the iframe time to render the DOM completely, then call print
      setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      }, 500)
    }

    // --- Explicit Return ---
    return {
      filter,
      columns,
      invoices,
      isLoading,
      viewDialog,
      selectedInvoice,
      loadInvoices,
      openViewDialog,
      printInvoice,
      formatMoney
    }
  }
}
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>
