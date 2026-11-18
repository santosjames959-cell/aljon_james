<template>
  <v-container fluid class="pa-0 nike-style">
    <!-- LOADING -->
    <div v-if="pending" class="loading-page">
      <v-container>
        <v-skeleton-loader type="heading" class="mb-8" />
        <v-skeleton-loader type="image" height="400" class="mb-8" />
        <v-row>
          <v-col v-for="n in 4" :key="n" cols="6" md="3">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-else>
      <!-- NAVBAR -->
      <v-app-bar height="76" color="#F4F4F0" elevation="0" class="main-navbar">
        <v-container
          fluid
          class="navbar-container d-flex align-center px-5 px-md-10"
        >
          <NuxtLink to="/" class="brand-logo">Caster.</NuxtLink>

          <v-spacer />

          <div class="desktop-navigation">
            <v-btn href="#top" variant="text" color="black">HOME</v-btn>
            <v-btn href="#products" variant="text" color="black">SHOP</v-btn>
            <v-btn to="/products" variant="text" color="black"
              >COLLECTIONS</v-btn
            >
          </div>

          <v-spacer />

          <div class="desktop-cart">
            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="red"
            >
              <v-btn icon variant="text" @click="cartDrawer = true">
                <v-icon size="27">mdi-cart-outline</v-icon>
              </v-btn>
            </v-badge>
          </div>

          <div class="mobile-menu">
            <v-btn icon variant="text" @click="mobileMenu = !mobileMenu">
              <v-icon size="28">mdi-menu</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-app-bar>

      <!-- MOBILE DRAWER -->
      <v-navigation-drawer
        v-model="mobileMenu"
        location="right"
        temporary
        width="300"
        class="mobile-navigation"
      >
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">MENU</span>
          <v-btn icon="mdi-close" variant="text" @click="mobileMenu = false" />
        </div>

        <v-divider />

        <div class="mobile-menu-links">
          <a href="#top" @click="mobileMenu = false">
            HOME <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <a href="#products" @click="mobileMenu = false">
            SHOP <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <NuxtLink to="/products" @click="mobileMenu = false">
            COLLECTIONS <v-icon>mdi-arrow-up-right</v-icon>
          </NuxtLink>

          <v-divider class="my-3" />

          <button
            class="mobile-cart-link"
            @click="
              mobileMenu = false;
              cartDrawer = true;
            "
          >
            <span>
              <v-icon class="mr-3">mdi-shopping-bag-outline</v-icon>
              MY CART
            </span>

            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="error"
              inline
            />
          </button>
        </div>

        <template #append>
          <div class="mobile-menu-footer">Caster & Sy — MOVE YOUR WAY.</div>
        </template>
      </v-navigation-drawer>

      <!-- CART DRAWER -->
      <v-navigation-drawer
        v-model="cartDrawer"
        location="right"
        temporary
        width="420"
        class="cart-drawer"
      >
        <div class="cart-header">
          <div>
            <span class="cart-header-eyebrow">Caster & Sy</span>
            <h2>
              YOUR BAG
              <span class="cart-count">({{ cartItemCount }})</span>
            </h2>
          </div>

          <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
        </div>

        <v-divider />

        <!-- EMPTY CART -->
        <div v-if="cart.length === 0" class="empty-cart">
          <v-icon size="75">mdi-shopping-bag-outline</v-icon>
          <h3 class="mt-4">Your bag is empty.</h3>
          <p class="mt-2">Find something worth wearing.</p>

          <v-btn
            to="/products"
            color="black"
            rounded="pill"
            class="mt-5"
            @click="cartDrawer = false"
          >
            START SHOPPING
          </v-btn>
        </div>

        <!-- CART ITEMS -->
        <div v-else class="cart-content">
          <div class="cart-items">
            <v-card
              v-for="item in cart"
              :key="item.documentId"
              variant="flat"
              class="cart-product-card mb-4"
            >
              <v-card-text class="pa-3">
                <v-row align="center" no-gutters>
                  <v-col cols="4">
                    <div class="cart-image-wrapper">
                      <v-img
                        v-if="getImageUrl(item.image)"
                        :src="getImageUrl(item.image)"
                        height="125"
                        cover
                      />
                      <div v-else class="cart-image-placeholder">
                        <v-icon size="30">mdi-image-outline</v-icon>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="8" class="pl-4">
                    <div class="d-flex justify-space-between align-start">
                      <div class="flex-grow-1 pr-2">
                        <div class="cart-item-label">YOUR ITEM</div>
                        <div class="cart-product-name">{{ item.name }}</div>
                      </div>

                      <v-btn
                        icon="mdi-trash-can-outline"
                        size="small"
                        variant="text"
                        color="grey-darken-1"
                        @click="removeFromCart(item.documentId)"
                      />
                    </div>

                    <div class="cart-product-price mt-2">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>

                    <div class="cart-unit-price">
                      {{ formatPrice(item.price) }} / item
                    </div>

                    <div
                      class="d-flex align-center justify-space-between mt-3 flex-wrap ga-2"
                    >
                      <div class="quantity-control">
                        <v-btn
                          icon="mdi-minus"
                          size="x-small"
                          variant="text"
                          :disabled="item.quantity <= 1"
                          @click="decreaseQuantity(item.documentId)"
                        />

                        <span class="quantity-number">{{ item.quantity }}</span>

                        <v-btn
                          icon="mdi-plus"
                          size="x-small"
                          variant="text"
                          :disabled="item.quantity >= item.stock"
                          @click="increaseQuantity(item.documentId)"
                        />
                      </div>

                      <span class="cart-stock-label">
                        {{ item.stock }} available
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>

          <!-- CART SUMMARY -->
          <div class="cart-summary">
            <v-divider class="mb-4" />

            <div class="d-flex justify-space-between mb-4">
              <strong>SUBTOTAL</strong>
              <strong>{{ formatPrice(cartTotal) }}</strong>
            </div>

            <v-btn block variant="outlined" class="mb-3" @click="clearCart">
              CLEAR CART
            </v-btn>

            <v-btn block color="black" size="large" @click="openCheckout">
              CHECKOUT
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>

            <p class="text-caption text-center mt-3">Checkout coming soon.</p>
          </div>
        </div>
      </v-navigation-drawer>

      <!-- CHECKOUT DIALOG -->
      <v-dialog v-model="checkoutDialog" max-width="1050" scrollable>
        <v-card rounded="lg" class="checkout-card">
          <div class="checkout-header">
            <div>
              <span class="cart-header-eyebrow">Caster & Sy — CHECKOUT</span>
              <h2>COMPLETE YOUR ORDER.</h2>
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="checkoutDialog = false"
              :disabled="isCheckingOut"
            />
          </div>

          <v-divider />

          <v-card-text class="pa-5 pa-md-8">
            <v-row>
              <!-- CUSTOMER INFORMATION -->
              <v-col cols="12" md="6">
                <h3 class="checkout-section-title mb-5">
                  CUSTOMER INFORMATION
                </h3>

                <v-text-field
                  v-model="customer.name"
                  label="Full Name"
                  variant="outlined"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.name"
                />

                <v-text-field
                  v-model="customer.email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.email"
                />

                <v-text-field
                  v-model="customer.phone"
                  label="Phone Number"
                  variant="outlined"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.phone"
                />

                <v-textarea
                  v-model="customer.address"
                  label="Complete Shipping Address"
                  variant="outlined"
                  rows="3"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.address"
                />

                <h3 class="checkout-section-title mb-4 mt-3">PAYMENT METHOD</h3>

                <v-radio-group
                  v-model="customer.paymentMethod"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.paymentMethod"
                >
                  <v-radio label="Cash on Delivery (COD)" value="COD" />
                  <v-radio label="GCash" value="GCash" />
                </v-radio-group>
              </v-col>

              <!-- ORDER SUMMARY -->
              <v-col cols="12" md="6">
                <h3 class="checkout-section-title mb-5">ORDER SUMMARY</h3>

                <div
                  v-for="item in cart"
                  :key="item.documentId"
                  class="checkout-item"
                >
                  <div class="checkout-item-image">
                    <v-img
                      v-if="getImageUrl(item.image)"
                      :src="getImageUrl(item.image)"
                      width="65"
                      height="65"
                      cover
                    />
                    <v-icon v-else size="30">mdi-image-outline</v-icon>
                  </div>

                  <div class="flex-grow-1">
                    <div class="font-weight-bold">{{ item.name }}</div>
                    <div class="text-caption text-grey">
                      {{ formatPrice(item.price) }} × {{ item.quantity }}
                    </div>
                  </div>

                  <strong>
                    {{ formatPrice(item.price * item.quantity) }}
                  </strong>
                </div>

                <v-divider class="my-5" />

                <div class="d-flex justify-space-between mb-3">
                  <span>Total Items</span>
                  <strong>{{ cartItemCount }}</strong>
                </div>

                <div class="d-flex justify-space-between mb-3">
                  <span>Subtotal</span>
                  <strong>{{ formatPrice(cartTotal) }}</strong>
                </div>

                <div class="d-flex justify-space-between text-h6 mt-5">
                  <strong>TOTAL</strong>
                  <strong>{{ formatPrice(cartTotal) }}</strong>
                </div>

                <v-alert
                  v-if="checkoutError"
                  type="error"
                  variant="tonal"
                  class="mt-5"
                >
                  {{ checkoutError }}
                </v-alert>

                <v-btn
                  block
                  color="black"
                  size="x-large"
                  rounded="pill"
                  class="mt-6"
                  :loading="isCheckingOut"
                  :disabled="cart.length === 0"
                  @click="submitCheckout"
                >
                  PLACE ORDER
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>

                <p class="text-caption text-grey text-center mt-3">
                  Please review your information before placing your order.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- ORDER SUCCESS DIALOG -->
      <v-dialog v-model="successDialog" max-width="520" persistent>
        <v-card class="success-card" rounded="xl">
          <div class="success-icon">
            <v-icon size="48" color="white">mdi-check</v-icon>
          </div>

          <v-card-text class="text-center pa-8">
            <span class="success-eyebrow">Caster & Sy — ORDER CONFIRMED</span>

            <h2 class="success-title mt-4">THANK YOU!</h2>

            <p class="success-message mt-3">
              Your order has been successfully placed. We appreciate your
              purchase and can't wait for you to receive your items.
            </p>

            <v-divider class="my-6" />

            <div class="order-reference">
              <span>YOUR ORDER NUMBER</span>
              <strong>{{ completedOrderId }}</strong>
            </div>

            <v-alert
              type="success"
              variant="tonal"
              rounded="lg"
              class="mt-5 text-left"
            >
              Thank you for shopping with Caster & Sy. Your order is now being
              processed.
            </v-alert>

            <v-btn
              block
              color="black"
              size="x-large"
              rounded="pill"
              class="mt-6"
              @click="successDialog = false"
            >
              CONTINUE SHOPPING
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- HERO -->
      <section id="top" class="hero-section">
        <div class="hero-background">
          <div class="hero-glow hero-glow-one"></div>
          <div class="hero-glow hero-glow-two"></div>
          <div class="hero-glow hero-glow-three"></div>
          <div class="hero-grid"></div>
        </div>

        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="hero-status-dot"></span>
              NEW COLLECTION — 2026
            </div>

            <h1>
              MOVE
              <span>YOUR WAY.</span>
            </h1>

            <p class="hero-description">
              Discover your style. Define your identity. Everyday essentials
              made for the way you move.
            </p>

            <div class="hero-actions">
              <v-btn
                href="#products"
                color="#B8FF45"
                rounded="pill"
                size="x-large"
                class="hero-button"
              >
                SHOP COLLECTION
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>

              <a href="#categories" class="hero-explore">
                EXPLORE MORE
                <v-icon size="18">mdi-arrow-down</v-icon>
              </a>
            </div>

            <div class="hero-bottom-info">
              <div>
                <strong>01</strong>
                <span>EVERYDAY STYLE</span>
              </div>

              <div class="hero-info-divider"></div>

              <div>
                <strong>Caster.</strong>
                <span>MOVE YOUR WAY</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-circle hero-circle-one"></div>
            <div class="hero-circle hero-circle-two"></div>

            <div class="hero-visual-text">
              <span>Caster & Sy</span>
              <strong>YOUR<br />STYLE.<br />YOUR<br />RULES.</strong>
              <div class="visual-line"></div>
              <small>EST. 2026 — EVERYDAY COLLECTION</small>
            </div>

            <div class="hero-floating-label">
              <v-icon color="#B8FF45" size="20">mdi-lightning-bolt</v-icon>
              <span>FIND YOUR MOVEMENT.</span>
            </div>
          </div>
        </div>

        <div class="hero-bottom-line">
          <span>Caster & Sy — MOVE YOUR WAY.</span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>

      <!-- CATEGORIES -->
      <v-container id="categories" class="section-spacing">
        <div class="section-header">
          <div>
            <span class="eyebrow">EXPLORE</span>
            <h2>SHOP BY CATEGORY.</h2>
          </div>
        </div>
      </v-container>

      <!-- PROMOTION -->
      <v-container class="section-spacing">
        <section class="promo-section">
          <div class="promo-content">
            <span class="eyebrow light-eyebrow">MADE FOR EVERYDAY</span>

            <h2>LESS ORDINARY.<br />MORE YOU.</h2>

            <p>
              Discover products that bring style and simplicity into your
              everyday life.
            </p>

            <v-btn to="/products" color="white" rounded="pill" size="large">
              EXPLORE MORE
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <v-icon size="150" color="#D5D5D0">
            mdi-star-four-points-outline
          </v-icon>
        </section>
      </v-container>

      <!-- PRODUCTS -->
      <v-container id="products" class="section-spacing pb-12">
        <div class="section-header">
          <div>
            <span class="eyebrow">THE COLLECTION</span>
            <h2>FRESH FINDS.</h2>
            <p>Find your next everyday favorite.</p>
          </div>

          <NuxtLink to="/" class="view-all-link">
            VIEW ALL
            <v-icon end>mdi-arrow-right</v-icon>
          </NuxtLink>
        </div>

        <!-- SEARCH -->
        <div class="product-search-area">
          <div class="product-search">
            <v-icon icon="mdi-magnify" size="23" color="#777" />

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products, categories..."
              class="product-search-input"
            />

            <button
              v-if="searchQuery"
              class="search-clear"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <v-icon icon="mdi-close" />
            </button>
          </div>

          <span class="search-caption">FIND SOMETHING YOU LOVE.</span>
        </div>

        <!-- CATEGORY FILTER -->
        <div class="category-list product-category-list">
          <v-chip
            :color="selectedCategory === 'All' ? 'black' : undefined"
            :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = 'All'"
          >
            ALL
          </v-chip>

          <v-chip
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'black' : undefined"
            :variant="selectedCategory === category ? 'flat' : 'outlined'"
            size="large"
            @click="selectedCategory = category"
          >
            {{ category.toUpperCase() }}
          </v-chip>
        </div>

        <!-- ERROR -->
        <v-alert v-if="error" type="warning" variant="tonal" class="mt-6">
          Unable to load products. Please check your Strapi connection.
        </v-alert>

        <!-- EMPTY -->
        <v-alert
          v-else-if="filteredProducts.length === 0"
          type="info"
          variant="tonal"
          class="mt-6"
        >
          No products found. Try another search.
        </v-alert>

        <!-- PRODUCT GRID -->
        <v-row v-else class="product-grid mt-4">
          <v-col
            v-for="product in filteredProducts"
            :key="product.documentId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="product-column"
          >
            <v-card
              class="product-card"
              rounded="0"
              elevation="0"
              height="100%"
            >
              <!-- IMAGE -->
              <div class="product-image">
                <v-img
                  v-if="getImageUrl(product.image)"
                  :src="getImageUrl(product.image)"
                  height="300"
                  cover
                />

                <div v-else class="image-placeholder">
                  <v-icon size="60">mdi-image-outline</v-icon>
                </div>

                <!-- WISHLIST -->
                <v-btn
                  icon
                  size="small"
                  color="white"
                  class="wishlist-button"
                  @click.stop="toggleWishlist(product)"
                >
                  <v-icon :color="isWishlisted(product) ? 'red' : 'black'">
                    {{
                      isWishlisted(product) ? "mdi-heart" : "mdi-heart-outline"
                    }}
                  </v-icon>
                </v-btn>

                <!-- STOCK -->
                <div v-if="product.stock > 0" class="product-tag">
                  AVAILABLE
                </div>

                <div v-else class="product-tag out-of-stock">SOLD OUT</div>
              </div>

              <!-- PRODUCT DETAILS -->
              <v-card-text class="product-details">
                <div class="product-heading">
                  <h3 class="product-name">{{ product.name }}</h3>

                  <p class="product-category">
                    {{ product.category || "EVERYDAY COLLECTION" }}
                  </p>
                </div>

                <div class="product-price">
                  {{ formatPrice(product.price) }}
                </div>

                <p class="product-description">
                  {{
                    product.description || "A fresh find for everyday living."
                  }}
                </p>
              </v-card-text>

              <!-- ADD TO CART -->
              <v-card-actions class="product-actions">
                <v-btn
                  class="add-to-cart-button"
                  color="black"
                  block
                  rounded="pill"
                  height="48"
                  :disabled="product.stock <= 0"
                  @click="addToCart(product)"
                >
                  ADD TO CART
                  <v-icon end>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- NEWSLETTER -->
      <section class="newsletter-section">
        <v-container class="py-12">
          <v-row align="center">
            <v-col cols="12" md="6">
              <span class="eyebrow">STAY IN THE GAME</span>

              <h2>NEVER MISS<br />A THING.</h2>

              <p>Get the latest updates, new arrivals, and exclusive offers.</p>
            </v-col>

            <v-col cols="12" md="6">
              <v-form @submit.prevent="subscribeNewsletter">
                <v-text-field
                  v-model="newsletterEmail"
                  label="Your email address"
                  type="email"
                  variant="outlined"
                  bg-color="white"
                  rounded="lg"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                  required
                />

                <v-btn
                  type="submit"
                  color="black"
                  block
                  size="large"
                  rounded="pill"
                >
                  JOIN THE COMMUNITY
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- FOOTER -->
      <v-footer class="main-footer">
        <v-container class="py-10">
          <v-row>
            <v-col cols="12" md="6">
              <div class="footer-logo">Caster.</div>

              <p class="footer-description">
                Everyday essentials.<br />
                Timeless style. Your way.
              </p>
            </v-col>

            <v-col cols="6" md="3">
              <h4>EXPLORE</h4>

              <div class="footer-links">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/products">Shop</NuxtLink>
              </div>
            </v-col>

            <v-col cols="6" md="3">
              <h4>ABOUT</h4>

              <div class="footer-links">
                <a href="#top">Our Collection</a>
                <a href="#top">Back to Top</a>
              </div>
            </v-col>
          </v-row>

          <v-divider color="#555" class="my-6" />

          <div class="footer-bottom">
            © {{ new Date().getFullYear() }} Caster & Sy. ALL RIGHTS RESERVED.
          </div>
        </v-container>
      </v-footer>

      <!-- NOTIFICATION -->
      <v-snackbar
        v-model="showCartMessage"
        color="black"
        timeout="2500"
        rounded="lg"
      >
        {{ cartMessage }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: "Caster & Sy | Move Your Way",
  meta: [
    {
      name: "description",
      content: "Discover everyday essentials and timeless finds at Caster & Sy.",
    },
    {
      name: "theme-color",
      content: "#F4F4F0",
    },
  ],
});

