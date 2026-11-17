<template>
  <div class="shop-page">
    <!-- NAVBAR -->
    <v-app-bar flat class="main-navbar" height="82">
      <v-container class="d-flex align-center">
        <div class="brand-logo">
          <div class="logo-mark">JA</div>
          <div class="brand-name">
            <strong>JAMES-ALJON</strong>
            <small>QUALITY & STYLE</small>
          </div>
        </div>

        <v-spacer />

        <div class="d-none d-md-flex align-center ga-8">
          <a href="#home" class="nav-link">Home</a>
          <a href="#categories" class="nav-link">Categories</a>
          <NuxtLink  class="nav-link" to="/products">Manage Product</NuxtLink>
        </div>

        <v-spacer />

        <v-btn
          icon="mdi-cart-outline"
          variant="text"
          color="white"
          @click="cartDrawer = true"
        >
          <v-badge
            v-if="cartItemCount"
            :content="cartItemCount"
            color="orange"
          >
            <v-icon icon="mdi-cart-outline" />
          </v-badge>
          <v-icon v-else icon="mdi-cart-outline" />
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- HERO -->
    <section id="home" class="hero-section">
      <v-container class="hero-container">
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="hero-label">
              <span class="orange-dot"></span>
              WELCOME TO JAMES-ALJON
            </div>

            <h1 class="hero-title">
              DISCOVER<br />
              YOUR NEXT<br />
              <span>FAVORITE.</span>
            </h1>

            <p class="hero-description">
              Quality products. Modern essentials. Everyday favorites.
              Discover a collection made for your lifestyle.
            </p>

            <div class="d-flex flex-wrap ga-3 mt-8">
              <v-btn
                href="#featured"
                color="orange-darken-1"
                size="x-large"
                rounded="lg"
                append-icon="mdi-arrow-right"
                class="font-weight-bold"
              >
                Explore Collection
              </v-btn>

              <v-btn
                href="#categories"
                color="white"
                variant="outlined"
                size="x-large"
                rounded="lg"
              >
                Browse Categories
              </v-btn>
            </div>

            <div class="hero-stats">
              <div>
                <strong>QUALITY</strong>
                <span>Selected products</span>
              </div>
              <div>
                <strong>STYLE</strong>
                <span>Modern collection</span>
              </div>
              <div>
                <strong>VALUE</strong>
                <span>Everyday essentials</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="hero-visual">
              <div class="visual-circle"></div>
              <div class="visual-logo">JA</div>
              <div class="visual-caption">
                <span>JAMES-ALJON</span>
                <strong>EST. 2026</strong>
              </div>
              <div class="visual-tag">
                <v-icon icon="mdi-star-four-points" color="orange" />
                YOUR EVERYDAY COLLECTION
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- BENEFITS -->
    <v-container class="benefits-section">
      <v-row>
        <v-col cols="12" sm="4">
          <div class="benefit">
            <v-icon icon="mdi-shield-check-outline" />
            <div>
              <strong>Quality Selection</strong>
              <span>Products worth discovering</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="4">
          <div class="benefit">
            <v-icon icon="mdi-heart-outline" />
            <div>
              <strong>Personal Favorites</strong>
              <span>Save what you love</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="4">
          <div class="benefit">
            <v-icon icon="mdi-cart-check" />
            <div>
              <strong>Easy Shopping</strong>
              <span>Your collection in one place</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- CATEGORY -->
    <v-container id="categories" class="section-space">
      <div class="section-heading">
        <div>
          <span class="section-label">EXPLORE OUR STORE</span>
          <h2>Shop by category.</h2>
          <p>Find something that matches your style.</p>
        </div>
      </div>

      <div class="category-list">
        <v-chip
          size="large"
          :color="selectedCategory === 'All' ? 'orange-darken-1' : 'grey'"
          :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
          @click="selectedCategory = 'All'"
        >
          All Products
        </v-chip>

        <v-chip
          v-for="category in categories"
          :key="category"
          size="large"
          :color="selectedCategory === category ? 'orange-darken-1' : 'grey'"
          :variant="selectedCategory === category ? 'flat' : 'outlined'"
          @click="selectedCategory = category"
        >
          {{ category }}
        </v-chip>
      </div>
    </v-container>

    <!-- PRODUCTS -->
    <v-container id="featured" class="section-space">
      <div class="section-heading">
        <div>
          <span class="section-label">HANDPICKED FOR YOU</span>
          <h2>Featured collection.</h2>
          <p>Discover our latest products and everyday essentials.</p>
        </div>

        <v-chip color="orange-darken-1" variant="tonal">
          {{ filteredProducts.length }} Products
        </v-chip>
      </div>

      <v-text-field
        v-model="searchQuery"
        class="search-box mt-7 mb-8"
        placeholder="Search your favorite products..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="lg"
        clearable
        hide-details
      />

      <div v-if="pending" class="text-center pa-12">
        <v-progress-circular indeterminate color="orange" />
        <p class="mt-4">Loading products...</p>
      </div>

      <v-alert v-else-if="error" type="warning" variant="tonal">
        Unable to load products. Please check your Strapi connection.
      </v-alert>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <v-icon icon="mdi-package-variant" size="55" />
        <h3>No products found</h3>
        <p>Try another search or category.</p>
        <v-btn color="orange" @click="resetFilters">
          Clear filters
        </v-btn>
      </div>

      <v-row v-else>
        <v-col
          v-for="product in filteredProducts"
          :key="product.documentId"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="product-card" rounded="xl" elevation="0">
            <div class="product-image">
              <v-img
                v-if="getImageUrl(product.image)"
                :src="getImageUrl(product.image)"
                height="230"
                cover
              />

              <div v-else class="image-placeholder">
                <v-icon icon="mdi-image-outline" size="55" />
              </div>

              <v-btn
                icon
                size="small"
                class="wishlist-btn"
                :color="isWishlisted(product) ? 'red' : 'white'"
                @click.stop="toggleWishlist(product)"
              >
                <v-icon
                  :color="isWishlisted(product) ? 'white' : 'red'"
                  :icon="isWishlisted(product) ? 'mdi-heart' : 'mdi-heart-outline'"
                />
              </v-btn>

              <v-chip
                v-if="product.stock <= 5 && product.stock > 0"
                class="stock-chip"
                color="orange"
                size="small"
              >
                Low stock
              </v-chip>

              <v-chip
                v-else-if="product.stock <= 0"
                class="stock-chip"
                color="grey"
                size="small"
              >
                Sold out
              </v-chip>
            </div>

            <v-card-text class="pa-4">
              <span class="product-category">
                {{ product.category || 'GENERAL' }}
              </span>

              <h3 class="product-name">{{ product.name }}</h3>

              <p class="product-description">
                {{ product.description || 'Discover this product from our collection.' }}
              </p>

              <div class="d-flex justify-space-between align-center mt-4">
                <strong class="product-price">
                  {{ formatPrice(product.price) }}
                </strong>
                <span class="stock-text">
                  {{ product.stock }} available
                </span>
              </div>
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
              <v-btn
                block
                color="orange-darken-1"
                rounded="lg"
                :disabled="product.stock <= 0"
                @click="addToCart(product)"
              >
                <v-icon start icon="mdi-cart-plus" />
                Add to cart
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- PROMO -->
    <v-container class="section-space">
      <section class="promo-section">
        <div class="promo-content">
          <span class="section-label">THE JAMES-ALJON EXPERIENCE</span>
          <h2>MORE THAN JUST<br />A SHOPPING DESTINATION.</h2>
          <p>
            Explore a collection of products designed to bring quality,
            convenience, and style into your everyday life.
          </p>
          <v-btn
            href="#featured"
            color="orange-darken-1"
            size="large"
            rounded="lg"
            append-icon="mdi-arrow-right"
          >
            Discover More
          </v-btn>
        </div>
        <div class="promo-watermark">JA</div>
      </section>
    </v-container>

    <!-- NEWSLETTER -->
    <v-container class="section-space">
      <v-card class="newsletter-card pa-6 pa-md-10" rounded="xl" elevation="0">
        <v-row align="center">
          <v-col cols="12" md="6">
            <span class="section-label">STAY CONNECTED</span>
            <h2>Be part of the collection.</h2>
            <p>Get updates about new arrivals and featured products.</p>
          </v-col>

          <v-col cols="12" md="6">
            <v-form @submit.prevent="subscribeNewsletter">
              <v-text-field
                v-model="newsletterEmail"
                label="Your email address"
                type="email"
                variant="outlined"
                rounded="lg"
                :rules="emailRules"
                required
              />
              <v-btn
                type="submit"
                block
                color="orange-darken-1"
                size="large"
                rounded="lg"
              >
                Subscribe
              </v-btn>
            </v-form>
            <p class="text-caption mt-2">
              Demo subscription form — no email is sent.
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- CART DRAWER -->
    <v-navigation-drawer
      v-model="cartDrawer"
      location="right"
      temporary
      width="400"
      class="cart-drawer"
    >
      <div class="d-flex justify-space-between align-center pa-4">
        <div>
          <span class="section-label">YOUR SELECTION</span>
          <h2>Shopping cart</h2>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
      </div>

      <v-divider />

      <div v-if="cart.length === 0" class="text-center pa-8">
        <v-icon icon="mdi-cart-outline" size="65" color="grey" />
        <h3 class="mt-4">Your cart is empty</h3>
        <p class="mt-2">Start exploring our collection.</p>
        <v-btn class="mt-4" color="orange" @click="cartDrawer = false">
          Continue shopping
        </v-btn>
      </div>

      <div v-else class="pa-4">
        <v-card
          v-for="item in cart"
          :key="item.documentId"
          class="mb-3 pa-3"
          variant="outlined"
        >
          <div class="d-flex ga-3 align-center">
            <v-img
              :src="getImageUrl(item.image) || undefined"
              width="75"
              height="75"
              max-width="75"
              cover
              rounded="lg"
            />
            <div class="flex-grow-1">
              <strong>{{ item.name }}</strong>
              <div class="font-weight-bold text-orange mt-1">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              <div class="d-flex align-center mt-2">
                <v-btn
                  icon="mdi-minus"
                  size="x-small"
                  variant="outlined"
                  :disabled="item.quantity <= 1"
                  @click="decreaseQuantity(item.documentId)"
                />
                <span class="mx-3">{{ item.quantity }}</span>
                <v-btn
                  icon="mdi-plus"
                  size="x-small"
                  variant="outlined"
                  :disabled="item.quantity >= item.stock"
                  @click="increaseQuantity(item.documentId)"
                />
              </div>
            </div>
            <v-btn
              icon="mdi-delete-outline"
              color="error"
              variant="text"
              size="small"
              @click="removeFromCart(item.documentId)"
            />
          </div>
        </v-card>

        <v-divider class="my-4" />

        <div class="d-flex justify-space-between mb-4">
          <strong>Subtotal</strong>
          <strong class="text-orange">
            {{ formatPrice(cartTotal) }}
          </strong>
        </div>

        <v-btn
          block
          color="error"
          variant="outlined"
          class="mb-3"
          @click="clearCart"
        >
          Clear cart
        </v-btn>

        <v-btn block color="orange" disabled>
          Checkout coming soon
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-snackbar v-model="showMessage" :color="messageColor" timeout="2500">
      {{ message }}
    </v-snackbar>

    <!-- FOOTER -->
    <footer class="main-footer">
      <v-container class="py-12">
        <v-row>
          <v-col cols="12" md="5">
            <div class="brand-logo mb-5">
              <div class="logo-mark">JA</div>
              <div class="brand-name">
                <strong>JAMES-ALJON</strong>
                <small>QUALITY & STYLE</small>
              </div>
            </div>

            <p class="footer-description">
              Your destination for quality products, modern essentials,
              and everyday favorites.
            </p>

            <div class="d-flex ga-2 mt-5">
              <v-btn icon="mdi-facebook" variant="text" color="white" href="https://facebook.com" target="_blank" />
              <v-btn icon="mdi-instagram" variant="text" color="white" href="https://instagram.com" target="_blank" />
            </div>
          </v-col>

          <v-col cols="6" md="2">
            <h3>Explore</h3>
            <div class="footer-links">
              <a href="#home">Home</a>
              <a href="#categories">Categories</a>
              <a href="#featured">Collection</a>
            </div>
          </v-col>

          <v-col cols="6" md="2">
            <h3>Our Store</h3>
            <div class="footer-links">
              <NuxtLink to="/products">Products</NuxtLink>
              <a href="#featured">Featured</a>
              <a href="#categories">Browse</a>
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <h3>Contact</h3>
            <div class="footer-links">
              <span>Philippines</span>
              <span>JAMES-ALJON Online Store</span>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-divider color="grey-darken-2" />

      <v-container class="py-5">
        <div class="d-flex flex-column flex-sm-row justify-space-between ga-2">
          <span class="text-caption">
            © {{ new Date().getFullYear() }} JAMES-ALJON. All rights reserved.
          </span>
          <span class="text-caption">
            QUALITY • STYLE • EVERYDAY
          </span>
        </div>
      </v-container>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  is_active: boolean;
  image?: any;
}
interface CartItem extends Product {
  quantity: number;
}

