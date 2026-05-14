// src/router/routes.js

const routes = [
  // --- Auth Layout & Pages ---
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
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

  // --- Super Admin Layout (SaaS Master Control) ---
  {
    path: "/superadmin",
    component: () => import("src/layouts/SuperAdminLayout.vue"),
    meta: { requiresAuth: true, role: "superadmin" },
    children: [
      {
        path: "dashboard",
        name: "saas-dashboard",
        component: () => import("src/pages/superadmin/SaasDashboard.vue"),
      },
      {
        path: "restaurants",
        name: "saas-restaurants",
        component: () => import("src/pages/superadmin/RestaurantList.vue"),
      },
      {
        path: "plans",
        name: "saas-plans",
        component: () => import("src/pages/superadmin/SubscriptionPlans.vue"),
      },
    ],
  },

  // --- Main Admin / Restaurant Dashboard Layout ---
  {
    path: "/",
    component: () => import("layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/IndexPage.vue"),
      },

      // HR Management Panel
      {
        path: "hrm",
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

      // Inventory Panel
      {
        path: "inventory",
        children: [
          {
            path: "stock-in",
            name: "inv-stock-in",
            component: () => import("pages/InventoryPanel/StockIn.vue"),
          },
          {
            path: "reports",
            name: "inv-reports",
            component: () => import("pages/InventoryPanel/StockReport.vue"),
          },
          {
            path: "suppliers",
            name: "inv-suppliers",
            component: () => import("pages/InventoryPanel/SupplierList.vue"),
          },
        ],
      },

      // Accounting Panel
      {
        path: "accounting",
        children: [
          {
            path: "income",
            name: "acc-income",
            component: () => import("pages/AccountingPanel/IncomeReport.vue"),
          },
          {
            path: "expenses",
            name: "acc-expenses",
            component: () => import("pages/AccountingPanel/ExpenseEntry.vue"),
          },
        ],
      },

      // Settings Panel
      {
        path: "settings",
        children: [
          {
            path: "restaurant",
            name: "set-restaurant",
            component: () =>
              import("pages/SettingsPanel/RestaurantSettings.vue"),
          },
          {
            path: "users",
            name: "set-users",
            component: () => import("pages/SettingsPanel/UserManagement.vue"),
          },
        ],
      },
    ],
  },

  // --- POS / Billing Layout ---
  {
    path: "/pos",
    component: () => import("layouts/PosLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "pos-home",
        component: () => import("pages/BillingPanel/PosHome.vue"),
      },
      {
        path: "invoices",
        name: "pos-invoices",
        component: () => import("pages/BillingPanel/AllInvoice.vue"),
      },
      {
        path: "upcoming",
        name: "pos-upcoming",
        component: () => import("pages/BillingPanel/UpcomingOrder.vue"),
      },
    ],
  },

  // --- Kitchen Panel Layout ---
  {
    path: "/kitchen",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
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

  // --- Waiter Panel ---
  {
    path: "/waiter",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "place-order",
        name: "waiter-order",
        component: () => import("pages/WaiterPanel/PlaceOrder.vue"),
      },
      {
        path: "tables",
        name: "waiter-tables",
        component: () => import("pages/WaiterPanel/TableOrders.vue"),
      },
    ],
  },

  // --- QR Menu (Public Access) ---
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

  // --- Error 404 ---
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
