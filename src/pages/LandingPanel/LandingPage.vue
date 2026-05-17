<template>
  <div class="landing-page bg-white text-grey-9">
    <!-- Navbar -->
    <q-header class="bg-white text-grey-9 q-py-xs" bordered>
      <q-toolbar class="container max-width-lg mx-auto row justify-between items-center">
        <div class="row items-center q-gutter-sm cursor-pointer" @click="scrollTo('hero')">
          <q-icon name="restaurant" size="md" color="primary" />
          <span class="text-h6 text-weight-bolder text-primary">RestoSaaS</span>
        </div>

        <div class="row items-center q-gutter-md gt-xs">
          <q-btn flat no-caps label="Features" @click="scrollTo('features')" />
          <q-btn flat no-caps label="Pricing" @click="scrollTo('pricing')" />
          <q-btn flat no-caps label="Contact" @click="scrollTo('contact')" />
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn flat no-caps label="Login" color="primary" to="/auth/login" />
          <q-btn unelevated no-caps label="Get Started" color="primary" to="/auth/register" class="q-px-md rounded-borders" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Hero Section -->
    <section id="hero" class="hero-section flex flex-center q-py-xl bg-gradient">
      <div class="container text-center q-px-md max-width-md mx-auto">
        <q-badge color="primary" text-color="white" label="The Ultimate Restaurant Management SaaS" class="q-pa-sm q-mb-md" />
        <h1 class="text-h2 text-weight-bolder q-mt-none q-mb-md leading-tight">
          Manage Your Restaurant <br />
          <span class="text-primary">Smarter & Faster</span>
        </h1>
        <p class="text-subtitle1 text-grey-7 q-mb-xl max-width-sm mx-auto">
          An all-in-one multi-tenant POS, Inventory, HRM, Kitchen Display, and QR Menu system designed to scale your food business efficiently.
        </p>
        <div class="row justify-center q-gutter-md">
          <q-btn unelevated size="lg" color="primary" label="Start Free Trial" to="/auth/register" no-caps class="q-px-xl text-weight-bold" />
          <q-btn outline size="lg" color="primary" label="See Pricing" @click="scrollTo('pricing')" no-caps class="q-px-xl text-weight-bold" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="q-py-xl container max-width-lg mx-auto q-px-md">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4 text-weight-bold q-mb-xs">Powerful Modules Built For Growth</h2>
        <p class="text-grey-7">Everything you need to manage one or multiple restaurant outlets effortlessly.</p>
      </div>

      <div class="row q-col-gutter-lg">
        <div v-for="feature in features" :key="feature.title" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="feature-card full-height q-pa-md transition-all">
            <q-card-section>
              <q-avatar :icon="feature.icon" color="primary-light" text-color="primary" size="lg" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-xs">{{ feature.title }}</div>
              <div class="text-body2 text-grey-7">{{ feature.description }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="q-py-xl bg-grey-1">
      <div class="container max-width-lg mx-auto q-px-md">
        <div class="text-center q-mb-xl">
          <h2 class="text-h4 text-weight-bold q-mb-xs">Simple, Transparent Pricing</h2>
          <p class="text-grey-7">Choose a plan that fits your business scale. No hidden fees.</p>
        </div>

        <div class="row q-col-gutter-lg justify-center">
          <div v-for="plan in plans" :key="plan.title" class="col-12 col-sm-6 col-md-4">
            <q-card flat bordered class="pricing-card text-center q-pa-lg full-height bg-white relative-position shadow-2">
              <q-badge v-if="plan.popular" color="orange" label="Most Popular" class="absolute-top-right q-ma-md q-pa-xs" />

              <div class="text-subtitle1 text-weight-bold text-uppercase text-grey-6 q-mb-xs">{{ plan.title }}</div>
              <div class="text-h3 text-weight-bolder text-primary q-my-md">
                ৳ {{ plan.price }}<span class="text-subtitle2 text-weight-regular text-grey-6">/mo</span>
              </div>
              <p class="text-caption text-grey-6 q-mb-lg">{{ plan.desc }}</p>

              <q-separator inset class="q-my-md" />

              <q-list dense class="q-mb-xl text-left q-gutter-sm">
                <q-item v-for="feature in plan.features" :key="feature" class="q-pa-none">
                  <q-item-section avatar class="min-width-auto q-pr-sm">
                    <q-icon name="check_circle" color="positive" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-8">{{ feature }}</q-item-section>
                </q-item>
              </q-list>

              <div class="absolute-bottom q-pa-lg">
                <q-btn :unelevated="plan.popular" :outline="!plan.popular" color="primary" label="Choose Plan" to="/auth/register" no-caps class="full-width text-weight-bold" />
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-dark text-white q-py-xl">
      <div class="container max-width-lg mx-auto q-px-md row q-col-gutter-lg justify-between">
        <div class="col-12 col-md-4">
          <div class="row items-center q-gutter-sm q-mb-md">
            <q-icon name="restaurant" size="md" color="primary" />
            <span class="text-h6 text-weight-bolder text-white">RestoSaaS</span>
          </div>
          <p class="text-grey-5 text-body2">
            Empowering restaurant owners with next-generation technology to optimize operations, increase sales, and deliver outstanding dining experiences.
          </p>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Product</div>
          <div class="column q-gutter-sm">
            <a @click="scrollTo('features')" class="footer-link text-grey-5 cursor-pointer">Features</a>
            <a @click="scrollTo('pricing')" class="footer-link text-grey-5 cursor-pointer">Pricing</a>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Contact & Support</div>
          <p class="text-grey-5 text-body2 q-mb-xs">Email: support@restosaas.com</p>
          <p class="text-grey-5 text-body2">Dhaka, Bangladesh</p>
        </div>
      </div>
      <q-separator color="grey-9" class="q-my-lg" />
      <div class="text-center text-caption text-grey-6">
        &copy; 2026 RestoSaaS. All rights reserved. Built with passion for food industries.
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LandingPage',
  setup() {
    const features = ref([
      { icon: 'point_of_sale', title: 'Smart POS Terminal', description: 'Super fast checkout interface integrated directly inside the admin panel with live KOT routing.' },
      { icon: 'inventory_2', title: 'Real-time Inventory', description: 'Track raw materials, receive low stock alert notifications, and manage supplier transactions.' },
      { icon: 'badge', title: 'HRM & Shift Planner', description: 'Monitor employee attendance, track leave requests, and process monthly salaries hassle-free.' },
      { icon: 'soup_kitchen', title: 'Kitchen Display (KDS)', description: 'Color-coded live order queue manager screens to optimize preparation speed and reduce errors.' },
      { icon: 'qr_code_2', title: 'Contactless QR Menu', description: 'Enable digital scanning layouts for table ordering, optimized flawlessly for mobile devices.' },
      { icon: 'analytics', title: 'Accounting & Analytics', description: 'Keep tight control of expenses, track gross profits, and download detailed financial statements.' }
    ])

    const plans = ref([
      {
        title: 'Starter', price: '1,500', desc: 'Perfect for small cafes and standalone food carts.', popular: false,
        features: ['Up to 3 Waiter Accounts', 'Smart POS Terminal', 'Basic Inventory Analytics', 'Digital QR Menu Lookup']
      },
      {
        title: 'Professional', price: '3,500', desc: 'Ideal for busy mid-sized full-service restaurants.', popular: true,
        features: ['Unlimited Orders & POS', 'Advanced Multi-user HRM Module', 'Full Inventory Management', 'Live Kitchen Display (KDS)', 'Priority Support Integration']
      },
      {
        title: 'Enterprise', price: '6,000', desc: 'Tailored architecture for premium multi-outlet chains.', popular: false,
        features: ['Everything in Pro Plan', 'Multi-tenant Chain Management', 'Custom Branding Layouts', 'Dedicated Database Mirroring', '24/7 Phone & On-site Support']
      }
    ])

    const scrollTo = (id) => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return {
      features,
      plans,
      scrollTo
    }
  }
}
</script>

<style scoped>
/* Scoped Utility Classes to avoid bloated css files */
.max-width-lg { max-width: 1200px; }
.max-width-md { max-width: 800px; }
.max-width-sm { max-width: 600px; }
.mx-auto { margin-left: auto; margin-right: auto; }
.min-width-auto { min-width: auto; }
.leading-tight { line-height: 1.2; }

.bg-gradient {
  background: radial-gradient(circle at top right, rgba(25, 118, 210, 0.05), transparent), white;
}

.hero-section {
  min-height: 70vh;
}

.bg-primary-light {
  background-color: rgba(25, 118, 210, 0.1);
}

.feature-card {
  border-radius: 12px;
  background-color: #fafafa;
}
.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--q-primary);
  background-color: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.pricing-card {
  border-radius: 16px;
  padding-bottom: 90px !important; /* Spacing for absolute button */
}

.footer-link {
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--q-primary) !important;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