// STRAPI CONFIG
const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

// PRODUCT INTERFACE
interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
  image: any;
}

// CART INTERFACE
interface CartItem extends Product {
  quantity: number;
}

// SEARCH
const searchQuery = ref("");
const selectedCategory = ref("All");

// DRAWERS
const cartDrawer = ref(false);
const mobileMenu = ref(false);

// CART
const cart = ref<CartItem[]>([]);

// NOTIFICATION
const showCartMessage = ref(false);
const cartMessage = ref("");

// FETCH PRODUCTS
const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/products`, {
  lazy: true,
  query: {
    populate: "image",
    sort: "createdAt:desc",
    "pagination[pageSize]": 100,
    "filters[is_active][$eq]": true,
  },
});

// SHARED PRODUCTS STATE
const products = useState<Product[]>("products", () => []);

// Sync initial API response to shared state
watch(
  response,
  (newResponse) => {
    if (newResponse?.data) {
      products.value = newResponse.data;
    }
  },
  { immediate: true },
);

// UPDATE PRODUCT STATE AFTER CHECKOUT
function updateProductState(updatedProduct: Product) {
  const index = products.value.findIndex(
    (product) => product.documentId === updatedProduct.documentId,
  );

  if (index === -1) return;

  const existingProduct = products.value[index];

  if (!existingProduct) return;

  products.value[index] = {
    ...existingProduct,
    ...updatedProduct,
    image: updatedProduct.image || existingProduct.image,
  };
}

// CATEGORIES
const categories = computed(() => {
  return [
    ...new Set(
      products.value.map((product) => product.category).filter(Boolean),
    ),
  ];
});

// FILTER PRODUCTS
const filteredProducts = computed(() => {
  return products.value
    .filter((product) => product.is_active)
    .filter((product) => {
      const search = searchQuery.value.toLowerCase().trim();

      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory.value === "All" ||
        product.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    })
    .slice(0, 8);
});

// CART COUNT
const cartItemCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// CART TOTAL
const cartTotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

// ADD TO CART
function addToCart(product: Product) {
  const existingItem = cart.value.find(
    (item) => item.documentId === product.documentId,
  );

  if (!product.is_active || product.stock <= 0) {
    cartMessage.value = "This product is unavailable.";
    showCartMessage.value = true;
    return;
  }

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      cartMessage.value = "Maximum available stock reached.";
      showCartMessage.value = true;
      return;
    }

    existingItem.quantity++;
  } else {
    cart.value.push({
      ...product,
      quantity: 1,
    });
  }

  cartMessage.value = `${product.name} added to your cart!`;
  showCartMessage.value = true;
}
// INCREASE QUANTITY
function increaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (item && item.quantity < item.stock) {
    item.quantity++;
  }
}

// DECREASE QUANTITY
function decreaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (item && item.quantity > 1) {
    item.quantity--;
  }
}

// REMOVE FROM CART
function removeFromCart(documentId: string) {
  cart.value = cart.value.filter((item) => item.documentId !== documentId);
}

// CLEAR CART
function clearCart() {
  cart.value = [];
}

// CHECKOUT STATE
const checkoutDialog = ref(false);
const isCheckingOut = ref(false);
const checkoutError = ref("");

const successDialog = ref(false);
const completedOrderId = ref("");

const customer = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "COD",
});

const checkoutErrors = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "",
});

// OPEN CHECKOUT
function openCheckout() {
  if (cart.value.length === 0) {
    cartMessage.value = "Your bag is empty.";
    showCartMessage.value = true;
    return;
  }

  checkoutError.value = "";
  Object.keys(checkoutErrors).forEach((key) => {
    checkoutErrors[key as keyof typeof checkoutErrors] = "";
  });

  cartDrawer.value = false;
  checkoutDialog.value = true;
}

// CUSTOMER VALIDATION
function validateCheckout(): boolean {
  Object.keys(checkoutErrors).forEach((key) => {
    checkoutErrors[key as keyof typeof checkoutErrors] = "";
  });

  let valid = true;

  if (!customer.name.trim()) {
    checkoutErrors.name = "Full name is required.";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    checkoutErrors.email = "Enter a valid email address.";
    valid = false;
  }

  if (!customer.phone.trim() || customer.phone.trim().length < 7) {
    checkoutErrors.phone = "Enter a valid phone number.";
    valid = false;
  }

  if (!customer.address.trim()) {
    checkoutErrors.address = "Shipping address is required.";
    valid = false;
  }

  if (!["COD", "GCash"].includes(customer.paymentMethod)) {
    checkoutErrors.paymentMethod = "Select a payment method.";
    valid = false;
  }

  return valid;
}

// STRAPI REQUEST HELPER
async function strapiRequest(endpoint: string, method = "GET", body?: unknown) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        result?.message ||
        `Strapi request failed: ${response.status}`,
    );
  }

  return result;
}

// SUBMIT CHECKOUT
async function submitCheckout() {
  checkoutError.value = "";

  if (!validateCheckout()) return;

  if (cart.value.length === 0) {
    checkoutError.value = "Your cart is empty.";
    return;
  }

  isCheckingOut.value = true;

  try {
    // STEP 1: RECHECK CURRENT PRODUCT DATA FROM STRAPI
    const verifiedItems = [];

    for (const item of cart.value) {
      const result = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      const product = result.data;

      if (!product || !product.is_active) {
        throw new Error(`${item.name} is no longer available.`);
      }

      if (Number(product.stock) < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      verifiedItems.push({
        documentId: product.documentId,
        name: product.name,
        price: Number(product.price),
        stock: Number(product.stock),
        quantity: item.quantity,
      });
    }

    // STEP 2: COMPUTE TOTAL USING STRAPI PRICES
    const totalItems = verifiedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalAmount = Number(
      verifiedItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2),
    );

    // STEP 3: CREATE ORDER
    const orderResult = await strapiRequest("/api/orders", "POST", {
      data: {
        customerName: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        shippingAddress: customer.address.trim(),
        paymentMethod: customer.paymentMethod,
        order_status: "Pending",
        totalAmount,
        totalItems,
      },
    });

    const orderId = orderResult.data?.documentId;

    if (!orderId) {
      throw new Error("Order was created without a document ID.");
    }

    // STEP 4: CREATE ORDER ITEMS
    for (const item of verifiedItems) {
      await strapiRequest("/api/order-items", "POST", {
        data: {
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: Number((item.price * item.quantity).toFixed(2)),
          product: {
            connect: [item.documentId],
          },
          order: {
            connect: [orderId],
          },
        },
      });
    }

    // STEP 5: DEDUCT PRODUCT STOCK
    for (const item of verifiedItems) {
      const before = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      console.log("BEFORE UPDATE:", {
        name: before.data?.name,
        stock: before.data?.stock,
        image: before.data?.image,
      });

      const remainingStock = item.stock - item.quantity;

      await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}`,
        "PUT",
        {
          data: {
            stock: remainingStock,
          },
        },
      );

      const after = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      console.log("AFTER UPDATE:", {
        name: after.data?.name,
        stock: after.data?.stock,
        image: after.data?.image,
      });

      if (!after.data?.image) {
        console.error("WARNING: PRODUCT IMAGE IS MISSING AFTER UPDATE!");
      }
    }
    // STEP 6: SUCCESS

    console.log(
      "PRODUCT LISTING AFTER CHECKOUT:",
      products.value.map((product) => ({
        name: product.name,
        image: product.image,
        imageUrl: getImageUrl(product.image),
      })),
    );
  
    cart.value = [];

    customer.name = "";
    customer.email = "";
    customer.phone = "";
    customer.address = "";
    customer.paymentMethod = "COD";

    checkoutDialog.value = false;

    completedOrderId.value = orderId;
    successDialog.value = true;
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);

    checkoutError.value =
      error?.message || "Something went wrong during checkout.";
  } finally {
    isCheckingOut.value = false;
  }
}