const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

useHead({ title: "Aljon james" });

const searchQuery = ref("");
const selectedCategory = ref("All");
const cartDrawer = ref(false);
const cart = ref<CartItem[]>([]);
const wishlist = ref<string[]>([]);
const newsletterEmail = ref("");
const showMessage = ref(false);
const message = ref("");
const messageColor = ref("success");

const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/shop-karts`, {
  lazy: true,
  query: {
    populate: "image",
    sort: "createdAt:desc",
    "pagination[pageSize]": 100,
    "filters[is_active][$eq]": true,
  },
});

const products = computed(() => response.value?.data ?? []);
const categories = computed<string[]>(() => {
  return [
    ...new Set(
      products.value
        .map((product) => product.category)
        .filter((category): category is string => Boolean(category)),
    ),
  ];
});
const filteredProducts = computed(() => {
  const keyword = searchQuery.value.toLowerCase().trim();
  return products.value
    .filter((product) => product.is_active)
    .filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.category?.toLowerCase().includes(keyword);
      const matchesCategory =
        selectedCategory.value === "All" ||
        product.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    })
    .slice(0, 8);
});
const cartItemCount = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0),
);
const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

function notify(text: string, color = "success") {
  message.value = text;
  messageColor.value = color;
  showMessage.value = true;
}
function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = "All";
}
function getImageUrl(image: any): string {
  const imageData = Array.isArray(image) ? image[0] : image;
  if (!imageData?.url) return "";
  const imageUrl =
    imageData.formats?.medium?.url ||
    imageData.formats?.small?.url ||
    imageData.url;
  return imageUrl.startsWith("http://") || imageUrl.startsWith("https://")
    ? imageUrl
    : `${STRAPI_URL}${imageUrl}`;
}
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price || 0));
}
function addToCart(product: Product) {
  if (!product.is_active || product.stock <= 0)
    return notify("This product is unavailable.", "error");
  const existing = cart.value.find(
    (item) => item.documentId === product.documentId,
  );
  if (existing) {
    if (existing.quantity >= product.stock)
      return notify("Maximum available stock reached.", "warning");
    existing.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
  notify(`${product.name} added to cart!`);
}
function increaseQuantity(id: string) {
  const item = cart.value.find((entry) => entry.documentId === id);
  if (item && item.quantity < item.stock) item.quantity++;
}
function decreaseQuantity(id: string) {
  const item = cart.value.find((entry) => entry.documentId === id);
  if (item && item.quantity > 1) item.quantity--;
}
function removeFromCart(id: string) {
  cart.value = cart.value.filter((item) => item.documentId !== id);
}
function clearCart() {
  cart.value = [];
}
function toggleWishlist(product: Product) {
  const id = product.documentId;
  if (wishlist.value.includes(id)) {
    wishlist.value = wishlist.value.filter((item) => item !== id);
    notify(`${product.name} removed from wishlist.`);
  } else {
    wishlist.value.push(id);
    notify(`${product.name} added to wishlist!`);
  }
}
function isWishlisted(product: Product) {
  return wishlist.value.includes(product.documentId);
}

const emailRules = [
  (value: string) => !!value || "Email is required.",
  (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Enter a valid email address.",
];
function subscribeNewsletter() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
    return notify("Please enter a valid email address.", "error");
  }
  notify(
    "Thanks for your interest! Newsletter integration can be added later.",
  );
  newsletterEmail.value = "";
}
</script>

<style scoped>
.shop-page {
  background: #111315;
  color: #fff;
}

/* NAVBAR */
.main-navbar {
  background: #17191c !important;
  border-bottom: 1px solid #303438;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  background: #ff7417;
  color: #151515;
  font-size: 21px;
  font-weight: 950;
  letter-spacing: -2px;
  border-radius: 10px;
}

.brand-name strong {
  display: block;
  font-size: 16px;
  letter-spacing: 1.5px;
  color: white;
}

.brand-name small {
  display: block;
  font-size: 9px;
  letter-spacing: 2px;
  color: #ff7417;
  margin-top: 3px;
}

.nav-link {
  color: #c4c7c9;
  text-decoration: none;
  font-size: 14px;
  transition: .2s;
}

.nav-link:hover {
  color: #ff7417;
}

/* HERO */
.hero-section {
  background:
    radial-gradient(circle at 80% 45%, #ff74171c, transparent 35%),
    linear-gradient(120deg, #111315, #1d2124);
  border-bottom: 1px solid #303438;
  overflow: hidden;
}

.hero-container {
  padding-top: 85px;
  padding-bottom: 85px;
}

.hero-label,
.section-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #ff7417;
}

.orange-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #ff7417;
  border-radius: 50%;
  margin-right: 8px;
}

.hero-title {
  font-size: clamp(3.2rem, 7vw, 6rem);
  line-height: .98;
  font-weight: 950;
  letter-spacing: -4px;
  margin-top: 25px;
}

.hero-title span {
  color: #ff7417;
}

.hero-description {
  max-width: 480px;
  color: #aeb4b8;
  line-height: 1.9;
  margin-top: 25px;
  font-size: 16px;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  margin-top: 55px;
}

.hero-stats strong,
.hero-stats span {
  display: block;
}

.hero-stats strong {
  color: #ff7417;
  font-size: 13px;
  letter-spacing: 1px;
}

.hero-stats span {
  color: #858b90;
  font-size: 11px;
  margin-top: 5px;
}

.hero-visual {
  height: 430px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-circle {
  position: absolute;
  width: min(350px, 85%);
  aspect-ratio: 1;
  border: 1px solid #ff741766;
  border-radius: 50%;
  box-shadow: 0 0 90px #ff741722;
}

.visual-logo {
  font-size: clamp(110px, 18vw, 190px);
  font-weight: 950;
  letter-spacing: -15px;
  color: #ff7417;
  text-shadow: 0 10px 60px #ff741744;
}

.visual-caption {
  position: absolute;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.visual-caption span {
  font-weight: 900;
  letter-spacing: 4px;
}

.visual-caption strong {
  font-size: 10px;
  color: #ff7417;
  letter-spacing: 3px;
}

.visual-tag {
  position: absolute;
  top: 65px;
  right: 0;
  padding: 13px;
  background: #252a2e;
  border: 1px solid #41474b;
  border-radius: 9px;
  font-size: 10px;
  letter-spacing: 1px;
}

/* BENEFITS */
.benefits-section {
  padding-top: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #303438;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 15px;
}

.benefit > .v-icon {
  color: #ff7417;
  font-size: 28px;
}

.benefit strong,
.benefit span {
  display: block;
}

.benefit strong {
  font-size: 14px;
}

.benefit span {
  font-size: 11px;
  color: #858b90;
  margin-top: 4px;
}

/* SECTIONS */
.section-space {
  padding-top: 65px;
  padding-bottom: 45px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.section-heading h2,
.newsletter-card h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
  letter-spacing: -1px;
  margin-top: 8px;
}

.section-heading p,
.newsletter-card p {
  color: #92999d;
  font-size: 14px;
  margin-top: 7px;
}

/* CATEGORY */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 25px;
}

/* SEARCH */
.search-box :deep(.v-field) {
  background: #202427;
  border-color: #393e42;
}

.search-box :deep(input) {
  color: white;
}

/* PRODUCT */
.product-card {
  height: 100%;
  background: #202427 !important;
  color: white;
  border: 1px solid #353a3e;
  overflow: hidden;
  transition: .3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: #ff7417;
  box-shadow: 0 15px 35px #0007 !important;
}

.product-image {
  position: relative;
  background: #292e31;
}

.image-placeholder {
  height: 230px;
  display: grid;
  place-items: center;
  color: #727a7e;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ffffff;
}

.stock-chip {
  position: absolute;
  top: 12px;
  left: 12px;
}

.product-category {
  color: #ff7417;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.product-name {
  font-size: 17px;
  font-weight: 800;
  margin-top: 8px;
  min-height: 48px;
}

.product-description {
  color: #92999d;
  font-size: 12px;
  line-height: 1.7;
  min-height: 42px;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #ff7417;
  font-size: 19px;
}

.stock-text {
  font-size: 10px;
  color: #92999d;
}

.empty-state {
  padding: 65px 20px;
  text-align: center;
  background: #202427;
  border-radius: 15px;
  color: #92999d;
}

.empty-state h3 {
  color: white;
  margin: 15px 0;
}

/* PROMO */
.promo-section {
  position: relative;
  min-height: 310px;
  padding: clamp(30px, 5vw, 65px);
  border: 1px solid #42474b;
  border-radius: 18px;
  overflow: hidden;
  background:
    radial-gradient(circle at 90% 50%, #ff74172a, transparent 35%),
    linear-gradient(120deg, #24292c, #171a1c);
}

.promo-content {
  position: relative;
  z-index: 2;
}

.promo-content h2 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 950;
  line-height: 1.1;
  margin: 15px 0;
}

.promo-content p {
  max-width: 500px;
  color: #aeb4b8;
  line-height: 1.8;
  margin-bottom: 25px;
}

.promo-watermark {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(120px, 20vw, 250px);
  font-weight: 950;
  color: #ff741710;
  letter-spacing: -20px;
}

/* NEWSLETTER */
.newsletter-card {
  background: #202427 !important;
  border: 1px solid #393e42;
  color: white;
}

/* CART */
.cart-drawer {
  background: #17191c !important;
  color: white;
}

.cart-drawer :deep(.v-card) {
  background: #24292c;
  color: white;
  border-color: #41474b;
}

/* FOOTER */
.main-footer {
  background: #090b0d;
  border-top: 1px solid #303438;
  color: white;
}

.footer-description {
  color: #92999d;
  font-size: 13px;
  line-height: 1.8;
  max-width: 350px;
}

.main-footer h3 {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 20px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-links a,
.footer-links span {
  color: #92999d;
  text-decoration: none;
  font-size: 12px;
  transition: .2s;
}

.footer-links a:hover {
  color: #ff7417;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .hero-container {
    padding-top: 55px;
    padding-bottom: 40px;
  }

  .hero-title {
    letter-spacing: -2px;
  }

  .hero-visual {
    height: 300px;
  }

  .visual-tag {
    right: 0;
    top: 25px;
    font-size: 8px;
  }

  .hero-stats {
    gap: 20px;
    margin-top: 35px;
  }

  .section-space {
    padding-top: 45px;
    padding-bottom: 30px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .promo-watermark {
    opacity: .5;
  }
}
</style>
