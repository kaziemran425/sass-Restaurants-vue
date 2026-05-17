import { h } from "vue";
import { RouterView } from "vue-router";

const routes = [
  {
    path: "/",
    name: "landing",
    component: () => import("pages/LandingPanel/LandingPage.vue"), // এখানে কোনো লেআউট নেই, একদম ক্লিন পেজ
  },
  // ==========================================================
  // AUTH ROUTES (Public)
  // ==========================================================
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("pages/AuthPanel/LoginPage.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/AuthPanel/RegisterPage.vue"),
      },
    ],
  },

  // ==========================================================
  // SUPER ADMIN ROUTES (SaaS Owner)
  // ==========================================================
  {
    path: "/superadmin",
    component: () => import("layouts/SuperAdminLayout.vue"),
    meta: { requiresAuth: true, role: "superadmin" },
    redirect: "/superadmin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "superadmin-dashboard",
        component: () => import("pages/superadmin/SaasDashboard.vue"),
      },
      {
        path: "restaurants",
        name: "superadmin-restaurants",
        component: () => import("pages/superadmin/RestaurantList.vue"),
      },
      {
        path: "plans",
        name: "superadmin-plans",
        component: () => import("pages/superadmin/SubscriptionPlans.vue"),
      },
    ],
  },

  // ==========================================================
  // KITCHEN PANEL (Restaurant Staff)
  // ==========================================================
  {
    path: "/kitchen",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true, role: ["admin", "kitchen"] },
    redirect: "/kitchen/display",
    children: [
      {
        path: "display",
        name: "kitchen-display",
        component: () => import("pages/KitchenPanel/KitchenDisplay.vue"),
      },
      {
        path: "queue",
        name: "kitchen-queue",
        component: () => import("pages/KitchenPanel/OrdersQueue.vue"),
      },
      {
        path: "status",
        name: "kitchen-status",
        component: () => import("pages/KitchenPanel/FoodStatus.vue"),
      },
    ],
  },

  // ==========================================================
  // WAITER PANEL (Mobile Friendly)
  // ==========================================================
  {
    path: "/waiter",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true, role: ["admin", "waiter"] },
    redirect: "/waiter/place-order",
    children: [
      {
        path: "place-order",
        name: "waiter-place-order",
        component: () => import("pages/WaiterPanel/PlaceOrder.vue"),
      },
      {
        path: "tables",
        name: "waiter-tables",
        component: () => import("pages/WaiterPanel/TableOrders.vue"),
      },
      {
        path: "serve-status",
        name: "waiter-serve-status",
        component: () => import("pages/WaiterPanel/ServeStatus.vue"),
      },
    ],
  },

  // ==========================================================
  // ADMIN PANEL (Restaurant Admin Dashboard)
  // ==========================================================
  {
    path: "/",
    component: () => import("layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: ["admin", "manager"] },
    redirect: "/dashboard",
    children: [
      // ----------------------------
      // DASHBOARD
      // ----------------------------
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("pages/IndexPage.vue"),
      },

      // ----------------------------
      // BILLING PANEL (Your BillingPanel folder)
      // ----------------------------
      {
        path: "billing",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "billing-dashboard",
            component: () => import("pages/BillingPanel/DashboardPanel.vue"),
          },
          {
            path: "pos",
            name: "billing-pos",
            component: () => import("pages/BillingPanel/PosHome.vue"),
          },
          {
            path: "invoices",
            name: "billing-invoices",
            component: () => import("pages/BillingPanel/AllInvoice.vue"),
          },
          {
            path: "upcoming-orders",
            name: "billing-upcoming-orders",
            component: () => import("pages/BillingPanel/UpcomingOrder.vue"),
          },
        ],
      },

      // ----------------------------
      // POS MODULE (Your src/pages/pos folder)
      // ----------------------------
      {
        path: "pos",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "pos-terminal",
            component: () => import("pages/pos/TerminalPage.vue"),
          },
          {
            path: "invoices",
            name: "pos-invoices",
            component: () => import("pages/pos/InvoicesPage.vue"),
          },
          {
            path: "orders",
            name: "pos-orders",
            component: () => import("pages/pos/OrdersManagement.vue"),
          },
        ],
      },

      // ----------------------------
      // HRM PANEL
      // ----------------------------
      {
        path: "hrm",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "employees",
            name: "hrm-employees",
            component: () => import("pages/HRMPanel/EmployeeList.vue"),
          },
          {
            path: "attendance",
            name: "hrm-attendance",
            component: () => import("pages/HRMPanel/Attendance.vue"),
          },
          {
            path: "payroll",
            name: "hrm-payroll",
            component: () => import("pages/HRMPanel/PayrollManager.vue"),
          },
          {
            path: "leaves",
            name: "hrm-leaves",
            component: () => import("pages/HRMPanel/LeaveRequest.vue"),
          },
          {
            path: "shifts",
            name: "hrm-shifts",
            component: () => import("pages/HRMPanel/ShiftSchedule.vue"),
          },
        ],
      },

      // ----------------------------
      // INVENTORY PANEL
      // ----------------------------
      {
        path: "inventory",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "stock-in",
            name: "inventory-stock-in",
            component: () => import("pages/InventoryPanel/StockIn.vue"),
          },
          {
            path: "reports",
            name: "inventory-reports",
            component: () => import("pages/InventoryPanel/StockReport.vue"),
          },
          {
            path: "suppliers",
            name: "inventory-suppliers",
            component: () => import("pages/InventoryPanel/SupplierList.vue"),
          },
        ],
      },

      // ----------------------------
      // ACCOUNTING PANEL
      // ----------------------------
      {
        path: "accounting",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "income",
            name: "accounting-income",
            component: () => import("pages/AccountingPanel/IncomeReport.vue"),
          },
          {
            path: "expenses",
            name: "accounting-expenses",
            component: () => import("pages/AccountingPanel/ExpenseEntry.vue"),
          },
        ],
      },

      // ----------------------------
      // SETTINGS PANEL
      // ----------------------------
      {
        path: "settings",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "restaurant",
            name: "settings-restaurant",
            component: () =>
              import("pages/SettingsPanel/RestaurantSettings.vue"),
          },
          {
            path: "users",
            name: "settings-users",
            component: () => import("pages/SettingsPanel/UserManagement.vue"),
          },
        ],
      },
    ],
  },

  // ==========================================================
  // QR MENU (PUBLIC)
  // ==========================================================
  {
    path: "/menu",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "qr-home",
        component: () => import("pages/QrMenuPanel/QrMenuHome.vue"),
      },
      {
        path: "category/:id",
        name: "qr-category",
        component: () => import("pages/QrMenuPanel/QrMenuCategory.vue"),
      },
    ],
  },

  // ==========================================================
  // ERROR 404
  // ==========================================================
  {
    path: "/:catchAll(.*)*",
    name: "not-found",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
