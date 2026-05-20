# Quasar App (sass-resturent-vue)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).



```
sass-resturent-vue
├─ .editorconfig
├─ .npmrc
├─ README.md
├─ babel.config.js
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  └─ icons
│     ├─ favicon-128x128.png
│     ├─ favicon-16x16.png
│     ├─ favicon-32x32.png
│     └─ favicon-96x96.png
├─ quasar.config.js
└─ src
   ├─ App.vue
   ├─ assets
   │  └─ quasar-logo-vertical.svg
   ├─ boot
   │  └─ axios.js
   ├─ components
   │  ├─ EssentialLink.vue
   │  ├─ common
   │  │  └─ AppButton.vue
   │  ├─ hrm
   │  │  ├─ AttendanceModal.vue
   │  │  └─ SalarySlip.vue
   │  ├─ kitchen
   │  │  └─ KotCard.vue
   │  ├─ pos
   │  │  ├─ ProductCard.vue
   │  │  └─ TableCard.vue
   │  └─ reports
   │     └─ SalesChart.vue
   ├─ composables
   │  ├─ useAuth.js
   │  ├─ usePermissions.js
   │  └─ usePrinter.js
   ├─ css
   │  ├─ app.scss
   │  └─ quasar.variables.scss
   ├─ layouts
   │  ├─ AdminLayout.vue
   │  ├─ AuthLayout.vue
   │  ├─ MainLayout.vue
   │  └─ SuperAdminLayout.vue
   ├─ pages
   │  ├─ AccountingPanel
   │  │  ├─ ExpenseEntry.vue
   │  │  └─ IncomeReport.vue
   │  ├─ AuthPanel
   │  │  ├─ LoginPage.vue
   │  │  ├─ RegisterPage.vue
   │  │  └─ forgot-password.vue
   │  ├─ BillingPanel
   │  │  ├─ AllInvoice.vue
   │  │  ├─ DashboardPanel.vue
   │  │  ├─ PosHome.vue
   │  │  └─ UpcomingOrder.vue
   │  ├─ ErrorNotFound.vue
   │  ├─ HRMPanel
   │  │  ├─ Attendance.vue
   │  │  ├─ EmployeeList.vue
   │  │  ├─ LeaveRequest.vue
   │  │  ├─ PayrollManager.vue
   │  │  └─ ShiftSchedule.vue
   │  ├─ IndexPage.vue
   │  ├─ InventoryPanel
   │  │  ├─ StockIn.vue
   │  │  ├─ StockReport.vue
   │  │  └─ SupplierList.vue
   │  ├─ KitchenPanel
   │  │  ├─ FoodStatus.vue
   │  │  ├─ KitchenDisplay.vue
   │  │  └─ OrdersQueue.vue
   │  ├─ LandingPanel
   │  │  └─ LandingPage.vue
   │  ├─ QrMenuPanel
   │  │  ├─ QrMenuCategory.vue
   │  │  └─ QrMenuHome.vue
   │  ├─ SettingsPanel
   │  │  ├─ RestaurantSettings.vue
   │  │  └─ UserManagement.vue
   │  ├─ WaiterPanel
   │  │  ├─ PlaceOrder.vue
   │  │  ├─ ServeStatus.vue
   │  │  └─ TableOrders.vue
   │  ├─ pos
   │  │  ├─ InvoicesPage.vue
   │  │  ├─ OrdersManagement.vue
   │  │  └─ TerminalPage.vue
   │  └─ superadmin
   │     ├─ RestaurantList.vue
   │     ├─ SaasDashboard.vue
   │     └─ SubscriptionPlans.vue
   ├─ router
   │  ├─ authGuard.js
   │  ├─ index.js
   │  └─ routes.js
   └─ stores
      ├─ example-store.js
      ├─ index.js
      └─ store-flag.d.ts

```