// IMAGE URL
function getImageUrl(image: any): string {
  const imageData = Array.isArray(image) ? image[0] : image;

  if (!imageData?.url) return "";

  const imageUrl =
    imageData.formats?.medium?.url ||
    imageData.formats?.small?.url ||
    imageData.url;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${STRAPI_URL}${imageUrl}`;
}

// PRICE FORMAT
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price || 0);
}

// WISHLIST
const wishlist = ref<string[]>([]);

function toggleWishlist(product: Product) {
  const productId = product.documentId;

  if (wishlist.value.includes(productId)) {
    wishlist.value = wishlist.value.filter((id) => id !== productId);
    cartMessage.value = `${product.name} removed from wishlist.`;
  } else {
    wishlist.value.push(productId);
    cartMessage.value = `${product.name} added to wishlist!`;
  }

  showCartMessage.value = true;
}

function isWishlisted(product: Product): boolean {
  return wishlist.value.includes(product.documentId);
}

// NEWSLETTER
const newsletterEmail = ref("");

const emailRules = [
  (value: string) => !!value || "Email is required.",
  (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    "Please enter a valid email address.",
];

function subscribeNewsletter() {
  if (
    !newsletterEmail.value ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)
  ) {
    cartMessage.value = "Please enter a valid email address.";
    showCartMessage.value = true;
    return;
  }

  cartMessage.value = "Welcome to the Caster & Sy community!";
  showCartMessage.value = true;
  newsletterEmail.value = "";
}
</script>

<style scoped>
/* =========================================
   GLOBAL THEME
========================================= */
.nike-style {
  min-height: 100vh;
  background: #080b09;
  color: #f4f4f0;
}

.loading-page {
  min-height: 100vh;
  padding: 40px;
  background: #080b09;
}

#products,
#categories,
#top {
  scroll-margin-top: 90px;
}

:deep(.v-container) {
  max-width: 1500px;
}

/* =========================================
   NAVBAR
========================================= */
.main-navbar {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e0e6e2;
}

.navbar-container {
  max-width: 1500px;
  margin: auto;
}

.brand-logo {
  color: #0dc717;
  text-decoration: none;
  font-size: 37px;
  font-weight: 1000;
  letter-spacing: -4px;
  line-height: 1;
}

.desktop-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-navigation :deep(.v-btn) {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.desktop-cart {
  display: flex;
  align-items: center;
}

.mobile-menu {
  display: none;
}

/* =========================================
   MOBILE NAVIGATION
========================================= */
.mobile-navigation {
  background: #f4f4f0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.mobile-menu-title {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.mobile-menu-links a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  color: #111;
  text-decoration: none;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  border-bottom: 1px solid #deded8;
}

.mobile-cart-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  color: #111;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.mobile-menu-footer {
  padding: 20px;
  color: #888;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  border-top: 1px solid #deded8;
}

/* =========================================
   HERO SECTION
========================================= */
.hero-section {
  position: relative;
  min-height: 780px;
  height: min(780px, calc(100vh - 76px));
  display: flex;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
  background: #080b09;
  color: white;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background:
    radial-gradient(
      ellipse at 75% 45%,
      rgba(67, 130, 35, 0.14),
      transparent 45%
    ),
    linear-gradient(120deg, #080b09, #101711 55%, #080b09);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  animation: glowFloat 9s ease-in-out infinite alternate;
}

.hero-glow-one {
  width: 420px;
  height: 420px;
  background: rgba(130, 255, 45, 0.16);
  top: 5%;
  right: 10%;
}

.hero-glow-two {
  width: 300px;
  height: 300px;
  background: rgba(50, 180, 85, 0.13);
  bottom: -10%;
  left: 15%;
  animation-delay: -4s;
}

.hero-glow-three {
  width: 200px;
  height: 200px;
  background: rgba(184, 255, 69, 0.12);
  top: 35%;
  right: 40%;
  animation-delay: -2s;
}

.hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.09;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
  background-size: 65px 65px;
  mask-image: linear-gradient(to bottom, black, transparent 90%);
}

.hero-inner {
  width: 100%;
  max-width: 1450px;
  padding: 70px 8%;
  margin: auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 35px;
}

.hero-content {
  position: relative;
  z-index: 2;
  animation: heroReveal 1s ease both;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 17px;
  border: 1px solid rgba(184, 255, 69, 0.25);
  border-radius: 30px;
  background: rgba(184, 255, 69, 0.06);
  color: #c6ff78;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.hero-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b8ff45;
  box-shadow: 0 0 12px #b8ff45;
}

.hero-content h1 {
  margin-top: 35px;
  color: white;
  font-size: clamp(75px, 10vw, 140px);
  font-weight: 1000;
  line-height: 0.85;
  letter-spacing: -8px;
}

.hero-content h1 span {
  display: block;
  color: #b8ff45;
  text-shadow: 0 0 35px rgba(184, 255, 69, 0.13);
}

.hero-description {
  max-width: 430px;
  margin-top: 30px;
  color: #a8b0a8;
  font-size: 15px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 32px;
}

.hero-button {
  color: #101510 !important;
  font-weight: 900 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 0 25px rgba(184, 255, 69, 0.12);
  transition: all 0.3s ease !important;
}

.hero-button:hover {
  box-shadow: 0 0 35px rgba(184, 255, 69, 0.4);
  transform: translateY(-4px);
}

.hero-explore {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d4d8d2;
  text-decoration: none;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.hero-explore:hover {
  color: #b8ff45;
}

.hero-bottom-info {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 75px;
}

.hero-bottom-info div:not(.hero-info-divider) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-bottom-info strong {
  color: #b8ff45;
  font-size: 20px;
  font-weight: 900;
}

.hero-bottom-info span {
  color: #858d84;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.hero-info-divider {
  width: 1px;
  height: 35px;
  background: #343b34;
}

/* HERO VISUAL */
.hero-visual {
  position: relative;
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: heroReveal 1.2s ease both;
  animation-delay: 0.2s;
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(184, 255, 69, 0.17);
  animation: circleRotate 25s linear infinite;
}

.hero-circle-one {
  width: 400px;
  height: 400px;
  box-shadow:
    0 0 50px rgba(184, 255, 69, 0.04),
    inset 0 0 50px rgba(184, 255, 69, 0.04);
}

.hero-circle-two {
  width: 310px;
  height: 310px;
  border-style: dashed;
  animation-direction: reverse;
  animation-duration: 35s;
}

.hero-visual-text {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-visual-text span {
  color: #b8ff45;
  font-size: 17px;
  font-weight: 1000;
  letter-spacing: 8px;
}

.hero-visual-text strong {
  display: block;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(42px, 5vw, 65px);
  line-height: 0.95;
  font-weight: 1000;
  letter-spacing: -3px;
}

.visual-line {
  width: 55px;
  height: 3px;
  margin: 25px auto;
  background: #b8ff45;
  box-shadow: 0 0 15px #b8ff45;
}

.hero-visual-text small {
  color: #8b9489;
  font-size: 8px;
  letter-spacing: 2px;
}

.hero-floating-label {
  position: absolute;
  right: 0;
  bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  border: 1px solid rgba(184, 255, 69, 0.2);
  background: rgba(20, 30, 20, 0.8);
  backdrop-filter: blur(12px);
  color: #cbd5c5;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.hero-bottom-line {
  position: absolute;
  right: 8%;
  bottom: 0;
  left: 8%;
  display: flex;
  justify-content: space-between;
  padding: 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #777f76;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* =========================================
   ANIMATIONS
========================================= */
@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowFloat {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-35px, 25px) scale(1.15);
  }
}

@keyframes circleRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* =========================================
   SECTION HEADINGS
========================================= */
.section-spacing {
  padding-top: 65px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
}

.eyebrow {
  color: #b8ff45;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2.5px;
}

.section-header h2 {
  margin-top: 9px;
  color: #f4f4f0;
  font-size: clamp(27px, 4vw, 40px);
  font-weight: 1000;
  letter-spacing: -1.8px;
  line-height: 1.1;
}

.section-header p {
  margin-top: 10px;
  color: #929a91;
  font-size: 14px;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 5px;
  color: #b8ff45;
  text-decoration: none;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  transition: gap 0.25s ease;
}

.view-all-link:hover {
  gap: 14px;
}

/* =========================================
   PROMOTION
========================================= */
.promo-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  min-height: 320px;
  padding: 55px;
  overflow: hidden;
  border: 1px solid rgba(184, 255, 69, 0.16);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 80% 30%,
      rgba(184, 255, 69, 0.12),
      transparent 35%
    ),
    linear-gradient(120deg, #172219, #0c120d 70%);
}

.promo-content {
  position: relative;
  z-index: 1;
}

.light-eyebrow {
  color: #b8ff45;
}

.promo-section h2 {
  margin-top: 18px;
  color: #f4f4f0;
  font-size: clamp(35px, 5vw, 60px);
  line-height: 0.98;
  font-weight: 1000;
  letter-spacing: -2.5px;
}

.promo-section p {
  max-width: 430px;
  margin-top: 18px;
  margin-bottom: 25px;
  color: #a6b0a4;
  font-size: 14px;
  line-height: 1.8;
}

.promo-section > :deep(.v-icon) {
  color: #b8ff45 !important;
  opacity: 0.55;
  filter: drop-shadow(0 0 25px rgba(184, 255, 69, 0.2));
}

/* =========================================
   SEARCH
========================================= */
.product-search-area {
  max-width: 650px;
  margin-top: 32px;
}

.product-search {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 58px;
  padding: 0 18px;
  border: 1px solid #283329;
  border-radius: 12px;
  background: #121913;
  transition: all 0.25s ease;
}

.product-search:focus-within {
  border-color: #b8ff45;
  background: #172119;
  box-shadow: 0 0 20px rgba(184, 255, 69, 0.07);
}

.product-search-input {
  flex: 1;
  min-width: 0;
  height: 56px;
  border: none;
  outline: none;
  background: transparent;
  color: #f4f4f0;
  font-family: inherit;
  font-size: 14px;
}

.product-search-input::placeholder {
  color: #7d877c;
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #aab4a8;
  cursor: pointer;
}

.search-caption {
  display: block;
  margin-top: 10px;
  color: #737e72;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* =========================================
   CATEGORY FILTERS
========================================= */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.product-category-list :deep(.v-chip) {
  min-height: 38px;
  border: 1px solid #344034 !important;
  border-radius: 30px !important;
  background: #111812 !important;
  color: #b9c2b5 !important;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  transition: all 0.25s ease;
}

.product-category-list :deep(.v-chip:hover) {
  border-color: #b8ff45 !important;
  color: #b8ff45 !important;
}

.product-category-list :deep(.v-chip--variant-flat) {
  border-color: #b8ff45 !important;
  background: #b8ff45 !important;
  color: #101510 !important;
}

/* =========================================
   PRODUCT GRID
========================================= */
.product-grid {
  align-items: stretch;
}

.product-column {
  display: flex;
}

/* =========================================
   PRODUCT CARD
========================================= */
.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(184, 255, 69, 0.13);
  border-radius: 18px !important;
  background: linear-gradient(
    145deg,
    #182119 0%,
    #101711 55%,
    #0c120d 100%
  ) !important;
  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.product-card:hover {
  transform: translateY(-7px);
  border-color: rgba(184, 255, 69, 0.55);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.35),
    0 0 25px rgba(184, 255, 69, 0.07);
}

/* PRODUCT IMAGE */
.product-image {
  position: relative;
  flex-shrink: 0;
  margin: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 13px;
  background: #1b241c;
}

.product-image :deep(.v-img) {
  transition: transform 0.5s ease;
}

.product-image :deep(.v-img img) {
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.product-card:hover .product-image :deep(.v-img img) {
  transform: scale(1.06);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #1b241c;
  color: #657361;
}

/* WISHLIST */
.wishlist-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: #f4f4f0 !important;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease;
}

.wishlist-button:hover {
  transform: scale(1.12);
}

/* STOCK */
.product-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  background: #b8ff45;
  color: #101510;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.out-of-stock {
  background: #292d29;
  color: #b4b9b2;
}

/* PRODUCT DETAILS */
.product-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px 16px 10px !important;
}

.product-heading {
  min-height: 69px;
}

.product-name {
  display: -webkit-box;
  min-height: 42px;
  overflow: hidden;
  color: #f4f4f0;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: -0.3px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-category {
  min-height: 14px;
  margin-top: 5px;
  color: #a0aa9c;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.product-price {
  margin-top: 13px;
  color: #b8ff45;
  font-size: 19px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.5px;
}

.product-description {
  display: -webkit-box;
  min-height: 41px;
  margin-top: 9px;
  overflow: hidden;
  color: #9aa398;
  font-size: 12px;
  line-height: 1.7;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ADD TO CART */
.product-actions {
  margin-top: auto;
  padding: 8px 16px 18px !important;
}

.add-to-cart-button {
  border: 1px solid #b8ff45 !important;
  background: #b8ff45 !important;
  color: #101510 !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  letter-spacing: 1px !important;
  transition: all 0.25s ease !important;
}

.add-to-cart-button:hover {
  transform: translateY(-2px);
  border-color: #d0ff85 !important;
  background: #d0ff85 !important;
}

.add-to-cart-button:disabled {
  border-color: #303830 !important;
  background: #303830 !important;
  color: #899187 !important;
  opacity: 1 !important;
}

/* =========================================
   CHECKOUT
========================================= */
.checkout-card {
  background: #f9f9f6;
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}

.checkout-header h2 {
  margin-top: 5px;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 1000;
  letter-spacing: -1px;
}

.checkout-section-title {
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e5df;
}

.checkout-item-image {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  overflow: hidden;
  border-radius: 8px;
  background: #edede8;
}

/* =========================================
   CART DRAWER
========================================= */
.cart-drawer {
  max-width: 100vw;
  background: #f9f9f6;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
}

.cart-header-eyebrow {
  color: #888;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
}

.cart-header h2 {
  margin-top: 5px;
  font-size: 25px;
  font-weight: 1000;
  letter-spacing: -1px;
}

.cart-count {
  color: #999;
  font-size: 16px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 90px);
  min-height: 0;
}

.cart-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
}

.cart-summary {
  flex-shrink: 0;
  padding: 16px 20px 24px;
  border-top: 1px solid #e5e5df;
  background: #f9f9f6;
}

.cart-product-card {
  overflow: hidden;
  border: 1px solid #eaeae5;
  border-radius: 16px !important;
  background: white !important;
  transition: all 0.25s ease;
}

.cart-product-card:hover {
  border-color: #c8c8bd;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

.cart-image-wrapper {
  overflow: hidden;
  border-radius: 12px;
  background: #f4f4f0;
}

.cart-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 125px;
  color: #aaa;
}

.cart-item-label {
  margin-bottom: 5px;
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.cart-product-name {
  color: #222;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.cart-product-price {
  color: #222;
  font-size: 16px;
  font-weight: 800;
}

.cart-unit-price,
.cart-stock-label {
  color: #888;
  font-size: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 5px;
  border: 1px solid #e5e5df;
  border-radius: 30px;
  background: #fafaf8;
}

.quantity-number {
  min-width: 20px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.empty-cart {
  padding: 65px 25px;
  color: #777;
  text-align: center;
}

/* =========================================
   ORDER SUCCESS
========================================= */
.success-card {
  overflow: hidden;
  background: #f9f9f6;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 85px;
  margin: 35px auto 0;
  border-radius: 50%;
  background: #111;
}

.success-eyebrow {
  color: #888;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.success-title {
  color: #111;
  font-size: 42px;
  font-weight: 1000;
  letter-spacing: -2px;
}

.success-message {
  color: #777;
  font-size: 14px;
  line-height: 1.8;
}

.order-reference {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 12px;
  background: #eeeeea;
}

.order-reference span {
  color: #888;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.order-reference strong {
  color: #111;
  font-size: 19px;
  word-break: break-all;
}

/* =========================================
   NEWSLETTER
========================================= */
.newsletter-section {
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(184, 255, 69, 0.16);
  border-bottom: 1px solid rgba(184, 255, 69, 0.16);
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(184, 255, 69, 0.12),
      transparent 35%
    ),
    linear-gradient(120deg, #172219, #0b110c);
  color: #f4f4f0;
}

.newsletter-section h2 {
  margin-top: 18px;
  color: #f4f4f0;
  font-size: clamp(38px, 6vw, 65px);
  line-height: 0.95;
  font-weight: 1000;
  letter-spacing: -3px;
}

.newsletter-section p {
  max-width: 400px;
  margin-top: 18px;
  color: #a6b0a4;
  line-height: 1.7;
}

/* Newsletter input */
.newsletter-section :deep(.v-field) {
  border-radius: 10px !important;
  background: #f4f4f0 !important;
}

.newsletter-section :deep(.v-label) {
  color: #555 !important;
}

/* =========================================
   FOOTER
========================================= */
.main-footer {
  background: #080b09;
  color: white;
}

.footer-logo {
  color: #b8ff45;
  font-size: 65px;
  font-weight: 1000;
  letter-spacing: -7px;
}

.footer-description {
  color: #929a91;
  font-size: 13px;
  line-height: 1.8;
}

.main-footer h4 {
  margin-bottom: 18px;
  color: #f4f4f0;
  font-size: 12px;
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-links a {
  color: #929a91;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #b8ff45;
}

.footer-bottom {
  color: #737d72;
  font-size: 10px;
  letter-spacing: 1px;
}

/* =========================================
   RESPONSIVE - TABLET
========================================= */
@media (max-width: 960px) {
  .desktop-navigation,
  .desktop-cart {
    display: none !important;
  }

  .mobile-menu {
    display: flex !important;
    align-items: center;
  }

  .hero-section {
    height: auto;
    min-height: 850px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 75px 7% 100px;
  }

  .hero-content h1 {
    font-size: clamp(75px, 15vw, 115px);
  }

  .hero-bottom-info {
    margin-top: 45px;
  }

  .hero-visual {
    min-height: 330px;
  }

  .hero-circle-one {
    width: 300px;
    height: 300px;
  }

  .hero-circle-two {
    width: 230px;
    height: 230px;
  }

  .hero-visual-text strong {
    font-size: 48px;
  }
}

/* =========================================
   RESPONSIVE - MOBILE
========================================= */
@media (max-width: 600px) {
  .brand-logo {
    font-size: 34px;
  }

  .hero-section {
    min-height: 800px;
  }

  .hero-inner {
    padding: 65px 23px 100px;
  }

  .hero-content h1 {
    font-size: 76px;
    letter-spacing: -5px;
  }

  .hero-description {
    font-size: 13px;
  }

  .hero-actions {
    gap: 20px;
  }

  .hero-bottom-info {
    margin-top: 40px;
  }

  .hero-visual {
    min-height: 290px;
  }

  .hero-circle-one {
    width: 260px;
    height: 260px;
  }

  .hero-circle-two {
    width: 200px;
    height: 200px;
  }

  .hero-visual-text strong {
    font-size: 42px;
  }

  .hero-floating-label {
    right: 0;
    bottom: 0;
    padding: 10px;
    font-size: 8px;
  }

  .hero-bottom-line {
    right: 23px;
    left: 23px;
    font-size: 7px;
  }

  .section-spacing {
    padding-top: 42px;
  }

  .section-header h2 {
    font-size: 25px;
  }

  .section-header p {
    font-size: 12px;
  }

  .view-all-link {
    font-size: 9px;
  }

  .promo-section {
    min-height: 260px;
    padding: 30px 23px;
    border-radius: 14px;
  }

  .promo-section h2 {
    font-size: 38px;
  }

  .promo-section p {
    font-size: 12px;
  }

  .promo-section > :deep(.v-icon) {
    display: none;
  }

  .product-search-area {
    margin-top: 22px;
  }

  .product-search {
    min-height: 52px;
    padding: 0 13px;
  }

  .product-search-input {
    height: 50px;
    font-size: 12px;
  }

  .product-category-list {
    gap: 7px;
  }

  .product-category-list :deep(.v-chip) {
    min-height: 34px;
    font-size: 9px;
  }

  .product-card {
    border-radius: 13px !important;
  }

  .product-image {
    margin: 7px;
    border-radius: 10px;
  }

  .product-image :deep(.v-img) {
    height: 220px !important;
  }

  .image-placeholder {
    height: 220px;
  }

  .product-details {
    padding: 12px 12px 8px !important;
  }

  .product-heading {
    min-height: 64px;
  }

  .product-name {
    min-height: 36px;
    font-size: 13px;
  }

  .product-category {
    font-size: 9px;
  }

  .product-price {
    margin-top: 10px;
    font-size: 16px;
  }

  .product-description {
    min-height: 38px;
    font-size: 11px;
  }

  .product-actions {
    padding: 8px 12px 14px !important;
  }

  .add-to-cart-button {
    height: 44px !important;
    font-size: 10px !important;
  }

  .product-tag {
    padding: 6px 9px;
    font-size: 8px;
  }

  .wishlist-button {
    top: 8px;
    right: 8px;
  }

  .newsletter-section h2 {
    font-size: 45px;
  }

  .footer-logo {
    font-size: 52px;
  }

  .cart-product-name {
    font-size: 13px;
  }

  .cart-product-price {
    font-size: 14px;
  }

  .cart-summary {
    padding-bottom: 20px;
  }
}

/* =========================================
   ACCESSIBILITY
========================================= */
@media (prefers-reduced-motion: reduce) {
  .hero-content,
  .hero-visual,
  .hero-glow,
  .hero-circle {
    animation: none !important;
  }

  .hero-button,
  .product-card,
  .product-image :deep(.v-img img) {
    transition: none !important;
  }
}
</style>